# DD-005 - whatsapp-sub: connection refused na API WhatsApp

## Identificação

| Campo | Valor |
|---|---|
| ID | DD-005 |
| Exceção | System.Net.Http.HttpRequestException |
| Mensagem | Connection refused (ecomm-api-whatsapp-dotnet-service:80) |
| Inner | System.Net.Sockets.SocketException (111): Connection refused |
| Serviço (origem) | ecomm-topic-sub-whatsapp-dotnet |
| Serviço (destino) | ecomm-api-whatsapp-dotnet-service |
| Ambiente | prod |
| Versão | main-025a7d7 |
| Count | 299 |
| Impacto Datadog | 130 users, 4 views |
| First seen | ~2 meses atrás |
| Last seen | contínuo (visto há minutos) |
| Operação APM | http.request |
| Request falho | POST http://ecomm-api-whatsapp-dotnet-service/whatsapp/send-order-message |
| Gatilho Kafka | Consume topic order.approved |

## Classificação

| Dimensão | Valor |
|---|---|
| Tipo | Infra / serviço downstream indisponível |
| Canal | App mobile + operação - notificação WhatsApp pós-aprovação de pedido |
| App mobile | Impacto direto - cliente/farmácia pode não receber WhatsApp de pedido aprovado |
| Portal / BackOffice | Indireto |
| Confiança na causa | Alta |

## Sintoma

Após pagamento/aprovação do pedido, o consumer `ecomm-topic-sub-whatsapp-dotnet` consome `order.approved`, busca dados do pedido no Order API (200) e tenta enviar mensagem via WhatsApp API. A conexão TCP com `ecomm-api-whatsapp-dotnet-service:80` é recusada - nenhum processo escutando na porta ou serviço ausente.

## Investigação

Evidências Datadog (waterfall):
```
order.payment.status -> payment-status sub -> PATCH order/transaction-status (200)
order.approved -> ecomm-topic-sub-whatsapp-dotnet
  -> GET ecomm-api-order-dotnet-service/order/{id} (200)
  -> POST ecomm-api-whatsapp-dotnet-service/whatsapp/send-order-message (connection refused)
```

Restante do fluxo de pedido continua (event collection, pharmacy, store-sales) - só a notificação WhatsApp falha.

O que "Connection refused" significa no K8s:
- Deployment `ecomm-api-whatsapp-dotnet` com 0 réplicas ou removido
- Pods em CrashLoopBackOff / não ready
- Service existe mas selector não bate com labels dos pods
- App escuta em porta diferente da exposta pelo Service (80)
- (menos provável) NetworkPolicy bloqueando - costuma ser timeout, não refused imediato

Nota arquitetural: o Order API também publica WhatsApp via Kafka `ecomm.communication.v1` (ver context.md). Este fluxo usa `order.approved` -> API WhatsApp dedicada - são caminhos distintos; ambos precisam estar saudáveis se usados em paralelo.

Validar com DevOps (EKS prod):
```bash
kubectl get deploy,po,svc -n <namespace> | grep whatsapp
kubectl describe svc ecomm-api-whatsapp-dotnet-service
kubectl logs -l app=ecomm-api-whatsapp-dotnet --tail=100
kubectl get endpoints ecomm-api-whatsapp-dotnet-service
curl -v http://ecomm-api-whatsapp-dotnet-service/whatsapp/health
```

Validar no repo `ecomm-topic-sub-whatsapp-dotnet`:
- URL base configurada (`http://ecomm-api-whatsapp-dotnet-service/`)
- Retry/DLQ quando WhatsApp API indisponível
- Se mensagem Kafka é commitada mesmo com falha (risco de perda de notificação)

Validar no repo `ecomm-api-whatsapp-dotnet`:
- Deployment prod existe e está healthy
- Porta do container vs Service (targetPort)
- `/whatsapp/send-order-message` implementado e app sobe corretamente

## Impacto no cliente

| Nível | Avaliação |
|---|---|
| Funcional (pedido/pagamento) | Baixo - pedido é aprovado e persistido normalmente |
| Notificação WhatsApp | Alto - 130 users impactados; mensagem de pedido aprovado não enviada |
| Operacional | Médio - 299 erros em 2 meses; issue crônica |
| Negócio | Farmácia/cliente pode não ser avisado via WhatsApp sobre pedido aprovado |

## Correção proposta

### Opção A - Infra (fix principal)
1. Verificar status do deployment `ecomm-api-whatsapp-dotnet` em prod
2. Se ausente: redeploy a partir de `main-025a7d7` ou versão estável
3. Se CrashLoop: corrigir causa do crash (logs, secrets, deps)
4. Validar Service + Endpoints apontando para pods ready na porta correta
5. Confirmar health check passando

Aceite: `kubectl get endpoints` mostra IPs; POST send-order-message retorna 2xx; zero connection refused por 7 dias.

### Opção B - Resiliência no consumer (complementar)
1. Retry com backoff ao chamar WhatsApp API
2. Dead-letter topic para `order.approved` quando WhatsApp falhar após N tentativas
3. Alerta PagerDuty quando WhatsApp API unreachable > 5 min

Aceite: mensagens não perdidas silenciosamente; reprocessamento após recovery.

### Opção C - Arquitetura (avaliar)
1. Consolidar notificações WhatsApp em um único caminho (`ecomm.communication.v1` vs API direta)
2. Evitar dois pipelines paralelos para mesma função

## Priorização

| Campo | Valor |
|---|---|
| Prioridade | P0 - 130 users impactados; falha de comunicação com cliente |
| Esforço | S (redeploy/fix service) / M (resiliência + DLQ) |
| Owner | Plataforma/DevOps + squad Comunicação/WhatsApp |

## Checklist

- [ ] kubectl get deploy/po/svc/endpoints para whatsapp API em prod
- [ ] Verificar logs do pod whatsapp API
- [ ] Confirmar secrets/config (credenciais WhatsApp Business API)
- [ ] Restaurar serviço ou corrigir porta/selector
- [ ] Testar POST /whatsapp/send-order-message de dentro do cluster
- [ ] Validar consumer reprocessa ou DLQ pendências
- [ ] (Opcional) Retry + DLQ no ecomm-topic-sub-whatsapp-dotnet
- [ ] Resolver no Datadog e monitorar 7 dias

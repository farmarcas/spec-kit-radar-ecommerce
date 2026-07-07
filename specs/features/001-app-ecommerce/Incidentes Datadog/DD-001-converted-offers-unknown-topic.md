# DD-001 - converted.offers: Unknown topic or partition

## Identificação

| Campo | Valor |
|---|---|
| ID | DD-001 |
| Exceção | Confluent.Kafka.ConsumeException |
| Mensagem | Subscribed topic not available: converted.offers: Broker: Unknown topic or partition |
| Serviço | ecomm-sub-service-converted-offers-dotnet |
| Ambiente | prod |
| Versão | main-c8adf90 |
| Count | 1.30M |
| First seen | ~2 meses atrás |
| Last seen | contínuo (visto há minutos) |
| Stack trace | MessageHandler.cs:105 - kafka_consumer.MessageHandler |
| Operação APM | kafka.consume -> Consume Topic converted.offers |
| Consumer group | converted-offers |
| Tópico | converted.offers |

## Classificação

| Dimensão | Valor |
|---|---|
| Tipo | Infra / Kafka (+ gap de resiliência no código) |
| Canal | Worker assíncrono - sem impacto HTTP direto |
| App mobile | Indireto |
| Portal / BackOffice | Indireto (se pipeline de ofertas depender deste consumer) |
| Confiança na causa | Alta |

## Sintoma

O pod sobe em prod, entra no loop de `Consume()` e falha a cada tentativa com "Unknown topic or partition" no tópico `converted.offers`. Gera ~1.3M erros em 2 meses.

## Investigação

Evidências Datadog:
- `env:prod`, `operation_name:kafka.consume`
- `messaging.kafka.consumer_group` = converted-offers
- `messaging.kafka.offset` = Unset [-1001] - consumer nunca se posicionou no tópico
- Pod: `ecomm-sub-service-converted-offers-dotnet-f764df7c4-8hpqj` (EKS edelivery-prod)

Hipóteses (ordem de probabilidade):
1. Tópico `converted.offers` não existe no MSK de produção
2. Nome do tópico errado na config do serviço
3. Bootstrap apontando para cluster errado
4. Serviço obsoleto ainda deployado sem tópico provisionado

Validar com DevOps:
```bash
kafka-topics.sh --bootstrap-server <msk-prod> --list | grep converted.offers
kafka-topics.sh --bootstrap-server <msk-prod> --describe --topic converted.offers
kafka-consumer-groups.sh --bootstrap-server <msk-prod> --describe --group converted-offers
```

Validar no repo `ecomm-sub-service-converted-offers-dotnet`:
- MessageHandler.cs ~linha 105
- Env vars: bootstrap, topic name, consumer group
- Existe producer publicando em `converted.offers`?

## Impacto no cliente

| Nível | Avaliação |
|---|---|
| Direto (app/portal) | Baixo |
| Negócio (indireto) | Médio - pipeline de ofertas convertidas pode estar parado há ~2 meses |
| Operacional | Alto - polui Error Tracking (1.3M eventos) |

Confirmar com squad de Offers: o fluxo `converted.offers` ainda é necessário em prod?

## Correção proposta

### Opção A - Tópico deveria existir (DevOps)
1. Criar tópico `converted.offers` no MSK prod (partitions, replication, retention)
2. Garantir producer e ACLs do consumer group `converted-offers`
3. Reiniciar deployment; validar offsets avançando

Aceite: zero ocorrências por 7 dias; consumer group com lag estável.

### Opção B - Serviço obsoleto
1. Scale down / remover deployment em prod
2. Marcar repo como deprecated se aplicável

Aceite: pod não roda; issue some do Datadog.

### Opção C - Código (complementar)
1. Startup check com `IAdminClient` - fail-fast se tópico inexistente
2. Não spammar Error Tracking em loop; diferenciar erro fatal vs transitório

## Priorização

| Campo | Valor |
|---|---|
| Prioridade | P2 (P1 se pipeline de ofertas for crítico) |
| Esforço | S (criar tópico) / XS (desligar serviço) / M (código) |
| Owner | Plataforma/DevOps + squad Offers + squad sub-service |

## Checklist

- [ ] Confirmar se fluxo ainda é ativo
- [ ] Verificar tópico no MSK prod
- [ ] Verificar env vars do deployment
- [ ] Identificar producer
- [ ] Decidir: provisionar tópico ou descomissionar
- [ ] (Opcional) PR fail-fast no startup
- [ ] Resolver no Datadog e monitorar 7 dias

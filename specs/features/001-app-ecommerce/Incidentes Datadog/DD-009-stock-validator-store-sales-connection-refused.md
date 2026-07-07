# DD-009 - stock-file-validator: connection refused na API store-sales

## Identificação

| Campo | Valor |
|---|---|
| ID | DD-009 |
| Exceção | System.Net.Http.HttpRequestException |
| Mensagem | Connection refused (ecomm-api-store-sales-dotnet-service:80) |
| Inner | System.Net.Sockets.SocketException (111): Connection refused |
| Serviço (origem) | ecomm-bff-stock-file-validator-dotnet |
| Serviço (destino) | ecomm-api-store-sales-dotnet-service |
| Ambiente | prod |
| Versão | main-dbe862c_dbe862c |
| Count | 53 |
| Impacto Datadog | Sem impacto reportado em users |
| First seen | ~2 meses atrás |
| Last seen | ~1 hora atrás |
| Operação APM | http.request |
| Request falho | GET http://ecomm-api-store-sales-dotnet-service/products-sales/v1/store/order-building/orders/by-cnpj/{cnpj} |
| Exemplo | .../by-cnpj/19300772000258 |
| Endpoint exposto | GET /marketing/v1/stock/orders/orders/by-cnpj/{cnpj} -> 400 |
| Error handling | handled |
| Repo | github.com/farmarcas/ecomm-bff-stock-file-validator-dotnet |

## Classificação

| Dimensão | Valor |
|---|---|
| Tipo | Infra transitória - store-sales indisponível no momento da chamada |
| Canal | Portal farmácia / backoffice - validação de estoque / pedidos por CNPJ |
| App mobile | Não |
| Portal / BackOffice | Impacto direto quando ocorre - endpoint retorna 400 |
| Confiança na causa | Alta (neste sample: store-sales) |

## Sintoma

O BFF de validação de arquivo de estoque recebe request do portal para listar pedidos por CNPJ. Antes de responder, consulta a API store-sales para obter pedidos em construção (order-building). A conexão com `ecomm-api-store-sales-dotnet-service:80` é recusada e o BFF retorna 400 ao portal.

## Investigação

Evidências Datadog:
- Waterfall: GET /marketing/v1/stock/orders/orders/by-cnpj/{cnpj} -> 400
- Span interno: GET store-sales .../orders/by-cnpj/19300772000258 -> connection refused
- `error.handling` = handled - exceção tratada no BFF, mas span HTTP ainda marcado como error
- Issue agrupada como Connection refused (*) - outros samples do mesmo BFF podem apontar para deps diferentes (ex.: `ecomm-api-consumer-managment-dotnet-service` citado na lista original)

Contexto de negócio:
- Fluxo de portal farmácia - consulta pedidos por CNPJ durante validação/upload de estoque
- store-sales gerencia pedidos em construção (order-building) - usado em outros fluxos do ecossistema (ex.: traces do orchestrator/order mostram store-sales respondendo 200/201 em cenários normais)

Hipóteses (ordem de probabilidade):
1. Rolling deploy / restart de `ecomm-api-store-sales-dotnet` - janela sem endpoints
2. Pods store-sales em CrashLoop ou 0 réplicas momentâneo
3. BFF sem retry - falha transitória vira 400 imediato no portal
4. (menos provável) serviço cronicamente down - volume baixo (53 em 2 meses ~ <1/dia)

Validar com DevOps:
```bash
kubectl get deploy,po,svc,endpoints | grep store-sales
kubectl describe deploy ecomm-api-store-sales-dotnet
kubectl rollout history deploy/ecomm-api-store-sales-dotnet
# Correlacionar timestamp Jul 02 09:34:51 com eventos de restart
```

Validar no repo `ecomm-bff-stock-file-validator-dotnet`:
- Client HTTP que chama `orders/by-cnpj/{cnpj}`
- Tratamento de HttpRequestException - por que retorna 400 vs 503
- Config URL base do store-sales
- Outros deps com connection refused no mesmo issue group (consumer-managment, etc.)

## Impacto no cliente

| Nível | Avaliação |
|---|---|
| App mobile | Nenhum |
| Portal farmácia | Médio quando ocorre - consulta pedidos por CNPJ falha (400) |
| Upload/validação estoque | Médio - pode bloquear fluxo que depende de pedidos abertos |
| Frequência | Baixa - 53 em ~2 meses |

## Correção proposta

### Opção A - Infra (fix principal)
1. Verificar saúde e restarts do deployment `ecomm-api-store-sales-dotnet`
2. PDB + rolling update (`maxUnavailable: 0`) para evitar janela sem endpoints
3. Correlacionar erros com deploys

Aceite: store-sales estável; connection refused -> zero por 7 dias.

### Opção B - Código no stock-file-validator (resiliência)
1. Retry com backoff (2-3 tentativas) em connection refused
2. Retornar 503 Service Unavailable ao portal em falha de infra (não 400 - 400 sugere erro do cliente)
3. Mensagem clara no portal: "Serviço temporariamente indisponível, tente novamente"

Aceite: restarts transitórios não geram 400; portal exibe erro recuperável.

### Opção C - Observabilidade
1. Diferenciar 400 (validação) vs 503 (dep down) nos logs e métricas
2. Alerta infra quando store-sales endpoints vazios > 1 min

## Priorização

| Campo | Valor |
|---|---|
| Prioridade | P2 - portal/backoffice, baixa frequência, sem users reportados no Datadog |
| Esforço | S (infra) / S (retry + status code) |
| Owner | Squad portal/estoque + Plataforma (store-sales API) |

## Checklist

- [ ] Status deployment ecomm-api-store-sales-dotnet em prod
- [ ] Correlacionar erros com restarts/deploys
- [ ] Localizar client HTTP no ecomm-bff-stock-file-validator-dotnet
- [ ] Implementar retry + 503 em falha de infra
- [ ] Revisar outros hosts no issue group Connection refused (*) do mesmo BFF
- [ ] Resolver no Datadog e monitorar 7 dias

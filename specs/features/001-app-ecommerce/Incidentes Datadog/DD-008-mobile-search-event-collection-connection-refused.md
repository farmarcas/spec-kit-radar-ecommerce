# DD-008 - mobile-search: connection refused na API de eventos

## Identificação

| Campo | Valor |
|---|---|
| ID | DD-008 |
| Exceção | System.Net.Http.HttpRequestException |
| Mensagem | Connection refused (ecomm-api-event-collection-dotnet-service:80) |
| Inner | System.Net.Sockets.SocketException (111): Connection refused |
| Serviço (origem) | ecomm-bff-mobile-search-dotnet |
| Serviço (destino) | ecomm-api-event-collection-dotnet-service |
| Ambiente | prod |
| Versão | main-f0112f5f3df9-23-1_f0112f5 |
| Count | 106 |
| Impacto Datadog | 13 users, 1 view |
| First seen | ~2 meses atrás |
| Last seen | ~8 horas atrás |
| Operação APM | http.request |
| Request falho | POST http://ecomm-api-event-collection-dotnet-service/store/v1/event-collection/category |
| Repo | github.com/farmarcas/ecomm-bff-mobile-search-dotnet |

## Classificação

| Dimensão | Valor |
|---|---|
| Tipo | Infra transitória / serviço event-collection indisponível + telemetria sem isolamento de erro |
| Canal | App mobile - analytics de busca/categoria |
| App mobile | Impacto funcional baixo - busca provavelmente continua; eventos de analytics perdidos |
| Portal / BackOffice | Não |
| Confiança na causa | Alta |

## Sintoma

Após busca por categoria no app, o search BFF tenta enviar evento analítico via `SendEventCategoryAsync`. A API `ecomm-api-event-collection-dotnet-service` recusa conexão na porta 80. O span HTTP é marcado como erro no Datadog, embora o fluxo principal de busca possa seguir.

## Investigação

Evidências Datadog:
- POST .../store/v1/event-collection/category -> connection refused
- Serviço destino: ecomm-api-event-collection-dotnet
- Issue agrupada como Connection refused (*) no search BFF - neste sample o host é event-collection, não outro serviço

Código no search BFF (repo local):

Chamada HTTP:
```csharp
public async Task<bool> SendEventCategoryAsync(EventCategoryDataRequest request)
{
    // ...
    string uri = string.Concat(URL_EVENT_API_BASE, "/store/v1/event-collection/category");
    // ...
    var responseMessage = await _apiClient.PostAsync(uri, jsonContent);
```

Config prod:
```json
"Url": "http://ecomm-api-event-collection-dotnet-service"
```

Env no deploy: `URL_EVENT_API_BASE` -> `${URL_EVENT_API_BASE}` em `bff-search-mobile.tpl.yaml`

Tratamento no caller - exceção é capturada, busca não deveria quebrar:
```csharp
await _eventApiClient.SendEventCategoryAsync(eventRequest);
}
catch (Exception ex)
{
    _logger.LogWarning(ex, "[EventService][SendEventCategoryAsync] Error processing request, error: {message}", ex.Message);
}
```

Mesmo endpoints afetados: `/search`, `/emptysearch`, `/category`, `/subcategory`.

Nota: existe branch remota `feature/ajuste-erro-event-collection` no repo - sugere que o time já identificou problema similar.

Hipóteses:
1. `ecomm-api-event-collection-dotnet` com pods down, restart ou 0 réplicas em prod
2. Janela transitória em rolling deploy (106 em 2 meses ~ 1-2/dia)
3. Span HTTP marcado como error no Datadog antes do catch no EventService - polui Error Tracking sem impacto funcional

Validar com DevOps:
```bash
kubectl get deploy,po,svc,endpoints | grep event-collection
kubectl logs -l app=ecomm-api-event-collection-dotnet --tail=50
curl -v http://ecomm-api-event-collection-dotnet-service/health
```

## Impacto no cliente

| Nível | Avaliação |
|---|---|
| Busca / categoria no app | Baixo - EventService faz catch e log warning |
| Analytics / BI | Médio - eventos de categoria/busca não registrados (13 users) |
| Observabilidade | Médio - 106 erros; mistura infra real com ruído de telemetria |

Relacionado: DD-006 - outro issue no mesmo BFF que quebra busca (500). São problemas distintos.

## Correção proposta

### Opção A - Infra (fix principal)
1. Verificar saúde do deployment `ecomm-api-event-collection-dotnet` em prod
2. Garantir réplicas ready, endpoints populados, readiness probe OK
3. Revisar restarts/deploys correlacionados com timestamps dos erros

Aceite: API responde 200; connection refused -> zero por 7 dias.

### Opção B - Código no search BFF (resiliência + observabilidade)
1. Retry curto (1-2x) em EventApiClient para connection refused
2. Fire-and-forget explícito - não propagar exceção ao span HTTP (ou usar handler que não marca error em falha de telemetria)
3. Métrica `event_collection.send.failed` em vez de Error Tracking
4. Mesclar/completar branch `feature/ajuste-erro-event-collection` se existir PR

Aceite: falhas de telemetria não aparecem como P0 no Error Tracking; busca intacta.

### Opção C - Observabilidade Datadog
1. Reclassificar ou filtrar errors em EventApiClient quando EventService já trata
2. Alertar indisponibilidade do event-collection via métrica de infra, não via app errors

## Priorização

| Campo | Valor |
|---|---|
| Prioridade | P2 - analytics, não fluxo transacional; 13 users |
| Esforço | S (infra) / S (ajuste tratamento de erro no client) |
| Owner | Squad search/mobile + Plataforma (event-collection API) |

## Checklist

- [ ] Status do deployment ecomm-api-event-collection-dotnet em prod
- [ ] Correlacionar erros com restarts/deploys
- [ ] Verificar branch/PR feature/ajuste-erro-event-collection
- [ ] Implementar retry + métrica em EventApiClient
- [ ] Evitar span error para falhas de telemetria já tratadas
- [ ] Resolver no Datadog e monitorar 7 dias

# DD-010 - mobile-emphasis: connection refused na API catálogo

## Identificação

| Campo | Valor |
|---|---|
| ID | DD-010 |
| Exceção | System.Net.Http.HttpRequestException |
| Mensagem | Connection refused (ecomm-api-catalogue-dotnet-service:80) |
| Inner | System.Net.Sockets.SocketException (111): Connection refused |
| Serviço (origem) | ecomm-bff-mobile-emphasis-dotnet |
| Serviço (destino) | ecomm-api-catalogue-dotnet-service |
| Ambiente | prod |
| Versão | main-fa3240a_fa3240a |
| Count | 45 |
| Impacto Datadog | 13 users, 1 view |
| First seen | ~2 meses atrás |
| Last seen | ~17 horas atrás |
| Operação APM | http.request |
| Request falho | GET http://ecomm-api-catalogue-dotnet-service/marketing/v1/catalogue/products/byproductids |
| Endpoint exposto | GET /merchandising/v1/mobile-emphasis/products/showcase-products -> 204 |
| Error handling | handled |
| Repo | github.com/farmarcas/ecomm-bff-mobile-emphasis-dotnet |

## Classificação

| Dimensão | Valor |
|---|---|
| Tipo | Infra transitória - catalogue API indisponível no momento da chamada |
| Canal | App mobile - vitrine/destaques (showcase "Queridinhos") |
| App mobile | Impacto parcial - vitrine pode vir incompleta/vazia; endpoint retorna 204 |
| Portal / BackOffice | Não |
| Confiança na causa | Alta |

## Sintoma

Ao carregar `showcase-products`, o emphasis BFF busca produtos mais vendidos (Order API), estoque (200) e detalhes do catálogo em lote via `byproductids`. A API `ecomm-api-catalogue-dotnet-service` recusa conexão. O app recebe 204 (não 500), mas a vitrine pode ficar sem produtos ou degradada.

## Investigação

Evidências Datadog (waterfall):
```
GET showcase-products -> 204
  -> Pharmacy/device 200
  -> Customer 200
  -> Stock/ByProductIds 200
  -> Catalogue/byproductids connection refused
```

Código no emphasis BFF (repo local):

HttpClient configurado corretamente com BaseAddress - não é bug de URL/file scheme (diferente do DD-006):
```csharp
services.AddHttpClient<ICatalogoApiClient, CatalogoApiClient>(c =>
{
    c.BaseAddress = new Uri(configuration["Catalog:Url"]);
    c.Timeout = TimeSpan.FromSeconds(configuration.GetValue<int>("Catalog:TimeoutSeconds"));
});
```

Config prod:
```json
"Url": "http://ecomm-api-catalogue-dotnet-service/",
```

Chamada byproductids (path relativo - correto com BaseAddress):
```csharp
var uri = "/marketing/v1/catalogue/products/byproductids";
// ...
var response = await _apiClient.SendAsync(request);
```

Fluxo showcase - catálogo + estoque em paralelo:
```csharp
var catalogTask = _catalogoApiClient.GetProductsAsync(idsInRankingOrder);
var stockTask = _estoqueApiClient.GetStockFromStoreAndProductAsync(device.Id, idsInRankingOrder);
await Task.WhenAll(catalogTask, stockTask);
```

Erro por categoria é capturado no service:
```csharp
try
{
    var showcaseProducts = await GetShowcaseProductsByCategory(...);
    response.Add(showcaseProducts);
}
catch (Exception ex)
{
    _logger.LogError(ex, "[ShowcaseService][GetShowcaseProducts] - Failed to load category: {category}", category);
}
```

Hipóteses:
1. Rolling deploy / restart de `ecomm-api-catalogue-dotnet` - janela sem endpoints (45 em 2 meses ~ <1/dia)
2. Pods catalogue em CrashLoop momentâneo
3. Falta de retry - falha transitória derruba enriquecimento da vitrine
4. Issue agrupada como Connection refused (*) - outros samples podem ser deps diferentes

Validar com DevOps:
```bash
kubectl get deploy,po,svc,endpoints | grep catalogue
kubectl rollout history deploy/ecomm-api-catalogue-dotnet
# Correlacionar Jul 01 20:44:54 com restart/deploy
```

## Impacto no cliente

| Nível | Avaliação |
|---|---|
| Vitrine/destaques no app | Médio - seção "Queridinhos" pode aparecer vazia (204) |
| Outras áreas do app | Baixo neste trace - stock respondeu OK |
| Users | 13 users no Datadog |
| Frequência | Baixa - 45 em ~2 meses |

## Correção proposta

### Opção A - Infra (fix principal)
1. Revisar restarts/deploys de `ecomm-api-catalogue-dotnet`
2. PDB + `maxUnavailable: 0` no rolling update
3. Garantir readiness probe antes de receber tráfego

Aceite: connection refused -> zero por 7 dias.

### Opção B - Código no emphasis BFF (resiliência)
1. Retry com backoff (2-3x) em CatalogoApiClient para connection refused
2. Em falha persistente: retornar vitrine parcial (só estoque) ou mensagem de degradação - evitar 204 silencioso
3. Cache de produtos do catálogo para vitrine (TTL curto) - tolerar restart transitório

Aceite: restarts transitórios não esvaziam vitrine; usuário vê produtos ou feedback claro.

### Opção C - Observabilidade
1. Métrica `showcase.catalogue.unavailable` separada do Error Tracking
2. Alerta infra quando catalogue endpoints vazios > 1 min

## Priorização

| Campo | Valor |
|---|---|
| Prioridade | P1 - 13 users, vitrine degradada no app |
| Esforço | S (infra) / S (retry + cache) |
| Owner | Squad mobile emphasis + Plataforma (catalogue API) |

## Checklist

- [ ] Status deployment ecomm-api-catalogue-dotnet em prod
- [ ] Correlacionar erros com restarts/deploys
- [ ] Implementar retry em CatalogoApiClient
- [ ] Avaliar cache curto para produtos da vitrine
- [ ] Melhorar UX quando catálogo indisponível (não 204 silencioso)
- [ ] Resolver no Datadog e monitorar 7 dias

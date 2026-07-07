# DD-006 - mobile-search: file scheme ao chamar catálogo

## Identificação

| Campo | Valor |
|---|---|
| ID | DD-006 |
| Exceção | System.NotSupportedException |
| Mensagem | The 'file' scheme is not supported. |
| Serviço | ecomm-bff-mobile-search-dotnet |
| Ambiente | prod |
| Versão | main-5f7089fd52d6-20-1_5f7089f |
| Count | 231 |
| Impacto Datadog | 14 users, 1 view |
| First seen | ~1 dia atrás (issue nova - possível regressão de deploy) |
| Last seen | ~1 dia atrás |
| Operação APM | http.request |
| URL gerada (erro) | file:///marketing/v1/catalogue/products/get-by-description |
| Endpoint exposto | GET /mobile/marketing/v1/products/search/bydeviceid -> 500 |
| Repo | github.com/farmarcas/ecomm-bff-mobile-search-dotnet |

## Classificação

| Dimensão | Valor |
|---|---|
| Tipo | Bug de código + config (env var ausente) |
| Canal | App mobile - busca de produtos |
| App mobile | Impacto direto - busca retorna 500 |
| Portal / BackOffice | Não |
| Confiança na causa | Muito alta - URL file:// explícita no span |

## Sintoma

Na busca por device (SearchByDeviceId), o BFF chama `GetProductsByDescriptionAsync` no catálogo. A URL montada vira `file:///marketing/v1/catalogue/products/get-by-description` em vez de `https://...`. O HttpClient rejeita o scheme `file://` e o endpoint retorna 500 ao app.

## Investigação

Evidências Datadog:
- `http.url` = file:///marketing/v1/catalogue/products/get-by-description
- `http.url_details.scheme` = file
- `peer.hostname` = marketing (fragmento do path interpretado como host)
- Waterfall: pharmacy device OK (200) -> Redis OK -> catálogo falha -> endpoint search 500

Causa raiz:

`URL_APIGATEWAY_BASE` está vazio ou ausente no pod prod. O código concatena base + path e usa `new Uri(uri)`:
```csharp
var uri = URL_APIGATEWAY_BASE + "/marketing/v1/catalogue/products/get-by-description";
// ...
var request = new HttpRequestMessage
{
    Method = HttpMethod.Get,
    RequestUri = new Uri(uri),
```

No .NET em Linux, `new Uri("/marketing/...")` (path absoluto sem host) é interpretado como `file:///marketing/...` - comportamento documentado da BCL.

Mesmo padrão em outros clients (todos leem `URL_APIGATEWAY_BASE`):
- CatalogoApiClient.cs - 4 endpoints
- EstoqueApiClient.cs, PrecoApiClient.cs, OrchestratorPrecoApiClient.cs

Deploy esperado:
```yaml
- name: URL_APIGATEWAY_BASE
  value: ${URL_APIGATEWAY_BASE}
```

Local funciona porque `launchSettings.json` define a var:
```json
"URL_APIGATEWAY_BASE": "https://api-stage-edelivery.febrafar.com.br",
```

Hipótese de regressão: versão `main-5f7089fd52d6` deployada há ~1 dia; pipeline pode não ter substituído `${URL_APIGATEWAY_BASE}` ou secret foi removido.

Validar em prod:
```bash
kubectl exec -it <pod-search> -- env | grep URL_APIGATEWAY_BASE
# Esperado: https://api-edelivery.febrafar.com.br (ou URL interna correta)
# Atual provável: vazio
```

## Impacto no cliente

| Nível | Avaliação |
|---|---|
| Busca no app | Alto - 500 em /search/bydeviceid; 14 users impactados |
| Autocomplete / listagens | Alto - qualquer fluxo que chame catálogo com base URL vazia falha |
| Operacional | 231 erros em 1 dia; issue concentrada na versão recente |

## Correção proposta

### Opção A - Config / deploy (fix imediato)
1. Verificar valor de `URL_APIGATEWAY_BASE` no deployment prod do search BFF
2. Corrigir variável no pipeline/secrets (ex.: `https://api-edelivery.febrafar.com.br` ou URL interna do API Gateway)
3. Redeploy e validar env dentro do pod

Aceite: env preenchida; busca retorna 200; zero file scheme por 7 dias.

### Opção B - Código (fix estrutural - recomendado junto com A)
1. Startup validation - falhar readiness se `URL_APIGATEWAY_BASE` nulo/vazio:
```csharp
if (string.IsNullOrWhiteSpace(URL_APIGATEWAY_BASE))
    throw new InvalidOperationException("URL_APIGATEWAY_BASE is not configured");
```
2. Montar URLs com `new Uri(baseUri, relativePath)` ou configurar `HttpClient.BaseAddress` + paths relativos - nunca `new Uri("/path")` isolado
3. Aplicar em todos os ApiClients que usam `URL_APIGATEWAY_BASE`

Aceite: pod não fica ready sem config; impossível gerar `file://` URL.

### Opção C - CI/CD
1. Adicionar check no pipeline que falha deploy se `URL_APIGATEWAY_BASE` não substituída no manifest

## Priorização

| Campo | Valor |
|---|---|
| Prioridade | P0 - busca quebrada no app; regressão recente |
| Esforço | XS (config) / S (validação startup + Uri fix) |
| Owner | Squad mobile search + Plataforma (pipeline) |

## Checklist

- [ ] kubectl exec -> confirmar URL_APIGATEWAY_BASE vazia no pod
- [ ] Corrigir secret/pipeline ${URL_APIGATEWAY_BASE}
- [ ] Redeploy search BFF
- [ ] Testar GET /mobile/marketing/v1/products/search/bydeviceid
- [ ] PR: validação startup + fix construção de Uri
- [ ] Resolver no Datadog e monitorar 7 dias

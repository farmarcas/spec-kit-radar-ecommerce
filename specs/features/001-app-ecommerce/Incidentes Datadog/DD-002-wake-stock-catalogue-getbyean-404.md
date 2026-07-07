# DD-002 - wake-stock: 404 ao buscar produto por EAN no catálogo

## Identificação

| Campo | Valor |
|---|---|
| ID | DD-002 |
| Exceção | System.Net.WebException |
| Mensagem | The remote server returned an error: (404) Not Found. |
| Serviço | ecomm-sub-service-wake-stock-dotnet |
| Ambiente | prod |
| Versão | main-b89bd5990616 (95%), main-757af2b90272 |
| Count | 11.7k |
| First seen | ~2 meses atrás |
| Last seen | contínuo (visto há minutos) |
| Stack trace | System.Net.HttpWebRequest.GetResponse() -> WebClient.DownloadBits |
| Operação APM | http.request |
| Request | GET http://ecomm-api-catalogue-dotnet-service/marketing/v1/catalogue/products/getbyean/{ean} |
| Exemplo | .../getbyean/7896108022036 -> HTTP 404 |
| Gatilho | Consume Kafka topic stock.updated.json |
| Serviço correlato | ecomm-sub-service-wake-princing-dotnet - mesmo endpoint, mesmo 404 no trace |

## Classificação

| Dimensão | Valor |
|---|---|
| Tipo | Integração / dado ausente + tratamento inadequado de HTTP 404 no consumer |
| Canal | Worker assíncrono (integração Wake -> estoque) |
| App mobile | Indireto - estoque/preço pode não refletir produtos Wake se pipeline falha |
| Portal / BackOffice | Indireto |
| Confiança na causa | Alta |

## Sintoma

A cada mensagem consumida de `stock.updated.json`, o worker chama o catálogo para resolver produto por EAN. Quando o EAN não existe no catálogo mestre, a API retorna 404 (comportamento correto da API). O sub-service usa `WebClient`/`HttpWebRequest`, que lança exceção em 404 - registrando ~11.7k erros no Datadog.

## Investigação

Evidências Datadog:
- Waterfall: Consume Topic `stock.updated.json` -> GET .../getbyean/{ean} -> 404
- `peer.service` = ecomm-api-catalogue-dotnet
- `http.status_code` = 404
- Mesmo padrão aparece em `ecomm-sub-service-wake-princing-dotnet` no mesmo trace

Endpoint no catálogo (repo local confirmado):
```csharp
[HttpGet("getbyean/{product_ean}")]
public IActionResult GetByEan(string product_ean)
{
    try
    {
        var product = _appProduct.FiltrarPorEan(product_ean);

        if (product == null)
            return new NotFoundResult();

        return new OkObjectResult(_mapper.Map<ProductDto>(product));
```

A rota existe e está correta. 404 = produto não cadastrado no catálogo, não endpoint quebrado.

Hipóteses (ordem de probabilidade):
1. EANs vindos do Wake/ERP não existem no catálogo MongoDB - 404 esperado
2. Consumer trata 404 como falha fatal em vez de fluxo alternativo (skip, dead-letter, enriquecimento)
3. Uso de WebClient/HttpWebRequest (legado) - qualquer 4xx vira exceção no Error Tracking
4. (menos provável) EAN malformado/vazio em alguns eventos (path_group mostra `getbyean/?` em alguns spans)

Validar no repo `ecomm-sub-service-wake-stock-dotnet`:
- Onde monta a URL `getbyean/{ean}` após consumir `stock.updated.json`
- Se 404 deveria: ignorar, criar solicitação de produto, ou enfileirar para enriquecimento
- Se `ecomm-sub-service-wake-princing-dotnet` compartilha lib/código - corrigir nos dois

Validar com negócio/dados:
- Amostrar EANs que geram 404 (ex.: 7896108022036) - existem no ERP Wake mas não no catálogo?
- Volume: % de mensagens `stock.updated.json` que resultam em 404

## Impacto no cliente

| Nível | Avaliação |
|---|---|
| Direto (app/portal) | Baixo - não é request de usuário |
| Negócio (indireto) | Médio - produtos Wake sem match no catálogo podem não ter estoque/preço atualizados no e-commerce |
| Operacional | Alto - 11.7k erros; muitos podem ser 404 legítimos classificados como falha |

## Correção proposta

### Opção A - Código no wake-stock/pricing (fix principal)
1. Substituir WebClient por HttpClient e tratar 404 explicitamente:
   - Log Warning com EAN
   - Ack da mensagem Kafka (ou dead-letter conforme regra de negócio)
   - Não propagar como exceção para Error Tracking
2. Métrica dedicada: `wake.catalogue.ean_not_found` (contador por EAN ou agregado)
3. Replicar fix em `ecomm-sub-service-wake-princing-dotnet`

Aceite: 404 deixa de aparecer como error no Datadog; métrica de EAN ausente monitorável.

### Opção B - Dados / catálogo (complementar)
1. Identificar EANs recorrentes no 404
2. Cadastrar produtos faltantes no catálogo ou fluxo de solicitação automática
3. Alinhar com squad de Catalogue integração Wake

Aceite: redução sustentada da métrica `ean_not_found`.

### Opção C - Observabilidade
1. Reclassificar 404 esperado - não enviar ao Error Tracking
2. Alertar só se taxa de 404 subir abruptamente ou se 5xx/timeouts aumentarem

## Priorização

| Campo | Valor |
|---|---|
| Prioridade | P2 |
| Esforço | M (código wake-stock + wake-pricing) / L (enriquecimento em massa de catálogo) |
| Owner | Squad integração Wake + squad Catalogue |

## Checklist

- [ ] Localizar chamada HTTP no ecomm-sub-service-wake-stock-dotnet
- [ ] Confirmar regra de negócio para EAN inexistente (skip vs DLQ vs criar produto)
- [ ] Implementar tratamento de 404 sem exceção
- [ ] Aplicar mesmo fix em ecomm-sub-service-wake-princing-dotnet
- [ ] Amostrar EANs com 404 e validar gap de catálogo
- [ ] Adicionar métrica ean_not_found
- [ ] Resolver no Datadog e monitorar 7 dias

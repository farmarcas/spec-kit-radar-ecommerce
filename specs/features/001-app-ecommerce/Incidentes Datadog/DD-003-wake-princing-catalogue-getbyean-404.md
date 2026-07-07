# DD-003 - wake-pricing: 404 ao buscar produto por EAN no catálogo

## Identificação

| Campo | Valor |
|---|---|
| ID | DD-003 |
| Exceção | System.Net.WebException |
| Mensagem | The remote server returned an error: (404) Not Found. |
| Serviço | ecomm-sub-service-wake-princing-dotnet |
| Ambiente | prod |
| Versão | main-757af2b90272 |
| Count | 11.7k |
| First seen | ~2 meses atrás |
| Last seen | contínuo (visto há minutos) |
| Stack trace | System.Net.HttpWebRequest.GetResponse() -> WebClient.DownloadBits |
| Operação APM | http.request |
| Request | GET http://ecomm-api-catalogue-dotnet-service/marketing/v1/catalogue/products/getbyean/{ean} |
| Exemplo | .../getbyean/7896108022036 -> HTTP 404 |
| Gatilho | Consume Kafka topic stock.updated.json |
| Issue relacionada | DD-002 - mesmo trace, mesmo EAN, serviço irmão |

## Classificação

| Dimensão | Valor |
|---|---|
| Tipo | Integração / dado ausente + tratamento inadequado de HTTP 404 no consumer |
| Canal | Worker assíncrono (integração Wake -> preço) |
| App mobile | Indireto - preço pode não refletir produtos Wake sem match no catálogo |
| Portal / BackOffice | Indireto |
| Confiança na causa | Alta |

## Sintoma

Mesmo evento Kafka (`stock.updated.json`) dispara dois consumers em paralelo: `wake-stock` e `wake-pricing`. Ambos consultam o catálogo por EAN. Quando o produto não existe no catálogo mestre, a API retorna 404 e o wake-pricing lança `WebException` via `WebClient` - gerando ~11.7k erros espelhados ao DD-002.

## Investigação

Evidências Datadog:
- Waterfall compartilhado com `ecomm-sub-service-wake-stock-dotnet` no mesmo timestamp
- GET .../getbyean/7896108022036 -> 404
- `peer.service` = ecomm-api-catalogue-dotnet

Endpoint no catálogo: rota válida; 404 = EAN não cadastrado (ver DD-002 para referência de código em `ProductController.GetByEan`).

Hipóteses:
1. EAN do Wake não existe no catálogo - 404 esperado
2. wake-pricing não trata 404 como fluxo alternativo
3. WebClient legado converte 404 em exceção no Error Tracking
4. Possível código compartilhado com wake-stock - fix deve ser aplicado nos dois repos (ou lib comum)

Validar no repo `ecomm-sub-service-wake-princing-dotnet`:
- Handler após consume de `stock.updated.json`
- Regra de negócio quando produto não existe no catálogo (skip preço? DLQ?)
- Se compartilha lib HTTP com wake-stock

## Impacto no cliente

| Nível | Avaliação |
|---|---|
| Direto (app/portal) | Baixo |
| Negócio (indireto) | Médio - preços de produtos Wake sem match no catálogo podem não ser propagados |
| Operacional | Alto - 11.7k erros duplicados junto com wake-stock (mesma causa, dois serviços) |

## Correção proposta

### Opção A - Código no wake-pricing (fix principal)
1. Tratar HTTP 404 explicitamente (HttpClient + check de status)
2. Log Warning com EAN; não propagar exceção ao Datadog
3. Métrica `wake.catalogue.ean_not_found` (pricing)
4. Aplicar em conjunto com DD-002 - idealmente extrair handler HTTP compartilhado entre wake-stock e wake-pricing

Aceite: 404 deixa de aparecer como error; consumer continua processando demais mensagens.

### Opção B - Dados / catálogo (complementar)
1. Mapear EANs recorrentes (ex.: 7896108022036)
2. Cadastrar produtos faltantes ou fluxo automático de enriquecimento

Aceite: queda sustentada da métrica `ean_not_found` em ambos os serviços.

### Opção C - Observabilidade
1. Não classificar 404 esperado como error no Error Tracking
2. Alertar em spike de 404 ou falhas 5xx/timeout

## Priorização

| Campo | Valor |
|---|---|
| Prioridade | P2 |
| Esforço | M (fix isolado) / S se corrigido junto com DD-002 em lib compartilhada |
| Owner | Squad integração Wake + squad Catalogue |

## Checklist

- [ ] Localizar chamada HTTP no ecomm-sub-service-wake-princing-dotnet
- [ ] Alinhar fix com DD-002 (mesmo PR ou lib compartilhada)
- [ ] Confirmar regra de negócio para EAN inexistente
- [ ] Implementar tratamento de 404 sem exceção
- [ ] Amostrar EANs com 404 e validar gap de catálogo
- [ ] Adicionar métrica ean_not_found
- [ ] Resolver no Datadog e monitorar 7 dias

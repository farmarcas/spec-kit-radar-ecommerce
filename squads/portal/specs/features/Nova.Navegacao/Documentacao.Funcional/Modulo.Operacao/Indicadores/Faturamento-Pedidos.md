# Indicadores — Faturamento, Pedidos Cancelados, Pedidos Concluídos e Cancelamentos (Home de Vendas)

**Módulo:** Operação
**Histórias:** [ECP-1546](https://farmarcas.atlassian.net/browse/ECP-1546) (Faturamento), [ECP-1547](https://farmarcas.atlassian.net/browse/ECP-1547) (Pedidos Cancelados — gráfico da aba e total do período), [ECP-1548](https://farmarcas.atlassian.net/browse/ECP-1548) (Pedidos Concluídos) — 3 Histórias separadas, 1 doc funcional, por serem o mesmo conjunto de entrega funcional (3 abas do mesmo gráfico da Home); [ECP-1605](https://farmarcas.atlassian.net/browse/ECP-1605) (Cancelamentos — container da Home com GMV perdido, pedidos cancelados N/M e ticket médio, mesma regra de pedido cancelado)
**Referência:** `Manual-Portal-Radar-Ecommerce.md`, seção 5 (tabela de indicadores da Home de Vendas); **Figma:** a ser atualizado pela UX ainda nesta semana (layout, rótulos e textos finais pendentes)
**Relacionado:** [Home-Vendas-Visao-Geral.md](Home-Vendas-Visao-Geral.md) (estrutura, escopo por perfil, período, âncoras de data e cache), [Filtro-GE-e-Macro-abas.md](Filtro-GE-e-Macro-abas.md), [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md)
**Status:** Em refinamento (cards em "Pronto para refinamento" no Jira)
**Última atualização:** 2026-10-07 (GMV perdido do container Cancelamentos passa a ser a soma das linhas de produto, sem frete, sem custo de pagamento nem cupom)

---

## 1. O que é

Três abas do gráfico de linha da Home de Vendas — **"Faturamento"**, **"Pedidos cancelados"** e **"Pedidos concluídos"** —, cada uma mostrando a evolução do indicador no período selecionado. Cada aba exibe, no próprio cartão da aba (valor ao lado do rótulo), o **total do período**: em R$ no Faturamento e em contagem de pedidos nas outras duas. É reconstrução 1:1 em React, reaproveitando a lógica de backend já validada em produção, com os pontos de correção da seção 5. A entrega de cada História cobre front-end e back-end.

O container **"Cancelamentos"** da Home ([ECP-1605](https://farmarcas.atlassian.net/browse/ECP-1605), reconstrução do card legado ECP-1266) é um elemento à parte do gráfico: resume GMV perdido, pedidos cancelados sobre o total de finalizados (barra e percentual) e ticket médio dos cancelados, e está descrito na seção 3.4. A divisão é definitiva: o ECP-1547 cuida do gráfico (aba "Pedidos cancelados") e dos totais de cancelados (o total do período no cartão da aba); o ECP-1605 cuida do container "Cancelamentos".

## 2. Estrutura e comportamento comum às 3 abas

- Gráfico de linha, 1 ponto por dia/semana/mês/etc. — a granularidade dos grupos exibidos é decidida pelo servidor; o front só exibe o que vem na resposta. Sem legenda.
- Tooltip ao passar o mouse mostra o valor do ponto (R$ no Faturamento) — sem clique e sem drill-down.
- Trocar o período (ou as lojas/contexto) recarrega o card (chamada nova, não filtro local).
- Sem dado no período, a área do gráfico aparece em branco.
- O total no cartão da aba é a soma da série devolvida pelo back-end (mesmo universo e mesma regra de valor do gráfico); no caso de Cancelados, é o `Total` devolvido junto com a série.
- Componente novo de UI (gráfico de linha) criado do zero em React no primeiro card que o precisar (ECP-1546), genérico e reutilizável; o mesmo componente serve a Ofertas ([Home-Ofertas.md](Home-Ofertas.md)).

## 3. Regras de negócio por indicador

### 3.1 Faturamento (ECP-1546)

- Conta pedidos com status `Delivered` ou `Withdrawn`.
- Data de referência: data de **conclusão** (`Finished.TriggeredAt`) — nunca a criação.
- Valor: soma de `Produto.PreçoUnitário × Quantidade` dos produtos — **sem frete**.
- Guard: `Status != Finished.PreviusStatus` (exclui re-finalizações espúrias de reprocessamento de ERP).
- **Não exclui "Teste Interno".**
- Aba "Faturamento" com o total do período em R$ no cartão.

### 3.2 Pedidos Cancelados (ECP-1547)

- Conta pedidos com status `Canceled`.
- Data de referência: `Canceled.TriggeredAt` — nunca a criação. Guard: `Status != Canceled.PreviusStatus`.
- **Exclui `canceledReason = "Teste Interno"`** — a exclusão vale só para os indicadores de cancelamento da Home; a listagem de Pedidos e os relatórios exibem esses pedidos.
- Aba "Pedidos cancelados" com o total do período em contagem de pedidos cancelados (o `Total` devolvido junto com a série do gráfico).
- GMV perdido, pedidos cancelados N/M e ticket médio dos cancelados pertencem ao container "Cancelamentos" (ECP-1605, seção 3.4).

### 3.3 Pedidos Concluídos (ECP-1548)

- Mesmo universo do Faturamento (`Delivered`/`Withdrawn`), mesma data de referência (`Finished.TriggeredAt`) e mesmo guard.
- **Não exclui "Teste Interno"** — assimetria real em relação a Cancelados; não presumir simetria.
- Aba "Pedidos concluídos" com o total do período em contagem de pedidos (igual à soma dos pontos da série).

### 3.4 Cancelamentos — container da Home (ECP-1605)

- Card "Cancelamentos" com três métricas: **GMV perdido** (R$), **Pedidos cancelados** ("N/M pedidos", barra de progresso e percentual) e **Ticket Médio cancelados** (R$). Visível para Admin, Gestor de Rede e Gestor de Loja, com a mesma estrutura de Home; o Gestor de Loja vê só as próprias lojas.
- **Pedido cancelado:** status `Canceled`, data de referência `Canceled.TriggeredAt` dentro do período (nunca a criação), guard `Status != Canceled.PreviusStatus`, exclui `canceledReason = "Teste Interno"` e só conta com `TransactionReturn` aprovado ou nulo.
- **Pedido concluído (parte de M):** `Delivered`/`Withdrawn` por `Finished.TriggeredAt`, guard `Status != Finished.PreviusStatus`, `TransactionReturn` aprovado ou nulo; não exclui "Teste Interno".
- **M (total de finalizados)** = cancelados + concluídos; pedidos em aberto não entram. **Percentual** = cancelados ÷ M × 100 (decisão do PO de 2026-10-06, confirmada no código: `CancellationsOrderMapper.cs`, `FormatPercentage`), até 1 casa decimal, **arredondado sempre para cima**; M = 0 resulta em 0. Cancelados e concluídos são contados pela data do próprio evento, então o percentual não é a taxa de cancelamento dos pedidos criados no período.
- **GMV perdido** (decisão do PO, 2026-10-07) = Σ por pedido cancelado do valor real do pedido **sem frete**, isto é, a soma das linhas de produto (preço praticado na linha × quantidade; dois produtos iguais = preço unitário × 2; mesmo EAN com preço promocional e com preço original, nas ofertas, entra com cada linha ao seu preço; em pedido editado, vale a quantidade já ajustada). Custo de pagamento e cupom não são implementados pelo produto e não fazem parte da regra. Ex.: pedido A com produtos de R$ 90,00 e frete de R$ 10,00 + pedido B com produtos de R$ 50,00 sem frete → GMV perdido R$ 140,00 e ticket médio R$ 70,00; mesmo EAN com 1 unidade a R$ 8,00 (promocional) e 1 a R$ 10,00 (original) entra com R$ 18,00. **Ticket médio** = GMV perdido ÷ cancelados (2 casas; 0 sem cancelados). O legado deriva o valor de `Total.Value` (ver seção 5).
- **Barra de progresso:** só o indicador em vermelho. **Estado vazio:** valores zerados, sem erro. **Período:** dia de Brasília (00:00:00.000 a 23:59:59.999) convertido para UTC.
- A quantidade de cancelados do container é a mesma do total da aba "Pedidos cancelados" (ECP-1547; mesmo filtro nas duas consultas).

## 4. Nível de integração / fonte de dados

Cadeia de serviços confirmada no código:

```
Portal (front) → ecomm-bff-backoffice-indicator-dotnet (orquestração; hoje com cache Redis 30 min)
              → ecomm-api-order-dotnet (query real, LINQ-to-Mongo sobre a coleção order_data)
```

| Aba | Resumo | Série do gráfico (BFF → Order) |
|---|---|---|
| Faturamento | — | `.../v2/dashboard/indicators/sales/billing-order` → `orders-revenue-per-{day,week,month,quarter,year,custom}` |
| Pedidos Cancelados | — (o resumo é o container Cancelamentos, ECP-1605, abaixo) | `tax-cancellation-order` → `orders-tax-cancellation-per-{day,...}` (retorna `{ Total, Charts[] }`) |
| Pedidos Concluídos | — | `created-order` → `orders-created-per-{day,...}` (retorna `{ Charts[] }`) |
| Cancelamentos (container, ECP-1605) | `cancellations` → `salesIndicators/v1/cancellations` → `{ LostGmv, CancelledOrders { Count, TotalFinalizedOrders, Percentage }, AverageCancelledTicket, IsEmpty }` | — |

**Query reaproveitada — Faturamento** (`ecomm-api-order-dotnet`, `SalesIndicators/Commands/PerDay(/Week/Month/Quarter/Year/Custom)/PostOrdersRevenuePerXCommand.cs`):

```csharp
var revenueStatuses = new List<string> { "Delivered", "Withdrawn" };
foreach (var status in revenueStatuses) {
    var filteredQuery = HelpersOrder.ApplyFilters(_collection.AsQueryable(), request, status);
    var data = filteredQuery
        .Where(x => x.Finished != null && x.Status != x.Finished.PreviusStatus)
        .Select(x => new { FinishedAt = x.Finished!.TriggeredAt, x.Products })
        .ToList()
        .GroupBy(x => TimeZoneInfo.ConvertTimeFromUtc(x.FinishedAt, timeZone).Hour) // ou dia/semana/mês
        .Select(g => new { Bucket = g.Key, Revenue = g.Sum(x => x.Products?.Sum(p => p.UnitPrice * p.Amount) ?? 0m) });
}
```

**O que faz:** soma, por período, o valor dos produtos dos pedidos concluídos do escopo. **O que NÃO faz:** não soma frete; não exclui "Teste Interno"; não é aggregation pipeline (filtro no servidor + agrupamento em memória).

**Query reaproveitada — Cancelados, série do gráfico (ECP-1547)** (`ecomm-api-order-dotnet`, `SalesIndicators/Commands/PerDay(/Week/Month/Quarter/Year/Custom)/PostOrdersTaxCancellationPerXCommand.cs`; BFF `tax-cancellation-order`):

```csharp
var data = filteredQuery
    .Where(x => x.Canceled != null && x.Status != x.Canceled.PreviusStatus && x.CanceledReason != "Teste Interno")
    .Select(x => new { x.Canceled.TriggeredAt, x.Status })
    .GroupBy(x => TimeZoneInfo.ConvertTimeFromUtc(x.TriggeredAt, timeZone).Hour) // ou dia/semana/mês
    .Select(g => new { Hour = g.Key, Canceled = g.Count() });
// retorna { Total, Charts[] }
```

**O que faz:** conta, por período, os pedidos cancelados do escopo e devolve o `Total` usado no cartão da aba. **O que NÃO faz:** não calcula GMV perdido, percentual nem ticket médio (isso é do container Cancelamentos, abaixo).

**Query reaproveitada — Cancelamentos, container (ECP-1605)** (`ecomm-api-order-dotnet`, `SalesIndicators/Commands/PostCancellationsOrder/`; BFF `Orders/Commands/CancellationsOrder/`):

```csharp
// CancellationsOrderQuery.cs:27-54
GetCancelled: HelpersOrder.ApplyFilters(source, request, "Canceled")
    .Where(order => order.Canceled != null && order.Status != order.Canceled.PreviusStatus && order.CanceledReason != "Teste Interno")
GetCompleted (Delivered e Withdrawn): HelpersOrder.ApplyFilters(source, request, status)
    .Where(order => order.Finished != null && order.Status != order.Finished.PreviusStatus)
// CancellationsIndicatorAggregator.cs:12-30 (código do legado; o GMV perdido é corrigido na reconstrução, ver seção 5)
LostGmv = Math.Round(cancelled.Sum(o => o.GetTotalBreakdown().Value - (o.Shipping?.Cost ?? 0m)), 2)
AverageCancelledTicket = cancelledCount <= 0 ? 0m : Math.Round(lostGmv / cancelledCount, 2)
// BFF CancellationsOrderMapper.cs:15-30 e IndicatorFormatHelper.cs:12-20
totalFinalized = cancelledCount + CompletedCount;  Percentage = Math.Ceiling(count / total * 100 * 10) / 10  ("0,0%" quando total <= 0)
```

**O que faz:** conta cancelados pela data do cancelamento e concluídos pela data de conclusão, na janela do dia de Brasília convertida para UTC (`AdjustDate`, sem desvio de janela), devolve GMV perdido (no legado, o valor total registrado no pedido menos o frete; na reconstrução, a soma das linhas de produto sem frete, seção 5), as duas quantidades e o ticket médio; o BFF monta o total de finalizados e o percentual. **O que NÃO faz:** não conta pedidos em aberto; não exclui "Teste Interno" dos concluídos; não conta cancelados com transação recusada ou pendente; não soma frete; não tem o "Pedidos recebidos" do texto do ECP-1266. Front legado: `ed-cancellations-card` (ramo `origin/main` do Angular), nas visões de Rede e de Loja.

**Query reaproveitada — Concluídos** (`.../PostOrdersCreatedPerXCommand.cs`, rota `created-order`): mesmo filtro do Faturamento (`Delivered`/`Withdrawn`, `Finished != null && Status != Finished.PreviusStatus`), agrupando por `Finished.TriggeredAt` em Brasília e contando pedidos.

**Nome enganoso no código:** apesar do nome da rota/comando ("orders-created-per-day", `CreatedOrderCommand`), a lógica real filtra `Delivered`/`Withdrawn` por `Finished.TriggeredAt` — é literalmente o indicador de Concluídos, não de pedidos recém-criados. Não confundir com `new-created-order` (comando `PostNewCreatedOrder`), outro indicador (`New`/`Pending`, retorna só `{Count, IsNewOrder}`, sem cache). Renomear na reconstrução (ex.: `orders-completed-per-day`) é boa oportunidade, não obrigatório.

- **Escopo de lojas:** resolvido hoje no BFF (`ValidationOrderLayerService.PrepareBodyRequestAsync`, via `GetPharmaciesUserCommand`/`PostStoresFilterCommand`) antes de chamar o Order — não confirmado se essa resolução é reaproveitada tal qual ou refeita.
- **Timezone:** `"E. South America Standard Time"` (Brasília), convertido para UTC antes da consulta.
- **Onde esse back-end passa a viver é decisão de engenharia** — estes documentos só descrevem o contrato/comportamento atual.

## 5. Pontos de atenção / correção embutidos

- **Cache e performance (ECP-1546, 1547, 1548):** o cache Redis de 30 minutos não é reaproveitado (chave sem loja/Rede do contexto → dado do contexto anterior por até 30 min; número defasado em até 30 min). A entrega remove esse cache e cria o índice composto pela âncora de cada card: `{ pharmacy._id, status, finished.triggeredAt }` (Faturamento e Concluídos; hoje não existe índice em `finished.triggeredAt`) e `{ pharmacy._id, status, canceled.triggeredAt }` (Cancelados; hoje só existe índice simples em `canceled.triggeredAt`). Somente se o teste de carga exigir: TTL curto (1 a 2 minutos) com chave contendo todo o escopo (loja, Rede, grupo, estado e período, inclusive as datas do personalizado). Detalhes e dados da medição em [Home-Vendas-Visao-Geral.md](Home-Vendas-Visao-Geral.md), seção 8.
- **Nome enganoso `created-order`:** ver seção 4.
- **Cancelamentos (ECP-1605):** além do cache e dos índices (mesmos de Cancelados e Concluídos: `{ pharmacy._id, status, canceled.triggeredAt }` e `{ pharmacy._id, status, finished.triggeredAt }`), o card registra: (a) **GMV perdido — correção embutida (decisão do PO, 2026-10-07):** o texto do ECP-1266 dizia "valor total" e o código do legado calcula `GetTotalBreakdown().Value − Shipping.Cost` (`CancellationsIndicatorAggregator.cs:26-30`); esse `Total.Value` é gravado na criação do pedido (`CreateOrderCommand.cs:150`: `CalculateTotalWithDiscounts()`) e regravado a cada ajuste de itens (`OrderItemAdjustment.cs:51-60`), sempre como produtos + custo de pagamento + frete − cupom, e, se o pedido não tem `Total` gravado, a mesma fórmula é calculada na hora (`OrderData.GetTotalBreakdown`). Como custo de pagamento e cupom não são implementados pelo produto, a reconstrução calcula o GMV perdido pela soma das linhas de produto do pedido cancelado (`ProductData.CalculateLineTotal` somado em `OrderData.CalculateTotalProducts`, já com a quantidade ajustada em pedido editado), sem frete, sem depender de campos de custo de pagamento nem de cupom. Legado e regra coincidem enquanto custo de pagamento e cupom forem zero; a coincidência deve ser confirmada com o comparativo em produção (seção 8); (b) o back-end devolve o percentual com 1 casa ("60,0%") e a tela legado exibe inteiro sem casa ("60%"); (c) `IsEmpty` é devolvido e não usado (o card mostra zeros); (d) o denominador carrega pedidos inteiros só para contar (candidato a contagem no servidor).

## 6. Cenários de borda

| Cenário | Regra |
|---|---|
| Pedido cancelado com motivo "Teste interno" | Não entra na contagem nem no gráfico (ECP-1547), nem no GMV, na quantidade, no percentual e no ticket médio do container (ECP-1605) |
| Pedido concluído associado a "Teste interno" por outro evento | Ainda conta em Concluídos/Faturamento |
| Pedido com frete cobrado, depois cancelado | Frete não entra no GMV perdido nem no ticket médio de cancelados (ECP-1605) |
| Cancelamentos: pedido cancelado com o mesmo EAN em linha de preço promocional e em linha de preço original (ofertas) | Cada linha entra no GMV perdido com o seu preço (ex.: 1 un. a R$ 8,00 + 1 un. a R$ 10,00 = R$ 18,00) (ECP-1605) |
| Cancelamentos: pedido editado (itens reduzidos ou removidos) e depois cancelado | O GMV perdido usa a quantidade já ajustada dos itens (ECP-1605) |
| Pedido re-finalizado por reprocessamento de ERP (sem mudança real de status) | Não conta de novo em Faturamento/Concluídos (guard `previusStatus`) |
| Sem dado no período | Área do gráfico fica em branco |
| Troca de período | O card recarrega (chamada nova) |
| Cancelamentos: pedido criado em 03/08 e cancelado em 08/08 | Conta só no período que contém 08/08 |
| Cancelamentos: sem pedidos finalizados no período | Percentual 0, "0/0 pedidos", sem erro |
| Cancelamentos: sem cancelados e com concluídos | Valores zerados, "0/M pedidos", barra vazia, sem erro |
| Cancelamentos: pedido cancelado com transação recusada ou pendente | Não conta |

## 7. Critérios de aceite (resumo dos cards)

- Faturamento: gráfico de linha com 1 ponto por período, sem legenda; cartão da aba com o total em R$; tooltip com o valor em R$; troca de período recarrega o card.
- Cancelados (ECP-1547): gráfico de linha com 1 ponto por período; cartão da aba com o total do período em contagem; "Teste interno" não entra na contagem nem no gráfico.
- Concluídos: gráfico com 1 ponto por período; cartão da aba com a contagem; pedido `Delivered`/`Withdrawn` no período conta; "Teste interno" não exclui.
- Cancelamentos (ECP-1605): GMV perdido = soma das linhas de produto, sem frete (pedido A com produtos de R$ 90,00 e frete de R$ 10,00 + pedido B com produtos de R$ 50,00 → R$ 140,00 e ticket médio R$ 70,00; mesmo EAN com preço promocional e original entra com cada linha ao seu preço, ex.: R$ 18,00), sem custo de pagamento nem cupom; "N/M pedidos" com M = cancelados + concluídos; percentual arredondado para cima com até 1 casa; ticket médio dos cancelados; barra só em vermelho; "Teste interno" não entra; cancelamento ancorado na data do evento; estado vazio sem erro; loading e erro por card; Gestor de Loja vê só as próprias lojas.

## 8. Pendências / perguntas em aberto

- [ ] **Figma:** a ser atualizado pela UX ainda nesta semana (layout, rótulos e textos finais). Os 3 cards ainda trazem, na seção "Figma", o link e a imagem de uma versão anterior do handoff (nó `2-19`).
- [ ] **ECP-1605 — "Pedidos recebidos" e script da BOCAIUVA/ALTO SÃO JOÃO** (texto do ECP-1266): não encontrados no código dos repositórios acessados; ainda é necessário? Qual o critério?
- [ ] **ECP-1605 — comparativo em produção do GMV perdido (DoD do card):** nos pedidos cancelados do último mês, comparar a soma de `Total.Value − frete` (legado) com a soma das linhas de produto (regra do produto) e registrar o resultado aqui; se houver diferença, identificar a origem (custo de pagamento ou cupom gravado no pedido) antes de liberar. Ainda não executado (nenhum número levantado).
- [ ] **ECP-1605 — formato do percentual inteiro** ("60%" × "60,0%"); estado vazio dedicado × valores zerados; layout, rótulos, texto do popover e texto de erro (UX).
- [ ] **Manual do Portal:** a seção 5.1 do `Manual-Portal-Radar-Ecommerce.md` ainda lista a linha "Volume dos pedidos cancelados" e não descreve o card "Cancelamentos"; atualizar o Manual.
- [ ] **Divergência entre cards sobre o valor do Faturamento:** o ECP-1546 define o valor como `PreçoUnitário × Quantidade`; o ECP-1595 (Detalhamento da Ruptura) informa que a correção do bug ECP-1528 (branch `fix/ECP-1528-faturamento-limite-oferta`, "Pronto para release") passa a usar o valor da linha com preço excedente (`CalculateLineTotal()`) e que a reconstrução deve usar a regra corrigida nos dois lugares. Definir qual regra vale para o Faturamento (e para Top produtos, que soma `Amount × UnitPrice`).
- [ ] Granularidade/agrupamento por dia, semana e mês de cada período: decidida pelo servidor, mas os rótulos do eixo e a regra por período estão no Figma que será atualizado.
- [ ] Renomear `orders-created-per-day` (e variantes) na reconstrução — recomendação, não obrigatório.
- [ ] Botão "Exportar" do cabeçalho da Home (relatório "Pedidos Faturados": 1 linha por item do pedido — Loja, Número do pedido, Data do pedido, Nome do cliente, CPF, EAN do item, Método de pagamento, Método de entrega, Valor, Status; bug conhecido: a coluna "Loja" traz o CNPJ, não o nome): não faz parte do recorte atual; o PO decide depois se vira História.
- [ ] Onde o back-end vive e como a resolução de escopo de lojas é reaproveitada: decisão de engenharia.

## Changelog

- **2026-10-07** — Decisão do PO sobre o GMV perdido do container Cancelamentos (ECP-1605): custo de pagamento e cupom não são implementados pelo produto e não entram na regra; o GMV perdido é o valor real do pedido cancelado sem frete, isto é, a soma das linhas de produto (preço praticado na linha × quantidade; mesmo EAN com preço promocional e original entra com cada linha ao seu preço; quantidade ajustada em pedido editado). O legado deriva o valor de `Total.Value − frete` (no modelo, produtos + custo de pagamento + frete − cupom); legado e regra coincidem enquanto custo de pagamento e cupom forem zero. Seções 3.4, 4, 5, 6, 7 e 8 ajustadas; pendência "composição do GMV perdido" removida; incluída a pendência do comparativo em produção (cancelados do último mês: soma de `Total.Value − frete` × soma das linhas), sem números levantados.
- **2026-10-06** — Divisão de escopo definida pelo PO: o ECP-1547 cuida do gráfico (aba "Pedidos cancelados") e dos totais de cancelados (total do período no cartão da aba); o ECP-1605 cuida do container "Cancelamentos" (GMV perdido, pedidos cancelados N/M, ticket médio e barra). Seções 3.2, 3.4, 4, 6 e 7 ajustadas e pendência de divisão de escopo removida.
- **2026-10-06** — Inclusão do card "Cancelamentos" da Home (ECP-1605, reconstrução do ECP-1266): cabeçalho, seção 3.4, linha na tabela de endpoints, query reaproveitada, pontos de correção, cenários de borda, resumo de critérios e pendências. A pendência do percentual do card foi resolvida (cancelados ÷ cancelados + concluídos, confirmado no código) e substituída pela divisão de escopo entre ECP-1547 e ECP-1605.
- **2026-10-06** — Documento reescrito a partir dos cards publicados ECP-1546/1547/1548 e das decisões do PO de 2026-10-05 e 2026-10-06 (aba com total do período no cartão, remoção do cache de 30 min e índices por âncora de data, Figma a ser atualizado). Substitui `Faturamento-Cancelados-Concluidos.md`. Mantidos do doc anterior: a tabela de endpoints por aba e o achado de nome enganoso de `created-order`.
- **2026-10-05** — (doc anterior) Corrigido o TTL do cache: 30 min em produção (não 60 min), com a observação de que a chave não inclui o contexto de loja/rede.
- **2026-10-01** — (doc anterior) Criação do documento, a partir de ECP-1546/1547/1548, `Manual-Portal-Radar-Ecommerce.md` seção 5, e leitura direta do código-fonte de `ecomm-api-order-dotnet`/`ecomm-bff-backoffice-indicator-dotnet`; URLs de produção de Cancelados e Concluídos confirmadas.

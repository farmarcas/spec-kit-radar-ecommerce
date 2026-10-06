# Indicadores — Faturamento, Pedidos Cancelados e Pedidos Concluídos (Home de Vendas)

**Módulo:** Operação
**Histórias:** [ECP-1546](https://farmarcas.atlassian.net/browse/ECP-1546) (Faturamento), [ECP-1547](https://farmarcas.atlassian.net/browse/ECP-1547) (Pedidos Cancelados), [ECP-1548](https://farmarcas.atlassian.net/browse/ECP-1548) (Pedidos Concluídos) — 3 Histórias separadas, 1 doc funcional, por serem o mesmo conjunto de entrega funcional (3 abas do mesmo gráfico da Home)
**Referência:** `Manual-Portal-Radar-Ecommerce.md`, seção 5 (tabela de indicadores da Home de Vendas); **Figma:** a ser atualizado pela UX ainda nesta semana (layout, rótulos e textos finais pendentes)
**Relacionado:** [Home-Vendas-Visao-Geral.md](Home-Vendas-Visao-Geral.md) (estrutura, escopo por perfil, período, âncoras de data e cache), [Filtro-GE-e-Macro-abas.md](Filtro-GE-e-Macro-abas.md), [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md)
**Status:** Em refinamento (cards em "Pronto para refinamento" no Jira)
**Última atualização:** 2026-10-06

---

## 1. O que é

Três abas do gráfico de linha da Home de Vendas — **"Faturamento"**, **"Pedidos cancelados"** e **"Pedidos concluídos"** —, cada uma mostrando a evolução do indicador no período selecionado. Cada aba exibe, no próprio cartão da aba (valor ao lado do rótulo), o **total do período**: em R$ no Faturamento e em contagem de pedidos nas outras duas. É reconstrução 1:1 em React, reaproveitando a lógica de backend já validada em produção, com os pontos de correção da seção 5. A entrega de cada História cobre front-end e back-end.

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
- "Volume dos pedidos cancelados" / **GMV perdido** (R$) **exclui frete**: para não contar frete no valor perdido nem no ticket médio de cancelados (`LostGmv = Σ (total do pedido − frete)`).
- Aba "Pedidos cancelados" com o total do período em contagem de pedidos cancelados; **card de resumo** com Total cancelado, GMV perdido e ticket médio de cancelados (resposta do back-end: `LostGmv`, `CancelledCount`, `CompletedCount`, `AverageCancelledTicket`).

### 3.3 Pedidos Concluídos (ECP-1548)

- Mesmo universo do Faturamento (`Delivered`/`Withdrawn`), mesma data de referência (`Finished.TriggeredAt`) e mesmo guard.
- **Não exclui "Teste Interno"** — assimetria real em relação a Cancelados; não presumir simetria.
- Aba "Pedidos concluídos" com o total do período em contagem de pedidos (igual à soma dos pontos da série).

## 4. Nível de integração / fonte de dados

Cadeia de serviços confirmada no código:

```
Portal (front) → ecomm-bff-backoffice-indicator-dotnet (orquestração; hoje com cache Redis 30 min)
              → ecomm-api-order-dotnet (query real, LINQ-to-Mongo sobre a coleção order_data)
```

| Aba | KPI/resumo | Série do gráfico (BFF → Order) |
|---|---|---|
| Faturamento | — | `.../v2/dashboard/indicators/sales/billing-order` → `orders-revenue-per-{day,week,month,quarter,year,custom}` |
| Pedidos Cancelados | `cancellations` → `{ LostGmv, CancelledCount, CompletedCount, AverageCancelledTicket }` | `tax-cancellation-order` → `orders-tax-cancellation-per-{day,...}` (retorna `{ Total, Charts[] }`) |
| Pedidos Concluídos | — | `created-order` → `orders-created-per-{day,...}` (retorna `{ Charts[] }`) |

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

**Query reaproveitada — Cancelados** (resumo: `SalesIndicators/Commands/PostCancellationsOrder/`; série: `.../PerDay(...)/PostOrdersTaxCancellationPerXCommand.cs`):

```csharp
public static List<OrderData> GetCancelled(IQueryable<OrderData> source, PostCancellationsOrderRequest request) {
    var status = OrderStatus.Canceled.ToString();
    return Project(HelpersOrder.ApplyFilters(source, request, status)
        .Where(o => o.Canceled != null && o.Status != o.Canceled.PreviusStatus && o.CanceledReason != "Teste Interno"));
}
// LostGmv = cancelled.Sum(o => o.GetTotalBreakdown().Value - (o.Shipping?.Cost ?? 0m))
// série: .Where(x => x.Canceled != null && x.Status != x.Canceled.PreviusStatus && x.CanceledReason != "Teste Interno")
//        .GroupBy(x => TimeZoneInfo.ConvertTimeFromUtc(x.TriggeredAt, timeZone).Hour) -> { Hour, Canceled = g.Count() }
```

**Query reaproveitada — Concluídos** (`.../PostOrdersCreatedPerXCommand.cs`, rota `created-order`): mesmo filtro do Faturamento (`Delivered`/`Withdrawn`, `Finished != null && Status != Finished.PreviusStatus`), agrupando por `Finished.TriggeredAt` em Brasília e contando pedidos.

**Nome enganoso no código:** apesar do nome da rota/comando ("orders-created-per-day", `CreatedOrderCommand`), a lógica real filtra `Delivered`/`Withdrawn` por `Finished.TriggeredAt` — é literalmente o indicador de Concluídos, não de pedidos recém-criados. Não confundir com `new-created-order` (comando `PostNewCreatedOrder`), outro indicador (`New`/`Pending`, retorna só `{Count, IsNewOrder}`, sem cache). Renomear na reconstrução (ex.: `orders-completed-per-day`) é boa oportunidade, não obrigatório.

- **Escopo de lojas:** resolvido hoje no BFF (`ValidationOrderLayerService.PrepareBodyRequestAsync`, via `GetPharmaciesUserCommand`/`PostStoresFilterCommand`) antes de chamar o Order — não confirmado se essa resolução é reaproveitada tal qual ou refeita.
- **Timezone:** `"E. South America Standard Time"` (Brasília), convertido para UTC antes da consulta.
- **Onde esse back-end passa a viver é decisão de engenharia** — estes documentos só descrevem o contrato/comportamento atual.

## 5. Pontos de atenção / correção embutidos

- **Cache e performance (ECP-1546, 1547, 1548):** o cache Redis de 30 minutos não é reaproveitado (chave sem loja/Rede do contexto → dado do contexto anterior por até 30 min; número defasado em até 30 min). A entrega remove esse cache e cria o índice composto pela âncora de cada card: `{ pharmacy._id, status, finished.triggeredAt }` (Faturamento e Concluídos; hoje não existe índice em `finished.triggeredAt`) e `{ pharmacy._id, status, canceled.triggeredAt }` (Cancelados; hoje só existe índice simples em `canceled.triggeredAt`). Somente se o teste de carga exigir: TTL curto (1 a 2 minutos) com chave contendo todo o escopo (loja, Rede, grupo, estado e período, inclusive as datas do personalizado). Detalhes e dados da medição em [Home-Vendas-Visao-Geral.md](Home-Vendas-Visao-Geral.md), seção 8.
- **Nome enganoso `created-order`:** ver seção 4.

## 6. Cenários de borda

| Cenário | Regra |
|---|---|
| Pedido cancelado com motivo "Teste interno" | Não entra na contagem, no gráfico nem no GMV de Cancelados |
| Pedido concluído associado a "Teste interno" por outro evento | Ainda conta em Concluídos/Faturamento |
| Pedido com frete cobrado, depois cancelado | Frete não entra no GMV perdido nem no ticket médio de cancelados |
| Pedido re-finalizado por reprocessamento de ERP (sem mudança real de status) | Não conta de novo em Faturamento/Concluídos (guard `previusStatus`) |
| Sem dado no período | Área do gráfico fica em branco |
| Troca de período | O card recarrega (chamada nova) |

## 7. Critérios de aceite (resumo dos cards)

- Faturamento: gráfico de linha com 1 ponto por período, sem legenda; cartão da aba com o total em R$; tooltip com o valor em R$; troca de período recarrega o card.
- Cancelados: gráfico + card de resumo (total, GMV perdido, ticket médio); cartão da aba com a contagem; "Teste interno" não entra; frete não entra no valor perdido.
- Concluídos: gráfico com 1 ponto por período; cartão da aba com a contagem; pedido `Delivered`/`Withdrawn` no período conta; "Teste interno" não exclui.

## 8. Pendências / perguntas em aberto

- [ ] **Figma:** a ser atualizado pela UX ainda nesta semana (layout, rótulos e textos finais). Os 3 cards ainda trazem, na seção "Figma", o link e a imagem de uma versão anterior do handoff (nó `2-19`).
- [ ] **Percentual do card "Cancelamentos"** ("Pedidos cancelados N/M pedidos" + percentual): a decisão do PO de 2026-10-06 é usar a definição do ECP-1547/BFF (cancelados ÷ finalizados = cancelados + concluídos, conforme o código, `CompletedCount`), mas o texto do ECP-1547 não descreve o percentual nem o denominador — confirmar e registrar no card.
- [ ] **Divergência entre cards sobre o valor do Faturamento:** o ECP-1546 define o valor como `PreçoUnitário × Quantidade`; o ECP-1595 (Detalhamento da Ruptura) informa que a correção do bug ECP-1528 (branch `fix/ECP-1528-faturamento-limite-oferta`, "Pronto para release") passa a usar o valor da linha com preço excedente (`CalculateLineTotal()`) e que a reconstrução deve usar a regra corrigida nos dois lugares. Definir qual regra vale para o Faturamento (e para Top produtos, que soma `Amount × UnitPrice`).
- [ ] Granularidade/agrupamento por dia, semana e mês de cada período: decidida pelo servidor, mas os rótulos do eixo e a regra por período estão no Figma que será atualizado.
- [ ] Renomear `orders-created-per-day` (e variantes) na reconstrução — recomendação, não obrigatório.
- [ ] Botão "Exportar" do cabeçalho da Home (relatório "Pedidos Faturados": 1 linha por item do pedido — Loja, Número do pedido, Data do pedido, Nome do cliente, CPF, EAN do item, Método de pagamento, Método de entrega, Valor, Status; bug conhecido: a coluna "Loja" traz o CNPJ, não o nome): não faz parte do recorte atual; o PO decide depois se vira História.
- [ ] Onde o back-end vive e como a resolução de escopo de lojas é reaproveitada: decisão de engenharia.

## Changelog

- **2026-10-06** — Documento reescrito a partir dos cards publicados ECP-1546/1547/1548 e das decisões do PO de 2026-10-05 e 2026-10-06 (aba com total do período no cartão, remoção do cache de 30 min e índices por âncora de data, Figma a ser atualizado). Substitui `Faturamento-Cancelados-Concluidos.md`. Mantidos do doc anterior: a tabela de endpoints por aba e o achado de nome enganoso de `created-order`.
- **2026-10-05** — (doc anterior) Corrigido o TTL do cache: 30 min em produção (não 60 min), com a observação de que a chave não inclui o contexto de loja/rede.
- **2026-10-01** — (doc anterior) Criação do documento, a partir de ECP-1546/1547/1548, `Manual-Portal-Radar-Ecommerce.md` seção 5, e leitura direta do código-fonte de `ecomm-api-order-dotnet`/`ecomm-bff-backoffice-indicator-dotnet`; URLs de produção de Cancelados e Concluídos confirmadas.

# Indicadores — Pedidos em Aberto, Tempos de Atendimento e Média de Itens por Cesta (Home de Vendas)

**Módulo:** Operação
**Histórias:** [ECP-1578](https://farmarcas.atlassian.net/browse/ECP-1578) (Total de pedidos em aberto), [ECP-1579](https://farmarcas.atlassian.net/browse/ECP-1579) (Volume dos pedidos em aberto), [ECP-1580](https://farmarcas.atlassian.net/browse/ECP-1580) (Pedidos em aberto por status), [ECP-1581](https://farmarcas.atlassian.net/browse/ECP-1581) (Tempo médio para iniciar o primeiro atendimento), [ECP-1582](https://farmarcas.atlassian.net/browse/ECP-1582) (Tempo total de atendimento), [ECP-1583](https://farmarcas.atlassian.net/browse/ECP-1583) (Média de itens por cesta)
**Referência:** `Manual-Portal-Radar-Ecommerce.md`, seções 5.1 (linhas "Total de Pedidos em Aberto", "Volume dos pedidos em aberto", "Pedidos em aberto por status", "Tempo médio para iniciar primeiro atendimento", "Tempo médio total de atendimento", "Média de itens por cesta") e 8 (Conferência conta como status aberto); ECP-1056 (itens 2 e 3: indicador independe do período; definição dos tempos a confirmar); **Figma:** a ser atualizado pela UX ainda nesta semana (layout, rótulos e textos finais pendentes) — os rótulos citados são o texto atual do legado
**Relacionado:** [Home-Vendas-Visao-Geral.md](Home-Vendas-Visao-Geral.md), [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md)
**Status:** Em refinamento (cards em Backlog no Jira)
**Última atualização:** 2026-10-07

---

## 1. O que é

Dois grupos de elementos da Home de Vendas:

- **Pedidos em aberto** (ECP-1578, 1579, 1580): o bloco de pedidos ainda não finalizados nas lojas do escopo, **independente do período** da tela — quantidade, volume em R$ e rosca por etapa. Os três vêm da mesma consulta/regra de status e **as quantidades devem fechar entre si** (soma das fatias da rosca = total; o volume soma exatamente os pedidos que o total conta). A consulta é entregue uma única vez, pela primeira História desenvolvida; as outras só a consomem.
- **Tempos e cesta** (ECP-1581, 1582, 1583): "Tempo médio para iniciar primeiro atendimento", "Tempo médio total de atendimento" e "Média de itens por cesta" — no legado, os três (mais o volume dos pedidos cancelados, que não é entregue) vêm da mesma consulta `time-estimated-orders`, entregue uma única vez pela primeira História desenvolvida. Dependem do período.

Todos são reconstrução 1:1 com os pontos de correção da seção 5. A entrega de cada História cobre front-end e back-end.

## 2. Estrutura de cada elemento

- **Total de Pedidos em Aberto (1578):** rótulo "Total de Pedidos em Aberto" + valor em destaque (quantidade) + popover no rótulo (componente novo em React, ancorado no rótulo, posição abaixo) + skeleton + erro com "Atualizar".
- **Volume dos pedidos em aberto (1579):** rótulo "Volume dos pedidos em aberto" + valor em destaque no formato "R$ 1.234,56" + skeleton + erro com "Atualizar".
- **Pedidos em aberto por status (1580):** título, **rosca** com miolo vazio (corte de 80% no legado), legenda estática (quadrado colorido, nome da etapa e percentual) e tooltip "Etapa: quantidade (percentual%)" ao passar o mouse na fatia; sem clique e sem legenda interativa. Fatias na ordem do Manual: **Conferência, Fila, Em separação e Liberados**; cores do legado: Fila `#E5E8EB`, Em separação `#89C9FF`, Liberados `#0091FF` (a cor da Conferência está em Pendências). Estado vazio: anel cinza vazio e legenda com 0% em todas as etapas. O componente de rosca é criado neste card (se ainda não existir) e é reutilizável por Formas de pagamento e Métodos de entrega.
- **Tempo médio para iniciar primeiro atendimento (1581)** e **Tempo médio total de atendimento (1582):** valor em destaque em formato de duração (no legado, os dois formam um cartão duplo).
- **Média de itens por cesta (1583):** descrição "Média de itens por cesta" + valor em destaque (o legado mostra o ícone de cesta `shopping-basket`, em azul).
- Todos: skeleton e estado de erro com "Atualizar" que recarrega só o elemento; os demais blocos seguem normais. Os elementos de tempo e cesta recarregam ao trocar o período ou o contexto; os de pedidos em aberto recarregam ao trocar o contexto.

## 3. Regras de negócio

### 3.1 Pedidos em aberto (ECP-1578, 1579, 1580)

- **Pedido em aberto** = pedido ainda não finalizado em um destes status: Conferência (`Conference`), Na fila (`New` = aguardando visualização e `Pending` = aguardando confirmação), Em separação (`Triage`) e Liberados (`InDelivery` = liberado para entrega e `InWaiting` = liberado para retirada).
- **Condição de pagamento:** pedido com pagamento online só conta se a transação foi aprovada; pedido com pagamento offline conta; `TransactionReturn` aprovado ou nulo.
- **Independe do período:** considera os pedidos criados nos últimos 12 meses até hoje (janela fixa de 1 ano pela data de criação); trocar o período da tela não muda o valor.
- **Total (1578):** quantidade de pedidos em aberto, sem contar duas vezes pedidos com o mesmo número. Ex.: 12 pedidos (3 Conferência, 4 Na fila, 2 Em separação, 3 Liberados) → 12.
- **Volume (1579):** soma, em R$, do **total de cada pedido em aberto**, sem contar duas vezes o mesmo número. O total do pedido é o valor persistido ou, se não houver, produtos + custo de pagamento + frete − desconto de cupom; portanto **o volume inclui frete e taxa de pagamento e é líquido de cupom** (diferente do Faturamento, que conta só produtos). Sem pedidos: "R$ 0,00". Ex.: R$ 100,00 + R$ 50,50 → "R$ 150,50".
- **Rosca (1580):** Conferência = `Conference`; Fila = `New` + `Pending`; Em separação = `Triage`; Liberados = `InDelivery` + `InWaiting`. Percentual de cada fatia = pedidos da etapa ÷ total de pedidos em aberto, **arredondado para inteiro** (a soma exibida pode dar 99% ou 101%); `0%` quando o total é 0. Ex.: Conferência 25%, Fila 33%, Em separação 17%, Liberados 25%. **A soma das quatro quantidades é igual ao total de pedidos em aberto** para o mesmo escopo. **Sem cache** (métrica de "agora").
- **Escopo:** as lojas do contexto do Filtro Multicontexto (e GE para Admin); escopo vazio resulta em 0 / "R$ 0,00" / 0 em todas as fatias.
- Perfis e visibilidade: ver Pendências.

### 3.2 Tempos de atendimento e média de itens (ECP-1581, 1582, 1583)

- **Tempo médio para iniciar primeiro atendimento (1581):** média, sobre os pedidos do período, do tempo entre a **criação do pedido** e o início da separação (`Triaged.TriggeredAt`); para pedido ainda na fila (`Pending`) não triado, conta de criação até agora; pedido sem triagem e que não está na fila (ex.: cancelado antes da triagem) não entra. Ex.: triados 10 e 20 minutos após a criação → "15min".
- **Tempo total de atendimento (1582):** média do tempo entre a **criação do pedido** e o encerramento: `Canceled.TriggeredAt` para cancelado e `Finished.TriggeredAt` para concluído (`Delivered` ou `Withdrawn`); pedido sem encerramento não entra. **Cancelados entram** porque os concluídos entram (decisão do PO de 2026-10-05); `Withdrawn` entra como `Delivered`. Ex.: um concluído em 2h e um cancelado em 4h → "3h".
- **Formato da duração (1581 e 1582):** menos de 1 hora = "{n}min" (ex.: "37min"); de 1 hora a menos de 1 dia = "{h}h" ou "{h}h e {m}min" (ex.: "9h e 37min"); 1 dia ou mais = "{d} dia(s) e {h}h" ou "{d} dia(s)" (ex.: "2 dias e 11h"). Sem dado: "-".
- **Média de itens por cesta (1583):** **item = unidade de produto**; o tamanho da cesta do pedido é a soma das quantidades (`amount`) dos produtos (3 unidades do mesmo produto = 3). Média do tamanho da cesta sobre os pedidos considerados. Ex.: pedidos com 1, 2 e 3 itens → 2. **Exibição:** número inteiro arredondado (2,4 → "2"; arredondamento do legado é o padrão do .NET: 2,5 → 2 e 3,5 → 4); sem dado: "-".
- **Status considerados** (após a correção): `Pending`, `Delivered`, `Withdrawn` e `Canceled`; pedidos online com transação recusada não entram (`TransactionReturn` aprovado ou nulo).
- **Data de referência e janela do período:** o legado ancora em `updatedAt`; a janela deve ser do primeiro ao último dia selecionado em Brasília, convertida para UTC (âncora a decidir — Pendências).
- **Escopo:** lojas do contexto (e GE para Admin). **Perfis:** o elemento aparece para Admin, Gestor de Rede e Gestor de Loja, em qualquer quantidade de lojas.

## 4. Nível de integração / fonte de dados

### 4.1 Pedidos em aberto

**Query reaproveitada** — contagem e volume: BFF `ecomm-bff-backoffice-indicator-dotnet`, `Orders/Commands/GetOpenOrder/GetOpenOrderCommand.cs` (rota v2 `.../sales/open-order`, `IndicatorSaleController.cs` v2 :700-722, **sem cache**) → `ecomm-api-order-dotnet`, `SalesIndicators/Commands/PostOpenOrder/PostOpenOrderCommand.cs` (rota `salesIndicators/v1/open-order`). Janela fixa montada no BFF (`GetOpenOrderCommand.cs:23-24`):

```csharp
request.EndDate = DateTime.UtcNow.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
request.InitDate = DateTime.UtcNow.Date.AddHours(00).AddMinutes(00).AddSeconds(00).AddYears(-1);
```

Status, contagem e soma no Order (`PostOpenOrderCommand.cs:14-22, 39-57`):

```csharp
private static readonly OrderStatus[] IncludedStatuses = [ New, Pending, Triage, InWaiting, InDelivery, Conference ];
foreach (OrderStatus status in IncludedStatuses) {
    var filteredQuery = HelpersOrder.ApplyFiltersStatus(_collection.AsQueryable(), request, status);
    foreach (var x in filteredQuery.ToList()) {
        if (orderNumbersSeen.Contains(x.Number)) continue;
        orderNumbersSeen.Add(x.Number);
        var order = _mapper.Map<OrderDetail>(x);   // Total = GetTotalBreakdown().Value (OrderProfile.cs:15)
        total += order.Total; count++; } }
```

`HelpersOrder.ApplyFiltersStatus` (`Helpers/HelpersOrder.cs:18-77`) filtra por `Pharmacy.Id ∈ PharmacyIds`, por `CreatedAt` entre `initDate.Date` e `endDate.Date + 1 dia − 1 tick` e aplica `ApplyStatusFilter` (`:509-558`): `New` = `Status` contém "Pending" e `Visualized == null`; `Pending` = `Status == "Pending"` e `Visualized != null`; ambos com `(PaymentType == "Online" && TransactionReturn == Approved) || PaymentType == "Offline"` e `TransactionReturn ∈ {Approved, null}`; `Conference` = `Status == "Conference"` com as mesmas condições de pagamento; demais = `Status == nome` e `TransactionReturn ∈ {Approved, null}`. O BFF só preenche `Count`, `IsOrder` e `Total` quando o Order devolve `Total` (`GetOpenOrderCommand.cs:33-41`) e formata o volume como `"R$ " + Math.Round(total, 2).ToString("N2", pt-BR)`. `OrderData.GetTotalBreakdown()` (`Edelivery.Order.Domain/OrderData.cs:114-115`) = `Total ?? OrderTotal.FromValue(CalculateTotalWithDiscounts())`; `CalculateTotalWithDiscounts` = produtos + custo de pagamento + frete − (produtos × % do cupom) (`:83-100`).

**O que faz:** conta (e soma o total de) todos os pedidos em aberto (6 status) criados nos últimos 12 meses nas lojas do escopo, sem repetir número de pedido. **O que NÃO faz:** não é cacheado no BFF; não respeita o período selecionado; não conta pedidos em aberto criados há mais de 12 meses; não exclui "Teste Interno"; não separa produtos, frete e taxa.

**Query reaproveitada — rosca (ECP-1580):** BFF `Orders/Commands/OrdersByStatus/OrdersByStatusCommand.cs` (rota v2 `.../sales/orders-by-status`, `IndicatorSaleController.cs` v2 :645-674, **cacheada hoje**) → Order `SalesIndicators/Commands/PostOrdersByStatus/PostOrdersByStatusCommand.cs:25-60` (rota `salesIndicators/v1/orders-by-status`). Mesma janela fixa (`OrdersByStatusCommand.cs:17-20`, que usa `PrepareSalesBodyRequestAsync`):

```csharp
var relevantStatuses = new HashSet<string> { "New", "Pending", "InDelivery", "InWaiting", "Triage" };
foreach (OrderStatus status in Enum.GetValues(typeof(OrderStatus))) {
    if (!relevantStatuses.Contains(status.ToString()!)) continue;
    var filteredQuery = HelpersOrder.ApplyFiltersStatus(_collection.AsQueryable(), request, status);
    var count = (uint)filteredQuery.Count();
    switch (statusName) { case "New": case "Pending": inLine += count; break;
        case "InDelivery": case "InWaiting": released += count; break;
        case "Triage": inSeparation += count; break; } }
```

O Angular calcula o percentual com `Math.round((valor / total) * 100)` e `'0%'` quando o total é 0 (`indicators-sales-pharmacy.component.ts:482-485, 487-513`); rótulos e cores em `:86-97`; tooltip `"{rótulo}: {quantidade pt-BR} ({percentual}%)"` em `presentation/containers/doughnut-chart/doughnut-chart.component.ts`.
**O que faz:** conta por etapa os pedidos em aberto (Fila, Em separação, Liberados) criados nos últimos 12 meses. **O que NÃO faz:** não conta Conferência; não respeita o período; não elimina números de pedido repetidos; não exclui "Teste Interno".

### 4.2 Tempos de atendimento e média de itens

**Query reaproveitada** (única para os 3 elementos) — BFF `Orders/Commands/GetTimeEstimatedOrders/GetTimeEstimatedOrdersCommand.cs` (rota v2 `.../sales/time-estimated-orders`, `IndicatorSaleController.cs` v2 :322-354, **cacheada hoje**) → Order `SalesIndicators/Commands/PostTimeEstimatedOrders/PostTimeEstimatedOrdersCommand.cs` (agregação Mongo, rota `salesIndicators/v1/time-estimated-orders`):

```csharp
var validStatuses = new[] { "Pending", "Delivered", "Whithdrawn", "Canceled" };      // :30
{ "updatedAt", new BsonDocument { { "$gte", request.StartLocal.Value }, { "$lte", request.EndLocal.Value } } },  // :35-38
{ "transactionReturn", new BsonDocument { { "$in", new BsonArray { TransactionReturn.Approved, BsonNull.Value } } } },  // :45
// serviceStartTime (:105-122): if (triagedAt != null || status == "Pending") then (triagedAt != null ? triagedAt - createdAt : $$NOW - createdAt) else null
// finishTime (:124-136): if (canceledAt != null) canceledAt - createdAt else if (finishedAt != null) finishedAt - createdAt else null
{ "basketItems", new BsonDocument("$sum", "$products.amount") },                     // :89
// :139-146 $group: averageServiceStartTime = $avg, averageFinishTime = $avg, averageItemsBasket = $avg basketItems
```

No BFF a duração é formatada por `HelperText.FormatTimeSpanAsHourMinute` (`Helpers/HelperText.cs:7-41`) e o valor nulo vira `"-"` (`GetTimeEstimatedOrdersCommand.cs:80-85`); a média de itens: `Math.Round(response.AverageItemsBasket.Value, 0).ToString()` ou `"-"` (`:77-79`).

**O que faz:** devolve as médias de (triagem − criação), (encerramento − criação) e itens por pedido sobre os pedidos `Pending`, `Delivered` e `Canceled` do escopo cuja última atualização cai na janela. **O que NÃO faz:** não considera `Withdrawn` (erro de digitação); não usa `Finished.TriggeredAt`/`Canceled.TriggeredAt` como data de referência do período; não exclui "Teste Interno"; não aplica o guard `Status != Finished.PreviusStatus`; não mede "Na fila → Em separação" nem "Na fila → Concluído" (o Manual descreve assim, mas a conta parte da criação do pedido); não conta pedidos em Conferência, Em separação ou Liberados no momento da consulta (o Manual descreve a média de itens como "todos os pedidos, concluídos ou não").

## 5. Pontos de atenção / correção embutidos

**Pedidos em aberto (1578, 1579, 1580):**
- **Texto do popover do Total diverge da conta:** texto atual "Quantidade de pedidos ainda não finalizados no período, incluindo todos os status pendentes (na fila, liberados e em separação)." A conta ignora o período (janela fixa de 1 ano) e inclui Conferência, que o texto não cita. Texto novo em Pendências.
- **Escopo vazio conta a plataforma inteira** (`PostOpenOrderCommand` e `PostOrdersByStatusCommand.cs:22` não têm guard de lista vazia; `ApplyFiltersStatus` só filtra por loja se a lista tiver itens, `HelpersOrder.cs:40-41`; inferido, não reproduzido) → a reconstrução devolve 0.
- **Janela em UTC:** a janela de 1 ano usa `DateTime.UtcNow.Date` (dia UTC), sem converter para Brasília; a diferença só aparece na borda de 1 ano → usar o dia de Brasília.
- **Rosca: Conferência fora (ECP-1580, decisão do PO: incluir):** a consulta atual não conta `Conference` e a legenda do Angular só tem 3 itens; a reconstrução adiciona a fatia "Conferência".
- **Rosca: escopo errado (bug do `||`):** `orders-by-status` usa `PrepareSalesBodyRequestAsync` (`ValidationOrderLayerService.cs:215`; a versão correta usa `&&`, `:76-78`, e é a que o total usa). Sem `PharmacyIds` explícitos, a rosca pega todas as lojas do usuário e ignora `x-pharmacy-id`/`x-pharmacy-network-id` — com uma Rede selecionada o total mostra a Rede e a rosca mostra todas as Redes do usuário. A reconstrução resolve o escopo pelo contexto selecionado.
- **Rosca: cache de 30 minutos numa métrica de "agora"** (`ExecuteWithCache`, `IndicatorSaleController.cs` v2 :659; o período entra na chave sem influenciar o dado e a loja/Rede não entram) → fica **sem cache**; a engenharia confirma por teste de carga se um TTL curto (1 a 2 min, com chave com todo o escopo) é necessário.
- **Performance:** a consulta traz documentos para a memória (`ToList()`) e soma/conta um a um, uma passada por status (a rosca faz 1 contagem por status em sequência); a coleção `order_data` já tem o índice composto `pharmacy._id + status + createdAt`, que cobre o filtro. Agregação no servidor/agrupamento por status em uma única consulta: decisão da engenharia por teste de carga. Os elementos de pedidos em aberto ficam sem cache.
- **Percentual arredondado:** `SQP-5359` ("Arredondar as porcentagens") deixou o percentual sem casas decimais; a soma pode não fechar 100%.

**Tempos e média de itens (1581, 1582, 1583):**
- **Erro de digitação `"Whithdrawn"`** (`PostTimeEstimatedOrdersCommand.cs:30`) descarta os pedidos `Withdrawn` → corrigir para `Withdrawn` (decisão do PO de 2026-10-05: correção inequívoca entra como entrega do card).
- **Janela deslocada:** o `$match` usa `StartLocal`/`EndLocal` (Brasília, sem conversão) contra `updatedAt` (UTC), em vez de `InitDate`/`EndDate` já convertidos por `AdjustDate` (`:35-38`, `:168-187`); com o servidor em UTC (o `Dockerfile` é Linux sem `TZ`; inferido, confirmar) a janela fica 3 horas antes do correto (entram pedidos das 21:00–23:59 BRT do dia anterior e saem os das 21:00–23:59 do último dia) → usar os limites do dia de Brasília convertidos para UTC.
- **`updatedAt` como data de referência** muda a cada atualização do pedido (ex.: reprocessamentos), não é a data de encerramento e não tem índice; recomendação: ancorar por evento (Pendências).
- **Pedidos `Pending` no tempo de início:** para pedido não triado a conta é "agora − criação" (`:105-122`), então o valor varia a cada consulta e cresce com pedidos parados.
- **Três condições de pagamento com nome de campo capitalizado** (`Payment.PaymentMethodType`, `TransactionReturn`, `Payment.PaymentCard`, `:48-61`) não batem com os campos camelCase do documento e, pela leitura, não filtram nada (os `$or` ficam sempre verdadeiros); a exclusão efetiva de pedidos online recusados vem de `transactionReturn ∈ {Approved, null}` (`:45`). Inferido; confirmar com teste.
- **Cache e performance** (decisão do PO de 2026-10-05, a mesma de [Faturamento-Pedidos.md](Faturamento-Pedidos.md)): o BFF guarda a resposta no Redis por 30 minutos (`ExecuteWithCache`, `IndicatorSaleController.cs` v2 :338-345), chave sem loja nem Rede; a reconstrução não reaproveita esse cache; índice composto pela âncora de data decidida (se mantida, `{ pharmacy._id, status, updatedAt }`, pois não existe índice em `updatedAt`) e, se o teste de carga exigir, TTL curto (1–2 min) com chave contendo todo o escopo.

## 6. Cenários de borda

| Cenário | Regra |
|---|---|
| Período "Hoje" e pedido em aberto criado há 20 dias | Conta no total, no volume e na rosca; trocar o período não muda |
| Pedido em Conferência | Conta no total, no volume e tem fatia própria na rosca |
| Pedido online com transação recusada | Não conta |
| Dois registros com o mesmo número de pedido | Contado uma única vez |
| Sem pedidos em aberto | Total 0; volume "R$ 0,00"; rosca com anel cinza vazio e 0% em todas as etapas |
| Escopo de lojas vazio | 0 / "R$ 0,00" / 0 em todas as fatias |
| Pedido que mudou de etapa agora há pouco | A rosca reflete a nova etapa ao recarregar (sem cache) |
| Pedido sem triagem e que não está na fila (ex.: cancelado antes da triagem) | Não entra no tempo para iniciar o atendimento |
| Sem pedidos que permitam calcular tempo/média no período | Exibe "-" |
| Média real de 2,4 itens | Exibe "2" |

## 7. Pendências / perguntas em aberto

- [ ] **Figma:** a ser atualizado pela UX ainda nesta semana (layout, rótulos e textos finais de todos os elementos; no legado os dois tempos formam um cartão duplo).
- [ ] **Texto do popover de "Total de Pedidos em Aberto"** — proposta para aprovação do PO: "Quantidade de pedidos ainda não finalizados nas suas lojas, de qualquer data dos últimos 12 meses, incluindo Conferência, Na fila, Em separação e Liberados."
- [ ] **Visibilidade dos blocos (1578, 1579, 1580):** o legado decide pelo número de lojas (Admin, Gestor de Rede e Gestor de Loja com mais de uma loja veem o bloco; Gestor de Loja de loja única via "Novos pedidos aguardando", que não é entregue). Com a Home igual em todos os perfis, aparece para todos ou depende do número de lojas? *(Os cards 1581, 1582 e 1583 já definem que aparecem para Admin, Gestor de Rede e Gestor de Loja em qualquer quantidade de lojas — critério diferente do dos blocos de pedidos em aberto.)*
- [ ] **Volume (1579):** manter a composição do legado (inclui frete e taxa de pagamento, líquido de cupom) ou alinhar ao Faturamento (só produtos)?
- [ ] **Rosca (1580):** cor e posição da fatia "Conferência" (o Manual lista Conferência primeiro; o legado não tem cor para ela); manter o arredondamento por fatia (soma pode dar 99%/101%) ou usar outra regra? **Protótipo de 07/10/2026 (referência de desenho):** a rosca mostra 3 fatias — Fila, Liberados e Em separação, nessa ordem — com as cores `#E2E8F0`, `#006FF7` e `#8CC4FF`, **sem a fatia Conferência** (a fatia Conferência é decisão do PO e se mantém); o tooltip mostra "Etapa: N pedidos" (sem percentual). Definir com a UX a ordem final com Conferência, se as cores do protótipo substituem as do legado (`#E5E8EB`, `#89C9FF`, `#0091FF`) e se o tooltip mostra o percentual.
- [ ] **Botão "Visualizar pedidos"** (ícone de download) do bloco azul do legado, que dispara por e-mail a planilha "Pedidos em Aberto"; o protótipo de 07/10/2026 mostra o mesmo botão com ícone de olho, como link para a tela de Pedidos (sem filtro de status nem de período): não é entregue; o PO decide se vira História e qual a ação dele (abrir Pedidos ou exportar). Fatos levantados: `ReportIndicatorStoreOpenOrderCommand.cs` (rota `.../sales/report-indicators-store-open-order`) não lê os cabeçalhos de loja e Rede (exporta as lojas de todo o usuário, enquanto o elemento mostra o contexto selecionado), responde 200 mesmo quando o envio ao Kafka falha, e o gerador da planilha e o consumidor do tópico `order.open.indicator.report` não foram encontrados nos repositórios acessados.
- [ ] **Data de referência do período dos tempos e da média de itens** (1581, 1582, 1583): manter `updatedAt` (legado) ou ancorar por evento (concluídos por `Finished.TriggeredAt`, cancelados por `Canceled.TriggeredAt`; pedidos ainda na fila por `CreatedAt`)?
- [ ] **Pedidos ainda na fila (`Pending`, não triados) no tempo para iniciar o atendimento** (1581): entram (legado, contando até agora) ou só pedidos que já iniciaram o atendimento?
- [ ] **Definição do "primeiro atendimento"** (1581): o legado mede criação → triagem (Em separação); o Manual e o ECP-1056 descrevem "Na fila → Concluído" para o tempo total (e sugerem "Na fila → Em separação" para o início); a decisão do PO de 2026-10-05 é contar da criação do pedido. Confirmar que a triagem é o marco final do "primeiro atendimento" e, no total (1582), a definição "criação → encerramento".
- [ ] **Pedidos em Conferência, Em separação ou Liberados no momento da consulta** não entram nos tempos (só `Pending`, concluídos e cancelados); manter? (1581 e 1582)
- [ ] **Universo da média de itens** (1583): manter o do legado (`Pending`, concluídos e cancelados) ou, como diz o Manual, todos os pedidos do período, concluídos ou não? Exibir com casas decimais (ex.: "2,4") em vez de inteiro arredondado (o protótipo de 07/10/2026 exibe "2,70")?
- [ ] **Cartão duplo no protótipo de 07/10/2026 (1583):** a Média de itens por cesta forma um único cartão de duas metades com o **Ticket Médio** (ícone de ticket, rótulo "Ticket Médio" com tooltip "Valor médio gasto por pedido no período, calculado dividindo o faturamento total pela quantidade de pedidos." e valor em R$). O Ticket Médio não tem História própria; definir se o cartão duplo é entregue pelo ECP-1583 ou se o Ticket Médio ganha História (regra já decidida pelo PO em 2026-10-05: faturamento ÷ pedidos, com a âncora e os status do Faturamento). Os dois tempos de atendimento (1581 e 1582) aparecem no protótipo em um cartão duplo acima dele.
- [ ] Onde o back-end vive e o ponto final de cache/agregação: engenharia, por teste de carga.

## Changelog

- **2026-10-07** — Revisão contra o protótipo "Novo Portal - Navegável" (Claude Design, 07/10/2026): novas pendências para a rosca (3 fatias sem Conferência, cores, tooltip), o botão "Visualizar pedidos" (link para Pedidos) e o cartão duplo Média de itens por cesta + Ticket Médio.
- **2026-10-06** — Criação do documento (v1), a partir dos cards ECP-1578 a ECP-1583 e das decisões do PO de 2026-10-05 (Conferência na rosca, tempo contado desde a criação do pedido e cancelados entram, correção do `Whithdrawn`, remoção do cache) e de 2026-10-06 (Home igual nos perfis, Figma a ser atualizado).

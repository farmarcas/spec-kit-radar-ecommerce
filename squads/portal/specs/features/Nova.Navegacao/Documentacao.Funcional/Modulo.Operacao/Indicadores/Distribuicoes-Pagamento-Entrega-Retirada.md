# Indicadores — Top Produtos Vendidos, Formas de Pagamento, Métodos de Entrega e Lojas com Retirada (Home de Vendas)

**Módulo:** Operação
**Histórias:** [ECP-1584](https://farmarcas.atlassian.net/browse/ECP-1584) (Top produtos mais vendidos), [ECP-1585](https://farmarcas.atlassian.net/browse/ECP-1585) (Formas de pagamento), [ECP-1586](https://farmarcas.atlassian.net/browse/ECP-1586) (Métodos de entrega), [ECP-1587](https://farmarcas.atlassian.net/browse/ECP-1587) (Lojas com retirada)
**Referência:** `Manual-Portal-Radar-Ecommerce.md`, seção 5.1 (linhas "Top produtos mais vendidos", "Formas de pagamento", "Métodos de entrega", "Lojas sem opção de receber em casa"), 5.3 (estados vazios), 5.4 (e-mails de relatório; relatório "Lojas com retirada ativa") e 6.2 (Formas de Entrega); `Base-Conhecimento-Bot-Portal-Radar-Ecommerce.md` (:368-371, :405-406, :903-916); **Figma:** a ser atualizado pela UX ainda nesta semana (layout, rótulos e textos finais pendentes) — os rótulos e textos citados são o texto atual do legado
**Relacionado:** [Home-Vendas-Visao-Geral.md](Home-Vendas-Visao-Geral.md), [Faturamento-Pedidos.md](Faturamento-Pedidos.md), [Filtro-GE-e-Macro-abas.md](Filtro-GE-e-Macro-abas.md), [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md); ECP-1576 (Faixa etária por gerações — fora do recorte atual; só citada: mesmo padrão de card de distribuição da Home)
**Status:** Em refinamento (cards em Backlog no Jira)
**Última atualização:** 2026-10-06

---

## 1. O que é

Quatro elementos da Home de Vendas que descrevem **como as vendas aconteceram**:

- **Top produtos mais vendidos (1584):** lista ranqueada (não é gráfico) com os **3** produtos com mais unidades vendidas no período, mais o botão "Baixar produtos" (relatório por e-mail).
- **Formas de pagamento (1585):** rosca Online × Offline com legenda detalhando Online (Crédito e Pix) e Offline (Balcão e Na entrega).
- **Métodos de entrega (1586):** rosca com 2 arcos, **"Receber em casa"** e **"Retirada"**.
- **Lojas com retirada (1587):** card sem número, só descrição e botão "Ver lojas com retirada", que solicita por e-mail a lista das lojas do contexto que oferecem **apenas** retirada, sem entrega em domicílio.

Os três primeiros são reconstrução 1:1; o quarto tem a **regra de enquadramento correta como entrega do card** (o legado só verifica se existe retirada). Todos os pontos de correção estão na seção 5. A entrega de cada História cobre front-end e back-end.

## 2. Estrutura de cada elemento

- **Top produtos (1584):** título com popover (título "Top produtos mais vendidos", posição abaixo; texto atual "Apresenta os produtos que tiveram o maior número de vendas no período, destacando os campeões de desempenho."); até 3 linhas, cada uma com posição (`1°`, `2°`, `3°`), nome (tooltip com o nome completo quando truncado), `EAN: ` + código, unidades (ex.: `12 unidades`; `1 unidade` no singular) e valor em R$ (ex.: `R$ 1.234,56`); botão "Baixar produtos" (ícone de download) abaixo da lista, só quando há pelo menos 1 produto; ao clicar, solicita a exportação assíncrona por e-mail e abre o modal **"Relatório gerado com sucesso"** ("O relatório gerado será encaminhado para o e-mail (e-mail do usuário) dentro de alguns minutos." + botão "Fechar"); falha: aviso de erro "Erro ao exportar planilha!" (ícone de erro, some em 3 s) e o modal de sucesso não aparece. Estado vazio: ilustração "sem dados" e "Sem dados... por enquanto!", sem o botão.
- **Formas de pagamento (1585):** título com popover (texto atual "Distribuição dos pedidos realizados no período, de acordo com o meio de pagamento utilizado."); rosca com 2 arcos (Online e Offline); tooltip `Categoria: quantidade (percentual%)` com quantidade em pt-BR (ex.: `Online: 1.240 (62%)`); legenda estática em 2 linhas — `Online` com o percentual sobre o total e ao lado `Crédito` e `Pix` (percentuais sobre o total de pagamentos online); `Offline` com o percentual sobre o total e ao lado `Balcão` e `Na entrega` (percentuais sobre o total de pagamentos offline). Estado vazio: anel cinza vazio e legenda com 0%.
- **Métodos de entrega (1586):** título com popover (texto atual "Mostra como os pedidos foram recebidos pelos clientes no período, diferenciando opções como Receber em Casa (entrega no endereço do cliente) e Retirada (o próprio cliente busca o pedido na loja ou ponto de coleta)."); rosca com 2 arcos; tooltip `Categoria: quantidade (percentual%)` com os **mesmos rótulos da legenda** (ex.: `Retirada: 310 (38%)`); legenda estática em 2 linhas ("Receber em casa", "Retirada") com percentual. Estado vazio: anel cinza vazio e legenda com 0%.
- **Lojas com retirada (1587):** ícone de loja, título, texto descritivo e botão "Ver lojas com retirada" (ícone de download). Textos provisórios (legado): título "Lojas com retirada" e descrição "Lojas que oferecem apenas a modalidade de retirada, sem opção de entrega em domicílio. Esse indicador ajuda a identificar associados que podem não ter operação logística para envio." Botão habilitado quando pelo menos 1 loja do contexto atende à regra; desabilitado quando nenhuma atende. Ao clicar: exportação assíncrona por e-mail + modal "Relatório gerado com sucesso" (o mesmo de Top produtos); falha: aviso de erro (3 s). O card não mostra número.
- Todos: skeleton (rosca com legenda de 2 linhas; lista de ranking; card com círculo, linhas e botão) e erro "Não foi possível concluir a ação. Atualize para tentar novamente." com botão "Atualizar" que recarrega só o elemento. Componentes novos criados do zero em React nos cards que primeiro os precisam (lista ranqueada, tooltip de texto truncado, popover de título, rosca com legenda de linhas, aviso/toast de erro, modal de relatório gerado, card de indicador com ícone/descrição/ação), genéricos e reutilizáveis.

## 3. Regras de negócio

### 3.1 Top produtos mais vendidos (1584)
- **Top 3** por unidades vendidas, ordenado do que vendeu mais para o que vendeu menos — decisão **"a princípio"** do PO (o limite atual no código já é 3).
- **Conta pedidos concluídos** (`Delivered` ou `Withdrawn`). Produto identificado pelo `ProductId`, com nome e EAN; itens sem `ProductId` não entram.
- **Unidades** = soma das quantidades (`Amount`); **valor** = soma de `Amount × PreçoUnitário`, **sem frete**, arredondado em 2 casas. Ex.: 2 unidades a R$ 10,00 + 3 unidades a R$ 10,00 → `5 unidades` e `R$ 50,00`.
- Sem critério de desempate entre produtos com as mesmas unidades; quando o mesmo `ProductId` aparece com nome/EAN diferentes, a consolidação mantém o do primeiro grupo encontrado (sem regra definida).
- **Data de referência:** `Finished.TriggeredAt` com o guard `Status != Finished.PreviusStatus`, igual ao Faturamento (confirmação da âncora em Pendências); mantém a condição de retorno de transação aprovado ou ausente.
- **Período** em dias de Brasília convertidos para UTC (Personalizado igual, na tela e na exportação). **Escopo:** pedidos das lojas do contexto, limitadas às lojas vinculadas ao usuário — na tela e na exportação; escopo vazio → lista vazia. Não exclui "Teste Interno". Sem cache de resposta.
- **Exportação:** assíncrona por e-mail para o usuário logado, com o mesmo contexto e período (inclusive Personalizado) da tela; o modal de sucesso só aparece quando a solicitação é aceita.

### 3.2 Formas de pagamento (1585)
- **Universo: pedidos concluídos** (`Delivered`/`Withdrawn`), decisão "a princípio" do PO; cancelados, com pagamento expirado e em andamento não entram. **Conta pedidos** (cada pedido concluído conta uma vez). Ex.: 10 concluídos, 6 pagos pelo app → Online 60%, Offline 40%.
- **Online / Offline:** tipo de pagamento do pedido (`Payment.PaymentType`, sem diferenciar maiúsculas/minúsculas); outro valor ou ausente = indefinido (não aparece na rosca nem na legenda).
- **Detalhe do Online:** `Payment.PaymentMethodType` — `Credit` → Crédito; `DigitalMoney` → Pix; outro = indefinido (não aparece na legenda). **Detalhe do Offline:** `Shipping.InStore` — `true` → Balcão; `false` → Na entrega. Pedido sem dados de pagamento ou de entrega não entra.
- Percentuais da legenda e do tooltip arredondados para inteiro (soma pode dar 99% ou 101%); total 0 → 0%.
- Âncora/período/escopo como em 3.1; não exclui "Teste Interno"; sem cache.

### 3.3 Métodos de entrega (1586)
- **Universo: pedidos concluídos** (`Delivered`/`Withdrawn`), decisão "a princípio" do PO; cancelados, com pagamento expirado e em andamento não entram. **Conta pedidos.** Ex.: 10 concluídos, 4 retirados → Receber em casa 60%, Retirada 40%.
- **Receber em casa** = `Shipping.InStore == false`; **Retirada** = `Shipping.InStore == true`; pedido sem `Shipping` não entra.
- Percentuais arredondados para inteiro; total 0 → 0%. Âncora/período/escopo como em 3.1; não exclui "Teste Interno"; sem cache.

### 3.4 Lojas com retirada (1587)
- **Definição do PO:** lojas que oferecem apenas a modalidade de retirada, sem opção de entrega em domicílio — ajuda a identificar associados sem operação logística de envio.
- **Regra de enquadramento (a implementar):** a loja do contexto atende quando, ao mesmo tempo, (a) está ativa (`pharmacy_data.Active = true`); (b) tem retirada na loja ativa — `shipping_strategy` com `In_Store = true` e `Enable_Shipping = true`; (c) **não** tem entrega em domicílio ativa — nenhuma `shipping_strategy` com `In_Store = false` e `Enable_Shipping = true` (loja sem nenhuma estratégia de entrega em domicílio também atende). A loja pode ter várias estratégias de entrega em domicílio (uma por faixa de raio); basta uma ativa para não atender. Retirada e entrega são identificadas por `In_Store`, não pelo nome da estratégia (varia entre cadastros antigos e atuais).
- `Enable_Shipping` é a chave Ativado/Desativado de cada forma de entrega (Manual :292 e :297). A mesma regra vale para a verificação do botão e para a exportação.
- **A lista é uma foto do estado atual das lojas e não depende do período** (selecionar Personalizado não pode causar erro). **Escopo:** lojas do contexto (Rede, Grupo/UF), limitadas às lojas vinculadas; Gestor de Loja vê só as próprias; escopo vazio → lista vazia e botão desabilitado.
- **Exportação:** assíncrona por e-mail ao usuário logado, com as colunas **Rede, CNPJ e Nome da loja** (Manual :218), usando o mesmo contexto da tela.
- Visível para Gestor de Loja, Gestor de Rede e Admin (a Home tem a mesma estrutura nos perfis).

## 4. Nível de integração / fonte de dados

### 4.1 Top produtos (1584)
**Query reaproveitada (ranking)** — Portal → BFF → Order (`order_data`, LINQ-to-Mongo com `.ToList()` e agrupamento em memória): front `POST /sales-and-marketing/v2/dashboard/indicators/sales/top-product-order` (`indicators.service.ts:116-118`); BFF `IndicatorSaleController.cs:356` → `Orders/Commands/GetTopProductOrder/GetTopProductOrderCommand.cs:25-34` (período, escopo, chamada a `salesIndicators/v1/top-product-order`), valor formatado `"R$ " + Math.Round(product.Total, 2).ToString("N2", pt-BR)` (`:48`); Order `SalesIndicators/Commands/PostTopProductOrder/PostTopProductOrderCommand.cs`:

```csharp
var revenueStatuses = new List<string> { "Delivered", "Withdrawn" };                          // :29
var filteredQuery = HelpersOrder.ApplyFilters(_collection.AsQueryable(), request);            // :37
var partial = filteredQuery.SelectMany(order => order.Products).Where(p => p.ProductId != null)
    .GroupBy(p => new { p.ProductId, p.Name, p.EAN })
    .Select(g => new { g.Key.ProductId, Name = g.Key.Name ?? string.Empty, Ean = g.Key.EAN ?? string.Empty,
        Count = g.Sum(p => p.Amount), Total = g.Sum(p => p.Amount * p.UnitPrice) })          // :39-50
var productsResult = productMap.Values.OrderByDescending(p => p.Count).Take((int)request.Limit)   // :73-75
```

com `public int? Limit { get; set; } = 3;` (`PostTopProductOrderRequest.cs:14`; o BFF não envia `Limit`). **O que faz:** para `Delivered` e `Withdrawn`, achata os itens dos pedidos do escopo criados no período, agrupa por produto, consolida as duas passadas por `ProductId` (`:58-69`), soma unidades e valor (sem frete), ordena por unidades e devolve as 3 primeiras; escopo vazio → lista vazia (`:22-25`). **O que NÃO faz:** não ancora na data de conclusão (filtra `CreatedAt`, `HelpersOrder.cs:426`); não aplica o guard de reprocessamento de ERP; sem desempate; não valida perfil (o BFF só exige usuário autenticado, `[Authorize]`, `IndicatorSaleController.cs:43`).

**Query reaproveitada (exportação "Baixar produtos")** — front `POST .../sales/report-indicators-top-product` (`indicators.service.ts:177-179`) → BFF `IndicatorSaleController.cs:789` → `Orders/Commands/ReportIndicatorTopProduc/ReportIndicatorTopProducCommand.cs`, que não consulta o banco e publica no Kafka (tópico `order.top.product.indicator.report`, `appsettings.production.json:19`):

```csharp
_kafkaTopic = _configuration["KAFKA_INDICATOR_SALES_TOP_PRODUCT"];                  // :28
request = await _validationOrderLayerService.ReportIndicatorTopProducRquestAsync(request);   // :35
request.Email = _tokenInfo.Identification;                                           // :37
var (InitDate, EndDate) = DateRangeHelper.GetDateRange(request.TypeIndicator);       // :38
request.TypeReport = TypeReportEnum.topSalesProduct;                                 // :40-42
```

**O que NÃO faz (exportação):** o consumidor do tópico (que gera o arquivo e envia o e-mail) **não foi encontrado nos repositórios acessados** (colunas, quantidade de linhas e regra do relatório não estão no código local); não lê os headers `x-pharmacy-id`/`x-pharmacy-network-id` (`IndicatorSaleController.cs:789-791`); não devolve erro quando a publicação no Kafka falha (responde 200 com o texto do erro em `Message`, `:50-52`/`:72-75`) e o front mostra o modal de sucesso sem ler a resposta (`indicators-sales-network.component.ts:1122-1124`).

### 4.2 Formas de pagamento (1585)
Front `POST .../sales/payment-method-order` (`indicators.service.ts:75-77`; cálculo dos totais da legenda em `indicators-sales-network.component.ts:744-788`); BFF `IndicatorSaleController.cs:186` → `PaymentMethodOrderCommand.cs:20-34`; Order `SalesIndicators/Commands/PostPaymentMethodOrder/PostPaymentMethodOrderCommand.cs`:

```csharp
var originalStatuses = Enum.GetNames(typeof(OrderStatus));                       // :29
foreach (var status in originalStatuses)                                          // :37
{   var filteredQuery = HelpersOrder.ApplyFilters(queryable, statusRequest)
        .Where(x => x.Payment != null && x.Shipping != null);                     // :47-48
    // Select { PaymentType ?? "Indefinite", PaymentMethodType ?? "Indefinite", InStore }   :50-56
    if (paymentType == "Offline") { var shippingType = inStore ? "Withdrawal" : "Delivery"; }   // :79-81
    // "CREDIT" => "CreditCard", "DIGITALMONEY" => "Pix", _ => "Indefinite"                       :128-130
```

Resposta: `{ Online, Offline, PaymentTypeOrder { CreditCard, Pix }, PaymentDeliveryTypeOrder { Delivery, Withdrawal } }`. Na tela (`indicators-sales-network.component.ts:754-756` e `:771-772`): `totalOnline = creditCard + pix`, `totalOffline = withdrawal + delivery`, `total = totalOnline + totalOffline`, e a rosca desenha `[dados.online, dados.offline]`.
**O que faz:** para cada um dos 11 valores do enum `OrderStatus` (`OrderStatus.cs:6-40`), conta os pedidos do escopo com pagamento e entrega por tipo, meio e forma de recebimento e soma os 11 resultados. **O que NÃO faz:** não limita a pedidos concluídos (conta todos os status, inclusive `Canceled`, `PaymentExpired` e em andamento); pode contar o mesmo pedido duas vezes (`Conference` e `NewConference` filtram ambos `Status == Conference`, `HelpersOrder.cs:529-535`); não aplica o guard de reprocessamento nem ancora na conclusão (filtra `CreatedAt`, `HelpersOrder.cs:346`); não devolve o "indefinido"; não valida perfil.

### 4.3 Métodos de entrega (1586)
Front `POST .../sales/delivery-method-order` (`indicators.service.ts:83-85`; `indicators-sales-network.component.ts:790-828`; rótulos em `indicators-sales-network.component.html:623` e `:635`); BFF `IndicatorSaleController.cs:84` → `DeliveryMethodOrderCommand.cs:16-29`; Order `SalesIndicators/Commands/PostDeliveryMethodOrder/PostDeliveryMethodOrderCommand.cs`:

```csharp
var originalStatuses = Enum.GetNames(typeof(OrderStatus)).ToList();                       // :36
foreach (var status in originalStatuses) {                                                // :41
    request.Status.Clear(); request.Status.Add(status);
    var filteredQuery = HelpersOrder.ApplyFilters(_collection.AsQueryable(), request);    // :47
    var orders = filteredQuery.Select(x => new { x.Shipping }).ToList();
    deliveryCount += orders.Count(s => s.Shipping != null && s.Shipping.InStore == false);   // :53
    withdrawalCount += orders.Count(s => s.Shipping != null && s.Shipping.InStore == true);  // :54 }
```

**O que faz:** por status (11), conta os pedidos do escopo por `Shipping.InStore`, soma e devolve `{ Delivery, Withdrawal }`. **O que NÃO faz:** mesmas limitações da seção 4.2 (todos os status, contagem dupla de Conferência, `CreatedAt` em `HelpersOrder.cs:131`, sem guard, sem validação de perfil).

### 4.4 Lojas com retirada (1587)
**Query reaproveitada (verificação do botão)** — front `POST .../sales/is-store-pickup-activated` (`indicators.service.ts:173-175`; chamada só pelo componente da visão de Rede, `indicators-sales-network.component.ts:558` e `:1029-1042`; card legado em `indicators-sales-network.component.html:655-706`, a visão de loja não o tem); BFF `IndicatorSaleController.cs:857-872` (sem cache) → `Orders/Commands/PostIsStorePickupActivated/PostIsStorePickupActivatedCommand.cs:16-21` (`PrepareBodyRequestAsync`, chama `pharmacy/is-stores-pickup`); Pharmacy `PharmacyController.cs:1063` → `Pharmarcies/Commands/PostIsStoresPickup/PostIsStoresPickupCommand.cs`:

```csharp
var clauses = new List<string>() { @" P.""Active"" = true AND SP.""In_Store"" = true AND SP.""Name"" = 'Retirada na loja' " };   // :17-22
if (request.PharmacyIds.Any()) { clauses.Add(@" P.""Id"" = ANY(@Ids) "); }                                                       // :24-27
// FROM public.pharmacy_data AS P LEFT JOIN public.shipping_strategy AS SP ON P."Id" = SP."Pharmacy_Id"                           // :40-43
postIsStoresPickupResponse.IsPickupDisabled = storesPickupDisabledResponse.Count == 0;                                          // :52
```

**O que faz:** `IsPickupDisabled = true` quando nenhuma loja ativa do escopo tem estratégia de retirada com o nome `Retirada na loja`. **O que NÃO faz:** não olha a entrega em domicílio (que é a definição do indicador); não olha se a retirada está ativa (`Enable_Shipping`); casa o nome literal `Retirada na loja` (cadastros antigos com `Retirada em loja` não casam, `20211123110000 - Add estimate to shipping table.sql:4`); não considera módulo da loja nem horário; com `PharmacyIds` vazio olha a plataforma inteira (`:24-27`); não lê os headers de loja/Rede (`IndicatorSaleController.cs:857-859`); não valida perfil (a restrição "só visão de Rede" existe só no front, rota `/indicators/network`).

**Query reaproveitada (exportação "Ver lojas com retirada")** — front `POST .../sales/report-indicators-store-pickup-activated` (`indicators.service.ts:185-187`; `indicators-sales-network.component.ts:1492-1511`) → BFF `IndicatorSaleController.cs:823` → `ReportIndicatorStorePickupActivatedCommand.cs`, que publica no Kafka (tópico `order.store.pickup.indicator.report`, `appsettings.production.json:21`; `TypeReport = storesActivePickup`). O serviço de lojas tem o endpoint de dados do relatório `POST stores-pickup-report` (`PharmacyController.cs:1046`; provavelmente o chamado pelo gerador do arquivo — **não confirmado**), cuja query traz `P.CNPJ`, `P.Name`, `PN.Name AS CorporatName` (`GetStoresPickupReportCommand.cs:37-39`) — campos compatíveis com as colunas Rede, CNPJ e Nome da loja — e filtra `Active = true AND In_Store = true AND Name = 'Retirada na loja' AND Enable_Shipping = false` (`:18-21`). **O que NÃO faz (exportação):** o consumidor do tópico **não foi encontrado nos repositórios acessados**; não lê os headers de loja/Rede (`IndicatorSaleController.cs:823-825`); não devolve erro quando a publicação falha (`:52`, `:72-75`; o front mostra o modal de sucesso, `indicators-sales-network.component.ts:1507-1509`).

## 5. Pontos de atenção / correção embutidos

**Top produtos (1584):**
- **Data de referência:** o legado filtra a data de **criação** (`HelpersOrder.cs:426`; a sobrecarga `ApplyFilters` para `PostTopProductOrderRequest`, `:406-440`, não tem ramo de data de conclusão) e não aplica o guard; a reconstrução ancora em `Finished.TriggeredAt` com o guard (igual ao Faturamento).
- **Exportação com período Personalizado lança exceção:** o comando calcula o período com `DateRangeHelper.GetDateRange(request.TypeIndicator)` sem passar as datas (`ReportIndicatorTopProducCommand.cs:38`); para `custom` o helper converte `(DateTime)initDate!` de um valor nulo (`DateRangeHelper.cs:22`) e lança exceção — o usuário vê "Erro ao exportar planilha!". A reconstrução repassa `InitDate`/`EndDate` ao cálculo.
- **Escopo da exportação (bug do `||`):** `ReportIndicatorTopProducRquestAsync` (`ValidationOrderLayerService.cs:334-376`) tem a condição `((Groups != null || Groups?.Count != 0) || (Networks != null || Networks?.Count != 0) || (States != null || States?.Count != 0))` (`:344-346`), sempre verdadeira → o relatório usa todas as lojas do usuário e ignora o contexto e os filtros Grupo/Rede/UF. A reconstrução resolve o escopo pela regra correta (`&&`, `PrepareBodyRequestAsync` `:65-106`): lojas explícitas → filtros Grupo/Rede/UF → loja do contexto → rede do contexto → lojas do usuário, sempre limitado às lojas vinculadas (a engenharia confirma o ponto de validação: `PharmacyIds` do body são aceitos sem checar o vínculo, `:68-74`). O escopo do **ranking** usa `PrepareBodyRequestAsync` (correto) e é mantido.
- **Falha silenciosa da exportação:** a reconstrução exibe o aviso de erro quando a solicitação não é aceita.
- **Janela de data "padrão A" (alarga ~24h):** o BFF monta o período em Brasília (`GetTopProductOrderCommand.cs:25`, `DateRangeHelper.cs:8-26`), o Order converte para UTC (`PostTopProductOrderCommand.cs:91-107`) e o filtro reaplica `.Date` sobre o valor em UTC (`HelpersOrder.cs:421-422`: `var start = request.InitDate.Value.Date; var end = request.EndDate.Value.Date.AddDays(1).AddTicks(-1);`): "Hoje" de 05/10 vira de 04/10 21:00 a 06/10 20:59 (Brasília). A reconstrução usa os limites do dia de Brasília em UTC, sem reaplicar `.Date`.
- **Cache e performance:** o ranking é cacheado 30 min em Redis (`appsettings.production.json:26`; chave `Cache:{userId}:{período}:{TipoDaResposta}` sem loja/Rede; ignorado só para período personalizado ou filtros explícitos, `ExecuteWithCache.cs:77-81`); a query achata os itens de todos os pedidos concluídos do escopo. Decisão do PO (2026-10-05): remover o cache de 30 min, índice composto `{pharmacy._id, status, finished.triggeredAt}` (hoje não existe) e, se a medição pedir, TTL curto (1–2 min) com chave de todo o escopo; decisão final por teste de carga (detalhes em [Home-Vendas-Visao-Geral.md](Home-Vendas-Visao-Geral.md), seção 8).

**Formas de pagamento (1585):**
- **Bases diferentes entre a rosca e a legenda:** a rosca desenha `online` e `offline` (contagens totais do back), enquanto os percentuais da legenda usam como total Crédito + Pix + Balcão + Na entrega; com pedido online de meio diferente de Crédito/Pix (indefinido), rosca e legenda deixam de bater. A reconstrução calcula rosca, tooltip e legenda sobre a mesma base (qual, em Pendências).
- **Escopo:** usa `PrepareBodyRequestAsync` (`&&`, `:76-78`), sem o bug do `||` (que afeta Faixa etária e Gênero); falta validar o vínculo (`:68-74`).
- **Janela "padrão A":** `HelpersOrder.cs:341-342` reaplica `.Date`; conversão para UTC em `PostPaymentMethodOrderCommand.cs:133-152`; mesma correção do Top produtos.
- **Data de referência e universo:** o legado filtra `CreatedAt` e percorre 11 status (11 consultas sequenciais); a reconstrução usa só `Delivered` e `Withdrawn`, ancorados em `Finished.TriggeredAt` com o guard (`ApplyPreviousStatusRule`, `HelpersOrder.cs:495-500`), em uma única consulta, mantendo `TransactionReturn` aprovado ou ausente (`:554`).
- **Cache e performance:** mesma decisão do Top produtos (cache de 30 min com chave sem loja/Rede; remover, índice por `finished.triggeredAt`, TTL curto opcional).

**Métodos de entrega (1586):**
- **Janela de data:** este endpoint não tem o alargamento "padrão A" (a conversão BRT→UTC é feita direto nas datas, `PostDeliveryMethodOrderCommand.cs:24-34`, e o filtro não reaplica `.Date`, `HelpersOrder.cs:117-122`/`:131`), mas o fim do dia vai como `23:59:59` sem milissegundos nos períodos Hoje, 7 dias, Trimestre e Ano (`DateRangeHelper.cs:13`; o Mês termina em 23:59:59.9999999, `:19`), deixando de fora 23:59:59.001–23:59:59.999. A reconstrução usa os limites do dia de Brasília em UTC com a data de pedidos concluídos (`Finished.TriggeredAt`, caminho existente em `HelpersOrder.cs:138-141`) e o guard (`:495-500`).
- **Rótulo do tooltip:** o legado mostra `Delivery` (rótulo interno, `indicators-sales-network.component.ts:811`) enquanto a legenda mostra "Receber em casa"; a reconstrução usa os rótulos da legenda nos dois.
- **Escopo:** `PrepareBodyRequestAsync` (`&&`), sem o bug do `||`; validar o vínculo (`:68-74`).
- **Universo e consultas:** 11 consultas sequenciais → só `Delivered`/`Withdrawn`, em uma única consulta, mantendo `TransactionReturn` aprovado ou ausente (`:554`).
- **Cache e performance:** igual ao Top produtos.

**Lojas com retirada (1587):**
- **Regra do indicador (entrega do card):** a verificação do botão pergunta só "existe retirada (com esse nome) nas lojas do escopo?" e a query do relatório pede `Enable_Shipping = false` na estratégia de **retirada** (`GetStoresPickupReportCommand.cs:21`), isto é, lojas cuja retirada está **desativada** — o oposto do nome "Ver lojas com retirada" e sem relação com a definição do PO; nenhuma verifica a entrega em domicílio. A reconstrução implementa a regra da seção 3.4 na verificação e na exportação. Referência ilustrativa (não é query existente; a implementação é da engenharia):

```sql
SELECT P."Id", P."CNPJ", P."Name", PN."Name" AS "CorporatName"
FROM public.pharmacy_data AS P
LEFT JOIN public.pharmacy_network AS PN ON P."Pharmacy_Network_Id" = PN."Id"
WHERE P."Active" = true AND P."Id" = ANY(@Ids)
  AND EXISTS (SELECT 1 FROM public.shipping_strategy SP WHERE SP."Pharmacy_Id" = P."Id" AND SP."In_Store" = true AND SP."Enable_Shipping" = true)
  AND NOT EXISTS (SELECT 1 FROM public.shipping_strategy SD WHERE SD."Pharmacy_Id" = P."Id" AND SD."In_Store" = false AND SD."Enable_Shipping" = true)
```

  Evidências no código (`ecomm-api-pharmacy-dotnet`) de que `Enable_Shipping` é a chave Ativado/Desativado e `In_Store` separa retirada de entrega: `UpdatePharmacyStorePickupCommand.cs:80-84` e `:102` ("Retirada em loja ativada/desativada"); `UpdatePharmacyConfigurationDeliveryCommand.cs:85-86` e `:92-100`; `PharmacyRepository.cs:304-306`; script `20221003143600 - Add shipping radius table.sql:20` (`Enable_Shipping boolean NOT NULL DEFAULT TRUE`); Manual :292 e :297.
- **Visibilidade por perfil:** o card legado só existe na visão de Rede; a reconstrução o exibe para Gestor de Loja, Gestor de Rede e Admin, com o escopo do perfil.
- **Exportação com período Personalizado lança exceção** (`ReportIndicatorStorePickupActivatedCommand.cs:38`; `IndicatorSaleController.cs:823-838`): a lista não depende do período; a reconstrução não pode falhar por causa do Personalizado.
- **Escopo da exportação (bug do `||`):** `ReportIndicatorStorePickupActivatedRequestAsync` (`ValidationOrderLayerService.cs:291-333`, condição em `:301-303`) → relatório com todas as lojas do usuário; a reconstrução usa a mesma regra correta da verificação, limitada ao vínculo. A verificação do botão já usa `PrepareBodyRequestAsync` (correta).
- **Falha silenciosa da exportação:** a reconstrução exibe o aviso de erro.
- **Escopo vazio olha a plataforma inteira** (`PostIsStoresPickupCommand.cs:24-27`, `GetStoresPickupReportCommand.cs:24-28`): a reconstrução devolve nenhuma loja (botão desabilitado, relatório sem linhas).

## 6. Cenários de borda

| Cenário | Regra |
|---|---|
| Produto vendido 2 un. num pedido e 3 un. noutro (R$ 10,00) | `5 unidades`, `R$ 50,00` |
| Produto com 1 unidade vendida | Legenda `1 unidade` (singular) |
| Pedido cancelado ou em andamento no período | Não entra em Top produtos, Formas de pagamento nem Métodos de entrega |
| Pedido concluído às 22h (Brasília) de 05/10 | Entra no período de 05/10, não no de 06/10 |
| Pedido criado em 04/10 e concluído em 05/10 | Entra no período de 05/10, não no de 04/10 |
| Sem vendas no período | Top produtos: "Sem dados... por enquanto!" sem botão; roscas: anel cinza vazio e 0% |
| Pedido online com meio diferente de Crédito/Pix | Indefinido: não aparece na legenda |
| Loja com retirada ativa e "Receber em casa" desativado (ou nunca configurado) | Atende; entra na lista de Lojas com retirada |
| Loja com retirada e entrega em domicílio ativadas | Não atende |
| Loja com retirada desativada, ou loja inativa | Não atende |
| Exportação com período Personalizado | Solicitação aceita, modal de sucesso (sem erro) |
| Falha na solicitação de exportação | Aviso de erro; modal de sucesso não aparece |
| Rede X selecionada | A lista de Lojas com retirada traz só lojas da Rede X |

## 7. Pendências / perguntas em aberto

- [ ] **Figma:** a ser atualizado pela UX ainda nesta semana (layout, rótulos e textos finais de títulos, popovers, legendas, tooltips, botões e estados).
- [ ] **Universo "somente pedidos concluídos"** (Top produtos, Formas de pagamento, Métodos de entrega): decisão "a princípio" do PO — confirmar; e, se confirmado, ajustar os textos dos popovers para "concluídos".
- [ ] **Âncora de data** (`Finished.TriggeredAt` adotada; o legado usa `CreatedAt`) — confirmar.
- [ ] **Top 3** é decisão "a princípio" do PO — confirmar. Desempate entre produtos com as mesmas unidades: definir? Texto do popover de Top produtos ("maior número de vendas" × ordenação por unidades): manter?
- [ ] **Relatório "Baixar produtos" (Vendas):** colunas, quantidade de linhas (Top 3 ou lista maior?) e formato do arquivo não estão documentados no Manual (a tabela de relatórios, :216-222, não tem linha para ele; só o nome do e-mail, :788) nem na Base de Conhecimento; o consumidor Kafka **não foi encontrado nos repositórios acessados** — a engenharia confirma onde vive e o conteúdo atual.
- [ ] **Formas de pagamento:** base dos percentuais (rosca e legenda sobre `Online`/`Offline` do back, que inclui o meio indefinido, ou sobre a soma Crédito + Pix + Balcão + Na entrega?); exibir categoria "Outros" para online de meio diferente de Crédito/Pix ou manter oculto?
- [ ] **Métodos de entrega:** texto do popover (manter, ajustando para "concluídos" no universo?).
- [ ] **Lojas com retirada — nome final do card e do botão:** o legado chama o card de "Lojas sem opção de receber em casa" e o relatório, no Manual, de "Lojas com retirada ativa" (:218); a UX anterior usava "Lojas com retirada em loja ativa" com "Apenas as lojas que possuem a opção de retirada em loja."; todos descrevem a mesma regra (só retirada, sem entrega em domicílio). Nome e texto finais ficam com a UX.
- [ ] **Módulo da loja:** o Manual (:218 e :222) e a Base de Conhecimento (:406 e :414) dizem que o relatório "deveria trazer só lojas do módulo Vendas sem entrega em domicílio" (ajuste pendente em ECP-1056), e hoje não filtra por módulo. Incluir "loja do módulo Vendas" (`sales_module.Status = 63` na linha mais recente da loja)? A definição do PO não cita o módulo.
- [ ] **"Entrega em domicílio ativa":** basta `Enable_Shipping = true` ou a loja precisa também ter horário e raio de atendimento configurados (Manual :293-295)? O mesmo vale para a retirada (horário e tempo de retirada, :298-299).
- [ ] **Colunas e regras do arquivo de Lojas com retirada:** consumidor do tópico `order.store.pickup.indicator.report` **não encontrado nos repositórios acessados**; engenharia confirma onde vive, quais dados consulta (se usa `stores-pickup-report`) e se aplica o período enviado na mensagem.
- [ ] **Texto do aviso de erro** da exportação de Lojas com retirada: hoje "Erro na importação!" (`indicators-sales-network.component.ts:1500`); os demais usam "Erro ao exportar planilha!" — qual usar?
- [ ] Validação do vínculo das lojas enviadas pelo cliente (`ValidationOrderLayerService.cs:68-74`) — engenharia confirma.

## Changelog

- **2026-10-06** — Criação do documento (v1), a partir dos cards ECP-1584 a ECP-1587 e das decisões do PO de 2026-10-05 (distribuições contam pedidos, limitadas a concluídos "a princípio", Top 3, definição de "lojas sem opção de receber em casa", remoção do cache) e de 2026-10-06 (métodos de entrega com legenda "Receber em casa"/"Retirada"; card de retirada = "só retirada, sem entrega em domicílio"; Home igual nos perfis e Gestor de Loja vê só as próprias lojas; Figma a ser atualizado).

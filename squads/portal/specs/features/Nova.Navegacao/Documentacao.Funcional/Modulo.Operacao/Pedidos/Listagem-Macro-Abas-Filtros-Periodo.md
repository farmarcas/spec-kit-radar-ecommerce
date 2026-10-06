# Pedidos — Listagem: Estrutura, Macro-abas, Filtros, Busca e Exportar

**Módulo:** Operação
**Histórias:** [ECP-1514](https://farmarcas.atlassian.net/browse/ECP-1514) (Estrutura da tela e integração com o Filtro Multicontexto), [ECP-1553](https://farmarcas.atlassian.net/browse/ECP-1553) (Macro-abas Em andamento e Finalizados com contador), [ECP-1554](https://farmarcas.atlassian.net/browse/ECP-1554) (Aba Finalizados), [ECP-1555](https://farmarcas.atlassian.net/browse/ECP-1555) (Filtro segmentado por status), [ECP-1556](https://farmarcas.atlassian.net/browse/ECP-1556) (Painel Todos os filtros e filtros aplicados), [ECP-1557](https://farmarcas.atlassian.net/browse/ECP-1557) (Busca), [ECP-1558](https://farmarcas.atlassian.net/browse/ECP-1558) (Exportar relatório)
**Referência UX:** [ECP-1314](https://farmarcas.atlassian.net/browse/ECP-1314) (Busca e Filtro), [ECP-1317](https://farmarcas.atlassian.net/browse/ECP-1317) (Seleção de lojas)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seções 6.1, 6.1.1, 6.2, 6.9
**Relacionado:** [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md), [Tabela-Colunas-Comportamento-SLA.md](Tabela-Colunas-Comportamento-SLA.md)
**Status:** Em desenvolvimento
**Última atualização:** 2026-10-02

---

## 1. O que é

A tela de Pedidos hoje não tem filtro, busca nem filtro global de lojas — lacuna sinalizada como prioridade Highest desde antes deste ciclo. Este documento cobre a estrutura de navegação da listagem: cabeçalho integrado ao filtro multicontexto, os 2 níveis de filtro (macro-abas + filtro segmentado), o painel avançado de filtros, a busca, o exportar, a regra de exibição por período e os estados de carregamento e erro. Cada elemento de tela é entregue por uma História própria (front + back).

## 2. Estrutura da tela

- **Cabeçalho:** título "Pedidos" + subtítulo contextual — "Pedidos referentes às lojas da categoria Vendas" (filtro em "Todas as Lojas") ou "Pedidos de N lojas selecionadas no filtro global" (singular: "1 loja selecionada"). À direita: campo de busca e botão "Exportar".
- **Macro-abas:** "Em andamento (N)" / "Finalizados (N)" — contam pedidos em cada bucket, dentro do contexto selecionado no header global. "Em andamento" exibe "+99" acima de 99.
- **Filtro segmentado dentro de "Em andamento":** Todos / Conferência / Na fila / Em separação / Liberados — single-select, default "Todos". Os segmentos não têm contador; os contadores ficam só nas macro-abas.
- **Filtro segmentado dentro de "Finalizados":** Todos / Concluídos / Cancelados, com badge "Limite 30 dias".
- **Painel "Todos os filtros"** (5 grupos, aplicação em conjunto, seleção múltipla dentro de cada grupo):
  - Tipo: Só medicamentos (pedido em que todos os itens são medicamento, conforme `IsMedicamento` do catálogo), Com receita (Rx)
  - Tipo de entrega: Entrega, Retirada
  - Prazo: Atrasado, 20 min para atrasar, Em tempo, Parado
  - Status de pagamento: Pago, Cobrar, Com troco
  - Método de pagamento: Pix, Dinheiro, Maquininha
- **Faixa de filtros aplicados:** badges removíveis por opção ativa, contador no botão ("Todos os filtros · 2"), ação "Limpar filtros".

## 3. Regras de negócio

### 3.1 Regra de exibição por período

- **Pedidos ativos** (qualquer status "Em andamento"): sem limite de período — aparecem até mudarem de status.
- **Pedidos finalizados** (Concluídos/Cancelados): só os últimos 30 dias por padrão, contados pela data do evento de encerramento (`Finished.TriggeredAt` para concluídos, `Canceled.TriggeredAt` para cancelados). A lista, o contador e o relatório exibem também os cancelados com motivo "Teste interno" — a exclusão desse motivo vale só para os indicadores da Home.
- **Busca:** varre todo o histórico, ignorando completamente o limite de 30 dias.

### 3.2 Combinação de filtros

- O filtro segmentado, o painel "Todos os filtros", a busca e o contexto do header se combinam (E). Entre grupos do painel os filtros se combinam (E); dentro de um grupo as opções somam (OU).
- A troca de macro-aba volta o filtro segmentado para "Todos".
- Sempre que o usuário entra na tela, os filtros da tela são refeitos (aba "Em andamento", segmento "Todos", sem filtros do painel, sem busca) e a ordenação padrão é aplicada; o contexto do header é mantido.
- "Restaurar filtros iniciais" limpa painel, busca e volta o segmento para "Todos".
- "Parado" usa a mesma definição da tag "Parado" (mais de 60 minutos sem movimentação) e cruza todos os status ativos; "Com receita (Rx)" usa o mesmo indicador do ícone Rx (arquivo de receita enviado); "Com troco" = pagamento em dinheiro com valor de troco informado.
- "Na fila" corresponde aos estados `created` ou `confirmed` do backend; "Conferência" ao estado `conference`.

### 3.3 Empty states

1. Gestor sem pedidos ativos no contexto — "Nenhum pedido aberto no momento" / "Sua fila está vazia. Que tal aproveitar este momento para criar uma oferta especial e atrair novos clientes para sua loja?" + ação "Criar nova promoção".
2. Balconista sem pedidos na fila — "Sua fila está vazia. Nenhum pedido aguardando" / "Pedidos novos aparecem aqui automaticamente. Enquanto isso, que tal convidar os clientes do balcão para baixar nosso app e conferir as ofertas?"
3. Filtro/aba sem resultado — "Nenhum pedido encontrado" / "Verifique seus filtros ou exporte sua lista completa." + ações "Exportar relatório" e "Restaurar filtros iniciais".
4. Busca sem correspondência — "Nenhum resultado encontrado" / "A busca procura em todo o histórico, independente do período. Tente buscar por outro termo ou verifique seus filtros." + ações "Limpar busca" e "Restaurar filtros iniciais".

### 3.4 Busca

- Campo no cabeçalho, placeholder "Buscar CNPJ, CPF, loja, cliente...", com ícone de busca e botão de limpar; a busca dispara ao digitar qualquer caractere, com debounce de 2 segundos, sem precisar confirmar.
- Busca por nome do cliente, CPF, nome da loja, CNPJ da loja e número do pedido — correspondência parcial, sem diferenciar maiúsculas de minúsculas.
- Com busca ativa, a tela mostra uma lista única de resultados: as macro-abas e o filtro segmentado ficam ocultos e voltam, como estavam, ao sair da busca; acima da tabela aparece a faixa "Resultados da busca para 'X'" com "N pedidos encontrados" e o botão "Todos os filtros"; os contadores das abas (totais do contexto) não mudam com a busca. Ordenação por cabeçalho na busca: Prazo, Data/Hora e Total (o Prazo ordena abertos pelo tempo restante e fechados pela data de encerramento, abertos antes dos fechados).
- Ignora macro-aba, segmento e a janela de 30 dias; mostra pedidos de todos os status — primeiro os em aberto (ordem padrão dos abertos, por prazo) e depois os fechados (ordem padrão dos fechados, encerramento mais recente primeiro). Combina com o painel de filtros e com o contexto do header; o escopo do perfil é respeitado (Balconista só a própria loja).

### 3.5 Exportar

- Botão "Exportar" no cabeçalho; menu com "Últimos 7 dias", "Últimos 30 dias", "Últimos 90 dias" e "Personalizado" (calendário de data inicial e final) e o botão "Gerar Relatório".
- Estrutura do relatório = a do relatório de pedidos atual. Cobre os pedidos do contexto selecionado no período escolhido; geração assíncrona, enviada por e-mail ao usuário ("O relatório gerado será encaminhado para o e-mail … dentro de alguns minutos").
- Mensagens: modal "Relatório gerado com sucesso"; erro sem datas "Selecione um período com data inicial e data final!"; falha "Erro ao solicitar relatório de pedidos!".
- Os períodos de 7/30/90 dias contam do dia atual para trás, incluindo o dia atual.

### 3.6 Estados de carregamento e erro

- **Troca de aba:** spinner sobre a lista; o filtro segmentado volta para "Todos".
- **Aplicação do filtro do header:** skeleton em macro-abas e tabela.
- **Filtro lento (mais de 8 s):** aviso persistente "Ainda carregando..." com "Tentar novamente" e botão de fechar.
- **Falha ao aplicar o filtro:** volta à seleção anterior + aviso persistente "Não foi possível aplicar o filtro" com "Tentar novamente".
- **Falha ao carregar a página:** "Não foi possível carregar essa página" / "Verifique sua conexão e tente novamente." + "Tentar novamente"; cabeçalho sem busca e exportar.

## 4. Nível de integração / fonte de dados

Pedidos vivem na coleção `edelivery_order.order_data` (`ecomm-api-order-dotnet`). Regras gerais válidas para qualquer filtro/relatório de status sobre essa coleção (ver [[feedback_status_change_query_rules]]):

- Filtrar mudança de status pelo campo do **evento** (`<status>.triggeredAt`), nunca por `updatedAt` — jobs de ERP reprocessam pedidos e reescrevem `updatedAt`/`triggeredAt` sem transição real.
- Incluir o guard `<statusSubdoc>.previusStatus != <status atual>` — sem ele, reprocessamentos de ERP inflam contagens (chegou a ~12% de diferença num caso real de faturamento).
- Datas no banco estão em UTC; o "dia" de negócio é sempre BRT (UTC-3) — somar 3h ao horário desejado em BRT antes de filtrar.

### 4.1 Query reaproveitada — listagem multi-loja (`POST /order/v3/get-orders`)

`ecomm-api-order-dotnet`, `Order/Commands/GetOrdersV3/GetOrdersV3Command.cs`, provável origem da listagem do Portal atual (que chama `/orders/v2/orders` pelo BFF de pedidos `ecomm-bff-backoffice-order-dotnet`, não revisado). Entrada: `Status[]`, `Number`, `CPF`, `PharmacyIds[]`, `InitDate`/`EndDate`, `InStore`, `TransactionReturn`, `Page`/`PageCount`, `OrderByAsc`/`OrderByDesc`.

- **Faz:** várias lojas; uma consulta por status (`HelpersOrder.ApplyFilters`) com a data de referência de cada status (`Finished`/`Canceled.TriggeredAt` nos finalizados, `CreatedAt` nos demais); número (contém, por termo) e CPF (contém); devolve por pedido o resumo, `Payment.Cost` (total com descontos), `Visualized` e `EstimateTimeFinish` (previsão de entrega/retirada); datas no fuso da loja; ordena por `CreatedAt`, `UpdatedAt` ou `EstimateTimeFinish`.
- **Não faz:** `Skip`/`Take` por status usando `Page`/`PageCount` como deslocamento/tamanho; ordenação em memória depois da paginação (só os pedidos já buscados); `Total` = quantidade devolvida (não o total do recorte) e `Quantity`/`CurrentPage` trocados — não sustenta "Mostrando X de Y"; sem busca por nome do cliente, nome da loja ou CNPJ; sem indicador de receita, de cliente recorrente nem tempo sem movimentação; `EstimateTimeFinish` calculado com uma chamada por pedido.
- **Listagem anterior (uma loja):** `GetOrdersCommand` — `$match` + `$facet` (total + página), ordenação no banco antes de paginar; aceita 1 `PharmacyId`.

### 4.2 Query reaproveitada — contadores (`GetOrdersCountersV3`)

`Order/Commands/GetOrdersCountersV3/GetOrdersCountersV3Command.cs`: para cada `OrderStatus`, `ApplyFiltersStatus` + `ApplyPreviousStatusRule` sobre `order_data`, devolvendo `{ Label, Total }`.

- **Faz:** aceita `PharmacyIds` (lista), `InitDate`/`EndDate`, `InStore`, `Number`; período BRT → UTC; data de referência por tipo de status (`Canceled.TriggeredAt`, `Finished.TriggeredAt`, `CreatedAt` para os demais).
- **Não faz:** exige `InitDate`/`EndDate` e aplica o período por `CreatedAt` também aos status ativos — a regra de "ativos sem limite de período" exige que o período não se aplique a eles; não agrupa por macro-aba.

### 4.3 Exportar — fluxo atual

Portal Angular: `POST /orders/report` com `{ isCanceled: false, pharmacyId, groupId, email, initDate, endDate, timezone }`; resposta abre o modal de confirmação com o e-mail do usuário. Recebe 1 loja (mais o grupo) por solicitação — o contexto multi-loja exige suporte novo. O serviço que gera o relatório e suas colunas não foram revisados.

### 4.4 Listagem de cancelados — fluxo atual

`Order/Commands/GetCanceledOrdersV1/GetCanceledOrdersV1Command.cs`: `HelpersOrder.ApplyFilters(..., "Canceled")` (período por `Canceled.TriggeredAt`), ordenada por `Canceled.TriggeredAt` decrescente, com `Skip`/`Take`. Não exclui o motivo "Teste interno" — comportamento mantido na tela nova.

### 4.5 Pontos de atenção do legado (BFF de pedidos `ecomm-bff-backoffice-order-dotnet`)

Confirmados em código em 2026-10-05; cada ponto está embutido como "Ponto de atenção / correção" na História correspondente.

- **Escopo de lojas vem do cliente e não é validado contra o perfil** (headers `x-pharmacy-id`/`x-pharmacy-network-id`, `pharmacyIds` do `localStorage`); sem o header a lista segue vazia e o order-service devolve pedidos de todas as lojas — ECP-1514.
- **Sem paginação real:** o BFF zera a página e usa a soma dos contadores como tamanho; `Convert.ToInt16` do contador de Concluídos/Retirados estoura acima de 32.767; ordenação padrão pelo primeiro status selecionado; contadores filtram abertos por `CreatedAt` e a lista não — ECP-1515.
- **Janela de concluídos de 7 dias no BFF** (`DAY_CONSULT_ORDER_FINISHED = -7`) enquanto a tela informa 30; cancelados usam 30 dias pelo relógio do servidor, sem fuso de Brasília — ECP-1554.
- **Busca por número/CPF só na rota V1** (uma loja ou grupo de busca, sem paginação, filtro por concatenação de texto); a listagem multi-loja não tem busca textual — ECP-1557.
- **Exportar:** `POST backoffice/orders/report` publica no Kafka `order.report` e responde sempre 200 (publicação não aguardada, exceção engolida); escopo vem do corpo; o consumidor do tópico não foi encontrado nos repositórios acessados — ECP-1558.
- **Sem tempo real:** o legado só faz polling de 1 minuto para o contador de novos; não há websocket/SignalR/SSE — ECP-1566.

## 5. Cenários de borda

| Cenário | Regra |
|---|---|
| Busca retorna pedido fora do período exibido (finalizado há 45 dias) | Aparece normalmente — busca ignora o limite de 30 dias |
| Filtro de Pedidos aplicado numa loja do módulo Ofertas | Empty state — Pedidos não existe para lojas Ofertas (ver [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md)) |
| Pedido ativo criado há mais de 30 dias | Aparece na lista e no contador de "Em andamento" |
| Troca de aba com segmento selecionado | Segmento volta para "Todos" |
| Grupo com volume alto de lojas/pedidos simultâneos | Sem volumetria validada — precisa de checagem de engenharia antes do rollout amplo (PRD seção 9) |

## 6. Pendências / perguntas em aberto

- [ ] Confirmar se a nova tela consome `edelivery_order` diretamente ou via Core Orders (novo módulo mencionado como pré-requisito arquitetural).
- [ ] Estratégia para a classificação "Só medicamentos": cruzar com o catálogo (`CatalogueDb.products.IsMedicamento`, pelo `productId` do item) na consulta ou copiar a classificação para o pedido (decisão de engenharia).
- [ ] Volumetria real de pedidos/lojas simultâneas por grupo — sem número validado (PRD seção 9).
- [ ] Estrutura exata (colunas) do relatório de pedidos a preservar na exportação.

## Changelog

- **2026-10-06** — Busca digitada com debounce de 2 segundos (regra geral do PO para todo filtro de busca digitada).
- **2026-10-05 (2)** — Adicionada a seção 4.5 com os pontos de atenção do BFF de pedidos legado (escopo vindo do cliente, paginação, janela de 7 dias para concluídos, busca V1, exportar com erro engolido, ausência de tempo real).
- **2026-10-05 (3)** — Seção 4.1 passa a documentar a listagem multi-loja V3 (a mais próxima do que o Portal precisa), com o que faz e não faz (paginação, total e ordenação); a listagem de uma loja só fica como referência.

- **2026-10-05 (2)** — Na busca, o Prazo volta a ordenar (abertos pelo tempo restante, fechados pela data de encerramento, abertos antes).

- **2026-10-05** — Busca passa a mostrar lista única de resultados, sem macro-abas e sem filtro segmentado (voltam ao sair da busca), com a faixa "Resultados da busca para 'X' · N pedidos encontrados"; a tag "Buscando em todo o histórico" foi substituída por essa faixa; na busca, ordenação por cabeçalho só em Data/Hora e Total.

- **2026-10-02 (3)** — Entrada na tela refaz filtros e aplica a ordenação padrão; resultados de busca com abertos antes dos fechados.

- **2026-10-02 (2)** — Segmentos do filtro segmentado sem contador (contadores só nas macro-abas); "Só medicamentos" definido pelo catálogo (`IsMedicamento`); lista, contador e relatório de Finalizados/Pedidos exibem cancelados com motivo "Teste interno" (a exclusão vale só para os indicadores da Home); Finalizados confirmado como concluídos + cancelados.

- **2026-10-02** — Reorganizado por elemento de tela (cada um com História própria: ECP-1514, 1553 a 1558). Opção "Alto custo" retirada do filtro; grupo "Itens" passa a "Tipo" com "Só medicamentos" e "Com receita (Rx)"; grupo "Tipo de pedido" passa a "Tipo de entrega". Adicionadas busca (nome do cliente, CPF, nome da loja, CNPJ, nº do pedido), exportar (períodos, geração assíncrona por e-mail), estados de carregamento e erro, textos finais dos empty states e as queries reaproveitadas (listagem, contadores, cancelados, exportação) com o que fazem e não fazem.
- **2026-09-30** — Criação do documento (v1), a partir de ECP-1514, ECP-1314/1317, PRD seções 6.1/6.1.1/6.2, e [[feedback_status_change_query_rules]].

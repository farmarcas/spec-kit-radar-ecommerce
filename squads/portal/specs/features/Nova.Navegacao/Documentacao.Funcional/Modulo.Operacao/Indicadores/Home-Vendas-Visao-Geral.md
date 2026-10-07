# Indicadores — Home de Vendas: Visão Geral

**Módulo:** Operação
**Histórias (índice):** [ECP-1546](https://farmarcas.atlassian.net/browse/ECP-1546), [ECP-1547](https://farmarcas.atlassian.net/browse/ECP-1547), [ECP-1548](https://farmarcas.atlassian.net/browse/ECP-1548), [ECP-1578](https://farmarcas.atlassian.net/browse/ECP-1578), [ECP-1579](https://farmarcas.atlassian.net/browse/ECP-1579), [ECP-1580](https://farmarcas.atlassian.net/browse/ECP-1580), [ECP-1581](https://farmarcas.atlassian.net/browse/ECP-1581), [ECP-1582](https://farmarcas.atlassian.net/browse/ECP-1582), [ECP-1583](https://farmarcas.atlassian.net/browse/ECP-1583), [ECP-1584](https://farmarcas.atlassian.net/browse/ECP-1584), [ECP-1585](https://farmarcas.atlassian.net/browse/ECP-1585), [ECP-1586](https://farmarcas.atlassian.net/browse/ECP-1586), [ECP-1587](https://farmarcas.atlassian.net/browse/ECP-1587), [ECP-1590](https://farmarcas.atlassian.net/browse/ECP-1590), [ECP-1605](https://farmarcas.atlassian.net/browse/ECP-1605) (e as Histórias do Detalhamento da Ruptura) — épico pai [ECP-1461](https://farmarcas.atlassian.net/browse/ECP-1461)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seção 5.1 (Indicadores)
**Referência:** `Manual-Portal-Radar-Ecommerce.md`, seções 5.1, 5.3, 5.4 e 5.5; **Figma:** a ser atualizado pela UX ainda nesta semana (layout, rótulos e textos finais pendentes) — os rótulos citados nestes documentos são o texto atual do legado
**Relacionado:** [Filtro-GE-e-Macro-abas.md](Filtro-GE-e-Macro-abas.md), [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md), [Faturamento-Pedidos.md](Faturamento-Pedidos.md), [Pedidos-em-Aberto.md](Pedidos-em-Aberto.md), [Distribuicoes-Pagamento-Entrega-Retirada.md](Distribuicoes-Pagamento-Entrega-Retirada.md), [Ruptura-Estoque-Home-e-Detalhamento.md](Ruptura-Estoque-Home-e-Detalhamento.md), [Home-Ofertas.md](Home-Ofertas.md)
**Status:** Em refinamento (cards no Jira em Backlog / Pronto para refinamento)
**Última atualização:** 2026-10-07

---

## 1. O que é

A Home de Indicadores é a primeira tela do módulo de Operação e reúne os indicadores de acompanhamento das lojas do contexto selecionado, organizados em duas macro-abas: **"Lojas de Vendas"** (este documento e os documentos de Vendas listados acima) e **"Loja de Ofertas"** ([Home-Ofertas.md](Home-Ofertas.md)). A reconstrução em React é **1:1 com o comportamento em produção**; cada divergência do legado (bug, janela de data errada, texto que não bate com a conta) é descrita no card do elemento como **Ponto de atenção / correção** e entra como entrega do próprio card. Cada elemento da tela é uma História própria (front-end + back-end), sem prescrição de onde o back-end vive (decisão da engenharia).

Este documento é o índice dos elementos da Home de Vendas e concentra as regras que valem para todos eles: estrutura, escopo por perfil, período em dias de Brasília, âncoras de data, decisão de cache e correções transversais.

## 2. Elementos da Home de Vendas (índice)

| Elemento | Card | Documento |
|---|---|---|
| Faturamento (aba do gráfico) | ECP-1546 | [Faturamento-Pedidos.md](Faturamento-Pedidos.md) |
| Pedidos cancelados (aba do gráfico + total do período no cartão da aba) | ECP-1547 | [Faturamento-Pedidos.md](Faturamento-Pedidos.md) |
| Pedidos concluídos (aba do gráfico) | ECP-1548 | [Faturamento-Pedidos.md](Faturamento-Pedidos.md) |
| Cancelamentos (container: GMV perdido, N/M pedidos + percentual, ticket médio dos cancelados) | ECP-1605 | [Faturamento-Pedidos.md](Faturamento-Pedidos.md) |
| Total de pedidos em aberto | ECP-1578 | [Pedidos-em-Aberto.md](Pedidos-em-Aberto.md) |
| Volume dos pedidos em aberto | ECP-1579 | [Pedidos-em-Aberto.md](Pedidos-em-Aberto.md) |
| Pedidos em aberto por status (rosca, com Conferência) | ECP-1580 | [Pedidos-em-Aberto.md](Pedidos-em-Aberto.md) |
| Tempo médio para iniciar o primeiro atendimento | ECP-1581 | [Pedidos-em-Aberto.md](Pedidos-em-Aberto.md) |
| Tempo total de atendimento | ECP-1582 | [Pedidos-em-Aberto.md](Pedidos-em-Aberto.md) |
| Média de itens por cesta | ECP-1583 | [Pedidos-em-Aberto.md](Pedidos-em-Aberto.md) |
| Top produtos mais vendidos (Top 3 + "Baixar produtos") | ECP-1584 | [Distribuicoes-Pagamento-Entrega-Retirada.md](Distribuicoes-Pagamento-Entrega-Retirada.md) |
| Formas de pagamento (rosca) | ECP-1585 | [Distribuicoes-Pagamento-Entrega-Retirada.md](Distribuicoes-Pagamento-Entrega-Retirada.md) |
| Métodos de entrega (rosca: "Receber em casa" / "Retirada") | ECP-1586 | [Distribuicoes-Pagamento-Entrega-Retirada.md](Distribuicoes-Pagamento-Entrega-Retirada.md) |
| Lojas com retirada (lojas só com retirada, sem entrega em domicílio) | ECP-1587 | [Distribuicoes-Pagamento-Entrega-Retirada.md](Distribuicoes-Pagamento-Entrega-Retirada.md) |
| Ruptura de estoque (container na Home) + Detalhamento da Ruptura | ECP-1590, 1593, 1595, 1597, 1600, 1601, 1602 | [Ruptura-Estoque-Home-e-Detalhamento.md](Ruptura-Estoque-Home-e-Detalhamento.md) |
| Filtro de GE (header da tela, Admin) | ECP-1512 | [Filtro-GE-e-Macro-abas.md](Filtro-GE-e-Macro-abas.md) |
| Macro-abas "Lojas de Vendas" / "Loja de Ofertas" com contador | ECP-1598 | [Filtro-GE-e-Macro-abas.md](Filtro-GE-e-Macro-abas.md) |

**Fora do recorte atual** (não fazem parte dos cards aprovados): Faixa etária por gerações ([ECP-1576](https://farmarcas.atlassian.net/browse/ECP-1576), existe no Backlog; só citado aqui), Gênero, Região, Ticket Médio, Ranking das lojas, o container "Novos pedidos aguardando" (o aviso de pedidos novos é o badge "Novos" do item Pedidos da sidebar, descrito no card de Pedidos), o botão "Exportar" do cabeçalho da Home (relatório "Pedidos Faturados") e o botão "Visualizar pedidos" do bloco azul de pedidos em aberto (relatório "Pedidos em Aberto"). O PO decide depois se algum deles vira História.

## 3. Estrutura da tela

- **Cabeçalho da página:** título "Indicadores", filtro de GE "Todos os GEs" (somente Admin), seletor de período e botão "Exportar" (ver "Fora do recorte atual"); abaixo, as macro-abas "Lojas de Vendas (N)" / "Loja de Ofertas (N)" (ECP-1598).
- **Conteúdo da macro-aba "Lojas de Vendas":** os elementos da tabela da seção 2. A **ordem e o layout dos elementos dependem do Figma que a UX atualiza nesta semana**; o Figma anterior serve só de exemplo (valores, percentuais e durações nele são ilustrativos). O texto de "última atualização" da Home (ex.: "Atualizado há 5 minutos") não está especificado — ver Pendências.
- **Períodos da macro-aba Vendas:** "Hoje", "Últimos 7 dias", "Últimos 30 dias", "Últimos 3 meses", "Últimos 12 meses" e "Personalizado". A macro-aba Ofertas não tem "Hoje" ([Home-Ofertas.md](Home-Ofertas.md)).
- **Recarga:** trocar período, filtro de GE ou contexto (Rede/Loja/Grupo) dispara uma chamada nova por elemento — não é filtro local. Os elementos que independem do período (pedidos em aberto, Lojas com retirada) recarregam só quando muda o contexto.
- **Estados por elemento:** cada elemento tem seu próprio skeleton, erro e vazio; o erro mostra a mensagem "Não foi possível concluir a ação. Atualize para tentar novamente." com botão "Atualizar" que recarrega só aquele elemento, e os demais seguem normais (texto atual do legado; texto final no Figma).
- **Componentes de UI** (gráfico de linha, rosca, tooltip, popover, skeleton, barra de progresso, modal "Relatório gerado com sucesso" etc.) são criados do zero em React dentro do primeiro card que precisar de cada um, de forma genérica e reutilizável; não há card de Design System.

## 4. Escopo e visibilidade por perfil

- **Perfis que acessam Indicadores:** Admin, Gestor de Rede e Gestor de Loja, todos com a **mesma estrutura de Home**. O **Gestor de Loja vê somente os dados das próprias lojas** — inclusive em Top produtos, Lojas com retirada e Ruptura. **Contato cliente (Balconista) não acessa** Indicadores: guard de rota (bloqueio por URL direta, com redirecionamento para a primeira tela a que o usuário tem acesso), definido em [ECP-1512](Filtro-GE-e-Macro-abas.md).
- **Filtro de GE:** só Admin.
- **Escopo de lojas:** as lojas do contexto aplicado no header global (Redes e Lojas — [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md)), limitadas às lojas vinculadas ao usuário, mais o GE quando Admin o aplica. Escopo vazio resulta em resposta vazia/zero, nunca em "todas as lojas" (ver 7.1).
- **Observação sobre a visibilidade dos blocos de pedidos em aberto:** o legado decide pela quantidade de lojas vinculadas; a decisão para a nova Home está em Pendências.

## 5. Período em dias de Brasília

Todos os elementos que dependem do período usam **dias de Brasília convertidos para UTC na consulta**: início = 00:00:00.000 do dia inicial (03:00 UTC); fim = 23:59:59.999 do dia final (02:59:59.999 UTC do dia seguinte). O período Personalizado usa o mesmo cálculo, na tela e nas exportações. Janelas dos atalhos (legado, `DateRangeHelper`): "Hoje" = hoje 00:00 a 23:59; "Últimos 7 dias" = de hoje − 6 dias até hoje; "Últimos 30 dias" = de hoje − 1 mês até hoje; "Últimos 3 meses" = de hoje − 2 meses + 1 dia até hoje; "Últimos 12 meses" = de hoje − 11 meses + 1 dia até hoje (janelas móveis, não meses de calendário). Agrupamentos de série (hora/dia/mês) também são feitos no dia de Brasília.

## 6. Âncoras de data (qual data cada indicador usa)

| Indicador | Âncora | Observação |
|---|---|---|
| Faturamento, Pedidos concluídos | `Finished.TriggeredAt`, guard `Status != Finished.PreviusStatus` | `Delivered` + `Withdrawn` |
| Pedidos cancelados | `Canceled.TriggeredAt`, guard `Status != Canceled.PreviusStatus` | exclui `canceledReason = "Teste Interno"` |
| Top produtos vendidos, Formas de pagamento, Métodos de entrega | `Finished.TriggeredAt` + guard (decisão do PO "a princípio": só pedidos concluídos) | o legado usa `CreatedAt`; âncora a confirmar |
| Ruptura de estoque (Home e Detalhamento) | `Finished.TriggeredAt` + guard | nunca a data da edição nem da liberação para "Na fila" |
| Pedidos em aberto (total, volume, rosca) | `CreatedAt`, janela fixa dos últimos 12 meses | **independe do período** da tela |
| Tempos de atendimento e média de itens por cesta | legado: `updatedAt` | âncora a decidir (ver [Pedidos-em-Aberto.md](Pedidos-em-Aberto.md)) |
| Lojas com retirada | — | foto do estado atual das lojas; não depende do período |
| Ofertas | ver [Home-Ofertas.md](Home-Ofertas.md) | |

**"Teste Interno":** só é excluído nos indicadores de cancelamento da Home; os demais indicadores não o excluem.

## 7. Correções transversais embutidas nos cards

### 7.1 Escopo de lojas
- **Bug do `||`:** `PrepareSalesBodyRequestAsync` tem a condição `Groups != null || Groups?.Count != 0` (sempre verdadeira, `ValidationOrderLayerService.cs:215`), que faz o endpoint ignorar o contexto de loja/Rede quando não há `PharmacyIds` explícitos. Afeta "Pedidos em aberto por status" (`orders-by-status`) e as exportações de Top produtos e Lojas com retirada (`:301-303`, `:344-346`). A reconstrução resolve o escopo pelo contexto selecionado (regra do `&&` de `PrepareBodyRequestAsync`, `:65-106`).
- **Escopo vazio olha a plataforma inteira** em consultas sem guard de lista vazia (pedidos em aberto, rosca, verificação de retirada); a reconstrução devolve 0/vazio.
- **Vínculo do usuário:** `PharmacyIds` enviados no body são aceitos sem checar se pertencem ao usuário (`ValidationOrderLayerService.cs:68-74`); a engenharia confirma onde essa validação passa a acontecer (regra do Filtro Multicontexto).

### 7.2 Janela de data
- **"Padrão A" (alarga cerca de 24 h):** o BFF monta o período em Brasília, o Order converte para UTC e o filtro reaplica `.Date` sobre o valor já em UTC (`HelpersOrder.cs`), de modo que "Hoje" de 05/10 cobre de 04/10 21:00 a 06/10 20:59 (Brasília). Afeta Top produtos e Formas de pagamento; a reconstrução usa os limites do dia de Brasília convertidos para UTC, sem reaplicar `.Date`.
- **Tempos de atendimento:** o `$match` usa `StartLocal`/`EndLocal` (Brasília, sem conversão) contra `updatedAt` em UTC; a janela fica 3 h antes do correto (efeito inferido). Corrigido na reconstrução.
- **Métodos de entrega** não tem o alargamento; o fim do dia vai como `23:59:59` sem milissegundos, o que deixa de fora 23:59:59.001 a 23:59:59.999.
- **Ruptura** já usa o dia de Brasília convertido para UTC sem alargar; mantém.

### 7.3 Outras correções
- **Erro de digitação "Whithdrawn"** na lista de status dos tempos e da média de itens (`PostTimeEstimatedOrdersCommand.cs:30`) descarta os pedidos `Withdrawn`; corrigido para `Withdrawn`.
- **Chamadas N+1 sem efeito** (Top produtos ativados, em Ofertas) são removidas.
- **Exportações assíncronas por e-mail (Kafka):** o BFF responde 200 mesmo quando a publicação no Kafka falha e o front mostra sempre o modal de sucesso; a reconstrução exibe aviso de erro quando a solicitação não é aceita. Exportação com período Personalizado lança exceção no legado (Top produtos e Lojas com retirada); a reconstrução trata o Personalizado.

## 8. Decisão de cache e performance (comum a todos os cards)

Decisão do PO (2026-10-05), aceitando a recomendação de engenharia:

- **Não reaproveitar o cache Redis de 30 minutos do BFF** (chave `Cache:{userId}:{typeIndicator}:{ResponseTypeName}`, `DataCaching.cs:80`; TTL de 30 min em produção, 5 min em desenvolvimento/homologação, 180 min em `isExtendedTime`). A chave **não inclui loja nem Rede do contexto** (`x-pharmacy-id`, `x-pharmacy-network-id`): ao trocar de contexto o elemento pode mostrar por até 30 minutos o dado do contexto anterior, e o número pode estar defasado em até 30 minutos. O cache é ignorado hoje só para período personalizado ou filtro explícito.
- **Criar índices compostos pela âncora de data** em `order_data` (ex.: `{ pharmacy._id, status, finished.triggeredAt }`; cancelados: `{ pharmacy._id, status, canceled.triggeredAt }`). Hoje só existe índice simples em `canceled.triggeredAt` e o composto `pharmacy._id + status + createdAt`. Medição de 2026-10-05: para a maior loja, a consulta examinou todo o histórico de 3.477 entregas para devolver 196 em 30 dias — o custo cresce com o histórico e com o número de lojas do escopo, não com o período. Dados: `order_data` ≈ 256 mil documentos; as 300 maiores lojas concentram ≈ 91%.
- **Somente se o teste de carga exigir:** TTL curto (1 a 2 minutos) com chave contendo **todo o escopo** (loja, Rede, grupo, estado e período, inclusive as datas do personalizado). Decisão final entre sem cache e TTL curto: engenharia, por teste de carga.
- Elementos de "agora" (pedidos em aberto, rosca) ficam sem cache.
- Ofertas: índices de `offer_data` e `active_offer_data` não estão definidos nos repositórios acessados; a engenharia confirma no Atlas.

## 9. Nível de integração / fonte de dados (cadeia geral)

```
Portal (front) → ecomm-bff-backoffice-indicator-dotnet (orquestração; resolução de escopo; cache hoje)
              → ecomm-api-order-dotnet (query real, LINQ-to-Mongo sobre a coleção order_data)
              → ecomm-api-offer-dotnet (Ofertas: offer_data / active_offer_data)
              → ecomm-api-pharmacy-dotnet (lojas, módulos, formas de entrega; Postgres)
```

A maior parte das consultas de Vendas é LINQ-to-Mongo com filtro no servidor e agrupamento/contagem em memória (não é aggregation pipeline), exceto os tempos de atendimento (agregação Mongo). **Onde esse back-end passa a viver no Portal novo é decisão de engenharia**: estes documentos descrevem o contrato e o comportamento a reaproveitar, sem prescrever destino de arquitetura. Exportações assíncronas (Top produtos, Lojas com retirada, Ofertas) publicam no Kafka; o consumidor que gera o arquivo e envia o e-mail **não foi encontrado nos repositórios acessados**.

## 10. Cenários de borda comuns

| Cenário | Regra |
|---|---|
| Troca de período | Todos os elementos que dependem do período recarregam; os independentes não |
| Troca de contexto/GE | Todos os elementos recarregam |
| Elemento falha | Só ele mostra erro com "Atualizar"; os demais seguem |
| Escopo de lojas vazio | 0 / lista vazia / botão desabilitado, nunca "todas as lojas" |
| Pedido re-finalizado por reprocessamento de ERP | Não conta de novo (guard `previusStatus`) |
| Contexto com só lojas de Ofertas | Comportamento da macro-aba de Vendas a definir (ver Pendências) |

## 11. Pendências / perguntas em aberto

- [ ] **Figma:** a ser atualizado pela UX ainda nesta semana (layout, ordem dos elementos, rótulos e textos finais).
- [ ] Texto/regra de "última atualização" da Home (o texto "Atualizado há 5 minutos" de um Figma anterior era exemplo; o legado também recarrega os indicadores a cada 30 minutos por temporizador, `indicators-network.component.ts:401-406`): não especificado até confirmação do PO.
- [ ] Visibilidade dos blocos de pedidos em aberto: no legado, depende do número de lojas vinculadas (Admin, Gestor de Rede e Gestor de Loja com mais de uma loja); com Home igual em todos os perfis, aparece para todos ou continua dependendo do número de lojas? (ECP-1578/1579/1580)
- [ ] Decisão "a princípio" do PO de limitar as distribuições (pagamento, entrega, top produtos) a pedidos concluídos, e a âncora `Finished.TriggeredAt` para elas — confirmar.
- [ ] Data de referência dos tempos de atendimento e da média de itens por cesta (`updatedAt` do legado × por evento).
- [ ] Faixa etária, Gênero, Região, Ticket Médio, Ranking de lojas, Exportar e "Visualizar pedidos": o PO decide depois.
- [ ] **Protótipo "Novo Portal - Navegável" de 07/10/2026 (referência de desenho; o Figma segue pendente):** (a) **Período:** o padrão do protótipo é "Hoje" e o seletor traz "Hoje", "Últimos 7 dias", "Últimos 30 dias" e "Este mês" (a lista da seção 3 é a do legado) — definir as opções finais e o padrão. (b) **Ordem dos elementos no protótipo:** gráfico com 3 abas em largura total; Ruptura de estoque + Cancelamentos; Ranking das lojas + Top 3 produtos mais vendidos; bloco azul de pedidos em aberto + rosca + tempos de atendimento e cartão duplo (Média de itens por cesta e Ticket Médio); Formas de pagamento + Métodos de entrega + Lojas com retirada em loja ativa. O **Ticket Médio** aparece como segunda metade do cartão duplo da Média de itens por cesta e não tem História própria (ver ECP-1583). (c) **Botões:** "Visualizar pedidos" (ícone de olho) é link para a tela de Pedidos; "Buscar produtos" (lupa) substitui "Baixar produtos" no Top produtos, sem ação definida (ECP-1584); "Ver lojas com retirada" é link para a Gestão de Lojas, módulo de Configuração em standby (ECP-1587). (d) O texto "Atualizado há 5 minutos" ainda aparece no cabeçalho do protótipo (texto que o PO decidiu não especificar). (e) Faixa etária, Gênero e Região têm componentes definidos no código do protótipo, mas a Home de Vendas não os renderiza. (f) **Rótulos do protótipo que divergem de decisões do PO e não foram aplicados nos cards:** abas do gráfico "Faturamento:", "Cancelados:" e "Pedidos:" (decidido: Faturamento, Pedidos cancelados, Pedidos concluídos); "Delivery" e "Retirada na loja" (decidido: Receber em casa e Retirada); rosca de pedidos em aberto sem a fatia Conferência (decidido: com Conferência); macro-aba "Lojas de Ofertas" (Figma: "Loja de Ofertas").
- [ ] Contexto selecionado só com lojas de Ofertas: estado da macro-aba de Vendas (ver [Filtro-GE-e-Macro-abas.md](Filtro-GE-e-Macro-abas.md)).
- [ ] Validação do vínculo das lojas enviadas pelo cliente (`ValidationOrderLayerService.cs:68-74`) — engenharia confirma.
- [ ] Consumidor Kafka das exportações assíncronas: não encontrado nos repositórios acessados.

## Changelog

- **2026-10-07** — Revisão dos cards de Indicadores contra o protótipo "Novo Portal - Navegável" (Claude Design, 07/10/2026): nova pendência com o desenho do protótipo (período "Hoje", ordem dos elementos, Ticket Médio no cartão duplo, botões "Visualizar pedidos", "Buscar produtos" e "Ver lojas com retirada", Faixa etária/Gênero/Região não renderizados) e os rótulos do protótipo que divergem de decisões do PO e não foram aplicados.
- **2026-10-06** — Divisão de escopo dos cancelados definida pelo PO: ECP-1547 = gráfico e totais de cancelados; ECP-1605 = container Cancelamentos (índice de elementos ajustado).
- **2026-10-06** — Inclusão do card "Cancelamentos" (ECP-1605) no índice de elementos; detalhes em [Faturamento-Pedidos.md](Faturamento-Pedidos.md), seção 3.4.
- **2026-10-06** — Criação do documento (v1), a partir dos cards ECP-1546 a ECP-1548, ECP-1578 a ECP-1587, ECP-1590 e das Histórias do Detalhamento da Ruptura, e das decisões do PO de 2026-10-05 (reconstrução 1:1 com correção embutida, cache) e 2026-10-06 (mesma estrutura de Home nos perfis, Gestor de Loja vê só as próprias lojas, Figma a ser atualizado, itens fora do recorte).

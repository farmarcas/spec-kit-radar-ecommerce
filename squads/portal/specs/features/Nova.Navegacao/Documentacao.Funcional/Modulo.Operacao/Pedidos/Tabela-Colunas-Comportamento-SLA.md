# Pedidos — Tabela: Colunas, Indicadores de Linha e Semáforo de SLA

**Módulo:** Operação
**Histórias:** [ECP-1515](https://farmarcas.atlassian.net/browse/ECP-1515) (Tabela com dados reais e paginação), [ECP-1550](https://farmarcas.atlassian.net/browse/ECP-1550) (Coluna Prazo: contagem regressiva e semáforo de SLA), [ECP-1551](https://farmarcas.atlassian.net/browse/ECP-1551) (Indicador de cliente recorrente), [ECP-1552](https://farmarcas.atlassian.net/browse/ECP-1552) (Ícone Rx), [ECP-1562](https://farmarcas.atlassian.net/browse/ECP-1562) (Tag Novo para pedidos ainda não abertos), [ECP-1563](https://farmarcas.atlassian.net/browse/ECP-1563) (Ordenação padrão da lista), [ECP-1565](https://farmarcas.atlassian.net/browse/ECP-1565) (Ordenação por coluna: Prazo, Data/Hora e Total), [ECP-1516](https://farmarcas.atlassian.net/browse/ECP-1516) (interações da linha: clique, tooltips)
**Referência UX:** [ECP-1312](https://farmarcas.atlassian.net/browse/ECP-1312) (Tabela: colunas e layout)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seções 6.3, 6.4
**Relacionado:** [Listagem-Macro-Abas-Filtros-Periodo.md](Listagem-Macro-Abas-Filtros-Periodo.md)
**Status:** Em desenvolvimento
**Última atualização:** 2026-10-02

---

## 1. O que é

A tabela precisa ser **preditiva, não reativa**: o objetivo é sinalizar antes do atraso acontecer, não só reagir depois. O modelo usa minutos absolutos (não percentual de SLA) e tem 2 eixos independentes que podem coexistir na mesma linha. Cada elemento da linha (coluna Prazo, estrela de recorrente, ícone Rx) é entregue por uma História própria sobre o contrato de listagem da ECP-1515.

## 2. Colunas e comportamento

- Colunas: Prazo, Data/Hora, Cliente, Status, Resumo, Tipo, Loja, Total — as 2 últimas (Loja e Total) fixas no scroll horizontal.
  - **Data/Hora:** data e hora de criação.
  - **Cliente:** nome + telefone; estrela quando cliente recorrente (2.2).
  - **Status:** chip do status; Cancelado com ícone de cancelamento.
  - **Resumo:** quantidade de itens, "(editado)" quando houve ajuste de itens, ícone Rx quando há receita (2.3) e situação do pagamento — "Pago" ou "Cobrar" ("Cobrar (com troco)" quando aplicável).
  - **Tipo:** Entrega ou Retirada + horário previsto ("Hoje às HH:MM"); em pedidos finalizados, a segunda linha mostra o horário de encerramento.
  - **Loja:** nome + CNPJ.
  - **Total:** valor total do pedido com frete; riscado quando Cancelado.
- Paginação "Mostrar mais": "Mostrando X de Y" (lote inicial de 25) e botão que acrescenta o próximo lote.
- Linha inteira clicável, abre o detalhe do pedido (ECP-1516); linha do pedido aberto destacada. Tooltips: nome completo do cliente quando truncado (mais de 22 caracteres) e lista de itens (`2x Nome · 1x Nome`) na coluna Resumo.
- Ordenação por clique em **Prazo, Data/Hora e Total (valor)**, como regra geral: refaz a listagem inteira ordenada pela coluna, com ou sem busca (na busca, abertos e fechados se misturam); demais colunas não reordenam. Na lista da busca (que mistura abertos e fechados), o Prazo ordena os abertos pelo tempo restante e os fechados pela data de encerramento, abertos antes dos fechados; Data/Hora e Total ordenam a lista toda. Em Prazo, crescente = menor tempo restante primeiro (atrasados primeiro); em Finalizados, a coluna Prazo mostra a data de encerramento e ordena por ela.
- **Entrada na tela:** sempre que o usuário entra, os filtros da tela são refeitos e a ordenação padrão é aplicada.
- **Ordenação padrão** (aplicada sempre que o usuário entra na tela): "Em andamento" por prazo — atrasados (vermelho) do mais atrasado ao menos atrasado; depois amarelos, do mais próximo de atrasar ao mais distante; depois os demais, do mais próximo de entrar no amarelo ao mais distante (equivale a ordenar o tempo restante até o prazo, do menor ao maior). "Finalizados": do encerramento (conclusão ou cancelamento) mais recente ao mais antigo.
- **Tag "Novo":** pedido ainda não aberto (sem evento de visualização), ao lado do horário na coluna Data/Hora; some ao abrir o detalhe. A visualização é do pedido, não por usuário.
- **Atualização da lista (ECP-1566):** com a tela aberta, a lista reflete quase em tempo real as mudanças dos pedidos já listados — status da linha; saída de "Em andamento" para "Finalizados" (e contadores) quando o pedido é concluído/cancelado por outro atendente, pelo ERP ou pelo cliente; saída da lista quando o pedido deixa de corresponder ao segmento/filtros ativos. Não refaz a ordenação. Hoje o Portal Angular atualiza por consulta periódica a cada 1 minuto (`interval(1 * 60 * 1000)`); a direção de arquitetura aprovada é tempo real (websocket/push). Mecanismo e latência: decisão de engenharia.
- **Chegada de pedidos novos:** com a tela aberta, a aba "Em andamento" ganha a tag "Novos" e aparece o aviso "N novos pedidos chegaram"; ao clicar, os novos entram no topo da lista, a tela volta para "Em andamento" (segmento "Todos", sem busca) e a tag da aba some.

### 2.1 Indicadores de linha — cliente recorrente

Estrela ao lado do nome quando o cliente tem **20 ou mais pedidos concluídos** (`Delivered`/`Withdrawn`) na **loja (CNPJ) do pedido**, em todo o histórico, sem recorte por data. Pedidos cancelados ou em andamento não contam; quem completa o 20º concluído passa a ser recorrente naquela loja; a estrela depende da loja da linha, não do conjunto do contexto. Aparece nas duas macro-abas. Chave de identificação do cliente (id do consumidor ou CPF) e estratégia de contagem (pré-computada ou na consulta) são decisão de engenharia.

### 2.2 Indicadores de linha — ícone Rx

Ícone "Rx" ao lado da quantidade de itens quando o pedido tem **arquivo de receita enviado** (lista `Prescriptions` do pedido não vazia). A regra é pelo envio do arquivo, sem cruzar com o cadastro do produto — a lógica de exigência de receita está no app. Aparece em todas as etapas e nas duas macro-abas. O mesmo indicador alimenta a opção "Com receita (Rx)" do painel de filtros.

## 3. Regras de negócio — Semáforo de SLA

### 3.1 Eixo 1 — prazo de entrega/retirada (cor da linha)

- **Amarelo:** faltando 20 minutos pro prazo estimado de entrega/retirada — é a mesma referência de tempo do "Atrasado", não duas coisas diferentes.
- **Vermelho/"Atrasado":** o pedido já excedeu o tempo de entrega/retirada. Cada loja pode configurar um tempo diferente (ex.: default 30 min) — todo pedido atrasado fica vermelho, independente de estar "Parado" ou não.
- Coluna Prazo: pedidos ativos mostram "Finalizar em:" + contagem regressiva (ex.: "1h 03min") ou "Atrasado em:" + tempo de atraso; pedidos finalizados mostram "Concluído em:" + data (Concluído) ou "Finalizado em:" + data (Cancelado), sem semáforo.

### 3.2 Eixo 2 — movimentação (tag "Parado")

Sem nenhuma movimentação por **mais de 60 minutos fixos**, sem personalização por loja neste ciclo (fica para 2027). Tooltip da tag: "Sem movimentação há X". O filtro "Parado" (painel de filtros) cruza todos os status ativos — Conferência, Na fila, Em separação, Liberados.

### 3.3 Independência dos eixos

Um pedido pode estar atrasado sem estar parado (chegou movimentação recente, mas o tempo de entrega configurado é curto) e vice-versa. Quando os dois se aplicam, a UI mostra os dois (linha vermelha + tag "Parado"). Semáforo e tag valem só para pedidos ativos.

## 4. Nível de integração / fonte de dados

Pedidos vivem em `edelivery_order.order_data` (`ecomm-api-order-dotnet`). Regras gerais de query sobre timestamps de status (ver [[feedback_status_change_query_rules]], aplicáveis também aqui):

- Qualquer cálculo de "tempo desde a última movimentação" (tag "Parado") usa o timestamp do **evento** mais recente de mudança de status real — não `updatedAt` puro, que reprocessamentos de ERP tocam sem transição de fato. Guard `previusStatus != status`.
- Timestamps no banco são UTC; o cálculo de tempo decorrido considera o fuso de Brasília.
- **Contrato de listagem (ECP-1515):** ver [Listagem-Macro-Abas-Filtros-Periodo.md](Listagem-Macro-Abas-Filtros-Periodo.md), seção 4.1 — a listagem atual aceita 1 loja por chamada e não devolve valor total, prazo consolidado, tempo sem movimentação, indicador de receita nem de cliente recorrente; esses campos são acrescentados pelas Histórias da tabela.
- **Cliente recorrente:** definição de pedido concluído reaproveitada dos Indicadores (`Delivered`/`Withdrawn`, `Finished.TriggeredAt`, guard `Status != Finished.PreviusStatus` — ver [Faturamento-Cancelados-Concluidos.md](../Indicadores/Faturamento-Cancelados-Concluidos.md)), sem janela de datas e agrupada por cliente e loja. Não existe hoje campo ou consulta de cliente recorrente.
- **Ícone Rx:** `OrderData.Prescriptions` (lista com nome do arquivo e URL) é exposta no detalhe como `OrderDetail.AttachmentUrls`; a listagem não traz nada de receita — o indicador é derivado de `Prescriptions` não vazio.
- **Prazo-limite / countdown:** prazo-limite = previsão de entrega/retirada do pedido (a mesma exibida na coluna Tipo e a que o app mostra): criação + tempo de retirada/entrega parametrizado pela loja no Portal, no fuso do consumidor (spec do App, FR-047 e FAQ); se passar do horário de funcionamento, vai para o próximo dia de funcionamento (ex.: amanhã às 09:00) e o countdown respeita essa data e hora. Countdown = prazo-limite − agora; a contagem parte sempre da criação.
- **O Portal já recebe o prazo-limite por pedido:** `POST /order/v3/get-orders` (`GetOrdersV3Command`) devolve `EstimateTimeFinish` (instante da previsão), calculado por `GetEstimateTimeCommand` (criação + tempo da loja respeitando o horário de funcionamento; retirada: `pharmacyTimeEstimation`; entrega: `EstimatedShippingMinutes` da faixa de raio que cobre a distância). O cálculo é feito na leitura, uma chamada por pedido (peso em listas grandes — ponto de engenharia); não devolve minutos restantes nem o estado do semáforo. No pedido, o app grava na criação só `Shipping.EstimatedDescription` (texto) e `Shipping.EstimateShippingMinutes`; `DeliverUntil` não é a previsão (nulo na criação, preenchido no aceite do fluxo antigo).
- **Tag "Novo":** `PATCH /order/{orderId}/visualized` grava `Visualized = { TriggeredAt, TriggeredBy, PreviusStatus }`; a listagem já devolve `visualized`. O filtro "novo" atual (`ApplyStatusFilter`, `OrderStatus.New`/`NewConference`) considera pedidos em `Pending`/Conferência com `Visualized == null`; pedido de pagamento online só conta com transação aprovada. O Portal Angular detecta a chegada comparando o contador `New` em consultas periódicas.
- **Ordenação:** a listagem V3 ordena em memória, depois de buscar e paginar, por `CreatedAt`, `UpdatedAt` ou `EstimateTimeFinish` (só os pedidos já buscados); não ordena por total (calculado em `Payment.Cost`) nem por data de encerramento dos fechados. A listagem anterior de uma loja só (`GetOrdersCommand`) ordena no banco antes de paginar.
- **Não confirmado:** onde roda o cálculo do semáforo (front, com tick, ou pré-computado no back).

## 5. Cenários de borda

| Cenário | Regra |
|---|---|
| Pedido a 20 min de atrasar | Linha amarela |
| Pedido já atrasado, com ou sem tag Parado | Linha vermelha, independente da tag |
| Pedido parado há 1h+, ainda dentro do prazo | Tag "Parado", sem vermelho |
| Cliente com 19 pedidos concluídos na loja | Sem estrela; com 20, estrela |
| Cliente com 25 concluídos na loja A e 3 na loja B | Estrela nos pedidos da loja A, não nos da B |
| Pedido sem receita enviada | Sem ícone Rx |
| Clique em coluna sem ordenação (Prazo, Cliente, Status, Resumo, Tipo, Loja) | Nada acontece |

## 6. Pendências / perguntas em aberto

- [ ] Fonte exata da configuração de "tempo de entrega/retirada" por loja.
- [ ] Onde roda o cálculo do semáforo (front vs. backend) e com que frequência atualiza.
- [ ] Volumetria/performance da tabela para grupos com muitas lojas/pedidos simultâneos (PRD seção 9) e custo da contagem de recorrência por linha.
- [ ] Avaliar com a engenharia gravar o instante da previsão no pedido ou calculá-lo em lote, em vez de uma chamada por pedido na listagem.
- [ ] Definir o que o modal mostra quando o pedido aberto é alterado por outra pessoa ou pelo ERP, e a latência aceitável de "quase em tempo real".

## Changelog

- **2026-10-05 (3)** — Prazo-limite: o Portal já recebe `EstimateTimeFinish` por pedido na listagem V3 (sem dependência da squad do App); registrados o custo por linha e a limitação de ordenação em memória.

- **2026-10-05 (2)** — Na busca, o Prazo volta a ordenar (ECP-1565).

- **2026-10-05** — Com busca ativa, o cabeçalho de Prazo não ordena; Data/Hora e Total ordenam (ECP-1565).

- **2026-10-02 (5)** — Ordenação por cabeçalho é regra geral e vale também na busca, misturando abertos e fechados (ECP-1565).

- **2026-10-02 (4)** — Adicionada a atualização da lista quase em tempo real (ECP-1566).

- **2026-10-02 (3)** — Countdown: prazo-limite = previsão calculada pelo app na criação (spec do App FR-047), respeitando o horário de funcionamento (previsão pode ser amanhã); ordenação por clique passa a incluir Prazo e é um card separado (ECP-1565); entrada na tela refaz filtros e aplica a ordenação padrão; resultados de busca com abertos antes dos fechados.

- **2026-10-02 (2)** — Adicionadas tag "Novo" (pedido ainda não aberto), chegada de pedidos novos, ordenação padrão (Em andamento por prazo; Finalizados pelo encerramento mais recente) e a fórmula do prazo-limite/countdown (previsão de entrega/retirada − agora), com o cálculo atual da previsão. Histórias ECP-1562 e ECP-1563.

- **2026-10-02** — Reorganizado por elemento de tela (Histórias ECP-1550, 1551, 1552 e interações da linha em ECP-1516). Adicionadas as regras de cliente recorrente (20 ou mais pedidos concluídos na loja, sem recorte por data), ícone Rx (pela existência de arquivo de receita enviado), detalhamento das colunas, paginação, tooltips e coluna Prazo para pedidos finalizados. Registrada a análise do contrato de listagem existente.
- **2026-09-30** — Criação do documento (v1), a partir de ECP-1515, ECP-1312, PRD seções 6.3/6.4.

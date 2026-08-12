# PRD — Edição de Pedidos na Etapa "Conferência"

**Produto:** Radar (Portal do Lojista)
**Squad:** E-commerce
**Autor:** Matheus (PO/PM)
**Status:** Em refinamento — base para geração de tarefas via Claude Code
**Versão:** 2.1

---

## 0. Changelog

**v2.1 (2026-08-11)** — Adicionada a regra de Troco (seção 8.2), validada no protótipo `troco-conferencia.html` (projeto claude.ai/design "Validação de ideias"). Gap identificado: o documento cobria estorno (pagamento no app) e "atualização do valor a cobrar" (pagamento offline), mas não descrevia como o troco em si deveria se comportar durante a edição. Card correspondente: [ECP-1260](https://farmarcas.atlassian.net/browse/ECP-1260).

**v2.0 (2026-07-31)** — Atualização com base nas discussões de refinamento e nos protótipos Figma atualizados (node `4566:7522` e `5295:3266`):

- **Renomeada a etapa de "Revisão" para "Conferência"** — nome adotado na implementação (cards ECP-1090, ECP-1015, ECP-1084, etc.). Todo o documento foi atualizado para usar o nome novo.
- **Removida a suposição de modal "Ajustar produto"** — a edição de quantidade acontece inline, direto na coluna "Quantidade" da tabela, via stepper único. Não existe modal no protótipo final.
- **Adicionado o modelo de "Rascunho"** (seção 6.6) — edições em Conferência são provisórias; commit único (persistência + Trilha de Auditoria) só ocorre na liberação para "Na fila".
- **Adicionado o corner case de split de preço promocional / "Limite por compra"** (seção 6.7) — novo, fora do escopo original desta v1.0.
- **Detalhada a Trilha de Auditoria** (seção 9) — catálogo de eventos ampliado, regra de atribuição de responsável, paginação, e regra de população ligada ao modelo de Rascunho.
- Diversos detalhes visuais confirmados: opacidade 50% em itens removidos, comportamento do banner de atenção ao navegar, ocultação da tag "Qtd. Original" a partir de "Na fila".

---

## 1. Contexto

Hoje, ao chegar um novo pedido no Portal do Lojista, ele é imediatamente disponibilizado para separação/liberação, e nas lojas que operam com fluxo de **pré-venda**, o pedido é replicado automaticamente para o ERP no momento da criação. Isso impede qualquer ajuste (ex.: item sem estoque, quantidade divergente) antes que o pedido já esteja "andando" nos sistemas externos, gerando retrabalho, pedidos cancelados por completo quando bastava remover um item, e experiência ruim para o cliente final.

## 2. Objetivo

Criar uma nova etapa obrigatória, **"Conferência"**, por onde todo pedido passa antes de seguir o fluxo normal. Nessa etapa, o lojista pode ajustar itens (reduzir quantidade ou remover produto) ou cancelar o pedido inteiro, **antes** que:
- lojas em fluxo de pré-venda tenham o pedido replicado para o ERP;
- o pedido seja disponibilizado para separação/liberação.

Isso reduz cancelamentos totais desnecessários, dá controle fino sobre o pedido antes da captura pelos sistemas externos, e garante rastreabilidade completa de qualquer alteração feita.

## 3. Escopo

### Dentro do escopo (V1 / protótipo)
- Nova coluna/etapa "Conferência" na tela de Pedidos.
- Todo pedido criado cai obrigatoriamente em "Conferência".
- Edição de quantidade de item (dentro de limites) e remoção de item — inline, via stepper na coluna "Quantidade" da tabela, sem modal.
- Cancelamento do pedido inteiro.
- Modelo de rascunho: edições provisórias até a confirmação de "Liberar para fila" (ver seção 6.6).
- Recálculo do split de preço promocional ("Limite por compra") ao editar item com promoção limitada, priorizando manter o máximo de unidades no preço promocional (ver seção 6.7).
- Bloqueio de replicação automática ao ERP (pré-venda) enquanto o pedido estiver em Conferência.
- Bloqueio de edição após captura pelo ERP.
- Trilha de Auditoria dentro do detalhe do pedido (movimentação de etapas + edições de item).
- Toasts e tags informativas de ação.
- Notificações push ao cliente final (pedido alterado/cancelado e estorno).
- Estorno automático via Braspag para pedidos pagos no app.
- Requisitos de rastreamento de eventos para indicadores futuros (fase 2).

### Fora do escopo (V1)
- Tela de histórico global/auditoria entre pedidos (só existe dentro do detalhe do pedido).
- Campo de "motivo da edição".
- Dashboard de indicadores (UI) — apenas os requisitos de dados/eventos ficam definidos aqui.
- Protótipo da tela de detalhe do pedido no app do cliente final (dependência de UX, fora deste PRD).
- SLA/timeout automático de tempo máximo em Conferência (não definido nesta versão).
- Definição de copy das notificações push (dependência de UX).
- Promoções com múltiplas faixas de desconto por "Limite por compra" — hoje só existe 1 faixa configurável por promoção (1 a 15 unidades, ou "Sem limite").

## 4. Personas

- **Balconista/Operador de loja (usuário "João Silva" nos mockups):** realiza as edições no Portal do Lojista.
- **Cliente final:** recebe notificações sobre alterações e estornos.
- **Time financeiro/Integração ERP:** consome o status "Cancelados" e os pedidos liberados da fila.

## 5. Máquina de estados do pedido

```
[Criado] → Conferência (obrigatório — edições ficam em "Rascunho" até liberar)
              │
              ├── Editar item (reduzir/remover/restaurar) → permanece em Conferência,
              │     pedido marcado com tag "Rascunho" enquanto houver edição pendente
              ├── Cancelar pedido inteiro → Cancelados (também replicado ao ERP com status cancelado)
              └── Liberar para fila (commit do rascunho) → Na fila
                          │
                          ▼
                  [Captura pelo ERP] (loja pré-venda: só acontece a partir daqui,
                          exatamente nesta transição — não há evento de captura separado)
                          │
                          ▼
                     Em separação → Liberados → Concluídos
```

Observações importantes:
- **Pré-venda:** a replicação automática para o ERP só ocorre quando o pedido sai de "Conferência" para "Na fila". Lojas sem pré-venda também passam por Conferência (decisão de simplificação de fluxo), mas a diferença de comportamento de integração pode ser tratada por configuração de loja, não por lógica de tela.
- **Pós-captura:** a partir do momento em que o pedido é capturado pelo ERP (ou sai de "Na fila"), a edição de itens deixa de ser permitida em qualquer tela.
- **Cancelamento:** pedidos cancelados na etapa Conferência vão direto para "Cancelados" **e esse status desce para o ERP também** — ou seja, o ERP é notificado do cancelamento mesmo que o pedido nunca tenha chegado a ser "capturado" no sentido operacional. Isso deve ser tratado como requisito de integração explícito.
- **Commit único (modelo de Rascunho):** a persistência definitiva das edições e o registro na Trilha de Auditoria só ocorrem no momento da liberação para "Na fila", não a cada edição. Ver seção 6.6.

## 6. Regras de negócio

### 6.1 Edição de quantidade de item
- Edição acontece **inline**, direto na coluna "Quantidade" da tabela de itens, via um stepper único (−/+) por linha — **não existe modal** ("Ajustar produto") no protótipo final; essa era uma suposição da v1.0 deste PRD e foi corrigida.
- Cada item pode ter sua quantidade editada entre **1 (mínimo) e a quantidade original comprada pelo cliente (máximo)** — o teto de reversão é por item individual (ex.: cliente comprou 6 unidades do Item A → esse item pode variar de 1 a 6, independentemente do que aconteceu com outros itens do pedido).
- Não é possível reduzir a quantidade até 0 pelo stepper — esse caminho é sempre "Remover produto do pedido" (ação distinta, ícone de lixeira).
- Botão "−" fica desabilitado ao chegar em 1. Botão "+" fica desabilitado ao chegar na quantidade original; clicar mesmo assim exibe um balão "Qtd. máx. permitida" por 2 segundos.
- Digitação manual de um valor acima do limite: campo com borda vermelha, mensagem de erro abaixo do input, e bloqueio do botão "Liberar para fila" até a correção.
- Quando a quantidade é alterada, exibir o label "Qtd. Original: X" abaixo do nome do produto — esse label **deixa de ser exibido a partir de "Na fila"** (ver 6.5).

### 6.2 Remoção de item
- "Remover produto do pedido" só fica disponível quando, após a remoção, **restar pelo menos 1 item no pedido**.
- Item removido: linha com **tachado + opacidade 50%**, quantidade "0", preço "R$ 0,00", e ícone de desfazer (↺) que restaura a quantidade anterior.
- Quando o pedido chega a ter **apenas 1 item restante** (independente de quantas unidades esse item tenha):
  - a opção "Remover produto do pedido" desaparece da modal/linha para esse item;
  - a edição de quantidade desse item continua disponível normalmente (dentro do teto 1–original);
  - a única forma de "zerar" o pedido a partir daqui é cancelar o pedido inteiro.
- Item removido continua visível (tachado, opacidade 50%) enquanto o pedido está em Conferência; só desaparece da lista quando o pedido é liberado para a fila (ver 6.5).

### 6.3 Regra especial de pedido com 1 item x 1 unidade
- Quando o pedido nasce com (ou é reduzido a) **exatamente 1 item e 1 unidade**, a edição fica bloqueada por completo (nem reduzir, nem remover fazem sentido) — a única ação disponível é **cancelar o pedido inteiro**.
- Esse é um caso particular da regra 6.2: com 1 item e 1 unidade, não há quantidade para reduzir (mínimo já é 1) nem item para remover isoladamente sem esvaziar o pedido.
- Ver também 6.8 (banner vermelho de bloqueio total quando esse cenário é causado por falta de estoque).

### 6.4 Cancelamento do pedido inteiro
- Ação independente da remoção item a item (botão dedicado — o "X" no cabeçalho do pedido nos mockups).
- Disponível em qualquer momento durante a etapa Conferência, independentemente de quantos itens/unidades o pedido tenha.
- Ao cancelar: pedido move direto para a coluna "Cancelados"; esse status é replicado ao ERP (ver seção 5).

### 6.5 Bloqueio pós-captura ("Na fila" em diante)
- Após o pedido sair da etapa "Conferência" (capturado pelo ERP / movido para "Na fila" em diante), nenhuma edição de item ou cancelamento parcial é mais permitida pela tela de Pedidos nesse fluxo. (Cancelamentos após esse ponto, se existirem, seguem outro fluxo já existente e não fazem parte deste PRD.)
- A tabela de itens passa a ser **somente leitura** (campo de visualização de quantidade, não editável).
- **Ocultar:** linhas de itens excluídos (desaparecem da lista, mas permanecem na Trilha de Auditoria); tag/label "Qtd. Original: X".
- **Manter:** tags de "Fora de estoque", se aplicável.

### 6.6 Modelo de Rascunho
- Enquanto o pedido está em Conferência, toda edição (quantidade ajustada, item removido/restaurado, recálculo de split promocional) é **provisória** — o pedido exibe a tag "Rascunho" no cabeçalho e na lista a partir da primeira edição pendente.
- O cálculo/recálculo (subtotal, split promocional, "Ajustes de itens") é **visual e dinâmico em tempo real** conforme o operador interage com a tela, mas **não é persistido** (nem no banco, nem na Trilha de Auditoria) até o commit.
- **Commit único:** a persistência definitiva de todas as edições, e o registro correspondente na Trilha de Auditoria, só ocorrem na confirmação de "Liberar para fila" — mesmo momento da transição Conferência → Na fila. Os eventos registrados mantêm o **timestamp original** de quando a edição foi feita, não o momento da liberação.
- Se o operador tentar fechar a aba ou navegar para fora do pedido com rascunho pendente (edições não confirmadas), o sistema exibe a modal "Sair e descartar rascunho?", com opção de continuar editando ou descartar as alterações.

### 6.7 Split de preço promocional ("Limite por compra")
Corner case identificado durante o refinamento (fora do escopo original da v1.0): promoções podem ter um "Limite por compra" configurado na criação da oferta (valor único: 1 a 15 unidades, ou "Sem limite" — nunca múltiplas faixas). Hoje, quando o cliente compra mais unidades do que esse limite, o pedido já nasce com **2 linhas** para o mesmo produto: uma no preço promocional (até o limite) e outra no preço de loja (o excedente).

- O produto é exibido como uma **linha-pai** com um **stepper único** (mesmas regras da seção 6.1: min 1, máx = quantidade original) e duas **linhas-filhas somente leitura**: "Promo: até X" e "Preço loja (excedente)". As linhas-filhas não têm controle de edição próprio.
- **Redução:** drena primeiro a linha "Preço loja (excedente)"; só reduz a linha "Promo" depois que o excedente chegar a 0. (Ex.: 6 un. = 5 promo + 1 excedente → reduzir 2 → 4 un. = 4 promo + 0 excedente.)
- **Restauração:** preenche a linha "Promo" até o limite da promoção primeiro; só depois volta a preencher o excedente. (Ex.: 4 → restaurar para 6 → 5 promo + 1 excedente.) Regra simétrica à redução.
- **Remoção total:** remove as duas linhas-filhas juntas (tachado + opacidade 50% + ícone de desfazer únicos, mesmo padrão da seção 6.2) — **não existe cancelamento parcial de apenas uma linha-filha**.
- Promoção "Sem limite de unidade" não gera split — segue o comportamento padrão de item único (uma linha, tag "Promo", sem linhas-filhas).
- Segue o modelo de Rascunho da seção 6.6: o recálculo do split é visual/dinâmico em Conferência, só persiste no commit.
- O bloco financeiro "Ajustes de itens"/diferença de valor deve refletir o preço efetivo recalculado (não uma média simples por unidade) — isso impacta diretamente o valor do estorno automático via Braspag (ver seção 8).
- **Dependência aberta:** onde vive hoje a lógica de "Limite por compra" (motor de preços/promoções vs. serviço de pedidos) — a ser investigado pelo time tech ao entrar no card de implementação, não bloqueia o refinamento funcional.

### 6.8 Banner de atenção (item sem estoque)
- **Banner amarelo** (pedido com 2+ itens, ao menos 1 pendente de ajuste): "1 item requer atenção antes da liberação" / "Ajuste as quantidades dos produtos ou remova-os da lista para liberar o pedido".
- **Banner vermelho** (bloqueio total — pedido com exatamente 1 item e 1 unidade sem estoque, ver 6.3): "Pedido requer cancelamento por falta da unidade em estoque." — o item perde stepper e ícone de remoção; só resta cancelar o pedido inteiro.
- Banner desaparece quando todas as pendências forem resolvidas.
- O banner é dispensável ("fechar"), mas isso não é uma resolução definitiva: se o operador fechar o banner e depois navegar para outra aba ou outro pedido e voltar, o banner **reaparece automaticamente** enquanto o pedido ainda tiver item(ns) sem estoque não resolvidos.

## 7. Notificações ao cliente final

Todas via **push notification no app do cliente**. Dois eventos únicos e consolidados (não uma notificação por item alterado):

| Evento | Gatilho | Observação |
|---|---|---|
| Pedido alterado/cancelado | Disparado quando o pedido sai da etapa Conferência com pelo menos uma alteração registrada (item reduzido/removido) ou quando é cancelado | Notificação única mesmo que múltiplos itens tenham sido alterados |
| Estorno realizado | Disparado quando a Braspag confirma o estorno automático | Apenas para pedidos pagos no app |

Regras por forma de pagamento:
- **Pago no app:** estorno automático via Braspag → dispara notificação de estorno além da notificação de alteração.
- **Pago offline (na entrega):** não há estorno automático (não houve cobrança prévia) → o cliente recebe apenas a notificação de alteração, com tom de "atenção: o valor do seu pedido foi alterado" (sem falar de estorno).

Copy final das notificações e o protótipo da indicação de "pedido editado" na tela de detalhe do pedido do app do cliente são **dependências de UX**, não bloqueantes para o desenvolvimento da lógica de backend/tracking.

## 8. Estorno e Troco

### 8.1 Estorno (pagamento no app)

- Estorno **automático** via integração com **Braspag**, aplicado apenas a pedidos com pagamento feito no app.
- Valor do estorno = diferença de subtotal gerada pela edição/remoção do item (campo "Ajustes de itens" já existente no bloco financeiro).
- **Item com split promocional (seção 6.7):** a diferença não pode ser calculada como "quantidade removida × preço unitário original" — o preço efetivo por unidade muda conforme quantas unidades ficam dentro do limite promocional após a edição. O estorno deve refletir a diferença real entre o subtotal cobrado originalmente (composição promo/excedente de então) e o subtotal recalculado (nova composição).
- Pedidos pagos offline não geram chamada de estorno — apenas atualizam o valor "a cobrar do cliente" na entrega e disparam a notificação de alerta de valor alterado (ver 8.2 para o caso de pagamento em dinheiro).

### 8.2 Troco (pagamento em dinheiro na entrega)

Corner case identificado durante a validação do protótipo `troco-conferencia.html` (fora do escopo original da v2.0): o bloco financeiro hoje mostra só o resultado ("Troco"), sem revelar de onde ele vem, e esse cálculo nunca havia sido pensado junto com a edição de itens.

- Aplica-se **apenas** a pedidos com pagamento em dinheiro na entrega ("pago offline"). Não se aplica a pedidos pagos no app (crédito/débito/PIX) — esses seguem a regra de estorno da seção 8.1.
- O bloco financeiro passa a exibir a linha **"Cliente vai pagar com: R$ X"** — valor informado pelo cliente no app no momento da compra. Esse valor **não muda** com a edição do pedido.
- **Troco = valor informado pelo cliente − subtotal atual** (após os "Ajustes de itens").
- Como a Conferência só pode reduzir o subtotal (nunca aumentar), o **troco só pode subir, nunca fica negativo**.
- Ao editar/remover item, o troco é recalculado em tempo real e exibe um indicador de variação (ex.: "↑ R$ 89,90") comparado ao valor de troco antes da edição.
- Segue o modelo de Rascunho da seção 6.6: o recálculo é visual/dinâmico em Conferência, só persiste no commit ("Liberar para fila").
- Card correspondente: [ECP-1260](https://farmarcas.atlassian.net/browse/ECP-1260).

## 9. Trilha de Auditoria

Exibida dentro do detalhe do pedido (não há tela global nesta versão). Dois tipos de card visual: "Evento: Mudança de status" (indicador azul/neutro) e "Evento: Alterações do usuário" (indicador amarelo = "Quantidade ajustada", vermelho = "Produto removido").

**Catálogo de eventos:**
- Enviado para fila
- Enviado para separação
- Pedido liberado
- Pedido cancelado
- Pedido concluído
- Alerta de Estoque
- Pedido recebido do app
- Produto removido
- Quantidade ajustada (ex.: "Buscopan composto de 2 para 1 un.")

**Regras:**
- Eventos em ordem cronológica decrescente: título, detalhe, responsável e data/hora.
- **Atribuição do responsável:** se o evento/mudança de status vier do ERP → responsável = "Sistema"; se vier de uma ação manual no Portal → responsável = nome de quem executou a ação.
- Sufixo "(ERP)" quando a movimentação é originada pelo ERP (ex.: "Enviado para fila (ERP)").
- **Paginação:** mostrar os 5 primeiros registros por padrão; se houver mais de 5, exibir botão "Ver mais" (e "Ver menos" para recolher). A rolagem é do container de detalhes do pedido como um todo, não uma área de scroll isolada da trilha.
- **Regra de população (modelo de Rascunho, seção 6.6):** eventos de edição de item ("Quantidade ajustada", "Produto removido") gerados durante a etapa Conferência só passam a aparecer na Trilha a partir do momento em que o pedido é liberado para "Na fila", mantendo o timestamp original de quando a edição foi feita (não o momento da liberação).

**Nota de UX/ponto aberto:** o placeholder "Pedido recebido xxxxx" apareceu no protótipo além de "Pedido recebido do app" — precisa confirmar com UX quais outros canais de origem existem antes de finalizar o catálogo completo.

## 10. Toasts e tags

- **Tags no item, dentro da lista de itens do pedido**, indicando o que ocorreu:
  - "Quantidade ajustada" — com o label "Qtd. Original: X" (ver 6.1).
  - "Item removido" — tachado + opacidade 50% (ver 6.2).
- **Banner de atenção** no topo do pedido quando houver item que requer ação antes da liberação — ver 6.8.
- Toasts de confirmação (ex.: sucesso ao liberar o pedido) mantidos nos pontos relevantes do fluxo — como não existe mais uma modal única "Ajustar produto" por edição (ver 6.1), o toast por edição individual não se aplica mais nesse formato; a confirmação principal acontece na liberação (modal "Liberar pedido para a fila").

## 11. Modelo de dados / eventos a rastrear (requisito para indicadores — fase 2)

Ainda que o dashboard de indicadores não seja construído nesta versão, o backend deve registrar (mínimo) os seguintes eventos/atributos desde já, para viabilizar os relatórios propostos na seção 12:

- `pedido_id`, `loja_id`, `operador_id`, `timestamp`
- Tipo de evento: `qtd_editada` | `item_removido` | `pedido_cancelado` | `qtd_restaurada`
- `produto_id`, `quantidade_original`, `quantidade_nova`
- `subtotal_antes`, `subtotal_depois`, `diferenca`
- Flag de tag associada no momento do evento (ex.: item estava com tag "Sem estoque"?)
- Para itens com split promocional: composição promo/excedente antes e depois do evento
- Forma de pagamento do pedido (`app` | `offline`) — necessário para métricas de estorno
- Tempo entre "pedido criado" e "saída da etapa Conferência"

## 12. Indicadores / relatórios (fase 2 — requisitos de dados definidos agora, UI a definir com UX depois)

1. Volume de pedidos editados por período (total e % sobre total de pedidos).
2. Distribuição por tipo de alteração (qtd. reduzida, item removido, pedido cancelado, qtd. restaurada).
3. Ranking de produtos mais editados/removidos (usando a tag "Sem estoque" como proxy de causa, já que não há campo de motivo).
4. Ranking de lojas com maior taxa de edição/cancelamento.
5. Ranking de operadores com mais edições (uso interno/auditoria, não punitivo).
6. Tempo médio em Conferência até liberação (subsidia definição futura de SLA).
7. Taxa de cancelamento na etapa Conferência vs. total de pedidos.
8. Valor financeiro impactado por estornos (soma de diferenças de subtotal).
9. Comparativo estorno automático (pago no app) vs. apenas notificado (pago offline).

## 13. Casos de borda / edge cases

| Cenário | Comportamento esperado |
|---|---|
| Pedido com 1 item, 1 unidade | Bloquear edição; permitir apenas cancelar o pedido inteiro |
| Pedido com 1 item, N unidades (N>1) | Permitir editar quantidade (1 a N); não oferecer "remover produto" |
| Pedido com 2+ itens, remoção reduz a 1 item restante | Item restante perde a opção de remoção, mantém edição de quantidade |
| Tentativa de reduzir quantidade abaixo de 1 | Bloquear; instruir uso de "Remover produto do pedido" |
| Tentativa de restaurar quantidade acima do valor original | Bloquear com balão "Qtd. máx. permitida" (2s) |
| Digitação manual acima do limite | Borda vermelha + erro + bloqueio do botão "Liberar para fila" |
| Pedido cancelado na etapa Conferência | Vai para "Cancelados"; status replicado ao ERP; notificação de alteração ao cliente; estorno automático se pago no app |
| Pedido com item sem estoque (2+ itens) | Banner amarelo de atenção; reaparece se fechado e o pedido for revisitado com pendência ainda ativa |
| Pedido com item sem estoque (1 item, 1 unidade) | Banner vermelho de bloqueio total; só resta cancelar |
| Pedido pago offline com item editado | Notificação de alerta de valor alterado, sem menção a estorno |
| Edição após pedido já ter saído de Conferência | Bloquear qualquer ação de edição/remoção nesse fluxo; tabela read-only |
| Operador tenta sair da tela com edição não confirmada | Modal "Sair e descartar rascunho?" |
| Produto com "Limite por compra" tem quantidade reduzida/restaurada | Recalcular split promo/excedente priorizando manter unidades no preço promocional (ver 6.7) |
| Produto com "Limite por compra" é removido por completo | Remove as duas linhas (promo + excedente) juntas; sem cancelamento parcial de uma só linha |
| Pedido pago em dinheiro na entrega com item editado/removido | Troco recalculado em tempo real (valor informado pelo cliente − subtotal atual), sempre ≥ 0, com indicador de variação (ver 8.2) |

## 14. Critérios de aceite (exemplos, formato Given/When/Then)

**Editar quantidade dentro do limite**
- Dado um pedido em Conferência com um item comprado em quantidade 6,
- Quando o operador reduz a quantidade para 3 pelo stepper inline,
- Então o subtotal é recalculado na tela, o item exibe o label "Qtd. Original: 6", e o pedido passa a exibir a tag "Rascunho".

**Restaurar quantidade até o teto original**
- Dado um item já reduzido de 6 para 3,
- Quando o operador tenta aumentar para mais de 6,
- Então o sistema bloqueia a ação e exibe o balão "Qtd. máx. permitida".

**Bloqueio de remoção com 1 item restante**
- Dado um pedido com 2 itens, sendo que 1 já foi removido,
- Quando o operador abre a linha do item restante,
- Então a opção "Remover produto do pedido" não é exibida.

**Bloqueio total para pedido de 1 item x 1 unidade**
- Dado um pedido com exatamente 1 item e 1 unidade,
- Quando o operador tenta editar esse pedido,
- Então nenhuma opção de ajuste de item é oferecida; apenas "Cancelar pedido" está disponível.

**Cancelamento replicado ao ERP**
- Dado um pedido em Conferência,
- Quando o operador cancela o pedido inteiro,
- Então o pedido move para "Cancelados" e o status "cancelado" é enviado ao ERP correspondente.

**Bloqueio de replicação prematura (pré-venda)**
- Dado uma loja com fluxo de pré-venda e um pedido em Conferência,
- Quando o pedido ainda não foi movido para "Na fila",
- Então nenhuma captura/replicação automática para o ERP deve ocorrer.

**Commit único do rascunho**
- Dado um pedido em Conferência com edições pendentes (tag "Rascunho"),
- Quando o operador confirma "Liberar para fila",
- Então as edições são persistidas definitivamente e passam a aparecer na Trilha de Auditoria com o timestamp original de cada edição.

**Recálculo de split promocional na redução**
- Dado um produto com "Limite por compra" de 5 unidades, comprado em 6 (5 promo + 1 excedente),
- Quando o operador reduz a quantidade total para 4,
- Então as 4 unidades restantes ficam todas na linha "Promo" e a linha "Preço loja (excedente)" fica com 0.

**Notificação e estorno — pago no app**
- Dado um pedido pago no app com um item removido,
- Quando a liberação é confirmada,
- Então o cliente recebe a notificação "pedido alterado" e, na sequência, a notificação de estorno após confirmação da Braspag.

**Notificação sem estorno — pago offline**
- Dado um pedido pago offline com um item removido,
- Quando a liberação é confirmada,
- Então o cliente recebe apenas a notificação de alerta de valor alterado, sem chamada de estorno.

**Recálculo de troco — pago em dinheiro na entrega**
- Dado um pedido pago em dinheiro com "Cliente vai pagar com: R$ 600,00" e subtotal R$ 564,25 (troco R$ 35,75),
- Quando o operador remove um item de R$ 89,90,
- Então o subtotal recalcula para R$ 474,35 e o troco passa a R$ 125,65, exibindo o indicador "↑ R$ 89,90".

## 15. Dependências e itens abertos

- **UX:** copy das notificações push; protótipo da indicação de "pedido editado" na tela de detalhe do pedido do app do cliente; eventual UI de dashboard de indicadores (fase 2); confirmar quais outros canais de origem existem para a Trilha de Auditoria além de "Pedido recebido do app" (ver seção 9).
- **Integração ERP:** confirmar contrato de envio do status "cancelado" para pedidos que nunca chegaram a ser capturados operacionalmente.
- **Integração Braspag:** confirmar SLA/contrato de resposta do estorno automático para gatilho correto da notificação de estorno.
- **Split promocional (seção 6.7):** confirmar com o time tech onde vive hoje a lógica de "Limite por compra" (motor de preços/promoções vs. serviço de pedidos) — investigação a ser feita ao entrar no card de implementação, não bloqueia o refinamento funcional.
- **SLA de Conferência:** não definido nesta versão; recomenda-se revisitar após observar os dados de "tempo médio em Conferência" (indicador 6, seção 12).

## 16. Anexo — Referência visual (protótipos analisados)

- **Link Figma principal:** https://www.figma.com/design/cciQo86IVJyhv7tr1fXyFZ/Portal-%C2%B7-E-commerce?node-id=4566-7522
- **Link Figma — split promocional:** https://www.figma.com/design/cciQo86IVJyhv7tr1fXyFZ/Portal-%C2%B7-E-commerce?node-id=5295-3266
- Tela de Pedidos com nova coluna "Conferência" (badge de contagem suportando 3 dígitos) e banner de atenção para item sem estoque.
- Tabela de itens com stepper inline na coluna "Quantidade" (sem modal), tags "Qtd. Original: X" / "Item removido" (tachado + opacidade 50%), e bloco de "Impacto financeiro" (subtotal original, ajustes de itens, subtotal, cobrar do cliente).
- Tela de item sem estoque — 3 cenários: (1) item sem estoque em pedido com mais itens; (2) item sem estoque quando é o único produto do carrinho, com 1 unidade; (3) usuário removeu todos os produtos.
- Modal "Sair e descartar rascunho?" ao tentar fechar a aba com edições pendentes.
- Componente "Trilha de Auditoria" com os dois tipos de card (mudança de status / alterações do usuário), paginação "Ver mais"/"Ver menos".
- Protótipo do split de preço promocional: linha-pai com stepper único + linhas-filhas "Promo: até X" / "Preço loja (excedente)"; estado de remoção total; produto com promoção "Sem limite de unidade" (sem split).

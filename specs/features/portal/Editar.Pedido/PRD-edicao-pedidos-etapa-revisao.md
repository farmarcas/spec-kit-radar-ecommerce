# PRD — Edição de Pedidos na Etapa "Revisão"

**Produto:** Radar (Portal do Lojista)
**Squad:** E-commerce
**Autor:** Matheus (PO/PM)
**Status:** Rascunho para protótipo/demo — base para geração de tarefas via Claude Code
**Versão:** 1.0

---

## 1. Contexto

Hoje, ao chegar um novo pedido no Portal do Lojista, ele é imediatamente disponibilizado para separação/liberação, e nas lojas que operam com fluxo de **pré-venda**, o pedido é replicado automaticamente para o ERP no momento da criação. Isso impede qualquer ajuste (ex.: item sem estoque, quantidade divergente) antes que o pedido já esteja "andando" nos sistemas externos, gerando retrabalho, pedidos cancelados por completo quando bastava remover um item, e experiência ruim para o cliente final.

## 2. Objetivo

Criar uma nova etapa obrigatória, **"Revisão"**, por onde todo pedido passa antes de seguir o fluxo normal. Nessa etapa, o lojista pode ajustar itens (reduzir quantidade ou remover produto) ou cancelar o pedido inteiro, **antes** que:
- lojas em fluxo de pré-venda tenham o pedido replicado para o ERP;
- o pedido seja disponibilizado para separação/liberação.

Isso reduz cancelamentos totais desnecessários, dá controle fino sobre o pedido antes da captura pelos sistemas externos, e garante rastreabilidade completa de qualquer alteração feita.

## 3. Escopo

### Dentro do escopo (V1 / protótipo)
- Nova coluna/etapa "Revisão" na tela de Pedidos.
- Todo pedido criado cai obrigatoriamente em "Revisão".
- Edição de quantidade de item (dentro de limites) e remoção de item.
- Cancelamento do pedido inteiro.
- Bloqueio de replicação automática ao ERP (pré-venda) enquanto o pedido estiver em Revisão.
- Bloqueio de edição após captura pelo ERP.
- Histórico de alteração dentro do detalhe do pedido (movimentação de etapas + edições de item).
- Toasts e tags informativas de ação.
- Notificações push ao cliente final (pedido alterado/cancelado e estorno).
- Estorno automático via Braspag para pedidos pagos no app.
- Requisitos de rastreamento de eventos para indicadores futuros (fase 2).

### Fora do escopo (V1)
- Tela de histórico global/auditoria entre pedidos (só existe dentro do detalhe do pedido).
- Campo de "motivo da edição".
- Dashboard de indicadores (UI) — apenas os requisitos de dados/eventos ficam definidos aqui.
- Protótipo da tela de detalhe do pedido no app do cliente final (dependência de UX, fora deste PRD).
- SLA/timeout automático de tempo máximo em Revisão (não definido nesta versão).
- Definição de copy das notificações push (dependência de UX).

## 4. Personas

- **Balconista/Operador de loja (usuário "João Silva" nos mockups):** realiza as edições no Portal do Lojista.
- **Cliente final:** recebe notificações sobre alterações e estornos.
- **Time financeiro/Integração ERP:** consome o status "Cancelados" e os pedidos liberados da fila.

## 5. Máquina de estados do pedido

```
[Criado] → Revisão (obrigatório) 
              │
              ├── Editar item (reduzir/remover) → permanece em Revisão
              ├── Cancelar pedido inteiro → Cancelados (também replicado ao ERP com status cancelado)
              └── Liberar/avançar sem alterar ou após ajustes → Na fila
                          │
                          ▼
                  [Captura pelo ERP] (loja pré-venda: só acontece a partir daqui)
                          │
                          ▼
                     Em separação → Liberados → Concluídos
```

Observações importantes:
- **Pré-venda:** a replicação automática para o ERP só ocorre quando o pedido sai de "Revisão" para "Na fila". Lojas sem pré-venda também passam por Revisão (decisão de simplificação de fluxo), mas a diferença de comportamento de integração pode ser tratada por configuração de loja, não por lógica de tela.
- **Pós-captura:** a partir do momento em que o pedido é capturado pelo ERP (ou sai de "Na fila"), a edição de itens deixa de ser permitida em qualquer tela.
- **Cancelamento:** pedidos cancelados na etapa Revisão vão direto para "Cancelados" **e esse status desce para o ERP também** — ou seja, o ERP é notificado do cancelamento mesmo que o pedido nunca tenha chegado a ser "capturado" no sentido operacional. Isso deve ser tratado como requisito de integração explícito.

## 6. Regras de negócio

### 6.1 Edição de quantidade de item
- Cada item pode ter sua quantidade editada entre **1 (mínimo) e a quantidade original comprada pelo cliente (máximo)** — o teto de reversão é por item individual (ex.: cliente comprou 6 unidades do Item A → esse item pode variar de 1 a 6, independentemente do que aconteceu com outros itens do pedido).
- Não é possível reduzir a quantidade até 0 pela edição de quantidade — esse caminho é sempre "Remover produto do pedido" (ação distinta).
- O controle de quantidade na modal é único: um stepper "+/-" que serve tanto para reduzir quanto para restaurar (trazer de volta) unidades, respeitando o teto. **Renomear o rótulo da ação/modal de "Reduzir quantidade" para "Editar quantidade"** (ajuste de nomenclatura em relação aos mockups originais).

### 6.2 Remoção de item
- "Remover produto do pedido" só fica disponível quando, após a remoção, **restar pelo menos 1 item no pedido**.
- Quando o pedido chega a ter **apenas 1 item restante** (independente de quantas unidades esse item tenha):
  - a opção "Remover produto do pedido" desaparece da modal para esse item;
  - a edição de quantidade desse item continua disponível normalmente (dentro do teto 1–original);
  - a única forma de "zerar" o pedido a partir daqui é cancelar o pedido inteiro.

### 6.3 Regra especial de pedido com 1 item x 1 unidade
- Quando o pedido nasce com (ou é reduzido a) **exatamente 1 item e 1 unidade**, a edição fica bloqueada por completo (nem reduzir, nem remover fazem sentido) — a única ação disponível é **cancelar o pedido inteiro**.
- Esse é um caso particular da regra 6.2: com 1 item e 1 unidade, não há quantidade para reduzir (mínimo já é 1) nem item para remover isoladamente sem esvaziar o pedido.

### 6.4 Cancelamento do pedido inteiro
- Ação independente da remoção item a item (botão dedicado — o "X" no cabeçalho do pedido nos mockups).
- Disponível em qualquer momento durante a etapa Revisão, independentemente de quantos itens/unidades o pedido tenha.
- Ao cancelar: pedido move direto para a coluna "Cancelados"; esse status é replicado ao ERP (ver seção 5).

### 6.5 Bloqueio pós-captura
- Após o pedido sair da etapa "Revisão" (capturado pelo ERP / movido para "Na fila" em diante), nenhuma edição de item ou cancelamento parcial é mais permitida pela tela de Pedidos nesse fluxo. (Cancelamentos após esse ponto, se existirem, seguem outro fluxo já existente e não fazem parte deste PRD.)

## 7. Notificações ao cliente final

Todas via **push notification no app do cliente**. Dois eventos únicos e consolidados (não uma notificação por item alterado):

| Evento | Gatilho | Observação |
|---|---|---|
| Pedido alterado/cancelado | Disparado quando o pedido sai da etapa Revisão com pelo menos uma alteração registrada (item reduzido/removido) ou quando é cancelado | Notificação única mesmo que múltiplos itens tenham sido alterados |
| Estorno realizado | Disparado quando a Braspag confirma o estorno automático | Apenas para pedidos pagos no app |

Regras por forma de pagamento:
- **Pago no app:** estorno automático via Braspag → dispara notificação de estorno além da notificação de alteração.
- **Pago offline (na entrega):** não há estorno automático (não houve cobrança prévia) → o cliente recebe apenas a notificação de alteração, com tom de "atenção: o valor do seu pedido foi alterado" (sem falar de estorno).

Copy final das notificações e o protótipo da indicação de "pedido editado" na tela de detalhe do pedido do app do cliente são **dependências de UX**, não bloqueantes para o desenvolvimento da lógica de backend/tracking.

## 8. Estorno

- Estorno **automático** via integração com **Braspag**, aplicado apenas a pedidos com pagamento feito no app.
- Valor do estorno = diferença de subtotal gerada pela edição/remoção do item (campo "Diferença" já existente na modal "Ajustar produto").
- Pedidos pagos offline não geram chamada de estorno — apenas atualizam o valor "a cobrar do cliente" na entrega e disparam a notificação de alerta de valor alterado.

## 9. Histórico de alteração

Exibido dentro do detalhe do pedido (não há tela global nesta versão). Deve registrar:
- Movimentações de etapa, manuais ou via ERP (ex.: "Enviado para fila", "Enviado para separação", "Pedido liberado", "Pedido cancelado", "Pedido concluído");
- Edições de item (ex.: "Produto removido", "Qtd. alterada X → Y un");
- Data/hora, produto (quando aplicável) e responsável pela ação (usuário ou "ERP"/sistema, quando automática).

Tipos de alteração (catálogo inicial, extensível):
- Enviado para fila
- Enviado para separação
- Pedido liberado
- Pedido cancelado
- Pedido concluído
- Produto removido
- Qtd. alterada X → Y un

Nota de UX já validada nos mockups: se a alteração de etapa (ida ao ERP) adicionar informação relevante ao histórico do pedido, ela deve compor a mesma tabela (ex.: "Enviado para fila (ERP)").

## 10. Toasts e tags

- **Toast de sucesso** ao confirmar qualquer ajuste na modal "Ajustar produto" (ex.: "Pedido atualizado com sucesso").
- **Tags no item, dentro da lista de itens do pedido**, indicando o que ocorreu:
  - "Quantidade ajustada" — quando a quantidade foi alterada em relação à original.
  - "Item removido" — quando o item foi removido do pedido.
- **Banner de atenção** no topo do pedido quando houver item que requer ação antes da liberação (ex.: item sem estoque) — já existente nos mockups, mantido nesta versão.

## 11. Modelo de dados / eventos a rastrear (requisito para indicadores — fase 2)

Ainda que o dashboard de indicadores não seja construído nesta versão, o backend deve registrar (mínimo) os seguintes eventos/atributos desde já, para viabilizar os relatórios propostos na seção 12:

- `pedido_id`, `loja_id`, `operador_id`, `timestamp`
- Tipo de evento: `qtd_editada` | `item_removido` | `pedido_cancelado` | `qtd_restaurada`
- `produto_id`, `quantidade_original`, `quantidade_nova`
- `subtotal_antes`, `subtotal_depois`, `diferenca`
- Flag de tag associada no momento do evento (ex.: item estava com tag "Sem estoque"?)
- Forma de pagamento do pedido (`app` | `offline`) — necessário para métricas de estorno
- Tempo entre "pedido criado" e "saída da etapa Revisão"

## 12. Indicadores / relatórios (fase 2 — requisitos de dados definidos agora, UI a definir com UX depois)

1. Volume de pedidos editados por período (total e % sobre total de pedidos).
2. Distribuição por tipo de alteração (qtd. reduzida, item removido, pedido cancelado, qtd. restaurada).
3. Ranking de produtos mais editados/removidos (usando a tag "Sem estoque" como proxy de causa, já que não há campo de motivo).
4. Ranking de lojas com maior taxa de edição/cancelamento.
5. Ranking de operadores com mais edições (uso interno/auditoria, não punitivo).
6. Tempo médio em Revisão até liberação (subsidia definição futura de SLA).
7. Taxa de cancelamento na etapa Revisão vs. total de pedidos.
8. Valor financeiro impactado por estornos (soma de diferenças de subtotal).
9. Comparativo estorno automático (pago no app) vs. apenas notificado (pago offline).

## 13. Casos de borda / edge cases

| Cenário | Comportamento esperado |
|---|---|
| Pedido com 1 item, 1 unidade | Bloquear edição; permitir apenas cancelar o pedido inteiro |
| Pedido com 1 item, N unidades (N>1) | Permitir editar quantidade (1 a N); não oferecer "remover produto" |
| Pedido com 2+ itens, remoção reduz a 1 item restante | Item restante perde a opção de remoção, mantém edição de quantidade |
| Tentativa de reduzir quantidade abaixo de 1 | Bloquear; instruir uso de "Remover produto do pedido" |
| Tentativa de restaurar quantidade acima do valor original | Bloquear com mensagem "Quantidade máxima atingida" (já validado no mockup) |
| Pedido cancelado na etapa Revisão | Vai para "Cancelados"; status replicado ao ERP; notificação de alteração ao cliente; estorno automático se pago no app |
| Pedido com item sem estoque | Banner de atenção antes da liberação (comportamento já existente, mantido) |
| Pedido pago offline com item editado | Notificação de alerta de valor alterado, sem menção a estorno |
| Edição após pedido já ter saído de Revisão | Bloquear qualquer ação de edição/remoção nesse fluxo |

## 14. Critérios de aceite (exemplos, formato Given/When/Then)

**Editar quantidade dentro do limite**
- Dado um pedido em Revisão com um item comprado em quantidade 6,
- Quando o operador reduz a quantidade para 3,
- Então o subtotal é recalculado, o item recebe a tag "Quantidade ajustada", o histórico registra "Qtd. alterada 6 → 3 un", e um toast de sucesso é exibido.

**Restaurar quantidade até o teto original**
- Dado um item já reduzido de 6 para 3,
- Quando o operador tenta aumentar para mais de 6,
- Então o sistema bloqueia a ação e exibe "Quantidade máxima atingida".

**Bloqueio de remoção com 1 item restante**
- Dado um pedido com 2 itens, sendo que 1 já foi removido,
- Quando o operador abre a modal de ajuste do item restante,
- Então a opção "Remover produto do pedido" não é exibida.

**Bloqueio total para pedido de 1 item x 1 unidade**
- Dado um pedido com exatamente 1 item e 1 unidade,
- Quando o operador tenta editar esse pedido,
- Então nenhuma opção de ajuste de item é oferecida; apenas "Cancelar pedido" está disponível.

**Cancelamento replicado ao ERP**
- Dado um pedido em Revisão,
- Quando o operador cancela o pedido inteiro,
- Então o pedido move para "Cancelados" e o status "cancelado" é enviado ao ERP correspondente.

**Bloqueio de replicação prematura (pré-venda)**
- Dado uma loja com fluxo de pré-venda e um pedido em Revisão,
- Quando o pedido ainda não foi movido para "Na fila",
- Então nenhuma captura/replicação automática para o ERP deve ocorrer.

**Notificação e estorno — pago no app**
- Dado um pedido pago no app com um item removido,
- Quando a edição é confirmada,
- Então o cliente recebe a notificação "pedido alterado" e, na sequência, a notificação de estorno após confirmação da Braspag.

**Notificação sem estorno — pago offline**
- Dado um pedido pago offline com um item removido,
- Quando a edição é confirmada,
- Então o cliente recebe apenas a notificação de alerta de valor alterado, sem chamada de estorno.

## 15. Dependências e itens abertos

- **UX:** copy das notificações push; protótipo da indicação de "pedido editado" na tela de detalhe do pedido do app do cliente; eventual UI de dashboard de indicadores (fase 2).
- **Integração ERP:** confirmar contrato de envio do status "cancelado" para pedidos que nunca chegaram a ser capturados operacionalmente.
- **Integração Braspag:** confirmar SLA/contrato de resposta do estorno automático para gatilho correto da notificação de estorno.
- **SLA de Revisão:** não definido nesta versão; recomenda-se revisitar após observar os dados de "tempo médio em Revisão" (indicador 6, seção 12).

## 16. Anexo — Referência visual (mockups analisados)

- Tela de Pedidos com nova coluna "Revisão" e banner de atenção para item sem estoque.
- Modal "Ajustar produto" com as opções "Reduzir/Editar quantidade" e "Remover produto do pedido", e bloco de "Impacto financeiro" (subtotal atual, novo subtotal, diferença).
- Estado pós-edição com tags "Quantidade ajustada" / "Item removido" e toast "Pedido atualizado com sucesso".
- Modal de confirmação de nova quantidade com stepper +/-.
- Estado de limite atingido ao tentar restaurar acima da quantidade original.
- Tela de histórico de alteração dentro do detalhe do pedido, com legenda de "Tipos de alteração".

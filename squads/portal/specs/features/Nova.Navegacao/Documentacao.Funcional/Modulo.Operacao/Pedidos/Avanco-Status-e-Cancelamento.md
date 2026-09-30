# Pedidos — Avanço de Status e Cancelamento

**Módulo:** Operação
**Histórias:** [ECP-1517](https://farmarcas.atlassian.net/browse/ECP-1517) — Avanço de Status e Cancelamento de Pedido
**Referência UX:** [ECP-1449](https://farmarcas.atlassian.net/browse/ECP-1449) (Avanço de status e cancelamento)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seções 6.5, 6.8
**Componente novo:** Split Button (criado do zero em React aqui — ver [[feedback_design_system_components_on_demand]])
**Relacionado:** `PRD-edicao-pedidos-etapa-revisao.md` (estorno parcial, Conferência)
**Status:** Em desenvolvimento
**Última atualização:** 2026-09-30

---

## 1. O que é

Avanço de status usa um botão split (ação principal sequencial + chevron com alternativa de pular etapa). Confirmação obrigatória só nos casos irreversíveis. Cancelamento é permitido a partir de qualquer status, incluindo Concluído — mudança em relação ao modelo anterior, que restringia a status ativos.

## 2. Regras de negócio

### 2.1 Diálogo de confirmação — só 3 casos

1. Conferência → Na fila (commit da edição, ver `PRD-edicao-pedidos-etapa-revisao.md`).
2. Qualquer "pular etapa" (ex.: Na fila → Liberados direto).
3. Qualquer transição para status final (Liberados → Concluído, ou Cancelamento a partir de qualquer status).

Transições sequenciais intermediárias não pedem confirmação.

### 2.2 Texto de confirmação de conclusão

Exato: *"Concluir pedido #\[nº\]? O pedido será finalizado e marcado como concluído. Esta ação não pode ser desfeita."*

### 2.3 Cancelamento — qualquer status, incluindo Concluído

Não fica restrito aos status ativos (Conferência até Liberados) — confirmado por Matheus em 2026-09-24, corrigindo a versão anterior do PRD.

### 2.4 Motivos de cancelamento

Reaproveita a lista já existente do Portal: Endereço incorreto, Cliente não estava no local indicado, Cliente não precisava mais dos itens, Cliente solicitou produto por engano, Pedido duplicado, Pedido atrasado, Pedido indisponível, Suspeita de fraude, Sem estoque. **A 10ª opção "Teste interno"**, vista nos dois protótipos (Figma e Claude Design), não está na lista hoje documentada no Manual — precisa de confirmação com Matheus antes de entrar.

### 2.5 Cálculo de estorno respeitando estorno parcial

Se o pedido já sofreu estorno parcial na Conferência (item removido/reduzido, só pedidos pagos no app, via Braspag), o cancelamento estorna apenas o valor restante ainda não estornado — nunca o valor original de novo, mesmo quando o cancelamento acontece bem depois da Conferência (ex.: a partir de Concluído).

### 2.6 Sem reversão de status

"Mover pedido para trás" não está desenhado e não faz parte deste PRD — ideia registrada pela UX pra avaliação futura.

## 3. Nível de integração / fonte de dados

- Transições de status ficam registradas nos subdocs de `edelivery_order.order_data` (ex.: `canceled.triggeredAt`, `canceled.previusStatus`, `canceled.triggeredBy`, `finished.triggeredAt`, `finished.previusStatus`) — ver [[feedback_status_change_query_rules]] pra regras gerais de leitura desses campos (sempre por `triggeredAt`, nunca `updatedAt`; guard `previusStatus != status`).
- **`canceledReason` vazio = cancelamento feito direto no ERP pela loja** (não é motivo desconhecido nem falha de integração) — confirmado em amostra real, 100% dos casos de motivo vazio tinham `canceled.triggeredBy.name = "ERP"`. Rotular como "Cancelado direto no ERP (pela loja)".
- Estorno: mecanismo automático via Braspag, só pra pedidos pagos no app — cálculo do valor restante depende de consultar o histórico de estornos parciais já feitos (ver `PRD-edicao-pedidos-etapa-revisao.md`, seção 8.1).
- Notificação ao cliente no cancelamento — canal/mecanismo exato não levantado ainda.

## 4. Cenários de borda

| Cenário | Regra |
|---|---|
| Pedido já no último status ativo (Liberados) | Não há "pular etapa" disponível |
| Confirma cancelamento sem selecionar motivo | Ação bloqueada até selecionar um motivo |
| Cancela pedido já Concluído, com estorno parcial prévio | Estorna só o valor restante não estornado |
| `canceledReason` vazio | Cancelamento via ERP, não erro |
| Navega pro próximo pedido (◀/▶) com confirmação pendente na tela atual | A definir — cenário identificado no ECP-1449 sem regra fechada ainda |

## 5. Pendências / perguntas em aberto

- [ ] Confirmar com Matheus se "Teste interno" entra como 10º motivo de cancelamento.
- [ ] Canal/mecanismo exato da notificação ao cliente no cancelamento.
- [ ] Comportamento de navegação ◀/▶ com uma confirmação pendente na tela atual — ainda sem regra fechada (ECP-1449).

## Changelog

- **2026-09-30** — Criação do documento (v1), a partir de ECP-1517, ECP-1449, PRD seções 6.5/6.8, e [[feedback_status_change_query_rules]].

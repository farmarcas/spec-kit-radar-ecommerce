# Pedidos — Avanço de Status e Cancelamento

**Módulo:** Operação
**Histórias:** [ECP-1517](https://farmarcas.atlassian.net/browse/ECP-1517) (Avanço de status do pedido), [ECP-1559](https://farmarcas.atlassian.net/browse/ECP-1559) (Cancelamento de pedido)
**Referência UX:** [ECP-1449](https://farmarcas.atlassian.net/browse/ECP-1449) (Avanço de status e cancelamento)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seções 6.5, 6.8
**Componente novo:** Split Button (criado do zero em React aqui — ver [[feedback_design_system_components_on_demand]])
**Relacionado:** `PRD-edicao-pedidos-etapa-revisao.md` (estorno parcial, Conferência)
**Status:** Em desenvolvimento
**Última atualização:** 2026-10-01

---

## 1. O que é

Avanço de status usa um botão split (ação principal sequencial + chevron com alternativa de pular etapa). Confirmação obrigatória só nos casos irreversíveis. Cancelamento é permitido a partir de qualquer status, incluindo Concluído — mudança em relação ao modelo anterior, que restringia a status ativos.

## 2. Regras de negócio

### 2.1 Diálogo de confirmação — só 3 casos, com texto específico por caso

1. **Conferência → Na fila** (commit da edição, ver `PRD-edicao-pedidos-etapa-revisao.md`) — *"Ao liberar este pedido para a separação, você não poderá mais fazer edições nos itens."*
2. **Pular etapa** (só disponível a partir de **Na fila → Liberados**, ver 2.6) — *"Ao confirmar, o sistema entende que os itens já foram separados fisicamente e o pedido estará pronto para [entrega/retirada]."*
3. **Qualquer transição para status final** (Liberados → Concluído, ou Cancelamento a partir de qualquer status) — ver 2.2.

Transições sequenciais intermediárias não pedem confirmação.

### 2.2 Texto de confirmação de conclusão

Exato: *"Concluir pedido #\[nº\]? O pedido será finalizado e marcado como concluído. Esta ação não pode ser desfeita."*

### 2.3 Cancelamento — qualquer status, incluindo Concluído

Não fica restrito aos status ativos (Conferência até Liberados) — confirmado por Matheus em 2026-09-24, corrigindo a versão anterior do PRD.

### 2.4 Motivos de cancelamento (10 opções, confirmado 2026-10-01)

Endereço incorreto, Cliente não estava no local indicado, Cliente não precisava mais dos itens, Cliente solicitou produto por engano, Pedido duplicado, Pedido atrasado, Pedido indisponível, Suspeita de fraude, Sem estoque, **Teste interno**. As 9 primeiras já existem no Portal hoje; "Teste interno" é confirmado por Matheus (apareceu consistentemente nos dois protótipos antes da confirmação).

### 2.5 Cálculo de estorno respeitando estorno parcial

Se o pedido já sofreu estorno parcial na Conferência (item removido/reduzido, só pedidos pagos no app, via Braspag), o cancelamento estorna apenas o valor restante ainda não estornado — nunca o valor original de novo, mesmo quando o cancelamento acontece bem depois da Conferência (ex.: a partir de Concluído).

### 2.6 O único "pular etapa" válido é Na fila → Liberados

Conferência **não** tem opção de pular etapa — só o caminho sequencial (Conferência → Na fila). **Reforçado em 2026-10-01** ao revisar o código do protótipo: ele tinha (por engano) um pulo de Conferência direto pra Liberados; Matheus confirmou que está errado e não deve ser implementado assim.

### 2.7 Sem reversão de status ("Desfazer"/undo)

Não existe e não faz parte deste ciclo. **Reforçado em 2026-10-01:** o código do protótipo tinha um snackbar de "Desfazer" aparecendo depois de qualquer avanço de status — Matheus confirmou que essa funcionalidade não existe e é sobra de uma versão anterior do protótipo, não reflete decisão de produto nenhuma. Não implementar undo.

### 2.8 Saída do pedido da lista ao concluir ou cancelar

Ao concluir ou cancelar, o modal permanece aberto por 5 segundos com a confirmação visual e então fecha. O pedido só sai da lista de "Em andamento" quando o modal fecha: nesse momento passa para "Finalizados" e os contadores das duas abas são atualizados. A navegação ◀ / ▶ do modal passa a seguir a fila em aberto (ver [Detalhe-Pedido-Modal-Status-Tracker.md](Detalhe-Pedido-Modal-Status-Tracker.md), 3.9).

## 3. Nível de integração / fonte de dados

- Transições de status ficam registradas nos subdocs de `edelivery_order.order_data` (ex.: `canceled.triggeredAt`, `canceled.previusStatus`, `canceled.triggeredBy`, `finished.triggeredAt`, `finished.previusStatus`) — ver [[feedback_status_change_query_rules]] pra regras gerais de leitura desses campos (sempre por `triggeredAt`, nunca `updatedAt`; guard `previusStatus != status`).
- **`canceledReason` vazio = cancelamento feito direto no ERP pela loja** (não é motivo desconhecido nem falha de integração) — confirmado em amostra real, 100% dos casos de motivo vazio tinham `canceled.triggeredBy.name = "ERP"`. Rotular como "Cancelado direto no ERP (pela loja)".
- Estorno: mecanismo automático via Braspag, só pra pedidos pagos no app — cálculo do valor restante depende de consultar o histórico de estornos parciais já feitos (ver `PRD-edicao-pedidos-etapa-revisao.md`, seção 8.1).
- Notificação ao cliente no cancelamento — canal/mecanismo exato não levantado ainda.

### 3.1 Query reaproveitada — pedidos cancelados

**⚠️ Importante (ver [[feedback_query_reuse_documentation]]):** a query abaixo é uma pipeline MongoDB que eu construí e **validei batendo com os números exibidos no Portal** (período 19-25/07/2026) — não é, até onde sei, extraída do código-fonte do backend que hoje serve a tela de Pedidos/Cancelados (não localizei esse serviço; o módulo `Order` do `ecomm-api-core-dotnet` ainda não tem persistência real). Tratar como "comportamento validado", não como "código confirmado em produção", até confirmar a fonte real com engenharia.

```js
[
  { $match: {
      status: "Canceled",
      "canceled.triggeredAt": { $gte: <start>, $lt: <end> },
      "canceled.previusStatus": { $ne: "Canceled" },
      canceledReason: { $ne: "Teste Interno" }
  }},
  { $project: {
      _id: 0, number: 1, createdAt: 1,
      canceledAt: "$canceled.triggeredAt",
      totalOrderValue: { $sum: { $map: { input: "$products", as: "p", in: { $multiply: ["$$p.unitPrice", "$$p.amount"] } } } },
      canceledByUser: "$canceled.triggeredBy.name",
      canceledReason: 1,
      pharmacyCNPJ: "$pharmacy.cNPJ"
  }}
]
```

**O que essa query faz:**
- Conta como "cancelado" só quem tem `status: "Canceled"` E cujo `canceled.triggeredAt` cai na janela de data pedida (nunca `updatedAt` — reprocessamento de ERP toca esse campo sem transição real).
- Guard `canceled.previusStatus != "Canceled"` — descarta re-triggers espúrios de job de ERP (reprocessamento que resseta o timestamp sem o pedido ter de fato mudado de status).
- Exclui por padrão `canceledReason: "Teste Interno"` — pedidos de teste não entram na contagem.

**O que essa query NÃO faz (cuidado se for reaproveitar pra outra métrica):**
- Não filtra por loja/Rede/contexto — isso é um `$match` adicional a acrescentar conforme o [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md).
- Não soma frete nem considera qualquer valor de estorno já feito — `totalOrderValue` é bruto (soma de itens), não o valor líquido estornado (ver 2.5 pra regra de estorno parcial).
- Não trata fuso horário — a janela `<start>/<end>` precisa ser calculada em BRT e convertida pra UTC (+3h) antes de usar como filtro (ver [[feedback_status_change_query_rules]]).

## 4. Cenários de borda

| Cenário | Regra |
|---|---|
| Pedido já no último status ativo (Liberados) | Não há "pular etapa" disponível |
| Confirma cancelamento sem selecionar motivo | Ação bloqueada até selecionar um motivo |
| Cancela pedido já Concluído, com estorno parcial prévio | Estorna só o valor restante não estornado |
| `canceledReason` vazio | Cancelamento via ERP, não erro |
| Navega pro próximo pedido (◀/▶) com confirmação pendente na tela atual | A definir — cenário identificado no ECP-1449 sem regra fechada ainda |
| Pedido em Conferência | Botão split não oferece pular etapa — só "Liberar para fila" |
| Status acabou de avançar | Snackbar de confirmação aparece, sem opção de "Desfazer" |

## 5. Pendências / perguntas em aberto

- [ ] Canal/mecanismo exato da notificação ao cliente no cancelamento.
- [ ] Comportamento de navegação ◀/▶ com uma confirmação pendente na tela atual — ainda sem regra fechada (ECP-1449).
- [ ] **Localizar o serviço real que hoje serve a contagem de Cancelados** (pra confirmar se a query da seção 3.1 bate com o que o backend realmente faz, não só com o número final exibido).

## Changelog

- **2026-10-05** — Duração do modal aberto após concluir/cancelar definida: 5 segundos.
- **2026-10-02** — Adicionado o momento da saída do pedido da lista (2.8): só quando o modal fecha, com contadores atualizados.

- **2026-10-01 (2)** — Adiciona a query de Cancelados reaproveitável (seção 3.1), com nota honesta sobre ser validada por número, não confirmada no código-fonte do backend.
- **2026-10-01** — Revalidado contra o código-fonte do protótipo Claude Design: confirma "Teste interno" como 10º motivo; adiciona textos exatos de confirmação por caso; reforça que só "Na fila → Liberados" tem pular etapa (o protótipo tinha um pulo de Conferência por engano); reforça que não existe "Desfazer"/undo (o protótipo tinha um, por engano — sobra de versão anterior).
- **2026-09-30** — Criação do documento (v1), a partir de ECP-1517, ECP-1449, PRD seções 6.5/6.8, e [[feedback_status_change_query_rules]].

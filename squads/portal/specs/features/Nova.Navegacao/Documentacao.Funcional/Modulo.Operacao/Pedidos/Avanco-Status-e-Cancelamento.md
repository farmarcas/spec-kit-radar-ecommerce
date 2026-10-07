# Pedidos — Avanço de Status e Cancelamento

**Módulo:** Operação
**Histórias:** [ECP-1517](https://farmarcas.atlassian.net/browse/ECP-1517) (Avanço de status do pedido), [ECP-1559](https://farmarcas.atlassian.net/browse/ECP-1559) (Cancelamento de pedido)
**Referência UX:** [ECP-1449](https://farmarcas.atlassian.net/browse/ECP-1449) (Avanço de status e cancelamento)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seções 6.5, 6.8
**Componente novo:** Split Button (criado do zero em React aqui — ver [[feedback_design_system_components_on_demand]])
**Relacionado:** `PRD-edicao-pedidos-etapa-revisao.md` (estorno parcial, Conferência)
**Status:** Em desenvolvimento
**Última atualização:** 2026-10-07

---

## 1. O que é

Avanço de status usa um botão split (ação principal da etapa + chevron com a alternativa de pular direto para Liberados). Há diálogo de confirmação somente no pulo de etapa; as transições sequenciais, inclusive Conferência → Na fila e Concluir, acontecem sem diálogo. Cancelamento é permitido a partir de qualquer status, incluindo Concluído, por uma modal de motivo própria.

## 2. Regras de negócio

### 2.1 Ação principal por etapa (Figma)

| Etapa | Botão principal | Chevron (pular etapa) |
|---|---|---|
| Conferência | "Liberar para fila" | Sim — pular para Liberados (modal própria, ver 2.2) |
| Na fila | "Separar pedido" | Sim — menu "PULAR DIRETO PARA" → "Liberados" ("Ignorar a separação e marcar como pronto") |
| Em separação | "Liberar para entrega" (pedido de Entrega) / "Liberar para retirada" (pedido de Retirada) | Não |
| Liberados | "Concluir pedido" (botão verde) | Não |

Cancelado não tem rodapé com botão; Concluído mantém só "Cancelar pedido".

### 2.2 Diálogo de confirmação — só no pulo de etapa

Transições sequenciais — inclusive **Conferência → Na fila** e **Concluir pedido** (Liberados → Concluído) — não pedem diálogo. O diálogo existe somente quando o usuário **pula etapa**, e cada pulo tem a própria modal:

1. **Na fila → Liberados** — título "Avançar pedido direto para Liberados?"; texto *"Ao confirmar, o sistema entenderá que os itens já foram separados fisicamente e o pedido está pronto para entrega/retirada."*; botões "Voltar" e "Sim, avançar pedido".
2. **Conferência → Liberados** — o usuário pode pular da Conferência direto para Liberados; aparece uma modal de confirmação **diferente** da anterior, própria da Conferência (texto e botões ainda não definidos, ver pendências).

### 2.3 Cancelamento — qualquer status, incluindo Concluído

Não fica restrito aos status ativos (Conferência até Liberados) — confirmado por Matheus em 2026-09-24, corrigindo a versão anterior do PRD. A modal de cancelamento (título "Cancelar pedido: #<número>", ícone de cancelamento, motivos em seleção única, botões "Cancelar" e "Confirmar cancelamento", este bloqueado até escolher um motivo) é a própria confirmação, sem diálogo adicional, e **não traz** o aviso "O cliente será notificado e o estorno processado"; a regra de negócio continua: o cancelamento notifica o cliente e processa o estorno (quando aplicável).

### 2.4 Motivos de cancelamento (10 opções, confirmado 2026-10-01)

Endereço incorreto, Cliente não estava no local indicado, Cliente não precisava mais dos itens, Cliente solicitou produto por engano, Pedido duplicado, Pedido atrasado, Pedido indisponível, Suspeita de fraude, Sem estoque, **Teste interno**. As 9 primeiras já existem no Portal hoje; "Teste interno" é confirmado por Matheus (apareceu consistentemente nos dois protótipos antes da confirmação).

### 2.5 Cálculo de estorno respeitando estorno parcial

Se o pedido já sofreu estorno parcial na Conferência (item removido/reduzido, só pedidos pagos no app, via Braspag), o cancelamento estorna apenas o valor restante ainda não estornado — nunca o valor original de novo, mesmo quando o cancelamento acontece bem depois da Conferência (ex.: a partir de Concluído).

### 2.6 "Pular etapa": Na fila → Liberados e Conferência → Liberados

O pulo é sempre direto para **Liberados**, a partir de Na fila ou de Conferência (respostas do PO de 2026-10-06); cada origem tem a própria modal (2.2). Conferência → Na fila é o caminho sequencial e não tem diálogo.

### 2.7 Snackbar de status e sem reversão ("Desfazer"/undo)

Após cada transição aparece um snackbar escuro no pé do modal por **10 segundos**: `Status atualizado para "<novo status>"` ("Na fila", "Em separação", "Liberados"), "Pedido concluído!" ao concluir e "Pedido cancelado!" ao cancelar. Não existe reversão de status nem "Desfazer" neste ciclo; o "Desfazer" da seção "Futuro" do Figma e do protótipo é sobra de uma versão anterior, não decisão de produto. Não implementar undo.

### 2.8 Saída do pedido da lista ao concluir ou cancelar

Ao concluir ou cancelar, o modal permanece aberto com a confirmação visual e o pedido no novo status; ele só fecha quando o usuário o fecha. O pedido sai da lista de "Em andamento" no mesmo instante em que é concluído ou cancelado: passa para "Finalizados" e os contadores das duas abas são atualizados, sem esperar o modal ser fechado. A navegação ▲ / ▼ do modal passa a seguir a fila em aberto (ver [Detalhe-Pedido-Modal-Status-Tracker.md](Detalhe-Pedido-Modal-Status-Tracker.md), 3.9).

### 2.9 Ajuste de itens na Conferência é rascunho (revisão 2026-10-07)

Na Conferência, o ajuste de itens (remover item, reduzir quantidade, restaurar) é um rascunho: só é efetivado quando o pedido muda de etapa — Conferência → Na fila ou o pulo Conferência → Liberados. Nesse momento o ajuste e os eventos da trilha de auditoria ("Produto removido", "Quantidade ajustada" e, quando for o caso, "Frete grátis mantido") são gravados e a lista passa a mostrar "(editado)"; a partir daí os itens não são mais editáveis. Enquanto o pedido não muda de etapa, fechar o detalhe sem avançar o pedido não efetiva o ajuste: o pedido continua com os itens originais. O PRD `PRD-edicao-pedidos-etapa-revisao.md` (seção 6.6) descreve o mesmo modelo de rascunho, com o commit na liberação para a fila. Como exibir o resultado no detalhe (subtotal riscado, "Ajustes de itens", frete grátis mantido, troco) está em [Detalhe-Pedido-Modal-Status-Tracker.md](Detalhe-Pedido-Modal-Status-Tracker.md), 3.11.

## 3. Nível de integração / fonte de dados

- Transições de status ficam registradas nos subdocs de `edelivery_order.order_data` (ex.: `canceled.triggeredAt`, `canceled.previusStatus`, `canceled.triggeredBy`, `finished.triggeredAt`, `finished.previusStatus`) — ver [[feedback_status_change_query_rules]] pra regras gerais de leitura desses campos (sempre por `triggeredAt`, nunca `updatedAt`; guard `previusStatus != status`).
- **`canceledReason` vazio = cancelamento feito direto no ERP pela loja** (não é motivo desconhecido nem falha de integração) — confirmado em amostra real, 100% dos casos de motivo vazio tinham `canceled.triggeredBy.name = "ERP"`. Rotular o motivo como "Cancelado direto no ERP (pela loja)" e mostrar **"sistema"** em "Cancelado por" (cancelamento vindo do ERP/automático); nos demais casos, "Cancelado por" segue a mensagem atual (nome e e-mail de quem cancelou).
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
| Pedido já no último status ativo (Liberados) | Não há "pular etapa"; o botão é "Concluir pedido", sem diálogo |
| Confirma cancelamento sem selecionar motivo | Ação bloqueada até selecionar um motivo ("Confirmar cancelamento" desabilitado) |
| Cancela pedido já Concluído, com estorno parcial prévio | Estorna só o valor restante não estornado |
| `canceledReason` vazio | Cancelamento via ERP, não erro; "Cancelado por: sistema" |
| Navega pro próximo pedido (▲/▼) com confirmação pendente na tela atual | A definir — cenário identificado no ECP-1449 sem regra fechada ainda |
| Pedido em Conferência | Botão split "Liberar para fila"; o chevron permite pular direto para Liberados, com modal própria da Conferência |
| Conferência → Na fila (sequencial) | Sem diálogo |
| Na fila → Liberados (pulo) | Diálogo "Avançar pedido direto para Liberados?" |
| Pedido de Entrega em "Em separação" | Botão "Liberar para entrega" (Retirada: "Liberar para retirada") |
| Status acabou de avançar | Snackbar `Status atualizado para "X"` por 10 segundos, sem opção de "Desfazer" |
| Pedido em Conferência com ajuste de itens libera para a fila (ou pula para Liberados) | O ajuste é efetivado junto com a transição e a trilha registra os eventos do ajuste |
| Pedido em Conferência com ajuste de itens e o detalhe é fechado sem avançar | O ajuste não é efetivado; o pedido continua com os itens originais |

## 5. Pendências / perguntas em aberto

- [ ] Canal/mecanismo exato da notificação ao cliente no cancelamento.
- [ ] Comportamento de navegação ▲/▼ com uma confirmação pendente na tela atual — ainda sem regra fechada (ECP-1449).
- [ ] Texto, título e botões da modal própria do pulo **Conferência → Liberados**.
- [ ] O Figma escreve "entrega/retirada" literal no diálogo de Na fila → Liberados: confirmar se o texto varia conforme o tipo do pedido (Entrega × Retirada). O protótipo de referência varia o texto conforme o tipo do pedido.
- [ ] Menu do chevron na Conferência: o protótipo de referência usa o mesmo menu das duas etapas (cabeçalho "Pular direto para", opção "Liberados", apoio "Ignorar a separação e marcar como pronto"); confirmar para a Conferência.
- [ ] Pulo Conferência → Liberados: quais eventos de status são registrados para as etapas puladas (o protótipo registra um único evento, "Status: Liberados").
- [ ] Pedido em Conferência com ajuste de itens pendente cancelado: o protótipo descarta o ajuste (cancelamento sobre os itens originais); confirmar com o PO.
- [ ] Alinhar `PRD-edicao-pedidos-etapa-revisao.md`, que ainda cita a modal "Liberar pedido para a fila" ao liberar a Conferência: sem diálogo em Conferência → Na fila, o commit do rascunho acontece direto na transição.
- [ ] **Localizar o serviço real que hoje serve a contagem de Cancelados** (pra confirmar se a query da seção 3.1 bate com o que o backend realmente faz, não só com o número final exibido).

## Changelog

- **2026-10-07** — Revisão contra o protótipo Claude Design de 07/10 (ECP-1517, ECP-1559): ajuste de itens na Conferência como rascunho, efetivado só na mudança de etapa (2.9); o cancelamento entra na trilha como "Pedido cancelado" (ponto vermelho, com motivo e usuário) e a pendência do cancelamento com ajuste pendente foi registrada. Divergências do protótipo com decisões do PO, não adotadas: fechamento automático do modal em 3 s com o pedido mantido na lista até fechar; "Desfazer" e duração de 5 s no snackbar; diálogos "Liberar pedido para a fila" e "Concluir pedido"; mesmo diálogo no pulo da Conferência e de Na fila; aviso "O cliente será notificado e o estorno processado" no modal de cancelamento.
- **2026-10-06** — Handoff Figma e respostas do PO: diálogo de confirmação só no pulo de etapa (Na fila → Liberados e Conferência → Liberados, cada um com a própria modal); Conferência → Na fila e Concluir pedido sem diálogo (substituem os 3 diálogos anteriores e a regra de que Conferência não pula etapa); botões por etapa conforme o Figma, com "Liberar para entrega"/"Liberar para retirada" em "Em separação"; snackbar `Status atualizado para "X"` por 10 segundos, sem "Desfazer"; modal de cancelamento sem o aviso "O cliente será notificado e o estorno processado" (regra de negócio mantida); "Cancelado por" = "sistema" quando o cancelamento veio do ERP; ícones de navegação ▲ / ▼.
- **2026-10-05 (2)** — Decisão do PO: ao concluir ou cancelar, o pedido sai de "Em andamento" e vai para "Finalizados" imediatamente (a regra "só sai quando o modal fecha" deixa de valer); o modal segue aberto até o usuário fechar e ◀ / ▶ seguem a fila em aberto.
- **2026-10-05** — Decisão do PO: o modal não fecha automaticamente após concluir ou cancelar (a duração de 5 segundos definida no mesmo dia deixa de valer); o modal só fecha por ação do usuário.
- **2026-10-05** — Duração do modal aberto após concluir/cancelar definida: 5 segundos.
- **2026-10-02** — Adicionado o momento da saída do pedido da lista (2.8): só quando o modal fecha, com contadores atualizados.

- **2026-10-01 (2)** — Adiciona a query de Cancelados reaproveitável (seção 3.1), com nota honesta sobre ser validada por número, não confirmada no código-fonte do backend.
- **2026-10-01** — Revalidado contra o código-fonte do protótipo Claude Design: confirma "Teste interno" como 10º motivo; adiciona textos exatos de confirmação por caso; reforça que só "Na fila → Liberados" tem pular etapa (o protótipo tinha um pulo de Conferência por engano); reforça que não existe "Desfazer"/undo (o protótipo tinha um, por engano — sobra de versão anterior).
- **2026-09-30** — Criação do documento (v1), a partir de ECP-1517, ECP-1449, PRD seções 6.5/6.8, e [[feedback_status_change_query_rules]].

# Pedidos — Avanço de Status e Cancelamento

**Módulo:** Operação
**Histórias:** [ECP-1517](https://farmarcas.atlassian.net/browse/ECP-1517) (Avanço de status do pedido), [ECP-1559](https://farmarcas.atlassian.net/browse/ECP-1559) (Cancelamento de pedido)
**Referência UX:** [ECP-1449](https://farmarcas.atlassian.net/browse/ECP-1449) (Avanço de status e cancelamento)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seções 6.5, 6.8
**Componente novo:** Split Button (criado do zero em React aqui — ver [[feedback_design_system_components_on_demand]])
**Relacionado:** `PRD-edicao-pedidos-etapa-revisao.md` (estorno parcial, Conferência)
**Status:** Em desenvolvimento
**Última atualização:** 2026-10-08

---

## 1. O que é

Avanço de status usa um botão split (ação principal da etapa + chevron com a alternativa de pular direto para Liberados). Há diálogo de confirmação em Conferência → Na fila, no pulo de etapa para Liberados (o mesmo diálogo a partir da Conferência e de Na fila) e em Concluir pedido; Na fila → Em separação e Em separação → Liberados são diretas. Depois de cada transição intermediária há um snackbar com "Desfazer"; ao concluir ou cancelar, o modal mostra a barra de confirmação e fecha sozinho em 3 segundos. Cancelamento é permitido a partir de qualquer status, incluindo Concluído, por uma modal de motivo própria.

## 2. Regras de negócio

### 2.1 Ação principal por etapa (Figma)

| Etapa | Botão principal | Chevron (pular etapa) |
|---|---|---|
| Conferência | "Liberar para fila" | Sim — pular para Liberados (diálogo, ver 2.2) |
| Na fila | "Separar pedido" | Sim — menu "PULAR DIRETO PARA" → "Liberados" ("Ignorar a separação e marcar como pronto") |
| Em separação | "Liberar para entrega" (pedido de Entrega) / "Liberar para retirada" (pedido de Retirada) | Não |
| Liberados | "Concluir pedido" (botão verde) | Não |

Cancelado não tem rodapé com botão; Concluído mantém só "Cancelar pedido".

### 2.2 Diálogos de confirmação

São três diálogos, cada um com ícone, título, texto e dois botões; fecham sem alterar o pedido ao clicar fora ou no botão de recuo:

1. **Conferência → Na fila** — título "Liberar pedido para a fila"; texto "Ao liberar este pedido para a separação, você **não poderá mais fazer edições** nos itens."; botões "Cancelar" e "Confirmar".
2. **Pular etapa para Liberados** (Conferência → Liberados e Na fila → Liberados, o mesmo diálogo) — título "Avançar pedido direto para Liberados?"; texto "Ao confirmar, o sistema entenderá que os itens já foram separados fisicamente e o pedido está **pronto para entrega**" em pedido de Entrega ou "**pronto para retirada**" em pedido de Retirada; botões "Voltar" e "Sim, avançar pedido".
3. **Liberados → Concluído** — título "Concluir pedido #<número>?"; texto "O pedido será finalizado e marcado como concluído. Esta ação não pode ser desfeita."; botões "Cancelar" e "Concluir pedido".

Na fila → Em separação e Em separação → Liberados acontecem direto, sem diálogo.

### 2.3 Cancelamento — qualquer status, incluindo Concluído

Não fica restrito aos status ativos (Conferência até Liberados) — confirmado por Matheus em 2026-09-24, corrigindo a versão anterior do PRD. A modal de cancelamento (título "Cancelar pedido: #<número>", ícone de cancelamento, motivos em seleção única, botões "Cancelar" e "Confirmar cancelamento", este bloqueado até escolher um motivo) é a própria confirmação, sem diálogo adicional, e traz o texto "Selecione o motivo. O cliente será notificado e o estorno processado."; o cancelamento notifica o cliente e processa o estorno (quando aplicável).

### 2.4 Motivos de cancelamento (10 opções, confirmado 2026-10-01)

Endereço incorreto, Cliente não estava no local indicado, Cliente não precisava mais dos itens, Cliente solicitou produto por engano, Pedido duplicado, Pedido atrasado, Pedido indisponível, Suspeita de fraude, Sem estoque, **Teste interno**. As 9 primeiras já existem no Portal hoje; "Teste interno" é confirmado por Matheus (apareceu consistentemente nos dois protótipos antes da confirmação).

### 2.5 Cálculo de estorno respeitando estorno parcial

Se o pedido já sofreu estorno parcial na Conferência (item removido/reduzido, só pedidos pagos no app, via Braspag), o cancelamento estorna apenas o valor restante ainda não estornado — nunca o valor original de novo, mesmo quando o cancelamento acontece bem depois da Conferência (ex.: a partir de Concluído).

### 2.6 "Pular etapa": Na fila → Liberados e Conferência → Liberados

O pulo é sempre direto para **Liberados**, a partir de Na fila ou de Conferência (respostas do PO de 2026-10-06); o diálogo é o mesmo nas duas origens (2.2). Conferência → Na fila é o caminho sequencial, com o diálogo "Liberar pedido para a fila".

### 2.7 Snackbar de status e "Desfazer"

Após cada transição intermediária (Conferência → Na fila, Na fila → Em separação, Em separação → Liberados e o pulo para Liberados) aparece um snackbar: `Status atualizado para "<novo status>"` ("Na fila", "Em separação", "Liberados") com a ação **"Desfazer"**, por **5 segundos**. Ao clicar em "Desfazer", o pedido volta ao status anterior (status, trilha de auditoria e itens como estavam antes da transição) e aparece `Status voltou para "<status anterior>"` por 3,2 segundos, sem ação. Concluir e cancelar não têm snackbar nem "Desfazer". Os efeitos do "Desfazer" no back-end (por exemplo, após a entrada em "Na fila", gatilho de captura pelo ERP, ou após ajuste de itens com estorno parcial) estão em aberto (ECP-1517).

### 2.8 Saída do pedido da lista ao concluir ou cancelar

Ao concluir ou cancelar, o modal permanece aberto e exibe, abaixo da barra superior, a barra verde "Pedido concluído" ou vermelha "Pedido cancelado" ("O pedido será movido para Finalizados ao fechar."), com o botão "Fechar agora" e uma linha de progresso de 3 segundos; ao fim dos 3 segundos o modal fecha sozinho (ou por "Fechar agora", "x", Esc ou clique fora). Enquanto está aberto, o pedido fica "segurado" na lista e nos contadores de "Em andamento" com o estado anterior; ao fechar, passa para "Finalizados" e os contadores das duas abas são atualizados. A navegação ▲ / ▼ pula o pedido finalizado, segue a fila em aberto e cancela o fechamento automático (ver [Detalhe-Pedido-Modal-Status-Tracker.md](Detalhe-Pedido-Modal-Status-Tracker.md), 3.9).

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
| Pedido já no último status ativo (Liberados) | Não há "pular etapa"; o botão é "Concluir pedido", com o diálogo "Concluir pedido #<número>?" |
| Confirma cancelamento sem selecionar motivo | Ação bloqueada até selecionar um motivo ("Confirmar cancelamento" desabilitado) |
| Cancela pedido já Concluído, com estorno parcial prévio | Estorna só o valor restante não estornado |
| `canceledReason` vazio | Cancelamento via ERP, não erro; "Cancelado por: sistema" |
| Navega pro próximo pedido (▲/▼) com confirmação pendente na tela atual | A definir — cenário identificado no ECP-1449 sem regra fechada ainda |
| Pedido em Conferência | Botão split "Liberar para fila"; o chevron permite pular direto para Liberados, com o mesmo diálogo do pulo de Na fila |
| Conferência → Na fila (sequencial) | Diálogo "Liberar pedido para a fila" |
| Na fila → Liberados (pulo) | Diálogo "Avançar pedido direto para Liberados?" |
| Pedido de Entrega em "Em separação" | Botão "Liberar para entrega" (Retirada: "Liberar para retirada") |
| Status acabou de avançar | Snackbar `Status atualizado para "X"` com "Desfazer" por 5 segundos (não há snackbar na conclusão nem no cancelamento) |
| Pedido em Conferência com ajuste de itens libera para a fila (ou pula para Liberados) | O ajuste é efetivado junto com a transição e a trilha registra os eventos do ajuste |
| Pedido em Conferência com ajuste de itens e o detalhe é fechado sem avançar | O ajuste não é efetivado; o pedido continua com os itens originais |

## 5. Pendências / perguntas em aberto

- [ ] Canal/mecanismo exato da notificação ao cliente no cancelamento.
- [ ] Comportamento de navegação ▲/▼ com uma confirmação pendente na tela atual — ainda sem regra fechada (ECP-1449).
- [ ] Efeitos do "Desfazer" no back-end (captura pelo ERP ao entrar em "Na fila", estorno parcial já processado, eventos da trilha apagados ou compensados) — a definir com a engenharia (ECP-1517).
- [ ] Menu do chevron na Conferência: o protótipo de referência usa o mesmo menu das duas etapas (cabeçalho "Pular direto para", opção "Liberados", apoio "Ignorar a separação e marcar como pronto"); confirmar para a Conferência.
- [ ] Pulo Conferência → Liberados: quais eventos de status são registrados para as etapas puladas (o protótipo registra um único evento, "Status: Liberados").
- [ ] Pedido em Conferência com ajuste de itens pendente cancelado: o protótipo descarta o ajuste (cancelamento sobre os itens originais); confirmar com o PO.
- [ ] Alinhar `PRD-edicao-pedidos-etapa-revisao.md`, que ainda cita a modal "Liberar pedido para a fila" ao liberar a Conferência: sem diálogo em Conferência → Na fila, o commit do rascunho acontece direto na transição.
- [ ] **Localizar o serviço real que hoje serve a contagem de Cancelados** (pra confirmar se a query da seção 3.1 bate com o que o backend realmente faz, não só com o número final exibido).

## Changelog

- **2026-10-08** — Protótipo "Novo Portal - Navegável" (Claude Design) é a verdade e sobrepõe decisões anteriores de Pedidos (PRD v2.15): três diálogos (Conferência → Na fila, pular etapa para Liberados com o mesmo texto nas duas origens, Concluir pedido); snackbar com "Desfazer" por 5 segundos e retorno `Status voltou para ...` (não existe na conclusão nem no cancelamento); barra "Pedido concluído/cancelado" com "Fechar agora" e fechamento em 3 segundos, pedido "segurado" na lista até fechar; o modal de cancelamento traz o texto "O cliente será notificado e o estorno processado.". Efeitos do "Desfazer" no back-end ficam como pendência.
- **2026-10-07** — Revisão contra o protótipo Claude Design de 07/10 (ECP-1517, ECP-1559): ajuste de itens na Conferência como rascunho, efetivado só na mudança de etapa (2.9); o cancelamento entra na trilha como "Pedido cancelado" (ponto vermelho, com motivo e usuário) e a pendência do cancelamento com ajuste pendente foi registrada. Divergências do protótipo com decisões do PO, não adotadas: fechamento automático do modal em 3 s com o pedido mantido na lista até fechar; "Desfazer" e duração de 5 s no snackbar; diálogos "Liberar pedido para a fila" e "Concluir pedido"; mesmo diálogo no pulo da Conferência e de Na fila; aviso "O cliente será notificado e o estorno processado" no modal de cancelamento.
- **2026-10-06** — Handoff Figma e respostas do PO: diálogo de confirmação só no pulo de etapa (Na fila → Liberados e Conferência → Liberados, cada um com a própria modal); Conferência → Na fila e Concluir pedido sem diálogo (substituem os 3 diálogos anteriores e a regra de que Conferência não pula etapa); botões por etapa conforme o Figma, com "Liberar para entrega"/"Liberar para retirada" em "Em separação"; snackbar `Status atualizado para "X"` por 10 segundos, sem "Desfazer"; modal de cancelamento sem o aviso "O cliente será notificado e o estorno processado" (regra de negócio mantida); "Cancelado por" = "sistema" quando o cancelamento veio do ERP; ícones de navegação ▲ / ▼.
- **2026-10-05 (2)** — Decisão do PO: ao concluir ou cancelar, o pedido sai de "Em andamento" e vai para "Finalizados" imediatamente (a regra "só sai quando o modal fecha" deixa de valer); o modal segue aberto até o usuário fechar e ◀ / ▶ seguem a fila em aberto.
- **2026-10-05** — Decisão do PO: o modal não fecha automaticamente após concluir ou cancelar (a duração de 5 segundos definida no mesmo dia deixa de valer); o modal só fecha por ação do usuário.
- **2026-10-05** — Duração do modal aberto após concluir/cancelar definida: 5 segundos.
- **2026-10-02** — Adicionado o momento da saída do pedido da lista (2.8): só quando o modal fecha, com contadores atualizados.

- **2026-10-01 (2)** — Adiciona a query de Cancelados reaproveitável (seção 3.1), com nota honesta sobre ser validada por número, não confirmada no código-fonte do backend.
- **2026-10-01** — Revalidado contra o código-fonte do protótipo Claude Design: confirma "Teste interno" como 10º motivo; adiciona textos exatos de confirmação por caso; reforça que só "Na fila → Liberados" tem pular etapa (o protótipo tinha um pulo de Conferência por engano); reforça que não existe "Desfazer"/undo (o protótipo tinha um, por engano — sobra de versão anterior).
- **2026-09-30** — Criação do documento (v1), a partir de ECP-1517, ECP-1449, PRD seções 6.5/6.8, e [[feedback_status_change_query_rules]].

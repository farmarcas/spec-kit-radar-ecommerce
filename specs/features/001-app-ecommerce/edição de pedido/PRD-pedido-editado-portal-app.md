# PRD — Pedido Editado no Portal (visão App / Consumidor)

**Produto:** Radar (App — Consumidor Final)
**Squad:** App
**Autor:** Daniel (PO)
**Status:** Em refinamento — base para geração de histórias via Claude Code
**Versão:** 1.0
**PRD de origem (Portal):** [`specs/features/portal/Editar.Pedido/PRD-edicao-pedidos-etapa-revisao.md`](../../portal/Editar.Pedido/PRD-edicao-pedidos-etapa-revisao.md) (v2.0, 2026-07-31)

---

## 0. Changelog

**v1.0 (2026-07-31)** — Primeira versão. Documenta a visão do App para a funcionalidade de Edição de Pedidos na etapa "Conferência" do Portal (ver PRD de origem), com base no protótipo Figma da seção **"Pedido editado no portal"** (nós `2707:551` a `2725:7221`, ver seção 16).

---

## 1. Contexto

O Portal do Lojista está implementando a etapa obrigatória **"Conferência"**, onde o Balconista pode, antes da captura do pedido pelo ERP: reduzir quantidade de item, remover item, ou cancelar o pedido inteiro (ver PRD de origem, seções 1 e 2). Essas edições impactam diretamente o pedido que o Consumidor já fez no App — o valor cobrado muda, itens somem, e em alguns casos o pedido inteiro é cancelado.

O PRD de origem já prevê (seção 7) que o Consumidor final deve ser avisado dessas mudanças via **push notification**, mas deixa o protótipo da tela de detalhe do pedido no App como **dependência de UX fora daquele documento** (seção 15). Este PRD cobre exatamente essa lacuna: como o App **recebe, comunica e apresenta** uma edição feita no Portal, com base no protótipo Figma já existente para essa subseção.

Sem essa comunicação clara, o Consumidor só percebe a divergência de valor/itens ao conferir o pedido físico na entrega/retirada — gerando desconfiança na farmácia associada, disputas de cobrança e potencial não-recompra, o que impacta negativamente a **NSM (Volume de Transações por Loja Ativa)**.

## 2. Objetivo

Garantir que, sempre que um pedido for editado (item ajustado/removido) ou cancelado no Portal durante a etapa Conferência, o Consumidor:
- seja notificado via push de forma clara e imediata;
- veja o pedido sinalizado como alterado na lista "Meus pedidos";
- consiga abrir o detalhe do pedido e entender exatamente **o que mudou** (quais itens, de quanto para quanto) e **o impacto financeiro** (estorno ou ajuste no valor a cobrar), sem precisar contatar o suporte para isso.

**Impacto na NSM:** comunicação clara reduz a percepção de erro/fraude por parte do Consumidor, sustentando a confiança na farmácia associada e a taxa de recompra — protegendo o Volume de Transações por Loja Ativa.

## 3. Escopo

### Dentro do escopo (V1 / protótipo)
- Tag "Pedido atualizado" no card do pedido na lista "Meus pedidos", somando-se à tag de status existente, quando houver alteração de item (sem cancelamento total).
- Tela de "Detalhes do pedido": tag "Pedido atualizado" no cabeçalho, texto explicativo acima da lista de itens, e tags por item ("Qtd. ajustada X → Y" e "Produto removido").
- Recebimento e apresentação de push notification consolidada por pedido (uma notificação por evento de alteração/cancelamento, não uma por item — herdado do PRD de origem, seção 7).
- Bloco "Resumo da compra" recalculado, com linha de impacto financeiro rotulada conforme forma de pagamento:
  - **"Estorno"** (verde, valor negativo) quando o pedido foi pago no app (ex.: Pix, Cartão de Crédito).
  - **"Itens removidos"** (verde, valor negativo) quando o pedido é pago na entrega/retirada (ex.: Dinheiro) — sem menção a estorno, pois não houve cobrança prévia.
- Apresentação do caso de item com preço promocional dividido ("Limite por compra", ver PRD de origem seção 6.7): exibição como duas linhas de produto (linha "Oferta" + linha "Preço normal"), com a tag de ajuste na linha que sofreu a redução.
- Variação de conteúdo por modalidade de entrega: "Endereço de entrega" (entrega) vs. "Loja para retirada" (retirada), e etapas de progresso do pedido específicas de cada modalidade (ex.: "Em transporte" vs. "Pronto para retirada").
- Leitura somente (o Consumidor não edita nada no App a partir dessa tela — toda edição é exclusiva do Portal, ver `context/product.md`, "Fora do Escopo do App": Edição de pedidos OMS → Portal).

### Fora do escopo (V1)
- Qualquer ação de edição pelo Consumidor no App (fora de escopo do App como um todo).
- Trilha de Auditoria (existe apenas no Portal, dentro do detalhe do pedido — ver PRD de origem seção 9).
- Copy final e definição visual do card/banner de push notification fora do que já está prototipado em Figma (ver nota na seção 15 sobre a peça "Push" encontrada fora da subseção analisada).
- Tela/estado para **cancelamento total do pedido** feito no Portal — não há protótipo desse cenário na subseção "Pedido editado no portal" analisada (ver seção 15, dependência aberta).
- Dashboard de indicadores (UI) — apenas requisitos de dados ficam definidos aqui (seção 12), espelhando o mesmo tratamento do PRD de origem.

## 4. Personas

Feature agnóstica de persona — qualquer Consumidor do App (Consumidor Fidelizado, Consumidor PBM ou Consumidor Eventual, ver `context/product.md`) pode ser afetado, já que a edição depende do pedido feito e não do perfil do comprador. O **Balconista** é o ator que origina a mudança, mas atua exclusivamente no Portal (fora do escopo deste PRD — ver PRD de origem).

## 5. Fluxo (visão App)

```
[Pedido editado/cancelado na Conferência do Portal] (ver PRD de origem, seção 5)
              │
              ▼
     Push notification consolidada disparada ao Consumidor
              │
              ├── Consumidor abre a notificação → Tela "Detalhes do pedido"
              │
              └── Consumidor não abre a notificação → tag "Pedido atualizado"
                    permanece visível no card do pedido em "Meus pedidos"
                    até que o detalhe seja aberto pelo menos uma vez
```

Observações:
- Este fluxo só começa a existir **depois** do commit do rascunho no Portal (liberação para "Na fila") — o App nunca vê o estado provisório de edição ("Rascunho") descrito no PRD de origem (seção 6.6); ele só reflete o resultado final e persistido.
- Não há, na subseção de Figma analisada, uma tela dedicada ao cenário de **cancelamento total** do pedido (distinto de uma alteração de itens) — ver dependência aberta na seção 15.

## 6. Regras de negócio

### 6.1 Lista "Meus pedidos" — sinalização de pedido alterado
- O card do pedido no Portal exibe, junto à tag de status (ex.: "Pedido em andamento"), uma segunda tag laranja **"🔶 Pedido atualizado"** quando o pedido sofreu ajuste de item.
- Pedidos concluídos ou já cancelados na lista não exibem essa tag combinada — o próprio status ("Pedido concluído", "Pedido cancelado") comunica o estado final.

### 6.2 Tela "Detalhes do pedido" — cabeçalho
- Mantém a tag de status existente (ex.: "Pedido em andamento") e adiciona a tag **"📦 Pedido atualizado"** (fundo amarelo claro, texto laranja) ao lado.
- Abaixo do cabeçalho, a seção "Itens do pedido" ganha um texto de apoio: *"Alguns itens foram alterados devido à disponibilidade em estoque"*.

### 6.3 Tags por item
- **Item com quantidade reduzida:** tag amarela **"📦 Qtd. ajustada X → Y"** (ex.: "Qtd. ajustada 3 → 2"), exibida abaixo do nome/marca do produto. O preço exibido é o preço já recalculado (quantidade nova × preço unitário).
- **Item removido:** tag vermelha **"❌ Produto removido"**, exibida no lugar da tag de ajuste. Diferente do Portal (que usa tachado + opacidade 50% durante a edição ao vivo em Conferência — ver PRD de origem, seção 6.2), o App exibe o item em **texto normal** (sem tachado/opacidade), já que aqui não há mais nada "em andamento" para o Consumidor — é o registro do que foi removido, não uma ação reversível.
- Itens não afetados pela edição são exibidos normalmente, sem tag.

### 6.4 Split de preço promocional ("Limite por compra")
Espelha o corner case do PRD de origem (seção 6.7), mas com apresentação simplificada para o Consumidor (sem stepper, sem linha-pai/linha-filha):
- O produto aparece como **duas linhas de produto independentes**: uma com tag verde **"Oferta"** (quantidade e preço promocional, fixos, não afetados pela edição) e outra com tag azul **"Preço normal"** (a parte que estava no preço de loja/excedente).
- A tag de ajuste **"Qtd. ajustada X → Y"** aparece apenas na linha efetivamente alterada pelo lojista — no exemplo observado, sempre a linha "Preço normal" (excedente), nunca a linha "Oferta", consistente com a regra do Portal de priorizar manter unidades no preço promocional (seção 6.7 do PRD de origem).
- Produtos com promoção "Sem limite de unidade" não geram split — aparecem como um único item, igual ao fluxo padrão (6.3).

### 6.5 Resumo financeiro ("Resumo da compra")
- **Subtotal:** valor original do pedido, antes da edição.
- **Linha de impacto** (valor sempre em verde, negativo):
  - Rotulada **"Estorno"** quando a forma de pagamento é feita no app (ex.: Pix, Cartão de Crédito) — reflete o valor que será/foi estornado automaticamente via Braspag (ver PRD de origem, seção 8).
  - Rotulada **"Itens removidos"** quando a forma de pagamento é offline (ex.: Dinheiro na entrega/retirada) — não há estorno, apenas redução do valor a cobrar do cliente no ato da entrega/retirada.
- **Frete:** mantido sem alteração.
- **Total:** recalculado, refletindo o novo subtotal + frete.
- Para itens com split promocional, o valor da linha de impacto reflete o preço efetivo recalculado (não uma média simples por unidade) — mesma regra do PRD de origem (seção 6.7/8).

### 6.6 Forma de pagamento e modalidade de entrega
- Bloco "Forma de pagamento" inalterado na estrutura, apenas reflete o meio usado no pedido (Pix, Cartão de Crédito, Dinheiro, etc.).
- Bloco de localização varia por modalidade:
  - **Entrega:** "Endereço de entrega" com o endereço do Consumidor.
  - **Retirada:** "Loja para retirada" com o endereço da farmácia associada.
- A barra de progresso do pedido reflete etapas específicas da modalidade (ex.: "Em transporte — Seu pedido saiu para entrega" vs. "Pronto para retirada — Você já pode retirar seu pedido na loja"), sem relação direta com a edição, mas presente em todas as telas analisadas dessa seção.

## 7. Notificações push (recebidas pelo Consumidor)

Consumo, pelo App, dos dois eventos já definidos no PRD de origem (seção 7):

| Evento | Conteúdo observado no protótipo Figma | Ação ao tocar |
|---|---|---|
| Pedido alterado/cancelado | Título: "Seu pedido foi atualizado" / Corpo: "Alguns itens foram alterados devido à disponibilidade em estoque" | Abre a tela "Detalhes do pedido" |
| Estorno realizado | Não prototipado nesta subseção — copy e visual ainda pendentes (ver seção 15) | — |

> **Nota:** a peça de push "Seu pedido foi atualizado" foi localizada no Figma **fora** da subseção "Pedido editado no portal" pedida (está agrupada sob uma seção genérica "Push"), mas usa a mesma copy do texto de apoio da tela de detalhe (seção 6.2). Ela resolve, ao menos parcialmente, a dependência de copy que o PRD de origem (seção 15) listava como aberta — vale alinhar com UX/Portal se essa copy já é a final.

Regras herdadas do PRD de origem (seção 7), sem alteração do lado do App:
- Notificação única mesmo que múltiplos itens tenham sido alterados.
- Pago no app → recebe também a notificação de estorno após confirmação da Braspag.
- Pago offline → recebe apenas a notificação de alteração, sem menção a estorno.

## 8. Estorno (visão Consumidor)

- O App não dispara nem processa o estorno — apenas **reflete** o resultado da integração Braspag (automática, só para pagamento no app) já descrita no PRD de origem (seção 8).
- Para o Consumidor, o estorno aparece exclusivamente como a linha "Estorno" no Resumo da compra (seção 6.5) — não há tela ou notificação adicional prototipada além do evento de push da tabela acima.

## 9. Trilha de Auditoria

Fora do escopo do App. A Trilha de Auditoria (PRD de origem, seção 9) existe apenas dentro do detalhe do pedido no Portal, como ferramenta operacional do Balconista — o Consumidor não tem visibilidade de quem fez a alteração, apenas do resultado final (itens/valores).

## 10. Toasts e tags

- **Tag no card da lista:** "Pedido atualizado" (ver 6.1).
- **Tag no cabeçalho do detalhe:** "Pedido atualizado" (ver 6.2).
- **Tags por item:** "Qtd. ajustada X → Y" (amarela) e "Produto removido" (vermelha) (ver 6.3).
- **Tags de composição promocional:** "Oferta" (verde) e "Preço normal" (azul) (ver 6.4).
- Não há toasts nesta feature do lado do App — a comunicação principal é a push notification (seção 7) e a sinalização persistente por tags, não um toast transitório.

## 11. Modelo de dados / eventos a rastrear (requisito para indicadores — fase 2)

Complementar ao já definido no PRD de origem (seção 11), do lado do App é necessário registrar (mínimo):

- `pedido_id`, `consumidor_id`, `timestamp_notificacao_enviada`, `timestamp_notificacao_aberta` (se aberta)
- Tipo de evento recebido: `pedido_alterado` | `pedido_cancelado` | `estorno_realizado`
- `abriu_detalhe_apos_notificacao` (booleano) — para medir efetividade da comunicação
- Forma de pagamento do pedido (`app` | `offline`) — para cruzar com métricas de estorno do PRD de origem

## 12. Indicadores / relatórios (fase 2 — requisitos de dados definidos agora, UI a definir com UX depois)

1. Taxa de abertura da notificação de "pedido alterado/cancelado".
2. Tempo médio entre o envio da notificação e a abertura do detalhe do pedido.
3. Taxa de contato ao suporte/CS em pedidos com edição vs. sem edição (proxy de eficácia da comunicação).
4. Taxa de recompra (ver Glossário) em pedidos que sofreram edição vs. pedidos sem edição — impacto direto na NSM.

## 13. Casos de borda / edge cases

| Cenário | Comportamento esperado |
|---|---|
| Pedido com item removido | Tag "Produto removido" no item, texto normal (sem tachado), linha de impacto financeiro recalculada |
| Pedido com quantidade reduzida | Tag "Qtd. ajustada X → Y" no item, preço do item recalculado |
| Pedido pago no app (Pix/Cartão) com edição | Resumo mostra linha "Estorno" (verde); Consumidor recebe notificação de alteração + notificação de estorno |
| Pedido pago offline (Dinheiro) com edição | Resumo mostra linha "Itens removidos" (verde), sem menção a estorno; Consumidor recebe apenas notificação de alteração |
| Item com "Limite por compra" reduzido | Exibido como 2 linhas ("Oferta" + "Preço normal"); tag de ajuste aparece na linha "Preço normal" |
| Pedido em modalidade entrega | Tela mostra "Endereço de entrega" e etapa "Em transporte" |
| Pedido em modalidade retirada | Tela mostra "Loja para retirada" e etapa "Pronto para retirada" |
| Pedido cancelado por completo no Portal | **Sem protótipo nesta subseção** — comportamento a confirmar com UX (ver seção 15) |
| Consumidor não abre a notificação | Tag "Pedido atualizado" permanece visível no card da lista até o detalhe ser aberto |

## 14. Critérios de aceite (exemplos, formato Given/When/Then)

**Sinalização na lista de pedidos**
- Dado que um pedido do Consumidor foi editado (item ajustado ou removido) no Portal e liberado para a fila,
- Quando o Consumidor abre a tela "Meus pedidos",
- Então o card desse pedido exibe a tag "Pedido atualizado" além da tag de status.

**Detalhe do pedido reflete item com quantidade ajustada**
- Dado um pedido com um item que teve a quantidade reduzida de 3 para 2 unidades no Portal,
- Quando o Consumidor abre o detalhe desse pedido,
- Então o item exibe a tag "Qtd. ajustada 3 → 2" e o preço exibido reflete a nova quantidade.

**Detalhe do pedido reflete item removido**
- Dado um pedido com um item removido no Portal,
- Quando o Consumidor abre o detalhe desse pedido,
- Então o item exibe a tag "Produto removido" e o Resumo da compra reflete o novo subtotal.

**Rótulo de impacto financeiro — pago no app**
- Dado um pedido pago via Pix com um item removido,
- Quando o Consumidor visualiza o Resumo da compra,
- Então a linha de impacto é rotulada "Estorno", em verde, com o valor correspondente à diferença.

**Rótulo de impacto financeiro — pago offline**
- Dado um pedido pago em Dinheiro na retirada com um item removido,
- Quando o Consumidor visualiza o Resumo da compra,
- Então a linha de impacto é rotulada "Itens removidos", em verde, sem qualquer menção a estorno.

**Split promocional refletido no detalhe**
- Dado um produto com "Limite por compra" que teve a parte "Preço normal" (excedente) reduzida no Portal,
- Quando o Consumidor abre o detalhe do pedido,
- Então o produto aparece em duas linhas ("Oferta" e "Preço normal") e apenas a linha "Preço normal" exibe a tag de ajuste.

**Notificação consolidada**
- Dado um pedido com múltiplos itens alterados na mesma liberação de rascunho no Portal,
- Quando a liberação é confirmada,
- Então o Consumidor recebe uma única notificação push "Seu pedido foi atualizado", não uma por item.

## 15. Dependências e itens abertos

- **UX:** confirmar se a peça de push "Seu pedido foi atualizado" (encontrada na seção "Push" do Figma, fora da subseção pedida) é de fato a copy final adotada — e se ela resolve a dependência de copy apontada como aberta no PRD de origem (seção 15).
- **UX/Produto:** não existe, na subseção "Pedido editado no portal" analisada, nenhuma tela para o cenário de **cancelamento total do pedido** feito no Portal (distinto de edição de item) — precisa ser prototipado e documentado antes da implementação dessa parte.
- **UX:** confirmar se a ausência de tachado/opacidade no item removido (diferente do tratamento do Portal) é intencional ou um detalhe a alinhar entre os protótipos das duas squads.
- **Notificação de estorno:** não há protótipo de tela/notificação específico para "estorno realizado" nesta subseção — apenas a menção no PRD de origem (seção 7). Confirmar se ela aparece em outra parte do Figma ou se ainda está pendente.
- **Integração com o PRD de origem:** este documento assume que o commit único do rascunho (PRD de origem, seção 6.6) é o gatilho de disparo da notificação — qualquer mudança nessa regra do lado do Portal deve ser refletida aqui.

## 16. Anexo — Referência visual (protótipos analisados)

- **Link Figma App:** https://www.figma.com/design/7Pi4v28TLqe0YhcqqKAEjR/App-%C2%B7-E-commerce?node-id=2510-5982 — subseção "Pedido editado no portal"
- **Telas analisadas (node-id):**
  - `2707:551` — Meus pedidos (lista, com tag "Pedido atualizado" no card)
  - `2707:1339` — Detalhes do pedido — qtd. ajustada [entrega]
  - `2707:1555` — Detalhes do pedido — produto removido [entrega]
  - `2708:871` — Detalhes do pedido — qtd. ajustada [retirada]
  - `2708:1016` — Detalhes do pedido — produto removido [retirada]
  - `2725:7221` — Detalhes do pedido — qtd. ajustada [item em oferta] (split promocional)
- **PRD de origem (Portal):** [`specs/features/portal/Editar.Pedido/PRD-edicao-pedidos-etapa-revisao.md`](../../portal/Editar.Pedido/PRD-edicao-pedidos-etapa-revisao.md)

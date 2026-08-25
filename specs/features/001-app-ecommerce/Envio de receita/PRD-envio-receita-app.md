# PRD — Envio digital de receita médica no checkout (App)

**Produto:** Radar (App — Consumidor Final)
**Squad:** App
**Autor:** Daniel (PO)
**Status:** Em refinamento — base para geração de histórias via Claude Code
**Versão:** 1.3

---

## 0. Changelog

**v1.3 (2026-08-25)** — PO respondeu a maior parte dos itens que estavam na seção 12 (dependências), fechando praticamente todas as questões de UX/Produto levantadas até aqui:
1. Formatos e tamanho aceitos definidos: **JPG, PNG ou PDF, até 2MB** (6.4).
2. A tag **"Exige receita"** deixa de existir em todo o app — a partir desta feature, todas as ocorrências (PDP, carrinho, resumo do checkout, entrega) passam a usar o texto **"Receita obrigatória"**, alinhando com o que já aparecia no detalhe do pedido (6.11) — é um rename global do baseline, não uma tag nova exclusiva desta feature.
3. Nome da receita confirmado como sequencial por ordem de envio: "Receita 1", "Receita 2", ... — nunca o nome do arquivo original (6.4).
4. Checkout (incluindo receitas já anexadas) deve **persistir** normalmente entre sessões — sem tela/comportamento especial a prototipar (5).
5. A mensagem do status Fila (6.9) aparece **somente no detalhe do pedido**, não no card da lista "Pedidos em andamento".
6. Confirmado que a regra deste PRD **se aplica a todas as formas de pagamento** disponíveis para retirada (5).
7. Removidas as observações sobre "confirmar formalmente com UX/Produto a remoção do 'Em conferência' nos protótipos oficiais" e sobre "Squad Portal detalhar a exibição do anexo" — o comportamento já está definido neste PRD (6.8/6.10) e não bloqueia o entendimento do fluxo; ajustes de protótipo e desenho de tela do Portal ficam para depois, fora deste documento.

**v1.2 (2026-08-25)** — Duas confirmações do PO que fecham os pontos em aberto da v1.1:
1. A regra de liberação do botão "Ir para pagamento" (6.5) deixa de ser uma hipótese inferida do protótipo — fica confirmada como **"existir pelo menos 1 receita anexada ao pedido"**, sem exigir 1 receita por item (uma receita física costuma cobrir vários medicamentos).
2. Documentado, pela primeira vez, o lado da farmácia: o documento de receita enviado pelo app passa a ficar **anexado ao pedido, visível para a farmácia** (Portal) — sem nenhuma outra mudança de status ou de fluxo de atendimento do pedido (ver 6.10).

**v1.1 (2026-08-25)** — O PO trouxe uma informação que faltava: a mensagem complementar do status "Fila" ("Pedido recebido") passa a mudar quando o pedido tem receita anexada (ver 6.9). Isso resolve o conflito apontado na v1.0 entre o texto do termo de aceite (que promete uma "conferência" da receita) e a decisão de não expor status de validação no app — a comunicação passa a existir, mas embutida na mensagem já existente do status Fila, sem reintroduzir a etapa "Em conferência" nem status por receita.

**v1.0 (2026-08-25)** — Primeira versão. Documenta o novo fluxo de envio digital de receita médica dentro do checkout, com base no protótipo Figma da seção **"17. Receita no pedido"** (nós `2709:3536` a `3170:5475`, ver seção 16). Incorpora duas decisões explícitas do PO que alteram o protótipo original: (1) remoção do status "Em conferência" da tela de detalhes do pedido; (2) remoção da validação/aprovação de receita e da possibilidade de reenviar receita após o pedido fechado — a tela de detalhes do pedido passa a ser somente leitura da receita enviada.

---

## 1. Contexto

Hoje (baseline vigente, ver `specs/features/001-app-ecommerce/spec.md`, seção 5.1) a compra de um medicamento controlado (categoria "Medicamentos com Retenção de Receita", sujeita à RDC 144/ANVISA) já é suportada pelo app, mas de forma **totalmente física**: FR-003 exibe a mensagem "Retirada na loja mediante apresentação da receita" no detalhe do produto, FR-004/FR-005 forçam a retirada na loja (sem entrega em casa), e a tag "Exige receita" aparece no carrinho (FR-039) e no resumo do checkout (FR-006). Em nenhum momento o app recebe uma imagem da receita — ela é conferida presencialmente, na retirada.

Este PRD documenta uma **proposta ainda não lançada** (confirmado com o PO — ver memória de sessão sobre o Figma "App · E-commerce": o canvas "17. Receita no pedido" é protótipo, não produção) que insere uma etapa de **upload digital da receita** no checkout, entre a escolha de entrega/retirada e o pagamento. O objetivo é permitir que o farmacêutico já receba uma cópia digital da receita antes da retirada, sem eliminar a exigência legal de apresentação do documento físico original no balcão.

O PO trouxe duas restrições explícitas para este documento, que **divergem do que está desenhado no protótipo Figma**:
1. Não considerar o status **"Em conferência"** na tela de detalhes do pedido — deve ser removido da barra de progresso do pedido para simplificar o fluxo.
2. Não considerar a **validação da receita** pela farmácia nem a possibilidade de **adicionar uma nova receita depois do pedido fechado** — na tela de detalhes do pedido, o cliente **apenas visualiza** a receita que enviou no checkout.

Essas duas restrições são tratadas em detalhe na seção 6.8. Uma terceira informação, trazida pelo PO após a primeira versão deste documento, resolve uma tensão que havia entre o texto do bottom sheet de termos (que promete uma "conferência" da receita) e a restrição 2: a mensagem complementar do status "Fila" muda quando há receita anexada ao pedido (ver 6.9).

## 2. Objetivo

Permitir que o consumidor anexe, durante o checkout, uma ou mais fotos da receita médica dos itens controlados do pedido — reduzindo a chance de o pedido ser barrado ou atrasado por divergência de receita apenas no momento da retirada, e antecipando essa informação para a farmácia.

**Impacto na NSM:** menos fricção/abandono no checkout de pedidos com controlados (hoje 100% dependente da apresentação física, sem qualquer sinalização prévia) sustenta a conclusão de compra desses itens, protegendo o Volume de Transações por Loja Ativa.

## 3. Escopo

### Dentro do escopo (V1 / protótipo, com os ajustes do PO)

- Nova etapa obrigatória **"Receita médica"** no checkout, exibida somente quando há item(ns) controlado(s) no carrinho, entre a tela de entrega/retirada e o pagamento.
- Upload de uma ou mais fotos de receita via câmera nativa do aparelho ou galeria nativa (sem tela própria de recorte/edição no app).
- Lista somente leitura **"Itens que exigem receita"**, com os produtos controlados do carrinho.
- Lista **"Receitas enviadas"**, com ações **Visualizar** e **Remover** por receita, via bottom sheet "Opções da receita".
- Regra de liberação do botão "Ir para pagamento": basta **1 receita anexada ao pedido** (ver 6.5 — confirmado pelo PO).
- Feedback de sucesso (banner verde "Receita adicionada com sucesso") e de erro (banner vermelho "Formato ou tamanho inválido").
- Bottom sheet de termos **"Antes de continuar"**, com checkbox obrigatório, antes de seguir para pagamento.
- Exibição da(s) receita(s) enviada(s) na tela "Detalhes do pedido", em **modo somente leitura** (ação "Visualizar" apenas — ver 6.8).
- Remoção da etapa "Em conferência" da barra de progresso do pedido em "Detalhes do pedido" (ver 6.8).
- Mensagem complementar do status "Fila"/"Pedido recebido" alterada quando o pedido tem receita anexada (ver 6.9) — aparece somente no detalhe do pedido, não na lista "Pedidos em andamento".
- Documento da receita anexado ao pedido e visível para a farmácia no Portal, sem alterar status/fluxo de atendimento (ver 6.10).
- Renomeação global da tag "Exige receita" → **"Receita obrigatória"** em todo o app (PDP, carrinho, checkout, detalhe do pedido — ver 6.11).

### Fora do escopo (V1) — inclui itens do protótipo explicitamente descartados pelo PO

- **Status "Em conferência"** na barra de progresso da tela "Detalhes do pedido" — removido por decisão do PO (instrução 1). O protótipo original previa esse passo com dois estados ("O farmacêutico está revisando sua receita" e, em caso de sucesso, "Receita aprovada") — nenhum dos dois entra neste escopo.
- **Validação/aprovação/reprovação da receita** dentro do app — removida por decisão do PO (instrução 2). O protótipo original previa um bottom sheet "Não foi possível aprovar sua receita" com CTA "Enviar nova receita" (nó `3170:5475`) — fora de escopo.
- **Adicionar nova receita depois do pedido fechado** — removido por decisão do PO (instrução 2). Na tela de detalhes do pedido não há botão "Adicionar receita" nem menu de opções (Visualizar/Remover); apenas visualização.
- Tela de visualização em tela cheia da imagem da receita ("Visualizar") — não há protótipo dela nesta subseção; a funcionalidade é referenciada (botão existe) mas a tela em si é uma dependência aberta (ver seção 12).
- Fluxo de pagamento em si (tela após "Concordar e continuar") — baseline já existente, fora deste documento.
- PBM e qualquer interação entre desconto de convênio e receita — tratado em outro PRD/épico (ver `specs/features/001-app-ecommerce/PBM/`).
- Qualquer decisão automatizada de leitura/validação de receita (OCR, IA) — nada no protótipo indica isso.

## 4. Personas

Feature agnóstica de persona — qualquer Consumidor do App (Consumidor Fidelizado, Consumidor PBM ou Consumidor Eventual, ver `context/product.md`) que tenha item controlado no carrinho passa por este fluxo, independente de PBM.

## 5. Fluxo

```
PDP (item controlado)
        │
        ▼
     Carrinho ── tag "Receita obrigatória" no item (rename do baseline, ver 6.11)
        │
        ▼
  Entrega/retirada ── controlado força retirada na loja (baseline, FR-004/005)
        │
        ▼ [carrinho tem 1+ item controlado]
  "Receita médica" (NOVO) ── upload de 1+ foto(s) de receita
        │
        ├── "Ir para pagamento" (desabilitado até regra de liberação, ver 6.5)
        │
        ▼
  Bottom sheet "Antes de continuar" ── checkbox obrigatório
        │
        ▼
  "Concordar e continuar" → Pagamento (baseline, fora de escopo — vale para qualquer forma de pagamento disponível na retirada)
        │
        ▼
  Pedido confirmado
        │
        ▼
  "Detalhes do pedido" ── barra de progresso SEM "Em conferência" (ver 6.8)
                           receita(s) enviada(s) em modo SOMENTE LEITURA
```

Observações:
- Se o carrinho não tiver item controlado, a etapa "Receita médica" não aparece — checkout segue direto de entrega/retirada para pagamento (baseline inalterado).
- Confirmado pelo PO: esta etapa e suas regras se aplicam **igualmente a todas as formas de pagamento** disponíveis para retirada (Pix, cartão, dinheiro, etc. — baseline FR-046/047) — não há variação por forma de pagamento.
- O checkout como um todo **persiste** normalmente entre sessões do app (comportamento já existente) — inclui as receitas já anexadas: se o consumidor sair do checkout antes de concluir a etapa "Receita médica" e retornar depois, as receitas já enviadas continuam lá. Não é um comportamento novo a desenhar, apenas a extensão natural da persistência do checkout ao novo passo.

## 6. Regras de negócio

### 6.1 Quando a etapa "Receita médica" aparece

- A etapa só é inserida no checkout quando o carrinho contém ao menos um item da categoria "Medicamentos com Retenção de Receita" (mesmo conceito de "medicamento controlado" do baseline, ver Glossário/`spec.md`).
- A lista "Itens que exigem receita", dentro da tela, mostra **todos** os itens controlados do carrinho (imagem, nome do produto, fabricante/tipo) — é somente leitura, não há como remover um item controlado a partir dessa tela (remoção de item é função do carrinho, baseline).

### 6.2 Tela "Receita médica" — estado vazio

- Header: "Receita médica".
- Texto de apoio: *"Alguns medicamentos do seu pedido exigem receita médica. Envie uma ou mais receitas para continuar."*
- Seção "Itens que exigem receita" com os cards dos produtos controlados (ver 6.1).
- Seção "Receita médica" com botão **"Adicionar receita"** (contorno azul, ícone "+").
- Rodapé fixo: Total do pedido, contagem de produtos, condição de parcelamento (herdado do resumo do checkout, baseline) e botão **"Ir para pagamento"** — **desabilitado** (cinza) neste estado, pois nenhuma receita foi enviada ainda.

### 6.3 Adicionar receita — captura da foto

- Toque em "Adicionar receita" abre um bottom sheet **"Adicionar receita"** com o texto *"Escolha como deseja enviar a receita médica."* e três ações:
  - **"Tirar foto"** (botão preenchido azul, ícone câmera) — abre a câmera nativa do aparelho.
  - **"Escolher na biblioteca"** (contorno azul, ícone galeria) — abre o seletor nativo de fotos do aparelho (seleção de uma imagem por vez, conforme protótipo).
  - **"Cancelar"** — fecha o bottom sheet sem ação.
- Câmera e galeria são os pickers nativos do sistema operacional — **não há tela própria de recorte, rotação ou edição da foto dentro do app** (confirmado nos nós `2865:525` "tirar foto" e `2868:569` "escolher na biblioteca": ambos são mockups da UI nativa do iOS, sem elementos customizados do Radar).

### 6.4 Resultado do upload — sucesso e erro

- **Sucesso:** ao concluir a captura/seleção, a tela "Receita médica" reaparece com:
  - Banner verde no topo, padrão "System Banner": *"Receita adicionada com sucesso"*.
  - A seção passa a se chamar **"Receitas enviadas (N)"**, com um card por receita: nome **sequencial pela ordem de envio** — a primeira receita enviada no pedido é sempre "Receita 1", a segunda "Receita 2", e assim por diante — nunca o nome do arquivo original (ex.: nunca "IMG_4582.jpg", mesmo que a captura via galeria tenha esse nome de origem). Subtítulo *"Receita enviada com sucesso"* e ícone de check verde.
  - O botão "Adicionar receita" permanece disponível para anexar mais receitas.
- **Erro (formato/tamanho inválido):** banner vermelho no topo, padrão "System Banner - erro": *"Formato ou tamanho inválido"*. A receita **não** é adicionada à lista e a contagem não muda.
  - **Formatos aceitos:** JPG, PNG ou PDF.
  - **Tamanho máximo:** 2MB por arquivo.
  - Qualquer arquivo fora desses critérios (outro formato, ou acima de 2MB) dispara o banner de erro.

### 6.5 Regra de liberação do botão "Ir para pagamento"

**Confirmado pelo PO (v1.2):** a regra é **existir pelo menos 1 receita anexada ao pedido** — não é "1 receita por item controlado". Uma receita física costuma cobrir vários medicamentos ao mesmo tempo, então uma única foto pode ser suficiente para liberar o pagamento mesmo com múltiplos itens controlados no carrinho.

| Itens que exigem receita | Receitas enviadas | Estado do botão "Ir para pagamento" |
|---|---|---|
| 1 ou mais | 0 | Desabilitado (cinza) |
| 1 ou mais | 1 ou mais | Habilitado (azul) |

O protótipo Figma mostra uma progressão com 2 itens exigindo 2 receitas para habilitar o botão (nós `2726:11963`/`3028:7022` com 1 receita ainda desabilitado, `2728:12174`/`2728:12405` com 2 receitas habilitado) — **essa contagem não reflete a regra final**; era apenas a sequência de telas do protótipo demonstrando a UI de múltiplos anexos, não um gate de "1 por item". Os protótipos precisam ser corrigidos/realinhados para não sugerir esse gate (ver dependência, seção 12).

Não há, na tela "Receita médica", qualquer vínculo entre uma receita enviada e um item específico da lista "Itens que exigem receita" — a lista de itens é só informativa (mostra o que exige receita), e a lista de receitas enviadas é independente dela.

### 6.6 Remover ou visualizar uma receita já enviada

- O ícone "⋮" (mais opções) em cada card de receita abre o bottom sheet **"Opções da receita"** com três ações:
  - **"Visualizar"** (preenchido azul) — abre a imagem da receita. Não há protótipo da tela de visualização em si nesta subseção (dependência, seção 12).
  - **"Remover"** (contorno azul) — remove a receita da lista "Receitas enviadas".
  - **"Cancelar"**.
- Ao remover uma receita, a contagem "Receitas enviadas (N)" deve ser recalculada e a regra de liberação do botão "Ir para pagamento" (6.5) deve ser reavaliada — se a quantidade cair abaixo do mínimo exigido, o botão volta a ficar desabilitado.

### 6.7 Bottom sheet de termos "Antes de continuar"

Ao tocar em "Ir para pagamento" (já habilitado pela regra 6.5), abre o bottom sheet **"Antes de continuar"**, com:

- **Bloco 1 — "A receita original poderá ficar retida na farmácia":** *"Para medicamentos que exigem retenção, você deverá entregar a receita médica original à farmácia, conforme as regras aplicáveis."*
- **Bloco 2 — "Seu pedido ainda passará por uma conferência":** *"A receita enviada será analisada pela farmácia. Caso esteja ilegível, incompleta ou apresente alguma divergência, seu pedido ou o prazo de entrega/retirada poderão ser alterados."*
- Checkbox obrigatório: *"Li e estou de acordo com as condições acima."*
- Botão primário **"Concordar e continuar"** — desabilitado (cinza) até o checkbox ser marcado; habilitado (azul) após marcado. Ao confirmar, segue para a tela de pagamento (baseline, fora deste PRD).
- Botão secundário **"Cancelar"** — fecha o bottom sheet, mantém o usuário na tela "Receita médica" sem alterar nada.

> **Nota (resolvida na v1.1):** o texto do "Bloco 2" acima afirma que a receita "será analisada pela farmácia" e que isso pode alterar o pedido ou o prazo. Na v1.0 deste PRD, isso foi apontado como um conflito com a instrução 2 do PO, já que o app não exibe mais status de validação por receita. O PO esclareceu que a comunicação dessa análise acontece por outro canal, já existente: a mensagem complementar do status "Fila" muda quando há receita anexada ao pedido (ver 6.9) — sem reintroduzir a etapa "Em conferência" nem qualquer status por receita. Se a farmácia efetivamente identificar um problema na receita (ilegível, incompleta, divergente), a alteração do pedido/prazo prometida aqui é resolvida pelo mecanismo já coberto em [`PRD-pedido-editado-portal-app.md`](../edição%20de%20pedido/PRD-pedido-editado-portal-app.md) (edição/cancelamento do pedido no Portal, com push notification e sinalização "Pedido atualizado" no app) — não é um fluxo novo deste documento.

### 6.8 Tela "Detalhes do pedido" — ajustes por decisão do PO

O protótipo original (nós `3170:4836` "em andamento" e `3170:5083` "em andamento (sucesso)") mostra uma barra de progresso de 5 passos incluindo um passo 2 "Em conferência" (com os textos "O farmacêutico está revisando sua receita" / "Receita aprovada") e uma seção "Receitas enviadas" com status por receita ("Em análise" / "Receita aprovada") e um ícone de visualização que, em caso de rejeição, abre o bottom sheet "Não foi possível aprovar sua receita" com CTA "Enviar nova receita" (`3170:5475`).

**Por decisão do PO, para este PRD:**

- **Barra de progresso:** remover o passo "Em conferência" por completo. A barra passa a ter os passos ainda vigentes: **"Pedido recebido" → "Em separação" → "Em transporte" → "Concluído"** (renumerados de 1 a 4, sem lacuna). Nenhum dos textos "O farmacêutico está revisando sua receita" ou "Receita aprovada" deve aparecer no app.
- **Seção "Receitas enviadas":** lista as receitas enviadas no checkout, cada uma com nome ("Receita N") e a ação **"Visualizar"** apenas (reaproveitando a tela de visualização referenciada em 6.6, ainda não prototipada) — **sem** subtítulo de status ("Em análise" / "Receita aprovada" / rejeição), **sem** menu de opções, **sem** "Remover" e **sem** "Adicionar receita". É uma lista puramente de consulta.
- O bottom sheet "Não foi possível aprovar sua receita" / "Enviar nova receita" (`3170:5475`) **não deve ser implementado**.
- A tag amarela **"Receita obrigatória"** no card do item controlado (dentro de "Itens do pedido") é mantida — e passa a ser consistente com o restante do app, já que a tag "Exige receita" (PDP, carrinho, checkout) é renomeada para o mesmo texto (ver 6.11).

### 6.9 Mensagem complementar do status "Fila" quando há receita anexada

Informação trazida pelo PO (v1.1) para resolver a tensão apontada na 6.7: em vez de reintroduzir status de validação por receita, o app comunica que a receita está sendo conferida através da mensagem já existente do status **"Fila"** (exibido como "Pedido recebido" na barra de progresso do detalhe do pedido — ver `specs/FAQ-App-Radar-Ecommerce.md`, seção Notificações).

- **Hoje (baseline, pedido sem receita):** mensagem do status Fila é *"A farmácia recebeu o seu pedido."*
- **Novo (pedido com 1+ receita anexada):** mensagem do status Fila passa a ser *"O farmacêutico está validando a sua receita."*
- A troca de mensagem depende apenas de o pedido ter **ao menos uma** receita anexada no checkout — independe da quantidade de itens que exigem receita ou de quantas receitas foram enviadas (não é a mesma contagem da regra 6.5).
- A mensagem "O farmacêutico está validando a sua receita" permanece durante **todo o tempo em que o pedido está no status Fila** — não há um sub-estado que sinalize que a validação "terminou" enquanto o pedido ainda está em Fila. A transição para a mensagem de "Em separação" (baseline, ver FAQ) acontece exatamente como hoje, na mudança normal de status.
- Isso **não** cria uma nova etapa na barra de progresso (a barra continua "Pedido recebido → Em separação → Em transporte → Concluído", sem "Em conferência", conforme 6.8) e **não** cria uma notificação push adicional — é só o texto complementar do status Fila que muda; a tabela de mensagens de push por transição (ver FAQ, seção Notificações) não é alterada, já que não há push na entrada do status Fila hoje.
- **Confirmado pelo PO:** essa mensagem aparece **somente na tela "Detalhes do pedido"** — não no card da lista "Pedidos em andamento" (ver FAQ, seção "Histórico e acompanhamento de pedidos"), que continua mostrando apenas o indicador de etapas, sem o texto complementar.
- Se a receita for identificada como inválida pela farmácia depois de enviada, esse cenário é tratado pelo mecanismo já existente de edição/cancelamento do pedido no Portal (ver Nota na seção 6.7) — não por este PRD.

### 6.10 Visibilidade da receita para a farmácia (Portal)

Informação trazida pelo PO (v1.2) para fechar a lacuna: este PRD documenta a visão do App (Consumidor), mas a farmácia precisa conseguir ver o que foi enviado — sem isso, as regras 6.7 (termo que menciona análise da farmácia) e 6.9 (mensagem "farmacêutico está validando") não fariam sentido operacionalmente.

- Cada receita enviada pelo consumidor no checkout (6.3/6.4) fica **anexada ao pedido correspondente**, visível para a farmácia no Portal.
- É **apenas um documento anexado ao pedido** — a farmácia não recebe nenhum status, alerta ou ação obrigatória associada a essa receita dentro do fluxo de atendimento do Portal.
- **Nenhuma outra mudança de status ou de fluxo de atendimento do pedido é criada por causa disso** — o pedido segue exatamente as mesmas etapas e regras que já existem hoje no Portal (Fila → Em separação → etc.), só que agora com um anexo visível.
- Este é o requisito de negócio registrado para quando as histórias dessa etapa forem escritas; o desenho de tela do Portal (onde exatamente o anexo aparece) é tratado à parte pela squad Portal.

### 6.11 Renomeação global da tag "Exige receita" → "Receita obrigatória"

**Confirmado pelo PO (v1.3):** a partir desta feature, **todas** as ocorrências da tag "Exige receita" no app passam a ser exibidas como **"Receita obrigatória"**. Não é uma tag nova exclusiva da tela "Detalhes do pedido" (onde já nascia com esse texto, ver 6.8) — é um rename que atinge o baseline inteiro, sem mudar onde/quando a tag aparece, só o texto:

| Tela | Requisito baseline afetado | Texto antigo | Texto novo |
|---|---|---|---|
| Detalhe do produto (PDP) | FR-003 | "Exige receita" | "Receita obrigatória" |
| Carrinho | FR-039 | "Exige receita" | "Receita obrigatória" |
| Checkout — resumo do pedido | FR-006 | "Exige receita" | "Receita obrigatória" |
| Checkout — entrega/retirada | FR-044 | "Exige receita" | "Receita obrigatória" |
| Detalhes do pedido | Este PRD (6.8) | "Receita obrigatória" | "Receita obrigatória" (inalterado) |

A mensagem de texto corrido "Retirada na loja mediante apresentação da receita" (FR-003/FR-005) **não muda** — é uma frase diferente da tag, fora do escopo deste rename. Recomenda-se atualizar a copy referenciada em `spec.md` (FR-003/FR-006/FR-039/FR-044) quando as histórias desta feature forem geradas.

## 7. Toasts e banners

| Evento | Estilo | Texto |
|---|---|---|
| Receita enviada com sucesso | Banner verde, topo, ícone de confirmação | "Receita adicionada com sucesso" |
| Erro no upload (formato/tamanho) | Banner vermelho, topo, ícone de erro | "Formato ou tamanho inválido" |

Ambos seguem o padrão "System Banner" já usado em outras partes do app (aparecem sobrepostos à status bar, no topo da tela).

## 8. Modelo de dados / eventos a rastrear (requisito para indicadores — fase 2)

Como a validação/status de análise está fora de escopo (ver 6.8), o modelo de dados do lado do App precisa registrar, no mínimo:

- `pedido_id`, `consumidor_id`
- Por receita enviada: `receita_id`, `arquivo_referencia` (upload), `formato` (`jpg` | `png` | `pdf`), `tamanho_bytes` (máx. 2MB, ver 6.4), `origem` (`camera` | `galeria`), `timestamp_envio`
- `checkbox_termos_aceito_em` (timestamp de quando o consumidor concordou com o bottom sheet de termos, 6.7)
- Eventos de erro de upload (`tipo_erro`: `formato_invalido` | `tamanho_excedido`, `timestamp`) — para medir taxa de falha de formato/tamanho

Não há campo de status de aprovação/reprovação do lado do app, por decisão do PO (6.8) — qualquer processo de conferência da farmácia acontece fora da visão do app. Não há vínculo `produto_id` ↔ `receita_id`: a regra de liberação (6.5) é apenas "1+ receita no pedido", sem associação por item — confirmado na v1.2.

O `arquivo_referencia` de cada receita precisa ser acessível também pelo Portal (ver 6.10) — este é o único dado deste modelo que cruza para fora do App; o desenho de como o Portal consulta/exibe esse anexo é responsabilidade da squad Portal.

## 9. Indicadores / relatórios (fase 2 — requisitos de dados definidos agora, UI a definir com UX depois)

1. Taxa de conclusão da etapa "Receita médica" (chegou na tela vs. avançou para pagamento).
2. Taxa de abandono do checkout especificamente nesta etapa, comparada a checkouts sem item controlado.
3. Tempo médio entre a chegada na tela "Receita médica" e a conclusão ("Concordar e continuar").
4. Taxa de erro de upload (formato/tamanho inválido) sobre o total de tentativas de envio.
5. Número médio de receitas enviadas por pedido com item(ns) controlado(s) — insumo para validar a regra da seção 6.5 na prática.

## 10. Casos de borda / edge cases

| Cenário | Comportamento esperado |
|---|---|
| Carrinho com 1 item controlado | Lista "Itens que exigem receita" mostra 1 item; basta 1 receita anexada para liberar (6.5) |
| Carrinho com N itens controlados, 1 única foto de receita cobrindo todos | Botão "Ir para pagamento" libera normalmente — a regra (6.5) não conta itens, só exige 1+ receita no pedido |
| Consumidor remove a única receita enviada | Botão "Ir para pagamento" volta a ficar desabilitado |
| Upload com formato/tamanho inválido | Banner de erro "Formato ou tamanho inválido"; receita não é adicionada; contagem inalterada |
| Consumidor cancela o bottom sheet "Adicionar receita" sem escolher uma opção | Nenhuma alteração; permanece na tela "Receita médica" |
| Consumidor não marca o checkbox de termos | Botão "Concordar e continuar" permanece desabilitado |
| Consumidor sai do checkout (ex.: fecha o app) e retorna antes de finalizar | Checkout persiste normalmente (comportamento já existente) — as receitas já enviadas continuam na lista "Receitas enviadas" |
| Upload de arquivo PDF (em vez de foto) | Aceito, desde que até 2MB (ver 6.4) — formatos aceitos: JPG, PNG ou PDF |
| Consumidor remove a "Receita 1" e mantém a "Receita 2" | Comportamento de renumeração não especificado pelo PO — implementação livre para decidir se renumera para "Receita 1" ou mantém o nome original |
| Carrinho sem item controlado | Etapa "Receita médica" não aparece no checkout |
| Pedido concluído/pago com receita enviada | Tela "Detalhes do pedido" mostra a(s) receita(s) em modo somente leitura (ação "Visualizar"), sem status e sem barra "Em conferência" (ver 6.8) |
| Pedido com receita anexada, ainda no status Fila | Mensagem complementar do status é "O farmacêutico está validando a sua receita" (ver 6.9), em vez de "A farmácia recebeu o seu pedido" |
| Pedido sem receita anexada (sem item controlado), no status Fila | Mensagem complementar permanece "A farmácia recebeu o seu pedido" (baseline, inalterado) |
| Pedido com receita(s) enviada(s) | Documento(s) ficam anexados ao pedido e visíveis para a farmácia no Portal (6.10), sem alterar nenhuma outra etapa do fluxo de atendimento |

## 11. Critérios de aceite (exemplos, formato Given/When/Then)

**Etapa aparece apenas com item controlado**
- Dado um carrinho com ao menos um medicamento controlado,
- Quando o consumidor conclui a escolha de entrega/retirada no checkout,
- Então o app exibe a etapa "Receita médica" antes do pagamento.

**Botão desabilitado sem receita**
- Dado que o consumidor está na tela "Receita médica" sem nenhuma receita enviada,
- Quando ele visualiza o rodapé da tela,
- Então o botão "Ir para pagamento" está desabilitado.

**Upload de receita com sucesso**
- Dado que o consumidor toca em "Adicionar receita" e escolhe "Tirar foto",
- Quando a foto é capturada com sucesso,
- Então o app exibe o banner "Receita adicionada com sucesso" e a receita aparece na lista "Receitas enviadas".

**Upload com formato inválido**
- Dado que o consumidor tenta anexar um arquivo em formato não suportado,
- Quando o upload é processado,
- Então o app exibe o banner "Formato ou tamanho inválido" e a receita não é adicionada à lista.

**Uma receita libera o pagamento mesmo com vários itens controlados**
- Dado um carrinho com 2 itens controlados e apenas 1 receita enviada,
- Quando o consumidor visualiza o rodapé da tela "Receita médica",
- Então o botão "Ir para pagamento" está habilitado — a regra não exige 1 receita por item.

**Termos obrigatórios antes do pagamento**
- Dado que o consumidor já tem 1 ou mais receitas enviadas (ver 6.5),
- Quando ele toca em "Ir para pagamento" e não marca o checkbox de termos,
- Então o botão "Concordar e continuar" permanece desabilitado.

**Detalhe do pedido não exibe "Em conferência"**
- Dado um pedido com item controlado e receita enviada,
- Quando o consumidor abre a tela "Detalhes do pedido",
- Então a barra de progresso não exibe nenhum passo "Em conferência", indo direto de "Pedido recebido" para "Em separação".

**Detalhe do pedido é somente leitura para a receita**
- Dado um pedido já concluído com receita enviada,
- Quando o consumidor abre a seção "Receitas enviadas" no detalhe do pedido,
- Então ele só encontra a ação "Visualizar" — sem opção de adicionar, remover ou ver status de análise.

**Mensagem do status Fila reflete a receita anexada**
- Dado um pedido com ao menos uma receita anexada no checkout, ainda no status Fila,
- Quando o consumidor abre a tela "Detalhes do pedido",
- Então a mensagem complementar do passo "Pedido recebido" é "O farmacêutico está validando a sua receita", em vez da mensagem padrão "A farmácia recebeu o seu pedido".

**Receita fica visível para a farmácia (Portal)**
- Dado um pedido criado com 1 ou mais receitas enviadas pelo consumidor no checkout,
- Quando a farmácia acessa esse pedido no Portal,
- Então ela encontra o(s) documento(s) de receita anexados ao pedido, sem que nenhuma etapa adicional de status/fluxo de atendimento tenha sido criada por causa disso.

## 12. Dependências e itens abertos

Praticamente todos os pontos levantados nas versões anteriores foram resolvidos pelo PO (ver Changelog v1.3). Resta em aberto:

- **UX:** desenhar a tela de "Visualizar" receita em tela cheia — referenciada por botões em duas telas (checkout, 6.6, e detalhe do pedido, 6.8), mas sem protótipo próprio nesta subseção do Figma. É o único item que ainda bloqueia o desenho completo da UI.

Itens de menor risco, deixados para implementação decidir sem bloquear o entendimento do fluxo (ver seção 10, casos de borda):
- Se a lista "Receitas enviadas" renumera os nomes ("Receita 1", "Receita 2"...) após uma remoção no meio da lista, ou mantém os nomes originais.

## 13. Anexo — Referência visual (protótipos analisados)

- **Link Figma App:** https://www.figma.com/design/7Pi4v28TLqe0YhcqqKAEjR/App-%C2%B7-E-commerce?node-id=2661-2980 — canvas **"17. Receita no pedido"**
- **Telas analisadas (node-id):**
  - `2709:3536` — 1. pdp (contexto — item controlado no detalhe do produto, baseline)
  - `2709:6242` — 2. carrinho (contexto — não aprofundado neste PRD, baseline já documentado em `spec.md`)
  - `2709:6408` — 3. entrega (escolha de entrega/retirada, baseline)
  - `2725:9554` — 3.2 receita (novo) — estado vazio
  - `2728:12283` — 3.2 receita (novo) — bottom sheet "Adicionar receita" aberto
  - `2726:11963` — 3.2 receita (novo) — 1 receita enviada, banner de sucesso visível
  - `3028:7022` — 3.2 receita (novo) — 1 receita enviada, sem banner (CTA ainda desabilitado)
  - `2728:12174` — 3.2 receita (novo) — 2 receitas enviadas (CTA habilitado)
  - `2728:12405` — 3.2 receita (novo) — 2 receitas enviadas, bottom sheet "Opções da receita" aberto
  - `2868:2051` — System Banner - erro ("Formato ou tamanho inválido")
  - `3170:3346` — 3.3 - aceitar termos (checkbox desmarcado, CTA desabilitado)
  - `3170:4544` — 3.3 - aceitar termos (checkbox marcado, CTA habilitado)
  - `2865:525` — tirar foto (mockup de câmera nativa)
  - `2868:569` — escolher na biblioteca (mockup de galeria nativa)
  - `3170:4836` — detalhes do pedido - em andamento (protótipo original, com "Em conferência" — **não usar**, ver 6.8)
  - `3170:5083` — detalhes do pedido - em andamento (sucesso) (protótipo original, com "Em conferência"/"Receita aprovada" — **não usar**, ver 6.8)
  - `3170:5475` — bottom sheet - ver motivo (rejeição de receita — **fora de escopo**, ver seção 3)

# PRD — Refazer Pedido (Recompra) no App

**Produto:** Radar (App — Consumidor Final)
**Squad:** App
**Autor:** Daniel (PO)
**Status:** Em refinamento — base para geração de histórias via Claude Code
**Versão:** 1.2
**Epics relacionados:** Gerenciamento de Pedidos ([ECA-842](https://farmarcas.atlassian.net/browse/ECA-842)) e Edição de Pedidos ([ECA-881](https://farmarcas.atlassian.net/browse/ECA-881)) — ambos em produção.

---

## 0. Changelog

**v1.2 (2026-09-15)** — Revisão com o PO: (1) corrigido o status dos pedidos que exibem "Repetir pedido" — o botão aparece apenas em pedidos **concluídos** e **cancelados**, não em pedidos **em andamento**; (2) confirmado que o botão "Repetir pedido" na tela de Detalhes do Pedido já foi desenhado pelo UX; (3) confirmado que o novo envio de receita (6.8) ocorre dentro do Checkout existente, sem tela adicional; (4) nova regra 6.10 — recompra de pedidos editados no Portal usa as **quantidades já editadas**, não as originais, como base da validação.

**v1.1 (2026-09-08)** — Removida a validação de preço do escopo: a recompra valida **somente disponibilidade em estoque** de cada item na loja ativa. Divergência de preço não é mais um tipo de ajuste tratado por esta feature.

**v1.0 (2026-09-08)** — Primeira versão. Documenta a ação "Repetir pedido" (funcionalidade **Recompra**, ver `context/glossary.md`), com base no protótipo Figma em torno do node `2510:5982` (arquivo "App · E-commerce") e nas decisões de escopo alinhadas com o PO em sessão de dúvidas (ver seção 15).

---

## 1. Contexto

O App já lista os pedidos do Consumidor em "Meus Pedidos" (fruto do Gerenciamento de Pedidos, ECA-842) e já comunica quando um pedido foi alterado ou cancelado pelo Balconista via Portal (ver [PRD — Pedido Editado no Portal](../edição%20de%20pedido/PRD-pedido-editado-portal-app.md), ECA-881). O glossário do produto já lista **Recompra** como funcionalidade core do App: "repetir um pedido anterior com um clique".

O protótipo Figma analisado detalha o que essa "recompra com um clique" precisa cobrir na prática: nem todo pedido antigo pode ser repetido do jeito que foi feito — itens podem estar fora de estoque, ter tido a quantidade limitada, ou não existirem mais na loja. Sem tratar esses casos, o botão "Repetir pedido" quebraria a expectativa do Consumidor (adicionaria o pedido errado ao carrinho, ou falharia silenciosamente), gerando fricção justamente na ação pensada para reduzir fricção — com impacto direto na **NSM (Volume de Transações por Loja Ativa)**, já que Recompra é um dos principais caminhos para nova transação em uma Loja Ativa.

Esta PRD cobre a lógica de validação e as telas de resultado dessa ação, com base no protótipo e nas decisões de escopo tomadas com o PO (seção 15).

## 2. Objetivo

Permitir que o Consumidor repita, com o mínimo de esforço, um pedido anterior (concluído ou cancelado) — remontando os itens desse pedido **na loja atualmente ativa** do Consumidor, validando disponibilidade em estoque de cada item antes de levá-lo ao Checkout, e comunicando com clareza quando algo mudou ou quando a recompra não é possível.

**Impacto na NSM:** Recompra é um dos atalhos mais diretos para gerar uma nova transação em uma Loja Ativa. Uma recompra que falha silenciosamente, adiciona itens errados ao carrinho, ou gera desconfiança sobre o pedido, reduz a conversão desse atalho — o oposto do que a funcionalidade deveria entregar.

## 3. Escopo

### Dentro do escopo (V1)

- Ação **"Repetir pedido"** disponível em três pontos de entrada:
  - Card "Último pedido" (atalho rápido no topo de "Meus pedidos").
  - Cada card do "Histórico de pedidos" na lista "Meus pedidos".
  - Tela de "Detalhes do pedido" (novo ponto de entrada, fora do protótipo analisado nesta PRD — já desenhado pelo UX separadamente).
- Disponível apenas para pedidos com status **"Pedido concluído"** e **"Pedido cancelado"** — o botão **não aparece** em pedidos **"Pedido em andamento"**. Cancelamento (pelo Consumidor, pela loja, ou por edição no Portal) não impede a recompra.
- **Validação item a item** do pedido original contra o catálogo da **loja atualmente ativa** do Consumidor (nunca a loja original do pedido, caso sejam diferentes — ver regra 6.1).
- Casamento de produto **por EAN/SKU exato** — sem sugestão de produto equivalente/similar (fora de escopo V1, ver seção 3.2).
- Três desfechos possíveis pós-validação: sucesso direto, ajuste parcial (com revisão), e indisponibilidade total (bloqueio) — ver seção 6.
- Dois tipos de divergência tratados: quantidade reduzida por estoque insuficiente, e produto indisponível/inexistente na loja atual. **Preço não é validado** — o item é adicionado ao preço atual da loja ativa, mesmo que diferente do pago no pedido original.
- Navegação para o **Checkout padrão** após sucesso ou confirmação dos ajustes, sempre pedindo confirmação explícita de forma de pagamento e endereço/retirada (sem pré-preencher com dados do pedido original).
- Exigência de **novo envio de receita médica** quando o pedido original contém item Controlado, mesmo repetindo os mesmos itens (ver `specs/features/001-app-ecommerce/Envio de receita/PRD-envio-receita-app.md`).

### Fora do escopo (V1)

- Sugestão de produto equivalente/similar quando o EAN exato não existe mais na loja ativa (o item entra como "Produto indisponível").
- Qualquer fluxo de seleção de loja: a feature assume que o Consumidor **sempre** tem uma loja ativa selecionada antes de iniciar uma compra (pré-condição do produto, não tratada aqui).
- Pré-preenchimento do Checkout com forma de pagamento/endereço do pedido original — o Checkout pós-recompra é o fluxo padrão, do zero.
- Reaproveitamento automático de receita médica já validada — repetir um pedido com Controlado sempre exige novo envio.
- Edição seletiva de itens dentro do bottom sheet de ajuste (o Consumidor só pode aceitar todos os itens ajustados ou cancelar a recompra inteira — não há remoção item a item nessa tela).
- **Validação de preço:** a feature não compara o preço do pedido original com o preço atual do item. O Consumidor paga o preço vigente da loja ativa no momento da recompra, sem alerta de divergência.

## 4. Personas

Feature agnóstica de persona — qualquer Consumidor do App (Consumidor Fidelizado, Consumidor PBM ou Consumidor Eventual, ver `context/product.md`) pode acionar "Repetir pedido" a partir do seu próprio histórico.

## 5. Fluxo

```
Consumidor toca em "Repetir pedido"
   (card "Último pedido" | card do histórico | tela de detalhes do pedido)
              │
              ▼
   Sistema valida cada item do pedido original
   contra o catálogo da LOJA ATIVA do Consumidor
   (match por EAN/SKU exato; loja do Consumidor nunca muda)
              │
   ┌──────────┼───────────────────────┬─────────────────────────┐
   ▼                                  ▼                          ▼
Todos os itens OK             Alguns itens OK,            Nenhum item
(mesmo EAN, estoque            outros com divergência       disponível
 suficiente)                   (qtd. reduzida/indisponível)      │
   │                                  │                          ▼
   ▼                                  ▼                 Banner vermelho bloqueante
Itens adicionados            Bottom sheet "Alguns          "Nenhum item desse
 ao carrinho +                itens foram ajustados"        pedido está disponível
 toast "Produto               (lista só os itens            no momento."
 adicionado"                  afetados, com tag por         Carrinho inalterado.
   │                          tipo de divergência)          Ação encerra aqui.
   ▼                                  │
                          ┌───────────┴───────────┐
                          ▼                        ▼
                 "Adicionar itens              "Cancelar"
                  ajustados"                  Carrinho inalterado,
                          │                    permanece na tela de origem
                          ▼
              Itens (ajustados) adicionados
                 ao carrinho + toast
              "Produto adicionado"
                          │
              ┌───────────┴───────────────────────┐
              ▼                                    ▼
   Pedido contém item Controlado?          Pedido sem Controlados
              │ sim                                │
              ▼                                    ▼
   Fluxo de envio de receita              Checkout padrão (forma de
   (novo envio obrigatório)               pagamento e entrega/retirada
              │                            pedidas do zero)
              └────────────────┬───────────────────┘
                                ▼
                       Checkout padrão
```

## 6. Regras de negócio

### 6.1 Loja de destino da recompra
- O carrinho e o Checkout são sempre da **loja atualmente ativa** do Consumidor — a mesma pré-condição de qualquer compra no App (o Consumidor sempre seleciona a loja antes de iniciar o processo de compra).
- Repetir um pedido feito originalmente em **outra loja** não troca a loja ativa do Consumidor: o sistema usa a lista de produtos/quantidades do pedido original apenas como referência, e tenta remontá-la **na loja atual**.
- Não existe cenário de "carrinho com itens de duas lojas": a validação e o carrinho resultante são sempre da loja ativa.

### 6.2 Validação item a item (matching)
- Cada item do pedido original é buscado no catálogo da loja ativa **por EAN/SKU exato**.
- Não há sugestão de produto equivalente/similar quando o EAN não existe na loja ativa — o item é tratado como indisponível (ver 6.3).
- Para cada item encontrado, o sistema compara **somente estoque disponível vs. quantidade original**. Preço não é validado nem comparado — o item é sempre adicionado ao preço vigente na loja ativa.

### 6.3 Classificação de cada item pós-validação
| Resultado da validação | Tratamento |
|---|---|
| Mesmo EAN, estoque ≥ quantidade original | Item adicionado ao carrinho sem alteração, sem tag (ao preço vigente da loja ativa). |
| Mesmo EAN, estoque insuficiente (estoque > 0 e < quantidade original) | Tag **"Quantidade ajustada X → Y"** (azul) — adiciona a quantidade disponível. |
| EAN não encontrado na loja ativa, ou estoque = 0 | Tag **"Produto indisponível"** (vermelha) — item não é adicionado ao carrinho. |

### 6.4 Desfecho: sucesso direto
- Se **todos** os itens do pedido original passam na validação sem nenhuma divergência (seção 6.3, primeira linha), os itens são adicionados diretamente ao carrinho da loja ativa.
- O Consumidor vê o toast **"Produto adicionado"** e é levado direto ao **Checkout** (ver 6.6).

### 6.5 Desfecho: ajuste parcial
- Se **pelo menos um** item tem alguma divergência (6.3) mas **pelo menos um** item também está disponível sem alteração, o sistema abre o bottom sheet **"Alguns itens foram ajustados"** com o texto de apoio "Revise as alterações antes de adicionar os produtos ao carrinho."
- O bottom sheet lista **somente os itens com divergência** (ajustados ou indisponíveis) — os itens sem alteração não aparecem nessa tela, apenas são adicionados ao carrinho junto com os ajustados quando confirmado.
- Duas ações:
  - **"Adicionar itens ajustados"** (botão primário): adiciona ao carrinho os itens disponíveis (ajustados ou não) nas quantidades válidas, ao preço vigente na loja ativa; itens indisponíveis não entram. Toast **"Produto adicionado"** e navegação para o **Checkout** (mesmo caminho da seção 6.4).
  - **"Cancelar"** (link): aborta a recompra — carrinho permanece inalterado, Consumidor permanece na tela de origem (lista ou detalhe do pedido).

### 6.6 Desfecho: indisponibilidade total
- Se **nenhum** item do pedido original está disponível na loja ativa (todos caem na última linha da tabela 6.3), a recompra é bloqueada.
- Exibe um banner vermelho fixo: **"Nenhum item desse pedido está disponível no momento."**, sobreposto à tela de origem (lista "Meus pedidos" ou detalhe do pedido).
- Carrinho permanece inalterado; não há navegação — a ação simplesmente não avança.

### 6.7 Checkout pós-recompra
- Após sucesso direto (6.4) ou confirmação de ajustes (6.5), o Consumidor é levado direto ao **Checkout padrão** (mesmo fluxo usado em qualquer compra no App) — sem passar por uma tela de revisão de carrinho intermediária dedicada a essa feature.
- O Checkout **não** reaproveita forma de pagamento nem endereço/loja de retirada do pedido original — o Consumidor sempre confirma esses dados do zero, como em qualquer outra compra.

### 6.8 Medicamentos Controlados
- Se o pedido original contém ao menos um item Controlado (retirada obrigatória na loja, receita já validada naquele pedido), repetir o pedido **exige novo envio e validação de receita médica** no Checkout — a receita já aprovada do pedido original não é reaproveitada automaticamente.
- Esse novo envio ocorre **dentro do fluxo de Checkout já existente**, sem necessidade de tela adicional dedicada — segue o fluxo já definido em `specs/features/001-app-ecommerce/Envio de receita/PRD-envio-receita-app.md`.

### 6.9 Disponibilidade por status do pedido
- "Repetir pedido" aparece somente em pedidos **"Pedido concluído"** e **"Pedido cancelado"**.
- Pedidos **"Pedido em andamento"** **não** exibem o botão "Repetir pedido" — o pedido ainda está em curso, então repeti-lo não se aplica.

### 6.10 Base de itens para pedidos editados no Portal
- Se o pedido original foi alterado pelo Balconista na etapa de Conferência do Portal (item removido ou quantidade reduzida — ver [PRD — Pedido Editado no Portal](../edição%20de%20pedido/PRD-pedido-editado-portal-app.md)), a recompra usa as **quantidades já editadas** (o estado final do pedido, pós-edição) como base para a validação de estoque na seção 6.2 — não as quantidades originais anteriores à edição.
- Um item removido na edição do Portal não entra na recompra (não é reintroduzido); um item com quantidade reduzida na edição entra na recompra já com a quantidade reduzida como ponto de partida (sujeita, ainda, à checagem de estoque atual da loja ativa).

## 7. Pontos de entrada (UI)

| Local | Elemento | Observação |
|---|---|---|
| "Meus pedidos" — topo | Card "Último pedido" | Atalho rápido, botão "Repetir pedido" em destaque (cor primária) — só quando o último pedido está concluído ou cancelado. |
| "Meus pedidos" — histórico | Card de cada pedido | Botão "Repetir pedido" abaixo de "Ver detalhes", presente apenas em pedidos concluídos e cancelados (ausente em "em andamento" — ver 6.9). |
| Tela "Detalhes do pedido" | Botão "Repetir pedido" | Novo ponto de entrada, já desenhado pelo UX — mesma lógica de validação da seção 6, mesmas regras de status (6.9). |

## 8. Toasts, banners e tags

- **Toast de sucesso:** "Produto adicionado" (verde) — sucesso direto (6.4) ou pós-confirmação de ajustes (6.5).
- **Banner de bloqueio:** "Nenhum item desse pedido está disponível no momento." (vermelho, fixo sobre a tela de origem) — indisponibilidade total (6.6).
- **Bottom sheet de ajuste:** título "Alguns itens foram ajustados" + apoio "Revise as alterações antes de adicionar os produtos ao carrinho." (6.5).
- **Tags por item no bottom sheet:**
  - "Quantidade ajustada X → Y" (azul) — estoque insuficiente.
  - "Produto indisponível" (vermelha) — EAN não encontrado ou estoque zerado.

## 9. Modelo de dados / eventos a rastrear (requisito para indicadores)

- `pedido_original_id`, `loja_original_id`, `loja_ativa_id`, `consumidor_id`, `timestamp_acionamento`
- Resultado da recompra: `sucesso_direto` | `sucesso_com_ajuste` | `bloqueado_indisponivel` | `cancelado_pelo_consumidor`
- Por item avaliado: `ean`, `quantidade_original`, `quantidade_disponivel`, `tipo_divergencia` (`nenhuma` | `quantidade` | `indisponivel`)
- `contem_controlado` (booleano) — para cruzar com taxa de novo envio de receita
- `avancou_para_checkout` (booleano) e `concluiu_compra` (booleano) — para medir o funil completo até a transação (ligação direta com a NSM)

## 10. Indicadores / relatórios (fase 2 — requisitos de dados definidos agora, UI a definir com UX depois)

1. Taxa de recompras por desfecho (sucesso direto vs. ajuste parcial vs. bloqueio total).
2. Taxa de conclusão de compra (Checkout) após uma recompra, por desfecho — impacto direto na NSM.
3. Taxa de cancelamento no bottom sheet de ajuste ("Cancelar" vs. "Adicionar itens ajustados").
4. Frequência de cada tipo de divergência (quantidade, indisponibilidade) — insumo para times de Portal/Catálogo sobre qualidade do estoque cadastrado.
5. Taxa de novo envio de receita concluído com sucesso em recompras com Controlado.
6. Tempo médio entre o pedido original e a recompra.

## 11. Casos de borda / edge cases

| Cenário | Comportamento esperado |
|---|---|
| Pedido original 100% disponível em estoque na loja ativa | Sucesso direto (6.4), sem bottom sheet — independentemente do preço atual estar igual ou diferente do original. |
| Pedido original feito em outra loja, mesmos produtos existem em estoque na loja ativa | Sucesso direto (6.4) — preço não é comparado entre lojas. |
| Pedido original feito em outra loja, nenhum produto existe na loja ativa | Banner de bloqueio (6.6). |
| Pedido com 1 item, esse item indisponível | Banner de bloqueio (6.6) — não há "parcial" com zero itens sobrando. |
| Pedido com item Controlado, recompra com sucesso (direto ou ajustado) | Checkout exige novo envio de receita antes de concluir. |
| Consumidor cancela no bottom sheet | Nenhuma alteração no carrinho; permanece na tela de origem (lista ou detalhe). |
| Pedido com status "Pedido cancelado" | Botão "Repetir pedido" disponível normalmente, mesma lógica de validação. |
| Pedido com status "Pedido em andamento" | Botão "Repetir pedido" **não** é exibido (nem na lista, nem no detalhe) — ver 6.9. |
| Preço do item mudou (para mais ou para menos) desde o pedido original | Não gera tag nem alerta — item é tratado como disponível (se houver estoque) e adicionado ao preço vigente. |
| Pedido original foi editado no Portal (item removido ou quantidade reduzida) | A validação de estoque (6.2) usa as quantidades **já editadas** como base, não as originais anteriores à edição (ver 6.10). |

## 12. Critérios de aceite (exemplos, formato Given/When/Then)

**Sucesso direto**
- Dado um pedido cujos itens existem em estoque suficiente na loja ativa do Consumidor,
- Quando o Consumidor toca em "Repetir pedido",
- Então os itens são adicionados ao carrinho ao preço vigente na loja ativa, um toast "Produto adicionado" é exibido, e o Consumidor é levado ao Checkout.

**Ajuste por quantidade**
- Dado um pedido com um item cuja quantidade original é 3 e o estoque atual na loja ativa é 2,
- Quando o Consumidor toca em "Repetir pedido",
- Então o bottom sheet "Alguns itens foram ajustados" exibe esse item com a tag "Quantidade ajustada 3 → 2".

**Preço diferente não gera ajuste**
- Dado um pedido com um item cujo preço atual na loja ativa é diferente do preço pago no pedido original, mas com estoque suficiente,
- Quando o Consumidor toca em "Repetir pedido",
- Então esse item é tratado como disponível (sem tag), adicionado ao carrinho pelo preço vigente na loja ativa.

**Produto indisponível**
- Dado um pedido com um item cujo EAN não existe mais no catálogo da loja ativa,
- Quando o Consumidor toca em "Repetir pedido",
- Então o bottom sheet exibe esse item com a tag "Produto indisponível", e ele não é adicionado ao carrinho ao confirmar.

**Bloqueio total**
- Dado um pedido em que nenhum item está disponível na loja ativa,
- Quando o Consumidor toca em "Repetir pedido",
- Então nenhum bottom sheet é aberto, um banner "Nenhum item desse pedido está disponível no momento." é exibido, e o carrinho permanece inalterado.

**Cancelamento no ajuste**
- Dado o bottom sheet "Alguns itens foram ajustados" aberto,
- Quando o Consumidor toca em "Cancelar",
- Então nenhum item é adicionado ao carrinho e o Consumidor permanece na tela de origem.

**Recompra de pedido de outra loja**
- Dado um pedido original feito na Loja A e o Consumidor com a Loja B como loja ativa,
- Quando o Consumidor toca em "Repetir pedido",
- Então a validação e o carrinho resultante são montados na Loja B, sem trocar a loja ativa do Consumidor.

**Recompra com Controlado**
- Dado um pedido original que continha um medicamento Controlado com receita já validada,
- Quando o Consumidor repete esse pedido com sucesso (direto ou com ajuste),
- Então o Checkout exige o envio de uma nova receita antes de concluir a compra.

**Recompra de pedido cancelado**
- Dado um pedido com status "Pedido cancelado",
- Quando o Consumidor visualiza esse pedido em "Meus pedidos" ou no detalhe,
- Então o botão "Repetir pedido" está disponível e segue a mesma lógica de validação dos demais status.

**Pedido em andamento não permite recompra**
- Dado um pedido com status "Pedido em andamento",
- Quando o Consumidor visualiza esse pedido em "Meus pedidos" ou no detalhe,
- Então o botão "Repetir pedido" não é exibido.

**Recompra de pedido editado no Portal**
- Dado um pedido concluído que teve um item com quantidade reduzida de 5 para 3 pelo Balconista na Conferência do Portal,
- Quando o Consumidor toca em "Repetir pedido",
- Então a validação de estoque parte da quantidade 3 (já editada), não da quantidade 5 original.

## 13. Fora do escopo (recapitulando dependências de outras squads/PRDs)

- Seleção de loja ativa: pré-condição do produto, fora desta PRD.
- Cálculo de estoque em tempo real: depende do serviço de Catálogo já usado pelo restante do App (integração a confirmar, ver seção 15). Preço não é validado por esta feature.
- Envio de receita médica: delega para `specs/features/001-app-ecommerce/Envio de receita/PRD-envio-receita-app.md`.
- Checkout padrão (forma de pagamento, endereço/retirada): fora desta PRD, reaproveita o fluxo já existente.

## 14. Anexo — Referência visual (protótipo analisado)

- **Link Figma:** https://www.figma.com/design/7Pi4v28TLqe0YhcqqKAEjR/App-%C2%B7-E-commerce?node-id=2510-5982
- **Observação técnica:** o MCP do Figma (Dev Mode Server) não estava habilitado nesta sessão, então a análise foi feita navegando manualmente pelo protótipo no link acima (sem acesso à API para extrair node-ids exatos de cada tela). Recomenda-se habilitar o Dev Mode MCP Server do Figma antes da geração das histórias técnicas, para extração precisa de specs de UI (cores, espaçamento, tokens).
- **Telas/frames identificados (por nome no canvas):**
  - "sucesso" — "Meus pedidos" com toast "Produto adicionado" (desfecho de sucesso direto).
  - "repetir oferta - pedido com alteração" — bottom sheet com 1 item ajustado (quantidade).
  - "repetir oferta - pedido com 2 ou + alterações" — bottom sheet com 2 itens (1 quantidade ajustada + 1 indisponível).
  - "repetir oferta - nenhum item pode ser adicionado" — banner de bloqueio total.
  - Card de pedido com tag "Pedido cancelado" exibindo "Repetir pedido" normalmente (mesma tela "Meus pedidos").
- **Não incluído nesta subseção do Figma:** botão "Repetir pedido" na tela de Detalhes do Pedido — o UX já desenhou esse ponto de entrada separadamente (ver seção 7).

## 15. Dependências e itens abertos

- **Engenharia/Catálogo:** confirmar qual serviço fornece estoque em tempo real por EAN para a loja ativa, e o contrato dessa consulta (latência esperada para uma validação item a item sem gerar espera perceptível ao Consumidor).

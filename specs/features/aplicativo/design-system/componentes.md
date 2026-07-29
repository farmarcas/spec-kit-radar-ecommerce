# Componentes — Alquimia Mobile

> Fontes: páginas de componentes no [Zeroheight](https://zeroheight.com/5979403e1/p/0307c9-alquimia-mobile) e a página "2. Componentes" (node `4:716`) do arquivo Figma [\[DS\] Alquimia Mobile](https://www.figma.com/design/6CqpiX3aMzEoFs8Wf313F9/-DS--Alquimia-Mobile). Extraído em 2026-07-29.

## Button

Sistema de botões composto por **primário**, **secundário** e **link**, usados para organizar a hierarquia de ações na interface.

- **Button LG** (altura 56px): ação principal de uma tela/seção. Ocupa largura total. Usado em confirmações, checkout e CTAs de destaque.
- **Button MD** (altura 48px): ações secundárias ou telas com mais de um botão visível. Ideal para cards, listas e formulários.

Variantes por tamanho: `primary`, `secundary`, `link`, `primary-disabled`, `secundary-disabled`, `link-disabled` (6 variantes × 2 tamanhos = 12 no total).

## Input

Usado para coleta de informação do usuário (textos, números, buscas, dados de formulário).

**Estrutura**: Label, Placeholder, Hint (opcional), Ícone (opcional).

**Estados**: `default`, `focus`, `active`, `filled`, `error` (error acompanhado de mensagem clara no hint).

## Header

Orienta o usuário na navegação, apresentando o contexto da tela atual e ações primárias.

**Estrutura**: ação primária à esquerda (voltar), título centralizado, ação secundária opcional à direita (ex: carrinho, perfil).

**Comportamento**:
- Título curto e objetivo.
- Botão de voltar sempre visível quando houver hierarquia de navegação.
- Ação secundária só quando fizer sentido para o contexto da tela.

Variantes (Figma): `type=page`, `type=home txt`, `type=home tag`.

## Bottom bar

Componente de navegação principal, fixo na parte inferior da tela.

**Anatomia**: 4 destinos de navegação (`início`, `categorias`, `ofertas`, `pedidos`), cada um com ícone + label em bold.

**Estados**: `ativo` (ícone/label destacados na cor primária da marca) e `inativo` (ícone/label em branco, opacidade reduzida). Apenas um item ativo por vez.

**Quando usar**: em todas as telas de nível raiz; manter visível durante toda a navegação principal; preservar estado ativo ao voltar de fluxos secundários.

**Quando não usar**: não ocultar em telas raiz; não ultrapassar 5 destinos (4 é o ideal); não usar dentro de modais/bottom sheets/checkout; não substituir labels por ícones sem texto.

## List

Listagem vertical para apresentar conjuntos de itens relacionados de forma escaneável. Cada item pode combinar ícone, texto primário, texto secundário e ação (seleção, navegação, controle).

Peças no Figma: `list`, `divider`, `list_item`.

## Tags

Rótulos compactos para comunicar status de um elemento/ação/conteúdo de forma rápida e visual — combinam cor, ícone e texto para transmitir significado semântico sem depender só de cor.

**Variantes**: `Info` (contexto neutro/complementar), `Success` (ação concluída/estado válido), `Alert` (atenção que requer cautela, não bloqueia), `Error` (falha ou ação não concluída).

**Anatomia**: ícone (reforça o significado, não decorativo) + label curto (sentence case, sem pontuação final).

**Quando usar**: status em listas, cards, formulários, itens de pedido.

**Quando não usar**: como botão/elemento interativo; empilhadas sem hierarquia; substituindo mensagens de erro inline em formulários.

## Radio button

Seleção única e exclusiva dentro de um grupo — selecionar um item desmarca automaticamente qualquer outro do mesmo grupo.

**Estados**: `unselected` (círculo vazio), `selected` (ponto interno preenchido na cor primária).

## Check box

Seleção de uma ou mais opções de forma independente (diferente do Radio, marcar um item não afeta os demais).

**Estados**: `unselected` (quadrado vazio), `selected` (ícone de confirmação na cor primária).

## System banner

Notificação de sistema no topo da tela (abaixo da status bar), para eventos que afetam toda a experiência (confirmações, alertas de conexão, falhas críticas). Sobrepõe o conteúdo; some automaticamente ou por ação do usuário.

**Estados**: `alert`, `error`, `success`.

## Acordion

Presente no Figma (lista expansível com item → título + descrição + ícone). **Sem documentação de uso publicada no Zeroheight** até a data da extração — confirmar comportamento/estados diretamente no Figma antes de implementar.

## Progress circle *(Figma apenas — não publicado no Zeroheight)*

Indicador de progresso circular. Tamanhos identificados no Figma: padrão (64×64) e small (24×24). Sem especificação de uso publicada.

## Status Bar *(Figma apenas — não publicado no Zeroheight)*

Componente de status bar do dispositivo. Presente na página de componentes do Figma, sem página própria ou especificação de uso no Zeroheight.

# Alquimia Mobile — Design System

Referência do **Alquimia Mobile**, o Design System dos aplicativos do Radar E-commerce, extraída do Figma e do Zeroheight para uso em projetos futuros (incluindo geração de UI assistida por Claude).

## Fontes originais

- **Figma**: [\[DS\] Alquimia Mobile](https://www.figma.com/design/6CqpiX3aMzEoFs8Wf313F9/-DS--Alquimia-Mobile)
- **Zeroheight (documentação publicada)**: [Alquimia Mobile](https://zeroheight.com/5979403e1/p/0307c9-alquimia-mobile)

O arquivo Figma acima é apenas a capa/índice do projeto e consome 12 bibliotecas publicadas do time (RDS - Color System, RDS - Typography, RDS - Tokens, RDS - Buttons, RDS - Controls, RDS - Inputs, RDS - Navigation, RDS - Avatars & Brands, RDS - Covers, RDS - Modal/DB/Viewport/Toasts/Tooltip/Popover, RDS - Filters/Toolbox/Empty Space/Tables). A página "2. Componentes" desse mesmo arquivo (node `4:716`) contém as instâncias reais dos componentes mobile documentados aqui.

## Conteúdo desta pasta

| Arquivo | Conteúdo |
|---|---|
| [fundamentos.md](fundamentos.md) | Introdução e princípios que orientam o design system |
| [tokens/cores.md](tokens/cores.md) | Paleta de cores (marca, background, neutros, borda, feedback) |
| [tokens/tipografia.md](tokens/tipografia.md) | Escala tipográfica (família, tamanhos, pesos) |
| [tokens/espacamento.md](tokens/espacamento.md) | Escala de espaçamento (base 4px) |
| [tokens/icones.md](tokens/icones.md) | Biblioteca e configuração padrão de ícones |
| [tokens/tokens.json](tokens/tokens.json) | Tokens em formato machine-readable (cores, tipografia, espaçamento) |
| [componentes.md](componentes.md) | Inventário de componentes com estados, variantes e diretrizes de uso |

## Como usar isso com Claude

Ao pedir para o Claude gerar ou revisar telas/componentes do app Radar E-commerce:

1. Aponte para este diretório (`specs/features/aplicativo/design-system/`) como fonte de verdade de tokens e componentes.
2. Use os nomes de token exatamente como documentados (`Dscolors.*`, `DsTypography.*`, `DsSpacings.*`) — são os namespaces reais expostos pelo `DesignSystem` no app.
3. **Não invente valores** para o que está marcado como "não publicado ainda" em `tokens/cores.md` e `tokens/tipografia.md` — confirme direto no Figma/Zeroheight antes de codificar.

## Status da documentação (importante)

Este design system está em construção ativa. Nem todas as categorias têm valores publicados no Zeroheight:

- **Cores**: só a paleta de marca (Max Popular) tem hex confirmado. Background, Neutrals, Border e Feedback (Info/Alert/Success/Error) têm nome e descrição de uso, mas sem swatches/hex publicados no momento da extração (2026-07-29).
- **Tipografia**: só a escala de Títulos (titleXL/L/M/S) está publicada. Texto, Botão e Legenda aparecem como categorias na navegação mas sem specs publicadas.
- **Progress circle** e **Status Bar**: existem no Figma (página "2. Componentes") mas ainda não têm página própria no Zeroheight.
- **Acordion**: tem página no Zeroheight mas sem conteúdo publicado ainda.

Sempre que for usar um valor marcado como não publicado, volte ao Figma para confirmar antes de assumir.

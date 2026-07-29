# Tokens de Cor

> Fonte: [Cores — Design](https://zeroheight.com/5979403e1/p/22c7d6-cores/b/711c6c) e [Cores — Code](https://zeroheight.com/5979403e1/p/22c7d6-cores/b/05649e) no Zeroheight. Extraído em 2026-07-29.

## Como acessar no código

Os tokens de cor são expostos pelo `DesignSystem` através do namespace **`Dscolors`**, após o `DesignSystem` ser inicializado na fase de boot do app.

```
Dscolors.nomeDoToken
```

> **Importante**: antes de acessar qualquer token de cor, garanta que o `DesignSystem` foi inicializado no boot do app. Sem isso, os valores de `Dscolors` podem não estar disponíveis ou atualizados.

## Brand Colors (confirmado)

Cores de Brand representam a identidade visual da rede dentro do app. Usadas para personalizar o app por marca, mantendo a experiência consistente entre diferentes redes sem impactar a lógica funcional do sistema. No app, usadas principalmente para: ações principais (CTAs), estados ativos (seleção, foco, navegação) e destaques visuais/construção de marca.

### Brand — Max Popular

| Token | Hex | RGB | Uso |
|---|---|---|---|
| `brand-primary-max` | `#0074BB` | `rgb(0, 116, 187)` | Cor principal da marca — CTAs e elementos de destaque |
| `brand-secundary-max` | `#FFDD00` | `rgb(255, 221, 0)` | Cor secundária da marca — apoio visual (chips, badges, indicadores) |

> Como o app é white label, cada rede/marca deve ter seu próprio par `brand-primary` / `brand-secondary`. Só a marca "Max Popular" tinha swatches publicados no Zeroheight no momento da extração.

## Outras categorias (nome e uso confirmados; hex **não publicado** no Zeroheight)

As categorias abaixo têm descrição de uso documentada, mas os swatches/valores hex não estavam publicados no Zeroheight na data da extração. **Não assuma valores — confirme no Figma antes de usar em código.**

### Background
Cores usadas como base das telas do app, garantindo leitura confortável e organização visual.

### Neutrals
Escala de neutros usada para textos, ícones e elementos estruturais — a base da interface.

### Border
Cores usadas em contornos, divisores e linhas auxiliares.

### Feedback

Tokens de exemplo citados na documentação (`Dscolors.error`, `Dscolors.success`, `Dscolors.info`) confirmam que esses nomes existem no namespace, mesmo sem swatch publicado:

| Categoria | Uso |
|---|---|
| Info | Estados neutros ou informativos (ex: notificações, instruções, status de sistema) |
| Alert | Atenção ou alerta preventivo (ações que não são erro, mas exigem cuidado) |
| Success | Ações bem-sucedidas, confirmações ou status positivos (ex: registro feito, meta batida) |
| Error | Erros, falhas ou ações inválidas (ex: campos obrigatórios, mensagens de falha) |

## Neutros base

Citados na documentação de código como exemplos de tokens disponíveis (sem hex publicado):

- `Dscolors.white`
- `Dscolors.black`
- `Dscolors.bgPrimary`
- `Dscolors.border`

## Nota sobre a Bottom Bar

A documentação do componente Bottom Bar menciona o estado ativo usando "ícone e label destacados em amarelo (`#F5C518` ou equivalente do token)" — este valor aparece como referência aproximada na doc do componente, não como token de cor formalmente cadastrado na página de Cores. Confirme o token exato (`Dscolors.*`) antes de usar.

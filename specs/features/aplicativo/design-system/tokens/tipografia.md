# Tokens de Tipografia

> Fonte: [Tipografia — Design](https://zeroheight.com/5979403e1/p/95b834-tipografia/b/775a3c) e [Tipografia — Code](https://zeroheight.com/5979403e1/p/95b834-tipografia/b/95932a) no Zeroheight. Extraído em 2026-07-29.

## Como acessar no código

Os tokens de tipografia devem ser acessados via **`DesignSystem.typography`** (namespace `DsTypography`) para garantir consistência visual.

```
DsTypography.titleXL
```

- Utilize os tokens para garantir consistência visual.
- Evite definir estilos "hardcoded".
- Use os estilos prontos para simplificar o código.

## Família

**Roboto** (peso 700 nos títulos)

## Títulos (confirmado)

| Token | Tamanho | Peso | Line height | Letter spacing |
|---|---|---|---|---|
| `DsTypography.titleXL` (`$font-title-xl`) | 48px | Roboto 700 | 120% | 0px |
| `DsTypography.titleL` | 32px | Roboto 700 | 120% | 0px |
| `DsTypography.titleM` | 24px | Roboto 700 | 120% | 0px |
| `DsTypography.titleS` | 20px | Roboto 700 | 120% | 0px |

## Outros tokens (nome confirmado; valores **não publicados** no Zeroheight)

A documentação de uso cita os seguintes tokens de texto, mas sem tamanho/peso/line-height publicados na data da extração — confirme no Figma antes de usar:

| Token | Uso |
|---|---|
| `DsTypography.textL` | Texto grande |
| `DsTypography.textM` | Texto médio |
| `DsTypography.textS` | Texto pequeno |
| `DsTypography.button` | Texto de botão (`ElevatedButton` com `textStyle: DsTypography.button`) |
| `DsTypography.label` | Label |

As categorias "Texto", "Botão" e "Legenda" existem na navegação do styleguide, mas ainda não têm specs publicadas.

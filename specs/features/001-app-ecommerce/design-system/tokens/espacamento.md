# Tokens de Espaçamento (Layout)

> Fonte: [Layout — Spacing](https://zeroheight.com/5979403e1/p/726abd-layout/b/00e92c) e [Layout — Code](https://zeroheight.com/5979403e1/p/726abd-layout/b/8441c9) no Zeroheight. Extraído em 2026-07-29.

Sistema baseado em **4px** (4pt base scale), permitindo escalabilidade e padronização ao longo do projeto.

## Como acessar no código

Os tokens de espaçamento devem ser acessados via **`DesignSystem.spacing`** (namespace `DsSpacings`) para garantir consistência e facilitar manutenção.

- Utilize os tokens para garantir consistência visual.
- Evite valores "hardcoded" de espaçamento.
- Use os `EdgeInsets` prontos para simplificar o código.

## Escala

| Token | Valor | Sass variable |
|---|---|---|
| `DsSpacings.s1` | 4px | `$spacing-1` |
| `DsSpacings.s2` | 8px | `$spacing-2` |
| `DsSpacings.s3` | 16px | `$spacing-3` |
| `DsSpacings.s4` | 24px | `$spacing-4` |
| `DsSpacings.s5` | 32px | `$spacing-5` |
| `DsSpacings.s6` | 40px | `$spacing-6` |
| `DsSpacings.s7` | 48px | `$spacing-7` |
| `DsSpacings.s8` | 56px | `$spacing-8` |

## EdgeInsets prontos

| Padrão | Exemplo | Equivalente |
|---|---|---|
| Uniforme | `DsSpacings.a3` | `EdgeInsets.all(16)` |
| Horizontal | `DsSpacings.h2` | `EdgeInsets.symmetric(horizontal: 8)` |
| Vertical | `DsSpacings.v4` | `EdgeInsets.symmetric(vertical: 24)` |

Ou seja, o prefixo indica o padrão (`a` = all, `h` = horizontal, `v` = vertical) e o número indica qual valor da escala `sN` usar.

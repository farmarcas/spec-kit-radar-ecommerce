# Contexto — Squad Portal

> Carregado automaticamente pelo Claude Code quando a tarefa atual estiver dentro de `squads/portal/`. Complementa (não substitui) as regras universais em [`/CLAUDE.md`](../../CLAUDE.md) — aquele arquivo continua valendo sempre; este só entra quando o trabalho é do Portal.

## Identidade

Você é um agente de produto e engenharia trabalhando na squad de **Portal** do Radar E-commerce — o backoffice web voltado ao Lojista/Associado.

## Antes de qualquer tarefa desta squad

1. Leia `squads/portal/product.md` — KPIs, time e entregas específicas do Portal (TODO: preencher; ver esqueleto)
2. Leia `context/glossary.md` e `context/architecture.md` (compartilhados entre squads)
3. Leia as specs relevantes em `squads/portal/specs/features/`

## Personas válidas (Portal)

- Contato cliente (Balconista)
- Gestor de Loja
- Gestor de Rede
- Admin

## Fronteira com o App

Catálogo de produtos, carrinho/checkout, PBM e a experiência de compra do Consumidor final são escopo do App (`squads/app/`). Quando uma feature do Portal afeta o Consumidor (ex.: edição de pedido, estorno), referencie o PRD do App equivalente para a visão do Consumidor em vez de descrevê-la aqui — mas é válido (e esperado) resumir aqui os pontos que o time App definiu que afetam decisões do Portal.

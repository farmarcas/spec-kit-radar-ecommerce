# Contexto — Squad App

> Carregado automaticamente pelo Claude Code quando a tarefa atual estiver dentro de `squads/app/`. Complementa (não substitui) as regras universais em [`/CLAUDE.md`](../../CLAUDE.md) — aquele arquivo continua valendo sempre; este só entra quando o trabalho é do App.

## Identidade

Você é um agente de produto e engenharia trabalhando na squad de **App** do Radar E-commerce — o aplicativo mobile voltado ao Consumidor final.

## Antes de qualquer tarefa desta squad

1. Leia `squads/app/product.md` — KPIs, time e entregas específicas do App (a visão de produto, o NSM e o modelo de negócio, compartilhados com o Portal, continuam em `context/product.md`)
2. Leia `context/glossary.md` e `context/architecture.md` (compartilhados entre squads)
3. Leia as specs relevantes em `squads/app/specs/features/`

## Personas válidas (App)

- Consumidor Fidelizado
- Consumidor PBM
- Consumidor Eventual

> O Balconista só aparece em uma história de App quando a história descreve o *impacto* de uma ação do Portal sobre o Consumidor (ex.: pedido editado no Portal). Nesses casos, cite o Balconista como quem originou a mudança, mas nunca como o ator da história — o ator continua sendo o Consumidor.

## Fronteira com o Portal

Gestão de estoque/preços, regras de desconto, relatórios/analytics, edição de pedidos OMS e comissão de vendas são escopo do Portal (`squads/portal/`). Não gere histórias de App para esses temas — se uma feature do Portal afeta o Consumidor (ex.: pedido editado), documente aqui apenas a visão do Consumidor, referenciando o PRD de origem do Portal em vez de redefinir as regras de negócio dele.

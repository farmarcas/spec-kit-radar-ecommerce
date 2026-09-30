# Pedidos — Listagem: Macro-abas, Filtros e Regra de Exibição por Período

**Módulo:** Operação
**Histórias:** [ECP-1514](https://farmarcas.atlassian.net/browse/ECP-1514) — Listagem de Pedidos: Macro-abas, Filtros e Regra de Exibição por Período
**Referência UX:** [ECP-1314](https://farmarcas.atlassian.net/browse/ECP-1314) (Busca e Filtro), [ECP-1317](https://farmarcas.atlassian.net/browse/ECP-1317) (Seleção de lojas)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seções 6.1, 6.1.1, 6.2
**Relacionado:** [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md), [Tabela-Colunas-Comportamento-SLA.md](Tabela-Colunas-Comportamento-SLA.md)
**Status:** Em desenvolvimento
**Última atualização:** 2026-09-30

---

## 1. O que é

A tela de Pedidos hoje não tem filtro, busca nem filtro global de lojas — lacuna sinalizada como prioridade Highest desde antes deste ciclo. Este documento cobre a estrutura de navegação da listagem: os 2 níveis de filtro (macro-abas + filtro segmentado), o painel avançado de filtros, e a regra de exibição por período.

## 2. Estrutura de filtros

- **Macro-abas:** "Em andamento (N)" / "Finalizados (N)" — contam pedidos em cada bucket, dentro do contexto selecionado no header global.
- **Filtro segmentado dentro de "Em andamento":** Todos / Conferência / Na fila / Em separação / Liberados — single-select, default "Todos".
- **Filtro segmentado dentro de "Finalizados":** Todos / Concluídos / Cancelados, com badge "Limite 30 dias".
- **Painel "Todos os filtros"** (5 grupos, aplicação em conjunto): Itens (Só medicamentos/Alto custo/Com receita), Tipo de pedido (Entrega/Retirada), Prazo (Atrasado/20 min para atrasar/Em tempo/Parado), Status de pagamento (Pago/Cobrar/Com troco), Método de pagamento (Pix/Dinheiro/Maquininha).

## 3. Regras de negócio

### 3.1 Regra de exibição por período

- **Pedidos ativos** (qualquer status "Em andamento"): sem limite de período — aparecem até mudarem de status.
- **Pedidos finalizados** (Concluídos/Cancelados): só os últimos 30 dias por padrão.
- **Busca** (nome do cliente, CNPJ, nº do pedido): varre todo o histórico, ignorando completamente o limite de 30 dias.

### 3.2 Badges e contador de filtros

Filtros ativos aparecem como badges removíveis acima da tabela, com contador no botão ("Todos os filtros · 2") e opção "Limpar filtros".

### 3.3 Empty states (4 cenários)

1. Gestor sem pedidos ativos no contexto selecionado — CTA "Criar nova promoção".
2. Balconista sem pedidos na fila.
3. Filtro/aba aplicada sem resultado — CTA "Exportar relatório" / "Resetar filtros aplicados".
4. Busca sem correspondência — aviso explícito de que a busca varreu todo o histórico ("A busca passou por todo o histórico, independente do período") + CTA "Limpar busca"/"Resetar filtro incluído".

## 4. Nível de integração / fonte de dados

Pedidos vivem na coleção `edelivery_order.order_data`. Regras gerais válidas pra qualquer filtro/relatório de status sobre essa coleção (ver [[feedback_status_change_query_rules]]):

- Filtrar mudança de status pelo campo do **evento** (`<status>.triggeredAt`), nunca por `updatedAt` — jobs de ERP reprocessam pedidos e reescrevem `updatedAt`/`triggeredAt` sem transição real.
- Incluir o guard `<statusSubdoc>.previusStatus != <status atual>` (via `$expr`) — sem ele, reprocessamentos de ERP inflam contagens (chegou a ~12% de diferença num caso real de faturamento).
- Datas no banco estão em UTC; o "dia" de negócio é sempre BRT (UTC-3) — somar 3h ao horário desejado em BRT antes de filtrar.
- Excluir `canceledReason = "Teste Interno"` por padrão dos relatórios/contagens (não necessariamente da listagem operacional em si — a confirmar se essa exclusão também vale pro filtro "Cancelados" da tela, ou só pra relatórios/exports).

**Não confirmado ainda:** se a listagem em si (não um relatório) usa a mesma coleção/campos diretamente ou um serviço/índice de leitura (ex.: Core Orders, já mencionado como pré-requisito arquitetural — ver PRD changelog v1.8/1.9) — ver pendências.

## 5. Cenários de borda

| Cenário | Regra |
|---|---|
| Busca retorna pedido fora do período exibido (finalizado há 45 dias) | Aparece normalmente — busca ignora o limite de 30 dias |
| Filtro de Pedidos aplicado numa loja do módulo Ofertas | Empty state — Pedidos não existe pra lojas Ofertas (ver [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md)) |
| Grupo com volume alto de lojas/pedidos simultâneos | Sem volumetria validada — precisa de checagem de engenharia antes do rollout amplo (PRD seção 9) |

## 6. Pendências / perguntas em aberto

- [ ] Confirmar se a nova tela consome `edelivery_order` diretamente ou via Core Orders (novo módulo mencionado como pré-requisito arquitetural).
- [ ] Confirmar se a exclusão de "Teste Interno" (regra de relatórios) também se aplica à listagem operacional, ou só a exports/relatórios.
- [ ] Volumetria real de pedidos/lojas simultâneas por grupo — sem número validado (PRD seção 9).

## Changelog

- **2026-09-30** — Criação do documento (v1), a partir de ECP-1514, ECP-1314/1317, PRD seções 6.1/6.1.1/6.2, e [[feedback_status_change_query_rules]].

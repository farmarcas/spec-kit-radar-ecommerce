# Indicadores — Faturamento, Pedidos Cancelados e Pedidos Concluídos (Home de Vendas)

**Módulo:** Operação
**Histórias:** [ECP-1546](https://farmarcas.atlassian.net/browse/ECP-1546) (Faturamento), [ECP-1547](https://farmarcas.atlassian.net/browse/ECP-1547) (Pedidos Cancelados), [ECP-1548](https://farmarcas.atlassian.net/browse/ECP-1548) (Pedidos Concluídos) — 3 Histórias separadas, 1 doc funcional, por serem o mesmo conjunto de entrega funcional (3 abas da mesma tela)
**Referência:** `Manual-Portal-Radar-Ecommerce.md`, seção 5
**Relacionado:** [ECP-1512](Filtro-GE-e-Macro-Abas.md) (Filtro de GE e Macro-abas — mesma tela), [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md)
**Status:** Em desenvolvimento
**Última atualização:** 2026-10-01

---

## 1. O que é

3 abas da Home de Indicadores (módulo Vendas), cada uma com um gráfico de linha mostrando a evolução do indicador no período selecionado. Nenhuma mudança de comportamento em relação a hoje — é reconstrução 1:1 em React, reaproveitando a lógica de backend já validada em produção (ver seção 4).

## 2. Estrutura e comportamento comum às 3 abas

- Gráfico de linha, 1 ponto por dia/semana/mês/etc. — a granularidade dos grupos exibidos é decidida pelo servidor, o front só exibe o que vem na resposta.
- Tooltip ao passar o mouse mostra o valor do ponto — sem clique, sem drill-down, sem legenda.
- Trocar o período no topo da tela **recarrega todos os cards da página** (uma chamada nova por card) — não é filtro local, pode levar um instante.
- Se não houver dado no período, a área do gráfico aparece em branco (Faturamento não tem ilustração de "vazio" dedicada, diferente de gráficos de rosca/gênero).
- Botão **"Exportar"** no cabeçalho funciona em qualquer uma das 3 abas e sempre baixa o mesmo relatório ("Pedidos Faturados"): 1 linha por item do pedido — Loja (hoje traz CNPJ, não nome — bug conhecido), Número do pedido, Data do pedido, Nome do cliente, CPF, EAN do item, Método de pagamento, Método de entrega, Valor, Status.

## 3. Regras de negócio por indicador

### 3.1 Faturamento

- Conta pedidos com status `Delivered` ou `Withdrawn`.
- Data de referência: data de **conclusão** (`Finished.TriggeredAt`) — nunca criação.
- Valor: soma de `unitPrice × amount` dos produtos — **sem frete**.
- Guard: `Status != Finished.PreviusStatus` (exclui re-finalizações espúrias de reprocessamento de ERP).
- **Não exclui "Teste Interno".**

### 3.2 Pedidos Cancelados

- Conta pedidos com status `Canceled`.
- Data de referência: `Canceled.TriggeredAt`.
- Guard: `Status != Canceled.PreviusStatus`.
- **Exclui `canceledReason = "Teste Interno"`.**
- "Volume dos pedidos cancelados" (valor que seria faturado) exclui frete — correção deliberada em produção (ver changelog).

### 3.3 Pedidos Concluídos

- Mesmo universo de status do Faturamento (`Delivered`/`Withdrawn`), mesma data de referência (`Finished.TriggeredAt`), mesmo guard.
- **Confirmado: não exclui "Teste Interno"** — assimetria real em relação a Cancelados, não presumir simetria.

## 4. Nível de integração / fonte de dados

Cadeia de serviços confirmada 2026-10-01 (ver [[reference_indicadores_backend_repos]] pra detalhe completo, incluindo os trechos de código):

```
Portal (front) → ecomm-bff-backoffice-indicator-dotnet (orquestração + cache Redis 60min)
              → ecomm-api-order-dotnet (query real, LINQ-to-Mongo sobre a coleção order_data)
```

| Aba | KPI/resumo | Série diária do gráfico |
|---|---|---|
| Faturamento | — (1 endpoint só cobre os dois) | `billing-order` → `orders-revenue-per-{day,week,month,quarter,year,custom}` |
| Pedidos Cancelados | `cancellations` → `{ LostGmv, CancelledCount, CompletedCount, AverageCancelledTicket }` | `tax-cancellation-order` → `orders-tax-cancellation-per-{day,...}` |
| Pedidos Concluídos | `cancellations`.`CompletedCount` (mesmo endpoint acima) | `created-order` → `orders-created-per-{day,...}` — **nome enganoso**: filtra `Delivered`/`Withdrawn` por `Finished.TriggeredAt`, não é sobre pedidos recém-criados (não confundir com `new-created-order`, que é um indicador diferente de "tem pedido novo chegando") |

- **Escopo de lojas:** resolvido no BFF (`ValidationOrderLayerService.PrepareBodyRequestAsync`, via `GetPharmaciesUserCommand`/`PostStoresFilterCommand`), antes de chamar o Order.
- **Cache:** Redis, chave `Cache:{userId}:{typeIndicator}:{ResponseTypeName}`, TTL 60min (180min em `isExtendedTime`) — **bypassado** quando `TypeIndicator == custom` ou há filtro específico de loja/rede/grupo/estado. Visão default pode ter até 1h de defasagem; visão filtrada é sempre ao vivo.
- **Timezone:** `"E. South America Standard Time"` (Brasília), convertido pra UTC antes da consulta.

**Onde esse back vai morar no Portal novo (Core, BFF unificado, etc.) é decisão de engenharia** — esta História só documenta o contrato/comportamento atual a ser reaproveitado, não prescreve destino de arquitetura.

## 5. Cenários de borda

| Cenário | Regra |
|---|---|
| Pedido cancelado com motivo "Teste interno" | Não entra na contagem de Cancelados |
| Pedido com frete cobrado, depois cancelado | Frete não entra no "Volume dos pedidos cancelados" |
| Pedido re-finalizado por reprocessamento de ERP (sem mudança real de status) | Não conta de novo em Faturamento/Concluídos (guard `previusStatus`) |
| Sem dado no período | Área do gráfico fica em branco (Faturamento/Ticket Médio não têm ilustração de vazio) |
| Troca de período | Todos os cards da Home recarregam, não só o que está visível |

## 6. Pendências / perguntas em aberto

- [ ] Bug conhecido: coluna "Loja" do relatório "Pedidos Faturados" traz CNPJ, não nome — confirmar se corrige na reconstrução.
- [ ] Considerar renomear `orders-created-per-day` (e variantes) pra algo menos ambíguo ao reescrever o backend — não é obrigatório, mas evita o mesmo engano que eu tive na primeira investigação.

## Changelog

- **2026-10-01 (2)** — Matheus deu as URLs reais de produção pra Cancelados (`tax-cancellation-order`) e Concluídos (`created-order`), resolvendo as 2 pendências de série diária. Documentada a tabela completa de endpoints por aba (KPI + série), incluindo o achado de que `created-order` tem nome enganoso (não é sobre pedidos recém-criados).
- **2026-10-01** — Criação do documento (v1), a partir de ECP-1546/1547/1548, `Manual-Portal-Radar-Ecommerce.md` seção 5, e leitura direta do código-fonte de `ecomm-api-order-dotnet`/`ecomm-bff-backoffice-indicator-dotnet` ([[reference_indicadores_backend_repos]]).

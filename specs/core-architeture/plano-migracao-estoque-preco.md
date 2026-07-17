# Plano de Migração — Estoque e Preço para `ecomm-api-core` (Monólito Modular)

> **Status:** rascunho para validação da squad Core
> **Origem:** síntese da proposta de arquitetura ([16-sintese-proposta-final.md](16-sintese-proposta-final.md)) + board Jira `ECC` + diagnóstico direto do repositório `ecomm-api-core-dotnet` + mapa de dependências reais via Datadog APM
> **Data:** 2026-07-16

---

## 1. Contexto

Hoje, preço e estoque de cada loja vivem em bases MongoDB fragmentadas, consumidas por `ecomm-api-stock-dotnet` e `ecomm-api-price-dotnet`. App e Portal (via `ecomm-api-orchestrator-product-dotnet` e múltiplos BFFs) fazem joins client-side/orchestrator-side para montar produto + preço + estoque, com latência de listagem alta e manutenção crítica (conforme "Estado Atual — As Is" da síntese de arquitetura).

A proposta aprovada é consolidar Catálogo, Preço e Estoque num **monólito modular** (`ecomm-api-core-dotnet`), com **PostgreSQL único, schema por domínio** (`catalog.*`, `pricing.*`, `stock.*`), eliminando os hops HTTP entre serviços.

Este documento cobre especificamente a migração de **Estoque e Preço**, que depende do trabalho já em andamento no domínio Catálogo mas está em estágio bem mais inicial.

## 2. Objetivo

Migrar os consumidores atuais de `ecomm-api-stock-dotnet` e `ecomm-api-price-dotnet` para a `ecomm-api-core`, **sem quebra do fluxo atual**, validando módulo a módulo em uma única loja piloto antes de estender para a base completa (~900 lojas), via feature flag por loja.

## 3. Estado Atual (Diagnóstico)

### 3.1 O que já está pronto ou em andamento

| Item | Card | Status | O que entrega |
|------|------|--------|----------------|
| Estrutura base do repo `ecomm-api-core` | `ECC-33` | Finalizado | Pipelines, lint, Sonar, deploy por módulo |
| Domínio Catalog completo | — | Em desenvolvimento | Domain → Infrastructure (DbContext + migration `InitialCatalog` aplicada) → GraphQL real → Application com casos de uso |
| Replicar alterações de Catálogo p/ Core | `ECC-219` | Em desenvolvimento | `api-catalogue` chama `api-core` (dual-write) em CRUD de produto/família |
| Subtarefa: chamar api-core | `ECC-222` | Em desenvolvimento | Implementação client-side do dual-write (vive no repo `api-catalogue`, não em `api-core`) |
| `legacy_id` + UUID v7 (Catálogo) | `ECC-225` | Em desenvolvimento, não mergeado | Rastreabilidade Mongo↔Postgres — ainda não presente na migration aplicada |
| Plano de integração preço/estoque | `ECC-48` | Em homologação | Define: gravar já na nova estrutura ao receber do ERP; criar consumer `stock.updated.batch`; migrar tabela `pharmacy`; suportar custom products |
| Consumir api-core no Portal (estoque) | `ECC-210` | Priorizado, não iniciado | Escopo: módulo de estoque do Portal, com feature flag |
| Consumir api-core na Home do App | `ECC-211` | Priorizado, não iniciado | Escopo explícito: `orchestrator-product`, `bff-mobile-cart`, `bff-mobile-emphasis`, `bff-mobile-offer`, `api-mobile-stock`, `bff-mobile-main` |
| Novo consumer do tópico `unregistered` | `ECC-227` | **Backlog, não iniciado** | Popular Postgres a partir da integração EAN, em paralelo ao Mongo |

### 3.2 Gaps críticos (bloqueadores para Estoque/Preço)

Diagnóstico direto do repositório `ecomm-api-core-dotnet` (2026-07-16), via exploração de código — **não confiar apenas nos status do Jira, que refletem intenção de escopo, não o código real**:

- **`Stock.Application`, `Stock.Infrastructure`, `Stock.Workers`** — projetos vazios (só `.csproj` + lockfile). Sem DbContext, sem migration, sem persistência real. GraphQL expõe apenas `stockHealth() => DateTimeOffset.UtcNow` (healthcheck fake).
- **`Pricing.Application`, `Pricing.Infrastructure`, `Pricing.Workers`** — mesmo padrão: só entidades de Domain (`StoreProduct`, `ProductDiscount` etc.), sem persistência, GraphQL fake.
- **Nenhuma infraestrutura de Kafka existe no repositório inteiro** — nem consumidor, nem classe-base compartilhada em `Shared.Infra`. Isso significa que `ECC-227` (consumer do tópico `unregistered`) não é "adicionar mais um consumer" — é **construir a infraestrutura de consumo Kafka do zero** na Core.
- **Sem persistência real em Stock/Pricing**, os cards `ECC-210`/`ECC-211` (consumir da api-core) **não têm o que consumir ainda** — a Core não expõe dado real de estoque/preço hoje.
- `legacy_id`/UUID v7 não existe em nenhum módulo ainda (nem Catálogo, que é o mais avançado).
- Não existe `docs/adr/` no repositório `ecomm-api-core-dotnet` — nenhuma decisão desta migração está registrada como ADR, apesar do próprio doc de arquitetura prescrever ADR como prática obrigatória.
- Épicos `ECC-50` (Domain: Price) e `ECC-51` (Domain: Stock) estão em **Backlog**, sem histórias filhas ainda — confirma que o domínio de dados ainda não começou, só o planejamento (`ECC-48`).

**Conclusão do diagnóstico:** a squad está adiantada no domínio **Catálogo** (padrão strangler fig funcionando: dual-write da `api-catalogue` para a `api-core`), mas **Estoque e Preço ainda não têm base de código para receber dado real**. `ECC-227` é o primeiro passo prático, mas depende de infraestrutura que ainda não existe.

### 3.3 Pontos a confirmar com o time (não assumidos)

- `ECC-93` ([api-catalogue] Chamar api-core nos endpoints) e `ECC-64` ([core] Implementar catálogo na app) aparecem **Cancelados** no board — não identifiquei se foram substituídos por `ECC-219`/`ECC-222` ou abandonados por outro motivo. Vale confirmar antes de tratá-los como "supersedidos" nas dependências deste plano.
- `ecomm-sub-service-wake-princing-dotnet` aparece como consumidor de `ecomm-api-price-dotnet` no APM — é uma ACL de integração com a Wake. Pela síntese de arquitetura, ACLs externas devem ser **preservadas na borda**, não eliminadas — então seu tratamento na migração é diferente dos demais consumidores (provavelmente também precisa escrever na nova base, similar ao consumer EAN do `ECC-227`, mas não necessariamente "migrar" no mesmo sentido).

## 4. Fases da Migração

```
Fase 0 · Fundação técnica (Core)
   ↓
Fase 1 · Sincronização de dados (dual-write via ECC-227 + ECC-48)
   ↓
Fase 2 · Validação em loja piloto (Beta)
   ↓
Fase 3 · Migração de consumidores, um a um, com feature flag por loja
   ↓
Fase 4 · Descomissionamento do fluxo antigo
```

### Fase 0 — Fundação técnica na Core (pré-requisito, hoje inexistente)

Sem isso, nenhuma fase seguinte é viável:

1. Infraestrutura de consumo Kafka compartilhada em `Shared.Infra` (classe-base de consumer, configuração de tópico, retry/DLQ) — reaproveitável por Stock, Pricing e futuros módulos.
2. `Stock.Infrastructure`: `DbContext` + migration inicial para schema `stock.*` (tabelas `inventory`, `movements`, conforme síntese de arquitetura).
3. `Pricing.Infrastructure`: `DbContext` + migration inicial para schema `pricing.*` (tabelas `store_product`, `price_history`).
4. `Stock.Application` / `Pricing.Application`: casos de uso mínimos para popular/ler os dados sincronizados (paridade com o que `ECC-48` descreve).
5. Estender o padrão `legacy_id` + UUID v7 (de `ECC-225`, hoje em dev só para Catálogo) para Stock e Pricing.
6. Registrar ADR da estratégia (dual-write, cutover por módulo, beta por loja) em `docs/adr/` — hoje inexistente no repo.

### Fase 1 — Sincronização de dados

- `ECC-227`: novo consumer do tópico `unregistered` de preço/estoque — passa a popular Postgres em paralelo ao Mongo, a partir da integração EAN.
- `ECC-48`: consumer do tópico `stock.updated.batch`; migração da tabela `pharmacy`; suporte a custom products.
- Estratégia de coexistência conforme a síntese de arquitetura: **Backfill inicial** (carga histórica Mongo → Postgres) → **Sincronização contínua** (os consumers acima) → **Validação por módulo**, sem big bang. Mongo e Postgres coexistem até o cutover completo do módulo.

### Fase 2 — Validação em loja piloto (produção, sem ambiente Beta separado)

**Decisão da squad:** não haverá ambiente Beta dedicado (diferente do que a síntese de arquitetura sugere como padrão geral) — a validação acontece **direto em produção**, restrita a uma única loja específica via feature flag. É o próprio mecanismo de feature flag por loja (§6) que cumpre o papel de isolamento que o ambiente Beta cumpriria.

- Uma única loja piloto tem a flag ligada e aponta para o fluxo novo (Postgres/Core); todas as demais permanecem no fluxo atual, no mesmo ambiente de produção.
- **Critérios de graduação** (bloqueantes para estender a flag a mais lojas / avançar à Fase 3):
  - 48h sem divergência de dado vs. Mongo (preço e estoque idênticos entre as duas bases para a loja piloto)
  - p95 de latência ≤ ao fluxo atual
  - Zero erros 5xx por 24h
  - Aprovação do time de produto

### Fase 3 — Migração de consumidores (um card por consumidor, feature flag por loja)

Decisão da squad: **cada consumidor tem seu próprio card**, mesmo os que hoje estão agrupados sob `ECC-210`/`ECC-211` — ciclo de deploy, risco e validação são independentes por serviço, mesmo dentro do mesmo canal (Portal ou App).

`ECC-210` e `ECC-211` passam a ser **tarefas guarda-chuva** (tracking), cada consumidor abaixo delas como subtarefa própria — mesmo padrão já usado no board (`ECC-219` → `ECC-222`).

| # | Consumidor | Canal | Card guarda-chuva |
|---|---|---|---|
| 1 | `ecomm-api-orchestrator-product-dotnet` | App | `ECC-211` |
| 2 | `ecomm-bff-mobile-cart-dotnet` | App | `ECC-211` |
| 3 | `ecomm-api-mobile-stock-dotnet` | App | `ECC-211` |
| 4 | `ecomm-bff-mobile-offer-dotnet` | App | `ECC-211` |
| 5 | `ecomm-bff-mobile-main-dotnet` | App | `ECC-211` |
| 6 | `ecomm-bff-mobile-emphasis-dotnet` | App | `ECC-211` |
| 7 | `ecomm-bff-mobile-search-dotnet` | App | `ECC-211` (não estava no escopo original do card, mas é consumidor real via APM) |
| 8 | `ecomm-bff-backoffice-order-dotnet` | Portal | `ECC-210` |
| 9 | `ecomm-bff-backoffice-stock-dotnet` | Portal | `ECC-210` |
| — | `ecomm-sub-service-wake-princing-dotnet` | ACL externa (Wake) | Card próprio, fora da árvore Portal/App — tratamento diferente (ver §3.3) |

Ordem sugerida por menor blast radius primeiro (ver mapa de dependências §5) — `ecomm-api-orchestrator-product-dotnet` deve ser o mais testado, por ter upstream próprio (checkout, order, etc.).

Cada consumidor migrado deve, individualmente, repetir os critérios de graduação da Fase 2 antes de estender para mais lojas — a validação em loja única não se repete automaticamente para todos os consumidores ao mesmo tempo; cada um valida seu próprio impacto, com sua própria flag.

### Fase 4 — Plano de Desligamento

Desligar cedo demais quebra fluxo em produção; desligar tarde demais mantém custo duplo de manutenção (Mongo + Postgres). O desligamento também é **por consumidor**, não um evento único:

1. **Critério de desligamento seguro por consumidor**: todas as lojas migradas (flag 100% ligada) + N dias consecutivos de estabilidade (sugestão: 7 dias, a validar com o time) + zero divergência de dado reportada.
2. **Confirmação via Datadog APM**: monitorar tráfego residual no serviço legado correspondente (`search_datadog_service_dependencies` / traces) — só desligar quando o volume de chamadas ao antigo cair a zero de fato, não apenas quando a flag indicar 100%.
3. **Descomissionar o serviço legado individualmente** (por consumidor migrado) — remover deploy, pipeline, DNS/service mesh — só depois que **todos** os consumidores daquele serviço tiverem migrado (ex: só desligar `ecomm-api-stock-dotnet` depois que os 9 consumidores da tabela acima estiverem 100% na Core).
4. **Desligar os consumers de sincronização** (`ECC-227`, `ECC-48`) — só depois que não houver mais nenhum consumidor lendo do Mongo (Postgres passa a ser única fonte).
5. **Retenção e desligamento das bases MongoDB**: definir prazo de retenção (backup final + N dias antes de exclusão definitiva) — decisão de produto/compliance, não só técnica.
6. **Remover feature flags** de roteamento Stock/Price após período de estabilização, para não acumular dívida técnica de flags mortas.
7. **Comunicação**: sign-off do time de produto e das áreas dependentes (ex: OPS, que hoje usa scripts de limpeza de estoque/preço via Mongo — ver histórico de tarefas `ECC-206`/`ECC-212`/`ECC-214` no board) antes do desligamento definitivo, já que esses processos operacionais dependem da base atual.

## 5. Mapa de Dependências Reais (Datadog APM)

Consumidores diretos identificados via `search_datadog_service_dependencies` (upstream):

| Serviço consumidor | Consome | Já coberto por card? |
|---|---|---|
| `ecomm-api-orchestrator-product-dotnet` | stock + price | `ECC-211` |
| `ecomm-bff-mobile-cart-dotnet` | stock | `ECC-211` |
| `ecomm-api-mobile-stock-dotnet` | stock | `ECC-211` |
| `ecomm-bff-mobile-offer-dotnet` | stock | `ECC-211` |
| `ecomm-bff-mobile-main-dotnet` | stock | `ECC-211` |
| `ecomm-bff-mobile-emphasis-dotnet` | stock | `ECC-211` |
| `ecomm-bff-backoffice-order-dotnet` | stock | **Sem card** |
| `ecomm-bff-mobile-search-dotnet` | stock + price | **Sem card** |
| `ecomm-bff-backoffice-stock-dotnet` | stock + price | Provavelmente `ECC-210` (a confirmar) |
| `ecomm-sub-service-wake-princing-dotnet` | price | **Sem card** — ACL externa, tratamento à parte |
| `uptime-guardian-agent` | stock + price | N/A — monitor sintético, não migra |

Nota: `ecomm-api-orchestrator-product-dotnet` tem, por sua vez, upstream próprio (`bff-mobile-checkout`, `bff-mobile-search`, `bff-mobile-cart`, `api-order`, `api-mobile-stock`, `bff-mobile-emphasis`, `bff-backoffice-offer`) — migrá-lo tem o maior raio de impacto de todos os consumidores diretos, por isso deve ser o mais testado antes do rollout amplo.

Downstream da própria `api-stock`/`api-price` (infra, não migra): `eks-pod-identity-agent`, `secretsmanager.us-east-1.amazonaws.com`. A entrada `peer.hostname:blocked-ip-address` aparece em ambos os serviços e ainda não foi investigada — recomendo investigação separada antes do cutover, para garantir que não é um sintoma real de rede a ser herdado pela Core.

## 6. Mecanismo de Feature Flag por Loja

Existe uma tentativa anterior com escopo quase idêntico: `ECC-47` ("Criar feature toggle por loja para utilizar nova estrutura catálogo") — cancelada com resolução "Won't Do". Não foi possível confirmar o motivo do cancelamento; a squad optou por criar um card novo em vez de reabrir o antigo, referenciando-o para contexto histórico.

A definir tecnicamente (não há detalhe no repo/board ainda) — mas com base no padrão já usado em `ECC-211` ("Feature toggle para voltar para o fluxo antigo") e no papel que a flag cumpre nesta migração (substitui o ambiente Beta — é a própria flag que isola a loja piloto em produção, conforme §3 da Fase 2):

- Flag avaliada por `storeId`/CNPJ da loja em cada consumidor migrado.
- Fallback automático para o fluxo antigo em caso de erro (circuit breaker), não apenas flag estática.
- Flags independentes por consumidor — a loja piloto pode estar 100% migrada no Portal e ainda no fluxo antigo no App, por exemplo.

## 7. Plano de Rollback

- Por ser feature flag por loja, rollback é **por loja e por consumidor**: reverter a flag imediatamente direciona a loja de volta ao fluxo antigo, sem afetar as demais.
- Dual-write mantém o Mongo como fonte de verdade até o cutover — reverter não perde dado.
- Rollback total de fase (ex: Fase 3 inteira) = reverter todas as flags dos consumidores migrados naquela fase.

## 8. Riscos e Perguntas em Aberto

1. **Confirmar com o time**: motivo do cancelamento de `ECC-93` e `ECC-64` — impacta se algo do escopo cancelado precisa ser retomado.
2. **`ecomm-bff-backoffice-stock-dotnet`**: confirmar se está de fato coberto pelo escopo de `ECC-210` (Portal/estoque) ou se precisa de card próprio.
3. **`ecomm-sub-service-wake-princing-dotnet`**: definir estratégia de integração com a Core — é ACL externa (Wake), não um consumidor comum.
4. Nenhum ADR desta migração está registrado — recomenda-se criar antes da Fase 0, conforme prática já adotada para Catálogo.
5. Story points e prioridade das novas tarefas (Fase 0) ainda não foram estimados pela squad — sugestão de estimativa incluída na seção 9, mas a validar em refinamento.

## 9. Tarefas Criadas no Jira (`ECC` — SQ Ecommerce Core)

Organizadas em épicos separados, conforme decisão da squad: domínio puro (Stock/Price) usa os épicos de domínio já existentes; trabalho transversal (não pertence a um único domínio) ganhou épicos próprios de função (Fundação/Desligamento). Os 9 cards de consumidor continuam como subtarefas de `ECC-210`/`ECC-211` (mistos por natureza — canal Portal/App, não domínio) e por isso permanecem no épico original `ECC-1`.

### Épico `ECC-51` — Domain: Stock
- `ECC-230` — Stock.Infrastructure (DbContext + migration)
- `ECC-231` — Stock.Application
- `ECC-249` — Descomissionar `ecomm-api-stock-dotnet`

### Épico `ECC-50` — Domain: Price
- `ECC-232` — Pricing.Infrastructure (DbContext + migration)
- `ECC-233` — Pricing.Application
- `ECC-246` — wake-princing (spike de integração ACL)
- `ECC-250` — Descomissionar `ecomm-api-price-dotnet`

### Épico `ECC-253` — Fundação Core — Infraestrutura Compartilhada (novo)
- `ECC-229` — Infraestrutura de consumo Kafka compartilhada
- `ECC-234` — Estender legacy_id + UUID v7 para Stock e Pricing
- `ECC-235` — Registrar ADR da estratégia de migração
- `ECC-236` — Feature flag por loja (referencia `ECC-47`, cancelado)

### Épico `ECC-254` — Desligamento Legado — Estoque/Preço (novo)
- `ECC-247` — Monitorar tráfego residual via Datadog
- `ECC-248` — Desligar consumers de sincronização Mongo→Postgres
- `ECC-251` — Retenção e desligamento das bases MongoDB
- `ECC-252` — Remover feature flags após estabilização

### Épico `ECC-1` — Estoque/Preço (subtarefas de `ECC-210`/`ECC-211`, sem alteração)
- `ECC-210` → `ECC-244` (bff-backoffice-order), `ECC-245` (bff-backoffice-stock)
- `ECC-211` → `ECC-237` (orchestrator-product), `ECC-238` (bff-mobile-cart), `ECC-239` (api-mobile-stock), `ECC-240` (bff-mobile-offer), `ECC-241` (bff-mobile-main), `ECC-242` (bff-mobile-emphasis), `ECC-243` (bff-mobile-search)

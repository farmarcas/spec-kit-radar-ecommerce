# Síntese da Proposta — Monólito Modular · Farmarcas

> **Fonte:** https://uamartins.vercel.app/radar-e-commerce/ddd/16-sintese-proposta-final.html  
> **Data do documento:** 2026-04-27

---

## Resumo Executivo

A proposta substitui aproximadamente 220 microserviços fragmentados por um "monólito modular" com base única em PostgreSQL. Cada domínio é um módulo com fronteiras claras, schema próprio e deploy independente, mas todos no mesmo repositório e processo.

**Em uma frase:** "Substituir ~220 microserviços fragmentados por um monólito modular com base única em PostgreSQL, onde cada domínio é um módulo com fronteiras claras, deploy independente e schema próprio."

---

## Decisões-Chave

### 1 Repositório Único
Todos os módulos no mesmo repo. Refatorações cross-módulo em um único PR. Histórico unificado. Sem sincronização de versões entre repos.

### PostgreSQL · Schema por Módulo
Um banco, múltiplos schemas (`pricing.*`, `promotion.*`, etc.). Isolamento lógico preservado. JOIN nativo entre módulos sem overhead de rede.

### Promoção = Módulo, Não Microserviço
Consultas de preço com promoção resolvidas diretamente no banco via JOIN. Sem hop HTTP, sem serviço intermediário, sem latência adicional.

### Deploy por Módulo · Múltiplas Esteiras
Cada módulo tem seu entrypoint no repositório. CI/CD detecta qual módulo mudou e aciona a esteira correspondente. Mudança no Pricing não redeploye o Catalog.

### Observabilidade por Módulo · Datadog
APM, métricas e logs centralizados no Datadog, tagueados por módulo. Dashboards e alertas independentes por domínio.

### Escala por Módulo no EKS
Cada módulo como Deployment independente no EKS. HPA configurado por módulo. Pricing pode escalar 10× sem replicar Catalog.

### GraphQL Gateway — BFF Único, Resolvers In-Process
Um único endpoint GraphQL substitui múltiplos REST BFFs fragmentados. Resolvers chamam os módulos diretamente in-process — sem nenhum hop HTTP adicional.

---

## Arquitetura Alvo

### Estrutura do Repositório

```
EcommPlatform/
│
├── src/Modules/               ← 1 pasta por domínio
│   ├── Catalog/
│   ├── Pricing/
│   ├── Promotion/             ← módulo, não serviço
│   ├── Stock/
│   ├── Search/
│   └── Pharmacy/
│
├── src/Host/                  ← entrypoints por módulo
│   ├── Catalog.Host/
│   ├── Pricing.Host/
│   ├── Promotion.Host/
│   └── ...
│
├── src/Shared/
│   ├── Shared.Kernel/             ← tipos comuns, Result<T>
│   ├── Shared.Auth/               ← JWT, CurrentUser
│   └── Shared.Infra/              ← Kafka, logging, metrics
│
├── tests/                     ← 1 projeto de teste por módulo
└── .github/workflows/        ← 1 pipeline por módulo
```

### Estrutura Interna de Cada Módulo (ex: Pricing)

```
Pricing/
├── Pricing.Api/           ← Controllers HTTP
├── Pricing.Workers/       ← Consumers Kafka
├── Pricing.Application/   ← Services, Commands (mesma lógica para HTTP e Kafka)
├── Pricing.Domain/        ← Entidades, ValueObjects, invariantes
└── Pricing.Infrastructure/ ← Repositórios, DbContext (schema: pricing.*)
```

**Regra de ouro:** escrita é bounded (só Pricing altera `pricing.store_product`), leitura é pragmática (JOIN entre schemas é permitido).

---

## Módulos da Plataforma

- **Catalog** — produtos, categorias
- **Pricing** — preços, descontos
- **Promotion** — ofertas, campanhas (como módulo, não serviço)
- **Stock** — estoque, reservas
- **Search** — busca, índices
- **Pharmacy** — farmácias, configurações

Cada módulo: Api · Application · Domain · Infrastructure · Workers — mesma estrutura interna, fronteiras respeitadas.

---

## Estado Atual — As Is

| Métrica | Valor |
|---------|-------|
| Microserviços totais | ~220 |
| Repos produto/preço | 6+ |
| Pipelines CI/CD | 220+ |
| HTTP calls / listagem | 5 |
| Latência listagem | ~6 min |
| Bancos de dados | MongoDB fragmentado |
| Deploy / feature cross | 3–6 serviços |
| Boundary DDD | Ausente |
| APM / observabilidade | ~40% |

---

## Estado Alvo — To Be

| Métrica | Valor |
|---------|-------|
| Módulos na plataforma | 7 |
| Repositórios | 1 |
| Pipelines CI/CD | 7 (por módulo) |
| HTTP calls / listagem | 0 (intra-processo) |
| Latência listagem | < 100ms |
| Banco de dados | PostgreSQL · schema/módulo |
| Deploy / feature | 1 módulo afetado |
| Boundary DDD | Explícito por módulo |
| APM / observabilidade | > 90% |
| Camada de API cliente | GraphQL Gateway |
| REST BFFs fragmentados | 0 (eliminados) |

---

## Transformação por Domínio

| Domínio | As Is | To Be | Impacto |
|---------|-------|-------|---------|
| Catalog | api-catalogue · api-product · processamento de produto | Catalog.Module — schema `catalog.*` | −3 repos |
| Pricing | api-price · price-sub-service · price-discount-job · store-discount-list-sub · store-discount-update-sub · wake-pricing-sub | Pricing.Module — schema `pricing.*` | −6 repos |
| Promotion | promotions-api · bff-backoffice-promotions · offer-sub-service · offer-store-sub · offer-event-sub · converted-offers × 4 + mais | Promotion.Module — schema `promotion.*` · consultas via JOIN com Pricing | −10+ repos |
| Stock | api-stock · stock-sub-service · processing-stock-file-sub · processing-stock-batch-sub · stock-panelreport-sub · store-stock-report · job-pharmacy-stock · stock-export-sub · wake-stock-sub + mais | Stock.Module — schema `stock.*` | −16 repos |
| Search | bff-search-mobile · bff-destaque-mobile · sub-services de indexação | Search.Module — schema `search.*` · índice PostgreSQL full-text | −3 repos |
| Pharmacy | api-pharmacy · bff-backoffice-stock · bff-mobile-stock | Pharmacy.Module — schema `pharmacy.*` · BFFs refatorados | refatorado |
| Orquestrador | ecomm-api-orchestrator-product — 150+ linhas de if, 5 HTTP síncronos por request | Eliminado — substituído por chamadas intra-processo | deprecated |
| ACLs externas | wake-acl-service · erp-integration (8+ serviços Wake + 3 ERP) | Preservados como ACL na borda — integração externa isolada | preservado |

---

## Estratégia de Banco

### PostgreSQL Único, Isolamento Lógico via Schemas

| Schema | Tabelas |
|--------|---------|
| `catalog.*` | products, categories |
| `pricing.*` | store_product, price_history |
| `promotion.*` | promotions, rules |
| `stock.*` | inventory, movements |
| `search.*` | index_cache, suggestions |
| `pharmacy.*` | stores, settings |

Cada módulo é dono do seu schema. Nenhum módulo altera tabelas de outro módulo via mutação direta.

### Consultas de Preço + Promoção

Um único `JOIN` entre `pricing.store_product` e `promotion.promotions` resolve o que hoje exige 2 microserviços e chamadas HTTP encadeadas.

### Isolamento Preservado

O schema separa o espaço lógico. Migrations por módulo, roles de banco por módulo. Fronteira clara sem overhead de rede.

### Extração Futura Simples

Quando um módulo precisar escalar independentemente, o schema já está isolado. Extrair para um serviço autônomo é uma decisão de futuro, não uma obrigação hoje.

**Regra de leitura/escrita:** Escrita é bounded — cada módulo muta apenas seu próprio schema. Leitura é pragmática — JOINs entre schemas são permitidos em handlers de query. Isso elimina a necessidade de views materializadas e eventos intermediários para consultas compostas.

---

## Deploy & Escala por Módulo

### Múltiplas Esteiras de CI/CD

```
Push detecta módulos alterados
  ↓
Path filters no CI identificam quais módulos tiveram mudança
  ↓
CI único · compartilhado mesma esteira para todos os módulos
  ├─ build
  ├─ test
  ├─ image
  └─ deploy por módulo ↓
      └─ apenas módulos alterados são deployados
          ├─ deploy Pricing.Host → rollout → EKS
          ├─ deploy Promotion.Host → rollout → EKS
          └─ deploy Catalog.Host → rollout → EKS
```

### EKS · Deployment por Módulo

HPA independente, recursos próprios, rollout canário por módulo.

Pricing sob carga de Black Friday escala para 20 pods sem afetar Stock ou Catalog. Cada módulo tem seu Deployment, Service e HPA no Kubernetes. A infra EKS existente é mantida — apenas a topologia dos workloads muda.

### Datadog — Plataforma de Observabilidade

#### APM · Traces

Trace distribuído com tag `env.module=pricing`. Flame graphs por request. Drill-down em cada span intra-módulo. Service Map mostra dependências reais.

#### Metrics · Dashboards

Dashboard por módulo com p50/p95/p99 de latência, taxa de erro e throughput. Alertas independentes — erro no Promotion não polui o oncall de Catalog.

#### Logs

Structured logs com campos `module`, `trace_id` e `span_id`. Correlação automática log ↔ trace no Datadog Log Management.

#### Tags Padrão por Módulo

```
service:ecomm-platform module:pricing ← filtra por domínio
env:production
version:<git-sha> ← rastreabilidade de deploy
```

#### Alertas por Módulo

- Monitor de latência p95 > 200ms por módulo
- Error rate > 1% dispara alerta no domínio afetado
- SLO de disponibilidade configurado por módulo no Datadog

---

## Estratégias de Deploy · Canary · Blue-Green · Beta

### Canary Deploy

**Módulos:** Pricing · Stock · Promotion

Rollout progressivo com rollback automático via Datadog

```
# Argo Rollouts no EKS
100% tráfego → pricing-stable

deploy nova versão (canary):
  5%  → pricing-canary  ← métrica OK?
  25% → pricing-canary  ← métrica OK?
  75% → pricing-canary  ← métrica OK?
  100%→ pricing-canary  ← promote

error rate > 1% → rollback automático
```

Argo Rollouts integrado ao EKS — sem custo adicional de plataforma.

Datadog APM como análise automática — rollback dispara se p95 ou error rate excedem threshold.

Ideal para mudanças de regra de negócio (desconto, promoção) — impacto financeiro exige progressividade.

**Módulos prioritários para canary:** Pricing, Promotion, Stock, GraphQL Gateway

### Blue-Green Deploy

**Casos:** Gateway · Migrations

Switch instantâneo · zero downtime · rollback em segundos

```
# ALB target group switching no EKS

ANTES:
  ALB → blue (100% tráfego) · versão atual
  green (0%) · nova versão aquecendo

SWITCH (segundos):
  ALB → green (100%) · nova versão ativa
  blue retém estado · pronto p/ rollback

ROLLBACK (instantâneo):
  ALB → blue (100%) ← reaponta em < 5s
```

Ideal para o **GraphQL Gateway** — ponto único de entrada, qualquer downtime é crítico.

Ideal durante **schema migrations** — green já com novo schema, blue como fallback.

Rollback < 5s via ALB target group — sem revert de código, sem redeploy.

**Quando usar Blue-Green:**
- Releases do GraphQL Gateway
- PostgreSQL schema migrations grandes
- Cutover MongoDB → PostgreSQL por módulo

### Ambiente Beta

**Crítico na migração**

Farmácias piloto · validação com tráfego real antes do cutover

```
# Topologia com Beta

Farmácias (95%)       → prod  → módulos estáveis
Farmácias piloto (5%) → beta  → módulo migrado

beta espelha prod:
  ✓ mesma infra EKS
  ✓ dados reais (snapshot diário)
  ✓ Kafka real (consumer group separado)
  ✓ Datadog separado · dashboards beta

módulo aprovado → cutover para 100%
```

Feature flags selecionam quais farmácias apontam para beta — opt-in gradual controlado pelo produto.

Detecta divergências de comportamento entre MongoDB (atual) e PostgreSQL (novo) com dados reais.

Após migração: beta vira ambiente de QA permanente para validação de releases antes do canary em prod.

#### Critérios de Graduação Beta → Prod

- 48h sem divergência de dados vs MongoDB
- p95 latência ≤ equivalente atual
- Zero erros 5xx por 24h
- Aprovação do time de produto

#### Quando Usar Cada Estratégia · Guia por Evento de Deploy

| Evento | Canary | Blue-Green | Beta |
|--------|--------|-----------|------|
| Mudança de regra de negócio (Pricing/Promotion) | ideal | opcional | validar antes |
| Release do GraphQL Gateway | sim | ideal | sim |
| Schema migration PostgreSQL | após migration | ideal | validar dados |
| Cutover MongoDB → PostgreSQL por módulo | após cutover | ideal | crítico |
| Feature nova de baixo risco (Catalog) | opcional | desnecessário | opcional |
| Hotfix crítico em produção | pular | ideal | pular |

---

## GraphQL Gateway

BFF único com resolvers in-process — zero hop HTTP, zero over-fetching.

### Topologia com GraphQL Gateway

```
Cliente (Web · Mobile · Parceiros)
  └─► GraphQL Gateway  POST /graphql
        │  JWT auth · depth limit · complexity limit · persisted queries
        │
        └─intra-processo─►
              ┌─ EcommPlatform (monólito modular) ──────────────────┐
              │  Resolver product(sku)                               │
              │    ├─► Catalog.Module   → catalog.*                 │
              │    ├─► Pricing.Module   → pricing.* + JOIN promotion.*│
              │    └─► Stock.Module     → stock.*                   │
              └──────────────── PostgreSQL ─────────────────────────┘

↑ 1 request cliente → 3 queries SQL em paralelo → 1 response
↑ zero HTTP interno · zero BFF proliferation · zero over-fetching
```

### Schema GraphQL (SDL — Tipos Principais)

```graphql
type Query {
  product(sku: String!, storeId: ID!): Product
  products(storeId: ID!, page: Int): ProductPage
  searchProducts(term: String!, storeId: ID!): [Product!]!
}

type Subscription {
  stockChanged(sku: String!, storeId: ID!): StockPayload!
  priceChanged(sku: String!, storeId: ID!): PricePayload!
}

type Product {           # composição de módulos
  sku:         String!
  name:        String!
  category:    Category    # Catalog.Module
  price:       Price       # Pricing.Module (JOIN Promotion)
  stock:       StockInfo   # Stock.Module
}

type Price {             # Pricing.Module
  base:     Float!
  final:    Float!
  discount: Discount
}

type StockInfo {         # Stock.Module
  sellableQty: Int!
  status:      StockStatus!  # IN_STOCK | LOW_STOCK | OUT_OF_STOCK
}
```

### Proteções Obrigatórias no Gateway

- **Introspection OFF em produção** — schema não exposto publicamente
- **Depth limiting máximo 5 níveis** — protege contra queries recursivas
- **Complexity limiting máximo 200 pontos por query** — protege contra DoS
- **Persisted queries em produção para clientes conhecidos** — apenas queries pré-aprovadas executadas
- **JWT obrigatório** validado antes de qualquer resolver executar

### Impacto: Fim dos REST BFFs Fragmentados

| Aspecto | As Is | To Be |
|---------|-------|-------|
| Endpoints | bff-search-mobile, bff-destaque-mobile, bff-backoffice-promotions, bff-backoffice-stock, bff-mobile-stock, ecomm-api-orchestrator-product | 1 endpoint GraphQL `/graphql` |
| Over-fetching | Alto — REST retorna payload fixo | zero — cliente pede apenas os campos necessários |
| HTTP entre BFF e serviços | N+1 HTTP | zero |
| Schema versionado | Não | Sim — documentado automaticamente |

---

## Estratégia de Auto-Scaling por Módulo

### A Tensão Arquitetural

**Resolvers in-process** + **HPA por módulo** são mutuamente exclusivos no mesmo processo. Se todos os módulos rodam no mesmo pod do gateway, escalar Pricing significa escalar tudo.

### Opção 1 — Apollo Federation

Router stateless + subgraph por módulo em pod separado

```
Cliente
  └─► Apollo Router  (Deployment próprio · stateless)
        │  planeja a query · faz calls em paralelo · agrega
        │
        ├─HTTP intra-cluster─► catalog-host   (HPA: 2–8 pods)
        ├─HTTP intra-cluster─► pricing-host   (HPA: 2–20 pods)
        ├─HTTP intra-cluster─► stock-host     (HPA: 2–15 pods)
        └─HTTP intra-cluster─► promotion-host (HPA: 2–5 pods)
```

- ✅ HPA verdadeiramente por módulo
- ✅ Apollo Router stateless → escala barato
- ❌ Reintroduz hops HTTP intra-cluster (~1–3ms por subgraph)
- ❌ Maior complexidade operacional

### Opção 3 — Gateway Como Unidade de Escala (Fase 1)

Escalar o processo completo — aceitar scaling acoplado agora

```
Cliente
  └─► GraphQL Gateway (Deployment unificado)
        │  resolvers in-process · zero hop HTTP
        │
        └─intra-processo─►
              ┌─ EcommPlatform (todos os módulos) ──────┐
              │  Catalog · Pricing · Stock · Promotion  │
              │  HPA escala o processo como um todo      │
              └──────────── PostgreSQL ─────────────────┘
```

- ✅ Operação simples — 1 Deployment, 1 HPA
- ✅ Latência mínima preservada
- ❌ Sem isolamento de falha por módulo no nível de processo

### Caminho Evolutivo Recomendado

Iniciar com **Opção 3** (Fase 1 — consolidação dos 220 microserviços) e migrar para **Opção 1 (Apollo Federation)** quando módulos com carga assimétrica forem identificados em produção. A decisão de quando fazer a transição é guiada por dados, não por antecipação.

| Critério | Opção 1 · Apollo Federation | Opção 3 · Gateway como unidade |
|----------|---------------------------|-------------------------------|
| Carga assimétrica entre módulos | Ideal | Ineficiente |
| Carga uniforme (Black Friday global) | Funciona | Ideal |
| Latência de resposta | +1–3ms por subgraph | Mínima — zero hop |
| Complexidade operacional | Maior | Menor |
| Isolamento de falha por módulo | Sim | Não |
| Fase recomendada | Fase 2+ | Fase 1 |

---

## Diagrama Conceitual — Visão de Camadas

```
Camada de Cliente
├─ Web App (React / Next.js)
├─ Mobile App (iOS / Android)
└─ Parceiros / B2B (Farmácias / ERPs)
    ↓ HTTP · WebSocket

GraphQL Gateway
├─ POST /graphql · WS /subscriptions
├─ JWT Auth obrigatório
├─ Depth Limit máx. 5 níveis
├─ Complexity máx. 200 pts
└─ Subscriptions real-time
    ↓ intra-processo · chamada de método · zero HTTP

Módulos de Domínio
├─ EcommPlatform · 1 repositório · deploy por módulo
├─ Catalog    → produtos · categorias  → catalog.*
├─ Pricing    → preços · descontos     → pricing.*
├─ Promotion  → ofertas · campanhas    → promotion.*
├─ Stock      → estoque · reservas     → stock.*
├─ Search     → busca · índices        → search.*
└─ Pharmacy   → farmácias · config     → pharmacy.*
    ↓ SQL · JOIN entre schemas · Kafka events

Camada de Dados
├─ PostgreSQL
│  ├─ catalog.*   ├─ pricing.*   ├─ promotion.*
│  ├─ stock.*     ├─ search.*    └─ pharmacy.*
│  ↑ JOIN entre schemas · migrations por módulo · escrita bounded
└─ Kafka · eventos de domínio
   ├─ price.updated
   ├─ stock.changed
   └─ promotion.activated

Infraestrutura
├─ EKS → HPA por módulo · deploy independente · 7 pipelines de CI/CD
├─ Datadog APM → Traces · Metrics · Logs · SLO por módulo
└─ CI/CD → Path filters · 1 pipeline por módulo · 1 repositório
```

---

## Migração de Dados

### Estratégia de Sincronização

1. **Carga Inicial (Backfill)** — migração em batch dos dados históricos do MongoDB para os schemas PostgreSQL correspondentes
2. **Sincronização Contínua** — CDC (Change Data Capture) ou consumers Kafka mantêm os bancos em sincronia durante o período de coexistência
3. **Validação e Cutover por Módulo** — cada módulo tem seu próprio cutover sem big bang

**Coexistência gerenciada:** Mongo e Postgres rodam em paralelo durante a transição — encerrada módulo a módulo conforme a validação em produção é confirmada.

---

## Resultados Esperados

| Resultado | Detalhe |
|-----------|---------|
| Latência de listagem < 100ms | Hoje ~6 min. JOIN direto no PostgreSQL, sem HTTP entre serviços |
| Custo de infra −40% a −70% | De ~220 serviços para módulos consolidados |
| Repositório: 1 | De 6+ repos para 1 único repo modular |
| HTTP interno: 0 | Comunicação intra-processo — zero latência de rede interna |
| GraphQL Gateway: 1 | Um único endpoint substitui múltiplos BFFs |
| Manutenibilidade | Regra de negócio num único lugar — mudança impacta 1 arquivo, não 3 serviços |
| Escalabilidade cirúrgica | HPA por módulo no EKS — custo proporcional à carga real |
| Caminho de saída claro | Schema isolado por módulo = extração futura sem refatoração massiva |

---

## Comparativo As Is vs. To Be

| Dimensão | Hoje · As Is | Proposta · To Be |
|----------|-------------|-----------------|
| Repositórios (produto/preço) | 6+ | 1 |
| HTTP calls por listagem | 5 | 0 (intra-processo) |
| Latência de listagem | ~6 min | < 100ms |
| Promoção | Microserviço separado + HTTP | módulo JOIN direto no PostgreSQL |
| Banco de dados | MongoDB fragmentado por serviço | PostgreSQL único · schema por módulo |
| Deploy por feature | 3–6 serviços | 1 módulo afetado |
| Esteiras de CI/CD | 1 por repositório, sem coordenação | 1 por módulo, path-filtered no mesmo repo |
| Escala | Por serviço, granular porém custoso | Por módulo no EKS · HPA independente |
| Observabilidade | Traces fragmentados · APM ~40% | Datadog APM + Logs + Metrics · SLO por domínio |
| Camada de API cliente | Múltiplos REST BFFs | GraphQL 1 gateway · schema unificado |
| Over-fetching | Alto — REST retorna payload fixo | zero — cliente pede apenas os campos necessários |
| Real-time (estoque/preço) | Polling periódico ou ausente | Subscriptions WebSocket via GraphQL |
| Infraestrutura | EKS + ~220 workloads | EKS mantido · workloads consolidados por módulo |
| Extração futura | Já extraído, mas fragmentado | Módulo → serviço quando necessário (schema já isolado) |

---

## Engenharia · Boas Práticas

Este projeto como modelo de excelência técnica para a companhia — práticas obrigatórias, padrões replicáveis.

O monólito modular **não é apenas uma decisão de arquitetura** — é a oportunidade de estabelecer o padrão de engenharia que os demais projetos da companhia irão replicar.

### SonarQube · Análise Estática

Quality gate bloqueante em cada PR. Detecção de code smells, duplicações, vulnerabilidades e security hotspots. Histórico de dívida técnica por módulo.

#### Quality Gate Mínimo por Módulo

```
coverage             ≥ 80%
duplicated_lines     ≤ 3%
reliability_rating   = A
security_rating      = A
maintainability      ≤ 5 dias de dívida técnica
```

### Coverage Obrigatório · Pirâmide de Testes

- **Unit tests** — 80% line coverage obrigatório. Domain e Application são os alvos principais
- **Integration tests** — banco real em Docker Compose. Sem mocks de repositório
- **Contract tests** — validação do schema GraphQL entre releases via Pact ou schema registry

#### Pirâmide por Camada do Módulo

```
Domain/         → unit tests · 100% invariantes
Application/    → unit tests · 80%+ commands/queries
Infrastructure/ → integration tests · banco real
Api/            → contract tests · schema GraphQL
```

### Spec-Driven Development + IA

- **GraphQL SDL primeiro** — schema escrito e revisado antes de qualquer resolver. IA gera resolvers, tipos e testes a partir do SDL
- **ADR (Architecture Decision Records)** — toda decisão arquitetural documentada em `docs/adr/`. IA consulta ADRs para manter consistência
- **CLAUDE.md por módulo** — contexto de domínio, regras de negócio e convenções que a IA usa em cada sessão
- **OpenAPI para ACLs externas** — contratos com Wake/ERP especificados em OpenAPI antes de integrar

#### Fluxo Spec-Driven

```
SDL / ADR review humano
   ↓
IA gera código + testes
   ↓
CI valida
```

### TDD com IA · Red → Green → Refactor

- **Red:** IA cria o teste que descreve o comportamento esperado — roda, falha, confirma intenção
- **Green:** IA implementa o mínimo necessário para o teste passar — sem código especulativo
- **Refactor:** IA refatora com testes verdes como rede de segurança — coverage nunca cai

PR sem teste correspondente é bloqueado pelo quality gate Sonar — não há merge sem evidência de teste.

#### Instrução padrão (CLAUDE.md por módulo)

```
# CLAUDE.md — Pricing.Module
Ao implementar qualquer regra de negócio:
1. Escreva o teste unitário primeiro (red)
2. Confirme que ele falha pelo motivo certo
3. Implemente o mínimo para passar (green)
4. Refatore mantendo testes verdes
```

### Agentes & Skills de Desenvolvimento

Skills reutilizáveis criadas para o projeto:

```
/ddd-bounded-context
/repo-analysis
/migration-assist
/spec-validate
```

### Review Automático com IA

- **Claude Code `/ultrareview`** em cada PR — análise multi-agente de segurança, performance, boundary DDD e convenções
- **Sonar PR decoration** — issues anotadas diretamente nas linhas do PR no GitHub
- **Review de boundary** — IA verifica se escrita cross-módulo foi introduzida e bloqueia com comentário explicativo

#### Pipeline de Review

```
PR aberto → Sonar gate → IA review → humano aprova
```

### Trabalho Paralelo com Git Worktree

```
worktree/pricing  ← agente A: migra Pricing
worktree/stock    ← agente B: migra Stock
worktree/catalog  ← agente C: migra Catalog
↑ 3× velocidade de migração
```

### Outros Processos e Convenções

| Convenção | Detalhe |
|-----------|---------|
| **Conventional Commits** | Formato `feat(pricing):`, `fix(stock):` obrigatório. Scopo = nome do módulo. Changelog gerado automaticamente |
| **ADR por Decisão** | `docs/adr/NNN-titulo.md`. Formato: contexto, decisão, consequências. Imutável após aprovação |
| **Security Review em PR** | `/security-review` em PRs que tocam Auth, ACL externas ou dados de PII. Review bloqueante |
| **Performance Budget** | SLO de latência por operação GraphQL definido antes do desenvolvimento. Teste de carga automatizado em staging |

### Checklist de Adoção — Padrões Empresa-wide

| Prática | Ferramenta / Mecanismo | Enforced por | Replicável para |
|---------|----------------------|-------------|-----------------|
| Análise estática | SonarQube · quality gate por módulo | CI bloqueante | Todos os repos da companhia |
| Coverage obrigatório | Sonar + dotnet test · ≥ 80% | CI bloqueante | Todos os módulos · novos serviços |
| Spec-Driven Dev | GraphQL SDL + ADR + CLAUDE.md por módulo | processo | Todos os projetos com IA |
| TDD com IA | Claude Code · red → green → refactor | processo + Sonar | Times que usam IA |
| Agentes especializados | Skills Claude Code por domínio · CLAUDE.md | tooling | Novos projetos com IA |
| Review automático com IA | Claude Code /ultrareview · Sonar PR decoration | CI + GitHub Action | Todos os repos no GitHub |
| Trabalho paralelo | Git worktree + Claude Code isolation | tooling | Migrações · refactors grandes |
| Conventional Commits | commitlint + GitHub Action · scopo = módulo | CI bloqueante | Todos os repos da companhia |
| ADR | docs/adr/ · template padronizado | processo | Todos os projetos com decisões arquiteturais |

---

*Farmarcas · Análise DDD · Síntese Proposta Final · 2026-04-27*

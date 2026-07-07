# Análise consolidada - 10 issues Datadog (spike)

Documento de priorização para decidir o que atacar primeiro, quem resolve (dev vs plataforma) e o que é bug real vs deploy vs ruído.

Issues detalhadas: DD-001 a DD-010 nesta pasta.

## TL;DR - ordem de ataque

| Ordem | ID | Ação | Quem | Tempo | Ganho |
|---|---|---|---|---|---|
| 1 | DD-006 | Corrigir URL_APIGATEWAY_BASE vazia no deploy prod do search BFF | DevOps + mobile search | 1-2h | Busca no app para de dar 500 (14 users, regressão de ~1 dia) |
| 2 | DD-005 | Subir/restaurar ecomm-api-whatsapp-dotnet no EKS | DevOps | 1-4h | WhatsApp de pedido aprovado volta (130 users) |
| 3 | DD-004 | Criar DNS ou corrigir Posthog:URL em prod (auth + auditar order BFF) | DevOps + auth | 2-4h | Para erro de analytics; auth já funciona |
| 4 | DD-001 | Decidir: criar tópico Kafka ou desligar serviço zumbi | Negócio + DevOps | 2h-1d | Elimina 1,3M erros de ruído no Datadog |
| 5 | DD-002 + DD-003 | PR conjunto Wake: tratar 404 + trocar WebClient | Dev integração Wake | 2-3d | Para ~23k erros; pipeline Wake deixa de gritar |
| 6 | DD-007 | Retry (Polly) nos HttpClients do orchestrator | Dev orchestrator | 1-2d | Menos 500 em preço/estoque agregado (8 users) |
| 7 | DD-010 | Estabilizar deploy catalogue (PDB) - ataca DD-010 e reduz refused em cascata | DevOps | 1d | Vitrine emphasis deixa de esvaziar (13 users) |
| 8 | DD-008 | Restaurar event-collection + fire-and-forget no search | DevOps + dev search | 1d | Analytics de busca; app já funciona |
| 9 | DD-009 | Retry + 503 no stock-file-validator | Dev portal | 1-2d | Portal farmácia menos 400 falso |

Não fazer primeiro: DD-007, 008, 009, 010 isolados sem atacar estabilidade de deploy dos APIs downstream - senão vira remendo.

## O que é dev, deploy e "código zoado"

### Legenda

| Tag | Significado |
|---|---|
| DEV | Precisa PR de código |
| DEPLOY | Config, env var, DNS, K8s, tópico Kafka - sem lógica de negócio |
| INFRA | Serviço down, restart, rolling deploy mal configurado |
| RUÍDO | Erro real no log, mas fluxo principal OK ou telemetria |
| BUG | Comportamento errado confirmado no código |

### Por issue

| ID | Count | Users | É dev? | É deploy/infra? | Diagnóstico honesto |
|---|---|---|---|---|---|
| DD-001 | 1,3M | - | Opcional (fail-fast) | Sim - tópico Kafka ou serviço morto | Consumer rodando 2 meses sem tópico. Não é bug de app - é serviço zumbi ou infra nunca provisionada. |
| DD-002 | 11,7k | - | Sim - tratar 404 | Não | API catálogo funciona. 404 = EAN do Wake não existe no catálogo. Código trata isso como exceção (WebClient). Metade dev, metade dado. |
| DD-003 | 11,7k | - | Sim - mesmo PR do DD-002 | Não | Idêntico ao DD-002, outro serviço. |
| DD-004 | 349 | 3 | Opcional (não poluir Error Tracking) | Sim - DNS / URL PostHog | Recuperar senha funciona (200 + SendGrid 202). Só analytics PostHog falha - hostname prod não resolve. Deploy/config, não auth quebrado. |
| DD-005 | 299 | 130 | Opcional (retry/DLQ) | Sim - API WhatsApp down | Consumer OK; API whatsapp não escuta na 80. Provável deployment ausente/crash crônico - infra, impacto alto. |
| DD-006 | 231 | 14 | Sim - validar Uri no startup | Sim - env var vazia | Bug + regressão de deploy. URL_APIGATEWAY_BASE vazia -> URL vira file:// -> busca 500. Apareceu há ~1 dia. Atacar já. |
| DD-007 | 118 | 8 | Sim - retry Polly | Sim - restart deps | No sample, pharmacy recusou enquanto catalogue/stock/price OK. Padrão de janela de deploy, não código logicamente errado. Dev = resiliência. |
| DD-008 | 106 | 13 | Sim - fire-and-forget | Sim - event-collection down | Busca não quebra (EventService faz catch). Só analytics. Ruído + infra. |
| DD-009 | 53 | - | Sim - retry + 503 | Sim - store-sales restart | Portal recebe 400 quando deveria ser indisponibilidade temporária. Baixa frequência. |
| DD-010 | 45 | 13 | Sim - retry/cache vitrine | Sim - catalogue restart | HttpClient bem configurado. Catalogue down no momento -> vitrine 204 vazia. Mesmo tipo de incidente infra do DD-007/008. |

## Agrupamento por natureza (visão de sprint)

### Grupo A - "Deploy cagou / config faltando" (rápido, alto ganho)

```
DD-006 -> env var URL_APIGATEWAY_BASE
DD-004 -> DNS / Posthog:URL prod
DD-005 -> whatsapp API não está no ar
DD-001 -> tópico Kafka ou scale-down do consumer
```

Esforço total estimado: 1-2 dias com DevOps alinhado.
Ganho: app de busca, WhatsApp, analytics auth, limpa 1,3M erros.

### Grupo B - "Código legado trata coisa normal como erro" (dev, PR claro)

```
DD-002 + DD-003 -> WebClient + 404 não é exceção
DD-006 (parte 2) -> fail-fast se env vazia + Uri seguro
DD-008 (parte 2) -> telemetria não vira Error Tracking
DD-009 (parte 2) -> 503 em vez de 400
```

Esforço: ~1 sprint parcial (Wake + search + portal).
Ganho: ~24k erros param de poluir; pipeline Wake mais confiável.

### Grupo C - "Infra instável + falta resiliência" (DevOps + dev)

```
DD-007 -> orchestrator sem retry
DD-010 -> catalogue restart derruba vitrine
DD-008 -> event-collection restart
DD-009 -> store-sales restart
```

Raiz comum: rolling deploy sem PDB / `maxUnavailable: 0` nos APIs (catalogue, pharmacy, store-sales, event-collection).

Ação transversal DevOps (1 ticket):
- PDB + rolling update seguro nos APIs críticos
- Alerta quando endpoints do Service ficam vazios > 30s

Ação transversal Dev (1 ticket):
- Polly retry em BFFs/consumers para Connection refused

## Matriz facilidade × impacto

| | Impacto Baixo | Impacto Médio | Impacto Alto |
|---|---|---|---|
| **Fácil** | DD-001 (decisão + kill topic) | DD-004 (DNS PostHog) | **DD-006**, **DD-005** |
| **Médio** | DD-008, DD-009 | DD-002/003 | DD-010 |
| **Difícil** | | DD-007 (+ infra) | (dados EAN Wake -> catálogo) |

(Itens em **negrito** = fazer esta semana)

## O que NÃO é "código zoado de verdade"

Estes não são bugs de lógica de negócio - são sintomas de ambiente ou observabilidade:

- Connection refused (DD-005, 007, 008, 009, 010) - serviço downstream down ou reiniciando
- DD-001 - infra Kafka / serviço que não deveria estar rodando
- DD-004 - DNS/URL de telemetria; fluxo auth OK
- DD-002/003 404 - resposta HTTP correta da API; problema é tratar 404 como crash

## O que É "código zoado / regressão de verdade"

- DD-006 - construção de URL que gera `file://` + deploy sem validar env (quebra busca 500)
- DD-002/003 - WebClient legado sem tratamento de status HTTP
- DD-009 - retorna 400 quando infra falhou (semântica errada)

## Plano sugerido - 2 semanas

### Semana 1 - quick wins (deploy + P0)

| Dia | Ação |
|---|---|
| D1 | DD-006: kubectl exec -> confirmar env vazia -> corrigir pipeline/secrets -> redeploy search BFF |
| D1 | DD-005: kubectl get po,svc,endpoints whatsapp API -> restaurar deployment |
| D2 | DD-004: dig app.events.edelivery.febrafar.com.br -> DNS ou trocar URL PostHog prod |
| D2 | DD-001: reunião 30min com Offers - tópico ainda usado? -> criar tópico ou scale 0 |
| D3 | PR DD-006 fail-fast startup (validação env) |

### Semana 2 - dev + infra transversal

| Dia | Ação |
|---|---|
| D1-3 | PR Wake DD-002+003 (HttpClient + 404 + métrica ean_not_found) |
| D2 | Ticket DevOps: PDB rolling update catalogue, pharmacy, store-sales, whatsapp, event-collection |
| D3-4 | PR orchestrator DD-007 Polly retry |
| D4 | PR search DD-008 fire-and-forget eventos |

## Contagem de erros vs prioridade real

| ID | Count Datadog | Prioridade real | Por quê |
|---|---|---|---|
| DD-001 | 1,3M | P2 negócio / P1 observabilidade | Volume enorme mas worker; decisão arquitetural |
| DD-002 | 11,7k | P2 | Muito ruído; dado + código |
| DD-003 | 11,7k | P2 | Duplicata do 002 |
| DD-004 | 349 | P1 | Users + fluxo auth visível |
| DD-005 | 299 | P0 | 130 users, notificação pedido |
| DD-006 | 231 | P0 | Busca 500, regressão recente |
| DD-007 | 118 | P1 | 500 orchestrator |
| DD-008 | 106 | P2 | Só analytics |
| DD-009 | 53 | P2 | Portal edge |
| DD-010 | 45 | P1 | 13 users vitrine |

Count engana: DD-001 tem 1,3M mas pode ser só ruído. DD-006 tem 231 mas quebra app agora.

## Responsáveis sugeridos

| Squad / área | Issues |
|---|---|
| DevOps / Plataforma | DD-001, 004, 005, 007 (infra), 010 (catalogue deploy) |
| Mobile search | DD-006, 008 |
| Integração Wake | DD-002, 003 |
| Orchestrator | DD-007 (código) |
| Mobile emphasis | DD-010 (retry/cache) |
| Portal / estoque | DD-009 |
| Auth | DD-004 (config PostHog) |
| Offers / negócio | DD-001 (decisão fluxo) |

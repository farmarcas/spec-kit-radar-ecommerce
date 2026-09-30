# Pedidos — Notificações de Pedido Parado (Toast)

**Módulo:** Operação (visível em todo o Portal, inclusive Configuração)
**Histórias:** [ECP-1518](https://farmarcas.atlassian.net/browse/ECP-1518) — Notificações de Pedido Parado (Toast)
**Referência UX:** [ECP-1450](https://farmarcas.atlassian.net/browse/ECP-1450) (Notificações de pedido parado)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seção 6.7
**Relacionado:** [Tabela-Colunas-Comportamento-SLA.md](Tabela-Colunas-Comportamento-SLA.md) (mesma definição de "Parado" — 60 min fixos)
**Status:** Em desenvolvimento
**Última atualização:** 2026-09-30

---

## 1. O que é

Modelo in-app apenas — sem WhatsApp automático nem central de notificações (fora de escopo deste ciclo, mesmo com a API da Meta voltando à mesa na daily de 24/09). A base de notificações em tempo real (websocket/push, não polling) foi aprovada como direção de arquitetura, preparando caminho para uma futura central — mas a central em si não é entregue agora.

## 2. Regras de negócio

### 2.1 Gatilho

Pedido sem movimentação por mais de **60 minutos fixos** (mesma definição de "Parado" da tabela — ver [Tabela-Colunas-Comportamento-SLA.md](Tabela-Colunas-Comportamento-SLA.md) §3.2) gera o toast "Pedido parado".

### 2.2 Persistência

Toast fica fixo até o usuário fechar manualmente pelo "x" — não some sozinho. Se a aba/tela for fechada e reaberta, reaparece enquanto o pedido continuar parado.

### 2.3 Agrupamento

Acima de 2 toasts simultâneos, agrupam em "Existem +N pedidos parados".

### 2.4 Reincidência

A cada hora adicional parada (1h, 2h, 3h...).

### 2.5 Escopo de visibilidade — global, literal

Visível em **qualquer aba do Portal**, não só na tela de Pedidos — inclusive dentro do módulo de Configuração (Estoque/Configurações de uma loja específica, que opera em contexto único). O toast não depende do contexto selecionado na tela atual, só do fato de existir um pedido parado dentro do que o usuário tem acesso a ver.

## 3. Nível de integração / fonte de dados

- Mecanismo de entrega: tempo real (websocket/push), não polling de endpoint — decisão de arquitetura da daily de 2026-09-24, pra evitar uma "gambiarra" de polling e já preparar o caminho pra uma central de notificações futura.
- Gatilho de "sem movimentação" usa a mesma lógica de timestamp de status do pedido — ver [[feedback_status_change_query_rules]] (campo `<status>.triggeredAt`, nunca `updatedAt` puro, guard `previusStatus != status`).
- **Não confirmado:** arquitetura exata do canal de tempo real (protocolo, serviço) — aprovada só como direção, implementação ainda não detalhada.
- WhatsApp automático e central de notificações seguem fora de escopo — não implementar mesmo que pareça simples de adicionar depois.

## 4. Cenários de borda

| Cenário | Regra |
|---|---|
| Mais de 2 pedidos parados ao mesmo tempo | Agrupam em "Existem +N pedidos parados" |
| Pedido parado recebe movimentação | Toast correspondente some |
| Usuário navegando entre abas do Portal com toast ativo | Toast visível em qualquer aba, incluindo módulo de Configuração |
| Pedido resolvido com o toast ainda aberto em outra aba | A definir — cenário identificado no ECP-1450 sem regra fechada ainda |

## 5. Pendências / perguntas em aberto

- [ ] Arquitetura exata do canal de tempo real (protocolo/serviço) — só aprovada a direção, não a implementação.
- [ ] Comportamento exato quando o pedido resolve com toast aberto em múltiplas abas simultaneamente.

## Changelog

- **2026-09-30** — Criação do documento (v1), a partir de ECP-1518, ECP-1450, PRD seção 6.7.

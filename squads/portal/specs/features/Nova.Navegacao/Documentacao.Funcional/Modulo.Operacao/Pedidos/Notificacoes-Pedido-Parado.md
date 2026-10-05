# Pedidos — Notificações de Pedido Atrasado e Parado (Toasts)

**Módulo:** Operação (visível em todo o Portal, inclusive Configuração)
**Histórias:** [ECP-1518](https://farmarcas.atlassian.net/browse/ECP-1518) — Notificações de pedido atrasado e parado (toasts)
**Referência UX:** [ECP-1450](https://farmarcas.atlassian.net/browse/ECP-1450) (Notificações de pedido parado)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seção 6.7
**Relacionado:** [Tabela-Colunas-Comportamento-SLA.md](Tabela-Colunas-Comportamento-SLA.md) (definições de "Atrasado" e "Parado" — 60 min fixos), ECP-1566 (atualização da lista quase em tempo real)
**Status:** Em desenvolvimento
**Última atualização:** 2026-10-05

---

## 1. O que é

Notificações in-app em formato de toast, empilhadas no canto superior direito e visíveis em qualquer tela do Portal. Existem dois tipos — "Pedido atrasado" (temporário) e "Pedido parado" (persistente) — e um toast agrupador quando há muitas notificações. Não há central de notificações neste ciclo. A base de notificações em tempo real (websocket/push, não polling) foi aprovada como direção de arquitetura, preparando caminho para uma futura central.

## 2. Regras de negócio

### 2.1 Tipos de toast

- **Pedido Atrasado** (ícone vermelho): disparado quando o pedido acaba de exceder o tempo limite de separação/entrega. Texto: "Pedido para [retirada/entrega] de [cliente] acabou de exceder o tempo limite de separação." + ação "Ver pedido". **Temporário, um por pedido.**
- **Pedido parado** (ícone amarelo): disparado quando o pedido fica mais de **60 minutos fixos** sem movimentação (mesma definição de "Parado" da tabela — ver [Tabela-Colunas-Comportamento-SLA.md](Tabela-Colunas-Comportamento-SLA.md) §3.2). Texto: "Pedido para [retirada/entrega] de [cliente] com 1 hora sem movimentação." + ação "Ver pedido". **Persistente.**
- **Agrupador** (ícone amarelo): "Existem +N pedidos atrasados e/ou parados" + ação "Ver pedidos".

### 2.2 Persistência

O toast de pedido parado fica fixo até o usuário fechar manualmente pelo "x" e reaparece ao reabrir a aba/tela enquanto o pedido continuar parado. O toast de pedido atrasado é temporário (some sozinho após 7 segundos) e aparece uma única vez por pedido.

### 2.3 Agrupamento

Os 3 primeiros toasts são individuais. Quando há 4 ou mais, aparecem as **2 mais antigas** individualmente e 1 toast agrupador com as demais ("Existem +N …"). Um único restante é exibido como toast individual. Exemplos: 3 pedidos parados → 3 toasts individuais; 5 pedidos parados → 2 individuais + "Existem +3 pedidos parados… Ver pedidos".

### 2.4 Navegação

"Ver pedido" abre o detalhe do pedido; "Ver pedidos" (agrupador) abre a tela de Pedidos com os filtros de Parado e Atrasado ativados.

### 2.5 Reincidência

A cada hora adicional parada (1h, 2h, 3h...).

### 2.6 Escopo de visibilidade — global, literal

Visível em **qualquer tela do Portal**, não só na tela de Pedidos — inclusive dentro do módulo de Configuração (Estoque/Configurações de uma loja específica, que opera em contexto único). O toast não depende do contexto selecionado na tela atual, só do fato de existir um pedido atrasado ou parado dentro do que o usuário tem acesso a ver.

## 3. Nível de integração / fonte de dados

- Mecanismo de entrega: tempo real (websocket/push), não polling de endpoint — decisão de arquitetura da daily de 2026-09-24, pra evitar uma "gambiarra" de polling e já preparar o caminho pra uma central de notificações futura.
- Gatilho de "sem movimentação" usa a mesma lógica de timestamp de status do pedido — ver [[feedback_status_change_query_rules]] (campo `<status>.triggeredAt`, nunca `updatedAt` puro, guard `previusStatus != status`). Gatilho de "atrasado" usa o prazo-limite da coluna Prazo (`EstimateTimeFinish`, ver ECP-1550).
- **Não confirmado:** arquitetura exata do canal de tempo real (protocolo, serviço) — aprovada só como direção, implementação ainda não detalhada.
- O texto do toast de pedido parado é composto só pelo tipo de pedido (entrega/retirada), o nome do cliente e o tempo sem movimentação; não há aviso automático à loja.
- WhatsApp automático e central de notificações seguem fora de escopo — não implementar mesmo que pareça simples de adicionar depois.

## 4. Cenários de borda

| Cenário | Regra |
|---|---|
| 3 pedidos parados ao mesmo tempo | 3 toasts individuais |
| 5 pedidos parados ao mesmo tempo | 2 toasts individuais (os mais antigos) + "Existem +3 pedidos parados" |
| Pedido parado recebe movimentação | Toast correspondente some |
| Pedido atrasado | Toast temporário (some sozinho após 7 segundos), uma única vez por pedido |
| Usuário navegando entre telas do Portal com toast ativo | Toast visível em qualquer tela, incluindo módulo de Configuração |
| Pedido resolvido com o toast ainda aberto em outra aba | A definir |

## 5. Pendências / perguntas em aberto

- [ ] Arquitetura exata do canal de tempo real (protocolo/serviço) — só aprovada a direção, não a implementação.
- [ ] Comportamento exato quando o pedido resolve com toast aberto em múltiplas abas simultaneamente.

## Changelog

- **2026-10-05** — Duração do toast temporário de pedido atrasado definida: 7 segundos; pendência removida.
- **2026-10-05** — Decisão do PO: o toast de pedido parado não traz a frase "Loja avisada via Whatsapp" (não há aviso automático por WhatsApp); pendência removida.
- **2026-10-05** — Modelo de notificação fechado pela UX (toasts): adicionado o toast "Pedido Atrasado" (temporário, um por pedido), "Pedido parado" persistente, agrupamento (3 individuais; a partir de 4, as 2 mais antigas + agrupador) e navegação "Ver pedido"/"Ver pedidos". O aviso de mudança em estudo (FAB) deixa de existir.
- **2026-10-01** — Adiciona aviso de mudança em estudo: um FAB vai substituir o modelo de toast/banner (Matheus, ao revalidar o protótipo).
- **2026-09-30** — Criação do documento (v1), a partir de ECP-1518, ECP-1450, PRD seção 6.7.

# Sidebar e Módulos de Navegação

**Módulo:** Shell (comum a Operação e Configuração)
**Histórias:** [ECP-1495](https://farmarcas.atlassian.net/browse/ECP-1495) — Sidebar e Módulos de Navegação
**Referência UX:** [ECP-1451](https://farmarcas.atlassian.net/browse/ECP-1451) (Demanda UX — Nova Sidebar e módulos de navegação)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seções 5, 5.3, 5.6
**Status:** Em desenvolvimento
**Última atualização:** 2026-10-13

---

## 1. O que é

A sidebar é o menu de navegação principal do Portal, dividido em 2 módulos com necessidades de contexto opostas: **Operação** (multi-loja, ver [Filtro.Multicontexto.md](../Modulo.Operacao/Filtros%20Multicontexto/Filtro.Multicontexto.md)) e **Configuração** (loja única, via Gestão de Lojas). Os itens exibidos variam por perfil de acesso. O ECP-1495 trata só da **exibição e ocultação** do menu conforme o perfil (inclusive o menu de Configuração); a regra do badge "Novos" fica para a construção da tela de Pedidos.

## 2. Itens de menu (Figma)

| Posição | Itens |
|---|---|
| Topo | Indicadores; Pedidos (tag azul "Novos", sem badge de contagem); Promoções |
| Seção "GESTÃO DE LOJAS" | "Configuração & Estoque" (item único, leva à Gestão de Lojas); "Usuários" |
| Seção "ÁREA ADMIN" | "Produtos" (só Admin); "Listas CRM" (só Admin, ver [Listas-CRM.md](../Area.Admin/Listas-CRM.md)) |

- **Padrão recolhido** (56 px, só ícones, com o ícone da marca no topo e divisores entre os blocos; o ícone de Pedidos mostra um ponto vermelho quando há pedidos novos ainda não visualizados, sem badge de contagem e somente com a sidebar fechada; o ponto some quando a sidebar abre) com **overlay de menu aberto** (240 px sobre o conteúdo, sem empurrá-lo, com a logo "radar e-commerce" e os rótulos) que abre ao passar o mouse e volta a recolher quando o mouse sai.
- O item da tela atual aparece destacado.
- Estoque e Configurações do módulo de Configuração são acessados via "Configuração & Estoque" → Gestão de Lojas, nunca direto.

## 3. Regras de negócio

### 3.1 Visibilidade por perfil

| Item | Admin | Gestor de Rede | Gestor de Loja | Balconista (Contato cliente) |
|---|---|---|---|---|
| Indicadores | Sim | Sim | Sim | **Não** |
| Pedidos | Sim | Sim | Sim | Sim |
| Promoções | Sim | Sim | Sim | Sim (escopo reduzido, ver doc de Promoções) |
| Usuários | Sim | Sim | Sim | Não |
| Produtos | Sim | **Não** | **Não** | Não |
| Listas CRM | Sim | **Não** | **Não** | Não |
| Configuração & Estoque (via Gestão de Lojas) | Sim | Sim | Sim | **Não** (perdeu em relação a hoje) |

O item Pedidos aparece para os perfis que acessam Pedidos, inclusive para o usuário com lojas de Vendas e de Ofertas (o tratamento das lojas de Ofertas na tela de Pedidos é critério da criação da tela de Pedidos); o usuário cujas lojas do vínculo são todas de Ofertas **não vê** o item Pedidos. O Balconista não vê Indicadores: ao logar, a tela inicial é Pedidos (se a loja for de Ofertas, não vê Pedidos e a tela inicial é Promoções). A informação "vínculo só com lojas de Ofertas" é derivada do `module` de cada loja do vínculo (a engenharia decide onde calcular).

### 3.2 Esconder item de menu não é suficiente sozinho

Cada rota sensível (Indicadores, Produtos) precisa ser bloqueada também no nível de rota — acesso direto por URL é barrado, não só a ausência do item na sidebar. Quando o usuário abre por URL uma rota a que não tem acesso, ele é **redirecionado para a primeira tela a que tem acesso** (ex.: Balconista → Pedidos). Esta é uma regra de guard reaproveitável, não uma verificação feita tela a tela.

### 3.3 Transição para o módulo de Configuração

Alternar para o módulo de Configuração sempre passa pela Gestão de Lojas antes de acessar Estoque ou Configurações — nunca entra direto numa loja específica sem escolher qual. O módulo de Configuração está em standby (Operação é construído primeiro); o header da Gestão de Lojas é dele (ver [Gestao-de-Lojas.md](../Modulo.Configuracao/Gestao-de-Lojas.md)).

### 3.4 Badge "Novos" no item Pedidos

A sidebar exibe a tag azul "Novos" no item Pedidos (visível com a sidebar aberta, sem badge de contagem), somente quando há pedidos ainda não visualizados; o ponto vermelho do ícone recolhido (sidebar fechada) indica pedidos novos ainda não visualizados. A regra do que gera cada indicativo é definida na construção da tela de Pedidos (ver [Tabela-Colunas-Comportamento-SLA.md](../Modulo.Operacao/Pedidos/Tabela-Colunas-Comportamento-SLA.md), "Chegada de pedidos novos"), não no ECP-1495.

## 4. Nível de integração / fonte de dados

- Perfis mapeados no JWT/código: `admin`, `network_manager`, `pharmacy_owner`, `order_manager` — mesma fonte do [Filtro.Multicontexto.md](../Modulo.Operacao/Filtros%20Multicontexto/Filtro.Multicontexto.md), seção 5. Não duplicar aqui a definição completa, só referenciar.
- Mecanismo de guard de rota: mesma pendência já registrada em [Filtro.Multicontexto.md](../Modulo.Operacao/Filtros%20Multicontexto/Filtro.Multicontexto.md) — o `SessionPermissionGuard` de granularidade fina existe no código mas está desabilitado, status não confirmado.

## 5. Cenários de borda

| Cenário | Regra |
|---|---|
| Balconista tenta acessar Indicadores por URL direta | Bloqueado e redirecionado para a primeira tela a que tem acesso (Pedidos) — não só escondido do menu |
| Balconista de loja de Ofertas | Não vê Pedidos; tela inicial é Promoções |
| Gestor (Loja ou Rede) tenta acessar Produtos por URL direta | Bloqueado e redirecionado para a primeira tela a que tem acesso — regra já vigente hoje, mantida |
| Usuário sem acesso a um item de menu | Item não aparece na sidebar |
| Usuário só com lojas de Ofertas | Não vê o item Pedidos |
| Sidebar recolhida | Overlay de 240 px abre ao passar o mouse e recolhe quando o mouse sai |

## 6. Pendências / perguntas em aberto

- [ ] Confirmar mecanismo técnico do guard de rota (framework de roteamento do novo front React) — ainda não definido.
- [ ] "Usuários" aparece sob "GESTÃO DE LOJAS" no Figma, mas usa o seletor multicontexto de Operação (PRD 5.2): confirmar se o agrupamento visual muda o módulo/contexto da tela.
- [ ] Regra do indicativo "Novos" e do ponto vermelho (pedidos novos ainda não visualizados, com a sidebar fechada): será definida no card que trata da distinção de novos pedidos (a criar), não no ECP-1495.

## Changelog

- **2026-11-05** — Incluído o item "Listas CRM" na seção "ÁREA ADMIN" (só Admin), com a visibilidade por perfil e o bloqueio por rota.
- **2026-10-13 (2)** — Respostas do PO: o ponto vermelho do ícone de Pedidos acende quando há pedidos novos ainda não visualizados, com a sidebar fechada (antes: pedido parado); a tag "Novos" aparece somente para pedidos ainda não visualizados (a regra entra no card de distinção de novos pedidos); a tag "Em breve" não entra neste card (Promoções e Usuários ainda serão prototipados); Balconista só de loja de Ofertas vai direto para Promoções.
- **2026-10-13** — Alinhado ao ECP-1495 atual e ao protótipo: sidebar recolhida de 56 px e overlay de 240 px (antes 64 px e 288 px) que recolhe quando o mouse sai; tag "Novos" sem badge de contagem; ponto vermelho no ícone de Pedidos quando há pedido parado; item Pedidos oculto para quem só tem lojas de Ofertas (visível para quem tem lojas de Vendas e de Ofertas); Balconista entra em Pedidos (Balconista de loja de Ofertas não vê Pedidos e entra em Promoções); item da tela atual destacado; back-end informa perfil e módulo de cada loja do vínculo.
- **2026-10-06** — Handoff Figma e respostas do PO: itens e agrupamentos conforme o Figma ("GESTÃO DE LOJAS" com "Configuração & Estoque" e "Usuários"; "ÁREA ADMIN" com "Produtos"; badge "Novos" + contador em Pedidos); padrão colapsado com overlay só por hover; item Pedidos oculto para quem só tem lojas de Ofertas; acesso indevido por URL redireciona para a primeira tela acessível; a regra do badge fica para a tela de Pedidos.
- **2026-09-30** — Criação do documento (v1), a partir de ECP-1495/ECP-1451 e da PRD seção 5.

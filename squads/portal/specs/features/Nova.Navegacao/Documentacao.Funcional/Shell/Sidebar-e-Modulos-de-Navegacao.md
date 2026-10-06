# Sidebar e Módulos de Navegação

**Módulo:** Shell (comum a Operação e Configuração)
**Histórias:** [ECP-1495](https://farmarcas.atlassian.net/browse/ECP-1495) — Sidebar e Módulos de Navegação
**Referência UX:** [ECP-1451](https://farmarcas.atlassian.net/browse/ECP-1451) (Demanda UX — Nova Sidebar e módulos de navegação)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seções 5, 5.3, 5.6
**Status:** Em desenvolvimento
**Última atualização:** 2026-10-06

---

## 1. O que é

A sidebar é o menu de navegação principal do Portal, dividido em 2 módulos com necessidades de contexto opostas: **Operação** (multi-loja, ver [Filtro.Multicontexto.md](../Modulo.Operacao/Filtros%20Multicontexto/Filtro.Multicontexto.md)) e **Configuração** (loja única, via Gestão de Lojas). Os itens exibidos variam por perfil de acesso. O ECP-1495 trata só da **exibição e ocultação** do menu conforme o perfil (inclusive o menu de Configuração); a regra do badge "Novos" fica para a construção da tela de Pedidos.

## 2. Itens de menu (Figma)

| Posição | Itens |
|---|---|
| Topo | Indicadores; Pedidos (tag "Novos" + badge vermelho com a contagem); Promoções |
| Seção "GESTÃO DE LOJAS" | "Configuração & Estoque" (item único, leva à Gestão de Lojas); "Usuários" |
| Seção "ÁREA ADMIN" | "Produtos" (só Admin) |

- **Padrão colapsado** (64 px, só ícones; o item Pedidos mostra um ponto vermelho quando há novos) com **overlay de menu aberto** (288 px, logo e rótulos) que abre **somente ao passar o mouse** (hover) — sem acionamento por toque nem por teclado.
- Estoque e Configurações do módulo de Configuração são acessados via "Configuração & Estoque" → Gestão de Lojas, nunca direto.

## 3. Regras de negócio

### 3.1 Visibilidade por perfil

| Item | Admin | Gestor de Rede | Gestor de Loja | Balconista (Contato cliente) |
|---|---|---|---|---|
| Indicadores | Sim | Sim | Sim | **Não** |
| Pedidos | Sim* | Sim* | Sim* | Sim |
| Promoções | Sim | Sim | Sim | Sim (escopo reduzido, ver doc de Promoções) |
| Usuários | Sim | Sim | Sim | Não |
| Produtos | Sim | **Não** | **Não** | Não |
| Configuração & Estoque (via Gestão de Lojas) | Sim | Sim | Sim | **Não** (perdeu em relação a hoje) |

\* O item Pedidos **não aparece para o usuário que só tem lojas de Ofertas** (só lojas de Vendas geram Pedidos); quem tem lojas de Vendas e de Ofertas vê Pedidos.

### 3.2 Esconder item de menu não é suficiente sozinho

Cada rota sensível (Indicadores, Produtos) precisa ser bloqueada também no nível de rota — acesso direto por URL é barrado, não só a ausência do item na sidebar. Quando o usuário abre por URL uma rota a que não tem acesso, ele é **redirecionado para a primeira tela a que tem acesso** (ex.: Balconista → Pedidos). Esta é uma regra de guard reaproveitável, não uma verificação feita tela a tela.

### 3.3 Transição para o módulo de Configuração

Alternar para o módulo de Configuração sempre passa pela Gestão de Lojas antes de acessar Estoque ou Configurações — nunca entra direto numa loja específica sem escolher qual. O módulo de Configuração está em standby (Operação é construído primeiro); o header da Gestão de Lojas é dele (ver [Gestao-de-Lojas.md](../Modulo.Configuracao/Gestao-de-Lojas.md)).

### 3.4 Badge "Novos" no item Pedidos

A sidebar exibe a tag "Novos" + contador vermelho no item Pedidos, que substitui o container "Novos pedidos aguardando" da Home. A **regra do contador** (o que conta, quando zera) é definida na construção da tela de Pedidos (ver [Tabela-Colunas-Comportamento-SLA.md](../Modulo.Operacao/Pedidos/Tabela-Colunas-Comportamento-SLA.md), "Chegada de pedidos novos"), não no ECP-1495.

## 4. Nível de integração / fonte de dados

- Perfis mapeados no JWT/código: `admin`, `network_manager`, `pharmacy_owner`, `order_manager` — mesma fonte do [Filtro.Multicontexto.md](../Modulo.Operacao/Filtros%20Multicontexto/Filtro.Multicontexto.md), seção 5. Não duplicar aqui a definição completa, só referenciar.
- Mecanismo de guard de rota: mesma pendência já registrada em [Filtro.Multicontexto.md](../Modulo.Operacao/Filtros%20Multicontexto/Filtro.Multicontexto.md) — o `SessionPermissionGuard` de granularidade fina existe no código mas está desabilitado, status não confirmado.

## 5. Cenários de borda

| Cenário | Regra |
|---|---|
| Balconista tenta acessar Indicadores por URL direta | Bloqueado e redirecionado para a primeira tela a que tem acesso (Pedidos) — não só escondido do menu |
| Gestor (Loja ou Rede) tenta acessar Produtos por URL direta | Bloqueado e redirecionado para a primeira tela a que tem acesso — regra já vigente hoje, mantida |
| Usuário sem acesso a um item de menu | Item não aparece na sidebar |
| Usuário só com lojas de Ofertas | Item Pedidos não aparece; se abrir a rota por URL, vai para a primeira tela a que tem acesso |
| Sidebar colapsada | Overlay abre só com hover; sem toque nem teclado |

## 6. Pendências / perguntas em aberto

- [ ] Confirmar mecanismo técnico do guard de rota (framework de roteamento do novo front React) — ainda não definido.
- [ ] "Usuários" aparece sob "GESTÃO DE LOJAS" no Figma, mas usa o seletor multicontexto de Operação (PRD 5.2): confirmar se o agrupamento visual muda o módulo/contexto da tela.
- [ ] Regra do contador do badge "Novos" (o que conta, quando zera): a construir com a tela de Pedidos.

## Changelog

- **2026-10-06** — Handoff Figma e respostas do PO: itens e agrupamentos conforme o Figma ("GESTÃO DE LOJAS" com "Configuração & Estoque" e "Usuários"; "ÁREA ADMIN" com "Produtos"; badge "Novos" + contador em Pedidos); padrão colapsado com overlay só por hover; item Pedidos oculto para quem só tem lojas de Ofertas; acesso indevido por URL redireciona para a primeira tela acessível; a regra do badge fica para a tela de Pedidos.
- **2026-09-30** — Criação do documento (v1), a partir de ECP-1495/ECP-1451 e da PRD seção 5.

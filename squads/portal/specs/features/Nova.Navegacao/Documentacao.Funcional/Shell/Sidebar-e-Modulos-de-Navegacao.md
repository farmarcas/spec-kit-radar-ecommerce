# Sidebar e Módulos de Navegação

**Módulo:** Shell (comum a Operação e Configuração)
**Histórias:** [ECP-1495](https://farmarcas.atlassian.net/browse/ECP-1495) — Sidebar e Módulos de Navegação
**Referência UX:** [ECP-1451](https://farmarcas.atlassian.net/browse/ECP-1451) (Demanda UX — Nova Sidebar e módulos de navegação)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seção 5
**Status:** Em desenvolvimento
**Última atualização:** 2026-09-30

---

## 1. O que é

A sidebar é o menu de navegação principal do Portal, dividido em 2 módulos com necessidades de contexto opostas: **Operação** (multi-loja, ver [Filtro.Multicontexto.md](../Modulo.Operacao/Filtros%20Multicontexto/Filtro.Multicontexto.md)) e **Configuração** (loja única, via Gestão de Lojas). Os itens exibidos variam por perfil de acesso.

## 2. Itens de menu por módulo

| Módulo | Itens |
|---|---|
| Operação | Indicadores, Pedidos, Promoções, Usuários, Produtos/Catálogo (Admin only) |
| Configuração | Estoque, Configurações — acessados via Gestão de Lojas, nunca direto |

## 3. Regras de negócio

### 3.1 Visibilidade por perfil

| Item | Admin | Gestor de Rede | Gestor de Loja | Balconista (Contato cliente) |
|---|---|---|---|---|
| Indicadores | Sim | Sim | Sim | **Não** |
| Pedidos | Sim | Sim | Sim | Sim |
| Promoções | Sim | Sim | Sim | Sim (escopo reduzido, ver doc de Promoções) |
| Usuários | Sim | Sim | Sim | Não |
| Produtos/Catálogo | Sim | **Não** | **Não** | Não |
| Estoque/Configurações (via Gestão de Lojas) | Sim | Sim | Sim | **Não** (perdeu em relação a hoje) |

### 3.2 Esconder item de menu não é suficiente sozinho

Cada rota sensível (Indicadores, Produtos/Catálogo) precisa ser bloqueada também no nível de rota — acesso direto por URL é barrado, não só a ausência do item na sidebar. Esta é uma regra de guard reaproveitável, não uma verificação feita tela a tela.

### 3.3 Transição para o módulo de Configuração

Alternar para o módulo de Configuração sempre passa pela Gestão de Lojas antes de acessar Estoque ou Configurações — nunca entra direto numa loja específica sem escolher qual.

## 4. Nível de integração / fonte de dados

- Perfis mapeados no JWT/código: `admin`, `network_manager`, `pharmacy_owner`, `order_manager` — mesma fonte do [Filtro.Multicontexto.md](../Modulo.Operacao/Filtros%20Multicontexto/Filtro.Multicontexto.md), seção 5. Não duplicar aqui a definição completa, só referenciar.
- Mecanismo de guard de rota: mesma pendência já registrada em [Filtro.Multicontexto.md](../Modulo.Operacao/Filtros%20Multicontexto/Filtro.Multicontexto.md) — o `SessionPermissionGuard` de granularidade fina existe no código mas está desabilitado, status não confirmado.

## 5. Cenários de borda

| Cenário | Regra |
|---|---|
| Balconista tenta acessar Indicadores por URL direta | Bloqueado — não só escondido do menu |
| Gestor (Loja ou Rede) tenta acessar Produtos/Catálogo por URL direta | Bloqueado — regra já vigente hoje, mantida |
| Usuário sem acesso a um item de menu | Item não aparece na sidebar |

## 6. Pendências / perguntas em aberto

- [ ] Confirmar mecanismo técnico do guard de rota (framework de roteamento do novo front React) — ainda não definido.

## Changelog

- **2026-09-30** — Criação do documento (v1), a partir de ECP-1495/ECP-1451 e da PRD seção 5.

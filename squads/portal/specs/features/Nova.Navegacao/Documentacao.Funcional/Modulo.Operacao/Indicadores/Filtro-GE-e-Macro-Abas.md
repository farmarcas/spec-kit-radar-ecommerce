# Indicadores — Filtro de GE e Macro-abas Vendas/Ofertas

**Módulo:** Operação
**Histórias:** [ECP-1512](https://farmarcas.atlassian.net/browse/ECP-1512) — Indicadores: Filtro de GE e Macro-abas Vendas/Ofertas
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seção 5.1
**Relacionado:** [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md) (seletor de Rede/Grupo/Loja do header — este documento cobre só o que é específico de Indicadores)
**Status:** Em desenvolvimento
**Última atualização:** 2026-09-30

---

## 1. O que é

Indicadores (Home) segue fora do escopo de redesenho detalhado deste ciclo — mantém os mesmos recursos de hoje. Só 2 ajustes pontuais foram fechados: a localização do filtro de GE (Grupo Econômico) e a troca das sub-abas simples "Vendas"/"Ofertas" por macro-abas com contador de lojas. Os dois reagem ao contexto selecionado no header global (Rede/Grupo/Loja).

## 2. Estrutura

- Header da própria tela de Indicadores (não o header global): filtro de GE ("Todos os GEs ▾"), seletor de período, botão Exportar.
- Macro-abas com contador: **"Lojas de Vendas (N)"** / **"Loja de Ofertas (N)"**.

## 3. Regras de negócio

### 3.1 Filtro de GE — Admin only

Visível e utilizável só pelo perfil Admin. Vive dentro do header da tela de Indicadores, não no header global do módulo — distinto do seletor de contexto (Rede/Grupo/Loja) documentado em [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md).

### 3.2 Macro-abas refletem o contexto do header global

O contador de cada macro-aba muda conforme o contexto de Rede/Grupo/Loja selecionado no header global. Cada aba reflete só as lojas do módulo correspondente (Vendas ou Ofertas) dentro desse contexto.

### 3.3 Balconista sem acesso, em nenhuma hipótese

Nem pelo menu, nem por URL direta — regra definida no Sidebar (ver [Sidebar-e-Modulos-de-Navegacao.md](../../Shell/Sidebar-e-Modulos-de-Navegacao.md)).

### 3.4 Ordenação da lista de GEs

A lista de GEs retornada no filtro deve vir ordenada alfabeticamente (débito técnico identificado depois da entrega inicial — ver seção 4).

### 3.5 "Restaurar padrão"

Ao lado dos filtros (GE / Rede / Loja), um link "Restaurar padrão" só deve aparecer quando pelo menos um dos filtros estiver com seleção diferente do padrão ("Todos"/"Todas"). Assim que todos voltam a "exibir tudo" — seja clicando no próprio link ou marcando manualmente "Selecionar todos" em cada dropdown — o link deve sumir. **Bug conhecido (ECP-1468):** marcar "Selecionar todos" manualmente reverte o estado mas não esconde o link — só o clique direto em "Restaurar padrão" esconde corretamente hoje.

## 4. Nível de integração / fonte de dados

Fonte: débito técnico [ECP-1468](https://farmarcas.atlassian.net/browse/ECP-1468), identificado na versão de produção atual do filtro de Indicadores — **a reconfirmar quando este seletor for reconstruído no novo header/React**:

- `GET /backoffice/sales-and-marketing/v2/dashboard/indicators/filters` — retorna `groups` (lista de GEs, deve vir ordenada alfabeticamente), `networks`, e as flags `viewEconomicGroup`/`viewNetwork`/`viewStore`.
- Lista de lojas usada pelo filtro Rede/Loja (compartilhada com o header global) vem do endpoint paginado documentado em [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md) §5 (`POST .../v1/dashboard/indicators/advanced-filters/stores-filter`).
- GE (Grupo Econômico) em si: tabela Postgres `pharmacy_economic_group` (`CNPJ`, `Group`, `id`) — ver [[project_grupo_economico_source_table]].

## 5. Cenários de borda

| Cenário | Regra |
|---|---|
| Perfil não-Admin acessa Indicadores | Filtro de GE não aparece |
| Contexto do header global muda | Contadores das macro-abas Vendas/Ofertas recalculam |
| Usuário marca "Selecionar todos" manualmente após ter um filtro aplicado | Estado reverte ao padrão, mas o link "Restaurar padrão" continua visível (bug conhecido, ECP-1468) |

## 6. Pendências / perguntas em aberto

- [ ] Confirmar se os endpoints do ECP-1468 (hoje na tela de Indicadores em produção) serão os mesmos reaproveitados no novo header/React, ou se haverá uma reimplementação.
- [ ] Modelo de SLA da Home de Indicadores (percentual vs. minutos absolutos) — decisão separada, ainda não tomada (PRD seção 9).
- [ ] Corrigir o bug do "Restaurar padrão" (ECP-1468, item 3) antes ou depois da migração pro novo header — a definir.

## Changelog

- **2026-09-30** — Criação do documento (v1), a partir de ECP-1512, PRD seção 5.1, e débito técnico ECP-1468.

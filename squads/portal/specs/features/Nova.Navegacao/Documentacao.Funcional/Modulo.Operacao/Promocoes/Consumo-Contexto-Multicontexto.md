# Promoções — Consumo do Contexto Multicontexto

**Módulo:** Operação
**Histórias:** [ECP-1513](https://farmarcas.atlassian.net/browse/ECP-1513) — Promoções: Consumo do Contexto Multicontexto no Módulo de Operação
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seções 1, 3 (escopo), 5.2, 5.3
**Relacionado:** [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md)
**Status:** Em desenvolvimento
**Última atualização:** 2026-09-30

---

## 1. O que é

Promoções muda de lugar (entra na nova sidebar/módulo de Operação) e passa a consumir o seletor de contexto multicontexto do header global, mantendo os recursos atuais (filtros, ordenação, criação — Manual do Portal seção 9). **Este documento cobre só a parte já fechada.** A visão agregada por Rede para o Admin é uma pergunta de design ainda em aberto (ver [ECP-1456](https://farmarcas.atlassian.net/browse/ECP-1456)) e não entra aqui — os protótipos ainda não estão maduros o suficiente pra detalhar esse ponto (PRD seção 3).

## 2. Regras de negócio

### 2.1 Propagação do contexto

Consome o contexto de Rede/Grupo/Loja selecionado no header global, com propagação automática ao trocar de contexto em qualquer tela do módulo de Operação (ver [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md) §4.7).

### 2.2 Manutenção de 100% dos recursos existentes

Filtros, ordenação, criação de promoção, destaque de oferta, cancelamento — nenhum recurso atual é removido, só relocado pra dentro da nova sidebar.

### 2.3 Escopo por perfil

- **Balconista (Contato cliente):** escopado só à própria loja (não usa o seletor multicontexto na prática, por estar vinculado a 1 loja só) — sem ações destrutivas: sem "Nova promoção", cancelar ou destacar oferta (regra já vigente hoje, Manual seção 9).
- **Gestor:** vê as promoções conforme o contexto de Rede/Grupo/Loja selecionado, igual às demais telas do módulo de Operação.
- **Admin:** por ora continua operando com contexto de Rede/Loja selecionado — visão agregada multi-Rede fica de fora (ver §1).

## 3. Nível de integração / fonte de dados

**Não levantado ainda** — este é o principal gap deste documento. Nenhuma query/endpoint de Promoções foi confirmada nesta sessão; não inventar. Ver pendências.

## 4. Cenários de borda

| Cenário | Regra |
|---|---|
| Balconista acessa Promoções | Vê só as promoções da própria loja, sem "Nova promoção"/cancelar/destacar |
| Troca de contexto no header global | Listagem de Promoções reflete o novo contexto |
| Admin quer ver promoções agregadas de várias Redes ao mesmo tempo | Não suportado neste ciclo — ver ECP-1456 |

## 5. Pendências / perguntas em aberto

- [ ] Endpoint/query que resolve a listagem de Promoções por contexto (Rede/Grupo/Loja) — não levantado ainda.
- [ ] Design da visão agregada por Rede pro Admin (ECP-1456) — pergunta de design em aberto, não fechada pela UX ainda; quando fechar, provavelmente vira um segundo documento ou uma extensão deste.

## Changelog

- **2026-09-30** — Criação do documento (v1), a partir de ECP-1513 e PRD seções 1, 3, 5.2, 5.3.

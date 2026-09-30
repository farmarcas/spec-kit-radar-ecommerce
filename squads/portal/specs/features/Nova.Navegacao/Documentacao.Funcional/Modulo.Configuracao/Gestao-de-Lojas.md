# Gestão de Lojas (Hub de Lojas)

**Módulo:** Configuração
**Histórias:** [ECP-1496](https://farmarcas.atlassian.net/browse/ECP-1496) — Gestão de Lojas (Hub de Lojas)
**Referência UX:** [ECP-1453](https://farmarcas.atlassian.net/browse/ECP-1453) (Demanda UX — Hub de Lojas)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seções 5, 5.3, 5.4
**Status:** Em desenvolvimento
**Última atualização:** 2026-09-30

---

## 1. O que é

O módulo de Configuração opera em contexto single-store — não faz sentido configurar Estoque de duas lojas ao mesmo tempo. Gestão de Lojas é o ponto de entrada obrigatório desse módulo: o usuário escolhe explicitamente qual loja quer configurar antes de entrar em Estoque/Configurações. Também concentra a gestão de Banners ("Anúncios do App"), hoje um destino de menu separado. Chamada de "Hub de Lojas" na PRD original, o nome real na interface é **"Gestão de Lojas"**.

## 2. Estrutura da tela

2 abas:
- **Lojas da rede** — listagem de lojas (Grupo, Telefone, Estado, Cidade, ERP conectado até, Módulo ativado), botão "Nova Loja", filtro por Módulo, atalho pra Grupo de Lojas e Exportar Lojas. Equivale à tela "Lojas" de hoje (Manual seção 3).
- **Anúncios do App** — gestão de Banners, **Admin only**.

## 3. Regras de negócio

### 3.1 Listagem filtrada por perfil

Admin vê todas as lojas da Rede; Gestor vê apenas as lojas às quais está vinculado — mesma regra do seletor de contexto do módulo de Operação (ver [Filtro.Multicontexto.md](../Modulo.Operacao/Filtros%20Multicontexto/Filtro.Multicontexto.md) §4.1).

### 3.2 Anúncios do App — redução deliberada de acesso

A aba só aparece e é acessível para o perfil Admin. Isso é uma **redução em relação a hoje**, onde Gestor de Rede também acessa Banners (Manual seção 2, menu de Rede inclui Banners) — confirmado por Matheus em 2026-09-23. Bloqueio precisa valer por rota (URL direta), não só ocultação da aba.

### 3.3 Seleção de loja → contexto single-store

Selecionar uma loja estabelece o contexto de trabalho single-store daquela loja, isolado do contexto multicontexto do módulo de Operação — entra em Estoque/Configurações já filtrado pra essa loja.

### 3.4 Uma loja pertence a no máximo 1 grupo

Regra pré-existente de Estoque Centralizado — sem cascata cruzada entre grupos (ver [[project_grupo_de_lojas_estoque_centralizado]]).

## 4. Nível de integração / fonte de dados

- Fonte de dado da listagem "Lojas da rede" e dos campos exibidos (Grupo, ERP conectado, Módulo ativado) — **não confirmada ainda**, ver pendências.
- Grupo de lojas: mesma fonte do Estoque Centralizado (Configurações > Lojas > Estoque Centralizado) — sem tabela própria pra este filtro (ver [[project_grupo_de_lojas_estoque_centralizado]]).
- Perfis: mesma fonte de `admin`/`network_manager`/`pharmacy_owner` do [Filtro.Multicontexto.md](../Modulo.Operacao/Filtros%20Multicontexto/Filtro.Multicontexto.md) §5.

## 5. Cenários de borda

| Cenário | Regra |
|---|---|
| Admin acessa Gestão de Lojas | Vê "Lojas da rede" (toda a Rede) + aba "Anúncios do App" |
| Gestor acessa Gestão de Lojas | Vê "Lojas da rede" (só suas lojas) — aba "Anúncios do App" não aparece nem é acessível por URL |
| Seleciona uma loja na listagem | Entra no contexto daquela loja pra Estoque/Configurações |

## 6. Pendências / perguntas em aberto

- [ ] Endpoint/query exata que popula a listagem "Lojas da rede" (campos: Grupo, Telefone, Estado, Cidade, ERP conectado até, Módulo ativado) — ainda não levantado.
- [ ] Comportamento do "Exportar Lojas" no modelo novo — herda o filtro do seletor multicontexto? Confirmar (mesma lógica que já foi decidida pro Relatório de Pedidos, ver PRD v1.5).

## Changelog

- **2026-09-30** — Criação do documento (v1), a partir de ECP-1496/ECP-1453 e da PRD seções 5, 5.3, 5.4.

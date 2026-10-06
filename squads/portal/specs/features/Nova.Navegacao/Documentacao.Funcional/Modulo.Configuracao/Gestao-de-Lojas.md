# Gestão de Lojas (Hub de Lojas)

**Módulo:** Configuração
**Histórias:** [ECP-1496](https://farmarcas.atlassian.net/browse/ECP-1496) — Estrutura da tela e entrada no contexto da loja; [ECP-1572](https://farmarcas.atlassian.net/browse/ECP-1572) — Lojas da Rede (tabela); [ECP-1573](https://farmarcas.atlassian.net/browse/ECP-1573) — Busca e filtro por Módulo; [ECP-1574](https://farmarcas.atlassian.net/browse/ECP-1574) — Exportar lojas
**Referência UX:** [ECP-1453](https://farmarcas.atlassian.net/browse/ECP-1453) (Demanda UX — Hub de Lojas)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seções 5, 5.3, 5.4
**Status:** Em desenvolvimento
**Última atualização:** 2026-10-05

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

- [ ] Handler real da listagem "Lojas da rede" (`GET /customer-management/v1/stores-planinng/networkies/v2/{id}/pharmacies`) e do "Exportar lojas" (`POST .../store-service/stores/export-report/pharmacy-by-network`): não estão em nenhum repositório acessado. A fonte mais próxima da listagem é `GET /pharmacy` do `ecomm-api-pharmacy-dotnet` (busca full-text em nome/CNPJ/cidade/UF, lista de CNPJs com `;`, filtro Módulo, escopo por perfil); o gerador do relatório não foi encontrado.
- [ ] Correções do legado embutidas nos cards: lojas duplicadas e total inflado (`DISTINCT p.*` com `sales_module`), loja com `Status` 2 a 62 fora dos filtros de Módulo, SQL montada por concatenação, escopo por perfil frágil (`stores-filter`, `GetPharmaciesRequest` sem `Role`), guard de rota inefetivo, máscara de telefone de 10 dígitos.
- [ ] Decisões de produto ainda abertas (listadas nos cards): header na lista de Redes antes de abrir uma Rede; ordenação da lista de lojas; "N lojas cadastradas" e ordem da lista de Redes; fallback visual para Rede sem logo; critérios finos da busca por CNPJ.
- Decisões do PO (2026-10-06): módulo de Operação primeiro, módulo de Configuração em standby; header com logo da Rede + "Gestão de Lojas" (Figma); Balconista que acessa a rota por URL vai para Pedidos; coluna "Grupo" sempre exibida; busca ao digitar com debounce de 2 segundos; "Exportar lojas" exporta a Rede inteira no escopo do usuário.
- Fora do recorte atual (aguardam o módulo de Configuração, em standby): ações por loja "Estoque da loja" e "Configurações da loja" (contexto de loja única), Nova loja, Anúncios do App/Banners, "Buscar rede" e "Exportar redes", atalho "Grupo de lojas".

## Changelog

- **2026-10-06** — Decisões do PO aplicadas: ECP-1496 passa a se chamar "Estrutura da tela e lista de Redes" e deixa de incluir a seleção de loja para Estoque/Configurações (standby); header logo + "Gestão de Lojas"; Balconista redirecionado para Pedidos; coluna Grupo sempre; busca com debounce de 2 s; exportar a Rede inteira.
- **2026-10-05** — Gestão de Lojas fatiada em 4 Histórias (ECP-1496 reescrita; ECP-1572, ECP-1573, ECP-1574 criadas) e subtarefas ECP-1499 a 1501 substituídas; registradas as correções do legado e as pendências de produto. Nova loja, Estoque, Configurações e Anúncios do App ficam fora até o módulo de Configuração entrar.
- **2026-09-30** — Criação do documento (v1), a partir de ECP-1496/ECP-1453 e da PRD seções 5, 5.3, 5.4.

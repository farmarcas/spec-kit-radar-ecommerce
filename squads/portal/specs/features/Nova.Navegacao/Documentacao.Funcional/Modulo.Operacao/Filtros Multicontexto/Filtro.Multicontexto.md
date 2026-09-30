# Filtro Multicontexto (Seletor de Contexto de Trabalho)

**Módulo:** Operação
**Histórias:** [ECP-1494](https://farmarcas.atlassian.net/browse/ECP-1494) — Header Global do Portal
**Componente reaproveitado de:** [ECP-1281](https://farmarcas.atlassian.net/browse/ECP-1281) (filtro dependente Rede→Loja), [ECP-1291](https://farmarcas.atlassian.net/browse/ECP-1291) (cascata de Grupo de lojas)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seções 5, 5.1, 5.2, 5.3
**Status:** Em desenvolvimento
**Última atualização:** 2026-09-30

---

## 1. O que é

O Filtro Multicontexto é o seletor de contexto de trabalho (Rede / Grupo de lojas / Loja) que aparece no header global do módulo de Operação. Ele não é um componente novo — reaproveita integralmente o filtro de Rede/Loja já construído para a Home de Indicadores (ECP-1281) e a cascata de Grupo de lojas (ECP-1291), só que relocado do header da Home pro header global e com o efeito ampliado: hoje o filtro só afeta a Home; no modelo novo, ele afeta simultaneamente todas as telas do módulo de Operação (Home, Pedidos, Promoções, Usuários) na mesma sessão de navegação.

## 2. Onde vive / quem usa

| Funcionalidade | Usa este seletor? |
|---|---|
| Indicadores (Home) | Sim |
| Pedidos | Sim (qualificado "de Vendas" — só lojas do módulo Vendas geram Pedidos) |
| Promoções | Sim |
| Usuários | Sim |
| Estoque / Configurações | Não — usa seletor de uma loja só, via Gestão de Lojas (ver documento próprio) |
| Banners (Anúncios do App) | Não usa este seletor — tem contexto de Rede próprio, dentro de Gestão de Lojas |
| Produtos (Catálogo) | Não usa nenhum seletor de contexto — catálogo único da plataforma |

## 3. Estrutura do seletor

1. **Rede** — nível superior, lista as Redes às quais o usuário tem vínculo.
2. **Grupo de lojas** — atalho de seleção dentro do nível Loja (não é um nível hierárquico à parte). Vem do Estoque Centralizado, é só um shortcut, não um CRUD.
3. **Loja** — nível mais granular, filtrado pelas Redes marcadas.

## 4. Regras de negócio

### 4.1 Escopo por perfil

| Perfil (negócio) | Role no código | Escopo no seletor |
|---|---|---|
| Admin | `admin` | Todas as Redes/Lojas da plataforma |
| Gestor de Rede | `network_manager` | Só as Redes às quais está vinculado (e lojas dessas Redes) |
| Gestor de Loja | `pharmacy_owner` | Só as Lojas às quais está vinculado |
| Contato cliente (Balconista) | `order_manager` | Vinculado a 1 única loja — na prática o seletor não se aplica (ver 4.2) |

Fonte: [[project_portal_user_roles]].

### 4.2 Filtro de Loja some quando não há o que selecionar

Se o usuário só tem 1 loja vinculada, o filtro de Loja não é exibido — não há nada pra alterar. Para o comportamento do lado Rede (logo única read-only vs. seletor de múltiplas Redes), ver 4.6 — não duplicar a regra aqui, esse era um conflito de uma versão anterior deste doc (ver Changelog).

### 4.3 Filtro dependente Rede → Loja (paginado)

- Default: todas as opções vêm pré-selecionadas (todas as Redes/Lojas às quais o usuário tem vínculo) — e isso é persistido.
- Botão "Limpar filtros" volta ao default (tudo selecionado) e recalcula a tela.
- Lista de Lojas agrupada por Estado (UF), ordenação alfabética (Estado → Razão Social), busca por nome ou CNPJ (ignorando caracteres especiais no CNPJ).
- Lista traz tanto lojas do módulo Vendas quanto do módulo Ofertas — mas se o contexto de Pedidos for filtrado numa loja Ofertas, o resultado é o empty-state já existente (Pedidos só existe pra lojas Vendas).
- **Lista de Lojas é paginada (scroll infinito), não vem inteira de uma vez** — débito técnico identificado depois da entrega inicial (redes grandes, ex. 840+ lojas, não escalavam com lista completa). Marcar uma ou mais Redes já não recalcula um array client-side: reinicia a busca paginada na página 1, filtrada server-side pelas Redes marcadas — isso substitui o recálculo puramente client-side da versão original do filtro. Ver seção 5 para os endpoints envolvidos.

(ECP-1281; paginação: ECP-1468)

### 4.4 Gatilho de atualização — só no "Aplicar"

**O sistema não busca/recarrega dados a cada clique de checkbox dentro do menu.** Marcar/desmarcar Redes, Lojas ou Grupos só atualiza o estado visual local (contadores, lista dependente). A chamada ao backend e a atualização das telas (gráficos, tabelas, listagens) só acontece quando o usuário clica **"Aplicar"** dentro do menu. Fechar o menu clicando fora, sem clicar Aplicar, não aplica a seleção. (ECP-1281)

### 4.5 Cascata de Grupo de lojas

- **Grupo vem do Estoque Centralizado** (Configurações > Lojas > Estoque Centralizado) — este filtro só expõe os grupos já configurados como atalho de seleção; não cria, edita nem exclui grupo aqui.
- **Uma loja pertence no máximo a 1 grupo** — nunca há cascata cruzada entre grupos diferentes.
- **Cascata pra baixo:** marcar o checkbox de um Grupo marca automaticamente todas as lojas daquele grupo; desmarcar desmarca todas.
- **Cascata pra cima:** um grupo totalmente marcado que tem 1+ (mas não todas) lojas desmarcadas manualmente cai pro estado parcial/indeterminado; ao completar de volta todas marcadas, volta a totalmente marcado; ao zerar todas manualmente, cai a totalmente desmarcado (nunca fica parcial nesse caso).
- **"Selecionar todos"** cascateia pros grupos também (marca/desmarca tudo, grupos inclusive).
- **Grupo só aparece na lista se todas as suas lojas ainda estiverem no vínculo do usuário logado.**
- Busca por nome/CNPJ filtra só a lista de lojas à direita, não afeta a lista de grupos.

(ECP-1291)

### 4.6 Identidade de Rede no header

O bloco à esquerda do header varia conforme quantas Redes o usuário tem vinculadas — isso é sobre a **exibição** do header, não sobre a lógica do filtro em si:

- **1 única Rede vinculada:** mostra a logo da Rede, **read-only** (reaproveitando o asset já usado hoje no Portal) — sem seletor de Rede, já que não há o que escolher. Vale mesmo que o usuário tenha 2+ lojas dentro dessa única Rede (o filtro de Loja continua editável nesse caso — ver 4.2/4.3; só o lado Rede fica travado na logo).
- **Múltiplas Redes vinculadas:** mostra o seletor "Todas as Redes ▾" no lugar da logo fixa.
- **Dentro de Gestão de Lojas:** o bloco de contexto (seletor de Loja, e de Rede quando multi-rede) é substituído pelo texto "Gestão de Lojas" — mas a logo de Rede única continua aparecendo quando aplicável (ex.: "Acfarma · Gestão de Lojas"); no caso multi-rede, o seletor de Rede some e só resta o texto.

(PRD v1.9, seção 5.1)

### 4.7 Propagação entre telas (mudança em relação a hoje)

Hoje, o filtro de Rede/Loja só é aplicado na Home de Indicadores. No modelo novo, o contexto selecionado passa a valer para **todas** as telas do módulo de Operação simultaneamente — trocar de contexto em qualquer uma delas (Home, Pedidos, Promoções, Usuários) atualiza as outras também, dentro da mesma sessão de navegação. (PRD seção 5.1)

### 4.8 O que este filtro NÃO cobre

- **Filtro de GE (Grupo Econômico):** não faz parte deste seletor. Vive dentro do header da própria tela de Indicadores, visível só para Admin, ao lado do seletor de período e do botão Exportar. Ver documento próprio de Indicadores.
- **Contexto de Banners:** é de Rede, mas vive dentro de Gestão de Lojas (aba "Anúncios do App"), não neste seletor do header.

## 5. Nível de integração / fonte de dados

- **Perfis de acesso** são mapeados no JWT/código como `admin`, `network_manager`, `pharmacy_owner`, `order_manager` (ver 4.1). O front não deve confiar só em strings de UI — o guard fino (`SessionPermissionGuard`, permissões `offer:*`/`product:*`/`order:*`/`pharmacy:*`) existe no código mas está **desabilitado**, status não confirmado pelo time — não assumir intencional nem bug sem reconfirmar. (ver [[project_portal_user_roles]])
- **Grupo de lojas** não tem tabela própria pra este filtro — a fonte é a mesma configuração de Estoque Centralizado (nome do grupo, lojas vinculadas, tipo de atendimento e de estoque). (ver [[project_grupo_de_lojas_estoque_centralizado]])
- **GE (Grupo Econômico)** — usado no filtro *de Indicadores*, não neste seletor — vem da tabela Postgres `pharmacy_economic_group` (`CNPJ`, `Group` int, `id`), 1 linha por loja, join por `CNPJ`. Nem toda loja tem registro nessa tabela — ausência de linha significa "sem GE", não erro. (ver [[project_grupo_economico_source_table]])
- **Endpoints do filtro (identificados via débito técnico ECP-1468, na versão atual de produção do filtro de Indicadores — a reconfirmar quando ECP-1494 reaproveitar o componente):**
  - `GET /backoffice/sales-and-marketing/v2/dashboard/indicators/filters` — retorna `networks` (Redes do usuário), `groups` (GEs), e as flags `viewEconomicGroup`/`viewNetwork`/`viewStore` (ex.: `viewStore: false` quando o vínculo é de 1 loja só). **Não retorna mais a lista de lojas** (`stores` vem vazio) — isso foi movido pro endpoint paginado abaixo.
  - `POST /backoffice/sales-and-marketing/v1/dashboard/indicators/advanced-filters/stores-filter` — body `{networks, groups, states, search, page, perPage}`, resposta `{stores[], total, page, count, last, regs}`. `page` sempre reinicia em 1 quando a busca ou a seleção de Rede muda; scroll incrementa `page` até `last: true`; `total` alimenta o texto "Todas as Lojas"/"X selecionados".
  - **Aplicar a seleção:** "Selecionar todos" manda `pharmacyIds: []` (vazio = todas as lojas do vínculo/das Redes marcadas); seleção específica manda `pharmacyIds[]` com os ids marcados — esse formato precisa persistir entre telas (ex.: Indicadores → Detalhamento de Ruptura).

## 6. Cenários de borda

| Cenário | Regra |
|---|---|
| Usuário com vínculo a 1 única loja | Filtro de Loja não aparece; header mostra a logo da Rede read-only (ver 4.6), não some junto |
| Usuário com 2+ lojas, todas na mesma Rede | Header mostra a logo da Rede (read-only, ver 4.6); filtro de Loja continua editável com as lojas dessa Rede |
| Rede com 840+ lojas (caso real citado no débito técnico) | Lista de lojas não vem inteira — busca paginada via scroll infinito (ver seção 5) |
| Usuário marca 2 lojas e clica fora do menu sem "Aplicar" | Seleção não é aplicada, nenhuma chamada de dados é feita |
| Usuário marca/desmarca várias lojas em sequência | Nenhuma chamada de dados até clicar "Aplicar" (1 chamada no final, não 1 por clique) |
| Navegação entre telas do módulo de Operação com contexto já selecionado | Contexto persiste e se propaga pras demais telas na mesma sessão |
| Desmarca 1 loja de um grupo totalmente selecionado | Checkbox do grupo cai pro estado parcial, sem afetar outros grupos |
| Filtro de Pedidos aplicado numa loja do módulo Ofertas | Empty state (Pedidos não existe pra lojas Ofertas) |

## 7. Pendências / perguntas em aberto

- [ ] Confirmar que ECP-1494 (header global novo) reaproveita literalmente os endpoints do ECP-1468 (seção 5) e não uma implementação nova — os endpoints hoje existem pro filtro da tela de Indicadores em produção, ainda não confirmados no contexto do header global.
- [ ] Status do `SessionPermissionGuard` (permissões finas `offer:*`/`product:*`/`order:*`/`pharmacy:*`) — confirmar se segue desabilitado por design ou se é pendência técnica.

## Changelog

- **2026-09-30 (correção)** — 4.2 e 4.6 estavam conflitantes: 4.2 dizia que o filtro de Rede "fica fixo mostrando 1 opção" quando o usuário tem Rede única, enquanto 4.6 (mais recente) já documentava que nesse caso não há seletor de Rede nenhum, só a logo read-only. Removida a informação desatualizada de 4.2 (mantido só o critério de Loja, que continua válido) — 4.6 é a fonte única pra esse comportamento. 4.3 atualizada com a paginação de lojas (débito técnico ECP-1468), que substitui o recálculo client-side descrito na v1 deste doc. Seção 5 e cenários de borda atualizados com os endpoints reais — inclusive um segundo conflito da mesma natureza encontrado ao revisar (linha "1 única loja" dizia que a Rede some junto com a Loja, o que contradizia 4.6; corrigido pro mesmo padrão). Títulos de tópicos deixaram de incluir data de definição (fica só no Changelog).
- **2026-09-30** — Criação do documento (v1), a partir da PRD v1.9 (seções 5, 5.1–5.3) + ECP-1281 + ECP-1291 + decisão de identidade de Rede no header (2026-09-28).

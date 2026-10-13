# Filtro Multicontexto (Seletor de Contexto de Trabalho)

**Módulo:** Operação
**Histórias:** [ECP-1568](https://farmarcas.atlassian.net/browse/ECP-1568) — Filtro Multicontexto: seletores de Redes e Lojas (o header que o abriga é a [ECP-1494](https://farmarcas.atlassian.net/browse/ECP-1494), ver [Header-Global.md](../../Shell/Header-Global.md))
**Componente reaproveitado de:** [ECP-1281](https://farmarcas.atlassian.net/browse/ECP-1281) (filtro dependente Rede→Loja, com os textos parciais de "Todas as Redes" e os estados de loading, vazio e falha); [ECP-1291](https://farmarcas.atlassian.net/browse/ECP-1291) (cascata de Grupo de lojas — não desenvolvida agora)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seções 5, 5.1, 5.2, 5.3
**Status:** Em desenvolvimento
**Última atualização:** 2026-10-13

---

## 1. O que é

O Filtro Multicontexto é o seletor de contexto de trabalho que aparece no header global do módulo de Operação, sempre em **dois seletores: Redes e Lojas** ("Todas as Redes ▾" e "Todas as Lojas ▾"). Ele não é um componente novo — reaproveita o filtro de Rede/Loja já construído para a Home de Indicadores (ECP-1281), só que relocado do header da Home pro header global e com o efeito ampliado: hoje o filtro só afeta a Home; no modelo novo, ele afeta simultaneamente todas as telas do módulo de Operação (Home, Pedidos, Promoções, Usuários) na mesma sessão de navegação. Não existe menu único de 3 níveis.

## 2. Onde vive / quem usa

| Funcionalidade | Usa este seletor? |
|---|---|
| Indicadores (Home) | Sim |
| Pedidos | Sim (só lojas do módulo Vendas geram Pedidos; o critério de lojas de Ofertas é da tela de Pedidos — ver 4.3) |
| Promoções | Sim |
| Usuários | Sim |
| Estoque / Configurações | Não — usa seletor de uma loja só, via Gestão de Lojas (ver documento próprio) |
| Banners (Anúncios do App) | Não usa este seletor — tem contexto de Rede próprio, dentro de Gestão de Lojas |
| Produtos (Catálogo) | Não usa nenhum seletor de contexto — catálogo único da plataforma |

## 3. Estrutura do seletor

1. **Redes** — botão "Todas as Redes ▾" e painel próprio: busca "Buscar rede...", opção "Selecionar todas" (que vira "Selecionar visíveis" quando há texto digitado), lista das Redes às quais o usuário tem vínculo (checkbox, nome e "N lojas" abaixo do nome, com rolagem interna), rodapé com "Limpar", contador "N/total" (ex.: "12/12") e "Aplicar".
2. **Lojas** — botão "Todas as Lojas ▾" e painel próprio: busca "Buscar por nome ou CNPJ...", "Selecionar todos" (que vira "Selecionar visíveis" com texto digitado), lista agrupada por UF (checkbox, nome, etiqueta do módulo — Vendas ou Ofertas — e "CNPJ · cidade"), rodapé com "Limpar", contador "marcadas/total" (ex.: "1700/1723") e "Aplicar"; filtrada pelas Redes aplicadas.
- **Resumo nos botões:** "Todas as Redes" e "Todas as Lojas" na seleção padrão; "N lojas" (ou "N redes") com 2 ou mais aplicadas; o nome da loja (ou da Rede) quando há uma só; com o contexto diferente do padrão o botão fica destacado com borda azul.
3. **Seleção por grupo** — atalho de seleção **dentro do painel de Lojas** (Grupo = agrupamento de mais de uma loja do Estoque Centralizado; não é um nível hierárquico nem um CRUD). **Não é desenvolvida agora** — ver 4.5.

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

Se o usuário só tem 1 loja vinculada, o seletor de Lojas não é exibido — não há nada pra alterar; com 1 Rede e 1 loja o header mostra o chip "Rede › Loja (Cidade)" (ver 4.6). Para o comportamento do lado Rede (logo única read-only vs. seletor de múltiplas Redes), ver 4.6 — não duplicar a regra aqui.

### 4.3 Filtro dependente Rede → Loja (paginado)

- Default: todas as opções vêm pré-selecionadas (todas as Redes/Lojas às quais o usuário tem vínculo) — e isso é persistido.
- **"Limpar" no rodapé dos painéis (Redes e Lojas) desmarca todas as opções do painel** (não volta ao default e não recarrega as telas até o "Aplicar"). "Aplicar" sem nenhuma opção marcada aplica a seleção padrão (todas as Redes ou todas as lojas do vínculo; ver Pendências). Voltar ao default é o "Limpar" do header (4.8). Sem nenhuma loja marcada, o contador do rodapé mostra total/total.
- Lista de Lojas agrupada por Estado (UF), ordenação alfabética (Estado → Razão Social), busca por nome ou CNPJ (ignorando caracteres especiais no CNPJ), disparada ao digitar qualquer caractere, com debounce de 2 segundos e sem Enter.
- Lista traz tanto lojas do módulo Vendas quanto do módulo Ofertas, cada uma com a etiqueta do módulo. O contador "marcadas/total" e o "Selecionar todos" **contam as lojas de Ofertas independente da tela** em que o usuário está.
- **Pedidos × lojas de Ofertas:** Pedidos só existe para lojas de Vendas. O protótipo mostra, na tela de Pedidos, as lojas de Ofertas desabilitadas no painel de Lojas com a faixa "Pedidos existem apenas para lojas de Categoria Vendas."; esse critério **não é deste filtro**: fica como critério da criação da tela de Pedidos (ver Pendências). O item Pedidos aparece para todos os perfis, inclusive para quem só tem lojas de Ofertas (ECP-1495).
- **Efeito do "Aplicar" de Redes sobre as Lojas já marcadas:** as lojas marcadas que não pertencem às Redes aplicadas são descartadas da seleção de Lojas e as demais são mantidas; a lista do painel de Lojas passa a mostrar só as lojas das Redes aplicadas.
- **Busca de Redes:** disparada ao digitar qualquer caractere, com debounce de 2 segundos, filtrada no servidor.
- **Falha ao carregar** a lista de lojas ou de Redes (mesma mensagem nos dois painéis): "Não foi possível carregar suas lojas" / "Verifique sua conexão e tente novamente", com o botão do rodapé apenas fechando o painel.
- **Estado vazio da busca:** "Nenhuma rede encontrada para “q”" (Redes) e "Nenhuma loja encontrada para “q”" (Lojas), onde q é o texto digitado.
- **Carregamento ao aplicar:** skeleton nas telas de Operação enquanto os dados do novo contexto carregam; se a carga passar de 8 segundos, snackbar persistente "Ainda carregando..." com a ação "Tentar novamente"; se a aplicação falhar, o contexto volta ao anterior e um snackbar persistente "Não foi possível aplicar o filtro" com a ação "Tentar novamente" é exibido.
- A paginação da lista é resolvida pelo backend.
- **Lista de Lojas é paginada (scroll infinito), não vem inteira de uma vez** — débito técnico identificado depois da entrega inicial (redes grandes, ex. 840+ lojas, não escalavam com lista completa). Marcar uma ou mais Redes já não recalcula um array client-side: reinicia a busca paginada na página 1, filtrada server-side pelas Redes marcadas — isso substitui o recálculo puramente client-side da versão original do filtro. Ver seção 5 para os endpoints envolvidos.

(ECP-1281; paginação: ECP-1468)

### 4.4 Gatilho de atualização — só no "Aplicar"

**O sistema não busca/recarrega dados a cada clique de checkbox dentro do menu.** Marcar/desmarcar Redes, Lojas ou Grupos só atualiza o estado visual local (contadores, lista dependente). A chamada ao backend e a atualização das telas (gráficos, tabelas, listagens) só acontece quando o usuário clica **"Aplicar"** dentro do menu. Fechar o menu clicando fora, sem clicar Aplicar, não aplica a seleção. (ECP-1281)

### 4.5 Cascata de Grupo de lojas — "Seleção por grupo" (não desenvolvida agora)

A cascata, a coluna "Seleção por grupo" do painel de Lojas e a opção "sem grupo" **não serão desenvolvidas agora**; as regras abaixo ficam registradas para quando a funcionalidade entrar.

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

- **Mais de 1 Rede (Gestor de Rede e Admin):** os dois botões, ícone de rede com "Todas as Redes ▾" e ícone de loja com "Todas as Lojas ▾", sem a logo da Rede.
- **1 única Rede e mais de 1 loja (Gestor de Loja):** chip com a logo e o nome da Rede, **read-only** (a logo vem do cadastro da Rede, `whiteLabelOptions.logoUrl`, com `logoUrl` como alternativa), seguido do botão com ícone de loja "Todas as Lojas ▾" — sem seletor de Rede, já que não há o que escolher (o seletor de Lojas continua editável — ver 4.2/4.3; só o lado Rede fica travado).
- **1 Rede e 1 loja:** chip da Rede (logo e nome), seta e o nome da loja com a cidade entre parênteses (ex.: "Acfarma › Bocaiuva (Palotina)"), sem seletor.
- O header da Gestão de Lojas é do módulo de Configuração (em standby) e não faz parte deste documento — ver [Gestao-de-Lojas.md](../../Modulo.Configuracao/Gestao-de-Lojas.md).

(PRD, seção 5.1)

### 4.7 Propagação entre telas (mudança em relação a hoje)

Hoje, o filtro de Rede/Loja só é aplicado na Home de Indicadores. No modelo novo, o contexto selecionado passa a valer para **todas** as telas do módulo de Operação simultaneamente — trocar de contexto em qualquer uma delas (Home, Pedidos, Promoções, Usuários) atualiza as outras também, dentro da mesma sessão de navegação. O contexto aplicado fica salvo; a ida à Gestão de Lojas (header sem seletores) e a volta à Operação não o alteram (regra de negócio e critério de aceite do ECP-1568; o corpo do card ainda cita "restaurar para default" — ver Pendências). (PRD seção 5.1)

### 4.8 Limpar (header)

"Limpar" do header é da **multinavegação** (não é específico de Pedidos): aparece ao lado dos botões, em qualquer tela de Operação, quando o contexto aplicado (Redes e/ou Lojas) é diferente do padrão e, ao clicar, volta Redes e Lojas à seleção padrão (tudo marcado), recarrega as telas e some em seguida. Com 1 Rede travada, limpa só a seleção de Lojas. (PRD, seção 5.1)

### 4.9 O que este filtro NÃO cobre

- **Filtro de GE (Grupo Econômico):** não faz parte deste seletor. Vive dentro do header da própria tela de Indicadores, visível só para Admin, ao lado do seletor de período e do botão Exportar. Ver documento próprio de Indicadores.
- **Contexto de Banners:** é de Rede, mas vive dentro de Gestão de Lojas (aba "Anúncios do App"), não neste seletor do header.

## 5. Nível de integração / fonte de dados

- **Perfis de acesso** são mapeados no JWT/código como `admin`, `network_manager`, `pharmacy_owner`, `order_manager` (ver 4.1). O front não deve confiar só em strings de UI — o guard fino (`SessionPermissionGuard`, permissões `offer:*`/`product:*`/`order:*`/`pharmacy:*`) existe no código mas está **desabilitado**, status não confirmado pelo time — não assumir intencional nem bug sem reconfirmar. (ver [[project_portal_user_roles]])
- **Grupo de lojas** não tem tabela própria pra este filtro — a fonte é a mesma configuração de Estoque Centralizado (nome do grupo, lojas vinculadas, tipo de atendimento e de estoque). (ver [[project_grupo_de_lojas_estoque_centralizado]])
- **GE (Grupo Econômico)** — usado no filtro *de Indicadores*, não neste seletor — vem da tabela Postgres `pharmacy_economic_group` (`CNPJ`, `Group` int, `id`), 1 linha por loja, join por `CNPJ`. Nem toda loja tem registro nessa tabela — ausência de linha significa "sem GE", não erro. (ver [[project_grupo_economico_source_table]])
- **Uso na entrega:** o retorno de Grupos não é usado; a lista do multiselect de Redes sai de `networks[]` (ou de `networks-filter`); a etiqueta "Vendas"/"Ofertas" sai de `module`; o chip "Rede › Loja (Cidade)" usa `name` e `city` da única loja do vínculo; `total` alimenta o contador do rodapé do painel de Lojas. Não usa cache.
- **Endpoints do filtro (identificados via débito técnico ECP-1468, na versão atual de produção do filtro de Indicadores — a reconfirmar quando ECP-1494 reaproveitar o componente):**
  - `GET /backoffice/sales-and-marketing/v2/dashboard/indicators/filters` — retorna `networks` (Redes do usuário), `groups` (GEs), e as flags `viewEconomicGroup`/`viewNetwork`/`viewStore` (ex.: `viewStore: false` quando o vínculo é de 1 loja só). No `main` do BFF (2026-10-01) o campo `stores` **não vem vazio**: o comando pagina internamente (9999 por página) e devolve todas as lojas agrupadas por UF — o requisito de lista paginada (ECP-1468) deve usar o endpoint paginado abaixo; o código de ECP-1468 não foi localizado nos clones. As flags `viewEconomicGroup`/`viewNetwork`/`viewStore` são strings `hidden`/`locked`/`editable` (regra: 1 loja ou menos → Loja oculta; 1 Rede ou menos → Rede travada; Grupo: 0 oculto, 1 travado, 2+ editável).
  - `POST /backoffice/sales-and-marketing/v1/dashboard/indicators/advanced-filters/stores-filter` — body `{networks, groups, states, search, page, perPage}`, resposta `{stores[], total, page, count, last, regs}`. `page` sempre reinicia em 1 quando a busca ou a seleção de Rede muda; scroll incrementa `page` até `last: true`; `total` alimenta o texto "Todas as Lojas"/"X selecionados".
  - **Aplicar a seleção:** "Selecionar todos" manda `pharmacyIds: []` (vazio = todas as lojas do vínculo/das Redes marcadas); seleção específica manda `pharmacyIds[]` com os ids marcados — esse formato precisa persistir entre telas (ex.: Indicadores → Detalhamento de Ruptura).

- **Escopo por perfil (BFF, literal):** `IsAdmin = Roles.Contains("admin")` e `IsNetworkUser = Roles.Contains("network_manager")` são enviados ao serviço de farmácias (`pharmacy/stores-filter`, `economicgroup/networks-filter`, `pharmacy/states-filter`, `GET /pharmacy/pharmacies-for-user-ids`). A regra por perfil roda no `ecomm-api-pharmacy-dotnet` (não lido); pela doc do core: Admin sem filtro, `network_manager` por vínculo de Rede, `pharmacy_owner`/`order_manager` por vínculo de loja (inferido).
- **Bug conhecido no BFF:** alguns preparos de requisição usam `Groups != null || Groups?.Count != 0` (sempre verdadeiro) e ignoram Rede/Grupo/Estado, resolvendo todas as lojas do usuário; só `PrepareBodyRequestAsync` está correto.
- **`groups` nos endpoints do BFF = Grupo Econômico (GE)**, não o grupo de lojas do Estoque Centralizado — a fonte do atalho "Grupo de lojas" não foi localizada.

## 6. Cenários de borda

| Cenário | Regra |
|---|---|
| Usuário com vínculo a 1 única loja | Seletor de Lojas não aparece; com 1 Rede e 1 loja o header mostra o chip "Rede › Loja (Cidade)" (ver 4.6) |
| Usuário com 2+ lojas, todas na mesma Rede | Header mostra o chip com logo + nome da Rede (read-only, ver 4.6) e o botão "Todas as Lojas ▾", editável com as lojas dessa Rede |
| Usuário clica em "Limpar" no rodapé de um painel (Redes ou Lojas) | Desmarca todas as opções do painel (4.3); nenhuma tela é recarregada até o "Aplicar" |
| "Aplicar" sem nenhuma opção marcada | Volta à seleção padrão (4.3; confirmar) |
| Aplica uma única Rede tendo lojas marcadas de várias Redes | As lojas das outras Redes são descartadas; as da Rede aplicada continuam marcadas (4.3) |
| Contexto aplicado diferente do padrão | Aparece "Limpar" no header; ao clicar, volta à seleção padrão (4.8) |
| Busca sem resultado | "Nenhuma rede encontrada para “q”" / "Nenhuma loja encontrada para “q”" (4.3) |
| Carga do novo contexto passa de 8 segundos | Snackbar persistente "Ainda carregando..." com "Tentar novamente" (4.3) |
| Falha ao aplicar o contexto | Contexto volta ao anterior; snackbar persistente "Não foi possível aplicar o filtro" com "Tentar novamente" (4.3) |
| Usuário com lojas de Vendas e de Ofertas na tela de Pedidos | O protótipo mostra lojas de Ofertas desabilitadas com a faixa "Pedidos existem apenas para lojas de Categoria Vendas."; critério da tela de Pedidos (ver 4.3 e Pendências) |
| Usuário só com lojas de Ofertas | Vê o item Pedidos (ECP-1495); tratamento na tela de Pedidos |
| Rede com 840+ lojas (caso real citado no débito técnico) | Lista de lojas não vem inteira — busca paginada via scroll infinito (ver seção 5) |
| Usuário marca 2 lojas e clica fora do menu sem "Aplicar" | Seleção não é aplicada, nenhuma chamada de dados é feita |
| Usuário marca/desmarca várias lojas em sequência | Nenhuma chamada de dados até clicar "Aplicar" (1 chamada no final, não 1 por clique) |
| Navegação entre telas do módulo de Operação com contexto já selecionado | Contexto persiste e se propaga pras demais telas na mesma sessão |
| Desmarca 1 loja de um grupo totalmente selecionado | Checkbox do grupo cai pro estado parcial, sem afetar outros grupos (regra da "Seleção por grupo", não desenvolvida agora — 4.5) |
| Falha ao carregar a lista de lojas ou de Redes | O painel mostra "Não foi possível carregar suas lojas" / "Verifique sua conexão e tente novamente"; o botão do rodapé só fecha o painel (ECP-1568) |

## 7. Pendências / perguntas em aberto

- [ ] Seleção por grupo: o protótipo mostra a coluna "Seleção por grupo" no painel de Lojas; o Grupo não é desenvolvido agora e fica fora do ECP-1568.
- [ ] Lojas de Ofertas na tela de Pedidos: o protótipo mostra a faixa "Pedidos existem apenas para lojas de Categoria Vendas." e as lojas de Ofertas desabilitadas; é critério da criação da tela de Pedidos, não do ECP-1568.
- [ ] "Aplicar" sem nenhuma opção marcada: o protótipo trata como seleção padrão (todas); confirmar.
- [ ] Painel aberto na seleção padrão: o protótipo abre o painel sem caixas marcadas (contador N/N); o card especifica tudo marcado; confirmar.
- [ ] Busca de lojas por cidade: o protótipo casa o texto também com a cidade; confirmar.
- [ ] Busca digitada: o protótipo filtra a cada tecla; o card mantém o debounce de 2 segundos; confirmar.
- [ ] Tempo do snackbar "Ainda carregando...": o protótipo simula em 3 segundos; o card especifica mais de 8 segundos.
- [ ] Ida à Gestão de Lojas e volta: o corpo do ECP-1568 diz "restaurar o filtro para default", enquanto a regra de negócio e o critério de aceite dizem que o contexto aplicado continua o mesmo; o doc segue a regra e o critério; confirmar.
- [ ] Localizar a fonte do atalho "Grupo de lojas" (Estoque Centralizado): `groups` nos endpoints do BFF é o GE. Só será necessário quando a "Seleção por grupo" entrar (não desenvolvida agora).
- [ ] Confirmar o endpoint paginado `stores-filter` como fonte única da lista de lojas (o `GET filters` atual devolve todas).

- [ ] Confirmar que ECP-1494 (header global novo) reaproveita literalmente os endpoints do ECP-1468 (seção 5) e não uma implementação nova — os endpoints hoje existem pro filtro da tela de Indicadores em produção, ainda não confirmados no contexto do header global.
- [ ] Status do `SessionPermissionGuard` (permissões finas `offer:*`/`product:*`/`order:*`/`pharmacy:*`) — confirmar se segue desabilitado por design ou se é pendência técnica.
- [x] ~~Fonte exata de "quais Redes/Lojas o usuário tem vínculo"~~ — **pista forte encontrada em 2026-10-01**: a resolução de escopo (PharmacyId/PharmacyNetworkId/Groups/Networks/States) acontece no **BFF** `ecomm-bff-backoffice-indicator-dotnet` (`ValidationOrderLayerService.PrepareBodyRequestAsync`), via `GetPharmaciesUserCommand`/`PostStoresFilterCommand` — **antes** de qualquer chamada ao serviço Order. Repo clonado em `Documents/GitHub/ecomm-bff-backoffice-indicator-dotnet`. Ainda não li o código literal desses dois commands — próximo passo se for confirmar de vez.

## Changelog

- **2026-10-13** — Alinhado ao ECP-1568 atual e ao protótipo: painel de Redes com "Selecionar todas", "N lojas" por Rede e contador "N/total"; "Selecionar visíveis" com texto digitado; resumo nos botões ("N lojas", nome da loja, borda azul fora do padrão); "Restaurar padrão" passa a "Limpar" do header (o "Limpar" do rodapé desmarca o painel); "Aplicar" de Redes descarta lojas fora das Redes aplicadas; estados de falha, vazio e carregamento (skeleton, "Ainda carregando..." após 8 s, "Não foi possível aplicar o filtro"); header em três variações com chip "Rede › Loja (Cidade)"; item Pedidos visível também para só-Ofertas; pontos em aberto do protótipo registrados.
- **2026-10-06 (2)** — Handoff Figma e respostas do PO: contexto = sempre dois seletores, Redes e Lojas (sem menu único de 3 níveis); "Seleção por grupo" dentro de Lojas fica fora do desenvolvimento agora; "Reverter alterações" vira "Restaurar padrão" da multinavegação (4.8); "Limpar" desmarca tudo; o contador "marcadas/total" e o "Selecionar todos" contam as lojas de Ofertas independente da tela; Pedidos × lojas de Ofertas passa a ser critério da tela de Pedidos (lojas de Ofertas desabilitadas com aviso; só-Ofertas não vê Pedidos), e o empty state é removido; Gestor de Rede com 1 Rede única mostra a logo; 1 Rede e 1 loja mostram "Rede · Loja (Cidade)"; erros e estados do filtro ficam no ECP-1568 e ECP-1281; o header da Gestão de Lojas sai deste documento (módulo de Configuração).
- **2026-10-06** — Regra geral do PO: toda busca digitada dispara ao digitar qualquer caractere, com debounce de 2 segundos (aplicada à busca de lojas do seletor).
- **2026-10-05** — História própria do seletor (ECP-1568); o ECP-1494 passou a ser só o header global. Corrigido que o `GET filters` atual devolve todas as lojas; registrados escopo por perfil (literal), visibilidade por contagem e o bug de `||`.

- **2026-09-30 (correção)** — 4.2 e 4.6 estavam conflitantes: 4.2 dizia que o filtro de Rede "fica fixo mostrando 1 opção" quando o usuário tem Rede única, enquanto 4.6 (mais recente) já documentava que nesse caso não há seletor de Rede nenhum, só a logo read-only. Removida a informação desatualizada de 4.2 (mantido só o critério de Loja, que continua válido) — 4.6 é a fonte única pra esse comportamento. 4.3 atualizada com a paginação de lojas (débito técnico ECP-1468), que substitui o recálculo client-side descrito na v1 deste doc. Seção 5 e cenários de borda atualizados com os endpoints reais — inclusive um segundo conflito da mesma natureza encontrado ao revisar (linha "1 única loja" dizia que a Rede some junto com a Loja, o que contradizia 4.6; corrigido pro mesmo padrão). Títulos de tópicos deixaram de incluir data de definição (fica só no Changelog).
- **2026-09-30** — Criação do documento (v1), a partir da PRD v1.9 (seções 5, 5.1–5.3) + ECP-1281 + ECP-1291 + decisão de identidade de Rede no header (2026-09-28).

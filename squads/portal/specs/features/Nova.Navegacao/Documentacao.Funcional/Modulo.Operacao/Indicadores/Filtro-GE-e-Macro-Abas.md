# Indicadores — Filtro de GE e Macro-abas "Lojas de Vendas" / "Lojas de Ofertas"

**Módulo:** Operação
**Histórias:** [ECP-1512](https://farmarcas.atlassian.net/browse/ECP-1512) (Indicadores — Filtro de GE, incluindo o guard de rota da tela), [ECP-1598](https://farmarcas.atlassian.net/browse/ECP-1598) (Indicadores — Macro-abas Lojas de Vendas / Lojas de Ofertas com contador) — o ECP-1512 original (Filtro de GE e Macro-abas) foi quebrado em dois cards por decisão do PO de 2026-10-06
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seções 5.1 e 5.5
**Figma:** "[0001] Handoff — Nova Navegação do Portal" (fileKey `Rk122pjyt9mhUX8tlfkBRy`): Indicadores do Admin `9:1357`, header da tela e macro-abas `29:11616`; layout, rótulos e textos finais: a ser atualizado pela UX ainda nesta semana
**Relacionado:** [Home-Vendas-Visao-Geral.md](Home-Vendas-Visao-Geral.md), [Home-Ofertas.md](Home-Ofertas.md), [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md) (seletor de Redes e Lojas do header global, ECP-1568 — este documento cobre só o que é específico de Indicadores), [Sidebar-e-Modulos-de-Navegacao.md](../../Shell/Sidebar-e-Modulos-de-Navegacao.md) (ECP-1495)
**Status:** Em refinamento (cards em Backlog no Jira)
**Última atualização:** 2026-10-08

---

## 1. O que é

Indicadores (Home) mantém os mesmos recursos de hoje. Dois ajustes de estrutura da tela, cada um em sua História:

- **Filtro de GE** (ECP-1512): o filtro "Todos os GEs" (multisseleção) no header da própria tela de Indicadores, visível e utilizável só pelo perfil Admin e só na Home principal, e o **guard de rota** da tela (bloqueio de acesso por URL).
- **Macro-abas** (ECP-1598): as macro-abas "Lojas de Vendas" e "Lojas de Ofertas", cada uma com um badge com o contador de lojas do módulo no contexto aplicado, o estado vazio da macro-aba, o selo "Upgrade" e o comportamento da macro-aba quando o contexto muda (skeleton).

Os dois reagem ao contexto de Redes e Lojas aplicado no header global (ECP-1568). O conteúdo de cada macro-aba é entregue nas Histórias de Indicadores de Vendas ([Home-Vendas-Visao-Geral.md](Home-Vendas-Visao-Geral.md)) e de Ofertas ([Home-Ofertas.md](Home-Ofertas.md)); os cards de cada indicador da Home estão listados no PRD, seção 5.5. A entrega de cada História cobre front-end e back-end.

## 2. Estrutura

- **Header da própria tela de Indicadores** (não o header global do módulo): filtro de GE (ícone de camadas, rótulo "Todos os GEs" e seta), à esquerda do seletor de período e do botão Exportar; ao abrir, painel "Grupo econômico" com "Todos os GEs", um GE por linha com caixa de seleção e contador "N lojas" (desabilitado se 0), sem busca, e rodapé "Cancelar" / "Aplicar".
- **Macro-abas com contador:** **"Lojas de Vendas (N)"** / **"Lojas de Ofertas (N)"**, com o contador em um badge ao lado do rótulo. Usuário só com lojas de Ofertas: "Lojas de Vendas" desabilitada, sem contador e com o selo "Upgrade". Macro-aba sem lojas no contexto: estado vazio "Nenhuma loja selecionada para esta aba" / "Verifique seus filtros para ver os indicadores".
- Componentes novos criados do zero em React: o filtro de GE e o guard de rota (ECP-1512); macro-abas com badge de contador e skeleton (ECP-1598 — se já criados por outra demanda, como ECP-1553, são reaproveitados).

## 3. Regras de negócio

### 3.1 Filtro de GE — Admin only (ECP-1512)

- Visível e utilizável **só pelo perfil Admin**, independentemente da quantidade de GEs, e **só na Home principal** de Indicadores (não aparece no Detalhamento da ruptura). Vive dentro do header da tela de Indicadores, não no header global do módulo — distinto do seletor de contexto (Redes e Lojas) documentado em [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md).
- **Multisseleção:** a opção padrão é **"Todos os GEs"** (nenhum GE selecionado); escolhê-la limpa a seleção e os indicadores mostram todos os GEs. Marcar um ou mais GEs e clicar em "Aplicar" faz os indicadores e os contadores das macro-abas considerarem apenas as lojas desses GEs. Rótulo do botão: "Todos os GEs", o nome do GE (1 selecionado) ou "N GEs" (2 ou mais).
- **Rascunho:** a seleção só vale após "Aplicar"; "Cancelar" ou clicar fora do painel descarta. Sem campo de busca.
- **Contador "N lojas"** de cada GE = lojas do GE dentro do contexto de Redes e Lojas aplicado no header global ("1 loja" no singular); GE com 0 lojas fica desabilitado.
- O back-end expõe a lista de GEs (ordenada alfabeticamente, com o número de lojas de cada GE no contexto aplicado) e aplica os GEs selecionados às consultas de Indicadores e aos contadores das macro-abas.

### 3.2 Guard de rota — Balconista sem acesso, em nenhuma hipótese (ECP-1512)

- Nem pelo menu, nem por URL direta — a regra de visibilidade do menu é definida no Sidebar (ver [Sidebar-e-Modulos-de-Navegacao.md](../../Shell/Sidebar-e-Modulos-de-Navegacao.md)).
- Acesso indevido por URL (perfil sem acesso a Indicadores) **redireciona para a primeira tela a que o usuário tem acesso**; o perfil também é validado no servidor.
- Demais recursos de Indicadores permanecem inalterados.

### 3.3 Macro-abas refletem o contexto do header global (ECP-1598)

- Veem as macro-abas os perfis que acessam Indicadores: **Admin, Gestor de Rede e Gestor de Loja**.
- **"Lojas de Vendas"** conta as lojas do módulo Vendas e **"Lojas de Ofertas"** conta as lojas do módulo Ofertas, sempre **dentro do contexto de Redes e Lojas aplicado** no header global e do filtro de GE aplicado (Admin); os dois contadores são atualizados quando o contexto aplicado muda (ação "Aplicar" ou "Limpar", ECP-1568). Ao "Limpar", voltam a mostrar o total de lojas do contexto padrão.
- **Macro-aba inicial e conta só-Ofertas:** a macro-aba inicial é "Lojas de Vendas"; se o usuário só tem lojas de Ofertas, a tela abre já em "Lojas de Ofertas" e "Lojas de Vendas" fica desabilitada, sem contador e com o selo "Upgrade" (o botão "Faça upgrade" do protótipo não faz parte da entrega).
- **Sem troca automática de macro-aba:** quando o filtro do header ou o GE muda, a macro-aba selecionada continua selecionada. Usuário com lojas de Vendas e de Ofertas que filtra só por lojas de Ofertas: "Lojas de Vendas" continua habilitada, com contador 0 e estado vazio.
- **Macro-aba sem lojas no contexto:** continua habilitada, com contador 0, e ao ser aberta mostra o estado vazio "Nenhuma loja selecionada para esta aba" / "Verifique seus filtros para ver os indicadores".
- **Escopo por perfil:** Admin vê todas as Redes e Lojas; Gestor de Rede, as das Redes vinculadas; Gestor de Loja, só as próprias lojas.
- **Módulo da loja:** Vendas = loja com checkout completo no app; Ofertas = ativação de oferta no app e compra física na loja, sem gerar pedidos (Manual do Portal, definição dos módulos). Classificação no banco: loja cuja linha mais recente de `sales_module` (por `Pharmacy_Id`) tem `Status = 63` é Vendas; qualquer outro valor, ou ausência de linha, é Ofertas (`sales_module` é tabela de histórico — contar a linha mais recente de cada loja; a engenharia confirma a regra no serviço de lojas).
- **Ao aplicar um filtro do header:** o conteúdo da macro-aba exibe **skeleton** enquanto os dados do novo contexto carregam e o substitui pelos dados novos ao concluir (desenho exato em Pendências). O comportamento das macro-abas (contador, skeleton) é entregue no card das macro-abas; o card do Filtro de GE trata só do filtro. Clicar em outra macro-aba abre os indicadores do módulo correspondente dentro do contexto aplicado.

### 3.4 Ordenação da lista de GEs

A lista de GEs retornada no filtro deve vir ordenada alfabeticamente (débito técnico ECP-1468, identificado depois da entrega inicial — ver seção 4). O texto do card ECP-1512 não cita a ordenação — ver Pendências.

### 3.5 "Limpar"

No modelo novo, o botão "Limpar" (no legado, "Restaurar padrão") é da **multinavegação** (não específico de Indicadores nem de Pedidos): aparece ao lado dos seletores de Redes e Lojas do header global quando o contexto aplicado difere do padrão e volta à seleção padrão (ver [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md) 4.8). Hoje, na tela de Indicadores em produção, o link fica ao lado dos filtros (GE / Rede / Loja) e só aparece quando pelo menos um deles está diferente do padrão ("Todos"/"Todas"); assim que todos voltam a "exibir tudo" o link deve sumir. **Bug conhecido (ECP-1468):** marcar "Selecionar todos" manualmente reverte o estado mas não esconde o link — só o clique direto em "Restaurar padrão" esconde corretamente hoje. Se o "Limpar" da multinavegação também considera o filtro de GE (Admin) está em aberto.

## 4. Nível de integração / fonte de dados

### 4.1 Filtro de GE

**Query reaproveitada** — lista de GEs do Portal atual: Angular `ecomm-front-webapp-portal-angular/src/app/features/indicators/api/indicators.service.ts:337-341`, `GET /sales-and-marketing/v1/dashboard/indicators/advanced-filters/economic-groups?search=...` e `...economic-groups?page=...&perPage=...`; BFF `ecomm-bff-backoffice-indicator-dotnet/Edelivery.BackOffice.Indicator.Api/Controllers/v1/AdvancedIndicatorFiltersController.cs:42-43`: `[HttpGet("economic-groups")]` com `[ByPermissionAuthorize(Permission: "pharmacy:viewAny")]`. A visibilidade do seletor sai de `IndicatorFilterVisibility.ResolveGroupSelector(groups.Count)` (`Edelivery.BackOffice.Indicator.Application/AdvancedFilters/IndicatorFilterVisibility.cs:20-28`, usado em `GetIndicatorFiltersCommand.cs:35`) e o Angular exibe o select só se `userCanViewEconomicGroupSelect` (`indicators-network.component.html:123`, `indicators-network.component.ts:683`). Endpoint de filtros da tela em produção (débito técnico ECP-1468, **a reconfirmar quando este seletor for reconstruído no novo header/React**): `GET /backoffice/sales-and-marketing/v2/dashboard/indicators/filters` — retorna `groups` (lista de GEs), `networks` e as flags `viewEconomicGroup`/`viewNetwork`/`viewStore`.
**O que faz:** devolve os GEs de forma paginada e com busca; marca o seletor como oculto (nenhum GE), travado (1 GE) ou editável (mais de 1 GE); ao escolher um GE, o Portal atual recarrega a lista de Redes (`onSelectionItemsEconomicGroup`, `indicators-network.component.ts:734-737`).
**O que NÃO faz:** a visibilidade do seletor depende da quantidade de GEs devolvida, não do perfil Admin; a rota `network` de Indicadores é protegida por `AuthGuard` e `NavbarActiveService` (`routing.module.ts:13-18`), sem regra específica que bloqueie o Balconista por URL — confirmar em `AuthGuard`/`NavbarActiveService`.
**Ponto de atenção / correção:** (a) o seletor de GE aparece conforme o número de GEs devolvido pelo servidor, não por perfil; (b) a reconstrução exibe o filtro somente para o Admin, independentemente da quantidade de GEs, e bloqueia por URL o acesso de perfis sem permissão à tela, validando o perfil também no servidor.
GE (Grupo Econômico) em si: tabela Postgres `pharmacy_economic_group` (`CNPJ`, `Group`, `id`) — não confundir com `pharmacy_network`.

### 4.2 Macro-abas

**Query reaproveitada** — lista de lojas do contexto, conforme a ECP-1568: `POST /v1/dashboard/indicators/advanced-filters/stores-filter` (BFF `ecomm-bff-backoffice-indicator-dotnet`; documentado em [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md) §5), em que cada loja traz o campo `module` e a resposta traz `total`. No Portal atual as abas "Vendas" e "Ofertas" são montadas em `ecomm-front-webapp-portal-angular/src/app/features/indicators/indicators-network/presentation/pages/indicators-network/indicators-network.component.ts:431-470` (`verifyModulePharmacyToShowTab`), **sem contador de lojas**.
**O que faz:** devolve as lojas do vínculo do usuário, filtradas por Rede, UF e busca, cada uma com o módulo (`module`), e o total da seleção.
**O que NÃO faz:** não foi encontrado, nos repositórios acessados, endpoint que devolva a contagem de lojas **separada por módulo**; contar no cliente a partir da lista paginada não é viável (a lista é paginada, ECP-1568). A engenharia confirma se o serviço de lojas já a expõe.

## 5. Cenários de borda

| Cenário | Regra |
|---|---|
| Perfil não-Admin acessa Indicadores | Filtro de GE não aparece |
| Admin limpa a seleção do filtro de GE ("Todos os GEs" + "Aplicar") | Volta a "Todos os GEs" e os indicadores mostram todos os GEs |
| Admin marca 2 GEs e clica em "Aplicar" | Botão mostra "2 GEs"; indicadores e contadores consideram só as lojas dos 2 GEs |
| Admin marca GEs e clica em "Cancelar" ou fora do painel | Seleção anterior mantida; nada recarrega |
| GE sem lojas no contexto aplicado | Opção desabilitada com "0 lojas" |
| Admin no Detalhamento da ruptura | Filtro de GE não aparece (só na Home principal) |
| Conta só com lojas de Ofertas | Abre em "Lojas de Ofertas"; "Lojas de Vendas" desabilitada, sem contador, com selo "Upgrade" |
| Usuário com lojas dos dois módulos filtra só por lojas de Ofertas | Não troca de macro-aba sozinho; "Lojas de Vendas" habilitada, contador 0, estado vazio |
| Balconista acessa a URL de Indicadores | Bloqueado e redirecionado para a primeira tela a que tem acesso |
| Perfil sem acesso a Indicadores abre a URL | Redirecionado para a primeira tela a que tem acesso |
| Contexto do header global muda ("Aplicar") | Contadores das duas macro-abas recalculam e o conteúdo passa por skeleton |
| "Limpar" no header global | Contadores voltam ao total de lojas do contexto padrão |
| Gestor de Loja | Contadores contam só as lojas às quais está vinculado |
| Contexto com lojas dos dois módulos | Cada contador mostra só as lojas do módulo correspondente |
| Usuário marca "Selecionar todos" manualmente após ter um filtro aplicado | Estado reverte ao padrão, mas o link "Restaurar padrão" continua visível (bug conhecido, ECP-1468) |

## 6. Pendências / perguntas em aberto

- [ ] **Figma:** a ser atualizado pela UX ainda nesta semana (layout, rótulos e textos finais). Os cards referenciam os nós `9:1357` e `29:11616` do handoff.
- [ ] **Relação do filtro de GE com o contexto de Redes e Lojas (ECP-1568):** no Portal atual, escolher um GE recarrega a lista de Redes; falta decidir se, na nova navegação, o GE limita as Redes e Lojas do painel e como os dois filtros se combinam; e se o "Limpar" da multinavegação considera o filtro de GE.
- [ ] **Estados do filtro de GE** (carregamento, lista vazia e falha da lista): não desenhados no Figma nem no protótipo; o protótipo de 07/10/2026 lista os GEs sem busca e sem paginação — confirmar se a lista completa cabe no painel (rolagem) ou se mantém paginação por volume; e o protótipo oculta o filtro para conta só-Ofertas (confirmar se vale para algum Admin).
- [ ] **Rotas `pharmacy` e `network` de Indicadores** no Portal atual: confirmar com a engenharia como o guard de rota passa a tratar cada perfil na reconstrução (e confirmar em `AuthGuard`/`NavbarActiveService` o bloqueio atual do Balconista por URL).
- [ ] Confirmar se os endpoints do ECP-1468 (hoje na tela de Indicadores em produção) serão os mesmos reaproveitados no novo header/React, ou se haverá uma reimplementação; **ordenação alfabética da lista de GEs** (ECP-1468) — o card ECP-1512 não a cita; confirmar se se mantém; corrigir o bug do "Restaurar padrão" (ECP-1468, item 3) antes ou depois da migração para o novo header — a definir.
- [ ] **Skeleton ao aplicar um filtro do header (ECP-1598):** as macro-abas reais permanecem visíveis com o conteúdo (tabela/indicadores) em skeleton, ou a própria faixa de macro-abas também vira skeleton? O Figma de Pedidos traz os dois desenhos; confirmar com a UX qual vale para Indicadores.
- [ ] **Se a macro-aba escolhida persiste entre navegações** (a macro-aba inicial já está definida: "Lojas de Vendas", ou "Lojas de Ofertas" para conta só-Ofertas).
- [ ] **Nome da macro-aba de Ofertas:** o protótipo de 07/10/2026 usa "Lojas de Ofertas" (adotado); o PRD (5.1) e o Figma "[0001]" usam "Loja de Ofertas" — confirmar o rótulo final.
- [ ] **Indicação de carregamento ao trocar entre macro-abas** (spinner na área de conteúdo, como em Pedidos, ou skeleton).
- [ ] **Contagem de lojas por módulo:** o endpoint não foi encontrado nos repositórios acessados — a engenharia confirma se o serviço de lojas já a expõe e a regra de classificação (`sales_module`, linha mais recente, `Status = 63`).
- [ ] **Referência cruzada desatualizada nos cards:** os cards de Ofertas (ECP-1588, 1589, 1591, 1592, 1594, 1596, 1599) ainda citam "ECP-1512 (Filtro de GE e Macro-abas — mesma tela)"; as macro-abas agora são a ECP-1598 (o guard de rota e o filtro de GE permanecem na ECP-1512).
- [ ] Modelo de SLA da Home de Indicadores (percentual vs. minutos absolutos): decisão separada, ainda não tomada (PRD seção 9).

## Changelog

- **2026-10-13** — Nomenclatura: o botão do header do contexto de Redes e Lojas na nova navegação se chama "Limpar" (era "Restaurar padrão", nome do legado, que continua citado onde descreve o comportamento atual em produção).
- **2026-10-08** — Alinhamento ao protótipo "Novo Portal - Navegável" (Claude Design) por decisão do PO: filtro de GE com multisseleção ("Todos os GEs", contador "N lojas" por GE desabilitado se 0, rodapé Cancelar/Aplicar, rótulo "N GEs", sem busca), só Admin e só na Home principal; macro-abas "Lojas de Vendas" / "Lojas de Ofertas" (nome do protótipo), contadores também respeitam o GE, selo "Upgrade" para conta só-Ofertas (sem botão "Faça upgrade"), sem troca automática de macro-aba e estado vazio "Nenhuma loja selecionada para esta aba"; pendências resolvidas removidas (macro-aba inicial, contador 0).
- **2026-10-06 (2)** — Documento ampliado a partir dos cards publicados ECP-1512 (Filtro de GE e guard de rota) e ECP-1598 (macro-abas com contador): guard de rota com redirecionamento para a primeira tela acessível, contadores por módulo no contexto aplicado, escopo por perfil, classificação de módulo por `sales_module`, ausência de endpoint de contagem por módulo, queries reaproveitadas com ponto de correção, pendências dos dois cards.
- **2026-10-06** — Respostas do PO: ECP-1512 quebrado em dois cards (Filtro de GE; Macro-abas); "Restaurar padrão" passa a ser da multinavegação (3.5); comportamento das macro-abas fica no card das macro-abas (3.3).
- **2026-09-30** — Criação do documento (v1), a partir de ECP-1512, PRD seção 5.1, e débito técnico ECP-1468.

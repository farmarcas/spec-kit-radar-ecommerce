# Header Global do Portal

**Módulo:** Shell (visível nos módulos de Operação e Configuração)
**Histórias:** [ECP-1494](https://farmarcas.atlassian.net/browse/ECP-1494) (Header global: identidade de Rede, notificações, ajuda e menu do usuário), [ECP-1568](https://farmarcas.atlassian.net/browse/ECP-1568) (Filtro Multicontexto: seletor de Rede, Grupo e Loja — o seletor vive neste header)
**Referência UX:** [ECP-1452](https://farmarcas.atlassian.net/browse/ECP-1452) (Seletor de contexto de trabalho)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seções 5.1 e 5.2
**Relacionado:** [Filtro.Multicontexto.md](../Modulo.Operacao/Filtros%20Multicontexto/Filtro.Multicontexto.md), [Sidebar-e-Modulos-de-Navegacao.md](Sidebar-e-Modulos-de-Navegacao.md), [Notificacoes-Pedido-Parado.md](../Modulo.Operacao/Pedidos/Notificacoes-Pedido-Parado.md)
**Status:** Em desenvolvimento
**Última atualização:** 2026-10-05

---

## 1. O que é

O header global é construído uma única vez e reaproveitado pelos dois módulos. Da esquerda para a direita: bloco de identidade de Rede, seletor de contexto (documentado em [Filtro.Multicontexto.md](../Modulo.Operacao/Filtros%20Multicontexto/Filtro.Multicontexto.md)) e, à direita, sino de notificações, ajuda e menu do usuário.

## 2. Estrutura

- **Identidade de Rede:** 1 Rede vinculada → logo e nome da Rede (somente leitura); múltiplas Redes → seletor "Todas as Redes ▾"; dentro de Gestão de Lojas, com uma Rede aberta (única ou escolhida) → logo da Rede + texto "Gestão de Lojas" (conforme o Figma do handoff).
- **Sino de notificações** com contador.
- **Ajuda ("?"):** abre a central de ajuda em nova aba (tooltip "Ajuda").
- **Menu do usuário:** nome e perfil (ex.: "João Silva · Gestor de loja"), com "Meu Perfil" e "Sair".

## 3. Regras de negócio

- A identidade de Rede depende só de quantas Redes o usuário tem vinculadas, independente de quantas lojas há dentro dela.
- No módulo de Configuração o header aparece sem o seletor de contexto (ponto de entrada: Gestão de Lojas).
- "Sair" limpa a sessão no navegador e redireciona para o app de login.

## 4. Nível de integração / fonte de dados

Reaproveitado do Portal atual (Angular `ecomm-front-webapp-portal-angular`, `shared/components/navigation`). Os serviços de backend citados não estão nos repositórios locais — a lógica de servidor não foi lida.

- **Usuário e vínculos:** `GET /login/me` → `roles`, `permissions`, `pharmacyNetworks`, `isAnyPharmacies`, `isAnyNetwork`, `pharmacyId`.
- **Logo e nome da Rede:** `GET /pharmacy-networks/{id}` e `GET /pharmacy-networks/v1/networks`; no Angular: `state.networkSlice.network.whiteLabelOptions.logoUrl`, com `logoUrl` como alternativa (no legado, `pharmacy_network.LogoUrl`).
- **Notificações (Portal atual):** `GET /customer-management/v1/account-management/users/notifications` (contador = quantidade carregada, "+9" acima de 9) e `PATCH .../notifications/read` (envia todos os ids carregados; depois a lista local é esvaziada). Refaz a consulta a cada abertura do painel, sem tempo real. O que gera notificações não consta no código; o conteúdo de exemplo é de cadastro e reprovação de EAN (2023).
- **Ajuda:** link externo `https://intercom.help/edelivery/` (evento Mixpanel `menu_clique_ajuda`).
- **Menu do usuário:** "Meu Perfil" navega para o perfil do próprio usuário (edição por `PUT .../users/update-account/{id}`; redefinição de senha por e-mail com `POST .../users/reset-password/request`, dentro da edição de usuário); "Sair" limpa o `localStorage` e redireciona para o app de login, sem chamada de backend.
- **Hoje:** a barra superior mostra a logo da marca Radar E-commerce (não a da Rede) e o nome da Rede, que leva de volta à lista de lojas; a logo da Rede aparece na barra de navegação. Não há seletor de Rede no header (a Rede é trocada saindo para a lista de Redes). O nome do usuário só atualiza após recarregar a página.

## 5. Cenários de borda

| Cenário | Regra |
|---|---|
| 1 Rede vinculada, várias lojas dentro dela | Logo da Rede read-only; o filtro de Loja continua editável |
| Várias Redes vinculadas | Seletor "Todas as Redes ▾" |
| Tela de Gestão de Lojas, Rede única | "Acfarma · Gestão de Lojas" (logo + texto) |
| Tela de Gestão de Lojas, multi-Rede, depois de abrir uma Rede | Logo da Rede + texto "Gestão de Lojas" (decisão do PO, conforme Figma) |
| Tela de Gestão de Lojas, multi-Rede, lista de Redes (nenhuma Rede aberta) | A definir pelo desenho (a logo vem de uma Rede aberta) |
| Módulo de Configuração | Header sem seletor de contexto |

## 6. Pendências / perguntas em aberto

- [ ] Função do sino e do contador: no Portal atual lista notificações do usuário; o PRD v2.8 define os toasts de pedido atrasado e parado como modelo de notificação e deixa a central fora de escopo; o protótipo mostra contador "3" e usa o sino para disparar os toasts.
- [ ] Opções do menu do usuário além de "Meu Perfil" e "Sair" (trocar senha).
- [ ] Origem (bucket/CDN) do arquivo de logo da Rede e comportamento quando não há logo.

## Changelog

- **2026-10-06** — Decisão do PO: na Gestão de Lojas o header mostra a logo da Rede + "Gestão de Lojas" sempre que há uma Rede aberta, inclusive no fluxo multi-Rede (antes o doc previa só o texto). Header na lista de Redes segue a definir.
- **2026-10-05** — Criação do documento (v1), a partir do ECP-1494 (reescrito: o seletor de contexto passou para a História própria ECP-1568), do PRD (5.1, 5.2) e da leitura do header do Portal atual e do protótipo.

# Header Global do Portal

**Módulo:** Shell (header do módulo de Operação; o header do módulo de Configuração é definido por ele — ver seção 3)
**Histórias:** [ECP-1494](https://farmarcas.atlassian.net/browse/ECP-1494) (Header global: Notificações, ajuda e menu do usuário), [ECP-1568](https://farmarcas.atlassian.net/browse/ECP-1568) (Filtro Multicontexto: seletores de Redes e Lojas — os seletores vivem neste header)
**Referência UX:** [ECP-1452](https://farmarcas.atlassian.net/browse/ECP-1452) (Seletor de contexto de trabalho)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seções 5.1 e 5.2
**Relacionado:** [Filtro.Multicontexto.md](../Modulo.Operacao/Filtros%20Multicontexto/Filtro.Multicontexto.md), [Sidebar-e-Modulos-de-Navegacao.md](Sidebar-e-Modulos-de-Navegacao.md), [Notificacoes-Pedido-Parado.md](../Modulo.Operacao/Pedidos/Notificacoes-Pedido-Parado.md)
**Status:** Em desenvolvimento
**Última atualização:** 2026-10-13

---

## 1. O que é

O header global do módulo de Operação é construído uma única vez. Da esquerda para a direita: identidade de Rede e os dois seletores de contexto, **Redes** e **Lojas** (documentados em [Filtro.Multicontexto.md](../Modulo.Operacao/Filtros%20Multicontexto/Filtro.Multicontexto.md)) e, à direita, sino de notificações, ajuda e menu do usuário.

## 2. Estrutura

- **Lado esquerdo (Figma):**
  - **Mais de 1 Rede (Gestor de Rede e Admin):** dois botões, ícone de rede com "Todas as Redes ▾" e ícone de loja com "Todas as Lojas ▾", sem logo da Rede.
  - **1 Rede e mais de 1 loja (Gestor de Loja):** chip com a logo e o nome da Rede (somente leitura) e, ao lado, o botão com ícone de loja "Todas as Lojas ▾".
  - **1 Rede e 1 loja:** chip da Rede (logo e nome), seta e o nome da loja com a cidade entre parênteses (ex.: "Acfarma › Bocaiuva (Palotina)"), sem seletor.
  - Quando o contexto aplicado difere do padrão, aparece "Limpar" ao lado dos seletores (multinavegação, ver Filtro.Multicontexto.md 4.8).
- **Sino de notificações** sem contador (badge) e **sem painel de notificações**: hoje não há serviço de notificação, então o front-end fica apenas preparado (se o back-end identificar um serviço ativo ou desabilitado, sinalizar à equipe).
- **Ajuda ("?"):** abre a Central de Ajuda Farmarcas em nova aba (link externo), com tooltip "Ajuda". Substitui o destino atual (`https://intercom.help/edelivery/`, serviço que não é mais utilizado).
- **Menu do usuário:** nome do usuário em negrito e, abaixo dele, o perfil (ex.: "João Silva" e "Gestor de loja"), com seta (chevron). Opções: "Meu Perfil" (abre o perfil do próprio usuário, passando a incluir a informação do perfil, ex.: Contato cliente) e "Sair" (encerra a sessão e leva à tela de login).

## 3. Regras de negócio

- A identidade de Rede depende só de quantas Redes o usuário tem vinculadas, independente de quantas lojas há dentro dela; "1 Rede e 1 loja" substitui os seletores pelo texto.
- O header do módulo de Configuração, incluindo o da Gestão de Lojas (logo da Rede, texto "Gestão de Lojas"), é do módulo de Configuração (em standby) e está fora deste documento — ver [Gestao-de-Lojas.md](../Modulo.Configuracao/Gestao-de-Lojas.md).
- O perfil exibido abaixo do nome no menu do usuário é "Administrador" (Admin), "Gestor de loja" (Gestor de Loja) e "Balconista" (Contato cliente); o rótulo do Gestor de Rede não está definido no card (ver Pendências).
- "Sair" limpa a sessão no navegador e redireciona para o app de login.

## 4. Nível de integração / fonte de dados

Reaproveitado do Portal atual (Angular `ecomm-front-webapp-portal-angular`, `shared/components/navigation`). Os serviços de backend citados não estão nos repositórios locais — a lógica de servidor não foi lida.

- **Usuário e vínculos:** `GET /login/me` → `roles`, `permissions`, `pharmacyNetworks`, `isAnyPharmacies`, `isAnyNetwork`, `pharmacyId`.
- **Logo e nome da Rede:** `GET /pharmacy-networks/{id}` e `GET /pharmacy-networks/v1/networks`; no Angular: `state.networkSlice.network.whiteLabelOptions.logoUrl`, com `logoUrl` como alternativa (no legado, `pharmacy_network.LogoUrl`).
- **Notificações (Portal atual):** `GET /customer-management/v1/account-management/users/notifications` (contador = quantidade carregada, "+9" acima de 9) e `PATCH .../notifications/read` (envia todos os ids carregados; depois a lista local é esvaziada). Refaz a consulta a cada abertura do painel, sem tempo real. O que gera notificações não consta no código; o conteúdo de exemplo é de cadastro e reprovação de EAN (2023).
- **Ajuda:** destino novo, Central de Ajuda Farmarcas (link externo); o destino atual é `https://intercom.help/edelivery/` (evento Mixpanel `menu_clique_ajuda`).
- **Menu do usuário:** "Meu Perfil" navega para o perfil do próprio usuário (edição por `PUT .../users/update-account/{id}`; redefinição de senha por e-mail com `POST .../users/reset-password/request`, dentro da edição de usuário); "Sair" limpa o `localStorage` e redireciona para o app de login, sem chamada de backend.
- **Hoje:** a barra superior mostra a logo da marca Radar E-commerce (não a da Rede) e o nome da Rede, que leva de volta à lista de lojas; a logo da Rede aparece na barra de navegação. Não há seletor de Rede no header (a Rede é trocada saindo para a lista de Redes). O nome do usuário só atualiza após recarregar a página.

## 5. Cenários de borda

| Cenário | Regra |
|---|---|
| 1 Rede vinculada, várias lojas dentro dela | Chip com logo + nome da Rede read-only; o botão "Todas as Lojas ▾" continua editável |
| Várias Redes vinculadas (Gestor de Rede, Admin) | Dois botões: "Todas as Redes ▾" e "Todas as Lojas ▾", sem logo da Rede |
| 1 Rede e 1 loja | Chip da Rede, seta e "Loja (Cidade)", sem seletor |
| Perfil Admin no menu do usuário | Rótulo "Administrador" |
| Clique no sino | Nenhum painel é aberto; sem contador |

## 6. Pendências / perguntas em aberto

- [ ] Serviço de notificação: o card pede ao back-end que sinalize se houver algum serviço ativo ou desabilitado; hoje o sino é só front-end preparado.
- [ ] Rótulo do perfil Gestor de Rede no menu do usuário (o card define Administrador, Gestor de loja e Balconista).
- [ ] URL da Central de Ajuda Farmarcas (o card referencia o arquivo "Central de Ajuda Farmarcas.html", sem URL publicada).
- [ ] Origem (bucket/CDN) do arquivo de logo da Rede e comportamento quando não há logo.

## Changelog

- **2026-10-13** — Alinhado aos cards ECP-1494 e ECP-1568 atuais e ao protótipo: lado esquerdo em três variações (dois botões com ícones; chip da Rede + "Todas as Lojas ▾"; chip "Rede › Loja (Cidade)"); "Restaurar padrão" passa a "Limpar"; sino sem contador e sem painel; ajuda aponta para a Central de Ajuda Farmarcas com tooltip "Ajuda"; menu do usuário com nome em negrito, perfil abaixo, "Meu Perfil" (com a informação do perfil) e "Sair"; rótulo do Admin passa de "Administração e Sistema" para "Administrador".
- **2026-10-06 (2)** — Handoff Figma e respostas do PO: header com dois botões (Redes e Lojas) para Gestor de Rede e Admin; Gestor de Rede com 1 Rede única mostra a logo; 1 Rede e 1 loja = texto "Rede · Loja (Cidade)"; "Restaurar padrão" ao lado dos seletores; perfil Admin no menu do usuário = "Administração e Sistema"; menu do usuário existe, painel do sino não, tooltip "Ajuda" em desenho. O header da Gestão de Lojas (e a decisão do mesmo dia sobre logo + "Gestão de Lojas") passa a ser do módulo de Configuração (standby) e sai deste documento.
- **2026-10-06** — Decisão do PO: na Gestão de Lojas o header mostra a logo da Rede + "Gestão de Lojas" sempre que há uma Rede aberta, inclusive no fluxo multi-Rede (antes o doc previa só o texto). Header na lista de Redes segue a definir.
- **2026-10-05** — Criação do documento (v1), a partir do ECP-1494 (reescrito: o seletor de contexto passou para a História própria ECP-1568), do PRD (5.1, 5.2) e da leitura do header do Portal atual e do protótipo.

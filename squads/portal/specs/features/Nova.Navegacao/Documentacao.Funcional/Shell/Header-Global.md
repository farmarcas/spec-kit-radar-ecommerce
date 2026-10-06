# Header Global do Portal

**Módulo:** Shell (header do módulo de Operação; o header do módulo de Configuração é definido por ele — ver seção 3)
**Histórias:** [ECP-1494](https://farmarcas.atlassian.net/browse/ECP-1494) (Header global: identidade de Rede, notificações, ajuda e menu do usuário), [ECP-1568](https://farmarcas.atlassian.net/browse/ECP-1568) (Filtro Multicontexto: seletores de Redes e Lojas — os seletores vivem neste header)
**Referência UX:** [ECP-1452](https://farmarcas.atlassian.net/browse/ECP-1452) (Seletor de contexto de trabalho)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seções 5.1 e 5.2
**Relacionado:** [Filtro.Multicontexto.md](../Modulo.Operacao/Filtros%20Multicontexto/Filtro.Multicontexto.md), [Sidebar-e-Modulos-de-Navegacao.md](Sidebar-e-Modulos-de-Navegacao.md), [Notificacoes-Pedido-Parado.md](../Modulo.Operacao/Pedidos/Notificacoes-Pedido-Parado.md)
**Status:** Em desenvolvimento
**Última atualização:** 2026-10-06

---

## 1. O que é

O header global do módulo de Operação é construído uma única vez. Da esquerda para a direita: identidade de Rede e os dois seletores de contexto, **Redes** e **Lojas** (documentados em [Filtro.Multicontexto.md](../Modulo.Operacao/Filtros%20Multicontexto/Filtro.Multicontexto.md)) e, à direita, sino de notificações, ajuda e menu do usuário.

## 2. Estrutura

- **Lado esquerdo (Figma):**
  - **Gestor de Rede e Admin (várias Redes):** dois botões, "Todas as Redes ▾" e "Todas as Lojas ▾" (sem logo).
  - **1 Rede vinculada** (Gestor de loja, ou Gestor de Rede com uma Rede só): logo + nome da Rede (somente leitura) no lugar do botão de Redes, seguida do botão "Todas as Lojas ▾".
  - **1 Rede e 1 loja:** texto "Rede · Loja (Cidade)", sem seletor.
  - Quando o contexto aplicado difere do padrão, aparece "Restaurar padrão" ao lado dos seletores (multinavegação, ver Filtro.Multicontexto.md 4.8).
- **Sino de notificações** com contador. **Não há painel do sino** por enquanto (nem central de notificações).
- **Ajuda ("?"):** abre a central de ajuda em nova aba; o tooltip "Ajuda" está em desenho pela UX.
- **Menu do usuário:** nome e perfil (ex.: "João Silva · Gestor de loja"), com "Meu Perfil" e "Sair". O rótulo do perfil Admin segue o nome do perfil do sistema, **"Administração e Sistema"** (pode truncar).

## 3. Regras de negócio

- A identidade de Rede depende só de quantas Redes o usuário tem vinculadas, independente de quantas lojas há dentro dela; "1 Rede e 1 loja" substitui os seletores pelo texto.
- O header do módulo de Configuração, incluindo o da Gestão de Lojas (logo da Rede, texto "Gestão de Lojas"), é do módulo de Configuração (em standby) e está fora deste documento — ver [Gestao-de-Lojas.md](../Modulo.Configuracao/Gestao-de-Lojas.md).
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
| 1 Rede vinculada, várias lojas dentro dela | Logo + nome da Rede read-only; o botão "Todas as Lojas ▾" continua editável |
| Gestor de Rede com 1 Rede única | Logo da Rede no lugar do botão de Redes |
| Várias Redes vinculadas (Gestor de Rede, Admin) | Dois botões: "Todas as Redes ▾" e "Todas as Lojas ▾" |
| 1 Rede e 1 loja | Texto "Rede · Loja (Cidade)", sem seletor |
| Perfil Admin no menu do usuário | Rótulo "Administração e Sistema" (pode truncar) |
| Clique no sino | Sem painel por enquanto |

## 6. Pendências / perguntas em aberto

- [ ] Função do sino e do contador: não há painel do sino; no Portal atual o sino lista notificações do usuário; o PRD v2.8 define os toasts de pedido atrasado e parado como modelo de notificação e deixa a central fora de escopo; o Figma mostra o contador (ex.: "3") sem comportamento definido.
- [ ] Opções do menu do usuário além de "Meu Perfil" e "Sair" (trocar senha): a UX tem o menu desenhado, mas a auditoria do handoff não o encontrou aberto no arquivo do Figma — conferir com o desenho.
- [ ] Texto e comportamento do tooltip "Ajuda" (em desenho pela UX).
- [ ] Origem (bucket/CDN) do arquivo de logo da Rede e comportamento quando não há logo.

## Changelog

- **2026-10-06 (2)** — Handoff Figma e respostas do PO: header com dois botões (Redes e Lojas) para Gestor de Rede e Admin; Gestor de Rede com 1 Rede única mostra a logo; 1 Rede e 1 loja = texto "Rede · Loja (Cidade)"; "Restaurar padrão" ao lado dos seletores; perfil Admin no menu do usuário = "Administração e Sistema"; menu do usuário existe, painel do sino não, tooltip "Ajuda" em desenho. O header da Gestão de Lojas (e a decisão do mesmo dia sobre logo + "Gestão de Lojas") passa a ser do módulo de Configuração (standby) e sai deste documento.
- **2026-10-06** — Decisão do PO: na Gestão de Lojas o header mostra a logo da Rede + "Gestão de Lojas" sempre que há uma Rede aberta, inclusive no fluxo multi-Rede (antes o doc previa só o texto). Header na lista de Redes segue a definir.
- **2026-10-05** — Criação do documento (v1), a partir do ECP-1494 (reescrito: o seletor de contexto passou para a História própria ECP-1568), do PRD (5.1, 5.2) e da leitura do header do Portal atual e do protótipo.

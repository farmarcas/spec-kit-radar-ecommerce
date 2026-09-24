# PRD — Nova Navegação do Portal: Multicontexto e Nova Visão de Pedidos

**Produto:** Radar (Portal do Lojista)
**Squad:** Portal
**Autor:** Matheus (PO/PM)
**Status:** Validado — em desenvolvimento
**Versão:** 1.7

---

## 0. Changelog

**v1.0 (2026-09-18)** — Criação a partir da análise da proposta "Nova Navegação" (Figma `miqbQNkqYefWBCnQmVeMXY`, canvas "→ Proposta 02 - Sidebar") e de uma rodada de alinhamento com Matheus cobrindo: modelo de módulos do Portal, propagação de contexto, regra de exibição de Pedidos por período, modelo de SLA e regras de avanço de status. Vários pontos ficaram registrados como pendência (seção 9) — este documento reflete o estado do alinhamento nesta data, não o desenho final da UX (que segue em andamento em paralelo).

**v1.1 (2026-09-23)** — Revisão contra o protótipo já desenhado no Figma (mesmo arquivo, telas de `pedido`, `detalhe/*`, filtros e notificações). Fecha: exceção de ordenação por coluna (Data/Hora e Total), terceiro estado do semáforo de prazo (vermelho/atrasado), extensão da regra de confirmação (inclui conclusão e cancelamento), painel avançado de filtros ("Todos os filtros"), modelo de toast/notificação (sem WhatsApp automático nem central de notificações — seguem fora de escopo) e fluxo de cancelamento (reaproveita motivos já existentes no Portal). Resolve a pendência de empty state (seção 9 da v1.0).

**v1.2 (2026-09-23)** — Correção do modelo de semáforo (6.4) após cruzar com o protótipo de altíssima fidelidade (Claude Design, "Validação de ideias"): o amarelo é acionado 20 minutos **antes de o pedido ficar atrasado** (não 15 min do "prazo de finalização", como a v1.1 registrou por engano), e "Atrasado"/"Parado" são dois eixos independentes — um pedido pode ficar atrasado sem estar parado (tempo de entrega da loja é configurável, ex.: default 30 min) e vice-versa. Confirmado também que não existe funcionalidade de "reverter status"; o "pular etapa" do botão split é só o caminho Na fila → Liberados direto (já coberto na seção 6.5), sem ambiguidade com undo.

**v1.3 (2026-09-23)** — Validação do modal de detalhe do pedido (6.6/6.8) direto no protótipo Claude Design: confirmados o status tracker horizontal (com destaque vermelho na etapa atual quando atrasado), a confirmação de conclusão ("Esta ação não pode ser desfeita"), o modal de cancelamento com aviso de notificação ao cliente + estorno, e a tag "Editado". Duas pendências abertas: (1) o campo "Loja responsável" aparece em Entrega e Retirada — não está claro se é o mesmo campo que "Filial responsável" citado na v1.0; (2) a opção "Teste interno" no motivo de cancelamento aparece nos dois protótipos (Figma e Claude Design) mas não está na lista hoje documentada no Manual do Portal.

**v1.4 (2026-09-23)** — Adiciona o modelo de contexto por funcionalidade e as regras de acesso por perfil (seções 5.2/5.3), confirmados por Matheus. Cruza este PRD com o `Manual-Portal-Radar-Ecommerce.md` (estado atual do Portal em produção) e registra em 9.1 sete pontos de atenção: Balconista e acesso a Estoque, tela Banners sem contexto definido, equivalência entre a tela "Lojas" atual e o Hub de Lojas, comportamento do Relatório de Pedidos/Exportar (`ECP-747`) sob o novo seletor multicontexto, a nuance de estorno manual de Pix via Cielo no cancelamento, as tags de origem de preço por item ("Preço loja"/"Preço PEC"), e a notificação de pedido novo via WhatsApp (que continua existindo, distinta da de "pedido parado" excluída na seção 3).

**v1.5 (2026-09-23)** — Fecha os 7 pontos da seção 9.1 e a pendência de Balconista+Estoque: Balconista perde Estoque (intencional) mas mantém Promoções escopado à própria loja e sem ações destrutivas; Banners fica no contexto de Rede, visível só para Admin (redução em relação a hoje, onde Gestor de Rede também acessa); Hub de Lojas filtra a listagem pelo acesso do usuário (Admin = toda a Rede, Gestor = só suas lojas); Relatório de Pedidos herda os filtros globais do seletor multicontexto, substituindo a regra antiga do `ECP-747`; tags "Preço loja"/"Preço PEC" foram removidas de propósito; WhatsApp de pedido novo confirmado que continua; nuance de estorno Pix/Cielo explicitamente adiada, sem mudança na regra atual. Usuários (seção 5.2) ganha detalhe de escopo: Admin vê todos os usuários da plataforma, Gestor de Rede só os da própria Rede.

**v1.6 (2026-09-24)** — Fecha 3 decisões vistas em novos prints do protótipo (mesmo arquivo Claude Design): (1) localização do filtro de GE — fica no header de Indicadores, resolvendo a pendência da v1.0; (2) navegação entre lojas de módulo Vendas/Ofertas dentro de Indicadores muda para macro-abas com contador ("Lojas de Vendas (25)"/"Loja de Ofertas (2)"); (3) confirma que "Hub de Lojas" se chama "Gestão de Lojas" na interface real, com 2 abas — "Lojas da rede" (a listagem em si) e "Anúncios do App" (Banners) — fechando de vez onde Banners mora na navegação nova.

**v1.7 (2026-09-24)** — Rodada de revisão de conteúdo pedida por Matheus: adiciona Produtos (Catálogo) à tabela de contexto por funcionalidade (5.2), sem seletor de contexto, Admin only; corrige a redação confusa do gatilho do amarelo em 6.4 (é a mesma referência de tempo do prazo estimado, não duas coisas diferentes); reforça em 6.7 que o toast é global de fato, inclusive dentro do módulo de Configuração; corrige 6.8 — cancelamento é permitido a partir de **qualquer status, incluindo Concluído**, não só status ativos; adiciona reforço sobre o cálculo de estorno no cancelamento respeitar estornos parciais já feitos na Conferência (`PRD-edicao-pedidos-etapa-revisao.md`, seção 8.1); move a definição da navegação Lojas de Vendas/Loja de Ofertas de "pendência" para decisão fechada (seção 5.1); remove da seção 9/9.1 os itens já resolvidos (o conteúdo já vive nas seções principais, essas linhas eram só rastro de decisão).

---

## 1. Contexto

Hoje o Portal trata o contexto de loja/rede de forma isolada por tela: o seletor de Rede/Loja só existe na Home de Indicadores, e cada outro módulo (Pedidos, Promoções, Configurações) não compartilha esse filtro entre si. A tela de Pedidos especificamente não tem filtro, busca nem filtro global de lojas — uma lacuna sinalizada como prioridade Highest desde antes deste ciclo de planejamento (ver `squads/portal/product.md`).

Ao mesmo tempo, o Portal está sendo reestruturado em dois módulos com necessidades de contexto opostas:
- **Módulo de Operação** (Pedidos, Promoções): o usuário se beneficia de ver/agir sobre **múltiplas lojas ao mesmo tempo** — ex.: acompanhar pedidos de todas as lojas do seu grupo econômico numa lista só.
- **Módulo de Configuração** (Config, Estoque, etc.): só faz sentido operar **uma loja por vez** — não há leitura útil de "ver o estoque de duas lojas simultaneamente". Por isso a UX desenhou um **Hub de Lojas**: uma tela de entrada onde o usuário escolhe explicitamente qual loja quer configurar antes de entrar no módulo.

Este PRD documenta o modelo de contexto ("Multicontexto") que rege o módulo de Operação, e a primeira tela construída sobre esse modelo: a nova Visão de Pedidos em tabela.

## 2. Objetivo

1. Definir como o contexto de Rede/Loja/Grupo é selecionado e propagado dentro do módulo de Operação — hoje ele só afeta a Home; no modelo novo, afeta **todas** as telas do módulo (Home, Pedidos, Promoções) ao mesmo tempo.
2. Especificar a nova tela de Pedidos (listagem em tabela + detalhe), incluindo os filtros, a regra de exibição por período, o modelo de SLA e as regras de avanço de status.

## 3. Escopo

### Dentro do escopo (v1)
- Modelo conceitual de 2 módulos (Operação × Configuração) e a diferença de contexto (múltiplo × único) entre eles.
- Seletor de contexto de trabalho (Rede, Grupo de lojas/Estoque Centralizado, Loja individual) — reaproveitando as regras já fechadas em `ECP-1281` (filtro dependente Rede→Loja) e `ECP-1291` (cascata de Grupo de lojas), agora persistente em todo o módulo de Operação.
- Nova Visão de Pedidos: macro-abas (Em andamento/Finalizados) + filtro segmentado por status, regra de exibição de pedidos ativos (sem limite de período) vs. finalizados (30 dias), busca (histórico completo, ignora o filtro de período).
- Painel avançado de filtros ("Todos os filtros"): Itens, Tipo de pedido, Prazo, Status de pagamento, Método de pagamento — ver seção 6.1.1.
- Colunas e comportamento da tabela de pedidos (scroll horizontal com colunas fixas, linha inteira clicável, ordenação restrita a Data/Hora e Total).
- Detalhe do pedido: navegação anterior/próximo, avanço de status (com e sem confirmação), modelo de SLA preditivo em minutos absolutos com 3 estados (amarelo/parado/atrasado).
- Fluxo de cancelamento de pedido (motivo + confirmação), reaproveitando as opções já existentes no Portal hoje.
- Modelo de notificação em toast (persistência, agrupamento, escalonamento por hora) — sem WhatsApp automático nem central de notificações, que seguem fora de escopo (ver abaixo).

### Fora do escopo (v1)
- Localização do filtro de GE (Grupo Econômico) — hoje só visível para Admin; **definido em 2026-09-24**: fica dentro do header da tela de Indicadores ("Todos os GEs ▾", ao lado do seletor de período e do botão Exportar), não no header global do módulo de Operação (ver seção 9).
- Central de notificações e qualquer escalonamento automático via WhatsApp para pedido parado — descartado deste PRD por decisão explícita do PO. **Reconfirmado em 2026-09-23:** mesmo com anotações de handoff no protótipo mencionando WhatsApp automático após 2h parado, essa parte específica segue fora do escopo; o modelo de toast (seção 6.7) cobre só a notificação in-app.
- "Mover pedido para trás" (reverter status) — ainda é ideia da UX, sem desenho; não faz parte deste ciclo.
- O Módulo de Configuração em si (Hub de Lojas, fluxo "Gestão de lojas — Config e estoque juntos") — mencionado aqui só como contraponto conceitual; será detalhado em PRD próprio quando entrar em priorização.
- Fluxo de Promoções dentro do novo modelo de módulos — mesma lógica de multicontexto do módulo de Operação, mas os protótipos ainda não estão maduros o suficiente para detalhar aqui.
- Modelo de SLA da Home de Indicadores — decisão de percentual vs. minutos absolutos será tomada separadamente quando a Home entrar em pauta.

## 4. Personas

- **Contato cliente (Balconista):** vinculado a 1 loja só, opera pedidos no dia a dia.
- **Gestor de Loja:** vinculado a N lojas, quer ver o conjunto delas de uma vez.
- **Gestor de Rede:** vinculado a N redes; confirmado que, mesmo com múltiplas redes vinculadas, o comportamento esperado é ver tudo consolidado — o mesmo conceito que a Home de Indicadores já aplica hoje, estendido para Pedidos.
- **Admin:** todas as Redes/Lojas, único perfil com acesso ao filtro de GE.

## 5. Modelo conceitual: Módulo de Operação × Módulo de Configuração

```
Módulo de Operação                         Módulo de Configuração
(Pedidos, Promoções, Home)                 (Config, Estoque, etc.)

Contexto: MÚLTIPLO                         Contexto: ÚNICO
Seletor de contexto de trabalho            Hub de Lojas
(Rede / Grupo de lojas / Loja)             (escolhe 1 loja antes de entrar)
     │                                            │
     ▼                                            ▼
Contexto se propaga por TODAS             Usuário opera dentro do
as telas do módulo simultaneamente        contexto daquela loja só,
(hoje só a Home recebe o contexto;        até trocar de loja
no modelo novo, Pedidos e Promoções       explicitamente no Hub
também recebem o mesmo contexto)
```

**Por que a diferença:** no módulo de Operação, ver/agir sobre várias lojas ao mesmo tempo é o comportamento desejado (ex.: acompanhar todos os pedidos do grupo econômico numa lista só). No módulo de Configuração, isso não faz sentido — não há leitura útil em ver o estoque de duas lojas ao mesmo tempo — por isso a UX resolveu com um ponto de entrada dedicado (Hub de Lojas) que força a escolha de uma única loja.

### 5.1 Seletor de contexto de trabalho (módulo de Operação)

O seletor reaproveita integralmente o que já foi especificado em cards anteriores — não é um componente novo do zero:

- **Rede → Loja:** filtro dependente (`ECP-1281`) — marcar uma Rede recalcula, no cliente, as opções disponíveis no dropdown de Loja.
- **Grupo de lojas (Estoque Centralizado):** atalho de seleção dentro do filtro de Loja (`ECP-1291`) — marcar um grupo marca todas as lojas dele (cascata para baixo); desmarcar uma loja de um grupo cheio joga o checkbox do grupo para o estado parcial (cascata para cima); uma loja pertence a no máximo 1 grupo, sem cascata cruzada entre grupos.
- **GE (Grupo Econômico):** filtro adicional, só para perfil Admin. **Definido em 2026-09-24:** fica no header da tela de Indicadores, não no header global do módulo de Operação.

**Navegação Lojas de Vendas × Loja de Ofertas dentro de Indicadores (definido em 2026-09-24):** as sub-abas simples "Vendas"/"Ofertas" do modelo atual (Manual seção 5) viram macro-abas com contador de lojas — ex.: "Lojas de Vendas (25)" / "Loja de Ofertas (2)". Indicadores segue fora do escopo detalhado deste PRD (mantido com os mesmos recursos de hoje), mas essa navegação interage com o seletor de contexto multicontexto: cada aba reflete só as lojas do módulo correspondente dentro do contexto (Rede/Grupo/Loja) selecionado.

**Mudança de comportamento em relação a hoje:** atualmente o contexto de Rede/Loja só é aplicado na Home de Indicadores. No modelo novo, o contexto selecionado passa a valer para **todo o módulo de Operação** — trocar de contexto em qualquer tela (Home, Pedidos, Promoções) atualiza as outras também, dentro da mesma sessão de navegação.

### 5.2 Contexto por funcionalidade

Confirmado em 2026-09-23 — mapeamento de qual tipo de seletor cada funcionalidade usa:

| Funcionalidade | Componente de contexto |
|---|---|
| Pedidos | Seletor multicontexto **de Vendas** |
| Promoções | Seletor multicontexto |
| Indicadores (Home) | Seletor multicontexto |
| Usuários | Seletor multicontexto |
| Estoque | Seletor de uma loja |
| Configurações | Seletor de uma loja |
| Banners | Contexto de Rede (não de loja) — visível só para Admin |
| Produtos (Catálogo) | Sem seletor de contexto — visível só para Admin |

**Usuários entra no grupo multicontexto** — diferente do que a seção 5 registrava até aqui (que falava só em Pedidos/Promoções/Home para o módulo de Operação). Isso amplia o modelo: gerenciar usuários passa a ser possível através de múltiplas lojas/redes ao mesmo tempo, não só dentro de uma loja ou de uma Rede isolada como é hoje (ver `Manual-Portal-Radar-Ecommerce.md`, seção 11). Escopo por perfil, confirmado: **Admin** vê todos os usuários da plataforma; **Gestor de Rede** vê só os usuários vinculados à(s) sua(s) Rede(s). Estoque e Configurações confirmam o modelo de contexto único já descrito para o Módulo de Configuração.

**Nota "de Vendas" no seletor de Pedidos:** o qualificador reflete que só lojas no módulo **Vendas** geram Pedidos no Portal — lojas no módulo Ofertas não aparecem/não fazem sentido nesse contexto (ver `Manual-Portal-Radar-Ecommerce.md`, seção 3, "Módulo Vendas x Módulo Ofertas").

**Produtos (Catálogo) também não se encaixa no modelo multi/único de loja:** é um catálogo único, compartilhado entre todas as Redes da plataforma (`Manual-Portal-Radar-Ecommerce.md`, seção 12) — não existe "Rede/Loja" para filtrar, o cadastro é o mesmo pra todo mundo. Acesso exclusivo do Admin (regra já vigente hoje, seção 5.3).

**Banners não se encaixa nos dois modelos (multi/único de loja):** o contexto dele é de **Rede**, consistente com o comportamento já existente hoje (Manual seção 10, tela só aparece no nível Rede) — mas a visibilidade muda: **fica restrita ao perfil Admin**. É uma redução deliberada em relação a hoje, onde Gestor de Rede também acessa Banners (Manual seção 2, menu de Rede inclui Banners) — confirmado por Matheus em 2026-09-23. Resolve a pendência 9.1 sobre onde Banners entra no modelo novo.

**Definição de tela confirmada (2026-09-24):** Banners não é destino próprio na sidebar — vive como aba **"Anúncios do App"** dentro da tela **"Gestão de Lojas"** (a mesma tela que resolve a pendência 9.1 sobre a antiga tela "Lojas" de nível Rede — ver seção 5.4). A outra aba dessa tela, **"Lojas da rede"**, é a listagem de lojas em si (Grupo, Telefone, Estado, Cidade, ERP conectado, Módulo ativado — igual ao Manual seção 3), com o botão de adicionar nova loja.

### 5.4 Gestão de Lojas (nomenclatura confirmada)

"Hub de Lojas", mencionado nas seções 3 e 5, é chamado na interface real de **"Gestão de Lojas"**. Confirmado em 2026-09-24 (print do protótipo): a tela tem 2 abas —
- **Lojas da rede** — listagem de lojas com Grupo, Telefone, Estado, Cidade, ERP conectado até, Módulo ativado, botão "Nova Loja", filtro por Módulo, atalho para Grupo de Lojas e Exportar Lojas. Equivale à tela "Lojas" de hoje (Manual seção 3).
- **Anúncios do App** — gestão de Banners (Admin only, ver acima).

### 5.3 Regras de acesso por perfil (módulo de Operação)

Confirmado em 2026-09-23:

- **Admin:** acessa tudo, com todas as Redes e Lojas disponíveis no seletor de contexto.
- **Gestor:** acessa tudo, mas o seletor de contexto só oferece as Redes/Lojas às quais está vinculado. Único menu que não acessa é o de Produtos/Catálogo — regra já vigente hoje (`Manual-Portal-Radar-Ecommerce.md`, seção 2: Catálogo é exclusivo do perfil Admin).
- **Balconista (Contato cliente):** não visualiza Indicadores (Home) — vê só Pedidos e Promoções. **Confirmado (2026-09-23): perde o acesso a Estoque** que tem hoje (Manual seção 2, menu reduzido = Pedidos/Promoções/Estoque) — é remoção intencional no modelo novo, não omissão.
- **Balconista em Promoções:** vê o menu, mas escopado só à própria loja (é o único perfil vinculado a 1 loja só, então na prática o seletor multicontexto não se aplica a ele aqui) e **sem ações destrutivas** (mesma regra já vigente hoje — vê a listagem completa e exporta relatório, mas não tem "Nova promoção", cancelar ou destacar oferta; Manual seção 9).

**Hub de Lojas (Módulo de Configuração) também filtra por perfil, confirmado:** a listagem de lojas exibidas no Hub respeita o mesmo acesso do seletor de contexto — Admin vê todas as lojas da Rede, Gestor só as suas lojas vinculadas.

## 6. Nova Visão de Pedidos (tabela)

### 6.1 Estrutura de filtros da listagem

Dois níveis, no formato de segmented bar (navbar + filtro de opções):

- **Macro-abas:** "Em andamento (N)" / "Finalizados (N)" — contam quantos pedidos existem em cada bucket dentro do contexto selecionado.
- **Filtro segmentado dentro de "Em andamento":** Todos / Conferência / Na fila / Em separação / Liberados — single-select, funcionam como filtro da listagem (não trocam de tela). Default: "Todos".
- **Filtro segmentado dentro de "Finalizados":** Todos / Concluídos / Cancelados, com um badge "Limite 30 dias" ao lado.

### 6.1.1 Painel avançado de filtros ("Todos os filtros")

Confirmado para v1. Botão "Todos os filtros" abre um painel com 5 grupos (aplicação em conjunto, botões Limpar/Aplicar):

- **Itens:** Só medicamentos, Alto custo, Com receita.
- **Tipo de pedido:** Entrega, Retirada.
- **Prazo:** Atrasado, 20 min para atrasar, Em tempo, Parado.
- **Status de pagamento:** Pago, Cobrar, Com troco.
- **Método de pagamento:** Pix, Dinheiro, Maquininha.

Filtros ativos aparecem como badges removíveis acima da tabela, com contador no botão ("Todos os filtros · 2") e opção "Limpar filtros".

### 6.2 Regra de exibição por período

- **Pedidos ativos** (qualquer status de "Em andamento"): **sem limite de período** — aparecem na listagem até mudarem de status, não importa há quanto tempo foram criados.
- **Pedidos finalizados** (Concluídos/Cancelados): só os dos **últimos 30 dias** aparecem na listagem por padrão. Passado esse limite, o pedido some da lista.
- **Busca:** o campo de busca (nome do cliente, CNPJ, nº do pedido) varre **todo o histórico**, ignorando completamente o limite de 30 dias — é a via de acesso a qualquer pedido finalizado mais antigo.
- **Empty state:** 4 cenários desenhados — (1) Gestor sem pedidos ativos no contexto selecionado (CTA "Criar nova promoção"); (2) Balconista sem pedidos na fila; (3) filtro/aba aplicada sem resultado (CTA "Exportar relatório" / "Resetar filtros aplicados"); (4) busca sem correspondência, com aviso explícito de que a busca varreu todo o histórico ("A busca passou por todo o histórico, independente do período") e CTA "Limpar busca" / "Resetar filtro incluído".

### 6.3 Colunas e comportamento da tabela

- Colunas conforme protótipo validado: Prazo, Data/Hora, Cliente, Status, Resumo, Tipo, Loja, Total (mesma base já especificada em `ECP-1312`).
- As duas últimas colunas ficam fixas durante o scroll horizontal.
- Toda a área da linha é clicável e abre o detalhe do pedido — não só um botão/ícone específico.
- **Sem ordenação por coluna, com exceção de Data/Hora e Total** — essas duas colunas são ordenáveis (clique no cabeçalho); as demais seguem a regra já fechada para a Lista de Termos Buscados (`ECP-1339`) e não reordenam a lista.

### 6.4 Modelo de SLA e prazo (preditivo, não reativo)

Decisão explícita: nesta tela o objetivo é deixar claro, **de forma preditiva**, quais pedidos vão precisar de atenção — não só reagir depois que já atrasou. Por isso o modelo usa **minutos absolutos**, não percentual do SLA:

Modelo de semáforo com 3 estados, em 2 eixos independentes:

**Eixo 1 — prazo de entrega/retirada (cor da linha):**
- **Amarelo** → faltando **20 minutos** para o prazo estimado de entrega/retirada — ou seja, 20 minutos antes do momento exato em que o pedido passa a ficar "Atrasado" (é a mesma referência de tempo; a v1.1 tinha usado por engano um termo diferente, "prazo de finalização", que não existe no modelo — ver changelog v1.2).
- **Vermelho ("Atrasado")** → o pedido já excedeu o tempo de entrega/retirada. Cada loja pode ter uma configuração diferente desse tempo (ex.: default de 30 min) — **todo pedido atrasado fica vermelho**, independente de estar "Parado" ou não.

**Eixo 2 — movimentação (tag "Parado", não muda a cor da linha por si só):**
- **"Parado"** → pedido sem nenhuma movimentação por **mais de 1 hora**.

**Os dois eixos são independentes** — um pedido pode estar atrasado sem estar parado (chegou uma movimentação recente, mas a loja configurou um tempo de entrega curto e ele já estourou) e pode estar parado sem estar atrasado (loja com tempo de entrega mais longo, ainda dentro do prazo, mas sem toque há 1h+). Quando os dois se aplicam ao mesmo tempo, a UI mostra os dois (linha vermelha + tag "Parado").

**Nota:** a Home de Indicadores pode acabar usando um modelo diferente (percentual do SLA, como já especificado em `ECP-1313`/`ECP-1318`) — essa é uma decisão separada, a ser tomada quando a Home entrar em pauta neste mesmo ciclo. Os dois modelos não precisam ser idênticos.

### 6.5 Avanço de status do pedido

- Ação principal: **botão split** — um botão primário com a ação padrão (avançar 1 etapa sequencial) e um chevron acoplado que abre um menu com a alternativa de **pular direto para "Liberados"**.
- **Transições sequenciais intermediárias acontecem sem diálogo de confirmação.**
- **Diálogo de confirmação obrigatório em 3 casos:**
  1. Conferência → Na fila (é o commit do rascunho de edição, ver `PRD-edicao-pedidos-etapa-revisao.md`).
  2. Qualquer ação de "pular etapa" (ex.: Na fila → Liberados direto).
  3. Qualquer transição para um **status final** — Liberados → Concluído (irreversível, "Esta ação não pode ser desfeita") e Cancelamento a partir de **qualquer status, incluindo Concluído** (ver 6.8), pelo mesmo motivo: é status final.
- **Reverter status ("mover para trás") não está desenhado e não faz parte deste PRD** — segue como ideia registrada pela UX para avaliação futura.

### 6.6 Detalhe do pedido

- Abre como modal, largura máxima 1180px, altura dinâmica de até 90% da viewport.
- Navegação **◀ / ▶ "próximo pedido"** dentro do próprio modal, sem precisar fechar e reabrir — desabilitada no primeiro e no último pedido da lista carregada.
- Comportamento condicional por tipo de entrega: **Retirada** oculta o campo de taxa de entrega. **Verificado no protótipo (2026-09-23):** o bloco "Loja responsável" (CNPJ + nome da loja que atende o pedido) aparece tanto em Entrega quanto em Retirada — se "Filial responsável" citado aqui é o mesmo campo, a regra de ocultar em Retirada **não está implementada assim**; confirmar com Matheus se são campos diferentes ou se a regra mudou.
- Nomenclatura de pagamento: **COBRAR** (dinheiro, Pix ou maquininha — débito/crédito) vs. **PAGO** (crédito, débito ou Pix já processado).
- Tag **"Editado"** = pedido teve item removido ou substituído (consistente com o modelo já fechado em `PRD-edicao-pedidos-etapa-revisao.md`).
- Pedidos cancelados não mostram o status tracker — mostram o motivo do cancelamento no lugar.

### 6.7 Notificações (toast)

Modelo in-app apenas — **sem** WhatsApp automático nem central de notificações (seguem fora de escopo, seção 3).

- Toast fica fixo até o usuário fechar manualmente pelo "x" — não some sozinho.
- Se o usuário fechar a aba/tela e voltar a abrir, o toast reaparece enquanto o pedido continuar parado.
- Pedido sem movimentação por mais de 60 minutos gera o toast "Pedido parado" — visível em qualquer aba do Portal, não só na tela de Pedidos.
- Acima de 2 toasts simultâneos, agrupam em "Existem +N pedidos parados" (evita empilhar a fila de mensagens).
- Reincide a cada hora adicional parada (1h, 2h, 3h...).

**Importante: "qualquer aba do Portal" é literal, não só dentro do módulo de Operação.** O toast é global — aparece mesmo se o usuário estiver no módulo de Configuração (Estoque/Configurações de uma loja específica), que opera em contexto único. Não conflita com o modelo de módulos: o toast não depende do contexto selecionado na tela atual, só do fato de existir um pedido parado dentro do que o usuário tem acesso a ver.

### 6.8 Cancelamento de pedido

- **Ação disponível a partir de qualquer status do pedido, incluindo Concluído** — não fica restrita aos status ativos (Conferência até Liberados). **Confirmado por Matheus em 2026-09-24**, corrigindo a versão anterior deste documento, que dizia "Conferência até Liberados".
- Abre modal pedindo o motivo do cancelamento, **reaproveitando as opções já existentes no Portal hoje** (`Manual-Portal-Radar-Ecommerce.md`): Endereço incorreto, Cliente não estava no local indicado, Cliente não precisava mais dos itens, Cliente solicitou produto por engano, Pedido duplicado, Pedido atrasado, Pedido indisponível, Suspeita de fraude, Sem estoque. **Achado nos protótipos (Figma e Claude Design):** ambos incluem uma 10ª opção, "Teste interno", que não está na lista atual do Manual — apareceu de forma consistente nos dois lugares, então parece intencional; confirmar com Matheus antes de adicionar.
- O modal informa: "O cliente será notificado e o estorno processado" — cancelamento dispara notificação ao cliente e processamento de estorno (quando aplicável).
- **Exige confirmação** (é status final, mesma regra da seção 6.5) e não pode ser desfeito.
- Pedido cancelado registra quem cancelou e o motivo, exibido no lugar do status tracker (ver 6.6). **Verificado no protótipo:** confirmação de conclusão (Liberados → Concluído) segue exatamente o texto "Concluir pedido #[nº]? O pedido será finalizado e marcado como concluído. Esta ação não pode ser desfeita."

**Reforço sobre o cálculo do estorno — reaproveita o que já foi fechado em `PRD-edicao-pedidos-etapa-revisao.md` (seção 8.1):** se o pedido já sofreu um **estorno parcial** durante a Conferência (item removido/reduzido, com estorno automático via Braspag do valor da diferença — só se aplica a pedidos pagos no app), o cancelamento **não** deve estornar o valor original do pedido de novo. O cancelamento estorna só o **valor restante ainda não estornado** (total pago menos o que já foi devolvido no ajuste parcial). Isso vale mesmo quando o cancelamento acontece bem depois da Conferência (ex.: a partir de Concluído, ver acima) — o histórico de estornos parciais já realizados precisa ser consultado antes de calcular o valor do estorno total.

## 7. Cenários de borda

| Cenário | Regra |
|---|---|
| Busca retorna um pedido fora do período exibido na tela (ex.: pedido finalizado há 45 dias) | Comportamento esperado — a busca varre todo o histórico independente do limite de 30 dias dos finalizados. |
| Usuário troca o contexto (Rede/Loja/Grupo) numa tela do módulo de Operação | O contexto muda para todas as telas do módulo dentro da mesma sessão de navegação (Home, Pedidos, Promoções). |
| Loja pertence a um Grupo de lojas E o usuário desmarca essa loja individualmente | Checkbox do grupo cai para o estado parcial — não afeta outros grupos (uma loja pertence a no máximo 1 grupo). |
| Pedido está a 20 min de ficar atrasado, já atrasado, e/ou "parado" (+1h sem movimentação) | Os dois eixos (prazo × movimentação) são independentes e podem coexistir; a UI precisa deixar claro todos os estados que se aplicam, não substituir um pelo outro. |
| Pedido atrasado mas com movimentação recente (ex.: loja com tempo de entrega curto configurado) | Fica vermelho ("Atrasado") mesmo sem a tag "Parado" — os eixos não dependem um do outro. |
| Usuário tenta pular etapa (ex.: Na fila → Liberados), concluir (Liberados → Concluído) ou cancelar um pedido | Exibe diálogo de confirmação nos 3 casos da seção 6.5 (pular etapa, Conferência → Na fila, e qualquer transição para status final). |
| Usuário clica no cabeçalho de uma coluna sem ordenação (Prazo, Cliente, Status, Resumo, Tipo, Loja) | Nada acontece — só Data/Hora e Total são ordenáveis (seção 6.3). |
| Usuário cancela um pedido que já está Concluído, e esse pedido já teve estorno parcial durante a Conferência | Cancelamento é permitido; o estorno cobre só o valor restante (total pago menos o já estornado no ajuste parcial), não o valor original do pedido (ver 6.8). |
| Grupo com volume alto de lojas/pedidos simultâneos | Sem volumetria exata validada; hoje o grupo com melhor performance no app opera na faixa de 200 pedidos em tela (maioria já encerrados) sem problema. Poucos corner cases esperados de grupos com muitas lojas, mas **precisa de validação de engenharia antes do rollout amplo** (ver seção 9). |

## 8. Dependências de Design System (Alquimia UI)

Checados contra o repositório `alquimia-ds` (componentes existentes hoje: button, date-form, drawer, empty-state, header, input, input-counter, modal, multi-select-form, notification, radio, search, section, select-filter, select-form, spinner, tab, table, tag, timeline, tooltip):

- **Split button** (botão primário + chevron com menu de ação alternativa) — **não existe** hoje no `alquimia-ds`, precisa ser criado. Há uma implementação de referência funcional no protótipo Claude Design ("Validação de ideias") para usar como base visual.
- **Status tracker horizontal** (progresso do pedido por etapa) — **não existe** hoje no `alquimia-ds`; só existe `timeline` (vertical, usado na Trilha de Auditoria). Precisa ser criado ou avaliado se `timeline` pode ser adaptado. Idem: referência funcional já existe no protótipo Claude Design, incluindo o estado "atrasado" (etapa atual destacada em vermelho).
- Itens de handoff sinalizados pela própria UX, ainda sem componente/estado final fechado: hover do card, responsividade das células da tabela, novas tags, macro-abas. (Toast já tem regras de comportamento fechadas — seção 6.7 — mas falta checar se o componente `notification` do `alquimia-ds` cobre agrupamento e persistência, ou se também precisa de ajuste.)

Esses itens não bloqueiam o PRD, mas devem virar cards próprios de "criação de componente" antes ou em paralelo aos cards de tela que dependem deles.

## 9. Pendências / decisões em aberto

- **Modelo de SLA da Home de Indicadores:** percentual (modelo já usado em `ECP-1313`/`ECP-1318`) vs. minutos absolutos (modelo deste documento) — decisão separada, a ser tomada quando a Home entrar em pauta.
- **Volumetria real de pedidos/lojas simultâneas por grupo:** sem número validado; precisa de checagem de engenharia antes de fechar a estratégia de paginação/performance para grupos com muitas lojas.

### 9.1 Cruzamento com o Manual do Portal atual

Revisão do `Manual-Portal-Radar-Ecommerce.md` (estado atual do Portal em produção) contra este PRD, para identificar componentes/fluxos/regras de negócio existentes hoje que ainda não têm um destino claro no modelo novo (não inclui mudanças de navegação/UX, que são o próprio objetivo do redesenho).

- **Nuance de estorno por modalidade de pagamento (Pix/Cielo)** — **não entra neste ciclo**; segue a regra de negócio atual (Manual seção 8) sem alteração — decisão explícita de não abrir esse tópico agora.

## 10. Critérios de aceite (alto nível)

**Dado que** meu usuário tem vínculo com múltiplas lojas, **quando** eu seleciono um contexto (Rede, Grupo ou lojas específicas) numa tela do módulo de Operação, **então** esse mesmo contexto passa a valer em todas as outras telas do módulo (Home, Pedidos, Promoções) até eu trocar de novo.

**Dado que** estou na aba "Em andamento" da tela de Pedidos, **quando** a lista carrega, **então** vejo todos os pedidos ativos do contexto selecionado, sem limite de período, com ordenação disponível apenas para Data/Hora e Total.

**Dado que** estou na aba "Finalizados", **quando** a lista carrega, **então** só vejo pedidos concluídos/cancelados dos últimos 30 dias, com um indicador visual desse limite.

**Dado que** busco por um pedido fora da janela de 30 dias, **quando** o resultado retorna, **então** o pedido aparece normalmente, mesmo fora do período padrão exibido.

**Dado que** um pedido está a 20 minutos de ficar atrasado, **quando** eu vejo a listagem, **então** a linha/card aparece destacado em amarelo.

**Dado que** um pedido está há mais de 1 hora sem nenhuma movimentação, **quando** eu vejo a listagem, **então** ele aparece marcado como "Parado", independente do prazo de finalização.

**Dado que** o prazo estimado de entrega ou retirada de um pedido já passou, **quando** eu vejo a listagem ou o detalhe, **então** o pedido aparece destacado em vermelho como "Atrasado" — podendo coexistir com a tag "Parado".

**Dado que** clico para avançar um pedido de "Na fila" direto para "Liberados" (pulando "Em separação"), **quando** confirmo a ação, **então** vejo um diálogo de confirmação antes da mudança ser efetivada — diferente de um avanço sequencial normal, que não pede confirmação.

**Dado que** um pedido está em "Liberados" e clico em "Concluir pedido", **ou** clico em "Cancelar pedido" em qualquer status do pedido (incluindo Concluído), **quando** confirmo a ação, **então** vejo um diálogo de confirmação (ação irreversível de status final) antes da mudança ser efetivada; no caso do cancelamento, preciso antes selecionar um motivo dentre as opções já existentes no Portal, e o valor do estorno considera qualquer estorno parcial já feito durante a Conferência.

**Dado que** clico no cabeçalho da coluna Data/Hora ou Total, **quando** a lista reordena, **então** a ordenação é aplicada; **dado que** clico no cabeçalho de qualquer outra coluna (Prazo, Cliente, Status, Resumo, Tipo, Loja), **então** nada acontece.

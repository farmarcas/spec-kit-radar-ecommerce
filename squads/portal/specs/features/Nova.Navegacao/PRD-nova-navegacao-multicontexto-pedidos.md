# PRD — Nova Navegação do Portal: Multicontexto e Nova Visão de Pedidos

**Produto:** Radar (Portal do Lojista)
**Squad:** Portal
**Autor:** Matheus (PO/PM)
**Status:** Validado — em desenvolvimento
**Versão:** 2.16

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

**v1.8 (2026-09-24)** — Ajustes pós-daily de arquitetura/navegação (24/09): reconfirma "Parado" em 60 minutos fixos (a daily levantou 120 min, Matheus manteve 60 — sem personalização por loja neste ciclo); explicita que o filtro "Parados" cruza todos os status/etapas; adiciona fechamento automático do modal de detalhe ao chegar em status final (Concluído/Cancelado); reconfirma WhatsApp automático fora de escopo (mesmo com API da Meta voltando à mesa) e notificações em tempo real aprovadas só como base de arquitetura, sem central de notificações neste ciclo; esclarece que Produtos (sem contexto de Rede) e Banners (dentro de Gestão de Lojas, com contexto de Rede) não são a mesma coisa. **Nota maior, fora do PRD:** a daily confirmou construção de um **repositório novo do zero** para o Portal (não migração in-place) — isso muda a lógica de sequenciamento de entrega registrada nos épicos do Jira; ver memória do projeto para o novo modelo.

**v1.9 (2026-09-28)** — Adiciona o comportamento do bloco de identidade de Rede no header global (seção 5.1): se o usuário está vinculado a 1 única Rede, o header exibe a logo + nome dessa Rede (reaproveitando o asset já usado hoje) no lugar do seletor de Rede; se está vinculado a múltiplas Redes, exibe o seletor "Todas as Redes ▾" no lugar da logo fixa. Dentro da tela de Gestão de Lojas, o bloco de contexto (seletor de Loja, e de Rede quando multi-rede) é substituído pelo texto "Gestão de Lojas" — mas a logo de Rede única continua aparecendo quando aplicável.

**v2.0 (2026-10-01)** — Revalidação contra o **código-fonte real** do protótipo Claude Design "Validação de ideias" (arquivos `.jsx`/`.js` exportados, não só a UI renderizada). Fecha 3 pendências e reforça 2 regras que o código do protótipo tinha implementado errado:
- **Fecha a pendência do "Loja responsável"/"Filial responsável" (6.6):** são o mesmo conceito. Pra Retirada, o campo aparece dentro do container único de endereço/pagamento (rotulado "Loja responsável"); pra Entrega, existe um card dedicado "Loja responsável" que fica oculto na Retirada (esse já estava correto no protótipo — a pendência era só falta de clareza na nomenclatura entre os dois termos).
- **Confirma "Teste interno" como 10ª opção de motivo de cancelamento (6.8)** — estava nos dois protótipos de forma consistente; Matheus confirmou diretamente.
- **Reforça que "Conferência" não tem opção de pular etapa** (6.5) — só "Na fila → Liberados" é um pulo válido. O protótipo tinha implementado (por engano) um pulo de Conferência direto pra Liberados; Matheus confirmou que isso está errado e não deve ser considerado.
- **Reforça que não existe "Desfazer"/undo de status** (6.5) — o protótipo tinha um snackbar de "Desfazer" depois de avançar status; Matheus confirmou que essa funcionalidade não existe e não deveria estar lá (sobra de uma versão anterior do protótipo, não reflete decisão nenhuma).
- **Reforça o fechamento automático do modal em status final** (6.6) — o protótipo ainda não tinha essa implementação; comportamento confirmado como correto, prompt de ajuste já enviado pra incluir no protótipo.
- Adiciona textos exatos de confirmação por caso (6.5): Conferência→Na fila usa "Ao liberar este pedido para a separação, você não poderá mais fazer edições nos itens."; pular etapa usa "Ao confirmar, o sistema entende que os itens já foram separados fisicamente e o pedido estará pronto para [entrega/retirada]."; concluir usa o texto já documentado em 6.8.
- **Nota de arquitetura, fora do escopo de produto desta versão:** há uma mudança em estudo no modelo de notificação de pedido parado — um novo FAB substituiria o modelo de toast/banner atual (seção 6.7). Ainda sem desenho fechado; não alterar 6.7 até a UX fechar o formato.

**v2.1 (2026-10-02)** — Revalidação contra a nova versão do protótipo Claude Design e fechamento das regras de Pedidos que faltavam para a escrita das Histórias de desenvolvimento (agora fatiadas por elemento de tela, com front e back em cada card):
- **Filtro "Itens" (6.1.1):** a opção "Alto custo" foi retirada por decisão de produto; o grupo passa a ter "Só medicamentos" e "Com receita (Rx)".
- **Cliente recorrente (6.3):** estrela ao lado do nome do cliente para quem tem 20 ou mais pedidos concluídos na loja (CNPJ) do pedido, histórico completo, sem recorte por data. Só pedido concluído conta; a contagem é por loja.
- **Ícone Rx (6.3):** aparece na coluna Resumo quando o pedido tem arquivo de receita enviado — regra pelo envio do arquivo, sem cruzar com o cadastro do produto. Mesma regra do filtro "Com receita (Rx)".
- **Receitas no detalhe (6.6):** somente consulta e download, em todas as etapas, sem nenhum bloqueio, status ou alerta; nomes "Receita 1", "Receita 2"..., "Enviado em" = criação do pedido (ECP-1481 define a regra no Portal atual; vale também no Portal novo).
- **Exportar (6.2):** mantém a estrutura do relatório de pedidos atual; solicitação assíncrona enviada por e-mail, com períodos de 7, 30, 90 dias ou personalizado.
- **Estados de carregamento e erro (6.9):** skeleton, filtro lento, falha ao aplicar filtro, erro de página, troca de aba e falha de download passam a fazer parte das Histórias de construção da tela/tabela.
- **Fechamento automático do modal em status final (6.6):** implementado no protótipo.
- **Pendências do protótipo que continuam sem refletir a regra:** limite de "Parado" em 30 min (a regra é 60), snackbar "Desfazer" (não existe), estrela de cliente por flag fixa (a regra é a de cliente recorrente acima).

**v2.2 (2026-10-02)** — Fecha as regras que ficaram em aberto na v2.1:
- **Tag "Novo" (6.3):** pedido ainda não aberto (sem evento de visualização; não esteve em foco). Vale para pedidos ativos; a visualização é do pedido, não por usuário. Quando chegam pedidos novos com a tela aberta, a aba "Em andamento" ganha a tag "Novos" e o aviso "N novos pedidos chegaram".
- **Ordenação (6.3):** padrão de "Em andamento" por prazo — atrasados (vermelho, do mais atrasado ao menos), amarelos (do mais próximo de atrasar ao mais distante) e demais (do mais próximo de entrar no amarelo ao mais distante), aplicada sempre que o usuário entra na tela; padrão de "Finalizados" do encerramento mais recente ao mais antigo. Ordenação por clique segue restrita a Data/Hora e Total.
- **Filtro "Só medicamentos" (6.1.1):** pedido em que todos os itens são medicamento, conforme a classificação do catálogo (`IsMedicamento` em `CatalogueDb.products`).
- **"Teste interno":** a exclusão do motivo "Teste interno" vale só para os indicadores da Home. Listagem de Finalizados, contador e relatórios (inclusive o Exportar de Pedidos) exibem esses pedidos.
- **Segmentos sem contador (6.1):** o filtro segmentado não tem contador por opção; os contadores ficam só nas macro-abas "Em andamento" e "Finalizados".
- **Finalizados (6.1):** confirmado como concluídos e cancelados.

**v2.3 (2026-10-02)** — Fecha as pendências de ordenação e prazo:
- **Prazo/countdown (6.4):** o prazo-limite é a previsão de entrega/retirada calculada pelo **app** no fechamento do pedido (criação + tempo de retirada/entrega parametrizado pela loja no Portal, no fuso do consumidor; spec do App FR-047). A contagem parte sempre da criação; se a previsão ultrapassa o horário de funcionamento, vai para o próximo dia de funcionamento (ex.: amanhã às 09:00) e o countdown respeita essa data e hora.
- **Ordenação por clique (6.3):** passa a valer para **Prazo, Data/Hora e Total (valor)**; é um card separado da ordenação padrão.
- **Entrada na tela (6.3):** sempre que o usuário entra, os filtros da tela são refeitos e a ordenação padrão é aplicada.
- **Busca (6.2):** resultados com pedidos em aberto primeiro (ordem padrão dos abertos, por prazo) e depois os fechados (ordem padrão dos fechados, encerramento mais recente primeiro).

**v2.4 (2026-10-02)** — Movimentação de pedidos e atualização da lista:
- **Status final dentro do modal (6.5/6.6/6.8):** ao concluir ou cancelar, o modal permanece aberto por 5 segundos com a confirmação visual e fecha; só nesse momento o pedido sai de "Em andamento", passa para "Finalizados" e os contadores das duas abas são atualizados.
- **Navegação ◀ / ▶ após o pedido sair da lista (6.6):** segue a fila em aberto, na ordenação dos abertos — ▶ mostra o próximo pedido da fila em aberto e ◀ o anterior da fila em aberto; nunca volta ao pedido recém-fechado.
- **Atualização da lista (6.3):** a lista deve refletir quase em tempo real as mudanças dos pedidos (status, grupo, contadores, permanência na lista), por ações de outros atendentes, do ERP ou do cliente. Mecanismo e latência são decisão de engenharia; a chegada de pedidos novos segue o aviso "N novos pedidos chegaram".

**v2.5 (2026-10-02)** — **Ordenação por cabeçalho e busca (6.3):** a ordenação por clique é regra geral — refaz a listagem inteira ordenando pela coluna clicada, esteja ou não com busca ativa. Com busca ativa, vale para todos os resultados, misturando pedidos em aberto e fechados; a regra "abertos primeiro, fechados depois" é só a ordem padrão da busca.

**v2.6 (2026-10-05)** — **Comportamento da busca (6.2/6.3):** com busca ativa, a tela mostra uma lista única de resultados, de forma direta — as macro-abas (Em andamento/Finalizados) e o filtro segmentado ficam ocultos e voltam ao sair da busca; acima da tabela aparece a faixa "Resultados da busca para 'X'" com "N pedidos encontrados" e o botão "Todos os filtros". Os resultados respeitam só a ordenação (padrão: abertos por prazo, depois fechados por encerramento). Com busca ativa, a ordenação por cabeçalho vale para **Data/Hora e Total**; **Prazo não ordena** (a lista mistura tempo restante e data de encerramento). A tag "Buscando em todo o histórico" deixa de existir.

**v2.7 (2026-10-05)** — **Ordenação por Prazo na busca (6.3):** como a busca não tem barra segmentada nem abas, o Prazo volta a ordenar também na lista de resultados: ordena os pedidos em aberto pelo tempo restante e os fechados pela data de encerramento, mantendo abertos antes dos fechados; Data/Hora e Total ordenam a lista toda.

**v2.8 (2026-10-05)** — **Notificações (6.7) fechadas pela UX:** toasts empilhados em qualquer tela do Portal — "Pedido Atrasado" (temporário, um por pedido) e "Pedido parado" (persistente); até 3 individuais, a partir de 4 as 2 mais antigas + agrupador "Existem +N pedidos atrasados e/ou parados"; "Ver pedido" abre o detalhe e "Ver pedidos" abre Pedidos com os filtros Parado e Atrasado. O FAB em estudo deixa de existir. **Prazo-limite (6.4):** o Portal já recebe a previsão (`EstimateTimeFinish`) por pedido; sem dependência da squad do App. **Modal aberto (6.6):** pedido alterado por outra pessoa com o modal aberto atualiza o status tracker e exibe o toast de sucesso; com o modal fechado, a linha atualiza sem retorno visual.

**v2.9 (2026-10-05)** — **Modal de status final (6.5/6.6/6.8):** a duração com o modal aberto após concluir ou cancelar é de **5 segundos**. **Notificações (6.7):** o toast de pedido parado não traz a frase "Loja avisada via Whatsapp" — o texto é só tipo de pedido, nome do cliente e tempo sem movimentação, já que não existe aviso automático por WhatsApp.

**v2.10 (2026-10-05)** — **Decisão do PO:** o fechamento automático do modal de detalhe em status final (Concluído/Cancelado) deixa de existir — vale para as seções 6.5, 6.6 e 6.8; a duração de 5 segundos da v2.9 deixa de valer. O modal só fecha por ação do usuário. **Toasts (6.7):** o toast temporário de pedido atrasado some sozinho após **7 segundos**.

**v2.11 (2026-10-05)** — **Decisão do PO:** ao concluir ou cancelar, o pedido sai de "Em andamento" e passa para "Finalizados" imediatamente, com os contadores atualizados (seções 6.5, 6.6 e 6.8); a regra de sair da lista só quando o modal fecha deixa de valer. O modal de detalhe segue aberto até o usuário fechar, e ◀ / ▶ seguem a fila em aberto.

**v2.12 (2026-10-06)** — **Regras gerais e Gestão de Lojas (PO):** toda busca digitada (Pedidos, seletor de lojas, Gestão de Lojas) dispara ao digitar qualquer caractere com debounce de 2 segundos. Módulo de Operação é construído primeiro; o módulo de Configuração (incluindo as ações por loja "Estoque da loja"/"Configurações da loja", Anúncios do App, Nova loja, "Buscar rede"/"Exportar redes") fica em standby. Gestão de Lojas (5.4): header com logo da Rede + "Gestão de Lojas" (Figma), Balconista redirecionado para Pedidos ao tentar a rota, coluna "Grupo" sempre exibida, "Exportar lojas" exporta a Rede inteira no escopo do usuário.

**v2.13 (2026-10-06)** — **Handoff Figma e respostas do PO.** Aplica ao corpo as decisões da auditoria do handoff (Figma `Rk122pjyt9mhUX8tlfkBRy`) e as respostas do PO; valores do Figma (números, percentuais, durações de exemplo) não são regra.
- **Contexto (5.1, 5.2):** o contexto de trabalho passa a ser sempre dois seletores, **Redes** e **Lojas** (o menu único de 3 níveis deixa de existir); "Seleção por grupo" é um atalho dentro de Lojas e **não é desenvolvida agora**; "Reverter alterações" vira **"Restaurar padrão"** e é da multinavegação (não de Pedidos); Gestor de Rede com 1 Rede única vê a logo; o contador "marcadas/total" e o "Selecionar todos" contam as lojas de Ofertas independente da tela; "Limpar" nos painéis desmarca tudo. O header da Gestão de Lojas é do módulo de Configuração (standby) e sai do escopo de Operação.
- **Pedidos × Ofertas (5.2, 5.3):** usuário com lojas de Vendas e de Ofertas vê Pedidos; as lojas de Ofertas aparecem desabilitadas, com o aviso "Pedidos existem apenas para lojas de Categoria Vendas.", no painel de Lojas quando a tela é Pedidos (critério da criação da tela de Pedidos); usuário só com lojas de Ofertas não vê o item Pedidos (não há empty state por "só Ofertas"); acesso indevido por URL redireciona para a primeira tela a que o usuário tem acesso.
- **Sidebar e header (5.1, 5.6):** itens e agrupamentos do Figma (Indicadores, Pedidos, Promoções; "GESTÃO DE LOJAS": "Configuração & Estoque" e "Usuários"; "ÁREA ADMIN": "Produtos"); padrão colapsado com overlay só por hover; badge "Novos" + contador no item Pedidos; perfil Admin no menu do usuário = "Administração e Sistema"; menu do usuário existe, painel do sino não; tooltip "Ajuda" em desenho.
- **Tabela e listagem (6.1.1, 6.3):** sem colunas fixas (a tabela não precisa de scroll horizontal); sem coluna "Orig." (App/Portal); Prazo não é ordenável em Finalizados; painel de filtros com os grupos ITENS ("Só medicamentos", "Com receita"), TIPO DE PEDIDO, PRAZO, STATUS DO PAGAMENTO e MÉTODO DE PAGAMENTO, chips com check, rodapé "Limpar"/"Aplicar"; listagem e ordenação padrão entregues juntas (ECP-1515 + ECP-1563 unificados).
- **Novos pedidos (6.3):** sem âncora; snackbar "Pedidos novos adicionados à fila"; banner, title tag e sonora do legado persistem; badge "Novos" + contador na sidebar substitui o container "Novos pedidos aguardando" da Home.
- **Avanço de status (6.5):** os ícones de navegação do modal são ▲ / ▼ (não ◀ / ▶); diálogo de confirmação **só no pulo de etapa**, que inclui Conferência → Liberados (modal própria da Conferência); Conferência → Na fila e Concluir não têm diálogo; "Em separação" = "Liberar para entrega" (Entrega) / "Liberar para retirada" (Retirada); snackbar `Status atualizado para "X"` por 10 segundos, sem "Desfazer". Substitui as regras antigas de que Conferência não tem pular etapa e de que Conferência → Na fila e Concluir exigem confirmação.
- **Detalhe e cancelamento (6.6, 6.8):** botão de imprimir gera um PDF com os detalhes do pedido; "8º pedido" não entra; composição do total considera frete grátis, "Total (cobrar do cliente)", troco e pago online/offline; receitas como "Receita N", aviso amarelo informativo "Valide as receitas antes de liberar o pedido." sem regra nem bloqueio e "Baixar todos" só com mais de 1 receita; o modal de cancelamento não traz o aviso "O cliente será notificado e o estorno processado" (a regra de negócio continua); "Cancelado por" mostra "sistema" quando o cancelamento veio do ERP.
- **Toasts (6.7):** agrupamento a partir da 3ª notificação — 2 toasts individuais (os mais antigos) + 1 agrupador com N = total − 2, inclusive "+1 pedido atrasado e/ou parado" no singular.
- **Home de Indicadores (5.5):** lista aprovada de cards de Vendas e de Ofertas, ainda sem Figma (a UX atualiza esta semana); faixa etária, gênero e região ficam fora desta rodada; ECP-1512 quebrado em Filtro de GE e Macro-abas; o texto "Atualizado há 5 minutos" cai (pendente de confirmação).
- **Pendências novas (9):** 2ª linha da coluna Tipo em Finalizados; pill "N novos pedidos chegaram"; regra do contador do badge "Novos"; título da aba com contador × alternância; lupa × debounce; texto da modal Conferência → Liberados; itens extras do Figma no detalhe; empty states fora do Figma.
- **Limpeza:** removida a pendência do FAB em estudo (encerrada na v2.8) e corrigidos trechos antigos que contradiziam as decisões (ordenação restrita a Data/Hora e Total, critério "Prazo não ordena", empty state de loja de Ofertas, diálogo em 3 casos).

**v2.14 (2026-10-07)** — **Protótipo "Novo Portal - Navegável" (Claude Design) e cards de Home/Indicadores.** Cards em Backlog reajustados ao protótipo; cards em Pronto para Refinamento e conflitos com decisões do PO ficam em análise (não aplicados).
- **Indicadores (5.5):** Home de Vendas com cards por elemento (Total, Volume e Pedidos em aberto por status, Tempo médio do 1º atendimento, Tempo total de atendimento, Média de itens por cesta, Top produtos, Formas de pagamento, Métodos de entrega, Lojas com retirada em loja ativa), Cancelamentos (container, ECP-1605) separado do gráfico/total de cancelados (ECP-1547), Ruptura (Home e Detalhamento, incluindo o drawer do pedido editado, sem "Ir para o pedido" e com trilha só das alterações de produtos) e Ofertas (criadas, ativadas, conversão, vendas realizadas, PDV/App, top produtos ativados, lojas sem ofertas); faixa etária, gênero e região fora do recorte; GMV perdido = soma das linhas de produto do pedido cancelado, sem frete.
- **Pedidos (6.x):** tag "Parado" separada da coluna Prazo (ECP-1607: início da contagem em `CreatedAt`; só mudança real de status reinicia, de qualquer origem, inclusive ERP; Concluído/Cancelado não exibem a tag); listagem e ordenação padrão unificadas (ECP-1515); botão "N novos pedidos" + snackbar "Pedidos novos adicionados à fila" ao clicar (a confirmar); receitas independentes do cadastro do produto, aviso informativo sempre visível; busca com faixa de resultados; toasts com texto por etapa e agrupador por composição.
- **Em análise com o PO (não aplicado):** modal que fecha sozinho em 3 s com o pedido "segurado" na lista, "Desfazer" no snackbar, "Loja avisada via WhatsApp", atrasado em 8 s, "Delivery", "Administrador", rosca sem Conferência e filtro de GE para todos os perfis; edição de itens na Conferência como rascunho e frete grátis mantido ainda sem card.

**v2.15 (2026-10-07/08)** — **Decisão do PO: o protótipo "Novo Portal - Navegável" (Claude Design) é a referência e sobrepõe decisões anteriores de Pedidos.** Substitui a ressalva "em análise" da v2.14. Aplicado nas seções 5.1/5.6, 6.1, 6.3, 6.5, 6.6, 6.7, 6.8, na tabela de casos de borda, nas pendências (9) e nos critérios de aceite:
- **Modal em status final (6.5/6.6/6.8):** barra verde/vermelha "Pedido concluído/cancelado — O pedido será movido para Finalizados ao fechar." com "Fechar agora" e fechamento automático em 3 segundos; o pedido fica "segurado" na lista e nos contadores até o modal fechar; ▲ / ▼ pulam o pedido finalizado.
- **Diálogos e snackbar (6.5):** três diálogos (Conferência → Na fila, pular etapa para Liberados — o mesmo texto da Conferência e de Na fila —, Concluir pedido); snackbar `Status atualizado para "X"` com "Desfazer" por 5 segundos (não existe em Concluído nem no cancelamento); efeitos do "Desfazer" no back-end em aberto.
- **Cancelamento (6.8):** o modal traz "Selecione o motivo. O cliente será notificado e o estorno processado."
- **Notificações (6.7):** atrasado some em 8 segundos, com a etapa no texto; parado traz "Loja avisada via WhatsApp." (envio automático em aberto); agrupador com singular/plural e variações (atrasados e/ou parados).
- **Lista e shell (5.6, 6.1, 6.3):** painel de filtros com 360 px; "Cobrar" com ícone de recibo e tooltip "Cobrar"; estrela de cliente recorrente e tag Parado sem tooltip; Prazo não ordenável em nenhuma aba; botão "N novos pedidos" + snackbar de 4 segundos; sidebar com tag "Novos" e ponto vermelho de pedidos novos não visualizados, com a sidebar fechada (sem contagem); "Baixar todos" sempre visível; contador de Finalizados também com teto "+99"; subtítulo fixo da tela "Pedidos referentes às lojas da categoria Vendas"; 2ª linha do Tipo em Finalizados = "Hoje às HH:MM" ou "DD/MM às HH:MM" da conclusão/cancelamento.
- **Mantidos por decisão do PO:** debounce de 2 s na busca digitada, sem "Ir para o pedido" no drawer da Ruptura, rosca de pedidos em aberto com Conferência (a confirmar), texto de última atualização sem especificação.

**v2.16 (2026-10-13)** — **Respostas do PO sobre cards em Pronto para Refinamento.** Subtítulo da tela de Pedidos fixo ("Pedidos referentes às lojas da categoria Vendas"); tabela sem colunas fixas nem scroll horizontal; coluna Resumo com "Cobrar" (com troco: ícone de recibo e tooltip "Cobrar"); 2ª linha do Tipo em Finalizados = "Hoje às HH:MM" ou "DD/MM às HH:MM" da conclusão/cancelamento; tag Parado sem tooltip e abrir o pedido não conta como movimentação; ponto vermelho da sidebar e tag "Novos" referem-se a pedidos novos ainda não visualizados (card futuro); macro-aba "Loja de Ofertas" (Figma) com skeleton só no contêiner; seletor de período com "Hoje", "Últimos 7 dias", "Últimos 30 dias", "Últimos 3 meses", "Últimos 12 meses" e "Personalizado" (sem "Este mês"); estrela de cliente recorrente e posição do pedido ficam no card do cliente recorrente; imprimir em todas as etapas; sem bandeira do cartão; frete grátis é configuração da loja; o cliente não cancela pedido (sempre por ação no Portal).

---

## 1. Contexto

Hoje o Portal trata o contexto de loja/rede de forma isolada por tela: o seletor de Rede/Loja só existe na Home de Indicadores, e cada outro módulo (Pedidos, Promoções, Configurações) não compartilha esse filtro entre si. A tela de Pedidos especificamente não tem filtro, busca nem filtro global de lojas — uma lacuna sinalizada como prioridade Highest desde antes deste ciclo de planejamento (ver `squads/portal/product.md`).

Ao mesmo tempo, o Portal está sendo reestruturado em dois módulos com necessidades de contexto opostas:
- **Módulo de Operação** (Pedidos, Promoções): o usuário se beneficia de ver/agir sobre **múltiplas lojas ao mesmo tempo** — ex.: acompanhar pedidos de todas as lojas do seu grupo econômico numa lista só.
- **Módulo de Configuração** (Config, Estoque, etc.): só faz sentido operar **uma loja por vez** — não há leitura útil de "ver o estoque de duas lojas simultaneamente". Por isso a UX desenhou um **Hub de Lojas**: uma tela de entrada onde o usuário escolhe explicitamente qual loja quer configurar antes de entrar no módulo.

Este PRD documenta o modelo de contexto ("Multicontexto") que rege o módulo de Operação, e a primeira tela construída sobre esse modelo: a nova Visão de Pedidos em tabela.

## 2. Objetivo

1. Definir como o contexto de Redes e Lojas é selecionado e propagado dentro do módulo de Operação — hoje ele só afeta a Home; no modelo novo, afeta **todas** as telas do módulo (Home, Pedidos, Promoções) ao mesmo tempo.
2. Especificar a nova tela de Pedidos (listagem em tabela + detalhe), incluindo os filtros, a regra de exibição por período, o modelo de SLA e as regras de avanço de status.

## 3. Escopo

### Dentro do escopo (v1)
- Modelo conceitual de 2 módulos (Operação × Configuração) e a diferença de contexto (múltiplo × único) entre eles.
- Seletor de contexto de trabalho, sempre em dois seletores — **Redes** e **Lojas** — reaproveitando as regras já fechadas em `ECP-1281` (filtro dependente Rede→Loja), agora persistente em todo o módulo de Operação, com "Restaurar padrão". A "Seleção por grupo" dentro de Lojas (`ECP-1291`) não é desenvolvida agora.
- Nova Visão de Pedidos: macro-abas (Em andamento/Finalizados) + filtro segmentado por status, regra de exibição de pedidos ativos (sem limite de período) vs. finalizados (30 dias), busca (histórico completo, ignora o filtro de período).
- Painel avançado de filtros ("Todos os filtros"): Itens, Tipo de pedido, Prazo, Status de pagamento, Método de pagamento — ver seção 6.1.1.
- Colunas e comportamento da tabela de pedidos (linha inteira clicável, ordenação por Prazo, Data/Hora e Total).
- Detalhe do pedido: navegação anterior/próximo (▲ / ▼), avanço de status (confirmação só no pulo de etapa), modelo de SLA preditivo em minutos absolutos com 3 estados (amarelo/parado/atrasado).
- Home de Indicadores: apenas a lista de cards e as decisões já fechadas (seção 5.5); o detalhamento segue nas Histórias de cada card.
- Fluxo de cancelamento de pedido (motivo + confirmação), reaproveitando as opções já existentes no Portal hoje.
- Modelo de notificação em toast (persistência, agrupamento, escalonamento por hora) — sem WhatsApp automático nem central de notificações, que seguem fora de escopo (ver abaixo).

### Fora do escopo (v1)
- Localização do filtro de GE (Grupo Econômico) — hoje só visível para Admin; **definido em 2026-09-24**: fica dentro do header da tela de Indicadores ("Todos os GEs ▾", ao lado do seletor de período e do botão Exportar), não no header global do módulo de Operação (ver seção 9).
- Central de notificações e qualquer escalonamento automático via WhatsApp para pedido parado — descartado deste PRD por decisão explícita do PO. **Reconfirmado em 2026-09-23:** mesmo com anotações de handoff no protótipo mencionando WhatsApp automático após 2h parado, essa parte específica segue fora do escopo; o modelo de toast (seção 6.7) cobre só a notificação in-app.
- "Mover pedido para trás" (reverter status) — ainda é ideia da UX, sem desenho; não faz parte deste ciclo.
- O Módulo de Configuração em si (Hub de Lojas, fluxo "Gestão de lojas — Config e estoque juntos") — mencionado aqui só como contraponto conceitual; será detalhado em PRD próprio quando entrar em priorização.
- Fluxo de Promoções dentro do novo modelo de módulos — mesma lógica de multicontexto do módulo de Operação, mas os protótipos ainda não estão maduros o suficiente para detalhar aqui.
- "Seleção por grupo" (Grupo de lojas) dentro do seletor de Lojas — cascata, coluna e opção "sem grupo" não são desenvolvidas agora.
- Painel do sino de notificações — não existe ainda; o tooltip "Ajuda" está em desenho pela UX.
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
(dois seletores: Redes e Lojas)            (escolhe 1 loja antes de entrar)
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

- **Dois seletores, sempre: Redes e Lojas.** No header, dois botões — "Todas as Redes ▾" e "Todas as Lojas ▾" — cada um abre o próprio painel; não existe menu único de 3 níveis. O painel de Redes tem busca, "Selecionar todos", lista de Redes, contador "marcadas/total", "Limpar" e "Aplicar"; o painel de Lojas tem busca por nome ou CNPJ, "Selecionar todos", lista agrupada por UF com a etiqueta do módulo (Vendas/Ofertas), contador "marcadas/total", "Limpar" e "Aplicar".
- **Rede → Loja:** filtro dependente (`ECP-1281`) — marcar uma Rede refaz a lista de Lojas disponíveis no painel de Lojas. O efeito do "Aplicar" de Redes sobre as Lojas já aplicadas replica o comportamento do design.
- **"Limpar" desmarca tudo** nos dois painéis. O contador "marcadas/total" e o "Selecionar todos" **contam as lojas de Ofertas independente da tela** em que o usuário está.
- **Seleção por grupo (Grupo de lojas / Estoque Centralizado):** é um atalho de seleção **dentro do painel de Lojas** (`ECP-1291`) — **não é desenvolvida agora** (cascata, coluna "Seleção por grupo" e "sem grupo" ficam para depois).
- **Restaurar padrão:** link da multinavegação (não específico de Pedidos), visível quando o contexto aplicado (Redes/Lojas) é diferente do padrão; ao clicar, volta à seleção padrão.
- **Pedidos × Ofertas:** só lojas de Vendas geram Pedidos. Quando a tela é Pedidos, as lojas de Ofertas aparecem **desabilitadas** no painel de Lojas, com a faixa "Pedidos existem apenas para lojas de Categoria Vendas."; nas demais telas a lista traz Vendas e Ofertas. Esse critério é validado na criação da tela de Pedidos, não no card do filtro.
- **GE (Grupo Econômico):** filtro adicional, só para perfil Admin. **Definido em 2026-09-24:** fica no header da tela de Indicadores, não no header global do módulo de Operação.
- Erros, loading e estados vazios da lista de Redes/Lojas seguem o card do filtro (`ECP-1568`) e os critérios do `ECP-1281`; a paginação da lista é resolvida pelo backend.
- A busca digitada nos painéis dispara ao digitar, com debounce de 2 segundos, sem Enter.

**Navegação Lojas de Vendas × Loja de Ofertas dentro de Indicadores (definido em 2026-09-24):** as sub-abas simples "Vendas"/"Ofertas" do modelo atual (Manual seção 5) viram macro-abas com contador de lojas — ex.: "Lojas de Vendas (25)" / "Loja de Ofertas (2)". Indicadores segue fora do escopo detalhado deste PRD (mantido com os mesmos recursos de hoje), mas essa navegação interage com o seletor de contexto multicontexto: cada aba reflete só as lojas do módulo correspondente dentro do contexto (Redes/Lojas) selecionado.

**Mudança de comportamento em relação a hoje:** atualmente o contexto de Rede/Loja só é aplicado na Home de Indicadores. No modelo novo, o contexto selecionado passa a valer para **todo o módulo de Operação** — trocar de contexto em qualquer tela (Home, Pedidos, Promoções) atualiza as outras também, dentro da mesma sessão de navegação.

**Bloco de identidade de Rede e seletores no header do módulo de Operação:** o lado esquerdo do header varia conforme as Redes e as Lojas vinculadas ao usuário:
- **Gestor de Rede e Admin (várias Redes):** os dois botões "Todas as Redes ▾" e "Todas as Lojas ▾".
- **1 única Rede vinculada** (inclusive Gestor de Rede com uma Rede só): o botão de Redes dá lugar à logo + nome dessa Rede (ex.: "Acfarma ·"), reaproveitando o asset de logo já usado hoje no Portal, seguida do botão "Todas as Lojas ▾" — não existe seletor de Rede para escolher, já que só há uma opção.
- **1 Rede e 1 loja:** texto "Rede · Loja (Cidade)" (ex.: "Acfarma · Bocaiuva (Palotina)"), sem seletor.
- O header da Gestão de Lojas é do módulo de Configuração (em standby) e não faz parte do escopo de Operação (ver 5.4).

### 5.2 Contexto por funcionalidade

Confirmado em 2026-09-23 — mapeamento de qual tipo de seletor cada funcionalidade usa:

| Funcionalidade | Componente de contexto |
|---|---|
| Pedidos | Seletor multicontexto, com as lojas de Ofertas desabilitadas (só Vendas geram Pedidos) |
| Promoções | Seletor multicontexto |
| Indicadores (Home) | Seletor multicontexto |
| Usuários | Seletor multicontexto |
| Estoque | Seletor de uma loja |
| Configurações | Seletor de uma loja |
| Banners | Contexto de Rede (não de loja) — visível só para Admin |
| Produtos (Catálogo) | Sem seletor de contexto — visível só para Admin |

**Usuários entra no grupo multicontexto** — diferente do que a seção 5 registrava até aqui (que falava só em Pedidos/Promoções/Home para o módulo de Operação). Isso amplia o modelo: gerenciar usuários passa a ser possível através de múltiplas lojas/redes ao mesmo tempo, não só dentro de uma loja ou de uma Rede isolada como é hoje (ver `Manual-Portal-Radar-Ecommerce.md`, seção 11). Escopo por perfil, confirmado: **Admin** vê todos os usuários da plataforma; **Gestor de Rede** vê só os usuários vinculados à(s) sua(s) Rede(s). Estoque e Configurações confirmam o modelo de contexto único já descrito para o Módulo de Configuração.

**Pedidos e lojas de Ofertas:** só lojas no módulo **Vendas** geram Pedidos no Portal (ver `Manual-Portal-Radar-Ecommerce.md`, seção 3, "Módulo Vendas x Módulo Ofertas"). Regras fechadas em 2026-10-06:
- O usuário que tem lojas de Vendas **e** de Ofertas **vê o item Pedidos**; na tela de Pedidos as lojas de Ofertas ficam desabilitadas no painel de Lojas, com a faixa "Pedidos existem apenas para lojas de Categoria Vendas." (critério da criação da tela de Pedidos).
- O usuário que tem **só lojas de Ofertas não vê o item Pedidos** no menu; por isso não existe empty state por "só Ofertas".
- Se esse usuário abrir a rota de Pedidos por URL, vale a regra geral de acesso indevido (5.3): vai para a primeira tela a que tem acesso.

**Produtos (Catálogo) também não se encaixa no modelo multi/único de loja:** é um catálogo único, compartilhado entre todas as Redes da plataforma (`Manual-Portal-Radar-Ecommerce.md`, seção 12) — não existe "Rede/Loja" para filtrar, o cadastro é o mesmo pra todo mundo. Acesso exclusivo do Admin (regra já vigente hoje, seção 5.3).

**Atenção para não confundir Produtos com Banners (esclarecido em 2026-09-24):** o Admin continua precisando selecionar um contexto de Rede/Loja para navegar no Portal normalmente — isso não muda. A diferença é que **Produtos** é acessado direto pelo novo menu, sem depender de qual contexto está selecionado (o catálogo é o mesmo independente da Rede/Loja escolhida). **Banners é diferente** — continua vivendo dentro de Gestão de Lojas (seção 5.4), então precisa que o Admin esteja com uma Rede selecionada.

**Banners não se encaixa nos dois modelos (multi/único de loja):** o contexto dele é de **Rede**, consistente com o comportamento já existente hoje (Manual seção 10, tela só aparece no nível Rede) — mas a visibilidade muda: **fica restrita ao perfil Admin**. É uma redução deliberada em relação a hoje, onde Gestor de Rede também acessa Banners (Manual seção 2, menu de Rede inclui Banners) — confirmado por Matheus em 2026-09-23. Resolve a pendência 9.1 sobre onde Banners entra no modelo novo.

**Definição de tela confirmada (2026-09-24):** Banners não é destino próprio na sidebar — vive como aba **"Anúncios do App"** dentro da tela **"Gestão de Lojas"** (a mesma tela que resolve a pendência 9.1 sobre a antiga tela "Lojas" de nível Rede — ver seção 5.4). A outra aba dessa tela, **"Lojas da rede"**, é a listagem de lojas em si (Grupo, Telefone, Estado, Cidade, ERP conectado, Módulo ativado — igual ao Manual seção 3), com o botão de adicionar nova loja.

### 5.4 Gestão de Lojas (nomenclatura confirmada)

"Hub de Lojas", mencionado nas seções 3 e 5, é chamado na interface real de **"Gestão de Lojas"**. Confirmado em 2026-09-24 (print do protótipo): a tela tem 2 abas —
- **Lojas da rede** — listagem de lojas com Grupo, Telefone, Estado, Cidade, ERP conectado até, Módulo ativado, botão "Nova Loja", filtro por Módulo, atalho para Grupo de Lojas e Exportar Lojas. Equivale à tela "Lojas" de hoje (Manual seção 3).
- **Anúncios do App** — gestão de Banners (Admin only, ver acima).

O módulo de Configuração está em standby (Operação é construído primeiro); o header da Gestão de Lojas (logo da Rede, texto "Gestão de Lojas") pertence a esse módulo e fica fora do escopo de Operação — ver `Documentacao.Funcional/Modulo.Configuracao/Gestao-de-Lojas.md`.

### 5.3 Regras de acesso por perfil (módulo de Operação)

Confirmado em 2026-09-23:

- **Admin:** acessa tudo, com todas as Redes e Lojas disponíveis no seletor de contexto.
- **Gestor:** acessa tudo, mas o seletor de contexto só oferece as Redes/Lojas às quais está vinculado. Único menu que não acessa é o de Produtos/Catálogo — regra já vigente hoje (`Manual-Portal-Radar-Ecommerce.md`, seção 2: Catálogo é exclusivo do perfil Admin).
- **Balconista (Contato cliente):** não visualiza Indicadores (Home) — vê só Pedidos e Promoções. **Confirmado (2026-09-23): perde o acesso a Estoque** que tem hoje (Manual seção 2, menu reduzido = Pedidos/Promoções/Estoque) — é remoção intencional no modelo novo, não omissão.
- **Balconista em Promoções:** vê o menu, mas escopado só à própria loja (é o único perfil vinculado a 1 loja só, então na prática o seletor multicontexto não se aplica a ele aqui) e **sem ações destrutivas** (mesma regra já vigente hoje — vê a listagem completa e exporta relatório, mas não tem "Nova promoção", cancelar ou destacar oferta; Manual seção 9).
- **Acesso indevido por URL:** a rota que o perfil não pode acessar (ou cujo item de menu não aparece para ele) redireciona para a **primeira tela a que o usuário tem acesso**; esconder o item do menu não basta, a rota também é protegida.

**Hub de Lojas (Módulo de Configuração) também filtra por perfil, confirmado:** a listagem de lojas exibidas no Hub respeita o mesmo acesso do seletor de contexto — Admin vê todas as lojas da Rede, Gestor só as suas lojas vinculadas.

### 5.5 Home de Indicadores — cards aprovados (2026-10-06)

Indicadores segue sem redesenho detalhado neste PRD; cada card é uma História própria (1 card por elemento, com front e back). **Ainda não há Figma desses cards:** a UX atualiza o handoff nesta semana, então layout, rótulos e textos finais estão pendentes; os textos vindos do legado são "texto atual", não definição. Faixa etária, gênero e região ficaram **de fora desta rodada**. A Home tem a mesma estrutura em todos os perfis; ranking das lojas, região e lojas com retirada aparecem também para o Gestor de loja, que vê só os dados das próprias lojas.

- **Indicadores Vendas:** Ruptura de estoque (container na Home + tela de Detalhamento); Top produtos vendidos; Total de pedidos em aberto; Volume dos pedidos em aberto; Pedidos em aberto por status (rosca, **com Conferência**); Tempo médio para iniciar o primeiro atendimento; Tempo total de atendimento; Média de itens por cesta; Formas de pagamento; Métodos de entrega (legenda "Receber em casa" / "Retirada"); Loja sem delivery (= lojas com retirada ativa = lojas que oferecem **somente** retirada, sem entrega em domicílio).
- **Indicadores Ofertas:** Ofertas criadas; Ofertas ativadas; Taxa de conversão; Total de vendas realizadas; Conversão PDV/App; Top produtos ativados; Lojas sem ofertas.
- **Abas do gráfico:** "Faturamento", "Pedidos cancelados" e "Pedidos concluídos", cada uma com o total do período no cartão da aba (R$ no faturamento, contagem nas demais).
- **Container "Novos pedidos aguardando" não entra** na Home: é substituído pela tag "Novos" + ponto vermelho de pedidos novos não visualizados no item Pedidos da sidebar (5.6).
- O texto de última atualização da Home ("Atualizado há 5 minutos") cai; qualquer texto de atualização fica em aberto (9).
- Header da página: título "Indicadores", filtro de GE (só Admin), período e "Exportar", com as macro-abas "Lojas de Vendas [N]" / "Loja de Ofertas [N]"; o `ECP-1512` foi quebrado em dois: **Filtro de GE** e **Macro-abas**.
- Fora desta rodada, a decidir pelo PO: Ticket médio, estrutura/layout da Home, ranking das lojas, card "Cancelamentos" e Exportar pedidos faturados. O cartão "Volume dos pedidos cancelados" sai (não será criado).

### 5.6 Sidebar e header (Shell)

**Sidebar** (Figma, validada pelo PO): no topo, Indicadores, Pedidos (tag "Novos" e ponto vermelho quando há pedidos novos ainda não visualizados, com a sidebar fechada, sem contagem) e Promoções; seção **"GESTÃO DE LOJAS"** com "Configuração & Estoque" (item único, leva à Gestão de Lojas) e "Usuários"; seção **"ÁREA ADMIN"** com "Produtos" (só Admin). Padrão **colapsado** (64 px), com overlay de menu aberto (288 px) acionado **somente por hover** (sem toque nem teclado). O ECP-1495 trata só a exibição/ocultação dos itens conforme o perfil, inclusive o menu de Configuração; as regras da tag "Novos" e do ponto vermelho ficam para a construção da tela de Pedidos (ECP-1562). O item Pedidos não aparece para o usuário só com lojas de Ofertas (5.2).

**Header, lado direito:** sino de notificações (sem painel por enquanto), ajuda ("?", tooltip "Ajuda" em desenho pela UX) e menu do usuário (já desenhado), com nome e perfil. O rótulo do perfil Admin no menu do usuário segue o nome do perfil do sistema, **"Administração e Sistema"** (pode truncar).

## 6. Nova Visão de Pedidos (tabela)

### 6.1 Estrutura de filtros da listagem

Dois níveis, no formato de segmented bar (navbar + filtro de opções):

- **Macro-abas:** "Em andamento (N)" / "Finalizados (N)" — contam quantos pedidos existem em cada bucket dentro do contexto selecionado.
- **Filtro segmentado dentro de "Em andamento":** Todos / Conferência / Na fila / Em separação / Liberados — single-select, funcionam como filtro da listagem (não trocam de tela). Default: "Todos".
- **Filtro segmentado dentro de "Finalizados":** Todos / Concluídos / Cancelados, com um badge "Limite 30 dias" ao lado.
- Os segmentos **não têm contador**; os contadores ficam só nas macro-abas.

### 6.1.1 Painel avançado de filtros ("Todos os filtros")

Confirmado para v1, com os rótulos do Figma. Botão "Todos os filtros" abre um painel com 5 grupos (rótulos em caixa alta, seleção múltipla por chips, aplicação em conjunto; rodapé fixo com "Limpar" e "Aplicar"):

- **ITENS:** "Só medicamentos" (pedido em que todos os itens são medicamento, conforme `IsMedicamento` do catálogo de produtos), "Com receita".
- **TIPO DE PEDIDO:** Entrega, Retirada.
- **PRAZO:** Atrasado, 20 min para atrasar, Em tempo, Parado.
- **STATUS DO PAGAMENTO:** Pago, Cobrar, Com troco.
- **MÉTODO DE PAGAMENTO:** Pix, Dinheiro, Maquininha.

Chip selecionado com borda azul e ícone de check. O painel tem 360 px de largura e o conteúdo, no máximo cerca de 440 px de altura, com rolagem interna (o rodapé permanece visível). Filtros ativos aparecem como badges removíveis acima da tabela, com a quantidade de filtros no botão "Todos os filtros" (bolinha com o número) e a opção "Limpar filtros".

### 6.2 Regra de exibição por período

- **Pedidos ativos** (qualquer status de "Em andamento"): **sem limite de período** — aparecem na listagem até mudarem de status, não importa há quanto tempo foram criados.
- **Pedidos finalizados** (Concluídos/Cancelados): só os dos **últimos 30 dias** aparecem na listagem por padrão. Passado esse limite, o pedido some da lista.
- **Busca:** o campo de busca (nome do cliente, CPF, nome da loja, CNPJ da loja, nº do pedido) dispara ao digitar qualquer caractere, com debounce de 2 segundos e sem Enter, e varre **todo o histórico**, ignorando completamente o limite de 30 dias — é a via de acesso a qualquer pedido finalizado mais antigo. Os resultados mostram primeiro os pedidos em aberto (ordem padrão dos abertos, por prazo) e depois os fechados (ordem padrão dos fechados). Com busca ativa a tela mostra uma lista única de resultados — macro-abas e filtro segmentado ficam ocultos e voltam ao sair da busca — com a faixa "Resultados da busca para 'X'" e "N pedidos encontrados".
- **Exportar:** botão "Exportar" no cabeçalho solicita o relatório de pedidos do contexto selecionado, mantendo a estrutura do relatório atual — períodos "Últimos 7 dias", "Últimos 30 dias", "Últimos 90 dias" ou "Personalizado"; geração assíncrona, resultado enviado por e-mail ao usuário.
- **Empty state:** 4 cenários do protótipo (sem desenho no Figma) — (1) Gestor sem pedidos ativos no contexto selecionado (CTA "Criar nova promoção"); (2) Balconista sem pedidos na fila; (3) filtro/aba aplicada sem resultado (CTA "Exportar relatório" / "Resetar filtros aplicados"); (4) busca sem correspondência, com aviso explícito de que a busca varreu todo o histórico ("A busca passou por todo o histórico, independente do período") e CTA "Limpar busca" / "Resetar filtro incluído".

### 6.3 Colunas e comportamento da tabela

- Colunas conforme protótipo validado: Prazo, Data/Hora, Cliente, Status, Resumo, Tipo, Loja, Total (mesma base já especificada em `ECP-1312`).
- A tabela não precisa de scroll horizontal e, por isso, não há colunas fixas; a última coluna é a **coluna da seta ">"** de abrir o detalhe. Não há coluna "Orig." (App/Portal) por enquanto.
- Toda a área da linha é clicável e abre o detalhe do pedido — não só um botão/ícone específico.
- **Variantes de pedido** que a tabela, o detalhe e os tooltips consideram: pago online, pago offline ("Cobrar"), entrega, retirada, frete grátis, troco, cliente recorrente, parado, atrasado, editado, receita (Rx) e novo.
- **Resumo:** quantidade de itens, "(editado)" quando houve item removido ou substituído, "Rx" quando há receita e a situação do pagamento — "Pago" (com check) ou "Cobrar"; o texto é "Cobrar" independentemente da forma de pagamento; com troco, "Cobrar" com o ícone de recibo e o tooltip "Cobrar".
- **Tooltips da linha (Figma):** "Rx" = "Receita obrigatória"; "Cobrar" com troco = "Cobrar"; a tag Parado (ECP-1607) e a estrela de cliente recorrente não têm tooltip.
- **Cliente recorrente:** estrela ao lado do nome do cliente quando ele tem 20 ou mais pedidos concluídos (`Delivered`/`Withdrawn`) na loja (CNPJ) do pedido, considerando todo o histórico, sem recorte por data. A contagem é por loja: o mesmo cliente pode ser recorrente em uma loja e não em outra.
- **Ícone Rx:** na coluna Resumo, ao lado da quantidade de itens, quando o pedido tem arquivo de receita enviado pelo app. A regra é pelo envio do arquivo, não pelo cadastro do produto (a lógica de exigência de receita está no app).
- **Tag "Novo":** pedido ainda não aberto (sem evento de visualização), ao lado do horário na coluna Data/Hora; a visualização é do pedido (o primeiro atendente que abre o marca para todos) e a tag some ao abrir o detalhe.
- **Chegada de pedidos novos:** com a tela aberta, a chegada de pedidos novos coloca a tag "Novos" na aba "Em andamento" e exibe o botão **"N novos pedidos"** acima da tabela (oculto durante a busca); ao clicar, os pedidos novos entram na lista, a tela volta a "Em andamento" / "Todos" / sem busca, rola até o início da lista se ele estiver fora da área visível e aparece o snackbar **"Pedidos novos adicionados à fila"** por 4 segundos. As notificações que já existem no legado **persistem**: banner (com a notificação do navegador), title tag (o título da aba alterna com "[NOVO PEDIDO]") e notificação sonora. Em paralelo, o item Pedidos da sidebar mostra a tag "Novos" e, quando há pedidos novos ainda não visualizados com a sidebar fechada, um ponto vermelho (sem contagem); isso **substitui o container "Novos pedidos aguardando" da Home**. A condição de exibição da tag "Novos" e a forma do título da aba estão em aberto (9).
- **Atualização da lista:** com a tela aberta, a lista reflete quase em tempo real as mudanças dos pedidos já listados (status, saída de "Em andamento" para "Finalizados", saída do segmento/filtro ativo, contadores); a ordenação não é refeita por essas atualizações. Como os pedidos novos entram na lista está em aberto (9).
- **Ordenação por cabeçalho (regra geral):** clicar em Data/Hora ou Total refaz a listagem inteira ordenada pela coluna, com ou sem busca; na busca, abertos e fechados se misturam (a regra "abertos primeiro" é só a ordem padrão). **O cabeçalho de Prazo não é ordenável em nenhuma aba** (a ordem por prazo é a ordem padrão de "Em andamento"; "Finalizados" segue a ordem padrão por encerramento).
- **Entrada na tela:** sempre que o usuário entra, os filtros da tela são refeitos (aba "Em andamento", segmento "Todos", sem filtros do painel e sem busca) e a ordenação padrão é aplicada.
- **Ordenação padrão** (entregue junto com a criação da listagem; aplicada sempre que o usuário entra na tela): "Em andamento" por prazo — primeiro os atrasados (do mais atrasado ao menos atrasado), depois os amarelos (do mais próximo de atrasar ao mais distante), depois os demais (do mais próximo de entrar no amarelo ao mais distante); "Finalizados" do encerramento (conclusão/cancelamento) mais recente ao mais antigo.
- **Sem ordenação por coluna, com exceção de Data/Hora e Total (valor)** — essas colunas são ordenáveis (clique no cabeçalho); as demais (Prazo, Cliente, Status, Resumo, Tipo, Loja) seguem a regra já fechada para a Lista de Termos Buscados (`ECP-1339`) e não reordenam a lista.

### 6.4 Modelo de SLA e prazo (preditivo, não reativo)

Decisão explícita: nesta tela o objetivo é deixar claro, **de forma preditiva**, quais pedidos vão precisar de atenção — não só reagir depois que já atrasou. Por isso o modelo usa **minutos absolutos**, não percentual do SLA:

Modelo de semáforo com 3 estados, em 2 eixos independentes:

**Eixo 1 — prazo de entrega/retirada (cor da linha):**
- **Amarelo** → faltando **20 minutos** para o prazo estimado de entrega/retirada — ou seja, 20 minutos antes do momento exato em que o pedido passa a ficar "Atrasado" (é a mesma referência de tempo; a v1.1 tinha usado por engano um termo diferente, "prazo de finalização", que não existe no modelo — ver changelog v1.2).
- **Vermelho ("Atrasado")** → o pedido já excedeu o tempo de entrega/retirada. Cada loja pode ter uma configuração diferente desse tempo (ex.: default de 30 min) — **todo pedido atrasado fica vermelho**, independente de estar "Parado" ou não.

**Eixo 2 — movimentação (tag "Parado", não muda a cor da linha por si só):**
- **"Parado"** → pedido sem nenhuma movimentação por **mais de 1 hora (60 minutos fixos)**. **Reconfirmado em 2026-09-24** (daily de arquitetura levantou 120 min como possível padrão — Matheus manteve 60 min fixos). Sem personalização por loja neste ciclo — fica para 2027.
- **O filtro "Parados" cruza todos os status** — um pedido parado pode estar em Conferência, Na fila, Em separação ou Liberados; o recorte "Parados" (painel "Todos os filtros", seção 6.1.1) traz os pedidos parados de **qualquer** uma dessas etapas juntos, não fica preso a uma coluna/status específico.

**Os dois eixos são independentes** — um pedido pode estar atrasado sem estar parado (chegou uma movimentação recente, mas a loja configurou um tempo de entrega curto e ele já estourou) e pode estar parado sem estar atrasado (loja com tempo de entrega mais longo, ainda dentro do prazo, mas sem toque há 1h+). Quando os dois se aplicam ao mesmo tempo, a UI mostra os dois (linha vermelha + tag "Parado").

**Nota:** a Home de Indicadores pode acabar usando um modelo diferente (percentual do SLA, como já especificado em `ECP-1313`/`ECP-1318`) — essa é uma decisão separada, a ser tomada quando a Home entrar em pauta neste mesmo ciclo. Os dois modelos não precisam ser idênticos.

### 6.5 Avanço de status do pedido

- Ação principal: **botão split** — um botão primário com a ação da etapa (avançar 1 etapa sequencial) e um chevron acoplado que abre um menu com a alternativa de **pular direto para "Liberados"**. O botão primário por etapa (Figma):
  - **Conferência:** "Liberar para fila" (com chevron — pular para Liberados);
  - **Na fila:** "Separar pedido" (com chevron: menu "PULAR DIRETO PARA" → "Liberados", com o texto de apoio "Ignorar a separação e marcar como pronto");
  - **Em separação:** "Liberar para entrega" em pedido de Entrega e "Liberar para retirada" em pedido de Retirada;
  - **Liberados:** "Concluir pedido" (botão verde).
- **Diálogos de confirmação (três):** Conferência → Na fila — título "Liberar pedido para a fila", texto "Ao liberar este pedido para a separação, você **não poderá mais fazer edições** nos itens.", botões "Cancelar" e "Confirmar"; pular etapa para Liberados (Conferência → Liberados e Na fila → Liberados, o mesmo diálogo) — título "Avançar pedido direto para Liberados?", texto "Ao confirmar, o sistema entenderá que os itens já foram separados fisicamente e o pedido está **pronto para entrega**" (ou "**pronto para retirada**", conforme o tipo), botões "Voltar" e "Sim, avançar pedido"; Liberados → Concluído — título "Concluir pedido #<nº>?", texto "O pedido será finalizado e marcado como concluído. Esta ação não pode ser desfeita.", botões "Cancelar" e "Concluir pedido". Na fila → Em separação e Em separação → Liberados são diretos, sem diálogo.
- **Cancelamento** tem a própria modal de motivo (6.8); não há diálogo adicional.
- **Snackbar após cada transição intermediária** (Conferência → Na fila, Na fila → Em separação, Em separação → Liberados e o pulo para Liberados): `Status atualizado para "<novo status>"` com a ação **"Desfazer"**, por **5 segundos**; ao desfazer, o pedido volta ao status anterior e aparece `Status voltou para "<status anterior>"` por 3,2 segundos. Concluir e cancelar não têm snackbar nem "Desfazer". Os efeitos do "Desfazer" no back-end (por exemplo, após a entrada em "Na fila", gatilho de captura pelo ERP) estão em aberto (ECP-1517).
- **Reverter status ("mover para trás") além do "Desfazer"** não está desenhado e não faz parte deste PRD.

### 6.6 Detalhe do pedido

- Abre como modal, largura máxima 1180px, altura dinâmica de até 90% da viewport.
- Navegação **▲ (anterior) / ▼ (próximo)** dentro do próprio modal, sem precisar fechar e reabrir — desabilitada no primeiro e no último pedido da lista carregada.
- Barra superior do modal: botões ▲ ▼, título "Pedido #<número>", botão de **imprimir** (gera um **PDF com os detalhes do pedido**) e botão "x" para fechar. O "8º pedido" do card Cliente no Figma não entra.
- Variantes de pedido consideradas no detalhe: frete grátis, troco, pago online e pago offline (Cobrar), entrega e retirada. A composição do total mostra subtotal, taxa de entrega (valor ou "Grátis" quando o frete é grátis; oculta na Retirada) e "Total (cobrar do cliente)" (na Retirada, "Total"); com troco, o valor pago pelo cliente e o troco.
- Comportamento condicional por tipo de entrega: **Retirada** oculta o campo de taxa de entrega. **"Loja responsável" = "Filial responsável" (resolvido 2026-10-01):** é o mesmo conceito, só exibido em lugares diferentes conforme o tipo. Pra **Retirada**, o campo aparece dentro do container único de endereço/pagamento (rotulado "Loja responsável", junto com CNPJ e endereço da loja). Pra **Entrega**, existe um card lateral dedicado "Loja responsável" — esse card fica **oculto na Retirada** (porque a informação já está no container principal), não duplicado.
- Nomenclatura de pagamento: **COBRAR** (dinheiro, Pix ou maquininha — débito/crédito) vs. **PAGO** (crédito, débito ou Pix já processado).
- Tag **"Editado"** = pedido teve item removido ou substituído (consistente com o modelo já fechado em `PRD-edicao-pedidos-etapa-revisao.md`).
- Pedidos cancelados não mostram o status tracker — mostram a caixa "Pedido cancelado" com o motivo do cancelamento e quem cancelou ("Cancelado por"; quando o cancelamento veio do ERP/automático, mostra **"sistema"**).
- **Modal em status final (Concluído ou Cancelado):** o modal permanece aberto e exibe, abaixo da barra superior, a barra verde "Pedido concluído" ou vermelha "Pedido cancelado" ("O pedido será movido para Finalizados ao fechar."), com o botão "Fechar agora" e uma linha de progresso de 3 segundos; ao fim dos 3 segundos o modal fecha sozinho (também fecha por "Fechar agora", "x", Esc ou clique fora). Enquanto está aberto, o pedido fica "segurado" na lista e nos contadores de "Em andamento" com o estado anterior; ao fechar, passa para "Finalizados" e os contadores das duas abas são atualizados. A navegação ▲ / ▼ pula o pedido finalizado e segue a fila em aberto (próximo/anterior), cancelando o fechamento automático.
- **Receitas médicas:** seção "Receita médica (Rx)" aparece em **todas as etapas** quando o pedido tem receita enviada pelo app. Cada receita é nomeada "Receita 1", "Receita 2"... (ordem de envio, nunca o nome do arquivo), com "Enviado em" igual à data/hora de criação do pedido; ações: baixar cada receita ou "Baixar todos" (sempre visível quando há receita, inclusive com 1) — o Portal não abre preview. A seção traz o aviso amarelo **"Valide as receitas antes de liberar o pedido."**, apenas **informativo**, sem regra, lógica nem bloqueio. É somente consulta: **não bloqueia** avançar, imprimir ou cancelar o pedido, e não gera status nem badge. Regra já vigente no Portal atual pela ECP-1481 e no PRD do App (`specs/features/001-app-ecommerce/Envio de receita/PRD-envio-receita-app.md`, 6.4 e 6.10).

### 6.7 Notificações (toast)

Modelo in-app apenas — sem central de notificações (fora de escopo deste ciclo); o toast de pedido parado traz o texto "Loja avisada via WhatsApp." conforme o protótipo, e o envio automático ao WhatsApp da loja está em aberto (ECP-1518). Base de notificações em tempo real (websocket/push, não polling) aprovada como direção de arquitetura.

- **Pedido Atrasado** (vermelho): "Pedido para [retirada/entrega] de [cliente] acabou de exceder o tempo limite de [etapa]." (etapa: "conferência", "início da separação", "separação" ou "entrega"/"retirada") + "Ver pedido". Temporário (some sozinho após 8 segundos), um por pedido.
- **Pedido parado** (amarelo): pedido sem movimentação por mais de 60 minutos — "Pedido para [retirada/entrega] de [cliente] com 1 hora sem movimentação. Loja avisada via WhatsApp." + "Ver pedido". Persistente: fica até o usuário fechar pelo "x" e reaparece ao reabrir a aba/tela enquanto continuar parado; reincide a cada hora adicional parada.
- **Agrupamento (a partir da 3ª notificação):** aparecem até **2** toasts individuais (os 2 primeiros da ordem, atrasados antes de parados) e 1 agrupador com "Ver pedidos", com N = total − 2; o texto é "Existem +N pedidos atrasados e/ou parados" (mistura), "...atrasados" ou "...parados"; com N = 1, "Existe +1 pedido atrasado" ou "Existe +1 pedido parado". Ex.: 3 notificações = 2 individuais + "+1"; 5 pedidos parados = 2 individuais + "Existem +3 pedidos parados".
- **Navegação:** "Ver pedido" abre o detalhe; "Ver pedidos" abre a tela de Pedidos com os filtros de Parado e Atrasado ativados.

**Importante: "qualquer tela do Portal" é literal, não só dentro do módulo de Operação.** O toast é global — aparece mesmo se o usuário estiver no módulo de Configuração (Estoque/Configurações de uma loja específica), que opera em contexto único. Não conflita com o modelo de módulos: o toast não depende do contexto selecionado na tela atual, só do fato de existir um pedido atrasado ou parado dentro do que o usuário tem acesso a ver.

### 6.8 Cancelamento de pedido

- **Ação disponível a partir de qualquer status do pedido, incluindo Concluído** — não fica restrita aos status ativos (Conferência até Liberados). **Confirmado por Matheus em 2026-09-24**, corrigindo a versão anterior deste documento, que dizia "Conferência até Liberados".
- Abre modal pedindo o motivo do cancelamento. Lista de motivos (**10 opções, confirmada em 2026-10-01**): Endereço incorreto, Cliente não estava no local indicado, Cliente não precisava mais dos itens, Cliente solicitou produto por engano, Pedido duplicado, Pedido atrasado, Pedido indisponível, Suspeita de fraude, Sem estoque, **Teste interno**. As primeiras 9 já existem no Portal hoje (`Manual-Portal-Radar-Ecommerce.md`); "Teste interno" é a adição confirmada por Matheus (apareceu de forma consistente em ambos os protótipos antes da confirmação).
- O modal tem ícone de cancelamento, título "Cancelar pedido: #<número>", a lista de motivos (seleção única) e os botões "Cancelar" e "Confirmar cancelamento" (este bloqueado até um motivo ser escolhido). O modal traz o texto "Selecione o motivo. O cliente será notificado e o estorno processado."; o cancelamento dispara notificação ao cliente e processamento de estorno (quando aplicável).
- O modal de motivo é a confirmação do cancelamento (é status final) — não há outro diálogo — e a ação não pode ser desfeita; depois de confirmar, vale a barra "Pedido cancelado" com fechamento em 3 segundos (6.6).
- Pedido cancelado registra quem cancelou e o motivo, exibidos na caixa "Pedido cancelado" no lugar do status tracker (ver 6.6); "Cancelado por" mostra "sistema" quando o cancelamento veio do ERP/automático. A conclusão (Liberados → Concluído) tem o diálogo "Concluir pedido" (6.5).

**Reforço sobre o cálculo do estorno — reaproveita o que já foi fechado em `PRD-edicao-pedidos-etapa-revisao.md` (seção 8.1):** se o pedido já sofreu um **estorno parcial** durante a Conferência (item removido/reduzido, com estorno automático via Braspag do valor da diferença — só se aplica a pedidos pagos no app), o cancelamento **não** deve estornar o valor original do pedido de novo. O cancelamento estorna só o **valor restante ainda não estornado** (total pago menos o que já foi devolvido no ajuste parcial). Isso vale mesmo quando o cancelamento acontece bem depois da Conferência (ex.: a partir de Concluído, ver acima) — o histórico de estornos parciais já realizados precisa ser consultado antes de calcular o valor do estorno total.

### 6.9 Estados de carregamento e erro

- **Troca de aba (Em andamento/Finalizados):** spinner sobre a lista durante a carga, limitado à área de conteúdo (cabeçalho, macro-abas e barra de filtros continuam visíveis); o filtro segmentado volta para "Todos".
- **Aplicação do filtro do header:** skeleton em macro-abas e tabela (8 linhas, mesmas colunas da tabela) até a resposta.
- **Filtro lento (mais de 8 s):** aviso persistente "Ainda carregando..." com "Tentar novamente" e botão de fechar.
- **Falha ao aplicar o filtro:** o filtro volta à seleção anterior e aparece aviso persistente "Não foi possível aplicar o filtro" com "Tentar novamente".
- **Falha ao carregar a página:** tela "Não foi possível carregar essa página" / "Verifique sua conexão e tente novamente." com "Tentar novamente".
- **Falha ao carregar a lista de lojas do filtro:** o próprio painel mostra "Não foi possível carregar suas lojas" / "Verifique sua conexão e tente novamente" e o seletor continua mostrando a última seleção válida (escopo do Filtro Multicontexto: card `ECP-1568` e critérios do `ECP-1281`).
- **Download de receita:** "Baixando arquivo..." com spinner no item; ao concluir, o ícone de check fica por 3 segundos e o snackbar "Download concluído" aparece; em falha, o item fica com borda vermelha e "Não foi possível baixar. Tente novamente." com ícone de recarregar, mais o snackbar "Erro ao baixar. Verifique a sua conexão."

## 7. Cenários de borda

| Cenário | Regra |
|---|---|
| Busca retorna um pedido fora do período exibido na tela (ex.: pedido finalizado há 45 dias) | Comportamento esperado — a busca varre todo o histórico independente do limite de 30 dias dos finalizados. |
| Usuário troca o contexto (Redes/Lojas) numa tela do módulo de Operação | O contexto muda para todas as telas do módulo dentro da mesma sessão de navegação (Home, Pedidos, Promoções). |
| Contexto aplicado diferente do padrão | Aparece "Restaurar padrão" na multinavegação; ao clicar, volta à seleção padrão. |
| Usuário com lojas de Vendas e de Ofertas abre Pedidos | Vê Pedidos; no painel de Lojas as lojas de Ofertas ficam desabilitadas, com a faixa "Pedidos existem apenas para lojas de Categoria Vendas."; o contador "marcadas/total" continua contando as lojas de Ofertas. |
| Usuário só com lojas de Ofertas | O item Pedidos não aparece no menu; se abrir a rota por URL, vai para a primeira tela a que tem acesso. Não há empty state por "só Ofertas". |
| Usuário acessa por URL uma rota que o perfil não pode abrir | Redireciona para a primeira tela a que o usuário tem acesso. |
| Pedido está a 20 min de ficar atrasado, já atrasado, e/ou "parado" (+1h sem movimentação) | Os dois eixos (prazo × movimentação) são independentes e podem coexistir; a UI precisa deixar claro todos os estados que se aplicam, não substituir um pelo outro. |
| Pedido atrasado mas com movimentação recente (ex.: loja com tempo de entrega curto configurado) | Fica vermelho ("Atrasado") mesmo sem a tag "Parado" — os eixos não dependem um do outro. |
| Usuário pula etapa (Na fila → Liberados ou Conferência → Liberados) | Exibe o mesmo diálogo "Avançar pedido direto para Liberados?" nos dois casos (seção 6.5). |
| Usuário avança Na fila → Em separação ou Em separação → Liberados | Sem diálogo; snackbar `Status atualizado para "X"` com "Desfazer" por 5 segundos. Conferência → Na fila e Liberados → Concluído têm diálogo (6.5); a conclusão não tem snackbar. |
| Usuário cancela um pedido | Abre a modal de motivo (confirmação do cancelamento), sem diálogo adicional (seção 6.8). |
| Usuário clica no cabeçalho de uma coluna sem ordenação (Cliente, Status, Resumo, Tipo, Loja) | Nada acontece — só Data/Hora e Total são ordenáveis (seção 6.3); o Prazo não ordena em nenhuma aba. |
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
- **2ª linha da coluna Tipo em Finalizados:** a regra documentada mostra o horário de encerramento no lugar da previsão; o Figma mantém a previsão de entrega/retirada. Mantida a regra documentada até decisão.
- **Botão "N novos pedidos":** definido conforme o protótipo (6.3); em aberto apenas o texto no singular (1 pedido novo).
- **Tag "Novos" na sidebar:** o protótipo a exibe sempre; confirmar se ela aparece só quando há pedidos novos (ainda não abertos) no contexto e a regra de contagem.
- **Título da aba do navegador:** o legado alterna a cada 2 s entre "Radar - E-commerce" e "[NOVO PEDIDO] Radar - E-commerce", sem contador (`NotificationTitleTagService`); confirmar se a reconstrução mantém a alternância ou passa a mostrar um contador.
- **Busca digitada × lupa:** o Figma desenha um botão de lupa (em "Buscar loja" da Gestão de Lojas, botão azul); a regra é disparar ao digitar com debounce de 2 s, sem Enter — confirmar o papel do botão.
- **Texto da modal Conferência → Liberados:** a modal própria da Conferência (6.5) ainda não tem título, texto e botões definidos.
- **Texto "entrega/retirada" no pulo Na fila → Liberados:** o Figma escreve o termo literal; confirmar se o texto varia conforme o tipo do pedido.
- **Itens extras do Figma no detalhe, sem decisão:** link "Whatsapp" no card Cliente, tag "Pedido parado há …", legenda por fase acima dos itens e tracker com 4 cores (vermelho, amarelo, azul, verde) com a pílula de prazo.
- **Empty states de Pedidos:** os 4 cenários (6.2) vêm do protótipo, não existem no Figma auditado; textos e CTAs a confirmar com a UX.
- **Tooltips de nome truncado e de lista de itens da linha:** documentados antes do handoff e ausentes do Figma; confirmar se permanecem.
- **Edição na Conferência:** o `PRD-edicao-pedidos-etapa-revisao.md` descreve a modal "Liberar pedido para a fila" ao liberar a Conferência; com a decisão de não haver diálogo em Conferência → Na fila, alinhar esse PRD.
- **Usuários na sidebar:** aparece sob "GESTÃO DE LOJAS" (Figma) e usa o seletor multicontexto (5.2); confirmar se isso muda o módulo/contexto da tela.
- **Texto de última atualização da Home:** "Atualizado há 5 minutos" cai; definir se haverá qualquer texto de atualização (5.5).
- **Definição do percentual do card "Cancelamentos"** (cancelados ÷ finalizados, conforme o código do `ECP-1547`): confirmar quando o card for decidido (5.5).
- **Efeito do "Restaurar padrão" sobre o filtro de GE (Admin) em Indicadores:** a definir.

### 9.1 Cruzamento com o Manual do Portal atual

Revisão do `Manual-Portal-Radar-Ecommerce.md` (estado atual do Portal em produção) contra este PRD, para identificar componentes/fluxos/regras de negócio existentes hoje que ainda não têm um destino claro no modelo novo (não inclui mudanças de navegação/UX, que são o próprio objetivo do redesenho).

- **Nuance de estorno por modalidade de pagamento (Pix/Cielo)** — **não entra neste ciclo**; segue a regra de negócio atual (Manual seção 8) sem alteração — decisão explícita de não abrir esse tópico agora.

## 10. Critérios de aceite (alto nível)

**Dado que** meu usuário tem vínculo com múltiplas lojas, **quando** eu seleciono um contexto (Redes e Lojas) numa tela do módulo de Operação, **então** esse mesmo contexto passa a valer em todas as outras telas do módulo (Home, Pedidos, Promoções) até eu trocar de novo.

**Dado que** estou na aba "Em andamento" da tela de Pedidos, **quando** a lista carrega, **então** vejo todos os pedidos ativos do contexto selecionado, sem limite de período, com ordenação disponível para Prazo, Data/Hora e Total.

**Dado que** estou na aba "Finalizados", **quando** a lista carrega, **então** só vejo pedidos concluídos/cancelados dos últimos 30 dias, com um indicador visual desse limite.

**Dado que** busco por um pedido fora da janela de 30 dias, **quando** o resultado retorna, **então** o pedido aparece normalmente, mesmo fora do período padrão exibido.

**Dado que** um pedido está a 20 minutos de ficar atrasado, **quando** eu vejo a listagem, **então** a linha/card aparece destacado em amarelo.

**Dado que** um pedido está há mais de 1 hora sem nenhuma movimentação, **quando** eu vejo a listagem, **então** ele aparece marcado como "Parado", independente do prazo de finalização.

**Dado que** o prazo estimado de entrega ou retirada de um pedido já passou, **quando** eu vejo a listagem ou o detalhe, **então** o pedido aparece destacado em vermelho como "Atrasado" — podendo coexistir com a tag "Parado".

**Dado que** clico para pular um pedido direto para "Liberados" (de "Na fila" ou de "Conferência"), **quando** escolho a opção de pular, **então** vejo o diálogo "Avançar pedido direto para Liberados?" antes da mudança ser efetivada; a mudança só vale ao clicar em "Sim, avançar pedido".

**Dado que** avanço um pedido de "Conferência" para "Na fila" ou de "Liberados" para "Concluído", **quando** clico no botão, **então** vejo o diálogo de confirmação da etapa; ao confirmar a liberação para a fila, vejo o snackbar `Status atualizado para "Na fila"` com "Desfazer" por 5 segundos, e ao confirmar a conclusão vejo a barra "Pedido concluído" com "Fechar agora" e o fechamento do modal em 3 segundos (sem snackbar e sem "Desfazer").

**Dado que** clico em "Cancelar pedido" em qualquer status do pedido (incluindo Concluído), **quando** a modal abre, **então** preciso selecionar um motivo dentre as opções antes de "Confirmar cancelamento", e o valor do estorno considera qualquer estorno parcial já feito durante a Conferência.

**Dado que** clico no cabeçalho da coluna Data/Hora ou Total, **quando** a lista reordena, **então** a ordenação é aplicada; **dado que** clico no cabeçalho de qualquer outra coluna (Cliente, Status, Resumo, Tipo, Loja) ou no Prazo, **então** nada acontece.

**Dado que** meu usuário tem lojas de Vendas e de Ofertas, **quando** abro Pedidos, **então** vejo o item no menu e as lojas de Ofertas aparecem desabilitadas no painel de Lojas; **dado que** meu usuário só tem lojas de Ofertas, **então** o item Pedidos não aparece no menu.

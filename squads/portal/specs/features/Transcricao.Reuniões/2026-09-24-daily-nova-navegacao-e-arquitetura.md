# Daily Ecommerce Portal

**Data:** 24/09/2026
**Participantes:** Matheus Justino, Lais Bortoleto, Thiago Fernandes, Uelinton Martins, Gustavo Leite, Diego Luz, Rafael Chaves, Diogo Soares de Ávila
**Fonte:** Anotações automáticas do Gemini (Google Meet)

---

## Resumo

Apresentação da nova proposta de navegação do Portal e alinhamento tecnológico/arquitetural em torno da construção de um novo repositório do zero.

- **Nova Proposta de Navegação:** proposta de navegação dividida em dois blocos (Operação multicontexto e Configuração de contexto único) e otimização da tela de Pedidos.
- **Arquitetura e Novo Repositório:** decisão tomada em favor da criação de um novo repositório de projeto do zero, em vez de reconstruir o portal atual.
- **Definição Tecnológica do Portal:** consenso estabelecido para manter Angular, para viabilizar as entregas planejadas (o Design System "Alquimia" já foi construído em Angular).

---

## Decisões

### Precisa de mais conversa

- **Definição da stack tecnológica por meio de spike:** a escolha entre Angular e React, e a estratégia de arquitetura, foi adiada para uma próxima reunião de engenharia na segunda-feira, após um estudo preliminar (prós/contras de cada stack).

### Alinhada

- **Prazo para pedidos parados:** limite fixo de **120 minutos** para movimentação/conferência de pedidos parados, deixando a customização por loja para 2027.
- **Notificações em tempo real:** aprovado o desenvolvimento de uma central de notificações em tempo real, para evitar soluções paliativas (chamadas de endpoint em loop) nos alertas de pedidos parados.
- **Obrigatoriedade de integração com o Core:** tudo o que for viável deve ser implementado e integrado diretamente no Core da plataforma — definido como pré-requisito.
- **Escopo de entregas do quarto trimestre:** entrega da refatoração do portal em dois módulos (Operação e Configuração) e o agrupamento de pedidos por multicontexto.
- **Construção de um novo projeto:** aprovada a decisão de construir um projeto novo do zero em vez de reconstruir o portal atual, usando a próxima sprint para planejamento.
- **Testes automatizados no front-end:** o desenvolvimento do front-end incorporará testes automatizados desde o início, alinhado ao processo de Quality Gate.

---

## Próximas Etapas

- [ ] **[Matheus Justino, Thiago Fernandes, Uelinton Martins]** Definir arquitetura técnica das notificações, evitando soluções temporárias, com um caminho de desenvolvimento escalável.
- [ ] **[Thiago Fernandes]** Avaliar licenciamento do Figma Dev Mode — custos e viabilidade, para acesso completo aos metadados necessários ao front-end.
- [ ] **[Grupo]** Planejar entrega modular — estruturar o lançamento evitando pacotes gigantescos de código, e definir como coexistirão a versão nova e o sistema antigo.
- [ ] **[Uelinton Martins]** Levantar prós e contras das stacks (Angular vs. React) para a nova estrutura do portal e documentar os resultados.
- [ ] **[A equipe]** Preparar um pré-estudo comparativo sobre as arquiteturas de front-end e back-end, pra subsidiar a discussão de segunda-feira.
- [ ] **[Thiago Fernandes, Uelinton Martins, Matheus Justino, Diego Luz, Gustavo Leite, Rafael Chaves]** Participar da reunião de refinamento na segunda-feira (14h–16h) para definir o plano da próxima sprint e a stack tecnológica.
- [ ] **[Matheus Justino]** Definir o roadmap de desenvolvimento pra reconstrução do portal, com foco nas necessidades reais dos usuários.
- [ ] **[Lais Bortoleto, Matheus Justino]** Direcionar a experiência do usuário e os requisitos do novo portal, considerando os diferentes perfis de acesso.

---

## Detalhes da Reunião

### Apresentação da Nova Proposta de Navegação do Portal

Lais Bortoleto apresentou uma side bar em formato de *overlay* para o gestor de loja e rede, com indicadores e o header contextual. Matheus Justino complementou que o portal será dividido em dois grandes blocos: um módulo de **operação multicontexto** (indicadores, pedidos, promoções — permitindo múltiplas redes ou lojas simultaneamente) e um bloco de **configuração de contexto único**, onde não é possível configurar mais de uma loja ao mesmo tempo.

### Visão Tabela e Fluxo da Tela de Pedidos

Lais Bortoleto detalhou a nova visão de tabela na tela de Pedidos, que exibirá apenas lojas de venda ativas, com opções para itens em andamento (fila, em separação, conferência, liberado). A tela contará com uma coluna semafórica de prazo para o balconista — alertas de atraso, 20 minutos restantes, normal, e status "parado" quando há mais de uma hora sem movimento — além de ícones para clientes recorrentes, status de pagamento, necessidade de troco e itens de alto custo.

### Ações e Gestão de Status dos Pedidos

Lais Bortoleto explicou que o usuário poderá pular etapas diretamente para a fila de liberados via um botão com diálogo de confirmação, ou avançar etapa por etapa. Diogo Soares de Ávila questionou se o sistema passaria por todos os passos "por trás" — Lais confirmou que sim, o pedido cai diretamente em liberados para conclusão ou cancelamento. Também será exibido um banner com o motivo do cancelamento e o e-mail de quem o realizou.

### Notificações de Pedidos Parados e Filtros

Lais Bortoleto propôs limitar a até duas (ou três) notificações persistentes de pedidos parados, agrupando-os caso ultrapassem esse número. Ao clicar na notificação, o usuário é redirecionado para a tela de Pedidos já filtrada por itens parados. Gustavo Leite questionou a clareza dos filtros (já que um pedido parado pode estar em qualquer etapa/coluna); Matheus Justino esclareceu que "parado" funcionará como um **status do pedido**, não apenas um estado de movimentação — então o filtro "parados" traz todos os status juntos, sob esse recorte.

### Personalização de Prazos e Alinhamento Técnico

Rafael Chaves questionou a possibilidade de configurar o tempo do "parado" por loja. Matheus Justino respondeu que a regra inicial foi fixada em **120 minutos**, ficando a personalização por loja para 2027, pra não inflar o escopo do trimestre. Gustavo Leite e Diego Luz reforçaram a necessidade de notificações em tempo real (em vez de polling de endpoint), e Thiago Fernandes concordou em aproveitar a oportunidade pra remover débitos técnicos.

### Integração com a Core e Automatizações

Rafael Chaves e Matheus Justino discutiram a importância de migrar os consumidores dos módulos para a Core à medida que forem implementados lá — Matheus reforçou que ir para a Core é pré-requisito para tudo o que for possível. Lais Bortoleto sugeriu notificação via WhatsApp pro gestor em casos de pedido parado; Gustavo Leite lembrou que isso depende da API da Meta, apontada por Matheus como viável.

### Detalhes de Interação e Finalização de Pedidos

Gustavo Leite revisou as setas de navegação entre pedidos e o comportamento do modal. Matheus Justino sugeriu fechar a modal automaticamente em status que encerram o pedido (conclusão ou cancelamento), pra evitar inconsistências visuais. Matheus também confirmou que a tela de finalizados seguirá o padrão atual de exibir os últimos 30 dias, exigindo busca pra períodos anteriores.

### Módulos de Configuração por Perfil de Usuário

Lais Bortoleto apresentou as telas de configuração pra gestores com múltiplas redes e pra usuários Admin — o Admin terá abas específicas pra Produtos e Anúncios do app (Banners), sem precisar de contexto de rede/loja. Matheus Justino resumiu que a mudança consiste em substituir a navegação em cascata antiga por uma seleção unificada de redes e lojas dentro do menu de configurações (side bar).

### Estratégia de Lançamento e Abordagem de Desenvolvimento Front-End

Gustavo Leite e Matheus Justino debateram entregar o portal por partes ou integralmente ao final do trimestre — Matheus ressaltou a dificuldade de conciliar uma release gigantesca de 10 sprints com entrega contínua de valor. Gustavo propôs isolar a nova estrutura como um módulo dentro do projeto existente, pra migração gradual e segura, sem exclusões drásticas iniciais.

### Uso de Ferramentas de IA e Licenciamento do Figma

Gustavo Leite sugeriu usar o Figma Dev Mode integrado ao Cursor pra acelerar a criação das telas. Uelinton Martins e Thiago Fernandes debateram custo e necessidade da licença Dev Mode pra capturar metadados/cores/CSS exatos sem inflar consumo de tokens (sem Dev Mode, a IA só consegue tirar print dos elementos).

### Planejamento do Trimestre e Alternativas com Iframe

Matheus Justino reiterou que o objetivo do Q4 é a refatoração do portal em dois módulos + agrupamento de pedidos multicontexto — podendo negociar prazos e deixar filtros complexos pro próximo ano. Uelinton Martins sugeriu isolar a nova página de pedidos num iframe dentro do portal legado, pra mitigar a complexidade de conviver com códigos misturados — ideia ponderada por Thiago Fernandes e Diego Luz quanto à experiência de navegação dos menus.

### Análise do BFF e Limpeza de Lógica de Negócio

Uelinton Martins relatou que a análise do back-end identificou **400 endpoints e 13 BFFs**, e que a maioria da lógica é validação/redirecionamento HTTP, sem grande complexidade de regra de negócio (essas estão centralizadas nos microsserviços e na Core). Uelinton defendeu a criação de um BFF unificado pro e-commerce/portal, centralizando front e back num único projeto de cada lado.

### Decisão sobre a Criação de um Novo Projeto do Zero

Diante dos desafios de arquitetura legada, Diego Luz, Gustavo Leite, Uelinton Martins e Thiago Fernandes convergiram em favor de um novo repositório do zero, com padrões limpos, eliminando débitos técnicos acumulados. Matheus Justino confirmou que pode negociar internamente um período de **dois meses sem entregas incrementais**, caso o time opte por construir uma base nova de alta qualidade em vez de refatorar o código atual.

### Definição da Próxima Sprint de Planejamento

Matheus Justino propôs que a próxima sprint seja dedicada integralmente a planejamento técnico/arquitetura em conjunto com o time — estruturar o roadmap, definir o escopo de entregas do Q4, e deliberar sobre construir o projeto num novo repositório.

### Problemas na Estrutura Atual e Proposta Inicial

Uelinton Martins apontou que o trabalho acumulado no ano foi majoritariamente retrabalho e dificuldade com a estrutura atual. Gustavo Leite concordou que, apesar da perda inicial de tempo, haverá ganho produtivo depois. Thiago Fernandes apresentou a proposta da primeira Sprint: fundação estruturante dos novos projetos, definição de stack, e aplicação de documentação (seguindo o spec-kit/SDD).

### Definição da Stack Tecnológica (Angular vs. React)

Gustavo Leite e Diego Luz manifestaram preferência por React, pra divergir do padrão Angular atual. No entanto, Thiago Fernandes e Gustavo Leite ponderaram que o Design System "Alquimia" já foi construído em Angular (meses de trabalho, ainda em expansão) — migrar pra React exigiria refazer todo o Design System e inviabilizaria as entregas planejadas. Consenso: **manter Angular**.

### Escopo do Portal e Integração Logística

Uelinton Martins questionou se o time atuaria também na loja de e-commerce — Thiago Fernandes esclareceu que, por ora, o escopo se restringe ao Portal. Thiago informou que uma agenda recente com um fornecedor de logística definiu a criação de um hub logístico que será integrado ao portal, trazendo novas funcionalidades operacionais.

### Implementação de Testes Automatizados e Quality Gate

Uelinton Martins propôs testes automatizados abrangentes no back-end e front-end desde o início, via Quality Gate. Thiago Fernandes confirmou que o front-end já contemplará testes automatizados prontos, e que Diogo Soares de Ávila terá a atribuição de revisar os testes junto com o código.

### Próximos Passos e Avaliação Técnica do Backend e Frontend

Thiago Fernandes revisou o cronograma: refinamento do portal na segunda-feira (14h–16h), pra preparar o planejamento de terça-feira. Solicitou que Uelinton Martins e Matheus Justino preparassem um levantamento de prós/contras das tecnologias antes da discussão. Uelinton adiantou um estudo preliminar do back-end: estrutura predominantemente transacional, com apenas **2% do código** fazendo gravações diretas no banco — indicando que o back-end está em condições adequadas, enquanto o front-end será desenvolvido inteiramente do zero, com UX conduzida por Lais Bortoleto e Matheus Justino.

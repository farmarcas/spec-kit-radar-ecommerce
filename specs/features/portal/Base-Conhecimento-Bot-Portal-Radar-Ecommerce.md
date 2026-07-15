# Base de Conhecimento — Bot de Atendimento do Portal (Associados)

> **Uso deste documento:** conteúdo-fonte para um bot de atendimento que responde dúvidas simples de Associados/Lojistas sobre o uso do Portal Radar E-commerce (ex: "onde encontro minha API KEY", "como vejo o módulo da minha loja"). Cada bloco de pergunta/resposta abaixo foi escrito para ser **autocontido** — não depende de ler o restante do documento para fazer sentido — pensando em recuperação por trechos (chunking) por um sistema de busca/RAG.
>
> **Baseado em:** `Manual-Portal-Radar-Ecommerce.md` (mapeamento de telas reais do Portal, cruzado com o código-fonte `ecomm-front-webapp-portal-angular`, validado com o time de produto) e no FAQ interno de suporte (CS/Anjos) da Farmarcas. Atualizado em 14 de julho de 2026.
>
> **Regra para o bot:** se a dúvida do associado não estiver coberta aqui, o bot deve admitir que não sabe e direcionar para o suporte humano (Farmarcas/N1) — nunca inventar um caminho de tela que não está descrito neste documento. A seção final "Perguntas sem resposta confirmada" lista o que ainda não foi mapeado.

---

## Índice de tópicos

- [Termos e apelidos comuns](#termos-e-apelidos-comuns) *(consultar primeiro quando a pergunta usar um termo informal)*
- [Acesso, login e perfis](#acesso-login-e-perfis)
- [Onde encontro...](#onde-encontro)
- [Redes, Grupos e Lojas](#redes-grupos-e-lojas)
- [Indicadores](#indicadores)
- [Configurações da Loja](#configurações-da-loja)
- [Estoque](#estoque)
- [Pedidos](#pedidos)
- [Promoções](#promoções)
- [Banners](#banners)
- [Usuários](#usuários)
- [Catálogo de produtos](#catálogo-de-produtos)
- [Precificação e descontos vindos do ERP (ex: sistema BIG)](#precificação-e-descontos-vindos-do-erp-ex-sistema-big)
- [Integração ERP Alpha7](#integração-erp-alpha7)
- [Meios de pagamento (Braspag, Cielo, Rede, Antifraude)](#meios-de-pagamento-braspag-cielo-rede-antifraude)
- [Notificações, instabilidades e contingência](#notificações-instabilidades-e-contingência)
- [Perguntas sem resposta confirmada](#perguntas-sem-resposta-confirmada)

---

## Termos e apelidos comuns

Associados nem sempre usam o nome exato do campo/tela do Portal. Esta tabela ajuda o bot a reconhecer a intenção por trás de termos informais.

| Termo informal que o associado pode usar | Termo oficial no Portal | Onde encontrar |
|---|---|---|
| "Minha API KEY", "chave da loja", "código de integração", "token do ERP" | **Chave de integração do ERP** | `Configurações > Dados da Loja > Informações da loja` (campo somente leitura, gerado pela plataforma) |
| "Módulo da minha loja", "meu plano", "o que minha loja pode fazer" | **Módulo ativado** (Vendas ou Ofertas) | Coluna "Módulo ativado" na tela `Lojas` (nível Rede) |
| "Loja mãe", "loja centralizadora" | **Loja principal** (dentro da configuração de um Grupo) | `Grupo de lojas > (grupo) > Configurar atendimento e estoque` |
| "Rede", "franquia", "bandeira" | **Rede** | Nível mais alto da hierarquia — várias lojas de diferentes GEs (empresários) sob a mesma bandeira |
| "GE", "meu grupo econômico", "empresa" | **GE (Grupo Econômico)** | Conjunto de lojas do mesmo empresário/associado dentro de uma Rede — conceito de negócio por trás do **Grupo de lojas** no Portal |
| "Meu perfil", "meu nível de acesso", "o que eu posso fazer no sistema" | **Perfil de acesso** (Contato cliente / Gestor de Loja / Gestor de Rede / Admin) | Tela `Usuários` |
| "Balconista" | **Contato cliente** (é o nome oficial do perfil no Portal) | Tela `Usuários` |
| "Fila de pedidos", "pedidos chegando" | Aba **"Na fila"** dentro de `Pedidos` | `Pedidos` |
| "Desconto", "campanha", "oferta" | **Promoção** | `Promoções` |
| "Anúncio", "propaganda do app" | **Banner** | `Banners` (também chamada de "Anúncios do aplicativo") |
| "Cadastrar produto novo", "pedir produto novo" | **Solicitação de produto** | Ícone "Solicitar produto" na tela `Estoque` — é self-service, mas depende de aprovação do Admin (Catálogo) |
| "Anjo" | Profissional do time de **Operações internas da Farmarcas** que dá suporte ao associado (termo interno) | — |
| "Sistema BIG", "Alfa 7"/"Alpha7", "Soft", "TRIER" | Sistemas de **ERP** usados pelas farmácias, integrados ao Portal via API | Fora do Portal — são os sistemas de gestão do próprio associado |

---

## Acesso, login e perfis

**Como eu entro no Portal?**
Você acessa pela tela de login do Portal com seu e-mail e senha cadastrados. Se esqueceu a senha, use o link "Esqueceu a senha?" na própria tela de login.

**O que é a hierarquia Rede > Grupo de lojas > Loja?**
O Portal Radar organiza tudo em 4 níveis: a **Farmarcas** é a dona da plataforma; uma **Rede** é o conjunto de lojas de uma bandeira/franqueadora (ex: ACFARMA); um **Grupo de lojas** é um subconjunto opcional de lojas dentro de uma Rede (ex: filiais do mesmo dono); e a **Loja** é a unidade individual, com CNPJ próprio, onde o dia a dia acontece.

**Como eu troco de loja dentro do Portal?**
No topo da tela, ao lado do nome da loja atual, existe uma seta (▾). Clicando nela, aparece a lista de lojas às quais você tem acesso — basta selecionar a loja desejada para trocar de contexto, sem precisar sair e logar de novo.

**Quais perfis de acesso existem no Portal?**
Existem 4 perfis:
- **Contato cliente**: é o balconista/atendente da loja. Fica vinculado a **uma única loja** e só acompanha/movimenta os pedidos dela. Não cria nem cancela promoções, e não acessa telas administrativas.
- **Gestor de Loja**: dono/associado da loja. Pode estar vinculado a **várias lojas** e tem acesso completo a todas as funções (estoque, promoções, configurações, pedidos, usuários) das lojas dele.
- **Gestor de Rede**: mesmo nível de acesso do Gestor de Loja, mas administra **todas as lojas de uma Rede inteira**, incluindo telas de nível de rede como Banners e indicadores agregados.
- **Admin**: só o time interno da Farmarcas. Acesso total a todas as Redes/Lojas e é o único perfil que enxerga o módulo Catálogo.

**Por que meu menu no Portal é diferente do de um colega?**
Porque o menu muda conforme o perfil de acesso. Quem tem perfil **Contato cliente** vê só as abas Pedidos, Promoções e Estoque — um menu reduzido, focado no atendimento do dia a dia. Quem é **Gestor de Loja/Rede** vê o menu completo (Pedidos, Promoções, Estoque, Configurações, Usuários dentro de uma loja; ou Lojas, Promoções, Banners, Usuários no nível da Rede).

**Sou balconista e não encontro a aba Configurações. Isso é normal?**
Sim. O perfil **Contato cliente** (balconista) tem acesso reduzido de propósito, só às abas Pedidos, Promoções e Estoque. Configurações, Usuários e mudanças administrativas exigem perfil Gestor de Loja, Gestor de Rede ou Admin. Se você precisa mexer em Configurações, peça para o Gestor de Loja da sua unidade fazer a alteração ou trocar seu perfil de acesso.

---

## Onde encontro...

**Onde encontro minha "API KEY" / chave de integração?**
Vá em `Configurações > Dados da Loja > Informações da loja`. No final do formulário existe o campo **"Chave de integração do ERP"** — ele é somente leitura (não dá pra editar), gerado automaticamente pela plataforma. É esse valor que os sistemas de ERP usam para integrar com a loja.

**Onde vejo o módulo (Vendas ou Ofertas) da minha loja?**
Na tela `Lojas` (nível Rede), a coluna **"Módulo ativado"** mostra "Vendas" (loja processa pedidos e estoque completos) ou "Ofertas" (loja só participa de promoções, sem processar pedido direto pelo Portal).

**Onde vejo o CNPJ da minha loja?**
Em `Configurações > Dados da Loja > Informações da loja`, o campo **CNPJ** aparece no topo do formulário (também somente leitura).

**Onde configuro o horário que minha loja atende?**
Existem 3 tipos de horário, independentes entre si (ver detalhe na seção Configurações da Loja):
1. **Horário de Atendimento** (o principal, o que o cliente vê no app) — em `Configurações > Dados da Loja > Horário de Atendimento`.
2. **Horário de Entrega** — em `Configurações > Formas de Entrega > Horário de Funcionamento`.
3. **Horário de Retirada** — em `Configurações > Formas de Entrega > Retirada na Loja`.

**Onde vejo quantos pedidos estão em aberto agora?**
Em `Pedidos`, o quadro mostra colunas por status (Na fila, Em separação, Liberados, Concluídos, Cancelados), cada uma com um contador. Também dá pra ver um resumo consolidado ("Total de Pedidos em Aberto") na tela `Indicadores`.

**Onde vejo o faturamento da minha loja?**
Na tela `Indicadores`, logo no topo aparece o **Faturamento** do período selecionado, junto com um gráfico por dia da semana. Dá pra trocar o período de análise no seletor no topo (ex: "Últimos 7 dias").

**Onde ativo/desativo o pagamento online (cartão pela internet)?**
Em `Configurações > Pagamentos > Online`. É preciso preencher os dados da integração com a Braspag (Adquirente, MerchantId, MerchantKey, ClientID, ClientSecret) antes de conseguir ativar o toggle.

**Onde configuro as bandeiras de cartão aceitas na maquininha?**
Em `Configurações > Pagamentos > Com maquininha` — lá dá pra marcar quais bandeiras de Débito, Crédito e Outros (Dinheiro, Pix) a loja aceita, e se aceita pagamento na entrega e/ou na retirada.

**Onde crio uma promoção?**
Na tela `Promoções`, clique no botão **"Nova promoção"** no canto superior direito. Isso abre um formulário de 5 passos (o que promover, onde é válida, quando fica ativa, regras de uso, e quais produtos entram).

**Onde vejo os banners do aplicativo?**
Na tela `Banners` (às vezes chamada de "Anúncios do aplicativo"), que mostra os banners atuais do carrossel da home do app, com posição, período de exibição e métricas de cliques/exibições.

**Onde convido um novo usuário para o Portal?**
Na tela `Usuários`, existe um botão para convidar/criar novo usuário — lá você escolhe o Perfil de acesso dele e a qual loja/rede ele fica vinculado.

---

## Redes, Grupos e Lojas

**O que é uma Rede?**
É o nível mais alto de organização no Portal, abaixo apenas da Farmarcas — representa uma bandeira/franqueadora (ex: ACFARMA, Ultra Popular, Super Popular). Dentro de uma Rede existem lojas de vários GEs (empresários) diferentes.

**O que é um GE (Grupo Econômico)?**
É o conjunto de uma ou mais lojas do mesmo empresário/associado, dentro de uma Rede. É o conceito de negócio por trás da funcionalidade **Grupo de lojas** no Portal — ou seja, quando um associado tem várias filiais, ele normalmente organiza essas lojas num Grupo de lojas dentro do Portal.

**O que é um Grupo de lojas e para que serve?**
É a funcionalidade do Portal que organiza as lojas de um mesmo GE dentro de uma Rede, definindo uma regra comum de **atendimento de pedidos** e **tipo de estoque**. A vantagem principal é operacional: em vez de um atendente precisar abrir uma aba por loja, o grupo permite acompanhar os pedidos de todas as lojas participantes numa única tela.

**Quais são as opções de atendimento e estoque de um Grupo de lojas?**
Ao configurar um grupo (botão "Configurar atendimento e estoque" dentro do detalhe do grupo), existem 3 opções — mas elas dizem respeito **só ao estoque**, não a onde os pedidos são atendidos:
1. **Estoque Espelhado** — uma loja "mãe" (loja principal) recebe todos os pedidos do grupo, e o estoque dela é replicado (espelhado) para as outras. É possível incluir uma loja secundária: nesse caso os estoques das duas lojas são somados, exibindo a quantidade total no app.
2. **Estoque Integrado** — o estoque é somado fisicamente entre todas as lojas do grupo.
3. **Estoque Independente** — os estoques de cada loja do grupo ficam isolados uns dos outros.

**Importante:** não importa qual das 3 opções de estoque é escolhida — configurar um Grupo de lojas **sempre centraliza o atendimento dos pedidos na tela da loja principal**. A escolha entre Espelhado/Integrado/Independente afeta só o comportamento do estoque entre as lojas do grupo.

Essa escolha afeta diretamente o que aparece disponível no aplicativo para os consumidores de cada loja do grupo — deve ser mudada com cuidado se o grupo já estiver em operação.

**Como adiciono uma loja a um Grupo?**
No detalhe do grupo (aba "Lojas"), existe o botão **"Adicionar loja"**.

**O que é o "Estoque Centralizado" que aparece na tela de Lojas?**
É o botão de atalho, no nível da Rede, para a tela de Grupo de lojas — tanto para ver os grupos existentes quanto para criar um novo. Não é uma funcionalidade separada, é a mesma configuração de Grupo de lojas descrita acima.

**Consigo mudar uma loja de GE (Grupo Econômico)?**
Não existe uma função para isso no Portal hoje. Se uma loja for removida, todos os usuários vinculados a ela perdem esse vínculo — ver seção Usuários.

**Ao tentar cadastrar minha loja, o sistema diz que ela já está vinculada, mas meu CNPJ consta como não cadastrado. O que fazer?**
Isso costuma ser um conflito de duplicidade ou vínculo residual no banco de dados (comum quando uma bandeira mudou de CNPJ). É preciso acionar o suporte Farmarcas para que o time técnico remova o vínculo antigo e libere o recadastro — não é algo que o associado resolve sozinho pelo Portal.

**O que significa "ERP conectado até" na lista de Lojas?**
É a data/hora da última vez que aquela loja sincronizou dados com o sistema ERP dela. Se essa data estiver muito atrasada (mais de 72 horas / 3 dias), é sinal de problema de comunicação — ver a seção Estoque abaixo sobre o alerta correspondente.

---

## Indicadores

**O que é a tela de Indicadores?**
É uma aba de navegação real chamada "Indicadores" — funciona como a Home/painel principal ao entrar numa loja ou rede. Tem duas sub-abas: **Vendas** e **Ofertas**.

**Como eu mudo o período de análise dos indicadores?**
Use o seletor no topo da tela (ex.: "Últimos 7 dias", "Últimos 12 meses", com opção de período Personalizado via calendário). O botão **Filtrar** permite refinar por outros critérios, e **Exportar** baixa os dados exibidos. A tela também tem **atualização automática a cada 30 minutos** (mostra a data/hora da última atualização no cabeçalho). **Importante:** mudar o período recarrega todos os cards da tela (uma chamada nova por card) — é normal ver os cards em "esqueleto de carregamento" por um instante.

**Consigo comparar minhas lojas entre si?**
Sim, no nível da Rede a Home de Vendas mostra um **Ranking das lojas** por faturamento (pódio com as 3 primeiras posições — não encontrei opção de ver mais do que isso). Esse card não existe no painel por Loja.

### Home de Vendas — o que cada indicador significa

No topo há 3 abas (Faturamento/Pedidos cancelados/Pedidos concluídos), cada uma com seu próprio gráfico já carregado — trocar de aba só alterna qual é exibido, não busca dado novo:
- **Faturamento**: "Representa o valor total das vendas registradas no período selecionado."
- **Pedidos cancelados**: "Total de pedidos cancelados no período selecionado."
- **Pedidos concluídos**: "Total de pedidos finalizados no período selecionado."

Demais indicadores:
- **Ticket Médio**: "Valor médio gasto por pedido no período, calculado dividindo o faturamento total pela quantidade de pedidos."
- **Total de Pedidos em Aberto**: "Quantidade de pedidos ainda não finalizados no período, incluindo todos os status pendentes (na fila, liberados e em separação)." Tem botão "Visualizar pedidos".
- **Volume dos pedidos em aberto**: soma em R$ de todos os pedidos ainda não finalizados (Na fila + Em separação + Liberados).
- **Pedidos em aberto por status** (gráfico de rosca Fila/Em separação/Liberados, em %): contagem de pedidos por status. Hoje esse indicador tem um problema: filtra pelo período de data selecionado, quando deveria sempre mostrar o total de pedidos em aberto das lojas do usuário, independente da data de criação — correção já registrada em ticket interno.
- **Tempo médio para iniciar primeiro atendimento**: tempo entre o pedido entrar "Na fila" e ser concluído (formato de duração, ex.: "9h e 37min").
- **Tempo médio total de atendimento**: também entendido como "Na fila" até "Concluído" (ex.: "2 dias e 11h") — definição exata ainda em checagem com engenharia (pode haver sobreposição com o indicador anterior; já registrado em ticket interno).
- **Média de itens por cesta**: média de itens por pedido, considerando todos os pedidos (concluídos ou não).
- **Volume dos pedidos cancelados**: valor em R$ (não quantidade) que seria faturado pelos pedidos cancelados no período — a label do card hoje não deixa isso claro (correção registrada).
- **Faixa etária por gerações**: "Distribuição dos clientes que realizaram compras no período, agrupados por gerações." Faixas: 18–28 anos (Geração Z), 29–44 anos (Geração Millennials Y), 45–60 anos (Geração X), +60 anos (Baby Boomers).
- **Região** (só no painel de Rede, não existe por Loja nesta home): "Distribuição dos clientes que compraram no período, agrupados conforme a localização geográfica cadastrada." Categorias: Sudeste, Norte, Sul, Centro-Oeste, Nordeste, Estado inválido.
- **Gênero**: "Distribuição dos clientes que realizaram compras no período, de acordo com a informação de gênero cadastrado." Categorias: Homem, Mulher, Indefinido.
- **Ranking das lojas** (só Rede): ver pergunta acima.
- **Top produtos mais vendidos**: "Apresenta os produtos que tiveram o maior número de vendas no período, destacando os campeões de desempenho." — lista ranqueada (nome, EAN, unidades e R$ por produto) com botão "Baixar produtos".
- **Formas de pagamento**: "Distribuição dos pedidos realizados no período, de acordo com o meio de pagamento utilizado" (detalha Online → Crédito/Pix e Offline → Balcão/Na entrega, tudo em %).
- **Métodos de entrega**: "Mostra como os pedidos foram recebidos pelos clientes no período, diferenciando opções como Receber em Casa (entrega no endereço do cliente) e Retirada (o próprio cliente busca o pedido na loja ou ponto de coleta)."
- **Lojas sem opção de receber em casa** (só Rede): "Lojas que oferecem apenas a modalidade de retirada, sem opção de entrega em domicílio. Esse indicador ajuda a identificar associados que podem não ter operação logística para envio." Botão "Ver lojas com retirada".

### Home de Ofertas — o que cada indicador significa

- **Total de ofertas criadas**: "Quantidade de ofertas cadastradas pelas lojas no período."
- **Ofertas ativadas**: "Quantidade de ofertas que os clientes finais ativaram no aplicativo durante o período."
- **Taxa de conversão das ofertas em vendas**: "Percentual de ofertas ativadas pelos clientes no app que resultaram efetivamente em compras no período."
- **Total de vendas realizadas**: "Quantidade total de pedidos concluídos no período, resultando em compras efetivamente finalizadas."
- **Quantidade de conversão em vendas**: "Total de pedidos finalizados como vendas no período selecionado" (gráfico com legenda PDV/Aplicativo).
- **Faixa etária por gerações**: "Distribuição dos clientes que realizaram ativações no período, agrupados por gerações..."
- **Região** (aqui existe por Loja e por Rede): "Distribuição dos clientes que realizaram ativações no período, agrupados conforme a localização geográfica cadastrada (ex.: Sudeste, Sul, Nordeste)."
- **Gênero**: distribuição por gênero de quem **ativou** ofertas no período (o app hoje mostra por engano o mesmo texto da Home de Vendas, falando em "compras" — já reportado como bug).
- **Top produtos com mais ativações**: produtos com mais ativações no período (o app hoje mostra por engano o texto de "vendas" da Home de Vendas — já reportado como bug).
- **Lojas sem ofertas em exibição**: "Apenas as lojas que não possuem nenhuma oferta ativa. Nessas condições, o app fica indisponível para os clientes até que novas ofertas sejam cadastradas."
- **Aviso: Loja indisponível no app** (só quando é uma única loja): "Essa loja está indisponível para os clientes no app porque não há nenhuma oferta ativa."

### Como os gráficos se comportam

- Passar o mouse sobre um ponto/barra/fatia mostra o valor (em R$ nos gráficos de Faturamento/Ticket Médio; valor + % nos gráficos de rosca e no de Gênero). Nos gráficos de barra de Faixa etária/Região, o hover mostra só o valor bruto, sem tooltip customizado.
- **Não existe clique para filtrar ou abrir detalhe** em nenhum gráfico da tela.
- Nenhuma legenda é clicável — todas são listas estáticas de cor + rótulo, só para leitura.
- Mudar o período recarrega a página inteira (uma chamada nova por card).
- Gráficos de rosca e o de Gênero mostram um círculo cinza vazio quando não há dado no período; Faturamento/Ticket Médio/Faixa etária/Região não têm essa ilustração (ficam em branco); "Top produtos" tem sua própria ilustração de vazio ("Sem dados... por enquanto!").

---

## Configurações da Loja

**O que tem dentro de Configurações?**
Três grandes seções, no menu lateral: **Dados da Loja**, **Formas de Entrega** e **Pagamentos**. Um indicador "Seu progresso" no canto inferior mostra quantas configurações essenciais já foram concluídas.

**Quais são as etapas do checklist "Seu progresso"?**
1. Informações da Loja
2. Endereço Comercial
3. Horário de atendimento
4. Criação de oferta

Ao concluir essas etapas, aparece a opção **"Faça Upgrade"**, para solicitar a ativação do **módulo de Vendas** (veja a próxima pergunta).

**Como funciona a migração do módulo Ofertas para o módulo Vendas (e a liberação da Chave API)?**
1. O associado solicita a migração pelo Portal (via "Faça Upgrade", depois de concluir o checklist de onboarding).
2. A Chave de integração do ERP (API) é liberada e deve ser inserida no sistema ERP da loja.
3. A ativação do módulo de Vendas e o espelhamento do estoque acontecem **separadamente** — pode levar um tempo até o estoque aparecer no app mesmo com o módulo já ativo.
4. Se a solicitação ficar travada em "Aguardando" por muito tempo, ou o estoque demorar demais para aparecer, o associado deve acionar o suporte do próprio ERP para validar a integração do lado deles.

**O que preencho em "Dados da Loja > Informações da loja"?**
CNPJ (fixo), Razão social, Nome da loja no app (nome visível para o consumidor), E-mail, Telefone, WhatsApp (pode ser um número 0800), Farmacêutico responsável, CRF do farmacêutico, e a Chave de integração do ERP (fixa, gerada pela plataforma).

**Como configuro o endereço da minha loja?**
Em `Configurações > Dados da Loja > Endereço comercial`: preencha CEP, Estado, Logradouro, Número, Complemento, Bairro, Cidade e, se quiser, um Ponto de referência. Existe também um mapa para confirmar visualmente a localização — atenção: **mover o alfinete no mapa não altera o endereço textual cadastrado**, serve só para ajuste visual de geolocalização.

**O que é o "Horário de Atendimento" em Dados da Loja?**
É o horário geral em que a loja está aberta ao público — diferente do horário de entrega/retirada configurado em Formas de Entrega. Você ativa cada dia da semana individualmente e define o intervalo "De/Até".

**Por que meu horário aparece incorreto no aplicativo?**
Geralmente é uma configuração pendente ou desalinhada entre os **3 tipos de horário** que existem no Portal:
- **Horário de Atendimento** — o principal, é o que o cliente vê ao buscar a loja no app. Configura em `Configurações > Dados da Loja > Horário de Atendimento`.
- **Horário de Entrega** — define quando a loja aceita pedidos para entrega. Configura em `Configurações > Formas de Entrega > Horário de Funcionamento`.
- **Horário de Retirada** — define quando o cliente pode buscar um pedido na loja. Configura em `Configurações > Formas de Entrega > Retirada na Loja`.

Os horários de Entrega e Retirada não aparecem diretamente na vitrine do app, mas alimentam o cálculo de quando o cliente pode escolher cada opção e a previsão de recebimento — por isso, se algo parecer errado, vale checar os três.

**Como funciona "Receber em casa"?**
Em `Configurações > Formas de Entrega > Receber em casa`, ative o toggle e configure: horário de funcionamento para entrega, o raio de atendimento (distância máxima, até 30 km, com faixas de Alcance × Taxa de Entrega × Tempo de Entrega — dá pra criar várias faixas de preço por distância) e, opcionalmente, frete grátis a partir de um valor mínimo de compra.

**Configurei as faixas de entrega mas elas não salvam. O que fazer?**
Depois de preencher Alcance, Taxa e Tempo de uma faixa, é **obrigatório clicar no botão "+"** para adicionar aquela regra à listagem antes de clicar em Salvar. Se pular esse clique no "+", os dados somem. Se mesmo assim o problema persistir, é preciso acionar o suporte para inserir os dados manualmente.

**O cliente está pertinho da farmácia mas o app diz que ele está "fora do alcance". O que conferir?**
Primeiro, confirme no Portal se o raio de entrega está configurado corretamente. Se estiver certo, o problema costuma ser do lado do cliente: ele pode ter digitado o CEP/endereço errado, ou até colocado o CEP da própria farmácia no campo de entrega por engano — peça um print da tela dele para confirmar.

**Como funciona "Retirada na loja"?**
Em `Configurações > Formas de Entrega > Retirada na loja`, ative o toggle e configure o horário em que a loja aceita retirada, e o "Tempo de retirada" — quantos minutos depois da confirmação do pedido o produto fica pronto para o cliente buscar (esse tempo aparece pro consumidor no app).

**Como ativo pagamento com maquininha?**
Em `Configurações > Pagamentos > Com maquininha`, defina se aceita pagamento na entrega e/ou na retirada, e marque as bandeiras de cartão aceitas (Débito, Crédito, e outras formas como Dinheiro e Pix).

**Como ativo pagamento online (cartão pela internet)?**
Em `Configurações > Pagamentos > Online`, é preciso primeiro preencher os dados fornecidos pela credenciadora **Braspag** (Adquirente, se habilitou PIX, Nome na Fatura, MerchantId, MerchantKey, ClientID, ClientSecret). Os campos ficam bloqueados até a integração estar corretamente conectada.

---

## Estoque

**O que mostra a tela de Estoque?**
Lista todos os produtos daquela loja, com preço padrão (R$ App), um preço customizado opcional (R$ customizado, que sobrescreve o preço do ERP), a quantidade em estoque, e um toggle "Exibir preço" que controla se o produto aparece com preço visível no app.

**Minha loja não aparece no aplicativo. O que pode ser?**
Dois motivos principais:
1. **Perda de conexão com o ERP** — o sistema da loja parou de enviar dados para o Portal.
2. **Desativação manual** — o estoque foi desabilitado propositalmente dentro do Portal (toggle "Disponível" desligado).

**Por que a loja é desativada automaticamente?**
Se o Portal perder a comunicação com o ERP por mais de **72 horas (3 dias)**, a loja é desativada automaticamente — é uma medida de segurança para não vender produto com preço desatualizado ou sem estoque real.

**Como resolver a desativação por falta de comunicação com o ERP?**
1. Abra um chamado com o suporte técnico do seu sistema ERP.
2. Peça a reconfiguração: solicite a **"Nova Integração de Preço e Estoque"**.
3. Informe ao suporte a sua **Chave de Integração** (token único). Se não souber onde encontrá-la: `Portal > Configurações > Informações da Loja > Chave de integração do ERP`.

**Por que o preço de um produto aparece incorreto às vezes?**
O preço exibido no app vem direto via API do seu ERP. Divergências normalmente vêm de:
- **Ofertas ativas no ERP** — se o produto está numa oferta ou "caderno de ofertas" do seu sistema, o Portal sempre traz o **menor valor** disponível.
- **Atraso de sincronização** — o sistema pode estar aguardando a atualização da base entre o ERP e o Portal.

**Consigo alterar o preço direto no Portal?**
Sim — acesse `Estoque`, busque o produto por nome ou EAN, clique no ícone de lápis (editar), informe o preço correto e confirme em "Atualizar" (isso preenche o campo **R$ customizado**). Recomendado só para casos isolados: se vários produtos estiverem com valor errado ao mesmo tempo, o ideal é abrir chamado com o suporte do ERP pedindo uma **atualização forçada da base de estoque e preço** em lote, em vez de corrigir um por um. Não existe validação/regra sobre esse valor customizado — ele fica valendo exatamente o que foi digitado até ser removido (ícone de lixeira ao lado do campo). Hoje esse recurso de customizar preço direto na tela de Estoque é exclusivo do perfil **Contato cliente** (balconista).

**Como oculto um produto com preço ou estoque errado, sem excluir o cadastro?**
Acesse o produto na tela Estoque e desmarque a opção **"Exibir preço"**. Ele deixa de aparecer no app até a correção ser feita.

**Como oculto medicamentos do aplicativo?**
Duas formas: desabilitar o estoque geral daquele grupo de produtos, ou desativar item por item dentro do Estoque. **Não é possível** ocultar por categoria inteira de uma vez — tem que ser tudo ou um por um.

**Ativei o módulo de Vendas e a API, mas o estoque ainda não aparece no app. O que houve?**
A ativação do módulo e a sincronização/espelhamento do estoque acontecem de forma separada — o estoque pode levar um tempo para aparecer, mesmo com o módulo já ativo. A loja pode seguir preenchendo as demais configurações normalmente enquanto isso.

**Mudamos de ERP (ex: do BIG para o Alpha7), trocamos o token, mas o app continua puxando o estoque do sistema antigo. Como resolver?**
Entre em contato com o suporte do novo ERP e peça uma **limpeza de dados anteriores** (cache/histórico) antes de subir o estoque novamente — isso evita o conflito entre o estoque antigo e o novo durante o espelhamento.

**No formulário de integração do ERP, o que colocar no campo "Nome da Empresa"?**
Os dados da **Farmarcas** — a integração é feita via API usando a chave que está no Portal, não os dados da própria farmácia associada.

**Como os pedidos do e-commerce aparecem no meu sistema ERP?**
A integração ocorre via API, enviando os pedidos em formato de pré-venda (ou pedido integrado, dependendo do ERP) diretamente para a tela do sistema da loja — o formato exato varia por ERP (ver também a seção sobre o Alpha7 abaixo).

**Como solicito um produto que ainda não existe no catálogo?**
Use o ícone "Solicitar produto" na barra de ferramentas da tela Estoque. No formulário, informe Nome do produto e Fabricante, e para cada item o Código de barras (EAN), a Apresentação (ex: "Dorflex caixa com 10") e uma imagem de referência — dá pra solicitar **até 50 produtos de uma vez**. A solicitação vai para aprovação do time Farmarcas (Admin/Catálogo).

---

## Pedidos

**O que significam as colunas do quadro de Pedidos?**
- **Na fila**: pedido novo, ainda aguardando início do atendimento.
- **Em separação**: pedido sendo preparado/separado na loja.
- **Liberados**: pedido pronto, liberado para entrega ou retirada.
- **Concluídos**: pedido já entregue/retirado com sucesso.
- **Cancelados**: pedido cancelado, seja pela loja ou pelo consumidor.

**O que significa a etiqueta "Preço loja" / "Preço PEC" num item do pedido?**
Indica de onde veio o preço daquele produto no momento da venda: **"Preço loja"** é o preço padrão cadastrado no Estoque; **"Preço PEC"** vem do sistema PEC (base de clientes/preços da rede). Também pode aparecer **"Sem estoque"**, um alerta de que o item foi vendido sem estoque confirmado disponível — merece atenção redobrada na separação.

**Como funciona o troco quando o pagamento é em dinheiro?**
O Portal calcula automaticamente o **Valor a cobrar** e o **Troco** com base no total do pedido, exibidos no painel de detalhe do pedido.

**Meus pedidos estão travados na fase "Liberados" e não mudam de status. O que fazer?**
Isso indica instabilidade na comunicação de status entre os sistemas — não é algo que o associado resolve sozinho pelo Portal. Anote os números dos pedidos afetados e tire prints das telas, e acione o suporte Farmarcas o quanto antes para que o time técnico analise e destrave o fluxo.

**Reclamaram de um produto errado num pedido, mas os dados não batem com o que o cliente diz. Como proceder?**
Sempre confira o **EAN (código de barras)** do produto no cadastro do Estoque/Catálogo antes de tudo. Se o associado disser que o produto é de uma especificação (ex: 60g) mas o EAN aponta outra (ex: 180g), o correto é aguardar o retorno do cliente com a confirmação dos dados reais do produto físico antes de seguir com o chamado.

---

## Promoções

**Qual a diferença entre promoção "Individual" e "Por grupo"?**
**Individual** é uma promoção aplicada a um único produto. **Por grupo** é aplicada a um conjunto de produtos relacionados (um "Grupo de produtos", por exemplo uma linha inteira de uma marca) de uma vez só.

**Como crio uma promoção passo a passo?**
No botão "Nova promoção", siga os 5 passos do formulário:
1. Escolha **o que promover** — Um produto ou Grupo de produtos — e o tipo de desconto (ex: Desconto % ou Preço fixo).
2. Escolha **em quais lojas** a promoção vale.
3. Defina **quando** ela fica ativa — data de início/fim e dias da semana.
4. Configure as **regras de uso** — tempo para usar a oferta, se permite um novo uso depois de um tempo, e limite de itens por compra.
5. Escolha **os produtos**: busque por nome/EAN (ou por grupo, se escolheu "Grupo de produtos" no passo 1), ajuste o desconto individualmente ou aplique um "Desconto geral" de uma vez para todos os produtos selecionados.

**Dá pra cadastrar vários produtos de uma vez numa promoção?**
Sim, no passo 5 existe a opção **"Importar planilha"** — baixe o modelo, preencha com os produtos e descontos desejados, e faça o upload (formato .xlsx). O Portal mostra quantos produtos foram encontrados e quantos não puderam ser importados.

**Como cancelo uma promoção?**
Na listagem de Promoções, selecione a(s) promoção(ões) e use a ação de cancelamento em lote, ou abra o detalhe de uma promoção específica para cancelá-la individualmente. O cancelamento pede confirmação, pois não pode ser desfeito depois.

**Como removo só uma loja de uma promoção sem cancelar tudo?**
Abra o detalhe da promoção (clique na linha da lista) — lá aparece a seção "Lojas participantes", com opção de remover uma loja específica sem afetar as demais.

**Consigo colocar um medicamento controlado em promoção?**
Não. O Portal já bloqueia isso na criação da oferta — medicamentos controlados aparecem desabilitados na lista de seleção de produtos do passo 5.

**Existe limite de promoções "Em destaque"?**
Não há limite de quantas promoções podem estar marcadas como destaque ao mesmo tempo. Ter ao menos uma promoção em destaque cria uma seção própria chamada **"Ofertas em destaque"** no aplicativo do consumidor.

---

## Banners

**O que são os Banners do Portal?**
São os anúncios que aparecem no carrossel da home do aplicativo do consumidor. Cada banner tem posição (pode ser reordenado arrastando), imagem, destino do clique, métricas de exibições/cliques, período de divulgação e os estados (UFs) onde é exibido.

**Como crio um novo banner?**
Na tela `Banners`, use o botão **"Novo banner"** no canto superior direito.

---

## Usuários

**Como convido uma pessoa nova para acessar o Portal?**
Na tela `Usuários`, use a opção de convidar/criar usuário. Você vai precisar escolher o **Perfil de acesso** dele (Contato cliente, Gestor de Loja, Gestor de Rede ou Admin — ver seção "Acesso, login e perfis") e vinculá-lo à loja, lojas ou rede correspondente.

**Posso remover o acesso de alguém?**
Sim, na listagem de Usuários existe uma ação para desvincular/remover um usuário — mas usuários com perfil Contato cliente não têm essa ação disponível para eles mesmos (não conseguem remover outros usuários).

**Consigo convidar a mesma pessoa/e-mail para dar acesso a outra loja ou rede?**
Não com o mesmo e-mail. O Portal bloqueia o convite se aquele e-mail já existir no sistema (aparece a mensagem "Parece que o usuário já existe em nosso sistema", com opção de "Voltar" ou "Editar usuário"). Para dar acesso adicional a alguém, edite o cadastro existente em vez de tentar criar um segundo login.

**O que acontece com os usuários se uma loja é removida do Portal?**
Todos os usuários vinculados àquela loja perdem o vínculo automaticamente:
- Um **Contato cliente** (vinculado a uma única loja) continua conseguindo logar, mas passa a ver uma tela em branco, sem loja para trabalhar.
- Os demais perfis (Gestor de Loja/Rede/Admin), se tiverem outras lojas vinculadas, simplesmente deixam de ver os dados da loja removida e seguem vendo as demais normalmente.

Não existe uma função para "mudar" uma loja de GE/rede dentro do Portal — a única forma de reorganizar é removendo e recadastrando o vínculo.

**Enviei um convite de usuário e ele não chegou / deu erro. O que fazer?**
Na maioria das vezes é preenchimento incorreto do e-mail do convidado, ou uma configuração travada no perfil de quem está enviando o convite. Confira se o e-mail foi digitado certo; se persistir, acione o suporte para ajustar o perfil de quem está convidando.

**Dá pra alterar o e-mail de um usuário já cadastrado?**
Sim, mas se o sistema der erro na troca, confira se o novo e-mail já não está associado a outra conta ativa — e-mails duplicados geram conflito e bloqueiam a alteração.

**Dá pra buscar um usuário pelo CPF para redefinir senha ou trocar e-mail?**
Sim, o painel permite buscar por CPF para localizar o cadastro e seguir com a redefinição.

---

## Catálogo de produtos

**Eu, como associado, posso cadastrar um produto novo direto no Portal?**
Não diretamente — o catálogo de produtos é **centralizado e compartilhado entre todas as Redes** da plataforma, gerenciado pelo time da Farmarcas (perfil Admin). Mas o pedido para incluir um produto novo é **self-service**: você mesmo envia a solicitação pela tela Estoque (ver seção Estoque, "Como solicito um produto que ainda não existe no catálogo?"), só a aprovação final é que fica com a Farmarcas.

**O que é uma Solicitação de produto?**
É o pedido para incluir um produto novo (nome, fabricante, EAN, apresentação e imagem) no catálogo mestre da plataforma, enviado pelo associado a partir da tela Estoque. A solicitação é analisada pelo time Farmarcas (Admin), que aprova ou reprova — o produto só passa a existir e pode ser vendido depois de aprovado.

**Consigo cadastrar produtos e preços em massa, ou preciso fazer um por um?**
Dá para fazer em massa, via carga de dados (planilha/integração) — não precisa cadastrar produto por produto manualmente.

**Um produto meu não pode entrar em promoção, por quê?**
Cada produto no catálogo tem uma configuração chamada **"Permitir promocionar"**, feita no cadastro do produto (gerenciado pela Farmarcas). Se estiver desativada, o produto não pode ser **adicionado** a nenhum grupo promocional. Detalhe: se o produto já estava num grupo promocional antes de receber essa restrição, ele não é removido automaticamente do grupo — a regra só vale para novas inclusões.

**O que acontece quando um produto é "despublicado" do catálogo?**
Ele deixa de ser exibido no catálogo de todas as lojas — mesmo que uma loja continue enviando aquele EAN via integração com o ERP, ele não volta a aparecer. O registro do EAN continua existindo em pedidos antigos e relatórios, só a exibição futura é bloqueada.

**O que muda quando um produto é marcado como "Genérico"?**
No aplicativo, aparece uma tag "genérico" no detalhe daquele item para o consumidor.

---

## Precificação e descontos vindos do ERP (ex: sistema BIG)

> Estas perguntas são mais técnicas e giram em torno do **ERP do associado** (BIG, Alfa 7/Alpha7, Soft), não do Portal em si — mas são comuns o suficiente para o bot reconhecer e orientar o primeiro passo.

**Por que a configuração de preços e descontos no meu ERP parece tão complexa?**
É comum na maioria dos sistemas de ERP (BIG, Alpha7, Soft): existem múltiplas variáveis e formas de aplicar desconto e estruturar preço, o que gera bastante campo de preenchimento.

**Como funciona a lógica de desconto no sistema BIG?**
O BIG parte de uma **Tabela de Desconto**: toda vez que o módulo Radar Farma é configurado, uma tabela padrão é definida como ponto de partida para as regras do sistema.

**Como investigar por que um produto está com preço/desconto errado (sistema BIG)?**
Siga do geral para o específico:
1. **Tabela de Desconto do Produto** — veja se existe uma regra específica para aquele produto.
2. **Desconto do Grupo** — se não houver regra específica, confira se o grupo daquele produto tem desconto automático ativo.
3. **Cadastro do Produto** — por último, confira se existe uma regra de "Preço Filial" aplicada, e se o produto não está marcado como inativo no sistema.

---

## Integração ERP Alpha7

**Meus pedidos do app estão entrando no ERP Alpha7 como "Orçamento em cotação", em vez de já virarem pedido de entrega para faturar no PDV. Por quê?**
Esse é o comportamento padrão da integração atual do Alpha7: os pedidos do app chegam ao ERP, mas entram inicialmente na listagem de orçamentos, não direto como pedido de entrega.

**O que fazer para o pedido aparecer no PDV para faturamento?**
Fluxo manual, por enquanto:
1. Acesse a listagem de orçamentos no ERP.
2. Abra o orçamento correspondente ao pedido do app.
3. Altere o status de "Orçamento em cotação" para **"Orçamento de entrega"**.
4. Depois dessa conversão, o pedido fica visível no PDV para emissão de nota e faturamento.

**Isso vai continuar sendo manual?**
A equipe de tecnologia da Farmarcas já está em contato com o time da Alpha7 para tornar esse fluxo automático (pedidos entrando direto como entrega). Está em avaliação de viabilidade técnica pelo lado da Alpha7, sem data confirmada.

---

## Meios de pagamento (Braspag, Cielo, Rede, Antifraude)

**Como contrato a Braspag? Tem mensalidade ou taxa inicial?**
A contratação é **100% self-service pelo próprio Portal**, em `Configurações > Pagamentos` — não precisa (e não deve) abrir chamado de suporte para isso.

**Por que preciso assinar um contrato via D4Sign enviado pelo ERP, se a integração por API não tem custo?**
Mesmo sem taxa de integração, a assinatura é **obrigatória** por exigência regulatória e de LGPD — é o termo de aceite para o compartilhamento e tráfego de dados de clientes entre os sistemas.

**Quem ajuda na configuração do Antifraude da Braspag?**
O suporte do e-commerce orienta o fluxo inicial (kickoff), mas o acompanhamento detalhado do antifraude é feito junto com a própria Braspag/adquirente.

**O link do contrato Braspag veio com CNPJ/Razão Social errados. Como corrigir?**
É preciso levantar os dados corretos da loja e pedir ao suporte interno a geração e reenvio de um novo link D4Sign.

**Estou recebendo muitos erros de "Cartão Inválido" ou "Compra não finalizada" numa loja específica. O que pode ser?**
Geralmente está ligado a instabilidade na adquirente (Cielo, Rede etc). Vale confirmar se a loja está usando a adquirente homologada correta para o perfil dela, e se o e-commerce já foi incluído/liberado no painel da própria credenciadora de cartões.

---

## Notificações, instabilidades e contingência

**Paramos de receber notificação de pedido novo via WhatsApp depois de uma atualização do Portal. O que houve?**
O serviço antigo de notificação via WhatsApp foi descontinuado. Um novo sistema, mais estável, está em fase de implementação/subida em produção.

**O Portal ou o app estão fora do ar / não consigo logar. Existe um link alternativo?**
Sim, em caso de suspeita de instabilidade na URL principal, há um link de contingência: `https://admin-ecomm.radarfarmarcas.com.br/network/list`.

---

## Perguntas sem resposta confirmada

- **`SessionPermissionGuard` desabilitado no front-end** (achado técnico da exploração de código, não é dúvida de associado) — sem confirmação se é proposital ou dívida técnica; sem impacto conhecido no dia a dia do Portal. Mantido só como registro para o time de engenharia, não para o bot responder a associados.

Todos os demais pontos que estavam em aberto (atendimento de pedidos em Grupo de lojas, definição de "Anjo", bug do modal de cancelamento) já foram esclarecidos e incorporados ao conteúdo acima.

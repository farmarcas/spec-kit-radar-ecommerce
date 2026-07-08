# Kickoff Farmarcas - Interplayers

**Data:** 07/07/2026
**Fonte:** Anotações do Gemini (Google Meet), arquivo `Kickoff Farmarcas - Interplayers - 2026_07_07 13_58 GMT-03_00 - Anotações do Gemini.docx`
**Convidados:** Felipe Goncalves, Gabriel Costa, Thiago Fernandes dos Santos, joceli junior, Leon Vitor Mansoni Viana, Kaleb Borda, Pedro Silveira, sandro.viana@interplayers.com.br, Diego Moritz, Daniel Costa Vieira da Silva, Victor de Souza, Gutierre Uelinton de Araújo Martins, Rodrigo Nery, Matheus Justino

> Esta transcrição editável foi gerada por computador (Gemini/Google Meet) e pode conter erros. Alguns trechos de fala sobreposta e ruídos de reconhecimento de voz foram mantidos como no original.

---

## Resumo

Alinhamento técnico sobre integração com Programa de Benefícios de Medicamentos e definição da arquitetura de fluxos de consumo.

### Integração e Escopo Técnico

A integração foca na jornada de compra e cadastro de consumidores. A arquitetura utiliza autenticação via API com renovação de tokens e carga de tabelas por Cadastro Nacional da Pessoa Jurídica.

### Regras de Negócio Estabelecidas

O sistema valida a elegibilidade via Cadastro de Pessoas Físicas e prioriza automaticamente o melhor desconto. Transações confirmadas possuem prazos definidos para cancelamentos individuais por laboratório.

### Ambiente de Testes Homologado

Foi confirmada a disponibilidade de um ambiente de homologação para testes seguros. A implementação da Lei Geral de Proteção de Dados segue em análise técnica de alternativas.

## Próximas etapas

- [ ] **[Felipe IP]** Analisar volumetria: realizar estudo sobre a quantidade de dados por CNPJ raiz e compartilhar os resultados.
- [ ] **[Sandro Messias]** Criar grupo WhatsApp: estabelecer um canal de comunicação no aplicativo de mensagens para alinhar os detalhes da integração.
- [ ] **[Felipe IP]** Fornecer especificações API: enviar a documentação e detalhes dos endpoints para o modelo de cadastro completo incluindo LGPD.
- [ ] **[Thiago Fernandes dos Santos]** Validar fluxos front-end: verificar junto aos desenvolvedores da interface como tratar os retornos de links para cadastros e termos de adesão.
- [ ] **[Felipe IP]** Enviar modelos API: enviar os modelos de interface de programação de aplicações para análise e verificar qual opção seguir para o consumidor.
- [ ] **[O grupo]** Estudar API: analisar os retornos da interface de programação de aplicações para validar a integração e sanar possíveis dúvidas.
- [ ] **[Sandro Messias]** Criar grupo: criar o canal de comunicação no WhatsApp para suporte e dúvidas da equipe.
- [ ] **[Thiago Fernandes dos Santos]** Adicionar membros: adicionar os participantes da equipe ao novo grupo de mensagens.

## Detalhes

### Objetivos da Sprint de Integração (00:02:44)

Daniel Costa Vieira da Silva abriu a reunião definindo que o foco da primeira sprint é a integração do aplicativo com a Interplayers, possibilitando o cadastro do consumidor e a realização de compras com o programa PBM. O escopo inclui a apresentação da vitrine, a consulta da carga diária, a exibição de condições de preço, a aplicação de tags de desconto de laboratório e a finalização da jornada de compra.

### Estrutura das Equipes (00:06:29)

Daniel Costa Vieira da Silva esclareceu a divisão das responsabilidades: a "Squad Aplicativo" será responsável pelo desenvolvimento da funcionalidade voltada ao consumidor final, enquanto a "Squad Core" está trabalhando na refatoração da infraestrutura do produto, incluindo estoque, catálogo e precificação, que estão diretamente vinculadas à frente do PBM.

### API de Autenticação (Token) (00:10:34)

Sandro Messias apresentou o fluxo de autenticação via API, que utiliza Client ID e Client Secret para gerar um token de acesso. Este token possui validade de 60 minutos e o sistema retorna status 200 (OK) para requisições bem-sucedidas ou 401 para autorização negada; a recomendação é automatizar a renovação do token para evitar interrupções no fluxo do carrinho.

### API de Carga de Tabelas (00:11:41)

Sandro Messias introduziu a API de carga de tabelas, que fornece informações críticas como códigos EAN, descontos máximos e mínimos e campanhas vigentes. A orientação técnica é que a execução desta carga ocorra diariamente entre 05:00 e 06:00 da manhã para garantir a atualização dos dados.

### Lógica de Requisição por CNPJ (00:14:02 / 00:16:30)

Felipe IP explicou que a API de carga de tabelas é organizada por CNPJ raiz, permitindo que uma única requisição retorne todos os produtos e condições vinculados àquela raiz específica, em vez de realizar requisições individuais por filial.

### Volumetria e Gestão de Consultas (00:16:30 / 00:19:09)

Thiago Fernandes dos Santos discutiu a volumetria das requisições dado o grande número de farmácias independentes associadas. Felipe IP reforçou que a estrutura por CNPJ raiz consolida os dados, sendo necessária apenas uma requisição diária, o que otimiza o consumo da API.

### Fluxo do Consumidor e Verificação de Programa (00:21:14)

Sandro Messias detalhou que, na vitrine, o sistema verifica se o produto pertence ao programa de desconto e se o consumidor deseja ser identificado. Caso o consumidor opte pela identificação e não esteja aderido ao programa, o sistema redireciona para um termo de LGPD e um formulário de adesão.

### Lógica de Melhor Desconto (00:22:44)

Sandro Messias explicou que o sistema prioriza a aplicação do "melhor desconto"; caso o desconto da rede farmacêutica seja superior ao oferecido pelo PBM, a rede arca com a diferença, garantindo a vantagem para o cliente.

### Consulta de CPF e Elegibilidade (00:24:05 / 00:26:32)

Uelinton de Araújo Martins e Thiago Fernandes dos Santos questionaram se a elegibilidade do CPF estaria contida na carga diária de produtos. Felipe IP e Sandro Messias esclareceram que a consulta por CPF é realizada via uma API específica e distinta da carga de tabelas, sendo necessária para verificar condições de desconto customizadas por cliente no momento da seleção.

### Restrição de Troca de CPF no Fluxo (00:32:34)

Diego Moritz levantou uma questão sobre a possibilidade de trocar o CPF durante o fluxo de compra. Felipe IP e Sandro Messias confirmaram que, uma vez iniciado o fluxo de adesão ou consulta com um determinado CPF, não é possível alterá-lo na mesma transação; seria necessário iniciar uma nova operação caso o consumidor deseje consultar outro CPF.

### Finalização de Transação e Prazo Fiscal (00:34:47)

Sandro Messias orientou que, após a emissão do documento fiscal, a transação deve ser confirmada via API. Existe um prazo de até 7 dias para confirmar a venda ou anular a transação caso o produto não seja entregue, garantindo o correto ajuste do saldo do consumidor.

### API de Cancelamento e Extrato (00:37:04)

Sandro Messias apresentou a API de cancelamento, destinada a reverter transações já confirmadas, destacando que, se houver produtos de diferentes laboratórios (PBMs) na mesma venda, o cancelamento deve ser disparado separadamente para cada um. A API de extrato também foi apresentada como uma ferramenta de gestão interna, recomendada para execução matinal.

### Ambiente de Homologação (00:38:20)

Diego Moritz perguntou sobre a existência de um ambiente de testes, e Felipe IP e Sandro Messias confirmaram a disponibilidade de um ambiente de homologação. As credenciais fornecidas para esse ambiente permitem a realização de testes sem impacto em produção.

### Comunicação e Alinhamento (00:39:41)

Sandro Messias propôs a criação de um grupo no WhatsApp para facilitar a comunicação entre as equipes da Interplayers e o time interno, sugestão aceita por Thiago Fernandes dos Santos e pelos demais participantes.

### Opções de Integração de Cadastro (LGPD) (00:42:48 / 00:45:11)

Felipe IP apresentou duas alternativas para a adesão e LGPD: a utilização de URLs externas fornecidas pela Interplayers ou o desenvolvimento de uma integração nativa, onde a equipe do aplicativo captura os dados do cliente e envia via API para a Interplayers. O time optou por analisar ambas as possibilidades para decidir qual oferecerá a melhor experiência ao consumidor.

---

## Transcrição

### 00:00:13

**Uelinton de Araújo Martins:** Que reunião é essa?
**Kaleb Borda:** Sabendo de quem é essa reunião aqui?
**Uelinton de Araújo Martins:** PBM, velho. A gente vai fazer integração com a Interplays. Aí a gente vai fazer um kickoff para entender como vai ser a integração, né? O Daniel tá liderando aí. Daniel, Mateus também, né, Dani?
**Daniel Costa Vieira da Silva:** É, eu tô na verdade só esperando o tio entrar aí, a gente começa, mas acho que o Sandro já tá na sala aí, que é lá da Interplayers.
**Uelinton de Araújo Martins:** Uhum.
**Daniel Costa Vieira da Silva:** Mais um momento pra gente alinhar o meio-campo, tirar algumas dúvidas, se vocês tiverem dúvidas também, mas kickoff mesmo pra gente dar o start porque no aplicativo começa amanhã.
**Uelinton de Araújo Martins:** Sim. Sorry.
**Daniel Costa Vieira da Silva:** Só esperar o tio entrar.
**Daniel Costa Vieira da Silva:** Ô Sandro, do lado de vocês vai entrar mais alguém?
**Sandro Messias:** Vai entrar o Felipe.
**Daniel Costa Vieira da Silva:** Beleza.
**Gabriel Costa:** Boa tarde,

### 00:02:44

**Daniel Costa Vieira da Silva:** E aí, Gabis? Boa tarde.
**Uelinton de Araújo Martins:** Boa tarde,
**Daniel Costa Vieira da Silva:** mais uns dois minutinhos e a gente já começa. Vi que o nosso Felipe tá aí. Bom, galera, bora lá. Tá faltando o tio e o Felipe, eles devem entrar daqui a pouquinho. Só fazer uma abertura aqui: apresentar para vocês o Sandro e o Felipe, que são do time da Interplayers. E o pessoal do squad aplicativo — a gente refinou as histórias que vamos começar na próxima sprint. Então, a nossa primeira sprint tem o objetivo de conseguir cadastrar um consumidor na Interplayers. Isso tange o cadastro do consumidor em si, a consulta e o cadastro e tudo que vem na jornada até essa etapa: a apresentação da vitrine, a consulta da carga diária, trazer os produtos, trazer as condições de preço, aplicar a tag de desconto laboratório no produto, conseguir mostrar o preço na vitrine. Então a nossa primeira sprint vai abranger todas essas histórias até o momento em que a gente conseguir consultar/cadastrar um consumidor.

### 00:06:29

**Daniel Costa Vieira da Silva:** Meu objetivo principal aqui é apresentar os meninos para vocês. Tô entendendo que o Sandro e o Felipe — meninos, me corrijam se eu tiver errado — vão ser o nosso ponto de contato durante o fluxo de integração. Do nosso lado, a gente tem os desenvolvedores da squad aplicativo, que é o time que vai desenvolver diretamente a feature pro consumidor utilizar no aplicativo, conseguir se cadastrar e comprar com PBM no app. E tem a galera de uma outra squad, que a gente chama de squad core, que tá refatorando toda a infraestrutura do produto — estoque, catálogo, produto, preço. Então o PBM acaba sendo uma frente que impacta diretamente, tem muito link com o trabalho que o pessoal tá fazendo na parte de produto, preço e estoque também. Por isso a galera tá aqui. O objetivo é trazer esse primeiro momento pra vocês. Nosso sprint começa amanhã, então é o momento de vocês trazerem as dúvidas.

### 00:07:27

**Daniel Costa Vieira da Silva:** Eu vi que vocês tentaram já conectar na API da galera da Interplayers e tiveram alguns retornos de erro. Acho que o momento é mais de tirar dúvida, tanto de contexto quanto de parte técnica, dúvida de documentação. Todo mundo que tiver algum ponto a ser tratado com o time deles, o momento é esse pra gente começar. E ao longo das sprints, ao longo do desenvolvimento, a galera segue à disposição — se precisarmos de novos momentos, a gente marca com eles também, todo o fluxo por e-mail, WhatsApp. É mais fazer essa ponte pra vocês se conhecerem nesse primeiro momento, tirar dúvida, fazer um kickoff, e amanhã a gente conseguir iniciar com confiança e tranquilidade. Acho importante vocês trazerem as dúvidas, principalmente as que surgiram no refinamento técnico, tipo como testar.
**Thiago Fernandes dos Santos:** Boa tarde aí, pessoal. Desculpa, entrei um pouco atrasado, mas queria ouvir o Sandro, se ele tem também uma estrutura de kickoff que já é apresentada pros clientes de vocês.

### 00:08:49

**Thiago Fernandes dos Santos:** Acho importante vir primeiro da Interplayers, eles apresentarem como fazem essa integração. A gente já deu uma estudada e depois, na sequência, a gente traz as dúvidas.
**Sandro Messias:** Boa tarde, pessoal. Eu vou apresentar aqui o fluxo do aplicativo pra vocês; conforme eu for apresentando e surgir dúvida, vocês vão pausando e a gente vai tirando as dúvidas, tá? Deixa eu compartilhar a tela... só um momento, pessoal.
**Daniel Costa Vieira da Silva:** Só um ponto, uma dúvida antes de você começar. A nossa integração aqui, eu acho que é de marketplace, né? É essa apresentação, é o mesmo fluxo.
**Sandro Messias:** Seria essa mesma também.
**Daniel Costa Vieira da Silva:** Beleza.
**Felipe IP:** É que as premissas são as mesmas, tá pessoal?
**Sandro Messias:** Vocês conseguem ver aí minha tela? Tá passando normal ou tá travando?
**Daniel Costa Vieira da Silva:** Tá normal. Pode seguir.
**Sandro Messias:** Beleza, pessoal.

### 00:10:34

**Sandro Messias:** Hoje eu vou apresentar aqui o fluxo de e-commerce, aplicativo, que também serve aqui pro marketplace, tá? Dando início: a nossa primeira API seria o token. O token é como se fosse uma chave de autenticação — a gente vai disponibilizar o client e o client secret. Toda requisição que for acionada deve enviar esse token. Esse token tem um prazo de 60 minutos, mas também tem a possibilidade de vocês automatizarem a renovação, caso ocorra algum tipo de erro no meio da transação, pra vocês não se preocuparem. Vamos supor que esteja na parte do carrinho e o token expire — como vai estar automatizado, vocês conseguem seguir normalmente. Aqui seria um demonstrativo do token: quando ele retorna 401, entendemos que a autorização não foi aceita; quando a requisição for aceita, retorna 200 (OK), e entendemos que está ocorrendo de forma correta.

### 00:11:41

**Sandro Messias:** Sobre o token, ele é bem simples, tá pessoal? Ficou alguma dúvida?
**Thiago Fernandes dos Santos:** Por enquanto não.
**Sandro Messias:** Beleza. Se eu tiver falando baixo, vocês me avisam, tá? Hoje eu tô no presencial e tá um pouco de barulho aqui.
**Thiago Fernandes dos Santos:** Tranquilo.
**Sandro Messias:** A nossa próxima API seria a carga de tabelas. A gente costuma dizer que é a nossa API mais rica em informação. Ela vai trazer todos os EAN, desconto máximo, desconto mínimo, textos informativos, novas campanhas, e as indústrias credenciadas àquele CNPJ. A gente sempre orienta acionar a carga entre 5 e 6 horas da manhã, pelo fato de estar iniciando o dia e vocês trabalharem com a carga atualizada 100%. A gente sempre orienta fazer um backup do dia anterior, e execuções diárias — uma vez que a carga foi acionada, não precisa acionar novamente. Aqui seria um demonstrativo de vitrine.

### 00:12:55

**Sandro Messias:** Aqui seriam nossos retornos da API: o EAN, o nome do produto, o desconto mínimo, que a gente orienta sempre colocar pro cliente ter visibilidade. Aqui também é um demonstrativo de vitrine. E aqui é a parte mais importante, que seria o fluxo do consumidor. Antes de eu iniciar, ficou alguma dúvida sobre a carga?
**Thiago Fernandes dos Santos:** Eu tenho, Sandro. Sobre a carga —
**Sandro Messias:** Pode falar, pessoal, se surgir dúvida — vocês podem ir falando que eu tô compartilhando e não vejo quem levanta a mão.
**Thiago Fernandes dos Santos:** Você tá me ouvindo?
**Sandro Messias:** Tô sim.
**Thiago Fernandes dos Santos:** Sobre essa carga de produtos: é um request só que eu faço para retornar todos os produtos e os tipos de promoção, ou eu preciso fazer vários? É por CNPJ que eu busco essas promoções, esse programa de desconto?

### 00:14:02

**Felipe IP:** Thiago, desculpa cortar, mas referente à carga: a gente tá desenvolvendo aqui uma carga do marketplace, que já foi enviada na documentação, e vai ser necessário apenas o envio da carga, que vai retornar os CNPJs — a raiz do CNPJ — e os produtos credenciados àquela raiz. Vai ser apenas uma requisição ao dia.
**Thiago Fernandes dos Santos:** Tá, tá.
**Felipe IP:** E aí vocês vão ter que ler de acordo com o CNPJ e os produtos que estão dentro.
**Thiago Fernandes dos Santos:** Entendi. Isso já tá em desenvolvimento ou já tem uma API que já devolve?
**Felipe IP:** Já tem a API em pré-produção e a gente tá prevendo subir em produção durante esses próximos dias.
**Thiago Fernandes dos Santos:** Ah, legal.
**Felipe IP:** Provavelmente, quando for subir em produção, quando a gente finalizar a integração, já vai estar em produção essa funcionalidade.
**Thiago Fernandes dos Santos:** É que a gente também já iniciou o nosso desenvolvimento aqui do nosso lado.

### 00:15:04

**Thiago Fernandes dos Santos:** Então eu acho que seria bom, talvez Dani, dar uma segurada nessa da carga, porque a API que a gente vai consumir ainda não tá em produção, né?
**Felipe IP:** Mas a carga, acho que é legal a gente desenvolver em homologação, durante os testes; provavelmente essa nova carga já vai estar em produção. Aí vai dar tudo certo pra fazer a subida do projeto. Então acho legal a gente fazer o desenvolvimento dessa carga que já tá naquela documentação que a gente enviou, e quando subir em produção, provavelmente essa carga já vai estar habilitada, e aí segue com as vendas.
**Thiago Fernandes dos Santos:** Ah, entendi. A doc que vocês forneceram pra gente já é essa versão nova?
**Felipe IP / Sandro Messias:** Isso. Ela já tá em pré-produção, já conseguem fazer os testes. O que não tá em produção ainda, mas provavelmente irá subir nos próximos dias.
**Thiago Fernandes dos Santos:** Boa, obrigado. E aí, outra dúvida: qual é a volumetria desse retorno, desses programas?

### 00:16:30

**Thiago Fernandes dos Santos:** É um programa para cada CNPJ ou são programas padrão pra todos os CNPJs? Porque a gente tem mais ou menos 1700 farmácias. Se esse plano variar por CNPJ, a nossa base talvez vai ficar um pouco grande.
**Felipe IP:** Essa carga vem por PJ raiz, Thiago. A nossa credencial é por raiz — se tem uma loja que tem a mesma raiz para três lojas, a gente retorna apenas os produtos vinculados àquela raiz; não retorna por filial, fica mais compacto o retorno. O rate limite geralmente é três requisições por 5 minutos, mas fazendo uma vez ao dia já resolve tudo que precisa ser feito durante o dia. Essa questão de volumetria de dados vai de acordo com o credenciamento das lojas — pode ser que a loja tenha 5 indústrias, retorna esses produtos dessas 5 indústrias; pode ser loja que tenha 15 indústrias, e por aí vai.

### 00:18:01

**Felipe IP:** É de acordo com o CNPJ, de acordo com o credenciamento do CNPJ.
**Uelinton de Araújo Martins:** Felipe, Wellington aqui, boa tarde. Sobre essa questão que o Thiago falou: a gente vai ter que fazer uma request por CNPJ raiz?
**Felipe IP:** Não é uma request por raiz — no response da API vai vir agrupado por raiz.
**Uelinton de Araújo Martins:** Ah, vem agrupado por CNPJ raiz.
**Felipe IP:** Isso, e essa raiz tá vinculada aos produtos abaixo.
**Uelinton de Araújo Martins:** Entendido. Vocês têm uma média do tamanho do payload que é retornado?
**Felipe IP:** Varia de acordo com o credenciamento — quantas lojas tem, quais produtos tem. Geralmente... vou pegar uma rede aqui que a gente tem que retornou 60.000 linhas.

### 00:19:09

**Daniel Costa Vieira da Silva:** Ô Felipe, quantos programas são? Quantas indústrias?
**Felipe IP:** Varia de acordo com o credenciamento da rede.
**Daniel Costa Vieira da Silva:** Eu ia tentar pegar todas essas indústrias e multiplicar por 1700, pra gente chegar no teto, no máximo que daria pra chegar.
**Felipe IP:** A gente pode fazer esse estudo aqui e passar pra vocês, mas de bate-pronto eu não teria essa informação.
**Uelinton de Araújo Martins:** Seria bom, porque a gente tem que preparar a estrutura pra receber essa carga, né? E a carga pode balizar um pouco como a gente vai definir.
**Thiago Fernandes dos Santos:** E outro ponto é que não serão 1700 requests ou menos assim, porque aqui é um associativismo farmacêutico, são farmácias independentes, então elas podem ter esse programa ou não.
**Felipe IP:** Eu acho que o request é um — vocês mandam uma vez, mas os dados que retornam são bastante dados.

### 00:20:05

**Thiago Fernandes dos Santos:** Porque vai ter farmácia... qual CNPJ eu vou utilizar para fazer esse request pra fazer a carga de produtos?
**Felipe IP:** Esse request você faz com a credencial que você tem, e essa credencial é vinculada ao CNPJ.
**Sandro Messias:** Vai ser pelo Client ID, no caso.
**Felipe IP:** Isso, pelo client. Esse client tá vinculado ao CNPJ que vocês têm, esses 1700. E a gente retorna de acordo com esses 1700, por raiz, não filial. Se uma rede tem a mesma raiz e tem três lojas, vai retornar apenas uma vez.
**Uelinton de Araújo Martins:** Beleza.
**Felipe IP:** Resumindo essa questão da carga: vocês fazem uma vez, e no retorno vêm os programas.

### 00:21:14

**Felipe IP:** Os produtos vinculados aos CNPJ raízes vinculados à credencial. Aí vocês consomem a API e fazem a questão da flag, que o Sandro vai explicar depois.
**Sandro Messias:** Bom, pessoal, dando continuidade: aqui seria o fluxo que o consumidor vai fazer no marketplace. O consumidor escolhe o produto, o sistema valida se o produto faz parte do programa ou não. Caso não, segue normalmente com as condições do marketplace. Caso o produto faça parte do programa, o sistema pergunta se o consumidor deseja ser identificado. Caso não, faz uma consulta produto sem o CPF, o marketplace apresenta as condições, e novamente pergunta se deseja se identificar. Caso sim, faz uma consulta desconto com o CPF. Se for um CPF que não esteja aderido ao programa, tem esse desvio de fluxo, e a gente retorna duas URLs: o termo LGPD e o formulário de adesão.

### 00:22:44

**Sandro Messias:** Caso já seja um CPF aderido ao programa, vai direto pra API de carrinho. Aciona a API de carrinho, apresenta o carrinho pro consumidor, e o sistema pergunta se ele deseja adicionar mais produtos. Se tiver, faz esse fluxo de novo; caso não, segue normalmente acionando a página de efetivação. Aqui tem um ponto importante: o melhor desconto — ele só se aplica quando o desconto da rede for maior que o do programa. Vamos supor que o desconto da rede esteja em 30% e o do PBM apenas 20%: a rede vai arcar com 10% de desconto e o PBM completa com os 20%. Ficou alguma dúvida sobre esse fluxo?
**Uelinton de Araújo Martins:** A consulta por CPF ou sem CPF vai ser na carga que a gente recebeu, ou é uma API de vocês, uma consulta separada?

### 00:24:05

**Sandro Messias:** Não, é uma API diferente da carga que você tá mencionando. Vai consultar o CPF do consumidor.
**Uelinton de Araújo Martins:** Ah, pra ver se o CPF do consumidor tem desconto. Era isso que eu queria saber — se esse desconto por CPF vinha na carga, um preço por CPF.
**Sandro Messias:** Não, isso a gente vai consultar via API na hora de selecionar o produto.
**Diego Moritz:** Sandro, eu tenho uma dúvida: são diversas indústrias que o consumidor pode ter acesso, e essa consulta de CPF é feita de forma separada. O consumidor pode estar cadastrado em um programa e no outro não, certo?

### 00:25:10

**Diego Moritz:** E aí toda vez que ele for comprar um produto e não tiver cadastrado, a cada produto de indústria diferente ele vai ter que ficar fazendo esse cadastro, ou tem alguma maneira dessas informações/CPF ficarem salvas de forma automática?
**Sandro Messias:** Nesse caso ele teria que fazer o preenchimento mesmo, quando é indústria diferente.
**Felipe IP:** Isso. Quando a indústria é diferente, o cadastro é outro — cada indústria tem seu próprio termo LGPD e seu formulário de cadastro.
**Diego Moritz:** Boa.
**Thiago Fernandes dos Santos:** Só uma dúvida: eu preciso fazer a consulta na API de vocês mesmo pra cliente deslogado, sem identificação? Eu bato na consulta produto sem CPF?
**Felipe IP:** Esse consulta produto é mais pra vitrine, pra exibir as condições do produto que o consumidor pode chegar.
**Thiago Fernandes dos Santos:** Mas não é o que vem na carga que eu fiz?
**Felipe IP:** Isso, você pode utilizar tanto da carga quanto o consulta produto.

### 00:26:32

**Felipe IP:** O que vem do consulta produto é o que tem na carga. No consulta produto você consegue ver por unidade; e a carga você vê mais uma visão macro do produto.
**Uelinton de Araújo Martins:** Felipe, mas o CPF vem na carga? Por CPF vem na carga também ou não?
**Felipe IP:** Não. Pra CPF você usa o consulta desconto.
**Uelinton de Araújo Martins:** Aí o CPF tem que ser pela API.
**Sandro Messias:** Isso.
**Felipe IP:** O que vem na carga é uma visão geral do produto — desconto mínimo, desconto máximo, preço sugerido caso tenha. A visão mais específica, condição que o CPF tem pro produto, vai tanto no consulta produto quanto no consulta desconto.
**Uelinton de Araújo Martins:** Então, se nossa vitrine tiver 30 produtos, a gente vai ter que fazer 30 requisições quando eu abro o produto?

### 00:27:35

**Felipe IP:** Isso ele não precisa fazer toda vez que ele entrar no site — você faz uma vez ao dia pra enriquecer o sistema e é isso, reutiliza pros canais, pras farmácias. O consulta desconto aí sim vai ter que fazer por requisição, pelo CPF.
**Daniel Costa Vieira da Silva:** É por cliente, né?
**Felipe IP:** Exato. A gente pode orientar tanto fazer pelo consulta produtos quanto pela carga — fazer pelo desconto mínimo em vez de ficar acionando a consulta produto. Mas a consulta produto vem mais detalhada por unidade — leve mais, pague menos, esse tipo de informação.
**Daniel Costa Vieira da Silva:** E o próprio consumidor — se for um consumidor cadastrado há muito tempo, ele pode ter uma condição diferente do consumidor que se cadastrou ontem, por exemplo? Isso volta nessa API também?

### 00:28:39

**Felipe IP:** Sim, isso volta na consulta desconto, que é de acordo com a condição do CPF. O consulta produto é para novos cadastros — retorna a condição para novos cadastros. Se for um CPF já aderido, pode ter outra condição, mas aí ele vai saber quando informa o CPF.
**Sandro Messias:** Bom, pessoal, dando continuidade, mais um demonstrativo de vitrine: aqui seria o consulta produto sem o CPF. O consumidor clicando em "mostrar mais condições" consegue ter a visibilidade de quanto por cento de desconto ele pode obter — aqui uma unidade tá 24% e até três unidades ele consegue 47% de desconto. E aqui seria o retorno das nossas APIs: EAN, suggested price value, desconto de percentual, diversas informações.

### 00:29:52

**Sandro Messias:** Aqui seria quando o consumidor informa o CPF e faz aquele desvio de fluxo que mencionei: para ele realizar o cadastro, aparece o termo de aceite, que a gente devolve nas nossas APIs, e vocês colocam no marketplace de vocês. Aceitando esse primeiro termo, ele informa novamente e retorna o formulário de adesão pra finalizar o cadastro na indústria.
**Thiago Fernandes dos Santos:** Esse termo, Sandro, é essa URL que vai retornar aquele consulta cadastro? Ele retorna essa URL?
**Sandro Messias:** Isso, a gente retorna uma URL nas nossas APIs, que seria essa página aqui.
**Thiago Fernandes dos Santos:** Tá, porque tem um termo de aceite antes, aí depois vai pro formulário.
**Sandro Messias:** Isso, primeiro ele faz esse termo de aceite, onde coloca o CPF e o telefone. Depois novamente aciona com o CPF, e seria o termo de adesão da indústria, um pouco mais detalhado.

### 00:31:11

**Sandro Messias:** Onde ele coloca endereço, e-mail, cidade, essas coisas. Depois de todo esse fluxo, fica visível pra ele até quantas unidades ele pode obter, e segue normalmente pra API de carrinho. A gente sempre orienta, na API de carrinho, colocar essa questão do desconto pro consumidor ter visibilidade. Finalizando o pedido, a gente retorna o NSU nas nossas APIs, e o consumidor segue pra parte de "meus pedidos". Na nota fiscal, a gente orienta colocar nos dados adicionais da nota esse cupom vinculado que a gente retorna na página de efetivação. E aqui seria a separação e entrega do consumidor — bem simples: vai separar o produto e ver se a venda foi feita com o programa ou não. Caso não, segue normalmente com as condições da rede.

### 00:32:34

**Felipe IP:** Sandro, o Diego tem uma dúvida.
**Diego Moritz:** Ô Sandro, nesse fluxo que foi passado sobre a consulta de desconto por CPF: eu vou ter normalmente a opção de trocar o CPF se eu quiser? Fiz a consulta com CPF X e aí quero fazer a consulta com CPF de outra pessoa, pra verificar algum parente — consigo fazer essa troca? A partir do momento que eu coloquei o CPF X, ele vai seguir com aquele mesmo?
**Sandro Messias:** Se você já inseriu o seu CPF e começou a preencher esse primeiro formulário — o do termo de aceite — e colocou pra aceitar, você tem que seguir com ele até o final. Se chegou e fez o aceite com um CPF, e nesse formulário tenta fazer com outro, não é possível.
**Felipe IP:** Aí vai ter que fazer o fluxo de novo.
**Sandro Messias:** Aí você faz o fluxo novamente.
**Felipe IP:** Não tem como você trocar de CPF no meio; vai ser vinculado a outra venda. Você não pode iniciar uma venda com um CPF e finalizar com outro.

### 00:33:45

**Sandro Messias:** Isso, e finaliza com outro. Exatamente. Era essa a sua dúvida?
**Diego Moritz:** É uma das dúvidas, mas, por exemplo, se eu quiser só consultar — já tenho dois CPFs cadastrados, um que não é e outro que já é. Pergunto isso porque vocês falaram da diferença de preços de acordo com o CPF. Se eu quiser fazer essa consulta diferente pra ver se tem desconto maior?
**Felipe IP:** Pode fazer sem problema algum, só que são operações diferentes, não são em conjunto. Você coloca o CPF e vê a condição; se for colocar outro CPF, faz outra requisição e vai trazer as condições daquela requisição.
**Diego Moritz:** Boa, maravilha, obrigado.
**Daniel Costa Vieira da Silva:** Pra nós no front, a diferença vai ser que pode ser que o desconto mude no checkout. Você vai começar o checkout com seu CPF e vai ter um desconto.

### 00:34:47

**Daniel Costa Vieira da Silva:** Aí você começa com outro CPF, pode ter outro. Consulta diferente.
**Diego Moritz:** É, pergunto isso justamente pra não ter venda com condição diferente do esperado.
**Sandro Messias:** Beleza. Aqui na parte da separação, o sistema vai validar se a venda é com o programa; caso não, segue normalmente. Caso sim, o sistema valida se o documento fiscal foi emitido. Se por algum motivo o consumidor não tinha saldo no cartão ou desistiu da venda, deve ser finalizado com a transação anulada (nula). Se ocorrer tudo certo e o documento fiscal foi emitido corretamente, deve finalizar a transação com "confirma". Um ponto de atenção: após a efetivação, a transação fica pendente e o saldo do consumidor fica comprometido, pra não gerar imposição ao estabelecimento. É premissa finalizar a venda com o serviço de "confirma" ou "anula".
**Daniel Costa Vieira da Silva:** Ô Sandro, uma dúvida sobre a anulação.

### 00:35:54

**Daniel Costa Vieira da Silva:** E sobre esse fluxo do SIM: onde eu tenho que mandar o documento fiscal, eu tenho até 7 dias pra mandar, é isso? Do momento que eu inicio a venda com vocês até eu mandar o documento e confirmar, são 7 dias?
**Sandro Messias:** Isso.
**Daniel Costa Vieira da Silva:** Beleza.
**Sandro Messias:** Aqui seria mais um demonstrativo de vitrine: um status do produto "pendente" deve finalizar com "anula". E aqui um status do pedido já aprovado no pagamento deve finalizar a transação com "confirma". Aqui seria a API de cancelamento, diferente da de anula — essa API é pra transações já confirmadas. Por algum motivo o consumidor compra um produto e deseja devolver, ele vai até a loja e faz esse acionamento. O sistema vai perguntar se deseja cancelar a venda; se não, segue normalmente; caso sim, vocês acionam a API de cancelamento.

### 00:37:04

**Sandro Messias:** Alguns pontos importantes: o cancelamento só pode ser feito após emissão do documento fiscal, e a confirmação da venda deve ser realizada em até 7 dias, pra restituir o saldo do consumidor e cancelar a reposição. Se houver produtos de duas administradoras diferentes na mesma transação, deve enviar a API de cancelamento separadamente para cada uma — vamos supor um produto da Novartis e um da Aché, deve acionar a API duas vezes. Mais um demonstrativo de vitrine. E por último, a nossa API de extrato: mais pra gerenciamento interno, também com bastante informação, orientamos acionar entre 5 e 6 horas da manhã. Vai acionar a API de extrato, o sistema realiza a validação dos registros e vê se tem transação pendente. Caso não, segue normal. Caso tenha, o sistema valida se a mercadoria foi entregue ou não — caso não, finaliza a transação com "anula"; caso sim, finaliza com "confirma" normalmente. É mais um dashboard.

### 00:38:20

**Sandro Messias:** É isso. Ficou alguma dúvida, pessoal? Quer que eu volte algum slide?
**Diego Moritz:** Muito obrigado pelo fluxo, ficou certinho. Só ia perguntar: para ambiente de desenvolvimento/stage, vocês possuem algum tipo de sandbox para realizar os testes?
**Sandro Messias:** Perdão, cortou aqui pra mim.
**Diego Moritz:** Queria perguntar se, para os testes em ambiente de stage/desenvolvimento, vocês possuem algum tipo de sandbox.
**Felipe IP:** Sim. Esses testes são em homologação, não vai refletir em produção — pode confirmar quantas vendas quiser, fazer quantas requisições forem necessárias pros testes, porque a gente tem...
**Sandro Messias:** E tem a questão também das credenciais: as credenciais que a gente envia são próprias para um ambiente de homologação, e a gente envia também um CNPJ, então fica tranquilo — é diferente da credencial de produção.

### 00:39:41

**Thiago Fernandes dos Santos:** Boa. Eu tinha mandado umas dúvidas no e-mail, a gente abriu e fez os requests. Não sei se já fizeram aquele ajuste que apareceu lá, se a gente já conseguiria chamar aqueles requests. Você tem algo pra apresentar pra gente no ambiente de homologação?
**Sandro Messias:** Tenho, deixa eu compartilhar.
**Felipe IP:** Vou compartilhar a carga aqui, tá bom pessoal? As demais APIs que estavam ajustando eram da carga — a de carga, mas eu tenho aqui o modelo. Vou fazer a requisição e mostro pra vocês.
**Sandro Messias:** Ô Thiago, aproveitando, acho legal a gente montar um grupo no WhatsApp, fica melhor pra gente se comunicar.
**Thiago Fernandes dos Santos:** Boa.
**Sandro Messias:** Depois se vocês puderem passar o WhatsApp de quem vai participar, acho que fica melhor pra gente se comunicar.

### 00:40:48

**Thiago Fernandes dos Santos:** Vou mandar meu número aqui. Se você quiser criar, a gente vai conversando por lá.
**Sandro Messias:** Beleza.
**Thiago Fernandes dos Santos:** Não sei se o time tem alguma dúvida. Aproveitando enquanto pega os requests: sobre a dúvida na questão das URLs — são duas etapas, né? Uma é o termo de aceite, que já é aberto naquela URL.
**Sandro Messias:** Isso.
**Thiago Fernandes dos Santos:** E aí depois que dá OK, você continua na parte externa pra preencher o formulário do laboratório?
**Felipe IP:** Vai ter que fazer outra requisição pra retornar o formulário.
**Thiago Fernandes dos Santos:** Tá, mas o aceite também é uma URL?
**Felipe IP:** Isso, URL com care code.
**Thiago Fernandes dos Santos:** Acho que a gente vai ter que validar aqui com o time de front também, pra ver como chegam esses retornos pra gente renderizar no aplicativo.

### 00:42:48

**Felipe IP:** A gente tem esse modelo de URL, e a gente tem o modelo de cadastro, que é onde vocês criam o formulário. E tem uma API a mais, que é a API de adesão — vocês montam a tela de vocês e enviam o campo pra gente, a gente valida se está aderido ou não. Tem essas duas opções: tanto URL quanto tela que vocês desenvolvem.
**Thiago Fernandes dos Santos:** Tá, entendi. Mas essa é a primeira etapa, né? A segunda etapa, pra preencher o formulário do laboratório, continua sendo sempre URL? Não tem como montar um formulário do laboratório dentro do app pra ter uma experiência nativa?
**Felipe IP:** Nessa questão de URL, não. Agora, se você for desenvolver a tela de cadastro, a gente tem um modelo aqui pro marketplace, onde você faz o cadastro junto com LGPD — só que aí a tela vocês desenvolvem: preenchem os dados do consumidor, se ele precisar de adesão, e no final tem um opt-in com termo LGPD.

### 00:44:02

**Felipe IP:** Aí ele aceitando o LGPD, aceitando o opt-in, já faz o LGPD e o formulário juntos.
**Thiago Fernandes dos Santos:** Não, eu acho que o formulário junto seria a URL externa do laboratório, ou não?
**Felipe IP:** Tem dois modelos: esse de URL, que você chama uma vez e vem o LGPD, chama outra vez e vem o formulário — tem esse modelo. E tem um modelo que você faz tudo de uma vez, só que a tela do cadastro não vem pra você, vocês que vão ter que desenvolver.
**Thiago Fernandes dos Santos:** Cadastro lá do laboratório?
**Felipe IP:** Isso — vocês fazem a tela de nome, e-mail, data de nascimento, e no final tem o termo LGPD, um opt-in. Vocês fazem o cadastro junto com o termo LGPD de uma vez só.
**Thiago Fernandes dos Santos:** E aí seria a API de vocês que a gente ia chamar pra fazer esse cadastro?
**Felipe IP:** Isso.
**Thiago Fernandes dos Santos:** Vocês podem fornecer também essas APIs? Acho interessante a gente ter essas duas opções já refinadas.

### 00:45:11

**Thiago Fernandes dos Santos:** Porque a gente tá seguindo com a URL, mas talvez no futuro a gente não queira.
**Felipe IP:** Tá bom. Eu acho que, como é a PBM, essa opção da API é melhor pro consumidor, mas a gente manda e a gente verifica qual segue. Voltando aqui pra carga: a gente tem o nosso client aqui de teste. Esse client ID tá vinculado a um CNPJ, ou pode ser vários CNPJs. Você envia a URL com o client ID no final; o parâmetro já vem automático, colocando a chave de client aqui, e vai retornar os produtos referentes a esse CNPJ raiz, tá vendo?
**Thiago Fernandes dos Santos:** Beleza, muito grato.
**Felipe IP:** É isso, esse é o modelo de carga que a gente vai ter em produção e nos testes. Aqui, tudo certinho, vinculado a essa raiz de CNPJ; esses produtos aqui estão vinculados a esse CNPJ e vão exibir na vitrine.

### 00:46:49

**Thiago Fernandes dos Santos:** Eu não cheguei a analisar, não sei se o time já deu uma olhada: nesse response ele traz aquela condição de "leve três e pague dois" ou não?
**Felipe IP:** Não, aqui é uma visão mais macro, como comentei — o texto do produto, o texto da campanha, desconto mínimo e desconto máximo e o preço sugerido.
**Thiago Fernandes dos Santos:** E pra gente pegar essas campanhas, vai ter que ser na quente, na API de consulta produto?
**Felipe IP:** Isso, no consulta produto vai vir por unidade — uma unidade sai tal desconto, duas unidades sai tal desconto. Aqui é uma visão mais macro.
**Thiago Fernandes dos Santos:** OK, beleza. Não sei se o time tem mais alguma coisa, mas acho que a gente já pode começar a estudar os retornos da API e conversar no WhatsApp se surgir alguma dúvida.
**Victor de Souza Gutierre:** Por enquanto, do meu lado, tá tranquilo. Acho que as dúvidas vão aparecendo conforme a gente for desenvolvendo.
**Sandro Messias:** Isso. Bom, eu vou criar o grupo lá, Thiago, e você vai adicionando a galera.
**Thiago Fernandes dos Santos:** Boa, beleza. Vou mandar meu número.
**Sandro Messias:** Beleza. Acho que é isso então, pessoal.
**Thiago Fernandes dos Santos:** Acho que é isso. Muito obrigado aí, Sandro.
**Daniel Costa Vieira da Silva:** Muito obrigado aí.
**Sandro Messias:** Valeu, hein, pessoal.
**Diego Moritz / Victor de Souza Gutierre:** Valeu, galera.

*(Transcrição encerrada após 00:48:42)*

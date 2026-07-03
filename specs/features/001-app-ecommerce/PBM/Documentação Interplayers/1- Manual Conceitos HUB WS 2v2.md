# Manual Conceitos HUB WS 2v2

**Fonte:** 1- Manual Conceitos HUB WS 2v2.pdf (documento original neste mesmo diretório)

---

Interplayers – O HUB de Negócios da Saúde e Bem-Estar
MANUAL DE CONCEITOS
WEB Services Interface – Versão 2v0

Confidencial Interplayers 1/11 Reprodução Proibida

Este documento foi criado para direcionar a integração técnico-operacional,
entre SEU AMBIENTE DE PROCESSAMENTO e o HUB Interplayers,
na filosofia de Processamento Cooperativo padrão
WEB SERVICES DEFINITION LANGUAGE (WSDL) regulamentado pela W3C.

## MANUAL DE CONCEITOS

Apresenta conceitos a serem considerados nas integrações via WEB Services Front End com o HUB.
Deve ser o primeiro material técnico-operacional a ser lido, por conter informações indispensáveis
para o sucesso de cada projeto com qualidade e minimização dos esforços e custos.

Veja EVOLUÇÃO DAS VERSÕES neste documento.

**Este documento encontra-se na versão 2V0.**

## MANUAL DE PROJETO

Apresenta os detalhes específicos do seu projeto, tais como, macro fluxo, funcionalidades e
WEB Services envolvidos.

Conta com FICHA TÉCNICA de Funcionalidades e PLANO DE TESTES como anexos.

## NOTAS

*Exemplos e fluxos apresentados são ilustrativos.*

*Os documentos, softwares e materiais disponibilizados são protegidos por propriedade intelectual,
não podendo ser copiados, reproduzidos ou cedidos sob qualquer forma ou pretexto
sem prévia e formal autorização da Interplayers.*

*A integração por WEB Services é cada vez mais comum, no entanto, existem diversos detalhes que
garante o sucesso do trabalho.*

*Recomentamos a leitura detalhada deste documento para minimizar os esforços e
consequentemente reduzir os custos e tempo para sua realização.*

*No caso de dúvidas, divergências e sugestões contate interface@interplayers.com.br*

---

Interplayers – O HUB de Negócios da Saúde e Bem-Estar
MANUAL DE CONCEITOS
WEB Services Interface – Versão 2v0

Confidencial Interplayers 2/11 Reprodução Proibida

## 1 TERMOS UTILIZADOS

- **PROCESSAMENTO COOPERATIVO**: é termo utilizado para dois ou mais ambientes tecnológicos cumprirem atividades complementares para atender um determindado objetivo de negócio, o qual ocorre na modalidade ativa/receptiva, onde o consumidor da funcionalidade é responsável por requerer seu processamento, cabendo ao provedor da funcionalidade disponibilizá-la para uso.
- **O HUB Interplayers**: estrutura de negócios, de alta disponibilidade, desempenho e segurança, num modelo Bimodal, de alta capacidade de integração para soluções especializadas para o segmento de Saúde e Bem-Estar.

  O **WEB Services** é pode ser estabelecido nos seguintes modelos:

  - **HUB Ativo → SISTEMA/CANAL Receptivo**: Situação onde o HUB invoca funcionalidades providas pelo seu SISTEMA/CANAL.
  - **SISTEMA/CANAL Ativo → HUB Receptivo**: Situação onde o SISTEMA/CANAL invoca funcionalidades providas pelo HUB.
  - **Modalidade Browser**: "Servidor WEB" que provê as telas e funcionalidades browser para consumo dos seus colaboradores e clientes.
  - **Modalidade Server**: "Servidor central" que suporta estações de trabalho ou acessos via APP.

- **WEB SERVICES**: são processos providos pelo **HUB Interplayers** ou invocados pelo **SISTEMA/CANAL**, com o objetivo de efetuar funções previamente definidas, com agilidade e eficiência, de forma normatizada.
- **WEB SERVICES HUB**: Adotam o REST - Representational State Transfer como protocolo de comunicação, os dados trafegados adotam notação JSON (JavaScript Object Notation) e aceita GET, POST, PUT e DELETE como métodos/verbos HTTPS.
- **TESTES INTEGRADOS**: Trata-se de uma atividade conjunta das equipes do **SISTEMA/CANAL** e da **HUB InterPlayers** que realizam integralmente os testes do roteiro objetivando checar o funcionamento da interface.

---

Interplayers – O HUB de Negócios da Saúde e Bem-Estar
MANUAL DE CONCEITOS
WEB Services Interface – Versão 2v0

Confidencial Interplayers 3/11 Reprodução Proibida

## 2 CONCEITOS ADOTADOS PELO HUB

### 2.1 Funcionalidade

Entende-se por FUNCIONALIDADE, cada atividade de negócio que pode ser cumprida por um ou mais WEB Services. O MANUAL DE INTEGRAÇÃO cita funcionalidades na especificação do fluxo e uma tabela indicando qual ou quais WEB Services cumprem cada funcionalidade. Por exemplo: A funcionalidade "Autorização de Descontos" é cumprida por dois WEB Services, o 1º WS com o pedido de autorização e respectiva resposta e o 2º WS confirmando que a funcionalidade foi recebida com sucesso pelo SISTEMA/CANAL.

### 2.2 Transação

Entende-se por TRANSAÇÃO, cada operação de negócio executada na interface. Durante o atendimento de um consumidor, pode ocorrer a execução de múltiplas funcionalidades, desde a montagem do carrinho de compras, definição do frete, cadastro do comprador e pagamento, entre outras. Todo este conjunto corresponde a um atendimento e portanto é considerado uma única TRANSAÇÃO. Elas seguem a seguinte classificação:

- **Por Evento**: Iniciada pelo SISTEMA/CANAL ou pelo HUB para cumprir uma funcionalidade.
  Ex: Consulta Descontos, Pedido de Autorização, etc
- **Agendada**: Iniciada pelo SISTEMA/CANAL ou pelo HUB em horário pre-determinado.
  Ex: Carga de Tabelas, Execução de uma consulta agendada, etc
- **Requerida**: Iniciada pelo SISTEMA/CANAL ou pelo HUB em resposta de outra funcionalidade.
  Ex: Pedido de Autorização pode solicitar uma função de Cadastro do Consumidor, etc.

### 2.3 Individualidade

Cada participante do processo de interfaces é identificado individualmente, objetivando manter a qualidade e segurança do ambiente. Além disto, de acordo com as regras definidas nestes documentos, é aplicado um processo de Autenticação que garante o acesso por um dado período de tempo.

### 2.4 Autenticação

Cada chamada de WEB Services contém, no header da requisição HTTPS, um token de acesso que identifica unicamente o sistema de origem e permite a confirmação da habilitação no acesso aos WEB Service desejados.

### 2.5 Unicidade

Tem por finalidade garantir que, tanto o SISTEMA/CANAL quanto no HUB Interplayers, tenham total rastreabilidade das TRANSAÇÕES, para evitar o reprocessamento indevido e para tratar exceções. Existem alguns atributos que devem ser mantidos inalterados em todos os WEB Services da TRANSAÇÃO, para possibilitar a sua identicação. O Hub Interplayers foi construída para suportar requisições duplicadas, inclusive nos casos de Timeout e para isto utiliza estes atributos.

### 2.6 Otimização

Em alguns projetos, é requerida carga de tabelas com o objetivo de agilizar o processamento, pela redução de consultas remotas. A cada carga uma nova versão (atributo Version) da tabela é definida. O acionamento da transação de carga de tabela deve ser agendada diariamente para evitar a atualização

---

Interplayers – O HUB de Negócios da Saúde e Bem-Estar
MANUAL DE CONCEITOS
WEB Services Interface – Versão 2v0

Confidencial Interplayers 4/11 Reprodução Proibida

em horário nobre. No caso de tabela defasada (versão antiga), a TRANSAÇÃO em andamento recebe status de erro e requer carga imediata. Após a carga a TRANSAÇÃO que recebeu retorno com erro deve ser submetida novamente. É aconselhado a realização da carga de tabelas por volta das 06:00hs, horário no qual todas as informações estão atualizadas.

### 2.7 Controle

A interaçao entre o SISTEMA/CANAL e o HUB Interplayers precisa ocorrer de forma perfeita. No retorno de execução de cada um dos WEB Service, o SISTEMA/CANAL deve controlar o status de cada interação.

Os WEB Services do HUB contemplam dois grupos de atributos: SISTÊMICOS (que devem ser tratados pelo SISTEMA/CANAL de forma automática e os INTERATIVOS (que devem ser apresentados para o operador do SISTEMA/CANAL para apoiá-lo em tempo de operação e suporte).

[Diagrama de fluxo de controle: Um fluxograma mostra o processo de tratamento de status. À esquerda, um bloco "AUTENTICAÇÃO" alimenta dois ramos: "CARGA TABELA — Transação Agendada" e "TRANSAÇÃO — Transação Por Evento". Esses ramos seguem para uma sequência de três losangos de decisão numerados com o círculo "1": "Status Code" (Erro/OK), "Status Transação" (Erro/OK) e "Desvio Fluxo" (Não/Sim) e "Status Ocorrência" (Erro/Sim). Cada caminho de "Erro" ou "Sim" (conforme o caso) direciona para um bloco à esquerda chamado "Tratamento de Exceção — Dos 3 status do fluxo acima", numerado com o círculo "1", que leva a "Apresenta mensagem". No caminho "OK", segue-se para "Re-executa mesma TRANSAÇÃO"; a partir de "Desvio Fluxo = Sim" segue para "URL ITERATIVA" (Sim/Não): se "Sim", "Apresenta URL"; indica-se também "Transação Requerida" como rótulo do fluxo entre as decisões. Se "Desvio Fluxo = Não" e não há URL iterativa, o fluxo segue para "Trata cada Ocorrência Se houver".]

### 2.8 Paginação

Em algumas consultas de dados a quantidade de informações é muito grande e obriga a transferência segmentada de dados do HUB Interplayers. Verifique se no MANUAL DE PROJETO e no MANUAL TÉCNICO WEB SERVICES se há algum WEB Services tem esta característica. Seu SISTEMA/CANAL pode repetir o WEB SERVICES até o final das páginas ou até obter a página desejada.

### 2.9 Restrição de acessos

Objetivando garantir aos participantes da conectividade, as chamadas dos WEB Services do HUB Interplayers são reguladas por políticas de acesso que limitam a quantidade de requisições para cada um dos recursos disponíveis. Se o limite é excedido, a requisição é respondida com um status code específico e mensagem informando a quantidade excedida.

### 2.10 TimeOut

O processo de troca de mensagens envolve diversos componentes e uma falha em qualquer um deles pode provocar uma falta de resposta por tempo acima do máximo adequado. Este fenomemo é denominado Time Out. O HUB Interplayers conta com estrutura de contingência que reduz este risco.

Para isto, seu SISTEMA/CANAL deve estabelecer um contador de tempo máximo de espera (recomendado: 30 segundos). Quando este tempo é atingido sem o retorno, seguir o fluxo abaixo:

- No 1º e 2º TimeOut re-enviar para o link principal com instrução "Aguarde reenvio 1" e "reenvio 2"
- No 3º e 4º Time Out re-enviar para link contingência com instrução "Aguarde reenvio 3" e "reenvio 4"
- No 5º time Out apresentar instrução "Serviço temporariamente indisponível. Tentar novamente? <SIM> ou <NÃO>". No caso de <SIM>, repetir todo o processo.

---

Interplayers – O HUB de Negócios da Saúde e Bem-Estar
MANUAL DE CONCEITOS
WEB Services Interface – Versão 2v0

Confidencial Interplayers 5/11 Reprodução Proibida

### 2.11 Desvio de Fluxo

Durante a execução da TRANSAÇÃO, pode ocorreu uma instrução de desvio de fluxo. Existem dois tipos:

- **Instrução para executar outra funcionalidade**. Um exemplo disto é uma consulta de descontos para um consumidor não cadastrado. O HUB nota que se trata de um novo consumidor e retorna desvio de fluxo para que seja executado o serviço adesão do shopper. Após a execução do cadastro, a consulta deve ser re-submetida para que o consumidor se beneficie dos descontos.
- **Instrução para submeter uma URL**. Usado para atender a constante evolução dos programas, sem que haja necessidade e nem investimentos na atualização do SISTEMA/CANAL. Um URL é lançada para obter um dado importante para o processo. Logo após o encerramento desta URL, o SISTEMA/CANAL deve re-submeter a TRANSAÇÃO que recebeu a instrução de desvio de fluxo.

---

Interplayers – O HUB de Negócios da Saúde e Bem-Estar
MANUAL DE CONCEITOS
WEB Services Interface – Versão 2v0

Confidencial Interplayers 6/11 Reprodução Proibida

## 3 INFORMAÇÕES COMPLEMENTARES

### 3.1 Acesso ao HUB

A estrutura de segurança de acesso do SISTEMA/CANAL (como firewalls, proxys, etc.) deverão permitir o acionamento dos endpoints e URL´s.

### 3.2 EndPoints (URIs)

URIs corretos para invocar as APIs no ambiente produtivo serão informadas pela equipe de técnica do HUB Interplayers somente na fase final do desenvolvimento.

### 3.3 Requisitos de Segurança (Generate token)

[Diagrama de fluxo de autenticação OAuth: um diagrama de caixas em ASCII mostra três entidades — "Client" à esquerda, "Resource Owner" no topo à direita, "Authorization Server" no meio à direita, e "Resource Server" embaixo à direita. As setas numeradas mostram: (A) "Authorization Request ->" do Client para o Resource Owner; (B) "<- Authorization Grant --" do Resource Owner para o Client; (C) "-- Authorization Grant -->" do Client para o Authorization Server; (D) "<----- Access Token -------" do Authorization Server para o Client; (E) "-- Access Token ------>" do Client para o Resource Server; (F) "<--- Protected Resource ---" do Resource Server para o Client.]

**FLUXO DE AUTENTICAÇÃO E OBTENÇÃO DE FUNCIONALIDADE**

(A) Client pede autorização ao Resource Owner para acessar seus recursos.
(B) Resource Owner autoriza o acesso e fornece um Authorization Grant (que é uma credencial de autorização concedida pelo Resource Owner)
(C) Client envia Authorization Grant (recém obtido) ao Authorization Server
(D) Authorization Server gera um Access Token e o envia ao Client
(E) O Client pede acesso a um recurso protegido pelo Resource Server, e se autentica utilizando o Access Token.
(F) Resource Server responde à requisição provendo o recurso solicitado.

O valor do token de acesso, na requisição, deve ser acrescido no prefixo Bearer com um espaço em branco, conforme o seguinte exemplo: Authorization: "Bearer valor_token".

### 3.4 Requisição de link de URL

Deve ser realizada através do método/verbo HTTPS GET e com os parâmetros que já foram concatenados na query string sem realizar nenhuma alteração.

Exemplo URL retornado: `https://interplayers.site.com.br/urlinformativa.aspx?prm=ZXhlbXBsbw`

### 3.5 Ambiente de Testes

A disponibilização dos ambientes para testes e desenvolvimento somente são liberados após a validação do fluxo do SISTEMA/CANAL, esta ação é necessária para evitar problemas futuros no período de validação e aceite ocasionando atrasos nos cronogramas de implantação.

### 3.6 Integridade do ambiente e qualidade dos serviços

No sentido de preservar o a integridade e qualidade dos serviços caso o SISTEMA/CANAL venha a apresentar falhas que comprometam o modelo, poderá ocorrer o seu bloqueio até que a correção seja devidamente realizada e validada

### 3.7 Planejamento da Integração

Deverá ser estabelecido um cronograma de integração para que seu time e as equipes do HUB estejam alinhadas e disponíveis para atender adequadamente as demandas, sem prejuízo das partes.

Este cronograma é essencial para alocação dos recursos e acompanhamento do andamento dos trabalhos, sendo que, qualquer alteração deverá ser feita com a participação de ambas as equipes

---

Interplayers – O HUB de Negócios da Saúde e Bem-Estar
MANUAL DE CONCEITOS
WEB Services Interface – Versão 2v0

Confidencial Interplayers 7/11 Reprodução Proibida

### 3.8 Evolução do SISTEMA/CANAL

É de extrema importância a validação conjunta das equipes para garantir a qualidade do trabalho, não só na fase inicial, mas na evolução do SISTEMA/CANAL ou do HUB. Na disponibilização de novas versões é indispensável que sua equipe técnica realize os testes constantes do roteiro. No caso de alterações significativas ou quando necessário, qualquer das equipes pode solicitar a execução de testes conjuntos.

### 3.9 Monitorias HUB Interplayers

Ocorrem de forma continua para identificar eventuais variações de volume, modificação de perfil e eventuais falhas na integração. No caso alguma situação anormal, o time do HUB solicita ao seu time comprovantes das operações e até mesmo a aplicação de novo conjunto de testes integrados para garantir a qualidade da integração.

---

Interplayers – O HUB de Negócios da Saúde e Bem-Estar
MANUAL DE CONCEITOS
WEB Services Interface – Versão 2v0

Confidencial Interplayers 8/11 Reprodução Proibida

## 4 ATRIBUTOS ESPECIAIS DO HUB

Existe uma série de atributos que atendem os conceitos apresentados neste manual e repetem em praticamente todos os WEB Services, que são de extrema importância para o bom funcionamento do modelo. Analise atentemente as especificações desses atributos no MANUAL TÉCNICO WEB SERVICES para evitar falhas que venham a prejudicar o sucesso de cada funcionalidade e consequentemente prejudicar sua empresa nos ressarcimentos e reconhecimento nos Programas.

| Conceito | Atributo | Comentários |
|---|---|---|
| Individualidade | control.clientId | Chave única de identificação do cliente, padrão GUID - Globally Unique Identifier |
| Individualidade | control.username | Usuário identificador do cliente, padrão GUID - Globally Unique IDentifier |
| Individualidade | control.StationId | Identificação do terminal ou estação no front-end |
| Individualidade | control.softwareId | Informar a identificação do Software e versão solicitante |
| Individualidade | control.terminalId | Identificação do terminal de origem das requisições, BALCAO, ECOMMERCE, CHECKOUT, etc. |
| Autenticação | Authorization (Headers) | Token de autenticação válido, utilizando formato "Bearer <Access Token>" |
| Unicidade | control.localNumber | Número único de cada transação atribuído pelo front-end; |
| Unicidade | control.localHour | Data e hora de execução da operação no front-end nos formatos ISO 8601 |
| Unicidade | control.companyCode | CNPJ do estabelecimento que está com a operação em execução |
| Unicidade | transaction.transactionCode | Número unificado de identificação das transações |
| Unicidade | centralHour | Data e hora de execução da operação na plataforma nos formatos ISO 8601; |
| Unicidade | control.OperationId | Pode ser número do Cupom Fiscal, NF Eletrônica ou outros. |
| Unicidade | control.taxCouponType | (NCF - Número Cupom Fiscal, NFC - Número Fiscal de Consumidor Eletrônica, NFE - Número Fiscal Eletrônica) |
| Unicidade | control.accessKey | Número da chave de acesso correspondente à NFE e NFCe. |
| Otimização | TableID | Identifica a versão de carga de tabelas. O uso das tabelas reduz a quantidade de acessos repetitidos. No caso de atraso na carga de tabelas é ativado um Status de Erro requerendo carga imediata para continuidade das operações. |
| Controle (Sistêmicos) | Status Code | Indica o resultado do processamento na camada técnica da API |
| Controle (Sistêmicos) | Status do Serviço | Indica o sucesso ou falha na camada de negócios da transação |
| Controle (Sistêmicos) | Status do produto | Indica o sucesso ou falha na camada de negócios de cada ocorrência na transação |
| Controle (Sistêmicos) | error.Object | Nome do objeto afetado pelo código de retorno |
| Controle (Interativos) | Return Code | Código de retorno interno do Hub Interplayers e NUNCA deve ser utilizado nos desvios ou tomada de decisão automática de SISTEMA/CANAL, por estar sujeito a cosntantes alterações sem aviso prévio |
| Controle (Interativos) | Informative Text | Texto informativo referente ao código único de retorno. Se for diferente de BRANCO, contém um alerta para a ser exibido para o usuário e deverá ter suporte a codificação HTML; |
| Paginação | Total Pages | Atributo retornado pelo HUB informando o total de páginas da consulta realizada. |
| Paginação | Reference Number | Número da página da última consulta realizada. Na paginação, SISTEMA/CANAL sempre deve informar a página anteriormente recebida |
| Paginação | Requested Page | Número da próxima página a ser consultada pelo SISTEMA/CANAL. Seu conteúdo varia de 1 até atingir o Total Pages |
| Restrição de acessos | expires_in | Usuario pode acessar quantas vezes necessario, dentro da validade de tempo do token. - observação<br>Retorno da validade de tempo do token gerado. |
| Desvio | Flow_Desviation | Contem uma URL ou palavra chave. Ver na ficha de funcionalidade o que fazer |

---

Interplayers – O HUB de Negócios da Saúde e Bem-Estar
MANUAL DE CONCEITOS
WEB Services Interface – Versão 2v0

Confidencial Interplayers 9/11 Reprodução Proibida

## 5 TABELAS AUXILIARES

### 5.1 Status Code

Status de tratamento no nível de protocolo de comunicação (fora do Body), e deve ser validado durante o período de desenvolvimento da integração.

**STATUS DE SUCESSO**

| CÓDIGO | DESCRIÇÃO | MOTIVO | MÉTODO/VERBO |
|---|---|---|---|
| 200 | OK, Success | Em requisições executadas com sucesso, o retorno deverá ser consultado no body da response | GET |
| 201 | Created | Em requisições onde o recurso foi criado com sucesso | POST |
| 202 | Accepted | Em requisições que o processamento será assíncrono | POST, PUT e DELETE |
| 206 | Partial Content | Em requisições que devolvem apenas uma parte do conteúdo de um recurso | GET |

**STATUS DE INSUCESSO**

| CÓDIGO | DESCRIÇÃO | SITUAÇÃO | INFORMAÇÕES E AÇÕES |
|---|---|---|---|
| 400 | Bad Request | Em requisições cujas informações enviadas pelo client sejam inválidas, como uma sintaxe malformada | Seu SISTEMA/CANAL exibe botão OK com texto: "Dados inválidos na função XXXXX – Acione area de Tecnologia interna" - DD/MM/AA – hh:mm:ss. |
| 401 | Unauthorized | Em requisições que exigem autenticação, mas seus dados não foram fornecidos ou estão inválidos | Seu SISTEMA/CANAL exibe botão OK com texto: "Sessão expirada, aguarde nova conexão" Fazer nova autenticação |
| 403 | Forbidden | Em requisições que o client não tem permissão de acesso ao recurso solicitado, mesmo estando autenticado | Seu SISTEMA/CANAL exibe botão OK com texto: "Sem permissão de acesso na função XXXXX – Acione area de Tecnologia interna" - DD/MM/AA – hh:mm:ss. |
| 404 | Not Found | Em requisições cuja URI de um determinado recurso seja inválida | Seu SISTEMA/CANAL exibe botão OK com texto: "Dados inválidos na função XXXXX – Acione area de Tecnologia interna" - DD/MM/AA – hh:mm:ss. |
| 405 | Method Not Allowed | Em requisições cujo método indicado pelo client não seja suportado | Seu SISTEMA/CANAL exibe botão OK com texto: "Dados inválidos na função XXXXX – Acione area de Tecnologia interna" - DD/MM/AA – hh:mm:ss. |
| 406 | Not Acceptable | Em requisições cujo formato da representação do recurso requisitado pelo client não seja suportado | Seu SISTEMA/CANAL exibe botão OK com texto: "Dados inválidos na função XXXXX – Acione area de Tecnologia interna" - DD/MM/AA – hh:mm:ss. |
| 408 | Timeout | Em requisições cujo o tempo máximo para conclusão se esgotou | Utilizar rotina de timeout descrita neste documento |
| 413 | Request Entity Too Large | Em requisições na qual a solicitação excede o tamanho máximo permitido pela aplicação | Seu SISTEMA/CANAL exibe botão OK com texto: "Dados inválidos na função XXXXX – Acione area de Tecnologia interna" - DD/MM/AA – hh:mm:ss. |
| 415 | Unsupported Media Type | Em requisições cujo formato da representação do recurso enviado pelo cliente não seja suportado, exemplo Content-Type inválido | Seu SISTEMA/CANAL exibe botão OK com texto: "Dados inválidos na função XXXXX – Acione area de Tecnologia interna" - DD/MM/AA – hh:mm:ss. |
| 429 | Too Many Requests | No caso de WEB Service ter um limite de requisições que pode ser feita por um client e ele já tiver sido atingido | Seu SISTEMA/CANAL exibe botão OK com texto: "Limite de requisições excedido na função XXXXX – Acione area de Tecnologia interna" - DD/MM/AA – hh:mm:ss. |

---

Interplayers – O HUB de Negócios da Saúde e Bem-Estar
MANUAL DE CONCEITOS
WEB Services Interface – Versão 2v0

Confidencial Interplayers 10/11 Reprodução Proibida

| CÓDIGO | DESCRIÇÃO | SITUAÇÃO | INFORMAÇÕES E AÇÕES |
|---|---|---|---|
| 500 | Internal Server Error | Em requisições onde um erro tenha ocorrido no servidor | Utilizar rotina de timeout descrita neste document |
| 503 | Service Unavailable | Em requisições feitas a uma API que está fora do ar, para manutenção ou sobrecarga | Utilizar rotina de timeout descrita neste document |

### 5.2 Status de Serviços e Status de Produtos (ocorrências)

O resultado da execução de cada transação deve ser verificado no **StatusServico** (que é geral da transação), que pode ser Response Sucesso, com retorno das informações da requisição, ou Response Erro com negativa da requisição (verificar as tratativas neste documento) e **StatusProduto** (que é específico de cada ocorrência, como por exemplo, cada um dos produtos de um carrinho de compras), estes Status, em conjunto, indicam o resultado do processamento e a ação a ser tomada pelo SISTEMA/CANAL.

**NOTA**: Nunca utilizar o atributo Return Code para decisões sistêmicas.

**STATUS DE SUCESSO TOTAL OU PARCIAL — RESPONSE SUCESSO**

| SITUAÇÃO | INFORMAÇÕES E AÇÕES |
|---|---|
| Em WEB Services que NÃO TENHAM o atributo Status Produto<br>• Este range de Status Transação indica SUCESSO. | Solicitaçao atendida com sucessso.<br>Seguir processamento |
| Em WEB Services que TENHAM o atributo Status Produto<br>• Este range de status de Status Transação indica que o WEB Services requer análise a cada ocorrência.<br>Por exemplo, num Web Services de carrinho de compras com múltiplos produtos, os resultados podem ser diferentes quando comparado o enviado contra o retornado.<br>As situações podem variar de produto por produto, exemplo:<br>• Quantidade atendida e COM desconto<br>• Quantidade atendida, mas SEM desconto<br>• Quantidade reduzida, mas COM desconto<br>• Quantidade reduzida, mas SEM desconto<br>• Quantidade atendida, mas COM Desconto ponderado (parte pelo desconto do programa e parte da loja) | **Status Produto = 00 a 09** (pode variar em ocorrência no WS)<br>Verifique se houve alteração entre os campos de envio e retorno, como nos exemplos da coluna anterior. Como este conceito se aplica a diversos Web Services além dos citados, outras situações pode ocorrer e portanto qualquer atributo pode ser alterado.<br><br>**Status Produto = 11 a 30** (pode variar em ocorrência no WS)<br>Este range de Status Produto indica que as condições retornadas podem ser melhoradas assim que o desvio de cada ocorrência (indicado no atributo control[1].flowDeviation) for cumprido. Após o desvio, submeter novamente o WEB Service para atualizar a resposta.<br><br>**Status Produto > 40** (pode variar em ocorrência no WS)<br>Este range de Status Produto indica solicitação não atendida |
| **Solicitação NÃO ATENDIDA (Desvio Geral)**<br>Solicitação foi recusada ou atendida em condições não tão favoráveis por requer um aceite de um termo, adesão em algum programa ou informação adicional. | Cumprir o desvio indicado no atributo control[1].flowDeviation).<br>Após o desvio, submeter novamente o WEB Service para atualizar a resposta. |

#### 5.2.1 Response Erro

Para todos os serviços que tenham retorno de insucesso, é utilizado o padrão abaixo.

Nota: As mensagens retornadas nos atributos de informativeText devem ser exibidas para o usuário para entedentimento e tratamento da equipe técnica interna do erro apresentado.

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| conversion[1].error[n].returnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio. Exemplo: Mensagem no formato não esperado. |
| conversion[1].error[n].informativeText | A | M | 1/1024 | Texto informativo referente ao código de retorno |
| conversion[1].error[n].object | A | M | 1/1024 | Nome do objeto afetado pelo código de retorno. |
| validation[1].error[n].returnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio. Exemplo: Falta de envio de algum dado |
| validation[1].error[n].informativeText | A | M | 1/1024 | Texto informativo referente ao código de retorno |
| validation[1].error[n].object | A | M | 1/1024 | Nome do objeto afetado pelo código de retorno |

---

Interplayers – O HUB de Negócios da Saúde e Bem-Estar
MANUAL DE CONCEITOS
WEB Services Interface – Versão 2v0

Confidencial Interplayers 11/11 Reprodução Proibida

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| process[1].error[n].returnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| process[1].error[n].informativeText | A | M | 1/1024 | Texto informativo referente ao código único de retorno |
| process[1].error[n].object | A | M | 1/1024 | Nome do objeto afetado pelo código único de retorno |

## 6 EVOLUÇÃO DAS VERSÕES (deste manual de Conceitos)

| Versão / Data | Evolução | Motivo |
|---|---|---|
| 1v0 - 20-jul-2019 | Versão inicial | Versão Inicial |
| 2v0 - 22-abr-2020 | Melhorias | Ampliação dos conceitos e termos |

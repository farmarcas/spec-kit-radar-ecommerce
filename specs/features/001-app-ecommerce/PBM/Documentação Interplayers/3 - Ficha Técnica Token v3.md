# Ficha Técnica Token v3

**Fonte:** 3 - Ficha Técnica Token v3.pdf (documento original neste mesmo diretório)

---

Interplayers – O HUB de Negócios da Saúde e Bem-Estar
FICHA TÉCNICA – TOKEN
WEB Services Interface – Versão 4v1

Este documento foi criado para direcionar a integração técnico-operacional, entre
SEU AMBIENTE DE PROCESSAMENTO e o HUB Interplayers,
na filosofia de Processamento Cooperativo padrão WEB SERVICES
DEFINITION LANGUAGE (WSDL) regulamentado pela W3C.

### MANUAL DE CONCEITOS

Apresenta conceitos a serem considerados nas integrações via WEB Services Front End
com o HUB.

Deve ser o primeiro material técnico-operacional a ser lido, por conter informações
indispensáveis
para o sucesso de cada projeto com qualidade e minimização dos esforços e custos.

### MANUAL DE PROJETO

Apresenta os detalhes específicos do seu projeto, tais como, macro fluxo,
funcionalidades e
WEB Services envolvidos.

Conta com FICHA TÉCNICA de WEB Services e ROTEIRO DE TESTES como
anexos. Esta é a versão 4v1 deste
documento

### NOTAS

Exemplos e fluxos apresentados são ilustrativos.

Os documentos, softwares e materiais disponibilizados são protegidos por
propriedade intelectual, não podendo ser copiados, reproduzidos ou cedidos sob
qualquer forma ou
pretexto
sem prévia e formal autorização da Interplayers.

A integração por WEB Services é cada vez mais comum, no entanto, existem
diversos
detalhes que garante o sucesso do trabalho.

Recomentamos a leitura detalhada deste documento para minimizar os esforços e
consequentemente reduzir os custos e tempo para sua realização.

No caso de dúvidas, divergências e sugestões contate
interplayers@interplayers.com.br

> interface@interplayers.com.br

---

## 1. Premissa

É fundamental durante o uso deste documento o entendimento do **MANUAL DE CONCEITOS**, que contém as informações complementares para o uso correto dos tipos dos atributos, os tratamentos das mensagens de erros, as validações comuns para todos os endpoints, entre outros.

## 2. Finalidade

Obter token para estabelecer e manter sessão segura para envio de cada requisição entre o **SISTEMA/CANAL** e o HUB da Interplayers.

## 3. Funcionamento

Para esta requisição, o **SISTEMA/CANAL** informa:

- Client_Id fornecido pelo HUB da Interplayers
- Client_Secret fornecido pelo HUB da Interplayers

Client_Id e Client_Secret são informações para uso exclusivo de cada estabelecimento/sistema/canal e são fornecidas pela InterPlayers durante a fase de desenvolvimento da integração.

Em resposta a requisição o seu **SISTEMA/CANAL** recebe o Token para ser utilizado na próxima requisição.

Em casos de possíveis indisponibilidades nas URL's, acionar o time de Varejo.

## 4. Pontos de Atenção

Importante criar processo de validação do tempo de expiração da sessão, atributo Expires_In, fornecido em milissegundos.

Cada CANAL de vendas tem sua própria identificação, e **NÃO** é permitido reutilizar as credenciais em CANAIS não contratos. A utilização indevida das credenciais pode ocasionar interrupção dos serviços.

[Diagrama: "Fluxo de Autenticação" — mostra a troca de mensagens entre o bloco **SISTEMA/CANAL** (à esquerda, verde), um bloco central **GTW** (gateway) e o bloco **PLATAFORMA INTERPLAYERS** (à direita, azul), com uma legenda distinguindo "Principal Token" (seta laranja) de "Principal API's" (seta roxa). As etapas do fluxo são:

1. **SOLICITAR TOKEN** — o SISTEMA/CANAL envia ao GTW/Plataforma os campos: `client_id`, `client_secret`, `grant_type`, `scope`, via
   `POST – exemplo: https://account.iplayers.com.br/interplayersb2c.onmicrosoft.com/B2C_1_Varejo/oauth2/v2.0/token`
2. **DEVOLVER TOKEN** — a Plataforma Interplayers retorna ao SISTEMA/CANAL os campos: `access_token`, `token_type`, `not_before`, `expires_in`, `expires_on`, `resource`. Há uma tabela ilustrativa "Chave / Valor" ao lado indicando que a cada requisição de token é retornado um novo conjunto de valores para: `access_token`, `token_type`, `not_before`, `expires_in`, `expires_on`, `resource`.
3. **TOKEN OBTIDO NO HEADER** — o SISTEMA/CANAL passa a usar o token obtido no header das próximas chamadas, via
   `POST – exemplo: https://api-mng.interplayers.com.br/varejo40/transaction/{operação}`, isso é validado pelo bloco GTW ("VALIDAR TOKEN").
4. **RESPOSTA** — a Plataforma Interplayers retorna a resposta da operação ao SISTEMA/CANAL.

Ao lado do diagrama há uma tabela de códigos de retorno HTTP:

| Código | Retorno |
|---|---|
| 200 | OK |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |
| 503 | Service Unavailable |
]

## 5. Layout

| MÉTODO POST | Versão 2.0 |
|---|---|
| **Endpoint:** | `https://{url-host}/interplayersb2c.onmicrosoft.com/B2C_1_Varejo/oauth2/v2.0/token` |
| **Content-Type:** | application/x-www-form-urlencoded |
| **Response:** | application/json |

### 5.1 Header

| Parâmetro | Descrição |
|---|---|
| Content-Type | Tipo de conteúdo que está sendo enviado |

### 5.2 Body

TIPOS: A – ALFANUMÉRICO / N – NUMÉRICO / D – DATA
MODOS: M – MANDATÓRIO / O - OPCIONAL

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| Grant_Type | A | M | 128 | Tipo de autenticação a ser realizada |
| Client_Id | A | M | 128 | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |
| Client_Secret | A | M | 128 | Chave única atrelada a identificação do cliente para geração do Access Token |
| Scope | A | M | 128 | Link vinculado aos serviços do produto. |

### 5.3 Response Erro

Verificar os tipos de respostas de erro no Manual de Conceitos, bem como a ação que **SISTEMA/CANAL** deve realizar.

### 5.4 Response Sucesso

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| Access_Token | A | M | 128 | Token de autenticação válido fornecido pelo Authorization Server, caso seja autenticado |
| Token_Type | A | M | 128 | Tipo do token retornado |
| Not_Before | N | M | 10 | A hora em que o token é considerado válido, em tempo de época. |
| Expires_In | N | M | 6 | Tempo de expiração do Access Token em Segundos. Ex.: 1799 Segundos = 30 minutos |
| Expires_On | N | M | 10 | A hora em que o token de acesso expira. A data é representada como o número de segundos de 1970-01-01T0:0:0Z UTC até o tempo de expiração. Esse valor é usado para determinar o tempo de vida dos tokens em cache. |
| Resource | A | M | 128 | O URI da ID do aplicativo do serviço de recebimento (recurso protegido). |

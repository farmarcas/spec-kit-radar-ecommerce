# Ficha Técnica Extrato

**Fonte:** 11 - Ficha Técnica Extrato.pdf (documento original neste mesmo diretório)

---

Interplayers – O HUB de Negócios da Saúde e Bem-Estar
FICHA TÉCNICA – EXTRATO
WEB Services Interface – Versão 1v0

Este documento foi criado para direcionar a integração técnico-operacional, entre
**SEU AMBIENTE DE PROCESSAMENTO** e o **HUB Interplayers**,
na filosofia de Processamento Cooperativo padrão
**WEB SERVICES DEFINITION LANGUAGE (WSDL)** regulamentado pela **W3C**.

### MANUAL DE CONCEITOS

Apresenta conceitos a serem considerados nas integrações via WEB Services Front End com o HUB.

Deve ser o primeiro material técnico-operacional a ser lido, por conter informações indispensáveis para o sucesso de cada projeto com qualidade e minimização dos esforços e custos.

### MANUAL DE PROJETO

Apresenta os detalhes específicos do seu projeto, tais como, macrofluxo, funcionalidades e WEB Services envolvidos.

Conta com **FICHA TÉCNICA** de WEB Services e **ROTEIRO DE TESTES** como anexos.

Esta é a **versão 1v0** deste documento

### NOTAS

*Exemplos e fluxos apresentados são ilustrativos.*

*Os documentos, softwares e materiais disponibilizados são protegidos por propriedade intelectual, não podendo ser copiados, reproduzidos ou cedidos sob qualquer forma ou pretexto sem prévia e formal autorização da Interplayers.*

*A integração por WEB Services é cada vez mais comum, no entanto, existem diversos detalhes que garante o sucesso do trabalho. Recomentamos a leitura detalhada deste documento para minimizar os esforços e consequentemente reduzir os custos e tempo para sua realização.*

*No caso de dúvidas, divergências e sugestões contate [interface@interplayers.com.br](mailto:interface@interplayers.com.br)*

---

## 1. Premissa

É fundamental durante o uso deste documento o entendimento do **MANUAL DE CONCEITOS**, que contém as informações complementares para o uso correto dos tipos dos atributos, os tratamentos das mensagens de erros, as validações comuns para todos os endpoints, entre outros.

## 2. Finalidade

O **HUB da Interplayers** apresenta através do Serviço Extrato, as transações de qualquer Lojas/PDV's realizadas pelo Attendance (Varejo 4.0).

## 3. Funcionamento

O **SISTEMA/CANAL** deve-se utilizar do Serviço Extrato para realizar a consulta de todos os registros dos Serviços consumidos do Varejo 4.0 do **HUB da Interplayers**.

O Serviço Extrato permite que **SISTEMA/CANAL** realize a consulta, filtrando sempre campos que definem o PDV e o Canal:

- **ClientId:** Código do Canal da Rede;
- **CompanyCode:** CNPJ da Rede;
- **CompanyFederalNumber:** Raiz do CNPJ ou CNPJ da Rede.

Para que o **SISTEMA/CANAL** extraia dados de períodos desejados, deve-se informar sempre a DATA/HORA Inicial e Final.

## 4. Pontos de Atenção

Na integração do **SISTEMA/CANAL** com o **HUB da Interplayers** o processo de extração dos dados deve ser automatizado e realizado diariamente. O **HUB da Interplayers** sugere que este processo seja preferencialmente as 5 horas da manhã, pois entende-se que se trata de um período com menor Fluxo Transacional.

## 5. Layout - Extrato

| POST | Versão 2.0 |
|---|---|
| **Endpoint:** | https://{url-host}/api/transaction/extrato |
| **Content-Type:** | application/json |
| **Response:** | application/json |

### 5.1 Header

| Parâmetro | Descrição |
|---|---|
| **Content-Type** | Tipo de conteúdo que está sendo enviado |
| **Authorization** | Token de autenticação válido, utilizando formato "Bearer \<Access Token\>" |
| **Version** | Versão da API que deverá ser consumida. Utilizar valor 1 no campo |
| **ClientId** | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |

### 5.2 Body

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| control[1].clientId | A | M | 128 | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |
| control[1].username | A | M | 128 | Chave única do usuário no formato GUID (Globally Unique IDentifier) |
| control[1].tableId | A | M | 128 | Chave única de identificação da tabela de informações auxiliares local no formato GUID (Globally Unique IDentifier) |
| control[1].localNumber | N | M | 6/8 | Número único de cada transação atribuído pelo front-end; Utilizado como parâmetro de unicidade. Sem a adição de traços ou pontos. |
| control[1].localHour | D | M | N/A | Data e hora de execução da operação no front-end nos formatos ISO 8601; Utilizado como parâmetro de unicidade |
| control[1].stationId | A | M | 8 | Identificação do terminal ou estação no front-end |
| control[1].companyCode | A | M | 14/20 | CNPJ do estabelecimento que está com a operação em execução. Sem a adição de traços ou pontos.. |
| control[1].attendanceHash | A | O | 1/2048 | Hash da transação para controle da plataforma |
| control[1].industryId | A | M | 3 | Código da Administradora na plataforma. Informar o valor 999. |
| control[1].softwareId | A | M | 1/256 | Informar a identificação do Software e versão solicitante. |
| Search[1].startDate | D | M | N/A | Data do início da solicitação da busca. |
| Search[1].untilDate | D | M | N/A | Data do fim da extração dos dados. |
| Search[1].initialItem | N | M | 1/100 | Id da primeira transação localizada dentro da página. |
| Search[1].totalItems | N | M | 1/100 | Total de transações a serem retornadas, valor default. |
| Search[1].companyFederalNumber | N | M | 8/20 | CNPJ do estabelecimento que está com a operação em execução. Sem a adição de traços ou pontos. |

### 5.3 Response Sucesso

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| returnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| informativeText | A | M | 1/1024 | Texto informativo referente ao código único de retorno |
| centralHour | D | M | N/A | Data e hora de execução da operação na plataforma nos formatos ISO 8601; Utilizado como parâmetro de unicidade |
| control[1].attendanceHash | A | M | 1/2048 | Hash da transação para controle da plataforma |
| control[1].localNumber | N | M | 6/8 | Número único de cada transação atribuído pelo front-end; Utilizado como parâmetro de unicidade |
| control[1].localHour | O | M | N/A | Data e hora de execução da loperação no front-end nos formatos ISO 8601; Utilizado como parâmetro de unicidade |
| extractSales[1].companyCode | A | M | 14/20 | CNPJ do estabelecimento que está com a operação em execução |
| extractSales[1].consumer[1].holderId | A | M | 11 | Número de CPF do consumidor sem edição, traços ou pontos; mandatório se os atributos de cartão não forem preenchidos |
| extractSales[1].consumer[1].cardId | N | O | 19 | Número de cartão do consumidor no Programa ou Convênio; |
| extractSales[1].consumer[1].cardIdCompany | N | O | 19 | Número de matrícula da empresa consumidor; |
| extractSales[1].consumer[1].IdCompany | N | O | 10 | Identificação da empresa conveniada, constante na tabela recebida da Rede. Mandatório se informado cardIdCompany; |
| extractSales[1].consumer[1].birthdate | D | O | N/A | Data de Nascimento do consumidor nos formatos ISO 8601; |
| extractSales[n].transaction[1].transactionCode[n] | A | M | 12 | Número unificado de identificação das transações; |
| extractSales[n].transaction[1].providerCode[n] | A | O | 12 | Número unificado de identificação das transações de controle do front-end externo; |
| extractSales[n].stationId | A | M | 8 | Identificação do terminal ou estação no front-end. |
| extractSales[n].product[30].id | N | M | 1/3 | Número do item no Cupom Fiscal, Nota Fiscal Eletrônica ou outros equivalentes |
| extractSales[n].product[30].EAN | N | M | 13 | Código EAN do produto |
| extractSales[n].product[30].requestedQuantity | N | M | 4 | Quantidade do produto que foi solicitada pelo usuário |
| extractSales[n].product[30].authorizedQuantity | N | M | 4 | Quantidade do produto que foi autorizada pela plataforma |
| extractSales[n].product[30].discountValue | N | M | 1/14 | Valor do desconto adicional que foi autorizado para o produto |
| extractSales[n].product[30].discountPercentual | N | M | 1/14 | Percentual do desconto adicional que foi autorizado para o produto |
| extractSales[n].product[30].listPrice | N | M | 7 | Preço bruto do estabelecimento |
| extractSales[n].product[30].netPrice | N | M | 7 | Preço líquido do estabelecimento |
| extractSales[n].product[30].coPaymentValue | N | O | 7 | Valor de subsídio que foi autorizado para o produto. |
| extractSales[n].product[30].payrollValue | N | O | 7 | Valor que será descontado na folha de pagamento (somente atribuído para compras direcionadas a folha de pagamento) |
| extractSales[n].product[30].industryCompanyCode | N | M | 14 | CNPJ da indústria |
| extractSales[n].product[30].discountAuthorized | N | M | 1/14 | Percentual do desconto adicional que foi autorizado para o produto |
| extractSales[n].product[30].status | N | M | 2 | Status do produto indicando aprovação do pedido |
| extractSales[n].product[30].Authorizer | A | M | 1/100 | Nome da plataforma autorizadora do produto. |
| extractSales[n].product[30].batchId | N | M | 1/10 | Número do lote da transação |
| extractSales[n].operationId | N | O | 1/10 | Pode ser número do Cupom Fiscal, NF Eletrônica ou outros. |
| extractSales[n].centralHour | D | M | N/A | Data e hora de execução da operação na plataforma nos formatos ISO 8601; Utilizado como parâmetro de unicidade |
| extractSales[n].stageTransaction | A | O | 1/40 | Estágio pelo qual a transação se encontra, Carrinho, Efetivada, Confirmada, Anulada ou Cancelada. |
| Search[1].initialItem | N | M | 1/100 | Id da primeira transação localizada dentro da página. |
| Search[1].totalItems | N | M | 1/100 | Total de transações a serem retornardas. |

### 5.4 Response Erro

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| conversion[1].error[n].returnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| conversion[1].error[n].informativeText | A | M | 1/1024 | Texto informativo referente ao código de retorno |
| conversion[1].error[n].object | A | M | 1/1024 | Nome do objeto afetado pelo código de retorno |
| validation[1].error[n].returnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| validation[1].error[n].informativeText | A | M | 1/1024 | Texto informativo referente ao código de retorno |
| validation[1].error[n].object | A | M | 1/1024 | Nome do objeto afetado pelo código de retorno |
| process[1].error[n].returnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| process[1].error[n].informativeText | A | M | 1/1024 | Texto informativo referente ao código único de retorno |
| process[1].error[n].object | A | M | 1/1024 | Nome do objeto afetado pelo código único de retorno |

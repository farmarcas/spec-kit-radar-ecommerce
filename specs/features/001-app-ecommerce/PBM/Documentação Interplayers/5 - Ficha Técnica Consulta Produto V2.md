# Ficha Técnica Consulta Produto V2

**Fonte:** 5 - Ficha Técnica Consulta Produto V2.pdf (documento original neste mesmo diretório)

---

**Interplayers – O HUB de Negócios da Saúde e Bem-Estar**
**FICHA TÉCNICA – CONSULTA PRODUTO V2**
**WEB Services Interface – Versão 3v2**

Este documento foi criado para direcionar a integração técnico-operacional, entre
**SEU AMBIENTE DE PROCESSAMENTO** e o **HUB Interplayers**,
na filosofia de Processamento Cooperativo padrão
**WEB SERVICES DEFINITION LANGUAGE (WSDL)** regulamentado pela W3C.

### MANUAL DE CONCEITOS

Apresenta conceitos a serem considerados nas integrações via WEB Services Front-End com o HUB.

Deve ser o primeiro material técnico-operacional a ser lido, por conter informações indispensáveis para o sucesso de cada projeto com qualidade e minimização dos esforços e custos.

### MANUAL DE PROJETO

Apresenta os detalhes específicos do seu projeto, tais como, macrofluxo, funcionalidades e WEB Services envolvidos.

Conta com **FICHA TÉCNICA** de WEB Services e **ROTEIRO DE TESTES** como anexos.

Esta é a versão **3v2** deste documento

### NOTAS

Exemplos e fluxos apresentados são ilustrativos.

Os documentos, softwares e materiais disponibilizados são protegidos por propriedade intelectual, não podendo ser copiados, reproduzidos ou cedidos sob qualquer forma ou pretexto sem prévia e formal autorização da Interplayers.

A integração por WEB Services é cada vez mais comum, no entanto, existem diversos detalhes que garante o sucesso do trabalho.

Recomentamos a leitura detalhada deste documento para minimizar os esforços e consequentemente reduzir os custos e tempo para sua realização.

No caso de dúvidas, divergências e sugestões contate [interface@interplayers.com.br](mailto:interface@interplayers.com.br)

---

## 1. Premissa

É fundamental durante o uso deste documento o entendimento do **MANUAL DE CONCEITOS**, que contém as informações complementares para o uso correto dos tipos dos atributos, os tratamentos das mensagens de erros, as validações comuns para todos os endpoints, entre outros.

## 2. Finalidade

Verificar, mesmo sem ter identificação do consumidor, se o produto tem programas de benefícios que concedem descontos. Esta consulta permite identificar as melhores possibilidades de descontos e informá-los ao consumidor como fator de convencimento para realizar identificação e aderir ao programa.

## 3. Funcionamento

Para obter as informações de benefícios, o SISTEMA/CANAL deve informar junto com o EAN (Código do Produto) todas as informações estabelecidas para estes Produtos.

## 4. Pontos de Atenção

O serviço Consulta Produto retorna com sucesso (Response Sucesso) para produtos (EANs) que fazem parte de programas do HUB da InterPlayers.

Produtos que não fazem parte de programas do HUB serão informados em 'Response Erro'.

Produtos que possuem a necessidade de um Cupom/Cartão Promocional para que sejam transacionados, possuem no atributo **"promotionalCard"** o retorno **"S"**, o SISTEMA/CANAL deve enviar como identificação do consumidor nos próximos serviços o número do Cupom/Cartão Promocional e o CPF.

O atributo **"informativeMessage"** apresenta um texto pré-definido pelas Indústrias referente aos programas com o intuito de ser exibido ao usuário sobre a existência de melhor campanha para os produtos informados pelo SISTEMA/CANAL. A manutenção e atualização desses textos também são de responsabilidade das Indústrias.

Produtos de programas do HUB da InterPlayers que não permitem novas adesões, apresentam no retorno do atributo **"allowsAdhesion"** o valor **"N"**.

- Atentar as regras de compliance do estabelecimento, no que se refere às restrições de ofertas de descontos ao consumidor.

O desconto adicional (discountValue) é fornecido com base na quantidade unitária do produto, o SISTEMA/CANAL deve multiplicar o valor pela quantidade de itens autorizados (authorizedQuantity), e aplicar este desconto no valor líquido total.

### Exemplos:

**1. Desconto da Indústria superior ao desconto do estabelecimento:**

- Preço líquido do produto com desconto do estabelecimento = R$ 10,00.
- Preço líquido do mesmo produto, considerando desconto aprovado pela indústria = R$ 7,00.
- O retorno do desconto adicional com valor a ser subtraído sobre o preço líquido do estabelecimento = R$ 3,00.

| Campo | Valor (inteiro) | Valor (R$) |
|---|---|---|
| Preço Líquido (netPrice) | 1000 | R$ 10,00 |
| Desconto adicional unitário (discountValue) | 300 | R$ 3,00 |
| **Preço de venda com desconto (netPrice)** | **700** | **R$ 7,00** |

**2. Desconto da Rede superior ao desconto da Indústria:**

- Preço líquido do produto com desconto do estabelecimento = R$ 10,00.
- Preço líquido do mesmo produto, considerando desconto aprovado pela indústria = R$ 11,00.
- O retorno do desconto adicional com valor a ser subtraído sobre o preço líquido do estabelecimento será = R$ 0,00.

Isto ocorre devido o desconto da Rede ser superior ao desconto da Indústria, nesses casos a venda é realizada por dentro do programa gerando reposição, somente do valor autorizado pela indústria.

O desconto adicional considera somente a quantidade autorizada pelo Programa.

| Campo | Valor (inteiro) | Valor (R$) |
|---|---|---|
| Preço Líquido (netPrice) | 1000 | R$ 10,00 |
| Desconto adicional unitário (discountValue) | 0 | R$ 0,00 |
| **Preço de venda com desconto (netPrice)** | **1000** | **R$ 10,00** |

Para identificar a quantidade que a indústria autorizou, bem como o percentual de desconto, deve ser utilizado os atributos **"product[n].authorizedQuantity"** e **"product[n].discountPercentual"**, estes dados são para o cálculo de ressarcimento do Programa.

O desconto adicional considera também a quantidade não autorizada pelo Programa.

Caso o SISTEMA/CANAL envie parâmetro de Tipo de Desconto = **L**, será calculado desconto sobre desconto, ou seja, o desconto do programa é realizado com base no preço líquido do estabelecimento e não no preço bruto como é o padrão.

O atributo **"pointing"** indica pontuação disponibilizada para Programas de Indústrias que utilizam como forma de benefício para o consumidor. Alguns produtos podem trabalhar somente com pontuação ao invés de desconto.

O SISTEMA/CANAL deve **SEMPRE** oferecer o **MELHOR DESCONTO** para o consumidor desde a Consulta do Produto até a Finalização do pedido, para que ele tenha a certeza de que esteja tendo o maior desconto possível em sua compra. Diante disso se faz necessário o envio do PREÇO BRUTO e LÍQUIDO do SISTEMA/CANAL em todos os Serviços, para que se entenda a quantidade de desconto que a Rede está disponibilizando e assim o HUB realiza o cálculo caso tenha algum desconto adicional.

## 5. Layout

| MÉTODO POST | Versão 2.0 |
|---|---|
| **Endpoint:** | `https://{url-host}/api/transaction/v2/consultaproduto` |
| **Content-Type:** | application/json |
| **Response:** | application/json |

### 5.1. Header

| Parâmetro | Descrição |
|---|---|
| Content-Type | Tipo de conteúdo que está sendo enviado |
| Authorization | Token de autenticação válido, utilizando formato "Bearer \<Access Token\>" |
| Token | Inserir Token de Autenticação válido |
| Version | Versão da API que deverá ser consumida. Utilizar Valor 1 no campo |
| ClientID | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |

### 5.2 Body

TIPOS: A – ALFANUMÉRICO / N – NUMÉRICO / D – DATA
MODOS: M – MANDATÓRIO / O – OPCIONAL

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| control[1].clientId | A | M | 128 | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |
| control[1].username | A | M | 128 | Chave única do usuário no formato GUID (Globally Unique IDentifier) |
| control[1].tableId | A | M | 128 | Chave única de identificação da tabela de informações auxiliares local no formato GUID (Globally Unique IDentifier) |
| control[1].localNumber | N | M | 1/6 | Número único de cada transação atribuído pelo front-end; Utilizado como parâmetro de unicidade. Sem a adição de traços ou pontos. |
| control[1].localHour | D | M | N/A | Data e hora de execução da operação na plataforma nos formatos ISO 8601; Utilizado como parâmetro de unicidade |
| control[1].CentralNumber | N | O | 12 | Número único de cada transação atribuído pela plataforma; Para novos atendimentos, utilizar zeros, e caso seja o mesmo usuário atendido, enviar o conteúdo do último retorno obtido; Utilizado como parâmetro de unicidade. Sem a adição de traços ou pontos. |
| control[1].industryId | A | M | 3 | Código da Administradora na Plataforma. Informar o valor 999. |
| control[1].stationId | A | M | 8 | Identificação do terminal ou estação no front-end |
| control[1].companyCode | A | M | 14 | CNPJ do estabelecimento que está com a operação em execução. Sem a adição de traços ou pontos. |
| control[1].attendanceHash | A | O | 1/2048 | Hash da transação para controle da plataforma. |
| control[1].operationId | N | O | 1/10 | Pode ser número do Cupom Fiscal, NF Eletrônica ou outros (Número do pedido). Sem a adição de traços ou pontos. |
| control[1].softwareId | A | M | 1/256 | Informar a identificação do Software e versão solicitante |
| product[n].id | N | O | 1/3 | Nº do item. Sem a adição de traços ou pontos. |
| product[n].EAN | N | M | 13 | Código EAN do produto. Sem a adição de traços ou pontos. |
| product[n].requestedQuantity | N | M | 4 | Quantidade do produto que foi solicitada pelo usuário. Sem a adição de traços ou pontos. |
| product[n].listPrice | N | M | 7 | Preço bruto do estabelecimento. Sem a adição de traços ou pontos. |
| product[n].netPrice | N | M | 7 | Preço líquido do estabelecimento. Sem a adição de traços ou pontos. |
| product[n].discountType | A | M | 1 | Tipo do desconto a ser utilizado, deve ser calculado pelo preço bruto ou pelo líquido; B – Bruto ou L – Líquido |

### 5.3 Response Sucesso

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| control[1].clientId | A | M | 128 | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |
| control[1].username | A | M | 128 | Chave única do usuário no formato GUID (Globally Unique IDentifier) |
| control[1].tableId | A | M | 128 | Chave única de identificação da tabela de informações auxiliares local no formato GUID (Globally Unique IDentifier) |
| control[1].localNumber | N | M | 6/8 | Número único de cada transação atribuído pelo front-end; Utilizado como parâmetro de unicidade |
| control[1].CentralNumber | N | O | 12 | Número único de cada transação atribuído pela plataforma; para novos atendimentos, utilizar zero, e caso seja o mesmo usuário atendido, enviar o conteúdo do último retorno obtido; Utilizado como parâmetro de unicidade |
| control[1].industryId | A | M | 3 | Código da Administradora na plataforma |
| control[1].stationId | A | M | 1/1024 | Identificação do terminal ou estação no front-end |
| control[1].companyCode | A | M | 14 | CNPJ do estabelecimento que está com a operação em execução |
| control[1].attendanceHash | A | O | 1/2048 | Hash da transação para controle da plataforma |
| product[n].id | N | M | N/A | Código indexador do produto |
| product[n].EAN | N | M | 13 | Código EAN do produto |
| product[n].authorizedQuantity | N | M | 4 | Quantidade do produto que foi autorizada pela plataforma |
| product[n].discountValue | N | M | 1/14 | Valor do desconto adicional que foi autorizado para o produto |
| product[n].discountPercentual | N | M | 1/14 | Percentual do desconto adicional que foi autorizado para o produto |
| product[n].discountValueIndustry | N | M | 1/14 | Valor do desconto adicional monetário que foi calculado sobre o desconto bruto e o desconto do PDV |
| product[n].pointing | N | M | 1/14 | Pontos de fidelidade disponibilizados para o produto |
| product[n].industryCompanyCode | N | O | 14 | CNPJ da Indústria |
| product[n].informativeMessage | A | O | 1/100 | Mensagem dinâmica referente à condição comercial daquele produto |
| product[n].authorizer | A | M | 11 | Nome do Autorizador |
| product[n].industryName | A | M | 10 | Nome da Indústria |
| product[n].productLink | A | O | 1/2048 | URL com informação do produto |
| product[n].requestCoupon | A | M | 1 | Sinaliza se o produto que precisa de cupom ou não. Produtos Dermaclub retornam com valor 'X' |
| product[n].requestHolderId | A | M | 1 | Sinaliza se o produto que precisa de CPF ou não |
| product[n].comboId | N | M | 1 | Indicador de combinação de atribuição de desconto de um combo entre os produtos |
| product[n].allowsAdhesion | A | M | 1 | Produto permite adesão |
| product[n].status | N | M | 2 | Status do produto indicando aprovação do pedido |
| returnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| informativeText | A | M | 1/1024 | Texto informativo referente ao código único de retorno |
| centralHour | D | M | N/A | Data e hora de execução da operação na plataforma nos formatos ISO 8601; Utilizado como parâmetro de unicidade |

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

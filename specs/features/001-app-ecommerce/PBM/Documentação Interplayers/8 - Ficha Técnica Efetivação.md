# Ficha Técnica Efetivação

**Fonte:** 8 - Ficha Técnica Efetivação.pdf (documento original neste mesmo diretório)

---

# Interplayers – O HUB de Negócios da Saúde e Bem-Estar

## FICHA TÉCNICA – EFETIVAÇÃO

### WEB Services Interface – Versão 4v2

Este documento foi criado para direcionar a integração técnico-operacional, entre **SEU AMBIENTE DE PROCESSAMENTO** e o **HUB Interplayers**, na filosofia de Processamento Cooperativo padrão **WEB SERVICES DEFINITION LANGUAGE (WSDL)** regulamentado pela W3C.

#### MANUAL DE CONCEITOS

Apresenta conceitos a serem considerados nas integrações via WEB Services Front End com o HUB.

Deve ser o primeiro material técnico-operacional a ser lido, por conter informações indispensáveis para o sucesso de cada projeto com qualidade e minimização dos esforços e custos.

#### MANUAL DE PROJETO

Apresenta os detalhes específicos do seu projeto, tais como, macrofluxo, funcionalidades e WEB Services envolvidos.

Conta com **FICHA TÉCNICA** de WEB Services e **ROTEIRO DE TESTES** como anexos. Esta é a **versão 4v2** deste documento

#### NOTAS

*Exemplos e fluxos apresentados são ilustrativos.*

*Os documentos, softwares e materiais disponibilizados são protegidos por propriedade intelectual, não podendo ser copiados, reproduzidos ou cedidos sob qualquer forma ou pretexto sem prévia e formal autorização da Interplayers.*

*A integração por WEB Services é cada vez mais comum, no entanto, existem diversos detalhes que garante o sucesso do trabalho.*

*Recomentamos a leitura detalhada deste documento para minimizar os esforços e consequentemente reduzir os custos e tempo para sua realização.*

*No caso de dúvidas, divergências e sugestões contate [interface@interplayers.com.br](mailto:interface@interplayers.com.br)*

---

## 1. Premissa

É fundamental durante o uso deste documento o entendimento do MANUAL DE CONCEITOS, que contém as informações complementares para o uso correto dos tipos dos atributos, os tratamentos das mensagens de erros, as validações comuns para todos os endpoints, entre outros.

## 2. Finalidade

Finalizar o atendimento com os produtos e sua respectiva quantidade que for pré-autorizada no balcão, ou executar a chamada uma autorização diretamente no checkout, caso essa função tenha sido contratada pelo PDV. Esse serviço é enviado:

- Na recuperação de uma Pré-autorização feita no Portal da Drogaria ou no sistema da rede.
- No momento de pagamento na modalidade de Televendas, Aplicativos e-commerce.
- No momento de pagamento de uma venda direta no checkout.

Nesta etapa o percentual de desconto para cada produto é recalculado, considerando toda a lista de produtos e verificando o atendimento de regras para combos, kits, subsídios e possibilidade de desconto em folha.

## 3. Funcionamento

Este serviço é único, isto é, serve para os PDV´S que contrataram o Varejo 4.0.

### Varejo 4.0

- Venda direta no checkout sem a necessidade de pré-autorização no balcão.
- Pagamento único para o consumidor, com envio de todos os produtos e todas as administradoras em uma única transação de venda.
- Cálculo do melhor desconto, entre o preço líquido do PDV e o preço líquido do programa PBM. A transação sempre será realizada pelo programa PBM para propósito de ressarcimento junto a indústria.
- Múltiplas formas de identificação do consumidor, ex: CPF, cartão e/ou via recuperação de Pré-autorização.
- Facilidade de comunicação com autorizadores externos.
- Permite combinar descontos de combo do PDV com os descontos do programa.

Para venda direta no checkout é necessário consultar antes a carga de tabela para identificar a necessidade de comunicação.

Toda vez que ocorrer envio de NSU, todos os produtos da compra devem ser enviados na comunicação.

## 4. Pontos de Atenção

Importante observar que ao utilizar este serviço, a transação ficará PENDENTE e o saldo do consumidor será comprometido. Uma transação pendente, não gera reposição para o estabelecimento, é imprescindível finalizá-la com os serviços de CONFIRMA ou ANULA transação. Vale ressaltar que caso a mensagem de CONFIRMA ou ANULA não for enviada, o HUB anulará a transação após o período determinado pelo Autorizador.

O desconto adicional "product[n].discountValue" é fornecido com base na quantidade unitária do produto, o SISTEMA/CANAL deve multiplicar o valor pela quantidade de itens aprovados ou utilizar o campo "product[n].discountAdditionalMultiplied", que realiza o cálculo de multiplicação com base nos itens aprovados. Os valores de desconto retornados devem ser aplicados no valor líquido total.

### Exemplos:

**Desconto da Indústria superior ao desconto do estabelecimento:**

- Preço líquido do produto com desconto do estabelecimento = R$ 10,00.
- Preço líquido do mesmo produto, considerando desconto aprovado pela indústria = R$ 7,00.
- O retorno do desconto adicional com valor a ser subtraído sobre o preço líquido do estabelecimento = R$ 3,00.

| CAMPOS | ENVIO NA API | TRADUÇÃO DO RETORNO |
|---|---|---|
| Preço Líquido (netPrice) | 1000 | R$ 10,00 |
| Desconto multiplicado (discountAdditionalMultiplied) | 300 | R$ 3,00 |
| Preço de venda com desconto (netPrice) | 700 | R$ 7,00 |

**Desconto da Rede superior ao desconto da Indústria:**

- Preço líquido do produto com desconto do estabelecimento = R$ 10,00.
- Preço líquido do mesmo produto, considerando desconto aprovado pela indústria = R$ 11,00.
- O retorno do desconto adicional com valor a ser subtraído sobre o preço líquido do estabelecimento será = R$ 0,00.

Isto ocorre devido o desconto da Rede ser superior ao desconto da Indústria, nesses casos a venda é realizada por dentro do programa gerando reposição, somente do valor autorizado pela indústria.

| CAMPOS | ENVIO NA API | TRADUÇÃO DO RETORNO |
|---|---|---|
| Preço Líquido (netPrice) | 1000 | R$ 10,00 |
| Desconto multiplicado (discountAdditionalMultiplied) | 0 | R$ 0,00 |
| Preço de venda com desconto (netPrice) | 1000 | R$ 10,00 |

O desconto adicional considera somente a quantidade autorizada pelo Programa.

Para identificar a quantidade que a indústria autorizou, bem como o percentual de desconto, deve ser utilizado os atributos "product[n].authorizedQuantity" e "product[n].discountPercentual", estes dados são para o cálculo de ressarcimento do Programa.

Caso o **SISTEMA/CANAL** envie parâmetro de Tipo de Desconto = L, será calculado desconto sobre desconto, ou seja, o desconto do programa é realizado com base no preço líquido do estabelecimento e não no preço bruto como é o padrão.

Para uso de ECF e impressão concomitante, o estabelecimento imprime seu preço líquido no cupom fiscal, e no final da venda o cupom deve conter a informação do desconto adicional de cada item.

Em ocasiões nas quais o estabelecimento tem uma promoção de Pack ou Combo, o HUB irá calcular o melhor desconto considerando este parâmetro.

O atributo "pointing" indica pontuação disponibilizada para Programas de Indústrias que utilizam como forma de benefício para o consumidor. Alguns produtos podem trabalhar somente com pontuação ao invés de desconto.

## 5. Layout

| MÉTODO POST | Versão 2.0 |
|---|---|
| **Endpoint:** | `https://{url-host}/api/transaction/efetiva` |
| **Content-Type:** | `application/json` |
| **Response:** | `application/json` |

### 5.1 Header

| Parâmetro | Descrição |
|---|---|
| **Content-Type** | Tipo de conteúdo que está sendo enviado |
| **Authorization** | Token de autenticação válido, utilizando formato "Bearer \<Access Token\>" |
| **Token** | Inserir Token de Autenticação válido |
| **Version** | Versão da API que deverá ser consumida. Utilizar Valor 1 no campo |
| **ClientId** | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |

### 5.2 Body

TIPOS: A – ALFANUMÉRICO / N – NUMÉRICO / D – DATA
MODOS: M – MANDATÓRIO / O - OPCIONAL

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| control[1].clientId | A | M | 128 | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |
| control[1].username | A | M | 128 | Chave única do usuário no formato GUID (Globally Unique IDentifier) |
| control[1].tableId | A | M | 128 | Chave única de identificação da tabela de informações auxiliares local no formato GUID (Globally Unique IDentifier) |
| control[1].localNumber | N | M | 6/8 | Número único de cada transação atribuído pelo frontend; Utilizado como parâmetro de unicidade; sem a adição de traços ou pontos. |
| control[1].localHour | D | M | N/A | Data e hora de execução da operação no front-end nos formatos ISO 8601; Utilizado como parâmetro de unicidade; |
| control[1].industryId | A | M | 3 | Código da Administradora na plataforma; informar o valor 999. |
| control[1].stationId | A | M | 8 | Identificação do terminal ou estação no front-end; |
| control[1].companyCode | A | M | 14 | CNPJ do estabelecimento que está com a operação em execução. Sem a adição de traços ou pontos. |
| control[1].attendanceHash | A | O | 1/2048 | Hash da transação para controle da plataforma; |
| control[1].operationId | N | O | 1/10 | É o número do Cupom Fiscal, NF Eletrônica ou outros. Sem a adição de traços ou pontos. |
| control[1].softwareId | A | M | 1/256 | Informar a identificação do Software e versão solicitante; |
| control[1].taxCouponType | A | O | 3 | (NCF - Número Cupom Fiscal, NFC - Número Fiscal de Consumidor Eletrônica, NFE - Número Fiscal Eletrônica) |
| control[1].accessKey | A | O | 44 | Número da chave de acesso correspondente à NFE e NFCe. |
| control[1].terminalId | A | M | 1/10 | Identificação do terminal de origem das requisições, BALCÃO, E-COMMERCE, CHECKOUT etc.; |
| transaction[1].transactionCode[n] | A | O | 12 | Número unificado de identificação das transações. Para novos atendimentos utilizar zeros; |
| transaction[1].providerCode[n] | A | O | 12 | Número único de identificação das transações de controle do frontend externo; |
| consumer[1].holderId | N | O | 11 | Número de CPF do consumidor. mandatório se os atributos de cartão não forem preenchidos; sem a adição de traços ou pontos. |
| consumer[1].cardId | N | O | 19 | Número de cartão do consumidor no Programa; sem edição, traços ou pontos. |
| consumer[1].cardIdCompany | N | O | 19 | Número de matrícula da empresa consumidor; sem a adição de traços ou pontos. |
| consumer[1].IdCompany | N | O | 10 | Identificação da empresa conveniada, constante na tabela recebida da Rede. Mandatório se informado cardIdCompany; sem a adição de traços ou pontos. |
| consumer[1].birthdate | D | O | N/A | Data de Nascimento do consumidor nos formatos ISO 8601; |
| payment[1].payroll | A | O | 1 | Indicador de desconto em folha; S - SIM ou N - NÃO se SIM, os campos cardIdCompany e IdCompany se tornam mandatórios; |
| product[30].id | N | M | 1/3 | Nº do item no cupom fiscal; sem a adição de traços ou pontos. |
| product[30].packId | N | O | 1/3 | Id correspondente ao pack de produtos; sem a adição de traços ou pontos. |
| product[30].EAN | N | M | 13 | Código EAN do produto; sem a adição de traços ou pontos. |
| product[30].requestedQuantity | N | M | 4 | Quantidade do produto que foi solicitada pelo usuário; sem a adição de traços ou pontos. |
| product[30].listPrice | N | M | 7 | Preço bruto do estabelecimento; sem a adição de traços ou pontos. |
| product[30].netPrice | N | M | 7 | Preço líquido do estabelecimento; sem a adição de traços ou pontos. |
| product[30].discountType | A | M | 1 | Tipo de desconto a ser utilizado, deve ser calculado pelo preço bruto ou preço líquido; B-BRUTO ou LÍQUIDO; |
| product[30].isPurchaseSchedule | N | O | 10 | Campo de recorrência: Campo informando se a compra vai ser realizado com recorrência. Enviar apenas para vendas com recorrência. |
| product[30].scheduleCode | N | O | 10 | Campo de recorrência: Código da campanha do produto. |

### 5.3 Response Sucesso

TIPOS: A – ALFANUMÉRICO / N – NUMÉRICO / D – DATA - MODOS: M – MANDATÓRIO / O - OPCIONAL

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| centralHour | D | M | N/A | Data e hora de execução da operação na plataforma nos formatos ISO 8601; Utilizado como parâmetro de unicidade; |
| control[1].clientId | A | M | 128 | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier); |
| control[1].username | A | M | 128 | Chave única do usuário no formato GUID (Globally Unique IDentifier); |
| control[1].tableId | A | M | 128 | Chave única de identificação da tabela de informações auxiliares locais no formato GUID (Globally Unique IDentifier); |
| control[1].localNumber | N | M | 6/8 | Número único de cada transação atribuído pelo frontend; Utilizado como parâmetro de unicidade; |
| control[1].localHour | D | M | N/A | Data e hora de execução da operação no front-end nos formatos ISO 8601; Utilizado como parâmetro de unicidade; |
| control[1].industryId | N | M | 3 | Código da Administradora na plataforma. |
| control[1].stationId | A | M | 8 | Identificação do terminal ou estação no front-end; |
| control[1].terminalId | A | M | 1/10 | Identificação do terminal de origem das requisições, BALCAO, ECOMMERCE, CHECKOUT etc.; |
| control[1].companyCode | A | M | 14 | CNPJ do estabelecimento que está com a operação em execução; sem pontuação; |
| control[1].attendanceHash | A | M | 1/2048 | Hash da transação para controle da plataforma; |
| control[1].operationId | N | O | 1/10 | Pode ser número do Cupom Fiscal, NF Eletrônica ou outros; |
| control[1].softwareId | A | M | 1/256 | Identificação do Software e versão solicitante; |
| control[1].taxCouponType | A | M | 3 | (NCF - Número Cupom Fiscal, NFC - Número Fiscal de Consumidor Eletrônica, NFE - Número Fiscal Eletrônica) |
| control[1].accessKey | A | O | 44 | Número da chave de acesso correspondente à NFE e NFCe. |
| consumer[1].holderId | N | O | 11 | Número de CPF do consumidor sem edição, traços ou pontos; mandatório se os atributos de cartão não forem preenchidos; |
| consumer[1].cardId | N | O | 19 | Número de cartão do consumidor no Programa ou Convênio; |
| consumer[1].cardIdCompany | N | O | 19 | Número de matrícula da empresa consumidor; |
| consumer[1].IdCompany | N | O | 10 | Identificação da empresa conveniada, constante na tabela recebida da Rede. Mandatório se informado cardIdCompany; |
| consumer[1].cardIdOperator | N | O | 19 | Número de cartão do consumidor na Operadora de Saúde; |
| consumer[1].cellPhone | N | O | 11/13 | Número do telefone celular com DDD sem edição. Forma de identificação do consumidor; |
| consumer[1].phone | N | O | 11/13 | Número do telefone fixo com DDD sem edição. Forma de identificação do consumidor; |
| product[30].id | N | M | 1/3 | Nº do item no cupom fiscal; |
| product[30].EAN | N | M | 13 | Código EAN do produto; |
| product[30].authorizedQuantity | N | M | 4 | Quantidade do produto que foi autorizada pela plataforma; |
| product[30].requestedQuantity | N | M | 4 | Quantidade do produto que foi solicitada pelo usuário; |
| product[30].listPrice | N | M | 7 | Preço bruto do estabelecimento; |
| product[30].netPrice | N | M | 7 | Preço líquido do estabelecimento; |
| product[30].discountValue | N | M | 1/14 | Valor do desconto adicional que foi autorizado para o produto; |
| product[30].discountValueIndustry | N | M | 1/14 | Valor do desconto adicional monetário que foi calculado sobre o desconto bruto e o desconto do PDV; |
| product[30].discountAuthorized | N | M | 1/14 | Percentual do desconto adicional que foi autorizado para o produto; |
| product[30].discountValueUnit | N | M | 1/14 | Valor do desconto unitário que foi autorizado para o produto sem ser multiplicado pela quantidade; |
| product[30].discountPercentual | N | M | 1/14 | Percentual do desconto adicional que foi autorizado para o produto; |
| product[30].discountAdditionalMultiplied | N | M | 1/14 | Valor do desconto adicional multiplicado pela quantidade que foi autorizado para o Produto |
| product[30].unitNetValue | N | M | 1/14 | Valor Líquido Unitário; |
| product[30].industryCompanyCode | N | M | 14 | CNPJ da indústria; |
| product[30].packId | N | O | 1/3 | Id correspondente ao Pack de produtos; |
| product[30].status | N | M | 2 | Status do produto indicando aprovação do pedido; |
| product[30].returnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio; |
| product[30].scheduleNumberSeq | N | M | 10 | Indicativo de recorrência. 0 – Não recorrência. 1 – Recorrência. |
| product[30].informativeText | A | M | 1/1024 | Texto informativo referente ao código único de retorno; |
| payment[1].totalNetAmount | A | M | 1/14 | Forma de pagamento - Valor Líquido Total; |
| payment[1].totalAmountReceivable | A | M | 1/14 | Forma de pagamento - Valor Total a Receber; |
| payment[30].industryCompanyCode | N | M | 14 | CNPJ da indústria; |
| payment[30].packId | N | O | 1/3 | Id correspondente ao Pack de produtos; |
| payment[30].status | N | M | 2 | Status do produto indicando aprovação do pedido; |
| payment[30].TotalDiscountValue | N | O | 1/14 | Quando for PBM (HEALTHY) retornará (Valor (R$) Total de desconto aplicado na transação considerando todos os itens e quantidade); |
| payment[30].TotalGrossPrice | N | O | 1/14 | Quando for PBM (HEALTHY) retornará (Valor Total bruto da transação, considerando todos os itens e quantidade); |
| payment[30].TotalPrice | N | O | 1/14 | Quando for PBM (HEALTHY) retornará (Valor Total líquido da transação, considerando todos os itens e quantidade) |
| payment[30].totalCheckoutValue | N | O | 1/14 | Quando for PBM (HEALTHY) retornará (Valor a pagar no caixa) |

### 5.4 Response Erro

TIPOS: A – ALFANUMÉRICO / N – NUMÉRICO / D – DATA MODOS: M – MANDATÓRIO / O - OPCIONAL

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| conversion[1].error[n].returnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| conversion[1].error[n].informativeText | A | M | 1/1024 | Texto informativo referente ao código de retorno |
| conversion[1].error[n].object | A | M | 1/1024 | Nome do objeto afetado pelo código de retorno |
| validation[1].error[n].returnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| validation[1].error[n].informativeText | A | M | 1/2024 | Texto informativo referente ao código de retorno |
| validation[1].error[n].object | A | M | 1/2024 | Nome do objeto afetado pelo código de retorno |
| process[1].error[n].returnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| process[1].error[n].informativeText | A | M | 1/2024 | Texto informativo referente ao código de retorno |
| process[1].error[n].object | A | M | 1/2024 | Nome do objeto afetado pelo código de retorno |

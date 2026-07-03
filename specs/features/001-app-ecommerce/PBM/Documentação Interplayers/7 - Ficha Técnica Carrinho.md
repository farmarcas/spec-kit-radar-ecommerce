# Ficha Técnica Carrinho

**Fonte:** 7 - Ficha Técnica Carrinho.pdf (documento original neste mesmo diretório)

---

**Interplayers – O HUB de Negócios da Saúde e Bem-Estar**
**FICHA TÉCNICA – CARRINHO**
**WEB Services Interface – Versão 3v2**

Este documento foi criado para direcionar a integração técnico-operacional, entre **SEU AMBIENTE DE PROCESSAMENTO** e o **HUB Interplayers**, na filosofia de Processamento Cooperativo padrão **WEB SERVICES DEFINITION LANGUAGE (WSDL)** regulamentado pela W3C.

### MANUAL DE CONCEITOS

Apresenta conceitos a serem considerados nas integrações via WEB Services Front End com o HUB.

Deve ser o primeiro material técnico-operacional a ser lido, por conter informações indispensáveis para o sucesso de cada projeto com qualidade e minimização dos esforços e custos.

### MANUAL DE PROJETO

Apresenta os detalhes específicos do seu projeto, tais como, macrofluxo, funcionalidades e WEB Services envolvidos.

Conta com **FICHA TÉCNICA** de WEB Services e **ROTEIRO DE TESTES** como anexos. Esta é a **versão 3v2** deste documento.

### NOTAS

*Exemplos e fluxos apresentados são ilustrativos.*

*Os documentos, softwares e materiais disponibilizados são protegidos por propriedade intelectual, não podendo ser copiados, reproduzidos ou cedidos sob qualquer forma ou pretexto sem prévia e formal autorização da Interplayers.*

*A integração por WEB Services é cada vez mais comum, no entanto, existem diversos detalhes que garante o sucesso do trabalho.*
*Recomentamos a leitura detalhada deste documento para minimizar os esforços e consequentemente reduzir os custos e tempo para sua realização.*

*No caso de dúvidas, divergências e sugestões contate [interface@interplayers.com.br](mailto:interface@interplayers.com.br)*

---

## 1. Premissa

É fundamental durante o uso deste documento o entendimento do MANUAL DE CONCEITOS, que contém as informações complementares para o uso correto dos tipos dos atributos, os tratamentos das mensagens de erros, as validações comuns para todos os endpoints, entre outros.

## 2. Finalidade

Enviar para o HUB as informações do(s) produto(s) que devem ser incluídos no carrinho do consumidor, considerando o melhor desconto.

## 3. Funcionamento

### Solicitação do Serviço

Para esta atualização, o SISTEMA/CANAL deve enviar:

- **Identificação da Transação no HUB (transactionCode)**
  O primeiro envio é nulo ou vazio, na continuidade do atendimento deverá ser usado o valor que retornou do HUB no primeiro envio.
- **Identificação do Consumidor** — É necessário informar pelo menos um dos identificadores abaixo:
  - CPF: é o mais indicado, pois está associado ou complementa informação necessária para alguns tipos de descontos.
  - Nro de Cartão do Consumidor em Programa de Benefício.
  - Nro de Matrícula em empresa conveniada.
- **Identificação da Empresa conveniada.**
- **Indicador de Desconto em Folha para o produto.**
- **Informações do(s) produto(s) solicitado(s):**
  - Número do produto (item) do carrinho.
  - Sequencial (1 a 30): identifica o produto dentro da lista.
  - Código do Produto (EAN).
  - Quantidade solicitada.
  - Preço Bruto: PMC ou Preço Loja (para produtos sem PMC).
  - Preço Líquido: Valor com desconto, se existir, do estabelecimento.
  - Tipo de Desconto: Informa se o desconto a conceder deve ser calculado considerando o Preço Bruto ou o Preço Líquido.

### Retorno do Serviço Executado

Levando em conta as identificações fornecidas para o consumidor, o HUB da Interplayers executa o serviço solicitado, verifica os programas que oferece descontos para o produto desejado e, considerando as regras de negócio e histórico do consumidor, retornará as informações de melhor desconto para ele.

**Informações fornecidas pelo serviço:**

- `product[n].discountValue`: Valor do desconto adicional percentual que foi autorizado para o produto.
- `product[n].discountPercentual`: Percentual do desconto aplicado no produto.
- `product[n].industryCompanyCode`: CNPJ do programa (indústria, empresa de saúde, entre outros) que autorizou o desconto.
- `product[n].status`: Status do produto indicando aprovação do pedido.

## 4. Pontos de Atenção

O desconto adicional é fornecido com base na quantidade total do produto enviado, e deve ser aplicado no valor líquido total.

### Exemplos

**Desconto da Indústria superior ao desconto do estabelecimento:**

- Preço líquido do produto com desconto do estabelecimento = R$ 10,00.
- Preço líquido do mesmo produto, considerando desconto aprovado pela indústria = R$ 7,00.
- O retorno do desconto adicional com valor a ser subtraído sobre o preço líquido do estabelecimento = R$ 3,00.

| CAMPOS | ENVIO NA API | TRADUÇÃO DO RETORNO |
|---|---|---|
| Preço Líquido (netPrice) | 1000 | R$ 10,00 |
| Desconto adicional multiplicado (discountValue) | 300 | R$ 3,00 |
| Preço de venda com desconto (netPrice) | 700 | R$ 7,00 |

**Desconto da Rede superior ao desconto da Indústria:**

- Preço líquido do produto com desconto do estabelecimento = R$ 10,00.
- Preço líquido do mesmo produto, considerando desconto aprovado pela indústria = R$ 11,00.
- O retorno do desconto adicional com valor a ser subtraído sobre o preço líquido do estabelecimento será = R$ 0,00.

Isto ocorre devido o desconto da Rede ser superior ao desconto da Indústria, nesses casos a venda é realizada por dentro do programa gerando reposição, somente do valor autorizado pela indústria.

| CAMPOS | ENVIO NA API | TRADUÇÃO DO RETORNO |
|---|---|---|
| Preço Líquido (netPrice) | 1000 | R$ 10,00 |
| Desconto adicional multiplicado (discountValue) | 0 | R$ 0,00 |
| Preço de venda com desconto (netPrice) | 1000 | R$ 10,00 |

Caso o SISTEMA/CANAL envie parâmetro de Tipo de Desconto = L, será calculado desconto sobre desconto, ou seja, o desconto do programa é realizado com base no preço líquido do estabelecimento e não no preço bruto como é o padrão.

O atributo "pointing" indica pontuação disponibilizada para Programas de Indústrias que utilizam como forma de benefício para o consumidor. Alguns produtos podem trabalhar somente com pontuação ao invés de desconto.

O SISTEMA/CANAL deve SEMPRE oferecer o MELHOR DESCONTO para o consumidor desde a Consulta do Produto até a Finalização do pedido, para que ele tenha a certeza de que esteja tendo o maior desconto possível em sua compra. Diante disso se faz necessário o envio do PREÇO BRUTO e LÍQUIDO do SISTEMA/CANAL em todos os Serviços, para que se entenda a quantidade de desconto que a Rede está disponibilizando e assim o HUB realiza o cálculo caso tenha algum desconto adicional.

## 5. Layout

| MÉTODO POST | Versão 2.0 |
|---|---|
| Endpoint: | https://{url-host}/api/transaction/carrinho |
| Content-Type: | application/json |
| Response: | application/json |

### 5.1 Header

| Parâmetro | Descrição |
|---|---|
| Content-Type | Tipo de conteúdo que está sendo enviado |
| Authorization | Token de autenticação válido, utilizando formato "Bearer \<Access Token\>" |
| Token | Inserir Token de Autenticação válido |
| Version | Versão da API que deverá ser consumida. Utilizar Valor 1 no campo |
| ClientId | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |

### 5.2 Body

TIPOS: A – ALFANUMÉRICO / N – NUMÉRICO / D – DATA MODOS: M – MANDATÓRIO / O - OPCIONAL

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| control[1].clientId | A | M | 128 | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |
| control[1].username | A | M | 128 | Chave única do usuário no formato GUID (Globally Unique IDentifier) |
| control[1].tableId | A | M | 128 | Chave única de identificação da tabela de informações auxiliares local no formato GUID (Globally Unique IDentifier) |
| control[1].localNumber | N | M | 6/8 | Número único de cada transação atribuído pelo front-end; Utilizado como parâmetro de unicidade. Sem a adição de traços ou pontos. |
| control[1].localHour | D | M | N/A | Data e hora de execução da operação no front-end nos formatos ISO 8601; Utilizado como parâmetro de unicidade |
| control[1].industryId | A | M | 3 | Código da Administradora na plataforma. Informar o valor 999. |
| control[1].stationId | A | M | 8 | Identificação do terminal ou estação no front-end |
| control[1].companyCode | A | M | 14/20 | CNPJ do estabelecimento que está com a operação em execução. Sem a adição de traços ou pontos. |
| control[1].attendanceHash | A | O | 1/2048 | Hash da transação para controle da plataforma. |
| control[1].operationId | N | O | 1/10 | Pode ser número do Cupom Fiscal, NF Eletrônica ou outros (Número do pedido). Sem a adição de traços ou pontos. |
| control[1].terminalId | A | M | 1/10 | Identificação do terminal de origem das requisições, BALCAO, ECOMMERCE, CHECKOUT, etc. |
| control[1].softwareId | A | M | 1/256 | Informar a identificação do Software e versão solicitante |
| transaction[1].transactionCode[n] | A | O | 12 | Número unificado de identificação das transações; Para novos atendimentos, utilizar zeros, e caso seja o mesmo usuário atendido, enviar o conteúdo do último retorno obtido; sem a adição de traços ou pontos. |
| transaction[1].providerCode[n] | A | O | 12 | Número unificado de identificação das transações de controle do front-end externo; |
| consumer[1].holderId | N | O | 11 | Número de CPF do consumidor. Mandatório se os atributos de cartão não forem preenchidos. Sem a adição de traços ou pontos. |
| consumer[1].cardId | N | O | 19 | Número de cartão do consumidor no Programa; Sem a adição de traços ou pontos. |
| consumer[1].birthdate | D | O | N/A | Data de Nascimento do consumidor nos formatos ISO 8601; |
| product[30].id | N | M | 1/3 | Nº do item no cupom fiscal. Sem a adição de traços ou pontos. |
| product[30].packId | N | O | 1/3 | Id correspondente ao Pack de produtos. Sem a adição de traços ou pontos. |
| product[30].EAN | N | M | 13 | Código EAN do produto. Sem a adição de traços ou pontos. |
| product[30].requestedQuantity | N | M | 4 | Quantidade do produto que foi Solicitada pelo usuário. Sem a adição de traços ou pontos. |
| product[30].listPrice | N | M | 7 | Preço bruto do estabelecimento. Sem a adição de traços ou pontos. |
| product[30].netPrice | N | M | 7 | Preço líquido do estabelecimento. Sem a adição de traços ou pontos. |
| product[30].discountType | A | M | 1 | Tipo do desconto a ser utilizado, deve ser calculado pelo preço bruto ou pelo preço líquido; B - BRUTO ou L - LÍQUIDO |
| product[30].isPurchaseSchedule | N | O | 10 | Campo de recorrência: Campo informando se a compra vai ser realizado com recorrência. Enviar apenas para vendas com recorrência. |
| product[30].scheduleCode | N | O | 10 | Campo de recorrência: Código da campanha do produto. Ex: 001 |

### 5.3 Response Sucesso

TIPOS: A – ALFANUMÉRICO / N – NUMÉRICO / D – DATA MODOS: M – MANDATÓRIO / O - OPCIONAL

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| control[1].localNumber | N | M | 6/8 | Número único de cada transação atribuído pelo front-end; Utilizado como parâmetro de unicidade |
| control[1].localHour | D | M | N/A | Data e hora de execução da operação no front-end nos formatos ISO 8601; Utilizado como parâmetro de unicidade |
| control[1].industryId | A | M | 3 | Código da Administradora na plataforma |
| control[1].stationId | A | M | 8 | Identificação do terminal ou estação no front-end |
| control[1].terminalId | A | M | 1/10 | Identificação do terminal de origem das requisições, BALCAO, ECOMMERCE, CHECKOUT etc. |
| control[1].companyCode | A | M | 14 | CNPJ do estabelecimento que está com a operação em execução; Sem Pontuação |
| control[1].attendanceHash | A | M | 1/2048 | Hash da transação para controle da plataforma |
| control[1].softwareId | A | M | 1/256 | Identificação do Software e versão solicitante |
| consumer[1].birthdates[n] | D | O | N/A | Data de Nascimento do consumidor nos formatos ISO 8601; |
| product[30].id | N | M | 1/3 | Número do item no Cupom Fiscal, Nota Fiscal Eletrônica ou outros equivalentes |
| product[30].EAN | N | M | 13 | Código EAN do produto |
| product[30].authorizedQuantity | N | M | 4 | Quantidade do produto que foi autorizada pela plataforma |
| product[30].discountValue | N | M | 1/14 | Valor do desconto adicional que foi autorizado para o produto |
| product[30].discountPercentual | N | M | 1/14 | Percentual do desconto adicional que foi autorizado para o produto |
| product[30].discountValueIndustry | N | M | 1/14 | Valor do desconto adicional monetário que foi calculado sobre o desconto bruto e o desconto do PDV |
| product[30].unitNetValue | N | M | 1/14 | Valor Líquido Unitário (UnitNetValue = Bruto - Maior Desconto) |
| product[30].pointing | N | M | 1/14 | Pontos de fidelidade disponibilizados para o produto |
| product[30].industryCompanyCode | N | M | 1/14 | CNPJ da indústria |
| product[30].packId | N | O | 1/3 | Id correspondente ao Pack de produtos |
| product[30].status | N | M | 2 | Status do produto indicando aprovação do pedido. |
| product[30].scheduleNumberSeq | N | M | 1 | Indicativo de recorrência. 0 – Não recorrência. 1 – Recorrência. |
| transaction[1].transactionCode | A | O | 12 | Número unificado de identificação das transações; Para novos atendimentos, utilizar zeros, e caso seja o mesmo usuário atendido, enviar o conteúdo do último retorno obtido; |
| transaction[1].providerCode | A | O | 12 | Número unificado de identificação das transações de controle do front-end externo; |
| ReturnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| InformativeText | A | M | 1/1024 | Texto informativo referente ao código único de retorno |

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

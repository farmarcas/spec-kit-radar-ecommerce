# Ficha Técnica Finalização da Transação (Confirma e Anula)

**Fonte:** 9 - Ficha Técnica Finalização da Transação (Confirma e Anula).pdf (documento original neste mesmo diretório)

---

## Interplayers – O HUB de Negócios da Saúde e Bem-Estar

### FICHA TÉCNICA – FINALIZAÇÃO DA TRANSAÇÃO

**WEB Services Interface – Versão 3v3**

Este documento foi criado para direcionar a integração técnico-operacional, entre

**SEU AMBIENTE DE PROCESSAMENTO** e o **HUB Interplayers**,

na filosofia de Processamento Cooperativo padrão **WEB SERVICES DEFINITION LANGUAGE (WSDL)** regulamentado pela **W3C**.

#### MANUAL DE CONCEITOS

Apresenta conceitos a serem considerados nas integrações via **WEB Services Front End** com o **HUB**.

Deve ser o primeiro material técnico-operacional a ser lido, por conter informações indispensáveis para o sucesso de cada projeto com qualidade e minimização dos esforços e custos.

#### MANUAL DE PROJETO

Apresenta os detalhes específicos do seu projeto, tais como, macrofluxo, funcionalidades e WEB Services envolvidos.

Conta com **FICHA TÉCNICA** de WEB Services e **ROTEIRO DE TESTES** como anexos. **Esta é a versão 3v2 deste documento**

#### NOTAS

*Exemplos e fluxos apresentados são ilustrativos.*

*Os documentos, softwares e materiais disponibilizados são protegidos por propriedade intelectual, não podendo ser copiados, reproduzidos ou cedidos sob qualquer forma ou pretexto sem prévia e formal autorização da Interplayers.*

*A integração por WEB Services é cada vez mais comum, no entanto, existem diversos detalhes que garante o sucesso do trabalho.*

*Recomentamos a leitura detalhada deste documento para minimizar os esforços e consequentemente reduzir os custos e tempo para sua realização.*

*No caso de dúvidas, divergências e sugestões contate [interface@interplayers.com.br](mailto:interface@interplayers.com.br)*

---

## 1. Premissa

É fundamental durante o uso deste documento o entendimento do **MANUAL DE CONCEITOS**, que contém as informações complementares para o uso correto dos tipos dos atributos, os tratamentos das mensagens de erros, as validações comuns para todos os endpoints, entre outros.

## 2. Finalidade

Informar ao **HUB da Interplayers** se a transação foi finalizada com sucesso (CONFIRMA) ou se ouve interrupção e/ou desistência da compra (ANULA).

Venda concluída no estabelecimento sem confirmação no HUB não são consideradas na reposição de produtos dos programas.

Desistência de compra sem anulação no HUB mantem o histórico de quantidade adquirida pelo consumidor podendo diminuir ou não conceder descontos em futuras compras por excesso de limite de compras.

## 3. Funcionamento

Uma transação que foi Efetivada, possui Status de PENDENTE no **HUB da Interplayers**.

Para ter direito ao ressarcimento do programa o **SISTEMA/CANAL** deve enviar a funcionalidade de finalização da transação com os EndPoints de CONFIRMA, indicando que o Documento Fiscal mais o Comprovante da Transação foi emitido, ou ANULA, indicando que o consumidor desistiu da transação.

Para os EndPoints de CONFIRMA e ANULA o **SISTEMA/CANAL** deve informar o "transactionCode" (NSU Central) e/ou "holderId" (CPF) para a identificação da transação pelo **HUB da Interplayers**.

## 4. Pontos de Atenção

O **SISTEMA/CANAL** deve interpretar o serviço que tem que ser enviado para **HUB da Interplayers** da seguinte maneira:

- **Confirma:** Obrigatoriamente o Documento Fiscal e o Comprovante da Transação têm que estar emitido. É mandatório informar corretamente os Dados Fiscais, pois estes são utilizados em tempo de auditoria pelos programas.
    - Caso informado no atributo **"taxCouponType"** uma NFC ou NFE, deve ser informado a Chave de Acesso através do atributo **"accessKey"**.
    - Caso de Cupom Fiscal, preencher o atributo **"taxCouponType"** com NCF. Com isso o atributo **"accessKey"** passa a ser opcional.
    - Todas as efetivações que forem confirmadas geram o processo de ressarcimento para a Rede.
- **Anula:** Enviado em casos de que ocorra a interrupção do processo (por desistência do portador, falha na impressora ou outros motivos. Todas as efetivações que forem anuladas não geram ressarcimento para a Rede.
    - Transações que ficarem PENDENTE no HUB da Interplayers são automaticamente anuladas após o período definido pelo Programa.

---

## CONFIRMAÇÃO DA TRANSAÇÃO

### 5.1 Layout - Confirma

| MÉTODO POST | Versão 2.0 |
|---|---|
| **Endpoint:** | https://{url-host}/api/transaction/confirma |
| **Content-Type:** | application/json |
| **Response:** | application/json |

### 5.1.2 Header

| Parâmetro | Descrição |
|---|---|
| **Content-Type** | Tipo de conteúdo que está sendo enviado |
| **Authorization** | Token de autenticação válido, utilizando formato "Bearer \<Access Token\>" |
| **Token** | Inserir Token de Autenticação válido |
| **Version** | Versão da API que deverá ser consumida. Utilizar Valor 1 no campo |
| **ClientId** | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |

### 5.1.3 Body

**TIPOS:** A – ALFANUMÉRICO / N – NUMÉRICO / D – DATA
**MODOS:** M – MANDATÓRIO / O - OPCIONAL

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| control[1].clientId | A | M | 128 | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |
| control[1].username | A | M | 128 | Chave única do usuário no formato GUID (Globally Unique IDentifier) |
| control[1].tableId | A | M | 128 | Chave única de identificação da tabela de informações auxiliares local no formato GUID (Globally Unique IDentifier) |
| control[1].localNumber | N | M | 6/8 | Número único de cada transação atribuído pelo front-end; Utilizado como parâmetro de unicidade. Sem a adição de traços ou pontos. |
| control[1].localHour | D | M | N/A | Data e hora de execução da operação no front-end nos formatos ISO 8601; Utilizado como parâmetro de unicidade |
| control[1].industryId | A | M | 3 | Código da Administradora na plataforma. Informar o valor 999. |
| control[1].stationId | A | M | 8 | Identificação do terminal ou estação no front-end |
| control[1].companyCode | A | M | 14 | CNPJ do estabelecimento que está com a operação em execução; sem a adição de traços ou pontos. |
| control[1].attendanceHash | A | O | 1/2048 | Hash da transação para controle da plataforma |
| control[1].operationId | N | M | 1/10 | E o número do Cupom Fiscal, NF Eletrônica ou outros. Sem a adição de traços ou pontos. |
| control[1].taxCouponType | A | M | 3 | (NCF - Número Cupom Fiscal, NFC - Número Fiscal de Consumidor Eletrônica, NFE - Número Fiscal Eletrônica) |
| control[1].accessKey | A | O | 44 | Número da chave de acesso MANDATÓRIO em caso de NFE e NFCe. |
| control[1].terminalId | A | M | 1/10 | Identificação do terminal de origem das requisições, BALCAO, ECOMMERCE, CHECKOUT, etc. |
| control[1].softwareId | A | M | 1/256 | Informar a identificação do Software e versão solicitante |
| consumer[1].holderId | N | O | 10 | Número de CPF do consumidor. Sem a adição de traços ou pontos. Mandatório se os atributos de cartão não forem preenchidos |
| consumer[1].cardId | N | O | 19 | Número de cartão do consumidor no Programa; sem edição, traços ou pontos. |
| transaction[1].transactionCode[n] | A | M | 12 | Número unificado de identificação das transações; Para novos atendimentos, utilizar zeros, e caso seja o mesmo usuário atendido, enviar o conteúdo do último retorno obtido; sem a adição de traços ou pontos. |
| transaction[1].providerCode[n] | A | O | 12 | Número unificado de identificação das transações de controle do front-end externo; |
| product[30].EAN | N | M | 13 | Código EAN do produto. Sem a adição de traços ou pontos. |

### 5.1.4 Response Erro

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| conversion[1].error[n].returnCode | A | O | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| conversion[1].error[n].informativeText | A | O | 1/1024 | Texto informativo referente ao código de retorno |
| conversion[1].error[n].object | A | O | 1/1024 | Nome do objeto afetado pelo código de retorno |
| conversion[1].error[n].returnCode | A | O | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| conversion[1].error[n].informativeText | A | O | 1/1024 | Texto informativo referente ao código de retorno |
| conversion[1].error[n].object | A | O | 1/1024 | Nome do objeto afetado pelo código de retorno |
| conversion[1].error[n].returnCode | A | O | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| conversion[1].error[n].informativeText | A | O | 1/1024 | Texto informativo referente ao código de retorno |
| conversion[1].error[n].object | A | O | 1/1024 | Nome do objeto afetado pelo código de retorno |

> Nota: a tabela acima repete o mesmo conjunto de campos (returnCode, informativeText, object) três vezes no documento original, indicando a estrutura de array `conversion[1].error[n]`.

### 5.1.5 Response Sucesso

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| centralHour | D | M | N/A | Data e hora de execução da operação na plataforma nos formatos ISO 8601; Utilizado como parâmetro de unicidade; |
| control[1].clientId | A | M | 128 | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |
| control[1].username | A | M | 128 | Chave única do usuário no formato GUID (Globally Unique IDentifier) |
| control[1].tableId | A | M | 128 | Chave única de identificação da tabela de informações auxiliares local no formato GUID (Globally Unique IDentifier) |
| control[1].localNumber | A | M | 6/8 | Número único de cada transação atribuído pelo front-end; Utilizado como parâmetro de unicidade. Sem a adição de traços ou pontos. |
| control[1].industryId | A | M | 3 | Código da Administradora na plataforma. Informar o valor 999. |
| control[1].stationId | A | M | 8 | Identificação do terminal ou estação no front-end. |
| control[1].companyCode | A | M | 14 | CNPJ do estabelecimento que está com a operação em execução. Sem a adição de traços ou pontos. |
| control[1].terminalId | A | M | 1/10 | Identificação do terminal de origem das requisições, BALCAO, ECOMMERCE, CHECKOUT etc. |
| control[1].attendanceHash | A | O | 1/2048 | Hash da transação para controle da plataforma. |
| control[1].operationId | N | M | 1/10 | E o número do Cupom Fiscal, NF Eletrônica ou outros. Sem a adição de traços ou pontos. |
| control[1].taxCouponType | A | M | 3 | (NCF - Número Cupom Fiscal, NFC - Número Fiscal de Consumidor Eletrônica, NFE - Número Fiscal Eletrônica) |
| control[1].accessKey | A | O | 44 | Número da chave de acesso MANDATÓRIO em caso de NFE e NFCe. |
| consumer[1].holderId | N | O | N/A | Número de CPF do consumidor. Mandatório se os atributos de cartão não forem preenchidos. Sem a adição de traços ou pontos. |
| consumer[1].cardId | N | O | 19 | Número de cartão do consumidor no Programa; sem edição, traços ou pontos. |
| consumer[1].name | A | O | N/A | Nome do consumidor. |
| consumer[1].cardBlocked | A | O | N/A | Cartão bloqueado? True ou false. |
| consumer[1].cardCancelled | A | O | N/A | Cartão cancelado? True ou false. |
| consumer[1].isHolder | A | O | N/A | Consumidor aderido? True ou false. |
| product[30].id | N | O | 1/3 | Nº do item no cupom fiscal. |
| product[30].EAN | N | O | 13 | Código EAN do produto. |
| product[30].authorizedQuantity | N | O | 4 | Quantidade do produto que foi autorizada pela plataforma. |
| product[30].requestedQuantity | N | O | 4 | Quantidade do produto que foi solicitada pelo usuário. |
| product[30].listPrice | N | O | 7 | Preço Bruto do estabelecimento. |
| product[30].netPrice | N | O | 7 | Preço Líquido do estabelecimento. |
| product[30].price | N | O | N/A | Valor total a pagar. |
| product[30].unitPrice | N | O | N/A | Valor total a pagar unitário. |
| product[30].cardValue | N | O | N/A | Valor total a pagar. |
| product[30].checkoutValue | N | O | N/A | Quando for PBM (HEALTHY) Retornará Valor Total a pagar no CheckOut (Caixa). |
| product[30].UsedAttendanceDiscount | A | O | N/A | Usou o desconto do attendance? True ou false. |
| product[30].discountValue | N | M | 1/14 | Valor do desconto adicional que foi autorizado para o produto. |
| product[30].discountPercentual | N | M | 1/14 | Percentual do desconto adicional que foi autorizado para o produto. |
| product[30].industryName | A | O | N/A | Nome da indústria. |
| product[30].prescriptionDate | D | O | N/A | Data da prescrição do médico. |
| product[30].medicalPrescriptionInsertionDate | D | O | N/A | Data de inserção da prescrição médica. |
| product[30].id | N | O | 6 | Número do CRM do médico. |
| product[30].stateCode | A | O | 2 | Sigla do estado do CRM do médico. |
| product[30].quantity | N | O | N/A | Quantidade de produtos autorizados. |
| product[30].name | A | O | N/A | Nome do produto. |
| product[30].status | N | O | N/A | Status de aprovação do produto. |
| product[30].programAdhered | A | O | N/A | Programa aderido? True ou false. |
| transaction[1].transactionCode[n] | A | M | 12 | Número unificado de identificação das transações; Para novos atendimentos, utilizar zeros, e caso seja o mesmo usuário atendido, enviar o conteúdo do último retorno obtido. |
| transaction[1].providerCode[n] | A | O | 12 | Número unificado de Identificação das transações de controle do front-end externo. |
| totalDiscountValue | N | O | 14 | Quando for PBM (HEALTHY) retornará (Valor (R$) Total de desconto aplicado na transação considerando todos os itens e quantidade). |
| TotalGrossPrice | N | O | 14 | Quando for PBM (HEALTHY) retornará (Valor Total bruto da transação, considerando todos os itens e quantidade). |
| TotalPrice | N | O | 14 | Quando for PBM (HEALTHY) retornará (Valor Total líquido da transação, considerando todos os itens e quantidade) |
| TotalCheckoutValue | N | O | 14 | Quando for PBM (HEALTHY) Retornará Valor Total a pagar no CheckOut (Caixa). |
| returnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio. |
| informativeText | A | M | 1/1024 | Texto informativo referente ao código único de retorno. |

---

## ANULAÇÃO DA TRANSAÇÃO

### 5.2 Layout - Anula

| MÉTODO POST | Versão 2.0 |
|---|---|
| **Endpoint:** | https://{url-host}/api/transaction/anula |
| **Content-Type:** | application/json |
| **Response:** | application/json |

### 5.2.1 Header

| Parâmetro | Descrição |
|---|---|
| **Content-Type** | Tipo de conteúdo que está sendo enviado |
| **Authorization** | Token de autenticação válido, utilizando formato "Bearer \<Access Token\>" |
| **Token** | Inserir Token de Autenticação válido |
| **Version** | Versão da API que deverá ser consumida. Utilizar Valor 1 no campo |
| **ClientId** | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |

### 5.2.2 Body

**TIPOS:** A – ALFANUMÉRICO / N – NUMÉRICO / D – DATA
**MODOS:** M – MANDATÓRIO / O - OPCIONAL

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| centralHour | D | M | N/A | Data e hora de execução da operação na plataforma nos formatos ISO 8601; Utilizado como parâmetro de unicidade; |
| control[1].clientId | A | M | 128 | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier). |
| control[1].username | A | M | 128 | Chave única do usuário no formato GUID (Globally Unique IDentifier). |
| control[1].tableId | A | M | 128 | Chave única de identificação da tabela de informações auxiliares local no formato GUID (Globally Unique IDentifier). |
| control[1].localNumber | N | M | 6/8 | Número único de cada transação atribuído pelo front-end; utilizado como parâmetro de unicidade. Sem a adição de traços ou pontos. |
| control[1].localHour | D | M | N/A | Data e hora de execução da operação no front-end nos formatos ISO 8601; Utilizado como parâmetro de unicidade. |
| control[1].industryId | A | M | 3 | Código da Administradora na plataforma. Utilizar o valor 999 para o campo. |
| control[1].stationId | A | M | 8 | Identificação do terminal ou estação no front-end. |
| control[1].companyCode | A | M | 14 | CNPJ do estabelecimento que está com a operação em execução; sem edição, traços ou pontos. |
| control[1].attendanceHash | A | O | 1/2048 | Hash da transação para controle da plataforma. |
| control[1].operationId | N | M | 1/6 | Pode ser número do Cupom Fiscal, NF Eletrônica ou outros. Sem a adição de traços ou pontos. |
| control[1].terminalId | A | M | 1/10 | Identificação do terminal de origem das requisições, BALCAO, ECOMMERCE, CHECKOUT etc. |
| control[1].softwareId | A | M | 1/256 | Informar a identificação do Software e versão solicitante. |
| transaction[1].transactionCode[n] | A | M | 12 | Número unificado de identificação das transações; para novos atendimentos, utilizar zeros, e caso seja o mesmo usuário atendido, enviar o conteúdo do último retorno obtido. |
| transaction[1].providerCode[n] | A | O | 12 | Número unificado de identificação das transações de controle do front-end externo. |
| consumer[1].holderId | N | O | 10 | Número de CPF do consumidor. Mandatório se os atributos de cartão não forem preenchidos. Sem a adição de traços ou pontos. |
| product[30].EAN | N | M | 13 | Código EAN do produto. Sem a adição de traços ou pontos. |

### 5.2.3 Response Erro

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| conversion[1].error[n].returnCode | A | O | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| conversion[1].error[n].informativeText | A | O | 1/1024 | Texto informativo referente ao código de retorno |
| conversion[1].error[n].object | A | O | 1/1024 | Nome do objeto afetado pelo código de retorno |
| conversion[1].error[n].returnCode | A | O | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| conversion[1].error[n].informativeText | A | O | 1/1024 | Texto informativo referente ao código de retorno |
| conversion[1].error[n].object | A | O | 1/2024 | Nome do objeto afetado pelo código de retorno |
| conversion[1].error[n].returnCode | A | O | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| conversion[1].error[n].informativeText | A | O | 1/1024 | Texto informativo referente ao código de retorno |
| conversion[1].error[n].object | A | O | 1/1024 | Nome do objeto afetado pelo código de retorno |

> Nota: assim como no bloco de Confirma, o documento original repete três vezes o mesmo conjunto de campos (returnCode, informativeText, object) para representar o array `conversion[1].error[n]`. Um dos registros de "object" aparece com tamanho "1/2024" (possível inconsistência/erro de digitação no documento original em relação aos demais "1/1024").

### 5.2.4 Response Sucesso

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| control[1].clientId | A | M | 128 | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |
| control[1].username | A | M | 128 | Chave única do usuário no formato GUID (Globally Unique IDentifier) |
| control[1].tableId | A | M | 128 | Chave única de identificação da tabela de informações auxiliares local no formato GUID (Globally Unique IDentifier) |
| control[1].localNumber | N | M | 6/8 | Número único de cada transação atribuído pelo front-end; Utilizado como parâmetro de unicidade |
| control[1].industryId | A | M | 3 | Código da Administradora na plataforma |
| control[1].stationId | A | M | 8 | Identificação do terminal ou estação no front-end |
| control[1].companyCode | A | M | 14 | CNPJ do estabelecimento que está com a operação em execução; Sem Pontuação |
| control[1].terminalId | A | M | 1/10 | Identificação do terminal de origem das requisições, BALCAO, ECOMMERCE, CHECKOUT etc. |
| control[1].attendanceHash | A | M | 1/2048 | Hash da transação para controle da plataforma |
| control[1].operationId | N | O | 1/6 | Pode ser número do cupom fiscal, NF Eletrônica ou outros. |
| control[1].batchId | N | O | 10 | Número do lote da transação |
| consumer[1].holderId | N | O | N/A | Número de CPF do consumidor. Mandatório se os atributos de cartão não forem preenchidos. Sem a adição de traços ou pontos. |
| consumer[1].cardId | N | O | 19 | Número de cartão do consumidor no Programa; sem edição, traços ou pontos. |
| consumer[1].name | A | O | N/A | Nome do consumidor. |
| consumer[1].cardBlocked | A | O | N/A | Cartão bloqueado? True ou false. |
| consumer[1].cardCancelled | A | O | N/A | Cartão cancelado? True ou false. |
| consumer[1].isHolder | A | O | N/A | CPF aderido? True ou false. |
| product[30].id | N | O | 1/3 | Nº do item no cupom fiscal. |
| product[30].EAN | N | O | 13 | Código EAN do produto. |
| product[30].authorizedQuantity | N | O | 4 | Quantidade do produto que foi autorizada pela plataforma. |
| product[30].requestedQuantity | N | O | 4 | Quantidade do produto que foi solicitada pelo usuário. |
| product[30].listPrice | N | O | 7 | Preço Bruto do estabelecimento. |
| product[30].netPrice | N | O | 7 | Preço Líquido do estabelecimento. |
| product[30].price | N | O | N/A | Valor total a pagar. |
| product[30].unitPrice | N | O | N/A | Valor total a pagar unitário. |
| product[30].cardValue | N | O | N/A | Valor total a pagar. |
| product[30].checkoutValue | N | O | N/A | Quando for PBM (HEALTHY) Retornará Valor Total a pagar no CheckOut (Caixa). |
| product[30].UsedAttendanceDiscount | A | O | N/A | Usou o desconto do attendance? True ou false. |
| product[30].discountValue | N | M | 1/14 | Valor do desconto adicional que foi autorizado para o produto. |
| product[30].discountPercentual | N | M | 1/14 | Percentual do desconto adicional que foi autorizado para o produto. |
| product[30].industryName | A | O | N/A | Nome da indústria. |
| product[30].prescriptionDate | D | O | N/A | Data da prescrição do médico. |
| product[30].medicalPrescriptionInsertionDate | D | O | N/A | Data de inserção da prescrição médica. |
| product[30].id | N | O | 6 | Número do CRM do médico. |
| product[30].stateCode | A | O | 2 | Sigla do estado do CRM do médico. |
| product[30].quantity | N | O | N/A | Quantidade de produtos autorizados. |
| product[30].name | A | O | N/A | Nome do produto. |
| product[30].status | N | O | N/A | Status de aprovação do produto. |
| product[30].programAdhered | A | O | N/A | Programa aderido? True ou false. |
| transaction[1].transactionCode[n] | A | M | 12 | Número unificado de identificação das transações; Para novos atendimentos, utilizar zeros, e caso seja o mesmo usuário atendido, enviar o conteúdo do último retorno obtido. |
| transaction[1].providerCode[n] | A | O | 12 | Número unificado de Identificação das transações de controle do front-end externo. |
| totalDiscountValue | N | O | 14 | Quando for PBM (HEALTHY) retornará (Valor (R$) Total de desconto aplicado na transação considerando todos os itens e quantidade). |
| TotalGrossPrice | N | O | 14 | Quando for PBM (HEALTHY) retornará (Valor Total bruto da transação, considerando todos os itens e quantidade). |
| TotalPrice | N | O | 14 | Quando for PBM (HEALTHY) retornará (Valor Total líquido da transação, considerando todos os itens e quantidade) |
| TotalCheckoutValue | N | O | 14 | Quando for PBM (HEALTHY) Retornará Valor Total a pagar no CheckOut (Caixa). |
| returnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio. |
| informativeText | A | M | 1/1024 | Texto informativo referente ao código único de retorno. |

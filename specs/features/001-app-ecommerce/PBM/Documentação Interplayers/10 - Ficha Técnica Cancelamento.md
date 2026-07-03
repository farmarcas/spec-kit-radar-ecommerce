# Ficha Técnica Cancelamento

**Fonte:** 10 - Ficha Técnica Cancelamento.pdf (documento original neste mesmo diretório)

---

Interplayers – O HUB de Negócios da Saúde e Bem-Estar
FICHA TÉCNICA – CANCELAMENTO
WEB Services Interface – Versão 1v0

Este documento foi criado para direcionar a integração técnico-operacional, entre **SEU AMBIENTE DE PROCESSAMENTO** e o **HUB Interplayers**, na filosofia de Processamento Cooperativo padrão **WEB SERVICES DEFINITION LANGUAGE (WSDL)** regulamentado pela **W3C**.

### MANUAL DE CONCEITOS

Apresenta conceitos a serem considerados nas integrações via **WEB Services Front End** com o **HUB**.

Deve ser o primeiro material técnico-operacional a ser lido, por conter informações indispensáveis para o sucesso de cada projeto com qualidade e minimização dos esforços e custos.

### MANUAL DE PROJETO

Apresenta os detalhes específicos do seu projeto, tais como, macrofluxo, funcionalidades e WEB Services envolvidos.

Conta com **FICHA TÉCNICA** de WEB Services e **ROTEIRO DE TESTES** como anexos. **Esta é a versão 1v0 deste documento**

### NOTAS

*Exemplos e fluxos apresentados são ilustrativos.*

*Os documentos, softwares e materiais disponibilizados são protegidos por propriedade intelectual, não podendo ser copiados, reproduzidos ou cedidos sob qualquer forma ou pretexto sem prévia e formal autorização da Interplayers.*

*A integração por WEB Services é cada vez mais comum, no entanto, existem diversos detalhes que garante o sucesso do trabalho.*

*Recomentamos a leitura detalhada deste documento para minimizar os esforços e consequentemente reduzir os custos e tempo para sua realização.*

*No caso de dúvidas, divergências e sugestões contate [interface@interplayers.com.br](mailto:interface@interplayers.com.br)*

---

## 1. Premissa

É fundamental durante o uso deste documento o entendimento do **MANUAL DE CONCEITOS**, que contém as informações complementares para o uso correto dos tipos dos atributos, os tratamentos das mensagens de erros, as validações comuns para todos os endpoints, entre outros.

## 2. Finalidade

Informar ao HUB da Interplayers o serviço de cancelamento para uma transação já faturada.

O serviço Cancela deve ser acionado pela automação nas seguintes situações:

- Desacordo comercial.
- Falta de estoque.
- Devolução de mercadoria.

## 3. Funcionamento

Para realizar o cancelamento de uma venda faturada o SISTEMA/CANAL deve enviar a funcionalidade de cancelamento da transação.

Para cancelar a venda é necessário utilizar o EndPoint CANCELA o SISTEMA/CANAL deve informar o "transactionCode" (NSU) e "industryCompanyCode" (CNPJ da industria) para a identificação da transação pelo HUB da Interplayers.

Ambas as informações o SISTEMA/CANAL encontrará no retorno da API Consulta Transação.

O cancelamenteo da venda é realizado por administradora, ou seja, se na mesma transação houver produtos de duas administradoras diferentes é necessário o envio da API CANCELA em dois momentos, um envio para cada administradora.

## 4. Pontos de Atenção

Depois de localizada a transação, é possível visualizar seus detalhes, bem como efetuar o tratamento de transações pendentes e o cancelamento de transações confirmadas há até 7 dias.

Caso a transação não seja localizada, encaminhar os cupons da venda (Cupom Fiscal e Vinculado) para *email Varejo*, explicando a situação.

A API não permite o cancelamento de transações com os status (Consulta, Pendente e Anulada).

Após o envio do cancelamento da venda, será retornado o cupom de cancelamento junto a NSU de Cancelamento. **Exceto vendas realizadas através de autorizadores externos.**

## 5. Layout

| MÉTODO POST | Versão 2.0 |
|---|---|
| **Endpoint:** | https://{url-host}/api/transaction/cancela |
| **Content-Type:** | application/json |
| **Response:** | application/json |

### 5.1 Header

| Parâmetro | Descrição |
|---|---|
| **Content-Type** | Tipo de conteúdo que está sendo enviado |
| **Authorization** | Token de autenticação válido, utilizando formato "Bearer <Access Token>" |
| **Token** | Inserir Token de Autenticação válido |
| **Version** | Versão da API que deverá ser consumida. Utilizar valor 1 no campo |
| **ClientId** | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |

### 5.2 Body

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| control[1].clientId | A | M | 128 | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |
| control[1].username | A | M | 128 | Chave única do usuário no formato GUID (Globally Unique IDentifier) |
| control[1].tableId | A | M | 128 | Chave única de identificação da tabela de informações auxiliares local no formato GUID (Globally Unique IDentifier) |
| control[1].localHour | D | M | N/A | Data e hora de execução da operação no front-end nos formatos ISO 8601; |
| control[1].industryId | A | M | 3 | Código da Administradora na plataforma. Informar o valor 999. |
| control[1].companyCode | A | M | 14/20 | CNPJ do estabelecimento que está com a operação em execução. Sem a adição de traços ou pontos. |
| transaction[1].transactionCode[n] | A | O | 12 | Número unificado de identificação das transações. Sem edição, traços ou pontos. Para novos atendimentos, utilizar zeros, e caso seja o mesmo usuário atendido, enviar o conteúdo do último retorno obtido; Sem edição, traços ou pontos. |
| transaction[1].industryCompanyCode | A | O | 14/20 | CNPJ da indústria. Sem a adição de traços ou pontos. |

### 5.3 Response Erro

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

### 5.4 Response Sucesso

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| control[1].clientId | A | M | 128 | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |
| control[1].username | A | M | 128 | Chave única do usuário no formato GUID (Globally Unique IDentifier) |
| control[1].tableId | A | M | 128 | Chave única de identificação da tabela de informações auxiliares local no formato GUID (Globally Unique IDentifier) |
| control[1].localHour | D | M | N/A | Data e hora de execução da operação no front-end nos formatos ISO 8601; |
| control[1].industryId | A | M | 3 | Código da Administradora na plataforma |
| control[1].companyCode | A | M | 14/20 | CNPJ do estabelecimento que está com a operação em execução. Sem a adição de traços ou pontos. |
| transaction[1].transactionCode | A | O | 12 | Número unificado de identificação das transações; para novos atendimentos, utilizar zeros, e caso seja o mesmo usuário atendido, enviar o conteúdo do último retorno obtido; |
| transaction[1].industryCompanyCode | A | O | 14/20 | CNPJ da indústria |
| returnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| informativeText | A | M | 1/1024 | Texto informativo referente ao código único de retorno |
| taxReceipt[1].lines[n] | A | O | 1/40 | Imagem do comprovante de cancelamento dos produtos. |

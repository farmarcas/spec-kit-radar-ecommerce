# Ficha Técnica Consulta Desconto V3 (PrePreenchimento)

**Fonte:** 6 - Ficha Tecnica Consulta Consulta Desconto V3 (PrePreenchimento).pdf (documento original neste mesmo diretório)

---

**Interplayers – O HUB de Negócios da Saúde e Bem-Estar**
**FICHA TÉCNICA – Consulta Desconto V3**
**WEB Services Interface – Versão 1v0**

Este documento foi criado para direcionar a integração técnico-operacional, entre
**SEU AMBIENTE DE PROCESSAMENTO** e o **HUB Interplayers**,
na filosofia de Processamento Cooperativo padrão
**WEB SERVICES DEFINITION LANGUAGE (WSDL)** regulamentado pela W3C.

### MANUAL DE CONCEITOS

Apresenta conceitos a serem considerados nas integrações via WEB Services Front-End com o HUB.
Deve ser o primeiro material técnico-operacional a ser lido, por conter informações indispensáveis
para o sucesso de cada projeto com qualidade e minimização dos esforços e custos.

### MANUAL DE PROJETO

Apresenta os detalhes específicos do seu projeto, tais como, macrofluxo, funcionalidades e
WEB Services envolvidos.
Conta com **FICHA TÉCNICA** de WEB Services e **ROTEIRO DE TESTES** como anexos.
Esta é a versão **4v2** deste documento

### NOTAS

*Exemplos e fluxos apresentados são ilustrativos.*

*Os documentos, softwares e materiais disponibilizados são protegidos por propriedade intelectual, não podendo ser copiados, reproduzidos ou cedidos sob qualquer forma ou pretexto sem prévia e formal autorização da Interplayers.*

*A integração por WEB Services é cada vez mais comum, no entanto, existem diversos detalhes que garante o sucesso do trabalho.*
*Recomentamos a leitura detalhada deste documento para minimizar os esforços e consequentemente reduzir os custos e tempo para sua realização.*

*No caso de dúvidas, divergências e sugestões contate*
*[interface@interplayers.com.br](mailto:interface@interplayers.com.br)*

---

## 1. Premissa

É fundamental durante o uso deste documento o entendimento do **MANUAL DE CONCEITOS**, que contém as informações complementares para o uso correto dos tipos dos atributos, tratamentos das mensagens de erros, validações comuns para todos os Endpoints, entre outros.

## 2. Finalidade

Obter a informação do melhor benefício fornecido pelo Programa de acordo com a quantidade solicitada do produto (EAN), considerando as regras de consumo, dados cadastrais, desconto por quantidade, combinações de descontos, entre outros.

## 3. Funcionamento

### Consulta

Para esta consulta, o **SEUSISTEMA/CANAL** informa:

- Código EAN do produto.
- Quantidade.
- Identificação do Consumidor:
  - CPF e/ou, o Código do Cartão do Programa e/ou, o Código de Cupom Promocional
- Sendo Cartão de Programa ou Cupom Promocional, a função só considerará as regras do programa ou promoção do cartão informado.
  - Para produtos com Campo Promo=M para obter o desconto é obrigatório que SISTEMA/CANAL envie também o número do Cartão de Programa ou Cupom Promocional, juntamente com o CPF
- Sendo CPF, serão pesquisados os programas que atendem o Código EAN informado e retornar os descontos dos Programas em que o consumidor já possui adesão.

Ao acionar a API pode ser solicitado um desvio de fluxo para adesão do consumidor/produto, apresentação de URL para dados adicionais, aceite de termos, entre outros.

## 4. Pontos de Atenção

- Quando o retorno do atributo possuir valor de combinação de descontos **"product[n].ComboId"**, verificar as combinações com o produto adicional.
  - Importante atentar as regras de compliance da sua empresa para venda combinada.
- Sempre serão apresentados todos os descontos para as combinações de quantidades, até o limite de compra do consumidor, o **SISTEMA/CANAL** deve-se atentar a melhor condição e informar o consumidor.
- Pode ocorrer que mais de um produto da requisição tenha a necessidade de adesão do consumidor, desta forma serão solicitados individualmente (por requisição) cada adesão. Exemplo:
  - Produto A e Produto B não tem adesão;
  - Primeiro retorno do HUB solicitação de adesão do produto A, não informa nenhum desconto;
  - **SISTEMA/CANAL** exibe a URL para preencher os dados de adesão ao produto A, reenvia a requisição inicial de "ConsultaDesconto" com os dois produtos;
  - ou O HUB irá solicitar a adesão do segundo produto e não retorna nenhum desconto;
  - **SISTEMA/CANAL** exibe a URL para preencher os dados de adesão ao produto B, reenvia a requisição inicial de "ConsultaDesconto" com os dois produtos; O HUB retorna as condições de desconto para o consumidor dos dois produtos.
- Para pré-prenchimento dos dados no formulário de adesão, será necessário enviar os dados no "array" de consumer na requisição da API ConsultaDescontoV3. Os campos para envio estão localizados na documentação na parte "body". Não é necessário enviar todos os dados.

### FLUXO CONSULTA DESCONTO – 2 PRODUTOS

**Consumidor sem adesão para o Produto A e B**

[Diagrama de fluxo (fluxograma numerado de 1 a 14) intitulado "FLUXO CONSULTA DESCONTO – 2 PRODUTOS – Consumidor sem adesão para o Produto A e B", com o logotipo da InterPlayers. As etapas do fluxo, seguindo a numeração indicada nas caixas, são:

1. Requisita produto 'A' e 'B' no Consulta Desconto
2. Desvio de Fluxo para aceite do termo LGPD Produto 'A'
3. Consumidor aceita Termo do Produto 'A'
4. Novo envio na requisição Consulta Desconto com Produto 'A' e 'B'
5. Desvio de Fluxo para Adesão do Produto 'A'
6. Exibe formulário para Adesão ao Produto 'A'
7. Novo envio de requisição produto 'A' e 'B' no Consulta Desconto
8. Retorna o desconto do Produto 'A' + Desvio de Fluxo para aceite do termo LGPD Produto 'B'
9. Consumidor aceita Termo LGPD do Produto 'B'
10. Novo envio na requisição Consulta Desconto com Produto 'A' e 'B'
11. Desvio de Fluxo para Adesão do Produto 'B'
12. Exibe formulário para Adesão ao Produto 'B'
13. Novo envio na requisição Consulta Desconto com Produto 'A' e 'B'
14. Retornas os descontos do Produto 'A' e Produto 'B']

**Ponto de atenção:** Toda vez que ocorrer desvio de fluxo a requisição da API consulta desconto deve ser enviada novamente após cumprir o desvio.

- Sendo retorno desconto igual a 0 (zero), apresentar o desconto líquido no seu **SISTEMA/CANAL**. Este produto deverá ser enviado posteriormente no serviço **CARRINHO**, o desconto adicional do programa será retornado neste serviço (Carrinho).
- Sempre que ocorrer um valor no atributo **"product[n].coPaymentPercentual"**, significa que o produto terá um subsidio ou pagamento por terceiros. Este percentual deve ser subtraído para efeito de pagamento do consumidor do valor final líquido do produto.
- Regra de Produto "Preço de Chegada" – Preço sugerido pela Indústria – Para esse cenário o desconto será sempre "flutuante", ou seja, o desconto vai variar de acordo com os Preços enviados no **SISTEMA/CANAL** para que chegue no preço sugerido.
- Sempre que o atributo **"flowdeviation"** possuir valor DESVIOURL, será disponibilizado um link no atributo **"urlAcceptTerm"** e no atributo **"informativeLink"**, para adesão ao programa da Indústria. Para novos desenvolvimentos utilizar o atributo **"informativeLink"**

  **Exemplo:** Programa da Indústria solicita adesão para um CPF novo, então é informado o link de cadastro da Indústria para realizar a adesão.

- O atributo **"pointing"** indica pontuação disponibilizada para Programas de Indústrias que utilizam como forma de benefício para o consumidor. Alguns produtos podem trabalhar somente com pontuação ao invés de desconto.
- O **SISTEMA/CANAL** deve **SEMPRE** oferecer o **MELHOR DESCONTO** para o consumidor desde a Consulta do Produto até a Finalização do pedido, para que ele tenha a certeza de que esteja tendo o maior desconto possível em sua compra. Diante disso se faz necessário o envio do **PREÇO BRUTO** e **LÍQUIDO** do **SISTEMA/CANAL** em todos os Serviços, para que se entenda a quantidade de desconto que a Rede está disponibilizando e assim o HUB realiza o cálculo caso tenha algum desconto adicional.

### Exemplos:

#### Desconto da Indústria superior ao desconto do estabelecimento:

- Preço líquido do produto com desconto do estabelecimento = R$ 10,00.
- Preço líquido do mesmo produto, considerando desconto aprovado pela indústria = R$ 7,00.
- O retorno do desconto adicional com valor a ser subtraído sobre o preço líquido do estabelecimento = R$ 3,00.

**CAMPOS**

| CAMPOS | ENVIO NA API | TRADUÇÃO DO RETORNO |
|---|---|---|
| Preço Líquido (netPrice) | 1000 | → R$ 10,00 |
| Desconto adicional unitário (discountValue) | − 300 | → R$ 3,00 |
| Preço de venda com desconto (netPrice) | 700 | → R$ 7,00 |

#### Desconto da Rede superior ao desconto da Indústria:

- Preço líquido do produto com desconto do estabelecimento = R$ 10,00.
- Preço líquido do mesmo produto, considerando desconto aprovado pela indústria = R$ 11,00.
- O retorno do desconto adicional com valor a ser subtraído sobre o preço líquido do estabelecimento será = R$ 0,00.

Isto ocorre devido o desconto da Rede ser superior ao desconto da Indústria, nesses casos a venda é realizada por dentro do programa gerando reposição, somente do valor autorizado pela indústria.

**CAMPOS**

| CAMPOS | ENVIO NA API | TRADUÇÃO DO RETORNO |
|---|---|---|
| Preço Líquido (netPrice) | 1000 | → R$ 10,00 |
| Desconto adicional unitário (discountValue) | − 0 | → R$ 0,00 |
| Preço de venda com desconto (netPrice) | 1000 | → R$ 10,00 |

**Nota:** O DiscontValue retorna o valor unitário e deve ser multiplicado pela quantidade autorizada.

O desconto adicional considera somente a quantidade autorizada pelo Programa.
Para identificar a quantidade que a indústria autorizou, bem como o percentual de desconto, deve ser utilizado os atributos **"product[n].authorizedQuantity"** e **"product[n].discountPercentual"**, estes dados são para o cálculo de ressarcimento do Programa.

Caso preço da Rede seja melhor que o preço sugerido pela Indústria, o desconto que deve retornar será sempre o da Rede. Para que assim, o consumidor obtenha sempre o melhor desconto, e a Rede realize a transação pelo PBM com o **HUB da Interplayers**.

## 4.1 LAYOUT

| MÉTODO POST | VERSÃO 2.0 |
|---|---|
| **Endpoint:** | https://{url-host}/api/transaction/v3/consultadesconto |
| **Content-Type:** | application/json |
| **Response:** | application/json |

## 5. HEADER

| Parâmetro | Descrição |
|---|---|
| **Content-Type** | Tipo de conteúdo que está sendo enviado |
| **Authorization** | Token de autenticação válido, utilizando formato "Bearer \<Access Token\>" |
| **Token** | Inserir Token de Autenticação válido |
| **Version** | Versão da API que deverá ser consumida. Utilizar Valor 1 no campo. |
| **ClientId** | Chave única de identificação do cliente no formato GUID (Globally Unique Identifier) |

## 5.1 BODY

TIPOS: A – ALFANUMÉRICO / N – NUMÉRICO / D – DATA / C - OBJETO

MODOS: M – MANDATÓRIO / O - OPCIONAL

| PARÂMETRO | TIPO | MODO | TAMANHO | DESCRIÇÃO |
|---|---|---|---|---|
| **control[1].clientId** | A | M | 128 | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |
| **control[1].username** | A | M | 128 | Chave única do usuário no formato GUID (Globally Unique IDentifier) |
| **control[1].tableId** | A | M | 128 | Chave única de identificação da tabela de informações auxiliares local no formato GUID (Globally Unique IDentifier) |
| **control[1].localNumber** | N | M | 6/8 | Número único de cada transação atribuído pelo front-end; Utilizado como parâmetro de unicidade. Sem a adição de traços ou pontos. |
| **control[1].localHour** | D | M | N/A | Data e hora de execução da operação no front-end nos formatos ISO 8601; Utilizado como parâmetro de unicidade |
| **control[1].centralNumber** | N | O | 12 | Número único de cada transação atribuído pela plataforma; Para novos atendimentos, utilizar zeros, e caso seja o mesmo usuário atendido, enviar o conteúdo do último retorno obtido de desvio de fluxo; Utilizado como parâmetro de unicidade. Sem a adição de traços ou pontos. |
| **control[1].industryId** | A | M | 3 | Código da Administradora na plataforma. Informar o valor 999. |
| **control[1].stationId** | A | M | 8 | Identificação do terminal ou estação no front-end |
| **control[1].companyCode** | A | M | 14/20 | CNPJ do estabelecimento que está com a operação em execução. Sem a adição de traços ou pontos. |
| **control[1].attendanceHash** | A | O | 1/2048 | Hash da transação para controle da plataforma. |
| **control[1].terminalId** | A | M | 1/10 | Identificação do terminal de origem das requisições, BALCAO, ECOMMERCE, CHECKOUT etc. |
| **control[1].softwareId** | A | M | 1/256 | Informar a identificação do Software e versão solicitante. |
| **consumer[1].holderId** | N | O | 11 | Número de CPF do consumidor. Mandatório se os atributos de cartão não forem preenchidos. Sem a adição de traços ou pontos. |
| **consumer[1].cardId** | N | O | 19 | Número de cartão do consumidor no Programa ou Convênio. Sem a adição de traços ou pontos. Obrigatório quando campo PROMO=M |
| **consumer[1].cardIdCompany** | N | O | 19 | Número de matrícula da empresa consumidor. Sem a adição de traços ou pontos. |
| **consumer[1].IdCompany** | N | O | 10 | Identificação da empresa conveniada, constante na tabela recebida da Rede. Mandatório se informado cardIdCompany. Sem a adição de traços ou pontos. |
| **consumer[1].cardIdOperator** | N | O | 19 | Número de cartão do consumidor na Operadora de Saúde. Sem a adição de traços ou pontos. |
| **consumer[1].IdOperator** | N | O | 10 | Id do plano, seguro ou operada de saúde. Mandatório se informado cardIdOperator. Sem a adição de traços ou pontos. |
| **consumer[1].birthdate** | D | O | N/A | Data de Nascimento do consumidor nos formatos ISO 8601; |
| **consumer[1].name** | A | O | 3/40 | Nome completo do consumidor |
| **consumer[1].gender** | A | O | 1 | Gênero do consumidor; Enviar M - MASCULINO, F - FEMININO ou I – INDEFINIDO (NÃO INFORMADO) |
| **consumer[1].postalCode** | A | O | 8 | CEP do consumidor sem edição e nem caracteres especiais |
| **consumer[1].stateCode** | A | O | 2 | Unidade federativa do consumidor |
| **consumer[1].cityName** | A | O | 2/40 | Nome da cidade do consumidor |
| **consumer[1].cityRegion** | A | O | 2/40 | Bairro do endereço do consumidor |
| **consumer[1].addressType** | A | O | 1/4 | Tipo de logradouro do consumidor |
| **consumer[1].streetAddress** | A | O | 2/40 | Endereço do consumidor |
| **consumer[1].addressNumber** | A | O | 1/5 | Número do endereço do consumidor |
| **consumer[1].addressAdditionalInformation** | A | O | 1/40 | Complemento do endereço do consumidor |
| **consumer[1].cellphone** | N | O | 11/13 | Número do telefone celular com (0 + DDD) sem edição. Ex.: 011976325673, 063976325673, 051976325673. Mandatório se atributo phone não for preenchido. |
| **consumer[1].phone** | N | O | 11/13 | Número do telefone fixo com (0 + DDD) sem edição. Ex.: 01176325673, 06376325673, 05176325673. Mandatório se atributo cellphone não for preenchido |
| **consumer[1].email** | A | O | 5/80 | E-mail do consumidor |
| **product[n].id** | N | M | 1/3 | Nº do item. Sem a adição de traços ou pontos. |
| **Product[n].EAN** | N | M | 13 | Código EAN do produto. Sem a adição de traços ou pontos. |
| **product[n].requestedQuantity** | N | M | 4 | Quantidade do produto que foi solicitada pelo usuário. Sem a adição de traços ou pontos. |
| **product[30].listPrice** | N | M | 7 | Preço bruto do estabelecimento. Mandatório se os atributos netPrice e discountType estiverem preenchidos. Sem a adição de traços ou pontos. |
| **product[n].netPrice** | N | M | 7 | Preço líquido do estabelecimento. Mandatório se os atributos listPrice e discountType estiverem preenchidos. Sem a adição de traços ou pontos. |
| **product[30].discountType** | A | O | 1 | Tipo do desconto a ser utilizado, deve ser calculado pelo preço bruto ou pelo preço líquido; B - BRUTO ou L - LÍQUIDO. Mandatório se os atributos listPrice e netPrice estiverem preenchidos |

## 5.2 Response Erro

TIPOS: A – ALFANUMÉRICO / N – NUMÉRICO / D – DATA

MODOS: M – MANDATÓRIO / O - OPCIONAL

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| **conversion[1].error[n].returnCode** | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| **conversion[1].error[n].informativeText** | A | M | 1/1024 | Texto informativo referente ao código de retorno |
| **conversion[1].error[n].object** | A | M | 1/1024 | Nome do objeto afetado pelo código de retorno |
| **validation[1].error[n].returnCode** | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| **validation[1].error[n].informativeText** | A | M | 1/2024 | Texto informativo referente ao código de retorno |
| **validation[1].error[n].object** | A | M | 1/2024 | Nome do objeto afetado pelo código de retorno |
| **process[1].error[n].returnCode** | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| **process[1].error[n].informativeText** | A | M | 1/2024 | Texto informativo referente ao código de retorno |
| **process[1].error[n].object** | A | M | 1/2024 | Nome do objeto afetado pelo código de retorno |
| **returnCode** | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| **informativeText** | A | M | 1/2024 | Texto informativo referente ao código de retorno |

## 5.3 Response Sucesso

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| **centralHour** | D | M | N/A | Data e hora de execução da operação na plataforma nos formatos ISO 8601; Utilizado como parâmetro de unicidade |
| **control[1].clientId** | A | O | 128 | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |
| **control[1].username** | A | M | 128 | Chave única do usuário no formato GUID (Globally Unique IDentifier) |
| **control[1].tableId** | A | M | 128 | Chave única de identificação da tabela de informações auxiliares local no formato GUID (Globally Unique IDentifier) |
| **control[1].localNumber** | N | M | 6/8 | Número único de cada transação atribuído pelo front-end; Utilizado como parâmetro de unicidade |
| **control[1].localHour** | D | M | N/A | Data e hora de execução da operação no front-end nos formatos ISO 8601; Utilizado como parâmetro de unicidade |
| **control[1].industryId** | A | M | 128 | Código da Administradora na plataforma |
| **control[1].stationId** | A | M | 128 | Identificação do terminal ou estação no front-end |
| **control[1].companyCode** | N | M | 6/8 | CNPJ do estabelecimento que está com a operação em execução. Sem a adição de traços ou pontos. |
| **product[1].flowDeviation** | A | O | 1/20 | Desvio de fluxo para a função ou operação a ser executada |
| **product[1].informativeLink** | A | O | 1/2048 | Formulário URL utilizado quando necessitar de informações adicionais, como por exemplo termo LGPD, Adesão do produto entre outros. Para integrações recentes |
| **product[1].UrlAcceptTerm** | A | O | 1/1024 | Url com QRCode para acesso direto ao Termo de aceite LGPD |
| **product[1].centralNumber** | N | O | 12 | Número único de cada transação atribuído pela plataforma para um novo produto a ser ativado; Para novos atendimentos, utilizar zeros, e caso seja o mesmo usuário atendido, enviar o conteúdo do último retorno obtido; Utilizado como parâmetro de unicidade |
| **product[30].id** | N | M | 1/3 | Número do item no Cupom Fiscal, Nota Fiscal Eletrônica ou outros equivalentes |
| **product[n].EAN** | N | M | 13 | Código EAN do produto |
| **product[n].authorizedQuantity** | N | M | 4 | Quantidade do produto que foi autorizada pela plataforma |
| **product[n].discountValue** | N | M | 1/14 | Valor do desconto adicional monetário que foi autorizado para o produto sobre o preço líquido do PDV. |
| **product[n].listPrice** | N | O | 1/14 | Preço calculado com desconto |
| **product[n].discountPercentual** | N | M | 1/14 | Percentual de desconto que foi autorizado para o produto |
| **product[n].additionalDiscountPercentual** | N | M | 1/14 | Percentual do desconto dado pela rede para o produto |
| **product[n].discountValueIndustry** | N | M | 1/14 | Valor do desconto adicional monetário que foi calculado sobre o desconto bruto e o desconto do PDV |
| **product[n].pointing** | N | M | 1/14 | Valor do desconto adicional que foi autorizado para o produto |
| **product[n].coPaymentPercentual** | N | O | 1/14 | Percentual de copagamento (subsídio, desconto em folha etc.) que foi autorizado para o produto no formato: 999v99 (dividir por 100) |
| **product[n].comboId** | N | M | N/A | Indicador de combinação de atribuição de desconto de um combo entre os produtos. |
| **product[n].grossPrice** | N | O | 1/14 | Preço bruto |
| **product[n].status** | N | M | 2 | Status do produto indicando aprovação do pedido |
| **product[n].informativeMessage** | A | O | 1/100 | Mensagem dinâmica referente à condição comercial daquele produto |
| **product[n].returnCode** | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| **product[n].informativeMessage** | A | O | 1/100 | Mensagem dinâmica referente à condição comercial daquele produto |
| **returnCode** | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| **informativeText** | A | M | 1/1024 | Texto informativo referente ao código único de retorno |

# Ficha Técnica LoadTables V3

**Fonte:** 4- Ficha Tecnica LoadTables V3.pdf (documento original neste mesmo diretório)

---

Interplayers – O HUB de Negócios da Saúde e Bem-Estar
FICHA TÉCNICA – LOAD TABLES V3
WEB Services Interface – Versão 1v3

Este documento foi criado para direcionar a integração técnico-operacional, entre
SEU AMBIENTE DE PROCESSAMENTO e o HUB Interplayers,

na filosofia de Processamento Cooperativo padrão

WEB SERVICES DEFINITION LANGUAGE (WSDL) regulamentado pela W3C.

### MANUAL DE CONCEITOS

Apresenta conceitos a serem considerados nas integrações via WEB Services Front End com o HUB.

Deve ser o primeiro material técnico-operacional a ser lido, por conter informações indispensáveis
para o sucesso de cada projeto com qualidade e minimização dos esforços e custos.

### MANUAL DE PROJETO

Apresenta os detalhes específicos do seu projeto, tais como, macrofluxo, funcionalidades e
WEB Services envolvidos.

Conta com **FICHA TÉCNICA** de WEB Services e **ROTEIRO DE TESTES** como anexos.

Esta é a versão **3v2** deste documento

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

Ter acesso local a informações de produtos e dados que participam de Programas para evitar comunicação desnecessária com o **HUB da Interplayers**.

## 3. Funcionamento

Diariamente, em horário pré-determinado, o **SISTEMA/CANAL** deve acionar este serviço, informando o CNPJ do estabelecimento e o CLIENTID do Canal para realizar a Carga de Tabelas e obter dados que permitirão executar localmente determinadas funções necessárias ao atendimento de consumidor.

## 4. Pontos de Atenção

É aconselhado a realização da Carga de Tabelas as 06:00 Horas, horário de pouco movimento nos estabelecimentos e no qual o **HUB da Interplayers** já completou a atualização com todos os Autorizadores elegíveis.

Não aconselhamos em hipótese alguma programar a realização do Serviço entre as 08:00 da Manhã e 00:00 Horas, somente em casos de exceção.

A Carga de Tabelas é sempre completa, ou seja, os envios realizados em datas anteriores devem ser totalmente substituídos para que evite bloqueios ou possíveis erros na tentativa de transacionar algum produto novo.

Recomendamos que o **SISTEMA/CANAL** tenha um backup da tabela de produtos do dia anterior, para uso, caso ocorra algum erro na execução do Serviço do dia.

Os atributos **"discountMaxNewPatient"** e **"qtyForDiscountMax"** permitem o **SISTEMA/CANAL** obter as informações de Desconto Máximo para um paciente novo (Sem Adesão) e a quantidade necessária de unidades para alcançar o esse Desconto Máximo.

Deste modo é possível conduzir o consumidor final a se cadastrar no programa da indústria e transacionar pelo **HUB da Interplayers**.

Os novos atributos **"State"**, **"City"** e **"FederalCode"** concedem ao **SISTEMA/CANAL** os descontos específicos (se houver) para o Estado, Cidade e CNPJ. Cada situação ilustrada abaixo indicará um cenário diferente para o programa, produtos e descontos.

**Figura 1** - Campanha especial para aquele determinado CNPJ

**Figura 2** - Campanha especial para aquela determinada Cidade

**Figura 3** - Campanha especial para aquela determinada UF

**Figura 4** - Campanha disponível para todo o território nacional

Caso um produto possua desconto exclusivo para uma UF específica, o EAN do produto aparecerá na estrutura segmentada por UF (figura 5) e na estrutura da campanha disponível para todo o território nacional (figura 6).

[Diagrama — Figura 1: "Campanha especial para aquele determinado CNPJ". Mostra a estrutura de retorno do LoadTables V3 em formato de árvore/JSON, com chaves indicando o nível de segmentação:
```
"State": "SP",           -> Segmentação por Estado/UF
"Cities": [
  {
    "city": "São Paulo",   -> Segmentação por Cidade
    "FederalCodes": [
      {
        "federalCode": "99999999999999",  -> Segmentação por CNPJ
```
]

[Diagrama — Figura 2: "Campanha especial para aquela determinada Cidade". Estrutura semelhante:
```
"State": "SP",           -> Segmentação por Estado/UF
"Cities": [
  {
    "city": "Sao Paulo",   -> Segmentação por Cidade
    "FederalCodes": [
      {
        "federalCode": "N/A",
```
]

[Diagrama — Figura 3: "Campanha especial para aquela determinada UF". Estrutura:
```
"State": "SP",           -> Segmentação por Estado/UF
"Cities": [
  {
    "city": "Não Informada",  -> Segmentação por Cidade
    "FederalCodes": [
      {
        "federalCode": "N/A",
```
]

[Diagrama — Figura 4: "Campanha disponível para todo o território nacional". Estrutura:
```
"State": "ZZBR",          -> Segmentação por Estado/UF
"Cities": [
  {
    "city": "Não Informada",  -> Segmentação por Cidade
    "FederalCodes": [
      {
        "federalCode": "99999999",  -> Segmentação por CNPJ
```
]

**Figura 5** - Campanha especial para aquele determinado CNPJ

**Figura 6** - Campanha disponível para todo o território nacional

[Diagrama — Figura 5: "Campanha especial para aquele determinado CNPJ". Estrutura de retorno do LoadTables V3:
```
"State": "SP",
"Cities": [
  {
    "city": "Não Informada",
    "FederalCodes": [
      {
        "federalCode": "N/A",
        "programNames": [
          {
            "programName": "Programa Vale Mais Saúde",
            "products": [
              {
                "ean": "7896261005884",
```
]

[Diagrama — Figura 6: "Campanha disponível para todo o território nacional". Estrutura de retorno do LoadTables V3:
```
"State": "ZZBR",
"Cities": [
  {
    "city": "Não Informada",
    "FederalCodes": [
      {
        "federalCode": "99999999",
        "programNames": [
          {
            "programName": "Programa Vale Mais Saúde",
            "products": [
              {
                "ean": "7896261005884",
```
]

## 5. Layout

| MÉTODO POST | Versão 2.0 |
|---|---|
| **Endpoint:** | https://{url-host}/api/integration/v3/loadTables |
| **Content-Type:** | application/json |
| **Response:** | application/json |

### 5.1 Header

| Parâmetro | Descrição |
|---|---|
| Content-Type | Tipo de conteúdo que está sendo enviado |
| Authorization | Token de autenticação válido, utilizando formato "Bearer \<Access Token\>" |
| Version | Versão da API que deverá ser consumida |
| ClientId | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |

### 5.2 Body

TIPOS: A – ALFANUMÉRICO / N – NUMÉRICO / D – DATA
MODOS: M – MANDATÓRIO / O - OPCIONAL

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| control[1].clientId | A | M | 128 | Chave única de identificação do cliente no formato GUID (Globally Unique IDentifier) |
| control[1].username | A | O | 128 | Chave única do usuário no formato GUID (Globally Unique IDentifier) |
| control[1].tableId | A | O | 128 | Chave única de identificação da tabela de informações auxiliares local no formato GUID (Globally Unique IDentifier) |
| control[1].localNumber | N | O | 6/8 | Número único de cada transação atribuído pelo front-end; |
| control[1].localHour | D | M | 33 | Data e hora de execução da operação no front-end nos formatos ISO 8601 |
| control[1].tableVersion | A | O | 128 | Chave única da versão da tabela |
| control[1].industryId | A | M | 3 | Código da administradora na plataforma. Informar o valor 999 |
| control[1].stationId | A | M | 8 | Identificação do terminal ou estação no front-end |
| control[1].tableImage | A | O | N/A | Imagem da tabela para Upload de informações auxiliares local disponível para o front-end |
| control[1].companyCode | A | M | 14/20 | CNPJ do estabelecimento que com a operação em execução |

### 5.3 Response Sucesso

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| returnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| informativeText | A | M | 1/1024 | Texto informativo referente ao código único de retorno |
| centralHour | D | M | 33 | Data e hora de execução da operação na plataforma nos formatos ISO 8601 |
| control[1].tableId | A | M | 128 | Chave única de identificação da tabela de informações auxiliares local no formato GUID (Globally Unique IDentifier) |
| control[1].tableImage | O | M | N/A | Imagem da tabela de informações auxiliares local disponível para o front-end |
| control[1].tableImage[1].state | A | M | 4 | Retorna o Estado |
| control[1].tableImage[1].cities[1].city | A | M | 40 | Retorna a cidade. Não possui caracteres especiais como acento e cedilha (Ç) exceto no retorno "Não Informada". |
| control[1].tableImage[1].cities[1].federalCodes[1].federalCode | A | M | 13 | Retorna o CNPJ |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].programName | A | M | 40 | Retorna o nome do programa |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1] | A | M | N/A | Produtos do programa |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].EAN | N | M | 13 | Código EAN do produto |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].cityCode | N | M | 7 | Código IBGE do município |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].InformativeMessage | A | O | N/A | Texto informativo referente ao produto |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].industryId | A | M | 3 | Código da Administradora na plataforma |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].industryName | A | M | 10 | Nome da Industria |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].discountMaxNewPatient | A | M | 5 | Desconto máximo disponível para a primeira compra do cliente |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].qtyForDiscountMax | A | M | 5 | Quantidade de produtos onde o desconto máximo foi autorizado. |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].discountMax | A | M | 5 | Desconto Máximo do produto |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].discountMin | A | M | 5 | Desconto Mínimo do produto |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].suggestedPrice | A | M | 1 | Regra de produto com preço sugerido pela Industria |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].suggestedPriceValue | N | M | 6 | Informa o preço sugerido para o EAN/produto. |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].allowsAdhesion | A | M | 1 | Produto Permite novas Adesões? S ou N. |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].authorizer | A | M | 11 | Nome do Autorizador |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].requestHolderId | A | M | 1 | Sinaliza se é necessário informar o CPF. M = Mandatório/Obrigatório O ou X = Opcional |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].requestCoupon | A | M | 1 | Sinaliza se é necessário informar o Cupom. M = Mandatório/Obrigatório O ou X = Opcional |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].discountAbsolute | A | O | 4 | Desconto Absoluto (Reais) |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].pointing | A | O | 4 | Quantidade de pontos do programa |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].imageLink | A | M | 1024 | Link de direcionamento para a logo da indústria |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].allChain | A | M | 1 | Habilitado para toda a rede |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].requiredOnLine | A | M | 1 | Obrigatória consulta on-line |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].eanCombos | A | M | N/A | Indica lista de EAN's que formam combo |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].eanCombos[1].ean | N | M | 13 | Código EAN do(s) produto(s) que forma(m) combo |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].discountMinNewPatient | N | M | 4 | Desconto mínimo disponível para a primeira compra do cliente |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].discountFirstBox | N | M | 4 | Desconto para novos pacientes aderidos ao programa (Desconto para primeira caixa) |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].programScore | A | M | 1 | Identifica se o produto possui programa de pontos |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].productLMPM | A | M | 1 | Identifica se há desconto progressivo para o produto |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].informCrmInsertPatient | A | M | 1 | Informa se a informação de CRM/CRO é obrigatória no cadastro do paciente |
| control[1].tableImage[1].cities[1].federalCodes[1].programNames[1].Products[1].informCrmClosingSale | A | M | 1 | Informa se a informação de CRM/CRO é obrigatória na venda de produto |
| control[1].centralNumber | N | O | 12 | Número único de cada transação atribuído pela plataforma; Para novos atendimentos, utilizar zeros, e caso seja o mesmo usuário atendido, enviar o conteúdo do último retorno obtido; |
| Coupons | O | M | N/A | Imagem da tabela de informações auxiliares local disponível para o front-end; |
| coupons[1].industryName | A | M | 10 | Nome da Indústria |
| coupons[1].rangeStart | N | M | 10 | Range inicial de cartões da indústria |
| coupons[1].rangeEnd | N | M | 10 | Range final de cartões da indústria |

### 5.4 Response Erro

| Parâmetro | Tipo | Modo | Tamanho | Descrição |
|---|---|---|---|---|
| process[1].error[n].returnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| process[1].error[n].informativeText | A | M | 1/1024 | Texto informativo referente ao código único de retorno |
| process[1].error[n].object | A | M | 1/1024 | Nome do objeto afetado pelo código único de retorno |
| returnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| process[1].error[n].returnCode | A | M | 10/10 | Código único de retorno interno da plataforma, utilizado para apoio nas atividades de suporte. Atrelado a regra e domínio do negócio |
| process[1].error[n].informativeText | A | M | 1/1024 | Texto informativo referente ao código único de retorno |

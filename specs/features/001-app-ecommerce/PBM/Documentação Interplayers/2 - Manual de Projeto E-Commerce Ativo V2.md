# Manual de Projeto E-Commerce Ativo V2

**Fonte:** 2 - Manual de Projeto E-Commerce Ativo V2.pdf (documento original neste mesmo diretório)

---

## Interplayers – O HUB de Negócios da Saúde e Bem-Estar

## MANUAL DE PROJETO E-COMMERCE ATIVO

### WEB Services Interface – Versão 2v1

*Confidencial Interplayers — Reprodução Proibida*

---

## Página 1

Este documento foi criado para direcionar a integração técnico-operacional, entre **SEU AMBIENTE DE PROCESSAMENTO e o HUB Interplayers**, na filosofia de Processamento Cooperativo padrão **WEB SERVICES DEFINITION LANGUAGE (WSDL)** regulamentado pela **W3C**.

### MANUAL DE CONCEITOS

Apresenta conceitos a serem considerados nas integrações via WEB Services Front End com o HUB. Deve ser o primeiro material técnico-operacional a ser lido, por conter informações indispensáveis para o sucesso de cada projeto com qualidade e minimização dos esforços e custos.

### MANUAL DE PROJETO

Apresenta os detalhes específicos do seu projeto, tais como, macrofluxo, funcionalidades e WEB Services envolvidos.

Conta com **FICHA TÉCNICA de WEB Services** e **ROTEIRO DE TESTES** como anexos.

**Esta é a versão 2v1 deste documento**

### NOTAS

Exemplos e fluxos apresentados são ilustrativos.

Os documentos, softwares e materiais disponibilizados são protegidos por propriedade intelectual, não podendo ser copiados, reproduzidos ou cedidos sob qualquer forma ou pretexto sem prévia e formal autorização da Interplayers.

A integração por WEB Services é cada vez mais comum, no entanto, existem diversos detalhes que garante o sucesso do trabalho.

Recomendamos a leitura detalhada deste documento para minimizar os esforços e consequentemente reduzir os custos e tempo para sua realização.

No caso de dúvidas, divergências e sugestões contate interface@interplayers.com.br

*Confidencial Interplayers — 1/4 — Reprodução Proibida*

---

## Página 2

## 1- TRANSACIONAL

### 1.1 CARGA DE TABELAS

[Diagrama de fluxo — "Carga de Tabelas": mostra as colunas "Funcionalidades HUB" e "Sistema/Canal". Fluxo: INÍCIO → Horário Pré-determinado (Entre as 05:00hs e 06:00hs da manhã) → Carga de tabelas (É uma carga de tabela que possui todos os EAN's dos programas, caso tenha alguma alteração, produto novo ou nova campanha, os mesmos serão disponibilizados nessa tabela diária) → Produtos HUB (O Sistema/Canal deve atualizar diariamente a base local para as comunicações com o HUB de negócios de saúde e bem estar) → FIM]

**Nota1:** Para todas as funcionalidades deve ser enviado a Autenticação – GenerateToken

### 1.2 COMPRA SHOPPER

[Diagrama de fluxo — "Compra Shopper": mostra as colunas "Funcionalidades HUB" e "Sistema/Canal". Fluxo descrito abaixo:

- INÍCIO → Consumidor escolhe o produto ← Produtos HUB
- Segue para decisão "Programas": Não → segue para "Condições de loja"; Sim → segue para "Consumidor identificado" (com aviso ⚠ "Exibir o Logo e nome da indústria junto ao produto")
- "Consumidor identificado": Não → "Consulta produto **sem** CPF"; Sim → "Consulta produto **com** CPF"
- "Consulta produto sem CPF" → "Apresenta condições ao consumidor" → "Consumidor identificado" (Sim/Não) → "Condições de loja"
- "Consulta produto com CPF" → "Adesão do Produto" → decisão "Possui URL?": Não → decisão "Possui Desvio de Fluxo?": Não → "API carrinho"; Sim → "Desvio de Fluxo"; "Possui URL?" Sim → "Apresenta URL"
- "API carrinho" → "Condições de loja"
- "Condições de loja": Não → retorna ao topo (loop); Sim → "Apresenta carrinho"
- "Apresenta carrinho" → decisão "Adicionar mais Produtos": Sim → retorna ao início do fluxo (Consumidor escolhe o produto); Não → decisão "Carrinho com programas": Não → "Efetiva"; Sim → "Efetiva"
- "Efetiva" → FIM

Caixa de texto explicativa no diagrama:
**MELHOR DESCONTO:**
O SISTEMA/CANAL deve sempre oferecer o **MELHOR DESCONTO** para o consumidor desde a Consulta do Produto até a Finalização do pedido. Diante disso se faz necessário o envio do **PREÇO BRUTO** e **LÍQUIDO** do SISTEMA/CANAL em todos os Serviços, para que assim o HUB realize o cálculo indicando qual melhor desconto.]

**Nota1:** Para todas as funcionalidades deve ser enviado a Autenticação – GenerateToken

*Confidencial Interplayers — 2/4 — Reprodução Proibida*

---

## Página 3

### 1.3 SEPARAÇÃO/ENTREGA

[Diagrama de fluxo — "Separação/Entrega": mostra as colunas "Funcionalidades HUB" e "Sistema/Canal". Fluxo:

- INICIO → Separação do produto → decisão "Venda com o programa": Não → "Finaliza transação" → FIM; Sim → decisão "Documento Fiscal Emitido?"
- "Documento Fiscal Emitido?": Não → "Finalização transação Anula" (com aviso ⚠: "Após efetivação, a transação ficará **PENDENTE** e o saldo do consumidor será comprometido. Desta maneira, não gera reposição para o estabelecimento, é premissa finalizá-la com os serviços de **CONFIRMA** ou **ANULA**") → FIM
- "Documento Fiscal Emitido?": Sim → "Documento fiscal" (Impressão do Documento Fiscal + Comprovante da transação (Vinculado)) → "Finalização transação Confirma" → FIM]

**Nota1:** Para todas as funcionalidades deve ser enviado a Autenticação – GenerateToken

### 1.4 DEVOLUÇÃO/CANCELAMENTO

Após a emissão do documento fiscal e envio da funcionalidade Finalização da Transação – Confirma, se houver necessidade de cancelamentos e devoluções de vendas, estes eventos devem ser registrados via são pelo Portal da Drogaria.

[Diagrama de fluxo — "Devolução/Cancelamento": mostra as colunas "Funcionalidades HUB" e "Sistema/Canal". Fluxo: INÍCIO → Cancelamento da Compra, após a Confirmação da Venda → decisão "Deseja Cancelar?": Não → FIM; Sim → "Cancelamento da transação" → FIM]

*Confidencial Interplayers — 3/4 — Reprodução Proibida*

---

## Página 4

## 2- FICHAS TÉCNICAS RELACIONADAS NO ANEXO

- Generate Token
- Carga de Tabelas
- Consulta Produto sem ID Shopper
- Consulta Produto com ID Shopper
- Carrinho
- Efetivação
- Finalização da Transação
- Adesão Shopper e Adesão Produto
- URL

*Confidencial Interplayers — 4/4 — Reprodução Proibida*

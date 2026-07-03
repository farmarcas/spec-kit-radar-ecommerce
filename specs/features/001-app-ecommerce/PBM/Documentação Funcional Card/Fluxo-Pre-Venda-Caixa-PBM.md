# Fluxo de venda no Caixa (PBM)

**Fonte:** https://developer.funcionalmais.com/docs/gateway-credenciados/Fluxo-Pre-Venda-Caixa-PBM

---

## Pre-venda

O fluxo de venda pré-autorizada existe normalmente nos casos onde, há uma pré-autorização realizada no balcão, onde é feita a negociação e consultas para evitar filas no caixa. É gerado um número de pré-autorização que é utilizado para a confirmação no caixa usando o Gateway.

![img](/assets/images/Fluxograma-4a814740ccf517ba31d7eceff789a5d6.png)

### Passo 1: Criação do token (createToken)

Para realizar uma venda é necessário enviar o token nas transações.

[Acesse aqui para ver o passo a passo de criação do token](/docs/gateway-credenciados/autenticacao#autentica%C3%A7%C3%A3o)

### Passo 2: Avaliar elegibilidade

A partir de um CPF e EAN, avalia se o produto pertence à algum programa, e se o CPF precisa ser cadastrado no programa ou no produto específico.

### Passo 3: Validando as regras

Efetua uma transação de teste/simulação para validação de preços e regras a serem aplicadas.

API: [Query: Pharma_checkPricesAndRules](/api-ref/index.html#operation-pharma_checkpricesandrules-Queries)

Exemplo da query

```graphql
query {
  # Checa regras e preços
  Pharma_checkPricesAndRules(
    # Origem da solicitação
    origin: POINT_OF_SALES
    # CNPJ do credenciado
    storeCode: "00000000000010"
    # CPF do consumidor
    customerCode: "<CPF da pessoa>"
    # Produtos - pode ser uma lista de produtos
    products: [
      {
        ean: "7897473206861"
        price: 52.99
        saleAmount: 1
        # Dados da receita médica
        medicalPrescription: {
          quantity: 1
          date: "2020-12-21"
          # Dados de quem escreveu a receita
          prescriber: {
            council: CRO
            stateAbbr: "SP"
            registerNumber: 12345
         },
   }
  }]
  ) {
    aproved,
    createdAt,
    totalValue,
    moneyPaidValue,
    cardPaidValue,
    totalValueMaxConsumerPrice,
    totalValueWithPrescription,
    totalValueWithoutPrescription,
    totalDiscountAmount,
    requiredUploadWithPrescription,
    products {
      transactionType,
      ean,
      description,
      maximumConsumerPrice,
      priceReceived,
      funcionalPrice,
      salePrice,
      saleAmount,
      status {
        aproved,
        message,
   },
      medicalPrescription {
        quantity,
        date,
        prescriber {
          council,
          stateAbbr,
          registerNumber,
    },
        dailyDose,# o parâmetro deve ser declarado na pré-autorização, após validação se retornado true no requiredInformDailyDose
        requiredInformDailyDose,# o mesmo valida se é obrigatório o envio do parâmetro "dailyDose"
      }
    }
  }
}
```

Resposta

```json
{
  "data": {
    "Pharma_checkPricesAndRules": {
      "aproved": true,
      "createdAt": "2022-01-14T15:22:57.000Z",
      "totalValue": 118.75,
      "moneyPaidValue": 118.75,
      "cardPaidValue": 0,
      "totalValueMaxConsumerPrice": 118.75,
      "totalValueWithPrescription": 0,
      "totalValueWithoutPrescription": 118.75,
      "totalDiscountAmount": 0,
      "requiredUploadWithPrescription": false,
      "products": [
        {
          "transactionType": "PHARMA",
          "ean": "7897473206861",
          "description": "LEVOLUKAST 11875",
          "maximumConsumerPrice": 118.75,
          "priceReceived": 52.99,
          "funcionalPrice": 118.75,
          "salePrice": 118.75,
          "saleAmount": 1,
          "status": {
            "aproved": true,
            "message": ""
          },
          "medicalPrescription": {
            "quantity": 1,
            "date": "2022-01-14T15:22:57.000Z",
            "prescriber": {
              "council": "CRM",
              "stateAbbr": "00",
              "registerNumber": 0
            },
      "dailyDose": null,
      "requiredInformDailyDose": true
     }
    }
   ]
  }
 }
}
```

> **Observação:**
> Detalhe do parâmetro
> requiredInformDailyDose: O mesmo valida se é obrigatório o envio do parâmetro "dailyDose"- Dose diária para beneficiários modalidade de benefício farmácia no momento da pré autorização. Lembrando que o campo DailyDose só é obrigatório para compras que exigem receita.

### Passo 4: Pre-autorizando uma venda

Efetua uma transação de pré-autorização de regras feita normalmente no balcão que garante as regras negociadas até a confirmação ou até uma nova pré-autorização. Esta não é ainda uma transação de venda válida, apenas a negociação.

API: [Mutation: Sales_preAuthorizeSale](/api-ref/index.html#operation-sales_preauthorizesale-Mutations)

Exemplo de mutation

```graphql
mutation preAuthorizeSale {
  # Pré-autorização de venda
  Sales_preAuthorizeSale(
    # Canal PHARMA ou BENEFITS
    channel: PHARMA
    # Origem da chamada
    origin: PARTNERS_ECOMMERCE
    # Cartão ou CPF
    customerCode: "27805208840"
    # CNPJ da farmácia
    storeCode: "00000000000010"
    # Produtos
    products: [
      {
        ean: "7897337706742" # JANUVIA
        unitPrice: 45
        quantity: 2000
        # Receita Médica
        medicalPrescription: {
          date: "2022-01-14"
          quantity: 2
          usage: CONTINUAL # uso contínuo
          # Prescritor (Médico, Dentista)
          prescriber: {
            council: CRO
            registerNumber: 12345
            stateAbbr: "SP"
          }
        }
      }
      {
        ean: "7896015523398" # COMBODART
        unitPrice: 120
        quantity: 1
        # Receita Médica
        medicalPrescription: {
          date: "2022-01-13"
          quantity: 1
          usage: CONTINUAL # uso contínuo
          # Prescritor (Médico, Dentista)
          prescriber: {
            council: CRO
            registerNumber: 12345
            stateAbbr: "SP"
          }
        }
      }

    ]
  ) {
    createdAt
    authorizationID
    sequenceID
    totalValue
    moneyPaidValue
    cardPaidValue
    status
    statusCode
    statusMessage
    # Se exige um token gerado no app de celular
    secondFactorAuthentication
    products {
      ean
      description
      maxConsumerPrice
      unitPrice
      quantity
      status
      statusCode
      statusMessage
      medicalPrescription {
        date
        quantity
        dailyDose # quando necessário a declaração de acordo a validação de regra, é importante pedir o retorno para ser especificado no próximo passo que é a confirmação.
        prescriber {
          council
          registerNumber
          stateAbbr
        }
      }
    }
  }
}
```

Resposta

```json
{
  "data": {
    "Sales_preAuthorizeSale": {
      "createdAt": "2022-01-14T10:40:10.000Z",
      "authorizationID": "53466",
      "sequenceID": "53477",
      "totalValue": 130.81,
      "moneyPaidValue": 130.81,
      "cardPaidValue": 0,
      "status": "ERROR",
      "statusCode": 1,
      "statusMessage": "",
      "secondFactorAuthentication": "NONE",
      "products": [
        {
          "ean": "7897337706742",
          "description": "JANUVIA   27462",
          "maxConsumerPrice": 274.62,
          "unitPrice": 0,
          "quantity": 2000,
          "status": "ERROR",
          "statusCode": 72,
          "statusMessage": "\tVenda não autorizada. Compra excedida ou quantidade sem receita excedida.",
          "medicalPrescription": {
            "date": "2022-01-14",
            "quantity": 2,
            "prescriber": {
              "council": "CRO",
              "registerNumber": 0,
              "stateAbbr": "SP"
            }
          }
        },
        {
          "ean": "7896015523398",
          "description": "COMBODART 13081",
          "maxConsumerPrice": 130.81,
          "unitPrice": 130.81,
          "quantity": 1,
          "status": "SUCCESS",
          "statusCode": 0,
          "statusMessage": "",
          "medicalPrescription": {
            "date": "2022-01-13",
            "quantity": 1,
            "prescriber": {
              "council": "CRO",
              "registerNumber": 0,
              "stateAbbr": "SP"
            }
          }
        }
      ]
    }
  }
}
```

Na situação de dois itens na pré autorização, quando um produto for recusado com a mensagem de erro `Venda não autorizada. Compra excedida ou quantidade sem receita excedida.`.

Já o segundo item retorna com sucesso.

Quando isso acontecer será necessário criar uma nova autorização somente com os produtos que não tiveram falha.

Utilize o `authorizationID` posteriormente na confirmação da venda.

### Passo 5: Confirmando uma autorização

Efetua a efetivação da venda baseado no pré-autorização realizada anteriormente. Não é possível adicionar novos produtos e nem adicionar uma quantidade superior a pré-autorizada. Caso seja necessário é preciso realizar uma nova pré-autorização.

Utilize o campo `status` da resposta para validar se a venda foi confirmada ou não.
No campo `statusMessage` temos a mensagem de erro caso o `status` seja diference de **_SUCCESS_**

> **Atenção**
> Uma venda não pode ser confirmada mais de uma vez. Na segunda vez que a venda tentar ser confirmada, retornará o erro **Pre-Autorizacao nao encontrada**

API: [Query: Sales_confirmPreAuthorizedSale](/api-ref/index.html#operation-sales_confirmpreauthorizedsale-Mutations)

Exemplo de mutation

```graphql
 mutation confirmPreAuthorizedSale {
  # Confirma pré-autorização e conclui venda
  Sales_confirmPreAuthorizedSale(
    # Cartão ou CPF
    customerCode: "00000000000"
    # Origem da chamada
    origin: PARTNERS_ECOMMERCE
    # CNPJ da farmácia
    storeCode: "00000000000010"
    # Código da pré-autorização
    authorizationID: 57133
    # Data e hora da pré-autorizaçao, retornado no campo createdAt da mutation Sales_preAuthorizeSale
    preAuthorizationDate: "2022-01-14T15:22:57.000Z"
    # Chave Danfe - Opcional
    invoiceCode: "00000000000000000000000000000000000000000000"
    # Protocolo de autenticação da Danfe - Opcional
    invoiceAuthProtocol: "xxxxxxxxxxxxx"
    # Produtos
    products: [
      {
        ean: "7897337706742"
        unitPrice: 45
        # maxConsumerPrice: 60
        quantity: 1
        # Receita Médica
        medicalPrescription: {
          date: "2022-01-14"
          quantity: 1
          usage: CONTINUAL # uso contínuo
          # Prescritor (Médico, Dentista)
          prescriber: { council: CRM, registerNumber: 999999, stateAbbr: "SP" }
        }
      }
      {
        ean: "7896015523398" # COMBODART
        unitPrice: 120
        quantity: 1
        # Receita Médica
        medicalPrescription: {
          date: "2022-01-13"
          quantity: 1
          usage: CONTINUAL # uso contínuo
          # Prescritor (Médico, Dentista)
          prescriber: { council: CRO, registerNumber: 12345, stateAbbr: "SP" }
        }
      }
    ]
  ) {
    createdAt
    authorizationID
    sequenceID
    totalValue
    moneyPaidValue
    cardPaidValue
    cardBalance
    status
    statusCode
    statusMessage
    reimbursementValue # Valor do ressarcimento de toda a venda
 receipt
    products {
      ean
      description
      #storePrice
      maxConsumerPrice
      unitPrice
      quantity
      status
      statusCode
      statusMessage
      reimbursementValue # Valor do ressarcimento por produto
      medicalPrescription {
        date
        quantity
        prescriber {
          council
          registerNumber
          stateAbbr
        }
      }
    }
  }
}
```

Resposta sucesso

```json
{
 "data": {
  "Sales_confirmPreAuthorizedSale": {
   "createdAt": "2022-02-07T12:33:11.000Z",
   "authorizationID": "57134",
   "sequenceID": "57145",
   "totalValue": 364.89,
   "moneyPaidValue": 0,
   "cardPaidValue": 364.89,
   "cardBalance": 99634.11,
   "status": "SUCCESS",
   "statusCode": 0,
   "statusMessage": "",
   "reimbursementValue": null,
   "receipt": " Cartao: 60100022100000116@ Plano:Funcional Card@ CNPJ:03322366000175@
   Data: 07/02/2022 Hora: 12:33:11@ Seq: 00057144 Aut: 00057134@ Cod Acesso: 00000010@
   11004 - COMPRA MEDIC.INF. FARMACO@ TOTAL COMPRA:     405.43@ DESCONTO:          40.54           10 %
   @ TOTAL A PAGAR:    364.89@ TOTAL A PAGAR A VISTA:           0.00@ TOTAL A PAGAR NO CARTAO:       364.89
   @@ RECONHECO A DIVIDA E AUTORIZO O @ DESCONTO DO VALOR NA FORMA PREVISTA@@@ -------------------------------- @
   Assinatura@@ RG------------------------------@ O VALOR DE R$ 364.89 SERA PAGO A TESTE @ FUNCIONAL POR FUNCIONAL CARD",
   "products": [
    {
     "ean": "7897337706742",
     "description": "JANUVIA   27462",
     "maxConsumerPrice": 274.62,
     "unitPrice": 247.16,
     "quantity": 1,
     "status": "SUCCESS",
     "statusCode": 0,
     "statusMessage": "",
     "reimbursementValue": null,
     "medicalPrescription": {
      "date": "2022-01-14T00:00:00.000Z",
      "quantity": 1,
      "prescriber": {
       "council": "CRM",
       "registerNumber": 999999,
       "stateAbbr": "SP"
      }
     }
    },
    {
     "ean": "7896015523398",
     "description": "COMBODART 13081",
     "maxConsumerPrice": 130.81,
     "unitPrice": 117.73,
     "quantity": 1,
     "status": "SUCCESS",
     "statusCode": 0,
     "statusMessage": "",
     "reimbursementValue": null,
     "medicalPrescription": {
      "date": "2022-01-13T00:00:00.000Z",
      "quantity": 1,
      "prescriber": {
       "council": "CRO",
       "registerNumber": 12345,
       "stateAbbr": "SP"
      }
     }
    }
   ]
  }
 }
}
```

Exemplo de erro na confirmação

```json
{
  "data": {
    "Sales_confirmPreAuthorizedSale": {
      "createdAt": "2022-01-14T16:08:09.000Z",
      "authorizationID": "53616",
      "sequenceID": "53627",
      "totalValue": null,
      "moneyPaidValue": null,
      "cardPaidValue": null,
      "cardBalance": 0,
      "status": "ERROR",
      "statusCode": 1,
      "statusMessage": "Pre-Autorizacao nao encontrada!",
      "products": []
    }
  }
}
```

### Passo 6: Atualizar os dados da Nota Fiscal eletrônica

Atualiza os dados de cupom de uma transação já concluída. Esse processo é utilizado para atualizar os dados de nota fiscal quando o a geração da NFe é realizada após a confirmação da venda na Funcional.

API: [Query: Sales_updateInvoiceCode](/api-ref/index.html#operation-sales_updateinvoicecode-Mutations)

Exemplo de mutation

```graphql
mutation {
  Sales_updateInvoiceCode(
    storeCode: "00000000000010" # CNPJ da farmácia
    invoiceCode: "00000000000000000000000000000000000000000000" # Chave Danfe - Obrigatório
    invoiceAuthProtocol: "xxxxxxxxxxxxx" # Protocolo de autenticação - Obrigatório
    authorizationID: 123 # Número da autorização
    saleDate: "2021-01-13" # Data da venda
  ) {
    status
    statusCode
    statusMessage
  }
}
```

Resposta

```json
{
  "data": {
    "Sales_updateInvoiceCode": {
      "status": "SUCCESS",
      "statusCode": 0,
      "statusMessage": "Transação atualizada com sucesso"
    }
  }
}
```

## Informações Adicionais

## Processos diários de carga

Consulta a base de programas da indústria e seus produtos a partir do CNPJ enviado.

![img](/assets/images/processos-carga-diaria-cf39f1eaee4f0c0a0948aea28d3cf63d.png)

> **Observações:**
> - Importante a utilização da carga para atualizações diária.
> - Todas as informações recebidas na response devem ser analisadas. Exemplo: Origens permitidas por cada programa, essa informação é passada e deve ser respeitada.

API: [Query: Pharma_discountPrograms](/api-ref/index.html#operation-pharma_discountprograms-Queries)

Exemplo de query

```graphql
Query {
  Pharma_discountPrograms(
    # CNPJ do credenciado
    storeCode: "00000000000010"
    # Origem
    origin: PARTNERS_ECOMMERCE
  ) {
    id
    name
    allowedOrigins
    url
    rules {
      id
      description
      product {
        name
        package
        eans
      }
      maximumConsumerPrice
      saleBaseDiscountPercentage
      repositionBaseDiscountPercentage
      blocked
      requiresMedicalPrescription
      witholdsMedicalPrescription
    }
  }
}
```

## Cancelamento

Utilizado para cancelar uma venda depois de confirmada.
Deverá ser enviado o `authorizationID` retornado no método `Sales_confirmPreAuthorizedSale`

![img](/assets/images/cancelamento-fd35359f8ab0db1debb992de0ed31a2a.png)

API: [Query: Sales_cancel](/api-ref/index.html#operation-sales_cancel-Mutations)

Exemplo de mutation

```graphql
mutation {
  # Cancela uma venda
  Sales_cancel(
    channel: PHARMA
    # Origem (Loja, ecommerce, etc)
    origin: POINT_OF_SALES
    # Cartão ou CPF
    customerCode: "00000000000"
    # CNPJ da farmácia
    storeCode: "00000000000010"
    # Código da pré-autorização
    authorizationID: 46854
    # Data da autorização (obrigatória se a venda não ocorreu hoje)
    createdAt: "2021-01-13T17:59:34.000Z"
  ) {
    createdAt
    authorizationID
    status
    statusCode
    statusMessage
    receipt
  }
}
```

Exemplo de resposta de sucesso

```json
{
  "data": {
    "Sales_cancel": {
      "createdAt": "2022-01-17T09:53:15.000Z",
      "authorizationID": "46854",
      "status": "SUCCESS",
      "statusCode": 0,
      "statusMessage": "",
      "receipt": "CANCELAMENTO@ Cartao:       2780*****40@ Data: 10/01/2021 Hora: 09:53:15@ Seq: 00053709 Doc: 00053699@ Cod Acesso: 000000000000010@  251000 - CANCEL COMP.CART.CONVENIO@ DOC. ORIGEM:             53699@ DATA ORIGEM:        10/01/2021@ HORA ORIGEM:          09:51:46@ Valor:              0.00@@        FUNCIONAL CARD"
    }
  }
}
```

Resposta de uma transação que já foi cancelada.

```json
{
  "data": {
    "Sales_cancel": {
      "createdAt": "2022-01-17T11:01:19.000Z",
      "authorizationID": "53735",
      "status": "ERROR",
      "statusCode": 103,
      "statusMessage": "Transacao ja cancelada",
      "receipt": null
    }
  }
}
```

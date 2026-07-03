# Fluxo OptIn

**Fonte:** https://developer.funcionalmais.com/docs/gateway-credenciados/OptIn

---

## Envio do Termo de consentimento via SMS/E-MAIL

## Passo 1: VerificarOptIn

A query verifica se um determinado CPF aceitou ou não os termos de um programa, e se esse aceite é obrigatório. Este método deve ser chamado em atualizações cadastrais e momentos de autorização e compra.

Exemplo da query

```graphql
query {
  Pharma_verifyOptIn(input: { 
      EAN: "7896015516802",
      CPF: "<CPF da pessoa>",
      CNPJ: "00000000000010",
      Origem: 5,
         CodCre: 0
    } , origin: POINT_OF_SALES) {
    OptInRealizado
    OptInObrigatorio,
        Mensagem
  }
}
```

Resposta

```json
{
    "data": {
        "Pharma_verifyOptIn": {
            "OptInRealizado": "N",
            "OptInObrigatorio": "N",
            "Mensagem": "Compra liberada. A próxima compra será bloqueada se o beneficiário não aceitar os termos do programa."
        }
    }
}
```

## Passo 2: EnviarTermosOptIn

A mutation envia Email e/ou SMS (conforme o dado que for informado) para um beneficiário contendo o link de para a página de aceite.

Exemplo da mutation

```graphql
mutation {
  Pharma_sendOptInTerms(input: {
        Ean: "7896015516802",
                 CPF: "<CPF da pessoa>",
        TelefoneCelular: "<Celular da pessoa>",
        Email: "<E-mail da pessoa>" 
        Origem: 5
    
    }, origin: POINT_OF_SALES) {
    Status
        Mensagem
    }
  }
```

Resposta

```json
{
    "data": {
        "Pharma_sendOptInTerms": {
            "Status": "OK",
            "Mensagem": null
        }
    }
}
```

## Exibição do Termo de consentimento em tela

## Passo 1: RecuperarTextoTermosOptIn

A query retorna todo o conteúdo que é exibido no link de aceite, dando a possibilidade do credenciado ou parceiro exibir da forma que quiser os termos de uso, sem precisar enviar SMS ou Email pro beneficiário.

Exemplo da query

```graphql
query {
  Pharma_retrieveTextTermsOptIn(input: { 
      Ean: "7896015516802",
      CPF: "<CPF a pessoa>",
      Origem: 5,
    } , origin: POINT_OF_SALES) {
    CodigoEnvio,
        TextoTermos
        LinkTermos
        Status
        Mensagem
  }
}
```

Resposta

```json
{
    "data": {
        "Pharma_retrieveTextTermsOptIn": {
            "CodigoEnvio": "OptIn-Fv8Hfmy9SEq1RorpMIBJ",
            "TextoTermos": "<Política de Privacidade do programa>",
            "LinkTermos": "<Linke do Termo do programa>",
            "Status": "OK",
            "Mensagem": null
        }
    }
}
```

## Passo 2: InserirOptIn

A mutation confirma o aceite de um beneficiário. Deve ser obrigatoriamente usado após "RecuperarTextoTermosOptIn" - Pharma_retrieveTextTermsOptIn.

Exemplo da mutation

```graphql
mutation {
  Pharma_insertOptIn(input: {
        CodigoEnvioTermos: "<Codigo do Termo gerado>",
        Origem: 5
    
    }, origin: POINT_OF_SALES) {
    Status
        Mensagem
    }
  }
```

Resposta

```json
{
    "data": {
        "Pharma_insertOptIn": {
            "Status": "Sucesso/Erro",
            "Mensagem": "Mensagem de Sucesso/ Explicação do erro"
        }
    }
}
```

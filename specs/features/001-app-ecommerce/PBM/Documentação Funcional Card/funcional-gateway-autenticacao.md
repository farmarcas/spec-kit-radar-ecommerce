# Primeiros passos

**Fonte:** https://developer.funcionalmais.com/docs/gateway-credenciados/autenticacao/

---

## Endereços

Aqui temos os endereços dos nossos serviços.

- Produção: https://stores.funcionalmais.com/graphql
- Homologação: https://stores-uat.funcionalmais.com/graphql

Para conseguir as credencias será necessário entrar em contato com time de EDI.

## Autenticação

Para utilização das APIs é necessário enviar o token em todas as requisições garantindo assim a segurança e a identificação do usuário logado.

### Criando um token

> **Dica**
>
> O mesmo token pode ser utilizado em várias chamadas, inclusive para vários fluxo de venda.
> O Token tem expiração de até 24 horas, então esse primeiro passo pode ser feito uma ou duas vezes ao dia.
> Fazendo isso melhora a performance das transações.

Para criar um token será necessário chamar a `mutation` com o método `createToken` passando as credencias.

Aqui temos um exemplo de chamada para a criação de um token

```graphql
mutation {
    createToken(login: "<usuario>", password: "<senha>") {
        token
    }
}
```

Resposta

```json
{
  "data": {
    "createToken": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    }
  }
}
```

### Utilizando o token

Para a utilização do token é necessário enviar no `header` requisição ***http***. O token pode ser utilizado em várias chamadas até a sua expiração.

Exemplo:

> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

### Expiração de um token

O token tem uma validade padrão de 24 horas. Caso seja enviado um token expirado será retornado um erro na chamada da API.

### Horário de Funcionamento do serviço de Homologação

O serviço em ambiente de homologação está disponível de Segunda à Sabado das 09hs às 23hs.

# Fluxo de cadastro

**Fonte:** https://developer.funcionalmais.com/docs/gateway-credenciados/cadastro

---

O Fluxo de cadastro é utilizado para inscrever uma pessoa no programa.

### Passo 1: Criação do token

Para realizar o cadastro é necessário enviar o token nas transações.

[Acesse aqui para ver o passo a passo de criação do token](/docs/gateway-credenciados/autenticacao#autentica%C3%A7%C3%A3o)

### Passo 2: Avaliar elegibilidade

A partir de um CPF e EAN, avalia se o produto pertence à algum programa, e se o CPF precisa ser cadastrado no programa ou no produto específico. Caso o CPF não esteja no programa, agregadamente é retornada a lista de quais campos necessários para cadastro no programa. Agregadamente também é retornada a lista de pacientes (caso existam) atrelados a aquele CPF.

O campo `requiresBeneficiaryRegistration` indica se o CPF precisa de cadastro. Case seja `true` significa que o CPF ainda não está cadastrado no programa, caso seja `false` ele já está cadastrado e não precisa registrar.

> **Dica**
> Será necessário enviar o codigo do programa na inscrição do CPF, por isso guarde o resultado do `eligibilityAssessment.programCode` para o cadastro do CPF no futuro.

API: [Query: Pharma_assessEligibility](/api-ref/index.html#operation-pharma_assesseligibility-Queries)

Exemplo da query

```graphql
query {
  Pharma_assessEligibility(
    # Origem da solicitação
    origin: POINT_OF_SALES
    # CNPJ da farmácia
    storeCode: "0000000000010"
    # EAN do produto do programa da indústria
    productCode: "<EAN>"
    # CPF do consumidor
    customerCode: "<CPF da pessoa>"
  ) {
    # Resultado da validação
    validationResult {
      status
      message
      errors {
        message
      }
    }
    # Avaliação da eligibilidade
    eligibilityAssessment {
      # Código do programa
      programCode
      # Produto pertence a um programa da industria?
      belongsToIndustryProgram
      # Nome do programa
      programDescription
      # Nome do produto
      productDescription
    }
    # Política cadastral
    registrationPolicy {
      # Permite pacientes dependentes do principal
      allowDependents
      # Número máximo de pacientes dependentes
      dependentsLimit
      # Requer cadastro do beneficiário?
      requiresBeneficiaryRegistration
      # Requer cadastro da receita médica?
      requiresMedicalPrescriptionRegistration
      # Requer ao menos uma forma de contato?
      requiresAtLeastOneContactMedium
      # Requer dados do profisasional que prescreveu a receita?
      requiresMedicalPrescriber
      # Verifica se o paciente está cadastrado no programa
      isRegistered
      # Indica se a origem pode registrar este produto
      originPermitedRegister
      # URL do site para registro do programa, se aplicável
      urlRegisterSite
      # Campos para cadastro do beneficiário
      beneficiaryFields {
        ...registrationPolicyFields
      }
      # Campos para cadastro do paciente dependente
      dependentFields {
        ...registrationPolicyFields
      }
      # Campos para cadastro da receita médica
      medicalPrescriptionFields {
        ...registrationPolicyFields
      }
      # Campos extras do programa
      extraFields {
        ...registrationPolicyFields
      }
      extraFormFields {
        ...registrationPolicyExtraFields
      } 
      # Origens permitidas
      allowedOrigins
    }
    # Dependentes atualmente cadastrados no programa
    # para o consumidor informado na chamada
    dependents {
      id
      name
      birth
      gender
      holder
    }
  }
}

fragment registrationPolicyFields on Pharma_RegistrationPolicyField {
  # Nome do campo
  field
  # Rótulo do campo
  label
  # Tipo - veja os tipos na documentação GraphQL
  type
  # Descrição da necessidade do campo
  description
  # Se é oculto, obrigatório ou opcional
  display
  # Entidade do nosso banco
  entity
  # Valor padrão quando não preenchido
  defaultValue
  # Opções quando for um campo do tipo SELECT, RADIO, etc.
  options {
    # Rótulo
    text
    # Valor
    value
  }
}

fragment registrationPolicyExtraFields on Pharma_RegistrationPolicyExtraField {
  # Código da questão. Será utilizado para idenficiar a questão respondida no envio do cadastro
  QuestionCode
  # Código da questão relacionada, se houver - questão pai
  ParentQuestionCode
  # Código do programa
  ProgramCode
  # Nome do produto - família
  ProductName
  # Texto de exibição - label
  DisplayTitle
  # Flag que indica se a questão é de múltipla escolha
  MultipleChoice
  # Flag que indica se o preenchimento da questão é obrigatória
  Mandatory
  # Número indicador da ordem de exibição na tela
  DisplayOrder
  # Descrição da dica explicativa para preenchimento da questão 
  QuestionHint
  # Tipo de controle      
  #      checkboxlist - Campo tipo flag ou multiseleção
  #      radiobuttonlist - Campo do tipo radio button para seleção de apenas um valor
  #      dropdownlist - Campos do tipo lista
  #      textbox - Campo para digitação de texto livre       
  ControlType
  # Tipo da questão - 1 formulário do paciente e 2 questões relacionadas ao medicamento
  QuestionTypeFlag
  # Lista das respostas para a questão
  Answers {
    AnswerCode
    # Text de exibição - label
    DisplayTitle
    # Flag que indica se permite que o usuário digite a resposta
    AllowsTypedValue
    # Tamanho máximo da resposta, quando permitido a digitação
    MaxTypedValueSize
    # Valor digitado, quando permitido
    TypedValue
    # Número indicador da ordem de exibição na tela
    DisplayOrder
    # Questão relacionada. É utilizado quando uma resposta requer que novas questões sejam respondidas
    RelatedQuestions {
      # Código da questão. Será utilizado para idenficiar a questão respondida no envio do cadastro
      QuestionCode
      # Código da questão relacionada, se houver - questão pai
      ParentQuestionCode
      # Código do programa
      ProgramCode
      # Nome do produto - família
      ProductName
      # Texto de exibição - label
      DisplayTitle
      # Flag que indica se a questão é de múltipla escolha
      MultipleChoice
      # Flag que indica se o preenchimento da questão é obrigatória
      Mandatory
      # Número indicador da ordem de exibição na tela
      DisplayOrder
      # Descrição da dica explicativa para preenchimento da questão 
      QuestionHint
      # Tipo de controle      
      #      checkboxlist - Campo tipo flag ou multiseleção
      #      radiobuttonlist - Campo do tipo radio button para seleção de apenas um valor
      #      dropdownlist - Campos do tipo lista
      #      textbox - Campo para digitação de texto livre       
      ControlType
      # Tipo da questão - 1 formulário do paciente e 2 questões relacionadas ao medicamento
      QuestionTypeFlag
      # Lista das respostas para a questão
      Answers {
        AnswerCode
        # Text de exibição - label
        DisplayTitle
        # Flag que indica se permite que o usuário digite a resposta
        AllowsTypedValue
        # Tamanho máximo da resposta, quando permitido a digitação
        MaxTypedValueSize
        # Valor digitado, quando permitido
        TypedValue
        # Número indicador da ordem de exibição na tela
        DisplayOrder                
      }
    }
  }
}
```

Resposta

```json
{
  "data": {
    "Pharma_assessEligibility": {
      "validationResult": {
        "status": "SUCCESS",
        "message": null,
        "errors": []
      },
      "eligibilityAssessment": {
        "programCode": "100",
        "belongsToIndustryProgram": true,
        "programDescription": "PROGRAMA XXXXXXXXXXXXX",
        "productDescription": "XXXXXXX"
      },
      "registrationPolicy": {
        "allowDependents": true,
        "dependentsLimit": 99,
        "requiresBeneficiaryRegistration": true,
        "requiresMedicalPrescriptionRegistration": true,
        "requiresAtLeastOneContactMedium": false,
        "requiresMedicalPrescriber": false,
        "isRegistered": false,
        "originPermitedRegister": true,
        "urlRegisterSite": "www.sitecadastro.com.br",
        "beneficiaryFields": [
          {
            "field": "Nome",
            "label": "Nome Completo",
            "type": "STRING",
            "description": null,
            "display": "REQUIRED",
            "entity": "BENEFICIARIO",
            "defaultValue": null,
            "options": []
          },
          {
            "field": "Nascimento",
            "label": "Data de Nascimento",
            "type": "DATETIME",
            "description": null,
            "display": "REQUIRED",
            "entity": "BENEFICIARIO",
            "defaultValue": null,
            "options": []
          },
          {
            "field": "Sexo",
            "label": "Sexo",
            "type": "SELECT",
            "description": null,
            "display": "OPTIONAL",
            "entity": "BENEFICIARIO",
            "defaultValue": null,
            "options": [
              {
                "text": "Feminino",
                "value": "F"
              },
              {
                "text": "Masculino",
                "value": "M"
              }
            ]
          },
          {
            "field": "Numero",
            "label": "Número",
            "type": "INTEGER",
            "description": null,
            "display": "OPTIONAL",
            "entity": "BENEFICIARIO",
            "defaultValue": null,
            "options": []
          },
          {
            "field": "Complemento",
            "label": "Complemento",
            "type": "STRING",
            "description": null,
            "display": "OPTIONAL",
            "entity": "BENEFICIARIO",
            "defaultValue": null,
            "options": []
          },
          {
            "field": "UF",
            "label": "UF",
            "type": "SELECT",
            "description": null,
            "display": "OPTIONAL",
            "entity": "BENEFICIARIO",
            "defaultValue": null,
            "options": [
              {
                "text": "Acre",
                "value": "AC"
              },
              {
                "text": "Alagoas",
                "value": "AL"
              },
              {
                "text": "Amazonas",
                "value": "AM"
              }
            ]
          },
          {
            "field": "PermiteContatoEmail",
            "label": "Contato posterior E-mail?",
            "type": "BOOLEAN",
            "description": null,
            "display": "OPTIONAL",
            "entity": "BENEFICIARIO",
            "defaultValue": "true",
            "options": []
          }
        ],
        "dependentFields": [
          {
            "field": "Nome",
            "label": "Nome Completo",
            "type": "STRING",
            "description": null,
            "display": "REQUIRED",
            "entity": "PACIENTE",
            "defaultValue": null,
            "options": []
          }
        ],
        "medicalPrescriptionFields": [
          {
            "field": "TipoConselho",
            "label": "Tipo de conselho",
            "type": "SELECT",
            "description": null,
            "display": "REQUIRED",
            "entity": "PRODUTO",
            "defaultValue": null,
            "options": [
              {
                "text": "CRM",
                "value": "0"
              },
              {
                "text": "CRO",
                "value": "1"
              }
            ]
          },
          {
            "field": "UF",
            "label": "UF",
            "type": "SELECT",
            "description": null,
            "display": "REQUIRED",
            "entity": "PRODUTO",
            "defaultValue": null,
            "options": [
              {
                "text": "Acre",
                "value": "AC"
              },
              {
                "text": "Alagoas",
                "value": "AL"
              },
              {
                "text": "Amazonas",
                "value": "AM"
              },
            ]
          },
          {
            "field": "NumeroRegistroConselho",
            "label": "Número de Registro",
            "type": "INTEGER",
            "description": null,
            "display": "REQUIRED",
            "entity": "PRODUTO",
            "defaultValue": null,
            "options": []
          },
          {
            "field": "CodigoPatologia",
            "label": "Patologia",
            "type": "SELECT",
            "description": null,
            "display": "OPTIONAL",
            "entity": "PRODUTO",
            "defaultValue": null,
            "options": [
              {
                "text": "HPB",
                "value": "10"
              },
              {
                "text": "OSTEOPOROSE",
                "value": "6"
              },
              {
                "text": "ASMA",
                "value": "8"
              },
              {
                "text": "DPOC",
                "value": "9"
              }
            ]
          }
        ],
        "extraFields": [],
        "extraFormFields": [
          {
            "QuestionCode": 99,
            "ParentQuestionCode": null,
            "ProgramCode": 126,
            "ProductName": "",
            "DisplayTitle": "Responsável Cadastro",
            "MultipleChoice": false,
            "Mandatory": true,
            "DisplayOrder": 1,
            "QuestionHint": "",
            "ControlType": "dropdownlist",
            "QuestionTypeFlag": 1,
            "Answers": [
              {
                "AnswerCode": 960,
                "DisplayTitle": "Cuidador",
                "AllowsTypedValue": false,
                "MaxTypedValueSize": 0,
                "TypedValue": null,
                "DisplayOrder": "1",
                "RelatedQuestions": [
                  {
                    "QuestionCode": 103,
                    "ParentQuestionCode": 99,
                    "ProgramCode": 126,
                    "ProductName": null,
                    "DisplayTitle": "Confirma que dados acima são do paciente?",
                    "MultipleChoice": false,
                    "Mandatory": false,
                    "DisplayOrder": 1,
                    "QuestionHint": null,
                    "ControlType": "dropdownlist",
                    "QuestionTypeFlag": 1,
                    "Answers": [
                      {
                        "AnswerCode": 963,
                        "DisplayTitle": "Sim",
                        "AllowsTypedValue": false,
                        "MaxTypedValueSize": 0,
                        "TypedValue": null,
                        "DisplayOrder": "1"
                      },
                      {
                        "AnswerCode": 964,
                        "DisplayTitle": "Não",
                        "AllowsTypedValue": false,
                        "MaxTypedValueSize": 0,
                        "TypedValue": null,
                        "DisplayOrder": "2"
                      }
                    ]
                  },
                  {
                    "QuestionCode": 104,
                    "ParentQuestionCode": 99,
                    "ProgramCode": 126,
                    "ProductName": null,
                    "DisplayTitle": "Nome",
                    "MultipleChoice": false,
                    "Mandatory": false,
                    "DisplayOrder": 1,
                    "QuestionHint": null,
                    "ControlType": "textbox",
                    "QuestionTypeFlag": 1,
                    "Answers": [
                      {
                        "AnswerCode": 965,
                        "DisplayTitle": "Nome",
                        "AllowsTypedValue": true,
                        "MaxTypedValueSize": 50,
                        "TypedValue": null,
                        "DisplayOrder": "1"
                      }
                    ]
                  },
                  {
                    "QuestionCode": 105,
                    "ParentQuestionCode": 99,
                    "ProgramCode": 126,
                    "ProductName": null,
                    "DisplayTitle": "Celular",
                    "MultipleChoice": false,
                    "Mandatory": false,
                    "DisplayOrder": 2,
                    "QuestionHint": null,
                    "ControlType": "textbox",
                    "QuestionTypeFlag": 1,
                    "Answers": [
                      {
                        "AnswerCode": 966,
                        "DisplayTitle": "Celular",
                        "AllowsTypedValue": true,
                        "MaxTypedValueSize": 13,
                        "TypedValue": null,
                        "DisplayOrder": "2"
                      }
                    ]
                  }
                ]
              },
              {
                "AnswerCode": 961,
                "DisplayTitle": "Paciente",
                "AllowsTypedValue": false,
                "MaxTypedValueSize": 0,
                "TypedValue": null,
                "DisplayOrder": "2",
                "RelatedQuestions": []
              },
              {
                "AnswerCode": 962,
                "DisplayTitle": "Responsável Legal",
                "AllowsTypedValue": false,
                "MaxTypedValueSize": 0,
                "TypedValue": null,
                "DisplayOrder": "3",
                "RelatedQuestions": [
                  {
                    "QuestionCode": 103,
                    "ParentQuestionCode": 99,
                    "ProgramCode": 126,
                    "ProductName": null,
                    "DisplayTitle": "Confirma que dados acima são do paciente?",
                    "MultipleChoice": false,
                    "Mandatory": false,
                    "DisplayOrder": 1,
                    "QuestionHint": null,
                    "ControlType": "dropdownlist",
                    "QuestionTypeFlag": 1,
                    "Answers": [
                      {
                        "AnswerCode": 963,
                        "DisplayTitle": "Sim",
                        "AllowsTypedValue": false,
                        "MaxTypedValueSize": 0,
                        "TypedValue": null,
                        "DisplayOrder": "1"
                      },
                      {
                        "AnswerCode": 964,
                        "DisplayTitle": "Não",
                        "AllowsTypedValue": false,
                        "MaxTypedValueSize": 0,
                        "TypedValue": null,
                        "DisplayOrder": "2"
                      }
                    ]
                  },
                  {
                    "QuestionCode": 104,
                    "ParentQuestionCode": 99,
                    "ProgramCode": 126,
                    "ProductName": null,
                    "DisplayTitle": "Nome",
                    "MultipleChoice": false,
                    "Mandatory": false,
                    "DisplayOrder": 1,
                    "QuestionHint": null,
                    "ControlType": "textbox",
                    "QuestionTypeFlag": 1,
                    "Answers": [
                      {
                        "AnswerCode": 965,
                        "DisplayTitle": "Nome",
                        "AllowsTypedValue": true,
                        "MaxTypedValueSize": 50,
                        "TypedValue": null,
                        "DisplayOrder": "1"
                      }
                    ]
                  },
                  {
                    "QuestionCode": 105,
                    "ParentQuestionCode": 99,
                    "ProgramCode": 126,
                    "ProductName": null,
                    "DisplayTitle": "Celular",
                    "MultipleChoice": false,
                    "Mandatory": false,
                    "DisplayOrder": 2,
                    "QuestionHint": null,
                    "ControlType": "textbox",
                    "QuestionTypeFlag": 1,
                    "Answers": [
                      {
                        "AnswerCode": 966,
                        "DisplayTitle": "Celular",
                        "AllowsTypedValue": true,
                        "MaxTypedValueSize": 13,
                        "TypedValue": null,
                        "DisplayOrder": "2"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "QuestionCode": 84,
            "ParentQuestionCode": null,
            "ProgramCode": 126,
            "ProductName": "NOME DO PRODUTO",
            "DisplayTitle": "Indicação",
            "MultipleChoice": false,
            "Mandatory": true,
            "DisplayOrder": 1,
            "QuestionHint": "",
            "ControlType": "radiobuttonlist",
            "QuestionTypeFlag": 2,
            "Answers": [
              {
                "AnswerCode": 942,
                "DisplayTitle": "Diabetes - Tipo 2",
                "AllowsTypedValue": false,
                "MaxTypedValueSize": 0,
                "TypedValue": null,
                "DisplayOrder": "1",
                "RelatedQuestions": null
              },
              {
                "AnswerCode": 943,
                "DisplayTitle": "Insuficiência Cardíaca",
                "AllowsTypedValue": false,
                "MaxTypedValueSize": 0,
                "TypedValue": null,
                "DisplayOrder": "2",
                "RelatedQuestions": null
              }
            ]
          }
        ],
        "allowedOrigins": [
          "POINT_OF_SALES",
          "INDUSTRY_PROGRAM_WEBSITE",
          "CALL_CENTER",
          "PARTNERS_ECOMMERCE",
          "MOBILE_APP",
          "CCUCO",
          "BCARE"
        ]
      },
      "dependents": []
    }
  }
}
```

> **Dica**
> Importante se atentar a response e validar todos os campos que devem ser exibidos de acordo a Politica Cadastral de cada Programa.
> Exemplo: o paramêtro retornado "display"- Define a Regra para exibição
>
> - HIDDEN - Não é necessária a exibição
> - OPTIONAL - Campo deve ser exibido como opcional
> - REQUIRED - Campo deve ser exibido como obrigatório
>
> Devemos respeitar as regras e suas particularidades de cada programa para criação do Forumulário de cadastro.

### Passo 3: Incrição do beneficiário

O método Pharma_signUpProgramBeneficiary é um agregado (para atender a necessidade de fazer o cadastro em um único passo) de cadastro no programa e produto, pode haver cadastro de paciente se requisitado pelo programa.

Seguir de acordo o resultado do `Pharma_assessEligibility`, que é a primeira perna do cadastro.

API: [Mutation: Pharma_signUpProgramBeneficiary](/api-ref/index.html#operation-pharma_signupprogrambeneficiary-Mutations)

Exemplo de mutation

```graphql
mutation {
  Pharma_signUpProgramBeneficiary(
    input: {
      # Código do programa
      programCode: "1"
      # Origem da solicitação
      origin: POINT_OF_SALES
      # CNPJ da farmácia
      storeCode: "00000000000010"
      # CPF do consumidor
      customerCode: "00000000000"
      # EAN do produto do programa da indústria
      productCode: "7897572004405"
      # Campos do cadastro de beneficiários
      # (conforme Pharma_assessEligibility)
      beneficiaryFields: [
        { text: "Nome", value: "Fulano Beltrano Ciclano"
        }
          { text: "Nascimento", value: "1989-03-07 12:00:00"
        }
          { text: "Sexo", value: "M"
        }
          { text: "Email", value: "r@r.com"
        }
          { text: "Telefone", value: "12398472"
        }
          { text: "TelefoneCelular", value: "12398472"
        }
          { text: "CEP", value: "20261905"
        }
          { text: "Endereco", value: "Rua Jatoba"
        }
          { text: "Numero", value: "02"
        }
          { text: "Bairro", value: "Leblon"
        }
          { text: "Cidade", value: "Rio de Janeiro"
        }
          { text: "UF", value: "PR"
        }
      ],
      # Campos do cadastro de receita médica
      # (conforme Pharma_assessEligibility)
      medicalPrescriptionFields: [
        { text: "NumeroRegistroConselho", value: "6055"
        }
          { text: "UF", value: "SC"
        }
          { text: "TipoConselho", value: "0"
        }
      ],
      # Campos extras preenchidos
      # (conforme Pharma_assessEligibility)
      extraFormFields: [
        { QuestionCode: 99, AnswerCode: 960, QuestionTypeFlag: 1, TypedValue: "" }
        { QuestionCode: 103, AnswerCode: 963, QuestionTypeFlag: 1, TypedValue: "" }
        { QuestionCode: 104, AnswerCode: 965, QuestionTypeFlag: 1, TypedValue: "Nome digitado" }
        { QuestionCode: 105, AnswerCode: 966, QuestionTypeFlag: 1, TypedValue: "011123456789" }
        { QuestionCode: 84, AnswerCode: 942, QuestionTypeFlag: 2, TypedValue: "" }
      ]
    }
  ) {
    # Status da solicitação
    status
    message
    errors {
      message
    }
  }
}
```

Resposta

```json
{
  "data": {
    "Pharma_signUpProgramBeneficiary": {
      "status": "SUCCESS",
      "message": "Beneficiario cadastrado com sucesso",
      "errors": []
    }
  }
}
```

### Passo 4: Inscrição do dependente (Opcional) ou cadastro como paciente

O método Pharma_signUpProgramBeneficiaryDependent é um agregado (para atender a necessidade de fazer o cadastro em um único passo) de cadastro de paciente e cadastro de produto, deve ser utilizado apenas quando o retorno informa:

- O beneficiário já está cadastrado no programa
- Requisitado cadastro do produto
- Caso o programa utilize pacientes

Seguir de acordo o resultado do `Pharma_assessEligibility`, que é a primeira perna do cadastro.

API: [Mutation: Pharma_signUpProgramBeneficiaryDependent](/api-ref/index.html#operation-pharma_signupprogrambeneficiarydependent-Mutations)

Exemplo de mutation

```graphql
mutation {
  Pharma_signUpProgramBeneficiaryDependent(
    input: {
      # CNPJ da farmácia
      storeCode: "00000000000010"
      # Codigo do programa
      programCode: "8"
      # Origem
      origin: POINT_OF_SALES
      # CPF do consumidor (beneficiário titular)
      customerCode: "29489536008"
      # EAN do produto do programa da indústria
      productCode: "7897337707435"
      # Campos do cadastro de dependente
      # (conforme Pharma_assessEligibility)
      dependentFields: [
      { text: "Nome", value: "Beltrano Ciclano Junior"
      }
        { text: "Nascimento", value: "1999-03-07 12:00:00"
      }
        { text: "Sexo", value: "M"
      }
        { text: "Email", value: "ree@r.com"
      }
        { text: "Telefone", value: "12398472"
      }
        { text: "TelefoneCelular", value: "12398472"
      }
        { text: "CEP", value: "20261905"
      }
        { text: "Endereco", value: "Rua Jatoba"
      }
        { text: "Numero", value: "02"
      }
        { text: "Bairro", value: "Leblon"
      }
        { text: "Cidade", value: "Rio de Janeiro"
      }
        { text: "UF", value: "PR"
      }
    ]
      # Campos do cadastro de receita médica
      # (conforme Pharma_assessEligibility)
      medicalPrescriptionFields: [
      { text: "NumeroRegistroConselho", value: "6055"
      }
        { text: "UF", value: "SC"
      }
        { text: "TipoConselho", value: "0"
      }
    ]
  }
  ) {
    # Status da solicitação
    status
    message
    errors {
      message
    }
  }
}
```

Resposta

```json
{
  "data": {
    "Pharma_signUpProgramBeneficiaryDependent": {
      "status": "SUCCESS",
      "message": "Beneficiario cadastrado com sucesso",
      "errors": []
    }
  }
}
```

### Passo 5: Incluir produto ao um beneficiário

Inclui um produto no cadastro de um beneficiário, também poderá associar à um paciente (caso o programa exija os dados do paciente).

Seguir de acordo o resultado do `Pharma_assessEligibility`, que é a primeira perna do cadastro.

API: [Mutation: Pharma_addProgramBeneficiaryToProduct](/api-ref/index.html#operation-pharma_addprogrambeneficiarytoproduct-Mutations)

Exemplo de query

```graphql
mutation {
  Pharma_addProgramBeneficiaryToProduct(
    input: {
      # Origem
      origin: POINT_OF_SALES
      # Codigo do programa
      programCode: "8"
      # CNPJ da farmácia
      storeCode: "00000000000010"
      # CPF do consumidor
      # (beneficiário titular se for usar
      # o ID de um dependente no campo dependenteID)
      customerCode: "000000000000"
      # EAN do produto do programa da indústria
      productCode: "7896269900150"
      # ID de um paciente dependente do beneficiário
      # (titular). ID está na lista de dependentes na
      # query Pharma_assessEligibility)
      dependentID: null
      # Campos do cadastro de receita médica
      # (conforme Pharma_assessEligibility)
      medicalPrescriptionFields: [
        { text: "NumeroRegistroConselho", value: "6055"
        }
          { text: "UF", value: "SC"
        }
          { text: "TipoConselho", value: "0"
        }
      ],
      extraFormFields: [
        { QuestionCode: 96 , AnswerCode: 956, QuestionTypeFlag: 2, TypedValue: "" }
      ]
    }
  ) {
    status
    message
    errors {
      message
    }
  }
}
```

### Passo 6: Validar dados do prescriptor

Valida os dados do prescritor antes da inclusão nos demais métodos, apesar da validação ser efetuada internamente nos métodos, este método é disponibilizado para auxiliar às interfaces dos parceiros, com o intuito de deixar mais flexível e ágil.

API: [Query: Pharma_prescriber](/api-ref/index.html#operation-pharma_prescriber-Queries)

Exemplo de query

```graphql
query {
  Pharma_prescriber(
    data: { council: CRM, stateAbbr: "SP", registerNumber: 999999
  }
  ) {
    status
    message
    errors {
      message
    }
  }
}
```

Exemplo de resposta

```json
{
  "data": {
    "Pharma_prescriber": {
      "status": "SUCCESS",
      "message": "",
      "errors": []
    }
  }
}
```

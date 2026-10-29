# Funcional — Análise técnica (ecomm-api-core-dotnet · anexo de implementação)

**Fonte:** `Funcional — análise técnica.pdf` (Farmarcas, 28 out 2026) — convertido para Markdown em 29/10/2026.
**Escopo:** gateway de credenciados da Funcional · origem `PARTNERS_ECOMMERCE` · só api-core.
**Documento par:** [funcional-material-de-negocio.md](funcional-material-de-negocio.md)
**APIs da Funcional (documentação do fornecedor):** [`../Documentação Funcional Card/`](../Documentação%20Funcional%20Card/)

> **[Esclarecimento PO, 29/10/2026]** Um produto nunca pertence aos dois programas. Os trechos abaixo sobre "EAN nos dois providers" descrevem uma **proteção defensiva** do código (o EAN duplicado sai da vitrine e da busca, com log), não um cenário de negócio esperado.

> Nota da conversão: o PDF é uma apresentação em slides com diagramas. Os diagramas foram transcritos como tabelas e listas numeradas; nomes de classes, arquivos, colunas e operações foram mantidos exatamente como no original.

---

## Onde a Funcional encaixa

O contrato público permanece. A core lê `load_product.provider` e delega para o client certo.

## 01 · Contrato e o que muda

**Cabe (contrato que já existe):**
- GraphQL de vitrine, consulta, adesão, efetiva, nota e cancelamento.
- Busca no Typesense, campo `PbmDiscountMin`. Índice e tópico não mudam.
- `SchemaFormDocument` plano, sem campo novo.
- `transaction_code` e `attendance_hash` na sessão do pedido.

**Não copiar — onde o código de hoje é Interplayers:**
- A carga apaga a tabela inteira e exige `tableId`.
- Um único `IPbmProviderClient` no DI.
- A vitrine assume Interplayers quando o `provider` não vem.
- A efetiva recusa Funcional.
- A nota manda só EAN. O preço autorizado não volta no input.
- Cancelar antes da nota chama `/anula`. A janela de 7 dias é única.

## 02 · Quem fala com quem

| Etapa | Quem | Como |
|---|---|---|
| Vitrine | Orchestrator | `storefrontPbmProducts` sem `provider` |
| Consulta | BFF carrinho | um `centralNumber` para o lote |
| Efetiva | Pedido | uma sessão, preço de loja |

Todos passam pelo **router na api-core**, que usa `load_product.provider` para escolher o client: **Interplayers** (client atual, já existe) ou **Funcional** (client novo).

### Registro dos clients

Hoje a api-core sobe com um único client de PBM, o da Interplayers. Registrar o da Funcional nesse mesmo lugar faz o da Interplayers deixar de valer. O arranque passa a ter os dois. Cada pedido pede o client do programa do produto. A efetiva já escolhe o programa antes da chamada e não escolhe de novo dentro do client.

### Host

| Ambiente | URL | Observações |
|---|---|---|
| Homologação | `https://stores-uat.funcionalmais.com/graphql` | segunda a sábado, 09h–23h |
| Produção | `https://stores.funcionalmais.com/graphql` | — |

`createToken` com cache até perto de 24 horas. Origem fixa `PARTNERS_ECOMMERCE`.
Options `Pbm:Funcional`: URL, login, timeout e `OptInOrigem`.

### Fluxo da core

A api-core **não publica a API da Funcional**. Quem já chama a core continua na mesma operação, em `POST /pbm/graphql`. A core chama a Funcional, em outro `POST /graphql`, só quando o produto é dela. `createToken` roda antes, se o cache passou de 24h ou o token foi recusado.

| Quem | Operação na core | O que a core faz se o produto é Funcional |
|---|---|---|
| Cron da api-core | comando novo de carga | query `Pharma_discountPrograms` |
| `ecomm-api-orchestrator-product-dotnet` | query `storefrontPbmProducts` | não chama a Funcional. Lê `load_product` |
| `ecomm-bff-mobile-search-dotnet` e `ecomm-bff-mobile-emphasis-dotnet` | nenhuma. Leem o Typesense | a core publica o mesmo evento, campo `PbmDiscountMin`. Nenhuma chamada à Funcional |
| `ecomm-bff-mobile-cart-dotnet`, ao adicionar | query `consumerPbmConsultBatch` | query `Pharma_checkPricesAndRules` e query `Pharma_verifyOptIn`. Interplayers segue na consulta desconto |
| o mesmo BFF, formulário | query `consumerPbmAdhesionForm` | query `Pharma_assessEligibility` e, se preciso, query `Pharma_retrieveTextTermsOptIn` |
| o mesmo BFF, envio | mutation `submitConsumerPbmAdhesion` | mutation `Pharma_insertOptIn` e uma mutation de inscrição |
| `ecomm-api-order-dotnet`, reserva | mutation `fulfillPbmTransaction` | query `Pharma_verifyOptIn` e mutation `Sales_preAuthorizeSale` |
| o mesmo serviço, nota | mutation `confirmOrderPbmInvoice` | mutation `Sales_confirmPreAuthorizedSale`. Chave tardia: `Sales_updateInvoiceCode` |
| o mesmo serviço, depois da nota | mutation `cancelOrderPbmAuthorization` | mutation `Sales_cancel`. Antes da nota, sem chamada |

### Carga

Referência: *Fluxo de venda — Processos diários de carga*.

1. Cron → api-core. Comando novo, ao lado de `PbmLoadTablesCommand`.
2. api-core → farmácias. `Pbm_Enabled`.
3. api-core → Funcional. `Pharma_discountPrograms` por CNPJ, `origin: PARTNERS_ECOMMERCE`.
4. api-core → `load_product`. Troca só `provider = Funcional` daquele CNPJ. Vazio ou HTTP ruim não apaga.
5. api-core → busca. EAN cujo desconto mudou. EAN também na Interplayers não publica.

O job da Interplayers passa a copiar, apagar e publicar só as linhas dele antes da primeira carga Funcional em produção.

### Vitrine

A Funcional não tem endpoint de vitrine. O desconto vem da carga.

1. Orchestrator → api-core. `storefrontPbmProducts` sem `provider`.
2. api-core → `load_product`. Lê os dois providers. EAN nos dois sai antes do selector.
3. api-core → orchestrator. Um desconto por EAN. Nenhuma chamada à Funcional.

### Busca

A Funcional não tem endpoint de busca. O desconto vem da carga, no Typesense que já existe.

1. api-core → Kafka. O mesmo evento de hoje, tópico `Pbm:Typesense`, campo `PbmDiscountMin`.
2. Typesense. O índice não ganha campo. EAN nos dois programas não publica desconto.
3. Busca e destaque. `ecomm-bff-mobile-search-dotnet` e `ecomm-bff-mobile-emphasis-dotnet` leem o número como percentual. Os dois não mudam.

### Consulta

Referência: *Fluxo de venda — Passo 2* e *OptIn — VerificarOptIn*.

1. BFF → api-core. `consumerPbmConsultBatch`.
2. api-core → `load_product`. Provider do EAN. Sem linha, não chama a Funcional.
3. api-core → Funcional. `Pharma_checkPricesAndRules`. Preço sai de `salePrice`.
4. api-core → Funcional. `Pharma_verifyOptIn`.
5. api-core → Funcional. `Pharma_assessEligibility`, se a pessoa precisa de cadastro.
6. api-core → BFF. Preço autorizado, formulário, página, ou a mensagem que bloqueia o item.

### Adesão

Referência: *Fluxo de cadastro e OptIn*.

1. BFF → api-core. `consumerPbmAdhesionForm`.
2. api-core → Funcional. `Pharma_assessEligibility`. `programCode` é o da avaliação.
3. api-core → Funcional. `Pharma_retrieveTextTermsOptIn`, se o aceite é obrigatório. `CodigoEnvio` vai em `lgpd_term_code`.
4. BFF → api-core. Submit do formulário.
5. api-core → Funcional. `Pharma_insertOptIn` com esse código. Sem código, o submit falha.
6. api-core → Funcional. `signUp`, `addProduct` ou `dependent`.

### Reserva, nota e cancelamento

Referência: *Fluxo de venda — pré-autorização, confirmação, nota e cancelamento*.

1. Pedido → api-core. Uma efetiva, preço da loja.
2. api-core → Funcional. `Pharma_verifyOptIn` e `Sales_preAuthorizeSale`.
3. api-core → sessão. `transaction_code`, `attendance_hash`, `authorized_lines`.
4. Pedido → api-core → Funcional. Uma `Sales_confirmPreAuthorizedSale`. O id da resposta grava em `saleAuthorizationId`.
5. api-core → Funcional. Chave já presente vai na confirmação. Chave tardia chama `Sales_updateInvoiceCode`.
6. Cancelar antes da nota: sem HTTP. Depois da nota: `Sales_cancel` com `saleAuthorizationId`.

### O que muda na core

| Ponto | Onde | Mudança |
|---|---|---|
| Client | `PbmModuleSetup.cs` | factory `Get(PbmProvider)` e o `HttpClient` da Funcional |
| Carga Funcional | comando novo | `Pharma_discountPrograms` e troca por provider + CNPJ |
| Carga Interplayers | `LoadProductWriter.cs`, `PbmTypesenseUpdatePlanner.cs` | backup, delete e Plan só Interplayers |
| Vitrine | `StorefrontPbmProductsHandler.cs`, `LoadProductReader.cs` | deixa de assumir Interplayers. EAN nos dois sai antes do selector |
| Consulta | `UseCases/ConsultConsumer/` | router, preço, aceite e elegibilidade |
| Adesão | handlers de adesão | formulário, `insertOptIn` e uma das três inscrições |
| Efetiva | `FulfillPbmTransactionHandler.cs` | reserva, `authorized_lines`, indústria 1 |
| Nota | `ConfirmOrderPbmInvoiceHandler.cs` | uma confirmação. Chave tardia em `Sales_updateInvoiceCode` |
| Cancelamento | `CancelOrderPbmAuthorizationHandler.cs` | antes da nota, sem HTTP. Depois, `Sales_cancel` |
| Sessão | `OrderPbm.cs` | migration de `authorized_lines` |

## 03 · Sessão

| Dado Funcional | Onde fica | Uso |
|---|---|---|
| `authorizationID` da reserva | `transaction_code` `varchar(64)` | Entrada da confirmação e `authorizationID` de `Sales_updateInvoiceCode`. Maior que 64: a efetiva falha e a sessão `Authorizing` é apagada. Não truncar. |
| `authorizationID` da confirmação | `saleAuthorizationId` em `authorized_lines` | `Sales_cancel` manda esse valor em `authorizationID`, sem `preAuthorizationID`. |
| `createdAt` ISO | `attendance_hash` `varchar(64)` | `preAuthorizationDate`. Sem essa data, a confirmação só acha reserva do mesmo dia. Maior que 64: a efetiva falha. Não truncar. |
| `unitPrice`, `quantidade`, EAN | `authorized_lines` JSON, fora do GraphQL | `ConfirmProviderAsync` hoje monta produto só com EAN. Funcional sem essa coluna falha a confirmação. Interplayers continua só com EAN. |
| uma linha | `industry_company_code = 1` | `ReplaceIndustryGroupsAsync` aplica `NormalizeDigits` e a coluna tem 20. Letra vira vazio e a linha não grava. Sem linha, `SkipConfirmedWithoutIndustry` não cancela. O id da Funcional não entra aqui. |

**Reserva → Confirmação → Cancelamento**

| Reserva | Confirmação | Cancelamento |
|---|---|---|
| `transaction_code` = `authorizationID` de `Sales_preAuthorizeSale`. Entra na confirmação e na atualização da chave. | `saleAuthorizationId` = `authorizationID` que `Sales_confirmPreAuthorizedSale` devolve. Fica em `authorized_lines`. | `authorizationID` = o id da confirmação. `Sales_cancel` não manda `preAuthorizationID`. |

**Antes da nota:** sem HTTP. `Sales_cancel` desfaz venda confirmada. A reserva local some e a remota segue confirmável por até 30 dias. Uma reserva mais nova só invalida a anterior quando ela mesma é confirmada.

**Depois da nota:** uma chamada. Status 103 é sucesso. Fora do mesmo dia, `createdAt` sai de `ConfirmedAt`.

Entrada da pré-autorização: líquido de loja (`NetPriceCents` em reais). `maxConsumerPrice` não é enviado: não há coluna de PMC. `suggested_price_value` permanece nulo.

## 04 · Carga e o percentual

`Pharma_discountPrograms` por CNPJ, origem `PARTNERS_ECOMMERCE`. Cada EAN de `rules.product.eans` vira uma linha. `state` e `city` nulos: o escopo é o CNPJ da loja.

**Percentual:** Funcional `saleBaseDiscountPercentage` = 10% → coluna `discount_min` = 1000 (× 100) → `PbmTypesenseUpdatePlanner` publica 24 a partir de `discount_min` = 2400 (`TryParseCentsAsReais`) → busca/Typesense exibe 10%. 10,5% grava 1050, meio para longe de zero. 10 cru publicaria 0,10. `suggested_price = N`. `suggested_price_value` nulo. `maximumConsumerPrice` não entra: é PMC. O evento, o tópico `Pbm:Typesense` e o campo `PbmDiscountMin` são os de hoje. A carga da Funcional reusa o planner. Busca e destaque não mudam.

| Origem | Coluna | Regra |
|---|---|---|
| — | `provider` | `Funcional` |
| `rules.product.eans[]` | `ean` | `NormalizeEan`: 13 dígitos, zero à esquerda. Vazio não entra. |
| `storeCode` | `cnpj` | só dígitos |
| `id` / `name` | `program_id` `varchar(16)` / `program_name` `varchar(128)` | sem nome, ou id maior que 16, ou nome maior que 128: a linha não entra e o log guarda o id. Não truncar. |
| `saleBaseDiscountPercentage` | `discount_min` | percentual × 100, inteiro |
| `requiresMedicalPrescription` | `requires_crm` | `true` quando a regra exige receita |
| `blocked` | — | regra não entra |
| `allowedOrigins` sem a origem de e-commerce | — | programa não entra |
| `rules[].description` | `informative_message` `varchar(512)` | maior que 512: a linha não entra. Não truncar. |

### Replace

`ReplaceAsync` copia a tabela inteira para `load_product_backup`, apaga tudo e exige `tableId`. A Funcional não chama esse método. Método novo: troca só `provider + cnpj`, sem backup. Lista vazia ou HTTP ruim não apaga. Os dois jobs não compartilham o backup.

O job da Interplayers passa a copiar, apagar e publicar só `provider = Interplayers`. Hoje o backup é a tabela inteira e `Plan` une a lista nova com esse backup. EAN que só está no backup sai com desconto vazio: a linha da Funcional fica na base e some da vitrine na carga da noite. O backup e as duas listas do planner ficam só com a Interplayers.

Comando novo, ao lado de `PbmLoadTablesCommand`. CNPJs `Pbm_Enabled`. Teto de paralelismo. Token em memória, sem log. `CancellationToken` em toda chamada. Falha de HTTP, token ou payload vazio sobe erro. EAN presente nos dois providers não publica desconto no Typesense.

**Arquivos:** `PbmModuleSetup.cs`, `LoadProductWriter.cs`, `PbmTypesenseUpdatePlanner.cs`, comando novo, client e mapper em `Pbm.Infrastructure`.
**Teste:** `dotnet test tests/Pbm/Units/Pbm.Units.csproj --filter FullyQualifiedName~FuncionalLoad`

| Job que já roda — Interplayers | Comando novo — Funcional |
|---|---|
| Backup, delete e Plan só com `provider = Interplayers`. EAN que também está na Funcional sai da busca com desconto vazio. | Troca `provider + CNPJ`. Sem backup compartilhado. Lista vazia ou HTTP ruim não apaga. |

O comando novo fica ao lado de `PbmLoadTablesCommand`. Falha de um não dispara o outro.

## 05 · Vitrine

`StorefrontPbmProductsHandler` deixa de assumir Interplayers. `FindStorefrontCandidatesAsync` filtra um provider. Ler os dois e juntar no `SelectBestPerEan` faz a linha de CNPJ da Funcional ganhar da linha nacional da Interplayers. EAN nos dois: sai antes do selector, com log, e não volta na query. O input GraphQL não ganha campo.

**Arquivos:** `StorefrontPbmProductsHandler.cs`, `LoadProductReader.cs`. **Teste:** `FullyQualifiedName~StorefrontFuncional`.

## 06 · Consulta

1. O BFF chama o lote. O provider de cada EAN sai de `load_product`.
2. EAN sem linha não chama a Funcional. Um provider segue o client daquele hub. Dois providers no mesmo lote falham antes do HTTP, com o erro que `PbmFulfillProviderResolver` já devolve.
3. Funcional: `Pharma_checkPricesAndRules`, primeira perna da venda. `unitPriceCents` sai de `salePrice` em centavos, meio para longe de zero. 52,99 vira 5299. `funcionalPrice` e PMC não viram preço autorizado.
4. `Pharma_verifyOptIn` aqui e de novo antes da reserva. `origin: PARTNERS_ECOMMERCE`. O número `Origem` sai de `Pbm:Funcional:OptInOrigem`. Config vazia falha a chamada. O 5 do exemplo deles não é default. Obrigatório e ainda não feito mostra o termo. Os dois em N liberam esta compra e devolvem a mensagem.
5. `centralNumber` não vai no request e não volta no resultado. `conditions[]` fica vazio. Imagem de receita, dose diária sem dado no contrato, ou `secondFactorAuthentication` diferente de `NONE`: o item não entra, com a mensagem.

| Obrigatório, não feito | Os dois em N | Já aceito |
|---|---|---|
| Mostra o termo. `OptInObrigatorio = S` e `OptInRealizado = N`. O desconto espera o aceite. | Esta compra segue. A mensagem volta para a pessoa. A próxima compra é que bloqueia. | Segue. `OptInRealizado = S`. `verifyOptIn` repete antes da reserva. |

`Pharma_verifyOptIn` não devolve o texto. O texto sai de `Pharma_retrieveTextTermsOptIn`.

### Quando a pessoa ainda não está no programa

Produto não aprovado e `Pharma_assessEligibility` com `requiresBeneficiaryRegistration`: `NATIVE_FORM`, ou `WEBVIEW` com `embedUrl = urlRegisterSite`. `originPermitedRegister` falso usa a mesma página, ou bloqueia se ela não existir. Pergunta-filha obrigatória com URL devolve webview. Sem URL, `canAddWithDiscount = false` e a mensagem do programa, sem `SchemaForm`.

**Arquivos:** `PbmModuleSetup.cs`, `IPbmProviderClient.cs`, `UseCases/ConsultConsumer/`. **Teste:** `FullyQualifiedName~FuncionalConsult`.

## 07 · Adesão

| Ainda não inscrito | Já inscrito | Paciente |
|---|---|---|
| `signUp` — `requiresBeneficiaryRegistration`. `programCode` é o da avaliação. | `addProduct` — `Pharma_addProgramBeneficiaryToProduct` quando só falta o produto. | `dependent` — `Pharma_signUpProgramBeneficiaryDependent` no mesmo formulário plano. |

**Termo na tela:** `retrieve` → `insert`. `CodigoEnvio` vai em `lgpd_term_code`. `insertOptIn` usa esse código. Sem ele o submit falha. O aceite na tela **não** chama `Pharma_sendOptInTerms`.

**Pergunta-filha → página ou bloqueio.** O exemplo deles manda a filha no `extraFormFields`. O formulário do app é plano.

O input já traz EAN, CNPJ e preços. O handler relê `load_product` e chama `Pharma_assessEligibility` de novo. `programCode` é `eligibilityAssessment.programCode`. `centralNumber` da resposta fica nulo. `SchemaFormDocument` não muda.

`requiresBeneficiaryRegistration` verdadeiro: `Pharma_signUpProgramBeneficiary`. Falso, e o produto ainda pede cadastro: `Pharma_addProgramBeneficiaryToProduct`. Paciente com o titular já inscrito: `Pharma_signUpProgramBeneficiaryDependent`. `HIDDEN` não aparece. `REQUIRED` e `OPTIONAL` seguem o `display`.

`urlRegisterSite` não monta formulário. `Pharma_retrieveTextTermsOptIn` devolve texto, link e `CodigoEnvio`. Esse código vai no campo oculto `lgpd_term_code`. O submit chama `Pharma_insertOptIn` com `CodigoEnvioTermos` e só então o cadastro. Sem o código, o submit falha.

Pergunta-filha (`extraFormFields.RelatedQuestions`) não vira campo aninhado. O exemplo de inscrição deles manda essa pergunta no envio. O formulário do app é plano, então ela segue a consulta: página, ou bloqueio.

**Arquivos:** `PbmAdhesionSchemaFormBuilder.cs` (ou builder Funcional no mesmo handler), `ConsumerPbmAdhesionFormHandler.cs`, `SubmitConsumerPbmAdhesionHandler.cs`. **Teste:** `FullyQualifiedName~FuncionalAdhesion`.

## 08 · Fechamento, nota e cancelamento

1. `Pharma_verifyOptIn` de novo. Uma `Sales_preAuthorizeSale`, `channel: PHARMA`. Sem retry. A reserva vale até 30 dias.
2. Entrada: líquido de loja em reais. Resposta: `transaction_code` = `authorizationID` da reserva, `attendance_hash` = `createdAt`, `authorized_lines` (45,10 → 4510).
3. Uma `order_pbm_industry` com código 1. Item recusado invalida a autorização inteira.
4. `Sales_confirmPreAuthorizedSale` uma vez, com a data da reserva. O `authorizationID` da resposta grava em `saleAuthorizationId`. Chave já presente vai em `invoiceCode`. Chave tardia chama `Sales_updateInvoiceCode` com o id da reserva e `saleDate`. Falha da chave não volta a sessão para `Pending`.
5. Confirmar de novo a mesma reserva falha com "Pre-Autorizacao nao encontrada".

| Antes da nota | Depois da nota |
|---|---|
| Não existe anula. `AnulaPendingSessionAsync` retorna sucesso sem HTTP antes de montar o payload da Interplayers, que exige `tableId`. `Sales_cancel` desfaz venda confirmada. A sessão local sai no reopen. A reserva segue confirmável por até 30 dias e cai quando uma reserva posterior é confirmada. | Um cancelamento. Um `Sales_cancel`, `channel: PHARMA`. `authorizationID` é o `saleAuthorizationId`, sem `preAuthorizationID`. Status 103 é sucesso. Fora do mesmo dia, `createdAt` sai de `ConfirmedAt`. Provider = Funcional não entra na janela de 7 dias. Interplayers continua com 7 dias. |

**Arquivos:** `PbmFulfillProviderResolver.cs`, `FulfillPbmTransactionHandler.cs`, `ConfirmOrderPbmInvoiceHandler.cs`, `CancelOrderPbmAuthorizationHandler.cs`, `OrderPbm.cs` e a migration de `authorized_lines`. **Teste:** `FullyQualifiedName~FuncionalFulfill`.

## 09 · Trade-offs

> **Em aberto:** todos os trade-offs desta seção (token em memória, chave de NF sem retry, etc.) estão em discussão com o time técnico. Não tratar como decisão fechada.

| Atalho | Por quê | Quando pagar |
|---|---|---|
| `industry_company_code = 1` | O writer zera código sem dígito. Sem a linha, o cancelamento depois da nota não chama o hub. | Quando o writer deixar de tratar todo código como CNPJ. |
| `attendance_hash = createdAt` | A confirmação já lê esse campo. A Funcional não tem attendance hash. | Se um fluxo precisar dos dois valores. |
| `authorized_lines` em JSON | A confirmação pública só manda EAN. O preço e o id da confirmação ficam aqui. | Se a linha precisar ser consultada em SQL. |
| `program_id` com 16 | Coluna compartilhada. Este épico não alarga. Estouro não entra, não trunca, e o log guarda o id. | Se esse log aparecer na carga e o programa precisar entrar na rede. |
| Chave de NF sem retry | Reenviar a confirmação a Funcional recusa. | Se o log de chave falha com sessão confirmada virar recorrente. O retry é só da chave. |
| Token em memória | O gateway aceita cache perto de 24h. | Se `createToken` limitar taxa entre réplicas. |

## 10 · Observabilidade

O alerta continua o log estruturado que o módulo já manda ao Datadog. Cada evento leva `Provider=Funcional`. Token e senha não entram.

- **Carga:** um log por loja e um do job, com CNPJ, linhas gravadas, linhas recusadas e duração. Alarme se o job falha, se termina sem loja, ou se uma loja com erro teve a lista apagada. Lista vazia e HTTP ruim não apagam.
- **Efetivação, confirmação e cancelamento:** `OrderId`, código de retorno e se a chave da nota foi enviada. Alarme em falha de efetivação ou confirmação. Alarme separado quando a sessão ficou confirmada e a chave falhou: essa compra não é reconfirmada.

## 11 · Funcional instável

O client da Interplayers não tem circuit breaker. Este épico não adiciona um que engole o erro. A Funcional usa outro client e outro comando de carga.

- **Carga:** a loja que estourou tempo não apaga a própria lista nem a das outras. O job da Funcional não dispara a carga da Interplayers.
- **Consulta, efetivação, confirmação e cancelamento:** a chamada falha. O carrinho bloqueia o adicionar. A efetivação não troca o preço para o cheio e não manda o produto para a Interplayers.
- **Pré-autorização e confirmação:** uma tentativa. Tempo esgotado não cria outra reserva.
- **Token rejeitado:** uma renovação. A segunda falha sobe.

## 12 · Testes e rollout

Unidade no projeto que já existe, com HTTP fake: `FuncionalLoad`, `StorefrontFuncional`, `FuncionalConsult`, `FuncionalAdhesion`, `FuncionalFulfill`. A persistência da carga prova que a troca por provedor e CNPJ não apaga a Interplayers, que lista vazia não apaga, e que o `Plan` da Interplayers não publica desconto vazio para EAN que só está na Funcional.

A Interplayers já está em produção. As farmácias são as de `Pbm_Enabled`, o SQL de `StorefrontPharmacyDirectory`. Não há segunda lista. Antes da primeira carga Funcional em produção, o job da Interplayers copia, apaga e publica só `provider = Interplayers`.

## 13 · Mapa dos cards

| Card | Pontos | Filtro de teste |
|---|---|---|
| Carga | 13 | `FuncionalLoad` |
| Vitrine | 3 | `StorefrontFuncional` |
| Consulta | 8 | `FuncionalConsult` |
| Adesão | 13 | `FuncionalAdhesion` |
| Fechamento | 13 | `FuncionalFulfill` |

*(No PDF, a coluna "Filtro de teste" aparece desalinhada das linhas por causa do layout; o pareamento acima segue a ordem dos cards e dos filtros listados na seção 12.)*

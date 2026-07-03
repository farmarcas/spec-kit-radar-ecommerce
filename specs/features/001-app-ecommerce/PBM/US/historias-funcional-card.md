# Histórias de Usuário — Integração PBM: Provedor Funcional Card

**Épico:** Integração PBM (ECA-28)

**Fontes utilizadas:**
- Documentação técnica da Funcional+ (Gateway de Credenciados): [`autenticação`](../Documentação%20Funcional%20Card/funcional-gateway-autenticacao.md), [`fluxo de venda`](../Documentação%20Funcional%20Card/fluxo-venda.md), [`cadastro`](../Documentação%20Funcional%20Card/cadastro.md), [`OptIn`](../Documentação%20Funcional%20Card/OptIn.md), [`roteiro de homologação`](../Documentação%20Funcional%20Card/roteiro-homologacao.md), [`fluxo pré-venda no caixa`](../Documentação%20Funcional%20Card/Fluxo-Pre-Venda-Caixa-PBM.md)
- Histórias já existentes do provedor Interplayers (mesmo épico ECA-28): ECA-628, ECA-629, ECA-630, ECA-632, ECA-633, ECA-635, ECA-670, ECA-707 — usadas como referência de formato e escopo
- [Arquitetura de Desenvolvimento do PBM](../arquitetura-pbm.md)
- [Transcrição da reunião de discovery PBM com a Funcional (02/07/2026)](../../../../reuniões/transcrições/2026-07-02-discovery-pbm-funcional.md)
- `context/product.md`, `context/glossary.md`

---

## ⚠️ Perguntas para refinamento (antes de considerar estas histórias fechadas)

Estas histórias foram redigidas com base na documentação técnica pública da Funcional+ e no discovery de negócio, mas há pontos que a spec/reuniões não respondem com certeza e que precisam de validação do PO/time antes do desenvolvimento:

1. **Convivência de provedores por loja:** uma mesma loja pode estar credenciada simultaneamente no Interplayers **e** na Funcional Card? Se sim, qual critério de prioridade define qual provedor aplica o desconto quando o mesmo produto está em programas de ambos?
2. **Obrigatoriedade do OptIn:** a documentação da Funcional+ não deixa claro se o Termo de Consentimento (OptIn) é exigido para **todos** os programas/laboratórios ou apenas para alguns — assumimos que é condicional por programa (similar ao `registrationPolicy` do fluxo de cadastro), mas isso precisa ser confirmado com a Funcional.
3. **Chave única por rede:** conforme discutido no discovery, a autenticação (`createToken`) deve ser feita com uma chave/token único por rede (Farmarcas), não por loja — isso precisa ser confirmado tecnicamente com a Funcional antes da implementação do Passo de autenticação, já que o `storeCode` (CNPJ) é informado por chamada, mas o token em si parece ser de rede.
4. **Nome exato da mutation de upload de receita:** o documento-fonte usa `Prescription_addPrescription` no texto e `Prescription_uploadPrescription` no payload de exemplo — precisa confirmação da Funcional antes da implementação (história 5).
5. **Story Points:** foram sugeridos com base na complexidade percebida, mas devem ser recalibrados pelo time em refinamento (as histórias do Interplayers não têm Story Points preenchidos no Jira).

---

## 1 · PBM Funcional Card - Composição de vitrine e preços

**Épico:** Integração PBM (ECA-28)

**Tipo:** História | **Story Points:** 5 | **Prioridade:** High

**User Story**
Como usuário consumidor que tem acesso ao aplicativo, quero visualizar os preços no aplicativo com o desconto do programa Funcional Card aplicado.

**Overview**
Aplicar o preço com desconto do programa de PBM da Funcional Card no contexto dos produtos exibidos no aplicativo, reutilizando a mesma composição de preço já existente para o Interplayers (Motor de Preço no `ecomm-api-orchestrator-product-dotnet`), agora consultando a base local alimentada pela carga diária da Funcional Card.

**O que deve ser feito**
- Aplicar o preço Funcional Card no card do produto, contemplando todos os contextos onde o card é utilizado dentro do aplicativo
- Exibir o preço Funcional Card na tela de detalhes do produto (PDP), junto ao preço de loja

**Regras de Negócio**
- O preço Funcional Card exibido deve ser indexado estritamente com base no contexto da loja selecionada pelo consumidor (`storeCode`/CNPJ), buscando na tabela local (`Carga_PBM`) correspondente
- O motor de preço deve consultar a query `Pharma_checkPricesAndRules` (ou os dados equivalentes já sincronizados via carga diária) para obter `maximumConsumerPrice`, `priceReceived`, `funcionalPrice` e `salePrice` do produto naquela loja
- No card do produto, o aplicativo deve apresentar o preço base do produto (preço/desconto inicial)
- Na tela de detalhes do produto, o app deve apresentar os dois preços (preço loja e preço Funcional Card) com prioridade de seleção para o preço Funcional Card quando ele for mais vantajoso
- Se o preço de loja já for inferior ao preço Funcional Card, o app deve manter o preço de loja como selecionado (não forçar o desconto Funcional Card quando ele não é vantajoso ao consumidor)
- A busca de melhor preço deve continuar passando pelo `ecomm-api-orchestrator-product-dotnet` (Motor de Preço), que hoje já consolida Loja → PEC → Ofertas e deve incorporar o resultado do `GetPriceCustomPrice` também para o programa Funcional Card, sem expor ao restante do sistema qual provedor de PBM está por trás do desconto

**Critérios de Aceite**
- Consigo visualizar o preço com desconto Funcional Card no card de produtos
- Consigo visualizar o preço com desconto Funcional Card na tela de detalhes do produto
- Quando o preço de loja é melhor que o do Funcional Card, visualizo o preço de loja normalmente

**Impacto na NSM:** aumenta a conversão de vendas ao exibir o preço com desconto real do laboratório, incentivando a compra pelo canal digital — contribui para o Volume de Transações por Loja Ativa.

**Subtarefas sugeridas**
- QA | Casos de teste: comparação de preço loja vs. Funcional Card em diferentes cenários (loja credenciada, não credenciada, preço loja melhor, preço PBM melhor)
- [BE] Estender o `ecomm-api-orchestrator-product-dotnet` / `ecomm-api-core-*` para considerar Funcional Card como fonte adicional de `GetPriceCustomPrice`
- [APP] Ajustar componente de card de produto e PDP para exibir o preço Funcional Card quando aplicável

**Definição de Pronto (DoD)**
- [ ] Código revisado e aprovado
- [ ] Testes unitários escritos
- [ ] Testado em Android e iOS
- [ ] Sem regressão nas funcionalidades existentes (incluindo o fluxo já ativo do Interplayers)
- [ ] Documentação de API atualizada (se aplicável)

---

## 2 · PBM Funcional Card - Tag desconto laboratório

**Épico:** Integração PBM (ECA-28)

**Tipo:** História | **Story Points:** 3 | **Prioridade:** High

**User Story**
Como usuário consumidor que tem acesso ao aplicativo, quero conseguir identificar com clareza todos os produtos que fazem parte de um programa Funcional Card.

**Overview**
Sinalizar, no card de produtos, os SKUs que fazem parte de um programa de desconto da Funcional Card, reutilizando o mesmo padrão visual de tag já criado para o Interplayers ("Desconto laboratório").

**O que deve ser feito**
- Flagar o produto no banco de dados local quando ele fizer parte de algum programa Funcional Card (via carga diária)
- Aplicar a tag "Desconto laboratório" nos cards dos produtos que são Funcional Card, de forma indistinguível visualmente do Interplayers (a tag não deve expor ao consumidor qual é o provedor por trás do desconto)

**Regras de Negócio**
- Todos os produtos que fazem parte de um programa Funcional Card devem ser flagados no banco de dados local para fácil identificação pelo front
- A tag "Desconto laboratório" só deve ser aplicada nos produtos dos programas em que o CNPJ da loja logada está credenciado/habilitado na Funcional Card
- Caso um produto faça parte de um programa Funcional Card do qual a loja em que o usuário está logado não está credenciada, a tag não pode ser apresentada (mesmo que o produto pertença a um programa Funcional Card em outras lojas)
- Se o mesmo produto já exibir a tag por conta do Interplayers, não deve haver duplicação visual de tags — a tag "Desconto laboratório" é única, independente de quantos provedores de PBM oferecerem desconto para aquele produto naquela loja
- Quando o consumidor clicar no botão de comprar um produto Funcional Card, ele deve ser redirecionado para a tela de detalhes do produto para realizar a validação do CPF

**Critérios de Aceite**
- Consigo identificar no aplicativo quais produtos fazem parte de um programa Funcional Card através da tag "Desconto laboratório"
- Não visualizo tags duplicadas quando o produto pertence a programas de mais de um provedor de PBM na mesma loja

**Impacto na NSM:** aumenta a visibilidade do desconto disponível, reduzindo a fricção de descoberta e impulsionando conversão — contribui para o Volume de Transações por Loja Ativa.

**Subtarefas sugeridas**
- QA | Casos de teste: produto Funcional Card em loja credenciada / não credenciada; produto com desconto em ambos provedores simultaneamente
- [BE] Flag de produto elegível a partir da carga diária da Funcional Card
- [APP] Reutilizar componente de tag "Desconto laboratório" já existente

**Definição de Pronto (DoD)**
- [ ] Código revisado e aprovado
- [ ] Testes unitários escritos
- [ ] Testado em Android e iOS
- [ ] Sem regressão nas funcionalidades existentes
- [ ] Documentação de API atualizada (se aplicável)

---

## 3 · PBM Funcional Card - Avaliação de elegibilidade e cadastro do consumidor

**Épico:** Integração PBM (ECA-28)

**Tipo:** História | **Story Points:** 8 | **Prioridade:** High

**User Story**
Como usuário consumidor que tem acesso ao aplicativo, quero conseguir adicionar um produto na cesta utilizando o desconto do programa Funcional Card, mesmo que ainda não esteja cadastrado no programa.

**Overview**
Identificar o consumidor por CPF, avaliar sua elegibilidade a um programa Funcional Card e, quando necessário, viabilizar o cadastro (do beneficiário titular, de um dependente/paciente ou apenas a inclusão de um novo produto a um beneficiário já cadastrado) de forma dinâmica durante a jornada de compra.

**O que deve ser feito**
- Consultar a elegibilidade do CPF a um programa Funcional Card a partir do EAN do produto (`Pharma_assessEligibility`)
- Montar dinamicamente o formulário de cadastro com base nos campos e regras retornados pela consulta de elegibilidade
- Cadastrar um novo beneficiário no programa (`Pharma_signUpProgramBeneficiary`)
- Cadastrar um dependente/paciente quando o programa exigir (`Pharma_signUpProgramBeneficiaryDependent`)
- Incluir um novo produto a um beneficiário (titular ou dependente) já cadastrado (`Pharma_addProgramBeneficiaryToProduct`)
- Validar os dados do prescritor antes do envio final (`Pharma_prescriber`)

**Regras de Negócio**
- O aplicativo deve permitir que o usuário se identifique utilizando o CPF
- A consulta de elegibilidade (`Pharma_assessEligibility`) é sempre a primeira etapa do fluxo — os demais passos dependem do seu resultado para saber quais campos exibir/enviar
- O campo `requiresBeneficiaryRegistration` indica se o CPF precisa de cadastro: `true` = ainda não cadastrado no programa; `false` = já cadastrado
- O `eligibilityAssessment.programCode` retornado deve ser persistido, pois é obrigatório em todas as mutations de cadastro subsequentes
- Os campos de formulário (`beneficiaryFields`, `dependentFields`, `medicalPrescriptionFields`, `extraFields`, `extraFormFields`) devem ser exibidos de acordo com o atributo `display` de cada campo: `HIDDEN` (não exibir), `OPTIONAL` (exibir como opcional) ou `REQUIRED` (exibir como obrigatório) — cada programa tem sua própria política e deve ser respeitada individualmente
- Campos do tipo lista (`SELECT`/`RADIO`) devem ser exibidos com as opções retornadas em `options[].text`, enviando o `value` correspondente
- Perguntas extras do programa (`extraFormFields`) podem ter perguntas condicionais (`RelatedQuestions`), que só devem ser exibidas quando a resposta pai específica for selecionada
- Usar `Pharma_signUpProgramBeneficiaryDependent` **somente quando simultaneamente**: (1) o beneficiário já está cadastrado no programa, (2) é necessário cadastro do produto, e (3) o programa utiliza pacientes/dependentes. Caso contrário, usar `Pharma_signUpProgramBeneficiary` para o cadastro inicial, ou `Pharma_addProgramBeneficiaryToProduct` apenas para incluir produto a um beneficiário/dependente já existente
- Ao incluir produto a um dependente (`Pharma_addProgramBeneficiaryToProduct` com `dependentID` preenchido), o `customerCode` enviado continua sendo o do titular — o dependente é referenciado apenas pelo `dependentID`, obtido da lista `dependents` retornada por `Pharma_assessEligibility`
- O número máximo de dependentes permitido é controlado por `registrationPolicy.dependentsLimit`, e a possibilidade de ter dependentes por `registrationPolicy.allowDependents`
- Se `registrationPolicy.originPermitedRegister = false`, a origem da chamada (ex.: app mobile) não tem permissão para registrar aquele produto/programa — o app deve bloquear o cadastro e informar o consumidor de forma amigável, sem expor jargão técnico
- Se `registrationPolicy.urlRegisterSite` estiver preenchida, o cadastro daquele programa pode exigir redirecionamento a um site externo em vez de cadastro via API — o app deve abrir essa URL sem tirar o consumidor do fluxo (mesmo padrão de WebView já usado para o Interplayers)
- A validação dos dados do prescritor (`Pharma_prescriber`) pode ser feita de forma antecipada no formulário (antes do submit final), embora as mutations de cadastro também validem internamente
- Qualquer erro retornado (`validationResult.errors[].message` ou `errors[].message`) deve ser capturado e traduzido para uma mensagem amigável ao consumidor final, evitando jargões técnicos

**Critérios de Aceite**
- Consigo, através do aplicativo, consultar minha elegibilidade a um programa Funcional Card informando meu CPF
- Consigo visualizar quais campos preciso preencher para me cadastrar no programa, de acordo com as regras específicas daquele programa
- Consigo, através do aplicativo, me cadastrar em um novo programa Funcional Card
- Consigo cadastrar um dependente/paciente quando o programa exigir
- Consigo incluir um novo produto Funcional Card a um cadastro que já possuo
- Visualizo mensagens de erro compreensíveis quando algum dado de cadastro é inválido

**Impacto na NSM:** viabiliza o acesso ao desconto de PBM a consumidores ainda não cadastrados diretamente no app, sem sair do fluxo de compra, aumentando conversão e recorrência — contribui para o Volume de Transações por Loja Ativa.

**Subtarefas sugeridas**
- QA | Casos de teste: CPF já cadastrado, CPF não cadastrado com adesão via API, CPF não cadastrado com redirecionamento externo, cadastro de dependente, inclusão de produto a beneficiário existente, origem sem permissão de registro
- [BE] Integração com `Pharma_assessEligibility`, `Pharma_signUpProgramBeneficiary`, `Pharma_signUpProgramBeneficiaryDependent`, `Pharma_addProgramBeneficiaryToProduct` e `Pharma_prescriber`
- [APP] Formulário dinâmico de cadastro renderizado a partir de `registrationPolicy` (campos, obrigatoriedade, perguntas condicionais)

**Definição de Pronto (DoD)**
- [ ] Código revisado e aprovado
- [ ] Testes unitários escritos
- [ ] Testado em Android e iOS
- [ ] Sem regressão nas funcionalidades existentes
- [ ] Documentação de API atualizada (se aplicável)

---

## 4 · PBM Funcional Card - Termo de consentimento (OptIn)

**Épico:** Integração PBM (ECA-28)

**Tipo:** História | **Story Points:** 5 | **Prioridade:** High

**User Story**
Como usuário consumidor que tem acesso ao aplicativo, quero aceitar o termo de consentimento (LGPD) de um programa Funcional Card sem precisar sair do aplicativo, para conseguir concluir minha compra com o desconto do laboratório.

**Overview**
Alguns programas da Funcional Card exigem que o consumidor aceite um termo de consentimento (OptIn) antes de autorizar ou continuar uma compra com desconto. Esta história cobre a verificação, exibição e confirmação desse aceite dentro do próprio app.

**O que deve ser feito**
- Verificar se o CPF já aceitou os termos de um programa e se esse aceite é obrigatório (`Pharma_verifyOptIn`)
- Exibir o termo de consentimento em tela, dentro do próprio app (`Pharma_retrieveTextTermsOptIn`)
- Confirmar o aceite do consumidor (`Pharma_insertOptIn`)
- (Alternativo/fallback) Enviar o termo por SMS/e-mail quando aplicável (`Pharma_sendOptInTerms`)

**Regras de Negócio**
- A verificação de OptIn (`Pharma_verifyOptIn`) deve ser chamada em atualizações cadastrais e nos momentos de autorização e compra
- Se `OptInObrigatorio = "S"` e `OptInRealizado = "N"`, a compra daquele produto deve ser bloqueada até o consumidor aceitar o termo
- A mensagem retornada em `Mensagem` deve ser exibida ao consumidor de forma amigável, informando a consequência de não aceitar (ex.: bloqueio da próxima compra)
- O fluxo preferencial dentro do app é exibir o texto do termo diretamente em tela via `Pharma_retrieveTextTermsOptIn` (`TextoTermos`/`LinkTermos`), sem redirecionar o consumidor para fora do aplicativo
- A confirmação do aceite (`Pharma_insertOptIn`) deve **obrigatoriamente** ser precedida pela chamada de `Pharma_retrieveTextTermsOptIn`, reaproveitando o `CodigoEnvio` retornado por ela como `CodigoEnvioTermos`
- O fluxo alternativo por SMS/e-mail (`Pharma_sendOptInTerms`) só deve ser utilizado quando não for possível exibir o termo em tela (ex.: fluxos futuros fora do app, como PDV/balcão) — a exigência de qual fluxo usar deve ser confirmada por programa (ver pergunta de refinamento nº 2)
- Enquanto o OptIn obrigatório não for aceito, o app não deve permitir avançar a pré-autorização daquele produto no checkout

**Critérios de Aceite**
- Consigo visualizar se preciso aceitar um termo de consentimento antes de comprar um produto Funcional Card
- Consigo ler o termo de consentimento diretamente no aplicativo, sem sair dele
- Consigo confirmar meu aceite ao termo diretamente no aplicativo
- Sou impedido de continuar a compra de um produto que exige OptIn obrigatório enquanto não aceitar o termo

**Impacto na NSM:** remove uma barreira de conformidade que bloquearia a venda, garantindo que a jornada de compra com desconto PBM seja concluída dentro do app — contribui para o Volume de Transações por Loja Ativa.

**Subtarefas sugeridas**
- QA | Casos de teste: OptIn não obrigatório, OptIn obrigatório não aceito (bloqueio), aceite via app, tentativa de compra sem aceite
- [BE] Integração com `Pharma_verifyOptIn`, `Pharma_retrieveTextTermsOptIn` e `Pharma_insertOptIn`
- [APP] Tela de exibição do termo de consentimento e botão de aceite, com bloqueio de avanço no checkout

**Definição de Pronto (DoD)**
- [ ] Código revisado e aprovado
- [ ] Testes unitários escritos
- [ ] Testado em Android e iOS
- [ ] Sem regressão nas funcionalidades existentes
- [ ] Documentação de API atualizada (se aplicável)

---

## 5 · PBM Funcional Card - Pré-autorização da venda no checkout

**Épico:** Integração PBM (ECA-28)

**Tipo:** História | **Story Points:** 8 | **Prioridade:** High

**User Story**
Como usuário consumidor que tem acesso ao aplicativo, quero concluir a minha compra utilizando o preço Funcional Card de um medicamento, incluindo o envio da receita médica quando necessário.

**Overview**
Permitir que o consumidor finalize a jornada de compra de um produto Funcional Card no checkout do app, validando preços/regras, pré-autorizando a venda (reserva das condições negociadas) e anexando receita médica quando exigido — sem ainda efetivar/confirmar a venda, que só ocorre após a emissão da nota fiscal (história 6).

**O que deve ser feito**
- Validar preços e regras antes da negociação (`Pharma_checkPricesAndRules`)
- Pré-autorizar a venda, reservando as condições negociadas (`Sales_preAuthorizeSale`)
- Anexar receita médica à venda quando exigido (`Prescription_addPrescription` + `Prescription_bindPrescription`)
- Tratar aprovação parcial por produto (alguns itens aprovados, outros recusados na mesma pré-autorização)

**Regras de Negócio**
- O campo `origin` deve ser enviado corretamente em toda chamada: `PARTNERS_ECOMMERCE` para chamadas feitas pelo e-commerce/app
- `Pharma_checkPricesAndRules` é apenas uma simulação/teste — não gera compromisso de venda; deve ser usada para validar preço e receita antes de qualquer negociação real
- Se `requiredUploadWithPrescription = true` no retorno de `Pharma_checkPricesAndRules`, o app deve obrigatoriamente solicitar o upload da receita médica digitalizada antes de prosseguir
- O upload de receita (`Prescription_addPrescription`) aceita arquivo de no máximo **2MB**; após o upload, o `id` retornado deve ser vinculado à venda via `Prescription_bindPrescription`, podendo haver mais de uma receita por venda (`prescriptionIDs` é uma lista)
- Se `requiredInformDailyDose = true`, o campo `dailyDose` (dose diária) é obrigatório na pré-autorização — aplicável apenas a compras que exigem receita
- `Sales_preAuthorizeSale` **não efetiva a venda** — apenas reserva/negocia as condições até a confirmação (história 6) ou até uma nova pré-autorização
- A pré-autorização avalia cada produto individualmente: é possível que parte dos itens seja aprovada (`status: SUCCESS`) e parte recusada (`status: ERROR`, ex.: `statusCode 72` — "Venda não autorizada. Compra excedida ou quantidade sem receita excedida.") na mesma chamada
- Quando houver recusa parcial, o app deve gerar uma **nova pré-autorização apenas com os produtos aprovados**, informando ao consumidor quais itens não puderam ser incluídos e por quê (mensagem amigável a partir de `statusMessage`)
- O `authorizationID` e o `createdAt` retornados por `Sales_preAuthorizeSale` devem ser persistidos no pedido, pois serão exigidos na confirmação (história 6)
- Se a pré-autorização retornar `secondFactorAuthentication`, o app deve estar preparado para solicitar um segundo fator de autenticação (token gerado em outro app/celular) antes de prosseguir
- Se o preço de loja aplicado ao consumidor for superior à condição do programa Funcional Card, mesmo assim a transação deve tramitar pelo PBM para fins de auditoria e ressarcimento junto ao laboratório (mesma regra já aplicada ao Interplayers)
- O checkout deve permitir compras com produtos de diferentes programas Funcional Card na mesma cesta, e também combinados com produtos sem PBM ou com desconto de outro provedor (Interplayers), desde que cada grupo seja pré-autorizado corretamente por seu respectivo provedor

**Critérios de Aceite**
- Consigo finalizar uma compra no aplicativo comprando um produto com o desconto Funcional Card
- Consigo anexar minha receita médica digitalizada quando o produto exigir
- Quando um item da minha cesta é recusado na pré-autorização, os demais itens aprovados continuam disponíveis para compra
- Visualizo uma mensagem clara quando um item não pode ser autorizado (ex.: limite de compra excedido)

**Impacto na NSM:** viabiliza a conclusão de compras com desconto de laboratório diretamente no app, incluindo cenários com receita médica — contribui diretamente para o Volume de Transações por Loja Ativa.

**Subtarefas sugeridas**
- QA | Casos de teste: pré-autorização total aprovada, aprovação parcial, upload de receita válido/inválido (tamanho > 2MB), segundo fator de autenticação, cesta mista (PBM + não PBM + outro provedor)
- [BE] Integração com `Pharma_checkPricesAndRules`, `Sales_preAuthorizeSale`, `Prescription_addPrescription` e `Prescription_bindPrescription`; persistência de `authorizationID`/`createdAt` no pedido
- [APP] Tela de upload de receita médica; tratamento de recusa parcial no carrinho

**Definição de Pronto (DoD)**
- [ ] Código revisado e aprovado
- [ ] Testes unitários escritos
- [ ] Testado em Android e iOS
- [ ] Sem regressão nas funcionalidades existentes
- [ ] Documentação de API atualizada (se aplicável)

---

## 6 · PBM Funcional Card - Confirmação da venda após emissão da NF

**Épico:** Integração PBM (ECA-28)

**Tipo:** História | **Story Points:** 8 | **Prioridade:** Highest

**User Story**
Como usuário gestor da farmácia que gerencia o fluxo de atendimento do PBM, quero garantir a confirmação da venda no provedor Funcional Card assim que a nota fiscal for emitida, para garantir o ressarcimento e a reposição do produto.

**Overview**
Este é o ponto mais crítico da integração (apontado tanto pela documentação técnica quanto pelo discovery de negócio): a pré-autorização acontece no app, mas a confirmação final da venda (que efetivamente debita o benefício) só pode ocorrer depois, no PDV/ERP da loja, no momento em que a nota fiscal é emitida.

**O que deve ser feito**
- Confirmar a venda pré-autorizada assim que a NF for emitida pelo ERP da loja (`Sales_confirmPreAuthorizedSale`)
- Atualizar os dados da NF quando ela for emitida em momento posterior à confirmação (`Sales_updateInvoiceCode`)
- Tratar falhas de confirmação sem cancelar a venda já faturada para o cliente

**Regras de Negócio**
- O disparo da confirmação (`Sales_confirmPreAuthorizedSale`) deve ser condicionado ao sucesso da emissão da NF pelo ERP da loja — assim que o pedido for concluído no ERP e a NF emitida, o sistema deve confirmar a transação no provedor
- A confirmação deve usar o `authorizationID` e o `preAuthorizationDate` (`createdAt`) gerados na pré-autorização (história 5); se `preAuthorizationDate` não for enviado, o provedor considera apenas pré-autorizações do mesmo dia
- **Não é possível adicionar produtos novos nem confirmar quantidade superior à pré-autorizada** — caso necessário, é preciso realizar uma nova pré-autorização (voltar à história 5)
- **Uma venda não pode ser confirmada mais de uma vez**: uma segunda tentativa de confirmação para o mesmo `authorizationID` retorna erro `statusCode 1` — "Pre-Autorizacao nao encontrada" — o sistema deve tratar esse erro como confirmação duplicada e não como falha de negócio
- Os campos `invoiceCode` (chave DANFE) e `invoiceAuthProtocol` (protocolo de autenticação) são **opcionais** na confirmação — quando a NFe é emitida **depois** da confirmação da venda, esses dados devem ser enviados posteriormente via `Sales_updateInvoiceCode` (onde os mesmos campos passam a ser **obrigatórios**, junto com `saleDate`)
- Se o endpoint de confirmação falhar por instabilidade do provedor (erros 5xx, timeouts), o sistema **não pode cancelar a venda para o cliente** (a NF já foi emitida e o pagamento aprovado) — a requisição deve ser retida em uma fila de mensageria com tentativas automáticas até que o provedor processe o envio
- Toda resposta positiva do provedor (com `receipt`, valores finais e `reimbursementValue` por produto e no total) deve ser salva vinculada ao pedido, para histórico da venda e do cliente
- Falhas definitivas na confirmação (fora o caso de duplicidade) devem gerar um alerta interno urgente para o time de tecnologia, dado o risco financeiro de venda faturada sem PBM confirmado

**Critérios de Aceite**
- O sistema confirma automaticamente a venda no provedor assim que a NF é emitida pelo ERP da loja
- O sistema não cancela a venda do cliente quando há falha temporária de comunicação com o provedor na confirmação
- O sistema trata corretamente uma tentativa de confirmação duplicada, sem gerar erro para o operador do PDV
- O sistema atualiza os dados da NF no provedor quando ela é emitida após a confirmação da venda

**Impacto na NSM:** garante que a venda seja corretamente reconciliada e ressarcida, protegendo a operação do Lojista e sustentando a confiança do Associado no canal digital — impacto indireto, mas essencial, no Volume de Transações por Loja Ativa (sem isso, os Associados não habilitariam o PBM Funcional Card).

**Subtarefas sugeridas**
- QA | Casos de teste: confirmação com NF já emitida, confirmação duplicada, timeout do provedor (retry via fila), atualização de NF pós-confirmação
- [BE] Integração com `Sales_confirmPreAuthorizedSale` e `Sales_updateInvoiceCode`; fila de mensageria com retry para falhas de instabilidade; alerta interno para falhas definitivas
- [APP] Nenhuma tela nova prevista — fluxo majoritariamente backend/PDV; exibir status "Aguardando confirmação PBM" no histórico do pedido, se aplicável

**Definição de Pronto (DoD)**
- [ ] Código revisado e aprovado
- [ ] Testes unitários escritos
- [ ] Testado em Android e iOS
- [ ] Sem regressão nas funcionalidades existentes
- [ ] Documentação de API atualizada (se aplicável)

---

## 7 · PBM Funcional Card - Cancelamento da transação

**Épico:** Integração PBM (ECA-28)

**Tipo:** História | **Story Points:** 5 | **Prioridade:** Medium

**User Story**
Como usuário consumidor que tem acesso ao aplicativo, quero que o cancelamento do meu pedido seja integrado entre o programa Funcional Card e o aplicativo da rede.

**Overview**
Construir o fluxo de cancelamento de um pedido que contém um produto confirmado no PBM Funcional Card, garantindo que a devolução/estorno seja refletida corretamente no provedor.

**O que deve ser feito**
- Cancelar a venda confirmada no provedor Funcional Card (`Sales_cancel`) quando o pedido for cancelado no Radar E-commerce

**Regras de Negócio**
- O cancelamento deve ser feito com base no `authorizationID` retornado por `Sales_confirmPreAuthorizedSale` — **não deve ser informado simultaneamente com `preAuthorizationID`** (são mutuamente exclusivos)
- O `createdAt` da venda é obrigatório no cancelamento **se a venda não ocorreu no mesmo dia**; é opcional se o cancelamento ocorrer no mesmo dia da confirmação
- O cancelamento só é possível **após a venda confirmada** (não é possível cancelar uma pré-autorização ainda não confirmada por este endpoint — nesse caso, basta simplesmente não confirmá-la)
- Tentar cancelar uma transação já cancelada retorna erro `statusCode 103` — "Transacao ja cancelada" — o sistema deve tratar esse retorno como cancelamento já efetivado, não como falha
- O comprovante de cancelamento retornado pelo provedor (`receipt`) deve ser armazenado vinculado ao pedido, para histórico

**Critérios de Aceite**
- Consigo cancelar um pedido com produto Funcional Card e ter esse cancelamento refletido no provedor
- O sistema não gera erro ao usuário quando uma transação já cancelada é cancelada novamente
- Consigo consultar o comprovante de cancelamento vinculado ao meu pedido

**Impacto na NSM:** garante consistência financeira e de estoque entre app e provedor no cancelamento, evitando prejuízo ao Lojista e mantendo a confiabilidade da integração — sustenta a adoção do PBM pelos Associados, indiretamente protegendo o Volume de Transações por Loja Ativa.

**Subtarefas sugeridas**
- QA | Casos de teste: cancelamento no mesmo dia, cancelamento em dia posterior, cancelamento duplicado
- [BE] Integração com `Sales_cancel`; armazenamento do comprovante de cancelamento no pedido
- [APP] Exibir status de cancelamento PBM no histórico do pedido, se aplicável

**Definição de Pronto (DoD)**
- [ ] Código revisado e aprovado
- [ ] Testes unitários escritos
- [ ] Testado em Android e iOS
- [ ] Sem regressão nas funcionalidades existentes
- [ ] Documentação de API atualizada (se aplicável)

---

## 8 · PBM Funcional Card - Carga diária de programas e regras de desconto

**Épico:** Integração PBM (ECA-28)

**Tipo:** História | **Story Points:** 5 | **Prioridade:** High

**User Story**
Como usuário administrador do aplicativo, quero consultar diariamente no provedor Funcional Card todas as informações necessárias para trabalhar com descontos de laboratório no app das redes.

**Overview**
Manter a base de dados local do e-commerce (`Postgres Local` / tabela `Carga_PBM`, conforme a arquitetura do PBM) sincronizada com os programas, produtos e regras de desconto disponibilizados pela Funcional Card, garantindo performance na consulta pelo Motor de Preço e autonomia para o front-end.

**O que deve ser feito**
- Realizar a consulta diária dos programas de desconto no provedor Funcional Card
- Salvar os dados identificados na carga na base local (`Carga_PBM`)
- Manter um backup do estado anterior da carga
- Criar monitoria detalhada do processo de carga

**Regras de Negócio**
- A carga diária deve ser orquestrada pelo `ecomm-api-core-*` (job Hangfire — `PbmBackgroundJob`, conforme a arquitetura do PBM), no mesmo padrão já usado para o Interplayers
- A carga do dia anterior sempre deve ser mantida como backup até a próxima consulta bem-sucedida
- Em caso de erro na carga, o sistema deve continuar apresentando os dados do dia anterior ("último estado válido"), para não deixar a vitrine sem preços PBM
- A aplicação deve ser capaz de disparar a carga diária sob demanda, caso ocorra uma inconsistência no ambiente no horário agendado
- A carga sempre deve ser completa — o sistema deve substituir todos os dados da Funcional Card na tabela local a cada execução, sem resíduos de produtos/regras descontinuados
- Se a API da Funcional Card retornar erro, o sistema deve logar o código e a mensagem de erro (`statusCode`/`statusMessage`)
- Caso a requisição falhe em 3 tentativas consecutivas, o sistema deve disparar um alerta (Slack) para o time de Backend — não é permitido ficar mais de 24h sem atualizar as tabelas
- Nenhuma credencial deve ser armazenada em log ou código-fonte
- O token de autenticação (`createToken`) deve ser renovado automaticamente antes de expirar (validade de até 24h), sem interromper requisições em andamento
- O `ecomm-api-core-*` deve armazenar a carga de forma isolada por provedor (Interplayers, Funcional Card), permitindo que o Motor de Preço consulte ambos sem precisar conhecer o provedor de origem

**Critérios de Aceite**
- Conseguimos salvar em nossa infraestrutura todos os dados de programas, produtos e regras de desconto recebidos na carga diária da Funcional Card
- A vitrine continua exibindo os preços PBM do último estado válido quando a carga do dia falha
- Recebemos um alerta no Slack quando a carga falha 3 vezes consecutivas

**Impacto na NSM:** garante que os preços PBM exibidos no app estejam sempre atualizados e disponíveis, sustentando a confiabilidade da vitrine e, consequentemente, a conversão — contribui indiretamente para o Volume de Transações por Loja Ativa.

**Subtarefas sugeridas**
- QA | Casos de teste: carga bem-sucedida, carga com falha (fallback para estado anterior), 3 falhas consecutivas (alerta Slack), renovação automática de token
- [BE] Job `PbmBackgroundJob` de carga diária da Funcional Card no `ecomm-api-core-*`, com backup e substituição completa da tabela `Carga_PBM`
- [APP] Nenhuma tela nova prevista — impacto indireto via disponibilidade de preços na vitrine

**Definição de Pronto (DoD)**
- [ ] Código revisado e aprovado
- [ ] Testes unitários escritos
- [ ] Testado em Android e iOS
- [ ] Sem regressão nas funcionalidades existentes
- [ ] Documentação de API atualizada (se aplicável)

---

## 9 · PBM Funcional Card - Habilitação do provedor por loja

**Épico:** Integração PBM (ECA-28)

**Tipo:** História | **Story Points:** 3 | **Prioridade:** Medium

**User Story**
Como usuário associado que gerencia o aplicativo, quero conseguir habilitar e desabilitar o PBM Funcional Card na minha loja dentro do aplicativo.

**Overview**
Deixar o backend preparado para permitir que a loja habilite ou desabilite especificamente o programa Funcional Card, de forma independente do Interplayers, já que uma loja pode estar credenciada em um provedor, no outro, em ambos, ou em nenhum.

**O que deve ser feito**
- Permitir habilitar a funcionalidade do PBM Funcional Card por loja
- Permitir desabilitar a funcionalidade do PBM Funcional Card por loja

**Regras de Negócio**
- O backend deve permitir habilitar/desabilitar o PBM Funcional Card de forma independente do PBM Interplayers — a mesma loja pode ter os dois provedores, apenas um, ou nenhum ativo
- A função de habilitar e desabilitar deve ser restrita a uma loja específica (`storeCode`) e não a todo o aplicativo
- Quando o PBM Funcional Card estiver desabilitado para uma loja, nenhuma tag, preço ou fluxo de cadastro/OptIn relacionado a esse provedor deve ser exibido para produtos daquela loja, mesmo que o produto conste na carga diária como elegível
- Futuramente, o time de Portal deve poder adicionar essa flag dentro das configurações da loja (fora do escopo desta história — apenas o backend precisa estar preparado)

**Critérios de Aceite**
- O associado consegue habilitar o PBM Funcional Card na sua loja
- O associado consegue desabilitar o PBM Funcional Card na sua loja
- Quando desabilitado, não visualizo nenhum indício de desconto Funcional Card nos produtos daquela loja

**Impacto na NSM:** dá ao Associado controle sobre a ativação do canal de desconto mais adequado à sua realidade comercial, incentivando adoção — contribui indiretamente para o Volume de Transações por Loja Ativa.

**Subtarefas sugeridas**
- QA | Casos de teste: loja com apenas Funcional Card habilitado, apenas Interplayers, ambos, nenhum
- [BE] Flag de habilitação por loja e por provedor (extensível para múltiplos provedores de PBM)
- [APP] Nenhuma tela nova prevista nesta fase (flag gerenciada via backend/futura tela de Portal)

**Definição de Pronto (DoD)**
- [ ] Código revisado e aprovado
- [ ] Testes unitários escritos
- [ ] Testado em Android e iOS
- [ ] Sem regressão nas funcionalidades existentes
- [ ] Documentação de API atualizada (se aplicável)

---

## 10 · [Tarefa Técnica] PBM - Abstração multi-provedor no ecomm-api-core-*

**Épico:** Integração PBM (ECA-28)

**Tipo:** Tarefa | **Story Points:** 5 | **Prioridade:** Highest

**O que?**
Garantir que a integração com a Funcional Card seja construída atrás do mesmo contrato de abstração do `ecomm-api-core-*` (conforme a [arquitetura do PBM](../arquitetura-pbm.md)), de forma que o `ecomm-api-orchestrator-product-dotnet` e o restante do sistema não precisem conhecer qual provedor de PBM (Interplayers, Funcional Card, ou futuros) está por trás de um desconto.

**Por que?**
A reunião de discovery com a Funcional confirmou que a Farmarcas vai integrar múltiplos provedores de PBM ao mesmo domínio (hoje descrito como domínio "Promotions"/`ecomm-api-core-*`), e que o `ecomm-api-orchestrator-product-dotnet` deve continuar consultando apenas `GetPriceCustomPrice` de forma agnóstica ao provedor. Sem essa abstração, cada novo provedor exigiria alterações espalhadas pelo orquestrador, pelo checkout e pela vitrine, aumentando o custo e o risco de regressão a cada nova integração.

**Como?**
- Definir uma interface/contrato interno único no `ecomm-api-core-*` para as operações comuns entre provedores: carga diária, consulta de preço/elegibilidade, pré-autorização, confirmação e cancelamento
- Implementar o adaptador Funcional Card (GraphQL) atrás dessa interface, convivendo com o adaptador já existente do Interplayers
- Garantir que a tabela local (`Carga_PBM`) armazene o provedor de origem de cada registro, permitindo resolver conflitos quando mais de um provedor oferecer desconto para o mesmo produto/loja (ver pergunta de refinamento nº 1)
- Validar que os eventos publicados no tópico Kafka `order.changed` (pré-autorização, efetivação, cancelamento) continuem agnósticos a provedor, carregando apenas os dados necessários para o `ecomm-api-core-*` decidir qual adaptador acionar
- Atualizar a documentação de arquitetura (`arquitetura-pbm.md`) para refletir explicitamente o suporte a múltiplos provedores, caso ainda não esteja refletido após esta implementação

**Definição de Pronto (DoD)**
- [ ] Código revisado e aprovado
- [ ] Testes unitários escritos
- [ ] Sem regressão nas funcionalidades existentes (incluindo o fluxo já ativo do Interplayers)
- [ ] Documentação de arquitetura/API atualizada

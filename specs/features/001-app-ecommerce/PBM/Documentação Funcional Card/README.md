# Documentação Funcional Card (gateway de credenciados)

Os arquivos desta pasta são **cópias da documentação do fornecedor** (developer.funcionalmais.com) e **não são editados**. Este README mapeia o que a Farmarcas usa deles na integração via `ecomm-api-core-dotnet`.

**Desenho da integração (Farmarcas):** [`../Integração Funcional/funcional-analise-tecnica.md`](../Integração%20Funcional/funcional-analise-tecnica.md) · [`funcional-material-de-negocio.md`](../Integração%20Funcional/funcional-material-de-negocio.md) · [`../arquitetura-pbm.md`](../arquitetura-pbm.md)

## Arquivos

| Arquivo | Conteúdo | Usado em |
|---|---|---|
| `funcional-gateway-autenticacao.md` | Endereços, `createToken`, expiração (24h) e horário da homologação | Client da Funcional (token em memória, cache até ~24h) |
| `fluxo-venda.md` | Venda pré-autorizada, carga diária, cancelamento | Carga, reserva, confirmação, nota e cancelamento |
| `cadastro.md` | Elegibilidade, inscrição, dependente, inclusão de produto | Adesão |
| `OptIn.md` | Verificação e aceite do termo de consentimento | Consulta e adesão |
| `Fluxo-Pre-Venda-Caixa-PBM.md` | Fluxo de venda no caixa (PBM) | Referência; não usado diretamente pelo e-commerce |
| `roteiro-homologacao.md` | Roteiro e cenários para homologar a integração | Homologação (ver observação abaixo) |

## Operações da Funcional: o que usamos

| Operação | Usada? | Onde |
|---|---|---|
| `createToken` | Sim | Autenticação (cache em memória; uma renovação se o token for rejeitado) |
| `Pharma_discountPrograms` | Sim | [Carga diária](../sequencia-pbm-carga-diaria.md) — por CNPJ, `origin: PARTNERS_ECOMMERCE` |
| `Pharma_checkPricesAndRules` | Sim | [Consulta com CPF](../sequencia-pbm-ativar-desconto-cpf.md) — preço autorizado (`salePrice`) |
| `Pharma_verifyOptIn` | Sim | Consulta e, de novo, antes da reserva |
| `Pharma_assessEligibility` | Sim | Consulta (pessoa fora do programa) e [adesão](../sequencia-pbm-adesao-funcional.md) |
| `Pharma_retrieveTextTermsOptIn` | Sim | Adesão — texto/link do termo e `CodigoEnvio` |
| `Pharma_insertOptIn` | Sim | Adesão — aceite, com `CodigoEnvioTermos` |
| `Pharma_signUpProgramBeneficiary` | Sim | Adesão — pessoa ainda não inscrita |
| `Pharma_addProgramBeneficiaryToProduct` | Sim | Adesão — já inscrita, falta o produto |
| `Pharma_signUpProgramBeneficiaryDependent` | Sim | Adesão — paciente com titular inscrito |
| `Sales_preAuthorizeSale` | Sim | [Reserva](../sequencia-pbm-efetivacao-funcional.md) (até 30 dias, `channel: PHARMA`) |
| `Sales_confirmPreAuthorizedSale` | Sim | Confirmação, uma vez |
| `Sales_updateInvoiceCode` | Sim | Chave tardia da NF |
| `Sales_cancel` | Sim | [Cancelamento](../sequencia-pbm-cancelamento-funcional.md), só depois da nota |
| `Pharma_sendOptInTerms` | **Não** | O aceite é na tela do app (o termo não é enviado por SMS/e-mail) |
| Anexar receita à venda (`fluxo-venda.md`, passo 4) | **Não** | Fora do escopo: se o programa exigir imagem de receita, o item não entra e a pessoa vê a mensagem do programa. O envio de receita do app (em produção) é um fluxo próprio da Farmarcas |
| Consulta de transação, consulta de regras do produto, consulta de beneficiário | **Não** (não citadas nos documentos da Farmarcas) | O desconto vem da carga; a situação do consumidor vem de `Pharma_verifyOptIn` e `Pharma_assessEligibility` |
| `Sales_cancel` com `preAuthorizationID` | **Não** | O cancelamento usa só o `authorizationID` da confirmação |
| `maximumConsumerPrice` (PMC), `funcionalPrice` | **Não** viram preço | Não há coluna de PMC; o preço autorizado vem de `salePrice` |
| `centralNumber` | **Não** é enviado | Não vai no request nem volta no resultado |

## Observação sobre a homologação

O [`roteiro-homologacao.md`](roteiro-homologacao.md) exige documento com prints do passo a passo da venda, comprovantes de ao menos uma venda (layout do Relatório Gerencial) e a validação dos cenários de compra (total benefício farmácia, parcial, à vista) e do upload de receita. Os documentos técnico e de negócio da Farmarcas (28/10/2026) **não mencionam a homologação** (se já foi concluída para a Funcional, quem a conduziu e onde está o registro). **A revisão do roteiro fica para o fim do processo, durante os testes (PO, 29/10/2026).**

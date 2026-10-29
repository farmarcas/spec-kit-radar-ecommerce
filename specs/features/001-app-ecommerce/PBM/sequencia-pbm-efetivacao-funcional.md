# PBM - Efetivação: reserva, confirmação e nota — Funcional (Sequência)

**Fonte:** [análise técnica da Funcional](Integração%20Funcional/funcional-analise-tecnica.md), seções 02, 03 e 08 (28/10/2026). Documento criado em 29/10/2026.
**Referência do fornecedor:** [Fluxo de venda — pré-autorização, confirmação e nota](Documentação%20Funcional%20Card/fluxo-venda.md).

---

## Diagrama

```mermaid
sequenceDiagram
    participant order as ecomm-api-order-dotnet
    participant core as api-core
    participant func as Funcional
    participant sess as sessão (order_pbm)

    Note over order,sess: 1. Reserva (fulfillPbmTransaction)
    order->>+core: fulfillPbmTransaction (uma efetiva, preço da loja)
    core->>func: Pharma_verifyOptIn
    core->>+func: Sales_preAuthorizeSale (channel PHARMA, sem retry)
    func-->>-core: authorizationID, createdAt, linhas autorizadas
    core->>sess: transaction_code, attendance_hash, authorized_lines
    core->>sess: order_pbm_industry (industry_company_code = 1)
    core-->>-order: ok (reserva vale até 30 dias)

    Note over order,sess: 2. Confirmação (confirmOrderPbmInvoice)
    order->>+core: confirmOrderPbmInvoice (nota emitida)
    core->>+func: Sales_confirmPreAuthorizedSale (uma vez, com a data da reserva)
    func-->>-core: authorizationID da confirmação
    core->>sess: saleAuthorizationId (em authorized_lines)
    alt chave da NF já presente
        Note right of core: vai em invoiceCode na própria confirmação
    else chave tardia
        core->>func: Sales_updateInvoiceCode (id da reserva + saleDate)
        Note right of core: sem retry; se a Funcional recusar, a compra continua confirmada e não é confirmada de novo
    end
    core-->>-order: ok
```

## Reserva (efetiva)

1. O pedido faz **uma** efetiva, com o **preço da loja**.
2. A core chama `Pharma_verifyOptIn` de novo e **uma** `Sales_preAuthorizeSale`, `channel: PHARMA`, **sem retry** (tempo esgotado não cria outra reserva). A reserva vale **até 30 dias**.
3. Entrada: **líquido de loja** (`NetPriceCents` em reais). `maxConsumerPrice` não é enviado (não há coluna de PMC) e `suggested_price_value` permanece nulo.
4. Resposta gravada na sessão:

| Dado Funcional | Campo da sessão | Observação |
|---|---|---|
| `authorizationID` da reserva | `transaction_code` `varchar(64)` | Maior que 64: a efetiva falha e a sessão `Authorizing` é apagada. Não truncar. |
| `createdAt` ISO | `attendance_hash` `varchar(64)` | Vira `preAuthorizationDate`. Maior que 64: a efetiva falha. |
| preço unitário, quantidade e EAN | `authorized_lines` (JSON, fora do GraphQL) | Ex.: 45,10 → 4510. Nova coluna (migration em `OrderPbm.cs`). |
| — | `order_pbm_industry` com `industry_company_code = 1` | Sem essa linha, `SkipConfirmedWithoutIndustry` não cancela depois da nota. |

5. **Item recusado invalida a autorização inteira.**

## Confirmação e nota

1. `Sales_confirmPreAuthorizedSale` **uma vez**, com a data da reserva. A confirmação **não pede preço de novo ao pedido**: lê o preço autorizado de `authorized_lines`.
2. O `authorizationID` da resposta grava em **`saleAuthorizationId`**.
3. **Chave da nota:** se já está presente, vai em `invoiceCode` na confirmação; se é tardia, chama `Sales_updateInvoiceCode` com o id da reserva e `saleDate`. A chave segue **sem protocolo de autenticação**. Falha da chave **não** volta a sessão para `Pending`; se a Funcional recusar a chave, a compra permanece confirmada e **não** é confirmada de novo.
4. Confirmar de novo a mesma reserva falha com "Pre-Autorizacao nao encontrada".

## Quando a Funcional está instável

- Pré-autorização e confirmação: **uma tentativa**. Tempo esgotado não cria outra reserva.
- A efetivação **não troca o preço para o cheio** e **não manda o produto para a Interplayers**.
- Token rejeitado: **uma** renovação; a segunda falha sobe.
- *(Em aberto com o time técnico: token em memória e ausência de retry na chave da NF.)*

## Observabilidade

Log com `OrderId`, código de retorno e se a chave da nota foi enviada. Alarme em falha de efetivação ou confirmação, e **alarme separado** quando a sessão ficou confirmada e a chave falhou (essa compra não é reconfirmada).

Arquivos: `PbmFulfillProviderResolver.cs`, `FulfillPbmTransactionHandler.cs`, `ConfirmOrderPbmInvoiceHandler.cs`, `OrderPbm.cs` e a migration de `authorized_lines`. Teste: `FullyQualifiedName~FuncionalFulfill`.

> O serviço de pedido **não ganha campo novo**: o contrato (`fulfillPbmTransaction`, `confirmOrderPbmInvoice`) é o de hoje.

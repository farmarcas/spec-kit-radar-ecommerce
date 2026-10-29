# PBM - Cancelamento — Funcional (Sequência)

**Fonte:** [análise técnica da Funcional](Integração%20Funcional/funcional-analise-tecnica.md), seções 03 e 08 (28/10/2026). Documento criado em 29/10/2026.
**Referência do fornecedor:** [Fluxo de venda — Cancelamento](Documentação%20Funcional%20Card/fluxo-venda.md).

---

## Diagrama

```mermaid
sequenceDiagram
    participant src as payment-status-sub-service / backoffice-order
    participant kafka as Kafka (order.changed)
    participant sub as order-changed-sub-service
    participant core as api-core
    participant func as Funcional
    participant sess as sessão (order_pbm)

    src->>kafka: Cancelamento
    kafka->>sub: order.changed
    sub->>+core: cancelOrderPbmAuthorization

    alt cancelamento ANTES da nota
        Note right of core: Não existe "anula" na Funcional. Sem HTTP.
        core->>sess: sessão local sai (reopen)
        Note right of func: A reserva remota segue confirmável por até 30 dias,<br/>ou até uma reserva mais nova ser confirmada.
    else cancelamento DEPOIS da nota
        core->>+func: Sales_cancel (channel PHARMA, authorizationID = saleAuthorizationId)
        Note right of core: Sem preAuthorizationID. Fora do mesmo dia, createdAt sai de ConfirmedAt.
        func-->>-core: status 103 = sucesso
    end
    core-->>-sub: ok
```

## Regras

| Momento | Funcional | Interplayers |
|---|---|---|
| **Antes da nota** | **Sem chamada** ao provedor. `AnulaPendingSessionAsync` retorna sucesso sem HTTP antes de montar o payload da Interplayers (que exige `tableId`). A sessão local sai; a reserva remota segue confirmável por até 30 dias, e só cai quando uma reserva posterior é confirmada. | Chama `/anula`, como hoje. |
| **Depois da nota** | **Um** `Sales_cancel` (`channel: PHARMA`) com `authorizationID` = `saleAuthorizationId`, **sem** `preAuthorizationID`. **Status 103 é sucesso.** Fora do mesmo dia, `createdAt` sai de `ConfirmedAt`. | Mantém o comportamento atual. |
| **Janela de 7 dias** | **Não se aplica**: compra Funcional confirmada há mais de sete dias ainda cancela. | Continua com a janela de 7 dias. |
| **Repetir o cancelamento** | Não gera erro novo. | — |

- `Sales_cancel` desfaz **venda confirmada**; não cancela pré-autorização.
- O provider vem do pedido, resolvido por `PbmFulfillProviderResolver` (a janela de 7 dias deixou de ser única).
- Se a Funcional está instável, a chamada falha (sem retry silencioso e sem troca para outro provedor).

Arquivos: `PbmFulfillProviderResolver.cs`, `CancelOrderPbmAuthorizationHandler.cs`. Teste: `FullyQualifiedName~FuncionalFulfill`.

# PBM - Página de produtos (Sequência)

**Fonte original:** diagrama de sequência fornecido pelo usuário (imagem, websequencediagrams.com).
**Atualização 29/10/2026:** incorpora a Funcional ([análise técnica](Integração%20Funcional/funcional-analise-tecnica.md)).

---

## Diagrama

```mermaid
sequenceDiagram
    participant app
    participant bff-mobile-stock
    participant api-orchestrator
    participant api-stock
    participant api-pharmacy
    participant api-core
    participant db as db (load_product)
    participant provider as provider (somente Interplayers)

    app->>+bff-mobile-stock: GET stock-products?pbm=true
    bff-mobile-stock->>+api-orchestrator: get-best-prices
    api-orchestrator->>+api-stock: get-stock
    api-stock-->>-api-orchestrator: << ok >>
    api-orchestrator->>+api-pharmacy: get-pharmacy
    api-pharmacy-->>-api-orchestrator: << ok >>

    alt pbm=true?
        api-orchestrator->>+api-core: get-pbm-details
        api-core->>+db: findProvider (load_product.provider do EAN)
        db-->>-api-core: Interplayers | Funcional | sem linha
        alt provider = Interplayers
            api-core->>+provider: get-product-detail
            provider-->>-api-core: << ok >>
        else provider = Funcional
            Note right of api-core: A Funcional não tem endpoint de detalhe de produto.<br/>O desconto vem da carga (load_product); nenhuma chamada externa.
        else sem linha
            Note right of api-core: EAN fora da base não consulta provedor.
        end
        api-core-->>-api-orchestrator: << ok >>
    end

    api-orchestrator-->>-bff-mobile-stock: << ok >>
    bff-mobile-stock-->>-app: << ok >>
```

> **O que mudou:** o `findProvider` agora resolve entre **dois** provedores a partir de `load_product.provider`. O `get-product-detail` ao vivo continua existindo apenas para a Interplayers; para a Funcional o detalhe do desconto vem da base carregada na madrugada (`discount_min`, `program_name`, `informative_message`, `requires_crm`).
>
> **Confirmado pelo PO (29/10/2026):** a página de produto segue o mesmo fluxo atual da Interplayers (provider por EAN, sem chamada à Funcional fora da consulta/efetiva). O material técnico da Funcional não detalha a operação `get-pbm-details` — o desenho acima segue esse princípio.

## Participantes

| Participante | Papel |
|---|---|
| `app` | Cliente mobile que solicita os produtos da página com flag `pbm=true`. |
| `bff-mobile-stock` | BFF que orquestra a chamada de melhores preços para a página de produtos. |
| `api-orchestrator` | Motor de preço. Consolida estoque, farmácia e detalhes PBM. |
| `api-stock` | Fornece dados de estoque da loja. |
| `api-pharmacy` | Fornece dados da farmácia (elegibilidade). |
| `api-core` | Abstração do domínio PBM. Resolve o provider do EAN e busca detalhes do PBM quando aplicável. |
| `db` | Tabela `load_product`, usada para localizar o `provider` do EAN (`findProvider`). |
| `provider` | Gateway externo que retorna o detalhe do produto (`get-product-detail`) — **só a Interplayers**. |

## Fluxo

1. `app` faz `GET stock-products?pbm=true` para `bff-mobile-stock`.
2. `bff-mobile-stock` solicita `get-best-prices` a `api-orchestrator`.
3. `api-orchestrator` consulta `get-stock` em `api-stock` e `get-pharmacy` em `api-pharmacy`, recebendo `<< ok >>` de ambos.
4. **Se `pbm=true`:** `api-orchestrator` chama `get-pbm-details` em `api-core`, que executa `findProvider` em `load_product`.
   - **Interplayers:** `get-product-detail` no provedor externo, retornando `<< ok >>`.
   - **Funcional:** sem chamada externa; o detalhe sai da base da carga.
   - **Sem linha:** não consulta nenhum provedor.
5. `api-orchestrator` responde `<< ok >>` a `bff-mobile-stock`, que responde `<< ok >>` ao `app`.

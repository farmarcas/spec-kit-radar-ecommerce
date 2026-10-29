# Arquitetura — Radar E-commerce (Squad App)

> Este arquivo estava vazio. Por ora contém apenas a seção de **integrações de PBM**, atualizada em 29/10/2026. Demais seções (stack, serviços de domínio, mensageria) ainda precisam ser preenchidas.

## Integrações de PBM

- **Provedores:** Interplayers (já em produção, em diversas lojas) e Funcional Card (em integração, documentos técnico e de negócio de 28/10/2026).
- **Serviço central:** `ecomm-api-core-dotnet` — abstração do PBM. Lê `load_product.provider` e delega ao client do provedor (`IPbmProviderClient`, factory `Get(PbmProvider)`). É o **único serviço alterado** para a Funcional.
- **Permanecem no contrato de hoje:** app (`ecomm-app-customer-flutter`), `ecomm-bff-mobile-cart-dotnet` (`consumerPbmConsultBatch`, `consumerPbmAdhesionForm`, `submitConsumerPbmAdhesion`), `ecomm-api-orchestrator-product-dotnet` (`storefrontPbmProducts`), `ecomm-api-order-dotnet` (`fulfillPbmTransaction`, `confirmOrderPbmInvoice`, `cancelOrderPbmAuthorization`), `ecomm-bff-mobile-search-dotnet` e `ecomm-bff-mobile-emphasis-dotnet` (leem o Typesense).
- **Dados:** Postgres local, tabela `load_product` (carga diária por provedor); sessão do pedido em `order_pbm` (`transaction_code`, `attendance_hash`, `authorized_lines`).
- **Busca:** a core publica o desconto no Typesense pelo evento Kafka `Pbm:Typesense` (campo `PbmDiscountMin`); o índice não muda.
- **Externo:** HUB Interplayers; gateway de credenciados da Funcional (`stores.funcionalmais.com/graphql`, homologação `stores-uat.funcionalmais.com/graphql`, origem `PARTNERS_ECOMMERCE`).

Detalhes: `specs/features/001-app-ecommerce/PBM/arquitetura-pbm.md` e `specs/features/001-app-ecommerce/PBM/Integração Funcional/`.

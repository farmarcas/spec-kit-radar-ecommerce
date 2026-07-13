# Monitoramento de erros — Gateway de Pagamento Braspag

## Contexto

O Radar E-commerce processa pagamentos através do gateway **Braspag**. Erros nessa integração impactam diretamente a NSM (Volume de Transações por Loja Ativa), pois bloqueiam a finalização de compra do Consumidor.

Serviços envolvidos (Datadog APM, env:prod):
- `ecomm-api-payment-dotnet`
- `ecomm-bff-mobile-payment-dotnet`
- `ecomm-bff-backoffice-payment-dotnet`
- `ecomm-sub-service-payment-cancel-dotnet`
- `ecomm-api-payment-config-dotnet` (usado para resolver a loja de um erro)

## Catálogo de erros conhecidos

- **"Merchant is blocked" (código 306)** — bloqueio persistente da loja no gateway (`process-transaction`/`create-pix-transaction`).
- **OAuth2 `invalid_client`** — falha de autenticação (ClientId/ClientSecret) na API de tokenização Braspag (`protectedcard/tokenize`, `auth.braspag.com.br/oauth2/token`).
- **"Could not get Credit Card" (130)**, **"MerchantKey is invalid" (132)**, **"Affiliation not found" (129)** — erros de configuração do gateway por loja.
- **500 genérico** em `POST /mobile/payment/create-pix`, cascata 500/400 em ativação de loja (`bff-backoffice-payment → payment-config`), `NullReferenceException`, 502/504 do lado Braspag, cartão inválido (CP990/CP900), erros de endereço/parcelas (152/154/123).
- **Não são falhas reais de pagamento** (excluir da análise): desconexões de broker Kafka (`rdkafka`, "Disconnected", "brokers are down") em consumers de `payment-status`/`payment-cancel`.

Uma mesma loja (PharmacyId) aparecendo em múltiplos tipos de erro distintos é sinal de problema de configuração mais amplo naquela loja, não de incidentes isolados.

## Como correlacionar erro → loja (PharmacyId)

O span de erro no Datadog **não carrega o PharmacyId da loja** — ele precisa ser resolvido via um span irmão no mesmo `trace_id`:

1. Agrupar erros por `trace_id` (com `MIN(timestamp)`) via `aggregate_spans` — evitar `search_datadog_spans` bruto, o payload por span é verboso e trunca.
2. Resolver o PharmacyId em lotes de ~20-25 `trace_id` via `aggregate_spans` na query `service:ecomm-api-payment-config-dotnet resource_name:"GET /configurationstore/{pharmacyid}" trace_id:(id1 OR id2 OR ...)`, agrupado por `trace_id, @http.url`. O GUID é o segmento final da URL após `/ConfigurationStore/`.
3. Fallback: `GET /purchasertoken/{pharmacyid}` no mesmo serviço, mesma lógica.

**Limitação conhecida:** o Datadog só expõe o PharmacyId (GUID). O CNPJ da loja é dado de negócio do Radar (banco interno/Portal), não é observável no Datadog.

## Rotina diária automatizada

Rotina no claude.ai (`RemoteTrigger`/cloud agent), não é um cron local:

- **Nome:** "Análise diária de erros Braspag - Radar E-commerce"
- **Trigger ID:** `trig_01SKNu2YRaXfbE4BBPG9A3G5`
- **Agendamento:** `0 11 * * *` UTC = 8h America/Sao_Paulo, diariamente
- **URL:** https://claude.ai/code/routines/trig_01SKNu2YRaXfbE4BBPG9A3G5
- **Conectores MCP anexados:** Datadog (`connector_uuid: 354c223f-9e27-4e60-a17f-2ef2ad95b723`)
- **O que faz:** analisa os erros Braspag das últimas 24h usando a metodologia acima, categoriza pelo catálogo conhecido, exclui ruído de Kafka, e destaca lojas com múltiplos tipos de erro. Se o conector do Datadog não estiver disponível na execução, a rotina informa isso explicitamente em vez de inventar dados.
- **Notificação:** Slack habilitado (`notifications.channel.slack: true`), mas ainda enviando só para a conta pessoal (DM), não para um canal do time — pendente anexar o conector MCP do Slack e configurar o canal de destino (ex: `#pagamentos-alertas`) no prompt da rotina.

## Status em 2026-07-13

Rotina criada, prompt configurado, Datadog conectado e testado com sucesso (execução manual). Próximo passo: configurar postagem em canal Slack do time.

# DD-007 - orchestrator: connection refused em dependência downstream

## Identificação

| Campo | Valor |
|---|---|
| ID | DD-007 |
| Exceção | System.Net.Http.HttpRequestException |
| Mensagem | Connection refused (ecomm-api--dotnet-service:80) - agrupado como (*) no Datadog |
| Serviço (origem) | ecomm-api-orchestrator-product-dotnet |
| Ambiente | prod |
| Versão | main-7a1fbb7_7a1fbb7 (atual), main-e43c310 (first seen) |
| Count | 118 |
| Impacto Datadog | 8 users, 4 views |
| First seen | ~2 meses atrás |
| Last seen | contínuo (~54 min atrás) |
| Operação APM | http.request |
| Repo | github.com/farmarcas/ecomm-api-orchestrator-product-dotnet |

## Classificação

| Dimensão | Valor |
|---|---|
| Tipo | Infra transitória (pod restart / rolling deploy) + falta de resiliência no orchestrator |
| Canal | App mobile - preço/estoque/catálogo agregados |
| App mobile | Impacto direto quando ocorre - /orchestrator/products/v2/price retorna 500 |
| Portal / BackOffice | Indireto |
| Confiança na causa | Alta (neste sample: pharmacy); média para outros hosts agrupados em (*) |

## Sintoma

O orchestrator agrega catálogo + estoque + preço + oferta + farmácia em paralelo. Quando qualquer dependência recusa conexão TCP (porta 80), a exceção sobe e o endpoint retorna 500. Consumidores downstream (ex.: `ecomm-api-mobile-stock-dotnet`) também falham.

Sample analisado (Jul 02 09:34):
```
mobile-stock -> GET orchestrator/products/v2/price -> 500
orchestrator -> catalogue 200 | stock 200 | price 200 | offer 200 | pharmacy REFUSED
```

Neste trace, não foi a Offer API que falhou (contrário ao que o Bits AI sugeriu). Foi `ecomm-api-pharmacy-dotnet-service`:

```
GET http://ecomm-api-pharmacy-dotnet-service/Pharmacy/{id}?useCache=true
```

## Investigação

Evidências Datadog:
- SocketException (111): Connection refused - TCP rejeitado (pod ausente/reiniciando, endpoints vazios)
- Issue agrupa múltiplos hosts em Connection refused (*) - cada sample pode ser pharmacy, offer, catalogue, etc.
- Bits AI apontou `ecomm-api-offer-dotnet-service` - não bate com o waterfall deste sample

Código no orchestrator (repo local):

Chamada pharmacy:
```csharp
public async Task<PharmacyData> GetPharmacyAsync(string pharmacyId)
{
    var uri = URL_PHARMACY_API + $"/Pharmacy/{pharmacyId}?useCache=true";
    // ...
    var response = await _apiClient.GetAsync(uri);
```

Exceção propagada sem retry:
```csharp
private async Task<PharmacyData> GetPharmacy(string pharmacyId)
{
    try
    {
        var data = await _pharmacyApiClient.GetPharmacyAsync(pharmacyId);
        return data;
    }
    catch (Exception f)
    {
        throw f;
    }
}
```

Hipóteses (ordem de probabilidade):
1. Rolling deploy / restart do serviço downstream (pharmacy neste sample) - janela sem endpoints ready
2. Pod em CrashLoop momentâneo ou readiness probe atrasada
3. Karpenter/node drain - pods recriados no mesmo node
4. (menos provável neste sample) serviço cronicamente down - volume baixo (118 em 2 meses ~ 2/dia) sugere transitório

Validar com DevOps:
```bash
# Para o serviço que falhou no sample (pharmacy)
kubectl get po,svc,endpoints -l app=ecomm-api-pharmacy-dotnet
kubectl describe deploy ecomm-api-pharmacy-dotnet
kubectl get events --field-selector reason=Killing | grep pharmacy

# Correlacionar timestamp do erro com restart de pod
kubectl rollout history deploy/ecomm-api-pharmacy-dotnet
```

Diferença vs DD-005 (WhatsApp): lá o serviço parece crônico (299 erros, 130 users). Aqui volume é menor e no sample analisado outras deps responderam 200 - padrão de janela transitória.

## Impacto no cliente

| Nível | Avaliação |
|---|---|
| Preço/produto no app | Alto quando ocorre - orchestrator 500 -> mobile-stock 500 |
| Frequência | Média-baixa - 118 em ~2 meses |
| Users | 8 users reportados no Datadog |

## Correção proposta

### Opção A - Infra (reduzir ocorrência)
1. Revisar PodDisruptionBudget e estratégia de rolling update (`maxUnavailable: 0`)
2. Garantir readinessProbe robusta antes de receber tráfego
3. Investigar restarts frequentes nos deployments downstream (pharmacy, offer, etc.)
4. Correlacionar erros com deploys via tags version nos spans

Aceite: queda de 50%+ nos connection refused pós-deploy.

### Opção B - Código no orchestrator (resiliência)
1. Polly retry em todos os HttpClients (offer, pharmacy, catalogue, stock, price) - retry em Connection refused e 503 (2-3 tentativas, backoff curto)
2. Cache local de PharmacyData (já usa `useCache=true` no endpoint - considerar cache no orchestrator para tolerar falha momentânea)
3. Degradar parcialmente em vez de 500 total quando pharmacy falhar mas price/stock OK (avaliar regra de negócio)

Aceite: orchestrator retorna 200 na maioria dos restarts transitórios; 500 só após esgotar retries.

### Opção C - Observabilidade
1. Não ignorar cegamente - Bits AI sugere ignore; OK para ruído pontual, mas 8 users com 500 no app justifica monitoramento
2. Alerta se connection refused > N/min em qualquer dep do orchestrator
3. Separar issues Datadog por `peer.service` em vez de agrupar (*)

## Priorização

| Campo | Valor |
|---|---|
| Prioridade | P1 (impacto no app quando ocorre) / P2 se confirmado 100% transitório e retry resolve |
| Esforço | S (retry Polly) / M (investigar restarts) |
| Owner | Squad Orchestrator + Plataforma |

## Posição sobre "Ignore" (Bits AI)

Parcialmente concordo: não é bug de lógica de negócio. Porém não ignorar completamente - 500 no fluxo de preço afeta usuários reais. Recomendação: tratar como resiliência + estabilidade de deploy, não como falso positivo.

## Checklist

- [ ] Identificar qual downstream falha em cada sample (não assumir offer)
- [ ] Correlacionar timestamps com restarts/deploys do serviço afetado
- [ ] Revisar PDB + rolling update dos deps críticos (pharmacy, offer, catalogue, stock, price)
- [ ] Implementar retry Polly nos ApiClients do orchestrator
- [ ] (Opcional) Cache pharmacy no orchestrator
- [ ] Separar monitoramento por peer.service
- [ ] Reavaliar no Datadog após 7 dias

# DD-004 - authentication: DNS failure ao enviar evento PostHog

## Identificação

| Campo | Valor |
|---|---|
| ID | DD-004 |
| Exceção | System.Net.Http.HttpRequestException |
| Mensagem | Name or service not known (app.events.edelivery.febrafar.com.br:443) |
| Inner | System.Net.Sockets.SocketException: Name or service not known |
| Serviço | ecomm-api-authentication-dotnet |
| Ambiente | prod |
| Versão | main-25d5415 |
| Count | 349 |
| Impacto Datadog | 3 users, 2 views |
| First seen | ~2 meses atrás |
| Last seen | contínuo (visto há minutos) |
| Operação APM | http.request |
| Request falho | POST https://app.events.edelivery.febrafar.com.br/capture/ |
| Fluxo | POST /auth/request-password-change -> SendGrid 202 -> PostHog capture |
| Error handling | handled - endpoint retorna 200 ao cliente |

## Classificação

| Dimensão | Valor |
|---|---|
| Tipo | Config / DNS / infra (proxy PostHog inexistente ou mal configurado) |
| Canal | App mobile - fluxo de recuperação de senha |
| App mobile | Impacto parcial - senha funciona; analytics/telemetria falha |
| Portal / BackOffice | Não |
| Confiança na causa | Alta |

## Sintoma

Após processar `request-password-change` com sucesso (PIN gravado, e-mail SendGrid enviado), a API tenta publicar evento no PostHog via `app.events.edelivery.febrafar.com.br/capture/`. O hostname não resolve em DNS (NXDOMAIN / Name or service not known). O erro é tratado (handled), mas aparece 349 vezes no Error Tracking.

## Investigação

Evidências Datadog (waterfall):
```
mobile app -> BFF login -> auth/request-password-change (200)
  -> PostgreSQL account_data (SELECT + UPDATE)
  -> api.sendgrid.com/v3/mail/send (202)
  -> app.events.edelivery.febrafar.com.br/capture/ (DNS fail)
```

Padrão de config no ecossistema (repo local):

Em prod, outros serviços apontam para o mesmo hostname customizado de PostHog:
```json
"Posthog": {
  "URL": "https://app.events.edelivery.febrafar.com.br/capture/",
  "Key": "phc_WP0eOeQ74hiu6SHT5egKx0an6OAt7O1OqSariqcj4RH"
}
```

Staging/dev usam `https://app.posthog.com/capture/` - hostname que resolve.

Hipóteses (ordem de probabilidade):
1. Registro DNS `app.events.edelivery.febrafar.com.br` nunca criado ou removido em prod
2. Proxy/reverse-proxy PostHog self-hosted não deployado ou desligado
3. Config de prod copiada antes do proxy existir; staging nunca foi alinhado
4. (menos provável) restrição de rede no cluster - mas a mensagem é DNS, não timeout/firewall

Validar com DevOps/Plataforma:
```bash
dig app.events.edelivery.febrafar.com.br
nslookup app.events.edelivery.febrafar.com.br
curl -v https://app.events.edelivery.febrafar.com.br/capture/
```
- Existe CNAME/A no Route53?
- Há ingress/ALB para PostHog proxy no EKS?
- Qual é o endpoint correto de prod (PostHog Cloud vs proxy interno)?

Validar no repo `ecomm-api-authentication-dotnet`:
- Config `Posthog:URL` (appsettings, secrets K8s, AWS Secrets Manager)
- Onde o evento é enviado após `request-password-change`
- Se falha de PostHog deve ser fire-and-forget (como no order BFF)

Referência de tratamento no order BFF - falha PostHog vira LogWarning, não quebra fluxo:
```csharp
catch (Exception e)
{
    _logger.LogWarning(e, "[PostHogApiClient][Send] Erro request PostHog, {message}", e.Message);
}
```

## Impacto no cliente

| Nível | Avaliação |
|---|---|
| Funcional (recuperar senha) | Baixo - fluxo principal retorna 200; e-mail SendGrid enviado |
| Analytics / produto | Médio - eventos de auth (ex.: password change) não chegam ao PostHog |
| Observabilidade | Médio - 349 erros; Datadog associa a 3 users |
| Risco sistêmico | Outros serviços em prod com mesma URL PostHog podem ter o mesmo problema silencioso |

## Correção proposta

### Opção A - Infra / DNS (fix principal se proxy for intencional)
1. Criar registro DNS `app.events.edelivery.febrafar.com.br` (CNAME -> PostHog Cloud ou ALB do proxy)
2. Garantir proxy PostHog deployado e saudável no EKS
3. Validar TLS e rota `/capture/`

Aceite: `dig` resolve; curl POST `/capture/` retorna 200; zero DNS errors por 7 dias.

### Opção B - Config (fix rápido se proxy não for necessário)
1. Atualizar `Posthog:URL` no `ecomm-api-authentication-dotnet` prod para endpoint funcional (ex.: `https://app.posthog.com/capture/` ou URL interna correta)
2. Revisar todos os serviços prod que usam `app.events.edelivery.febrafar.com.br` (auth, order BFF, etc.)

Aceite: eventos PostHog passam a ser recebidos; validar no dashboard PostHog.

### Opção C - Código (complementar)
1. Garantir que falha PostHog não gera span error no Datadog (fire-and-forget + LogWarning)
2. Métrica `posthog.send.failed` em vez de Error Tracking para falhas de telemetria

## Priorização

| Campo | Valor |
|---|---|
| Prioridade | P1 (impacto em users + fluxo de login; funcionalidade core ok) |
| Esforço | S (DNS/config) / M (deploy proxy PostHog) |
| Owner | Plataforma/DevOps + squad Auth |

## Checklist

- [ ] Confirmar se app.events.edelivery.febrafar.com.br deve existir em prod
- [ ] Validar DNS (dig / Route53)
- [ ] Conferir Posthog:URL no secret/deployment do auth API
- [ ] Listar outros serviços com mesma URL em prod
- [ ] Corrigir DNS ou config
- [ ] Validar evento no PostHog após password change
- [ ] (Opcional) Ajustar código para não poluir Error Tracking
- [ ] Resolver no Datadog e monitorar 7 dias

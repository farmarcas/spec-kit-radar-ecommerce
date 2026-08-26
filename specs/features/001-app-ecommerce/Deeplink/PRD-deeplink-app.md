# PRD — Deep Link no App (roteamento para telas específicas)

**Produto:** Radar (App — Consumidor Final)
**Squad:** App
**Autor:** Daniel (PO) — consolidado a partir do Spike ECA-833
**Status:** Homologado por Thiago (coordenador) — histórias iniciais já criadas; parte da spec ainda bloqueada por definição de hosts
**Versão:** 1.0

---

## 0. Changelog

**v1.0 (2026-08-26)** — Primeira versão. Consolida no repositório o resultado do Spike [ECA-833](https://farmarcas.atlassian.net/browse/ECA-833) e a documentação técnica [APP Deeplinking v2](https://farmarcas.atlassian.net/wiki/spaces/FE/pages/4252073989/APP+Deeplinking+v2) (Confluence, autoria de Leon Vitor Mansoni Viana), que até então só existiam fora do Spec Kit. Homologação do Thiago (coordenador) tratada como concluída por confirmação verbal do PO — não há registro formal no Jira/Confluence, sinalizado aqui para rastreabilidade.

---

## 1. Contexto

Baseline: o app **não possui deep linking nativo hoje** — sem dependência `app_links` no `pubspec.yaml`, sem `intent-filter` de App Links no Android (`AndroidManifest.xml`), sem Associated Domains/URL schemes no iOS (`Info.plist`). Já existe, porém, um sistema maduro de navegação por intent — `AppPage` (rotas nomeadas), `IntentType`/`LaunchIntent` (contrato de ação) e `IntentHandler`/`Launcher` (execução) — que é o destino natural dos deep links.

Motivação de negócio (ver descrição do Spike ECA-833): permitir que os **lojistas façam anúncios em ambientes digitais com links específicos das suas lojas** — principalmente links de produto — de forma que o cliente seja levado direto à tela certa dentro do app, respeitando todo o contexto de navegação da loja (configurações, preço, estoque). O Spike retomou um estudo anterior, iniciado pela Vuelma, para reavaliar a viabilidade da feature.

> Nota sobre o termo no roadmap: `assets/roadmap/roadmap-app-q3-2026.md` e `context/product.md` citam "Novo checkout (Deeplink)" como entrega de julho/Q3, associando deeplink a "receber os dados necessários para formular preço" no checkout. Não foi encontrada, em nenhum documento do repositório ou nos artefatos do Spike, uma feature de checkout que use deeplink com esse propósito — o Spike ECA-833 e a doc técnica tratam exclusivamente de **navegação/roteamento** (abrir o app em produto, vitrine, campanha, departamento, etc.), não de precificação de checkout. Tratamos essa menção como uma descrição imprecisa/desatualizada do mesmo tema de deeplink, não como uma feature paralela — mas vale confirmar com quem escreveu o roadmap se havia algo adicional em mente.

## 2. Objetivo

Permitir abrir o app diretamente em produto, vitrine, campanha/promoção, departamento, busca, ofertas, etc., a partir de um link — funcionando com o app fechado (cold start) e em background (warm start), suportando Universal Links/App Links e custom scheme (fallback), e permitindo que o Portal gere esses links e QR Codes com o mesmo contrato de URL.

**Impacto na NSM:** sustenta os anúncios digitais dos lojistas (principal motivação do Spike) ao levar o consumidor direto ao produto/oferta anunciado, reduzindo fricção de navegação e protegendo o Volume de Transações por Loja Ativa.

## 3. Escopo

### Documentado nesta spec (consolidação da doc técnica v2)
- Contrato de URL — formatos, hosts/scheme por flavor, destinations ↔ `IntentType` (seção 5 abaixo)
- Arquitetura de parsing/roteamento no app: `DeepLinkService` (parser) → `DeepLinkCoordinator` (fila) → `LaunchIntent` → `Launcher` → `IntentHandler` existente
- Configuração nativa Android (`intent-filter`, `assetlinks.json`) e iOS (Associated Domains, `apple-app-site-association`, `CFBundleURLTypes`)
- Proposta de API do Portal para geração de link + QR Code
- Regras de segurança e edge cases (open redirect, flavor errado, usuário sem loja, link expirado, etc.)

### Já convertido em histórias (sprint atual — App)
- [ECA-993](https://farmarcas.atlassian.net/browse/ECA-993) — Parser e roteamento de deeplinks para telas do app
- [ECA-994](https://farmarcas.atlassian.net/browse/ECA-994) — Fila de deeplink respeitando bootstrap e seleção de loja
- [ECA-995](https://farmarcas.atlassian.net/browse/ECA-995) — Suporte a custom scheme (fallback) por flavor

Essas três histórias **não dependem** da definição final dos hosts — usam apenas mapeamento de `destination` e custom scheme, já fechados na doc técnica.

### Ainda não fatiado em histórias — bloqueado por dependência externa
- **Universal Links/App Links (HTTPS) por flavor**, publicação de `assetlinks.json`/`apple-app-site-association` — bloqueado até os hosts reais serem confirmados com portal/infra (a doc técnica marca os hosts atuais como "exemplos ilustrativos")
- **API do Portal de geração de link + QR Code** — depende do host definido; é trabalho da Squad Portal, não da Squad App
- **Landing/fallback de loja de app** para quem não tem o app instalado — depende do host e provavelmente de Squad Portal/infra

## 4. Decisões de arquitetura e de processo (registradas no Spike)

- **Deep links nunca chamam `Navigator` diretamente** — são sempre convertidos em `LaunchIntent` e executados via `Launcher`, reaproveitando os `IntentHandler` já existentes no app.
- **Não existe roteamento orgânico.** Joceli levantou, nos comentários do ECA-833, que se o backend mandar uma rota que corresponde a um módulo do front (ex.: `app://campanhas`) o app só direciona se já existir um handler específico para aquele destino — não há um mecanismo genérico. Leon confirmou: o app já tem o parser de `IntentType`, então **sempre** haverá um handler explícito no app para cada rota. **Implicação de processo:** toda nova rota de deeplink criada no futuro precisa ser alinhada entre Portal e Front antes de ir ao ar — não é algo que o Portal possa introduzir sozinho.
- **É possível trocar de loja via link.** Daniel perguntou se dá para direcionar o cliente a um produto considerando que ele já tem loja selecionada, e também trocá-lo de loja se necessário. Leon confirmou: sim, basta passar o id da farmácia junto com o id do produto.

## 5. Contrato de URL (resumo)

```
Universal / App Link (preferencial — QR, SMS, e-mail, portal):
  https://{host}/app/{destination}?{params}

Custom scheme (fallback / debug / campanhas internas):
  {scheme}://{destination}?{params}
```

| Flavor | Host Universal Link (exemplo, não confirmado) | Custom scheme |
|---|---|---|
| superPopular | links.superpopular.com.br | superpopular |
| maisfarma | links.maisfarma.com.br | maisfarma |
| stage/dev | links-stg.radarfarmarcas.com.br | radardev |

| Path (`destination`) | IntentType | Args |
|---|---|---|
| product | PRODUCTS_PRODUCT_DETAILS_PAGE | Obrigatório: `productId` |
| showcase | SHOWCASE_PRODUCTS | Obrigatório: `showcaseType`; `familyGroupId` se `FAMILYOFFERS`; opcional `pageTitle` |
| promotion-products | PROMOTION_PRODUCTS | Opcional: `promotionProductsId` |
| campaign / promotions | CAMPAIGN_PAGE | (nenhum) |
| department | DEPARTMENTS_PAGE | Opcional: `departmentId` |
| offers | OFFERS_ACTIVE_OFFERS_PAGE | Conforme intent escolhido |
| offer | OFFER_ITEMS_PAGE | Obrigatório: `offerId` |
| search | PRODUCTS_SEARCH_PRODUCT_PAGE | Termo de busca |
| home | MAIN_PRODUCTS_PAGE | (nenhum) |
| login | AUTH_LOGIN_PAGE | (nenhum) |

Params de tracking opcionais (capturados para analytics, não repassados ao handler): `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `ref`, `qr_id`.

> Contrato completo (valores de `showcaseType`, exemplos de URL, pseudocódigo do parser, configuração nativa Android/iOS, API do Portal, segurança) na doc técnica: [APP Deeplinking v2](https://farmarcas.atlassian.net/wiki/spaces/FE/pages/4252073989/APP+Deeplinking+v2).

## 6. Casos de borda (resumo — detalhado na doc técnica, seção 7)

| Caso | Comportamento |
|---|---|
| Host/scheme de outro flavor | Ignorar |
| `productId` inexistente | Handler/store trata erro da tela de produto |
| Usuário sem loja selecionada | Fila até concluir fluxo de localização/seleção de loja |
| Force update / maintenance overlay ativo | Não empurrar deep link por cima; reprocessar após liberar |
| Link expirado (short link) | Landing "campanha encerrada" → home |
| Open redirect | Só paths `/app/*` conhecidos; nunca abrir URL arbitrária do query |

## 7. Pendências

- **Hosts reais por flavor** ainda não confirmados com portal/infra — bloqueia Universal Links/App Links, `assetlinks.json`/`apple-app-site-association` e o contrato final da API do Portal.
- **Escopo do Portal** (API de geração de link/QR Code) ainda não fatiado em histórias — depende de definição conjunta com a Squad Portal.
- Ambiguidade entre a descrição de "Deeplink" no roadmap (ligado a checkout/precificação) e o escopo real do Spike (navegação/roteamento) — ver nota na seção 1.

## 8. Referências

- Spike: [ECA-833](https://farmarcas.atlassian.net/browse/ECA-833) (spike anterior relacionado: [ECA-278](https://farmarcas.atlassian.net/browse/ECA-278), iniciado pela Vuelma)
- Épico: [ECA-97 — Deep Link](https://farmarcas.atlassian.net/browse/ECA-97)
- Documentação técnica: [APP Deeplinking v2](https://farmarcas.atlassian.net/wiki/spaces/FE/pages/4252073989/APP+Deeplinking+v2) (Confluence, espaço FE)
- Miro (estudo original): https://miro.com/app/board/uXjVG--fOYA=/
- Histórias criadas: ECA-993, ECA-994, ECA-995

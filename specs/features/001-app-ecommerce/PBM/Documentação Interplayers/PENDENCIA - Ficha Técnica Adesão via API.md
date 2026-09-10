# Pendência: Ficha Técnica — Adesão Shopper / Adesão Produto via API

**Status:** Campos e ordem do opt-in confirmados de forma informal (WhatsApp, 25/08/2026); história já criada no Jira. Falta apenas a Ficha Técnica formal da Interplayers (endpoint exato + nome do campo de opt-in) antes de ir para produção.
**Relacionado a:** [ECA-630 — PBM: Consulta e cadastro de consumidores](../US/ECA-630.doc) (história original) · [ECA-979](https://farmarcas.atlassian.net/browse/ECA-979) (história criada a partir desta pendência) · [Draft local da história](../US/ECA-630-atualizacao-cadastro-via-api.md)

---

## Contexto

O fluxo atual de cadastro/adesão do consumidor a um programa PBM (Fase 1) usa a **Adesão via URL Externa**: quando o programa possui uma URL cadastrada na Interplayers (`Possui URL? = Sim`, ver macrofluxo "Compra Shopper" em [`2 - Manual de Projeto E-Commerce Ativo V2.md`](2%20-%20Manual%20de%20Projeto%20E-Commerce%20Ativo%20V2.md)), o app abre essa URL em um browser indexado — experiência ruim para o consumidor.

A Interplayers confirma, desde o kickoff técnico de 07/07/2026, que existe um **segundo modelo (Adesão Direta via API)**: a Farmarcas constrói a própria tela (nome, e-mail, data de nascimento) e envia o cadastro — incluindo o opt-in de LGPD — diretamente via API, sem depender de URL externa (ver [`2026-07-07-kickoff-farmarcas-interplayers.md`](../../../../reuniões/transcrições/2026-07-07-kickoff-farmarcas-interplayers.md), trechos 00:42:48–00:45:11). Nessa reunião, Thiago Fernandes (Farmarcas) já pediu essa documentação à Interplayers ("Vocês podem fornecer também essas APIs?"), e Felipe (Interplayers) confirmou verbalmente ("Tá bom"), mas a Ficha Técnica correspondente **nunca foi entregue/registrada** neste repositório — diferente das demais funcionalidades (Token, LoadTables, Consulta Produto, Consulta Desconto, Carrinho, Efetivação, Finalização, Cancelamento, Extrato), que têm ficha técnica própria nesta pasta.

O PDF anexado por Daniel em 25/08/2026 (`1- Manual Conceitos HUB WS 2v2.pdf`) foi conferido e é **idêntico** ao Manual de Conceitos já presente neste diretório — não contém os campos de request/response do cadastro via API.

## O que falta pedir formalmente à Interplayers

1. Ficha Técnica completa da(s) funcionalidade(s) **"Adesão Shopper"** e **"Adesão Produto"** via API (nomes conforme lista de WS do macrofluxo) — request/response, campos obrigatórios/opcionais, tipos e tamanhos, no mesmo padrão das fichas técnicas já recebidas (ex.: [`7 - Ficha Técnica Carrinho.md`](7%20-%20Ficha%20Técnica%20Carrinho.md)).
2. Como o opt-in/LGPD é representado nesse modelo (Felipe mencionou que cadastro + LGPD podem ser enviados "de uma vez só").
3. Se esse modelo de API está disponível **por programa/indústria** (relacionado ao atributo `Possui URL?`) ou pode ser solicitado de forma geral para os programas hoje ativos na Farmarcas.
4. Endpoint de homologação equivalente para testar esse fluxo.

## Impacto caso a resposta demore

A regra de negócio da história (priorizar cadastro interno via API e usar a URL externa apenas como fallback) pode ser escrita desde já, mas os **critérios de aceite em Gherkin com campos específicos de API** e as tarefas de backend não podem ser detalhados com precisão até a Ficha Técnica ser recebida — evita-se assim inventar contrato de API não confirmado pela Interplayers.

---

## Atualização — 25/08/2026: resposta parcial recebida via WhatsApp

A Interplayers respondeu ao pedido: *"para todas industrias aqueles campos que nos solicitamos como premissa no envio da API já são suficiente"*.

**Confirmado:** os campos são o array `consumer[1]` já documentado na [Ficha Técnica Consulta Desconto V3 (PrePreenchimento)](6%20-%20Ficha%20Tecnica%20Consulta%20Consulta%20Desconto%20V3%20(PrePreenchimento).md#51-body) (seção 5.1 BODY): `holderId` (CPF, obrigatório se não houver dados de cartão), `name`, `birthdate`, `gender`, `email`, `cellphone`/`phone`, `postalCode`, `stateCode`, `cityName`, `cityRegion`, `addressType`, `streetAddress`, `addressNumber`, `addressAdditionalInformation`. Vale para todas as indústrias/programas — não há formulário dinâmico por programa (diferente do modelo Funcional Card).

**Ainda em aberto — ordem do opt-in LGPD:** a Ficha Técnica #6 documenta o modelo de *pré-preenchimento de URL* (Modelo A), cujo fluxograma mostra a ordem **LGPD primeiro, depois o formulário de adesão** — dois desvios de fluxo separados, ambos resolvidos via URL (`urlAcceptTerm`/`informativeLink`).

Já o modelo que estamos buscando (100% API, sem nenhuma URL — Modelo B) foi descrito **apenas verbalmente** por Felipe (Interplayers) no kickoff de 07/07/2026 (ver [transcrição](../../../../reuniões/transcrições/2026-07-07-kickoff-farmarcas-interplayers.md), linhas 349-361), com a ordem **invertida**: campos cadastrais primeiro, opt-in LGPD por último, tudo enviado junto em uma única chamada. Esse modelo nunca foi formalizado em Ficha Técnica.

**Pergunta de acompanhamento enviada à Interplayers (25/08/2026):** confirmar se, no modelo 100% API, a ordem é campos → opt-in LGPD (tudo em uma chamada, conforme descrito verbalmente), ou se o LGPD ainda exige uma chamada/desvio separado antes dos campos, como no Modelo A.

**Não travar os critérios de aceite da ECA-630 quanto à ordem/mecânica do opt-in até essa confirmação chegar por escrito** — a resposta verbal do kickoff não é um contrato de API confirmado.

---

## Atualização — 25/08/2026: ordem do opt-in confirmada por escrito (WhatsApp)

Resposta da Interplayers ao ser perguntado sobre a ordem do opt-in no modelo 100% API:

> "coloca o cpf, faz a consulta" → "preenche os campos" → "e aceita o optin que vem junto com o formuláro" → **"isso mesmo"** (confirmado)
> "o que eu entendi tb é que o optin passa a ser no final" → **"mas o cenario ja seria preencher os 2 formularios em uma unica vez"** → **"sem sair dessa pagina do app"**

**Fluxo confirmado (Modelo B — Adesão Direta via API):**

1. App captura o CPF do consumidor e faz a consulta (Consulta Desconto/produto)
2. App exibe formulário nativo com os campos cadastrais (`consumer[1].*`, ver seção anterior)
3. O opt-in do termo LGPD é exibido **junto/ao final do mesmo formulário** — não é uma chamada ou desvio de fluxo separado
4. Cadastro + aceite do opt-in são enviados **em uma única submissão** à API da Interplayers
5. Todo o fluxo ocorre **sem sair da página/tela do app** (sem WebView, sem URL externa)

Isso é o **inverso** da ordem do Modelo A (URL/pré-preenchimento, hoje em produção): lá o LGPD é um desvio de fluxo separado e resolvido **antes** do formulário de adesão, ambos via URL.

**Nível de confiança:** confirmação por escrito (WhatsApp), mas ainda informal — não é uma Ficha Técnica formal assinada/publicada pela Interplayers. Recomenda-se, antes de ir para produção, obter a Ficha Técnica formal com o endpoint exato, nome do campo booleano/estrutura do opt-in (ex.: algo como `consumer[1].optIn` ou `consumer[1].termsAccepted` — **nome do campo ainda não confirmado**) e o WS de submissão (possivelmente a própria `ConsultaDescontoV3`/`Carrinho` com o array `consumer[]` completo, ou um WS dedicado de "Adesão Shopper/Adesão Produto" ainda não documentado).

**Pronto para redigir os critérios de aceite da ECA-630** com base neste fluxo (campos → opt-in → envio único, nativo), mantendo como item de risco/DoD a obtenção da Ficha Técnica formal antes do desenvolvimento em produção.

---

## Atualização — 25/08/2026: história criada no Jira

Critérios de aceite redigidos e história criada como [ECA-979](https://farmarcas.atlassian.net/browse/ECA-979) (filha do épico ECA-28), com todo o conteúdo desta pendência refletido na descrição da história (campos `consumer[1]`, ordem do opt-in, e o item de risco da Ficha Técnica formal no DoD). Espelho local em [`ECA-630-atualizacao-cadastro-via-api.md`](../US/ECA-630-atualizacao-cadastro-via-api.md).

Esta pendência permanece **aberta** apenas para o item: obter a Ficha Técnica formal da Interplayers (endpoint exato + nome do campo de opt-in). Quando recebida, atualizar este arquivo, o arquivo espelho da história e a própria ECA-979 no Jira, e marcar o item correspondente do DoD como concluído.

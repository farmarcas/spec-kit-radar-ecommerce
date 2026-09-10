# [Atualização] ECA-630 — PBM: Cadastro de consumidores via API (sem browser externo)

**Jira:** [ECA-979](https://farmarcas.atlassian.net/browse/ECA-979) (criada em 25/08/2026, filha do épico ECA-28)
**Épico:** Integração PBM (ECA-28)
**História de origem:** [ECA-630 — PBM: Consulta e cadastro de consumidores](ECA-630.doc)
**Tipo:** História | **Prioridade:** High

**Fontes utilizadas:**
- [ECA-630 (original)](ECA-630.doc) — regras de negócio e URLs já existentes
- [Ficha Técnica Consulta Desconto V3 (PrePreenchimento)](../Documentação%20Interplayers/6%20-%20Ficha%20Tecnica%20Consulta%20Consulta%20Desconto%20V3%20(PrePreenchimento).md) — campos do array `consumer[1]`
- [Transcrição kickoff Farmarcas-Interplayers, 07/07/2026](../../../../reuniões/transcrições/2026-07-07-kickoff-farmarcas-interplayers.md) (linhas 349–361) — descrição verbal do modelo 100% API
- [Pendência — Ficha Técnica Adesão via API](../Documentação%20Interplayers/PENDENCIA%20-%20Ficha%20Técnica%20Adesão%20via%20API.md) — confirmações obtidas via WhatsApp com a Interplayers em 25/08/2026 (campos e ordem do opt-in)

---

## ⚠️ Pendência antes de considerar esta história fechada

As confirmações abaixo vieram por **mensagem informal (WhatsApp)** com a Interplayers, não por uma Ficha Técnica formal. Antes de iniciar o desenvolvimento em produção, é necessário obter da Interplayers:
- O endpoint/WS exato para a submissão do cadastro + opt-in em uma única chamada (hoje não está claro se é a própria `ConsultaDescontoV3`/`Carrinho` com o array `consumer[]` completo, ou um WS dedicado de "Adesão Shopper/Adesão Produto" ainda não documentado).
- O nome exato do campo/estrutura que representa o aceite do opt-in LGPD dentro do payload (ainda não confirmado).

## User Story

Como **consumidor que tem acesso ao aplicativo**, quero **me cadastrar em um programa de PBM preenchendo um formulário nativo dentro do próprio app**, para **não precisar navegar para um site externo durante a compra**.

## Overview

A ECA-630 original já previa dois caminhos para adesão do consumidor a um programa PBM: **Adesão via URL Externa** e **Adesão Direta via API**, escolhidos de acordo com o retorno da Interplayers (`Possui URL?`). Na prática (Fase 1), o fluxo implementado priorizou a URL externa em um browser indexado no app, o que gerou fricção e uma experiência ruim para o consumidor.

Esta atualização inverte essa prioridade: o aplicativo deve sempre tentar o cadastro via API com formulário nativo primeiro, e só recorrer à URL externa quando a Interplayers não oferecer a alternativa via API para aquele programa específico.

## O que deve ser feito

- Priorizar a **Adesão Direta via API** (formulário nativo) sempre que a Interplayers indicar essa opção disponível para o programa
- Construir o formulário nativo de cadastro com os campos do array `consumer[1]` (CPF, nome, data de nascimento, gênero, e-mail, telefone, endereço)
- Exibir o opt-in do termo LGPD **ao final do mesmo formulário** (não como etapa/tela separada)
- Enviar cadastro + aceite do opt-in em uma **única submissão** à API
- Manter o fluxo de **Adesão via URL Externa** (browser indexado) apenas como fallback, para programas em que a Interplayers não oferecer o modelo via API

## Regras de Negócio

- O aplicativo deve permitir que o usuário se identifique utilizando o CPF, como já ocorre hoje
- Ao identificar que o consumidor não possui adesão ao programa (`allowsAdhesion = S`), o app deve verificar se a Interplayers oferece o modelo de Adesão Direta via API para aquele programa; em caso positivo, **não deve** abrir a URL externa
- O formulário nativo deve capturar, no mínimo: CPF (`holderId`), nome completo (`name`), data de nascimento (`birthdate`); os demais campos do `consumer[1]` (gênero, e-mail, telefone, endereço) devem ser capturados de acordo com o que for exigido/aceito por cada programa
- O opt-in do termo LGPD deve ser apresentado como parte do mesmo formulário nativo, exibido **após os campos cadastrais**, e não pode ser omitido — o consumidor só pode enviar o cadastro após marcar o aceite
- Cadastro (dados do `consumer[1]`) e aceite do opt-in devem ser enviados **juntos, em uma única chamada** à Interplayers — o app não deve fazer duas submissões separadas para isso
- Todo o fluxo de cadastro via API deve ocorrer **sem sair da tela/página do app** — nenhum WebView ou browser deve ser aberto neste caminho
- Se a Interplayers **não** oferecer o modelo de Adesão Direta via API para o programa em questão, o app deve manter o comportamento já existente (abrir a URL externa em browser indexado, sem retirar o consumidor do aplicativo)
- Qualquer erro retornado pela Interplayers (`validation[1].error[n]`) deve ser capturado e o `informativeText` exibido de forma amigável ao consumidor, sem jargão técnico
- Se houver múltiplos produtos de indústrias diferentes no carrinho, cada um pode ter seu próprio termo LGPD e formulário de cadastro — os desvios devem ser tratados individualmente por produto, como já previsto na ECA-630 original

## Critérios de Aceite

```gherkin
Cenário: Consumidor sem cadastro, programa com Adesão Direta via API disponível
  Dado que o consumidor identificado por CPF não possui adesão ao programa PBM do produto
  E o programa oferece o modelo de Adesão Direta via API
  Quando o consumidor tenta adicionar o produto ao carrinho
  Então o aplicativo exibe um formulário nativo de cadastro, sem abrir nenhuma URL externa ou WebView
  E o formulário apresenta os campos cadastrais seguidos do opt-in do termo LGPD ao final

Cenário: Envio do cadastro nativo com opt-in
  Dado que o consumidor preencheu os campos obrigatórios do formulário nativo de cadastro
  Quando o consumidor marca o aceite do opt-in LGPD e confirma o envio
  Então o aplicativo envia o cadastro e o aceite do opt-in em uma única requisição à Interplayers
  E, em caso de sucesso, o consumidor visualiza o produto com o desconto do programa aplicado

Cenário: Tentativa de envio sem aceitar o opt-in
  Dado que o consumidor preencheu os campos cadastrais do formulário nativo
  Quando o consumidor tenta enviar o cadastro sem marcar o aceite do opt-in LGPD
  Então o aplicativo bloqueia o envio e sinaliza que o aceite do termo é obrigatório

Cenário: Programa sem suporte à Adesão Direta via API (fallback)
  Dado que o consumidor identificado por CPF não possui adesão ao programa PBM do produto
  E o programa não oferece o modelo de Adesão Direta via API
  Quando o consumidor tenta adicionar o produto ao carrinho
  Então o aplicativo abre a URL externa fornecida pela Interplayers em um browser indexado, sem sair do aplicativo
  E, ao concluir o fluxo externo, o aplicativo reenvia a consulta original automaticamente

Cenário: Erro retornado pela Interplayers durante o cadastro nativo
  Dado que o consumidor enviou o formulário nativo de cadastro
  Quando a Interplayers retorna um erro de validação
  Então o aplicativo exibe o texto do erro (informativeText) de forma amigável, sem jargão técnico
  E o consumidor pode corrigir os dados e reenviar o formulário
```

## Impacto na NSM

Reduz a fricção do cadastro em programas de PBM — hoje um dos pontos de abandono da jornada de compra por depender de navegação externa — aumentando a probabilidade de conclusão da compra com desconto de laboratório. Contribui diretamente para o Volume de Transações por Loja Ativa.

## Definição de Pronto (DoD)

- [ ] Ficha Técnica formal da Interplayers para o modelo de Adesão Direta via API obtida e validada (endpoint e nome do campo de opt-in confirmados)
- [ ] Código revisado e aprovado
- [ ] Testes unitários escritos
- [ ] Testado em Android e iOS
- [ ] Sem regressão no fluxo de fallback via URL externa (para programas sem suporte à API)
- [ ] Documentação de API atualizada (Ficha Técnica de Adesão adicionada à pasta `Documentação Interplayers`)

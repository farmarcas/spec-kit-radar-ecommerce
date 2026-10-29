# Funcional — Material de negócio

**Fonte:** `Funcional — material de negócio.pdf` (Farmarcas, 28 out 2026) — convertido para Markdown em 29/10/2026.
**Status:** validado pelo PO (o PDF original trazia o selo "Rascunho para validação"; a validação foi confirmada em 29/10/2026).
**Escopo:** 50 pontos · só api-core · rollout em 28 out 2026.
**Documento par:** [funcional-analise-tecnica.md](funcional-analise-tecnica.md)

> Nota da conversão: o texto abaixo reproduz o conteúdo do PDF, reorganizado apenas no layout (o PDF é uma apresentação em slides). Onde o PO deu um esclarecimento depois da publicação do PDF, o trecho está marcado com **[Esclarecimento PO, 29/10/2026]**.
>
> **[Esclarecimento PO, 29/10/2026]** Um produto **nunca** pertence aos dois programas (Interplayers e Funcional) ao mesmo tempo. As regras do PDF sobre "produto nos dois programas" ficam registradas como proteção defensiva do código, não como cenário de negócio.

---

## Funcional no app

A pessoa continua vendo o desconto, informando o CPF, cadastrando se o programa pedir e fechando a compra. Quem passa a saber se o produto é Funcional ou Interplayers é a **api-core**.

---

## 01 · Visão e impacto

### O problema

O desconto de laboratório no app só existe para o programa que já está na base. Quem tem benefício na Funcional vê o preço cheio ou não usa o cadastro do programa.

### O que muda para a pessoa

O mesmo fluxo de hoje: ver o desconto, informar o CPF, cadastrar se o programa pedir e fechar a compra. A api-core passa a saber qual programa é o produto. App, carrinho, vitrine, busca e pedido não mudam de tela. A busca continua no Typesense que já existe.

**Sucesso** é um pedido com desconto Funcional confirmado na sessão que o pedido já grava, com o desconto da Interplayers no mesmo patamar de antes.

---

## 02 · Em um minuto

### O que a pessoa faz

Vê o desconto de laboratório. Informa o CPF. Se o programa pedir cadastro, preenche o formulário que o app já desenha, ou abre a página do programa. O item entra no carrinho com o preço autorizado. A compra fecha e a sessão fica gravada.

### O que muda por trás

A carga diária passa a trazer também os produtos da Funcional, sem apagar os da Interplayers. Na consulta e no fechamento, a api-core escolhe o programa do produto. A busca permanece transparente: a api-core publica o desconto no Typesense, no campo que a busca já lê.

| Permanece | Entra |
|---|---|
| Vitrine, busca no Typesense, CPF, formulário, carrinho, checkout e a sessão do pedido. Busca e destaque não mudam. | Desconto Funcional no mesmo tipo de preço de laboratório. Cadastro quando o programa pedir. |

---

## 03 · Fluxo

| # | Etapa | Descrição |
|---|---|---|
| 01 | **Carga** | Produtos do dia, por loja |
| 02 | **Vitrine** | Desconto de laboratório |
| 03 | **CPF** | A pessoa informa |
| 04 | **Consulta** | O programa daquele produto |

**Se pedir cadastro → Formulário ou página.** O app desenha o que já sabe, ou abre a página do programa. Depois segue o preço autorizado.

**Se já puder → Preço autorizado.** O item entra no carrinho. O fechamento grava a sessão. Nota e cancelamento usam essa sessão.

| Permanece (app, vitrine e busca) | Decide (api-core) | Permanece (carrinho e pedido) |
|---|---|---|
| Sem tela nova · Sem campo de programa · Typesense no mesmo campo · CPF continua o gatilho | Lê o produto da base · Consulta Interplayers ou Funcional · Devolve o contrato que o app já usa | Mesma consulta em lote · Uma sessão por compra · Sem campo novo |

---

## 04 · Pontos e ordem

| Card | Pontos |
|---|---|
| Carga | 13 |
| Vitrine | 3 |
| Consulta | 8 |
| Adesão | 13 |
| Fechamento | 13 |
| **Total** | **50** |

Ordem:
1. Carga abre a vitrine e a consulta.
2. Consulta abre a adesão e o fechamento. Quem já pode o desconto não espera o cadastro.

---

## 05 · Stories

### 1. Carga dos produtos — 13 pontos · *depende de nada*

O cron da api-core chama a query `Pharma_discountPrograms`, uma vez por loja, e grava na base que a vitrine já usa. Nenhum BFF participa. A lista da Interplayers permanece. A busca fica transparente: a api-core publica o desconto no Typesense pelo mesmo evento de hoje. Busca, destaque e o índice não mudam. Um percentual de 10% tem de aparecer como 10%. Produto bloqueado ou sem e-commerce não entra. Falha de uma loja não apaga as outras.

**Subtasks**
- Buscar com `Pharma_discountPrograms`.
- Gravar o desconto no formato que a vitrine já lê.
- Ajustar o job da Interplayers para apagar apenas `provider = Interplayers`, com backup e busca só desse provedor; a carga da Funcional troca só a lista dela.
- Atualizar a busca do produto cujo desconto mudou.
- Produto nos dois programas não entra na busca *(proteção defensiva — cenário que não ocorre no negócio)*.
- Agendar por loja, com segredo fora do código.

**Critérios**
- Uma carga vazia da Funcional não apaga produto nenhum, nem da Interplayers.
- A carga da Interplayers não apaga produto da Funcional nem tira o desconto dela da busca.
- Produto que também está na Interplayers não entra na busca *(proteção defensiva — cenário que não ocorre no negócio)*.
- Desconto de 10% aparece como 10%. 10,5% aparece como 10,5%.
- Preço de tabela do fabricante não vira o preço do app.
- Programa sem e-commerce, ou produto bloqueado, não entra.
- Falha de uma loja não apaga o que as outras já gravaram.
- Produto que exige receita fica marcado como tal.
- Código de programa que não cabe em 16 caracteres, ou nome que não cabe em 128, não entra e não é cortado. A carga registra esse código. A coluna não muda neste épico.

### 2. Desconto na vitrine — 3 pontos · *depende da carga*

O orchestrator de produto continua na query `storefrontPbmProducts`. A core não chama a Funcional: lê a base da carga. A busca não chama a core nem a Funcional. Ela lê o desconto que a carga já publicou no Typesense, no mesmo campo de hoje. O app mostra o desconto de laboratório também para produto da Funcional. *(O PDF previa que um produto presente nos dois programas não apareceria com desconto até o negócio escolher qual vale. **[Esclarecimento PO, 29/10/2026]**: esse cenário não existe — um produto pertence a um único programa. A regra permanece apenas como proteção defensiva no código.)*

**Subtasks**
- `storefrontPbmProducts` lê os dois programas, sem chamar a Funcional.
- Produto nos dois programas fica de fora e fica registrado *(proteção defensiva)*.

**Critérios**
- Produto só da Funcional aparece com desconto de laboratório.
- Produto nos dois programas não aparece com esse desconto, nem na vitrine nem na busca *(proteção defensiva)*.
- A vitrine continua sem pedir qual é o programa.

### 3. Consulta com CPF — 8 pontos · *depende da carga*

O BFF de carrinho (`ecomm-bff-mobile-cart-dotnet`) continua na query `consumerPbmConsultBatch`. Interplayers segue na consulta desconto. Funcional chama `Pharma_checkPricesAndRules` e `Pharma_verifyOptIn`. O app recebe o preço que a pessoa paga, ou o pedido de cadastro.

**Subtasks**
- Produto Funcional chama `Pharma_checkPricesAndRules`.
- Produto Interplayers segue na consulta desconto.
- Devolver o preço que a pessoa paga.
- Quantidade não autorizada bloqueia o desconto.
- Na mesma consulta, `Pharma_verifyOptIn`.

**Critérios**
- CPF elegível em produto Funcional adiciona o item com o preço autorizado.
- Produto Interplayers continua consultando a Interplayers, inclusive com atendimento em aberto.
- Produto fora da base não consulta a Funcional.
- Se o aceite do termo for obrigatório e ainda não feito, a pessoa vê o texto ou o link antes do desconto.
- Se o programa liberar esta compra e avisar que a próxima exige o aceite, o item entra e a pessoa vê essa mensagem.
- Se o programa exigir imagem da receita, dose diária ou um código extra do aplicativo deles, o item não entra e a pessoa vê a mensagem.
- Se o programa tiver página de cadastro, o app recebe o link.
- Se o cadastro tiver pergunta que depende de outra e não houver página, o item não entra e a pessoa vê a mensagem do programa.
- O app de carrinho não muda.
- Sem o código numérico de origem do aceite, a verificação falha. O valor 5 do exemplo da Funcional não é usado.

### 4. Cadastro no programa — 13 pontos · *depende da consulta*

O mesmo BFF continua na query `consumerPbmAdhesionForm` e na mutation `submitConsumerPbmAdhesion`. A core chama `Pharma_assessEligibility`, o texto do termo com `Pharma_retrieveTextTermsOptIn`, o aceite com `Pharma_insertOptIn` e uma mutation de inscrição. O app mostra o formulário que já sabe desenhar.

**Subtasks**
- Montar o formulário na `consumerPbmAdhesionForm`.
- No submit, inscrever, incluir o produto ou cadastrar o paciente.
- Devolver o código do termo no `Pharma_insertOptIn`.
- Não criar campo para pergunta que depende de outra resposta.

**Critérios**
- Campo obrigatório aparece como obrigatório, no formulário que o app já usa.
- Campo oculto não aparece.
- Enviar o formulário cadastra a pessoa, ou inclui o produto de quem já estava no programa, e o app segue o fluxo de adesão que já existe.
- O código que veio com o texto do termo volta no aceite.
- Termo com texto aparece no formulário. Termo só com link abre o link.
- Pergunta que depende de outra não aparece como campo dentro de campo.
- Não há mudança de app nem de carrinho.

### 5. Fechamento da compra — 13 pontos · *depende da consulta*

O `ecomm-api-order-dotnet` continua em `fulfillPbmTransaction`, `confirmOrderPbmInvoice` e `cancelOrderPbmAuthorization`. A core reserva com `Sales_preAuthorizeSale`, confirma com `Sales_confirmPreAuthorizedSale` e cancela depois da nota com `Sales_cancel`. Antes da nota, não chama a Funcional. A reserva vale até 30 dias.

**Subtasks**
- Reservar em `Sales_preAuthorizeSale`.
- Guardar o código da reserva e o da confirmação.
- Confirmar a nota uma vez.
- Chave tardia em `Sales_updateInvoiceCode`.
- Cancelar depois da nota com `Sales_cancel`.
- Cancelar antes da nota não chama a Funcional.

**Critérios**
- A compra Funcional fica gravada com o código da reserva, o código da confirmação e o preço autorizado.
- A confirmação da nota acontece uma vez e não pede preço de novo ao pedido.
- Cancelar antes da nota não chama a Funcional e a sessão some daqui. A reserva continua confirmável até 30 dias, ou até uma reserva mais nova ser confirmada.
- Cancelar depois da nota desfaz a venda com o código da confirmação. Repetir o cancelamento não gera erro novo.
- Compra Funcional confirmada há mais de sete dias ainda cancela.
- O serviço de pedido não ganha campo novo.
- A chave da nota segue sem protocolo de autenticação. Se a Funcional recusar a chave, a compra permanece confirmada e não é confirmada de novo.

---

## 06 · Rollout

1. **A carga que já roda.** A carga diária da Interplayers passa a trocar só a lista dela, inclusive o backup e a busca, **antes** da primeira carga Funcional em produção.
2. **As lojas do rollout atual.** A Funcional entra nas farmácias que já estão nesse rollout. Loja nova no rollout recebe a Funcional na carga seguinte.

Data de referência do documento: **28 out 2026**.

---

## Pontos em aberto

- **Token, circuit breaker e chave de NF:** o token fica em memória (cache ~24h), o client da Funcional não tem circuit breaker e a chave tardia de NF não tem retry. Esses trade-offs (ver seção 09 da [análise técnica](funcional-analise-tecnica.md)) estão **em aberto**, em conversa com o time técnico.
- **Contagem de stories:** a capa do PDF diz "6 stories" e o corpo detalha 5 (50 pontos). Tratar quando as histórias forem geradas — fora do escopo desta etapa de documentação.

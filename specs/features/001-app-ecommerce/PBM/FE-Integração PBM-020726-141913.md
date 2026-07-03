# FE-Integração PBM

**Fonte:** FE-Integração PBM-020726-141913.pdf (documento original neste mesmo diretório)

---

# 🩹 Integração PBM

Esse documento tem como objetivo documentar as descobertas e o desenvolvimento do projeto de integração com provedores e programas de PBM.

## 🚩 Descrição do Problema - (Surgimento do problema / Necessidade)

| | |
|---|---|
| Produto / Área | App / Precificação de produto |
| Stakeholder | Consumidores e Lojistas |
| Público Alvo | Consumidor final |
| Objetivo estratégico | |
| OKR relacionada | |
| Problema reportado | 1. Consumidores não conseguem comprar pelo aplicativo produtos de PBM com o desconto do laboratório. |

### Contexto:

Os programas de benefícios em medicamentos são uma das principais estratégias de precificacão de produtos existente nas drogarias espalhadas pelo país. Os programas visam oferecer descontos especiais para os clientes cadastrados no PBM de um determinado laboratório.

Um programa de PBM consiste em uma união de um ecossistema composto por provedores, laboratórios, drogarias e consumidores, cada player acima tem as seguintes responsabilidades:

- **Provedor**: É o player chave responsável por toda a unificação e transação das informações e demandas entre toda a cadeia de envolvidos no PBM.

  ✅ Credenciamento das drogarias nos programas das indústrias

  ✅ Cadastro da base de consumidores nos programas das indústrias

  ✅ Comunicação dos produtos e condições de preço disponíveis para cada programa

  ✅ Reabastecimento automatizado das unidades vendidas através do PBM nas farmácias credenciadas

- **Programa:** É o "projeto" construído pelos laboratórios para determinados produtos e medicamentos. Um programa de PBM é sempre vinculado a um laboratório específico (Ex: Aché Cuidados Pela Vida, Sandoz Cuidar +…)

  ✅ Definir os produtos que fazem parte do programa

  ✅ Definir as condições de preço de cada produto participante

- **Drogaria:** É o player que materializa a condição de preço definida pelos laboratórios nas mãos dos consumidores.

  ✅ Realizar a venda da forma correta através do Programa de PBM

- **Consumidor:** Grande beneficiado de toda a cadeia de stakeholders citada acima, todo o processo acontece para que o consumidor possa se beneficiar de um preço especial do produto.

  ✅ Realizar o cadastro no programa de PBM que contempla o medicamento que deseja usufruir

Os programas de PBM facilitam o acesso dos consumidores a determinados produtos e medicamentos, consequentemente proporcionando uma melhora na adesão desses consumidores aos tratamentos, principalmente de longa duração. Os programas de PBM também acabam contribuindo para o crescimento do fluxo de clientes nas drogarias e o aumento nas vendas.

**Fluxo de venda sem PBM**

[Diagrama: Fluxo de venda sem PBM — mostra a cadeia linear: Indústria → (seta para) Distribuidor → (seta para) PDV → (seta para) Consumidor Final. O Distribuidor recebe da Indústria e envia para o PDV.]

**Fluxo de venda Com PBM**

[Diagrama: Fluxo de venda com PBM — mostra a cadeia: Indústria → Provedor → PDV → Consumidor Final, com o Distribuidor conectado bidirecionalmente ao Provedor (setas duplas entre Distribuidor e Provedor), indicando que o Provedor se insere no fluxo entre a Indústria/Distribuidor e o PDV.]

## 🚩 Dados sobre o problema

- Atualmente, no cenário Febrafar, temos 1253 produtos sendo comercializados através de um programa de PBM (📄 *Produtos PBM - Febrafar.xlsx*)
- Desses 1253 produtos, 180 tem a necessidade de retenção de receita (📄 *PBM - Medicamentos com retenção de receita.xlsx*)
- Especificamente na Funcional Card, temos 123 produtos sendo comercializados dentro do PBM
- Desses 123 produtos, 20 tem a necessidade de retenção de receita (📄 *Produtos Funcional Card + Retenção de receita.xlsx*)
- Aproximadamente **70% das vendas** dos produtos PBM na Funcional Card acontece **via e-commerce**
- O ticket médio das cestas aumenta em **5.9%** quando o consumidor compra utilizando PBM
- Dentro da Febrafar são vendidas mais de **100 mil unidades** de produtos pelo PBM mensalmente

> ℹ️ *Fontes de dados:*
>
> 🔗 https://app.powerbi.com/groups/me/reports/5cab2337-5443-462a-8923-b4adeeedd512/ReportSection1869fc5ebd00b2c1339d?ctid=a6ac50f4-60bb-4980-9380-c1690018f788&experience=power-bi&bookmarkGuid=Bookmarkaba8c260f11a1c6ae4aa **Conectar a conta do Power-BI**
>
> 📎 Anexo: *Estudo de Mer… BM.pptx* — 09 out. 2025, 06:28 PM

## 🚩 Consolidação do problema

**Consumidor:**

Ao não permitir que o consumidor realize compras no aplicativo aproveitando o preço do laboratório, o cliente fica com uma percepção de que a farmácia está sendo antiética tentando vender o produto mais caro do que outros concorrentes que possuem essa funcionalidade integrada.

**Lojista:**

Ao não permitir que o consumidor realize compras no aplicativo aproveitando o preço do laboratório a loja acaba perdendo toda a cesta do cliente e não somente a venda desse produto específico do PBM. Esse problema se agrava ainda mais no caso dos produtos de PBM que a condição é exclusiva para compra digital.

## 🚩 Fluxo do processo

**Jornada Consumidor - Apresentar o preço dos produtos PBM no app**

[Diagrama de fluxo (BPMN) intitulado "Jornada consumidor - Apresentar preço do produto com PBM": inicia em "Acessar o aplicativo" → "Selecionar farmácia" → "Consulta CNPJ no provedor" → decisão losango "Tem programa PBM?" → se **Não**: segue para "Não apresenta o desconto do laboratório" → "Fim do fluxo"; se **Sim**: segue para "Consulta quais programas a loja está cadastrada" → "Consulta preço dos produtos participantes do programa" → "Apresenta preço dos produtos com desconto de laboratório" → "Fim do fluxo".]

**Jornada Consumidor - Venda de medicamento sem retenção de receita**

[Diagrama de fluxo (BPMN): inicia em "Acessar o aplicativo" → "Selecionar farmácia" → "Realizar login" → "Buscar produto" → "Adicionar produto no carrinho" → decisão losango (referente à identificação de programa/PBM) com ramificações indicando: "O logo do programa/desconto aparece no produto elegível na loja", "Consumidor tem cadastro no programa de PBM" e "O consumidor pode inserir o CPF/dados para verificar o desconto"; após a validação segue para "Valida CPF no provedor" → decisão "Possui cadastro no programa?" → ramos "Sim"/"Não" → "Apresenta produto com desconto de laboratório" → "Finalizar a compra" → "Processar pagamento" → "Confirmar pedido" → "Fim do fluxo".]

**Jornada Consumidor - Venda de medicamento com retenção de receita**

[Diagrama de fluxo (BPMN) semelhante ao anterior ("Acessar o aplicativo" → "Selecionar farmácia" → "Realizar login" → "Buscar produto" → "Adicionar produto no carrinho" → decisões losango sobre elegibilidade e cadastro no programa PBM → "Valida CPF no provedor" → decisão "Possui cadastro no programa?"), mas com uma etapa adicional de decisão "Tem retenção de receita?" e ramos "Sim"/"Não", seguindo depois para "Anexar receita" → "Finalizar a compra" → "Processar pagamento" → "Confirmar pedido" → "Fim do fluxo".]

## 🚩 O que precisa ser resolvido?

- Apresentação dos preços do PBM dos produtos que fazem parte de algum programa aderido pela loja
- Permitir a consulta na base para identificar se o consumidor está cadastrado no programa
- Permitir o cadastro de novos consumidores nos programas de PBM da Funcional
- Receber e enviar a NF das vendas de produtos PBM para reposição dos produtos
- Possibilitar o envio da receita física, ou digital, do produto para a compra de medicamentos com retenção de receita

## 🚩 Como os problemas serão resolvidos?

**Jornada Consumidor - Venda de medicamento com retenção de receita**

[Diagrama de fluxo (BPMN) — repetição/detalhamento da jornada de venda de medicamento com retenção de receita, mostrando os mesmos passos descritos anteriormente: acesso ao app, seleção de farmácia, login, busca e adição do produto, validação de CPF no provedor, verificação de cadastro no programa, verificação de retenção de receita, anexo de receita, finalização de compra, pagamento, confirmação de pedido e fim do fluxo.]

**Jornada Consumidor - Troca de loja na cesta com PBM**

[Diagrama de fluxo (BPMN) intitulado "Jornada Consumidor - Troca de loja na cesta com PBM": mostra etapas iniciais (acesso ao app, seleção de loja, login, busca de produto) seguidas por decisões losango relacionadas à elegibilidade do produto/programa PBM na loja selecionada, com anotações textuais menores ao lado das decisões. O fluxo se ramifica em caminhos que levam a uma etapa de repetição de validação (retorno a uma decisão) antes de convergir para etapas finais de "Finalizar compra" → "Processar pagamento" → "Confirmar pedido" → "Fim do fluxo" (círculo laranja).]

**Jornada Lojista - Pós Compra**

*(Seção presente no documento sem conteúdo detalhado — apenas o título da jornada, sem texto ou diagrama associado.)*

> 📄 Documento com todas as jornadas acima: 🔗 https://www.figma.com/board/r9UZ2KKdkqOShvrS3TwOT0/Discovery-PBM?node-id=2956-678&p=f&t=THenEznblulUVDy7-0 **Conectar a conta do Figma**

| Problema | Solução/Contexto atual |
|---|---|
| Apresentação dos preços do PBM dos produtos que fazem parte de algum programa aderido pela loja | ✅ Realizar uma chamada diária na api da Funcional Card para identificar todos os programas, clientes e preços de cada programa de PBM |
| Permitir a consulta na base para identificar se o consumidor está cadastrado no programa | ✅ Com as informações recebidas na chamada diária da API da Funcional, sempre que o usuário inserir o CPF no momento de incluir o produto no carrinho, o sistema vai consultar se esse consumidor já está cadastrado. |
| Permitir o cadastro de novos consumidores nos programas de PBM da Funcional | ✅ No caso dos clientes não cadastrados, vamos permitir que o consumidor se cadastre no programa no momento da compra. A Funcional disponibiliza via integração o formulário de cadastro de todos os programas disponíveis no provedor |
| Receber e enviar a NF das vendas de produtos PBM para reposição dos produtos | ✅ Alpha7 e Trier <br> ❌ Linx |
| Possibilitar o envio da receita física, ou digital, do produto para a compra de medicamentos com retenção de receita | ❌ Atualmente não temos esse fluxo disponível no aplicativo, isso restringe a venda de 20 produtos dentro do cenário da Funcional Card <br> ✅ Conseguimos permitir a compra desses medicamentos para retirada na loja |

## 🚩 Documentações técnicas:

| Interplayers | Funcional Card |
|---|---|

> 🔗 **Introdução \| Developers**
>
> 📎 Anexo: *MarketPlace(1).zip* — 08 jun. 2026, 05:13 PM

**Fluxo de vitrine e compra**

[Diagrama de fluxo técnico (fluxograma de sistema): apresenta múltiplas raias/legendas identificadas por cores no rodapé — "Sistema.zip" (azul), "HUB Interplayers" (azul escuro) e "MarketPlace" (laranja). O fluxo inicia à esquerda, passa por diversas decisões losango encadeadas (marcadas com asteriscos vermelhos indicando notas/observações) e caixas de processo em laranja e azul, incluindo uma seção destacada em azul claro contendo uma decisão e uma etapa de processo, convergindo ao final em um nó terminal à direita. O detalhe textual das caixas não é legível o suficiente para transcrição literal.]

**Fluxo de pagamento**

[Diagrama de fluxo técnico: inicia à esquerda (nó "Início"), passa por uma caixa de processo em laranja destacada, segue para uma caixa cinza, chega a uma decisão losango central (com nota marcada por asterisco vermelho, referente a "Validação de Documento Fiscal e Confirmação de Compra"), ramifica para duas caixas de processo (cinza e azul) relacionadas ao MarketPlace/Interplayers, e converge para um nó terminal à direita. Legenda no rodapé: "Sistema.zip" (azul), "HUB Interplayers" (azul escuro), "MarketPlace" (laranja).]

**Fluxo de cancelamento**

[Diagrama de fluxo técnico: inicia à esquerda (nó "Início"), segue por uma sequência linear de caixas de processo (azul, cinza, azul, cinza) até um nó terminal à direita, com uma nota/observação (marcada por asterisco vermelho) associada a uma das etapas. Abaixo do fluxo há uma caixa de anotação com texto observacional (não integralmente legível) mencionando algo relacionado a "documento fiscal", prazo em dias para cancelamento/confirmação de compra, e que "as interfaces do usuário administrativo são diferentes de acordo com o canal de venda, mas a comunicação com o HUB/INTERPLAYERS via notificação de saída do consumidor, mas o cancelamento fiscal ocorre depois". Legenda no rodapé: "Sistema.zip" (azul), "HUB Interplayers" (azul escuro), "MarketPlace" (laranja).]

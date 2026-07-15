# Manual do Portal — Radar E-commerce

> Documentação funcional do **Portal** (front-end web do Radar E-commerce, usado pelos Associados/Lojistas e pela Farmarcas para gerenciar suas lojas). Objetivo: apoiar o aculturamento de Associados na ferramenta e servir de base de consulta para o N1 de suporte.
>
> Fonte: mapeamento de telas reais do Portal em produção, cruzado com o código-fonte (`ecomm-front-webapp-portal-angular`), validado com o time de produto e com o FAQ interno de suporte (CS/Anjos). Atualizado em 2026-07-14.
>
> **Fora do escopo deste manual:** o aplicativo mobile do consumidor final (App) — ver `FAQ-App-Radar-Ecommerce.md`.

---

## Sumário

1. [Introdução ao Portal](#1-introdução-ao-portal)
2. [Perfis de acesso](#2-perfis-de-acesso)
3. [Redes e Lojas](#3-redes-e-lojas)
4. [Grupo de lojas](#4-grupo-de-lojas)
5. [Indicadores](#5-indicadores)
6. [Configurações da Loja](#6-configurações-da-loja)
7. [Estoque](#7-estoque)
8. [Pedidos](#8-pedidos)
9. [Promoções](#9-promoções)
10. [Banners](#10-banners)
11. [Usuários](#11-usuários)
12. [Catálogo (Admin)](#12-catálogo-admin)
13. [Acesso ao Portal: Login, Senha e Cadastro](#13-acesso-ao-portal-login-senha-e-cadastro)

---

## 1. Introdução ao Portal

O Portal é onde o Associado (farmácia franqueada) e sua equipe configuram e operam a loja digital dentro do Radar E-commerce. É pelo Portal que se define o que aparece no App do consumidor final: estoque, preços, formas de entrega e pagamento, promoções, banners e o atendimento dos pedidos.

O Portal segue uma hierarquia de 4 níveis:

```
Farmarcas (dona da plataforma)
   └── Rede (ex: ACFARMA, Ultra Popular, Droga Rede)
         └── Grupo de lojas (opcional — agrupa lojas dentro de uma Rede)
               └── Loja (unidade individual, com CNPJ próprio)
```

Ao entrar no Portal, o usuário escolhe (ou já está vinculado a) uma Rede e, dentro dela, uma Loja específica. O cabeçalho do Portal sempre mostra esse contexto (ex: `ACFARMA > Acfarma - Centro`), com um seletor (▾) para trocar de loja sem precisar sair e logar de novo.

---

## 2. Perfis de acesso

O que um usuário enxerga e pode fazer no Portal depende do seu **perfil de acesso**, definido na tela de [Usuários](#11-usuários):

| Perfil | Quem é | Escopo | O que pode fazer |
|---|---|---|---|
| **Contato cliente** | Atendente/balconista da loja | Vinculado a **uma única loja** | Só acompanha e movimenta os pedidos dessa loja. Não cria nem remove promoções, nem acessa configurações administrativas. |
| **Gestor de Loja** | Associado/dono de loja | Vinculado a **uma ou mais lojas** | Acesso completo às funcionalidades das lojas às quais está vinculado (estoque, promoções, configurações, pedidos, usuários). |
| **Gestor de Rede** | Responsável por uma Rede inteira | Vinculado a **uma ou mais Redes** | Mesmo nível de acesso do Gestor de Loja, mas enxerga e administra todas as lojas da(s) Rede(s) vinculada(s), incluindo Banners e indicadores agregados da Rede. |
| **Admin** | Time Farmarcas | Todas as Redes e Lojas | Acesso total, incluindo o módulo [Catálogo](#12-catálogo-admin), exclusivo desse perfil. |

**Na prática, isso muda a navegação que cada perfil vê:**

- **Contato cliente**: menu reduzido, só com as abas **Pedidos**, **Promoções** e **Estoque** — é a tela de trabalho do dia a dia do balconista.
- **Gestor de Loja / Gestor de Rede**: dentro de uma loja, menu completo — **Pedidos, Promoções, Estoque, Configurações, Usuários**. No nível da Rede (fora de uma loja específica), o menu mostra **Lojas, Promoções, Banners, Usuários**.
- **Admin**: menu próprio de plataforma — **Indicadores, Redes, Produtos (Catálogo), Usuários** — com visão global, sem ficar preso a uma Rede/loja específica.

---

## 3. Redes e Lojas

### Tela "Lojas" (nível Rede)

Ao entrar numa Rede, a aba **Lojas** lista todas as unidades cadastradas com:

- **Grupo**: a qual Grupo de lojas a unidade pertence (ou "Sem grupo").
- **Telefone, Estado, Cidade**: dados de localização/contato.
- **ERP conectado até**: data/hora da última sincronização de dados com o sistema ERP da loja. É um indicador de saúde da integração — se essa data está muito atrasada, é sinal de problema na comunicação com o ERP (ver também o alerta em [Estoque](#7-estoque)).
- **Módulo ativado**: mostra se a loja opera no módulo **Vendas** (venda completa, com estoque e pedidos) ou **Ofertas** (só promoções, sem processar pedidos direto pelo Portal).

Ações disponíveis: **Nova loja** (cadastrar uma unidade), filtro por **Módulo**, **Estoque Centralizado** e **Exportar Lojas** (baixa a listagem).

**O que é o botão "Estoque Centralizado"?** É o atalho, no nível da Rede, para a tela de [Grupo de lojas](#4-grupo-de-lojas) — tanto para ver os grupos já criados quanto para criar um novo. A ideia por trás dessa configuração é otimizar a operação: em vez de um operador de call center precisar abrir uma aba por loja para atender pedidos de várias filiais, o grupo permite unificar o atendimento numa única tela, com todos os pedidos das lojas participantes centralizados numa loja principal.

**Módulo Vendas x Módulo Ofertas — o que muda na prática?**
- **Vendas**: a loja processa a compra completa dentro do próprio app — carrinho, checkout e pagamento acontecem no aplicativo.
- **Ofertas**: não há compra pelo app. O associado cria as ofertas no Portal, elas são replicadas no aplicativo, e o consumidor final apenas **ativa** a oferta pelo app — a compra em si só é finalizada fisicamente na loja, quando o cliente informa o CPF e a oferta é vinculada a ele no momento do pagamento (é por isso que esse módulo não gera "Pedidos" no Portal).
- Uma loja pode solicitar a migração de Ofertas para Vendas — ver [Configurações da Loja](#6-configurações-da-loja), onboarding e liberação da Chave de integração/API.

### Tela "Redes" (nível Admin)

Só o perfil Admin acessa essa tela (aba "Redes" no menu de plataforma). Lista **todas as Redes cadastradas na plataforma**, com nome, quantidade de lojas cadastradas e um botão "Abrir rede". Tem busca por nome e um botão **"Exportar redes"**.

### Relatórios exportáveis (Lojas e Redes)

Dois relatórios em Excel (.xlsx) relacionados a essa hierarquia:

| Relatório | Como é baixado | Escopo |
|---|---|---|
| **Relatório de redes** | Botão **"Exportar redes"** na tela "Redes" (nível Admin). | Todas as lojas de todas as Redes que o usuário tem acesso — para o Admin, isso é a plataforma inteira. |
| **Relatório de lojas** | Botão **"Exportar Lojas"** na tela "Lojas" de uma Rede específica. | Todas as lojas **daquela Rede** que o usuário tem acesso — se um Gestor de Loja só tem 5 lojas vinculadas, o relatório só traz essas 5, mesmo que a Rede tenha mais lojas. |

Ambos têm exatamente as mesmas colunas: **Nome Rede, Nome Loja, CNPJ Loja, Estado Loja, Cidade Loja, ERP conectado até** (data da última sincronização, ou "Sem data" se nunca conectou), **Módulo** (Oferta ou Vendas — no arquivo exportado o valor vem no singular "Oferta", mesmo a tela mostrando "Ofertas"), **Data Solicitação do Vendas** (data em que a loja pediu a migração para o módulo Vendas — "Sem data" se nunca solicitou), **Loja Ativa** (Sim/Não) e **Pagamento Online** (mostra "Braspag" quando configurado, ou "Não configurado").

> **Atenção ao termo "Loja Ativa" neste relatório:** aqui, **Loja Ativa = Sim** significa apenas que a loja existe e não foi removida (a ação "remover loja" na listagem de Lojas faz uma exclusão lógica/soft-delete, que marca a loja como inativa). **Isso não é o mesmo conceito do NSM do produto** ("Volume de Transações por Loja Ativa", onde Loja Ativa = loja que transacionou no período de referência — ver glossário). São dois conceitos diferentes usando o mesmo nome — importante não confundir um com o outro ao ler este relatório.

### Como trocar de loja

O seletor no cabeçalho (ex: "Acfarma - Centro ▾") permite alternar entre as lojas às quais o usuário tem acesso, sem precisar logar novamente.

---

## 4. Grupo de lojas

Um **Grupo de lojas** serve para organizar e definir uma regra comum de **atendimento de pedidos** e **tipo de estoque** entre várias lojas de uma mesma Rede (por exemplo, filiais de um mesmo empresário).

### Tela "Grupo de lojas"

Lista os grupos com: nome, data de criação, quantidade de Lojas e Usuários vinculados, e dois badges importantes:

- **Atendimento**: "Loja principal" ou "Loja a loja".
- **Estoque**: "Espelhado", "Integrado" ou "Independente".

### Configurando o atendimento e o estoque do grupo

Dentro do detalhe de um grupo, o botão **"Configurar atendimento e estoque"** abre um modal com 3 opções — escolha de acordo com como as lojas do grupo devem operar:

1. **Estoque Espelhado** — uma loja "mãe" (loja principal) recebe todos os pedidos do grupo, e o estoque dela é replicado (espelhado) para as demais unidades. É possível incluir uma loja secundária: nesse caso, os estoques das duas lojas são somados, exibindo a quantidade total no aplicativo.
2. **Estoque Integrado** — o estoque é somado fisicamente entre todas as lojas do agrupamento.
3. **Estoque Independente** — os estoques de cada loja do grupo ficam isolados uns dos outros.

**Importante:** independentemente do tipo de estoque escolhido, configurar um Grupo de lojas (Estoque Centralizado) **sempre centraliza o atendimento dos pedidos na tela da loja principal**. Os 3 tipos acima definem exclusivamente o comportamento do **estoque** entre as lojas do grupo — não onde os pedidos são atendidos.

> **Atenção:** essa configuração tem impacto direto na disponibilidade de produtos mostrada no App para os consumidores de cada loja do grupo — escolha com cuidado antes de mudar um grupo já em operação.

### Detalhe do grupo

Duas abas: **Lojas** (lista as unidades do grupo, com botão "Adicionar loja") e **Usuários do grupo** (usuários vinculados especificamente a esse grupo).

---

## 5. Indicadores

A tela **Indicadores** é o painel de acompanhamento de performance, disponível tanto no nível da Loja quanto no nível da Rede. Dentro dela existem duas visões, uma para cada módulo que a loja/rede pode operar:

- **Home de Vendas** — indicadores de pedidos/checkout completo pelo app.
- **Home de Ofertas** — indicadores do módulo Ofertas (ativação de ofertas e conversão em compra na loja física).

**Confirmado:** "Indicadores" é o nome real da aba de navegação — é essa mesma tela que funciona como a Home/painel principal ao entrar numa loja ou rede. Dentro dela, duas sub-abas: **Vendas** e **Ofertas**.

Em todas as variações, o cabeçalho tem: aviso de **atualização automática a cada 30 minutos** (com data/hora da última atualização), um seletor de período (ex.: "Últimos 7 dias", "Últimos 12 meses", com opção de período **Personalizado** via calendário), um botão **Filtrar** (critérios adicionais) e **Exportar**. **Trocar o período recarrega a tela inteira** — cada card busca os dados de novo no servidor (não é um recálculo local), então é normal ver os cards em *skeleton* (esqueleto de carregamento) por um instante após mudar o filtro.

### 5.1 Home de Vendas

No topo, uma faixa com 3 abas (cada uma mostra um gráfico de linha/barra por dia dentro do período; trocar de aba **não** busca dados novos — as 3 já vêm carregadas, só alterna qual gráfico aparece):

| Indicador | O que significa (tooltip) |
|---|---|
| **Faturamento** | "Representa o valor total das vendas registradas no período selecionado." |
| **Pedidos cancelados** | "Total de pedidos cancelados no período selecionado." |
| **Pedidos concluídos** | "Total de pedidos finalizados no período selecionado." |

*Comportamento do gráfico:* passar o mouse sobre um ponto mostra o valor em R$ daquele dia. Não há clique/drill-down. Sem legenda (é um valor único por dia). O eixo horizontal muda de granularidade conforme o período selecionado (dias, semanas, meses etc.), mas quem decide os grupos exibidos é o servidor — o Portal só exibe o que a API devolve.

Demais indicadores da Home de Vendas:

| Indicador | O que significa |
|---|---|
| **Ticket Médio** | "Valor médio gasto por pedido no período, calculado dividindo o faturamento total pela quantidade de pedidos." *(gráfico de barras, mesmo comportamento de hover em R$, sem clique/legenda)* |
| **Total de Pedidos em Aberto** | "Quantidade de pedidos ainda não finalizados no período, incluindo todos os status pendentes (na fila, liberados e em separação)." Tem um botão **"Visualizar pedidos"**. |
| **Volume dos pedidos em aberto** | Soma em R$ de todos os pedidos ainda não finalizados (Na fila + Em separação + Liberados). |
| **Pedidos em aberto por status** | Contagem de pedidos em cada status (Fila / Em separação / Liberados), exibida em %. *(gráfico de rosca; hover mostra "Status: quantidade (%)"; legenda é uma lista estática de cores com o percentual de cada status, sem interação)* ⚠️ Hoje esse indicador filtra incorretamente pelo período de datas selecionado — deveria sempre mostrar o total de pedidos em aberto das lojas do usuário, independente da data de criação. Correção já registrada em [ECP-1056](https://farmarcas.atlassian.net/browse/ECP-1056). |
| **Tempo médio para iniciar primeiro atendimento** | Tempo entre o pedido entrar "Na fila" e ser concluído. Exibido em formato de duração (ex.: "9h e 37min"). |
| **Tempo médio total de atendimento** | Também entendido como "Na fila" até "Concluído" — a definição exata implementada hoje ainda não está confirmada com engenharia; correção/checagem registrada em [ECP-1056](https://farmarcas.atlassian.net/browse/ECP-1056) (inclusive a sobreposição de definição com o indicador acima). Exibido em formato de duração (ex.: "2 dias e 11h"). |
| **Média de itens por cesta** | Média de itens por pedido, considerando todos os pedidos (concluídos ou não). |
| **Volume dos pedidos cancelados** | Valor em R$ (não quantidade) que seria faturado pelos pedidos cancelados no período. ⚠️ A label atual do card não deixa isso claro — correção registrada em [ECP-1056](https://farmarcas.atlassian.net/browse/ECP-1056). |
| **Faixa etária por gerações** | "Distribuição dos clientes que realizaram compras no período, agrupados por gerações." Faixas exibidas: 18–28 anos (Geração Z), 29–44 anos (Geração Millennials Y), 45–60 anos (Geração X), +60 anos (Baby Boomers). *(gráfico de barras; hover mostra só o valor bruto, sem tooltip customizado; sem clique/legenda)* |
| **Região** *(só no painel de Rede)* | "Distribuição dos clientes que compraram no período, agrupados conforme a localização geográfica cadastrada." Categorias: Sudeste, Norte, Sul, Centro-Oeste, Nordeste e "Estado inválido" (quando o cadastro do cliente não tem estado válido). Não existe no painel por Loja. |
| **Gênero** | "Distribuição dos clientes que realizaram compras no período, de acordo com a informação de gênero cadastrado." Categorias: Homem, Mulher, Indefinido. *(gráfico de pizza; hover mostra "Categoria: quantidade (%)"; legenda estática com % abaixo do gráfico; mostra um círculo vazio quando não há dados)* |
| **Ranking das lojas** *(só no painel de Rede)* | "Classificação das lojas de acordo com o valor total vendido no período, da maior para a menor receita bruta." Exibido como pódio (1º, 2º, 3º lugar) com nome, CNPJ e valor de cada loja; não é um gráfico. Não encontrei opção de ver colocações além do 3º lugar. Não existe no painel por Loja. |
| **Top produtos mais vendidos** | "Apresenta os produtos que tiveram o maior número de vendas no período, destacando os campeões de desempenho." Lista ranqueada (não é gráfico) — cada produto mostra nome, EAN, unidades vendidas e valor em R$. Botão "Baixar produtos" para exportar. |
| **Formas de pagamento** | "Distribuição dos pedidos realizados no período, de acordo com o meio de pagamento utilizado." *(gráfico de rosca; legenda detalha Online → Crédito/Pix e Offline → Balcão/Na entrega, todos em %)* |
| **Métodos de entrega** | "Mostra como os pedidos foram recebidos pelos clientes no período, diferenciando opções como Receber em Casa (entrega no endereço do cliente) e Retirada (o próprio cliente busca o pedido na loja ou ponto de coleta)." |
| **Lojas sem opção de receber em casa** *(só no painel de Rede)* | "Lojas que oferecem apenas a modalidade de retirada, sem opção de entrega em domicílio. Esse indicador ajuda a identificar associados que podem não ter operação logística para envio." Tem um botão "Ver lojas com retirada" (ícone de download, então provavelmente exporta uma lista em vez de navegar — não confirmado). |

### 5.2 Home de Ofertas

| Indicador | O que significa (tooltip) |
|---|---|
| **Total de ofertas criadas** | "Quantidade de ofertas cadastradas pelas lojas no período." |
| **Ofertas ativadas** | "Quantidade de ofertas que os clientes finais ativaram no aplicativo durante o período." |
| **Taxa de conversão das ofertas em vendas** | "Percentual de ofertas ativadas pelos clientes no app que resultaram efetivamente em compras no período." |
| **Total de vendas realizadas** | "Quantidade total de pedidos concluídos no período, resultando em compras efetivamente finalizadas." |
| **Quantidade de conversão em vendas** | "Total de pedidos finalizados como vendas no período selecionado." *(gráfico de barras com legenda PDV/Aplicativo)* |
| **Faixa etária por gerações** | "Distribuição dos clientes que realizaram ativações no período, agrupados por gerações (ex.: Geração Z, Millennials, Geração X, Baby Boomers)." |
| **Região** | "Distribuição dos clientes que realizaram ativações no período, agrupados conforme a localização geográfica cadastrada (ex.: Sudeste, Sul, Nordeste)." — aqui **existe** tanto no painel por Loja quanto por Rede (diferente da Home de Vendas). |
| **Gênero** | Distribuição dos clientes que realizaram **ativações** no período, por gênero cadastrado. ⚠️ Hoje o tooltip do app mostra o mesmo texto da Home de Vendas ("realizaram compras") — é um erro de copy, já registrado em [ECP-1056](https://farmarcas.atlassian.net/browse/ECP-1056). |
| **Top produtos com mais ativações** | Produtos com maior número de **ativações** no período. ⚠️ Hoje o tooltip do app mostra o mesmo texto da Home de Vendas ("maior número de vendas") — erro de copy, já registrado em [ECP-1056](https://farmarcas.atlassian.net/browse/ECP-1056). |
| **Lojas sem ofertas em exibição** | "Apenas as lojas que não possuem nenhuma oferta ativa. Nessas condições, o app fica indisponível para os clientes até que novas ofertas sejam cadastradas." Fica logo abaixo de "Total de ofertas criadas"; tem um botão "Ver lojas sem ofertas" que baixa o Relatório de Lojas sem ofertas ativas (ver seção 5.4). |
| **Aviso: Loja indisponível no app** *(só no painel por Loja, loja única)* | "Essa loja está indisponível para os clientes no app porque não há nenhuma oferta ativa." |

### 5.3 Comportamento geral dos gráficos

- Todos os gráficos são feitos com a mesma biblioteca (Chart.js). Não existe nenhum gráfico com clique para filtrar ou "abrir detalhe" — a interação sempre para no hover.
- Nenhuma legenda é clicável para esconder/mostrar uma série — todas as legendas são listas estáticas de cor + rótulo (e às vezes %), só para leitura.
- Mudar o período no topo da tela **recarrega todos os cards da página** (uma nova chamada por card), não é um filtro local — por isso pode levar um instante para os cards atualizarem.
- Nos gráficos de rosca e no gráfico de gênero, quando não há nenhum dado no período, aparece um círculo cinza vazio no lugar do gráfico. Já Faturamento, Ticket Médio, Faixa etária e Região não têm essa ilustração — se não houver dado, a área do gráfico aparece em branco.
- "Top produtos" tem uma ilustração própria de vazio, com o texto "Sem dados... por enquanto!".

### 5.4 Relatórios exportáveis

Alguns cards da Home baixam um relatório em Excel (.xlsx) com o detalhe por trás do número exibido. Todos os arquivos inspecionados vieram do contexto "Geral" (visão agregada, nível Rede).

| Relatório | Como é baixado | Colunas |
|---|---|---|
| **Pedidos Faturados** | Botão **"Exportar"** no cabeçalho da Home de Vendas — funciona em qualquer uma das 3 abas (Faturamento/Pedidos cancelados/Pedidos concluídos), sempre traz o mesmo relatório. | Uma linha por **item** do pedido (não por pedido): Loja *(⚠️ hoje traz o CNPJ, não o nome — correção pendente, ver nota abaixo)*, Número do pedido, Data do pedido, Nome do cliente, CPF, Detalhe do pedido *(EAN do item)*, Método de pagamento, Método de entrega, Valor, Status. |
| **Pedidos em Aberto** | Botão **"Visualizar pedidos"** no card "Total de Pedidos em Aberto". | Rede, CNPJ, Nome da Loja, Número do pedido, Data do pedido realizado, Status (Pendente / Em separação / Liberado), Valor. |
| **Lojas com retirada ativa** | Botão **"Ver lojas com retirada"** no card "Lojas sem opção de receber em casa" (Home de Vendas, nível Rede). | Rede, CNPJ, Nome da loja. Deveria trazer só lojas do módulo Vendas sem entrega em domicílio *(⚠️ hoje não filtra corretamente por módulo — ver nota abaixo)*. |
| **Produtos mais ativados** | Botão **"Baixar produtos"** no card "Top produtos com mais ativações" (Home de Ofertas). | Ranking, EAN, Nome do produto, Quantidade de ativações — sempre Top 10. |
| **Lojas sem ofertas ativas** | Botão **"Ver lojas sem ofertas"** no card "Lojas sem ofertas em exibição" (Home de Ofertas, logo abaixo de "Total de ofertas criadas"). | Rede, CNPJ, Nome da loja. |

> **Ajustes pendentes nos relatórios** (todos já registrados em [ECP-1056](https://farmarcas.atlassian.net/browse/ECP-1056)): o cabeçalho "Loja" do relatório de Pedidos Faturados precisa deixar claro que traz o CNPJ, não o nome; e o relatório de Lojas com retirada ativa hoje não respeita o módulo da loja (deveria considerar só lojas do módulo Vendas).

---

## 6. Configurações da Loja

Dentro de uma loja, a aba **Configurações** tem um menu lateral com 3 grandes seções. Um widget **"Seu progresso"** no canto inferior acompanha quantas dessas configurações essenciais já foram concluídas, com atalho "Continuar configuração". As etapas contadas nesse checklist de onboarding são:

1. Informações da Loja
2. Endereço Comercial
3. Horário de atendimento
4. Criação de oferta

Ao concluir essas etapas, o Portal mostra a opção **"Faça Upgrade"**, convidando o associado a ativar o **módulo de Vendas** (checkout completo pelo app, em vez do módulo Ofertas) — com um botão "Acompanhar solicitação" para ver o status desse pedido.

**Fluxo de migração de Ofertas para Vendas (liberação da Chave de integração/API):**
1. O associado solicita a migração de Ofertas para o módulo Vendas pelo Portal.
2. A Chave de integração do ERP (API) é liberada e deve ser inserida no sistema ERP da loja.
3. A ativação do módulo e o espelhamento do estoque acontecem de forma **separada** — o módulo pode já estar ativo enquanto o estoque ainda está sincronizando; isso pode levar um tempo até os produtos aparecerem no app.
4. Se a solicitação ficar travada em "Aguardando" por muito tempo, ou o estoque não aparecer depois de um tempo razoável, o próximo passo é acionar o suporte do próprio sistema ERP para validar a integração do lado deles.

### 6.1 Dados da Loja

- **Informações da loja**: CNPJ (não editável), Razão social, Nome da loja no app (o nome que o consumidor vê), E-mail, Telefone, WhatsApp (pode ser um número 0800), Farmacêutico responsável e CRF, e a Chave de integração do ERP (não editável, gerada pela plataforma).
- **Endereço comercial**: CEP, Estado, Logradouro, Número, Complemento, Bairro, Cidade e Ponto de referência (opcional, ajuda o consumidor a localizar a loja). Há um mapa para confirmar visualmente a localização — mover o pin no mapa **não altera** o endereço textual cadastrado, serve só para ajuste visual/geolocalização.
- **Horário de Atendimento**: dias e horários em que a loja está aberta ao público. Ativa-se cada dia individualmente e define o intervalo "De/Até".

> **Existem 3 tipos de horário no Portal, e todos precisam estar corretos:**
> - **Horário de Atendimento** (aqui em Dados da Loja) — é o horário principal, o que o consumidor efetivamente vê ao buscar a loja no app.
> - **Horário de Entrega** (em Formas de Entrega) — define quando a loja aceita pedidos para entrega.
> - **Horário de Retirada** (em Formas de Entrega) — define quando o cliente pode buscar um pedido na loja.
>
> Os horários de Entrega e Retirada **não aparecem diretamente na vitrine do app**, mas alimentam o cálculo de quando o cliente pode escolher cada opção e qual será a previsão de recebimento. Se o horário exibido no app estiver errado, o primeiro lugar a checar é justamente qual desses três está desalinhado.

### 6.2 Formas de Entrega

**O que é?** Define como o consumidor pode receber o pedido feito no App: em casa ou retirando na loja. As duas opções têm configuração independente.

**Receber em casa** (toggle Ativado/Desativado):
- *Horário de funcionamento*: dias/horários em que a loja aceita pedidos para entrega (pode ser diferente do horário geral de atendimento da loja).
- *Raio de atendimento*: define, num mapa, a distância máxima atendida (limite de até 30 km) e uma tabela de faixas de **Alcance (km) × Taxa de Entrega (R$) × Tempo de Entrega**. É possível cadastrar quantas faixas forem necessárias — elas aparecem como uma lista, cada uma com um ícone de excluir ao lado, então dá para remover uma faixa já criada a qualquer momento. **Atenção:** depois de preencher uma faixa, é obrigatório clicar no botão **"+"** para adicioná-la à listagem antes de Salvar — se pular esse clique, os dados somem sem aviso.
- *Frete Grátis*: permite configurar frete grátis a partir de um valor mínimo de compra — uma estratégia para incentivar tickets maiores.

**Retirada na loja** (toggle Ativado/Desativado):
- *Horário de funcionamento*: dias/horários em que a loja aceita pedidos para retirada.
- *Tempo de retirada*: quantos minutos, após a confirmação do pedido, o produto fica disponível para retirada (ex: "A partir de 45 mins"). Esse tempo aparece para o consumidor no App.

### 6.3 Pagamentos

**Com maquininha**: não tem um interruptor geral — o controle é só pelas duas perguntas Sim/Não, "Deseja ativar o pagamento na entrega?" e "Deseja ativar o pagamento na retirada?" (a loja pode ter nenhum, um, ou os dois habilitados), mais a seleção de bandeiras aceitas (com atalho "Selecionar todas"):
- **Débito**: Banescard, Cabal, Elo, Hiper, Union Pay, Visa.
- **Crédito**: Alelo Pagamentos, Amex, Banescard, Cabal, Coopercard, Credz, Diners, Discovery Network, Elo, Hiper, Hipercard, JCB, Mais!, Mastercard, Sorocred, Union Pay, Visa.
- **Outros**: Dinheiro, Pix.

**Online**: ativa o pagamento online via integração com a **Braspag**. Precisa preencher dados fornecidos pela credenciadora/adquirente (Adquirente, se habilitou PIX, Nome na Fatura, MerchantId, MerchantKey, ClientID, ClientSecret) antes de conseguir ativar. Os campos ficam bloqueados até a integração ser conectada.

---

## 7. Estoque

A tela **Estoque** mostra o catálogo de produtos daquela loja específica, com:

- **Produto** (nome + EAN, com um ícone ⓘ — ver "Última atualização por produto" abaixo), **R$ App** (preço exibido no aplicativo) e **R$ customizado** (um preço específico, diferente do preço padrão do ERP, definido manualmente — pode ser removido para voltar ao preço original).
- **Estoque loja**: quantidade disponível.
- **Exibir preço**: toggle Sim/Não — controla se aquele produto aparece com preço visível no App.
- Toggle geral **Disponível**, indicador **ERP atualizado** (data/hora da última sincronização) e filtro por **Grupo**.

### Como o estoque da loja é montado

O ERP de cada loja envia **EAN, quantidade e preço** para o Portal. Para cada EAN recebido:
- Se o EAN **existe no catálogo oficial** (ver [Catálogo](#12-catálogo-admin)), o produto entra na lista de Estoque da loja.
- Se o EAN **não existe** no catálogo, o produto é **desprezado** — não aparece em lugar nenhum, sem erro ou aviso.

**A comunicação com o ERP é passiva e incremental:** o Portal só recebe e exibe o que o ERP manda — não temos como "puxar" dados por conta própria. E o ERP manda de forma incremental: só os EANs que tiveram alguma mudança (de preço ou de estoque) desde o último envio, não uma base completa a cada vez.

**De onde vem o preço "R$ App"?** O ERP envia **dois preços** por produto — um **"preço bruto" (full price)** e um **"preço de venda" (price)**. O Portal sempre exibe o **menor dos dois** recebidos, porque o associado pode ter algum desconto ou caderno de ofertas vinculado no próprio ERP — o ecommerce sempre reflete o preço mais vantajoso que o ERP informou.

**Como editar o preço manualmente:** clique no ícone de lápis (editar) na linha do produto — abre o modal **"Alterar preço do produto"**, mostrando o Preço App atual e um campo **"Novo preço"**. Não existe validação sobre esse valor: fica valendo exatamente o que for digitado, até ser removido; isso popula a coluna **R$ customizado**. **Importante: o estoque (quantidade) não é editável pelo Portal** — só o preço; a quantidade sempre reflete o que o ERP enviar. Hoje esse recurso é exclusivo do perfil **Contato cliente** (balconista). Se muitos produtos aparecerem com valor divergente ao mesmo tempo, o recomendado é abrir chamado com o suporte do ERP pedindo uma atualização forçada em lote, em vez de corrigir um por um manualmente.

### Última atualização por produto

Ao lado do EAN de cada produto, um ícone ⓘ mostra em tooltip a **última atualização de estoque** e a **última atualização de preço** daquele EAN especificamente (podem ser datas diferentes, já que o ERP envia uma ou outra de forma independente/incremental).

### Os dois "interruptores" da tela de Estoque

- **"Disponível: Sim/Não"** (toggle geral, no topo): liga/desliga **a loja inteira** no aplicativo. É o mesmo toggle que, se desligado por muito tempo de comunicação com o ERP (72h), o sistema aciona automaticamente (ver alerta abaixo) — mas também pode ser desligado manualmente pelo próprio associado, por exemplo quando ele percebe muitos problemas de preço/estoque e prefere pausar a loja no app enquanto ajusta o ERP.
- **"Exibir preço: Sim/Não"** (por linha de produto): o mesmo conceito, mas no nível do produto individual — desligar esconde só aquele EAN específico do app para aquela loja, sem afetar o restante do estoque.

**Como ocultar um produto com preço/estoque errado:** desmarque a opção "Exibir preço" na linha do produto — ele some do app até a correção ser feita, sem precisar remover o cadastro.

**Como ocultar medicamentos do aplicativo:** existem só duas formas — desabilitar o estoque geral daquele grupo de produtos, ou desativar item por item dentro do Estoque. Hoje **não é possível** ocultar por categoria inteira de uma vez.

> **Alerta importante:** se aparecer um aviso vermelho no topo da tela dizendo que os preços foram **ocultados no aplicativo por falha de comunicação com o ERP há mais de 72 horas (3 dias)**, significa que a loja parou de sincronizar dados com o ERP e os produtos ficaram invisíveis para o consumidor no App — essa desativação automática é proposital, para evitar venda com preço/estoque desatualizado. Nesse caso, a orientação é:
> 1. Abrir chamado com o suporte técnico do seu sistema ERP.
> 2. Solicitar a **"Nova Integração de Preço e Estoque"**.
> 3. Informar ao suporte a **Chave de integração do ERP** da loja (em `Configurações > Dados da Loja > Informações da loja`).
>
> Lembrando que a loja também pode aparecer fora do app por **desativação manual** do estoque (toggle "Disponível" desligado no Portal) — vale checar os dois motivos antes de abrir chamado.

### Solicitando um produto novo

Se a loja precisa vender um produto que ainda não existe no catálogo mestre da plataforma, use o ícone de solicitação de produto na barra de ferramentas da tela Estoque (ao lado do ícone de exportar). Ele abre o formulário **"Solicitar produto"**, onde é possível informar Nome do produto e Fabricante, e depois, para cada item, o **Código de barras (EAN)**, a **Apresentação** (ex: "Dorflex caixa com 10") e uma imagem/foto de referência — dá para solicitar **até 50 produtos de uma vez**. Essa solicitação segue para aprovação do Admin (ver [Catálogo](#12-catálogo-admin)).

### Relatório de Estoque/Preço

O ícone de exportar na barra de ferramentas da tela Estoque baixa um Excel (.xlsx) com **todo o estoque daquela loja**. Colunas: Ean, **Preço bruto** (full price recebido do ERP), **Preço Venda** (price recebido do ERP — o Portal exibe sempre o menor entre os dois, ver acima), Categoria, Nome do produto, Estoque, Data da última atualização.

> **Em processo de ajuste** ([ECP-1064](https://farmarcas.atlassian.net/browse/ECP-1064)): a coluna única "Data da última atualização" vai ser substituída por duas colunas separadas — última atualização de **estoque** e última atualização de **preço** — para bater com a informação que já aparece no ícone ⓘ de cada produto na tela.

---

## 8. Pedidos

A tela **Pedidos** é onde o dia a dia operacional acontece — é a tela principal de trabalho do perfil **Contato cliente** (balconista).

Os pedidos são organizados num quadro (kanban) por status, cada um com contador:

| Status no Portal | O que significa |
|---|---|
| **Na fila** | Pedido novo, aguardando início do atendimento. |
| **Em separação** | Pedido sendo preparado/separado na loja. |
| **Liberados** | Pedido pronto, liberado para entrega ou retirada. |
| **Concluídos** | Pedido entregue/retirado com sucesso. |
| **Cancelados** | Pedido cancelado (pela loja ou pelo consumidor). |

Ao clicar num pedido, o painel de detalhe mostra: dados do cliente (nome, CPF), loja de origem, linha do tempo (horário do pedido, horário da entrega), contato e endereço de entrega, os itens comprados e o total.

**Sobre os itens do pedido**, cada produto pode trazer uma etiqueta de origem de preço:
- **Preço loja**: preço padrão cadastrado no Estoque da loja.
- **Preço PEC**: preço vindo do sistema PEC (base de clientes/preços da rede).
- **Sem estoque**: alerta de que o item foi vendido sem estoque confirmado disponível — vale atenção redobrada na separação desse pedido.

Na forma de pagamento **Dinheiro**, o Portal calcula automaticamente o **Valor a cobrar** e o **Troco** com base no total do pedido.

### Cancelando um pedido

Ao cancelar um pedido, abre o modal **"Cancelar pedido #[número]"**, pedindo para **selecionar o motivo da recusa**: Endereço incorreto, Cliente não estava no local indicado, Cliente não precisava mais dos itens, Cliente solicitou produto por engano, Pedido duplicado, Pedido atrasado, Pedido indisponível, Suspeita de fraude, Sem estoque. A ação exige confirmação e **não pode ser desfeita**.

Se o pedido já tinha sido **pago online**, o modal mostra um selo **"Pedido pago"** com o aviso "O pagamento deste pedido já foi realizado", e um lembrete: **"Ao cancelar este pedido, lembre-se de informar ao cliente sobre as políticas de estorno e reembolso"** — o cancelamento em si não dispara um estorno automático visível nessa tela, é um lembrete operacional para o atendente tratar o reembolso separadamente.

### Relatório de Pedidos (Exportar)

O botão **"Exportar"** no topo da tela Pedidos abre um seletor de período (**Últimos 7 dias / 30 dias / 90 dias / Personalizado**) e o botão **"Gerar Relatório"**, que baixa um Excel (.xlsx) com o detalhe dos pedidos.

**Colunas observadas hoje:** Número do pedido, Valor, Itens (quantidade), Data da compra, Taxa de entrega, Tipo da compra (Delivery/Retirada), Nome da Loja, CNPJ, Pagamento (Online/Offline), Status (Entregue/Retirado/Cancelado/"Status desconhecido"), Motivo, CPF, Meio de Pagamento (Pix/Cartão de Crédito/Dinheiro), Data de Cancelamento (só populada para pedidos cancelados).

> **Atenção — coluna "Motivo" tem duplo uso:** para pedidos entregues/retirados, ela mostra o motivo do tipo de compra ("Entrega em domicilio"/"Retirar na loja"); para pedidos **cancelados**, o mesmo campo passa a mostrar o **motivo do cancelamento** (ex.: "Cliente solicitou produto por engano"). É a mesma coluna sendo usada para dois propósitos diferentes dependendo do status.

> **"Status desconhecido":** hoje esse valor pode aparecer na coluna Status — é um estado inconsistente já identificado pelo time de produto, que deve ser desconsiderado do relatório (ver ajuste abaixo).

**Este relatório está em processo de adequação — ticket [ECP-747](https://farmarcas.atlassian.net/browse/ECP-747)** ("Refinado", ainda não implementado). Regras definidas para a versão corrigida:

1. **Filtro por status é dinâmico:**
   - Pedidos em status **ativo** (Na fila / Em separação / Liberados) devem **sempre** aparecer no relatório, **ignorando** o período selecionado — é uma "fotografia" em tempo real do que está em aberto.
   - Pedidos em status **final** (Concluídos / Cancelados) devem respeitar o período selecionado, mas filtrando pela **data em que o pedido entrou nesse status** (`updatedAt`), não pela data de criação — considerando o dia cheio (00:00:01 do primeiro dia até 23:59:59 do último), com cuidado para o fuso não deslocar pedidos para o dia errado.
2. **Nova coluna "Usuário Cancelamento"**: para pedidos concluídos/cancelados, deve trazer o usuário responsável pela mudança de status; se o cancelamento foi feito pelo próprio ERP (sem usuário do Portal envolvido), o valor deve ser **"ERP"**.
3. **Lojas em grupo:** ao exportar de uma loja que faz parte de um Grupo de lojas (qualquer configuração de estoque), o relatório deve trazer os pedidos de **todas as lojas do grupo**, ignorando qualquer filtro de loja aplicado pelo usuário.
4. **Entrega do arquivo:** se o período selecionado for menor que 6 meses, o download deve acontecer direto na tela (com toast de sucesso, sem abrir modal); para períodos maiores, mantém-se o fluxo atual (envio, possivelmente por e-mail).
5. **"Status desconhecido"** deve ser desconsiderado/excluído do relatório.

> Os pontos sobre substituir o envio por e-mail (SendGrid) por download direto, e um possível limite de tamanho para esse download, ainda estavam em discussão no ticket — **não estão decididos**, não tratar como regra confirmada.

---

## 9. Promoções

A tela **Promoções** tem duas visões, cada uma em sua aba:

- **Individuais**: promoções aplicadas a um produto específico.
- **Por grupo**: promoções aplicadas a um **Grupo de produtos** (conjunto de produtos relacionados — ex: uma linha de uma marca).

Cada linha mostra: Ativação, Vendas, Conversão, Tipo de oferta, Período de divulgação e Status (**Ativa**, **Finalizada** ou **Cancelada**). É possível selecionar várias promoções e cancelá-las em lote, e destacar uma promoção com a etiqueta **"Em destaque ⭐"** — não há limite de quantas promoções podem estar em destaque ao mesmo tempo, e ter ao menos uma cria uma seção própria chamada **"Ofertas em destaque"** no aplicativo.

**Filtros e ordenação disponíveis:**
- **Tipo de oferta**: Preço fixo, Desconto %.
- **Status**: Ativa, Finalizados, Cancelados. *(nota: os rótulos do filtro aparecem no plural, mas o valor de Status exibido nas linhas é sempre no singular — "Finalizada"/"Cancelada" — pequena inconsistência de gramática, não afeta o funcionamento.)*
- **Ordenar**: Data, Nome, Mais ativadas, Menos ativadas, Mais vendidas, Menos vendidas, Maiores conversões, Menores conversões.

Um filtro aplicado aparece como um chip removível (ex.: "Preço fixo ✕") acima da lista.

**Acesso do perfil Contato cliente (balconista):** o balconista **vê** a listagem completa de Promoções (individuais e por grupo, com todas as métricas) e pode exportar o relatório, mas **não tem o botão "Nova promoção"** — reforça a regra já mencionada de que esse perfil não cria/cancela promoções.

**Medicamentos controlados não entram em promoção.** Hoje o Portal já impede isso na própria criação da oferta: esses produtos aparecem desabilitados na lista de seleção de produtos do passo 5.

### Relatório de ofertas (Exportar)

O botão **"Exportar"** abre o painel **"Relatório de ofertas"**, com dois calendários de mês lado a lado (para escolher um intervalo de datas) e o botão **"Gerar relatório"**. **O relatório é filtrado pela data de criação da promoção**, não pela data de vigência/divulgação.

**Colunas do relatório:** Item em oferta (Produto/Familia), Tipo oferta (aqui aparece como "Preço fixo"/"Porcentagem %" — nomenclatura um pouco diferente da usada no wizard de criação, que mostra "Desconto %"), Nome produto, Ean, Ativação, Vendas, **Pdv ou App** (formato "0/0" — mostra quantas vendas daquela oferta vieram do PDV da loja vs. do aplicativo), Conversão, Início da divulgação, Fim da divulgação, Status, Criação.

> **Colunas sendo removidas** (ver [ECP-1062](https://farmarcas.atlassian.net/browse/ECP-1062)): o relatório hoje também traz **"Genero"** e **"Faixa etária"** (resquício de uma segmentação de público que existia numa versão antiga da tela de criação — o app nunca respeitou essa segmentação, é um dado morto) e uma coluna **"Média"** cujo cálculo não está claro nem para o time de produto. As três serão removidas do relatório. A mesma segmentação por Gênero/Faixa etária também está sendo removida das telas do Portal (drawer/criação de promoção) — ver [ECP-1063](https://farmarcas.atlassian.net/browse/ECP-1063).

### Criando uma nova promoção

O formulário de criação segue 5 passos:

1. **O que você quer promover?** — escolha entre **Um produto** ou **Grupo de produtos**.
   - Para um produto: escolha o tipo de desconto (ex: Desconto %).
   - Para um grupo: escolha a regra de composição do grupo (ex: "Mesmo produto • mesma marca") e o tipo de desconto (ex: "Preço fixo (de/por)").
2. **Onde essa promoção será válida?** — seleciona a(s) loja(s) participante(s).
3. **Quando a promoção estará ativa?** — data de início/fim e dias da semana em que a promoção roda.
4. **Regras da promoção** — hoje só o **Limite por compra** é configurável aqui. *(Os campos "Tempo para uso" e "Novo uso da oferta" existiam antes e foram removidos da tela — o sistema aplica um padrão fixo internamente: 1 dia de tempo de uso e "Não renovar" para novo uso, sem exibir isso ao associado.)*
5. **Produtos da promoção** — depende da escolha do passo 1:
   - *Um produto*: busque por nome/EAN, aplique um desconto geral de uma vez (campo "Desconto geral" + botão "Aplicar") ou ajuste o desconto produto a produto. Também é possível **importar uma planilha (.xlsx)** com a lista de produtos e descontos — o Portal informa quantos produtos foram encontrados e quantos não puderam ser importados.
   - *Grupo de produtos*: busque um grupo já cadastrado (ver [Catálogo](#12-catálogo-admin)) e defina o preço "De" e "Por" para o grupo inteiro.

### Detalhes de uma promoção

Clicando numa promoção da lista, abre um painel (drawer) com o produto/grupo, status, EAN, uma seção **"Desempenho"** (Ativação/Vendas/Conversão) e a lista de **lojas participantes**, com opção de remover uma loja específica da promoção sem cancelar tudo.

**Os botões no rodapé do drawer mudam conforme o status da promoção:**
- **Promoção Ativa**: mostra **"Cancelar oferta"** e **"Destacar oferta"** (ou "Retirar destaque", se já estiver em destaque).
- **Promoção Finalizada ou Cancelada**: mostra só o botão **"Repetir oferta"** (ver abaixo) — não é mais possível cancelar ou destacar uma promoção que já terminou.

**Perfil Contato cliente (balconista):** não vê **nenhum** botão no rodapé desse drawer, em nenhum status — não cancela, não destaca e não repete promoções.

O cancelamento de uma promoção pede confirmação antes de ser efetivado, já que a ação não pode ser desfeita.

### Repetindo uma promoção

No drawer de detalhes de uma promoção **Finalizada** ou **Cancelada**, o botão **"Repetir oferta"** leva direto para o formulário de criação de uma nova promoção, **pré-preenchido com todos os dados da promoção original** (produtos, lojas, tipo de desconto, regras) — **exceto as datas de início e fim**, que precisam ser escolhidas de novo. Qualquer campo pré-preenchido pode ser alterado antes de salvar. Funciona tanto para promoções individuais quanto por grupo.

---

## 10. Banners

A tela **Banners** (também chamada de "Anúncios do aplicativo") controla os banners exibidos no carrossel da home do App.

### Listagem "Anúncios do aplicativo"

Filtros no topo: **Espaço do aplicativo** (hoje só "Carrossel da home"), **Estados**, **Lojas**, **Status** (ex.: "Em exibição"). A tabela mostra: **UFs** (onde o banner é exibido), **Posição** (arrastar para reordenar, com opção de excluir), **Mídia** (miniatura + nome), **Destino (ir para...)** — mostra o tipo de destino escolhido (ex.: "Departamento › Cosméticos", "Seleção de pr... › 72 produtos"), métricas de **Exibições** e **Cliques**, e **Divulgação** (Início/Fim).

### Criando um novo banner (wizard de 4 passos)

Botão **"Novo banner"** abre um wizard com 4 etapas, mostradas como uma trilha no topo da tela: **Início → Espaços → Lojas → Configurações**.

1. **Início**: "O que você gostaria de fazer?" — hoje só existe a opção **"Inserir um banner"**.
2. **Espaços**: "Em qual área do aplicativo você gostaria de inserir um banner?" — opções **"No carrossel da home"** (única disponível hoje) e **"Em uma vitrine de produtos"** (marcada **"Em breve"**, desabilitada). A tela mostra um preview em tempo real dentro de um mockup do app. Especificações do banner: até **5 banners** por vez, dimensão **320×220px**, peso até **1MB**, formatos **PNG e JPG**.
3. **Lojas**: "Em quais regiões ou lojas você gostaria de exibir seu(s) banner(s)?" — busca por CNPJ, nome ou endereço da loja; opção **"Todas as lojas"**; ou seleção por Estado (UF), cada UF expansível (para refinar por loja específica dentro do estado).
4. **Configurações**: para cada banner enviado (até 5), configure individualmente pelo botão **"Configurar"** no card do banner:
   - **"Ao clicar, leve o cliente para..."** — 4 tipos de destino:
     - **Banner estático**: sem nenhuma ação ao clicar, o banner só é exibido.
     - **Departamento**: leva o cliente para um departamento específico do catálogo (ex.: Cosméticos).
     - **Uma seleção de produtos**: busca produtos por nome/EAN (ou importa uma lista via botão "Importar") para montar a lista de produtos de destino. **Atenção:** só lojas que têm esses produtos em estoque exibirão esse banner — se o banner não aparecer numa loja específica, o motivo mais provável é falta de estoque desses produtos ali.
     - **Um link externo**: campo de URL (`https://`) para redirecionar para fora do app.
   - **"Exibir este banner no período de..."**: datas de Início/Término, ou toggle **"Banner permanente"** (sem data de término).
   - Ações: **Cancelar**/**Salvar** (confirma a configuração daquele banner específico) e, no rodapé geral do wizard, **Voltar**/**Salvar e publicar** (finaliza e publica todos os banners do carrossel).

---

## 11. Usuários

A tela **Usuários** lista as pessoas com acesso ao Portal (nome, Perfil de acesso, total de lojas vinculadas) e permite convidar novos usuários.

Ao convidar/editar um usuário, defina o **Perfil de acesso** (ver [seção 2](#2-perfis-de-acesso)) e, dependendo do perfil escolhido, vincule-o a uma loja específica (Contato cliente), a uma ou mais lojas (Gestor de Loja) ou a uma ou mais Redes (Gestor de Rede).

**Um mesmo e-mail não pode ser convidado duas vezes.** O Portal bloqueia o convite se o e-mail já existir no sistema (mensagem "Parece que o usuário já existe em nosso sistema", com opção de voltar ou editar o usuário existente) — não é possível, por exemplo, dar a uma pessoa um segundo login para acumular acesso a outra Rede/loja; o vínculo adicional precisa ser feito editando a mesma conta.

**Não existe uma função para mudar um usuário/loja de GE (Grupo Econômico).** Se uma loja é removida do Portal, todos os usuários vinculados a ela perdem esse vínculo automaticamente:
- Um usuário **Contato cliente** (vinculado só àquela loja) continua conseguindo logar, mas passa a ver uma **tela em branco**, sem lojas para trabalhar.
- Os demais perfis (Gestor de Loja/Rede/Admin), se tiverem acesso a outras lojas, simplesmente deixam de ver os dados da loja removida e continuam vendo as demais normalmente.

---

## 12. Catálogo (Admin)

O módulo **Catálogo** é exclusivo do perfil **Admin** (time Farmarcas) e contém o cadastro mestre de produtos, **compartilhado entre todas as Redes** da plataforma.

**O que o Associado precisa saber:** o lojista não cadastra produtos novos livremente — todo produto vendido no App já precisa existir nesse catálogo central, com todas as informações de cadastro (nome, marca, fabricante, se é medicamento, categorização, imagens) e status "Publicado".

> **Regra de negócio central do Catálogo:** o estoque de cada loja é montado **a partir** deste catálogo oficial. Quando a integração de uma loja com o ERP dela envia dados de um produto (por EAN), o Portal só usa esse EAN para montar o estoque da loja **se ele já existir no catálogo oficial**. Se o EAN não existir no catálogo, o Portal simplesmente **ignora** aquele item — ele não entra no estoque da loja e não gera nenhum aviso para o associado. Por isso a curadoria do Catálogo (o que existe, com qual EAN) afeta diretamente o que cada loja consegue vender no app.

### Produtos

Listagem com todos os produtos cadastrados na plataforma (departamento, categoria, subclasse, grupo de produtos e status).

**"Permitir promocionar"** controla se o produto pode ser adicionado a um Grupo de produtos promocional — se desativado, o produto não pode ser incluído. Atenção: se o produto **já estava** num grupo promocional e depois recebe essa flag desativada, ele **não é removido automaticamente** do grupo — a restrição vale só para novas inclusões.

**"Despublicar produto"** remove o produto do catálogo oficial: mesmo que uma loja continue enviando aquele EAN via integração com o ERP, o produto não volta a ser exibido no catálogo dela. O histórico do EAN é mantido em pedidos antigos e relatórios já existentes — só a exibição futura é bloqueada.

#### Cadastro de Novo Produto (campo a campo)

| Campo | Obrigatório? | O que significa |
|---|---|---|
| **Nome do produto** | Sim | Nome comercial do produto (ex.: "Dipirona"). |
| **Código de barras (EAN)** | Sim | Identificador único do produto. É a chave que conecta este catálogo oficial ao estoque de cada loja — ver regra de negócio acima. |
| **Marca** | Sim | Marca comercial do produto. |
| **Fabricante** | Não | Empresa fabricante (ex.: "Sanofi"). |
| **Tipo de cadastro** (Medicamento / Não Medicamento) | Sim | Define o restante do formulário — ver comportamento condicional abaixo. |
| **Registro MS** | Depende do Tipo de cadastro | Número de registro do produto na ANVISA (Ministério da Saúde). |
| **Tarja** (Sem tarja / Tarja Vermelha / Tarja Preta) | Depende do Tipo de cadastro | Classificação regulatória da ANVISA: **Sem tarja** = venda livre; **Tarja Vermelha** = venda sob prescrição médica comum; **Tarja Preta** = medicamento controlado/psicotrópico, com retenção de receita (é o que o glossário do produto chama de **Controlados**). |
| **Permitir promocionar** (toggle, padrão Não) | — | Ver definição acima, na seção Produtos. |
| **Genérico** (toggle, padrão Não) | — | Quando ativado, exibe a tag "genérico" no detalhe do item para o consumidor no app. |
| **Imagens do produto** | Sim | Até **1 imagem**, formatos JPG ou PNG, até 2MB. |
| **Princípios ativos** | Sim | Um ou mais princípios ativos (campo de tags, botão "+" para adicionar mais de um). Melhora a busca e a precisão do resultado no app. |
| **Descrição curta** | Sim | Texto resumido do produto, até 650 caracteres. |
| **Departamento / Categoria / Subcategoria** | Departamento e Categoria sim, Subcategoria não | Árvore de categorização — ver comportamento condicional abaixo, e a árvore completa logo a seguir. |

**Comportamento condicional do "Tipo de cadastro":**
- **Medicamento** selecionado → os campos **Registro MS** e **Tarja** aparecem e passam a ser **obrigatórios**; o campo **Departamento** fica restrito às opções **Farmacinha** ou **Medicamentos**.
- **Não Medicamento** selecionado → o campo **Registro MS** aparece mas **não é obrigatório**; o campo **Tarja** **não aparece**; o **Departamento** libera as demais opções (todas exceto Farmacinha/Medicamentos).

**Ações do formulário:** **Cancelar** (descarta), **Salvar como Rascunho** (mantém o cadastro sem publicar no catálogo), **Publicar** (torna o produto visível/utilizável no catálogo oficial).

#### Árvore de Categorização (Departamento → Categoria → Subcategorias)

> A fonte desta árvore tem algumas entradas duplicadas ou com grafia inconsistente entre si (ex.: "Condicionador" e "Condicionadores"; "Azia E Má Digestão" e "Azia e Má Digestão"; "Sabonete/Gel Limpeza" e "Sabonete / Gel Limpeza"). Mantive as variações como estão na fonte em vez de unificar por conta própria — vale uma limpeza futura no cadastro se fizer sentido para o time.

**Tipo de Produto: Medicamento**

- **Farmacinha**
  - Dor e Febre: Analgesicos / Antitermicos
  - Azia e má digestão: Anti Gases, Antiacidos, Antidiarreicos, Má Digestão / Hepatológicos, Outros, Prisão de Ventre
  - Alergias e infecções: Antialergicos, Antigripais, Pastilhas, Soro Nasal, Spray Garganta, Xaropes
  - Fitoterápicos e naturais: Antroposófico, Aromaterapia, Calmante Natural ou Tratamento de Insônia, Fitoterápico, Homeopático
  - Vitaminas: Omegas, Outros Nutrientes Puros, Polivitaminicos
  - Outros: Outros
- **Medicamentos**
  - Medicamentos de Prescrição: Anti-Alégicos, Anti-Inflamatórios, Asma, Azia E Má Digestão, Azia e Má Digestão, Congestão Nasal, Controle De Peso, Controle de Peso, Desconforto Abdominal E Intestino, Desconforto Abdominal e Intestino, Diabetes, Dor De Garganta, Dor E Febre, Emagrecimento, Endocrinologia, Enxaqueca, Gastrite, Ginicologia, Gripe E Resfriado, Impotência, Infecções, Infertilidade, Insonia, Nutrientes, Outras Especialidades, Outros Medicamentos de Prescrição, Pressão Alta, Pílulas Anticoncepcionais E Diu, Reumatologia, Rinite E Sinusite, Tireóide, Tosse, Visão
  - Medicamentos com Retenção de Receita: Antibiótico, Controlado (Port 344)

**Tipo de Produto: Não Medicamento**

- **Cosméticos**
  - Rosto: Hidratação, Limpeza, Outros Cuidados, Solar, Tratamento (Anti Acne, Anti Idade)
  - Corpo: Bronzeadores, Hidratação, Protetor Solar, Pós Sol
  - Outros: Hidratação, Limpeza, Outros, Outros Cuidados, Solar, Tratamento (Anti Acne, Anti Idade)
- **Cuidados Masculinos**
  - Higiene: Acessorios Masculinos, Aparelho / Lamina De Barbear, Cosmeticos Barba, Shampoo / Condicionadores, Tonalizante Para Barba E Cabelo
  - Outros: Outros Cuidados
- **Cuidados pessoais**
  - Acessórios: Acessórios para Inalação, Caneta de Insulina, Coletor Descartável, Lancetas e Agulhas, Outros Acessórios, Seringas, Tiras Reagentes
  - Primeiros Socorros: Alcool 70, Algodão, Antiséptico e Cicatrizantes, Contusão, Curativos e Bandagens, Fitas Adesivas, Gaze e Atadura, Luva Descartável, Máscara Descartável, Outros Primeiros Socorros, Soro Fisiológico, Água Oxigenada 10vol
  - Auto Testes: Auto Teste Colesterol, Auto Teste Covid, Auto Teste Hiv, Outros Testes, Teste Fertilidade, Teste Gravidez
  - Aparelhos: Balança, Glicosímetro, Lancetador, Monitor De Pressão, Nebulizador ou Inalador, Outros Aparelhos, Oxímetro, Termômetro, Umidificador ou Purificador
  - Ortopedia: Bengala e Muleta, Bota Ortopédica, Cinta e Meia de Compressão, Joelheira e Tornozeleira, Munhequeira e Cotoveleira, Outros Acessórios Ortopédicos, Protetor De Hérnia, Tipóia, Colar Cervical e Corretor Postural
  - Cuidado com os pés: Calcanheira, Palmilhas e Protetor de Joanete
- **Dermocosméticos**
  - Corpo: Capilar, Hidratação, Limpeza, Outros Cuidados, Solar, Tratamento
  - Rosto: Hidratação, Limpeza, Outros Cuidados, Solar, Tratamento
  - Nutricosméticos: Nutricosmeticos
  - Outros: Outros
- **Higiene e beleza**
  - Cabelos: Condicionador, Condicionadores, Finalizadores/Produtos Sem Enxágue, Finalizadores / Produtos Sem Enxague, Máscaras de Tratamento, Mascaras De Tratamento, Shampoo, Acessórios Para Cabelo, Agua Oxigena 20Vol 30 40, Outros, Po Descolorante, Pomadas E Gel Capilar, Tonalizantes E Tinturas, Tratamento Piolho
  - Higiene Pessoal: Sabonete/Gel Limpeza, Sabonete / Gel Limpeza, Absorventes, Acessorios Higiene, Antifungicos, Depilação (Lamina, Ceras, Etc), Descolorantes, Fralda Adulto, Hastes Flexiveis, Lenco / Toalha Umedecida Adulto, Lenço De Papel, Outros Cuidados de Higiene, Papel Higienico, Repelentes, Sabonete Intimo
  - Beleza: Acessorios Maquiagem, Acessórios Para Unha, Cutelaria, Esmaltes, Maquiagem, Outros
  - Higiene Oral: Acessorios Protese Dental, Creme / Gel Dental, Enxaguante Bucal, Escova Dental, Fio / Fita Dental, Limpador De Lingua, Outros
  - Desodorantes: Aerosol, Bastão (Stick), Creme, Outros, Roll-On
  - Cuidado para os olhos: Alivio Vermelhidão, Lagrimas Artificiais, Limpadores De Lentes De Contato, Outros Cuidados para os Olhos
  - Cuidados Complementares: Antitabagismo, Outros, Ouvidos
  - Acessórios para cabelos: Outros Acessorios Cabelo, Secadores / Chapinhas / Modelador De Cachos
  - Higiene do Ambiente: Limpeza
- **Infantil**
  - Amamentação: Absorvente Seios, Bomba Tira Leite, Concha Para Seios, Outros
  - Acessórios: Acessorios Banho, Acessorios Chupeta, Acessorios Mamadeira, Acessórios Para Alimentação, Alimentadores, Chupetas, Copos, Mamadeiras, Mordedor, Outros Produtos de Puericultura
  - Higiene do Bebê: Aspirador Nasal, Condicionadores, Creme / Gel Dental, Dedeira, Escova Dental, Fraldas, Lenco / Toalha Umedecida, Outros Produtos de Higiene Infantil, Pente / Escova Cabelos, Repelentes, Shampoo, Talcos, Tesoura / Cortador Unha
  - Nutrição: Cereais, Formulas, Leites, Outros Produtos de Nutrição Infantil, Papinhas, Snacks, Suplemento Alimentar Em Pó, Suplemento Alimentar Pronto Para Consumo
  - Cuidados: Colonias, Creme Assaduras, Creme Hidratante, Outros Cuidados, Protetor Solar
  - Outros: Outros
- **Nutrição e alimentos**
  - Alimentos: Adoçantes, Bala/Goma de Mascar e Pastilhas, Barra de Cereais, Barra de Proteína, Chocolate/Doce e Confeitos, Diet ou Ligth, Orgânico ou Integral, Outros Alimentos, Salgadinho e Snack
  - Bebidas: Chá, Energético, Hidratação Oral, Outras Bebidas, Suco ou Refrigerante, Suplemento Alimentar Pronto Para Consumo, Água
  - Conveniência: Diversos, Pilha ou Bateria
- **Outros**
  - Outros: Outros
- **Saúde Sexual**
  - Acessórios Sexuais: Acessorios Intimos, Gel De Massagem
  - Lubrificantes: Lubrificante Intimo
  - Outros: Outros
  - Preservativos: Preservativo Feminino, Preservativo Masculino
- **Suplementos Alimentares**
  - Fitness: Creatina, Hipercaloricos, Outros Suplementos, Outros Suplementos Fitness, Proteinas E Bcaa, Pré-Treino, Shakes Emagrecedores, Termogenicos
  - Nutrição Adulto: Fórmula Especial Adulta, Suplemento Alimentar Em Pó
  - Outros: Outros

### Grupos de produtos

> Na interface atual, essa entidade ainda aparece com o nome **"Família"** ("Nova família", "Composição da família") — é a mesma coisa que **Grupo de produtos**, usado na criação de [Promoções por grupo](#9-promoções); o nome está em processo de padronização em todo o Portal.

Um Grupo de produtos reúne vários produtos sob uma regra de composição (ex: "produtos iguais de uma mesma marca"), com nome, imagem, descrição e a lista de produtos que fazem parte dele.

### Solicitações de produtos

Quando uma loja precisa de um produto que ainda não existe no catálogo mestre, ela envia uma **solicitação** pelo formulário "Solicitar produto" (acessível pela tela [Estoque](#7-estoque) — ver "Solicitando um produto novo"), informando nome, fabricante, EAN(s), apresentação e imagem de referência. Essa tela de Catálogo é onde o **Admin** revisa a fila de solicitações (Rede de origem, nome do produto, EAN, data, status Pendente/Aprovado/Reprovado) e aprova ou reprova — o produto só passa a existir na plataforma (e pode ser vendido) depois de aprovado.

---

## 13. Acesso ao Portal: Login, Senha e Cadastro

### Login

Tela inicial do Portal: **"Bem-vindo — Faça login para acessar sua conta."** Campos **E-mail** e **Senha** (com ícone de olho para mostrar/ocultar), checkbox **"Lembrar senha"**, link **"Esqueceu a senha?"** e botão **"Entrar"**.

### Esqueceu a senha

Ao clicar em "Esqueceu a senha?": tela **"Esqueceu a senha?"** — "Basta inserir o seu e-mail e enviaremos um link para você redefinir a sua senha." Campo de e-mail cadastrado, botão **"Enviar"**, e link **"Voltar ao login"**. Depois de enviar, aparece uma tela de sucesso: **"E-mail enviado — Confira sua caixa de entrada e siga os passos para recuperar sua senha. Caso não tenha recebido, verifique sua caixa de spam."**, com botão "Fechar".

> **Diferente do App:** no aplicativo do consumidor final, a redefinição de senha é feita por **CPF**; no Portal, é feita por **e-mail com link de redefinição** — são fluxos diferentes, não confundir.

### Completando o cadastro (convite de usuário)

Quando um usuário é convidado (ver [Usuários](#11-usuários)), ele recebe algo (provavelmente um e-mail — a ser confirmado) que leva a um fluxo de **"Complete seu cadastro"** em 2 passos, com barra de progresso:

1. **Passo 1**: "Preencha os campos abaixo para finalizar o seu cadastro e começar a usar o Radar E-commerce." Campos: **Nome completo** e **CPF**. Botão "Avançar".
2. **Passo 2**: Campos **Nova senha** e **Confirmar nova senha**, com uma lista de requisitos de senha exibida ao lado (mínimo de caracteres, letra maiúscula/minúscula, caractere especial). Botão **"Concluir cadastro"**.

Ao final, tela de sucesso: **"Parabéns, cadastro concluído! Agora você está redirecionado para a tela de login..."**, com botão **"Fazer login"**.

**Do lado de quem convida** (ver [Usuários](#11-usuários)): o convite é feito por um modal simples — só o **e-mail** do convidado (com validação, bloqueando duplicados), mais o Perfil de acesso e o vínculo a loja/lojas/rede. Não há campos adicionais (nome, telefone etc.) nesse momento — esses dados só são preenchidos pelo próprio convidado no fluxo de "Complete seu cadastro" descrito acima.

---

## Notas de manutenção deste documento

- **Em aberto (baixa prioridade, achado técnico):** o `SessionPermissionGuard` do front-end (permissões finas tipo `offer:*`/`product:*`/`order:*`) segue desabilitado no código-fonte; o time de produto não confirmou se é proposital (backend cobre a validação) ou dívida técnica — sem impacto conhecido no dia a dia do associado, mantido aqui só como registro para o time de engenharia.
- **Resolvido:** Rede = bandeira/franquia (ex: ACFARMA, Ultra Popular); GE (Grupo Econômico) = conjunto de lojas do mesmo empresário dentro de uma Rede — conceito de negócio por trás da funcionalidade Grupo de lojas.
- **Resolvido:** o fluxo de Solicitação de produto pelo Associado foi identificado (ícone na tela Estoque) — ver seção 7.
- **Resolvido:** independentemente do tipo de estoque (Espelhado/Integrado/Independente), o Grupo de lojas sempre centraliza o atendimento de pedidos na loja principal — ver seção 4.
- **Resolvido:** "Anjo" é o profissional do time de Operações internas da Farmarcas que dá suporte a associados.
- **Resolvido:** o bug do modal de cancelamento de oferta com o texto "[Nome da loja]" não interpolado já foi corrigido em produção.
- Este documento cobre o que foi visto em telas reais e no FAQ interno de suporte até 2026-07-14; conforme novas funcionalidades forem mapeadas ou o Portal evoluir, atualizar as seções correspondentes.

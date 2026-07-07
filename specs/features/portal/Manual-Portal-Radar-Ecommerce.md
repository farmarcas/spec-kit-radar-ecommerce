# Manual do Portal — Radar E-commerce

> Documentação funcional do **Portal** (front-end web do Radar E-commerce, usado pelos Associados/Lojistas e pela Farmarcas para gerenciar suas lojas). Objetivo: apoiar o aculturamento de Associados na ferramenta e servir de base de consulta para o N1 de suporte.
>
> Fonte: mapeamento de telas reais do Portal em produção, cruzado com o código-fonte (`ecomm-front-webapp-portal-angular`) e validado com o time de produto. Atualizado em 2026-07-03.
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

1. **Centralizar os pedidos em uma única loja e espelhar o estoque nas demais filiais** → *Atendimento: Loja principal* / *Estoque: Espelhado*. Uma loja "mãe" recebe todos os pedidos do grupo, e o estoque dela é replicado (espelhado) para as demais unidades.
2. **Cada loja processa os pedidos com estoques integrados entre elas** → *Atendimento: Loja a loja* / *Estoque: Integrado*. Cada loja atende seus próprios pedidos, mas o estoque é compartilhado/consolidado entre as lojas do grupo.
3. **Cada loja processa os pedidos com estoques independentes** → *Atendimento: Loja a loja* / *Estoque: Independente*. Cada loja funciona de forma totalmente autônoma — pedidos e estoque não se misturam com as demais lojas do grupo.

> **Atenção:** essa configuração tem impacto direto na disponibilidade de produtos mostrada no App para os consumidores de cada loja do grupo — escolha com cuidado antes de mudar um grupo já em operação.

### Detalhe do grupo

Duas abas: **Lojas** (lista as unidades do grupo, com botão "Adicionar loja") e **Usuários do grupo** (usuários vinculados especificamente a esse grupo).

---

## 5. Indicadores

A tela **Indicadores** é o painel de acompanhamento de performance — tanto no nível da loja quanto no nível da Rede. É aqui que o Associado acompanha os principais números do negócio.

Principais informações exibidas:

- **Faturamento** (com gráfico por dia da semana), **Taxa de cancelamento** e **quantidade de Pedidos** no período.
- **Ticket médio**.
- **Ranking das lojas** por faturamento (útil no nível Rede, para comparar unidades).
- **Top produtos mais vendidos**, com opção de baixar a lista.
- **Total de Pedidos em Aberto** e sua distribuição por status (Fila / Liberados / Em separação).
- **Tempo médio para iniciar o atendimento** e **tempo médio total de atendimento** — bons indicadores de agilidade operacional.
- **Média de itens por cesta** e **volume de pedidos cancelados**.
- Segmentação do público: **faixa etária por geração**, **gênero** e **região**.
- **Formas de pagamento** (Online vs Offline, com detalhamento por bandeira/tipo) e **métodos de entrega** (Delivery vs Retirada).

**Ajustando o período de análise:** o seletor no topo (ex: "Últimos 7 dias") permite trocar a janela de tempo dos indicadores, e o botão **Filtrar** refina por outros critérios. **Exportar** baixa os dados exibidos.

---

## 6. Configurações da Loja

Dentro de uma loja, a aba **Configurações** tem um menu lateral com 3 grandes seções. Um widget **"Seu progresso"** no canto inferior acompanha quantas dessas configurações essenciais já foram concluídas (ex: "2/3 concluído"), com atalho "Continuar configuração".

### 6.1 Dados da Loja

- **Informações da loja**: CNPJ (não editável), Razão social, Nome da loja no app (o nome que o consumidor vê), E-mail, Telefone, WhatsApp (pode ser um número 0800), Farmacêutico responsável e CRF, e a Chave de integração do ERP (não editável, gerada pela plataforma).
- **Endereço comercial**: CEP, Estado, Logradouro, Número, Complemento, Bairro, Cidade e Ponto de referência (opcional, ajuda o consumidor a localizar a loja). Há um mapa para confirmar visualmente a localização — mover o pin no mapa **não altera** o endereço textual cadastrado, serve só para ajuste visual/geolocalização.
- **Horário de Atendimento**: dias e horários em que a loja está aberta ao público, independente das regras de entrega/retirada (ver seção 6.2). Ativa-se cada dia individualmente e define o intervalo "De/Até".

### 6.2 Formas de Entrega

**O que é?** Define como o consumidor pode receber o pedido feito no App: em casa ou retirando na loja. As duas opções têm configuração independente.

**Receber em casa** (toggle Ativado/Desativado):
- *Horário de funcionamento*: dias/horários em que a loja aceita pedidos para entrega (pode ser diferente do horário geral de atendimento da loja).
- *Raio de atendimento*: define, num mapa, a distância máxima atendida (limite de até 30 km) e uma tabela de faixas de **Alcance (km) × Taxa de Entrega (R$) × Tempo de Entrega**, permitindo criar várias faixas de preço conforme a distância (botão "+" adiciona uma nova faixa).
- *Frete Grátis*: permite configurar frete grátis a partir de um valor mínimo de compra — uma estratégia para incentivar tickets maiores.

**Retirada na loja** (toggle Ativado/Desativado):
- *Horário de funcionamento*: dias/horários em que a loja aceita pedidos para retirada.
- *Tempo de retirada*: quantos minutos, após a confirmação do pedido, o produto fica disponível para retirada (ex: "A partir de 45 mins"). Esse tempo aparece para o consumidor no App.

### 6.3 Pagamentos

**Com maquininha**: define se a loja aceita pagamento na entrega e/ou na retirada, e quais bandeiras de cartão são aceitas (Débito, Crédito e Outros como Dinheiro e Pix).

**Online**: ativa o pagamento online via integração com a **Braspag**. Precisa preencher dados fornecidos pela credenciadora/adquirente (Adquirente, se habilitou PIX, Nome na Fatura, MerchantId, MerchantKey, ClientID, ClientSecret) antes de conseguir ativar. Os campos ficam bloqueados até a integração ser conectada.

---

## 7. Estoque

A tela **Estoque** mostra o catálogo de produtos daquela loja específica, com:

- **Produto** (nome + EAN), **R$ App** (preço exibido no aplicativo) e **R$ customizado** (um preço específico, diferente do preço padrão do ERP, definido manualmente — pode ser removido para voltar ao preço original).
- **Estoque loja**: quantidade disponível.
- **Exibir preço**: toggle Sim/Não — controla se aquele produto aparece com preço visível no App.
- Toggle geral **Disponível**, indicador **ERP atualizado** (data/hora da última sincronização) e filtro por **Grupo**.

> **Alerta importante:** se aparecer um aviso vermelho no topo da tela dizendo que os preços foram **ocultados no aplicativo por falha de comunicação com o ERP há mais de 3 dias**, significa que a loja parou de sincronizar dados com o ERP e os produtos ficaram invisíveis para o consumidor no App. Nesse caso, a orientação é **contatar o suporte do ERP** para verificar a integração — não é algo que se resolve só pelo Portal.

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

---

## 9. Promoções

A tela **Promoções** tem duas visões, cada uma em sua aba:

- **Individuais**: promoções aplicadas a um produto específico.
- **Por grupo**: promoções aplicadas a um **Grupo de produtos** (conjunto de produtos relacionados — ex: uma linha de uma marca).

Cada linha mostra: Ativação, Vendas, Conversão, Tipo de oferta, Período de divulgação e Status (**Ativa**, **Finalizada** ou **Cancelada**). É possível selecionar várias promoções e cancelá-las em lote, filtrar por Tipo de oferta/Status, e destacar uma promoção com a etiqueta **"Em destaque ⭐"**.

### Criando uma nova promoção

O formulário de criação segue 5 passos:

1. **O que você quer promover?** — escolha entre **Um produto** ou **Grupo de produtos**.
   - Para um produto: escolha o tipo de desconto (ex: Desconto %).
   - Para um grupo: escolha a regra de composição do grupo (ex: "Mesmo produto • mesma marca") e o tipo de desconto (ex: "Preço fixo (de/por)").
2. **Onde essa promoção será válida?** — seleciona a(s) loja(s) participante(s).
3. **Quando a promoção estará ativa?** — data de início/fim e dias da semana em que a promoção roda.
4. **Regras da promoção** — tempo de uso da oferta, se permite um novo uso após um período, e limite de itens por compra.
5. **Produtos da promoção** — depende da escolha do passo 1:
   - *Um produto*: busque por nome/EAN, aplique um desconto geral de uma vez (campo "Desconto geral" + botão "Aplicar") ou ajuste o desconto produto a produto. Também é possível **importar uma planilha (.xlsx)** com a lista de produtos e descontos — o Portal informa quantos produtos foram encontrados e quantos não puderam ser importados.
   - *Grupo de produtos*: busque um grupo já cadastrado (ver [Catálogo](#12-catálogo-admin)) e defina o preço "De" e "Por" para o grupo inteiro.

### Detalhes e cancelamento de uma promoção

Clicando numa promoção da lista, abre um painel com o produto/grupo, status, EAN e a lista de **lojas participantes**, com opção de remover uma loja específica da promoção sem cancelar tudo. O cancelamento de uma promoção pede confirmação antes de ser efetivado, já que a ação não pode ser desfeita.

---

## 10. Banners

A tela **Banners** (também chamada de "Anúncios do aplicativo") controla os banners exibidos no carrossel da home do App.

Cada banner tem: **posição** (arrastar para reordenar), **mídia** (imagem + nome), **destino** do clique, métricas de **exibições** e **cliques**, **período de divulgação** (início/fim) e **UFs** onde é exibido. É possível filtrar por Estado, Loja e Status, e criar um novo banner pelo botão **"Novo banner"**.

---

## 11. Usuários

A tela **Usuários** lista as pessoas com acesso ao Portal (nome, Perfil de acesso, total de lojas vinculadas) e permite convidar novos usuários.

Ao convidar/editar um usuário, defina o **Perfil de acesso** (ver [seção 2](#2-perfis-de-acesso)) e, dependendo do perfil escolhido, vincule-o a uma loja específica (Contato cliente), a uma ou mais lojas (Gestor de Loja) ou a uma ou mais Redes (Gestor de Rede).

---

## 12. Catálogo (Admin)

O módulo **Catálogo** é exclusivo do perfil **Admin** (time Farmarcas) e contém o cadastro mestre de produtos, **compartilhado entre todas as Redes** da plataforma.

**O que o Associado precisa saber:** o lojista não cadastra produtos novos livremente — todo produto vendido no App já precisa existir nesse catálogo central, com todas as informações de cadastro (nome, marca, fabricante, se é medicamento, categorização, imagens) e status "Publicado".

### Produtos

Listagem com todos os produtos cadastrados na plataforma (departamento, categoria, subclasse, grupo de produtos e status). Cada produto tem uma tela de edição com campos como Nome, EAN (fixo), Marca, Fabricante, tipo de cadastro (Medicamento ou Não Medicamento), Registro MS (para medicamentos), a chave **"Permitir promocionar"** (controla se aquele produto pode entrar em promoções) e a categorização (Departamento/Categoria/Subcategoria).

### Grupos de produtos

> Na interface atual, essa entidade ainda aparece com o nome **"Família"** ("Nova família", "Composição da família") — é a mesma coisa que **Grupo de produtos**, usado na criação de [Promoções por grupo](#9-promoções); o nome está em processo de padronização em todo o Portal.

Um Grupo de produtos reúne vários produtos sob uma regra de composição (ex: "produtos iguais de uma mesma marca"), com nome, imagem, descrição e a lista de produtos que fazem parte dele.

### Solicitações de produtos

Quando uma Rede precisa de um produto que ainda não existe no catálogo mestre, ela envia uma **solicitação** (nome do produto + EAN). O Admin analisa e aprova ou reprova — o produto só passa a existir na plataforma (e pode ser vendido) depois de aprovado.

---

## Notas de manutenção deste documento

- A relação entre o termo "Rede" e "GE — Grupo Econômico" (já usado no glossário do produto) ainda precisa ser confirmada com o time: podem ser sinônimos ou conceitos distintos.
- O fluxo pelo qual um Associado efetivamente *envia* uma Solicitação de produto (visto neste manual apenas do lado do Admin/Catálogo) ainda não foi mapeado — atualizar esta seção quando essa tela for identificada.
- Este documento cobre o que foi visto em telas reais até 2026-07-03; conforme novas funcionalidades forem mapeadas ou o Portal evoluir, atualizar as seções correspondentes.

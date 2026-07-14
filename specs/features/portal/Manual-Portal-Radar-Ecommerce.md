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

**De onde vem o preço "R$ App"?** Ele é extraído via API diretamente do sistema ERP da loja. Divergências geralmente vêm de: (a) uma oferta ativa no ERP ou um "caderno de ofertas" — nesse caso o Portal sempre traz o **menor valor** disponível; ou (b) atraso na sincronização entre o ERP e o Portal.

**Como editar o preço manualmente:** na tela Estoque, busque o produto por nome ou EAN, clique no ícone de lápis (editar), informe o valor correto e confirme em "Atualizar" — esse é o campo **R$ customizado**. Não existe uma regra ou validação sobre esse valor: fica valendo exatamente o que for digitado, até que alguém remova a customização; hoje esse recurso na tela de Estoque é exclusivo do perfil **Contato cliente** (balconista). Se muitos produtos aparecerem com valor divergente ao mesmo tempo, o recomendado é abrir chamado com o suporte do ERP pedindo uma atualização forçada em lote, em vez de corrigir um por um manualmente.

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

Cada linha mostra: Ativação, Vendas, Conversão, Tipo de oferta, Período de divulgação e Status (**Ativa**, **Finalizada** ou **Cancelada**). É possível selecionar várias promoções e cancelá-las em lote, filtrar por Tipo de oferta/Status, e destacar uma promoção com a etiqueta **"Em destaque ⭐"** — não há limite de quantas promoções podem estar em destaque ao mesmo tempo, e ter ao menos uma cria uma seção própria chamada **"Ofertas em destaque"** no aplicativo.

**Medicamentos controlados não entram em promoção.** Hoje o Portal já impede isso na própria criação da oferta: esses produtos aparecem desabilitados na lista de seleção de produtos do passo 5.

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

**Um mesmo e-mail não pode ser convidado duas vezes.** O Portal bloqueia o convite se o e-mail já existir no sistema (mensagem "Parece que o usuário já existe em nosso sistema", com opção de voltar ou editar o usuário existente) — não é possível, por exemplo, dar a uma pessoa um segundo login para acumular acesso a outra Rede/loja; o vínculo adicional precisa ser feito editando a mesma conta.

**Não existe uma função para mudar um usuário/loja de GE (Grupo Econômico).** Se uma loja é removida do Portal, todos os usuários vinculados a ela perdem esse vínculo automaticamente:
- Um usuário **Contato cliente** (vinculado só àquela loja) continua conseguindo logar, mas passa a ver uma **tela em branco**, sem lojas para trabalhar.
- Os demais perfis (Gestor de Loja/Rede/Admin), se tiverem acesso a outras lojas, simplesmente deixam de ver os dados da loja removida e continuam vendo as demais normalmente.

---

## 12. Catálogo (Admin)

O módulo **Catálogo** é exclusivo do perfil **Admin** (time Farmarcas) e contém o cadastro mestre de produtos, **compartilhado entre todas as Redes** da plataforma.

**O que o Associado precisa saber:** o lojista não cadastra produtos novos livremente — todo produto vendido no App já precisa existir nesse catálogo central, com todas as informações de cadastro (nome, marca, fabricante, se é medicamento, categorização, imagens) e status "Publicado".

### Produtos

Listagem com todos os produtos cadastrados na plataforma (departamento, categoria, subclasse, grupo de produtos e status). Cada produto tem uma tela de edição com campos como Nome, EAN (fixo), Marca, Fabricante, tipo de cadastro (Medicamento ou Não Medicamento), Registro MS (para medicamentos), o toggle **Genérico** (quando ativado, exibe a tag "genérico" no detalhe do item para o consumidor no app), a chave **"Permitir promocionar"** e a categorização (Departamento/Categoria/Subcategoria).

**"Permitir promocionar"** controla se o produto pode ser adicionado a um Grupo de produtos promocional — se desativado, o produto não pode ser incluído. Atenção: se o produto **já estava** num grupo promocional e depois recebe essa flag desativada, ele **não é removido automaticamente** do grupo — a restrição vale só para novas inclusões.

**"Despublicar produto"** remove o produto do catálogo oficial: mesmo que uma loja continue enviando aquele EAN via integração com o ERP, o produto não volta a ser exibido no catálogo dela. O histórico do EAN é mantido em pedidos antigos e relatórios já existentes — só a exibição futura é bloqueada.

### Grupos de produtos

> Na interface atual, essa entidade ainda aparece com o nome **"Família"** ("Nova família", "Composição da família") — é a mesma coisa que **Grupo de produtos**, usado na criação de [Promoções por grupo](#9-promoções); o nome está em processo de padronização em todo o Portal.

Um Grupo de produtos reúne vários produtos sob uma regra de composição (ex: "produtos iguais de uma mesma marca"), com nome, imagem, descrição e a lista de produtos que fazem parte dele.

### Solicitações de produtos

Quando uma loja precisa de um produto que ainda não existe no catálogo mestre, ela envia uma **solicitação** pelo formulário "Solicitar produto" (acessível pela tela [Estoque](#7-estoque) — ver "Solicitando um produto novo"), informando nome, fabricante, EAN(s), apresentação e imagem de referência. Essa tela de Catálogo é onde o **Admin** revisa a fila de solicitações (Rede de origem, nome do produto, EAN, data, status Pendente/Aprovado/Reprovado) e aprova ou reprova — o produto só passa a existir na plataforma (e pode ser vendido) depois de aprovado.

---

## Notas de manutenção deste documento

- **Em aberto (baixa prioridade, achado técnico):** o `SessionPermissionGuard` do front-end (permissões finas tipo `offer:*`/`product:*`/`order:*`) segue desabilitado no código-fonte; o time de produto não confirmou se é proposital (backend cobre a validação) ou dívida técnica — sem impacto conhecido no dia a dia do associado, mantido aqui só como registro para o time de engenharia.
- **Resolvido:** Rede = bandeira/franquia (ex: ACFARMA, Ultra Popular); GE (Grupo Econômico) = conjunto de lojas do mesmo empresário dentro de uma Rede — conceito de negócio por trás da funcionalidade Grupo de lojas.
- **Resolvido:** o fluxo de Solicitação de produto pelo Associado foi identificado (ícone na tela Estoque) — ver seção 7.
- **Resolvido:** independentemente do tipo de estoque (Espelhado/Integrado/Independente), o Grupo de lojas sempre centraliza o atendimento de pedidos na loja principal — ver seção 4.
- **Resolvido:** "Anjo" é o profissional do time de Operações internas da Farmarcas que dá suporte a associados.
- **Resolvido:** o bug do modal de cancelamento de oferta com o texto "[Nome da loja]" não interpolado já foi corrigido em produção.
- Este documento cobre o que foi visto em telas reais e no FAQ interno de suporte até 2026-07-14; conforme novas funcionalidades forem mapeadas ou o Portal evoluir, atualizar as seções correspondentes.

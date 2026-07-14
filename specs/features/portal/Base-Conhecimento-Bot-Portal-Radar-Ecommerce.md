# Base de Conhecimento — Bot de Atendimento do Portal (Associados)

> **Uso deste documento:** conteúdo-fonte para um bot de atendimento que responde dúvidas simples de Associados/Lojistas sobre o uso do Portal Radar E-commerce (ex: "onde encontro minha API KEY", "como vejo o módulo da minha loja"). Cada bloco de pergunta/resposta abaixo foi escrito para ser **autocontido** — não depende de ler o restante do documento para fazer sentido — pensando em recuperação por trechos (chunking) por um sistema de busca/RAG.
>
> **Baseado em:** `Manual-Portal-Radar-Ecommerce.md` (mapeamento de telas reais do Portal, cruzado com o código-fonte `ecomm-front-webapp-portal-angular` e validado com o time de produto). Atualizado em 03 de julho de 2026.
>
> **Regra para o bot:** se a dúvida do associado não estiver coberta aqui, o bot deve admitir que não sabe e direcionar para o suporte humano (Farmarcas/N1) — nunca inventar um caminho de tela que não está descrito neste documento. A seção final "Perguntas sem resposta confirmada" lista o que ainda não foi mapeado.

---

## Índice de tópicos

- [Termos e apelidos comuns](#termos-e-apelidos-comuns) *(consultar primeiro quando a pergunta usar um termo informal)*
- [Acesso, login e perfis](#acesso-login-e-perfis)
- [Onde encontro...](#onde-encontro)
- [Redes, Grupos e Lojas](#redes-grupos-e-lojas)
- [Indicadores](#indicadores)
- [Configurações da Loja](#configurações-da-loja)
- [Estoque](#estoque)
- [Pedidos](#pedidos)
- [Promoções](#promoções)
- [Banners](#banners)
- [Usuários](#usuários)
- [Catálogo de produtos](#catálogo-de-produtos)
- [Perguntas sem resposta confirmada](#perguntas-sem-resposta-confirmada)

---

## Termos e apelidos comuns

Associados nem sempre usam o nome exato do campo/tela do Portal. Esta tabela ajuda o bot a reconhecer a intenção por trás de termos informais.

| Termo informal que o associado pode usar | Termo oficial no Portal | Onde encontrar |
|---|---|---|
| "Minha API KEY", "chave da loja", "código de integração", "token do ERP" | **Chave de integração do ERP** | `Configurações > Dados da Loja > Informações da loja` (campo somente leitura, gerado pela plataforma) |
| "Módulo da minha loja", "meu plano", "o que minha loja pode fazer" | **Módulo ativado** (Vendas ou Ofertas) | Coluna "Módulo ativado" na tela `Lojas` (nível Rede) |
| "Loja mãe", "loja centralizadora" | **Loja principal** (dentro da configuração de um Grupo) | `Grupo de lojas > (grupo) > Configurar atendimento e estoque` |
| "Rede", "franquia", "bandeira" | **Rede** | Nível mais alto da hierarquia, acima de Grupo/Loja |
| "Meu perfil", "meu nível de acesso", "o que eu posso fazer no sistema" | **Perfil de acesso** (Contato cliente / Gestor de Loja / Gestor de Rede / Admin) | Tela `Usuários` |
| "Balconista" | **Contato cliente** (é o nome oficial do perfil no Portal) | Tela `Usuários` |
| "Fila de pedidos", "pedidos chegando" | Aba **"Na fila"** dentro de `Pedidos` | `Pedidos` |
| "Desconto", "campanha", "oferta" | **Promoção** | `Promoções` |
| "Anúncio", "propaganda do app" | **Banner** | `Banners` (também chamada de "Anúncios do aplicativo") |
| "Cadastrar produto novo" | **Solicitação de produto** (não é autoatendimento — ver seção Catálogo) | `Catálogo > Solicitações` (só Admin vê e aprova) |

---

## Acesso, login e perfis

**Como eu entro no Portal?**
Você acessa pela tela de login do Portal com seu e-mail e senha cadastrados. Se esqueceu a senha, use o link "Esqueceu a senha?" na própria tela de login.

**O que é a hierarquia Rede > Grupo de lojas > Loja?**
O Portal Radar organiza tudo em 4 níveis: a **Farmarcas** é a dona da plataforma; uma **Rede** é o conjunto de lojas de uma bandeira/franqueadora (ex: ACFARMA); um **Grupo de lojas** é um subconjunto opcional de lojas dentro de uma Rede (ex: filiais do mesmo dono); e a **Loja** é a unidade individual, com CNPJ próprio, onde o dia a dia acontece.

**Como eu troco de loja dentro do Portal?**
No topo da tela, ao lado do nome da loja atual, existe uma seta (▾). Clicando nela, aparece a lista de lojas às quais você tem acesso — basta selecionar a loja desejada para trocar de contexto, sem precisar sair e logar de novo.

**Quais perfis de acesso existem no Portal?**
Existem 4 perfis:
- **Contato cliente**: é o balconista/atendente da loja. Fica vinculado a **uma única loja** e só acompanha/movimenta os pedidos dela. Não cria nem cancela promoções, e não acessa telas administrativas.
- **Gestor de Loja**: dono/associado da loja. Pode estar vinculado a **várias lojas** e tem acesso completo a todas as funções (estoque, promoções, configurações, pedidos, usuários) das lojas dele.
- **Gestor de Rede**: mesmo nível de acesso do Gestor de Loja, mas administra **todas as lojas de uma Rede inteira**, incluindo telas de nível de rede como Banners e indicadores agregados.
- **Admin**: só o time interno da Farmarcas. Acesso total a todas as Redes/Lojas e é o único perfil que enxerga o módulo Catálogo.

**Por que meu menu no Portal é diferente do de um colega?**
Porque o menu muda conforme o perfil de acesso. Quem tem perfil **Contato cliente** vê só as abas Pedidos, Promoções e Estoque — um menu reduzido, focado no atendimento do dia a dia. Quem é **Gestor de Loja/Rede** vê o menu completo (Pedidos, Promoções, Estoque, Configurações, Usuários dentro de uma loja; ou Lojas, Promoções, Banners, Usuários no nível da Rede).

**Sou balconista e não encontro a aba Configurações. Isso é normal?**
Sim. O perfil **Contato cliente** (balconista) tem acesso reduzido de propósito, só às abas Pedidos, Promoções e Estoque. Configurações, Usuários e mudanças administrativas exigem perfil Gestor de Loja, Gestor de Rede ou Admin. Se você precisa mexer em Configurações, peça para o Gestor de Loja da sua unidade fazer a alteração ou trocar seu perfil de acesso.

---

## Onde encontro...

**Onde encontro minha "API KEY" / chave de integração?**
Vá em `Configurações > Dados da Loja > Informações da loja`. No final do formulário existe o campo **"Chave de integração do ERP"** — ele é somente leitura (não dá pra editar), gerado automaticamente pela plataforma. É esse valor que os sistemas de ERP usam para integrar com a loja.

**Onde vejo o módulo (Vendas ou Ofertas) da minha loja?**
Na tela `Lojas` (nível Rede), a coluna **"Módulo ativado"** mostra "Vendas" (loja processa pedidos e estoque completos) ou "Ofertas" (loja só participa de promoções, sem processar pedido direto pelo Portal).

**Onde vejo o CNPJ da minha loja?**
Em `Configurações > Dados da Loja > Informações da loja`, o campo **CNPJ** aparece no topo do formulário (também somente leitura).

**Onde configuro o horário que minha loja atende?**
Existem dois horários diferentes e independentes:
1. **Horário de Atendimento geral da loja** — em `Configurações > Dados da Loja > Horário de Atendimento`.
2. **Horário de entrega/retirada** — em `Configurações > Formas de Entrega`, dentro de "Receber em casa" (aba Horário de funcionamento) ou "Retirada na loja" (aba Horário de funcionamento). Esse horário pode ser diferente do horário geral de atendimento.

**Onde vejo quantos pedidos estão em aberto agora?**
Em `Pedidos`, o quadro mostra colunas por status (Na fila, Em separação, Liberados, Concluídos, Cancelados), cada uma com um contador. Também dá pra ver um resumo consolidado ("Total de Pedidos em Aberto") na tela `Indicadores`.

**Onde vejo o faturamento da minha loja?**
Na tela `Indicadores`, logo no topo aparece o **Faturamento** do período selecionado, junto com um gráfico por dia da semana. Dá pra trocar o período de análise no seletor no topo (ex: "Últimos 7 dias").

**Onde ativo/desativo o pagamento online (cartão pela internet)?**
Em `Configurações > Pagamentos > Online`. É preciso preencher os dados da integração com a Braspag (Adquirente, MerchantId, MerchantKey, ClientID, ClientSecret) antes de conseguir ativar o toggle.

**Onde configuro as bandeiras de cartão aceitas na maquininha?**
Em `Configurações > Pagamentos > Com maquininha` — lá dá pra marcar quais bandeiras de Débito, Crédito e Outros (Dinheiro, Pix) a loja aceita, e se aceita pagamento na entrega e/ou na retirada.

**Onde crio uma promoção?**
Na tela `Promoções`, clique no botão **"Nova promoção"** no canto superior direito. Isso abre um formulário de 5 passos (o que promover, onde é válida, quando fica ativa, regras de uso, e quais produtos entram).

**Onde vejo os banners do aplicativo?**
Na tela `Banners` (às vezes chamada de "Anúncios do aplicativo"), que mostra os banners atuais do carrossel da home do app, com posição, período de exibição e métricas de cliques/exibições.

**Onde convido um novo usuário para o Portal?**
Na tela `Usuários`, existe um botão para convidar/criar novo usuário — lá você escolhe o Perfil de acesso dele e a qual loja/rede ele fica vinculado.

---

## Redes, Grupos e Lojas

**O que é uma Rede?**
É o nível mais alto de organização no Portal, abaixo apenas da Farmarcas — representa uma bandeira/franqueadora com várias lojas associadas (ex: ACFARMA, Ultra Popular). Uma Rede pode ter vários Grupos de lojas e Lojas individuais dentro dela.

**O que é um Grupo de lojas e para que serve?**
É um agrupamento de lojas dentro de uma Rede (por exemplo, filiais do mesmo empresário) que compartilham uma regra comum de **atendimento de pedidos** e **tipo de estoque**. Serve para centralizar ou distribuir como os pedidos são processados e como o estoque é compartilhado entre as lojas do grupo.

**Quais são as opções de atendimento e estoque de um Grupo de lojas?**
Ao configurar um grupo (botão "Configurar atendimento e estoque" dentro do detalhe do grupo), existem 3 opções:
1. **Centralizar os pedidos numa loja principal e espelhar o estoque nas demais filiais** — uma loja "mãe" recebe todos os pedidos do grupo, e o estoque dela é replicado (espelhado) para as outras. Aparece como Atendimento "Loja principal" / Estoque "Espelhado".
2. **Cada loja processa seus próprios pedidos, com estoques integrados entre elas** — cada loja atende seus pedidos, mas o estoque é compartilhado/consolidado entre todas as lojas do grupo. Aparece como Atendimento "Loja a loja" / Estoque "Integrado".
3. **Cada loja processa seus próprios pedidos, com estoques independentes** — cada loja funciona de forma totalmente autônoma, sem misturar pedido nem estoque com as demais. Aparece como Atendimento "Loja a loja" / Estoque "Independente".

Essa escolha afeta diretamente o que aparece disponível no aplicativo para os consumidores de cada loja do grupo — deve ser mudada com cuidado se o grupo já estiver em operação.

**Como adiciono uma loja a um Grupo?**
No detalhe do grupo (aba "Lojas"), existe o botão **"Adicionar loja"**.

**O que significa "ERP conectado até" na lista de Lojas?**
É a data/hora da última vez que aquela loja sincronizou dados com o sistema ERP dela. Se essa data estiver muito atrasada (mais de 3 dias), é sinal de problema de comunicação — ver a seção Estoque abaixo sobre o alerta correspondente.

---

## Indicadores

**O que é a tela de Indicadores?**
É o painel onde o associado acompanha os principais números do negócio: faturamento, quantidade de pedidos, taxa de cancelamento, ticket médio, ranking de lojas (no nível Rede), produtos mais vendidos, tempo médio de atendimento, formas de pagamento e métodos de entrega usados pelos consumidores, entre outros.

**Como eu mudo o período de análise dos indicadores?**
Use o seletor no topo da tela (por padrão mostra algo como "Últimos 7 dias") para trocar a janela de tempo. O botão **Filtrar** permite refinar por outros critérios, e **Exportar** baixa os dados exibidos.

**Consigo comparar minhas lojas entre si?**
Sim, no nível da Rede a tela de Indicadores mostra um **Ranking das lojas por faturamento**, útil para comparar o desempenho de diferentes unidades.

---

## Configurações da Loja

**O que tem dentro de Configurações?**
Três grandes seções, no menu lateral: **Dados da Loja**, **Formas de Entrega** e **Pagamentos**. Um indicador "Seu progresso" no canto inferior mostra quantas configurações essenciais já foram concluídas.

**O que preencho em "Dados da Loja > Informações da loja"?**
CNPJ (fixo), Razão social, Nome da loja no app (nome visível para o consumidor), E-mail, Telefone, WhatsApp (pode ser um número 0800), Farmacêutico responsável, CRF do farmacêutico, e a Chave de integração do ERP (fixa, gerada pela plataforma).

**Como configuro o endereço da minha loja?**
Em `Configurações > Dados da Loja > Endereço comercial`: preencha CEP, Estado, Logradouro, Número, Complemento, Bairro, Cidade e, se quiser, um Ponto de referência. Existe também um mapa para confirmar visualmente a localização — atenção: **mover o alfinete no mapa não altera o endereço textual cadastrado**, serve só para ajuste visual de geolocalização.

**O que é o "Horário de Atendimento" em Dados da Loja?**
É o horário geral em que a loja está aberta ao público — diferente do horário de entrega/retirada configurado em Formas de Entrega. Você ativa cada dia da semana individualmente e define o intervalo "De/Até".

**Como funciona "Receber em casa"?**
Em `Configurações > Formas de Entrega > Receber em casa`, ative o toggle e configure: horário de funcionamento para entrega, o raio de atendimento (distância máxima, até 30 km, com faixas de Alcance × Taxa de Entrega × Tempo de Entrega — dá pra criar várias faixas de preço por distância) e, opcionalmente, frete grátis a partir de um valor mínimo de compra.

**Como funciona "Retirada na loja"?**
Em `Configurações > Formas de Entrega > Retirada na loja`, ative o toggle e configure o horário em que a loja aceita retirada, e o "Tempo de retirada" — quantos minutos depois da confirmação do pedido o produto fica pronto para o cliente buscar (esse tempo aparece pro consumidor no app).

**Como ativo pagamento com maquininha?**
Em `Configurações > Pagamentos > Com maquininha`, defina se aceita pagamento na entrega e/ou na retirada, e marque as bandeiras de cartão aceitas (Débito, Crédito, e outras formas como Dinheiro e Pix).

**Como ativo pagamento online (cartão pela internet)?**
Em `Configurações > Pagamentos > Online`, é preciso primeiro preencher os dados fornecidos pela credenciadora **Braspag** (Adquirente, se habilitou PIX, Nome na Fatura, MerchantId, MerchantKey, ClientID, ClientSecret). Os campos ficam bloqueados até a integração estar corretamente conectada.

---

## Estoque

**O que mostra a tela de Estoque?**
Lista todos os produtos daquela loja, com preço padrão (R$ App), um preço customizado opcional (R$ customizado, que sobrescreve o preço do ERP), a quantidade em estoque, e um toggle "Exibir preço" que controla se o produto aparece com preço visível no app.

**Meus produtos sumiram do aplicativo, o que houve?**
Provavelmente é o alerta de **ERP desatualizado**: se a loja não sincroniza com o ERP há mais de 3 dias, o Portal oculta automaticamente os preços no aplicativo e mostra um aviso vermelho no topo da tela de Estoque. **A solução é contatar o suporte do seu sistema ERP** para verificar por que a comunicação parou — não é algo que se resolve só pelo Portal.

**Como coloco um preço diferente pra um produto específico?**
Na tela de Estoque, use o campo "R$ customizado" na linha do produto. Esse valor sobrescreve o preço padrão vindo do ERP. Se quiser voltar ao preço original, é só remover o valor customizado (ícone de lixeira ao lado do campo).

---

## Pedidos

**O que significam as colunas do quadro de Pedidos?**
- **Na fila**: pedido novo, ainda aguardando início do atendimento.
- **Em separação**: pedido sendo preparado/separado na loja.
- **Liberados**: pedido pronto, liberado para entrega ou retirada.
- **Concluídos**: pedido já entregue/retirado com sucesso.
- **Cancelados**: pedido cancelado, seja pela loja ou pelo consumidor.

**O que significa a etiqueta "Preço loja" / "Preço PEC" num item do pedido?**
Indica de onde veio o preço daquele produto no momento da venda: **"Preço loja"** é o preço padrão cadastrado no Estoque; **"Preço PEC"** vem do sistema PEC (base de clientes/preços da rede). Também pode aparecer **"Sem estoque"**, um alerta de que o item foi vendido sem estoque confirmado disponível — merece atenção redobrada na separação.

**Como funciona o troco quando o pagamento é em dinheiro?**
O Portal calcula automaticamente o **Valor a cobrar** e o **Troco** com base no total do pedido, exibidos no painel de detalhe do pedido.

---

## Promoções

**Qual a diferença entre promoção "Individual" e "Por grupo"?**
**Individual** é uma promoção aplicada a um único produto. **Por grupo** é aplicada a um conjunto de produtos relacionados (um "Grupo de produtos", por exemplo uma linha inteira de uma marca) de uma vez só.

**Como crio uma promoção passo a passo?**
No botão "Nova promoção", siga os 5 passos do formulário:
1. Escolha **o que promover** — Um produto ou Grupo de produtos — e o tipo de desconto (ex: Desconto % ou Preço fixo).
2. Escolha **em quais lojas** a promoção vale.
3. Defina **quando** ela fica ativa — data de início/fim e dias da semana.
4. Configure as **regras de uso** — tempo para usar a oferta, se permite um novo uso depois de um tempo, e limite de itens por compra.
5. Escolha **os produtos**: busque por nome/EAN (ou por grupo, se escolheu "Grupo de produtos" no passo 1), ajuste o desconto individualmente ou aplique um "Desconto geral" de uma vez para todos os produtos selecionados.

**Dá pra cadastrar vários produtos de uma vez numa promoção?**
Sim, no passo 5 existe a opção **"Importar planilha"** — baixe o modelo, preencha com os produtos e descontos desejados, e faça o upload (formato .xlsx). O Portal mostra quantos produtos foram encontrados e quantos não puderam ser importados.

**Como cancelo uma promoção?**
Na listagem de Promoções, selecione a(s) promoção(ões) e use a ação de cancelamento em lote, ou abra o detalhe de uma promoção específica para cancelá-la individualmente. O cancelamento pede confirmação, pois não pode ser desfeito depois.

**Como removo só uma loja de uma promoção sem cancelar tudo?**
Abra o detalhe da promoção (clique na linha da lista) — lá aparece a seção "Lojas participantes", com opção de remover uma loja específica sem afetar as demais.

---

## Banners

**O que são os Banners do Portal?**
São os anúncios que aparecem no carrossel da home do aplicativo do consumidor. Cada banner tem posição (pode ser reordenado arrastando), imagem, destino do clique, métricas de exibições/cliques, período de divulgação e os estados (UFs) onde é exibido.

**Como crio um novo banner?**
Na tela `Banners`, use o botão **"Novo banner"** no canto superior direito.

---

## Usuários

**Como convido uma pessoa nova para acessar o Portal?**
Na tela `Usuários`, use a opção de convidar/criar usuário. Você vai precisar escolher o **Perfil de acesso** dele (Contato cliente, Gestor de Loja, Gestor de Rede ou Admin — ver seção "Acesso, login e perfis") e vinculá-lo à loja, lojas ou rede correspondente.

**Posso remover o acesso de alguém?**
Sim, na listagem de Usuários existe uma ação para desvincular/remover um usuário — mas usuários com perfil Contato cliente não têm essa ação disponível para eles mesmos (não conseguem remover outros usuários).

---

## Catálogo de produtos

**Eu, como associado, posso cadastrar um produto novo direto no Portal?**
Não. O catálogo de produtos é **centralizado e compartilhado entre todas as Redes** da plataforma, gerenciado pelo time da Farmarcas (perfil Admin). Se você precisa de um produto que ainda não existe no catálogo, isso é feito por meio de uma **Solicitação de produto**.

**O que é uma Solicitação de produto?**
É o pedido para incluir um produto novo (por nome + EAN) no catálogo mestre da plataforma. A solicitação é analisada pelo time Farmarcas (Admin), que aprova ou reprova — o produto só passa a existir e pode ser vendido depois de aprovado.

**Um produto meu não pode entrar em promoção, por quê?**
Cada produto no catálogo tem uma configuração chamada **"Permitir promocionar"**. Se estiver desativada para aquele produto, ele não pode ser incluído em nenhuma promoção. Essa configuração é feita no cadastro do produto no Catálogo, gerenciado pela Farmarcas.

---

## Perguntas sem resposta confirmada

Estes pontos ainda não foram totalmente mapeados/confirmados — o bot deve reconhecer a pergunta, mas responder que vai encaminhar para o suporte humano em vez de inventar um caminho de tela:

- **Como o associado efetivamente envia uma Solicitação de produto pelo Portal** (a tela mapeada até agora mostra só o lado do Admin, que aprova/reprova).
- **Se "Rede" é o mesmo conceito que "GE — Grupo Econômico"** já usado no glossário do produto, ou se são coisas diferentes.

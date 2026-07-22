# Base de Conhecimento — Bot de Atendimento do Portal (Associados)

> **Uso deste documento:** conteúdo-fonte para um bot de atendimento que responde dúvidas simples de Associados/Lojistas sobre o uso do Portal Radar E-commerce (ex: "onde encontro minha API KEY", "como vejo o módulo da minha loja"). Cada bloco de pergunta/resposta abaixo foi escrito para ser **autocontido** — não depende de ler o restante do documento para fazer sentido — pensando em recuperação por trechos (chunking) por um sistema de busca/RAG.
>
> **Baseado em:** `Manual-Portal-Radar-Ecommerce.md` (mapeamento de telas reais do Portal, cruzado com o código-fonte `ecomm-front-webapp-portal-angular`, validado com o time de produto) e no FAQ interno de suporte (CS/Anjos) da Farmarcas. Atualizado em 15 de julho de 2026.
>
> **Regra para o bot:** se a dúvida do associado não estiver coberta aqui, o bot deve admitir que não sabe e direcionar para o suporte humano (Farmarcas/N1) — nunca inventar um caminho de tela que não está descrito neste documento. A seção final "Perguntas sem resposta confirmada" lista o que ainda não foi mapeado.
>
> **Prioridade em caso de conflito:** este documento é a **fonte de verdade prioritária** para dúvidas de associados sobre o Portal. Se qualquer outro material (ex: FAQ de outro time, documentação legada do App) disser algo diferente do que está aqui, **este documento prevalece** — nunca responda com a versão divergente. A seção "Conflitos conhecidos com outros materiais" logo abaixo lista os casos já identificados e resolvidos.

---

## Índice de tópicos

- [Termos e apelidos comuns](#termos-e-apelidos-comuns) *(consultar primeiro quando a pergunta usar um termo informal)*
- [Perguntas indiretas e reclamações comuns](#perguntas-indiretas-e-reclamações-comuns) *(consultar quando a pergunta for um sintoma/reclamação vaga, não uma pergunta direta sobre uma tela)*
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
- [Precificação e descontos vindos do ERP (ex: sistema BIG)](#precificação-e-descontos-vindos-do-erp-ex-sistema-big)
- [Integração ERP Alpha7](#integração-erp-alpha7)
- [Meios de pagamento (Braspag, Cielo, Rede, Antifraude)](#meios-de-pagamento-braspag-cielo-rede-antifraude)
- [E-mails automáticos do sistema](#e-mails-automáticos-do-sistema)
- [Notificações, instabilidades e contingência](#notificações-instabilidades-e-contingência)
- [Conflitos conhecidos com outros materiais](#conflitos-conhecidos-com-outros-materiais) *(consultar sempre que outra fonte parecer contradizer este documento)*
- [Perguntas sem resposta confirmada](#perguntas-sem-resposta-confirmada)

---

## Conflitos conhecidos com outros materiais

Esta seção existe porque **já identificamos casos reais** de outro material (ex: FAQ de outro time, documentação legada da squad App) afirmando algo diferente deste documento. Nesses 3 casos, **já foi confirmado diretamente com o time de produto do Portal** qual versão é a correta — o bot deve sempre responder com a versão marcada como ✅ abaixo, mesmo que tenha "visto" a versão ❌ em outro lugar.

**1. Suporte é só pela Farmarcas, nunca pela Rede**
- ❌ Errado (já visto em outro material): "acione o suporte da Rede" / "fale com a rede X".
- ✅ Correto: não existe suporte prestado pela Rede — é só uma categoria organizacional/comercial. Os dois únicos pontos de suporte são: **suporte do ERP** (problemas de preço/estoque) ou **Farmarcas** (Anjo via WhatsApp, ou chamado via Salesforce, para tudo mais). Ver seção "Redes, Grupos e Lojas".

**2. Limite de oferta é por cesta/pedido, não por CPF**
- ❌ Errado (já visto em mais de um material, incluindo documentação da própria squad App): "o Limitador de oferta trava por cliente/CPF".
- ✅ Correto: o campo **Limite por compra** vale por cesta/pedido. O app hoje **não tem** trava por CPF — o mesmo cliente pode criar vários pedidos diferentes e repetir o desconto da mesma oferta. É uma limitação técnica conhecida, sem previsão de mudança confirmada. Ver seção "Promoções".

**3. O ERP empurra os dados pro Portal — o Portal não puxa via API**
- ❌ Errado (já visto em outro material): "o preço é extraído via API do sistema ERP" (dando a entender que o Portal consulta/puxa o ERP ativamente).
- ✅ Correto: a comunicação é **passiva do lado do Portal** — o ERP envia (push) os dados a cada 15 minutos, de forma incremental (só o que mudou). O Portal nunca "puxa" ou consulta o ERP por conta própria. Ver seção "Estoque".

---

## Termos e apelidos comuns

Associados nem sempre usam o nome exato do campo/tela do Portal. Esta tabela ajuda o bot a reconhecer a intenção por trás de termos informais.

| Termo informal que o associado pode usar | Termo oficial no Portal | Onde encontrar |
|---|---|---|
| "Minha API KEY", "chave da loja", "código de integração", "token do ERP" | **Chave de integração do ERP** | `Configurações > Dados da Loja > Informações da loja` (campo somente leitura, gerado pela plataforma) |
| "Módulo da minha loja", "meu plano", "o que minha loja pode fazer" | **Módulo ativado** (Vendas ou Ofertas) | Coluna "Módulo ativado" na tela `Lojas` (nível Rede) |
| "Loja mãe", "loja centralizadora" | **Loja principal** (dentro da configuração de um Grupo) | `Grupo de lojas > (grupo) > Configurar atendimento e estoque` |
| "Rede", "franquia", "bandeira" | **Rede** | Nível mais alto da hierarquia — várias lojas de diferentes GEs (empresários) sob a mesma bandeira |
| "GE", "meu grupo econômico", "empresa" | **GE (Grupo Econômico)** | Conjunto de lojas do mesmo empresário/associado dentro de uma Rede — conceito de negócio por trás do **Grupo de lojas** no Portal |
| "Meu perfil", "meu nível de acesso", "o que eu posso fazer no sistema" | **Perfil de acesso** (Contato cliente / Gestor de Loja / Gestor de Rede / Admin) | Tela `Usuários` |
| "Balconista" | **Contato cliente** (é o nome oficial do perfil no Portal) | Tela `Usuários` |
| "Fila de pedidos", "pedidos chegando" | Aba **"Na fila"** dentro de `Pedidos` | `Pedidos` |
| "Desconto", "campanha", "oferta" | **Promoção** | `Promoções` |
| "Anúncio", "propaganda do app" | **Banner** | `Banners` (também chamada de "Anúncios do aplicativo") |
| "Cadastrar produto novo", "pedir produto novo" | **Solicitação de produto** | Ícone "Solicitar produto" na tela `Estoque` — é self-service, mas depende de aprovação do Admin (Catálogo) |
| "Anjo" | Profissional do time de **Operações internas da Farmarcas** que dá suporte ao associado (termo interno) | — |
| "Sistema BIG", "Alfa 7"/"Alpha7", "Soft", "TRIER" | Sistemas de **ERP** usados pelas farmácias, integrados ao Portal via API | Fora do Portal — são os sistemas de gestão do próprio associado |
| "E-Delivery" | Nome antigo/alternativo do próprio **Portal Radar E-commerce** — mesma ferramenta, sem diferença de funcionalidade | — |

---

## Perguntas indiretas e reclamações comuns

Associados nem sempre fazem uma pergunta direta — muitas vezes descrevem um sintoma, uma reclamação de cliente, ou um pedido vago. Esta tabela ajuda o bot a traduzir isso para o conceito/tela real do Portal antes de responder. **Padrão de resposta:** confirme o que entendeu, depois explique onde resolver (ex.: "Ah, entendi! Isso é o campo [X], em [tela Y]...").

**Confusões básicas (App vs. Portal, contas, primeiros passos)**

Essas são as mais fundamentais — geralmente de quem está começando agora ou nunca usou o Portal. Vêm antes das outras porque, se o associado não entende essa separação básica, qualquer resposta mais específica vai confundir ainda mais.

| Se o associado disser algo como... | Ele quer dizer... | Resposta / onde está |
|---|---|---|
| "Recebi um pedido no app mas não sei onde acessar" | Confundiu **App** (onde o cliente compra) com **Portal** (onde o associado gerencia) — são coisas diferentes | Os pedidos aparecem pra você na tela **Pedidos**, dentro do **Portal** (não no app) — na coluna "Na fila" do quadro. Você recebe um aviso por WhatsApp quando cai um pedido novo (ver seção de notificações). |
| "Tem um app do Portal pra eu usar no celular?" | Achar que existe uma versão mobile/app do Portal | Não — o Portal é **só web**, acessado pelo navegador, normalmente num computador/notebook. Não existe app do Portal. |
| "Sou cliente da minha própria farmácia e tenho conta no app — isso me dá acesso ao Portal?" | Confundir a conta de **consumidor no App** com a conta de **equipe no Portal** | Não, são contas completamente separadas. A conta do App é pra compra (login por e-mail ou CPF); a conta do Portal é de equipe/gestão, criada só por convite, com e-mail + senha e um Perfil de acesso definido. |
| "Meu funcionário quer acessar o Portal, ele pode criar uma conta sozinho?" | Achar que existe cadastro livre/self-service no Portal, como no App | Não existe cadastro aberto no Portal — o único jeito de entrar é receber um **convite** de alguém que já tem acesso (Gestor de Loja/Rede/Admin), pela tela Usuários. |
| "Configurei uma promoção/produto no Portal, preciso fazer alguma coisa no app também?" | Achar que precisa replicar manualmente a configuração no app | Não — você só configura pelo **Portal**; o App do consumidor reflete automaticamente, sem nenhuma ação adicional do seu lado. |
| "Como eu troco de loja dentro do Portal?" | Não achou o seletor de loja/rede | Use o seletor (▾) no cabeçalho, ao lado do nome da Rede/Loja atual — troca sem precisar sair e logar de novo. |
| "O cliente diz que não encontra minha loja no app" | Pode ser um de vários motivos: loja pausada (toggle Disponível), ERP sem sincronizar há mais de 72h, ou o cliente abriu o app de **outra bandeira** | Cheque primeiro a tela Estoque (alerta de comunicação com o ERP) e o toggle Disponível; se os dois estiverem OK, confirme com o cliente se ele baixou o app da Rede/bandeira certa (cada Rede tem seu próprio app, ver whitelabel). |
| "Baixei o app mas não é o nome da minha farmácia" | Confusão de whitelabel — cada Rede tem seu próprio app com nome de marca (ex: Ultra Popular) | Confirme qual Rede/bandeira a loja pertence e oriente a baixar o app com esse nome específico — não existe um app único "Radar E-commerce" para o consumidor final. |
| "Como eu sei em qual módulo minha loja está?" | Dúvida entre módulo Ofertas e Vendas | Coluna **"Módulo ativado"** na tela `Lojas` (nível Rede). |
| "Como eu vejo minha loja no app, quero conferir se está tudo certo?" | Achar que existe um modo de pré-visualização/preview | Não existe preview — a única forma é abrir o próprio app e navegar como um cliente comum faria. |
| "Preciso de ajuda urgente, quem eu chamo?" | Buscar suporte direto | Contato direto com o **Anjo** via WhatsApp, ou abrir chamado pelo **Salesforce**. O suporte é sempre com a **Farmarcas** — nunca com a Rede (ver "Redes, Grupos e Lojas"). |

**Dados da loja / cadastro**

| Se o associado disser algo como... | Ele quer dizer... | Resposta / onde está |
|---|---|---|
| "O nome do meu farmacêutico está errado", "preciso atualizar o CRF" | Corrigir o campo **Farmacêutico responsável** ou **CRF** | `Configurações > Dados da Loja > Informações da loja` — campo editável normalmente. |
| "O telefone da loja mudou", "quero atualizar o e-mail de contato" | Atualizar **Telefone** ou **E-mail** da loja | Mesma tela, `Configurações > Dados da Loja > Informações da loja`. |
| "Quero mudar o nome que aparece pro cliente no app" | Alterar o **Nome da loja no app** | Mesma tela — é um campo separado da Razão social. |
| "O CNPJ está errado no sistema" | Corrigir o CNPJ cadastrado | **Não é possível pelo Portal** — o CNPJ não é editável. Precisa abrir chamado com o suporte. |
| "Perdi minha API key", "não sei mais qual é minha chave de integração" | Consultar a **Chave de integração do ERP** | É só consulta (campo somente leitura) em `Configurações > Dados da Loja > Informações da loja`. Se foi comprometida e precisa de uma **nova** chave, não existe self-service — precisa abrir chamado com o suporte. |
| "Quero trocar o WhatsApp que recebe aviso de pedido novo" | Atualizar o campo **WhatsApp** da loja | Mesma tela — é esse número que recebe a notificação automática de pedido novo (ver "E-mails automáticos do sistema" para o funcionamento do disparo). |
| "Funcionário saiu, quero tirar o acesso dele" | **Desativar** o acesso de um usuário | Dentro da entidade "usuário", no contexto da loja, existe o botão **Desativar** (não é exclusão do cadastro) — ver seção Usuários. |

**Horários, entrega e frete**

| Se o associado disser algo como... | Ele quer dizer... | Resposta / onde está |
|---|---|---|
| "O app mostra que a loja tá fechada, mas a gente tá aberto" | O **Horário de Atendimento** está errado | `Configurações > Dados da Loja` — é o horário que o consumidor vê ao buscar a loja no app. |
| "Cliente não consegue marcar entrega/retirada no horário certo" | **Horário de Entrega** ou **Horário de Retirada** desalinhados do Horário de Atendimento geral | `Configurações > Formas de Entrega` — são 3 horários independentes; checar qual dos três está errado. |
| "O app tá dizendo que não entrega mais pro bairro do cliente" | Endereço fora do **Raio de atendimento** configurado | `Configurações > Formas de Entrega > Receber em casa` — revisar as faixas de Alcance × Taxa. |
| "Quero cobrar menos pra entregas mais longe", "cliente reclama que o frete tá caro" | Ajustar a tabela de **Alcance (km) × Taxa de Entrega** | Mesma tela — é possível cadastrar quantas faixas forem necessárias (lembrar de clicar no "+" antes de Salvar). |
| "Quero dar entrega de graça pra quem compra mais de R$X" | Configurar **Frete Grátis** | `Configurações > Formas de Entrega > Receber em casa`. |
| "Cliente falou que só apareceu 'Retirada em loja', sem opção de entrega" | Endereço do cliente fora do raio de entrega **daquela loja específica** | Comportamento esperado do app — a entrega some e só retirada fica disponível; o checkout segue normalmente. |
| "A retirada tá demorando/rápido demais no app" | Ajustar o **Tempo de retirada** | `Configurações > Formas de Entrega > Retirada na loja`. |

**Pagamento**

| Se o associado disser algo como... | Ele quer dizer... | Resposta / onde está |
|---|---|---|
| "Cliente não conseguiu pagar na entrega" | Checar se o pagamento na entrega está ativado | `Configurações > Pagamentos` — pergunta "Deseja ativar o pagamento na entrega?" |
| "Não aparece Pix/dinheiro na maquininha" | Meio de pagamento "Outros" não habilitado | `Configurações > Pagamentos` — Dinheiro e Pix ficam em "Outros". |
| "Cliente reclama que não aceita o cartão dele" | Bandeira específica não selecionada | `Configurações > Pagamentos` — checar lista de bandeiras Débito/Crédito (tem atalho "Selecionar todas"). |
| "Quem processa o pagamento online da loja?" | Identificar o gateway | **Braspag** — precisa de dados da credenciadora/adquirente pra ativar (ver Meios de pagamento). |

**Estoque e preço**

| Se o associado disser algo como... | Ele quer dizer... | Resposta / onde está |
|---|---|---|
| "Esse produto não aparece no app, mas eu tenho em estoque" | Ou o EAN não existe no catálogo oficial (é descartado silenciosamente), ou o toggle "Exibir preço" está desligado, ou o ERP não está sincronizando | Checar as três hipóteses na tela `Estoque` — ver seção 7 do Manual. |
| "O preço no app tá diferente do que eu mando pro ERP" | Dúvida sobre a regra do preço exibido | O Portal sempre mostra o **menor** entre "preço bruto" e "preço de venda" enviados pelo ERP — ver seção Estoque/Preço. |
| "A quantidade no app tá errada" | Achar que dá pra corrigir estoque no Portal | **Não dá** — o Portal não permite editar quantidade, só preço (R$ customizado). O número reflete só o que o ERP envia; checar sincronização. |
| "Minha loja desapareceu do aplicativo" | Toggle "Disponível" desligado, ou loja pausada automaticamente por falha de comunicação com o ERP (72h) | Checar `Estoque` — ver alerta de comunicação com ERP. |
| "Quero vender um produto que não existe no sistema" | Fazer uma **Solicitação de produto** | Ícone "Solicitar produto" na tela `Estoque` — depende de aprovação do Admin (Catálogo). |
| "Por que não posso colocar desconto nesse medicamento controlado?" | Regra regulatória de controlados | Controlados não entram em promoção — já aparecem desabilitados na criação da oferta. |
| "Quero escoltar um produto com preço errado sem perder o cadastro" | Ocultar temporariamente sem excluir | Desmarcar **"Exibir preço"** na linha do produto, em `Estoque`. |

**Pedidos**

| Se o associado disser algo como... | Ele quer dizer... | Resposta / onde está |
|---|---|---|
| "O pedido não sai da tela, travou em Liberados" | Pedido meio de entrega/retirada não confirmado pelo cliente | Ver Q&A "Meus pedidos estão travados na fase Liberados". |
| "Cliente pagou e quer cancelar — o que eu faço com o dinheiro?" | Dúvida sobre estorno | Estorno/reembolso é tratado **inteiramente fora do sistema** — o app não mostra status pro cliente; avise-o diretamente. |
| "Não sei qual motivo de cancelamento escolher" | Lista de motivos do modal de cancelamento | Ver seção "Como cancelo um pedido" — 9 motivos fixos. |
| "Parei de receber aviso de pedido no WhatsApp" | Número de WhatsApp errado/desatualizado na config da loja | Checar campo **WhatsApp** em `Configurações > Dados da Loja`. |
| "Um item do pedido não tem estoque, o que eu faço?" | Achar que dá pra remover só aquele item | **Não dá estorno parcial** — a tag "Sem estoque" é automática; a única solução é cancelar o pedido inteiro. |

**Promoções**

| Se o associado disser algo como... | Ele quer dizer... | Resposta / onde está |
|---|---|---|
| "Criei a oferta mas não aparece produto pra escolher" | Produto é medicamento controlado | Controlados aparecem desabilitados na seleção — regra regulatória, não é bug. |
| "Cliente ativou a oferta e não conseguiu usar" | Promoção fora do período de vigência | A oferta ativada só vale dentro do período de vigência da própria promoção (início/fim) — ver seção Promoções. |
| "Quero limitar a promoção a 1 por CPF" | Achar que o Limite por compra trava por cliente | Hoje o limite vale **por cesta/pedido**, não por CPF — o mesmo cliente pode criar outro pedido e repetir o desconto. Limitação conhecida, sem previsão de mudança confirmada. |
| "Quero destacar minha melhor oferta" | Usar a etiqueta "Em destaque" | Selecionar a promoção e aplicar **"Em destaque ⭐"** — sem limite de quantas podem estar destacadas ao mesmo tempo. |
| "Meu balconista não consegue criar promoção" | Perfil sem permissão | Perfil **Contato cliente** só visualiza/exporta Promoções — não tem botão "Nova promoção" (regra esperada). |

**Indicadores e relatórios**

| Se o associado disser algo como... | Ele quer dizer... | Resposta / onde está |
|---|---|---|
| "Quero saber quanto vendi esse mês", "como eu acompanho o faturamento da minha loja?" | Consultar o indicador **Faturamento** | Home de Vendas (Indicadores) — mostra o valor total de vendas no período selecionado; basta ajustar o seletor de datas no topo da tela pra mudar o range. |
| "Pedi um relatório e não chegou na hora" | Exportação é assíncrona | Todo export do Portal chega por e-mail com link de download, não na hora do clique — ver "E-mails automáticos do sistema". |
| "Quero saber quais lojas não têm nenhuma oferta ativa" | Indicador **Lojas sem ofertas em exibição** | Home de Ofertas — tem botão pra baixar a lista. |

---

## Acesso, login e perfis

**Como eu entro no Portal?**
Tela "Bem-vindo — Faça login para acessar sua conta", com campos E-mail e Senha (ícone de olho pra mostrar/ocultar), checkbox "Lembrar senha" e botão "Entrar".

**Esqueci minha senha do Portal, o que fazer?**
Clique em "Esqueceu a senha?" na tela de login, informe seu e-mail cadastrado e clique em "Enviar". Você recebe uma tela de confirmação ("E-mail enviado") e um link por e-mail para redefinir a senha (confira a caixa de spam se não chegar). **Atenção:** isso é diferente do app do consumidor final, onde a redefinição é feita por CPF, não por e-mail — não confundir os dois fluxos.

**Recebi um convite pra usar o Portal, como completo meu cadastro?**
O convite leva a um fluxo "Complete seu cadastro" em 2 passos: primeiro Nome completo e CPF; depois Nova senha + Confirmar nova senha (com os requisitos de senha mostrados na tela — mínimo de caracteres, maiúscula/minúscula, caractere especial). Ao concluir, aparece "Parabéns, cadastro concluído!" e um botão para ir à tela de login.

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
Existem 3 tipos de horário, independentes entre si (ver detalhe na seção Configurações da Loja):
1. **Horário de Atendimento** (o principal, o que o cliente vê no app) — em `Configurações > Dados da Loja > Horário de Atendimento`.
2. **Horário de Entrega** — em `Configurações > Formas de Entrega > Horário de Funcionamento`.
3. **Horário de Retirada** — em `Configurações > Formas de Entrega > Retirada na Loja`.

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
É o nível mais alto de organização no Portal, abaixo apenas da Farmarcas — representa uma bandeira/franqueadora (ex: ACFARMA, Ultra Popular, Super Popular). Dentro de uma Rede existem lojas de vários GEs (empresários) diferentes.

**A Rede dá suporte para as lojas/GEs dela?**
**Não — e isso NÃO tem exceção.** ⚠️ Se você ler em algum outro material (ex: FAQ de outro time) a frase "acione o suporte da rede", **isso está incorreto** — não existe suporte prestado pela Rede. A Rede é só uma categoria organizacional/comercial (bandeira), não uma cadeia de suporte. Cada GE (Grupo Econômico) é um associado/empresário **independente**, com suas próprias lojas — GEs diferentes não têm relação entre si, mesmo estando na mesma Rede. Todo GE responde **diretamente à Farmarcas**, nunca à Rede.

**Então quem eu devo acionar quando tenho um problema?** Só existem dois pontos de suporte possíveis:
1. **Suporte do sistema ERP** (do próprio associado) — para problemas de preço/estoque não refletindo corretamente, falha de sincronização, etc.
2. **Farmarcas** (Anjo via WhatsApp, ou chamado via Salesforce) — para qualquer outra questão do Portal/App.

Nunca direcione um lojista para "falar com a Rede" (ex: "fale com a Ultra Popular") — isso é sempre errado.

**Cada Rede tem o próprio aplicativo? O app tem nome diferente para cada uma?**
Sim. Hoje existem 12 Redes na plataforma, e cada uma tem seu próprio app, com nome/marca própria (whitelabel) — por exemplo, a Rede Ultra tem o app "Ultra Popular". Todos os apps compartilham exatamente as mesmas funcionalidades; só a marca muda. Dentro do app existe o contexto de loja: o cliente vê o estoque de uma loja específica por vez, mas pode trocar de loja dentro do próprio app.

**O que é um GE (Grupo Econômico)?**
É o conjunto de uma ou mais lojas do mesmo empresário/associado, dentro de uma Rede. É o conceito de negócio por trás da funcionalidade **Grupo de lojas** no Portal — ou seja, quando um associado tem várias filiais, ele normalmente organiza essas lojas num Grupo de lojas dentro do Portal.

**O que é um Grupo de lojas e para que serve?**
É a funcionalidade do Portal que organiza as lojas de um mesmo GE dentro de uma Rede, definindo uma regra comum de **atendimento de pedidos** e **tipo de estoque**. A vantagem principal é operacional: em vez de um atendente precisar abrir uma aba por loja, o grupo permite acompanhar os pedidos de todas as lojas participantes numa única tela.

**Quais são as opções de atendimento e estoque de um Grupo de lojas?**
Ao configurar um grupo (botão "Configurar atendimento e estoque" dentro do detalhe do grupo), existem 3 opções — mas elas dizem respeito **só ao estoque**, não a onde os pedidos são atendidos:
1. **Estoque Espelhado** — uma loja "mãe" (loja principal) recebe todos os pedidos do grupo, e o estoque dela é replicado (espelhado) para as outras. É possível incluir uma loja secundária: nesse caso os estoques das duas lojas são somados, exibindo a quantidade total no app.
2. **Estoque Integrado** — o estoque é somado fisicamente entre todas as lojas do grupo.
3. **Estoque Independente** — os estoques de cada loja do grupo ficam isolados uns dos outros.

**Importante:** não importa qual das 3 opções de estoque é escolhida — configurar um Grupo de lojas **sempre centraliza o atendimento dos pedidos na tela da loja principal**. A escolha entre Espelhado/Integrado/Independente afeta só o comportamento do estoque entre as lojas do grupo.

Essa escolha afeta diretamente o que aparece disponível no aplicativo para os consumidores de cada loja do grupo — deve ser mudada com cuidado se o grupo já estiver em operação.

**Como adiciono uma loja a um Grupo?**
No detalhe do grupo (aba "Lojas"), existe o botão **"Adicionar loja"**.

**O que é o "Estoque Centralizado" que aparece na tela de Lojas?**
É o botão de atalho, no nível da Rede, para a tela de Grupo de lojas — tanto para ver os grupos existentes quanto para criar um novo. Não é uma funcionalidade separada, é a mesma configuração de Grupo de lojas descrita acima.

**Consigo mudar uma loja de GE (Grupo Econômico)?**
Não existe uma função para isso no Portal hoje. Se uma loja for removida, todos os usuários vinculados a ela perdem esse vínculo — ver seção Usuários.

**Ao tentar cadastrar minha loja, o sistema diz que ela já está vinculada, mas meu CNPJ consta como não cadastrado. O que fazer?**
Isso costuma ser um conflito de duplicidade ou vínculo residual no banco de dados (comum quando uma bandeira mudou de CNPJ). É preciso acionar o suporte Farmarcas para que o time técnico remova o vínculo antigo e libere o recadastro — não é algo que o associado resolve sozinho pelo Portal.

**O que significa "ERP conectado até" na lista de Lojas?**
É a data/hora da última vez que aquela loja sincronizou dados com o sistema ERP dela. Se essa data estiver muito atrasada (mais de 72 horas / 3 dias), é sinal de problema de comunicação — ver a seção Estoque abaixo sobre o alerta correspondente.

**O que é a tela "Redes"?**
Tela exclusiva do perfil Admin, lista todas as Redes cadastradas na plataforma com nome, quantidade de lojas e botão "Abrir rede". Tem busca e um botão "Exportar redes".

**Como baixo o relatório de Redes ou de Lojas?**
- **Relatório de redes**: botão "Exportar redes" na tela "Redes" (nível Admin) — traz todas as lojas de todas as Redes que o usuário tem acesso.
- **Relatório de lojas**: botão "Exportar Lojas" na tela "Lojas" de uma Rede específica — traz só as lojas **daquela Rede** que o usuário tem acesso (um Gestor de Loja com 5 lojas vinculadas só vê essas 5 no relatório, mesmo que a Rede tenha mais).

Ambos têm as mesmas colunas: Nome Rede, Nome Loja, CNPJ Loja, Estado Loja, Cidade Loja, ERP conectado até, Módulo (Oferta/Vendas — no arquivo vem "Oferta" no singular), Data Solicitação do Vendas, Loja Ativa (Sim/Não), Pagamento Online (Braspag ou "Não configurado").

**"Loja Ativa" no relatório é a mesma coisa do NSM (Volume de Transações por Loja Ativa)?**
Não. Nesse relatório, **Loja Ativa = Sim** só indica que a loja existe e não foi removida (a ação de "remover loja" faz uma exclusão lógica/soft-delete, que marca como inativa). É diferente do conceito de NSM, onde Loja Ativa = loja que transacionou no período de referência. São dois usos diferentes do mesmo termo — não confundir.

---

## Indicadores

**O que é a tela de Indicadores?**
É uma aba de navegação real chamada "Indicadores" — funciona como a Home/painel principal ao entrar numa loja ou rede. Tem duas sub-abas: **Vendas** e **Ofertas**.

**Como eu mudo o período de análise dos indicadores?**
Use o seletor no topo da tela (ex.: "Últimos 7 dias", "Últimos 12 meses", com opção de período Personalizado via calendário). O botão **Filtrar** permite refinar por outros critérios, e **Exportar** baixa os dados exibidos. A tela também tem **atualização automática a cada 30 minutos** (mostra a data/hora da última atualização no cabeçalho). **Importante:** mudar o período recarrega todos os cards da tela (uma chamada nova por card) — é normal ver os cards em "esqueleto de carregamento" por um instante.

**Consigo comparar minhas lojas entre si?**
Sim, no nível da Rede a Home de Vendas mostra um **Ranking das lojas** por faturamento (pódio com as 3 primeiras posições — não encontrei opção de ver mais do que isso). Esse card não existe no painel por Loja.

### Home de Vendas — o que cada indicador significa

No topo há 3 abas (Faturamento/Pedidos cancelados/Pedidos concluídos), cada uma com seu próprio gráfico já carregado — trocar de aba só alterna qual é exibido, não busca dado novo:
- **Faturamento**: "Representa o valor total das vendas registradas no período selecionado."
- **Pedidos cancelados**: "Total de pedidos cancelados no período selecionado."
- **Pedidos concluídos**: "Total de pedidos finalizados no período selecionado."

Demais indicadores:
- **Ticket Médio**: "Valor médio gasto por pedido no período, calculado dividindo o faturamento total pela quantidade de pedidos."
- **Total de Pedidos em Aberto**: "Quantidade de pedidos ainda não finalizados no período, incluindo todos os status pendentes (na fila, liberados e em separação)." Tem botão "Visualizar pedidos".
- **Volume dos pedidos em aberto**: soma em R$ de todos os pedidos ainda não finalizados (Na fila + Em separação + Liberados).
- **Pedidos em aberto por status** (gráfico de rosca Fila/Em separação/Liberados, em %): contagem de pedidos por status. Hoje esse indicador tem um problema: filtra pelo período de data selecionado, quando deveria sempre mostrar o total de pedidos em aberto das lojas do usuário, independente da data de criação — correção já registrada em ticket interno.
- **Tempo médio para iniciar primeiro atendimento**: tempo entre o pedido entrar "Na fila" e ser concluído (formato de duração, ex.: "9h e 37min").
- **Tempo médio total de atendimento**: também entendido como "Na fila" até "Concluído" (ex.: "2 dias e 11h") — definição exata ainda em checagem com engenharia (pode haver sobreposição com o indicador anterior; já registrado em ticket interno).
- **Média de itens por cesta**: média de itens por pedido, considerando todos os pedidos (concluídos ou não).
- **Volume dos pedidos cancelados**: valor em R$ (não quantidade) que seria faturado pelos pedidos cancelados no período — a label do card hoje não deixa isso claro (correção registrada).
- **Faixa etária por gerações**: "Distribuição dos clientes que realizaram compras no período, agrupados por gerações." Faixas: 18–28 anos (Geração Z), 29–44 anos (Geração Millennials Y), 45–60 anos (Geração X), +60 anos (Baby Boomers).
- **Região** (só no painel de Rede, não existe por Loja nesta home): "Distribuição dos clientes que compraram no período, agrupados conforme a localização geográfica cadastrada." Categorias: Sudeste, Norte, Sul, Centro-Oeste, Nordeste, Estado inválido.
- **Gênero**: "Distribuição dos clientes que realizaram compras no período, de acordo com a informação de gênero cadastrado." Categorias: Homem, Mulher, Indefinido.
- **Ranking das lojas** (só Rede): ver pergunta acima.
- **Top produtos mais vendidos**: "Apresenta os produtos que tiveram o maior número de vendas no período, destacando os campeões de desempenho." — lista ranqueada (nome, EAN, unidades e R$ por produto) com botão "Baixar produtos".
- **Formas de pagamento**: "Distribuição dos pedidos realizados no período, de acordo com o meio de pagamento utilizado" (detalha Online → Crédito/Pix e Offline → Balcão/Na entrega, tudo em %).
- **Métodos de entrega**: "Mostra como os pedidos foram recebidos pelos clientes no período, diferenciando opções como Receber em Casa (entrega no endereço do cliente) e Retirada (o próprio cliente busca o pedido na loja ou ponto de coleta)."
- **Lojas sem opção de receber em casa** (só Rede): "Lojas que oferecem apenas a modalidade de retirada, sem opção de entrega em domicílio. Esse indicador ajuda a identificar associados que podem não ter operação logística para envio." Botão "Ver lojas com retirada".

### Home de Ofertas — o que cada indicador significa

- **Total de ofertas criadas**: "Quantidade de ofertas cadastradas pelas lojas no período."
- **Ofertas ativadas**: "Quantidade de ofertas que os clientes finais ativaram no aplicativo durante o período."
- **Taxa de conversão das ofertas em vendas**: "Percentual de ofertas ativadas pelos clientes no app que resultaram efetivamente em compras no período."
- **Total de vendas realizadas**: "Quantidade total de pedidos concluídos no período, resultando em compras efetivamente finalizadas."
- **Quantidade de conversão em vendas**: "Total de pedidos finalizados como vendas no período selecionado" (gráfico com legenda PDV/Aplicativo).
- **Faixa etária por gerações**: "Distribuição dos clientes que realizaram ativações no período, agrupados por gerações..."
- **Região** (aqui existe por Loja e por Rede): "Distribuição dos clientes que realizaram ativações no período, agrupados conforme a localização geográfica cadastrada (ex.: Sudeste, Sul, Nordeste)."
- **Gênero**: distribuição por gênero de quem **ativou** ofertas no período (o app hoje mostra por engano o mesmo texto da Home de Vendas, falando em "compras" — já reportado como bug).
- **Top produtos com mais ativações**: produtos com mais ativações no período (o app hoje mostra por engano o texto de "vendas" da Home de Vendas — já reportado como bug).
- **Lojas sem ofertas em exibição** (logo abaixo de "Total de ofertas criadas"): "Apenas as lojas que não possuem nenhuma oferta ativa. Nessas condições, o app fica indisponível para os clientes até que novas ofertas sejam cadastradas." Botão "Ver lojas sem ofertas" baixa o relatório correspondente (ver seção de relatórios).
- **Aviso: Loja indisponível no app** (só quando é uma única loja): "Essa loja está indisponível para os clientes no app porque não há nenhuma oferta ativa."

### Como os gráficos se comportam

- Passar o mouse sobre um ponto/barra/fatia mostra o valor (em R$ nos gráficos de Faturamento/Ticket Médio; valor + % nos gráficos de rosca e no de Gênero). Nos gráficos de barra de Faixa etária/Região, o hover mostra só o valor bruto, sem tooltip customizado.
- **Não existe clique para filtrar ou abrir detalhe** em nenhum gráfico da tela.
- Nenhuma legenda é clicável — todas são listas estáticas de cor + rótulo, só para leitura.
- Mudar o período recarrega a página inteira (uma chamada nova por card).
- Gráficos de rosca e o de Gênero mostram um círculo cinza vazio quando não há dado no período; Faturamento/Ticket Médio/Faixa etária/Região não têm essa ilustração (ficam em branco); "Top produtos" tem sua própria ilustração de vazio ("Sem dados... por enquanto!").

### Relatórios exportáveis da Home

Alguns cards da Home baixam um relatório em Excel (.xlsx):

**Como baixo o relatório de Pedidos Faturados?**
Pelo botão **"Exportar"** no cabeçalho da Home de Vendas — funciona em qualquer uma das 3 abas (Faturamento/Pedidos cancelados/Pedidos concluídos), sempre gera o mesmo relatório. Colunas: Loja (⚠️ hoje traz o CNPJ, não o nome — correção pendente), Número do pedido, Data do pedido, Nome do cliente, CPF, Detalhe do pedido (EAN do item), Método de pagamento, Método de entrega, Valor, Status. É uma linha por item do pedido, não por pedido — se um pedido tem 5 produtos, aparecem 5 linhas com o mesmo Número do pedido.

**Como baixo o relatório de Pedidos em Aberto?**
Pelo botão **"Visualizar pedidos"** no card "Total de Pedidos em Aberto". Colunas: Rede, CNPJ, Nome da Loja, Número do pedido, Data do pedido realizado, Status (Pendente/Em separação/Liberado), Valor.

**Como baixo o relatório de Lojas com retirada ativa?**
Pelo botão **"Ver lojas com retirada"** no card "Lojas sem opção de receber em casa" (Home de Vendas, nível Rede). Colunas: Rede, CNPJ, Nome da loja. Deveria trazer só lojas do módulo Vendas sem entrega em domicílio — hoje não filtra corretamente por módulo (correção pendente).

**Como baixo o relatório de Produtos mais ativados?**
Pelo botão **"Baixar produtos"** no card "Top produtos com mais ativações" (Home de Ofertas). Colunas: Ranking, EAN, Nome do produto, Quantidade de ativações — sempre os 10 primeiros.

**Como baixo o relatório de Lojas sem ofertas ativas?**
Pelo botão **"Ver lojas sem ofertas"** no card "Lojas sem ofertas em exibição" (Home de Ofertas, logo abaixo de "Total de ofertas criadas"). Colunas: Rede, CNPJ, Nome da loja.

> Os dois ajustes pendentes (cabeçalho "Loja"=CNPJ no relatório de Pedidos Faturados, e filtro de módulo no relatório de Lojas com retirada ativa) já estão registrados em ticket interno ([ECP-1056](https://farmarcas.atlassian.net/browse/ECP-1056)).

---

## Configurações da Loja

**O que tem dentro de Configurações?**
Três grandes seções, no menu lateral: **Dados da Loja**, **Formas de Entrega** e **Pagamentos**. Um indicador "Seu progresso" no canto inferior mostra quantas configurações essenciais já foram concluídas.

**Como eu migro pro módulo de Vendas?**
O botão **"Faça upgrade para o módulo Vendas"** já fica disponível direto — não precisa completar nada antes. Ao clicar nele, é que se libera o widget **"Seu progresso"**, dentro de Configurações, pra você ajustar o checklist de onboarding:
1. Informações da Loja
2. Endereço Comercial
3. Horário de atendimento
4. Criação de oferta

Depois de solicitado o upgrade, um botão **"Acompanhar solicitação"** mostra o status desse pedido.

**Como funciona a migração do módulo Ofertas para o módulo Vendas (e a liberação da Chave API)?**
1. O associado clica em "Faça upgrade para o módulo Vendas", solicitando a migração pelo Portal.
2. A Chave de integração do ERP (API) é liberada e deve ser inserida no sistema ERP da loja.
3. A ativação do módulo de Vendas e o espelhamento do estoque acontecem **separadamente** — pode levar um tempo até o estoque aparecer no app mesmo com o módulo já ativo.
4. Se a solicitação ficar travada em "Aguardando" por muito tempo, ou o estoque demorar demais para aparecer, o associado deve acionar o suporte do próprio ERP para validar a integração do lado deles.

**O que preencho em "Dados da Loja > Informações da loja"?**
CNPJ (fixo), Razão social, Nome da loja no app (nome visível para o consumidor), E-mail, Telefone, WhatsApp (pode ser um número 0800), Farmacêutico responsável, CRF do farmacêutico, e a Chave de integração do ERP (fixa, gerada pela plataforma).

**Como configuro o endereço da minha loja?**
Em `Configurações > Dados da Loja > Endereço comercial`: preencha CEP, Estado, Logradouro, Número, Complemento, Bairro, Cidade e, se quiser, um Ponto de referência. Existe também um mapa para confirmar visualmente a localização — atenção: **mover o alfinete no mapa não altera o endereço textual cadastrado**, serve só para ajuste visual de geolocalização.

**O que é o "Horário de Atendimento" em Dados da Loja?**
É o horário geral em que a loja está aberta ao público — diferente do horário de entrega/retirada configurado em Formas de Entrega. Você ativa cada dia da semana individualmente e define o intervalo "De/Até".

**Por que meu horário aparece incorreto no aplicativo?**
Geralmente é uma configuração pendente ou desalinhada entre os **3 tipos de horário** que existem no Portal:
- **Horário de Atendimento** — o principal, é o que o cliente vê ao buscar a loja no app. Configura em `Configurações > Dados da Loja > Horário de Atendimento`.
- **Horário de Entrega** — define quando a loja aceita pedidos para entrega. Configura em `Configurações > Formas de Entrega > Horário de Funcionamento`.
- **Horário de Retirada** — define quando o cliente pode buscar um pedido na loja. Configura em `Configurações > Formas de Entrega > Retirada na Loja`.

Os horários de Entrega e Retirada não aparecem diretamente na vitrine do app, mas alimentam o cálculo de quando o cliente pode escolher cada opção e a previsão de recebimento — por isso, se algo parecer errado, vale checar os três.

**Como funciona "Receber em casa"?**
Em `Configurações > Formas de Entrega > Receber em casa`, ative o toggle e configure: horário de funcionamento para entrega, o raio de atendimento (distância máxima, até 30 km, com faixas de Alcance × Taxa de Entrega × Tempo de Entrega — dá pra criar quantas faixas forem necessárias, cada uma exibida numa lista com ícone de excluir ao lado, então também dá pra remover uma faixa já criada) e, opcionalmente, frete grátis a partir de um valor mínimo de compra.

**Configurei as faixas de entrega mas elas não salvam. O que fazer?**
Depois de preencher Alcance, Taxa e Tempo de uma faixa, é **obrigatório clicar no botão "+"** para adicionar aquela regra à listagem antes de clicar em Salvar. Se pular esse clique no "+", os dados somem. Se mesmo assim o problema persistir, é preciso acionar o suporte para inserir os dados manualmente.

**O cliente está pertinho da farmácia mas o app diz que ele está "fora do alcance". O que conferir?**
Primeiro, confirme no Portal se o raio de entrega está configurado corretamente. Se estiver certo, o problema costuma ser do lado do cliente: ele pode ter digitado o CEP/endereço errado, ou até colocado o CEP da própria farmácia no campo de entrega por engano — peça um print da tela dele para confirmar.

**Como funciona "Retirada na loja"?**
Em `Configurações > Formas de Entrega > Retirada na loja`, ative o toggle e configure o horário em que a loja aceita retirada, e o "Tempo de retirada" — quantos minutos depois da confirmação do pedido o produto fica pronto para o cliente buscar (esse tempo aparece pro consumidor no app).

**Como ativo pagamento com maquininha?**
Em `Configurações > Pagamentos > Com maquininha` não existe um interruptor geral — o controle é só pelas duas perguntas Sim/Não, "Deseja ativar o pagamento na entrega?" e "Deseja ativar o pagamento na retirada?" (a loja pode ter nenhum, um ou os dois habilitados), mais a seleção de bandeiras aceitas (tem atalho "Selecionar todas"): Débito (Banescard, Cabal, Elo, Hiper, Union Pay, Visa), Crédito (Alelo Pagamentos, Amex, Banescard, Cabal, Coopercard, Credz, Diners, Discovery Network, Elo, Hiper, Hipercard, JCB, Mais!, Mastercard, Sorocred, Union Pay, Visa), Outros (Dinheiro, Pix).

**Como ativo pagamento online (cartão pela internet)?**
Em `Configurações > Pagamentos > Online`, é preciso primeiro preencher os dados fornecidos pela credenciadora **Braspag** (Adquirente, se habilitou PIX, Nome na Fatura, MerchantId, MerchantKey, ClientID, ClientSecret). Os campos ficam bloqueados até a integração estar corretamente conectada.

---

## Estoque

**O que mostra a tela de Estoque?**
Lista todos os produtos daquela loja, com preço padrão (R$ App), um preço customizado opcional (R$ customizado, que sobrescreve o preço do ERP), a quantidade em estoque, e um toggle "Exibir preço" que controla se o produto aparece com preço visível no app.

**Como o estoque da minha loja é montado?**
O seu ERP envia EAN, quantidade e preço para o Portal. Se o EAN já existe no catálogo oficial da plataforma, o produto entra no seu Estoque; se não existe, o item é **desprezado** — não aparece em lugar nenhum, sem aviso.

**Quem inicia essa comunicação, o Portal ou o ERP?** ⚠️ É o **ERP** — a comunicação é **passiva e incremental do lado do Portal**: o ERP empurra (push) os dados pro Portal a cada 15 minutos, só o que mudou (preço ou estoque) desde o último envio, não uma base completa a cada vez. O Portal **não consulta/puxa dados via API própria** — se algum material disser "o Portal extrai o preço via API do ERP", essa descrição está invertida: quem envia é sempre o ERP.

**O estoque (quantidade) pode ser editado no Portal?**
Não — só o **preço** pode ser ajustado manualmente (ver abaixo). A quantidade em estoque sempre reflete exatamente o que o ERP envia.

**Minha loja não aparece no aplicativo. O que pode ser?**
Dois motivos principais:
1. **Perda de conexão com o ERP** — o sistema da loja parou de enviar dados para o Portal.
2. **Desativação manual** — o estoque foi desabilitado propositalmente dentro do Portal (toggle "Disponível" desligado).

**Por que a loja é desativada automaticamente?**
Se o Portal perder a comunicação com o ERP por mais de **72 horas (3 dias)**, a loja é desativada automaticamente — é uma medida de segurança para não vender produto com preço desatualizado ou sem estoque real.

**Como resolver a desativação por falta de comunicação com o ERP?**
1. Abra um chamado com o suporte técnico do seu sistema ERP.
2. Peça a reconfiguração: solicite a **"Nova Integração de Preço e Estoque"**.
3. Informe ao suporte a sua **Chave de Integração** (token único). Se não souber onde encontrá-la: `Portal > Configurações > Informações da Loja > Chave de integração do ERP`.

**Por que o preço de um produto aparece incorreto às vezes?**
O seu ERP envia **dois preços** por produto: um "preço bruto" (full price) e um "preço de venda" (price) — o Portal sempre exibe o **menor dos dois**, porque você pode ter algum desconto ou caderno de ofertas vinculado no próprio ERP. Divergências também podem vir de atraso de sincronização entre o ERP e o Portal.

**Consigo alterar o preço direto no Portal?**
Sim — acesse `Estoque`, clique no ícone de lápis (editar) na linha do produto — abre o modal **"Alterar preço do produto"**, com o Preço App atual e um campo "Novo preço". Isso preenche o campo **R$ customizado**. Não existe validação sobre esse valor: fica valendo exatamente o que foi digitado até ser removido. **Isso só altera o preço — a quantidade em estoque não é editável pelo Portal.** Hoje esse recurso é exclusivo do perfil **Contato cliente** (balconista). Se vários produtos estiverem com valor errado ao mesmo tempo, o ideal é abrir chamado com o suporte do ERP pedindo uma atualização forçada da base em lote, em vez de corrigir um por um.

**Como oculto um produto com preço ou estoque errado, sem excluir o cadastro?**
Acesse o produto na tela Estoque e desmarque a opção **"Exibir preço"**. Ele deixa de aparecer no app até a correção ser feita. Esse toggle funciona por produto; o toggle "Disponível" no topo da tela é o equivalente para a **loja inteira** (liga/desliga tudo de uma vez) — usado, por exemplo, quando o associado percebe muitos problemas de preço/estoque e prefere pausar a loja no app enquanto ajusta o ERP. É o mesmo campo que o sistema desliga sozinho após 72h sem comunicação com o ERP.

**O que é o ícone ⓘ ao lado do EAN de um produto?**
Mostra em tooltip a última atualização de **estoque** e a última atualização de **preço** daquele EAN especificamente — podem ser datas diferentes, já que o ERP manda uma ou outra de forma independente.

**Como oculto medicamentos do aplicativo?**
Duas formas: desabilitar o estoque geral daquele grupo de produtos, ou desativar item por item dentro do Estoque. **Não é possível** ocultar por categoria inteira de uma vez — tem que ser tudo ou um por um.

**Ativei o módulo de Vendas e a API, mas o estoque ainda não aparece no app. O que houve?**
A ativação do módulo e a sincronização/espelhamento do estoque acontecem de forma separada — o estoque pode levar um tempo para aparecer, mesmo com o módulo já ativo. A loja pode seguir preenchendo as demais configurações normalmente enquanto isso.

**Mudamos de ERP (ex: do BIG para o Alpha7), trocamos o token, mas o app continua puxando o estoque do sistema antigo. Como resolver?**
Entre em contato com o suporte do novo ERP e peça uma **limpeza de dados anteriores** (cache/histórico) antes de subir o estoque novamente — isso evita o conflito entre o estoque antigo e o novo durante o espelhamento.

**No formulário de integração do ERP, o que colocar no campo "Nome da Empresa"?**
Os dados da **Farmarcas** — a integração é feita via API usando a chave que está no Portal, não os dados da própria farmácia associada.

**Como os pedidos do e-commerce aparecem no meu sistema ERP?**
A integração ocorre via API, enviando os pedidos em formato de pré-venda (ou pedido integrado, dependendo do ERP) diretamente para a tela do sistema da loja — o formato exato varia por ERP (ver também a seção sobre o Alpha7 abaixo).

**Como solicito um produto que ainda não existe no catálogo?**
Use o ícone "Solicitar produto" na barra de ferramentas da tela Estoque. No formulário, informe Nome do produto e Fabricante, e para cada item o Código de barras (EAN), a Apresentação (ex: "Dorflex caixa com 10") e uma imagem de referência — dá pra solicitar **até 50 produtos de uma vez**. A solicitação vai para aprovação do time Farmarcas (Admin/Catálogo).

**Como baixo o relatório de Estoque/Preço?**
Ícone de exportar na barra de ferramentas da tela Estoque. Colunas: Ean, Preço bruto (full price do ERP), Preço Venda (price do ERP — o menor dos dois é o exibido no app), Categoria, Nome do produto, Estoque, Data da última atualização. *(Em ajuste — [ECP-1064](https://farmarcas.atlassian.net/browse/ECP-1064): essa última coluna será separada em "última atualização de estoque" e "última atualização de preço".)*

---

## Pedidos

**O que significam as colunas do quadro de Pedidos?**
- **Na fila**: pedido novo, ainda aguardando início do atendimento. Assim que o pedido cai, o sistema dispara um WhatsApp direto pro número cadastrado da loja (`Configurações > Dados da Loja`), avisando o responsável. Do lado do consumidor, ele recebe push notification a cada mudança de status e também acompanha pelo detalhe do pedido no próprio App.
- **Em separação**: pedido sendo preparado/separado na loja.
- **Liberados**: pedido pronto, liberado para entrega ou retirada.
- **Concluídos**: pedido já entregue/retirado com sucesso.
- **Cancelados**: pedido cancelado, seja pela loja ou pelo consumidor.

**O que significa a etiqueta "Preço loja" / "Preço PEC" num item do pedido?**
Indica de onde veio o preço daquele produto no momento da venda: **"Preço loja"** é o preço padrão cadastrado no Estoque; **"Preço PEC"** vem do sistema PEC (base de clientes/preços da rede). Também pode aparecer **"Sem estoque"** — uma tag gerada automaticamente pelo sistema (não é o balconista quem marca; o Portal não permite editar estoque) quando o item foi vendido com estoque baixo/não confirmado. **Importante:** não existe estorno parcial de item — se um produto do pedido está em falta, a única solução é cancelar o pedido inteiro.

**Como funciona o troco quando o pagamento é em dinheiro?**
O Portal calcula automaticamente o **Valor a cobrar** e o **Troco** com base no total do pedido, exibidos no painel de detalhe do pedido.

**Como cancelo um pedido, e quais motivos posso selecionar?**
Ao cancelar, abre o modal "Cancelar pedido #[número]", pedindo o motivo: Endereço incorreto, Cliente não estava no local indicado, Cliente não precisava mais dos itens, Cliente solicitou produto por engano, Pedido duplicado, Pedido atrasado, Pedido indisponível, Suspeita de fraude, ou Sem estoque. Pede confirmação e não pode ser desfeito.

**O pedido que vou cancelar já foi pago online. Muda alguma coisa?**
Sim — o modal mostra um selo "Pedido pago" e um lembrete para informar ao cliente sobre as políticas de estorno e reembolso. O cancelamento em si não dispara um estorno automático — **hoje isso é tratado inteiramente fora do sistema** (manualmente pela equipe), e o App do consumidor não mostra nenhum status de reembolso. É por isso que o modal pede pro atendente avisar o cliente diretamente.

**Meus pedidos estão travados na fase "Liberados" e não mudam de status. O que fazer?**
Isso indica instabilidade na comunicação de status entre os sistemas — não é algo que o associado resolve sozinho pelo Portal. Anote os números dos pedidos afetados e tire prints das telas, e acione o suporte Farmarcas o quanto antes para que o time técnico analise e destrave o fluxo.

**Reclamaram de um produto errado num pedido, mas os dados não batem com o que o cliente diz. Como proceder?**
Sempre confira o **EAN (código de barras)** do produto no cadastro do Estoque/Catálogo antes de tudo. Se o associado disser que o produto é de uma especificação (ex: 60g) mas o EAN aponta outra (ex: 180g), o correto é aguardar o retorno do cliente com a confirmação dos dados reais do produto físico antes de seguir com o chamado.

**Como baixo o relatório de Pedidos?**
Botão "Exportar" no topo da tela Pedidos → escolha o período (Últimos 7/30/90 dias ou Personalizado) → "Gerar Relatório". Colunas atuais: Número do pedido, Valor, Itens, Data da compra, Taxa de entrega, Tipo da compra (Delivery/Retirada), Nome da Loja, CNPJ, Pagamento (Online/Offline), Status, Motivo, CPF, Meio de Pagamento, Data de Cancelamento (só para cancelados).

**A coluna "Motivo" do relatório de Pedidos significa sempre a mesma coisa?**
Não — é usada para duas coisas diferentes dependendo do status: em pedidos entregues/retirados, mostra o tipo de entrega ("Entrega em domicilio"/"Retirar na loja"); em pedidos cancelados, mostra o motivo do cancelamento (texto livre, ex: "Cliente solicitou produto por engano").

**Por que aparece "Status desconhecido" no relatório de Pedidos?**
É um estado inconsistente já identificado pelo time de produto — está previsto para ser removido/desconsiderado do relatório (ver ticket de ajuste abaixo). Se um associado perguntar sobre isso, é um bug conhecido, não uma configuração dele.

**O relatório de Pedidos está passando por uma correção — o que muda?**
Sim, o ticket [ECP-747](https://farmarcas.atlassian.net/browse/ECP-747) (refinado, ainda não implementado) define o comportamento correto:
- Pedidos em status **ativo** (Na fila/Em separação/Liberados) sempre aparecem no relatório, **independente do período** selecionado — é uma fotografia em tempo real.
- Pedidos em status **final** (Concluídos/Cancelados) respeitam o período, mas pela data em que **entraram** nesse status, não pela data de criação.
- Nova coluna **"Usuário Cancelamento"**: mostra quem cancelou/concluiu; se foi o próprio ERP, mostra "ERP".
- Lojas que fazem parte de um Grupo: o relatório sempre traz pedidos de **todas as lojas do grupo**, ignorando filtro de loja aplicado pelo usuário.
- Período menor que 6 meses: download direto na tela (toast de sucesso); maior que isso, mantém o fluxo atual.
- "Status desconhecido" deixa de aparecer.
- *(Ainda em discussão no ticket, não confirmado: substituir o envio por e-mail por download direto, e um limite de tamanho para esse download.)*

---

## Promoções

**Só dá pra criar promoção pelo Portal?**
Não, existem duas formas: (1) criar a promoção direto no Portal (tela Promoções, gera uma seção própria no app, ex: "Ofertas em destaque"), ou (2) subir um **"caderno de ofertas" pelo próprio ERP**, classificado como e-commerce — o preço promocional reflete no app pela sincronização normal de estoque/preço (a cada 15 minutos), permitindo agendar promoções diárias direto pelo ERP sem precisar abrir o Portal.

**Qual a diferença entre promoção "Individual" e "Por grupo"?**
**Individual** é uma promoção aplicada a um único produto. **Por grupo** é aplicada a um conjunto de produtos relacionados (um "Grupo de produtos", por exemplo uma linha inteira de uma marca) de uma vez só.

**Como crio uma promoção passo a passo?**
No botão "Nova promoção", siga os 5 passos do formulário:
1. Escolha **o que promover** — Um produto ou Grupo de produtos — e o tipo de desconto (ex: Desconto % ou Preço fixo).
2. Escolha **em quais lojas** a promoção vale.
3. Defina **quando** ela fica ativa — data de início/fim e dias da semana.
4. Configure as **regras de uso** — hoje só existe o campo **Limite por compra** (os campos "tempo para uso" e "novo uso da oferta" foram removidos da tela). Uma oferta ativada pelo cliente só pode ser usada dentro do período de vigência da própria promoção (data de início/fim do passo 3) — não existe mais tempo de uso/renovação separado. ⚠️ **O Limite por compra vale por cesta/pedido, não por CPF** — mesmo que outro material diga "por cliente", isso está incorreto: o app não trava por CPF hoje, então o mesmo cliente pode criar vários pedidos pra repetir a promoção.
5. Escolha **os produtos**: busque por nome/EAN (ou por grupo, se escolheu "Grupo de produtos" no passo 1), ajuste o desconto individualmente ou aplique um "Desconto geral" de uma vez para todos os produtos selecionados.

**Dá pra cadastrar vários produtos de uma vez numa promoção?**
Sim, no passo 5 existe a opção **"Importar planilha"** — baixe o modelo, preencha com os produtos e descontos desejados, e faça o upload (formato .xlsx). O Portal mostra quantos produtos foram encontrados e quantos não puderam ser importados.

**Como cancelo uma promoção?**
Na listagem de Promoções, selecione a(s) promoção(ões) e use a ação de cancelamento em lote, ou abra o detalhe de uma promoção específica para cancelá-la individualmente. O cancelamento pede confirmação, pois não pode ser desfeito depois.

**Como removo só uma loja de uma promoção sem cancelar tudo?**
Abra o detalhe da promoção (clique na linha da lista) — lá aparece a seção "Lojas participantes", com opção de remover uma loja específica sem afetar as demais.

**O que aparece no rodapé do detalhe de uma promoção?**
Depende do status: se estiver **Ativa**, mostra "Cancelar oferta" e "Destacar oferta"/"Retirar destaque". Se estiver **Finalizada** ou **Cancelada**, mostra só o botão **"Repetir oferta"**. O perfil Contato cliente (balconista) não vê nenhum desses botões, em nenhum status.

**Como funciona "Repetir oferta"?**
No detalhe de uma promoção Finalizada ou Cancelada, o botão "Repetir oferta" abre o formulário de criação já preenchido com os dados da promoção original (produtos, lojas, tipo de desconto, regras) — só as datas de início/fim ficam em branco, precisam ser escolhidas de novo. Dá pra editar qualquer campo antes de salvar. Funciona para promoções individuais e por grupo.

**Consigo colocar um medicamento controlado em promoção?**
Não. O Portal já bloqueia isso na criação da oferta — medicamentos controlados aparecem desabilitados na lista de seleção de produtos do passo 5.

**Existe limite de promoções "Em destaque"?**
Não há limite de quantas promoções podem estar marcadas como destaque ao mesmo tempo. Ter ao menos uma promoção em destaque cria uma seção própria chamada **"Ofertas em destaque"** no aplicativo do consumidor.

**Quais filtros e ordenações existem na lista de Promoções?**
- Filtrar por **Tipo de oferta**: Preço fixo, Desconto %.
- Filtrar por **Status**: Ativa, Finalizados, Cancelados.
- **Ordenar** por: Data, Nome, Mais ativadas, Menos ativadas, Mais vendidas, Menos vendidas, Maiores conversões, Menores conversões.

**Um balconista (Contato cliente) consegue ver as Promoções?**
Sim — ele vê a listagem completa (individuais e por grupo, com todas as métricas) e pode exportar o relatório, mas **não tem o botão "Nova promoção"** — segue não podendo criar/cancelar promoções.

**Como baixo o relatório de Promoções/Ofertas?**
Botão "Exportar" → painel "Relatório de ofertas" → escolha um intervalo (dois calendários de mês lado a lado) → "Gerar relatório". **O relatório é filtrado pela data de criação da promoção**, não pela data de vigência/divulgação. Colunas: Item em oferta (Produto/Familia), Tipo oferta (aqui aparece "Preço fixo"/"Porcentagem %" — nome um pouco diferente do usado no wizard, "Desconto %"), Nome produto, Ean, Ativação, Vendas, Pdv ou App (formato "0/0" = vendas no PDV / vendas no App), Conversão, Início da divulgação, Fim da divulgação, Status, Criação.

**Por que o relatório de ofertas tem colunas de "Gênero" e "Faixa etária"? Consigo segmentar por público?**
Não mais — essas colunas são resquício de uma segmentação de público que existia numa versão antiga da tela de criação de promoção. O aplicativo **nunca respeitou** essa segmentação, mesmo antes da tela ser refatorada — é um dado morto. Estão sendo removidas do relatório ([ECP-1062](https://farmarcas.atlassian.net/browse/ECP-1062)) e das telas do Portal ([ECP-1063](https://farmarcas.atlassian.net/browse/ECP-1063)). A coluna "Média" do relatório também está sendo removida (cálculo não está claro nem para o time de produto).

---

## Banners

**O que são os Banners do Portal?**
São os anúncios que aparecem no carrossel da home do aplicativo do consumidor. Cada banner tem posição (pode ser reordenado arrastando), imagem, destino do clique, métricas de exibições/cliques, período de divulgação e os estados (UFs) onde é exibido.

**Como crio um novo banner?**
Na tela `Banners`, use o botão **"Novo banner"** — abre um wizard de 4 passos: **Início → Espaços → Lojas → Configurações**.
1. **Início**: escolha "Inserir um banner" (única opção hoje).
2. **Espaços**: escolha onde o banner aparece — hoje só **"No carrossel da home"** ("Em uma vitrine de produtos" está marcado "Em breve"). Specs: até **5 banners**, **320×220px**, até **1MB**, formatos **PNG/JPG**.
3. **Lojas**: escolha "Todas as lojas" ou selecione por Estado (UF), podendo refinar por loja dentro do estado.
4. **Configurações**: para cada banner, defina o destino do clique e o período de exibição (ou "Banner permanente").

**Quais são os tipos de destino de um banner (o que acontece quando o cliente clica)?**
- **Banner estático**: nenhuma ação, só exibe a imagem.
- **Departamento**: leva para um departamento do catálogo (ex.: Cosméticos).
- **Uma seleção de produtos**: leva para uma lista específica de produtos (busca por nome/EAN ou importação). Importante: **só aparece em lojas que têm esses produtos em estoque** — se o banner não aparecer numa loja, provavelmente é falta de estoque desses produtos.
- **Um link externo**: abre uma URL fora do app.

**O banner precisa ter data de término?**
Não — dá para marcar **"Banner permanente"** em vez de definir uma data de término.

---

## Usuários

**Como convido uma pessoa nova para acessar o Portal?**
Na tela `Usuários`, use a opção de convidar/criar usuário. O modal de convite é simples: apenas o **e-mail** do convidado (com validação, bloqueando duplicados), o **Perfil de acesso** dele (Contato cliente, Gestor de Loja, Gestor de Rede ou Admin — ver seção "Acesso, login e perfis") e o vínculo à loja, lojas ou rede correspondente. Não há campos adicionais (nome, telefone etc.) nesse momento — quem preenche esses dados é o próprio convidado, no fluxo de "Complete seu cadastro" (ver "Acesso, login e perfis").

**Posso remover o acesso de alguém que saiu da farmácia?**
Sim — dentro da entidade "usuário", no contexto da loja, existe o botão **Desativar**. Não é uma exclusão: o cadastro continua existindo, só o acesso dele fica bloqueado. Usuários com perfil Contato cliente não têm essa ação disponível para eles mesmos (não conseguem desativar outros usuários).

**A Chave de integração do ERP foi comprometida ou perdida — dá para gerar uma nova pelo Portal?**
Não, hoje não existe self-service para isso. É preciso abrir chamado com o suporte para gerar uma nova chave.

**Consigo convidar a mesma pessoa/e-mail para dar acesso a outra loja ou rede?**
Não com o mesmo e-mail. O Portal bloqueia o convite se aquele e-mail já existir no sistema (aparece a mensagem "Parece que o usuário já existe em nosso sistema", com opção de "Voltar" ou "Editar usuário"). Para dar acesso adicional a alguém, edite o cadastro existente em vez de tentar criar um segundo login.

**O que acontece com os usuários se uma loja é removida do Portal?**
Todos os usuários vinculados àquela loja perdem o vínculo automaticamente:
- Um **Contato cliente** (vinculado a uma única loja) continua conseguindo logar, mas passa a ver uma tela em branco, sem loja para trabalhar.
- Os demais perfis (Gestor de Loja/Rede/Admin), se tiverem outras lojas vinculadas, simplesmente deixam de ver os dados da loja removida e seguem vendo as demais normalmente.

Não existe uma função para "mudar" uma loja de GE/rede dentro do Portal — a única forma de reorganizar é removendo e recadastrando o vínculo.

**Enviei um convite de usuário e ele não chegou / deu erro. O que fazer?**
Na maioria das vezes é preenchimento incorreto do e-mail do convidado, ou uma configuração travada no perfil de quem está enviando o convite. Confira se o e-mail foi digitado certo; se persistir, acione o suporte para ajustar o perfil de quem está convidando.

**Dá pra alterar o e-mail de um usuário já cadastrado?**
Sim, mas se o sistema der erro na troca, confira se o novo e-mail já não está associado a outra conta ativa — e-mails duplicados geram conflito e bloqueiam a alteração.

**Dá pra buscar um usuário pelo CPF para redefinir senha ou trocar e-mail?**
Sim, o painel permite buscar por CPF para localizar o cadastro e seguir com a redefinição.

---

## Catálogo de produtos

**Eu, como associado, posso cadastrar um produto novo direto no Portal?**
Não diretamente — o catálogo de produtos é **centralizado e compartilhado entre todas as Redes** da plataforma, gerenciado pelo time da Farmarcas (perfil Admin). Mas o pedido para incluir um produto novo é **self-service**: você mesmo envia a solicitação pela tela Estoque (ver seção Estoque, "Como solicito um produto que ainda não existe no catálogo?"), só a aprovação final é que fica com a Farmarcas.

**O que é uma Solicitação de produto?**
É o pedido para incluir um produto novo (nome, fabricante, EAN, apresentação e imagem) no catálogo mestre da plataforma, enviado pelo associado a partir da tela Estoque. A solicitação é analisada pelo time Farmarcas (Admin), que aprova ou reprova — o produto só passa a existir e pode ser vendido depois de aprovado.

**Consigo cadastrar produtos e preços em massa, ou preciso fazer um por um?**
Dá para fazer em massa, via carga de dados (planilha/integração) — não precisa cadastrar produto por produto manualmente.

**Um produto meu não pode entrar em promoção, por quê?**
Cada produto no catálogo tem uma configuração chamada **"Permitir promocionar"**, feita no cadastro do produto (gerenciado pela Farmarcas). Se estiver desativada, o produto não pode ser **adicionado** a nenhum grupo promocional. Detalhe: se o produto já estava num grupo promocional antes de receber essa restrição, ele não é removido automaticamente do grupo — a regra só vale para novas inclusões.

**O que acontece quando um produto é "despublicado" do catálogo?**
Ele deixa de ser exibido no catálogo de todas as lojas — mesmo que uma loja continue enviando aquele EAN via integração com o ERP, ele não volta a aparecer. O registro do EAN continua existindo em pedidos antigos e relatórios, só a exibição futura é bloqueada.

**O que muda quando um produto é marcado como "Genérico"?**
No aplicativo, aparece uma tag "genérico" no detalhe daquele item para o consumidor.

**Por que um EAN que minha loja manda pelo ERP às vezes não aparece no meu estoque?**
Porque o estoque de cada loja é montado **a partir do Catálogo oficial**: o Portal só usa o EAN enviado pela integração do ERP se esse EAN **já existir no catálogo**. Se não existir, o item é simplesmente ignorado — não aparece no estoque, sem nenhum aviso. Se isso acontecer, a saída é solicitar a inclusão do produto (ver "Como solicito um produto que ainda não existe no catálogo?", seção Estoque).

**O que preciso preencher para cadastrar um produto novo no Catálogo?** *(referência para o time Farmarcas/Admin, que é quem cadastra)*
- **Nome do produto**, **Código de barras (EAN)** e **Marca**: obrigatórios.
- **Fabricante**: opcional.
- **Tipo de cadastro** (Medicamento / Não Medicamento): obrigatório, e muda o resto do formulário —
  - **Medicamento**: exige **Registro MS** (número de registro na ANVISA) e **Tarja** (Sem tarja = venda livre / Tarja Vermelha = prescrição médica comum / Tarja Preta = controlado/psicotrópico com retenção de receita — os "Controlados" do glossário); o **Departamento** fica restrito a Farmacinha ou Medicamentos.
  - **Não Medicamento**: Registro MS aparece mas não é obrigatório; Tarja não aparece; Departamento libera as demais opções.
- **Permitir promocionar** e **Genérico**: toggles, padrão "Não" (ver definições acima).
- **Imagens do produto**: obrigatório, até 1 imagem (JPG/PNG, até 2MB).
- **Princípios ativos**: obrigatório, um ou mais (campo de tags).
- **Descrição curta**: obrigatória, até 650 caracteres.
- **Departamento/Categoria**: obrigatórios; **Subcategoria**: opcional (ver árvore completa abaixo).
- Ações: **Cancelar**, **Salvar como Rascunho** (não publica ainda), **Publicar** (torna o produto visível no catálogo oficial).

**Qual é a árvore completa de Departamento/Categoria/Subcategoria do Catálogo?**

*(Nota: a fonte tem algumas entradas duplicadas/com grafia inconsistente, ex.: "Condicionador" e "Condicionadores" — mantidas como estão, sem unificar.)*

Departamentos exclusivos de **Medicamento**: Farmacinha, Medicamentos.
Departamentos exclusivos de **Não Medicamento**: Cosméticos, Cuidados Masculinos, Cuidados pessoais, Dermocosméticos, Higiene e beleza, Infantil, Nutrição e alimentos, Outros, Saúde Sexual, Suplementos Alimentares.

- **Farmacinha**: Dor e Febre (Analgesicos/Antitermicos); Azia e má digestão (Anti Gases, Antiacidos, Antidiarreicos, Má Digestão/Hepatológicos, Outros, Prisão de Ventre); Alergias e infecções (Antialergicos, Antigripais, Pastilhas, Soro Nasal, Spray Garganta, Xaropes); Fitoterápicos e naturais (Antroposófico, Aromaterapia, Calmante Natural ou Tratamento de Insônia, Fitoterápico, Homeopático); Vitaminas (Omegas, Outros Nutrientes Puros, Polivitaminicos); Outros (Outros).
- **Medicamentos**: Medicamentos de Prescrição (Anti-Alégicos, Anti-Inflamatórios, Asma, Azia E/e Má Digestão, Congestão Nasal, Controle De/de Peso, Desconforto Abdominal E/e Intestino, Diabetes, Dor De Garganta, Dor E Febre, Emagrecimento, Endocrinologia, Enxaqueca, Gastrite, Ginicologia, Gripe E Resfriado, Impotência, Infecções, Infertilidade, Insonia, Nutrientes, Outras Especialidades, Outros Medicamentos de Prescrição, Pressão Alta, Pílulas Anticoncepcionais E Diu, Reumatologia, Rinite E Sinusite, Tireóide, Tosse, Visão); Medicamentos com Retenção de Receita (Antibiótico, Controlado (Port 344)).
- **Cosméticos**: Rosto (Hidratação, Limpeza, Outros Cuidados, Solar, Tratamento (Anti Acne, Anti Idade)); Corpo (Bronzeadores, Hidratação, Protetor Solar, Pós Sol); Outros (Hidratação, Limpeza, Outros, Outros Cuidados, Solar, Tratamento (Anti Acne, Anti Idade)).
- **Cuidados Masculinos**: Higiene (Acessorios Masculinos, Aparelho/Lamina De Barbear, Cosmeticos Barba, Shampoo/Condicionadores, Tonalizante Para Barba E Cabelo); Outros (Outros Cuidados).
- **Cuidados pessoais**: Acessórios (Acessórios para Inalação, Caneta de Insulina, Coletor Descartável, Lancetas e Agulhas, Outros Acessórios, Seringas, Tiras Reagentes); Primeiros Socorros (Alcool 70, Algodão, Antiséptico e Cicatrizantes, Contusão, Curativos e Bandagens, Fitas Adesivas, Gaze e Atadura, Luva Descartável, Máscara Descartável, Outros Primeiros Socorros, Soro Fisiológico, Água Oxigenada 10vol); Auto Testes (Auto Teste Colesterol, Auto Teste Covid, Auto Teste Hiv, Outros Testes, Teste Fertilidade, Teste Gravidez); Aparelhos (Balança, Glicosímetro, Lancetador, Monitor De Pressão, Nebulizador ou Inalador, Outros Aparelhos, Oxímetro, Termômetro, Umidificador ou Purificador); Ortopedia (Bengala e Muleta, Bota Ortopédica, Cinta e Meia de Compressão, Joelheira e Tornozeleira, Munhequeira e Cotoveleira, Outros Acessórios Ortopédicos, Protetor De Hérnia, Tipóia/Colar Cervical e Corretor Postural); Cuidado com os pés (Calcanheira, Palmilhas e Protetor de Joanete).
- **Dermocosméticos**: Corpo (Capilar, Hidratação, Limpeza, Outros Cuidados, Solar, Tratamento); Rosto (Hidratação, Limpeza, Outros Cuidados, Solar, Tratamento); Nutricosméticos (Nutricosmeticos); Outros (Outros).
- **Higiene e beleza**: Cabelos (Condicionador(es), Finalizadores/Produtos Sem Enxágue, Máscaras/Mascaras de Tratamento, Shampoo, Acessórios Para Cabelo, Agua Oxigena 20/30/40 Vol, Outros, Po Descolorante, Pomadas E Gel Capilar, Tonalizantes E Tinturas, Tratamento Piolho); Higiene Pessoal (Sabonete/Gel Limpeza, Absorventes, Acessorios Higiene, Antifungicos, Depilação, Descolorantes, Fralda Adulto, Hastes Flexiveis, Lenco/Toalha Umedecida Adulto, Lenço De Papel, Outros Cuidados de Higiene, Papel Higienico, Repelentes, Sabonete Intimo); Beleza (Acessorios Maquiagem, Acessórios Para Unha, Cutelaria, Esmaltes, Maquiagem, Outros); Higiene Oral (Acessorios Protese Dental, Creme/Gel Dental, Enxaguante Bucal, Escova Dental, Fio/Fita Dental, Limpador De Lingua, Outros); Desodorantes (Aerosol, Bastão/Stick, Creme, Outros, Roll-On); Cuidado para os olhos (Alivio Vermelhidão, Lagrimas Artificiais, Limpadores De Lentes De Contato, Outros Cuidados para os Olhos); Cuidados Complementares (Antitabagismo, Outros, Ouvidos); Acessórios para cabelos (Outros Acessorios Cabelo, Secadores/Chapinhas/Modelador De Cachos); Higiene do Ambiente (Limpeza).
- **Infantil**: Amamentação (Absorvente Seios, Bomba Tira Leite, Concha Para Seios, Outros); Acessórios (Acessorios Banho, Acessorios Chupeta, Acessorios Mamadeira, Acessórios Para Alimentação, Alimentadores, Chupetas, Copos, Mamadeiras, Mordedor, Outros Produtos de Puericultura); Higiene do Bebê (Aspirador Nasal, Condicionadores, Creme/Gel Dental, Dedeira, Escova Dental, Fraldas, Lenco/Toalha Umedecida, Outros Produtos de Higiene Infantil, Pente/Escova Cabelos, Repelentes, Shampoo, Talcos, Tesoura/Cortador Unha); Nutrição (Cereais, Formulas, Leites, Outros Produtos de Nutrição Infantil, Papinhas, Snacks, Suplemento Alimentar Em Pó, Suplemento Alimentar Pronto Para Consumo); Cuidados (Colonias, Creme Assaduras, Creme Hidratante, Outros Cuidados, Protetor Solar); Outros (Outros).
- **Nutrição e alimentos**: Alimentos (Adoçantes, Bala/Goma de Mascar e Pastilhas, Barra de Cereais, Barra de Proteína, Chocolate/Doce e Confeitos, Diet ou Ligth, Orgânico ou Integral, Outros Alimentos, Salgadinho e Snack); Bebidas (Chá, Energético, Hidratação Oral, Outras Bebidas, Suco ou Refrigerante, Suplemento Alimentar Pronto Para Consumo, Água); Conveniência (Diversos, Pilha ou Bateria).
- **Outros**: Outros (Outros).
- **Saúde Sexual**: Acessórios Sexuais (Acessorios Intimos, Gel De Massagem); Lubrificantes (Lubrificante Intimo); Outros (Outros); Preservativos (Preservativo Feminino, Preservativo Masculino).
- **Suplementos Alimentares**: Fitness (Creatina, Hipercaloricos, Outros Suplementos, Outros Suplementos Fitness, Proteinas E Bcaa, Pré-Treino, Shakes Emagrecedores, Termogenicos); Nutrição Adulto (Fórmula Especial Adulta, Suplemento Alimentar Em Pó); Outros (Outros).

---

## Precificação e descontos vindos do ERP (ex: sistema BIG)

> Estas perguntas são mais técnicas e giram em torno do **ERP do associado** (BIG, Alfa 7/Alpha7, Soft), não do Portal em si — mas são comuns o suficiente para o bot reconhecer e orientar o primeiro passo.

**Por que a configuração de preços e descontos no meu ERP parece tão complexa?**
É comum na maioria dos sistemas de ERP (BIG, Alpha7, Soft): existem múltiplas variáveis e formas de aplicar desconto e estruturar preço, o que gera bastante campo de preenchimento.

**Como funciona a lógica de desconto no sistema BIG?**
O BIG parte de uma **Tabela de Desconto**: toda vez que o módulo Radar Farma é configurado, uma tabela padrão é definida como ponto de partida para as regras do sistema.

**Como investigar por que um produto está com preço/desconto errado (sistema BIG)?**
Siga do geral para o específico:
1. **Tabela de Desconto do Produto** — veja se existe uma regra específica para aquele produto.
2. **Desconto do Grupo** — se não houver regra específica, confira se o grupo daquele produto tem desconto automático ativo.
3. **Cadastro do Produto** — por último, confira se existe uma regra de "Preço Filial" aplicada, e se o produto não está marcado como inativo no sistema.

---

## Integração ERP Alpha7

**Meus pedidos do app estão entrando no ERP Alpha7 como "Orçamento em cotação", em vez de já virarem pedido de entrega para faturar no PDV. Por quê?**
Esse é o comportamento padrão da integração atual do Alpha7: os pedidos do app chegam ao ERP, mas entram inicialmente na listagem de orçamentos, não direto como pedido de entrega.

**O que fazer para o pedido aparecer no PDV para faturamento?**
Fluxo manual, por enquanto:
1. Acesse a listagem de orçamentos no ERP.
2. Abra o orçamento correspondente ao pedido do app.
3. Altere o status de "Orçamento em cotação" para **"Orçamento de entrega"**.
4. Depois dessa conversão, o pedido fica visível no PDV para emissão de nota e faturamento.

**Isso vai continuar sendo manual?**
A equipe de tecnologia da Farmarcas já está em contato com o time da Alpha7 para tornar esse fluxo automático (pedidos entrando direto como entrega). Está em avaliação de viabilidade técnica pelo lado da Alpha7, sem data confirmada.

---

## Meios de pagamento (Braspag, Cielo, Rede, Antifraude)

**Como contrato a Braspag? Tem mensalidade ou taxa inicial?**
A contratação é **100% self-service pelo próprio Portal**, em `Configurações > Pagamentos` — não precisa (e não deve) abrir chamado de suporte para isso.

**Por que preciso assinar um contrato via D4Sign enviado pelo ERP, se a integração por API não tem custo?**
Mesmo sem taxa de integração, a assinatura é **obrigatória** por exigência regulatória e de LGPD — é o termo de aceite para o compartilhamento e tráfego de dados de clientes entre os sistemas.

**Quem ajuda na configuração do Antifraude da Braspag?**
O suporte do e-commerce orienta o fluxo inicial (kickoff), mas o acompanhamento detalhado do antifraude é feito junto com a própria Braspag/adquirente.

**O link do contrato Braspag veio com CNPJ/Razão Social errados. Como corrigir?**
É preciso levantar os dados corretos da loja e pedir ao suporte interno a geração e reenvio de um novo link D4Sign.

**Estou recebendo muitos erros de "Cartão Inválido" ou "Compra não finalizada" numa loja específica. O que pode ser?**
Geralmente está ligado a instabilidade na adquirente (Cielo, Rede etc). Vale confirmar se a loja está usando a adquirente homologada correta para o perfil dela, e se o e-commerce já foi incluído/liberado no painel da própria credenciadora de cartões.

---

## E-mails automáticos do sistema

**O Radar E-commerce manda e-mails automáticos? Como funciona?**
Sim. Existe um centralizador de comunicação interno que aciona o SendGrid para o envio. A maioria dos e-mails avisa sobre relatórios prontos para download, eventos de acesso (convite, senha) ou o status da integração da loja com o ERP.

**Cliquei em "Exportar" um relatório e nada baixou na hora. Isso é um bug?**
Não. Toda exportação de relatório no Portal é processada em segundo plano (assíncrona) — o Portal envia um e-mail com o link de download quando o arquivo fica pronto, não na hora do clique.

**Quais relatórios do Portal chegam por e-mail e de qual tela/botão eles saem?**
- "Relatório de ofertas" → botão Exportar no painel "Relatório de ofertas" da tela Promoções.
- "Relatório completo de produtos" e "Relatório de estoque por loja" → mesmo botão: ícone de exportar na tela Estoque (dois nomes de e-mail para o mesmo disparo).
- "Relatório de redes" → botão "Exportar redes" na tela Redes (Admin).
- "Relatório de lojas" → botão "Exportar Lojas" na tela Lojas de uma Rede.
- "Relatório de pedidos em aberto" → botão "Visualizar pedidos" no card "Total de Pedidos em Aberto" (Home de Vendas).
- "Relatório de lojas sem ofertas" → botão "Ver lojas sem ofertas" no card "Lojas sem ofertas em exibição" (Home de Ofertas).
- "Relatório de ofertas mais ativadas" → botão "Baixar produtos" no card "Top produtos com mais ativações" (Home de Ofertas).
- "Relatório de produtos mais vendidos" → botão "Baixar produtos" no card "Top produtos mais vendidos" (Home de Vendas).
- "Relatório de pedidos" → botão "Gerar Relatório" na tela Pedidos.
- "Relatório de pedidos cancelados" → botão Exportar na aba "Pedidos cancelados" da Home de Vendas (mesmo arquivo do relatório "Pedidos Faturados").

**Recebi um e-mail dizendo "Recebemos uma solicitação para redefinir/alterar a senha". Qual a diferença entre os dois?**
São dois e-mails quase idênticos: um é disparado pelo fluxo "Esqueceu a senha?" do **Portal** (texto "solicitação para **redefinir**"), o outro pelo fluxo de recuperação de senha do **App** do consumidor final (texto "solicitação para **alterar**"). O conteúdo é parecido de propósito — a diferença real é qual sistema disparou, não o texto do e-mail.

**Recebi um convite por e-mail para o Radar E-commerce. Por quanto tempo ele vale?**
O texto do e-mail diz "válido por 5 dias", mas isso está desatualizado — hoje o convite **não expira mais**. Correção do texto do template registrada em [ECP-1066](https://farmarcas.atlassian.net/browse/ECP-1066). O e-mail traz o botão "Completar meu cadastro", que leva ao formulário de 2 passos (dados pessoais + senha).

**Recebi um e-mail dizendo que a integração do meu ERP foi concluída, mas ainda preciso fazer algo?**
Sim — esse e-mail avisa que a integração técnica terminou, mas falta ativar o módulo de Vendas pelo próprio Portal (ver seção de Configurações da Loja) para começar a vender online de fato.

**Recebi um e-mail com uma "Chave de integração" dizendo que minha loja foi criada. O que eu faço com isso?**
Essa chave (API Key) é enviada automaticamente por um job tanto para o ERP quanto para o Gestor da loja; precisa ser cadastrada no sistema ERP da loja para iniciar o envio de estoque, preços e pedidos ao Radar E-commerce. O mesmo e-mail já avisa que dá para convidar usuários para o Portal enquanto isso.

**Recebi um e-mail dizendo que minha loja foi desconectada do ERP e saiu do aplicativo. É normal?**
Sim, é o comportamento esperado: depois de mais de 3 dias sem enviar atualização de preço/estoque, a loja é removida temporariamente do app até a comunicação com o ERP ser restabelecida — quando reconectar, um segundo e-mail confirma que a comunicação foi restabelecida e a loja volta a aparecer automaticamente. A ação recomendada é abrir chamado com o suporte do próprio ERP.

**Como funciona a notificação de pedido novo por WhatsApp?**
Toda vez que cai um pedido novo no módulo Vendas, o sistema dispara uma mensagem de WhatsApp **direto** para o número cadastrado em `Configurações > Dados da Loja > Informações da loja` (campo WhatsApp — na prática, muitas vezes é o número do Gestor de Loja). Não existe hoje nenhuma etapa separada de conexão/autenticação — o disparo é direto pro número cadastrado.

**Preenchi um formulário de interesse (Braspag, integração de estoque, ou como lead) — quem recebe esse e-mail, chega para mim?**
Não chega para o lojista. Esses formulários geram e-mails internos: para o contato comercial da Braspag (quando é sobre antifraude/pagamento online), e para os times de CS Farmarcas e/ou Implantação ERP (quando é sobre leads ou interesse em integrar estoque) — servem para o time interno dar sequência ao atendimento.

---

## Notificações, instabilidades e contingência

**Paramos de receber notificação de pedido novo via WhatsApp depois de uma atualização do Portal. O que houve?**
O serviço antigo de notificação via WhatsApp foi descontinuado. Hoje o disparo é direto pro número de WhatsApp cadastrado em `Configurações > Dados da Loja` — sem nenhuma etapa de conexão/autenticação separada (ver "Como funciona a notificação de pedido novo por WhatsApp?" na seção acima).

**O Portal ou o app estão fora do ar / não consigo logar. Existe um link alternativo?**
Sim, em caso de suspeita de instabilidade na URL principal, há um link de contingência: `https://admin-ecomm.radarfarmarcas.com.br/network/list`.

---

## Perguntas sem resposta confirmada

- **`SessionPermissionGuard` desabilitado no front-end** (achado técnico da exploração de código, não é dúvida de associado) — sem confirmação se é proposital ou dívida técnica; sem impacto conhecido no dia a dia do Portal. Mantido só como registro para o time de engenharia, não para o bot responder a associados.

Todos os demais pontos que estavam em aberto (atendimento de pedidos em Grupo de lojas, definição de "Anjo", bug do modal de cancelamento) já foram esclarecidos e incorporados ao conteúdo acima.

# PRD — Web Ecommerce (Radar) — Acesso, Onboarding, Home, Busca, PDP e Conta

**Produto:** Radar (Web Ecommerce — novo canal, Consumidor Final)
**Squad:** App (regras de origem) + Web Ecommerce (implementação)
**Autor:** Daniel (PO)
**Status:** Em refinamento — base para geração de histórias via Claude Code
**Versão:** 1.4
**Figma:** [Web · E-commerce](https://www.figma.com/design/C0TL5AwDFoO6q77tbz6ipR/Web-%C2%B7-E-commerce) — páginas "Web Foundations + Core flows" (`58:143`) e "Checkout" (`5120:18463`)

---

## 0. Changelog

**v1.4 (2026-10-07)** — Ajustes após a validação do PO das histórias: (1) **adicionar endereço** usa o formulário completo do Figma (Rua, Bairro, Número, Complemento opcional); "só número" vale apenas no onboarding (FRW-015, FRW-058; P-07 encerrada); (2) **CVV obrigatório ao salvar o cartão**, igual ao App (FRW-056; `spec.md` FR-058 e FAQ atualizados); (3) **telas de Conta** abrem em painel lateral de 375 px em todos os breakpoints (navegação igual ao mobile); (4) **PDP na primeira entrega** só com a descrição simples ("Detalhes do produto"); seções adicionais do Figma ficam fora e sem dependência de Catálogo (FRW-071; P-16 reduzida a gateway e cartões); (5) pós-cadastro: usuário fica logado e volta à tela de origem. Histórias em `US/historias-web-ecommerce.md` (v1.1).

**v1.3 (2026-10-07)** — Valores do reset de senha definidos pelo PO: código válido por **24 horas**, **sem limite de reenvios** e reenvio liberado após **30 segundos**; texto "Reenviar código" fixado na regra. Pendências de design restantes da recuperação de senha seguem na P-04. Nota: o cenário 16 da automação ECA-1228 se chama "Limitar solicitações repetidas", mas a ECA-1307 o descreve como "permanece válido apenas o último código" — sem limite de quantidade, conforme o PO; vale alinhar o nome do teste com o QA.

**v1.2 (2026-10-07)** — Fluxo de reset de senha atualizado no Jira e no Figma para ficar igual ao App (CPF → código por e-mail → nova senha). Seção 6.3.4 reescrita com as telas hoje no Figma (`5072:6725`, `5072:7997`, `5203:5837`) e com as regras de back-end cobertas pela automação de API (ECA-1228/1305/1307): código incorreto/expirado/consumido, apenas o último código válido, limite de solicitações, política de senha, login com nova senha por CPF e e-mail e bloqueio da senha antiga. Front Web mockado até o contrato com o backend (ECA-1267). P-04 reduzida a resíduos de design e valores a definir.

**v1.1 (2026-10-05)** — Respostas do PO às pendências P-01, P-04, P-05, P-09 e ao gateway: (1) **Controlados:** com o envio digital de receita obrigatório, a retirada deixa de ser obrigatória — entrega **ou** retirada, **no App e na Web**; a documentação do App foi atualizada (`spec.md` 5.1, `PRD-envio-receita-app.md` v1.4, FAQ, glossário, `product.md`, `plan.md`, PRD de Recompra) e a FRW-073 passou a ser paridade, não divergência; (2) **Recuperar senha:** a Web segue **exatamente o fluxo do App** (CPF → código por e-mail → nova senha); o fluxo por link desenhado no Figma sai do PRD e vira **pendência de design** (ajustar o Figma); (3) **URL da loja:** formato definido como `loja.dominiodarede.com.br/cidade/nomedaloja`; (4) **Rodapé:** Apple Pay removido; (5) Pagar.me descartado — gateway é Braspag (Pix via Cielo operado pela Braspag), sem outras referências.

**v1.0 (2026-10-05)** — Primeira versão. Documenta as regras de negócio das telas **já desenhadas** no Figma Web (acesso, onboarding, home, menu de categorias, menu do perfil, busca e PDP), validadas contra o baseline do App (`specs/features/001-app-ecommerce/spec.md`), os PRDs do App (receita, favoritos, recompra, deeplink) e a ata "Primeiro Papo Web Ecommerce" (23/09/2026). Decisões do PO tomadas em sessão de dúvidas em 2026-10-05 estão marcadas como **[PO 05/10]**. O fluxo de compra (carrinho → pedido), que já existe em rascunho em `fluxo-compra-web-cenario-feliz.md`, **não** é detalhado aqui: aparece na seção 8 como "escopo mapeado, aguardando design".

---

## 1. Contexto

O Radar já vende pelo App (mobile). A diretoria definiu uma estratégia omnicanal (WhatsApp, Instagram, marketplace, App e Web) para que o lojista traga o consumidor para canais próprios, sem taxa de terceiros e sem a fricção de instalar o App (ata de 23/09/2026). A Web é um novo canal de compra do **mesmo produto** de e-commerce: comprou no App ou comprou na Web, é faturamento e transação e-commerce.

Diretrizes já alinhadas (ata de 23/09/2026 e sessão de 05/10):

- **Paridade:** tudo que existe no App existirá na Web, e tudo que for desenvolvido no App daqui para frente também sairá na Web, adaptando o que depende de hardware (ex.: câmera). **[PO 05/10]**
- **White label:** o Figma mostra só a Maxi Popular porque a Web é white label; haverá uma Web para cada uma das **12 bandeiras** (4 próprias, 7 administradas, 1 Megafarma). **[PO 05/10]**
- **Layout padronizado na V1:** mesmo layout para todas as bandeiras e lojas (ata); o que muda por bandeira é marca e tokens do design system.
- **Lançamento:** só em produção quando tiver 100% das funcionalidades hoje existentes no App. Corte de V1/MVP **não** é tema deste PRD. **[PO 05/10]**
- Stack (ata): Next.js com SSR em Home, PDP e vitrines; áreas logadas client-side; novo BFF. Decisões de arquitetura ficam em `plan.md`, não aqui.

## 2. Objetivo

Oferecer na Web a mesma jornada de compra do App — escolher a loja, navegar pelo catálogo, buscar, ver o produto e gerenciar a conta — respeitando as regras de negócio já vigentes no App, e registrar com clareza **onde a Web é intencionalmente diferente**.

**Impacto na NSM (Volume de Transações por Loja Ativa):** a Web reduz a fricção de conversão para quem não tem o App instalado (links do balconista por WhatsApp, anúncios, busca orgânica), aumentando as transações por Loja Ativa. Todo pedido Web conta como e-commerce, com dado separável por canal (seção 9).

## 3. Escopo

### 3.1 Dentro do escopo deste PRD (telas desenhadas no Figma)

| Área | Telas (nós Figma) |
|---|---|
| Estrutura global | Header, faixa superior, menu de categorias, rodapé (todas as telas) |
| Onboarding / loja | `onboarding - 1/2/3` (`5072:1353`, `5072:2614`, `5117:6582`) |
| Acesso | `login` (`5072:3956`), `sign up` (`5072:5353`), `termos` (`5114:5242`), `recuperar senha` (`5072:6725`, `5072:7997`) |
| Home | `desktop - maxi` (`5043:159`), `desktop - usuário logado` (`5074:16293`), versões tablet e mobile |
| Menus | `desktop - menu categorias` (`5074:20365`), `desktop - menu lateral` / perfil (`5077:7472`) |
| Conta | `mobile - dados pessoais`, `cartões`, `endereço`, `adicionar cartão`, `adicionar endereço`, `favoritos` (`5077:6070`, `5077:6244`, `5077:7031`, …) |
| Busca | `desktop - maxi` resultado (`5074:13417`), `sem desktop - maxi` (`5074:15058`), tablet e mobile |
| PDP | `página de produto` (`5040:2429`), tablet e mobile |

### 3.2 Fora do escopo deste PRD (mapeado na seção 8, aguardando design)

Carrinho, checkout (entrega, retirada, pagamento, cartões, Pix, CVV), pedidos e acompanhamento, recompra, favoritos (tela e ação de favoritar), filtros/ordenação e autocomplete de busca com produtos, envio de receita, PBM, notificações. As telas da página "Checkout" do Figma são mobile e com aparência do App; são tratadas como **referência**, não como design Web.

### 3.3 Fora do escopo do produto Web

O mesmo do App: gestão de estoque e preços, regras de desconto, relatórios, edição de pedidos OMS e comissão são do Portal (`context/product.md`).

## 4. Personas

Mesmas do App: **Consumidor Fidelizado**, **Consumidor PBM** e **Consumidor Eventual**. O **Consumidor Eventual** é a persona dominante da Web (chega por link, anúncio ou busca). O **Balconista** não é ator na Web; ele é quem **origina** o acesso ao enviar o link da loja ao cliente (ver 6.2), e o ator continua sendo o Consumidor.

## 5. Princípios transversais

- **P1 — Uma loja por vez.** O consumidor está sempre vinculado a uma farmácia; preço, estoque e regras são da loja ativa (Portal).
- **P2 — Navegação pública, ação protegida.** Home, busca, PDP e carrinho são públicos. Login é exigido para: ativar oferta, favoritar e avançar para pagamento (ver 6.3.5).
- **P3 — Paridade por padrão.** Onde este PRD não diz o contrário, vale a regra do App citada na matriz (seção 7).
- **P4 — Whitelabel.** Nenhuma regra, copy ou ativo pode estar fixo na Maxi Popular; marca, cores e conteúdo de divulgação vêm da bandeira/loja.
- **P5 — Responsivo.** Três breakpoints desenhados: desktop 1440, tablet 768, mobile 375.

---

## 6. Requisitos funcionais

> **Legenda de origem:** *(Figma)* = comportamento desenhado · *(App FR-###)* = regra do baseline do App · *(PO 05/10)* = decisão do PO · *(Ata)* = ata de 23/09. **⚠️** = depende de pendência da seção 11.

### 6.1 Estrutura global (header, faixa superior, rodapé)

- **FRW-001** O header DEVE exibir, da esquerda para a direita: logo da bandeira, campo de busca ("O que você procura?" + botão "Buscar"), acesso à conta, "Favoritos" e "Carrinho" com o valor total. *(Figma)*
- **FRW-002** Deslogado, o acesso à conta DEVE exibir "Entrar ou cadastrar" e abrir o drawer de login. Logado, DEVE exibir "Olá, {primeiro nome}" e abrir o menu do perfil (6.6). *(Figma)*
- **FRW-003** A faixa superior DEVE exibir à esquerda o endereço de entrega ("Entregar em {rua, número}") com o link "Alterar", que reabre o fluxo de onboarding (6.2). *(Figma; App FR-017/FR-019)*
- **FRW-004** O centro e a direita da faixa superior ("Frete grátis a partir de…", "Baixe o app…") são **espaços de divulgação/informação**. Os textos do Figma são **placeholder**; nenhuma regra de negócio deve ser implementada a partir deles. *(PO 05/10)* ⚠️ P-12
- **FRW-005** A navegação principal DEVE ter "Todas as categorias" (abre o menu lateral, 6.5), "Mais vendidos" e os departamentos, idênticos aos do catálogo e do App, na mesma ordem. *(PO 05/10; App FR-068)* ⚠️ P-10
- **FRW-006** Em busca e PDP, DEVE existir breadcrumb ("Página inicial > Busca > termo" e "Página inicial > departamento > produto"). *(Figma)*
- **FRW-007** O rodapé DEVE ter: Sobre (Quem somos, Nossas lojas, Seja um associado, Blog), Segurança (Portal do titular, Termos de uso, Política de privacidade), Formas de pagamento (ícones), Atendimento (central telefônica) e Redes sociais. *(Figma)* ⚠️ P-11
- **FRW-008** Os ícones de formas de pagamento no rodapé DEVEM seguir o Figma, **exceto o Apple Pay, que deve ser removido do design** (erro do Figma). *(PO 05/10)* ⚠️ P-09
- **FRW-009** "Nossas lojas" lista as lojas da Rede por proximidade, como o submenu "Nossas Farmácias" do App. *(App FAQ, pontos a discutir)* ⚠️ P-11
- **FRW-010** O bloco "Ainda mais vantagens no app" (QR Code + selos App Store/Google Play) e o banner promocional da home são **conteúdo de divulgação placeholder**. *(PO 05/10)*

### 6.2 Seleção de loja e onboarding

**Regra de resolução da loja (ordem de prioridade)** *(PO 05/10)*:

1. Se a URL contém uma **loja especificada**, o consumidor é direcionado para **essa** loja. É o caso do link enviado pelo balconista/lojista. **Formato da URL:** `loja.dominiodarede.com.br/cidade/nomedaloja` (um subdomínio `loja.` por bandeira/rede). *(PO 05/10)*
2. Senão, se há **loja atual do consumidor salva em cookie**, usa-se essa loja.
3. Senão, exibe-se o **onboarding** para descobrir a loja pelo endereço.

- **FRW-011** A resolução da loja DEVE seguir a ordem acima em todo acesso (home, busca, PDP, qualquer URL pública). *(PO 05/10)* ⚠️ P-05, P-06
- **FRW-012** O onboarding Web DEVE aceitar **somente endereço digitado** (sem GPS e sem mapa com PIN). *(PO 05/10)* — diverge de App FR-011/FR-014/FR-070.
- **FRW-013** O onboarding é um drawer lateral: título "Onde você quer receber seu pedido?", campo "Endereço" ("Rua e número"), botão "Continuar" e link "Já tem uma conta? Entrar". *(Figma)*
- **FRW-014** Ao digitar, o sistema DEVE sugerir endereços (autocomplete Google Maps) e exigir que o usuário **selecione um da lista** para continuar. O Figma exibe 4 sugestões; a regra do App é **até 5**. *(Figma; App FR-011)*
- **FRW-015** Ao selecionar uma sugestão sem número, DEVE aparecer o campo "Qual o número?" sob a sugestão. **No onboarding Web só o número é pedido** (rua e bairro vêm da sugestão selecionada; sem complemento). O formulário completo (Rua, Bairro, Número e Complemento opcional) é o de "Adicionar endereço" (FRW-058). *(Figma; PO 07/10; App FR-015 adaptado)*
- **FRW-016** Com o endereço confirmado, o sistema DEVE rotear para a melhor loja, na ordem: (1) loja mais próxima com entrega (até 30 km); (2) loja mais próxima do módulo vendas; (3) loja mais próxima do módulo ofertas. Empate entre lojas que entregam: mais próxima → frete mais barato → menor tempo de entrega → aleatório. *(App FR-012, FR-071)*
- **FRW-017** Sem loja que atenda a região, DEVE haver a tela "Ainda não atendemos sua região" com as 5 lojas mais próximas do módulo vendas para retirada e o botão "Alterar endereço". *(App FR-013, FR-019)* ⚠️ P-08 (estado não desenhado)
- **FRW-018** Lojas sem conteúdo (catálogo vazio) DEVEM ser tratadas como atendimento indisponível na região. *(`context/product.md`, aprendizado Q2)*
- **FRW-019** O endereço do onboarding aparece na faixa superior, é salvo no usuário após o login e usado como endereço do carrinho; refazer o onboarding **substitui** o endereço anterior. *(App FR-017, FR-018)*
- **FRW-020** O link "Já tem uma conta? Entrar" abre o login (6.3.1). Após o login, o usuário logado usa seu endereço salvo e a loja correspondente. *(Figma)* ⚠️ P-06
- **FRW-021** Uma URL com loja especificada DEVE reproduzir a regra de troca de loja por link do App (o link carrega o id da farmácia junto ao destino). *(App Deeplink PRD §4)* ⚠️ P-05

### 6.3 Acesso: login, criar conta, termos e recuperar senha

#### 6.3.1 Login

- **FRW-022** O login é um drawer lateral "Entrar na conta" com campo de identificação, "Senha", botão "Entrar", botão "Criar conta" e "Problemas para entrar? Recupere sua senha". *(Figma)*
- **FRW-023** O campo de identificação DEVE aceitar **e-mail ou CPF**. O Figma mostra apenas "CPF" / "Digite seu CPF": o label e o placeholder DEVEM ser ajustados. *(PO 05/10; App FR-095)* ⚠️ P-03
- **FRW-024** Credenciais inválidas DEVEM exibir erro sem apagar o identificador digitado (comportamento do App: "Você errou ou seu usuário ou sua senha"). O estado não está desenhado. *(App; `fluxo-compra-web-cenario-feliz.md` §8)* ⚠️ P-08
- **FRW-025** Após login bem-sucedido, o usuário DEVE voltar à tela/ação de origem (ex.: continuar para pagamento, ativar oferta) com o carrinho preservado. *(Ata; App FR-045)*

#### 6.3.2 Criar conta

- **FRW-026** O drawer "Criar conta" ("Crie sua conta em poucos segundos") DEVE ter, todos obrigatórios: Nome completo, CPF, Data de nascimento (seletor de data), Telefone, E-mail, Senha, checkbox "Aceito os termos de uso" e link "Ler termos". *(Figma; App FR-096)*
- **FRW-027** O botão "Criar conta" inicia desabilitado e só habilita com todos os campos preenchidos **e** o aceite dos termos. *(App FR-096)*
- **FRW-028** Nome aceita apenas letras. A senha DEVE ter no mínimo 8 caracteres, 1 letra maiúscula e 1 caractere especial. *(App FR-097, FR-101)* — a Figma não exibe a regra de senha: DEVE ser exibida ao usuário. ⚠️ P-08
- **FRW-029** O CPF é a chave de login: DEVE ser único, validado e **nunca alterável** depois. *(PO 05/10)*
- **FRW-030** Todo cadastro feito pela Web DEVE ser registrado na base de clientes **PEC** da rede, como no App. *(App FR-103)*

#### 6.3.3 Termos de uso

- **FRW-031** "Ler termos" DEVE abrir o texto dos termos de uso em drawer (no App é um PDF). O texto do Figma é de exemplo; o conteúdo final é jurídico. *(Figma; App FR-098)* ⚠️ P-11

#### 6.3.4 Recuperar senha — **paridade total com o App** *(PO 05/10)*

A Web segue exatamente o fluxo do App: **CPF → código de confirmação enviado por e-mail → nova senha**. O fluxo foi alinhado no Jira (épico ECA-1263 "Componentização de telas Web"; tarefa ECA-1267 "[WEB] Fluxo de reset de senha", subtarefa ECA-1300) e **o Figma já foi atualizado** para esse fluxo em três telas: `5072:6725` (CPF), `5072:7997` ("Informe o código") e `5203:5837` ("Crie uma nova senha"). O front Web é desenvolvido **mockado** até os contratos com o backend serem estabelecidos (ECA-1267). A regra de negócio de back-end é a do reset do App, coberta pela automação de API ECA-1228 (cenários 1 a 16, detalhados em ECA-1230).

**Fluxo em 3 chamadas encadeadas** (backend do App, reutilizado): (1) solicitação do código a partir do CPF; (2) validação do código de confirmação enviado por e-mail; (3) gravação da nova senha, autorizada pela validação do código.

- **FRW-032** "Recupere sua senha" abre "Esqueceu sua senha?" com o campo **CPF** ("Informe seu cpf"), botão "Continuar" e o link "Lembrou sua senha? Fazer login". "Continuar" só habilita com CPF em formato válido; CPF em formato inválido ou não informado é rejeitado. *(Figma `5072:6725`; App FR-099; ECA-1228 cenários 3 e 4)*
- **FRW-033** Com CPF cadastrado, o sistema envia um **código de confirmação ao e-mail cadastrado** e abre "Informe o código": texto "Enviamos um código para {e-mail mascarado}" (ex.: `ro******@gmail.com`), seis campos de dígito, botão "Continuar" e contagem regressiva de **30 segundos** para liberar o reenvio ("Reenviar código"; o Figma mostra 22 s, valor a corrigir). O link/texto de reenvio DEVE ser **"Reenviar código"** (o Figma ainda diz "Reenviar link"). O código enviado tem **validade de 24 horas**. *(Figma `5072:7997`; App FR-100; ECA-1228 cenário 1; PO 07/10)*
- **FRW-034** Código **incorreto**, **expirado** (após 24 horas) ou **já utilizado** DEVE ser recusado, sem expor o código correto. Solicitações repetidas para o mesmo CPF DEVEM manter válido **apenas o último código gerado**. **Não há limite de reenvios** de código. *(ECA-1228 cenários 6, 7, 8 e 16; ECA-1305; ECA-1307; PO 07/10)* ⚠️ P-04
- **FRW-035** Com o código validado, abre "Crie uma nova senha": campos "Nova senha" e "Confirme a nova senha" e botão "Continuar". A senha DEVE ter no mínimo 8 caracteres, 1 letra maiúscula e 1 caractere especial; senha fora da política é rejeitada. A gravação exige o código/token de autorização válido. *(Figma `5203:5837`; App FR-100, FR-101; ECA-1228 cenários 9 a 13)* ⚠️ P-04
- **FRW-035A** Se o CPF não estiver cadastrado, a Web DEVE direcionar para a criação de conta. *(App FR-102; ECA-1228 cenário 2)* — estado ainda **não desenhado** no Figma ⚠️ P-04
- **FRW-035B** Após a troca, a autenticação por **CPF e por e-mail** DEVE funcionar com a **nova senha** e a **senha antiga** DEVE ser recusada. *(ECA-1307; ECA-1228 cenários 14 e 15)*
- **FRW-035C** A Web reutiliza o back-end de reset já existente do App; **não há endpoint novo** nem link por e-mail. O fluxo por link (e-mail → link → volta logado) foi **descartado**. *(PO 05/10; ECA-1267)*

#### 6.3.5 Estados logado × deslogado

| Ação | Deslogado | Logado |
|---|---|---|
| Navegar home, categorias, busca, PDP | Livre | Livre |
| Montar carrinho | **Permitido** *(PO 05/10)* | Permitido |
| Avançar para pagamento ("Ir para pagamento") | **Login obrigatório** *(PO 05/10; App FR-045)* | Segue |
| Ativar oferta | Login obrigatório *(Ata; App FR-104)* | Ativa no CPF |
| Favoritar | Login obrigatório *(App PRD Favoritos §6.2)* | Favorita |
| Ver conta, cartões, endereços, pedidos | Exige login | Permitido |

- **FRW-037** O carrinho de visitante DEVE ser preservado ao logar ou criar conta, e mesclado ao carrinho do usuário se já existir. Carrinho logado é compartilhado entre App e Web. ⚠️ P-02

### 6.4 Home

- **FRW-038** A home DEVE exibir, em ordem: banner principal, faixa de benefícios (4 itens), **Mais vendidos**, **Marcas em destaque**, **Ofertas exclusivas**, bloco "app", banner promocional e rodapé. *(PO 05/10 — ordem do Figma; difere de App FR-020)* ⚠️ P-01
- **FRW-039** A faixa de benefícios do Figma ("Entrega rápida em até 1 hora", "Retire grátis na loja", "Descontos de laboratórios com seu CPF", "Compre com receita pelo app ou site") é **placeholder** de divulgação. Nenhuma promessa (ex.: prazo de 1 hora) pode ser implementada sem regra da loja. *(PO 05/10)* ⚠️ P-12
- **FRW-040** O banner principal DEVE ser configurável por rede/loja no Portal e exibido na ordem definida lá. *(App FR-067)* ⚠️ P-12
- **FRW-041** **Mais vendidos:** até 50 produtos (carrossel curto + listagem completa via "Ver todos"), só com estoque; produto em oferta **não** aparece nesta vitrine. *(App FR-021, FR-069)* — o Figma mostra cards com tag de desconto e De/Por nesta vitrine (conteúdo ilustrativo). ⚠️ P-01
- **FRW-042** O carrossel exibe 5 cards no desktop (Figma); a regra do App é até 10 no carrossel, com "Ver mais" para a vitrine completa. A Web DEVE respeitar o limite de 10 (rolagem horizontal ou paginação do carrossel). *(App FR-069)*
- **FRW-043** **Marcas em destaque:** carrossel de logos de marcas (Figma: CIMED, Dove, NIVEA, Johnson & Johnson, La Roche-Posay, Sanofi). Criado para a Web e **será replicado no App depois**. *(PO 05/10)* ⚠️ P-13 (fonte de dados, clique, quem cadastra)
- **FRW-044** **Ofertas exclusivas:** carrossel de ofertas (até 10, "Ver todas"). Cada card tem o CTA "Ativar oferta" (verde); a compra só é liberada após a ativação; deslogado, o CTA leva ao login. *(Figma; App FR-022, FR-104, FR-108)*
- **FRW-045** Após ativar: some "Ativar oferta", libera a compra e exibe "Oferta ativada" e a vigência da oferta. *(App FR-108)* ⚠️ P-14 (vigência: regra em transição no App)
- **FRW-046** Cards de produto exibem: imagem, tag de desconto (quando houver oferta), nome, marca/fabricante, preço De/Por (quando houver) e botão "Adicionar". Produto sem estoque não aparece nas vitrines. *(Figma; App FR-069)*
- **FRW-047** O botão "Adicionar" adiciona o item ao carrinho **sem exigir login** (P2/6.3.5). *(PO 05/10)* ⚠️ P-02
- **FRW-048** Home logada e deslogada são a mesma home; muda o header (nome do usuário no lugar de "Entrar ou cadastrar") e o comportamento de "Ativar oferta". *(Figma)*

### 6.5 Menu de categorias

- **FRW-049** "Todas as categorias" abre um menu lateral com: Mais vendidos + todos os departamentos, cada um com seta indicando subnível. *(Figma)*
- **FRW-050** Departamentos e subcategorias DEVEM ser **exatamente os do catálogo e do App**. Os 15 itens do Figma (Infantil, Mamãe e bebê, Conveniência, Higiene pessoal, Farmacinha, Medicamentos, Vitaminas e suplementos, Nutrição e alimentos, Cuidados pessoais, Saúde sexual, Dermocosméticos, Cosméticos, Cuidados masculinos, Outros…) são ilustrativos. *(PO 05/10)* ⚠️ P-10
- **FRW-051** O menu lateral DEVE ter versões tablet e mobile (menu hambúrguer). *(Figma)*

### 6.6 Menu do perfil e conta

- **FRW-052** O menu do perfil (drawer) DEVE exibir "Boas-vindas, {nome}" e os itens **Dados pessoais**, **Meus cartões**, **Endereço de entrega** e **Sair da conta**. *(Figma)*
- **FRW-053** O menu DEVE incluir também **Favoritos**, **Meus pedidos** e **Recompra**, que terão paridade com o App mas **ainda não foram desenhados**. *(PO 05/10)* ⚠️ P-15
- **FRW-054** **Dados pessoais:** Nome completo, CPF, Data de nascimento, Telefone, E-mail e Senha, com botão "Salvar". O **CPF é somente leitura**. *(Figma; PO 05/10)* ⚠️ P-08 (alteração de e-mail/senha: regras não definidas)
- **FRW-055** **Meus cartões:** lista de cartões salvos (rótulo + 4 últimos dígitos), seleção do cartão padrão, ícone de exclusão e botão "Adicionar novo cartão". *(Figma; App FR-091)*
- **FRW-056** Adicionar cartão DEVE seguir App FR-058/059: bandeira por BIN (Visa, Mastercard, Elo, Amex), máscara a cada 4 dígitos, validade, titular em caixa alta, CPF validado, **CVV obrigatório também ao salvar o cartão** (como no App), tokenização no gateway (**Braspag**, no front, sem tráfego de número aberto no backend). Apelido opcional (22 caracteres). *(App FR-058, FR-059, FR-063, FR-092; Ata; PO 05/10 e 07/10)* ⚠️ P-16
- **FRW-057** Excluir cartão DEVE remover também o token no cofre do gateway. *(App FR-060, FR-094)*
- **FRW-058** **Endereço de entrega:** lista de endereços com seleção do atual, exclusão e "Adicionar novo endereço". Adicionar: busca de endereço (Google Maps) e depois **formulário completo** com Rua, Bairro, Número (obrigatórios) e Complemento (opcional), botão "Salvar endereço". *(Figma `5077:7401`; App FR-026 a FR-030; PO 07/10)* ⚠️ P-08
- **FRW-059** O sistema NÃO DEVE permitir excluir o único endereço cadastrado; o novo endereço adicionado passa a ser o selecionado. *(App FR-028, FR-030)* — o Figma mostra a lixeira em todos os itens.
- **FRW-060** Trocar o endereço selecionado DEVE reavaliar a loja (App FR-076) ⚠️ P-05.

### 6.7 Busca

- **FRW-061** A busca fica no header, com campo e botão "Buscar"; ao digitar, o campo exibe o ícone de limpar. Ao buscar, abre "Resultado de busca" com breadcrumb e grade de produtos (5 colunas no desktop). *(Figma)*
- **FRW-062** O resultado DEVE usar os mesmos cards da home (6.4, FRW-046). *(Figma)*
- **FRW-063** Sem resultado: ilustração, "Não encontramos resultados para “{termo}”" e "Tente buscar por outro termo ou nome do produto". O termo exibido DEVE ser o realmente buscado (o Figma mostra "hehehe" para a busca "Dorflex"). *(Figma)*
- **FRW-064** **Autocomplete com produtos e filtros/ordenação** (Fabricante; ordenação por mais vendidos, desconto e preço) **entram na Web**, mas não estão desenhados. Regras de origem: `Busca/US/filtros-e-ordenacao-resultado-busca.md` e `estudo-busca-miro.md`. *(PO 05/10)* ⚠️ P-15
- **FRW-065** O campo de busca só aparece em loja do módulo vendas. *(App FR-064)* ⚠️ P-17

### 6.8 Página de produto (PDP)

- **FRW-066** A PDP DEVE exibir: breadcrumb, galeria de imagens (principal + miniaturas com navegação), nome, marca, bloco de compra e seções expansíveis de informações. *(Figma)*
- **FRW-067** **Bloco de oferta:** exibe "Oferta {bandeira}", preço De/Por, percentual de desconto, parcelamento ("em até 6x … sem juros", só se a loja habilitou — App FR-033), seletor de quantidade e botão **"Comprar"**. O rótulo "Comprar com desconto" do Figma **deve ser "Comprar"**: aquele texto é reservado para o futuro PBM. *(Figma; PO 05/10)* ⚠️ P-14
- **FRW-068** **Retirar na farmácia** ("Grátis" sempre — App FR-046): mostra nome da loja, status "Aberta" + horário, distância e endereço. *(Figma; App FR-046, FR-084)*
- **FRW-069** **Receber no endereço:** mostra a previsão de entrega ("Receba em até 30min") e o valor do frete, considerando o raio e o horário do **delivery** da loja (distinto do horário da loja). Fora do raio: "Fora do alcance"/somente retirada. *(Figma; App FR-048, FR-066)* ⚠️ P-08
- **FRW-070** Disponibilidade de retirada/entrega NÃO DEVE usar o fuso do servidor; usa horário local do consumidor. *(App FR-049)*
- **FRW-071** **Na primeira entrega** a PDP exibe apenas a seção **"Detalhes do produto"** (descrição simples do produto), como acordeão. As demais seções do Figma (Benefícios, Modo de uso, Advertências, Armazenamento, Composição, Especificações) **não entram na primeira entrega**, pois o Catálogo ainda não tem esses campos; entrarão quando existirem. *(PO 07/10)*
- **FRW-072** Produto indisponível/sem estoque na loja ativa DEVE ter estado próprio (não desenhado). *(App FR-069)* ⚠️ P-08
- **FRW-073** **Medicamentos controlados:** o **envio de receita é obrigatório** e o cliente poderá comprar por **entrega ou retirada**, à escolha — regra **igual no App e na Web**. Na PDP, os blocos "Retirar na farmácia" e "Receber no endereço" são exibidos normalmente (a restrição de FR-004/005/009/044 do App deixou de valer: o envio de receita e a entrega de controlados estão em produção no App desde 29/10/2026). O envio na Web é por seleção de arquivo (equivalente à câmera/galeria do App), com as regras do PRD de Envio de Receita (JPG, PNG ou PDF, até 2 MB). *(PO 05/10; `spec.md` 5.1; `PRD-envio-receita-app.md` v1.4)* ⚠️ P-19
- **FRW-074** Controlados NÃO exibem De/Por nem comunicação promocional em nenhuma tela. *(App FR-007, FR-008)* (mantido até confirmação contrária)
- **FRW-075** O ícone de favoritar (coração) na PDP, com bottom sheet de login para deslogado, é paridade com o PRD de Favoritos do App, **não desenhado** na PDP Web. *(App PRD Favoritos §6)* ⚠️ P-15

---

## 7. Matriz de paridade Web × App

| Tema | Regra do App | Web (este PRD) | Situação |
|---|---|---|---|
| Login | E-mail ou CPF (FR-095) | E-mail ou CPF (FRW-023) | Paridade — Figma a ajustar |
| Recuperar senha | CPF + código por e-mail + nova senha (FR-099–102; ECA-1228) | Igual (FRW-032–035C); Figma e Jira já alinhados | Paridade — resíduos de design em P-04 |
| Criar conta | Todos os campos + termos; senha 8/1/1; PEC (FR-096–103) | Idem (FRW-026–030) | Paridade |
| Termos | PDF (FR-098) | Texto em drawer (FRW-031) | Adaptação |
| Onboarding | GPS + endereço + mapa PIN (FR-011, 014) | **Só endereço digitado** (FRW-012) | **Diferença intencional** |
| Roteamento de loja | 30 km → vendas → ofertas (FR-012) | Igual (FRW-016) | Paridade |
| Loja por URL | Deeplink com id da farmácia | `loja.dominiodarede.com.br/cidade/nomedaloja` > cookie > onboarding (FRW-011) | Novo na Web |
| Região sem cobertura | Tela + 5 lojas (FR-013) | Igual (FRW-017) | Paridade — a desenhar |
| Ordem da home | Ofertas destaque → Ofertas pra você → Mais vendidos (FR-020) | Mais vendidos → Marcas → Ofertas exclusivas (FRW-038) | **Diferença intencional** |
| Marcas em destaque | Não existe | Novo; será levado ao App (FRW-043) | Novo |
| Mais vendidos | Sem produto em oferta (FR-021) | Igual (FRW-041) | Paridade (Figma ilustrativo) |
| Departamentos | 7 itens em ordem fixa (FR-068) | Igual ao catálogo/App (FRW-050) | Paridade |
| Ativar oferta | Login + "Ativar" (FR-022, 104, 108) | Igual (FRW-044/045) | Paridade |
| Carrinho deslogado | Monta; login ao pagar (FR-045) | Igual (6.3.5) | Paridade |
| Cartões e endereços | FR-026–030, 057–060, 091–094 | Igual (FRW-055–059) | Paridade |
| Controlados | **Entrega ou retirada**, com envio digital de receita obrigatório — em produção (spec 5.1, PRD Receita v1.4; confirmado 29/10/2026) | Receita obrigatória + entrega ou retirada (FRW-073) | Paridade — pendências em P-19 |
| Rótulo de receita | "Exige receita" → "Receita obrigatória" (PRD Receita v1.3) | A definir | Pendência |
| Busca | Autocomplete/filtros planejados SQP5Q326 | Entram na Web (FRW-064) | Paridade futura |
| Gateway | Braspag; Pix via Cielo/Braspag | Igual (seção 11 P-16) | Paridade |

---

## 8. Escopo mapeado — aguardando design

Para cada item, o que já se sabe e a fonte. **Não há requisitos detalhados** até existir design Web.

| Item | O que se sabe | Fonte |
|---|---|---|
| Carrinho | Itens, quantidade, subtotal, limite de oferta (cards "Oferta"/"Preço normal"), estoque máximo, tag de frete grátis, carrinho vazio, visitante preservado ao logar. Desktop: drawer ou página — a decidir | App FR-031–042, 073–074; ata |
| Entrega/retirada | Endereço, trocar loja (até 15 lojas, 100 km), horários de disponibilidade, "Ir para pagamento" exige login | App FR-043–051, 075–085 |
| Pagamento | Na entrega (Pix, maquininha, dinheiro com troco) e no app (Pix e crédito com parcelamento); CVV; Pix com validade de 2h; tokenização no front | App FR-052–063, 086–094; ata |
| Pedidos | Em andamento / concluídos, stepper, detalhes do pedido | App FR-113–116, 024–025 |
| Recompra | Repetir pedido concluído ou cancelado; valida só estoque | PRD Refazer Pedido |
| Favoritos | Global por consumidor, lista com preço/estoque da loja ativa, login obrigatório | PRD Favoritar Produtos |
| Receita | Upload (arquivo no lugar de câmera): JPG, PNG ou PDF até 2 MB; ao menos 1 receita para liberar pagamento; visível ao Portal | PRD Envio de Receita v1.3 |
| PBM | Desconto por convênio (Interplayers), plug-and-play por loja. "Comprar com desconto" do Figma é reservado a isso | Spec PBM; PO 05/10 |
| Notificações | No App é push. Canal na Web (e-mail/outro) | App FR-024/025 — sem definição |
| Confirmar telefone (SMS) | Frame no Figma, página Checkout. **Sem regra no App** | Figma `5120:22423` — P-08 |

---

## 9. Analytics e indicadores *(PO 05/10)*

- **FRW-076** A Web DEVE alimentar os mesmos indicadores do App: NSM (Volume de Transações por Loja Ativa), conversão de vendas, conversão da busca, ticket médio e média de itens por carrinho. **Pedido Web = pedido e-commerce**, contabilizado igual ao App.
- **FRW-077** Todo evento e todo pedido DEVE ser identificável por **canal** (`app` ou `web`) para análise isolada, sem alterar a contabilização consolidada.
- **FRW-078** Os eventos da Web DEVEM ter paridade de nomes e propriedades com o App. Ferramenta de eventos e catálogo de eventos: a definir com o time de dados. ⚠️ P-18
- **FRW-079** Faturamento segue a regra vigente: só pedidos **Finished** contam; cancelados são métrica separada.

---

## 10. Critérios de aceite (amostra em Gherkin)

```gherkin
Cenário: URL com loja especificada tem prioridade sobre a loja salva
  Dado que o consumidor tem a loja "A" salva em cookie
  Quando ele acessa uma URL que contém o código da loja "B"
  Então a loja ativa passa a ser "B"
  E o onboarding não é exibido

Cenário: URL sem loja e sem cookie dispara onboarding
  Dado que o consumidor não tem loja salva
  Quando ele acessa a home sem código de loja na URL
  Então o drawer "Onde você quer receber seu pedido?" é exibido

Cenário: Onboarding exige selecionar sugestão
  Dado que o consumidor digitou "Rua Carlos Vasconcelos, 92"
  Quando nenhuma sugestão está selecionada
  Então o botão "Continuar" permanece desabilitado

Cenário: Login por e-mail ou CPF
  Dado que o consumidor está no drawer "Entrar na conta"
  Quando informa um e-mail válido (ou CPF) e a senha correta
  Então ele é autenticado e retorna à tela de origem com o carrinho preservado

Cenário: Recuperação de senha por CPF e código (igual ao App)
  Dado que o consumidor iniciou "Recupere sua senha" e informou um CPF cadastrado em formato válido
  Quando clica em "Continuar"
  Então recebe um código de confirmação no e-mail cadastrado
  E após informar o código define a nova senha

Cenário: Recuperação com CPF não cadastrado
  Dado que o consumidor informou um CPF que não existe na base
  Quando clica em "Continuar"
  Então é direcionado para a criação de conta

Cenário: Código de confirmação inválido
  Dado que o consumidor está na tela "Informe o código"
  Quando informa um código incorreto, expirado ou já utilizado
  Então o código é recusado
  E o sistema não revela qual é o código correto

Cenário: Apenas o último código é válido
  Dado que o consumidor solicitou o código mais de uma vez para o mesmo CPF
  Quando informa um código que não é o último gerado
  Então o código é recusado

Cenário: Nova senha fora da política
  Dado que o consumidor validou o código e está em "Crie uma nova senha"
  Quando informa uma senha com menos de 8 caracteres, sem maiúscula ou sem caractere especial
  Então a senha é rejeitada

Cenário: Efeito do reset na autenticação
  Dado que o consumidor concluiu a troca de senha
  Quando faz login por CPF ou por e-mail com a nova senha
  Então é autenticado
  E o login com a senha antiga é recusado

Cenário: Visitante monta carrinho e é solicitado a logar no pagamento
  Dado que o consumidor está deslogado e adicionou um produto ao carrinho
  Quando clica em "Ir para pagamento"
  Então é direcionado ao login
  E após logar o carrinho continua com os itens

Cenário: Ativar oferta exige login
  Dado que o consumidor está deslogado
  Quando clica em "Ativar oferta"
  Então o drawer de login é aberto
  E após o login a oferta é ativada no CPF

Cenário: CPF não é editável
  Dado que o consumidor logado abre "Dados pessoais"
  Então o campo CPF é exibido somente leitura

Cenário: Não excluir o único endereço
  Dado que o consumidor tem apenas um endereço cadastrado
  Quando tenta excluí-lo
  Então a exclusão não é permitida

Cenário: Busca sem resultado
  Dado que o consumidor buscou "xyzabc"
  Quando a busca não retorna produtos
  Então vê “Não encontramos resultados para “xyzabc””
```

---

## 11. Pendências e dependências

| ID | Pendência | Severidade | Dono sugerido |
|---|---|---|---|
| P-01 | **"Mais vendidos" × produtos em oferta.** O Figma mostra cards com desconto/De-Por em "Mais vendidos", o que contraria o FR-021 do App (produto em oferta não aparece nessa vitrine). Manter a regra do App ou mudar na Web? *(ainda sem resposta do PO; o item de controlados, antes parte desta pendência, foi resolvido e virou a P-19)* | Média | PO |
| P-02 | Carrinho de visitante: onde persiste (cookie/localStorage), validade, mescla com o carrinho logado e sincronização com o App (hoje o carrinho usa id de dispositivo; refatoração em andamento). | Alta | Backend (Galdino/Uelinton) |
| P-03 | Login por e-mail ou CPF exige ajuste de label/placeholder no Figma. | Baixa | UX (Rodrigo) |
| P-04 | **Recuperar senha — fluxo já alinhado (Figma atualizado e Jira ECA-1267/1300); restam ajustes de design e valores a definir:** (a) tela do código (`5072:7997`) ainda tem o texto "Não recebeu? **Reenviar link**" (resíduo do fluxo antigo; deve ser "Reenviar código"); (b) tela "Crie uma nova senha" (`5203:5837`) repete "Enviamos um código para…" e o contador "Reenviar código" (não fazem sentido após o código validado) e a dica diz só "mínimo de 8 caracteres" — faltam **1 maiúscula e 1 caractere especial** (FR-101); (c) não há tela para **CPF não cadastrado** (→ criação de conta), **código incorreto/expirado/já usado**, **limite de solicitações atingido** e **sucesso** (e se o usuário já volta logado ou vai ao login); (d) corrigir o contador de reenvio do Figma de 22 s para **30 s**. *(Valores definidos pelo PO em 07/10: código válido por 24 horas, sem limite de reenvios, reenvio liberado após 30 s — já em FRW-033/034.)* | Média | UX (Rodrigo) |
| P-05 | Loja via URL — formato definido: `loja.dominiodarede.com.br/cidade/nomedaloja`. **Ainda em aberto:** como é gerado o trecho `nomedaloja` e se é único dentro da cidade (lojas homônimas); se o "código da loja" citado na conversa também é aceito; loja inexistente/pausada/inativa na URL; loja da URL que não entrega no endereço salvo; carrinho com itens de outra loja ao trocar (regra FR-081). | Alta | PO + Backend |
| P-06 | Home atrás do drawer de onboarding quando ainda não há loja: que conteúdo aparece? E quando o usuário loga, prevalece a loja da URL ou a do endereço salvo? | Média | UX + PO |
| P-08 | Estados não desenhados: região não atendida, erro de login, regra de senha na tela, loja pausada/sem estoque, "Fora do alcance", erro do autocomplete, edição de e-mail/senha nos Dados pessoais, **confirmar telefone por SMS (frames `5120:22423` e `5120:22462` da página Checkout: código de 6 dígitos + "Reenviar em 29s"; sem regra definida no App — confirmar com o PO se existe no App hoje, por que existe e se vale para a Web)**. | Média | UX |
| P-09 | Rodapé: **Apple Pay removido** por decisão do PO (UX deve retirar do Figma). Segue o Figma para o restante, que ainda mostra **Hipercard** (e um ícone não identificado), não aceitos pelo App (FR-058: Visa, Mastercard, Elo, Amex). Confirmar se a Web passa a aceitar Hipercard ou se é só representação visual. | Baixa | PO + UX |
| P-10 | Taxonomia: os 15 itens do Figma não batem com os 7 departamentos do App; o menu deve ser alimentado pelo catálogo. Confirmar subníveis e ordem. | Média | PO + Catálogo |
| P-11 | Conteúdo institucional (Termos, Política, Portal do titular, Quem somos, Blog, Seja um associado, "Nossas lojas") é por bandeira? Quem mantém? | Média | PO + Marketing |
| P-12 | Espaços de divulgação (faixa superior, benefícios, banner): configurados por quem (Portal, por rede/loja) e com que regras? Hoje só placeholder. | Média | PO + Portal |
| P-13 | Marcas em destaque: fonte de dados, quem cadastra (Portal por rede/loja ou Catálogo), comportamento do clique (busca por marca?), regra para levar ao App. | Média | PO |
| P-14 | PDP com oferta: exige "Ativar" antes de "Comprar"? A regra de vigência/validade da ativação está em transição entre App e Portal (FAQ, 16/07). | Média | PO + Portal |
| P-15 | Telas ainda sem design e já com paridade confirmada: Favoritos (lista e coração), Meus pedidos, Recompra, filtros/ordenação, autocomplete, receita, PBM. | Alta | UX |
| P-16 | Gateway e cartões (os campos de PDP do Catálogo saíram da primeira entrega, ver FRW-071). Gateway: **Braspag** como gateway; **Pix via Cielo operado pela Braspag** *(PO 05/10)*. Tokenização no front exige controle de velocity (limite de tentativas de salvar cartão). | Alta | Catálogo + Backend + Pagamentos |
| P-17 | Busca só em lojas do módulo vendas (FR-064): na Web a loja resolvida por URL pode ser módulo ofertas; como fica o header? | Baixa | PO |
| P-18 | Ferramenta de eventos, catálogo de eventos e nomenclatura do atributo `canal`. | Média | Dados |
| **P-19** | **Controlados com entrega — pendências derivadas** (decisão do PO tomada; os pontos abaixo não foram decididos e valem para App e Web): (a) a copy do bottom sheet "Antes de continuar" diz que a receita original "poderá ficar retida na farmácia" e que o usuário deverá entregá-la à farmácia — falta redação e processo para a **entrega** (como o original é retido/recolhido no recebimento); (b) nova copy no lugar de "Retirada na loja mediante apresentação da receita" (FR-003/FR-005); (c) frete grátis e progress bar de frete para cestas com controlado (FR-010/FR-041); (d) validação regulatória/jurídica da entrega de controlados com receita digital (RDC 144). Registradas em `spec.md` 5.1 e no changelog v1.4 do PRD de Envio de Receita. | Alta | PO + jurídico/regulatório |

**Dependências externas:** Next.js + BFF novo (ata); design system com Storybook (Joceli); definição de domínio/URL (marketing; Daniel ficou de alinhar até a segunda-feira seguinte à ata — registrar o resultado aqui); CORS/rate limit por bandeira; pentest (Elitron); CDN (CloudFront/Web Vitals, LCP < 2,5 s).

---

## 12. Próximos passos

- [ ] Responder as pendências restantes (priorizar P-19, P-05 e P-02).
- [ ] UX (Rodrigo) ajustar Figma: login por e-mail/CPF (P-03), fechar os resíduos do fluxo de recuperar senha (P-04), remover Apple Pay do rodapé (P-09), estados não desenhados (P-08) e desenhar os fluxos de 6.8/seção 8.
- [ ] Depois de P-19/P-05/P-02 resolvidas, gerar histórias por área seguindo `prompts/gerar-historias.md` (épicos: Acesso, Loja e onboarding, Home e menus, Conta, Busca, PDP).
- [ ] Atualizar `fluxo-compra-web-cenario-feliz.md` com as decisões de guest cart (6.3.5) e da ata.

## 13. Referências

- `specs/features/001-app-ecommerce/spec.md` (baseline do App), `specs/FAQ-App-Radar-Ecommerce.md`
- `specs/features/001-app-ecommerce/Envio de receita/PRD-envio-receita-app.md`, `Favoritar produtos/`, `repetir pedido/`, `Deeplink/`, `Busca/`
- `specs/features/WebEcommerce/2026-09-23-primeiro-papo-web-ecommerce.md` e `fluxo-compra-web-cenario-feliz.md`
- `context/product.md`, `context/glossary.md`

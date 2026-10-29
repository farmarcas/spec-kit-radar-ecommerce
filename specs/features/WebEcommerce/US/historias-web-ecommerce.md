# Histórias de Usuário — Web Ecommerce (telas já desenhadas no Figma)

**Status:** **Enviado ao Jira em 07/10/2026** — 6 épicos ([ECA-1323](https://farmarcas.atlassian.net/browse/ECA-1323) a [ECA-1328](https://farmarcas.atlassian.net/browse/ECA-1328)) e 18 histórias ([ECA-1329](https://farmarcas.atlassian.net/browse/ECA-1329) a [ECA-1346](https://farmarcas.atlassian.net/browse/ECA-1346)), em Backlog, label `web-ecommerce`. As subtarefas sugeridas **não** foram criadas — ficam para o refinamento.
**Versão:** 1.1 (2026-10-07) — ajustes após validação do PO: formulário de endereço completo, CVV ao salvar cartão, Conta em painel lateral, PDP só com descrição simples, pós-cadastro logado
**PRD de origem:** [`../PRD-web-ecommerce.md`](../PRD-web-ecommerce.md) (v1.3)
**Figma:** [Web · E-commerce](https://www.figma.com/design/C0TL5AwDFoO6q77tbz6ipR/Web-%C2%B7-E-commerce) — página "Web Foundations + Core flows" (`58:143`)
**Regras de origem (Jira):** épicos [ECA-33](https://farmarcas.atlassian.net/browse/ECA-33) (Onboarding e Homepage) e [ECA-308](https://farmarcas.atlassian.net/browse/ECA-308) (Endereços de consumidor), com as histórias filhas ECA-35, 58, 59, 133, 274, 307, 311, 370, 373, 414, 519 e 524; e [ECA-1267](https://farmarcas.atlassian.net/browse/ECA-1267)/[ECA-1300](https://farmarcas.atlassian.net/browse/ECA-1300) (fluxo de reset de senha Web) com a automação [ECA-1228](https://farmarcas.atlassian.net/browse/ECA-1228).

---

## Como ler este documento

- **Escopo:** somente o que **tem tela no Figma Web**. Tudo o que não tem tela **não virou história**: está na seção "Pendências — aguardando design ou definição" (no fim) e, quando relevante, aparece dentro da história com a marca **⚠️ PENDÊNCIA**.
- **Regra de conflito:** quando o Jira (regras do App) e o Figma divergem, vale **a regra do Jira**; o que falta em tela vira pendência de design (decisão do PO, 07/10).
- **Personas:** Consumidor Fidelizado, Consumidor PBM e Consumidor Eventual (todas as histórias valem para as três). O Balconista só origina o acesso (envia o link da loja).
- **Subtarefas:** `[WEB]` = front-end Web (Next.js), `[BE]` = backend/BFF, `QA | Casos de teste`.
- **DoD:** o padrão do repositório diz "Testado em Android e iOS". Para o Web foi adaptado para **"Testado nos principais navegadores desktop e nos 3 breakpoints (desktop 1440, tablet 768, mobile 375)"** — confirmar essa adaptação.
- **NSM:** toda história tem impacto na **Volume de Transações por Loja Ativa**; o Web é mais um canal do mesmo e-commerce e os eventos devem ser identificáveis por canal (`web`), conforme PRD, seção 9 (ferramenta e nomes de eventos ainda a definir).
- **Whitelabel:** nenhuma regra, copy ou ativo pode ser fixo na Maxi Popular — são 12 bandeiras com o mesmo layout (PRD, princípio P4).
- **Fonte das regras:** quando uma regra vem de FR-### do `spec.md` do App, está citada ao final entre colchetes.

## Índice

| # | Jira | História | Épico (Jira) | SP | Prioridade |
|---|---|---|---|---|---|
| W01 | [ECA-1329](https://farmarcas.atlassian.net/browse/ECA-1329) | Login por e-mail ou CPF | Web — Acesso ([ECA-1323](https://farmarcas.atlassian.net/browse/ECA-1323)) | 5 | High |
| W02 | [ECA-1330](https://farmarcas.atlassian.net/browse/ECA-1330) | Criar conta e ler termos de uso | Web — Acesso (ECA-1323) | 5 | High |
| W03 | [ECA-1331](https://farmarcas.atlassian.net/browse/ECA-1331) | Recuperar senha por CPF e código | Web — Acesso (ECA-1323) | 5 | High |
| W04 | [ECA-1332](https://farmarcas.atlassian.net/browse/ECA-1332) | Onboarding por endereço digitado e roteamento de loja | Web — Loja e onboarding ([ECA-1324](https://farmarcas.atlassian.net/browse/ECA-1324)) | 8 | Highest |
| W05 | [ECA-1333](https://farmarcas.atlassian.net/browse/ECA-1333) | Endereço do consumidor no header e persistência | Web — Loja e onboarding (ECA-1324) | 3 | High |
| W06 | [ECA-1334](https://farmarcas.atlassian.net/browse/ECA-1334) | Header, faixa superior e rodapé | Web — Home e navegação ([ECA-1325](https://farmarcas.atlassian.net/browse/ECA-1325)) | 5 | High |
| W07 | [ECA-1335](https://farmarcas.atlassian.net/browse/ECA-1335) | Vitrines da home | Web — Home e navegação (ECA-1325) | 8 | High |
| W08 | [ECA-1336](https://farmarcas.atlassian.net/browse/ECA-1336) | Card de produto: adicionar ao carrinho e ativar oferta | Web — Home e navegação (ECA-1325) | 5 | High |
| W09 | [ECA-1337](https://farmarcas.atlassian.net/browse/ECA-1337) | Menu de categorias | Web — Home e navegação (ECA-1325) | 3 | Medium |
| W10 | [ECA-1338](https://farmarcas.atlassian.net/browse/ECA-1338) | Menu do perfil | Web — Conta ([ECA-1326](https://farmarcas.atlassian.net/browse/ECA-1326)) | 3 | Medium |
| W11 | [ECA-1339](https://farmarcas.atlassian.net/browse/ECA-1339) | Dados pessoais | Web — Conta (ECA-1326) | 3 | Medium |
| W12 | [ECA-1340](https://farmarcas.atlassian.net/browse/ECA-1340) | Meus cartões | Web — Conta (ECA-1326) | 8 | High |
| W13 | [ECA-1341](https://farmarcas.atlassian.net/browse/ECA-1341) | Endereços do consumidor | Web — Conta (ECA-1326) | 8 | High |
| W14 | [ECA-1342](https://farmarcas.atlassian.net/browse/ECA-1342) | Favoritos (lista) | Web — Conta (ECA-1326) | 5 | Medium |
| W15 | [ECA-1343](https://farmarcas.atlassian.net/browse/ECA-1343) | Resultado da busca | Web — Busca ([ECA-1327](https://farmarcas.atlassian.net/browse/ECA-1327)) | 3 | High |
| W16 | [ECA-1344](https://farmarcas.atlassian.net/browse/ECA-1344) | Busca sem resultado | Web — Busca (ECA-1327) | 1 | Medium |
| W17 | [ECA-1345](https://farmarcas.atlassian.net/browse/ECA-1345) | Página de produto: informações | Web — PDP ([ECA-1328](https://farmarcas.atlassian.net/browse/ECA-1328)) | 5 | High |
| W18 | [ECA-1346](https://farmarcas.atlassian.net/browse/ECA-1346) | Página de produto: bloco de compra | Web — PDP (ECA-1328) | 8 | Highest |

> **Nota:** os épicos criados são os deste documento. No Jira já existiam outros épicos de Web — [ECA-1312](https://farmarcas.atlassian.net/browse/ECA-1312) (Onboarding WebEcommerce), [ECA-1313](https://farmarcas.atlassian.net/browse/ECA-1313) (Montagem de cesta), [ECA-1314](https://farmarcas.atlassian.net/browse/ECA-1314) (Checkout), além de ECA-1221 (Design System Web), ECA-1225 (Arquitetura base Web) e ECA-1263 (Componentização de telas Web). Vale consolidar com o PO se algum deles deve ser fundido ou arquivado.

---

# Épico: Web — Acesso

## W01 · Login por e-mail ou CPF

**Épico:** Web — Acesso
**Tipo:** História | **Story Points:** 5 | **Prioridade:** High
**Figma:** `5072:3956` (login)

**User Story**
Como usuário consumidor que acessa o e-commerce web, quero entrar na minha conta com e-mail ou CPF e senha, para comprar e usar recursos que exigem identificação (ativar ofertas, favoritos, pagamento).

**Overview**
O login Web é um drawer lateral aberto a partir do header ("Entrar ou cadastrar"), do link "Já tem uma conta? Entrar" do onboarding e das ações que exigem login. Segue a regra do App (login por e-mail ou CPF). Sem login o consumidor navega e monta carrinho; o login é exigido para ativar oferta, favoritar e avançar para o pagamento.

**O que deve ser feito**
- Drawer "Entrar na conta" com texto de apoio, campo de identificação, campo "Senha", botão "Entrar", botão secundário "Criar conta", link "Problemas para entrar? Recupere sua senha" e botão de fechar.
- Autenticação por **e-mail ou CPF** + senha.
- Retorno do usuário à tela/ação de origem após o login, preservando o carrinho.
- Header passa a mostrar "Olá, {primeiro nome}".

**Regras de Negócio**
- O campo de identificação aceita e-mail ou CPF. O Figma mostra apenas "CPF" / "Digite seu CPF": label e placeholder devem refletir "e-mail ou CPF". [FR-095]
- Após login bem-sucedido, o usuário volta à tela ou ação que o levou ao login (ex.: ativar oferta, ir para pagamento) e o **carrinho de visitante é preservado** e mesclado ao carrinho da conta, se já existir. [FRW-025, FRW-037; FR-045]
- O endereço definido no onboarding é salvo como endereço do consumidor ao logar (ver W05). [ECA-307]
- "Criar conta" abre o cadastro (W02); "Recupere sua senha" abre a recuperação (W03); o fechar volta à tela anterior sem alterações.
- O login é o mesmo do App (mesma conta, mesmo CPF/e-mail e senha). O carrinho logado é compartilhado entre App e Web (depende da refatoração do carrinho multicanal).
- ⚠️ **PENDÊNCIA (design):** erro de credenciais inválidas e demais validações do formulário não estão desenhados (PD-04). Comportamento do App: manter o identificador digitado e exibir mensagem de erro.

**Critérios de Aceite**

```gherkin
Cenário: Entrar com e-mail
  Dado que estou deslogado e abri "Entrar ou cadastrar"
  Quando informo um e-mail cadastrado e a senha correta e clico em "Entrar"
  Então sou autenticado e o header exibe "Olá, {meu nome}"

Cenário: Entrar com CPF
  Dado que estou no drawer "Entrar na conta"
  Quando informo meu CPF e a senha correta e clico em "Entrar"
  Então sou autenticado

Cenário: Voltar à ação de origem
  Dado que cliquei em "Ativar oferta" estando deslogado
  Quando concluo o login
  Então volto à tela de origem e a oferta é ativada
  E meu carrinho continua com os itens que eu havia adicionado

Cenário: Acessar recuperação de senha e cadastro
  Dado que estou no drawer "Entrar na conta"
  Quando clico em "Recupere sua senha"
  Então abro o fluxo de recuperação de senha
  Quando clico em "Criar conta"
  Então abro o formulário de cadastro
```

**Impacto na NSM:** remove a fricção de entrada para quem já é cliente e preserva o carrinho no login, evitando abandono antes do pagamento.

**Subtarefas sugeridas**
- QA | Casos de teste: login por e-mail e por CPF, senha incorreta, retorno à ação de origem, carrinho preservado, fechar o drawer, 3 breakpoints.
- [BE] Garantir login por e-mail ou CPF no BFF Web (`/api/web`) reutilizando a autenticação do App; mescla do carrinho de visitante ao carrinho da conta.
- [WEB] Drawer de login com retorno à origem e atualização do header.

**Definição de Pronto (DoD)**
- [ ] Código revisado e aprovado
- [ ] Testes unitários escritos
- [ ] Testado nos principais navegadores desktop e nos 3 breakpoints
- [ ] Sem regressão nas funcionalidades existentes
- [ ] Documentação de API atualizada (se aplicável)

---

## W02 · Criar conta e ler termos de uso

**Épico:** Web — Acesso
**Tipo:** História | **Story Points:** 5 | **Prioridade:** High
**Figma:** `5072:5353` (sign up), `5114:5242` (termos)

**User Story**
Como usuário consumidor que acessa o e-commerce web, quero criar minha conta informando meus dados e aceitando os termos de uso, para poder comprar e ativar ofertas.

**Overview**
Cadastro em drawer lateral com as mesmas regras do cadastro do App. Todo cadastro feito pela Web é registrado na base de clientes (PEC) da rede.

**O que deve ser feito**
- Drawer "Criar conta" ("Crie sua conta em poucos segundos") com: Nome completo, CPF, Data de nascimento (seletor de data), Telefone, E-mail, Senha, checkbox "Aceito os termos de uso" e link "Ler termos".
- Botão "Criar conta" habilitado somente com tudo preenchido e termos aceitos.
- Drawer "Termos de uso" aberto por "Ler termos".

**Regras de Negócio**
- Todos os campos são obrigatórios; o botão "Criar conta" inicia desabilitado e só habilita com o preenchimento completo **e** o aceite dos termos. [FR-096]
- O campo nome aceita apenas letras (sem números). [FR-097]
- A senha deve ter no mínimo 8 caracteres, 1 letra maiúscula e 1 caractere especial. [FR-101]
- O CPF é a chave de login: deve ser válido, único e **não pode ser alterado depois**. [FRW-029; PO 05/10]
- Todo cadastro feito pela Web é registrado na base de clientes **PEC** da rede. [FR-103]
- "Ler termos" abre o texto dos termos de uso (no App é um PDF). O texto do Figma é de exemplo; o conteúdo final é jurídico e por bandeira. [FR-098]
- Após criar a conta com sucesso, o usuário é autenticado e volta à tela/ação de origem, com o carrinho preservado (mesmo comportamento do login — W01). [PO 07/10; paridade com ECA-35/133]
- ⚠️ **PENDÊNCIA (design):** a regra de senha não aparece na tela (PD-06); mensagens de erro (CPF já cadastrado, e-mail já cadastrado, campo inválido) não estão desenhadas (PD-04).
- ⚠️ **PENDÊNCIA (definição):** idade mínima de 18 anos — o texto "destinado apenas para maiores de 18 anos" só aparece no frame do checkout; confirmar se vale no cadastro Web e como a regra é validada (PD-20).
- ⚠️ **PENDÊNCIA (definição):** confirmação de telefone por SMS aparece em frames do checkout (`5120:22423`) e não existe no cadastro do App — **não** está nesta história (PD-20).

**Critérios de Aceite**

```gherkin
Cenário: Botão desabilitado até completar o cadastro
  Dado que abri o drawer "Criar conta"
  Quando deixo algum campo vazio ou não aceito os termos
  Então o botão "Criar conta" permanece desabilitado

Cenário: Criar conta com dados válidos
  Dado que preenchi todos os campos com dados válidos e aceitei os termos
  Quando clico em "Criar conta"
  Então minha conta é criada e fico autenticado
  E meu cadastro é registrado na base PEC da rede

Cenário: Nome só com letras
  Dado que estou preenchendo o campo "Nome completo"
  Quando digito números
  Então o campo não aceita os números

Cenário: Ler os termos
  Dado que estou no cadastro
  Quando clico em "Ler termos"
  Então visualizo o texto dos termos de uso em um drawer
```

**Impacto na NSM:** cadastro curto e sem etapas extras reduz a perda de conversão no momento em que o consumidor precisa se identificar para pagar.

**Subtarefas sugeridas**
- QA | Casos de teste: validação de cada campo, política de senha, CPF duplicado, botão desabilitado, termos, registro no PEC, 3 breakpoints.
- [BE] Reutilizar o cadastro do App no BFF Web, com registro no PEC; validação de CPF único.
- [WEB] Drawer de cadastro com validações e drawer de termos.

**Definição de Pronto (DoD)** — mesmo da W01.

---

## W03 · Recuperar senha por CPF e código

**Épico:** Web — Acesso
**Tipo:** História | **Story Points:** 5 | **Prioridade:** High
**Figma:** `5072:6725` (CPF), `5072:7997` (código), `5203:5837` (nova senha)
**Referências no Jira:** [ECA-1267](https://farmarcas.atlassian.net/browse/ECA-1267) / [ECA-1300](https://farmarcas.atlassian.net/browse/ECA-1300) (front mockado) e a automação de API [ECA-1228](https://farmarcas.atlassian.net/browse/ECA-1228).

**User Story**
Como usuário consumidor que acessa o e-commerce web, quero redefinir minha senha informando meu CPF e um código enviado ao meu e-mail, para voltar a acessar minha conta.

**Overview**
O fluxo da Web é **igual ao do App**: CPF → código de confirmação por e-mail → nova senha. Reutiliza o back-end existente. O front é desenvolvido mockado até o contrato com o backend (ECA-1267).

**O que deve ser feito**
- Tela "Esqueceu sua senha?" com CPF, "Continuar" e "Lembrou sua senha? Fazer login".
- Tela "Informe o código" (6 dígitos, e-mail mascarado, "Continuar", reenvio).
- Tela "Crie uma nova senha" (nova senha + confirmação, "Continuar").

**Regras de Negócio**
- "Continuar" só habilita com CPF em formato válido; CPF inválido ou vazio é rejeitado. [FR-099]
- Com CPF cadastrado, um código é enviado ao **e-mail cadastrado**; a tela mostra o e-mail mascarado (ex.: `ro******@gmail.com`). [FR-100]
- O código tem **validade de 24 horas**. Código incorreto, expirado ou já utilizado é recusado, **sem revelar o código correto**. [PO 07/10; ECA-1228]
- **Não há limite de reenvios**; o reenvio é liberado após **30 segundos** (contagem regressiva) e o texto é **"Reenviar código"**. Apenas o **último código gerado** é válido. [PO 07/10; ECA-1307]
- Nova senha: mínimo 8 caracteres, 1 maiúscula e 1 caractere especial; senha fora da política é rejeitada; as duas digitações devem coincidir. A gravação exige o código validado. [FR-101; ECA-1228]
- Se o CPF não estiver cadastrado, o usuário é direcionado para a criação de conta (W02). [FR-102]
- Após a troca, o login por **CPF e por e-mail** funciona com a nova senha e a **senha antiga é recusada**. [ECA-1307]
- ⚠️ **PENDÊNCIA (design — PD-07):** (a) a tela do código ainda diz "Reenviar link"; (b) a tela de nova senha repete "Enviamos um código…" e o contador de reenvio; (c) contador do Figma em 22 s (correto: 30 s); (d) dica de senha mostra só "8 caracteres"; (e) faltam telas de **CPF não cadastrado**, **código inválido/expirado** e **sucesso** (e se o usuário vai ao login ou já entra logado).

**Critérios de Aceite**

```gherkin
Cenário: Solicitar o código com CPF cadastrado
  Dado que abri "Recupere sua senha" e informei um CPF cadastrado e válido
  Quando clico em "Continuar"
  Então recebo um código no e-mail cadastrado
  E vejo "Informe o código" com meu e-mail mascarado

Cenário: Código inválido
  Dado que estou em "Informe o código"
  Quando informo um código incorreto, expirado ou já utilizado
  Então o código é recusado
  E não vejo qual é o código correto

Cenário: Reenviar o código
  Dado que estou em "Informe o código"
  Quando aguardo 30 segundos
  Então o "Reenviar código" é liberado
  E ao reenviar, só o último código passa a valer

Cenário: Definir a nova senha
  Dado que validei o código
  Quando informo uma nova senha com 8 ou mais caracteres, 1 maiúscula e 1 caractere especial, e a confirmo
  Então a senha é alterada
  E passo a entrar por CPF ou e-mail somente com a nova senha

Cenário: Nova senha fora da política
  Dado que estou em "Crie uma nova senha"
  Quando informo uma senha com menos de 8 caracteres, sem maiúscula ou sem caractere especial
  Então a senha é rejeitada

Cenário: CPF não cadastrado
  Dado que informei um CPF que não existe na base
  Quando clico em "Continuar"
  Então sou direcionado para criar uma conta
```

**Impacto na NSM:** recuperar o acesso sem suporte evita perda de clientes recorrentes e de pedidos no momento do login.

**Subtarefas sugeridas**
- QA | Casos de teste: ver os 16 cenários da automação ECA-1228; e2e do fluxo de 3 telas; validade de 24 h; reenvio em 30 s; efeitos na autenticação.
- [BE] Expor as 3 chamadas do reset (solicitar código, validar código, gravar senha) no BFF Web reutilizando o back-end do App — sem endpoint novo de link.
- [WEB] Três telas do drawer, com contador de 30 s e e-mail mascarado (front mockado até o contrato — ECA-1267).

**Definição de Pronto (DoD)** — mesmo da W01.

---

# Épico: Web — Loja e onboarding

## W04 · Onboarding por endereço digitado e roteamento de loja

**Épico:** Web — Loja e onboarding
**Tipo:** História | **Story Points:** 8 | **Prioridade:** Highest
**Figma:** `5072:1353`, `5072:2614`, `5117:6582` (onboarding 1, 2 e 3)
**Jira de origem:** ECA-35, ECA-133, ECA-274, ECA-524

**User Story**
Como usuário consumidor que acessa o e-commerce web, quero informar meu endereço para ser direcionado à farmácia que melhor me atende, para ver os produtos e preços dessa loja.

**Overview**
Como cada farmácia tem preços e estoques próprios, a home exige uma loja definida. A Web resolve a loja por **URL da loja → loja salva em cookie → onboarding por endereço**. O onboarding Web usa **somente endereço digitado** (sem GPS e sem mapa com PIN, diferente do App).

**O que deve ser feito**
- Resolução da loja a cada acesso (URL, cookie, onboarding).
- Drawer de onboarding: título "Onde você quer receber seu pedido?", texto de apoio, campo "Endereço" ("Rua e número"), botão "Continuar" e link "Já tem uma conta? Entrar".
- Sugestões de endereço (autocomplete) com seleção obrigatória.
- Campo "Qual o número?" sob a sugestão selecionada.
- Roteamento para a melhor loja e redirecionamento para a home dessa loja.

**Regras de Negócio**
- **Ordem de resolução da loja:** (1) se a URL contém uma loja, o consumidor vai para **essa** loja; (2) senão, usa-se a **loja atual do consumidor salva em cookie**; (3) senão, exibe-se o onboarding. [PO 05/10]
- **Formato da URL da loja:** `loja.dominiodarede.com.br/cidade/nomedaloja` (um subdomínio por bandeira). É o link que o lojista/balconista envia ao cliente. [PO 05/10]
- Onboarding somente por **endereço digitado**; sem localização do dispositivo. [PO 05/10]
- O sistema sugere até **5 endereços** (autocomplete do Google Maps) e o usuário **precisa selecionar um da lista** para continuar. [ECA-133]
- Ao selecionar uma sugestão sem número, aparece "Qual o número?"; no Web, o complemento do endereço **não** é pedido no onboarding (só o número). [PO 07/10; ECA-274 adaptado]
- **Roteamento (nesta ordem):** (1) loja mais próxima **com entrega no endereço**, até 30 km; (2) loja mais próxima no módulo vendas; (3) loja mais próxima ativa no módulo ofertas. A loja mais próxima que **não** entrega no endereço não pode ser escolhida se existir outra, mais distante, que entrega. [ECA-35, ECA-133, ECA-524; FR-012]
- Empate entre lojas que entregam: mais próxima → frete mais barato → menor tempo de entrega → escolha aleatória. [FR-071]
- Lojas sem conteúdo (sem catálogo) contam como atendimento indisponível na região. [`context/product.md`]
- Refazer o onboarding **substitui** o endereço anterior. [ECA-307; FR-018]
- "Já tem uma conta? Entrar" abre o login (W01). Após o login, o consumidor logado usa o endereço e a loja já salvos na conta. [PRD FRW-020]
- ⚠️ **PENDÊNCIA (design — PD-03):** **região não atendida** — tela "Ainda não atendemos sua região" com as **5 lojas mais próximas do módulo vendas** e o botão "Alterar endereço" que reinicia o onboarding (ECA-35, ECA-519, FR-013/FR-019). **Não há tela no Figma Web**: fica fora desta história até existir design.
- ⚠️ **PENDÊNCIA (definição — PD-19):** URL com loja inexistente, pausada ou que não entrega no endereço salvo; como é gerado e se é único o trecho `nomedaloja`; carrinho com itens de outra loja ao trocar de loja; que conteúdo aparece **atrás** do drawer quando ainda não há loja.
- ⚠️ **PENDÊNCIA (definição):** o critério do Jira (ECA-133) manda reabrir a tela de localização após o login; no Web, com endereço já salvo, o PRD assume que o usuário logado segue com a loja da conta. Confirmar.

**Critérios de Aceite**

```gherkin
Cenário: URL com loja tem prioridade
  Dado que tenho a loja "A" salva em cookie
  Quando abro uma URL de loja da loja "B"
  Então a loja ativa passa a ser a "B"
  E o onboarding não é exibido

Cenário: Sem loja na URL, usar a loja salva
  Dado que tenho uma loja salva em cookie
  Quando acesso a home sem loja na URL
  Então vejo a home da loja salva

Cenário: Sem loja na URL e sem loja salva
  Dado que não tenho loja salva
  Quando acesso a home sem loja na URL
  Então vejo o drawer "Onde você quer receber seu pedido?"

Cenário: Selecionar uma sugestão para continuar
  Dado que digitei um endereço e a lista de sugestões apareceu
  Quando não selecionei nenhuma sugestão
  Então o botão "Continuar" não avança

Cenário: Informar o número do endereço
  Dado que selecionei uma sugestão sem número
  Quando informo o número em "Qual o número?" e clico em "Continuar"
  Então sou direcionado para a home da melhor loja

Cenário: Preferir a loja que entrega
  Dado que a loja mais próxima do meu endereço não entrega nele
  E existe outra loja, mais distante, que entrega no meu endereço
  Quando concluo o onboarding
  Então sou direcionado para a loja mais distante que entrega

Cenário: Login a partir do onboarding
  Dado que estou no onboarding
  Quando clico em "Já tem uma conta? Entrar"
  Então abro o login
```

**Impacto na NSM:** levar o consumidor à loja certa (que entrega no endereço) com o mínimo de cliques é o que viabiliza o pedido; o link da loja traz clientes de canais externos direto ao e-commerce da farmácia.

**Subtarefas sugeridas**
- QA | Casos de teste: ordem URL/cookie/onboarding, autocomplete (até 5), seleção obrigatória, número, roteamento (entrega ≤30 km, vendas, ofertas), empate, loja mais próxima sem entrega, refazer onboarding, 3 breakpoints.
- [BE] Roteamento de loja por endereço e resolução de loja por URL (`/cidade/nomedaloja`) no BFF; endpoint de autocomplete (Google Maps).
- [WEB] Drawer de onboarding, resolução da loja (URL → cookie → onboarding), redirecionamento para a home.

**Definição de Pronto (DoD)** — mesmo da W01.

---

## W05 · Endereço do consumidor no header e persistência

**Épico:** Web — Loja e onboarding
**Tipo:** História | **Story Points:** 3 | **Prioridade:** High
**Figma:** faixa superior de todas as telas (ex.: `5043:159`)
**Jira de origem:** ECA-307

**User Story**
Como usuário consumidor que acessa o e-commerce web, quero ver o endereço em uso no topo da página e poder alterá-lo, para ter certeza de qual loja e de qual endereço estou comprando.

**Overview**
Unifica o endereço do consumidor em todos os contextos do Web: o endereço do onboarding aparece no topo, é salvo na conta ao logar e é o endereço do carrinho.

**O que deve ser feito**
- Exibir "Entregar em {rua, número}" com o link "Alterar" na faixa superior.
- "Alterar" reabre o onboarding (W04).
- Salvar o endereço do onboarding como endereço do consumidor ao logar.

**Regras de Negócio**
- O endereço do onboarding é apresentado no header da home. [ECA-307; FR-017]
- O endereço do onboarding é salvo como endereço do consumidor após o login. [ECA-307]
- O endereço do onboarding é usado como endereço do carrinho do cliente; a tela de entrega do checkout ainda **não** tem design Web (a regra fica registrada para quando houver). [ECA-307]
- Se o cliente já tinha endereço salvo e refaz o onboarding, o endereço anterior é **substituído** pelo do onboarding. [ECA-307; FR-018]
- Deslogado, o endereço é mantido na sessão/cookie até o login.
- ⚠️ **PENDÊNCIA (design — PD-13):** tempo de entrega ao lado do endereço ou "Fora do alcance" (FR-066) **não existe no Figma Web** e não está nesta história.

**Critérios de Aceite**

```gherkin
Cenário: Endereço no header
  Dado que concluí o onboarding com um endereço
  Quando acesso a home
  Então vejo "Entregar em {meu endereço}" na faixa superior

Cenário: Alterar o endereço
  Dado que estou na home
  Quando clico em "Alterar"
  Então o fluxo de onboarding é reaberto

Cenário: Endereço salvo na conta
  Dado que defini um endereço no onboarding estando deslogado
  Quando faço login
  Então o endereço do onboarding permanece como o meu endereço

Cenário: Substituir endereço anterior
  Dado que já tenho um endereço salvo
  Quando refaço o onboarding com outro endereço
  Então o endereço anterior é substituído pelo novo
```

**Impacto na NSM:** endereço único e visível evita pedido para o lugar errado e reduz retrabalho na hora de pagar.

**Subtarefas sugeridas**
- QA | Casos de teste: header deslogado/logado, "Alterar", persistência no login, substituição do endereço.
- [BE] Persistir o endereço do onboarding na conta no login; expor como endereço do carrinho.
- [WEB] Faixa superior com endereço e "Alterar"; guarda do endereço em cookie/sessão.

**Definição de Pronto (DoD)** — mesmo da W01.

---

# Épico: Web — Home e navegação

## W06 · Header, faixa superior e rodapé

**Épico:** Web — Home e navegação
**Tipo:** História | **Story Points:** 5 | **Prioridade:** High
**Figma:** `5043:159` (home deslogada), `5074:16293` (logada), `5068:2840` (header), `5068:965` (busca), `5074:13417` (breadcrumb)

**User Story**
Como usuário consumidor que acessa o e-commerce web, quero encontrar sempre no topo e no rodapé os atalhos de busca, conta, favoritos, carrinho e informações da loja, para navegar e comprar sem me perder.

**Overview**
Estrutura global presente em todas as telas, nos 3 breakpoints.

**O que deve ser feito**
- Faixa superior com endereço + "Alterar" (W05) e dois espaços de divulgação/informação.
- Header com logo da bandeira, campo de busca e botão "Buscar", acesso à conta, "Favoritos" e "Carrinho" com o valor total.
- Barra de navegação com "Todas as categorias" (W09), "Mais vendidos" e os departamentos.
- Breadcrumb nas telas de busca e produto.
- Rodapé: Sobre (Quem somos, Nossas lojas, Seja um associado, Blog), Segurança (Portal do titular, Termos de uso, Política de privacidade), Formas de pagamento, Atendimento e Redes sociais.
- Versões tablet e mobile (menu hambúrguer).

**Regras de Negócio**
- Deslogado, o acesso à conta mostra "Entrar ou cadastrar" e abre o login (W01); logado, mostra "Olá, {primeiro nome}" e abre o menu do perfil (W10). [Figma]
- "Favoritos" no header leva à lista de favoritos (W14); deslogado, abre o login. [Figma; PRD Favoritar §6.2]
- "Carrinho" exibe o **valor total** do carrinho e é atualizado quando um item é adicionado (W08). A tela do carrinho **não** tem design Web ainda. [PO 07/10]
- Os dois espaços de divulgação da faixa superior (hoje "Frete grátis a partir de R$ 150" e "Baixe o app e ganhe 10% na primeira compra") são **placeholder**: nenhuma regra de negócio deve ser implementada a partir desses textos. [PO 05/10]
- Os departamentos da barra de navegação são **exatamente os do catálogo e do App**, na mesma ordem. [PO 05/10; FR-068]
- Rodapé — ícones de formas de pagamento: seguem o Figma, **exceto o Apple Pay, que deve ser removido**. [PO 05/10]
- Todo o conteúdo institucional (links, textos) é por bandeira (whitelabel).
- A busca do header abre a busca (W15).
- Responsivo: desktop 1440, tablet 768 e mobile 375.
- ⚠️ **PENDÊNCIA (definição — PD-13):** destino dos links institucionais do rodapé; "Nossas lojas" (lista de lojas da Rede por proximidade, como "Nossas Farmácias" do App); se a busca fica visível só em lojas do módulo vendas (FR-064); Hipercard no rodapé (o App só aceita Visa, Mastercard, Elo e Amex).

**Critérios de Aceite**

```gherkin
Cenário: Header deslogado
  Dado que estou deslogado
  Quando visualizo o header
  Então vejo "Entrar ou cadastrar", "Favoritos" e "Carrinho" com o valor total

Cenário: Header logado
  Dado que estou logado
  Quando visualizo o header
  Então vejo "Olá, {meu primeiro nome}" no lugar de "Entrar ou cadastrar"

Cenário: Favoritos deslogado
  Dado que estou deslogado
  Quando clico em "Favoritos"
  Então abro o login

Cenário: Carrinho atualizado
  Dado que adicionei um produto ao carrinho
  Quando visualizo o header
  Então o valor do "Carrinho" reflete o total dos itens

Cenário: Rodapé sem Apple Pay
  Dado que estou em qualquer tela
  Quando visualizo "Formas de pagamento" no rodapé
  Então não vejo o ícone do Apple Pay
```

**Impacto na NSM:** busca, carrinho e conta sempre à mão encurtam o caminho até a compra.

**Subtarefas sugeridas**
- QA | Casos de teste: estados logado/deslogado, valor do carrinho, menu hambúrguer, rodapé, 3 breakpoints.
- [BE] Expor dados da bandeira (logo, links institucionais, formas de pagamento) para o layout whitelabel.
- [WEB] Header, faixa superior, navegação, breadcrumb e rodapé responsivos.

**Definição de Pronto (DoD)** — mesmo da W01.

---

## W07 · Vitrines da home

**Épico:** Web — Home e navegação
**Tipo:** História | **Story Points:** 8 | **Prioridade:** High
**Figma:** `5043:159` (home deslogada), `5074:16293` (home logada), tablet `5007:5697`, mobile `5008:5698`
**Jira de origem:** ECA-58, ECA-34, ECA-59

**User Story**
Como usuário consumidor que acessa o e-commerce web, quero ver produtos relevantes e ofertas na home da minha loja, para encontrar o que comprar rapidamente.

**Overview**
A home apresenta as vitrines de produtos da loja ativa. **A ordem da Web segue o Figma** (diferente do App).

**O que deve ser feito**
- Banner principal.
- Faixa de benefícios (4 itens).
- Vitrine **Mais vendidos**.
- Vitrine **Ofertas exclusivas**.
- Bloco "Ainda mais vantagens no app" (QR Code + selos das lojas de aplicativos) e banner promocional.

**Regras de Negócio**
- **Ordem na Web:** banner → benefícios → Mais vendidos → Ofertas exclusivas → bloco do app → banner promocional → rodapé. (A posição de "Marcas em destaque" entre as duas vitrines fica **aguardando definição**.) [PO 05/10; Figma]
- **Mais vendidos:** apresenta os **50** produtos mais vendidos da loja; **10** no carrossel com rolagem lateral e 50 na listagem completa ao clicar em "Ver todos". [ECA-58; FR-021, FR-069; PO 07/10]
- Só aparecem produtos **com estoque** na loja; produto sem estoque não é exibido nas vitrines. [ECA-58]
- Produto **em oferta não aparece** em "Mais vendidos". [ECA-58; FR-021]
- **Ofertas exclusivas:** carrossel de ofertas, até 10 produtos, com rolagem lateral. Cada card de oferta começa com o CTA **"Ativar oferta"** (ver W08). [ECA-59; FR-107]
- Os cards seguem o componente da W08 em todas as vitrines.
- O banner principal, a faixa de benefícios, o bloco do app e o banner promocional são **placeholder** de divulgação; o conteúdo vem de configuração por rede/loja (Portal), sem regra de negócio própria. Nada do texto do Figma ("Entrega rápida em até 1 hora", "Compre com receita pelo app ou site", campanha promocional) vira promessa. [PO 05/10]
- A home logada e a deslogada são a mesma; mudam o header e o comportamento de "Ativar oferta".
- ⚠️ **PENDÊNCIA (definição — PD-01):** **Marcas em destaque** (carrossel de logos no Figma) — as marcas serão definidas pelo PO; **fora desta história** até a definição (origem dos dados e comportamento do clique). Será replicado no App depois.
- ⚠️ **PENDÊNCIA (design — PD-02):** "Ver todos" / "Ver todas" **não têm tela de vitrine completa** no Figma Web.
- ⚠️ **PENDÊNCIA (definição — PD-15):** o Figma mostra produtos com desconto em "Mais vendidos", contrariando a regra do Jira (ECA-58). Esta história segue a regra do Jira; confirmar com o PO.
- ⚠️ **PENDÊNCIA (design — PD-16):** a vitrine **"Ofertas destaque"** (quando houver), prevista na ECA-58, não existe no Figma Web.

**Critérios de Aceite**

```gherkin
Cenário: Ordem das vitrines
  Dado que acessei a home de uma loja
  Quando rolo a página
  Então vejo, nesta ordem, "Mais vendidos" e "Ofertas exclusivas"

Cenário: Carrossel de Mais vendidos
  Dado que a loja tem mais de 10 produtos entre os mais vendidos
  Quando visualizo "Mais vendidos"
  Então o carrossel exibe 10 produtos com rolagem lateral

Cenário: Produto em oferta não aparece em Mais vendidos
  Dado que um produto está em oferta
  Quando visualizo "Mais vendidos"
  Então esse produto não aparece nessa vitrine

Cenário: Produto sem estoque
  Dado que um produto não tem estoque na loja
  Quando visualizo as vitrines
  Então esse produto não é exibido

Cenário: Ofertas exclusivas
  Dado que a loja tem ofertas ativas
  Quando visualizo "Ofertas exclusivas"
  Então cada card de oferta mostra o botão "Ativar oferta"
```

**Impacto na NSM:** a vitrine certa na primeira dobra aumenta cliques em produto e itens por carrinho, base do volume de transações da loja.

**Subtarefas sugeridas**
- QA | Casos de teste: ordem das vitrines, limite de 10/50, filtro por estoque, exclusão de produtos em oferta, carrossel, 3 breakpoints.
- [BE] Endpoints de vitrines (Mais vendidos e Ofertas) por loja, com filtro de estoque e exclusão de produtos em oferta.
- [WEB] Home com banner, benefícios, vitrines em carrossel, bloco do app e banner promocional (SSR).

**Definição de Pronto (DoD)** — mesmo da W01.

---

## W08 · Card de produto: adicionar ao carrinho e ativar oferta

**Épico:** Web — Home e navegação
**Tipo:** História | **Story Points:** 5 | **Prioridade:** High
**Figma:** cards em `5043:159`, `5074:13417`, `5077:12847`
**Jira de origem:** ECA-59, ECA-58

**User Story**
Como usuário consumidor que acessa o e-commerce web, quero ver as informações do produto no card e adicioná-lo ao carrinho (ou ativar a oferta), para comprar sem sair da lista.

**Overview**
O card de produto é o mesmo componente na home, nas vitrines, no resultado de busca e na lista de favoritos. Produto comum tem o botão "Adicionar"; produto em oferta começa com "Ativar oferta" e libera a compra após a ativação.

**O que deve ser feito**
- Componente de card: imagem, tag de desconto (quando houver), nome, marca/fabricante, preço "De/Por" (quando houver) e botão.
- Botão **"Adicionar"** (azul, com ícone de carrinho) para produto comum.
- Botão **"Ativar oferta"** (verde) para produto em oferta.
- Clique no card (fora do botão) leva à página do produto (W17).

**Regras de Negócio**
- **Adicionar:** adiciona o produto ao carrinho **sem exigir login**; o valor do "Carrinho" no header é atualizado. A tela do carrinho não tem design Web ainda. [PO 07/10; FR-045]
- **Ativar oferta:** exige login. Deslogado, o clique abre o login e, concluído o login, a oferta é ativada no CPF do cliente. [FR-104; Ata]
- Na home e nas ofertas, o estado inicial do card de oferta é "Ativar oferta"; **após ativar**, o app libera a opção de inserir o produto no carrinho. [ECA-59]
- A tag de desconto só aparece para produto com oferta criada no Portal. [FR-040]
- Preço "De/Por" só quando há oferta; o preço final em destaque. [Figma]
- Produto sem estoque não é exibido nas listas (ver W07, W15). [ECA-58]
- ⚠️ **PENDÊNCIA (design — PD-05):** o **estado depois de ativar** a oferta (some "Ativar oferta", libera o botão de compra, aparece "Oferta ativada" e a vigência da oferta — FR-108) **não está no Figma**; a regra está aqui para guiar o design. A regra de vigência/validade da ativação está em transição entre App e Portal.
- ⚠️ **PENDÊNCIA (design — PD-22):** mensagens de erro do "Adicionar" (ex.: "Quantidade máxima disponível atingida", limite de oferta) e cards de **medicamentos controlados** (tag de receita) **não estão desenhados**.

**Critérios de Aceite**

```gherkin
Cenário: Adicionar sem login
  Dado que estou deslogado e vejo um produto comum
  Quando clico em "Adicionar"
  Então o produto entra no meu carrinho
  E o valor do "Carrinho" no header é atualizado

Cenário: Ativar oferta deslogado
  Dado que estou deslogado e vejo um produto em oferta
  Quando clico em "Ativar oferta"
  Então abro o login
  E após logar a oferta é ativada no meu CPF

Cenário: Ativar oferta logado
  Dado que estou logado e vejo um produto em oferta
  Quando clico em "Ativar oferta"
  Então a oferta é ativada e posso adicionar o produto ao carrinho

Cenário: Abrir o produto
  Dado que vejo um card de produto
  Quando clico na imagem ou no nome
  Então abro a página do produto
```

**Impacto na NSM:** reduz cliques entre ver e carrinhar o produto, aumentando itens por carrinho e conversão de ofertas.

**Subtarefas sugeridas**
- QA | Casos de teste: adicionar logado/deslogado, ativar oferta com e sem login, retorno após login, atualização do valor do carrinho, tag de desconto, 3 breakpoints.
- [BE] Adicionar item ao carrinho (visitante e logado); ativar oferta no CPF.
- [WEB] Componente de card com os dois estados de botão e integração com o header.

**Definição de Pronto (DoD)** — mesmo da W01.

---

## W09 · Menu de categorias

**Épico:** Web — Home e navegação
**Tipo:** História | **Story Points:** 3 | **Prioridade:** Medium
**Figma:** `5077:7472`/`5074:20365` (desktop), `5074:21597` (tablet), `5074:19830` (mobile)

**User Story**
Como usuário consumidor que acessa o e-commerce web, quero abrir o menu com todas as categorias, para navegar pelo catálogo da loja.

**Overview**
"Todas as categorias" abre um menu lateral com os departamentos, igual ao catálogo e ao App.

**O que deve ser feito**
- Menu lateral aberto por "Todas as categorias" (e pelo hambúrguer em tablet/mobile).
- Lista: "Mais vendidos" + departamentos, cada um com seta de subnível.
- Botão de voltar/fechar.

**Regras de Negócio**
- Os departamentos e subcategorias são **exatamente os do catálogo e do App**, na mesma ordem. Os 15 itens do Figma são ilustrativos. [PO 05/10; FR-068]
- Medicamentos aparece como departamento; medicamentos controlados seguem as regras do App quando forem desenhados.
- O menu fecha ao escolher um item ou no botão de fechar.
- ⚠️ **PENDÊNCIA (design — PD-14):** o **destino do clique** (listagem do departamento) e as **telas de subníveis** não estão desenhadas.

**Critérios de Aceite**

```gherkin
Cenário: Abrir o menu
  Dado que estou em qualquer tela
  Quando clico em "Todas as categorias"
  Então vejo "Mais vendidos" e os departamentos do catálogo

Cenário: Fechar o menu
  Dado que o menu está aberto
  Quando clico em fechar
  Então o menu é fechado e permaneço na tela anterior
```

**Impacto na NSM:** navegação por categoria é caminho de descoberta de produtos além da busca.

**Subtarefas sugeridas**
- QA | Casos de teste: abrir/fechar, departamentos iguais ao catálogo, 3 breakpoints.
- [BE] Expor árvore de departamentos do catálogo por loja.
- [WEB] Menu lateral responsivo.

**Definição de Pronto (DoD)** — mesmo da W01.

---

# Épico: Web — Conta

> **Navegação das telas de Conta:** no Web, o menu do perfil e as telas de Conta (dados pessoais, cartões, endereços, favoritos) abrem em **painel lateral de 375 px**, igual ao mobile, em todos os breakpoints. Os frames de 375 px do Figma são o design de referência para desktop, tablet e mobile.

## W10 · Menu do perfil

**Épico:** Web — Conta
**Tipo:** História | **Story Points:** 3 | **Prioridade:** Medium
**Figma:** `5077:7472` (desktop), `5077:9007` (tablet), `5077:5516` (mobile)

**User Story**
Como usuário consumidor logado, quero abrir o menu do meu perfil, para acessar meus dados, cartões e endereços ou sair da conta.

**O que deve ser feito**
- Drawer aberto ao clicar em "Olá, {nome}" no header: "Boas-vindas, {nome completo}", itens **Dados pessoais**, **Meus cartões**, **Endereço de entrega** e botão **Sair da conta**.

**Regras de Negócio**
- Cada item abre a respectiva tela (W11, W12, W13).
- "Sair da conta" encerra a sessão e volta ao estado deslogado do header.
- O menu só existe para usuário logado; deslogado o acesso abre o login. [W01]
- ⚠️ **PENDÊNCIA (design — PD-14):** **Favoritos**, **Meus pedidos** e **Recompra** terão paridade com o App mas **não estão no menu desenhado** (Favoritos tem atalho no header e tela própria — W14); comportamento do carrinho ao sair da conta ainda não definido.

**Critérios de Aceite**

```gherkin
Cenário: Abrir o menu do perfil
  Dado que estou logado
  Quando clico em "Olá, {nome}" no header
  Então vejo "Boas-vindas, {nome}" e os itens "Dados pessoais", "Meus cartões", "Endereço de entrega" e "Sair da conta"

Cenário: Sair da conta
  Dado que o menu do perfil está aberto
  Quando clico em "Sair da conta"
  Então minha sessão é encerrada e o header volta a mostrar "Entrar ou cadastrar"
```

**Impacto na NSM:** acesso rápido a cartões e endereços reduz atrito no pagamento.

**Subtarefas sugeridas**
- QA | Casos de teste: itens do menu, navegação, logout, 3 breakpoints.
- [BE] Logout (invalidação de sessão).
- [WEB] Drawer do perfil.

**Definição de Pronto (DoD)** — mesmo da W01.

---

## W11 · Dados pessoais

**Épico:** Web — Conta
**Tipo:** História | **Story Points:** 3 | **Prioridade:** Medium
**Figma:** `5077:6070` (mobile)

**User Story**
Como usuário consumidor logado, quero ver e editar meus dados pessoais, para mantê-los atualizados.

**O que deve ser feito**
- Tela "Dados pessoais" com Nome completo, CPF, Data de nascimento, Telefone, E-mail e Senha, e botão "Salvar".

**Regras de Negócio**
- O **CPF é somente leitura**: é a chave de login e não pode ser alterado. [PO 05/10]
- As validações são as do cadastro: nome só com letras; senha com no mínimo 8 caracteres, 1 maiúscula e 1 caractere especial. [FR-097, FR-101]
- "Salvar" persiste os dados alterados na conta (mesma conta do App).
- ⚠️ **PENDÊNCIA (definição):** regras de alteração de **e-mail**, **telefone** e **senha** (exigem verificação? senha atual?) não estão definidas; mensagens de sucesso e erro não estão desenhadas (PD-04).

**Critérios de Aceite**

```gherkin
Cenário: CPF não editável
  Dado que estou em "Dados pessoais"
  Quando visualizo o campo CPF
  Então ele aparece somente leitura

Cenário: Salvar alterações
  Dado que alterei meu telefone com um valor válido
  Quando clico em "Salvar"
  Então o novo telefone fica salvo na minha conta

Cenário: Nome inválido
  Dado que estou editando "Nome completo"
  Quando digito números
  Então o campo não aceita os números
```

**Impacto na NSM:** dados corretos evitam falhas de contato e de pagamento no pedido.

**Subtarefas sugeridas**
- QA | Casos de teste: CPF somente leitura, validações, salvar, persistência.
- [BE] Atualização de dados do consumidor no BFF Web.
- [WEB] Tela de dados pessoais.

**Definição de Pronto (DoD)** — mesmo da W01.

---

## W12 · Meus cartões

**Épico:** Web — Conta
**Tipo:** História | **Story Points:** 8 | **Prioridade:** High
**Figma:** `5077:6244` (lista), `5077:6790` (vazio), `5077:6539` (adicionar cartão)

**User Story**
Como usuário consumidor logado, quero cadastrar, ver e excluir meus cartões, para pagar mais rápido nas próximas compras.

**Overview**
A carteira de cartões é a mesma do App (vinculada à conta). A tokenização é feita no front com a biblioteca da **Braspag**, sem trafegar número de cartão aberto no backend. Gateway: Braspag (cartão); Pix opera via Cielo pela Braspag.

**O que deve ser feito**
- Lista de cartões salvos (rótulo + 4 últimos dígitos), seleção do cartão padrão, ícone de exclusão e botão "Adicionar novo cartão".
- Estado vazio: "Nenhum cartão cadastrado".
- Formulário "Adicionar novo cartão" com cartão ilustrativo, Número, Data de validade, CVV, Nome do titular e CPF do titular.

**Regras de Negócio**
- Cartão salvo fica na carteira do consumidor, acessível pelo perfil e (futuramente) pelo pagamento. [FR-091]
- Adicionar cartão: dados refletem no cartão ilustrativo; bandeira identificada pelo BIN (**Visa, Mastercard, Elo, Amex**); número mascarado a cada 4 dígitos; mês 01–12 e ano ≥ vigente; **CVV obrigatório** (4 dígitos para Amex); titular em **caixa alta e só letras**; CPF com máscara e validação. [FR-058; FR-063; PO 07/10]
- "Adicionar cartão" **tokeniza** o cartão no gateway e o salva na carteira; erros exibem "Verifique os dados do cartão" ou "CPF do titular inválido". [FR-059]
- Excluir cartão remove o cartão da carteira e o **token no cofre do gateway**, com mensagem de sucesso; excluir o último volta ao estado vazio. [FR-060, FR-094]
- A tokenização ocorre no front com a biblioteca do gateway; o backend só recebe o token e os 4 últimos dígitos. [Ata 23/09; PO]
- O **CVV é obrigatório ao salvar o cartão** e também na compra (mesmo comportamento do App). [PO 07/10; FR-063]
- ⚠️ **PENDÊNCIA (design e definição — PD-12):** (b) falta o campo **Apelido** (opcional, 22 caracteres — FR-092) e a origem do nome exibido na lista ("Nubank ****1234"); (c) validade como texto "12/32" vs. dropdown de ano + 12 anos (FR-093); (d) significado de "cartão padrão" selecionado; (e) mensagens de erro e sucesso não desenhadas; (f) **limite de tentativas** de salvar cartão para coibir teste de cartões (proposta do PO na ata, sem decisão entre antifraude e regras do gateway).

**Critérios de Aceite**

```gherkin
Cenário: Estado vazio
  Dado que não tenho cartões cadastrados
  Quando abro "Meus cartões"
  Então vejo "Nenhum cartão cadastrado" e o botão "Adicionar novo cartão"

Cenário: Adicionar cartão válido
  Dado que estou em "Adicionar novo cartão"
  Quando informo número, validade, titular e CPF válidos e clico em "Adicionar cartão"
  Então o cartão é salvo na minha carteira
  E o número completo não é enviado ao backend, somente o token

Cenário: Bandeira pelo número
  Dado que estou digitando o número do cartão
  Quando o início do número corresponde a Visa, Mastercard, Elo ou Amex
  Então a bandeira é identificada no cartão ilustrativo

Cenário: CPF do titular inválido
  Dado que informei um CPF inválido
  Quando clico em "Adicionar cartão"
  Então vejo "CPF do titular inválido"

Cenário: Excluir cartão
  Dado que tenho cartões salvos
  Quando clico no ícone de exclusão de um cartão
  Então o cartão some da lista e o token é removido do gateway
```

**Impacto na NSM:** cartão salvo reduz o tempo e o abandono no pagamento online, sustentando conversão e faturamento.

**Subtarefas sugeridas**
- QA | Casos de teste: bandeira por BIN, máscaras, validade, titular, CPF, tokenização, exclusão (inclusive do cofre), estado vazio, 3 breakpoints.
- [BE] Listar/salvar token/excluir cartão (e token no cofre) no BFF Web; sem receber PAN.
- [WEB] Telas de cartões e formulário com biblioteca de tokenização da Braspag.

**Definição de Pronto (DoD)** — mesmo da W01, mais: teste de segurança do fluxo de tokenização.

---

## W13 · Endereços do consumidor

**Épico:** Web — Conta
**Tipo:** História | **Story Points:** 8 | **Prioridade:** High
**Figma:** `5077:7031` (lista), `5077:6903` (vazio), `5077:7117`, `5077:7178` (adicionar), `5077:7401` (formulário)
**Jira de origem:** ECA-311, ECA-373, ECA-414 (ECA-370 — editar — **fora**)

**User Story**
Como usuário consumidor logado, quero ver, trocar, adicionar e excluir meus endereços de entrega, para receber meus pedidos no endereço certo.

**Overview**
Gestão de endereços da conta, com as regras do App (ECA-308). Vale a **regra do Jira**; o que falta no Figma Web é pendência de design.

**O que deve ser feito**
- Lista de endereços com seleção do endereço atual, exclusão e botão "Adicionar novo endereço".
- Estado vazio: "Nenhum endereço cadastrado".
- Adicionar endereço (busca de endereço → formulário com Rua, Bairro, Número e Complemento → "Salvar endereço").
- Excluir endereço.

**Regras de Negócio**
- A tela tem duas seções: **"Endereço atual"** (endereço selecionado, com a tag **"Selecionado"**) e **"Outros endereços"** (todos os demais). O endereço atual **não** se repete em "Outros". [ECA-311; FR-026]
- Com apenas um endereço salvo, a seção "Outros endereços" **não aparece**. Sem nenhum endereço, aparece o placeholder e o botão de adicionar. Endereços legados passam a "Outros". [ECA-311; FR-027]
- É possível trocar o endereço atual por outro salvo. [ECA-311]
- **Adicionar:** reutiliza a tela de busca de endereço do onboarding (Google Maps); o novo endereço **passa a ser o selecionado**. [ECA-373; FR-028]
- **Excluir:** remove o endereço salvo; o usuário **não pode excluir** quando há apenas **um** endereço cadastrado. [ECA-414; FR-030]
- **Excluir o endereço selecionado havendo outros:** passa a ser selecionado o endereço de **cadastro mais recente**. [PO 07/10]
- **Editar endereço (ECA-370): fora do escopo** — não há tela de edição no Figma Web. ⚠️ **PENDÊNCIA (design — PD-10).**
- ⚠️ **PENDÊNCIA (design — PD-09):** o Figma mostra uma lista com seleção e lixeira, **sem** as seções "Endereço atual"/"Outros endereços" e **sem** a tag "Selecionado"; a regra do Jira vale e o design precisa ser ajustado.
- **Formulário de endereço (Figma `5077:7401`):** após buscar e selecionar o endereço, o formulário traz **Rua, Bairro, Número e Complemento** (pré-preenchidos com os dados do endereço selecionado) e o botão "Salvar endereço". **Rua, Bairro e Número são obrigatórios; Complemento é opcional**; Número e Complemento são campos de texto. [Figma; PO 07/10; ECA-274]
- A regra de "só número" vale **apenas para o onboarding** (W04); em "Adicionar endereço" vale o formulário completo do Figma. [PO 07/10]
- Ajuste de Figma (sem impacto de regra): o título do frame do formulário aparece como "Adicionar novo cartão"; deve ser "Endereço de entrega".
- ⚠️ **PENDÊNCIA (definição):** ao trocar o endereço selecionado, a loja é reavaliada? (relacionada à P-05 do PRD; no App a troca de endereço na entrega pode trocar de loja — FR-076).

**Critérios de Aceite**

```gherkin
Cenário: Duas seções de endereços
  Dado que tenho dois ou mais endereços salvos
  Quando abro "Endereço de entrega"
  Então vejo "Endereço atual" com a tag "Selecionado"
  E vejo "Outros endereços" sem repetir o endereço atual

Cenário: Apenas um endereço
  Dado que tenho apenas um endereço salvo
  Quando abro "Endereço de entrega"
  Então não vejo a seção "Outros endereços"

Cenário: Sem endereços
  Dado que não tenho endereços salvos
  Quando abro "Endereço de entrega"
  Então vejo "Nenhum endereço cadastrado" e o botão "Adicionar novo endereço"

Cenário: Adicionar endereço
  Dado que cliquei em "Adicionar novo endereço"
  Quando busco e seleciono um endereço e preencho Rua, Bairro e Número no formulário
  E clico em "Salvar endereço"
  Então o endereço é salvo e passa a ser o meu endereço selecionado

Cenário: Complemento opcional
  Dado que estou no formulário de endereço
  Quando deixo o Complemento vazio e preencho Rua, Bairro e Número
  Então consigo salvar o endereço

Cenário: Campos obrigatórios do endereço
  Dado que estou no formulário de endereço
  Quando deixo Rua, Bairro ou Número vazio
  Então não consigo salvar o endereço

Cenário: Trocar o endereço atual
  Dado que tenho outros endereços salvos
  Quando seleciono um deles
  Então ele passa a ser o endereço atual

Cenário: Não excluir o único endereço
  Dado que tenho apenas um endereço salvo
  Quando tento excluí-lo
  Então a exclusão não é concluída

Cenário: Excluir o endereço selecionado
  Dado que tenho mais de um endereço e o selecionado é o endereço A
  Quando excluo o endereço A
  Então o endereço de cadastro mais recente entre os restantes passa a ser o selecionado
```

**Impacto na NSM:** endereço correto e selecionável evita pedidos em endereço errado e acelera o checkout de quem recompra.

**Subtarefas sugeridas**
- QA | Casos de teste: seções, tag "Selecionado", um/vários/nenhum endereço, adicionar, trocar, excluir (único, selecionado), endereços legados, 3 breakpoints.
- [BE] CRUD de endereços do consumidor no BFF Web (adicionar, listar, excluir, selecionar); regra do mais recente na exclusão.
- [WEB] Telas de lista, estado vazio e adição; seções e tag "Selecionado".

**Definição de Pronto (DoD)** — mesmo da W01.

---

## W14 · Favoritos (lista)

**Épico:** Web — Conta
**Tipo:** História | **Story Points:** 5 | **Prioridade:** Medium
**Figma:** `5077:12847` (mobile / favoritos); atalho "Favoritos" no header
**Regras de origem:** `Favoritar produtos/PRD-favoritar-produtos-app.md` (v1.1)

**User Story**
Como usuário consumidor logado, quero ver a lista dos produtos que favoritei, para comprá-los de novo com rapidez.

**Overview**
A lista de favoritos é **global por consumidor** (por produto/EAN) e compartilhada com o App. Preço e estoque são sempre os da **loja ativa**. Esta história cobre **somente a lista** (a tela existe no Figma); a ação de favoritar não tem tela Web.

**O que deve ser feito**
- Tela "Favoritos" em grade de cards (imagem, tag de desconto, nome, marca, preço De/Por e botão "Adicionar").
- Acesso pelo "Favoritos" do header (logado).

**Regras de Negócio**
- Favoritos pertencem à conta (não ao dispositivo): persistem e valem em qualquer dispositivo e no App. [PRD Favoritar §6.1, §6.9]
- Todo card mostra preço e disponibilidade da **loja atual**; ao trocar de loja, a lista continua com os mesmos produtos e os dados da nova loja. [PRD Favoritar §6.1]
- Ordenação padrão: **mais recente favoritado primeiro**. [PRD Favoritar §6.5]
- Clique no card (fora do botão) leva à página do produto (W17). O botão "Adicionar" segue a W08.
- Exige login: deslogado, "Favoritos" no header abre o login. [PRD Favoritar §6.2]
- Produto favoritado sem estoque ou removido do catálogo da loja **permanece** na lista com tag de indisponibilidade e sem botão de adicionar. [PRD Favoritar §6.7]
- Sem limite de quantidade de favoritos. [PRD Favoritar §6.8]
- ⚠️ **PENDÊNCIA (design — PD-17):** **não estão no Figma Web**: o ícone de coração (favoritar/desfavoritar) na PDP e na lista, os toasts ("Adicionado aos favoritos" / "Removido dos favoritos"), o **estado vazio**, e a tag de produto indisponível. Sem o coração, no Web só é possível **ver** favoritos criados no App até esse design existir.

**Critérios de Aceite**

```gherkin
Cenário: Ver meus favoritos
  Dado que estou logado e tenho produtos favoritados
  Quando clico em "Favoritos" no header
  Então vejo os produtos favoritados, do mais recente para o mais antigo

Cenário: Preço da loja atual
  Dado que troquei de loja
  Quando abro "Favoritos"
  Então vejo os mesmos produtos com preço e estoque da loja atual

Cenário: Favoritos deslogado
  Dado que estou deslogado
  Quando clico em "Favoritos"
  Então abro o login

Cenário: Produto indisponível
  Dado que um favorito está sem estoque na loja atual
  Quando abro "Favoritos"
  Então o produto continua na lista com a tag de indisponibilidade e sem o botão "Adicionar"
```

**Impacto na NSM:** atalho para itens recorrentes gera novas transações sem depender de busca.

**Subtarefas sugeridas**
- QA | Casos de teste: ordenação, preço da loja atual, troca de loja, indisponível, login, sincronia com o App, 3 breakpoints.
- [BE] Listar favoritos do consumidor com preço/estoque da loja ativa (reutilizar o serviço do App).
- [WEB] Tela de lista de favoritos com cards.

**Definição de Pronto (DoD)** — mesmo da W01.

---

# Épico: Web — Busca

## W15 · Resultado da busca

**Épico:** Web — Busca
**Tipo:** História | **Story Points:** 3 | **Prioridade:** High
**Figma:** `5074:13417` (desktop), `5074:11814` (tablet), `5074:11240` (mobile), `5074:10855` (mobile "buscando")

**User Story**
Como usuário consumidor que acessa o e-commerce web, quero buscar um produto pelo nome e ver os resultados da minha loja, para encontrar e adicionar o que preciso ao carrinho.

**O que deve ser feito**
- Busca pelo campo do header (campo + botão "Buscar"; ícone de limpar quando há texto).
- Tela "Resultado de busca" com breadcrumb ("Página inicial > Busca > termo") e grade de produtos (5 colunas no desktop) usando o card da W08.

**Regras de Negócio**
- Os resultados são os produtos da **loja ativa**, com estoque. [FR-069]
- A grade usa o mesmo card de produto da W08 (Adicionar / Ativar oferta / abrir produto).
- Medicamentos controlados aparecem nos resultados; a exibição (tag de receita, sem De/Por e sem comunicação promocional) segue as regras de controlados e **não está desenhada** — ver PD-21.
- ⚠️ **PENDÊNCIA (design e definição — PD-23/PD-21):** **autocomplete com produtos**, **filtros (fabricante)** e **ordenação** entram na Web mas **não têm tela** (regras de origem: `Busca/US/filtros-e-ordenacao-resultado-busca.md`); paginação/rolagem infinita do resultado e a regra de que a busca só aparece em lojas do módulo vendas (FR-064) também não estão definidas.

**Critérios de Aceite**

```gherkin
Cenário: Buscar um produto
  Dado que estou em qualquer tela
  Quando digito "Dorflex" no campo de busca e clico em "Buscar"
  Então vejo "Resultado de busca" com os produtos da minha loja
  E o breadcrumb "Página inicial > Busca > Dorflex"

Cenário: Limpar a busca
  Dado que digitei um termo no campo de busca
  Quando clico no ícone de limpar
  Então o campo é esvaziado
```

**Impacto na NSM:** a busca é o principal caminho de compra intencional (KPI de conversão da busca).

**Subtarefas sugeridas**
- QA | Casos de teste: busca com resultado, breadcrumb, limpar, produtos sem estoque, 3 breakpoints.
- [BE] Endpoint de busca por loja (reutilizar o motor de busca do App) no BFF Web.
- [WEB] Campo de busca e tela de resultado com grade responsiva.

**Definição de Pronto (DoD)** — mesmo da W01.

---

## W16 · Busca sem resultado

**Épico:** Web — Busca
**Tipo:** História | **Story Points:** 1 | **Prioridade:** Medium
**Figma:** `5074:15058` (desktop), `5074:15285` (tablet), `5074:15474` (mobile)

**User Story**
Como usuário consumidor que acessa o e-commerce web, quero ser avisado quando minha busca não encontra produtos, para tentar outro termo.

**O que deve ser feito**
- Estado "sem resultado": ilustração, título "Não encontramos resultados para “{termo}”" e texto "Tente buscar por outro termo ou nome do produto".

**Regras de Negócio**
- O termo exibido no título é **o termo realmente buscado** (o Figma mostra "hehehe" para a busca "Dorflex" — erro de exemplo).
- O campo de busca e o breadcrumb continuam visíveis para nova tentativa.

**Critérios de Aceite**

```gherkin
Cenário: Busca sem resultado
  Dado que busquei "xyzabc"
  Quando a busca não retorna produtos
  Então vejo a ilustração e “Não encontramos resultados para “xyzabc””
  E vejo "Tente buscar por outro termo ou nome do produto"
```

**Impacto na NSM:** orienta o usuário a refinar a busca em vez de abandonar a loja.

**Subtarefas sugeridas**
- QA | Casos de teste: termo exibido, caracteres especiais, 3 breakpoints.
- [WEB] Estado sem resultado.

**Definição de Pronto (DoD)** — mesmo da W01.

---

# Épico: Web — PDP

## W17 · Página de produto: informações

**Épico:** Web — PDP
**Tipo:** História | **Story Points:** 5 | **Prioridade:** High
**Figma:** `5040:2429` (desktop), `5077:10711` (tablet), `5077:12248` (mobile)

**User Story**
Como usuário consumidor que acessa o e-commerce web, quero ver as informações completas de um produto, para decidir a compra.

**O que deve ser feito**
- Breadcrumb ("Página inicial > departamento > produto").
- Galeria: imagem principal, miniaturas e setas de navegação.
- Nome, marca/fabricante.
- Seção expansível (acordeão) **"Detalhes do produto"** (aberta por padrão) com a **descrição simples do produto**. As demais seções do Figma (Benefícios, Modo de uso, Advertências, Armazenamento, Composição e Especificações) **não entram na primeira entrega**, porque o Catálogo ainda não tem esses campos. [PO 07/10]

**Regras de Negócio**
- A página mostra o produto da **loja ativa** (preço, estoque e regras são da loja).
- Na primeira entrega a página mostra só a seção "Detalhes do produto" (descrição simples), como acordeão. As seções adicionais do Figma ficam **fora da primeira entrega** e entram quando o Catálogo tiver os campos. [PO 07/10]
- A página de produto é renderizada no servidor (SSR) para SEO. [Ata 23/09]
- Produto sem estoque na loja ativa: ⚠️ **PENDÊNCIA (design — PD-18):** estado não desenhado.

**Critérios de Aceite**

```gherkin
Cenário: Ver o produto
  Dado que abri a página de um produto
  Quando a página carrega
  Então vejo as imagens, o nome, a marca e a seção "Detalhes do produto" aberta

Cenário: Recolher e expandir os detalhes
  Dado que estou na página do produto com "Detalhes do produto" aberta
  Quando clico no título da seção
  Então a descrição é recolhida
  E ao clicar de novo ela volta a ser exibida

Cenário: Navegar nas imagens
  Dado que o produto tem mais de uma imagem
  Quando clico nas setas ou nas miniaturas
  Então a imagem principal muda
```

**Impacto na NSM:** informação clara do produto reduz dúvida e abandono antes de adicionar ao carrinho.

**Subtarefas sugeridas**
- QA | Casos de teste: galeria, acordeão de detalhes, produto sem descrição, SEO básico (SSR), 3 breakpoints.
- [BE] Endpoint de detalhe do produto por loja no BFF Web.
- [WEB] Página de produto com galeria e acordeão de detalhes (SSR).

**Definição de Pronto (DoD)** — mesmo da W01.

---

## W18 · Página de produto: bloco de compra

**Épico:** Web — PDP
**Tipo:** História | **Story Points:** 8 | **Prioridade:** Highest
**Figma:** `5040:2429` (coluna direita)

**User Story**
Como usuário consumidor que acessa o e-commerce web, quero escolher a quantidade, ver preço e formas de receber e comprar o produto, para concluir a escolha na própria página.

**Overview**
Coluna de compra da PDP: preço (De/Por), quantidade, botão "Comprar" e as duas formas de receber (retirada e entrega) da loja ativa.

**O que deve ser feito**
- Card da oferta: "Oferta {bandeira}", preço "De/Por", percentual de desconto, parcelamento, seletor de quantidade e botão **"Comprar"**.
- Bloco **"Retirar na farmácia"** com a tag "Grátis" e o card da loja.
- Bloco **"Receber no endereço"** com previsão de entrega e valor do frete.

**Regras de Negócio**
- O botão se chama **"Comprar"**. O "Comprar com desconto" do Figma é reservado ao futuro PBM e **não** deve ser usado agora. [PO 05/10]
- "Comprar" adiciona a quantidade escolhida ao carrinho **sem exigir login** e atualiza o valor do "Carrinho" no header; a tela do carrinho não tem design Web ainda. [PO 07/10; FR-045]
- Parcelamento ("em até 6x … sem juros") só aparece se a loja tiver parcelamento habilitado no Portal. [FR-033]
- **Retirar na farmácia:** sempre com a tag "Grátis"; mostra nome da loja, **status "Aberta" + horário** (ex.: 08:00 às 20:00), **distância** e endereço. [FR-046, FR-084]
- Mensagem de disponibilidade de retirada considera horário atual + tempo de retirada da loja; ao passar do funcionamento, vira "amanhã a partir das…". [FR-047]
- **Receber no endereço:** previsão ("Receba em até 30min") e valor do frete (ou "Grátis") conforme raio do cliente; usa o **horário de funcionamento do delivery** (distinto do horário da loja); acima de 2 dias, exibe data. [FR-048]
- Os cálculos de horário **não** usam o fuso do servidor; usam o horário local do consumidor. [FR-049]
- Preço final em destaque; "De" riscado só quando há oferta. [Figma]
- Em produto em oferta, a compra exige a oferta ativada (login) conforme a W08. [FR-022, FR-108]
- ⚠️ **PENDÊNCIA (design — PD-18):** variante do bloco **sem oferta**, o **significado do rádio** "Oferta {bandeira}" selecionado, o limite de quantidade (estoque e limite de oferta), produto sem estoque, loja que não entrega no endereço ("Fora do alcance"/só retirada) e **medicamentos controlados** (receita) **não estão desenhados**.
- ⚠️ **PENDÊNCIA (definição — PD-21):** controlados na Web terão envio de receita e compra por entrega ou retirada (PRD FRW-073); nada disso tem tela e **não** está nesta história.

**Critérios de Aceite**

```gherkin
Cenário: Comprar sem login
  Dado que estou deslogado na página de um produto
  Quando escolho a quantidade 2 e clico em "Comprar"
  Então 2 unidades entram no meu carrinho
  E o valor do "Carrinho" no header é atualizado

Cenário: Retirada na farmácia
  Dado que a loja ativa faz retirada
  Quando visualizo "Retirar na farmácia"
  Então vejo a tag "Grátis", o nome da loja, se está aberta e o horário, a distância e o endereço

Cenário: Entrega no endereço
  Dado que a loja entrega no meu endereço
  Quando visualizo "Receber no endereço"
  Então vejo a previsão de entrega e o valor do frete

Cenário: Parcelamento só se habilitado
  Dado que a loja não habilitou parcelamento no Portal
  Quando visualizo o preço do produto
  Então não vejo a condição de parcelamento

Cenário: Rótulo do botão
  Dado que o produto está em oferta
  Quando visualizo o botão de compra
  Então ele se chama "Comprar"
```

**Impacto na NSM:** concentra preço, prazo e forma de receber na decisão de compra, aumentando a conversão da PDP.

**Subtarefas sugeridas**
- QA | Casos de teste: quantidade, comprar logado/deslogado, parcelamento, retirada (aberta/fechada, horário, distância), entrega (previsão, frete, fuso), 3 breakpoints.
- [BE] Preço, oferta, parcelamento, disponibilidade e prazos de retirada/entrega da loja ativa no BFF Web.
- [WEB] Bloco de compra com seletor de quantidade e blocos de retirada/entrega.

**Definição de Pronto (DoD)** — mesmo da W01.

---

# Pendências — aguardando design ou definição

> Tudo o que **não tem tela no Figma Web** (ou depende de definição do PO) **não virou história**. Cada item abaixo está também marcado com ⚠️ dentro das histórias que o citam.

## A. Sem tela no Figma Web (aguardando design)

| ID | Pendência | História | Fonte da regra |
|---|---|---|---|
| PD-02 | **"Ver todos" / "Ver todas"** das vitrines (listagem completa de 50 produtos / ofertas) | W07 | ECA-58 |
| PD-03 | **Região não atendida**: "Ainda não atendemos sua região", 5 lojas para retirada, botão "Alterar endereço" | W04 | ECA-35, ECA-519; FR-013/019 |
| PD-04 | **Erros e validações** de login, cadastro e dados pessoais (credenciais inválidas, CPF/e-mail já cadastrado, campo inválido, mensagens de sucesso) | W01, W02, W11 | FR-095–103 |
| PD-05 | Estado do card **depois de ativar a oferta** ("Oferta ativada", vigência) | W08 | FR-108 |
| PD-06 | **Regra de senha** visível no cadastro e na nova senha (1 maiúscula + 1 caractere especial) | W02, W03 | FR-101 |
| PD-07 | **Recuperar senha:** corrigir textos residuais ("Reenviar link"), contador 22 s → 30 s, telas de CPF não cadastrado, código inválido/expirado e sucesso | W03 | ECA-1228; PRD P-04 |
| PD-09 | **Endereços:** seções "Endereço atual / Outros endereços" e tag "Selecionado" | W13 | ECA-311 |
| PD-10 | **Editar endereço** | W13 | ECA-370 |
| PD-13 | Header: **tempo de entrega / "Fora do alcance"**; busca só em lojas do módulo vendas; destino dos links institucionais; "Nossas lojas" | W05, W06 | FR-064, FR-066 |
| PD-14 | Menu de categorias: **destino do clique e subníveis**; menu do perfil: **Favoritos, Meus pedidos, Recompra**; comportamento do carrinho no logout | W09, W10 | FR-068 |
| PD-16 | Vitrine **"Ofertas destaque"** | W07 | ECA-58 |
| PD-17 | **Favoritos:** coração, toasts, estado vazio e tag de indisponível | W14 | PRD Favoritar |
| PD-18 | **PDP:** variante sem oferta, significado do rádio da oferta, limite de quantidade, produto sem estoque, loja que não entrega | W17, W18 | FR-033–049 |
| PD-21 | **Medicamentos controlados:** tag de receita, regras do card/PDP, envio de receita e compra por entrega ou retirada | W15, W18 | PRD FRW-073 |
| PD-22 | Mensagens de erro do **"Adicionar"** (estoque máximo, limite de oferta) | W08 | FR-034, FR-036 |
| PD-23 | **Busca:** autocomplete com produtos, filtros (fabricante), ordenação, paginação/rolagem do resultado | W15 | `Busca/US/filtros-e-ordenacao-resultado-busca.md` |

## B. Aguardando definição do PO

| ID | Pendência | História |
|---|---|---|
| PD-01 | **Marcas em destaque:** quais marcas, origem dos dados e comportamento do clique (será replicado no App) — **fora de qualquer história por enquanto** | W07 |
| PD-12 | **Cartões:** apelido (22 caracteres), nome exibido na lista, validade (texto vs. dropdown), "cartão padrão", **limite de tentativas** de salvar cartão | W12 |
| PD-15 | **"Mais vendidos" com produtos em oferta:** o Figma contraria a ECA-58 (as histórias seguem o Jira) | W07 |
| PD-19 | **Loja pela URL:** loja inexistente/pausada/que não entrega no endereço salvo; geração e unicidade do trecho `nomedaloja`; carrinho com itens de outra loja ao trocar; conteúdo atrás do drawer sem loja | W04 |
| PD-20 | **Idade mínima 18 anos** no cadastro; **confirmação de telefone por SMS** (frame do checkout, sem regra no App) | W02 |

## C. Decisões já tomadas que moldaram as histórias (para rastreabilidade)

- Onboarding Web **só por endereço digitado**, com **só o número** (sem complemento). [PO 05/10 e 07/10]
- Ordem da home **do Figma**; carrossel de **10 produtos** (regra do App). [PO 05/10 e 07/10]
- Carrinho sem login; login só ao avançar para o pagamento; "Adicionar"/"Comprar" só atualiza o carrinho do header (sem tela de carrinho). [PO 05/10 e 07/10]
- Endereços: **regra do Jira**; excluir o selecionado → assume o de **cadastro mais recente**; **editar fora**. [PO 07/10]
- Marcas em destaque: **aguardando**. Ativar oferta: regra do App, estado pós-ativação como **pendência**. [PO 07/10]
- PDP: na primeira entrega só a **descrição simples** do produto; as seções Benefícios, Modo de uso, Advertências, Armazenamento, Composição e Especificações do Figma ficam fora (o Catálogo não tem os campos) e sem dependência de Catálogo. [PO 07/10]
- Telas de Conta abrem em **painel lateral de 375 px** em todos os breakpoints (o desktop usa o mesmo padrão do mobile). [PO 07/10]
- Adicionar endereço usa o **formulário completo** do Figma (Rua, Bairro, Número, Complemento opcional); "só número" vale só no onboarding. [PO 07/10]
- Cartões: **CVV obrigatório ao salvar** e na compra, como no App. [PO 07/10]
- Pós-cadastro: usuário já fica **logado** e volta à tela de origem. [PO 07/10]
- Recuperar senha: história escrita normalmente, mesmo existindo ECA-1267/ECA-1300 no Jira. [PO 07/10]
- Recuperar senha: validade **24 h**, **sem limite de reenvio**, reenvio após **30 s**. [PO 07/10]

## D. Próximos passos

- [x] PO validar as 18 histórias e as pendências deste documento.
- [x] Histórias no Jira: 6 épicos (ECA-1323 a ECA-1328) e 18 histórias (ECA-1329 a ECA-1346), criados em 07/10/2026.
- [ ] Consolidar com o PO os épicos Web preexistentes (ECA-1312, ECA-1313, ECA-1314) diante dos novos.
- [ ] Quebrar as subtarefas sugeridas ([WEB], [BE], Cenário de Teste) no refinamento.
- [ ] UX (Rodrigo) tratar a seção A (pendências de design).
- [ ] PO responder a seção B.

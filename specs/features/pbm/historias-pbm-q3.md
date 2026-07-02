# Histórias — Integração PBM Interplayers (Escopo Q3 2026: Precificação)

> **Origem:** não existe ainda `specs/features/pbm.md` neste repositório (item pendente em `TODO.md`). Estas histórias foram geradas diretamente a partir das fichas técnicas do parceiro em `docs/pbm_interplayers/`:
> - `1- Manual Conceitos HUB WS 2v2.pdf`
> - `2 - Manual de Projeto.pdf`
> - `3 - Ficha Técnica Token v3.pdf`
> - `5 - Ficha Técnica Consulta Produto V2.pdf`
> - `6 - Ficha Técnica Consulta Desconto V3 (PréPreenchimento).pdf`
>
> **Escopo:** conforme `context/product.md` (Entregas Q3 2026), o objetivo é "integração com PBM concluída e dado disponível para precificação" — autenticação, consulta de elegibilidade do produto e consulta de desconto. **Fora do escopo:** Carrinho, Efetivação, Finalização, Cancelamento e Extrato (fichas 4, 7, 8, 9, 10, 11 — não lidas/cobertas aqui).
> **Persona usada:** Consumidor PBM (glossário/`context/product.md`) e, quando aplicável, Consumidor Eventual (fluxo de adesão).
> **NSM:** Volume de Transações por Loja Ativa — o desconto PBM reduz o preço percebido e remove uma fricção de conversão hoje inexistente para esse segmento de consumidor, com impacto direto em conversão e ticket.

---

## Épico: Integração PBM (Interplayers) — Precificação

---

### [BE] Autenticação com o HUB Interplayers (Generate Token)

Épico: Integração PBM (Interplayers) — Precificação

**Tipo:** Tarefa | **Story Points:** 3 | **Prioridade:** Highest

**O que?**
Implementar a integração com o serviço de geração de token (`POST /oauth2/v2.0/token`) do HUB Interplayers, pré-requisito obrigatório para toda chamada de Consulta Produto e Consulta Desconto.

**Por que?**
Todas as chamadas ao HUB exigem um Access Token válido no header `Authorization: Bearer <token>`. Sem essa integração, nenhuma consulta de elegibilidade ou desconto PBM funciona.

**Como?**
- Implementar chamada `POST` enviando `Grant_Type`, `Client_Id`, `Client_Secret` e `Scope` fornecidos pela Interplayers (credenciais em gerenciador de segredos, nunca versionadas — mesmo padrão já usado para Braspag/Cielo).
- Armazenar `Access_Token`, `Token_Type`, `Not_Before`, `Expires_In`, `Expires_On`, `Resource`.
- Renovar o token antes da expiração (ver pergunta em aberto sobre a unidade de `Expires_In`, que aparece de forma contraditória na ficha técnica: "milissegundos" no texto e "segundos" na tabela de response).
- Reaproveitar o token dentro da janela de validade em vez de gerar um novo a cada chamada.
- Tratar HTTP 401 (token expirado/inválido → gerar novo token e repetir a chamada original), 403, 404, 500, 503, conforme a rotina de timeout do Manual de Conceitos (ver tarefa de resiliência).
- Cada canal de venda (ex.: App) tem credenciais próprias — não reutilizar credenciais de outro canal.

**Subtarefas sugeridas**
- QA | Casos de teste: token válido, token expirado em uso, credenciais inválidas, indisponibilidade do HUB.
- [BE] Implementar client de autenticação + cache/renovação de token.

---

### [BE] Consulta de elegibilidade PBM do produto (Consulta Produto)

Épico: Integração PBM (Interplayers) — Precificação

**Tipo:** Tarefa | **Story Points:** 5 | **Prioridade:** Highest

**O que?**
Implementar a integração com `POST /api/transaction/v2/consultaproduto`, que verifica — mesmo sem identificação do consumidor — se um EAN participa de algum programa PBM e retorna as condições de desconto disponíveis.

**Por que?**
É o primeiro passo do fluxo "Compra Shopper": antes de mostrar qualquer condição de desconto, o app precisa saber se aquele produto específico participa de um programa PBM.

**Como?**
- Enviar por produto: `EAN`, `requestedQuantity`, `listPrice` (preço bruto), `netPrice` (preço líquido) e `discountType` (B/L) — regra "MELHOR DESCONTO": sempre enviar bruto e líquido para o HUB calcular o desconto correto.
- Tratar `Response Sucesso` (produto participa de programa) com os campos: `allowsAdhesion`, `promotionalCard` (se "S", próximas chamadas exigem cupom/cartão + CPF), `discountValue`, `discountPercentual`, `discountValueIndustry`, `pointing`, `industryName`, `informativeMessage`, `comboId`, `status`.
- Tratar `Response Erro` (produto não participa de nenhum programa) com o padrão `conversion`/`validation`/`process`.error[n] do Manual de Conceitos.
- Tratar desvio de fluxo: se o HUB solicitar adesão do produto/consumidor, sinalizar para o app iniciar o fluxo de adesão (ver história de adesão) e, após concluído, resubmeter a consulta original.

**Subtarefas sugeridas**
- QA | Casos de teste: produto elegível, produto não elegível, produto exige cupom/cartão, produto sem nova adesão (`allowsAdhesion=N`), desvio de fluxo.
- [BE] Implementar client de consulta + mapeamento de erros.

---

### [BE] Consulta de desconto PBM por consumidor (Consulta Desconto / Pré-preenchimento)

Épico: Integração PBM (Interplayers) — Precificação

**Tipo:** Tarefa | **Story Points:** 8 | **Prioridade:** Highest

**O que?**
Implementar a integração com `POST /api/transaction/v3/consultadesconto`, que calcula o melhor benefício do programa PBM para a quantidade solicitada de um EAN, considerando a identificação do consumidor (CPF e/ou cartão/cupom) e dados de pré-preenchimento.

**Por que?**
É o serviço que efetivamente determina o preço final com desconto PBM a ser exibido ao consumidor — o dado central da entrega Q3 ("dado disponível para precificação").

**Como?**
- Enviar identificação do consumidor em `consumer[1]` — `holderId` (CPF, obrigatório se cartão não informado), `cardId`/`cardIdCompany`/`cardIdOperator` (obrigatório se produto tiver `Promo=M`), demais dados de pré-preenchimento quando disponíveis (não é necessário enviar todos os campos).
- Enviar por produto: `id`, `EAN`, `requestedQuantity`, `listPrice`, `netPrice`, `discountType` — regra "MELHOR DESCONTO" (bruto + líquido sempre).
- Se apenas CPF for informado, o HUB retorna descontos apenas dos programas em que o consumidor **já possui adesão**.
- Tratar `coPaymentPercentual` (formato 999v99, dividir por 100): quando presente, subtrair do valor final líquido do consumidor.
- Tratar a regra "Preço de Chegada": o desconto retornado é sempre variável conforme os preços enviados, de forma que o preço final "chegue" ao valor sugerido pela indústria — **exceto** quando o preço da rede (loja) já for melhor que o sugerido pela indústria, caso em que o desconto retornado deve ser sempre o da rede.
- Tratar desvio de fluxo por produto: quando há mais de um produto sem adesão, o HUB solicita adesão **individualmente, um produto por vez** — o app deve reenviar a consulta completa após cada adesão/aceite de termo (inclusive Termo LGPD) cumprido, até obter os descontos de todos os produtos.
- Usar `informativeLink` (não `urlAcceptTerm`) para novos desenvolvimentos, conforme recomendação explícita da ficha técnica.
- Se `discountValue = 0`, exibir o preço líquido sem desconto adicional (o produto seguiria depois para o serviço de Carrinho, fora do escopo desta entrega).

**Subtarefas sugeridas**
- QA | Casos de teste: consumidor com adesão prévia, consumidor sem adesão (desvio individual por produto), produto com `Promo=M` sem cartão informado, copagamento, desconto zerado, preço de rede melhor que o sugerido.
- [BE] Implementar client de consulta + tratamento de desvios de fluxo em cadeia.

---

### [BE] Rotina de resiliência: timeout e contingência nas chamadas à Interplayers

Épico: Integração PBM (Interplayers) — Precificação

**Tipo:** Tarefa | **Story Points:** 3 | **Prioridade:** High

**O que?**
Implementar a rotina de timeout e reenvio definida no Manual de Conceitos para todas as chamadas ao HUB Interplayers (Token, Consulta Produto, Consulta Desconto).

**Por que?**
O parceiro define um protocolo específico de resiliência; sem ele, uma instabilidade pontual do HUB pode causar erro definitivo na precificação PBM em vez de retry/fallback controlado.

**Como?**
- Timeout máximo por chamada: 30 segundos.
- 1º e 2º timeout → reenviar para o link principal.
- 3º e 4º timeout → reenviar para o link de contingência.
- 5º timeout → exibir ao consumidor (ou tratar internamente, a definir com produto) "Serviço temporariamente indisponível. Tentar novamente?"; se sim, repetir todo o processo desde o início.
- Nunca usar `Return Code` para decisões automáticas de sistema (é um código interativo, sujeito a mudança sem aviso, conforme o próprio manual do parceiro).
- Tratar HTTP 429 (limite de requisições excedido) e 503 (serviço indisponível/manutenção) com a mesma rotina.

**Subtarefas sugeridas**
- QA | Casos de teste: timeout único, timeouts consecutivos até contingência, 5º timeout com escolha do usuário.

---

### Exibir preço com desconto do convênio PBM no detalhe do produto

Épico: Integração PBM (Interplayers) — Precificação

**Tipo:** História | **Story Points:** 8 | **Prioridade:** Highest

**User Story**
Como Consumidor PBM, quero ver o preço do medicamento já com o desconto do meu convênio farmacêutico no detalhe do produto, para saber exatamente quanto vou pagar antes de decidir a compra.

**Overview**
Quando um produto participa de um programa PBM (Consulta Produto) e o consumidor está identificado (CPF/cartão vinculado, Consulta Desconto), o app deve exibir o preço final com o desconto do convênio, substituindo ou complementando o preço "De/Por" padrão. Reduz fricção de preço percebido para o segmento PBM e contribui para a NSM (Volume de Transações por Loja Ativa) ao tornar o benefício visível no momento de decisão de compra.

**O que deve ser feito**
- Chamada de Consulta Produto ao carregar o detalhe de um produto elegível a programas.
- Chamada de Consulta Desconto quando o consumidor está identificado (CPF salvo) e/ou possui cartão/cupom PBM vinculado.
- Exibição do preço com desconto PBM e, quando aplicável, da mensagem informativa (`informativeMessage`) fornecida pela indústria.

**Regras de Negócio**
- Se o produto não participa de nenhum programa (Response Erro na Consulta Produto), exibir o preço normal, sem qualquer indicação de PBM.
- Se `promotionalCard = "S"`, o app deve solicitar/usar o cupom ou cartão do programa antes de exibir o desconto (a Consulta Desconto exige cartão/cupom + CPF nesse caso).
- Se o produto exigir cartão/cupom (`Promo=M`) e o consumidor não tiver um vinculado, exibir o preço sem desconto PBM até que o dado seja fornecido — não bloquear a exibição do produto.
- O desconto exibido deve refletir a regra "Preço de Chegada": pode variar conforme o preço líquido/bruto enviado pela loja; se o preço da rede já for melhor que o preço sugerido pela indústria, exibir o preço da rede (nunca um desconto PBM pior que o preço já praticado pela loja).
- Se houver `coPaymentPercentual`, o preço final exibido deve já descontar esse copagamento.
- Se `discountValue = 0`, exibir apenas o preço líquido, sem indicação de desconto adicional PBM.
- Medicamentos controlados seguem as regras já existentes de supressão de comunicação promocional (FR-007/FR-008 da spec `001-app-ecommerce`) — desconto PBM em controlados, se houver, não deve ser comunicado como "oferta"/"desconto" promocional, apenas como preço final.
- Falha ou indisponibilidade da Interplayers (após a rotina de resiliência) não deve bloquear a exibição do produto: exibir o preço normal (sem PBM) nesse caso.

**Critérios de Aceite**
- Consigo ver o preço com desconto do meu convênio PBM no detalhe de um produto elegível, quando meu CPF/cartão está identificado.
- Consigo ver o preço normal (sem alteração) em produtos que não participam de nenhum programa PBM.
- Visualizo a mensagem informativa da indústria quando ela existir para o produto.
- Não sou bloqueado de ver o produto caso o serviço da Interplayers esteja indisponível — vejo o preço normal nesse caso.
- Não visualizo o desconto PBM comunicado como oferta/promoção quando o produto for um medicamento controlado.

**Subtarefas sugeridas**
- QA | Casos de teste: produto elegível com desconto, produto elegível sem adesão, produto não elegível, indisponibilidade do serviço, controlado com PBM.
- [BE] Orquestrar Consulta Produto + Consulta Desconto e expor preço final para o app.
- [APP] Componente de preço com indicação de desconto PBM no detalhe do produto.

---

### Iniciar adesão a um programa PBM quando o produto exigir (desvio de fluxo)

Épico: Integração PBM (Interplayers) — Precificação

**Tipo:** História | **Story Points:** 5 | **Prioridade:** High

**User Story**
Como Consumidor Eventual, quero ser direcionado para a adesão ao programa do convênio quando um produto exigir isso, para conseguir o desconto PBM na minha compra.

**Overview**
Quando a Consulta Desconto retorna um desvio de fluxo (`flowdeviation`/`informativeLink`) indicando que o consumidor ou o produto precisa de adesão (ou aceite de termo, incluindo LGPD), o app deve apresentar esse fluxo de forma clara antes de tentar novamente obter o desconto.

**O que deve ser feito**
- Tela/fluxo que abre o link (`informativeLink`, preferencial conforme recomendação da Interplayers) retornado pelo desvio de fluxo.
- Reenvio automático da Consulta Desconto completa após o consumidor concluir a adesão/aceite indicado.

**Regras de Negócio**
- Quando há mais de um produto na consulta sem adesão, a Interplayers solicita adesão **um produto por vez** — o app deve repetir o ciclo (abrir link → aguardar conclusão → reenviar consulta completa) até que todos os produtos tenham sido resolvidos ou até o consumidor desistir.
- Se o consumidor sair do fluxo de adesão sem concluir, o produto correspondente deve ser exibido sem o desconto PBM (preço normal), sem bloquear a navegação.
- O app não deve tentar decidir o fluxo com base no `Return Code` (uso proibido para decisão automática, conforme o manual do parceiro) — a decisão de exibir o desvio é baseada exclusivamente no campo de desvio de fluxo retornado.

**Critérios de Aceite**
- Sou direcionado para a tela/link de adesão quando um produto exigir isso para liberar o desconto PBM.
- Ao concluir a adesão, vejo o preço atualizado com o desconto aplicado, sem precisar repetir manualmente a consulta.
- Se eu não concluir a adesão, consigo seguir navegando e comprando o produto pelo preço normal.

**Subtarefas sugeridas**
- QA | Casos de teste: adesão de produto único, adesão de múltiplos produtos em sequência, abandono do fluxo de adesão, aceite de Termo LGPD.
- [BE] Repasse do link de desvio de fluxo e reenvio da consulta após conclusão.
- [APP] Tela/webview de adesão + retorno ao fluxo de compra.

---

## Perguntas em aberto (sinalizadas em vez de assumidas)

Conforme a regra do `CLAUDE.md` ("nunca invente contexto"), as fichas técnicas da Interplayers contêm inconsistências internas e lacunas que não devem ser resolvidas por suposição:

1. **Unidade de `Expires_In` (Token):** a ficha técnica descreve o campo como "em milissegundos" no texto e como "em Segundos" na tabela de response (ex.: "1799 Segundos = 30 minutos"). Precisa ser confirmado com a Interplayers antes da implementação de renovação de token.
2. **Cálculo de `discountValue` (Consulta Produto):** o documento traz duas afirmações não reconciliadas — que o desconto adicional considera "somente a quantidade autorizada" e, em outro trecho, que considera "também a quantidade não autorizada".
3. **Campos `product[30]...` na Consulta Desconto:** a ficha usa literalmente o índice `[30]` em `listPrice`/`discountType`, aparentando erro de template do PDF original — confirmar a nomenclatura real do campo com o parceiro.
4. **Momento de disparo no app:** os manuais descrevem o fluxo de negócio "Compra Shopper" de forma genérica, sem especificar se a Consulta Desconto deve ser disparada apenas no detalhe do produto, também ao alterar quantidade, ou também ao entrar no carrinho (a ficha de Carrinho está fora do escopo desta leitura). As histórias acima assumem **apenas o detalhe do produto** como escopo Q3 — confirmar se isso é suficiente ou se o carrinho também precisa refletir o preço PBM nesta entrega.
5. **Credenciais e URLs de produção:** não constam nos PDFs (fornecidas separadamente pela Interplayers na fase final do projeto, por segurança) — necessário confirmar com o time responsável antes de estimar a T1 (Token) com precisão.

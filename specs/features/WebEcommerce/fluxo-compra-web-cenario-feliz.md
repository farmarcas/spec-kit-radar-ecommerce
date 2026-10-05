# Fluxo de Compra — Web Ecommerce (cenário feliz, espelhado do App)

**Produto:** Radar (Web Ecommerce — novo canal, Consumidor Final)
**Squad:** App (mapeamento da jornada de origem) + Web Ecommerce (implementação)
**Autor:** Daniel (PO), a validar com Rodrigo Nery (UX) — entrega da ação "Mapear fluxo" registrada em `specs/features/WebEcommerce/2026-09-23-primeiro-papo-web-ecommerce.md`
**Status:** Rascunho para validação — fonte primária é uma gravação de tela do App (cenário feliz), convertida aqui em proposta de fluxo Web. Não substitui o desenho de UX definitivo (Rodrigo Nery segue com os esboços da PDP citados na ata).
**Versão:** 1.0

---

## 0. Changelog

**v1.0 (2026-09-23)** — Primeira versão. Construída a partir da gravação de tela `93694.mp4` (App, bandeira Farmácia Super Popular, cenário feliz de compra) fornecida pelo PO, analisada quadro a quadro (extração de frames via ffmpeg), e das decisões já alinhadas na reunião "Primeiro Papo Web Ecommerce" (`2026-09-23-primeiro-papo-web-ecommerce.md`).

---

## 1. Contexto

Na reunião "Primeiro Papo Web Ecommerce" (23/09/2026), o time decidiu adotar um canal de e-commerce Web próprio (Next.js + BFF), com paridade de experiência em relação ao App: *"a experiência na web deve espelhar o aplicativo, solicitando login em ações principais (ativação de ofertas ou adição ao carrinho)"*, e *"a página inicial exige a localização prévia da farmácia devido às limitações do modelo de negócio em que cada loja possui preços e estoques independentes"*. Ficou registrada como ação aberta: *"[Daniel Costa, Rodrigo Nery] Mapear fluxo: desenhar o fluxo completo de compra, incluindo pontos de contato entre os estados logado e deslogado."*

Este documento cumpre essa ação, usando como fonte uma gravação de tela do App em um cenário feliz completo: seleção de localização → login → busca → PDP → carrinho → entrega → pagamento → confirmação do pedido. A proposta abaixo é a tradução desse fluxo para a Web, marcando explicitamente onde a Web deve ser **idêntica** ao App, onde precisa **adaptar-se** ao paradigma web (páginas vs. modais, mouse/teclado vs. toque) e onde **ainda não há decisão** — nesses pontos, o documento aponta a pendência em vez de presumir uma resposta.

## 2. Objetivo

Fornecer ao time de Web Ecommerce (e a UX) um mapa passo a passo do fluxo de compra ponta a ponta, com as telas, estados e regras observadas no App, para servir de base ao desenho definitivo das telas Web e ao fatiamento em histórias.

**Impacto na NSM:** o novo canal Web é uma frente de aquisição adicional (redução de dependência de app instalado, uso via WhatsApp/anúncios) — impacta diretamente o Volume de Transações por Loja Ativa ao reduzir a fricção de conversão para quem não tem o App instalado.

## 3. Metodologia / fonte

- Vídeo `93694.mp4` (2min14s, 550×1280, gravação de tela do App), fornecido pelo PO fora do repositório.
- Extração de frames com ffmpeg: detecção de mudança de cena (27 quadros-chave) + amostragem a 1 fps nas janelas sem corte de cena detectado, para não perder passos com transição suave (digitação, scroll).
- Os horários citados abaixo (`t≈Xs`) são relativos ao início da gravação, só para referência de ordenação — não representam tempo de uma persona real usando o app.

## 4. Jornada observada no App (linha do tempo)

| # | t≈ | Tela do App | O que acontece |
|---|---|---|---|
| 1 | 0s | **Localização inicial** — "Onde você quer receber seu pedido?" | Botões "Usar localização atual" e "Digitar endereço"; link "Já tem cadastro? Fazer login". Tela pré-login, pré-loja. |
| 2 | 4–11s | **Endereço (digitação)** | Campo de texto livre; usuário digita "Rua Domingos de Morais 2709". |
| 3 | 14–21s | **Home (deslogado)** | Header com endereço selecionado, carrinho e busca; banner promocional; atalhos de categoria; card "Entre na sua conta e aproveite os preços exclusivos para você" com CTA "Entrar ou cadastrar"; seção "Mais vendidos". Bottom nav com 3 itens (Início/Categorias/Ofertas). |
| 4 | 22–44s | **Login** | Campos "Email ou CPF" e "Senha", "Esqueci minha senha", botões "Entrar" / "Criar minha conta". **Observado (fora do cenário feliz):** uma tentativa com senha incorreta gerou o erro "Você errou ou seu usuário ou sua senha" antes do login bem-sucedido — ver seção 8. |
| 5 | 45–53s | **Home (logado)** | Card de login some; bottom nav ganha o 4º item "Pedidos". |
| 6 | 49–52s | **Busca (autocomplete)** | Toque na busca → digitação "dorflex" → lista "Sugestões de busca" (3 sugestões) → seleção de uma sugestão. |
| 7 | 53–63s | **PDP (produto)** | Nome, fabricante, badge de desconto, carrossel de imagem, card de oferta (preço De/Por, seletor de quantidade, botão "Comprar"), formas de entrega disponíveis para o endereço, detalhes/bula do produto. Toque em "Comprar" incrementa o contador do carrinho. |
| 8 | 63–66s | **Carrinho** | Lista de itens (imagem, nome, fabricante, preço, seletor de qtd, aviso de estoque baixo), rodapé fixo com subtotal, parcelamento, botão "Continuar" e link "Adicionar mais produtos". |
| 9 | 66–70s | **Entrega** | Card do endereço atual (com "Trocar" → tela "Endereço de entrega" com lista de endereços salvos e "Adicionar novo endereço"); escolha da forma de entrega ("Receber em casa" vs. "Retirar na loja", ambos grátis neste caso); total; botão "Ir para pagamento" **desabilitado até escolher a forma de entrega**. |
| 10 | 76–97s | **Pagamento** | "Como você quer pagar?" (Pagar na retirada / Pagar no app) muda dinamicamente as opções de "Escolha a forma de pagamento" (Pix/Cartão maquininha/Dinheiro vs. Pix/Cartão salvo com parcelamento); resumo da compra (subtotal, taxa de entrega, desconto, total); loja para retirada quando aplicável; botão "Finalizar compra" **desabilitado até escolher a forma de pagamento**. Usuário explorou as duas opções e finalizou com **Pagar na retirada + Cartão (maquininha)**. |
| 11 | 98–120s | **Detalhes do pedido (confirmação)** | Abre automaticamente após "Finalizar compra" — não há tela de sucesso isolada. Nome da loja, número do pedido, chip "Pedido em andamento", stepper (Pedido recebido → Em separação → Pronto para retirada → Concluído), itens, resumo da compra, forma de pagamento, endereço/loja para retirada. |
| 12 | — | **Meus pedidos** | Acessível pela aba "Pedidos" do rodapé; lista pedidos por data, cada card com loja, número, status (inclui exemplo de "Pedido cancelado" no histórico) e "Ver detalhes". |
| 13 | 126–133s | **Volta à Home** | Carrinho volta a exibir sem contador. Usuário abre outro produto pela vitrine (Stomaliv) — fim da gravação, sem concluir uma segunda compra. |

## 5. Fluxo proposto para a Web

```
Visitante acessa a URL da loja (ex.: loja.<bandeira>.com.br/<cidade>/<loja>)
          │
          ▼
   Já existe loja/endereço salvo em cookie/sessão?
     ┌─────┴──────────────────────────┐
     ▼ Não (1ª visita)                 ▼ Sim
Tela "Onde você quer receber          Home da loja carregada
seu pedido?"                          direto (SSR)
 - Usar localização atual
 - Digitar endereço
 - "Já tem cadastro? Fazer login"
          │
          ▼
   Endereço confirmado → define a loja ativa (preço/estoque)
          │
          ▼
======================= HOME (SSR, pública) =======================
Header: logo bandeira | endereço/loja (trocar) | busca | carrinho | entrar/perfil
Banner promocional | atalhos de categoria | "Mais vendidos"
Card "Entre na sua conta..." (se deslogado)
          │
          ├── Busca (digita termo) ──► Autocomplete/sugestões ──► Resultado de busca ──► PDP
          │
          └── Toca produto na vitrine ──────────────────────────────────────────────► PDP
                                                                                          │
=================================== PDP (SSR) ===========================================
Nome, fabricante, badge desconto, imagens, preço De/Por, seletor de qtd,
formas de entrega para o endereço atual, detalhes/bula
                                                                                          │
                                                                    Toca "Comprar" / "Adicionar"
                                                                                          │
                                              ┌───────────────────────────────────────────┘
                                              ▼
                                   Está logado?
                              ┌─────┴──────────────────────┐
                              ▼ Sim                          ▼ Não
                    Item entra no carrinho          [PENDÊNCIA — ver §7.1]
                    (contador do header atualiza)    Web exige login aqui
                              │                       (paridade com decisão da
                              │                       ata) OU permite carrinho
                              │                       de visitante? Não decidido.
                              │                              │
                              └──────────────┬───────────────┘
                                             ▼
                              Carrinho (página própria, client-side)
                    Itens, qtd, subtotal, "Continuar", "Adicionar mais produtos"
                                             │
                                             ▼
                                    Está logado?
                              ┌─────┴──────────────────────┐
                              ▼ Sim                          ▼ Não
                     Segue para Entrega              Tela/etapa de login OU
                                                       guest checkout — ver §7.1
                                             │
                                             ▼
                               Entrega (endereço + forma de entrega)
                  "Meu endereço" (trocar) | Receber em casa vs. Retirar na loja
                        "Ir para pagamento" habilita após escolha
                                             │
                                             ▼
                                       Pagamento
              "Como quer pagar?" (na retirada / no app) → formas de pagamento
                       condicionais → resumo da compra → loja p/ retirada
                        "Finalizar compra" habilita após escolha
                                             │
                                             ▼
                           Detalhes do pedido (confirmação + stepper de status)
                                             │
                                             ▼
                    "Meus pedidos" (histórico, acessível pelo header/perfil)
```

### Notas de adaptação ao paradigma Web (não mudam a regra de negócio, mudam a forma)

- **Bottom nav mobile → header/menu Web.** As 4 abas do rodapé do App (Início, Categorias, Ofertas, Pedidos) não fazem sentido como barra fixa inferior em desktop; propõe-se migrar para o header (logo + menu) e/ou menu do perfil, mantendo os mesmos 4 destinos.
- **Telas cheias → páginas ou paineis laterais.** No App, "Carrinho", "Entrega", "Pagamento" e "Endereço de entrega" são telas cheias empilhadas (push de navegação). Na Web, o padrão usual é: carrinho como **drawer lateral** (mini-carrinho) com um link "Ver carrinho completo" para a página cheia, e Entrega/Pagamento como páginas de checkout (ou um único checkout em etapas/steps) — a decidir com UX (Rodrigo Nery já tem esboços da PDP; ver ata).
- **Seletor de endereço.** No App é uma tela cheia; na Web tende a ser um modal/dropdown a partir do header (mais familiar em e-commerce desktop).
- **SSR vs. client-side.** Conforme decidido na ata: Home, PDP e vitrines em SSR (Next.js) para SEO/performance; áreas logadas (carrinho, checkout, pedidos) em client-side.

## 6. Pontos de contato logado/deslogado

Pedido explícito da ata ("incluir pontos de contato entre os estados logado e deslogado"). O que foi **observado no vídeo** e o que está **decidido na ata** (não é o mesmo — sinalizado):

| Ponto de contato | Observado no App (vídeo) | Decisão da ata (2026-09-23) | Status para a Web |
|---|---|---|---|
| Selecionar localização/loja | Antes do login, é a 1ª tela do app | "a página inicial exige a localização prévia da farmácia" | **Confirmado**: web pede localização antes até de logar. |
| Navegar Home/vitrine/PDP | Livre, sem exigir login | Não contestado na ata | **Confirmado**: navegação de catálogo é pública. |
| Ativar oferta | Não aparece no vídeo | "solicitando login em ações principais (ativação de ofertas...)" | **Confirmado pela ata**: exige login. Web deve implementar o gate. |
| Adicionar ao carrinho | No vídeo, o carrinho já tinha 1 item (Ninho) **antes** do login acontecer na gravação — não dá para confirmar se isso foi uma ação do próprio vídeo ou um carrinho de sessão anterior já existente no aparelho. Não é uma evidência confiável de "adicionar sem login" no App. | "...ou adição ao carrinho" — ata registra que login deve ser exigido nessa ação | **Ver pendência §7.1**: a ata aponta para exigir login aqui, mas o vídeo não comprova nem contradiz isso — não temos evidência do comportamento real do App para essa ação específica. Confirmar com o time de App antes de implementar o gate na Web. |
| Finalizar compra (checkout) | Login já feito bem antes desse ponto no vídeo — não há como isolar se o checkout em si exige login separado | Discussão sobre **guest checkout** ficou em aberto (Diego Moritz, Victor Gutierre, Joceli Junior vs. Daniel Costa) | **Pendência §7.1**: não decidido. |
| Ver "Meus pedidos" | Exige login (aba só aparece após login) | Não contestado | **Confirmado**: histórico de pedidos exige login. |

## 7. Pendências e decisões em aberto

### 7.1 Guest checkout (compra sem login prévio)

A ata registra essa discussão como **não resolvida**: *"Diego Moritz, Victor Gutierre e Joceli Junior argumentaram sobre a possibilidade de permitir compras na web sem login obrigatório prévio (estilo visitante com mini-cadastro solicitando e-mail e gerando senha aleatória), contrapondo-se às restrições do modelo de negócio apresentadas por Daniel Costa quanto à identificação obrigatória da farmácia local."* Isso afeta diretamente onde, no fluxo da seção 5, o gate de login aparece — antes de adicionar ao carrinho, antes do checkout, ou nunca (guest completo). **Este documento não assume uma resposta.** Recomendação: resolver antes de desenhar as telas de carrinho/checkout definitivas, já que muda a arquitetura da tela (ex.: se existe "carrinho de visitante" persistente).

### 7.2 Sincronização do carrinho multicanal

Ata: *"a refatoração do carrinho em andamento (que atualmente usa identificador de dispositivo móvel) [precisa suportar] a web e garantir a sincronização compartilhada do carrinho quando a pessoa usuária estiver logada em múltiplos canais"* (ação do Galdino). O fluxo acima assume que o carrinho web, quando logado, é o mesmo carrinho do App — depende dessa refatoração backend, ainda não entregue.

### 7.3 Escopo do MVP (V1) vs. fluxo completo aqui mapeado

A ata registra a recomendação de Thiago Fernandes de **priorizar páginas de produto das lojas na V1**, não o fluxo de compra ponta a ponta: *"priorizar páginas de produtos das lojas em vez de focar na home institucional"*, e Rodrigo Nery só tem esboços preliminares da PDP até o momento. Este documento mapeia o **fluxo completo** (localização → login → busca → PDP → carrinho → entrega → pagamento → confirmação → pedidos) como referência de produto; o fatiamento de qual parte entra na V1/MVP é uma decisão de escopo separada, ainda não feita.

### 7.4 Forma de entrega "grátis" nas duas opções

No vídeo, tanto "Receber em casa" quanto "Retirar na loja" apareceram como **Grátis** na tela de Entrega do carrinho (t≈69s), mas a mesma combinação de produto/loja mostrou "Receba até 17:21hs — Por R$5,00" para entrega em casa quando avaliada isoladamente na PDP (t≈56s, antes de entrar no carrinho). Não ficou claro no vídeo se o frete muda por haver 2 itens no carrinho (atingiu frete grátis) ou se é uma inconsistência entre a estimativa da PDP e o cálculo final do carrinho. Sinalizado aqui para confirmar com o time de App/Carrinho — não é uma regra a replicar às cegas na Web sem entender a causa.

## 8. Estados de erro observados (fora do cenário feliz, mas relevantes para o desenho da Web)

- **Login — credenciais inválidas:** banner vermelho no topo da tela, texto "Você errou ou seu usuário ou sua senha", campos mantêm o que foi digitado (e-mail preenchido, senha mascarada). A Web deve ter um estado equivalente.
- **Estoque baixo no carrinho:** o item Dorflex exibiu "Resta 1 un." abaixo do seletor de quantidade dentro do carrinho — um aviso de baixo estoque, não um bloqueio.
- **Pedido cancelado:** a lista "Meus pedidos" mostra pedidos com status "Pedido cancelado" (chip vermelho) ao lado de "Pedido em andamento" (chip azul) — confirma que a tela de histórico precisa suportar múltiplos status, não só o "em andamento" do cenário feliz.

## 9. Referência

- **Fonte visual:** gravação de tela `93694.mp4` (App, bandeira Farmácia Super Popular), fornecida pelo PO fora do repositório — não commitada (sem precedente de anexar binários de vídeo/imagem em `specs/`). Frames-chave extraídos localmente para esta análise (ffmpeg, detecção de cena + amostragem a 1 fps).
- **Ata de origem da ação:** `specs/features/WebEcommerce/2026-09-23-primeiro-papo-web-ecommerce.md`
- **PRDs do App usados como referência de formato/convenção:** `specs/features/001-app-ecommerce/Deeplink/PRD-deeplink-app.md`, `specs/features/001-app-ecommerce/Busca/PRD-busca-codigo-barras-app.md`

## 10. Próximos passos sugeridos

- [ ] Validar este fluxo com Rodrigo Nery (co-dono da ação "Mapear fluxo" na ata) e confrontar com os esboços de PDP que ele já tem.
- [ ] Resolver a pendência de guest checkout (§7.1) — decisão de produto antes de desenhar telas de carrinho/checkout Web.
- [ ] Confirmar com o time de App o comportamento real de "adicionar ao carrinho deslogado" (§6), já que o vídeo não é uma evidência confiável nesse ponto específico.
- [ ] Fatiar este fluxo completo em escopo V1 (MVP) vs. fases seguintes, alinhado com a recomendação de Thiago Fernandes de priorizar PDP na V1 (§7.3).
- [ ] Depois de validado, gerar histórias por etapa do fluxo seguindo `prompts/gerar-historias.md`.

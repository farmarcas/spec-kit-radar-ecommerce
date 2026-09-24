# PRD — Favoritar Produtos no App

**Produto:** Radar (App — Consumidor Final)
**Squad:** App
**Autor:** Daniel (PO)
**Status:** Em refinamento — base para geração de histórias via Claude Code
**Versão:** 1.1
**Epics relacionados:** A definir (nenhum épico Jira vinculado ainda)

---

## 0. Changelog

**v1.1 (2026-09-22)** — Revisão com o PO sobre a seção "Dependências e itens abertos": (1) estado vazio da tela Favoritos deixa de ser pendência de design — já alinhado com o time de UX, a tela existirá no Figma; a regra de exibição será detalhada na escrita das histórias técnicas (nova regra 6.10); (2) confirmado que, após concluir login/cadastro a partir do bottom sheet de autenticação, o produto é favoritado automaticamente e o Consumidor retorna à PDP já vendo a mensagem de sucesso (regra 6.2 atualizada); (3) removida a dependência de engenharia sobre o serviço de estoque/preço em tempo real — fora do escopo de decisão desta PRD.

**v1.0 (2026-09-22)** — Primeira versão. Documenta a funcionalidade **Favoritar produtos**, com base no protótipo Figma da página "23. Favoritar produtos 📦" (arquivo "App · E-commerce", node `3459:14776`) e nas decisões de escopo alinhadas com o PO em sessão de dúvidas.

---

## 1. Contexto

O App ainda não oferece um jeito de o Consumidor marcar produtos de interesse para acesso rápido depois. Hoje, para comprar de novo um produto que costuma usar, o Consumidor precisa buscar pelo nome, navegar até a categoria, ou recorrer à Recompra (que depende de um pedido anterior completo — ver `specs/features/001-app-ecommerce/repetir pedido/PRD-refazer-pedido-app.md`).

O protótipo Figma analisado adiciona um caminho complementar: um ícone de coração na tela de Produto (PDP) que marca o item como favorito, e uma nova tela "Favoritos" — acessível pelo menu de Perfil — que lista todos os produtos marcados, com atalho de compra rápida direto do card. É a base para uma seção de "produtos que o consumidor costuma comprar com mais frequência", citada no pedido de negócio.

Diferente da Recompra (que reconstrói um pedido passado inteiro), Favoritar é uma ação item a item, feita a qualquer momento durante a navegação — não depende de o Consumidor já ter comprado aquele produto antes.

## 2. Objetivo

Permitir que o Consumidor marque produtos como favoritos a partir da tela de Produto (PDP) e os encontre depois em uma lista dedicada ("Favoritos"), com preço, disponibilidade e um botão de adição rápida ao carrinho sempre referentes à **loja atualmente ativa** — reduzindo o esforço de encontrar e comprar de novo os produtos de uso recorrente do Consumidor.

**Impacto na NSM:** Favoritar cria um atalho direto para novas transações em uma Loja Ativa a partir de produtos que o Consumidor já demonstrou interesse — sem depender de haver um pedido anterior (diferente da Recompra). Quanto mais simples for encontrar e recomprar um favorito, maior a chance de gerar uma nova transação recorrente.

## 3. Escopo

### Dentro do escopo (V1)

- Ícone de coração (favoritar/desfavoritar) na tela de **Produto (PDP)**, alternando entre estado vazio ("like off") e preenchido/vermelho ("like on").
- Favorito é um conceito **global do Consumidor**, por produto (EAN) — não fica atrelado à loja onde foi favoritado. A lista de Favoritos sempre exibe preço e estoque da **loja atualmente ativa** do Consumidor (mesmo princípio já adotado na Recompra, PRD seção 6.1).
- Toast de confirmação ao favoritar: **"Adicionado aos favoritos"**, com link **"Ver favoritos"** que leva direto à tela de Favoritos.
- Toast de confirmação ao desfavoritar: **"Removido dos favoritos"**.
- Nova tela **"Favoritos"**, em grade de 2 colunas, listando todos os produtos favoritados pelo Consumidor, cada card com: imagem, tag de desconto (quando aplicável), nome, marca, preço (de/por, quando aplicável), ícone de coração preenchido (permite desfavoritar direto da lista) e botão de adição rápida ao carrinho ("+").
- Ordenação padrão da lista: **mais recente favoritado primeiro**.
- Ponto de entrada da tela "Favoritos": item de menu **"Favoritos"** na seção "Conta" da tela de Perfil, e o link "Ver favoritos" do toast de confirmação.
- **Autenticação obrigatória:** Consumidor não logado que tenta favoritar vê um bottom sheet ("Salve seus produtos favoritos") oferecendo login/criação de conta ou dispensa ("Agora não") — a ação de favoritar não é concluída sem login.
- Produto favoritado que fica **indisponível** (sem estoque ou fora do catálogo) na loja ativa permanece na lista de Favoritos, sinalizado com tag de indisponibilidade — mesmo tratamento já usado na Recompra (PRD seção 6.3) — e sem o botão de adição rápida ativo.
- Sem limite de quantidade de produtos favoritados por Consumidor.

### Fora do escopo (V1)

- Ícone de favoritar em outras telas além da PDP (busca, listagem de categoria, home, carrinho) — só existe na PDP nesta versão; pode ser avaliado em versão futura.
- Organização dos favoritos em coleções/pastas personalizadas.
- Notificações proativas sobre favoritos (ex: "seu favorito entrou em oferta", "voltou ao estoque").
- Compartilhamento da lista de favoritos.
- Qualquer fluxo de seleção de loja: a feature assume que o Consumidor **sempre** tem uma loja ativa selecionada (mesma pré-condição da Recompra).

## 4. Personas

Feature agnóstica de persona — qualquer Consumidor logado do App (Consumidor Fidelizado, Consumidor PBM ou Consumidor Eventual, ver `context/product.md`) pode favoritar produtos. Consumidor não logado é bloqueado pela regra de autenticação (seção 6.2).

## 5. Fluxo

```
Consumidor está na tela de Produto (PDP)
              │
              ▼
   Consumidor toca no ícone de coração
              │
      ┌───────┴────────┐
      ▼                 ▼
 Logado             Não logado
      │                 │
      │                 ▼
      │      Bottom sheet "Salve seus produtos favoritos"
      │      ┌──────────┴──────────┐
      │      ▼                     ▼
      │  "Entrar ou criar conta"  "Agora não"
      │      │                     │
      │      ▼                     ▼
      │  (login/cadastro)    Coração permanece
      │      │               vazio, nada é salvo
      │      ▼
      │  Favorito pretendido é aplicado
      │  automaticamente; retorna à PDP logado
      │      │
      └──────┴───────┐
                      ▼
         Produto favoritado (coração preenchido/vermelho)
         Toast "Adicionado aos favoritos" + link "Ver favoritos"
                      │
                      ▼
         Consumidor toca "Ver favoritos" (ou acessa
         via Perfil > Favoritos, a qualquer momento depois)
                      │
                      ▼
         Tela "Favoritos" (grade 2 colunas)
         Preço/estoque sempre da LOJA ATIVA do Consumidor
                      │
       ┌──────────────┼───────────────────┐
       ▼                                   ▼
  Toca coração de um card            Toca "+" em um card disponível
  (desfavoritar)                             │
       │                                     ▼
       ▼                          Produto adicionado ao carrinho
  Item removido da lista +                   da loja ativa
  Toast "Removido dos favoritos"
```

## 6. Regras de negócio

### 6.1 Escopo do favorito (global por consumidor)
- Um favorito é uma relação entre o Consumidor e um produto (EAN), independente de qual loja estava ativa no momento em que foi favoritado.
- A lista de Favoritos **nunca** mistura preço/estoque de lojas diferentes: todo card exibe sempre o preço e a disponibilidade vigentes na **loja atualmente ativa** do Consumidor — o mesmo princípio já usado na Recompra (`specs/features/001-app-ecommerce/repetir pedido/PRD-refazer-pedido-app.md`, regra 6.1).
- Se o Consumidor trocar de loja ativa, a lista de Favoritos continua mostrando os mesmos produtos (por EAN), agora com preço/estoque da nova loja ativa.

### 6.2 Autenticação obrigatória
- Favoritar exige Consumidor logado. Ao tocar no coração estando deslogado, o sistema exibe o bottom sheet **"Salve seus produtos favoritos"** com o texto de apoio "Entre ou crie uma conta para salvar seus produtos favoritos e encontrá-los facilmente depois."
- Duas ações: **"Entrar ou criar conta"** (leva ao fluxo de autenticação existente) ou **"Agora não"** (fecha o bottom sheet, coração permanece vazio, produto não é favoritado).
- Ao concluir login/cadastro a partir desse fluxo, o produto que originou o bottom sheet é **favoritado automaticamente** — o Consumidor não precisa tocar no coração de novo. Ele retorna à PDP já com o coração preenchido/vermelho e a mensagem de sucesso (toast "Adicionado aos favoritos") exibida.

### 6.3 Alternância favoritar/desfavoritar (ícone de coração)
- Estado vazio ("like off"): produto não favoritado.
- Estado preenchido/vermelho ("like on"): produto favoritado.
- Tocar no coração alterna o estado. Favoritar exibe toast **"Adicionado aos favoritos"** (com link "Ver favoritos"); desfavoritar exibe toast **"Removido dos favoritos"**.

### 6.4 Ponto de entrada do ícone de favoritar
- Nesta V1, o ícone de coração para favoritar só existe na tela de **Produto (PDP)**. Listagens (busca, categoria, home) não têm essa ação nesta versão (ver seção 3.2).

### 6.5 Tela "Favoritos"
- Acessível por dois caminhos: (1) item de menu **"Favoritos"** na seção "Conta" da tela de Perfil; (2) link **"Ver favoritos"** no toast de confirmação ao favoritar.
- Lista em grade de 2 colunas. Cada card replica os elementos padrão de card de produto já usados no restante do App (imagem, tag de desconto quando houver, nome, marca, preço de/por) e adiciona: coração preenchido (desfavoritar direto da lista) e botão de adição rápida "+" (adiciona 1 unidade ao carrinho da loja ativa, mesmo padrão de adição rápida já usado em outras listagens do App).
- Ordenação padrão: **mais recente favoritado primeiro**.
- Tocar no card (fora do coração e do "+") leva à PDP do produto, como em qualquer outro card do App.

### 6.6 Desfavoritar a partir da lista "Favoritos"
- Tocar no coração preenchido de um card na tela Favoritos remove o item da lista e exibe o toast **"Removido dos favoritos"**.
- Não há confirmação adicional (sem "tem certeza?") — a ação é direta, assim como favoritar.

### 6.7 Produto indisponível na lista de Favoritos
- Se um produto favoritado está **sem estoque** ou **não existe mais no catálogo** da loja ativa, ele **permanece** na lista de Favoritos (não é removido automaticamente), com uma tag de indisponibilidade — mesmo tratamento visual já usado para itens indisponíveis na Recompra (PRD Recompra, seção 6.3, tag "Produto indisponível").
- O botão de adição rápida "+" fica desabilitado (ou ausente) para esses itens.
- O coração de desfavoritar continua ativo — o Consumidor pode remover manualmente um favorito indisponível a qualquer momento.

### 6.8 Sem limite de quantidade
- Não há limite máximo de produtos que um Consumidor pode favoritar.

### 6.9 Persistência
- Favoritos ficam vinculados à conta do Consumidor (não ao dispositivo) — persistem entre sessões e ficam disponíveis em qualquer dispositivo em que o Consumidor faça login.

### 6.10 Estado vazio da tela Favoritos
- Quando o Consumidor não possui nenhum produto favoritado (ou remove o último), a tela Favoritos exibe um **estado vazio dedicado**, já alinhado com o time de UX — o protótipo correspondente será disponibilizado no Figma.
- Textos, imagem/ilustração e eventual CTA desse estado vazio devem ser extraídos do protótipo Figma no momento da escrita das histórias técnicas (não estavam disponíveis no protótipo analisado nesta versão da PRD).

## 7. Pontos de entrada (UI)

| Local | Elemento | Observação |
|---|---|---|
| Tela de Produto (PDP) | Ícone de coração no canto superior direito da imagem do produto | Alterna entre favoritado/não favoritado (seção 6.3). |
| Toast "Adicionado aos favoritos" | Link "Ver favoritos" | Aparece só no momento de favoritar; leva direto à tela Favoritos. |
| Tela de Perfil — seção "Conta" | Item de menu "Favoritos" (ícone de coração) | Acesso permanente à tela Favoritos, junto com Dados pessoais, Meus cartões, Endereço de entrega, Segurança e privacidade. |

## 8. Toasts e bottom sheets

- **Toast de sucesso (favoritar):** "Adicionado aos favoritos" (verde, barra superior) + link "Ver favoritos".
- **Toast de sucesso (desfavoritar):** "Removido dos favoritos" (verde, barra superior).
- **Bottom sheet de autenticação:** título "Salve seus produtos favoritos" + apoio "Entre ou crie uma conta para salvar seus produtos favoritos e encontrá-los facilmente depois." + botões "Entrar ou criar conta" (primário) e "Agora não" (secundário) — ver 6.2.
- **Tag de indisponibilidade** (tela Favoritos): mesma tag "Produto indisponível" já usada na Recompra (ver 6.7).

## 9. Modelo de dados / eventos a rastrear (requisito para indicadores)

- `consumidor_id`, `ean`, `timestamp_favoritado`, `loja_ativa_no_momento_id` (loja ativa quando o favorito foi criado, apenas para analytics — não afeta a regra 6.1)
- Evento `produto_favoritado` (origem: PDP) e `produto_desfavoritado` (origem: PDP ou tela Favoritos)
- `bottom_sheet_autenticacao_exibido` (booleano) e resultado (`login_iniciado` | `dispensado`) — para medir fricção de login na conversão de favoritar
- Na tela Favoritos: `visualizacoes_tela_favoritos`, `cliques_adicionar_rapido` (por EAN), `avancou_para_checkout` e `concluiu_compra` a partir de um clique originado na tela Favoritos — para ligar a feature à NSM

## 10. Indicadores / relatórios (fase 2 — requisitos de dados definidos agora, UI a definir com UX depois)

1. Total de produtos favoritados por Consumidor (média e distribuição).
2. Taxa de conversão: favoritar → adicionar ao carrinho (via "+") → concluir compra.
3. Taxa de abandono no bottom sheet de autenticação ("Entrar ou criar conta" vs. "Agora não").
4. Produtos mais favoritados (insumo para times de Portal/Catálogo e para curadoria de ofertas).
5. Taxa de itens favoritados que ficam indisponíveis na loja ativa (qualidade de estoque cadastrado, mesmo insumo já levantado na Recompra).
6. Tempo médio entre favoritar um produto e a primeira compra dele via tela Favoritos.

## 11. Casos de borda / edge cases

| Cenário | Comportamento esperado |
|---|---|
| Consumidor não logado toca no coração na PDP | Bottom sheet de autenticação (6.2); favorito não é salvo até login. |
| Consumidor favorita o mesmo produto em duas lojas diferentes (troca de loja ativa entre as duas ações) | Um único favorito por EAN — a segunda ação em outra loja não duplica o item, só atualiza a referência de "quando foi favoritado" se aplicável. |
| Produto favoritado sai do catálogo da loja ativa | Permanece na lista com tag "Indisponível" (6.7), não é removido automaticamente. |
| Produto favoritado volta a ficar disponível na loja ativa | Tag de indisponibilidade some, botão "+" volta a ficar ativo — sem necessidade de o Consumidor refavoritar. |
| Consumidor desfavorita o último item da lista | Lista passa a exibir o estado vazio dedicado (6.10). |
| Consumidor toca "+" em um card disponível na tela Favoritos | Produto adicionado ao carrinho da loja ativa, quantidade 1, sem sair da tela Favoritos (mesmo padrão de outras listagens do App). |
| Consumidor troca de loja ativa estando na tela Favoritos | Lista recarrega com preço/estoque da nova loja ativa; itens que ficam indisponíveis na nova loja passam a exibir a tag (6.7). |

## 12. Critérios de aceite (exemplos, formato Given/When/Then)

**Favoritar com sucesso (logado)**
- Dado um Consumidor logado navegando na PDP de um produto não favoritado,
- Quando ele toca no ícone de coração,
- Então o coração passa a exibir o estado preenchido/vermelho, um toast "Adicionado aos favoritos" é exibido com o link "Ver favoritos", e o produto passa a constar na tela Favoritos.

**Bloqueio por falta de login**
- Dado um Consumidor não logado navegando na PDP de um produto,
- Quando ele toca no ícone de coração,
- Então o bottom sheet "Salve seus produtos favoritos" é exibido e o produto não é favoritado até que o login seja concluído.

**Dispensar login**
- Dado o bottom sheet de autenticação aberto,
- Quando o Consumidor toca em "Agora não",
- Então o bottom sheet fecha, o coração permanece no estado vazio e nenhum favorito é criado.

**Favoritar após concluir login pendente**
- Dado um Consumidor não logado que tocou no coração de um produto e, a partir do bottom sheet, escolheu "Entrar ou criar conta",
- Quando ele conclui o login ou cadastro,
- Então o produto é favoritado automaticamente (sem exigir um novo toque no coração), o Consumidor retorna à PDP e vê o coração preenchido/vermelho junto com o toast "Adicionado aos favoritos".

**Estado vazio da tela Favoritos**
- Dado um Consumidor logado sem nenhum produto favoritado,
- Quando ele acessa a tela Favoritos (via menu de Perfil),
- Então o estado vazio dedicado é exibido, conforme protótipo Figma a ser detalhado na história técnica (6.10).

**Desfavoritar pela PDP**
- Dado um produto já favoritado sendo exibido na PDP,
- Quando o Consumidor toca no coração preenchido,
- Então o coração volta ao estado vazio, um toast "Removido dos favoritos" é exibido, e o produto some da tela Favoritos.

**Desfavoritar pela tela Favoritos**
- Dado a tela Favoritos exibindo um card de produto favoritado,
- Quando o Consumidor toca no coração desse card,
- Então o card é removido da lista e um toast "Removido dos favoritos" é exibido.

**Preço/estoque sempre da loja ativa**
- Dado um produto favoritado enquanto a Loja A estava ativa, com o Consumidor depois trocando para a Loja B como loja ativa,
- Quando o Consumidor abre a tela Favoritos,
- Então o card desse produto exibe preço e estoque vigentes na Loja B, não os da Loja A.

**Produto indisponível permanece na lista**
- Dado um produto favoritado que está sem estoque na loja ativa,
- Quando o Consumidor abre a tela Favoritos,
- Então o card desse produto aparece com a tag "Produto indisponível" e sem o botão "+" ativo, sem ser removido da lista.

**Adição rápida ao carrinho**
- Dado um produto favoritado disponível na loja ativa, exibido na tela Favoritos,
- Quando o Consumidor toca no botão "+" do card,
- Então uma unidade do produto é adicionada ao carrinho da loja ativa, sem navegação para fora da tela Favoritos.

**Acesso via menu de Perfil**
- Dado um Consumidor logado na tela de Perfil,
- Quando ele toca no item de menu "Favoritos",
- Então a tela Favoritos é exibida com todos os produtos favoritados por ele.

## 13. Fora do escopo (recapitulando dependências de outras squads/PRDs)

- Seleção de loja ativa: pré-condição do produto, fora desta PRD.
- Cálculo de estoque em tempo real por EAN na loja ativa: mesma dependência já levantada na Recompra (ver `specs/features/001-app-ecommerce/repetir pedido/PRD-refazer-pedido-app.md`, seção 15).
- Fluxo de login/criação de conta: reaproveita o fluxo de autenticação já existente no App.
- Adição ao carrinho e checkout: reaproveita os fluxos padrão já existentes.

## 14. Anexo — Referência visual (protótipo analisado)

- **Link Figma:** https://www.figma.com/design/7Pi4v28TLqe0YhcqqKAEjR/App-%C2%B7-E-commerce?node-id=3459-14776
- **Página do Figma:** "23. Favoritar produtos 📦" (canvas `3459:14776`)
- **Frames identificados (por nome no canvas):**
  - `3464:7929` "like off" — PDP com coração vazio (produto não favoritado).
  - `3464:8216` "like off" — PDP com coração preenchido/vermelho (produto favoritado) — mesmo nome de frame, estado diferente.
  - `3464:8428` "adicionado aos favoritos" — PDP com toast de sucesso "Adicionado aos favoritos" + link "Ver favoritos".
  - `3464:12884` "página favoritos" — tela Favoritos, grade 2 colunas.
  - `3464:13106` "removido" — tela Favoritos com toast "Removido dos favoritos".
  - `3464:13105` "perfil" — tela de Perfil, com item de menu "Favoritos" na seção "Conta".
  - `3464:13279` "bottom sheet - favoritar não logado" — bottom sheet de autenticação obrigatória.
- **Observação técnica:** a leitura foi feita via Figma Dev Mode MCP Server (`get_metadata` + `get_screenshot`), com acesso à estrutura exata dos frames. Não foi chamado `get_design_context` (extração de tokens/código), pois esta PRD é de produto, não de implementação — recomenda-se chamá-lo à parte na etapa de geração de histórias técnicas de UI.
- **Estado vazio:** ainda não estava no protótipo analisado nesta versão — já alinhado com UX, será disponibilizado no Figma antes da escrita das histórias técnicas (ver regra 6.10).

## 15. Dependências e itens abertos

Nenhum item em aberto nesta versão (v1.1) — pendências anteriores resolvidas com o PO (ver changelog).

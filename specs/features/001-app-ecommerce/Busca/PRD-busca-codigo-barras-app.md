# PRD — Busca de Produtos por Código de Barras no App

**Produto:** Radar (App — Consumidor Final)
**Squad:** App
**Autor:** Daniel (PO)
**Status:** Em refinamento — base para geração de histórias via Claude Code
**Versão:** 1.1
**Epics relacionados:** A definir (nenhum épico Jira vinculado ainda)

---

## 0. Changelog

**v1.1 (2026-09-22)** — Pendências da seção 15 resolvidas com o PO: (1) falha de rede ou erro no lookup do EAN reaproveita o tratamento de erro de rede padrão da busca (nova regra 6.7); (2) removido o cenário de EAN associado a mais de um produto, que não existe no catálogo atual (um EAN corresponde a um único produto, regra 6.4); (3) a permissão de câmera segue o comportamento nativo de cada sistema operacional, inclusive o caminho nativo de abrir as configurações do aparelho quando o acesso já foi negado (regra 6.2 reescrita, nota técnica removida).

**v1.0 (2026-09-22)** — Primeira versão. Documenta a funcionalidade **Busca por código de barras** com base no protótipo Figma da página "22. Busca por código de barras 📦" (arquivo "App · E-commerce", node `3459:14775`), no cenário 10 do estudo de busca (`specs/features/001-app-ecommerce/Busca/estudo-busca-miro.md`) e nas decisões de escopo alinhadas com o PO em sessão de dúvidas.

---

## 1. Contexto

Hoje, para encontrar um produto no App, o Consumidor precisa digitar o nome na busca ou navegar pelas categorias. Isso é mais difícil quando o produto já está na mão (a embalagem que acabou em casa) e o nome é longo, técnico ou difícil de escrever. A dificuldade de busca é uma dor já mapeada em `context/product.md` e aparece no KPI "Taxa de conversão da busca".

O estudo de busca (`estudo-busca-miro.md`, requisito 10) já previa esse cenário: *"direcionar o usuário para a tela de detalhes do produto escaneado. Caso o produto não exista no catálogo, apresentar a tela com o placeholder de nenhum produto encontrado."* O plano de integração com o Typesense (`Busca/plano-integracao-typesense.md`, cenário 10) registra que o scan **não é uma busca full-text**. É um lookup direto por EAN, e o App decide o fallback de "produto não encontrado".

O protótipo Figma adiciona um ícone de scanner na barra de busca da home. O ícone abre a câmera, lê o código de barras da embalagem e leva o Consumidor direto ao produto na loja ativa.

## 2. Objetivo

Permitir que o Consumidor encontre um produto apontando a câmera para o código de barras (EAN) da embalagem, sem digitar nada, e chegue à PDP do produto na **loja ativa** pronto para comprar.

**Impacto na NSM:** o scan elimina o passo mais sujeito a erro da busca (digitar o nome do produto) e leva o Consumidor da intenção de recompra ("acabou, quero outro igual") direto à PDP da Loja Ativa. Menos atrito entre a intenção e o carrinho significa mais transações por Loja Ativa. O efeito também deve aparecer no KPI "Taxa de conversão da busca".

## 3. Escopo

### Dentro do escopo (V1)

- Ícone de scanner de código de barras dentro da **barra de busca da home** ("O que você precisa?"), ao lado da lupa.
- Pedido de permissão de acesso à câmera no primeiro uso.
- Tela de scanner em tela cheia (fundo preto, câmera ativa) com:
  - moldura de enquadramento;
  - dica "Posicione o código de barras no quadro acima";
  - botão de **flash** (liga/desliga);
  - botão **fechar (X)**.
- Leitura automática, sem botão de "capturar", dos formatos **EAN-13 e EAN-8**.
- Lookup direto por EAN no catálogo, com três desfechos possíveis (seção 6.4):
  1. produto disponível na loja ativa → **PDP**;
  2. produto existe no catálogo, mas está indisponível na loja ativa → **tela de resultado de busca** com o card do produto como indisponível (comportamento já existente no App);
  3. EAN não existe no catálogo → tela **"Produto não encontrado"**, com as ações "Escanear novamente" e "Buscar produto".
- Funciona para Consumidor **logado e não logado**. A única pré-condição é ter uma loja ativa, igual à busca por texto.

### Fora do escopo (V1)

- Ícone de scanner em outras barras de busca, como a tela de busca/resultados. Nesta versão ele existe só na home.
- Formatos além de EAN-13 e EAN-8, como QR Code, UPC-A/UPC-E, DataMatrix e códigos de receita.
- Leitura de código de barras a partir de uma foto da galeria.
- Digitação manual do número do EAN como alternativa ao scan.
- Scan de vários produtos em sequência (modo "lista de compras").
- Histórico de produtos escaneados.
- Pré-alerta ou tela própria do App para pedir ou recuperar a permissão de câmera. A V1 usa só o comportamento nativo de cada sistema operacional (ver regra 6.2).
- Timeout ou dica automática quando nenhum código é lido (ver regra 6.3).
- Qualquer fluxo de seleção de loja: a feature assume que o Consumidor **sempre** tem uma loja ativa selecionada (mesma pré-condição da Recompra e de Favoritar).

## 4. Personas

A feature serve a qualquer persona. Qualquer Consumidor do App (Consumidor Fidelizado, Consumidor PBM ou Consumidor Eventual, ver `context/product.md`) pode usar o scanner, logado ou não. O caso de uso mais forte é o **Consumidor Fidelizado** repondo um produto de uso contínuo que tem em mãos.

## 5. Fluxo

```
Consumidor está na Home
          │
          ▼
Toca no ícone de scanner na barra de busca
          │
          ▼
  Permissão da câmera já concedida?
     ┌────┴──────────────────┬──────────────────────────┐
     ▼ Sim                    ▼ Não (1º uso)              ▼ Já negada antes
     │               Pedido de permissão NATIVO     Caminho nativo do SO:
     │               do sistema operacional         abre as configurações
     │               "O app deseja ter acesso       do App no aparelho
     │                a sua câmera."
     │               ┌──────────┴───────────┐
     │               ▼ Permitir              ▼ Não Permitir
     │               │                       │
     │               │                       ▼
     │               │                 Volta para a Home
     │               │                 (nada mais acontece)
     └───────┬───────┘
             ▼
  Tela de scanner (câmera + moldura + flash + X)
             │
     ┌───────┴────────────────┐
     ▼ lê EAN-13/EAN-8         ▼ toca no X
     │                         Volta para a Home
     ▼
  Lookup do EAN no catálogo, considerando a loja ativa
     │
     ├── Falha de rede / timeout ───────────────► Tratamento de erro de rede
     │                                             padrão da busca
     │
     ├── Produto disponível na loja ativa ──────► PDP do produto
     │
     ├── Existe no catálogo, mas indisponível ──► Resultado de busca com o
     │   na loja ativa                             card do produto indisponível
     │                                             (comportamento atual do App)
     │
     └── EAN não existe no catálogo ────────────► "Produto não encontrado"
                                                  ┌──────────┴──────────┐
                                                  ▼                      ▼
                                        "Escanear novamente"     "Buscar produto"
                                        (volta ao scanner)       (busca vazia, campo
                                                                  focado, teclado aberto)
```

## 6. Regras de negócio

### 6.1 Ponto de entrada
- O ícone de scanner fica **somente** na barra de busca da **home**, à direita da lupa, como no Figma.
- Tocar no ícone não abre a busca por texto. Ele inicia o fluxo de scanner (6.2).

### 6.2 Permissão de câmera
- A permissão de câmera usa **sempre o comportamento nativo de cada sistema operacional** (iOS e Android). O App não cria pré-alerta, tela ou mensagem própria para pedir, negar ou recuperar o acesso à câmera.
- **Primeiro uso:** ao tocar no ícone de scanner, o App dispara o pedido de permissão nativo do sistema operacional. O alerta do protótipo ("O app deseja ter acesso a sua câmera." + "Permitir" / "Não Permitir") é uma representação desse pedido nativo, não uma tela do App.
  - O texto de apoio do protótipo, **"Ative o uso da sua câmera para ter uma experiência completa em nosso aplicativo como escanear códigos de barras."**, é usado como texto de justificativa onde o sistema operacional permite customizar (no iOS, a *usage description* do `Info.plist`). Título, botões e demais textos são os definidos pelo sistema operacional.
- **Permitir** abre a tela de scanner (6.3).
- **Não Permitir** fecha o pedido e o Consumidor **permanece na Home**.
- **Permissão já negada antes:** quando o sistema operacional não exibe mais o pedido de permissão, um novo toque no ícone de scanner segue o **caminho nativo de abrir as configurações do App no aparelho**, como outros apps fazem, para que o Consumidor habilite a câmera por lá. Ao voltar ao App com a permissão concedida, o próximo toque no ícone abre o scanner normalmente.
- **Permissão já concedida:** o toque no ícone abre direto a tela de scanner, sem novo pedido.

### 6.3 Tela de scanner
- Tela cheia com a câmera traseira ativa, moldura de enquadramento no centro e a dica **"Posicione o código de barras no quadro acima"** abaixo da moldura.
- **Flash:** botão no canto superior esquerdo que alterna entre ligado e desligado (ícones `flash_on` / `flash off` do Figma). Começa desligado.
- **Fechar (X):** botão no canto superior direito que fecha o scanner e volta para a Home.
- A leitura é **automática**: assim que um EAN-13 ou EAN-8 válido é identificado, o scanner fecha e o lookup começa (6.4). Não existe botão de captura.
- **Sem timeout:** a câmera fica aberta até ler um código ou até o Consumidor tocar no X. Não há dica automática depois de um tempo sem leitura.
- Códigos de outros formatos, como QR Code e UPC, são ignorados: o scanner continua aberto aguardando um EAN.

### 6.4 Resultado do lookup por EAN
O EAN lido é consultado diretamente no catálogo (lookup exato, não busca full-text; ver `plano-integracao-typesense.md`, cenário 10), considerando a **loja ativa** do Consumidor. No catálogo atual, um EAN corresponde a **um único produto**, então o lookup sempre resulta em no máximo um produto:

| Situação do EAN | Destino |
|---|---|
| Produto existe no catálogo **e** está disponível na loja ativa | **PDP** do produto. |
| Produto existe no catálogo, mas **não é vendido ou está sem estoque** na loja ativa | **Tela de resultado de busca**, exibindo o card do produto com o estado de indisponível. É o mesmo comportamento que o App já tem hoje na busca por texto, e essa tela não está no protótipo. |
| EAN **não existe** no catálogo | Tela **"Produto não encontrado"** (6.5). |

- A PDP aberta pelo scan é a **mesma PDP** usada no restante do App, com todas as suas regras vigentes: preço de/por, formas de entrega, regras de **Controlados** e bloco PBM quando e se estiver disponível. O scan só muda o caminho até a PDP, não o conteúdo dela. O bloco PBM que aparece no frame "produto encontrado" do Figma é ilustrativo e não é requisito desta PRD.

### 6.5 Tela "Produto não encontrado"
- Ilustração de celular com código de barras e um "X". Título **"Produto não encontrado"** e texto de apoio **"Não encontramos nenhum produto para o código de barras escaneado"**.
- **"Escanear novamente"** (botão primário): reabre a tela de scanner (6.3) sem novo pedido de permissão.
- **"Buscar produto"** (link secundário): abre a **tela de busca vazia**, com o campo focado e o teclado aberto, para o Consumidor digitar o nome do produto. O EAN escaneado **não** é preenchido no campo.

### 6.6 Autenticação
- O scanner **não exige login**. Consumidor não logado usa o fluxo completo (scan → PDP ou resultado → carrinho) nas mesmas condições da busca por texto. Exigências de login posteriores, como no checkout, seguem as regras já existentes.

### 6.7 Falha de rede ou erro no lookup
- Se o lookup do EAN falhar (sem conexão, timeout ou erro do serviço), o App **reaproveita o tratamento de erro de rede padrão já existente na busca por texto**. Não há tela ou mensagem nova para o scanner.
- Uma falha de rede **não** leva à tela "Produto não encontrado". Essa tela é exclusiva para EAN que não existe no catálogo (6.5).

## 7. Pontos de entrada (UI)

| Local | Elemento | Observação |
|---|---|---|
| Home — barra de busca "O que você precisa?" | Ícone de código de barras à direita da lupa | Único ponto de entrada nesta V1 (6.1). |
| Tela "Produto não encontrado" | Botão "Escanear novamente" | Reentrada no scanner (6.5). |

## 8. Mensagens, alertas e estados

- **Pedido de permissão da câmera:** pedido nativo do sistema operacional. O texto de justificativa é "Ative o uso da sua câmera para ter uma experiência completa em nosso aplicativo como escanear códigos de barras." onde o sistema permite customizar (6.2).
- **Falha de rede no lookup:** tratamento de erro de rede padrão da busca (6.7).
- **Dica do scanner:** "Posicione o código de barras no quadro acima" (6.3).
- **Produto não encontrado:** título "Produto não encontrado" + "Não encontramos nenhum produto para o código de barras escaneado" + botão "Escanear novamente" + link "Buscar produto" (6.5).
- **Produto indisponível na loja ativa:** card indisponível na tela de resultado de busca atual. Não há nova mensagem (6.4).

## 9. Modelo de dados / eventos a rastrear (requisito para indicadores)

- `scanner_aberto` (origem: `home` | `nao_encontrado_escanear_novamente`), `consumidor_id` (quando logado), `loja_ativa_id`.
- `permissao_camera_solicitada` e resultado (`concedida` | `negada`).
- `scanner_fechado_sem_leitura` (Consumidor tocou no X sem ler nenhum código) e tempo em tela.
- `flash_alternado` (ligado/desligado).
- `codigo_lido`: `ean`, `formato` (EAN-13 | EAN-8) e tempo entre abrir o scanner e ler o código.
- `resultado_lookup`: `pdp` | `indisponivel_loja` | `nao_encontrado`, com o `ean`.
- Na tela "Produto não encontrado": `escanear_novamente_clicado` e `buscar_produto_clicado`.
- Conversão: `adicionou_ao_carrinho` e `concluiu_compra` a partir de uma PDP aberta pelo scan (atribuição `origem = scanner`), para ligar a feature à NSM.

## 10. Indicadores / relatórios (fase 2 — requisitos de dados definidos agora, UI a definir com UX depois)

1. Uso do scanner: aberturas por dia e % de Consumidores ativos que usaram o scanner.
2. Taxa de concessão da permissão de câmera (concedida ÷ solicitada).
3. Taxa de leitura com sucesso (código lido ÷ scanner aberto) e taxa de abandono (fechou sem ler).
4. Distribuição do resultado do lookup: PDP, indisponível na loja ativa e não encontrado.
5. **EANs não encontrados mais escaneados**: insumo para o time de Catálogo e para o fluxo de Solicitação de produto (ver glossário).
6. **EANs indisponíveis na loja ativa mais escaneados**: insumo para o Lojista sobre demanda não atendida (ruptura/sortimento).
7. Conversão scan → carrinho → compra, comparada com a conversão da busca por texto (KPI "Taxa de conversão da busca").

## 11. Casos de borda / edge cases

| Cenário | Comportamento esperado |
|---|---|
| Consumidor toca em "Não Permitir" no pedido de câmera | Fecha o pedido nativo e permanece na Home (6.2). |
| Consumidor já negou a câmera antes e toca no ícone de novo | Caminho nativo de abrir as configurações do App no aparelho, sem tela própria do App (6.2). |
| Consumidor habilita a câmera nas configurações e volta ao App | O próximo toque no ícone abre o scanner direto, sem novo pedido (6.2). |
| Consumidor aponta para um QR Code ou UPC | O código é ignorado e o scanner continua aberto aguardando um EAN-13/EAN-8 (6.3). |
| Nenhum código é lido por muito tempo (código danificado, pouca luz) | O scanner continua aberto sem timeout. O Consumidor pode ligar o flash ou sair pelo X (6.3). |
| EAN existe no catálogo, mas não é vendido ou está sem estoque na loja ativa | Tela de resultado de busca com o card indisponível (6.4). |
| EAN escaneado é de um medicamento Controlado | Abre a PDP normalmente, com as regras de Controlados já vigentes (6.4). |
| Consumidor não logado escaneia um produto | O fluxo funciona normalmente. Login só é exigido onde já é hoje, como no checkout (6.6). |
| Consumidor toca em "Buscar produto" na tela de não encontrado | Abre a busca vazia com o teclado aberto, sem o EAN preenchido (6.5). |
| Consumidor toca em "Escanear novamente" | Reabre o scanner direto, sem novo pedido de permissão (6.5). |
| Falha de rede ou timeout durante o lookup | Tratamento de erro de rede padrão da busca. Não exibe "Produto não encontrado" (6.7). |

## 12. Critérios de aceite (exemplos, formato Given/When/Then)

**Abrir o scanner com permissão já concedida**
- Dado um Consumidor na Home que já concedeu acesso à câmera,
- Quando ele toca no ícone de scanner na barra de busca,
- Então a tela de scanner é exibida com a câmera ativa, a moldura, a dica "Posicione o código de barras no quadro acima" e os botões de flash e fechar.

**Primeiro uso — permissão concedida**
- Dado um Consumidor na Home que nunca respondeu ao pedido de câmera,
- Quando ele toca no ícone de scanner e depois em "Permitir",
- Então a tela de scanner é exibida com a câmera ativa.

**Primeiro uso — permissão negada**
- Dado um Consumidor na Home que nunca respondeu ao pedido de câmera,
- Quando ele toca no ícone de scanner e depois em "Não Permitir",
- Então o pedido fecha e o Consumidor permanece na Home, sem nenhuma tela ou mensagem extra.

**Permissão já negada anteriormente**
- Dado um Consumidor na Home que já negou o acesso à câmera e para quem o sistema operacional não exibe mais o pedido de permissão,
- Quando ele toca no ícone de scanner,
- Então o App segue o caminho nativo do sistema operacional e abre as configurações do App no aparelho, sem exibir tela própria.

**Produto encontrado e disponível**
- Dado a tela de scanner aberta e um produto disponível na loja ativa,
- Quando o Consumidor enquadra o EAN-13 ou EAN-8 desse produto,
- Então o código é lido automaticamente e a PDP do produto é exibida com preço e disponibilidade da loja ativa.

**Produto indisponível na loja ativa**
- Dado a tela de scanner aberta e um produto que existe no catálogo, mas está sem estoque ou não é vendido na loja ativa,
- Quando o Consumidor enquadra o EAN desse produto,
- Então a tela de resultado de busca é exibida com o card do produto no estado de indisponível.

**Produto não encontrado**
- Dado a tela de scanner aberta,
- Quando o Consumidor enquadra um EAN que não existe no catálogo,
- Então a tela "Produto não encontrado" é exibida com o texto "Não encontramos nenhum produto para o código de barras escaneado", o botão "Escanear novamente" e o link "Buscar produto".

**Escanear novamente**
- Dado a tela "Produto não encontrado",
- Quando o Consumidor toca em "Escanear novamente",
- Então a tela de scanner é reaberta sem novo pedido de permissão.

**Buscar produto**
- Dado a tela "Produto não encontrado",
- Quando o Consumidor toca em "Buscar produto",
- Então a tela de busca é aberta com o campo vazio, focado e com o teclado aberto.

**Flash**
- Dado a tela de scanner aberta com o flash desligado,
- Quando o Consumidor toca no botão de flash,
- Então a lanterna do aparelho acende e o ícone muda para o estado ligado. Um novo toque desliga a lanterna e volta o ícone ao estado desligado.

**Fechar o scanner**
- Dado a tela de scanner aberta,
- Quando o Consumidor toca no X,
- Então o scanner fecha, a câmera e o flash são desligados e o Consumidor volta para a Home.

**Formato não suportado**
- Dado a tela de scanner aberta,
- Quando o Consumidor enquadra um QR Code,
- Então nenhum lookup é disparado e o scanner continua aberto.

**Falha de rede no lookup**
- Dado a tela de scanner aberta e o aparelho sem conexão,
- Quando o Consumidor enquadra um EAN válido,
- Então o App exibe o tratamento de erro de rede padrão da busca, e não a tela "Produto não encontrado".

**Consumidor não logado**
- Dado um Consumidor não logado com loja ativa na Home,
- Quando ele usa o scanner e lê o EAN de um produto disponível,
- Então a PDP do produto é exibida sem nenhum pedido de login.

## 13. Fora do escopo (recapitulando dependências de outras squads/PRDs)

- Seleção de loja ativa: pré-condição do produto, fora desta PRD.
- Lookup por EAN no catálogo/índice de busca: depende do motor de busca vigente (Elasticsearch hoje, Typesense planejado; ver `Busca/plano-integracao-typesense.md`).
- Tela de resultado de busca com card indisponível: reaproveita o comportamento já existente no App.
- PDP, carrinho, checkout e regras de Controlados/PBM: reaproveitam os fluxos já existentes.

## 14. Anexo — Referência visual (protótipo analisado)

- **Link Figma:** https://www.figma.com/design/7Pi4v28TLqe0YhcqqKAEjR/App-%C2%B7-E-commerce?node-id=3459-14775
- **Página do Figma:** "22. Busca por código de barras 📦" (canvas `3459:14775`)
- **Frames identificados (por nome no canvas):**
  - `3464:1756` "home": Home com o ícone de scanner na barra de busca.
  - `3464:2284` "home": Home com o alerta de permissão de câmera (`3464:4302` "Alert"), que representa o pedido nativo do sistema operacional (6.2).
  - `3464:4349` "scan": tela de scanner (moldura, dica, flash, X).
  - `3464:4845` "flash_on" / `3464:4850` "flash off": estados do ícone de flash.
  - `3464:6720` "produto encontrado": PDP do produto escaneado (o bloco PBM é ilustrativo; ver 6.4).
  - `3464:7888` "não encontrado": tela "Produto não encontrado".
- **Não está no Figma:** a tela de resultado de busca com card indisponível. É um comportamento já existente no App.
- **Observação técnica:** a leitura foi feita via Figma MCP (`get_metadata` + `get_screenshot`). Não foi chamado `get_design_context`, porque esta PRD é de produto, não de implementação. Recomenda-se chamá-lo à parte na etapa de histórias técnicas de UI.

## 15. Dependências e itens abertos

Nenhum item em aberto nesta versão (v1.1). As pendências da v1.0 foram resolvidas com o PO (ver changelog).

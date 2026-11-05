# Listas CRM

**Módulo:** Área Admin (acesso somente Admin)
**Épico:** [ECP-1756](https://farmarcas.atlassian.net/browse/ECP-1756) — CRM - Lista de Produtos
**Histórias:** [ECP-1757](https://farmarcas.atlassian.net/browse/ECP-1757) — Item na sidebar; [ECP-1758](https://farmarcas.atlassian.net/browse/ECP-1758) — Estrutura da tela e acesso Admin; [ECP-1759](https://farmarcas.atlassian.net/browse/ECP-1759) — Listagem; [ECP-1760](https://farmarcas.atlassian.net/browse/ECP-1760) — Drawer de criação; [ECP-1761](https://farmarcas.atlassian.net/browse/ECP-1761) — Baixar modelo; [ECP-1762](https://farmarcas.atlassian.net/browse/ECP-1762) — Importar planilha
**Referência UX:** protótipo "Listas CRM" (prints da listagem e do drawer "Editar lista") — sem demanda UX registrada
**Spec de origem (App):** `specs/features/001-app-ecommerce/Deeplink/PRD-deeplink-app.md` (contrato de deeplink e destino `promotion-products`)
**Status:** Pronto para fatiamento
**Última atualização:** 2026-11-05

---

## 1. O que é

Tela do Portal em que o **Admin** cria **listas de produtos** (identificados por EAN) para campanhas de CRM. Cada lista gera um **link de deeplink** que abre, direto no app do Consumidor, a seleção de produtos da lista. O link pode ser copiado e usado em canais de comunicação (SMS, e-mail, WhatsApp, anúncios).

Uma lista pode ser **inativada**: o link deixa de funcionar. Pode ser reativada e editada (nome e produtos).

**Impacto na NSM (Volume de Transações por Loja Ativa):** leva o Consumidor direto aos produtos da campanha, reduzindo a fricção entre a comunicação de CRM e a compra.

## 2. Acesso e navegação

- **Somente Admin.** Gestor de Rede, Gestor de Loja e Balconista não veem o item de menu e são bloqueados por rota (acesso por URL é redirecionado para a primeira tela a que o usuário tem acesso), conforme a regra de guard de [Sidebar-e-Modulos-de-Navegacao.md](../Shell/Sidebar-e-Modulos-de-Navegacao.md) §3.2.
- **Item na sidebar:** ícone de lista com checklist, rótulo "Listas CRM", na seção **"ÁREA ADMIN"**, junto de "Produtos". (No protótipo o ícone aparece junto de Usuários; a decisão do PO é colocá-lo na Área Admin.)
- O item da tela atual aparece destacado, como nos demais itens.

## 3. Estrutura da tela

### 3.1 Cabeçalho da página

- Título "Listas CRM".
- Subtítulo: "Crie listas de produtos para campanhas e gere um link que abre a seleção direto no app."
- Botão primário **"Nova lista"** (canto direito), que abre o drawer de criação (seção 4).

### 3.2 Busca e contador

- Campo "Buscar lista": filtra pelo **nome da lista**. Dispara ao digitar, com debounce de 2 segundos, sem Enter.
- Contador à direita: "N listas" (total exibido após a busca).

### 3.3 Tabela de listas

| Coluna | Conteúdo |
|---|---|
| Nome da lista | Nome informado na criação |
| Produtos | Quantidade de produtos da lista (EANs encontrados no catálogo; número) |
| Link gerado | Link em fonte monoespaçada, com ícone de copiar ao lado |
| Status | Switch Ativa / Inativa, com o rótulo ao lado |
| Criada em | Data de criação, `dd/mm/aaaa` |
| (ações) | Ícone de lápis: editar lista |

- Linha **inativa** aparece esmaecida (nome, quantidade, link e ícone de copiar), com o switch desligado e o rótulo "Inativa".
- **Link gerado:** exibido exatamente como o backend o devolve, no padrão `app.radarfarmarcas.com.br/?/promotionProductsId=<código>`. O "?" é literal: é substituído depois, manualmente, pelo time de CRM pelo nome da rede, fora do Portal. O Portal não altera o link.
- **Copiar link:** o ícone copia o link (com o "?") para a área de transferência e exibe o toast "Link copiado".
- **Ativar/inativar:** o switch altera o status na hora. Ao inativar, toast: "Lista inativada. O link deixa de funcionar." Ao ativar, toast: "Lista ativada. O link voltou a funcionar." Se a chamada falhar, o switch volta ao estado anterior e um toast de erro é exibido.
- **Ordenação padrão:** mais recentes primeiro (data de criação decrescente).
- Estados de listagem: carregando, vazio ("nenhuma lista criada", com chamada para "Nova lista") e erro com botão "Atualizar". Busca sem resultado exibe mensagem própria.

## 4. Drawer de criação e edição

O mesmo drawer atende criação e edição. Abre sobre a tela, pelo lado direito, com botão de fechar (X).

| Elemento | Criação | Edição |
|---|---|---|
| Título | "Nova lista" | "Editar lista" |
| Subtítulo | O app troca o "?" do link pelo nome da rede | igual |
| Campo "Nome da lista" | vazio | preenchido com o nome atual |
| Campo "Produtos (EAN)" | vazio, com exemplo | carregado com os EANs atuais da lista |
| Link da lista | gerado ao criar | **não muda** ao editar |
| Botão primário | "Criar lista e gerar link" | "Salvar alterações" |
| Botão secundário | "Cancelar" | "Cancelar" |

### 4.1 Campo "Produtos (EAN)"

- Caixa de texto multilinha, com placeholder: "Cole os EANs dos produtos separados por vírgula. Ex.: 7896000100231, 7896000100245".
- Texto de apoio: "Somente EAN (13 dígitos) separado por vírgula. Repetidos são ignorados." com o atalho **"Usar exemplo"**, que preenche o campo com EANs de exemplo.
- Ao lado do rótulo, dois atalhos: **"Baixar modelo"** (seção 5) e **"Importar planilha (CSV ou XLSX)"** (seção 6).

### 4.2 Regras de validação

- Nome da lista obrigatório.
- Ao menos 1 EAN válido.
- EAN válido = 13 dígitos numéricos. A validação de formato é feita antes de salvar; entradas inválidas bloqueiam o salvamento.
- **Consulta ao catálogo ao salvar:** o back-end resolve cada EAN para o `productId` do produto ativo no catálogo. EAN que não existe no catálogo (ou cujo produto está inativo) **não bloqueia**: a lista é criada/atualizada com os EANs encontrados e o drawer exibe um aviso listando os EANs ignorados (ex.: "Lista criada. 2 EANs não foram encontrados no catálogo e ficaram de fora: 7896000100999, 7896000100888"). O EAN digitado continua guardado na lista, de modo que a edição reabre exatamente o que o CRM enviou.
- Premissa: o catálogo terá EAN único e `productId` único (limpeza em andamento pelo time Comercial); EAN com mais de um produto não é tratado por esta tela.
- Se nenhum EAN for encontrado no catálogo, a lista não é criada e o drawer exibe erro ("Nenhum dos EANs informados foi encontrado no catálogo").
- O campo mostra mensagem de erro listando os valores inválidos (ex.: "EANs inválidos: 78960001, ABC").
- EANs repetidos são ignorados (conta uma vez só).
- Limite de **500 EANs** por lista (confirmado pelo PO). Acima disso, mensagem de erro e salvamento bloqueado.
- O botão primário só fica habilitado com nome e ao menos 1 EAN válido.
- Cancelar ou fechar (X) com alterações não salvas abre confirmação "Descartar alterações?" com "Continuar editando" e "Descartar". Sem alterações, fecha direto.

### 4.3 Criar lista e gerar link

Ao confirmar, o Portal cria a lista com status **Ativa**, o **backend gera o link** e o drawer fecha (se houver EANs ignorados, o aviso da seção 4.2 é exibido). A lista nova aparece na tabela. O link identifica a lista pelo parâmetro `promotionProductsId` (código aleatório de 8 caracteres, único) e é gerado uma única vez, na criação.

## 5. Baixar modelo

O atalho "Baixar modelo" baixa o arquivo `modelo-lista-crm.csv`, para o usuário preencher e importar:

- Coluna única `ean`, com cabeçalho na primeira linha.
- Duas linhas de exemplo: `7896000100231` e `7896000100245`.
- CSV em UTF-8. Na importação, o Portal aceita CSV separado por vírgula ou ponto e vírgula, e XLSX (lê a primeira aba, primeira coluna).

## 6. Importar planilha

- Aceita **CSV ou XLSX**.
- O arquivo é enviado ao back-end do Portal, que lê os EANs e devolve a lista; o Portal os **soma** aos que já estão no campo "Produtos (EAN)", aplicando as mesmas regras da seção 4.2 (13 dígitos, repetidos ignorados, limite). A importação só preenche o campo: a consulta ao catálogo acontece ao salvar a lista.
- O arquivo aparece num cartão de status abaixo do campo: nome do arquivo e "Upload concluído com sucesso" (verde), com botão X para remover o arquivo. Remover o arquivo retira do campo os EANs que vieram dele.
- Erros, com cartão vermelho e mensagem: formato não suportado (só CSV ou XLSX), arquivo vazio, arquivo sem EANs, arquivo acima de 2 MB (confirmado pelo PO). Linhas com EAN inválido são tratadas como na seção 4.2.

## 7. Fatiamento proposto em Histórias (1 card por elemento de UI, front + back)

1. Ícone na sidebar e guard de rota (somente Admin).
2. Estrutura da tela, botão "Nova lista" e acesso somente Admin.
3. Listagem: nome, quantidade de produtos, link gerado (com copiar), data de criação, edição e switch ativar/inativar.
4. Drawer de criação: nome da lista, caixa de EANs e botão "Criar lista e gerar link".
5. Baixar modelo.
6. Importar planilha.

## 8. Nível de integração / fonte de dados

- **Contrato de deeplink (App):** o destino `promotion-products` já existe no contrato do App e aceita o parâmetro opcional `promotionProductsId` (intent `PROMOTION_PRODUCTS`). Ver `PRD-deeplink-app.md` §5. Toda rota de deeplink nova precisa ser alinhada entre Portal e App antes de ir ao ar (PRD §4).
- **Persistência da lista:** serviço `ecomm-api-promotions-dotnet` (dono: Squad ECP Portal), na collection `promotionProducts` do `PromotionsDb`, a mesma que os banners já usam. Um **campo novo `origin`** diferencia a origem do registro (listas desta tela com `origin = "crm"`; registros de banner e anteriores, sem o campo, não aparecem na tela). Campos novos da lista: `origin`, nome, EANs digitados; os `productIds` resolvidos usam o campo `ProductIds` já existente; status, data de criação e código usam `IsAtivo`, `DataInclusao` e `Id` existentes.
- **CRUD:** a api-promotions passa a expor criar, listar (busca por nome, ordenação por data de criação decrescente), consultar, atualizar nome e EANs, e ativar/inativar. Hoje o serviço só tem `GET` e `POST` de `promotion-products`, sem nome, sem listagem e sem status.
- **Camada do Portal:** o web-api do monorepo (`/portal/v1/*`) expõe os endpoints da tela, verifica o perfil `admin` no back-end (o guard de rota do front é só de experiência) e orquestra api-promotions e CatalogueDb; o front consome o contrato OpenAPI gerado.
- **Geração do link:** feita pela api-promotions na criação, código de 8 caracteres aleatório e único (nova tentativa em caso de conflito), no padrão `app.radarfarmarcas.com.br/?/promotionProductsId=<código>`. O "?" é trocado depois, manualmente, pelo time de CRM pelo nome da rede.
- **EAN → productId:** consulta à `CatalogueDb.products` (EAN em `CodigoBarras`, `productId` = `_id`, somente produtos ativos e não excluídos). Premissa de EAN e `productId` únicos após a limpeza do catálogo. A coleção já tem índice em `CodigoBarras` (`codigo` e `CodigoBarras_1_IsExcluido_1_DataInclusao_-1`), verificado em 2026-11-05; a consulta de até 500 EANs usa esse índice.
- **Importação:** o parse de CSV/XLSX é feito no back-end do Portal (upload multipart; limite de 2 MB também no proxy do front).
- **Resolução da lista no App:** o app busca os produtos a partir do `promotionProductsId` e trata a lista inativa (escopo da Squad App, em tratativa com a Squad App, fora deste doc). Hoje o app lê `GET promotion-products/{id}` da mesma collection, então a leitura por código continua funcionando para as listas CRM; o que o app faz com a lista inativa (hoje o `GET` ignora `IsAtivo`) é tratado com a Squad App. O "?" não é tratado pelo app: o time de CRM o troca manualmente pelo nome da rede antes de usar o link.
- **Catálogo:** o cadastro de produto é do time Comercial; EAN fora do catálogo não é bug do Portal.
- **Ambiente controlado:** a tela é de uso interno do Admin; não há trilha de auditoria (quem criou/editou/inativou).

## 9. Cenários de borda

| Cenário | Regra |
|---|---|
| Não-Admin acessa a rota por URL | Bloqueado e redirecionado para a primeira tela a que tem acesso |
| Lista inativada | Linha esmaecida, link deixa de funcionar, toast de confirmação |
| Lista reativada | Link volta a funcionar |
| EAN repetido no campo ou na planilha | Ignorado, conta uma vez |
| EAN com menos ou mais de 13 dígitos | Inválido, bloqueia o salvamento |
| Busca sem resultado | Mensagem de busca vazia |
| Nenhuma lista criada | Estado vazio com chamada para "Nova lista" |
| Link de lista inativa aberto no app | Tratado pelo app (Squad App) |
| Editar lista | O link não muda; nome e EANs são atualizados |
| Importar planilha com EANs já digitados | Soma, sem duplicar |
| EAN que não existe no catálogo (ou produto inativo) | Lista criada/atualizada sem ele; aviso lista os EANs ignorados; o EAN digitado continua guardado |
| Nenhum EAN encontrado no catálogo | Lista não é criada; erro no drawer |
| Arquivo importado acima de 2 MB | Erro no cartão vermelho; nada é carregado |

## 10. Pendências / perguntas em aberto

- [ ] **Squad App (em tratativa com a Squad App):** formato do link e hosts por flavor; comportamento do link de lista inativa; tratamento da lista inativa na leitura por código (hoje o `GET promotion-products/{id}` ignora `IsAtivo`). O link desta tela (`app.radarfarmarcas.com.br/?/promotionProductsId=<código>`) difere do contrato do PRD (`https://{host}/app/promotion-products?promotionProductsId=…`); decisão do PO: vale o formato desta tela, com o "?" trocado pelo time de CRM.
- [ ] **Engenharia:** leitura de XLSX com a biblioteca já usada na Farmarcas (NPOI, como no `ecomm-bff-stock-file-validator-dotnet`, versão 2.5.5, a verificar em `make vuln`; o monorepo do Portal não tem biblioteca de planilha hoje), CSV lido sem biblioteca nova; limite de corpo do upload no proxy do front; nome e valores do campo `origin`; filtro da listagem da tela por `origin = "crm"` (a collection só tem índice em `_id`, aceitável com ~1,9 mil documentos); a edição de uma lista só pode atingir registros com `origin = "crm"`.
- [ ] **Time Comercial:** limpeza do catálogo para EAN e `productId` únicos (premissa desta tela; 6 EANs com mais de um produto ativo em 2026-11-05).
- [ ] **Definição de "Produtos":** a coluna mostra os EANs encontrados no catálogo (não os digitados); confirmar com o PO.
- Decisões do PO (2026-11-05): backend gera o link; "?" trocado manualmente pelo time de CRM pelo nome da rede; tratamento de link inativo fica com o App; edição carrega os EANs e não muda o link; validação só de formato; importar soma; item na Área Admin; sem exclusão e sem auditoria (ambiente controlado).

- Decisões do PO (2026-11-05, tarde): api-promotions (Squad ECP Portal) é dona do CRUD e do código do link, na collection `promotionProducts` existente, com campo `origin` para diferenciar as listas CRM dos banners; EAN → `productId` por consulta à CatalogueDb, guardando os dois; EAN ausente cria e avisa; nome da lista é campo novo; parse do upload no back-end do Portal; limites de 500 EANs e 2 MB confirmados; catálogo assumido com EAN e `productId` únicos.

## Changelog

- **2026-11-05 (4)** — Collection nova descartada: as listas ficam na `promotionProducts` existente, diferenciadas pelo campo `origin`; índice em `CodigoBarras` confirmado como já existente; leitura do app por código segue funcionando.
- **2026-11-05 (3)** — Decisões de arquitetura aplicadas: persistência na api-promotions (collection nova, código de 8 caracteres único, nome da lista), consulta EAN → `productId` na CatalogueDb com aviso dos EANs ignorados (substitui "validação só de formato"), parse da planilha no back-end, limites confirmados, itens do App marcados como em tratativa com a Squad App.
- **2026-11-05 (2)** — Respostas do PO aplicadas: geração do link no backend com "?" literal, trocado pelo time de CRM pelo nome da rede; edição carrega os EANs sem mudar o link; validação só de formato; importar soma; item na Área Admin; exclusão e auditoria fora. Defini os textos de toast, a confirmação ao fechar, a ordenação, o layout da planilha-modelo e os limites propostos.
- **2026-11-05** — Criação do documento (v1), a partir do protótipo (prints da listagem e do drawer "Editar lista"), da lista de elementos definida pelo PO e do contrato de deeplink do App.

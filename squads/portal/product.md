# Produto: Radar E-commerce — Squad Portal

> Este arquivo cobre o que é específico da squad Portal. Visão de produto, modelo de negócio B2B2C e NSM (compartilhados entre App e Portal) continuam em [`context/product.md`](../../context/product.md) — que hoje só descreve o lado App e precisa ser generalizado nesse ponto.
>
> Nada aqui deve ser inventado: preencher com dados reais (Miro/Confluence/Jira do Portal) antes de usar este arquivo como base para gerar histórias.


## 1. Contexto - Preencher 

## 1. Visão  
Ser o centro de controle operacional mais eficiente, simples e preditivo para o lojista associado gerir sua loja digital, maximizar suas margens e operar vendas omnicanais sem fricção.

## 2. Posicionamento
O Radar E-commerce é uma plataforma B2B2C da Farmarcas que conecta farmácias associadas a consumidores finais por meio de um portal web (Portal) e um aplicativo mobile (App). Não é um marketplace genérico — cada farmácia associada opera sua própria loja digital, mantendo o relacionamento direto com seu consumidor.
O Portal Radar E-commerce é o ecossistema de gestão B2B do modelo B2B2C da Farmarcas. É a ferramenta de trabalho diário das farmácias associadas (lojistas/franqueados) e da equipe de gestão central da Farmarcas.

## 2. Objetivo - Preencher 


## 3. Estado Atual (Diagnóstico) - Preencher via claude

> Levantado via Jira (projeto **ECP — SQ Ecommerce Portal**) e Miro em 2026-08-17. Marcado onde ainda falta confirmação do PO — não é para ser lido como definitivo.

Hoje, todo pedido cai direto em **"Na fila"**, sem chance de ajuste antes da captura pelo ERP nas lojas de pré-venda. Isso gera cancelamentos totais desnecessários quando bastaria remover ou ajustar um item, e retrabalho operacional para o Balconista. Essa lacuna é o principal foco de produto do trimestre — ver Epic [ECP-1014](https://farmarcas.atlassian.net/browse/ECP-1014), "Editar Pedidos" (nova etapa "Conferência").

Outros pontos de atenção identificados no backlog atual do Portal:
- **Indicadores de Promoções com bug confirmado** ([ECP-1262](https://farmarcas.atlassian.net/browse/ECP-1262), em testes): ofertas recém-criadas não sensibilizam o dashboard de Indicadores, gerando divergência entre a listagem de Promoções e os números que a Rede usa para decisão.
- **Tela de Pedidos sem filtro, sem busca e sem filtro global de lojas** ([ECP-1156](https://farmarcas.atlassian.net/browse/ECP-1156), [ECP-1157](https://farmarcas.atlassian.net/browse/ECP-1157), [ECP-1158](https://farmarcas.atlassian.net/browse/ECP-1158) — todas prioridade Highest, ainda em Backlog).
- **Pedidos "eternos" no status "Liberado"** sem alerta ou tratativa definida ([ECP-1170](https://farmarcas.atlassian.net/browse/ECP-1170), Backlog).
- **Débito técnico de performance na home**: `OrdersModule`/`NetWorkModule` carregados eager no `AppModule`, deixando `/indicators/network` (primeira tela após login) mais lenta do que precisa ser ([ECP-1043](https://farmarcas.atlassian.net/browse/ECP-1043), em preparação para produção).


### 3.1 O que já está pronto ou em andamento - Preencher via claude

**Editar Pedidos / etapa "Conferência"** (Epic [ECP-1014](https://farmarcas.atlassian.net/browse/ECP-1014) — iniciativa central do Portal no momento, 34 cards filhos):
- ✅ Finalizado: edição inline de quantidade de item ([ECP-1015](https://farmarcas.atlassian.net/browse/ECP-1015)).
- 🚀 Em preparação para produção: recálculo de split de preço promocional ao editar item com "Limite por compra" ([ECP-1196](https://farmarcas.atlassian.net/browse/ECP-1196)).
- 🔵 Em refinamento: visualização do pedido "final" pós-edição / Trilha de Auditoria ([ECP-1218](https://farmarcas.atlassian.net/browse/ECP-1218)).
- 🧪 QA em andamento: cenários de teste e tagueamento Mixpanel do fluxo de Conferência ([ECP-1286](https://farmarcas.atlassian.net/browse/ECP-1286), sob a task [ECP-1088](https://farmarcas.atlassian.net/browse/ECP-1088)).
- Estorno automático (Braspag) e Troco na Conferência estão dentro deste mesmo épico ([ECP-1031](https://farmarcas.atlassian.net/browse/ECP-1031) e [ECP-1260](https://farmarcas.atlassian.net/browse/ECP-1260)) — a pasta dedicada `specs/features/portal/Fluxo.Estorno.Pgto/` ainda não tem PRD próprio escrito.
- Nota histórica: os cards ECP-1016, ECP-1027 e ECP-1028 (máquina de estados, cancelamento e histórico, respectivamente) aparecem como "Cancelado" no Jira — foram consolidados/substituídos durante o refinamento do PRD (v2.0/v2.1), não representam trabalho perdido.
- **Não confirmado nesta consulta:** status atual de [ECP-1090](https://farmarcas.atlassian.net/browse/ECP-1090) (gate de feature flag por loja, card fundacional do epic) — vale confirmar com o time antes de assumir que está desbloqueado.

**Documentação de apoio já publicada:** Manual do Portal e Base de Conhecimento do bot de suporte (`specs/features/portal/base.conhecimento/`).


## Modelo de Negócio & Operação  - Preencher via claude
**B2B2C:** Farmarcas (plataforma) → Lojistas/Associados (farmácias franqueadas) → Consumidores finais

- A Farmarcas fornece e evolui a plataforma tecnológica
- Os lojistas configuram estoques, preços e regras no Portal
- Os consumidores compram via App, sempre vinculados a uma farmácia específica

### Estrutura operacional do Portal (ver `context/glossary.md`)

- **Hierarquia:** Rede (bandeira, ex.: ACFARMA, Ultra Popular) → Grupo de lojas (subconjunto de lojas de um mesmo GE — Grupo Econômico — com tipo de estoque próprio: Espelhado / Integrado / Independente) → Loja individual.
- **Perfis de acesso, do mais restrito ao mais amplo:** Contato cliente/Balconista (1 loja, sem acesso a promoções/ações críticas) → Gestor de Loja (N lojas) / Gestor de Rede (N redes, mesmo nível de permissão que Gestor de Loja) → Admin (todas as Redes/Lojas + módulo Catálogo, exclusivo dele).
- **Catálogo mestre de produtos:** único para toda a plataforma, mantido pelo Admin. Redes que precisam de um produto novo abrem uma "Solicitação de produto" (por EAN), que só entra no Catálogo após aprovação do Admin.

## Usuários do Portal

| Persona | Descrição | Principal motivação |
|---|---|---|
| Contato cliente (Balconista) | Funcionário da farmácia responsável por separar e bipar pedidos. |"Quando recebo um pedido do App, quero ter visibilidade clara dos itens e localização no estoque para separar rapidamente e liberar para entrega ou retirada." |
| Gestor de Loja | Gestor do negócio local focado em rentabilidade e acomapanhamento de métricas/indicadores | Quero acompanhar as margens da operação, garantir que meu estoque reflita a realidade, criar a acomapanhar campanhas de oferta e garantir que minha operação esteja fluida. |
| Admin | Time central de e-commerce e governança Farmarcas | Quero gerenciar a entrada de novas lojas associadas (onboarding), garantir conformidade de catálogo e monitorar a saúde financeira global do ecossistema" |

## North Star Metric (NSM)
> **Volume de Transações por Loja Ativa**

Todas as decisões de produto devem ser avaliadas pelo impacto nesta métrica.

## KPIs

| Indicador | Atual | Meta |
|---|---|---|
| | | |

## Entregas Estratégicas Q3 2026 - Preencher via claude

> A quebra por trimestre não está oficialmente marcada no Jira/Miro consultado — a associação a "Q3 2026" segue a posição da iniciativa no board de roadmap ([board Miro](https://miro.com/app/board/uXjVHyjnUNw=/), swimlane dedicada "Editar Pedido"). Vale confirmar com o PO se esse é de fato o corte oficial do trimestre.

**Principais entregas:**
- **Editar Pedidos / etapa "Conferência"** ([ECP-1014](https://farmarcas.atlassian.net/browse/ECP-1014)): permitir ao Balconista ajustar ou remover item, e cancelar o pedido inteiro, antes da captura pelo ERP — reduz cancelamentos totais desnecessários e retrabalho. Inclui estorno automático via Braspag e tratamento de troco para pagamento em dinheiro.

**Riscos:**
- Card fundacional [ECP-1090](https://farmarcas.atlassian.net/browse/ECP-1090) (gate por feature flag/loja) não teve o status confirmado nesta consulta — se ainda não estiver liberado, bloqueia o rollout dos demais cards do epic.
- O PRD já precisou de correções pós-build uma vez (mudança do modelo de "commit em rascunho" depois de ECP-1015/1084 já estarem em teste) — specs evoluindo em paralelo ao desenvolvimento têm custo real de retrabalho.
- Bug de indicadores de Promoções ([ECP-1262](https://farmarcas.atlassian.net/browse/ECP-1262)) compromete a confiança de Gestores de Loja/Rede nos dashboards, incluindo os que vão apoiar decisões sobre a própria Conferência.
- Ausência de filtro/busca na tela de Pedidos (backlog Highest, não iniciado) tende a piorar a usabilidade da Conferência conforme o volume de pedidos cresce.

**Plano de ação:**
- Confirmar o status de ECP-1090 e dos cards de estorno/troco (ECP-1031, ECP-1260) antes de assumir data de conclusão do epic.
- Fechar ECP-1218 (visualização pós-edição/Trilha de Auditoria) e o tagueamento Mixpanel (ECP-1286) antes de anunciar a feature como pronta para todas as lojas.
- Investigar e corrigir o bug de indicadores de Ofertas (ECP-1262) em paralelo, para não minar a confiança nos dashboards que a própria Conferência vai gerar dado novo.
- Repriorizar os itens Highest represados (filtros de pedidos/lojas, busca — ECP-1156/1157/1158) para o próximo ciclo, dado o aumento esperado de uso da tela de Pedidos.

## Time (Squad Portal)

| Papel | Nome |
|---|---|
| Gerente de Engenharia | Gabriel Costa |
| Coordenador | Thiago |
| Product Owner | Matheus |
| UX Sênior | Lais Bortoleto |
| Dev Front End Pleno | Diego Luz |
| Dev Front End Pleno | Gustavo Leite|
| Dev Back End Pleno | Matheus Galdino |
| Dev Back End Pleno | Rafael Chaves |
| QA Pleno | Diogo Ávila |

## Fora do escopo do Portal

-

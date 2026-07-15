# Glossário — Radar E-commerce

## Entidades Principais

| Termo | Definição |
|---|---|
| **Farmarcas** | Rede franqueadora de farmácias. Dona da plataforma Radar. |
| **Associado / Lojista** | Farmácia franqueada que opera dentro da rede Farmarcas. Usa o Portal para gerenciar sua loja no Radar. |
| **Consumidor** | Usuário final do App. Compra produtos de um lojista específico. |
| **Loja Ativa** | Lojista que realizou ao menos uma transação no período de referência. Base do NSM. |
| **Portal** | Front-end web do Radar destinado aos lojistas. Gerenciam estoque, preços, pedidos e configurações. |
| **App** | Aplicativo mobile do Radar destinado ao consumidor final. |
| **Rede** | Bandeira/franquia da qual as lojas fazem parte na plataforma Radar (ex: ACFARMA, Ultra Popular, Super Popular). É o nível mais alto de organização no Portal; dentro de uma Rede existem lojas de diferentes GEs (associados/empresários — ver **GE** abaixo). Possui indicadores agregados próprios. |
| **Grupo de lojas** | Funcionalidade do Portal que organiza um subconjunto de Lojas dentro de uma Rede — normalmente as lojas de um mesmo **GE** — com configuração própria de atendimento de pedidos e tipo de estoque (Espelhado / Integrado / Independente) e usuários vinculados ao grupo. |
| **Balconista** | Atendente da farmácia associada que opera o Portal para gerenciar pedidos. No Portal, esse perfil é identificado como **Contato cliente**: vinculado a uma única loja, sem acesso à criação/remoção de promoções ou outras ações críticas de operação. |
| **Gestor de Loja** | Perfil de acesso do Portal destinado a associados/donos de loja. Acesso completo a todas as funcionalidades do Portal, podendo ser vinculado a N lojas. |
| **Gestor de Rede** | Perfil de acesso do Portal equivalente ao Gestor de Loja, mas vinculado a uma ou mais Redes (grupos de lojas) em vez de lojas individuais. |
| **Admin** | Perfil de acesso do Portal com visão de todas as Redes, todas as Lojas e todas as funcionalidades. Único perfil com acesso a todos os módulos além do módulo Catálogo. |
| **Catálogo** | Módulo administrativo (exclusivo do perfil Admin) com o cadastro mestre de produtos da plataforma Radar, compartilhado entre todas as Redes. Inclui cadastro/edição de produtos, Grupos de produtos e aprovação de Solicitações de produtos. |
| **Grupo de produtos** | Conjunto de produtos agrupados por uma regra de composição (ex: mesma marca, mesmo produto), usado tanto no Catálogo quanto na criação de Promoções por grupo. Na UI do módulo Catálogo essa entidade ainda aparece com o nome legado **"Família"** — é a mesma entidade, e a nomenclatura está em processo de unificação para "Grupo de produtos" em toda a plataforma. |
| **Solicitação de produto** | Fluxo pelo qual uma Rede pede a inclusão de um novo produto (por EAN) no Catálogo mestre. O produto só passa a existir na plataforma após aprovação do Admin (status Pendente/Aprovado/Reprovado). |

## Negócio e Produto

| Termo | Definição |
|---|---|
| **NSM** | North Star Metric. Métrica principal do Radar: Volume de Transações por Loja Ativa. |
| **NMT** | Número de lojas ativas monitorado como indicador de escala. Hoje: 7, meta Q3: 8. |
| **PBM** | Programa de Benefício em Medicamentos. Sistema de desconto via convênio ou plano de saúde. Parceiro atual: Interplayers. |
| **Plug-and-play (PBM)** | Estratégia onde cada lojista habilita sua integração PBM de forma independente, sem customização pelo time Radar. |
| **Checkout** | Fluxo completo de finalização de compra no App. |
| **Deeplink** | Tecnologia usada no novo checkout para receber dados necessários à precificação. |
| **OMS** | Order Management System. Gerencia o ciclo de vida dos pedidos após criação. |
| **Recompra** | Funcionalidade que permite ao consumidor repetir um pedido anterior com um clique. |
| **GE** | Grupo Econômico. Conjunto de uma ou mais lojas do mesmo empresário/associado, dentro de uma **Rede** (bandeira). É o conceito de negócio por trás da funcionalidade **Grupo de lojas** no Portal. |
| **Controlados** | Medicamentos que exigem receita médica. Compra disponível pelo app com retirada obrigatória na loja. |
| **Maxi Popular** | [TODO: descrever o que é o App Maxi Popular no contexto do Radar] |

## Time e Processo

| Termo | Definição |
|---|---|
| **Squad App** | Time responsável pelo aplicativo mobile do Radar (consumidor final). |
| **Squad Portal** | Time responsável pelo portal web do Radar (lojistas). |
| **Squad Core** | Time responsável pela infraestrutura e serviços centrais do Radar. |
| **Squad CS** | Time de Customer Success do Radar. |
| **Anjo** | Profissional do time de Operações internas da Farmarcas responsável por dar suporte a associados do Radar E-commerce/E-Delivery. |
| **GPEEDS** | Chave do projeto Radar E-commerce no Jira. |
| **Spec Kit** | Este repositório. Base de conhecimento versionada do produto. |
| **ADR** | Architecture Decision Record. Registro formal de uma decisão técnica ou de produto. |
| **DoD** | Definition of Done. Critérios que uma história precisa cumprir para ser considerada pronta. |
# Plano — Resolver as dores da Busca com Typesense

> **Fontes:**
> - Dores e cenários: [estudo-busca-miro.md](estudo-busca-miro.md) (spike [ECA-861](https://farmarcas.atlassian.net/browse/ECA-861))
> - Decisão de explorar a ferramenta: [2026-08-06-apresentacao-typesense.md](../../../reuniões/transcrições/2026-08-06-apresentacao-typesense.md)
> - Documentação técnica: [typesense.org/docs](https://typesense.org/docs/) (API Reference v30.2)

## 1. Contexto

Na reunião de 06/08/2026, Gabriel Costa apresentou o Typesense como alternativa ao Elasticsearch atual, com foco em resolver o problema de busca sugerindo produtos sem estoque na loja. A decisão estratégica tomada foi **priorizar a implementação da busca no próximo trimestre**, mantendo em paralelo o desenvolvimento da integração PBM (Interplayers).

Este plano cruza cada dor/cenário levantado no [estudo-busca-miro.md](estudo-busca-miro.md) com a capacidade correspondente do Typesense, para orientar o parecer técnico do Wellington e o desenho da sprint.

## 2. Mapeamento: cenário do PRD → capacidade do Typesense

| # | Cenário (estudo-busca-miro.md) | Resolve com | Observação |
|---|---|---|---|
| 1 | Produto exato + estoque disponível → produto buscado primeiro, variações depois | **Curation** (`includes` fixando o ID exato na posição 1 + variações nas posições seguintes, `rule.match: exact`) | Regra pode ser genérica (não por produto individual) combinando `exact_match` com agrupamento por Grupo de produtos/EAN base |
| 2 | Produto exato + estoque indisponível → produto indisponível primeiro, depois similares por subcategoria > categoria > departamento | **`sort_by` com `_eval()`** hierárquico: `_eval([(subcategoria_match:true):3,(categoria_match:true):2,(departamento_match:true):1]):desc` | Precisa de campos booleanos/derivados calculados na query ou lógica equivalente com `filter_by` + múltiplas chamadas |
| 3 | Termo exato de condição de vários produtos ("Lavanda") | Busca full-text padrão (`query_by`) + `sort_by=_text_match:desc,vendas:desc` | Comportamento nativo, sem configuração extra |
| 4 | Termo não identificado | Resposta vazia do Typesense (`found: 0`) | Tratamento do placeholder é responsabilidade do App, não do Typesense |
| 5 | Sintoma (ex: "Febre") — **campo classe terapêutica ainda não existe no cadastro** | **Semantic/vector search** (embeddings, ex. `ts/all-MiniLM-L12-v2` ou modelo externo) | Destrava o cenário **sem esperar** o cadastro do campo Anvisa — a busca semântica infere a relação "febre → dipirona" a partir da descrição do produto |
| 6 | Contexto de vida ("Praia", "Corrida") — **campo também não existe** | **Semantic/vector search**, mesma abordagem do cenário 5 | Mesma mitigação — reduz a dependência de um novo campo de cadastro, mas não substitui a taxonomia formal a médio prazo |
| 7 | Busca por departamento/categoria/subcategoria | **`facet_by`** + `filter_by` nesses campos | Também resolve o ponto de atenção "filtros pós-busca" |
| 8 | Busca por princípio ativo | `filter_by=principio_ativo:=X` | Campo já existe no cadastro atual |
| 9 | Termo com erro de digitação ("Xampu" → "Shampoo") | **Typo tolerance nativo** (`num_typos`, `min_len_1typo`/`min_len_2typo`) | Configurável por campo; não é preciso build custom |
| 10 | Scan de código de barras (EAN) | Não é busca — é lookup direto por `filter_by=ean:=<código>` ou `GET /documents/<id>` | Mantém o app decidindo o fallback "produto não encontrado" |

## 3. Pontos de atenção do estudo (seção 4) → solução

| Ponto de atenção | Como o Typesense endereça |
|---|---|
| **Escopo por loja (B2B2C)** — busca deve ocorrer dentro do catálogo/estoque de uma loja específica, distinguindo "não vendido nesta loja" de "não existe no catálogo nacional" | **Scoped Search API Keys**: gera uma chave por sessão/loja com `filter_by: store_id:=<id>` embutido e imutável no cliente. Resolve simultaneamente o escopo por loja **e** a preocupação de segurança levantada na reunião (proxy reverso) — a chave escopada pode ser exposta no app com segurança, desde que a chave-pai (search-only sem escopo) nunca seja exposta. O schema do produto precisa registrar explicitamente disponibilidade por loja vs. existência no catálogo nacional |
| **Filtros pós-busca** | `facet_by` nativo, já cobre categoria/subcategoria/departamento/princípio ativo |
| **Autocomplete** (3 sugestões macro + 5 cards de produto) | **Federated/multi-search**: uma única requisição HTTP com duas queries (uma para sugestões, outra para os 5 primeiros produtos), evitando duas chamadas de rede |
| **Histórico pessoal** (últimos 5 termos buscados) | Não é feature do Typesense — precisa ser persistido no App/backend (não bloqueia a adoção) |
| **Buscas compostas / múltiplos atributos** ("protetor solar fps 50") | Cobertura nativa via `query_by` multi-campo + `prefix` + `drop_tokens_threshold`, que já lida bem com termos compostos sem configuração extra |
| **Sinônimos e abreviações farmacêuticas** ("dip" = dipirona, "AAS" = ácido acetilsalicílico) | **One-way synonyms** (`iphone → smart phone` é o padrão equivalente): mapear a abreviação como sinônimo de mão única para o termo correto. Precisa de curadoria de um dicionário de abreviações do domínio farmacêutico — não vem pronto do Typesense |

## 4. Decisões da reunião a formalizar

- **Segurança**: a reunião apontou a necessidade de um proxy reverso entre front-end e Typesense. Com **Scoped API Keys**, parte dessa necessidade é mitigada (a chave já limita o que o cliente pode consultar), mas ainda é recomendado que o **backend emita a chave escopada por sessão** (login/seleção de loja) em vez de embutir qualquer chave estática no app — isso também viabiliza rotação de chaves.
- **Hospedagem**: decisão pendente entre self-hosted (Docker + EC2 32GB, conforme demonstrado) vs. Typesense Cloud (dashboard administrativo, CDN, alta disponibilidade, replicação geográfica). Cabe ao parecer do Wellington considerando custo x operação — ver comparação detalhada na seção 5.
- **Atualização do catálogo**: duas opções discutidas — carga em lote diária ou `upsert` em tempo real via POST. Recomenda-se iniciar em lote (menor risco) e evoluir para tempo real na Fase 5 (abaixo).
- **Convivência com Elasticsearch e PBM/Interplayers**: manter o desenvolvimento da integração PBM em paralelo — a adoção do Typesense é aditiva e não bloqueia a sprint de Interplayers.

## 5. Infra própria vs. Typesense Cloud

Comparação para subsidiar a decisão de hospedagem apontada na seção 4.

### Infra própria (self-hosted — Docker + EC2, como demonstrado na reunião)

**Prós**
- Controle total sobre custo de infraestrutura — paga só o EC2 (ex.: instância 32GB já testada), sem markup do serviço gerenciado.
- Dados ficam inteiramente dentro da própria AWS da Farmarcas — pode simplificar compliance/LGPD ao não depender de um terceiro processando o catálogo.
- Já existe know-how demonstrado (Gabriel Costa validou o protótipo em Docker/EC2 na reunião).
- Sem lock-in comercial com um fornecedor SaaS.

**Contras**
- Alta disponibilidade exige mínimo de 3 nós com consenso Raft configurado manualmente (peering privado, arquivo de config de nós) — 1 nó só não tolera falha nenhuma.
- Toda a operação fica com o time: monitorar `/health`, `/metrics.json`, `/stats.json`; gerenciar TLS/certificados; aplicar patches e upgrades de versão; dimensionar RAM/CPU (manter RAM <85%, CPU <90%).
- Backup/disaster recovery não é coberto de forma pronta pela documentação — precisa ser desenhado pelo time (snapshots, rotina de restore).
- Recuperação de quórum perdido ou outage prolongado pode exigir intervenção manual.
- Squad App é pequena (1 dev back-end pleno) — esse é overhead operacional recorrente, competindo com a entrega de PBM e demais prioridades do Q3.
- Reforça a necessidade do proxy reverso discutido na reunião como camada de segurança adicional (self-hosted não tem isso pronto).

### Typesense Cloud (infra da plataforma/parceiro)

**Prós**
- Elimina o trabalho operacional acima: HA, balanceamento, recuperação de falhas, TLS e monitoramento já vêm geridos pelo fornecedor.
- Tem região em São Paulo — latência baixa para o público-alvo (consumidores no Brasil), sem precisar gerenciar isso.
- Dashboard administrativo incluso (visualizar/ajustar buscas sem precisar de chamadas de API manuais).
- Segurança e compliance prontos: criptografia de disco, SOC 2 Type 2, HIPAA — relevante dado que o catálogo envolve medicamentos.
- Billing por hora, sem custo por busca/registro — escala para cima ou para baixo conforme demanda, sem precisar prever capacidade com antecedência.
- Suporte direto dos criadores da ferramenta.

**Contras**
- Custo recorrente de um serviço terceirizado, adicional ao que já se paga por Elasticsearch/infra atual até a migração ser concluída.
- Dependência de um fornecedor externo — indisponibilidade do serviço impacta diretamente a busca (e por consequência a conversão, que é KPI direto do NSM).
- Menos controle fino sobre a infraestrutura subjacente (versões, tuning de baixo nível) comparado a rodar você mesmo.
- Ainda existe uma decisão de "onde processar catálogo de medicamentos" fora do perímetro AWS da empresa — vale confirmar se isso levanta alguma restrição de segurança/dados internos da Farmarcas.

### Recomendação

Dado que a Squad App é pequena e o objetivo do Q3 é justamente não desviar esforço de PBM, a rota que reduz risco operacional é começar com **Typesense Cloud** (região São Paulo) nas Fases 1–2 do plano (seção 7) — isso testa a ferramenta em produção sem exigir que o time monte e opere um cluster HA do zero. Se o custo por hora crescer com o volume ou surgir uma restrição de compliance para dados fora da AWS própria, migrar para self-hosted depois é possível sem reescrever a integração (mesma API). Essa é uma decisão que cabe ao parecer técnico do Wellington considerar formalmente.

## 6. Gaps que o Typesense não resolve por si só

- **Campo "classe terapêutica" (Anvisa)** e **campo de contexto de vida** ainda não existem no cadastro. A busca semântica (seção 2, cenários 5 e 6) reduz o impacto da ausência desses campos, mas o cadastro formal continua sendo uma melhoria de dados recomendada a médio prazo.
- **Distinção "produto existe no catálogo nacional mas nunca foi vendido nesta loja" vs. "produto não existe no catálogo nacional"** exige que o schema do índice carregue esse dado explicitamente — não é algo que o motor de busca infere.
- **Dúvida aberta do estudo — "como rankear produtos sem histórico de compra/busca"**: sugerido usar `_text_match` puro como fallback quando o campo de popularidade for zero/nulo (estratégia de cold start), a ser validada com o time de dados.

## 7. Plano de fases

| Fase | Escopo | Cenários resolvidos |
|---|---|---|
| **0 — Spike/PoC** (em andamento — Wellington) | Viabilidade técnica, segurança, on-premises vs. SaaS | — |
| **1 — Fundação** | Schema da coleção de produtos com escopo por loja (`store_id`, disponibilidade), carga em lote diária, busca básica com typo tolerance, filtros e facets | 1 (parcial), 3, 4, 7, 8, 9 |
| **2 — Relevância avançada** | Curation (pin de produto exato + variações), `sort_by` hierárquico via `_eval()`, dicionário de sinônimos/abreviações farmacêuticas | 1 (completo), 2, cenário de sinônimos |
| **3 — Busca semântica** | Embeddings para sintomas e contexto de vida, sem depender de novos campos de cadastro | 5, 6 |
| **4 — Autocomplete & UX** | Federated multi-search (sugestões + cards), filtros pós-busca na UI, histórico pessoal (App) | pontos de atenção: autocomplete, filtros, histórico |
| **5 — Tempo real & descomissionamento** | Upsert em tempo real, monitoramento/observabilidade, migração final saindo do Elasticsearch | — |

## 8. Próximo passo imediato

Aguardar o parecer técnico do Wellington (reunião de acompanhamento agendada para o dia seguinte, 9h30–10h) e garantir que o schema de índice proposto na **Fase 1** já contemple os campos necessários para os cenários 1–9, evitando retrabalho de reindexação nas fases seguintes.

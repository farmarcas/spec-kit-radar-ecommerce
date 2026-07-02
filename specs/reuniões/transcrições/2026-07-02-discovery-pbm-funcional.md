# Reunião de Discovery – Integração PBM (Farmarcas)

**Data da reunião:** 02/07/2026
**Arquivo de origem:** `WhatsApp_Audio_2026-07-02_at_10_48_40.mp4`
**Formato:** transcrição de áudio via WhatsApp (a Farmarcas colou o texto transcrito; o Claude não teve acesso ao áudio bruto)
**Qualidade da fonte:** transcrição automática, com ruídos, cortes e trechos incompreensíveis (a própria reunião começa com um relato de queda de energia no prédio).

> Este documento foi montado a partir de uma transcrição já pronta (não gerada por mim), organizada e resumida para leitura. Pontos originalmente ambíguos na transcrição foram validados com o time e já refletidos abaixo.

---

## 1. Contexto da reunião

Reunião entre o time de **Inovação e Tecnologia da Farmarcas** (dona da plataforma Radar) e a **Funcional**, provedor de **PBM (Programa de Benefício em Medicamentos)**. A Funcional agrega diversos laboratórios/indústrias parceiras sob um único provedor — ou seja, ao integrar com a Funcional, a Farmarcas passa a disponibilizar no App os produtos desses laboratórios já com o preço correto de PBM aplicado, sem precisar negociar/integrar laboratório a laboratório.

Objetivo declarado pela Farmarcas: integrar o canal digital da Farmarcas (hoje o **App**, com expansão para **Web** ainda este ano) à solução da Funcional, para que os **Consumidores** passem a ter acesso, dentro do App/Radar, aos descontos de convênio/PBM já negociados pelos **Lojistas/Associados**.

Pontos de contexto de negócio citados:
- A Farmarcas já vinha de conversas anteriores (o presidente **Edson** já havia sinalizado o interesse à Funcional).
- Motivação comercial explícita: alguns Associados vêm perdendo competitividade regional para concorrentes que já vendem com desconto agressivo via canais digitais.
- Cerca de **60–70%** do faturamento de determinados programas de desconto (segundo o interlocutor da Farmarcas) já vem de produtos com bolsa comercial diferenciada — reforçando a relevância de habilitar isso no digital.
- Já existe negociação prévia com o laboratório **Bayer** ("Beringer" na transcrição original), que está conectado dentro da Funcional, garantindo condição de desconto maior para o canal e-commerce. Existem outros laboratórios conectados à Funcional que não foram detalhados nesta call, já que a integração com o provedor cobre todos eles de uma vez.
- Cobertura de lojas: aproximadamente **98%** das lojas Associadas já estão cadastradas na base da Funcional (as demais estão "entrando").
- **Meta de prazo:** Farmarcas quer estar pronta para anunciar a integração a 100% dos Associados no encontro presencial de associados, previsto para **agosto** — pedido explícito de priorização por parte da Funcional para viabilizar isso até o fim do trimestre corrente.

---

## 2. Participantes mencionados

| Nome | Lado | Papel (conforme mencionado) |
|---|---|---|
| Marcelo | Funcional (PBM) | Fala com autoridade técnica sobre a arquitetura da Funcional; parece ser o principal interlocutor técnico/comercial do lado do provedor |
| Diego | Funcional (PBM) | Presente na call; papel específico não detalhado |
| (não identificado pelo nome) | Farmarcas | Responsável por Inovação e Tecnologia na Farmarcas; conduz a reunião pelo lado Farmarcas |
| Edson | Farmarcas | Presidente; contato inicial com a Funcional |
| Gabriel | Farmarcas | Vai liderar a frente de agendas técnicas de integração pelo lado Farmarcas |
| Patrícia Granjeiro ("Paty") | Farmarcas | Gerente comercial responsável por PBM na Farmarcas; referência para negociação de taxas |
| Felipe, Victor | Farmarcas (time de App) | Vão cuidar da parte de preços na aplicação "Core" enquanto o domínio de Promotions é desenvolvido |
| Pedro, Wellington | Farmarcas | Destinatários internos de uma apresentação futura da solução de PBM |
| Squad CORE | Farmarcas | Time com reunião de alinhamento recorrente às segundas-feiras, onde o tema PBM também será discutido |

---

## 3. Transcrição organizada por tema

*(Reorganizada cronologicamente e por assunto a partir do texto bruto fornecido; falas atribuídas de forma aproximada, já que a transcrição original não identifica o locutor em cada frase.)*

### Abertura
Início com problema técnico (queda de energia no prédio de um dos participantes) e apresentações informais. O representante da Farmarcas se apresenta como responsável pela área de Inovação e Tecnologia, contextualizando que:
- A Farmarcas já opera e-commerce há algum tempo, hoje concentrado no App.
- A empresa quer expandir para Web ainda este ano.
- O objetivo da reunião é entender o caminho técnico para integrar o canal digital da Farmarcas à solução da Funcional, com foco em PBM/PDVs.
- Do lado Farmarcas, a documentação e agenda técnica já estão prontas para avançar "a qualquer momento".

### Modelo de negócio da Funcional
Marcelo (Funcional) explica o modelo de operação da empresa dele, para alinhar expectativas:
- Operam de forma parecida a um marketplace: **12 aplicativos separados**, um por bandeira/rede de farmácia (ex.: "Ultra Popular", "Mega Popular" — nomes de exemplo citados), cada um publicado individualmente nas lojas de app.
- Dentro de cada aplicativo existem múltiplas lojas de lojistas distintos (exemplo dado: ~800 lojas dentro do app "Ultra Popular").
- Pergunta central da Funcional para o modelo de integração: a Farmarcas vai autenticar/chamar a API com **uma chave única por rede** (Farmarcas) ou com uma chave por loja?
  - Resposta da Farmarcas: modelo de **chave única por rede**, pois no momento da pré-autorização ainda não se sabe qual loja específica vai atender o pedido — isso só se define no momento de fechamento da venda/faturamento.

### Cobertura de cadastro das lojas
- Praticamente 100% das lojas Farmarcas (na prática ~98%) já estão cadastradas na base da Funcional.
- Esclarecido que "estar cadastrado" na Funcional não significa automaticamente ter acesso a todos os descontos de todas as indústrias — cada desconto depende de negociação comercial específica entre a Funcional e cada laboratório (ex.: caso Bayer, onde a condição já está negociada e liberada para a Farmarcas).

### Fluxo técnico de integração (conforme descrito pela Funcional)
1. **Carga diária de condições comerciais**: via credenciais/API, é possível baixar diariamente todas as condições comerciais vigentes por loja.
2. **Pré-autorização no momento de acesso ao produto**: quando o consumidor visualiza um produto dentro de uma loja específica no App, a Funcional faz uma consulta/checagem de elegibilidade (o cliente pode ou não ter direito ao desconto, considerando regras como desconto progressivo por faixa de compra e limite de quantidade por período).
3. **Aplicação do desconto no carrinho** e continuidade normal da jornada de compra.
4. **Confirmação da venda**: ocorre no **PDV** do lojista, no momento da emissão da nota fiscal/faturamento — não no momento do checkout do app. A Funcional apontou este como o principal ponto de atenção técnico: garantir que o PDV das lojas Farmarcas consiga receber a pré-autorização gerada no app e confirmar a venda posteriormente.

Ponto de modelo importante citado pela Funcional: diferente de apps tipo iFood (que priorizam trocar o cliente de loja por conveniência), no app da Funcional o cliente é vinculado a uma loja específica desde o início da navegação — preço e estoque mostrados são sempre os daquela loja, não agregados.

### Integração com ERP / confirmação de venda (lado Farmarcas)
- A Farmarcas hoje já opera um fluxo de **pré-venda**: toda venda do e-commerce (entrega ou retirada em loja) gera uma pré-venda enviada ao ERP; o ERP finaliza a venda (fatura, emite nota) e devolve o status para o e-commerce, que conclui o pedido.
- Farmarcas possui **4 ERPs homologados**: **Alpha7**, **Trier** e **Softfarma** já têm o fluxo de pré-venda homologado; o quarto, **Big/Linx**, ainda está em fase de homologação.
- Confirmado que o tempo entre a pré-autorização e a confirmação final (nota fiscal) pode levar horas (ex.: compra hoje, retirada amanhã) — a Funcional afirmou que isso não é um problema, o pedido "fica rodando" até a confirmação efetiva.

### Cadastro do consumidor nos programas de desconto
Dúvida da Farmarcas: será necessário redirecionar o cliente para uma página externa da Funcional para se cadastrar no programa, ou dá para embutir esse cadastro dentro do próprio App via API?
- Resposta: depende do programa/indústria. Não existe um formulário padrão único — normalmente cada programa tem seu próprio formulário de cadastro.
- No caso do PBM **Interplayers** (parceiro atual de PBM da Farmarcas, conforme glossário interno), o processo foi descrito como mais simples/"dinâmico": pode ser via link direto ou via API informando os campos e o programa desejado.
- Decisão discutida internamente pelo time Farmarcas (trecho final, já sem a Funcional na call): seguir por ora apenas com Interplayers embedado no próprio app; se no futuro for necessário integrar o cadastro da Funcional e o único caminho for um formulário externo (link), aceitar essa divergência de experiência por ora, já que os contratos/campos podem variar muito entre programas.

### Taxas
- Perguntado se existe taxa diferenciada para transações feitas via e-commerce/PBM.
- Resposta da Funcional: não há taxa adicional — é a mesma taxa comercial negociada com a Farmarcas por transação, citada como **4,4%**, válida para qualquer canal.

### Discussão interna Farmarcas (pós-call com a Funcional)
Ao final, parte da conversa parece já ser só entre o time interno da Farmarcas, discutindo arquitetura:
- Vai existir um **domínio específico para PBM**, dentro de um serviço/domínio chamado **"Promotions"**.
- Enquanto o domínio de Promotions está em desenvolvimento, o time de App (**Felipe, Victor**) resolve a parte de preço na aplicação **"Core"**.
- Estratégia de transição: o **orquestrador** fará uma chamada ao serviço de Promotions para retornar apenas o contexto de PBM, convivendo com outras fontes de preço até a migração completa ("virar a chavinha").
- Já existe um discovery técnico em andamento sobre a **carga de arquivos (batch)** da Funcional para popular o "estoque"/condições comerciais.
- Reunião de refinamento do time de produto já estava agendada para o mesmo dia às 14h; decidiu-se **não** incluir o assunto PBM nesse refinamento (para não confundir o time com contextos de app não relacionados) — o tema PBM será tratado na reunião de alinhamento recorrente de segunda-feira do **Squad CORE**, com participação do Felipe.

---

## 4. Insights de Produto

1. **Oportunidade comercial clara**: parte relevante do GMV de certos programas de desconto (60–70%, segundo o interlocutor) já vem de produtos com bolsa comercial diferenciada — habilitar isso no digital tem potencial de recuperação de vendas perdidas para concorrentes.
2. **Motivador competitivo direto**: pelo menos um concorrente regional já oferece desconto agressivo via canal digital, pressionando Associados específicos.
3. **Meta de negócio com prazo forte**: anúncio da integração no evento presencial de Associados em agosto — isso deveria virar um marco de release/roadmap explícito, com buffer para testes.
4. **Diferença de modelo de app**: a Funcional opera com apps segmentados por bandeira (white-label por rede), com centenas de lojas dentro de cada um. O modelo da Farmarcas parece ser diferente (app único "Radar" com lojas Associadas dentro) — isso impacta como a granularidade de autenticação (rede vs. loja) deve ser desenhada.
5. **Experiência de cadastro do consumidor pode ficar inconsistente**: dependendo do programa de PBM, o cadastro pode ser embutido no app (via API) ou exigir redirecionamento para link externo. Antes de escalar para novos programas além do Interplayers, vale decidir um padrão de UX para não fragmentar a experiência do Consumidor.
6. **Não há impacto de custo/taxa** para o Lojista ao vender via e-commerce/PBM em vez de outros canais — bom argumento de adoção interna para os Associados.

## 5. Insights Técnicos

1. **Modelo de autenticação**: usar chave única por rede (não por loja) na pré-autorização, já que a loja específica só é definida no momento do faturamento/PDV — confirmar se esse modelo é compatível com o desenho de domínio "Promotions" que está sendo criado.
2. **Fluxo de 3 etapas da Funcional** a ser replicado/consumido: (1) carga diária de condições comerciais, (2) pré-autorização/checagem de elegibilidade no acesso ao produto, (3) aplicação do desconto no carrinho.
3. **Ponto crítico identificado pela própria Funcional**: a confirmação da venda ocorre no PDV do Lojista (emissão de nota fiscal) — o desenho técnico precisa garantir que o PDV consiga reconciliar/confirmar a pré-autorização gerada no App. Esse foi citado como o maior desafio da integração.
4. **Já existe fluxo de pré-venda no ERP da Farmarcas** reaproveitável: toda venda do e-commerce gera pré-venda, ERP finaliza e retorna status.
5. **Latência assíncrona esperada**: pode levar horas entre autorização e confirmação (retirada/entrega física) — pedido deve ficar em estado "pendente" até confirmação.
6. **Arquitetura interna decidida**: domínio "Promotions" dedicado a PBM; orquestrador consulta Promotions apenas para o contexto PBM enquanto o restante dos preços continua na aplicação "Core", até migração completa.
7. **Dependência de discovery em andamento**: carga de arquivos/batch da Funcional (job) para importar condições comerciais.

## 6. Decisões e próximos passos

- [ ] Parceiro (Marcelo) envia documentação técnica das APIs para a Farmarcas.
- [ ] Marcar agenda técnica dedicada para apresentar o passo a passo da integração (fora do refinamento de produto já agendado).
- [ ] **Gabriel** assume a liderança da frente de agendas técnicas pelo lado Farmarcas.
- [ ] Marcelo troca contato com Diego/Gabriel para dar sequência.
- [ ] Sugestão de criar uma cadência de governança (possível reunião semanal) para acompanhar a evolução da integração.
- [ ] Farmarcas reforça pedido de priorização por parte da Funcional, visando anúncio no encontro de Associados em agosto.
- [ ] Time interno vai apresentar a solução de PBM para Pedro e Wellington.
- [ ] Agenda técnica separada (possivelmente segunda-feira) com Felipe para tratar especificamente o contexto de PBM/Promotions.

---

## 7. Observações de validação

Todos os pontos de ambiguidade identificados na transcrição original foram esclarecidos e incorporados ao corpo do documento:
- Empresa parceira: **Funcional** (provedor de PBM).
- Laboratório citado: **Bayer**.
- Menção a "o ECO" no início: apenas contextualização da pauta da reunião (integração técnica com a Funcional), sem relação com nome de produto.
- ERPs homologados: **Alpha7**, **Trier** e **Softfarma** (fluxo de pré-venda já homologado); **Big/Linx** em homologação.
- Taxa: **4,4%**, taxa comercial negociada com a Farmarcas por transação, sem acréscimo para o canal digital.
- "Paty": **Patrícia Granjeiro**, gerente comercial responsável por PBM na Farmarcas.
- "Cl": referência à reunião semanal de alinhamento do **Squad CORE**, às segundas-feiras.
- Data da reunião: **02/07/2026**.
- Menção ao concorrente "Jesse": descartada (não confirmada/considerada irrelevante para o registro).

---

*Documento gerado a partir de transcrição fornecida pelo usuário, revisado e organizado por tópicos, com pontos de ambiguidade validados diretamente com o Product Owner da squad.*

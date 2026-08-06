# Apresentação Typesense

**Data:** 06/08/2026
**Fonte:** Anotações do Gemini (Google Meet), arquivo `Apresentação Typesense - 2026_08_06 10_29 GMT-03_00 - Anotações do Gemini.pdf`
**Convidados:** Gabriel Costa, Matheus Justino, Thiago Fernandes, Daniel Costa

> Esta transcrição editável foi gerada por computador (Gemini/Google Meet) e pode conter erros. Alguns trechos de fala sobreposta e ruídos de reconhecimento de voz foram mantidos como no original.

---

## Resumo

Apresentação da solução de busca TypeSense e definição de priorização estratégica para melhoria da conversão.

### Análise da ferramenta TypeSense

Demonstração técnica confirmou a alta performance da biblioteca para buscas e substituição eficiente do Elasticsearch. A tecnologia resolve problemas atuais de estoque com latência reduzida.

### Segurança e Arquitetura

Discussão sobre o uso de Docker e EC2 para hospedagem destacou a necessidade de um proxy reverso. Essa camada extra é essencial para proteger a integração contra exposição direta.

### Definição de prioridades estratégicas

Decisão estratégica de priorizar a implementação desta busca no próximo trimestre para maximizar conversão. O desenvolvimento da integração existente será mantido em paralelo com a análise técnica.

## Próximas etapas

- [ ] **[Wellington]** Analisar TypeSense: avaliar a viabilidade técnica e arquitetural da biblioteca TypeSense, incluindo a análise de segurança para evitar exposição e a comparação entre os cenários de implementação on-premises e via serviço pago (SaaS).
- [ ] **[Gabriel Costa]** Organizar reunião estratégica: organizar uma reunião presencial para discutir a estratégia de implementação da busca, incluindo a análise do parecer técnico do Wellington e o planejamento da sprint.

## Detalhes

### Apresentação da biblioteca TypeSense (00:00:08 / 00:02:03)

Gabriel Costa introduziu a biblioteca de pesquisa open source TypeSense, destacando-a como uma alternativa competitiva à ferramenta Algolia, que possui um custo elevado. Gabriel Costa descobriu a tecnologia ao analisar o catálogo de um parceiro e desenvolveu um protótipo dinâmico em aproximadamente 15 minutos, utilizando uma página HTML e dados carregados a partir de um arquivo Excel.

### Funcionalidades e Performance (00:04:27 / 00:10:59)

Gabriel Costa demonstrou que a ferramenta opera com tempos de resposta abaixo de 10 milissegundos devido ao processamento completo do catálogo em memória. A biblioteca suporta buscas semânticas, correção de digitação, sinônimos e busca parametrizada, funcionalidades testadas durante a reunião com termos como "Aptamil" e categorias de produtos, demonstrando alta assertividade.

### Configurações de Busca e Ordenação (00:08:26 / 00:09:34)

A ferramenta permite realizar impulsionamentos (boosts) em marcas específicas, ordenação por menor ou maior preço e concatenação dinâmica de filtros. Thiago Fernandes e Daniel Costa pontuaram a importância de garantir que essas funcionalidades, atualmente ausentes ou limitadas no sistema atual, sejam integradas com eficiência à experiência do usuário.

### Arquitetura e Hospedagem (00:10:59 / 00:13:23 / 00:22:26)

Gabriel Costa explicou que o projeto pode ser executado via Docker em uma instância EC2 com 32 GB de memória, suportando grandes volumes de dados. Gabriel Costa também detalhou a versão paga do serviço, que oferece benefícios adicionais como dashboard administrativo, rede de distribuição de conteúdo (CDN), alta disponibilidade e replicação geográfica para latência reduzida.

### Integração e Estratégia de Atualização (00:12:06 / 00:22:26)

Foi discutida a estratégia de atualização do catálogo, que pode ocorrer via inserções diárias em lote ou atualizações em tempo real (upsert) via requisição POST, permitindo que novos produtos reflitam na busca imediatamente. Daniel Costa sugeriu a possibilidade de implementação por fases para garantir que a transição ocorra de forma segura e controlada.

### Segurança da Implementação (00:18:24)

Thiago Fernandes e Gabriel Costa discutiram a necessidade de estabelecer uma camada de segurança entre o front-end e o TypeSense, recomendando a análise de um proxy reverso para evitar a exposição direta do serviço de busca, um ponto considerado um ponto de atenção na implementação observada no site de terceiros.

### Substituição do Elasticsearch e Gestão de Estoque (00:21:20)

Daniel Costa e Thiago Fernandes identificaram que o TypeSense tem potencial para substituir o Elasticsearch, resolvendo o problema técnico atual onde a busca sugere produtos que não estão disponíveis no estoque da loja. Gabriel Costa confirmou que a ferramenta permite filtrar a busca pelo identificador da loja (store ID), garantindo que apenas produtos com estoque sejam retornados aos clientes.

### Reavaliação da Estratégia do Trimestre (00:23:35)

Gabriel Costa propôs revisitar a estratégia do trimestre para priorizar a implementação da busca, argumentando que o ganho potencial em conversão e faturamento justifica o risco de adiar a entrega de outros projetos para a primeira quinzena do próximo trimestre. A equipe discutiu assumir esse risco para focar no desenvolvimento desta solução que ataca uma dor latente do negócio.

### Alinhamento de Desenvolvimento e Homologação (00:27:29 / 00:29:58)

Daniel Costa sugeriu manter o desenvolvimento da integração com o projeto Interplayers para não interromper o fluxo de trabalho, propondo paralelizar a homologação deste projeto com a análise técnica da nova ferramenta de busca. Thiago Fernandes agendou uma reunião para o dia seguinte com Wellington para avaliar o caso real de implementação do PBM funcional, visando avançar no back-end da solução.

### Próximos Passos e Agenda (00:31:07)

A equipe definiu um novo encontro para o dia seguinte, das 9h30 às 10h, para organizar a estratégia de implementação após o parecer técnico de Wellington sobre a viabilidade da ferramenta. Daniel Costa ressaltou a importância de manter o monitoramento sobre o risco relacionado à edição de pedidos no aplicativo como um ponto de atenção adicional para a equipe.

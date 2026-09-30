# Ecomm Web - Padrões e Arquitetura

**Data:** 28/09/2026
**Participantes:** Leon Viana, Felipe Goncalves, Thiago Fernandes, Victor Gutierre, Uelinton Martins, Joceli Junior, Diego Moritz, Diego Luz, Gustavo Leite, Rafael Chaves, Pedro Silveira, Diogo Soares, Matheus Galdino, Kaleb Borda, Joice Fernanda, Manuela Sene
**Fonte:** Anotações automáticas do Gemini (Google Meet)

---

## Resumo

Revisão arquitetural do Ecomm Web (novo canal web multibandeira, no mesmo espírito do app) com adoção de React/Next.js no front e .NET 10 no back.

- **Proposta de Arquitetura:** renderização no lado do servidor (SSR) via Next.js pra desempenho e SEO, combinada com .NET pra comunicação com as APIs de canal.
- **Fluxo de Contratos:** adoção de mocks baseados em contratos OpenAPI pra viabilizar desenvolvimento paralelo entre as equipes de back e front.
- **Pilha Tecnológica:** confirmado React como a nova tecnologia padrão do projeto, com Next.js no front-end e .NET 10 no back-end.

---

## Decisões

### Precisa de mais conversa

- **Gestão do carrinho de compras:** mover a gestão do carrinho do Core pra camada de BFF é um ponto em aberto — ainda precisa ser avaliado num fórum específico, pesando prós e contras. Com aval de Gabis, a ausência de integração imediata do carrinho não bloqueia o início do projeto.
- **Convivência com o portal legado:** o fluxo de convivência entre o sistema legado (Angular) e o novo Ecomm Web ainda não está definido — vai virar um spike específico.

### Alinhada

- **Stack tecnológica confirmada:** React 19 + Next.js 15 no front-end, .NET 10 no back-end.
- **Divisão de renderização:** SSR focado em página inicial, vitrines, catálogo, páginas de produto e busca; carrinho, checkout e área de perfil funcionam no client-side, com deploys independentes.
- **Fluxo de contratos OpenAPI:** o back-end (C#) exporta o schema OpenAPI em JSON, e o front-end roda um comando (Orval) pra gerar clientes HTTP tipados a partir dele — unificando a fonte de verdade entre back e front.
- **Operação multibandeira:** base de código única; tema, cores, fontes e dados carregados dinamicamente por marca via headers de requisição ou variáveis de ambiente.
- **Mocks baseados em contrato:** decisão consensual de usar mocks a partir do contrato OpenAPI pra destravar o desenvolvimento em paralelo, sem o front ficar bloqueado esperando o back.
- **Ambiente local:** Docker (containerizado) ou apontamento via variáveis de ambiente pro ambiente de homologação — qualquer um dos dois garante autonomia pro front-end.
- **Qualidade de código:** meta inicial de 100% de cobertura (linhas, branches, funções, instruções), com TDD, testes unitários, de componente, de arquitetura, de integração e smoke tests, além de análise de vulnerabilidades de dependências.
- **Cache em camadas:** CDN, cache de dados do Next.js e cache de identificação da API — excluindo preço e estoque da estratégia de cache, por regra de negócio.
- **Governança:** guardrails padronizados no mesmo espírito do projeto Core, arquivos de instrução pra agentes de IA, Makefile, convenções de Git, e modelo Git Flow com aprovação obrigatória de 2 revisores humanos por PR.
- **SonarQube:** vai virar gate obrigatório em pull request (estudo técnico de implementação em andamento).
- **Conformidade legal:** normas de comercialização farmacêutica online (identificação do farmacêutico responsável, restrição de propaganda de itens sob prescrição, regras pra controlados, LGPD, domínio obrigatório `.com.br`) serão estudadas e incorporadas ao desenvolvimento.

---

## Próximas Etapas

- [ ] **[Uelinton Martins]** Enviar material sobre .NET 10 pro Victor Gutierre, pra atualização da documentação.
- [ ] **[Gustavo Leite]** Pesquisar a viabilidade de usar o Storybook pra padronizar e visualizar serviços e funções compartilhadas.
- [ ] **[Victor Gutierre]** Investigar se o Storybook suporta visualização e teste de serviços e lógica de funções compartilhadas.
- [ ] **[Matheus Galdino, Thiago Fernandes, Uelinton Martins e outros]** Estudar leis e normas de comercialização de produtos farmacêuticos online, avaliando impacto nas funcionalidades da aplicação.
- [ ] **[Uelinton Martins, Victor Gutierre]** Validar os testes de arquitetura do sistema e implementar verificações automatizadas de conformidade com as diretrizes.
- [ ] **[Uelinton Martins]** Identificar biblioteca de análise de vulnerabilidades de dependências no front-end e integrá-la ao processo de desenvolvimento.
- [ ] **[Thiago Fernandes]** Levar a definição da fundação do projeto (guardrails, telas iniciais) pro planejamento da sprint; estruturar os repositórios pras configurações de build e deploy.
- [ ] **[Uelinton Martins, Victor Gutierre]** Definir e implementar a fundação dos projetos: pipeline, esteiras, documentação, convenções de código e versão zero do repositório.
- [ ] **[Uelinton Martins]** Concluir o estudo técnico sobre implementação do SonarQube como validação automática em pull requests.
- [ ] **[Grupo]** Criar um spike pra definir o plano de implementação e o fluxo de convivência entre o sistema legado e o novo projeto.
- [ ] **[Victor Gutierre]** Compartilhar os links dos repositórios com a equipe pra análise inicial.

---

## Detalhes da Reunião

### Proposta de Arquitetura e Requisitos de Negócio

Victor Gutierre apresentou a proposta de arquitetura do Ecomm Web, destacando como problema principal a necessidade de um canal web multibandeira semelhante ao app, com layouts e cores distintas por marca, além de forte apelo de SEO pra indexação orgânica de novas lojas no Google. A proposta usa SSR via Next.js pra desempenho e SEO, combinado com .NET pra comunicação com as APIs de canal, com contratos claros, testes definidos e guardrails de segurança.

### Definição de Versões e Camadas de Renderização

Uelinton Martins apontou que a versão do .NET usada será a 10, o que vai exigir ajustes na ferramenta Orval (detalhe a ser repassado depois). Victor Gutierre explicou que o SSR fica restrito à página inicial, vitrines, catálogo, páginas de produto e busca, enquanto as partes transacionais (carrinho, checkout, perfil) rodam no client-side, viabilizando deploys independentes.

### Estrutura de Pastas e Padrões de Organização

Victor Gutierre detalhou a estrutura modular do projeto: no front-end, Next.js 15 + React 19, Orval pra clientes HTTP tipados, Zustand pro controle de estado, e Vitest/Playwright/Storybook, com regras estritas contra importação cruzada entre módulos fora da pasta compartilhada. No back-end (.NET), a estrutura se divide em host, application, abstrações, infraestrutura e building blocks, com testes de arquitetura automatizados pra evitar violação de regras.

### Fluxo de Contratos OpenAPI e Multibandeira

Victor Gutierre explicou o fluxo: altera a API em C#, exporta o schema OpenAPI em JSON, roda um comando no front pra gerar clientes fortemente tipados — unificando a fonte de verdade entre back e front. A operação multibandeira roda numa base de código única, com tema, cor, fonte e dados carregados dinamicamente por marca via headers de requisição ou variáveis de ambiente.

### Demonstração Prática e Mecanismos de Validação

Victor Gutierre demonstrou o projeto integrado: testes no padrão Arrange-Act-Assert, Storybook pra visualizar componentes em diferentes temas/variações, e testes ponta a ponta com Playwright. Ao remover uma propriedade no back-end e regenerar o contrato, o build do front quebra imediatamente — prevenindo regressão antes mesmo do commit.

### Storybook: Dúvidas de Adoção

Gustavo Leite questionou o uso do Storybook frente à biblioteca Angular pré-existente (Alquimia), sobre desempenho com React e complexidade de construir componentes do zero. Victor Gutierre respondeu que o Storybook não aumenta a complexidade — basta um template básico e exportar as variantes pra visualização. Gustavo e Uelinton Martins debateram manutenção e a possibilidade de a ferramenta evoluir pra uma biblioteca de pacotes Node separados no futuro.

### Escopo e Armazenamento do Carrinho

Felipe Goncalves questionou o tratamento do carrinho no client-side e o impacto nas operações legadas. Uelinton Martins esclareceu que mover a gestão do carrinho do Core pra camada de BFF é um ponto em aberto, a avaliar num fórum específico. Daniel Costa e Thiago Fernandes complementaram que, com aval de Gabis, a ausência de integração imediata do carrinho não é bloqueio inicial — dá pra focar na fundação e nos guardrails de IA na próxima sprint, adiando a discussão do carrinho.

### Sincronização de Contratos entre Back-end e Front-end

Thiago Fernandes questionou qual equipe define o contrato de API primeiro, num modelo de repositório único. Rafael Chaves explicou que, no Portal, a prática é alinhar o contrato por conversa antes de codificar. Victor Gutierre complementou que, no app, o processo é parecido: a definição do DTO e a geração automática via contrato OpenAPI deixam o front consumir os dados sincronizado, sem bloqueio.

### Fluxo Back→Front via Mock e Swagger

A discussão abordou a dependência do front em relação ao back (o front usa o Swagger pra gerar as funções de requisição). Victor Gutierre apontou a alternativa de gerar uma API local só pra produzir o JSON; Rafael Chaves e Leon Viana defenderam mocks simplificados pra testar telas/componentes sem bloqueio operacional. Decisão consensual: mocks baseados em contrato, pra viabilizar desenvolvimento em paralelo.

### Escolha da Pilha Tecnológica (React vs. Angular)

Diego Luz contextualizou que o projeto anterior misturava React e Angular. Victor Gutierre apontou que o Next.js traz cache e SSR nativos. Uelinton Martins acrescentou que o projeto é compacto e que testes mostraram melhor desempenho de IA com React do que com Angular. Decisão consensual: React como nova stack padrão, pela leveza, simplicidade, otimização com IA e suporte a recursos avançados.

### Estrutura de Repositório e Ambiente Local

Gustavo Leite questionou o uso de gerenciadores de monorepo (ex.: NPX). Victor Gutierre respondeu que dá pra usar NPX, mas repositórios separados também funcionam. Uelinton Martins sugeriu Docker pra execução local, ou apontamento via variáveis de ambiente pro ambiente de homologação. Decisão: permitir Docker ou variáveis de ambiente, garantindo autonomia do front-end.

### Padronização e Governança

Uelinton Martins apresentou a necessidade de guardrails padronizados, no espírito do que já existe no projeto Core, reforçando que a evolução do software deve ser guiada por quem desenvolve no dia a dia, pra mitigar risco de mudanças frequentes. Ficou definido: arquivos de instrução pra agentes de IA, utilitários em Makefile, documentação de guardrails, convenções de Git, e Git Flow com aprovação obrigatória de 2 revisores humanos.

### Camadas de Arquitetura, Cache e Qualidade de Código

Uelinton Martins detalhou a estratégia de cache em camadas — CDN, dados do Next.js e cache de identificação da API — excluindo preço e estoque por regra de negócio. A qualidade de código vai exigir 100% de cobertura inicial (linhas, branches, funções, instruções), com TDD, testes unitários, de componente, de arquitetura, de integração e smoke tests, além de análise de vulnerabilidade em bibliotecas.

### Conformidade Legal pra E-commerce Farmacêutico

Uelinton Martins listou as exigências legais específicas: identificação do farmacêutico responsável, restrição de propaganda pra itens sob prescrição, regras pra itens controlados, conformidade com a LGPD, e obrigatoriedade do domínio `.com.br`. O time combinou estudar e incorporar essas exigências durante o desenvolvimento.

### Protocolos de IA e Fases de Desenvolvimento

O time discutiu o uso de ferramentas de IA e MCP (Model Context Protocol) pra evitar recomendações baseadas em dependências defasadas. Uelinton Martins recomendou o complemento Context7 pra manter recomendações atualizadas, além de Datadog, Figma e Playwright. O fluxo de desenvolvimento vai seguir fases estruturadas: especificação, planejamento, execução, depuração e revisão.

### Aprovação da Stack e Convivência com o Legado

Thiago Fernandes abriu espaço pra feedback sobre a escolha do React. Gustavo Leite e Diego Luz manifestaram apoio, ponderando a curva inicial de aprendizado. Gustavo e Thiago discutiram a convivência com o portal legado em Angular — uso de BFF, consultas via GraphQL, unificação da camada de autenticação, e migração modular de funcionalidades (pedidos, catálogo, estoque). Decisão: confirmar React e planejar a migração de forma faseada.

### Planejamento de Sprints e Fundação do Repositório

Thiago Fernandes e Uelinton Martins organizaram o planejamento das próximas sprints e das histórias de fundação. Uelinton e Victor Gutierre assumiram a estruturação da base inicial (pipelines de CI, Docker, guardrails). Uelinton relatou estudo sobre plugin pra integrar SonarQube como validação obrigatória em PR. O time também apontou a necessidade de tratar cadastro de clientes, carrinhos anônimos, e os mecanismos de convivência segura entre o sistema legado e o novo Ecomm Web.

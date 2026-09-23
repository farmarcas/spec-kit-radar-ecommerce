# Primeiro Papo Web Ecommerce

**Data:** 23/09/2026
**Participantes:** Rodrigo Nery, Daniel Costa, Diego Moritz, Felipe Goncalves, Gabriel Costa, Joceli Junior, Leon Viana, Thiago Fernandes, Victor Gutierre, Uelinton Martins, Matheus Justino
**Fonte:** Anotações automáticas do Gemini

---

## Resumo

Migração de gateway de pagamento com expansão omnicanal e definição da arquitetura web.

- **Migração de Gateway:** Tentativas de fraude forçaram a migração para a Cielo, exigindo novas camadas de segurança.
- **Arquitetura e Webcommerce:** Adoção do Next.js e BFF para estruturar o webcommerce integrado ao WhatsApp.
- **Escopo e MVP:** Definição do layout padronizado para a versão V1 com foco nas páginas de produtos.

---

## Decisões

### Precisa de mais conversa

- **Definição de domínios e URLs pelo marketing:** diferimento da definição final da estrutura de URLs e domínios da web para validação e estudos formais do time de marketing.
- **Alinhamento de URL com o marketing:** a definição da estrutura de URL e a comunicação institucional para o e-commerce web precisam ser alinhadas com o time de marketing.

### Alinhada

- **Adoção de canal e-commerce web próprio:** adoção de uma plataforma web de e-commerce como canal de vendas próprio adicional para atender à diretriz de omnicanalidade.
- **Padronização do layout único na V1:** manter o mesmo layout exato e padronizado para todas as lojas na primeira versão (V1) da plataforma web.
- **Utilização do Next.js no front-end web:** adoção do framework Next.js com Server-Side Rendering (SSR) para o desenvolvimento do front-end da aplicação web.
- **Utilização do AWS CloudFront como CDN:** utilização do AWS CloudFront como a camada oficial de CDN para otimização de performance e cache na web.
- **Adoção de Next.js com novo BFF:** ficou alinhado o uso de Next.js com um novo BFF para a stack tecnológica do projeto web.
- **Utilização de TypeScript no front-end:** o time alinhou a utilização de TypeScript no front-end para garantir tipagem no código.
- **Realização de refinamento técnico:** o time agendou uma reunião de refinamento para o dia seguinte, às 10h, para organizar os próximos passos e spikes.

---

## Próximas Etapas

- [ ] **[Gabriel Costa]** Definir URL: discutir estratégias de domínio para o e-commerce com o time de marketing. Identificar a melhor forma de implementação para o posicionamento da marca.
- [ ] **[Daniel Costa, Rodrigo Nery]** Mapear fluxo: desenhar o fluxo completo de compra, incluindo pontos de contato entre os estados logado e deslogado. Identificar requisitos para garantir uma jornada coerente.
- [ ] **[Joceli Junior]** Criar repositório: desenvolver o design system com Storybook assim que a stack for definida. Estruturar componentes reutilizáveis para atender às diferentes bandeiras.
- [ ] **[Gabriel Costa]** Validar APIs: verificar junto à Cielo se existem alterações contratuais ou técnicas necessárias para o consumo das APIs no ambiente web.
- [ ] **[Galdino]** Atualizar carrinho: incluir os requisitos de sincronização entre canais no estudo técnico do carrinho. Garantir a compatibilidade multicanal para o usuário logado.
- [ ] **[Grupo]** Avaliar componentes: estudar a viabilidade técnica de reutilizar componentes desenvolvidos pelo time do portal. Determinar se a integração atende às necessidades do novo projeto.
- [ ] **[Thiago Fernandes]** Validar CDN: avaliar com a equipe da ELV a eficácia do Amazon CloudFront quanto a performance e métricas do Web Vitals.
- [ ] **[Daniel Costa]** Alinhar URL: definir junto ao marketing a estrutura de URL e o formato do site institucional até a próxima segunda-feira.
- [ ] **[Thiago Fernandes]** Consultar Elitron: reunir o time da Elitron para validar a arquitetura e os protocolos de segurança do projeto.
- [ ] **[Daniel Costa, Thiago Fernandes]** Refinar tarefas: conduzir o refinamento técnico dos spikes e fluxos de desenvolvimento na reunião agendada para o dia seguinte às 10h.
- [ ] **[Diego Moritz]** Testar novo sistema: realizar testes do novo sistema web utilizando o inspetor de elementos e MCP para execução automatizada de casos de teste.

---

## Detalhes da Reunião

### Problemas de Fraude e Mudança de Gateway de Pagamento

Gabriel Costa relatou que tentativas de fraude com cartões obtidos na deep web e testados no marketplace levaram a operadora Pagar.me a abandonar a operação da Ultra devido ao risco de segurança, resultando na migração para a Cielo, o que exige a implementação de camadas adicionais de segurança na plataforma.

### Estratégia de Omnicanalidade e Expansão para o Webcommerce

Daniel Costa explicou que a diretoria estabeleceu uma estratégia omnicanal para estar presente em todos os canais possíveis (WhatsApp, Instagram, marketplace, aplicativo e novo webcommerce), permitindo que lojistas tragam consumidores de canais externos para canais próprios, reduzindo a dependência de taxas de terceiros (como os 15% cobrados sobre faturamentos expressivos no iFood) e agilizando a conversão no balcão sem a fricção de download de aplicativo.

### Uso do Webcommerce Integrado ao WhatsApp

Gabriel Costa apresentou um cenário de uso em que balconistas de farmácias podem enviar o link do webcommerce via WhatsApp para clientes que buscam produtos específicos (como fraldas), facilitando a pesquisa, o direcionamento e a conversão direta pelo site ou atendimento assistido.

### Diferenciação entre Site Institucional e Domínio de E-commerce

Diego Moritz e Daniel Costa discutiram o papel do site atual (ex.: drogariasultrapopular.com.br), que opera em WordPress e possui foco institucional e de prospecção de empresários ou leads para expansão por meio de blogs e SEO, sendo mantido separadamente da futura plataforma transacional.

### Definição de URLs e Domínios Específicos para Lojas

Daniel Costa, Gabriel Costa e Thiago Fernandes avaliaram as opções de endereçamento para o webcommerce, citando o exemplo da Febrafar (Farma VIP utilizando `e-commercefarmavip.edelivery.febrafar.com.br`), com a ponderação de Gabriel Costa sobre a usabilidade de nomes longos, e Uelinton Martins lembrando da exigência regulatória da Anvisa para o uso obrigatório de domínios `.com.br`.

### Alinhamento sobre a Estrutura de Domínio com a Equipe de Marketing

Gabriel Costa determinou que a definição final da URL e do posicionamento de domínios (como `loja.ultrapopular.com.br`) será alinhada com a equipe de marketing, que realizará os estudos de posicionamento e viabilidade técnica.

### Customização de Layout na Versão V1

Joceli Junior questionou sobre a possibilidade de customizações individuais por lojista (como menus laterais), ao que Gabriel Costa definiu que a versão V1 manterá um layout padronizado e idêntico para todas as redes, evitando customizações iniciais desnecessárias.

### Estrutura de URLs Amigáveis e Indexação no Google

Thiago Fernandes apresentou um estudo preliminar utilizando a ferramenta Cursor, propondo uma estrutura de mapeamento de URLs indexáveis pelo Google baseada em formato de cidade e loja para garantir a regionalização do SEO.

### Status do Fluxo de Compra e Desenvolvimento da Interface

Thiago Fernandes e Rodrigo Nery debateram o andamento do fluxo de ponta a ponta, com Rodrigo Nery esclarecendo que possui apenas esboços preliminares da página de produto (PDP) e que o fluxo completo exige mais tempo de detalhamento para validação de gargalos voltados ao quarto trimestre.

### Criação do Design System e Repositório Dedicado

Joceli Junior sugeriu a criação antecipada de um Design System próprio e um repositório dedicado com o Storybook e componentes isolados logo após a definição da stack tecnológica, visando acelerar a montagem das telas, proposta apoiada por Gabriel Costa.

### Envolvimento de Parceiros de Infraestrutura e Segurança

Gabriel Costa orientou a inclusão do time da Elven para planejar o acréscimo de custos de cloud e da Elitron para realizar testes de penetração (*pentests*) futuros na aplicação.

### Mapeamento de Integrações Externas e APIs

Gabriel Costa e Thiago Fernandes destacaram a necessidade de verificar junto à Cielo possíveis alterações contratuais ou de consumo de APIs na transição do aplicativo para a web, bem como a implementação de bibliotecas de criptografia de cartão de crédito (como TMX).

### Paridade de Experiência e Tratativas de Usuário Logado e Deslogado

Thiago Fernandes e Daniel Costa discutiram os pontos de contato para autenticação, estabelecendo que a experiência na web deve espelhar o aplicativo, solicitando login em ações principais (ativação de ofertas ou adição ao carrinho), com Daniel Costa explicando que a página inicial exige a localização prévia da farmácia devido às limitações do modelo de negócio em que cada loja possui preços e estoques independentes.

### Viabilidade de Compra sem Login Prévio (Guest Checkout)

Diego Moritz, Victor Gutierre e Joceli Junior argumentaram sobre a possibilidade de permitir compras na web sem login obrigatório prévio (estilo visitante com mini-cadastro solicitando e-mail e gerando senha aleatória), contrapondo-se às restrições do modelo de negócio apresentadas por Daniel Costa quanto à identificação obrigatória da farmácia local.

### Paridade de Funcionalidades entre Aplicativo e Web

Thiago Fernandes determinou que novas funcionalidades devem ser lançadas simultaneamente em ambos os canais (aplicativo e web), adaptando experiências físicas específicas de hardware, como o uso da câmera para envio de receitas médicas.

### Refatoração do Carrinho e Sincronização Multicanal

Uelinton Martins pontuou a necessidade de tratar a refatoração do carrinho em andamento (que atualmente usa identificador de dispositivo móvel) para suportar a web e garantir a sincronização compartilhada do carrinho quando a pessoa usuária estiver logada em múltiplos canais.

### Escolha da Stack Tecnológica

Victor Gutierre sugeriu a adoção do Next.js para renderização no lado do servidor (*SSR*) na página inicial, PDP e vitrines para otimizar SEO e performance, deixando as áreas logadas no lado do cliente (*client-side*).

### Debate sobre Arquitetura de BFF (Backend for Frontend)

Uelinton Martins defendeu a criação de um BFF unificado multicanal para evitar duplicação e suportar futuros canais como o WhatsApp, enquanto Victor Gutierre e Thiago Fernandes argumentaram a favor de um BFF web separado para isolar o código legado do aplicativo e evitar excessos de condicionais (*if-else*) no código.

### Análise de Arquitetura C4 e Governança de APIs

Thiago Fernandes detalhou os diagramas C4 apresentados, abordando o roteamento via Kong API Gateway, aplicação de limites de taxa (*rate limits*), prefixos de API (`/api/web`), e restrições de CORS para proteger contra injeções e atender exclusivamente aos domínios das 12 bandeiras (sendo 4 próprias, 7 administradas e 1 Megafarma, conforme detalhado por Daniel Costa).

### Configuração de CDN e Otimização de Performance

Victor Gutierre, Uelinton Martins e Thiago Fernandes discutiram o uso do CloudFront da AWS integrado com buckets S3 para ativos e imagens, avaliando métricas de performance, cache de borda, tempos de carregamento e o cumprimento das métricas de Core Web Vitals (como o LCP abaixo de 2,5 segundos).

### Testes Automatizados, Acessibilidade e Validação Final

Victor Gutierre e Uelinton Martins enfatizaram a importância de iniciar o projeto com padrões rígidos de qualidade (*quality gates*, testes unitários, testes end-to-end com Playwright ou Cypress) e validações de acessibilidade (a11y) para garantir um posicionamento orgânico eficiente nos buscadores.

### Proposta de URL e Requisitos de Segurança e Pagamento

Thiago Fernandes apresenta uma proposta de URL estruturada para o motor de busca com o nome da cidade e da loja para evitar a priorização indevida de farmácias específicas. São discutidas métricas de performance recomendadas e exigências de segurança web, como limites de taxa, CORS e configurações nas camadas de borda. Além disso, sugere-se o contato com a equipe de pagamentos para migrar o e-commerce do aplicativo para a web, implementando bibliotecas necessárias para a tokenização de cartões.

### Criptografia de Carrinho e Histórico de Pagamentos

Uelinton Martins relembra um ataque anterior em que payloads de carrinhos de compras foram modificados para alterar valores, propondo criptografar os dados entre o navegador e o backend. Discute-se com Felipe Goncalves e Daniel Costa o funcionamento do gateway de pagamento (Braspag), que realiza a tokenização enviando apenas o token e mascarando os últimos quatro dígitos, mantendo as restrições de IP mapeadas do lado da Cielo.

### Tokenização de Cartão pelo Frontend e Prevenção de Fraude

Felipe Goncalves e Thiago Fernandes alinham que a tokenização de cartões deve ocorrer diretamente no frontend utilizando bibliotecas da Braspag, evitando o tráfego de dados abertos no backend. Daniel Costa propõe a criação de regras no frontend para limitar tentativas excessivas de salvamento de cartões em um curto período para coibir testes de cartões quentes, gerando um debate com Gabriel Costa sobre se essa responsabilidade deveria pertencer ao antifraude ou às regras de velocity do gateway.

### Definição da Pilha Tecnológica e Estrutura de URL

Thiago Fernandes confirma a escolha da pilha tecnológica utilizando Next.js e um novo BFF, acompanhada de uma estrutura de URL baseada no domínio da bandeira seguido da cidade e da loja (ex.: `loja.com.br/cidade/loja`). Daniel Costa assume o compromisso de alinhar a URL e a proposta visual com a equipe de marketing no máximo até segunda-feira, pontuando que o uso de subdomínio dispensa verificações de disponibilidade externa.

### Próximos Passos Técnicos e Linguagem de Programação

Thiago Fernandes aponta como próximos passos a execução de spikes de frontend e estruturantes, utilizando Superpers e GraphQL (nome conforme transcrição automática — validar termo correto). Joceli Junior e Leon Viana comentam sobre a familiaridade com Next.js e JavaScript, e Victor Gutierre questiona o uso de TypeScript, que é prontamente apoiado por Joceli Junior e Thiago Fernandes para garantir a tipagem estrita do código.

### Alinhamentos Finais, Custos de Ferramentas de IA e Cronograma

Gabriel Costa destaca que o principal desafio envolve o alinhamento com áreas correlacionadas, como marketing e arquitetura, enquanto Daniel Costa agenda a reunião com o marketing até segunda-feira e reforça o refinamento da squad marcado para o dia seguinte às 10h. Comenta-se também sobre os limites e custos de uso da ferramenta Cursor IA pela equipe, e Felipe Goncalves estima um prazo de cerca de quatro dias para o desenvolvimento do BFF.

### Escopo do MVP e Percepção de Funcionalidades

Joceli Junior questiona a definição inicial do MVP, o que leva Daniel Costa a expressar preocupação quanto ao lançamento de uma versão web desprovida de funcionalidades essenciais já presentes no aplicativo (como PBM e pagamento online), o que poderia impactar negativamente a percepção interna e dos associados. Thiago Fernandes esclarece a recomendação de priorizar páginas de produtos das lojas em vez de focar na home institucional para evitar conflitos prévios.

### Processo de Testes Automatizados no Novo Sistema Web

Diego Moritz e Gabriel Costa discutem a facilidade de testes no ambiente web através da inspeção de requisições, com Diego Moritz mencionando o uso de ferramentas com o protocolo MCP (Model Context Protocol) para inserir casos de teste e automatizar a execução no novo sistema.

---

*Transcrição gerada automaticamente pelo Gemini e convertida para Markdown.*

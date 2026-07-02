# Radar E-commerce — Spec Kit (Squad App)

> A fonte da verdade que um agente de IA pode **confiar**, não só ler.

Toda empresa tem documentação de produto. Quase nenhuma é escrita para ser consumida por um agente de IA centenas de vezes por dia, como pré-condição para ele produzir trabalho confiável. Este repositório é uma aposta nisso: transformar contexto de produto — visão, glossário, specs, decisões — em algo estruturado o suficiente para que um agente de IA gere histórias, critérios de aceite e specs **sem alucinar**, e verificável o suficiente para que qualquer pessoa audite o que o agente leu antes de agir.

## O problema que isso ataca

Hoje, o conhecimento sobre o Radar E-commerce está espalhado entre Jira, PDFs de fornecedor, decisões de reunião e a cabeça de quem participou da discussão. Isso já é ruim para pessoas novas no time. Para um agente de IA é pior: sem contexto estruturado, ele não erra por falta de capacidade — erra porque **inventa** com total confiança. Uma história gerada sem o glossário correto troca "Lojista" por "Loja" e ninguém percebe até o PO ler. Uma spec escrita sem o contexto do NSM otimiza a funcionalidade errada.

A resposta aqui não é "revisar mais". É não dar ao agente a chance de improvisar: [`CLAUDE.md`](CLAUDE.md) funciona como uma constituição — o que ler antes de qualquer tarefa, que terminologia é obrigatória, quando parar e perguntar em vez de assumir. O repositório inteiro é a superfície que essa constituição governa.

## A aposta: agentes de IA como parte do time de produto, não como autocomplete

O fluxo hoje já funciona ponta a ponta, mas manualmente: uma spec em `specs/features/` vira histórias no formato Jira via [`prompts/gerar-historias.md`](prompts/gerar-historias.md), seguindo os exemplos reais em `specs/examples/`, e alguém cola o resultado no Jira. Isso já economiza o trabalho mais chato de PO — traduzir "o que construir" em critérios de aceite testáveis.

Mas o `TODO.md` deste repositório aponta para algo mais radical do que "gerar histórias mais rápido":

- **O agente escreve direto no Jira** (MCP), eliminando o copiar-e-colar — spec vira ticket sem humano no meio.
- **O agente enxerga o código** (MCP GitHub), fechando o ciclo spec → história → PR → verificação de que o comportamento entregue bate com a spec.
- **Multi-squad**: se este padrão funciona para o App, o mesmo contrato (`CLAUDE.md` + contexto + specs) se replica para Portal e Core — cada squad com sua própria fonte da verdade, mas com a mesma disciplina anti-alucinação.
- **Documentação viva de integrações externas** (o PBM/Interplayers já começou isso em `specs/features/001-app-ecommerce/PBM/`) — em vez do conhecimento de uma API de fornecedor viver só num PDF que uma pessoa leu uma vez.

O salto real não é técnico, é de papel: hoje uma pessoa lê a spec e escreve a história. Amanhã, o agente lê a spec e escreve a história — e a pessoa audita. Depois disso, com sprint status, roadmap e KPIs também versionados aqui, a pergunta natural é: por que não deixar o agente **propor** a próxima spec a partir dos dados (conversão caindo, PBM não integrado, NMT abaixo da meta) e o time humano decidir se aprova? Esse é o horizonte para o qual este repositório está desenhado, mesmo que ainda não exista.

## Isso só funciona se o contexto for verdade

Uma fonte da verdade pela metade é pior do que nenhuma, porque projeta confiança que não existe. Hoje isso ainda não é 100% verdade aqui:

- `context/architecture.md` está **vazio** — qualquer agente que precise de stack técnica vai perguntar, porque não tem de onde tirar.
- `decisions/` está **vazia** — nenhum ADR registrado ainda, então "respeite decisões passadas" não tem o que respeitar.

Isso não invalida a aposta — mas é o gargalo real. O valor deste repositório cresce exatamente na proporção em que essas lacunas fecham.

## Estrutura

```
spec-kit-radar-ecommerce/
├── context/              # visão de produto, glossário, arquitetura
├── specs/
│   ├── features/         # specs por feature (ex.: 001-app-ecommerce, pbm)
│   ├── examples/         # histórias reais usadas como padrão
│   └── templates/        # template de spec de feature
├── prompts/              # prompts padronizados (ex.: gerar histórias)
├── decisions/            # ADRs — decisões técnicas/produto registradas
├── sprints/              # status atual da sprint
├── assets/roadmap/       # roadmap trimestral por squad
└── CLAUDE.md             # regras de comportamento para agentes de IA
```

## Como usar

- **Para gerar histórias de uma feature:** abra o Claude Code neste repositório e siga o prompt em [`prompts/gerar-historias.md`](prompts/gerar-historias.md), referenciando a spec desejada em `specs/features/`.
- **Para consultar o estado do produto:** [`context/product.md`](context/product.md) (visão, NSM, KPIs, time) e [`context/glossary.md`](context/glossary.md) (terminologia do domínio).
- **Para entender uma feature em detalhe:** `specs/features/<nome>/spec.md` (o quê e porquê) e `plan.md`/`tasks.md` (como e execução).
- **Para saber o que está em andamento:** [`sprints/status-atual.md`](sprints/status-atual.md).

As regras de comportamento para agentes de IA — o que ler antes de cada tarefa, terminologia obrigatória, formato de história — estão centralizadas em [`CLAUDE.md`](CLAUDE.md). Se você é um agente lendo isto: comece por lá.

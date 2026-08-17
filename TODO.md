# TODO — Spec Kit Radar E-commerce

## Em andamento

- [ ] Reorganizar estrutura do repositório por squads (app, portal, core)
  - [x] Criar esqueleto `squads/{app,portal,core}/` com `CLAUDE.md` + `product.md` específicos por squad
  - [ ] Preencher `squads/portal/product.md` com dados reais (KPIs, entregas, time) — hoje é template vazio
  - [ ] Preencher `squads/core/product.md` — hoje é template vazio, quase nada documentado sobre essa squad ainda
  - [ ] Revisar e mover specs existentes para os novos caminhos (checklist abaixo) sem quebrar links relativos entre documentos
  - [ ] Depois da migração, enxugar `CLAUDE.md` da raiz para regras universais (hoje ainda fala como se fosse só a squad App) e generalizar `context/product.md` (hoje só cobre o App; visão/NSM/modelo de negócio deveriam ficar lá, o resto migra pra `squads/app/product.md`)

### Checklist de migração (caminho atual → novo) — revisar antes de mover, nada foi movido ainda

  - [ ] `specs/features/001-app-ecommerce/` → `squads/app/specs/features/`
  - [ ] `sprints/status-atual.md` → `squads/app/sprints/status-atual.md`
  - [ ] `assets/roadmap/roadmap-app-q3-2026.md` → `squads/app/roadmap/`
  - [ ] `specs/features/portal/` → `squads/portal/specs/features/`
  - [ ] Conteúdo específico de App em `context/product.md` (KPIs, time, entregas, personas, "Fora do escopo do App") → `squads/app/product.md`

## Próximos passos

- [ ] Conectar via MCP para escrever histórias diretamente no Jira
  - [ ] Configurar MCP do Jira no Claude Code
  - [ ] Configurar MCP do GitHub no Claude Code
  - [ ] Testar fluxo completo: spec → Claude Code → história criada no Jira (GPEEDS)

## Backlog

- [ ] Preencher `context/architecture.md` com stack real do time
- [ ] Criar `squads/portal/specs/` com histórias do Portal (Q3: editar pedido OMS, comissão de vendas, estoque e preço)
- [ ] Criar spec da feature PBM em `squads/app/specs/features/pbm.md`
- [ ] Adicionar glossário de termos técnicos da API Interplayers em `docs/`
- [ ] Configurar `squads/core/specs/` com contexto da Squad Core

## Concluído

- [x] Criar estrutura inicial do repositório
- [x] Preencher `context/product.md` com informações reais do Radar
- [x] Preencher `context/glossary.md` com termos do domínio
- [x] Adicionar histórias reais como exemplos em `specs/examples/historias-exemplo.md`
- [x] Configurar `prompts/gerar-historias.md` com padrão real do time
- [x] Adicionar documentação de API do PBM em `docs/`
- [x] Configurar `.claude/settings.json`
- [x] Renomear repositório para `spec-kit-radar-ecommerce`
- [x] Configurar SSH no GitHub
- [x] Adicionar roadmap Q3 2026 do App em `assets/roadmap/`
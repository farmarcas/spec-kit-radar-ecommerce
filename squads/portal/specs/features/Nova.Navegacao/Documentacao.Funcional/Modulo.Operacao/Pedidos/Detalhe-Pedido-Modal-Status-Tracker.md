# Pedidos — Detalhe do Pedido: Modal, Navegação e Status Tracker

**Módulo:** Operação
**Histórias:** [ECP-1516](https://farmarcas.atlassian.net/browse/ECP-1516) — Detalhe do Pedido: Modal, Navegação e Status Tracker
**Referência UX:** [ECP-1313](https://farmarcas.atlassian.net/browse/ECP-1313) (Detalhe do pedido, consulta)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seção 6.6
**Componente novo:** Status Tracker horizontal (criado do zero em React aqui — ver [[feedback_design_system_components_on_demand]])
**Status:** Em desenvolvimento
**Última atualização:** 2026-09-30

---

## 1. O que é

O detalhe do pedido é um modal (não uma tela própria), com navegação embutida entre pedidos adjacentes da lista carregada e um status tracker horizontal que substitui a trilha vertical existente hoje (usada na Trilha de Auditoria).

## 2. Estrutura

- Modal, largura máxima 1180px, altura dinâmica até 90% da viewport.
- Navegação ◀ / ▶ "próximo pedido" dentro do próprio modal — desabilitada no primeiro/último pedido da lista carregada.
- Status tracker horizontal, com destaque vermelho na etapa atual quando o pedido está atrasado.

## 3. Regras de negócio

### 3.1 Comportamento condicional por tipo de entrega

Retirada oculta o campo de taxa de entrega.

### 3.2 Nomenclatura de pagamento

**"COBRAR"** (dinheiro, Pix ou maquininha ainda não processado) vs. **"PAGO"** (crédito, débito ou Pix já processado).

### 3.3 Tag "Editado"

Pedido teve item removido ou substituído — consistente com o modelo já fechado em `PRD-edicao-pedidos-etapa-revisao.md`.

### 3.4 Pedidos cancelados

Não mostram o status tracker — mostram o motivo do cancelamento no lugar.

### 3.5 Fechamento automático em status final

Ao chegar em status final (Concluído ou Cancelado), o modal fecha automaticamente — evita deixar aberto um pedido que já saiu da lista ativa.

### 3.6 Pendência de nomenclatura de campo

O bloco "Loja responsável" (CNPJ + nome) aparece tanto em Entrega quanto em Retirada. Não está claro se é o mesmo campo citado como "Filial responsável" na v1.0 do PRD (que previa ocultar em Retirada) — a regra de ocultar não está implementada assim no protótipo. **Confirmar com Matheus antes de fechar.**

## 4. Nível de integração / fonte de dados

- Pedido em `edelivery_order.order_data` — ver regras gerais de status/timestamp em [[feedback_status_change_query_rules]] (aplicam ao status tracker, já que ele reflete o histórico de subdocs de status do pedido).
- Motivo de cancelamento: quando `canceledReason` vem vazio, **não é motivo desconhecido** — em 100% de uma amostra checada, correspondeu a cancelamento feito direto no ERP pela loja (chega via integração, sem texto de motivo). Rotular como "Cancelado direto no ERP (pela loja)", nunca como erro/falha de integração (ver [[feedback_status_change_query_rules]]).
- Componente Status Tracker: novo em React, deve ser genérico o suficiente pra ser reaproveitado por outras telas — não acoplado só a este modal.

## 5. Cenários de borda

| Cenário | Regra |
|---|---|
| Pedido do tipo Retirada | Taxa de entrega oculta |
| Navego pro próximo pedido (▶) com o pedido atual em último da lista | Botão ▶ desabilitado |
| Pedido avança pra status final durante a visualização | Modal fecha automaticamente |
| `canceledReason` vazio | Trata como cancelamento via ERP, não como erro |

## 6. Pendências / perguntas em aberto

- [ ] "Loja responsável" vs. "Filial responsável" — confirmar com Matheus se são o mesmo campo e se a regra de ocultar em Retirada ainda vale.
- [ ] Fonte exata (endpoint) do detalhe do pedido — não levantada ainda.

## Changelog

- **2026-09-30** — Criação do documento (v1), a partir de ECP-1516, ECP-1313, PRD seção 6.6, e [[feedback_status_change_query_rules]].

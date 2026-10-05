# Pedidos — Detalhe do Pedido: Modal, Navegação e Status Tracker

**Módulo:** Operação
**Histórias:** [ECP-1516](https://farmarcas.atlassian.net/browse/ECP-1516) (Detalhe do pedido: abertura, navegação e status tracker), [ECP-1560](https://farmarcas.atlassian.net/browse/ECP-1560) (Receitas médicas no detalhe do pedido; mesma regra da [ECP-1481](https://farmarcas.atlassian.net/browse/ECP-1481) no Portal atual)
**Referência UX:** [ECP-1313](https://farmarcas.atlassian.net/browse/ECP-1313) (Detalhe do pedido, consulta)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seção 6.6
**Componente novo:** Status Tracker horizontal (criado do zero em React aqui — ver [[feedback_design_system_components_on_demand]])
**Status:** Em desenvolvimento
**Última atualização:** 2026-10-02

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

### 3.5 Status final dentro do modal

Ao chegar em status final (Concluído ou Cancelado), o modal permanece aberto com o pedido no novo status e a confirmação visual; ele só fecha quando o usuário o fecha. O pedido sai da lista de "Em andamento" no mesmo instante em que é concluído ou cancelado: passa para "Finalizados" e os contadores das abas são atualizados, sem esperar o modal ser fechado. O comportamento pós-ação é entregue nas Histórias de avanço de status e de cancelamento ([Avanco-Status-e-Cancelamento.md](Avanco-Status-e-Cancelamento.md)).

### 3.6 "Loja responsável" = "Filial responsável" (resolvido 2026-10-01)

Mesmo conceito, exibido em lugares diferentes conforme o tipo de entrega — não são dois campos duplicados:
- **Retirada:** aparece dentro do container único de endereço/pagamento, rotulado "Loja responsável" (CNPJ + endereço da loja).
- **Entrega:** existe um card lateral dedicado "Loja responsável", que fica **oculto na Retirada** (porque a informação já está no container principal nesse caso).

### 3.7 Receitas médicas

Seção "Receita médica (Rx)" no detalhe, **em todas as etapas**, só quando o pedido tem receita enviada pelo app (`attachmentUrls` não vazio). Cada receita é nomeada "Receita 1", "Receita 2"... na ordem do array (nunca o nome do arquivo), com "Enviado em" = data/hora de criação do pedido (igual para todas). Ações: baixar cada receita ou "Baixar todos" — o Portal só baixa, sem preview. Estados do download: "Baixando...", ✓ por 5 segundos com "Download concluído", e em falha "Não foi possível baixar. Tente novamente." com snackbar "Erro ao baixar. Verifique a sua conexão."

É somente consulta: não bloqueia avançar, imprimir ou cancelar o pedido, e não há status, badge, alerta nem ação obrigatória associada à receita. Os campos legados por produto (`PrescriptionUrl`, `PrescriptionFileName`, `PrescriptionVisualized`) e o endpoint de "visualizada" não fazem parte do Portal novo. Regra de origem: ECP-1481 e PRD do App (`specs/features/001-app-ecommerce/Envio de receita/PRD-envio-receita-app.md`, 6.4 e 6.10); formatos aceitos no envio: JPG, PNG ou PDF, até 2 MB.

### 3.9 Navegação ◀ / ▶ depois que o pedido sai da lista

Quando o pedido aberto é concluído ou cancelado e sai da lista, a navegação segue a fila em aberto, na ordenação dos abertos: ▶ mostra o próximo pedido da fila em aberto; ◀ mostra o pedido anterior da fila em aberto. O pedido recém-fechado nunca é alvo da navegação (voltar não redireciona para o último que foi fechado).

### 3.8 Interações da linha e informações do modal

- Clique em qualquer ponto da linha abre o detalhe; linha do pedido aberto destacada; tooltips de nome truncado e de itens.
- Informações: cliente (nome, CPF, telefone), itens, pagamento, entrega/retirada, loja responsável e trilha de auditoria (eventos com responsável, data e hora).
- Pedido cancelado mostra o motivo e quem cancelou no lugar do tracker; motivo vazio é exibido como "Cancelado direto no ERP (pela loja)".

## 4. Nível de integração / fonte de dados

- Detalhe do pedido: hoje `GET backoffice/orders/{orderId}` (`OrderDetail`: itens, cliente, pagamento, entrega, composição do total, trilha de auditoria e `AttachmentUrls`). A receita vem de `OrderData.Prescriptions`, exposta como `AttachmentUrls` (`ecomm-api-order-dotnet`).

- Pedido em `edelivery_order.order_data` — ver regras gerais de status/timestamp em [[feedback_status_change_query_rules]] (aplicam ao status tracker, já que ele reflete o histórico de subdocs de status do pedido).
- Motivo de cancelamento: quando `canceledReason` vem vazio, **não é motivo desconhecido** — em 100% de uma amostra checada, correspondeu a cancelamento feito direto no ERP pela loja (chega via integração, sem texto de motivo). Rotular como "Cancelado direto no ERP (pela loja)", nunca como erro/falha de integração (ver [[feedback_status_change_query_rules]]).
- Componente Status Tracker: novo em React, deve ser genérico o suficiente pra ser reaproveitado por outras telas — não acoplado só a este modal.

## 5. Cenários de borda

| Cenário | Regra |
|---|---|
| Pedido do tipo Retirada | Taxa de entrega oculta |
| Navego pro próximo pedido (▶) com o pedido atual em último da lista | Botão ▶ desabilitado |
| Pedido avança pra status final durante a visualização | Modal permanece aberto até o usuário fechar (ver 3.5) |
| Pedido sem receita enviada | Seção "Receita médica (Rx)" não aparece |
| Pedido com receita não baixada | Avançar, imprimir e cancelar seguem normalmente, sem bloqueio |
| `canceledReason` vazio | Trata como cancelamento via ERP, não como erro |
| Pedido do tipo Retirada | "Loja responsável" aparece dentro do container principal, não como card separado |
| Pedido do tipo Entrega | Card lateral dedicado "Loja responsável" aparece, além do container de endereço |

## 6. Pendências / perguntas em aberto

- [ ] Nenhuma pendência de produto em aberto neste documento.

## Changelog

- **2026-10-05 (2)** — O pedido concluído ou cancelado sai de "Em andamento" e vai para "Finalizados" no mesmo instante da ação (não mais ao fechar o modal); o modal segue aberto até o usuário fechar (3.5).
- **2026-10-05** — O fechamento automático do modal em status final deixa de existir (3.5): o modal permanece aberto e só fecha por ação do usuário; o pedido sai de "Em andamento" quando o modal é fechado.
- **2026-10-02 (2)** — Adicionada a regra de navegação ◀ / ▶ depois que o pedido sai da lista (3.9) e o momento da saída da lista (quando o modal fecha).

- **2026-10-02** — Adicionadas a seção de receitas médicas (3.7, regra da ECP-1481 reaproveitada: todas as etapas, só consulta e download, sem bloqueio nem alerta, "Receita N", "Enviado em" = criação do pedido) e as interações da linha/informações do modal (3.8). Fechamento automático do modal agora está implementado no protótipo e é entregue nas Histórias de avanço e cancelamento. Pendência de fonte do detalhe resolvida (`GET backoffice/orders/{orderId}`).

- **2026-10-01** — Revalidado contra o código-fonte do protótipo Claude Design: resolvida a pendência "Loja responsável"/"Filial responsável" (mesmo conceito, posições diferentes por tipo); confirmado que o fechamento automático em status final está correto mas ainda não implementado no protótipo (prompt de ajuste já enviado).
- **2026-09-30** — Criação do documento (v1), a partir de ECP-1516, ECP-1313, PRD seção 6.6, e [[feedback_status_change_query_rules]].

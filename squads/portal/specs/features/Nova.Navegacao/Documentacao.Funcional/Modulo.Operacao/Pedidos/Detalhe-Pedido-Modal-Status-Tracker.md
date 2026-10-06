# Pedidos — Detalhe do Pedido: Modal, Navegação e Status Tracker

**Módulo:** Operação
**Histórias:** [ECP-1516](https://farmarcas.atlassian.net/browse/ECP-1516) (Detalhe do pedido: abertura, navegação e status tracker), [ECP-1560](https://farmarcas.atlassian.net/browse/ECP-1560) (Receitas médicas no detalhe do pedido; mesma regra da [ECP-1481](https://farmarcas.atlassian.net/browse/ECP-1481) no Portal atual)
**Referência UX:** [ECP-1313](https://farmarcas.atlassian.net/browse/ECP-1313) (Detalhe do pedido, consulta)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seção 6.6
**Componente novo:** Status Tracker horizontal (criado do zero em React aqui — ver [[feedback_design_system_components_on_demand]])
**Status:** Em desenvolvimento
**Última atualização:** 2026-10-06

---

## 1. O que é

O detalhe do pedido é um modal (não uma tela própria), com navegação embutida entre pedidos adjacentes da lista carregada e um status tracker horizontal que substitui a trilha vertical existente hoje (usada na Trilha de Auditoria).

## 2. Estrutura

- Modal, largura máxima 1180px, altura dinâmica até 90% da viewport.
- Navegação ▲ (anterior) / ▼ (próximo) dentro do próprio modal — desabilitada no primeiro/último pedido da lista carregada.
- Barra superior: botões ▲ ▼, título "Pedido #<número>", botão de imprimir (3.10) e botão "x" para fechar.
- Status tracker horizontal, com destaque vermelho na etapa atual quando o pedido está atrasado.

## 3. Regras de negócio

### 3.1 Comportamento condicional por tipo de entrega

Retirada oculta o campo de taxa de entrega.

**Variantes de pedido** consideradas no detalhe: pago online, pago offline (Cobrar), entrega, retirada, frete grátis, troco e cliente recorrente. A composição do total mostra subtotal, taxa de entrega (valor ou "Grátis" quando o frete é grátis; oculta na Retirada) e "Total (cobrar do cliente)" na Entrega ou "Total" na Retirada; com troco, mostra o valor com que o cliente paga e o troco.

### 3.2 Nomenclatura de pagamento

**"COBRAR"** (dinheiro, Pix ou maquininha ainda não processado) vs. **"PAGO"** (crédito, débito ou Pix já processado).

### 3.3 Tag "Editado"

Pedido teve item removido ou substituído — consistente com o modelo já fechado em `PRD-edicao-pedidos-etapa-revisao.md`.

### 3.4 Pedidos cancelados

Não mostram o status tracker — mostram a caixa "Pedido cancelado" com o motivo do cancelamento e "Cancelado por"; quando o cancelamento veio do ERP/automático, "Cancelado por" mostra **"sistema"** (o motivo vazio segue como "Cancelado direto no ERP (pela loja)").

### 3.5 Status final dentro do modal

Ao chegar em status final (Concluído ou Cancelado), o modal permanece aberto com o pedido no novo status e a confirmação visual; ele só fecha quando o usuário o fecha. O pedido sai da lista de "Em andamento" no mesmo instante em que é concluído ou cancelado: passa para "Finalizados" e os contadores das abas são atualizados, sem esperar o modal ser fechado. O comportamento pós-ação é entregue nas Histórias de avanço de status e de cancelamento ([Avanco-Status-e-Cancelamento.md](Avanco-Status-e-Cancelamento.md)).

### 3.6 "Loja responsável" = "Filial responsável" (resolvido 2026-10-01)

Mesmo conceito, exibido em lugares diferentes conforme o tipo de entrega — não são dois campos duplicados:
- **Retirada:** aparece dentro do container único de endereço/pagamento, rotulado "Loja responsável" (CNPJ + endereço da loja).
- **Entrega:** existe um card lateral dedicado "Loja responsável", que fica **oculto na Retirada** (porque a informação já está no container principal nesse caso).

### 3.7 Receitas médicas

Seção "Receita médica (Rx)" no detalhe, **em todas as etapas**, só quando o pedido tem receita enviada pelo app (`attachmentUrls` não vazio). Cada receita é nomeada "Receita 1", "Receita 2"... na ordem do array (nunca o nome do arquivo), com "Enviado em" = data/hora de criação do pedido (igual para todas). Ações: baixar cada receita ou "Baixar todos" (este só aparece quando há **mais de 1** receita) — o Portal só baixa, sem preview; a lista rola dentro do card quando excede a altura. Estados do download: "Baixando arquivo..." com spinner no item; ao concluir, o ícone de check permanece por 3 segundos (Figma) e aparece o snackbar "Download concluído"; em falha, o item fica com borda vermelha com "Não foi possível baixar. Tente novamente." e ícone de recarregar, mais o snackbar "Erro ao baixar. Verifique a sua conexão."

A seção traz o aviso amarelo **"Valide as receitas antes de liberar o pedido."**, apenas **informativo**: sem regra, lógica nem bloqueio. É somente consulta: não bloqueia avançar, imprimir ou cancelar o pedido, e não há status, badge nem ação obrigatória associada à receita. Os campos legados por produto (`PrescriptionUrl`, `PrescriptionFileName`, `PrescriptionVisualized`) e o endpoint de "visualizada" não fazem parte do Portal novo. Regra de origem: ECP-1481 e PRD do App (`specs/features/001-app-ecommerce/Envio de receita/PRD-envio-receita-app.md`, 6.4 e 6.10); formatos aceitos no envio: JPG, PNG ou PDF, até 2 MB.

### 3.9 Navegação ▲ / ▼ depois que o pedido sai da lista

Quando o pedido aberto é concluído ou cancelado e sai da lista, a navegação segue a fila em aberto, na ordenação dos abertos: ▼ mostra o próximo pedido da fila em aberto; ▲ mostra o pedido anterior da fila em aberto. O pedido recém-fechado nunca é alvo da navegação (voltar não redireciona para o último que foi fechado).

### 3.8 Interações da linha e informações do modal

- Clique em qualquer ponto da linha abre o detalhe; linha do pedido aberto destacada; tooltips de nome truncado e de itens.
- Informações: cliente (nome, CPF, telefone), itens, pagamento, entrega/retirada, loja responsável e trilha de auditoria (eventos com responsável, data e hora).
- Pedido cancelado mostra o motivo e quem cancelou ("Cancelado por"; "sistema" quando veio do ERP/automático) no lugar do tracker; motivo vazio é exibido como "Cancelado direto no ERP (pela loja)".

### 3.10 Imprimir

O botão de imprimir da barra superior gera um **PDF com os detalhes do pedido**. O "8º pedido" ao lado da estrela do card Cliente (Figma) não entra.

## 4. Nível de integração / fonte de dados

- Detalhe do pedido: hoje `GET backoffice/orders/{orderId}` (`OrderDetail`: itens, cliente, pagamento, entrega, composição do total, trilha de auditoria e `AttachmentUrls`). A receita vem de `OrderData.Prescriptions`, exposta como `AttachmentUrls` (`ecomm-api-order-dotnet`).

- Pedido em `edelivery_order.order_data` — ver regras gerais de status/timestamp em [[feedback_status_change_query_rules]] (aplicam ao status tracker, já que ele reflete o histórico de subdocs de status do pedido).
- Motivo de cancelamento: quando `canceledReason` vem vazio, **não é motivo desconhecido** — em 100% de uma amostra checada, correspondeu a cancelamento feito direto no ERP pela loja (chega via integração, sem texto de motivo). Rotular como "Cancelado direto no ERP (pela loja)", nunca como erro/falha de integração (ver [[feedback_status_change_query_rules]]).
- Componente Status Tracker: novo em React, deve ser genérico o suficiente pra ser reaproveitado por outras telas — não acoplado só a este modal.

## 5. Cenários de borda

| Cenário | Regra |
|---|---|
| Pedido do tipo Retirada | Taxa de entrega oculta |
| Navego pro próximo pedido (▼) com o pedido atual em último da lista | Botão ▼ desabilitado |
| Pedido avança pra status final durante a visualização | Modal permanece aberto até o usuário fechar (ver 3.5) |
| Pedido sem receita enviada | Seção "Receita médica (Rx)" não aparece |
| Pedido com receita não baixada | Avançar, imprimir e cancelar seguem normalmente, sem bloqueio |
| `canceledReason` vazio | Trata como cancelamento via ERP, não como erro |
| Pedido do tipo Retirada | "Loja responsável" aparece dentro do container principal, não como card separado |
| Pedido do tipo Entrega | Card lateral dedicado "Loja responsável" aparece, além do container de endereço |

## 6. Pendências / perguntas em aberto

- [ ] Itens do detalhe desenhados no Figma ainda sem decisão do PO (não adotados): link "Whatsapp" no card Cliente; tag "Pedido parado há …" no cabeçalho; legenda por fase acima da lista de itens ("Confira e/ou ajuste os itens do pedido" etc.); tracker com 4 cores (vermelho, amarelo, azul, verde) e pílula de prazo.
- [ ] Quais fases deixam o botão de imprimir habilitado (o Figma o desenha com aparência desabilitada na Conferência).
- [ ] Tooltips de nome truncado e de lista de itens (3.8) não existem no Figma; confirmar se permanecem.

## Changelog

- **2026-10-06** — Handoff Figma e respostas do PO: navegação ▲ / ▼ (antes ◀ / ▶); barra superior com imprimir (gera PDF com os detalhes do pedido); variantes de pedido e composição do total (frete grátis, "Total (cobrar do cliente)", troco); receitas com aviso amarelo informativo "Valide as receitas antes de liberar o pedido.", "Baixar todos" só com mais de 1 receita, "Baixando arquivo...", check por 3 segundos (Figma; antes 5); "Cancelado por" = "sistema" quando veio do ERP; "8º pedido" não entra; itens extras do Figma (Whatsapp, "parado há", legenda por fase, tracker com 4 cores) registrados como pendência.
- **2026-10-05 (2)** — O pedido concluído ou cancelado sai de "Em andamento" e vai para "Finalizados" no mesmo instante da ação (não mais ao fechar o modal); o modal segue aberto até o usuário fechar (3.5).
- **2026-10-05** — O fechamento automático do modal em status final deixa de existir (3.5): o modal permanece aberto e só fecha por ação do usuário; o pedido sai de "Em andamento" quando o modal é fechado.
- **2026-10-02 (2)** — Adicionada a regra de navegação ◀ / ▶ depois que o pedido sai da lista (3.9) e o momento da saída da lista (quando o modal fecha).

- **2026-10-02** — Adicionadas a seção de receitas médicas (3.7, regra da ECP-1481 reaproveitada: todas as etapas, só consulta e download, sem bloqueio nem alerta, "Receita N", "Enviado em" = criação do pedido) e as interações da linha/informações do modal (3.8). Fechamento automático do modal agora está implementado no protótipo e é entregue nas Histórias de avanço e cancelamento. Pendência de fonte do detalhe resolvida (`GET backoffice/orders/{orderId}`).

- **2026-10-01** — Revalidado contra o código-fonte do protótipo Claude Design: resolvida a pendência "Loja responsável"/"Filial responsável" (mesmo conceito, posições diferentes por tipo); confirmado que o fechamento automático em status final está correto mas ainda não implementado no protótipo (prompt de ajuste já enviado).
- **2026-09-30** — Criação do documento (v1), a partir de ECP-1516, ECP-1313, PRD seção 6.6, e [[feedback_status_change_query_rules]].

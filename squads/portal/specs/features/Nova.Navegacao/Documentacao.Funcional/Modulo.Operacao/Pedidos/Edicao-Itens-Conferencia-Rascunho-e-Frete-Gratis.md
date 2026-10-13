# Pedidos — Edição de Itens na Conferência (Rascunho) e Frete Grátis Mantido

**Módulo:** Operação
**Histórias:** [ECP-1609](https://farmarcas.atlassian.net/browse/ECP-1609) (Edição de itens na Conferência — rascunho), [ECP-1610](https://farmarcas.atlassian.net/browse/ECP-1610) (Frete grátis mantido na edição de itens; depende da ECP-1609)
**Referência:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seção 6.6 (variantes de pedido: frete grátis, troco); `PRD-edicao-pedidos-etapa-revisao.md` (seções 6.1 a 6.6, 8 e 9)
**Relacionado:** [Detalhe-Pedido-Modal-Status-Tracker.md](Detalhe-Pedido-Modal-Status-Tracker.md) (ECP-1516: composição do total e trilha de auditoria), [Avanco-Status-e-Cancelamento.md](Avanco-Status-e-Cancelamento.md) (ECP-1517: a transição que grava o rascunho), [Tabela-Colunas-Comportamento-SLA.md](Tabela-Colunas-Comportamento-SLA.md) (ECP-1515: "(editado)" na coluna Resumo), [Ruptura-Estoque-Home-e-Detalhamento.md](../Indicadores/Ruptura-Estoque-Home-e-Detalhamento.md) (os dados de ruptura nascem desta gravação)
**Status:** Em refinamento (cards em Backlog no Jira)
**Última atualização:** 2026-10-13

---

## 1. O que é

Na etapa **Conferência**, o usuário revisa os itens do pedido antes de liberá-lo: pode reduzir a quantidade de um item (de 1 até a quantidade original), remover um item e restaurar o que mexeu, sem cancelar o pedido inteiro. Todo ajuste é um **rascunho** que vive só na visão do modal: nada é gravado enquanto o pedido continua na Conferência. O rascunho é gravado quando o pedido muda de etapa (Conferência → Na fila, ou o pulo para Liberados); fechar o modal sem mover o pedido descarta o rascunho. Depois de gravado, a lista mostra "(editado)" e a trilha de auditoria registra "Produto removido" e "Quantidade ajustada".

A **regra de frete grátis** aplicada sobre o ajuste (ECP-1610) é uma História separada que depende desta: quando o pedido de Entrega tem frete grátis e o subtotal ajustado cai abaixo do valor mínimo, o frete continua grátis, com aviso na tela e registro na trilha.

A entrega de cada História cobre front-end e back-end. Perfis: todos os que operam Pedidos (Admin, Gestor de Rede, Gestor de Loja e Contato cliente/Balconista).

## 2. Regras de negócio

### 2.1 Edição de itens e rascunho (ECP-1609)

- **Rascunho local:** remover, alterar quantidade e restaurar mudam somente a visão do modal; nada é enviado ao servidor até o pedido mudar de etapa (ex.: removo um item e reduzo outro de 5 para 3; se fecho o modal sem avançar, ao reabrir o pedido continua com os itens e as quantidades originais).
- **Edição só na Conferência:** tabela de itens editável (Produto, Quantidade, Preço un., Total e coluna de ação) apenas em pedido na Conferência; nas demais etapas é somente leitura (sem stepper, lixeira nem "Restaurar").
- **Quantidade:** stepper por item (botões "−" e "+" com o valor entre eles), de 1 até a quantidade original do item (o teto é por item, independente dos demais); "−" desabilitado em 1 e "+" desabilitado na quantidade original. Reduzir a zero é feito pela remoção do item.
- **Remover e restaurar:** a lixeira ("Remover item") marca o item como removido (sai do subtotal e continua visível, esmaecido, com o nome tachado e a quantidade sem stepper); o botão "Restaurar" (com ícone de desfazer) ocupa o lugar da lixeira e devolve o item ao subtotal. O link "Restaurar pedido original" (com ícone de desfazer), na linha de instrução acima da tabela e visível só enquanto há rascunho pendente, devolve todos os itens e quantidades ao original e descarta o rascunho sem registrar nada.
- **Marca "Orig: N":** ao lado do EAN do item com quantidade atual diferente da original (N = quantidade original), quando o item não está removido.
- **Tag "Sem estoque · disponível N":** vermelha, no item cuja quantidade pedida é maior que o estoque disponível da loja (N = estoque disponível); informativa, vale para qualquer etapa e não bloqueia a mudança de etapa.
- **Total:** subtotal = Σ preço unitário × quantidade dos itens não removidos; "Ajustes de itens", subtotal original riscado e demais linhas seguem a composição do total do detalhe (ECP-1516); o frete não é recalculado pelo ajuste. O subtotal, "Ajustes de itens", o total e o "Novo troco" são recalculados imediatamente a cada ação do rascunho.
- **"Novo troco":** no pedido a cobrar em dinheiro com troco, enquanto o rascunho tem alteração e o valor informado pelo cliente cobre o total, o troco é recalculado sobre o total atual (valor informado − total) e o selo "Novo troco" aparece abaixo do total; o valor informado pelo cliente não muda; o selo some quando o rascunho volta ao original.
- **Snackbars:** "Item removido · total recalculado", "Item restaurado · total recalculado" e "Pedido restaurado ao original".
- **Gravação:** ao mudar de etapa (Conferência → Na fila ou pulo para Liberados, conforme ECP-1517), o ajuste é gravado na mesma operação; o pedido passa a mostrar "(editado)" ao lado da quantidade de itens na lista e os itens deixam de ser editáveis. Se a mudança de etapa pede confirmação (pulo) e o usuário volta, o rascunho continua no modal. Pedido sem nenhuma alteração não gera eventos de auditoria ao mudar de etapa.
- **Descarte:** fechar o modal (botão "x", tecla Esc ou clique fora) ou navegar com ▲ / ▼ para outro pedido descarta o rascunho sem perguntar; o pedido volta aos itens originais.
- **Trilha de auditoria:** ao gravar, entram "Produto removido" (descrição com o nome do produto) para cada item removido e "Quantidade ajustada" (nome do produto e "de X para Y un.") para cada item com quantidade reduzida; o responsável é o usuário que moveu o pedido e a data e hora são as da gravação; antes da gravação a trilha não mostra esses eventos.
- **Após a gravação:** o detalhe continua mostrando os itens removidos (esmaecidos e tachados) e a marca "Orig: N", sem os controles de edição; na lista, a quantidade de itens e o total consideram só os itens não removidos e as quantidades finais.
- **Efeitos da liberação mantidos do legado:** estorno parcial no pedido pago online (valor = subtotal antes − subtotal depois), notificação push consolidada ao cliente quando houve redução ou remoção, ajuste de autorização PBM e registro dos dados de ruptura usados nos indicadores.

### 2.2 Frete grátis mantido (ECP-1610)

- **Quando se aplica:** pedido de **Entrega com frete grátis**, na Conferência, em que o ajuste de itens leva o subtotal atual para **abaixo** do valor mínimo do frete grátis (estritamente menor); pedido de Retirada nunca se aplica (não tem taxa de entrega). Ex.: mínimo R$ 200,00, subtotal R$ 227,04; removo itens que somam R$ 75,68 e o subtotal vai a R$ 151,36: o frete continua grátis e a faixa aparece.
- **Política:** o frete não é cobrado do cliente mesmo com o subtotal abaixo do mínimo após a edição; a taxa de entrega segue "Grátis" e o total é o subtotal atual.
- **Faixa amarela "Frete grátis mantido":** no detalhe do pedido em Conferência, entre a tabela de itens e a composição do total, com o texto "Após remover itens, o valor ficou abaixo do mínimo para frete grátis (R$ X). Não cobraremos o frete do cliente." (X = valor mínimo). Aparece somente na Conferência, enquanto o subtotal atual do rascunho está abaixo do mínimo; some quando o rascunho volta a ficar igual ou acima do mínimo (ao restaurar itens ou "Restaurar pedido original"); não aparece depois que o pedido muda de etapa.
- **Composição do total:** subtotal original riscado, "Taxa de entrega" com "Grátis", linha vermelha "Ajustes de itens" com o valor descontado (tooltip "Diferença por itens removidos ou com quantidade reduzida") e o total calculado sobre o subtotal atual, sem frete.
- **Subtotal igual ou acima do mínimo:** sem faixa e sem evento; a taxa segue "Grátis". **Pedido com frete cobrado:** sem faixa e sem evento; a taxa de entrega continua com o valor do pedido, sem ser recalculada pelo ajuste.
- **Gravação:** ao mudar de etapa (ECP-1517) com ajuste de itens gravado e subtotal abaixo do mínimo, a trilha registra o evento **"Frete grátis mantido"** (descrição "Valor ficou abaixo do mínimo (R$ X) após edição de itens.", ponto amarelo, responsável "Sistema") junto com "Produto removido" e "Quantidade ajustada"; sem ajuste de itens, nenhum evento. Fechar o modal sem mover o pedido não grava nada.
- **Troco:** troco = valor informado pelo cliente − total atual (subtotal atual, sem frete); "Cliente paga com R$ X" e "Troco: R$ Y" só aparecem quando o valor informado cobre o total; o valor informado não muda com a edição (ex.: cliente paga com R$ 250,00; com subtotal de R$ 227,04 o troco é R$ 22,96 e, com o subtotal ajustado para R$ 151,36, passa a R$ 98,64).
- **Valor mínimo:** o valor mínimo de compra para frete grátis configurado para a loja do pedido (o protótipo usa R$ 200,00 só como exemplo); a origem está em Pendências.

## 3. Nível de integração / fonte de dados

### 3.1 Edição de itens (ECP-1609)

**Query/endpoint reaproveitado** — o commit do rascunho que o legado já faz na liberação Conferência → Na fila:

- **Front legado** (`ecomm-front-webapp-portal-angular`, ramo `origin/main`): `PATCH /orders/{id}/release-to-queue` com o corpo `[{ productId, amount }, ...]` de todos os produtos, item removido com `amount = 0` (`services/orders.service.ts:141-146`; `accept-order-modal.component.ts:55-61, 100-106`); quantidade de 1 até `originalAmount` (`orders-details.component.ts:349-384`); remover com `amount = 0` (`:459-471`); restaurar com `amount = originalAmount` (`:473-490`).
- **BFF de pedidos** (`ecomm-bff-backoffice-order-dotnet`): `PATCH backoffice/orders/{OrderId}/release-to-queue` com o cabeçalho `x-pharmacy-id` (`OrdersController.cs:302-332`); resolve `InsufficientStock` consultando o estoque (`ReleaseToQueueCommand.cs:22, 52-71`, `POST merchandising/v1/stock/products/{pharmacyId}/ByProductIds/Stock`), chama o Order e publica o estorno parcial no Kafka (`:42`, `PublishRelease`). O detalhe `GET backoffice/orders/{orderId}` devolve `EstoqueQtd` e `InsufficientStock` por produto (`GetOrderDetailCommand.cs:97`): `order.InsufficientStock = order.Amount > product.EstoqueQtd;`.
- **Order** (`ecomm-api-order-dotnet`): `PATCH order/{OrderId}/release-to-queue` (`OrderController.cs:353-388`) → `ReleaseToQueueCommand.cs` (`:55-56, 64-87, 101-129, 149-150`) e `OrderItemAdjustment.Apply` (`OrderItemAdjustment.cs:14-63`):

```csharp
if (!string.Equals(order.Status, OrderStatus.Conference.ToString(), ...)) throw new PreconditionRequiredException("Order must be in Conference");
if (OrderItemAdjustment.Apply(order, request.Products)) order.ItemsAdjusted = true;
...
order.Status = OrderStatus.Pending.ToString();           // "Na fila"
if (!_conferenceOrderWriter.ReplaceIfStillInConference(order)) throw new PreconditionRequiredException("Order must be in Conference");
// OrderItemAdjustment.cs:48-49
if (!order.Products.Any(p => p.Amount > 0)) throw new PreconditionRequiredException("Order must keep at least one product");
```

**O que faz:** recebe a quantidade final de cada produto (0 = removido), grava `OriginalAmount` na primeira redução, mantém o item removido com `amount = 0`, recalcula `Payment.SubTotal` e o `Total` (`InitialValue`, `AdjustmentValue`, `Value`), cria os eventos "Produto removido" e "Quantidade ajustada" com o responsável e o horário da gravação (`BuildProductEditEvents`, `:168-229`), marca `ItemsAdjusted` quando há redução ou remoção, calcula o estorno parcial do pedido online (`RefundAmountCalculator`), move o pedido para `Pending` ("Na fila"), notifica e envia a push ao cliente quando `ItemsAdjusted`. O `AuditTrailMapper` só mostra os eventos de edição quando o pedido já saiu da Conferência (`AuditTrailMapper.cs:100-102`). O `Payment.Change` do detalhe é `valor informado (AdditionalSteps["Change"]) − total atual`, calculado a cada leitura (`OrderProfile.cs:105-110` do BFF).

**O que NÃO faz:** só atende Conferência → Na fila (não existe o pulo Conferência → Liberados); não limita a quantidade acima da original no servidor (só rejeita quantidade negativa); não registra "Frete grátis mantido"; não recalcula o frete (`Shipping.Cost` fica como está); os eventos usam o horário da liberação, não o da edição; o `ItemsAdjusted` existe no `OrderSummary` do Order mas o BFF de pedidos não o repassa na listagem (`Order/v3/get-orders`); falha com "Order must be in Conference" se o pedido já saiu da Conferência.

### 3.2 Frete grátis (ECP-1610)

**Query/regra reaproveitada** — como o frete grátis nasce hoje, no fechamento do pedido (confirmado no código; não existe regra de frete grátis aplicada na edição de itens):

- **Order** (`ecomm-api-order-dotnet`, ramo `origin/main`): `Cart/DeliveryBandQuote.cs:44` zera o frete na cotação, e `Cart/HomeDeliveryFreight.cs:79-98` passa `delivery?.OrderPrice` e `cart.TotalProducts` à cotação e ainda zera o frete do colaborador (domínio de e-mail com a flag da loja):

```csharp
if (freeShippingFrom is > 0 && productsTotal >= freeShippingFrom)
    cost = 0;
```

- **Serviço de farmácia** (`ecomm-api-pharmacy-dotnet`): `GET pharmacyconfiguration/{PharmacyId}/delivery` (`PharmacyConfigurationController.cs:99-116`, parâmetro `ignoreGroup`) → `GetPharmacyConfigurationDeliveryCommand.cs:43-52` lê a linha de entrega em domicílio da loja e devolve `OrderPrice`; a gravação `PUT {PharmacyId}/delivery` escreve `Order_Price` (`UpdatePharmacyConfigurationDeliveryCommand.cs:96`): `SELECT * FROM shipping_strategy WHERE "Pharmacy_Id" = @PharmacyId AND "In_Store" = false` (`response.OrderPrice = shippingStrategy.OrderPrice`).
- **Portal legado** (`ecomm-front-webapp-portal-angular`, ramo `origin/main`): a loja define o valor em Configurações, Entrega, "Frete Grátis" ("Deseja definir entrega grátis a partir de um valor de compra específico?", "Para compras a partir de R$ ..."); desligar grava `orderPrice = 0` (`delivery-value.component.ts:125-139`).
- **Detalhe do pedido:** `GET backoffice/orders/{orderId}` (BFF de pedidos) devolve "Taxa de entrega" só quando `Shipping.Cost > 0` (`OrderProfile.cs:86-92`).

**O que faz:** na cotação do carrinho, o frete vira 0 quando o valor mínimo da loja (`OrderPrice`) é maior que zero e o total de produtos é igual ou maior que ele; a edição de itens da liberação (`OrderItemAdjustment.Apply`) não mexe em `Shipping.Cost`, então o frete de um pedido que nasceu grátis continua 0 depois do ajuste.

**O que NÃO faz:** o pedido não guarda marca de frete grátis nem o valor mínimo vigente na criação (`ShippingData` tem só `Cost`, `InStore`, `EstimateShippingMinutes` e afins); nada compara o subtotal ajustado com o mínimo; não existe o evento "Frete grátis mantido" na trilha (`AuditTrailTypes`); o detalhe não devolve o valor mínimo; o detalhe do legado não mostra "Grátis" (omite a linha quando a taxa é 0).

## 4. Pontos de atenção / correção embutidos

- **Pulo para Liberados:** a gravação do legado termina sempre em "Na fila" (`ReleaseToQueueCommand.cs:113`). O pulo Conferência → Liberados (ECP-1517) é uma transição nova e deve gravar o ajuste e os eventos de auditoria na mesma operação.
- **Último item:** o legado bloqueia remover o último item (front: tooltip "O pedido precisa ter ao menos 1 item. Para esvaziar, cancele o pedido.", `orders-details.component.ts:423-432`; back-end: `OrderItemAdjustment.cs:48-49`), e o protótipo não bloqueia. A reconstrução não pode gravar pedido sem item enquanto a regra do back-end for mantida (ver Pendências).
- **Pedido que saiu da Conferência durante o rascunho:** a liberação automática por SLA da Conferência (`ReleaseStaleConferenceOrdersCommand.cs:89-94`, sem produtos, responsável "Sistema") ou a ação de outro usuário fazem a gravação falhar com "Order must be in Conference"; o rascunho não é aplicado (ver Pendências).
- **Estoque disponível no detalhe:** o legado mostra apenas "Sem estoque"; a reconstrução mostra também a quantidade disponível, já devolvida pelo BFF em `EstoqueQtd`.
- **Marca "(editado)" na lista:** o dado existe no Order (`OrderSummary.ItemsAdjusted`) e não chega ao Portal pelo BFF atual; expor no contrato da listagem.
- **Identificar "pedido com frete grátis":** o pedido só tem `Shipping.Cost = 0`, que também ocorre no frete grátis de colaborador e no frete não cotado (`HomeDeliveryFreight.IsUnquotedHomeDelivery`, ECA-1294); a reconstrução precisa de uma regra para distinguir o frete grátis por valor mínimo (ver Pendências).
- **Faixa e evento só fazem sentido na Conferência:** o legado não tem faixa; a faixa é nova, e o evento é gravado só na mudança de etapa, junto com o ajuste.

## 5. Cenários de borda

| Cenário | Regra |
|---|---|
| Item com quantidade original 5 | Stepper de 1 a 5; "−" desabilitado em 1 e "+" desabilitado em 5 |
| Reduz de 5 para 3 | "Orig: 5" ao lado do EAN; total recalculado |
| Clica na lixeira | Item esmaecido e tachado, "Restaurar" no lugar da lixeira, total recalculado, snackbar "Item removido · total recalculado" |
| Fecha o modal ou navega com ▲ / ▼ com rascunho pendente | Nada é gravado; o pedido volta aos itens originais |
| Move o pedido de etapa com rascunho | Ajuste gravado; trilha com "Produto removido" e "Quantidade ajustada"; lista com "(editado)" |
| Mudança de etapa pede confirmação e o usuário volta | O rascunho continua no modal |
| Move da Conferência sem alterar itens | Sem eventos de ajuste e sem "(editado)" |
| Pedido já em "Na fila" | Tabela somente leitura |
| Quantidade pedida maior que o estoque | Tag "Sem estoque · disponível N"; a mudança de etapa não é bloqueada |
| Pedido pago online com itens removidos ou reduzidos | Estorno parcial pelo valor da diferença entre o subtotal anterior e o atual |
| Falha na gravação | O pedido continua na Conferência com os itens originais; mensagem de erro |
| Entrega com frete grátis e subtotal ajustado abaixo do mínimo | Faixa "Frete grátis mantido"; taxa "Grátis"; total = subtotal atual |
| Restaura itens e o subtotal volta a ser igual ou maior que o mínimo | A faixa some |
| Entrega com frete cobrado | Sem faixa; taxa de entrega com o valor do pedido |
| Retirada | Sem faixa nem taxa de entrega |
| Pedido já saiu da Conferência | Sem faixa; a taxa continua "Grátis" |
| Troco em dinheiro (cliente paga R$ 250,00; subtotal ajustado R$ 151,36; frete grátis) | Troco R$ 98,64 |
| Valor informado menor que o total atual | "Cliente paga com" e "Troco" não aparecem |

## 6. Pendências / perguntas em aberto

- [ ] **Fechar sem mover:** o protótipo descarta o rascunho sem perguntar; o `PRD-edicao-pedidos-etapa-revisao.md` (6.6) prevê a modal "Sair e descartar rascunho?" e a tag "Rascunho" no cabeçalho e na lista, e o legado exibe "Rascunho" no cabeçalho e alerta ao fechar a aba. O card segue o protótipo; o PRD fica a alinhar.
- [ ] **Remover todos os itens:** o protótipo permite; o PRD (6.2 e 6.3) e o legado bloqueiam remover o último item (e travam a edição do pedido de 1 item e 1 unidade), e o back-end rejeita pedido sem produto. Qual é o comportamento do novo Portal?
- [ ] **"Novo troco":** o protótipo mostra o selo "Novo troco" ao lado do troco recalculado; o PRD (8.2) descreve o indicador de variação "↑ R$ …" (comparado ao troco antes da edição) e a linha "Cliente vai pagar com: R$ X". Qual indicador vale?
- [ ] **Itens do PRD que o protótipo não mostra, fora do escopo até decisão:** banner de atenção de item sem estoque ("Revise o(s) produto(s) fora de estoque para liberar o pedido", legado e PRD 6.8); digitação direta da quantidade com validação ("Quantidade mínima: 1", "Qtd. máx. permitida") e balão ao clicar em "+" no limite (legado e PRD 6.1); split de preço promocional ("Limite por compra", linhas "Promo: até X" e "Preço loja (excedente)", legado e PRD 6.7); ocultar os itens removidos e a marca "Orig" a partir de "Na fila" (PRD 6.1 e 6.5; o protótipo os mantém visíveis); data e hora dos eventos de auditoria iguais às da edição original (PRD 6.6; o protótipo e o código usam as da gravação).
- [ ] **"Restaurar" um item removido:** o protótipo devolve o item com a quantidade que ele tinha antes da remoção; o legado devolve a quantidade original (`orders-details.component.ts:473-490`).
- [ ] **Diálogo ao liberar da Conferência para a fila:** o protótipo abre "Liberar pedido para a fila" ("Ao liberar este pedido para a separação, você não poderá mais fazer edições nos itens.", botões "Cancelar" e "Confirmar") antes de gravar; a regra de diálogo das transições é do ECP-1517.
- [ ] **Duração dos snackbars de edição:** o protótipo os fecha sozinhos em cerca de 3 segundos, sem ação; confirmar.
- [ ] **Cancelar o pedido com rascunho pendente:** o protótipo descarta o rascunho e cancela sobre os itens originais; confirmar.
- [ ] **Pedido que sai da Conferência com o rascunho aberto** (liberação automática por SLA ou ação de outro usuário): mensagem e estado do modal não estão desenhados.
- [ ] **Estoque disponível:** confirmar que "disponível N" usa o estoque da loja do pedido (`EstoqueQtd` do serviço de estoque) também para lojas de grupo com estoque centralizado.
- [ ] **Frete grátis — origem do valor mínimo:** no código existe por loja (`OrderPrice`, `shipping_strategy.Order_Price`, linha de entrega em domicílio), lido por `GET pharmacyconfiguration/{PharmacyId}/delivery` e usado na cotação do carrinho; confirmar com a engenharia e o PO que essa é a fonte da faixa e do evento (o "R$ 200,00" do protótipo é só exemplo).
- [ ] **Frete grátis — valor mínimo da criação × valor atual:** o pedido não grava o mínimo vigente quando foi feito; a faixa e o evento usam o mínimo atual da loja ou o da criação (que passaria a ser gravado)?
- [ ] **Frete grátis — como saber que o pedido tem frete grátis:** `Shipping.Cost = 0` também vale para frete grátis de colaborador e para frete não cotado; qual regra identifica o frete grátis por valor mínimo?
- [ ] **Frete grátis — lojas de grupo:** sem `ignoreGroup`, a configuração de entrega devolvida é a da loja selecionada do grupo (`GetSelectPharmacyIdInGroup`); definir qual loja vale para o mínimo do pedido.
- [ ] **Frete grátis — quando o evento é registrado:** o protótipo registra "Frete grátis mantido" sempre que o pedido muda de etapa com ajuste e subtotal abaixo do mínimo, mesmo que já estivesse abaixo do mínimo antes da edição; confirmar se deve registrar só quando o ajuste faz o subtotal cruzar o mínimo.
- [ ] **Frete grátis — texto da faixa:** diz "Após remover itens" também quando o usuário só reduz quantidades; confirmar o texto.

## Changelog

- **2026-10-13** — Criação do documento (v1), a partir dos cards ECP-1609 (edição de itens na Conferência como rascunho: stepper, remover e restaurar, "Orig: N", tag de estoque, "Novo troco", snackbars, gravação na mudança de etapa, descarte ao fechar, "(editado)" na lista e trilha de auditoria) e ECP-1610 (frete grátis mantido: faixa amarela na Conferência, composição do total, evento "Frete grátis mantido" na gravação, troco sobre o total sem frete), com a fonte legada confirmada no código, os pontos de correção e as pendências dos dois cards.

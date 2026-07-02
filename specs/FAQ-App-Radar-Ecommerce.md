# FAQ — Funcionalidades do App Radar E-commerce

> Base de conhecimento para o Confluence. Cobre as funcionalidades do aplicativo mobile (consumidor final) do Radar E-commerce, plataforma B2B2C da Farmarcas. Fonte: Spec Kit da squad App (`spec.md`, `product.md`, `glossary.md`, `plan.md`), atualizado em 2026-06.
>
> **Fora do escopo do app** (tratado no Portal): gestão de estoque/preços, configuração de regras de desconto, relatórios/analytics, edição de pedidos no OMS, comissão de vendas.

---

## Visão geral

**O que é o app Radar E-commerce?**
É o aplicativo mobile que permite ao consumidor final comprar produtos de uma farmácia associada (Lojista) específica. Não é um marketplace: cada consumidor está sempre vinculado a uma farmácia, e o catálogo, preços e regras que ele vê são os configurados por aquela loja no Portal.

**Quem usa o app?**
Três personas: **Consumidor Fidelizado** (cliente habitual, busca conveniência e recorrência), **Consumidor PBM** (usa desconto de convênio farmacêutico) e **Consumidor Eventual** (chegou por indicação ou busca, decide pela confiança na loja).

**Qual métrica o produto persegue?**
A North Star Metric (NSM) é o **Volume de Transações por Loja Ativa** — toda funcionalidade deve, em tese, mover esse indicador.

---

## Acesso — Login e cadastro

**Como o consumidor faz login?**
Com e-mail ou CPF.

**Como funciona o cadastro?**
Pelo botão "Criar minha conta", com todos os campos obrigatórios. O botão de confirmação só habilita depois do preenchimento completo e do aceite dos termos de uso (acessíveis via "Ler termos", que abre o PDF). O campo nome aceita apenas letras, sem números.

**Quais os requisitos de senha?**
Mínimo de 8 caracteres, 1 letra maiúscula e 1 caractere especial.

**Como funciona "Esqueci minha senha"?**
O reset é feito via CPF. Se o CPF não estiver cadastrado, o app direciona para a criação de conta. Se estiver, um código de confirmação é enviado ao e-mail cadastrado; após informá-lo, o usuário define a nova senha.

**Todo cadastro feito pelo app vai para algum sistema da rede?**
Sim, todo cadastro é registrado na base de clientes **PEC** da rede.

---

## Onboarding e seleção de loja

**Como o app descobre qual farmácia atender o consumidor?**
De duas formas: por **localização (GPS)** ou por **endereço digitado** com autocomplete do Google Maps (até 5 sugestões). No fluxo por GPS, o app mostra um mapa com PIN para confirmação e depois uma modal para confirmar/completar o endereço (Número, Rua e Bairro obrigatórios; Complemento opcional).

**Qual a prioridade de roteamento para escolher a loja?**
1) loja mais próxima com entrega (raio de até 30 km); 2) loja mais próxima no módulo vendas; 3) loja mais próxima no módulo ofertas.

**O que acontece se não houver loja que atenda a região?**
O app exibe "Ainda não atendemos sua região" e lista as 5 lojas mais próximas do módulo vendas disponíveis para retirada. Há um botão "Alterar endereço" que reinicia o onboarding.

**O endereço escolhido no onboarding fica salvo?**
Sim. Ele aparece no header da homepage, é salvo no usuário após login e é usado como endereço padrão do carrinho. Se o usuário refizer o onboarding, o endereço anterior é substituído pelo novo.

**Havendo mais de uma loja que entrega no endereço, como o app desempata?**
Prioridade 1: loja mais próxima. Prioridade 2: frete mais barato. Prioridade 3: menor tempo de entrega. Empate total nas três variáveis leva a uma escolha aleatória.

**A permissão de localização do celular muda o fluxo?**
Sim. "Permitir uma vez" ou "Durante o uso do app" pulam a tela de seleção manual de lojas. "Não permitir" leva o usuário à seleção manual.

---

## Homepage

**O que aparece na tela inicial?**
Vitrines na ordem: Ofertas destaque (quando houver) → Ofertas pra você → Mais vendidos. A vitrine "Mais vendidos" mostra até 50 produtos (10 no carrossel, 50 na listagem completa), só com estoque disponível; produtos em oferta não entram nessa vitrine.

**A busca fica disponível em todas as lojas?**
O campo de busca fica fixo no scroll da home e visível apenas em lojas do módulo vendas; ao tocar, abre a tela de busca.

**Como funciona o endereço exibido no topo da home?**
Segue a prioridade: localização compartilhada → endereço cadastrado → endereço do dispositivo. Se nenhum estiver disponível, o campo fica vazio e precisa ser preenchido no carrinho antes de concluir a compra. Ao lado, o app mostra o tempo de entrega (se a loja entrega no raio do cliente) ou "Fora do alcance".

**De onde vêm os banners da home?**
São configurados no Portal E-Delivery pela rede/loja; o app apenas exibe a ordem definida. O banner de frete grátis aparece automaticamente quando a loja tem essa regra configurada, sem precisar de clique.

**Qual a ordem dos departamentos?**
Cuidados pessoais, Higiene e beleza, Medicamentos, Farmacinha, Infantil, Nutrição e alimentos, Outros.

---

## Catálogo e medicamentos controlados

**O app vende medicamentos que exigem receita?**
Sim. Medicamentos controlados (categoria "Medicamentos com Retenção de Receita" no Portal) aparecem em busca, departamentos e detalhe do produto, mas a compra é restrita à retirada na loja, mediante apresentação da receita — em conformidade com a RDC 144 da ANVISA.

**Como o app sinaliza um controlado?**
Com a tag "Exige receita" no detalhe do produto, no card do carrinho e no resumo final do checkout, além da mensagem "Retirada na loja mediante apresentação da receita."

**Controlados aparecem com desconto ou promoção?**
Não. Por exigência regulatória, controlados nunca exibem preço "De/Por", percentuais de desconto, tags de preço do ERP ou termos como "Desconto"/"Oferta"/"Barato" — apenas o preço final. Também não são rankeados nas vitrines.

**O que muda no carrinho quando há um controlado?**
A entrega em casa fica indisponível (só resta retirada na loja), a progress bar de frete some, e o componente de entrega no endereço não aparece no detalhe do produto.

---

## Ofertas

**Como o consumidor acessa as ofertas?**
Deslogado, o card de ofertas convida a fazer login. Logado, o card do topo mostra quantas ofertas estão ativas (ou convida a ativar, se nenhuma estiver ativa).

**O que é "ativar" uma oferta?**
É o passo que habilita o preço promocional para o CPF daquele cliente. Depois de ativada, o botão "Ativar" some, aparece a opção de comprar, a label "Oferta ativada" e a duração da oferta no card.

**As ofertas têm limite de compra?**
Sim, cada oferta pode ter um "Limitador de oferta" (quantidade máxima por cliente no preço promocional), configurado no Portal pela loja.

**Descontos são cumulativos?**
Não. A tela de ofertas sempre exibe o aviso "Ofertas válidas enquanto durarem os estoques. Descontos não cumulativos."

---

## Carrinho

**O que o carrinho mostra por item?**
Preço unitário fixo no card (não muda com a quantidade), subtotal somando os preços finais, contador de todas as unidades, e o fabricante como subtexto. Tocar na imagem ou no nome abre o detalhe do produto.

**O que acontece se eu tentar adicionar mais do que o estoque permite?**
O app exibe "Quantidade máxima disponível atingida".

**Como funciona o limite de oferta no carrinho?**
Ao exceder o limite, o produto é dividido em dois cards: "Oferta" e "Preço normal". Clicar no "+" da oferta já no limite mostra um banner amarelo explicando o limite (texto vem do Portal). Reduzir quantidade sempre desconta primeiro do card "Preço normal".

**O carrinho vazio mostra alguma coisa?**
Sim, uma mensagem informativa com o botão "Explorar produtos", que leva de volta à home.

**Alterações feitas no Portal (preço, estoque) afetam carrinhos já montados?**
Sim, refletem automaticamente nos carrinhos já montados.

**Como sei que estou perto do frete grátis?**
Uma tag mostra quanto falta de subtotal para atingir o frete grátis da loja, atualizando ao ser atingido. Contas @febrafar/@farmarcas sempre veem frete grátis. Cestas com controlados não exibem essa tag (porque só têm retirada, que é sempre grátis).

---

## Checkout — entrega e retirada

**Quais as opções de recebimento do pedido?**
Entrega em casa ou retirada na loja — exceto quando há controlado na cesta, caso em que só a retirada fica disponível.

**Como o app calcula o horário de disponibilidade?**
Somando o horário atual ao tempo de retirada/entrega configurado pela loja no Portal, sempre no fuso horário local do consumidor (nunca no fuso do servidor). Se passar do horário de funcionamento, a mensagem muda para "amanhã a partir das…". Lojas 24h após meia-noite mostram "amanhã" e atualizam para "hoje" na virada do dia.

**A retirada tem custo?**
Não, a retirada sempre exibe a tag "Grátis".

**Como funciona a troca de farmácia no checkout?**
A tela lista "Loja atual" e "Outras lojas" do mesmo grupo econômico, num raio de 100 km, ordenadas por distância, até 15 lojas. Se a troca não altera a cesta, ela é aplicada direto; se altera (preço, estoque, oferta), uma modal mostra as mudanças para confirmação antes de aplicar.

**Como buscar uma farmácia para retirada?**
Por endereço (CEP, cidade, bairro, logradouro — nunca por nome da loja), com sugestões a partir do 4º caractere e histórico das últimas 5 buscas.

**O que acontece se a loja escolhida não fizer retiradas?**
O app exibe "Esta farmácia não efetua retiradas" e desabilita o pagamento.

---

## Checkout — pagamento

**Quais formas de pagamento existem?**
Pagamento na entrega/retirada (Pix, cartão na maquininha, dinheiro, nessa ordem) ou pagamento no app (Pix ou cartão de crédito).

**E se a loja só aceitar uma modalidade?**
Ela vem pré-selecionada e a outra aparece como indisponível.

**Como funciona pagar em dinheiro?**
O app pergunta "Precisa de troco?" (obrigatório); se "Sim", pede "Troco para quanto?" (obrigatório); se "Não", o campo de troco nem aparece.

**Como funciona o Pix pago no app?**
O código gerado tem validade de 2 horas, com timer regressivo que persiste em segundo plano. O usuário pode copiar o código (com feedback "Código Pix copiado") ou ler o QR Code. Enquanto não pago, o pedido fica "Aguardando pagamento"; expirado o prazo, o pedido é cancelado automaticamente e mostra "Pagamento expirado" — se já havia sido pago e depois cancelado, o valor é estornado automaticamente.

**Como funciona pagar no crédito, pelo app?**
Sem cartão salvo, o app pede para "Adicionar novo cartão" (com validação de bandeira pelo BIN — Visa, Mastercard, Elo, Amex —, mês/ano de validade, nome em caixa alta e CPF do titular). Com cartão salvo, mostra bandeira + 4 últimos dígitos. Ao finalizar a compra, o app sempre pede o CVV em uma modal antes de confirmar (Amex aceita 4 dígitos).

**Onde ficam os cartões salvos?**
Numa carteira, acessível pela tela de perfil e pela tela de pagamento do carrinho. O apelido do cartão é opcional (até 22 caracteres). Excluir um cartão remove o token também do gateway.

**Qual gateway de pagamento o app usa?**
A integração atual é com a **Braspag** (tokenização/cofre de cartões e Pix), separada da antiga integração E-Commerce com a **Cielo** — migração em andamento. Lojas que contratam o serviço de antifraude têm a análise de risco feita pela **Cybersource**, acionada na mesma chamada do gateway.

---

## Endereços

**Como o consumidor gerencia seus endereços?**
A tela mostra "Endereço atual" (com a tag "Selecionado") e "Outros endereços" (sem repetir o atual). Com um único endereço salvo, a seção "Outros endereços" some. Sem nenhum endereço, aparece um estado vazio com botão para adicionar.

**Como adicionar ou editar um endereço?**
Adicionar reaproveita o fluxo de busca do onboarding (Google Maps) e o novo endereço já entra selecionado. Editar abre a tela de adição pré-preenchida.

**Dá para excluir qualquer endereço?**
Não — o app não permite excluir quando resta apenas um endereço cadastrado.

---

## Notificações

**Quando o app envia push notifications?**
A cada transição de status do pedido, no máximo uma notificação por transição.

**Quais mensagens o consumidor recebe?**
Fila → Separação: "Tudo certo! Iniciamos a separação do seu pedido." Separação → Liberado para retirada: "Pedido pronto para retirada! Venha até a farmácia retirar o seu pedido." Separação → Liberado para entrega: "Seu pedido saiu para entrega! Em breve o entregador chegará ao seu endereço." Liberado → Concluído: "Seu pedido foi finalizado! Esperamos que tenha tido uma boa experiência." Cancelamento: "Seu pedido foi cancelado! Se precisar de suporte entre em contato com a farmácia."

---

## Histórico e acompanhamento de pedidos

**Onde o consumidor acompanha os pedidos em andamento?**
Em "Pedidos em andamento", que lista pedidos nos status Fila, Em separação e Liberado, com um indicador de 1 a 3 etapas preenchidas conforme o status.

**E os pedidos já finalizados?**
Ficam em "Pedidos concluídos", que reúne pedidos concluídos e cancelados. O título do card é o nome do primeiro produto adicionado à cesta.

**Em que ordem os pedidos aparecem?**
Do mais recente para o mais antigo, por data de criação, em ambas as seções.

**Existe recompra?**
Sim — a Recompra permite repetir um pedido anterior com um clique (funcionalidade core listada no produto).

---

## PBM (Programa de Benefício em Medicamentos)

**O que é PBM no contexto do app?**
É o desconto que o consumidor tem por convênio ou plano de saúde farmacêutico. O parceiro atual é a **Interplayers**.

**O PBM já está disponível no app?**
Ainda não — é uma entrega planejada para o Q3 2026 (agosto–setembro), junto com o novo checkout via Deeplink (julho). A integração segue o modelo "plug-and-play": cada loja habilita o PBM de forma independente, sem customização do time do Radar.

---

## Perguntas gerais sobre o produto

**O app tem alguma limitação regional?**
Sim — se nenhuma loja atender a região do consumidor, ele não consegue comprar por entrega ali; pode ainda retirar em uma das 5 lojas mais próximas listadas.

**O consumidor consegue comprar de mais de uma farmácia ao mesmo tempo?**
Não. O modelo é B2B2C: o consumidor está sempre vinculado a uma farmácia por vez, com catálogo, preços e regras daquela loja específica.

**Quem define preços, estoque e regras de desconto que aparecem no app?**
O lojista (farmácia associada), pelo Portal Radar E-commerce / E-Delivery. O app apenas consome essas configurações em tempo real — não é possível alterá-las pelo app.

---

## Referência rápida — glossário

| Termo | Significado |
|---|---|
| Lojista / Associado | Farmácia franqueada que opera no Portal |
| Balconista | Atendente da farmácia que usa o Portal para gerenciar pedidos |
| Loja Ativa | Lojista com ao menos uma transação no período |
| NSM | Volume de Transações por Loja Ativa |
| NMT | Número de lojas ativas (indicador de escala) |
| PBM | Desconto via convênio farmacêutico (parceiro: Interplayers) |
| OMS | Sistema que gerencia o ciclo de vida do pedido após a criação |
| Recompra | Repetir um pedido anterior com um clique |
| Controlados | Medicamentos com retenção de receita, retirada obrigatória na loja |
| Deeplink | Tecnologia do novo checkout para receber dados de precificação |

---

*Documento gerado a partir do Spec Kit da squad App (Radar E-commerce), com base em `product.md`, `glossary.md`, `spec.md` e `plan.md` (feature `001-app-ecommerce`, atualizada em 2026-06). Itens em desenvolvimento (ex.: PBM, confirmação por CVV) estão sinalizados como tal e podem mudar até o lançamento.*

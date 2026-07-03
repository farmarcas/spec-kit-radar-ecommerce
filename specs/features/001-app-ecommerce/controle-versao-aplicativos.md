# Controle de Versão — Aplicativos (Radar E-commerce App)

> Convertido a partir de `FE-Controle de versão aplicativos-020726-165843.pdf`.
>
> **Nota de conversão:** a tabela original usa células mescladas (uma versão ou
> data pode cobrir várias features agrupadas) e, na extração automática do PDF,
> alguns anos aparecem quebrados entre linhas. A reconstrução abaixo segue a
> ordem de leitura do documento original e agrupa versão/data por bloco visual.
> **Datas marcadas com `(confirmar)` têm risco de imprecisão** — validar contra
> o PDF original antes de usar como referência oficial de changelog/release.

## Histórico de versões

| Versão(ões) | Feature | Data |
|---|---|---|
| 5.12.2, 5.13.0, 5.14.0 | Fluxo de pagamento sem tokenização e zero dollar (compras pelo app aceitando todas as bandeiras de crédito e somente Visa e Master em débito, não podendo o usuário salvar o cartão para compras futuras) | 24/04/2023 |
| 5.14.1 | Trocar cartão (possibilidade do usuário inserir um novo número de cartão após ter inserido um cartão para compra online) | 24/04/2023 |
| 5.14.1 | Parcelamento no app (possibilidade do usuário parcelar suas compras de acordo com as regras cadastradas pela loja no portal) | 15/05/2023 |
| 5.14.1 | Tagueamento de eventos Posthog (telas: mapa de lojas, homepage, login, ofertas e carrinho) | 15/05/2023 |
| 5.14.1 | Integração Cielo (integrado com a adquirente Cielo para transacionar pagamento online através da adquirente) | 30/05/2023 |
| 5.14.1 | Detalhamento do pedido (alterações no detalhamento do pedido, incluído nº do pedido e data do pedido) | 30/05/2023 |
| 5.14.1 | Tagueamento de eventos Posthog (tela de produtos, tela do usuário, tela de acompanhamento de pedido e captura de dados do usuário no evento) | 30/05/2023 |
| 5.14.1 | Dropdown pagamento online | 05/06/2023 |
| 5.14.2, 5.14.3, 6.0.6 | Manter carrinho na falha de pagamento (caso o pagamento online seja reprovado, o usuário permanece no carrinho para fazer retentiva de compra) | 26/06/2023 |
| 6.0.6 | Pedido retirada como taxa de entrega (correção do bug no checkout que informava taxa de serviço como taxa de entrega) | 10/08/2023 |
| 6.1.0 | Pedido duplicado (correção ao o app identificar pedido duplicado) | 03/11/2023 *(confirmar)* |
| 6.1.0 | Remoção da opção de débito no pagamento online — somente Super Popular (após identificação de instabilidade com pagamento de débito nas adquirentes, para iniciar o piloto) | *(sem data associada no documento)* |
| 6.1.0 | Facelift: Header, Departamentos, Card produtos, Adicionar produtos à cesta, Cesta, Loja módulo ofertas, Resultado da busca, Tela de produtos, Detalhe do produto vendas, Detalhe do produto Oferta | *(sem data associada no documento)* |
| 6.1.0 | Remover pagamento débito (complicador de integração 3DS/Cielo para o associado solicitar chaves; débito removido por tempo indeterminado) | *(sem data associada no documento)* |
| 6.1.0 | Forçar atualização do aplicativo | *(sem data associada no documento)* |
| 6.1.0 | Smartlook (ferramenta para mapear a jornada do consumidor, identificando pontos de melhoria e quebras no app) | *(sem data associada no documento)* |
| 6.1.0 | Busca (melhoria solicitada pelo Edson) | *(sem data associada no documento)* |
| 6.1.1 | Status do pedido — melhorias Edson (alteração de "pedido criado" para "pedido realizado"; contador de entrega passa a contar a partir do pedido feito; previsão de retirada passa a ser 45 min após o pedido) | 16/11/2023 |
| 6.1.1 | Busca — melhorias Edson (inclusão da cesta na tela de busca; troca do hint de busca de 10–12 para 16 caracteres; nomenclatura "produto adicionado" → "ver cesta") | 16/11/2023 |
| 6.2.0 | Seleção de lojas no onboarding (usuário passa a inserir um endereço de entrega para buscar as lojas mais próximas) | 22/12/2023 |
| 6.2.0 | Seleção de lojas (mesma lógica de endereço de entrega aplicada à busca de lojas mais próximas) | 22/12/2023 |
| 6.2.0 | Quebra de imagens na busca (padronização do tamanho das imagens do app) | 22/12/2023 |
| 6.2.1 | Banner Drogamais (loja/rede pode inserir banners individuais no app) | 03/01/2024 |
| 6.2.2 | Busca | 08/01/2024 |
| 6.2.3 | Correção busca | 15/01/2024 |
| 6.3.2 | Cesta (checkout faseado, jornada fluida por etapa do fechamento de compra) | 12/03/2024 |
| 6.3.2 | Endereço (checkout faseado) | 12/03/2024 |
| 6.3.2 | Pagamento (checkout faseado) | 12/03/2024 |
| 6.3.2 | Frete grátis (isenção do frete quando o valor da compra atinge o mínimo configurado pelo associado no portal) | 12/03/2024 |
| 6.3.4 | Produtos sem estoque (produto com imagem esmaecida e mensagem de estoque indisponível) | 22/03/2024 *(confirmar)* |
| 6.3.4 | Hotfix do checkout faseado (etapa de exibição da mensagem de pagamento negado) | 22/03/2024 *(confirmar)* |
| 6.3.5 | Hotfix produto esgotado módulo ofertas (correção de bug de mensagem de estoque + botão de adicionar produto em lojas do módulo ofertas) | 17/04/2024 |
| 6.4.0, 6.4.1 | Busca na home (campo de busca na home, departamentos na área de busca, header fixo ao rolar a tela) | 15/05/2024 |
| 6.4.2, 6.4.3 | Compra com loja fechada (usuário pode comprar em loja fechada; pedido é recebido a partir do próximo dia/horário de funcionamento) | *(sem data associada no documento)* |
| 6.4.2, 6.4.3 | Apelido de loja na listagem de endereços (apelido definido pelo usuário exibido na tela de troca de farmácia) | *(sem data associada no documento)* |
| 6.4.2, 6.4.3 | Incluir pharmacyID no header do app | *(sem data associada no documento)* |
| 6.4.2, 6.4.3 | Inclusão do search therme na busca | *(sem data associada no documento)* |
| 6.4.2, 6.4.3 | NextPage (concatenação de URL na listagem de produtos) | *(sem data associada no documento)* |
| 6.4.2, 6.4.3 | Bug de edição de endereço (dados não persistiam/apareciam ao editar um endereço cadastrado) | *(sem data associada no documento)* |
| 6.4.4, 6.4.5 | BUG troca de loja logado (correção de bug da versão 6.4.3 que impedia usuário logado de trocar de farmácia) | 21/06/2024 |
| 6.4.4, 6.4.5 | BUG limpar cartão (ao salvar cartão e alterar produtos no carrinho, o app mantinha condições de pagamento/parcelamento mesmo com regra alterada) | 21/06/2024 |
| 6.4.4, 6.4.5 | BUG nome do produto (nome não respeitava limite de caracteres no resultado da busca) | 21/06/2024 |
| 6.4.4, 6.4.5 | Alteração lojas em construção ("Em Construção" → "Indisponível no app no momento") | 21/06/2024 |
| 6.4.41, 6.5.0, 6.5.01, 6.5.02, 6.5.03 | Bug imagem quebrada (imagens de produtos quebradas desconfigurando os cards) | 12/07/2024 |
| 6.5.04 | Loading refresh da página (pull-to-refresh nas telas home, ofertas, departamentos e números da sorte) | 23/07/2024 |
| 6.5.04 | BUG fluxo de troca de farmácia (botão de trocar farmácia com rota quebrada na tela de detalhes da loja) | 23/07/2024 |
| 6.5.04 | Novo fluxo de seleção de lojas (melhorias no onboarding, localização da farmácia, filtro/ordenação/busca na listagem) | 23/07/2024 |
| 6.5.04 | Ajustes na tela de adição de endereço (campo de ponto de referência + fluxo de preenchimento de localização) | 23/07/2024 |
| 6.5.04 | Ajuste tela de pagamento (fluxo de recusa do pagamento no app + revisão do cartão) | 23/07/2024 |
| 6.5.04 | Melhoria navbar (retirar busca, incluir menu de categorias) | 23/07/2024 |
| 6.5.04 | Novas categorias (ajuste no carrossel e imagens de departamentos) | 23/07/2024 |
| 6.5.04 | Clearsale (subida em produção nas lojas do grupo econômico Bruna Zanetti, com API Key e login/senha de produção individuais por loja + chargeback ao cancelar pedido) | 23/07/2024 |
| — | Bug Rolagem de tela (lojas do módulo ofertas não retornavam o scroll ao final da rolagem) | 03/08/2024 |
| 6.6.0, 6.6.01, 7.0.0, 7.0.02, 7.1.0 | Facelift promocional | 23/09/2024 |
| 6.6.0, 6.6.01, 7.0.0, 7.0.02, 7.1.0 | Nova homepage | 23/09/2024 |
| 6.6.0, 6.6.01, 7.0.0, 7.0.02, 7.1.0 | Vitrines | 23/09/2024 |
| 6.6.0, 6.6.01, 7.0.0, 7.0.02, 7.1.0 | Novo padrão de cards de produto (listagem e carrossel) | 23/09/2024 |
| 6.6.0, 6.6.01, 7.0.0, 7.0.02, 7.1.0 | Tags de ofertas e produtos | 23/09/2024 |
| 6.6.0, 6.6.01, 7.0.0, 7.0.02, 7.1.0 | Relayout dos banners e possibilidade de links internos | 23/09/2024 |
| 6.6.0, 6.6.01, 7.0.0, 7.0.02, 7.1.0 | Nova tela de ofertas | 23/09/2024 |
| 6.6.0, 6.6.01, 7.0.0, 7.0.02, 7.1.0 | Melhorias cesta (tag de oferta aplicada, progressão ao frete grátis) | 23/09/2024 |
| — | Clearsale (ajuste de delay no processamento do SDK) | 04/10/2024 |
| — | Ajuste vitrine de ofertas (desabilitar vitrine quando a loja não tem ofertas criadas) | 04/10/2024 |
| — | Sentry (log completo da aplicação de antifraude Clearsale) | 04/10/2024 |
| — | Ajuste SDK Clear Sale (adequação às políticas de privacidade do Google Play) | 31/10/2024 |
| — | Card do resultado de busca (padronização) | 15/11/2024 |
| — | Validar estoque ao criar ofertas (não apresentar ofertas do portal sem estoque no lojista) | 15/11/2024 |
| — | Banner frete grátis (comunicação na home quando o lojista tem a configuração ativa) | 15/11/2024 |
| — | Ocultar CTA de ofertas (quando o usuário não possui ao menos uma oferta disponível) | 15/11/2024 |
| — | Frete grátis por domínio de e-mail na cesta (loja Serraria da Super Popular, e-mails @farmarcas/@febrafar) | 15/11/2024 |
| — | Menu categorias no módulo ofertas (desabilitado para lojas do módulo ofertas) | 15/11/2024 |
| — | Feedback de produto inserido na cesta (reativação da mensagem + CTA para o checkout) | 15/11/2024 |
| — | Smartlook (captura de telas ativada na rede Drogarede) | 15/11/2024 |
| — | Ofertas de porcentagem (preparação do app para método de desconto por % via API de offer) | 15/11/2024 |
| — | Ofertas de família de produto (agrupamento na apresentação das ofertas) | 15/11/2024 |
| — | Bug botão concluir compra (desabilitado em alguns contextos de definição do método de pagamento) | 15/11/2024 |
| — | Tela de perfil do usuário (melhorias de layout, fluxo de edição de dados, menu "Segurança e Privacidade") | 15/11/2024 |
| — | Login na homepage do app (novo CTA de login) | 15/11/2024 |
| — | Banner com clique para departamentos (direciona ao detalhe do departamento) | 15/11/2024 |
| 7.2.0, 7.2.1 | Braspag (gateway de pagamento + antifraude Cybersource + cartão tokenizado) | 24/02/2025 |
| 7.2.0, 7.2.1 | Ofertas de porcentagem | 24/02/2025 |
| 7.2.0, 7.2.1 | Oferta de família de produtos | 24/02/2025 |
| 7.2.0, 7.2.1 | Cliques Banner (captura de visualizações/cliques dos banners do portal + ajuste na ordenação) | 24/02/2025 |
| 7.2.2 | Braspag (correção da cesta considerando diferenças entre plano básico e avançado) | 06/03/2025 |
| 7.3.1 | Braspag (pagamento via Pix no app) | 03/04/2025 |
| 7.3.2 | Bug ativação de oferta (botão de ativar ofertas não aparecia na sessão deslogada) | 03/04/2025 *(confirmar)* |
| 7.3.2 | Lista de pedidos (informações de detalhe do pedido com quebra de layout no card) | 03/04/2025 *(confirmar)* |
| 7.3.2 | Alinhamento tag card de produtos | *(sem data associada no documento)* |
| 7.3.2 | Retirar campo de busca do módulo ofertas | *(sem data associada no documento)* |
| 7.3.2 | Retirar banners padrão do app | *(sem data associada no documento)* |
| 7.3.3, 7.3.4 | Hotfix pagamento via Pix na Entrega (o método de Pix na entrega estava chamando o endpoint do Pix da Braspag) | 15/04/2025 |
| 7.3.5 a 7.3.20, 7.3.21 | Hotfix listagem de lojas (inserção de endereço por CEP passava latitude/longitude zeradas) | *(sem data associada no documento)* |
| 7.4.0, 7.4.105, 8.1.0, 8.1.1 | Mensagem de quantidade de produtos na cesta (mensagem de erro ao tentar aumentar a quantidade sem estoque) | *(sem data associada no documento)* |
| 8.2.0, 8.3.0 | Melhorias de segurança contra hackers (regra dos R$ 25 na primeira compra) | 20/05/2025 |
| 8.3.1, 8.1.5 | Hotfix método de pagamento na maquininha | 30/07/2025 |
| 8.5.0 | Detalhes do produto (nova tela de detalhes do produto) | 05/09/2025 |
| — | Troca de loja na cesta (versão exclusiva Maxi Popular, por enquanto) | 10/09/2025 |
| — | Novas vitrines | 16/02/2026 |
| — | Refatoração homepage | 16/02/2026 |
| — | Refatoração card de produtos | 16/02/2026 |
| — | Incluir botão de limpar busca | 16/02/2026 |
| — | Bug endereço não sendo atualizado no carrinho | 16/02/2026 |
| — | Bugs fix | 16/02/2026 |
| — | Atualização Flutter versão 3.41 | 24/02/2026 |
| — | Venda de medicamentos controlados com retirada na loja | 24/02/2026 |
| — | Integração MixPanel | 13/03/2026 |
| — | Tagueamento eventos MixPanel | 13/03/2026 |
| — | Tela de downtime do app | 13/03/2026 |
| — | Bugfix | 13/03/2026 |
| — | Alterar farmácia na retirada | 01/06/2026 *(corrigido de 01/06/2025 — ano confirmado pelo PO)* |
| — | Gestão de endereços do consumidor | 01/06/2026 *(corrigido de 01/06/2025 — ano confirmado pelo PO)* |
| — | Push notification nas transações de pedidos | 01/06/2026 *(corrigido de 01/06/2025 — ano confirmado pelo PO)* |
| 8.6.0 | Tratativa limitação de oferta no checkout | 08/06/2026 *(corrigido de 08/06/2025 — ano confirmado pelo PO)* |
| 8.6.1 | Bugs fix | *(sem data associada no documento)* |
| 8.6.2 | Novo checkout | 02/07/2026 *(corrigido de 02/07/2025 — ano confirmado pelo PO)* |

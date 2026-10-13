# Indicadores — Estrutura da Tela e Seletor de Período

**Módulo:** Operação
**Histórias:** [ECP-1615](https://farmarcas.atlassian.net/browse/ECP-1615) (Indicadores — Estrutura da tela e seletor de período)
**Referência:** protótipo "Novo Portal - Navegável" (Claude Design, 07/10/2026), componentes `PageHead` (cabeçalho e seletor de período) e `Scope` (faixa de escopo) em `ind-home.jsx`; [Home-Vendas-Visao-Geral.md](Home-Vendas-Visao-Geral.md), seções 3 (estrutura da tela) e 5 (período em dias de Brasília)
**Relacionado:** [Filtro-GE-e-Macro-abas.md](Filtro-GE-e-Macro-abas.md) (ECP-1512 e ECP-1598), [Filtro.Multicontexto.md](../Filtros%20Multicontexto/Filtro.Multicontexto.md) (ECP-1568), [Header-Global.md](../../Shell/Header-Global.md) (ECP-1494), [Ruptura-Estoque-Home-e-Detalhamento.md](Ruptura-Estoque-Home-e-Detalhamento.md) (ECP-1593, que herda o período), [Home-Ofertas.md](Home-Ofertas.md)
**Status:** Em refinamento (card em "Pronto para refinamento" no Jira)
**Última atualização:** 2026-10-13

---

## 1. O que é

A estrutura comum que todos os indicadores da Home de Indicadores (Vendas e Ofertas) reaproveitam: o **cabeçalho da página** (título "Indicadores", slot do filtro de GE, **seletor de período** e slot do botão "Exportar"), o seletor de período em si (componente novo, criado do zero em React nesta entrega) e a **faixa de escopo** que mostra o contexto aplicado. O período escolhido comanda a tela inteira: cada indicador que depende de período o aplica exatamente, sem repetir a escolha em cada card. A entrega cobre front-end (cabeçalho, seletor, faixa de escopo, propagação do intervalo aos indicadores) e back-end (receber o intervalo escolhido e convertê-lo em limites do dia de Brasília em UTC, de forma única para todos os indicadores).

## 2. Estrutura

- **Cabeçalho da página:** título "Indicadores" e, à direita, na ordem, o slot do **filtro de GE** (ECP-1512; visível só para Admin), o **seletor de período** e o slot do botão "Exportar" (a exportação em si não faz parte deste card). Abaixo, as macro-abas "Lojas de Vendas" / "Lojas de Ofertas" (ECP-1598).
- **Seletor de período** (componente novo): campo de seleção única; período padrão **"Hoje"**. Opções: "Hoje", "Últimos 7 dias", "Últimos 30 dias" e "Este mês" (as do protótipo); o que o protótipo não mostra está em Pendências.
- **Faixa de escopo:** mostra o contexto aplicado; com o contexto no padrão, o texto é "Exibindo todas as redes e lojas · use o filtro global no topo para refinar" e o link "Limpar filtro" não aparece. Com contexto diferente do padrão, mostra "Exibindo N lojas de M redes · filtro global" ("loja" e "rede" no singular quando for 1) e o link "Limpar filtro", que devolve o contexto ao padrão (a faixa é entregue neste card, decisão do PO de 2026-10-08).
- O período vale para a tela inteira: o seletor fica no cabeçalho, acima das macro-abas, e é o **mesmo nas duas** (mesmas opções e padrão "Hoje" também em Lojas de Ofertas; trocar de macro-aba mantém o período) e dispara **nova consulta** em cada indicador que depende dele (não é filtro local).
- **Contrato com os indicadores:** o seletor entrega início e fim do intervalo e cada indicador o aplica exatamente; os indicadores que o próprio card define como independentes do período (ex.: pedidos em aberto, Lojas com retirada) não recarregam quando o período muda — recarregam só quando muda o contexto.
- **Estados** de carregamento, erro e vazio ficam em cada indicador (cards próprios); este card só dispara a recarga ao trocar o período.

## 3. Regras de negócio

- **Período padrão:** "Hoje".
- **Fuso e janela:** o período é em dias de Brasília: início = 00:00:00.000 do dia inicial (03:00 UTC); fim = 23:59:59.999 do dia final (02:59:59.999 UTC do dia seguinte), conforme [Home-Vendas-Visao-Geral.md](Home-Vendas-Visao-Geral.md), seção 5.
- **Janelas dos atalhos (legado, janelas móveis, não meses de calendário):** "Hoje" = hoje 00:00 a 23:59; "Últimos 7 dias" = de hoje menos 6 dias até hoje; "Últimos 30 dias" = de hoje menos 1 mês até hoje.
- **Indicadores que obedecem ao seletor:** todo indicador que depende de período considera exatamente o intervalo selecionado. Vendas: ECP-1546 (Faturamento), ECP-1547 (Pedidos cancelados), ECP-1548 (Pedidos concluídos), ECP-1605 (Cancelamentos), ECP-1590 (Ruptura de estoque), Ticket médio (ECP-1608), Tempo médio para iniciar o primeiro atendimento, Tempo total de atendimento, Média de itens por cesta, Top produtos mais vendidos, Formas de pagamento e Métodos de entrega. Ofertas: Ofertas criadas, Ofertas ativadas, Taxa de conversão, Total de vendas realizadas, Conversão PDV/App e Top produtos ativados. Cada card desses indicadores traz uma linha de regra e um critério de aceite referenciando este seletor.
- **Filtro de GE:** só existe para Admin (ECP-1512) e fica à esquerda do seletor de período.
- **Acesso à tela:** Admin, Gestor de Rede e Gestor de Loja; o guard de rota está definido no ECP-1512.
- **Detalhamento da Ruptura:** herda o período da Home ao chegar por "Ver detalhes" (ver [Ruptura-Estoque-Home-e-Detalhamento.md](Ruptura-Estoque-Home-e-Detalhamento.md)).

## 4. Nível de integração / fonte de dados

**Query reaproveitada** — cálculo de janela por tipo de período: `ecomm-bff-backoffice-indicator-dotnet/Edelivery.BackOffice.Indicator.Application/Helpers/DateRangeHelper.cs:15-22` (Brasília):

```csharp
TypeIndicatorEnum.day     => (hoje 00:00:00, hoje 23:59:59),
TypeIndicatorEnum.week    => (now.Date.AddDays(-6), end),
TypeIndicatorEnum.month   => (now.Date.AddMonths(-1), end.Date.AddDays(1).AddTicks(-1)),
TypeIndicatorEnum.quarter => (now.Date.AddMonths(-2).AddDays(1), end),
TypeIndicatorEnum.year    => (now.Date.AddMonths(-11).AddDays(1), end),
TypeIndicatorEnum.custom  => ((DateTime)initDate!, (DateTime)endDate!),
```

**O que faz:** converte o tipo de período escolhido (dia, semana, mês, trimestre, ano ou personalizado) em início e fim no horário de Brasília; a conversão para UTC acontece depois, na consulta de cada serviço (ex.: ruptura em `PostStockoutOrderCommand.cs:69-85`).

**O que NÃO faz:** não tem a opção "Este mês" (o tipo `month` é "de hoje menos 1 mês até hoje", ou seja, "Últimos 30 dias"); não padroniza a conversão para UTC entre os indicadores.

**Ponto de atenção / correção — janela de data.** (a) **Comportamento atual:** em alguns indicadores (Top produtos e Formas de pagamento) o filtro reaplica `.Date` sobre o valor já em UTC (`HelpersOrder.cs`), o que alarga a janela em cerca de 24 h (ex.: "Hoje" de 05/10 cobre de 04/10 21:00 a 06/10 20:59 em Brasília); a ruptura já converte sem alargar. (b) **A reconstrução deve:** usar os limites do dia de Brasília convertidos para UTC em todos os indicadores, sem reaplicar `.Date` (decisão do PO de 2026-10-05; detalhes em [Home-Vendas-Visao-Geral.md](Home-Vendas-Visao-Geral.md), seção 7).

## 5. Cenários de borda

| Cenário | Regra |
|---|---|
| Abre a tela de Indicadores | Título "Indicadores", seletor com "Hoje" selecionado e espaço do botão "Exportar" |
| Admin | Filtro de GE à esquerda do seletor de período |
| Gestor de Rede ou Gestor de Loja | Sem filtro de GE |
| Seleciona um período no seletor | Todos os indicadores que dependem de período consideram exatamente esse intervalo |
| Seleciona "Últimos 7 dias" | Intervalo do início do dia de hoje menos 6 dias até o fim do dia de hoje, em dias de Brasília convertidos para UTC |
| Troca de macro-aba | O período selecionado se mantém |
| Contexto aplicado é o padrão | Faixa "Exibindo todas as redes e lojas · use o filtro global no topo para refinar", sem "Limpar filtro" |
| Troca de período | Cada indicador dependente faz nova consulta; os independentes do período não recarregam |
| Contexto aplicado difere do padrão | Faixa "Exibindo N lojas de M redes · filtro global" com o link "Limpar filtro"; ao clicar, o contexto volta ao padrão e a faixa volta ao texto padrão, sem o link |

## 6. Pendências / perguntas em aberto

- [ ] **Janela de "Este mês":** o protótipo mostra a opção, sem definir a janela (mês de calendário até hoje ou janela móvel); o legado não tem essa opção.
- [ ] **Opção "Personalizado":** o protótipo não a mostra (intervalo livre de datas, limites de datas, calendário de intervalo, estados do date picker); o back-end já aceita intervalo personalizado. O ECP-1593 do Detalhamento da Ruptura especifica "Personalizado" com calendário de intervalo.
- [ ] **Opções "3 Meses" e "12 Meses" do legado:** o protótipo não as mostra; decisão do PO.
- [ ] **Documento da Home de Ofertas:** [Home-Ofertas.md](Home-Ofertas.md) registra que o legado da aba Ofertas não tem "Hoje"; no protótipo o seletor é único, acima das macro-abas, com "Hoje" por padrão também em Lojas de Ofertas. Alinhar o documento da Home de Ofertas.
- [ ] **Texto de última atualização** ("Atualizado há 5 minutos" no cabeçalho do protótipo): continua sem especificar; confirmar.
- [ ] **Indicadores independentes do período:** o card cita que existem (ex.: pedidos em aberto, Lojas com retirada) mas não os lista; a lista vive nos cards de cada indicador.

## Changelog

- **2026-10-13 (2)** — Card ECP-1615 ajustado: lista única de opções do seletor ("Hoje", "Últimos 7 dias", "Últimos 30 dias", "Este mês", as do protótipo); "Personalizado", "3 Meses" e "12 Meses", janela de "Este mês" e date picker passam a pendências; faixa de escopo com contexto aplicado ("Exibindo N lojas de M redes · filtro global" e "Limpar filtro") entra no corpo e nos critérios; seletor único acima das macro-abas, com "Hoje" por padrão também em Ofertas.
- **2026-10-13** — Criação do documento (v1), a partir do ECP-1615: cabeçalho da tela (título, slot do filtro de GE, seletor de período, slot do "Exportar"), período padrão "Hoje" comum às duas macro-abas, contrato do seletor com os indicadores (início e fim do intervalo; independentes não recarregam), conversão única dos dias de Brasília para UTC, faixa de escopo no estado padrão e pendências (opções do seletor, comportamento do "Personalizado", faixa de escopo com contexto aplicado, Ofertas sem "Hoje").

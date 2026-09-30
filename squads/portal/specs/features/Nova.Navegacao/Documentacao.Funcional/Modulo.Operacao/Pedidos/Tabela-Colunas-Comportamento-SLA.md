# Pedidos — Tabela: Colunas, Comportamento e Semáforo de SLA

**Módulo:** Operação
**Histórias:** [ECP-1515](https://farmarcas.atlassian.net/browse/ECP-1515) — Tabela de Pedidos: Colunas, Comportamento e Semáforo de SLA
**Referência UX:** [ECP-1312](https://farmarcas.atlassian.net/browse/ECP-1312) (Tabela: colunas e layout)
**PRD de origem:** `PRD-nova-navegacao-multicontexto-pedidos.md`, seções 6.3, 6.4
**Relacionado:** [Listagem-Macro-Abas-Filtros-Periodo.md](Listagem-Macro-Abas-Filtros-Periodo.md)
**Status:** Em desenvolvimento
**Última atualização:** 2026-09-30

---

## 1. O que é

A tabela precisa ser **preditiva, não reativa**: o objetivo é sinalizar antes do atraso acontecer, não só reagir depois. O modelo usa minutos absolutos (não percentual de SLA) e tem 2 eixos independentes que podem coexistir na mesma linha.

## 2. Colunas e comportamento

- Colunas: Prazo, Data/Hora, Cliente, Status, Resumo, Tipo, Loja, Total — as 2 últimas fixas no scroll horizontal.
- Linha inteira clicável, abre o detalhe do pedido.
- Ordenação restrita a Data/Hora e Total; demais colunas não reordenam.

## 3. Regras de negócio — Semáforo de SLA

### 3.1 Eixo 1 — prazo de entrega/retirada (cor da linha)

- **Amarelo:** faltando 20 minutos pro prazo estimado de entrega/retirada — é a mesma referência de tempo do "Atrasado", não duas coisas diferentes.
- **Vermelho/"Atrasado":** o pedido já excedeu o tempo de entrega/retirada. Cada loja pode configurar um tempo diferente (ex.: default 30 min) — todo pedido atrasado fica vermelho, independente de estar "Parado" ou não.

### 3.2 Eixo 2 — movimentação (tag "Parado")

Sem nenhuma movimentação por **mais de 60 minutos fixos** — reconfirmado 2026-09-24 (a daily de arquitetura levantou 120 min, Matheus manteve 60; sem personalização por loja neste ciclo, fica pra 2027). O filtro "Parados" (painel avançado) cruza todos os status — Conferência, Na fila, Em separação, Liberados.

### 3.3 Independência dos eixos

Um pedido pode estar atrasado sem estar parado (chegou movimentação recente, mas o tempo de entrega configurado é curto) e vice-versa. Quando os dois se aplicam, a UI mostra os dois (linha vermelha + tag "Parado").

## 4. Nível de integração / fonte de dados

Pedidos vivem em `edelivery_order.order_data`. Regras gerais de query sobre timestamps de status (ver [[feedback_status_change_query_rules]], aplicáveis também aqui):

- Qualquer cálculo de "tempo desde a última movimentação" (pra tag "Parado") deve usar o timestamp do **evento** mais recente de mudança de status real — não `updatedAt` puro, que reprocessamentos de ERP tocam sem transição de fato. Guard `previusStatus != status` recomendado pelo mesmo motivo.
- Timestamps no banco são UTC; o "agora" de negócio pro cálculo dos 60 minutos deve considerar o fuso BRT (a comparação em si é uma diferença de tempo, então o fuso importa menos aqui do que em filtros de "dia" — mas vale confirmar com engenharia se o cálculo do "Parado" roda no back ou no front, e em qual fuso a hora "agora" é gerada).
- **Tempo de entrega/retirada configurável por loja** (pro eixo "Atrasado") — fonte exata (tabela/campo de configuração da loja) não levantada ainda.
- **Não confirmado:** se o cálculo do semáforo roda em tempo real no front (poll) ou é pré-computado no backend e só consumido pela tabela.

## 5. Cenários de borda

| Cenário | Regra |
|---|---|
| Pedido a 20 min de atrasar | Linha amarela |
| Pedido já atrasado, com ou sem tag Parado | Linha vermelha, independente da tag |
| Pedido parado há 1h+, ainda dentro do prazo | Tag "Parado", sem vermelho |
| Clique em coluna sem ordenação (Prazo, Cliente, Status, Resumo, Tipo, Loja) | Nada acontece |

## 6. Pendências / perguntas em aberto

- [ ] Fonte exata da configuração de "tempo de entrega/retirada" por loja.
- [ ] Onde roda o cálculo do semáforo (front vs. backend) e com que frequência atualiza.
- [ ] Volumetria/performance da tabela pra grupos com muitas lojas/pedidos simultâneos (PRD seção 9).

## Changelog

- **2026-09-30** — Criação do documento (v1), a partir de ECP-1515, ECP-1312, PRD seções 6.3/6.4.

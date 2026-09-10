# Histórias de Usuário — Busca: Filtros e ordenação no resultado de busca

**Épico:** Busca

**Fontes utilizadas:**
- Mockup de tela (resultado de busca + bottom sheets "Ordenar por" e "Filtrar") compartilhado pelo usuário no Claude Code em 26/08/2026 — sem link Figma associado localizado no repositório
- [Estudo Busca](../estudo-busca-miro.md), seção 4 "Pontos de atenção que precisam ser considerados": *"Filtros e ordenação pós-busca: o usuário deve ter a possibilidade de realizar filtros na tela de resultado de busca"* — âmbito do spike [ECA-861](https://farmarcas.atlassian.net/browse/ECA-861)
- `context/product.md`, `context/glossary.md`

**Instrução do solicitante:** o filtro de quantidade (visível no mockup) não deve ser implementado — o bottom sheet "Filtrar" deve conter apenas a seção Fabricante.

---

## ⚠️ Perguntas para refinamento (antes de considerar estas histórias fechadas)

O mockup mostra o comportamento visual das telas, mas não responde algumas questões de regra de negócio. Sinalizando em vez de assumir, conforme `CLAUDE.md`:

1. **Fabricante — seleção única ou múltipla?** Os chips (Sanofi, Cimed) não mostram estado selecionado no mockup. Assumi multi-seleção por ser o padrão mais comum em filtro de fabricante, mas precisa confirmação.
2. **Origem da lista de fabricantes:** é dinâmica (apenas fabricantes presentes nos resultados da busca atual) ou uma lista fixa/global de fabricantes cadastrados?
3. **Feedback visual no botão "Filtrar":** ao aplicar um ou mais fabricantes, o botão exibe algum indicador (badge/contador) de filtro ativo? Não aparece no mockup.
4. **Feedback visual no botão "Ordenar":** o label do botão muda para refletir a opção selecionada (ex.: "Desconto") ou permanece fixo como "Ordenar"?
5. **Persistência entre buscas:** ordenação e filtro de fabricante selecionados persistem ao trocar o termo buscado, ou são resetados a cada nova busca?
6. **Estado vazio:** existe uma tela/placeholder específico quando o filtro de fabricante aplicado não retorna nenhum produto?
7. **Critério de desempate em "Mais vendidos"/"Desconto":** quando dois produtos empatam no critério (mesmo volume de vendas ou mesmo percentual de desconto), qual critério secundário deve ser usado?

---

## 1 · Busca - Ordenar resultados da busca

**Épico:** Busca

**Tipo:** História | **Story Points:** 5 | **Prioridade:** High

**User Story**
Como usuário consumidor que tem acesso ao aplicativo, quero ordenar os resultados de uma busca por critérios como mais vendidos, desconto ou preço, para encontrar mais rapidamente o produto que atende minha necessidade.

**Overview**
Hoje a tela de resultado de busca apresenta os produtos apenas segundo o ranking de relevância da busca (ver critérios em `estudo-busca-miro.md`). Esta história adiciona um controle de ordenação explícito, que permite ao consumidor reorganizar a lista já retornada segundo outros critérios de interesse (popularidade, desconto, preço).

**O que deve ser feito**
- Botão "Ordenar" no topo da tela de resultado de busca, ao lado do botão "Filtrar"
- Bottom sheet "Ordenar por" com as opções: Mais vendidos, Desconto, Menor preço, Maior preço
- Indicação visual de qual opção está selecionada no momento (destaque de borda/cor)
- Reordenação da lista de resultados da busca conforme o critério selecionado

**Regras de Negócio**
- O bottom sheet "Ordenar por" apresenta 4 opções, cada uma com ícone próprio: Mais vendidos, Desconto, Menor preço, Maior preço
- Apenas uma opção de ordenação pode estar selecionada por vez (seleção exclusiva)
- "Mais vendidos" é a opção pré-selecionada ao abrir o bottom sheet pela primeira vez em uma busca
- Ao tocar em uma opção diferente da atualmente selecionada, o app aplica a nova ordenação à lista de resultados e fecha o bottom sheet automaticamente — não há botão "Aplicar" neste fluxo (diferente do fluxo de filtro)
- "Desconto" ordena os produtos do maior para o menor percentual de desconto
- "Menor preço" ordena os produtos de forma crescente pelo preço final (com desconto aplicado, quando houver)
- "Maior preço" ordena os produtos de forma decrescente pelo preço final (com desconto aplicado, quando houver)
- "Mais vendidos" ordena os produtos pelo número de vezes comprado, do maior para o menor (conforme infos de comportamento já mapeadas em `estudo-busca-miro.md`)
- A ordenação selecionada deve ser mantida ao aplicar um filtro de fabricante na mesma busca

**Critérios de Aceite**

```gherkin
Cenário: Abrir o bottom sheet de ordenação
  Dado que estou na tela de resultado de busca
  Quando toco no botão "Ordenar"
  Então visualizo o bottom sheet "Ordenar por" com as opções Mais vendidos, Desconto, Menor preço, Maior preço
  E "Mais vendidos" aparece selecionado por padrão

Cenário: Selecionar um critério de ordenação
  Dado que o bottom sheet "Ordenar por" está aberto
  Quando toco na opção "Menor preço"
  Então o bottom sheet fecha automaticamente
  E a lista de resultados é reordenada do menor para o maior preço final

Cenário: Ordenação por desconto
  Dado que estou na tela de resultado de busca
  Quando seleciono a opção "Desconto" no bottom sheet "Ordenar por"
  Então visualizo os produtos ordenados do maior para o menor percentual de desconto

Cenário: Ordenação combinada com filtro
  Dado que já apliquei um filtro de fabricante nos resultados
  Quando seleciono um critério de ordenação diferente
  Então a lista filtrada é reordenada conforme o novo critério, mantendo apenas os produtos do fabricante filtrado
```

**Impacto na NSM:** facilita a decisão de compra ao permitir priorizar produtos por preço ou popularidade, reduzindo o tempo até a adição ao carrinho — contribui para o Volume de Transações por Loja Ativa.

**Subtarefas sugeridas**
- QA | Casos de teste: cada critério de ordenação isoladamente, troca de critério, combinação com filtro de fabricante, lista com poucos/nenhum resultado
- [BE] Expor parâmetro de ordenação na API de resultado de busca (mais vendidos, desconto, menor preço, maior preço)
- [APP] Construir botão "Ordenar" e bottom sheet "Ordenar por" com seleção exclusiva e aplicação imediata

**Definição de Pronto (DoD)**
- [ ] Código revisado e aprovado
- [ ] Testes unitários escritos
- [ ] Testado em Android e iOS
- [ ] Sem regressão nas funcionalidades existentes de busca
- [ ] Documentação de API atualizada (se aplicável)

---

## 2 · Busca - Filtrar resultados da busca por fabricante

**Épico:** Busca

**Tipo:** História | **Story Points:** 5 | **Prioridade:** High

**User Story**
Como usuário consumidor que tem acesso ao aplicativo, quero filtrar os resultados de uma busca por fabricante, para encontrar mais rapidamente produtos de uma marca/laboratório específico.

**Overview**
Adiciona um controle de filtro explícito na tela de resultado de busca, permitindo restringir a lista já retornada a produtos de um ou mais fabricantes selecionados. O filtro de quantidade presente no mockup original **não faz parte do escopo** desta história.

**O que deve ser feito**
- Botão "Filtrar" no topo da tela de resultado de busca, ao lado do botão "Ordenar"
- Bottom sheet "Filtrar" com a seção "Fabricante", listando os fabricantes disponíveis como chips selecionáveis
- Botões "Limpar" e "Aplicar" no bottom sheet de filtro
- Aplicação do(s) fabricante(s) selecionado(s) à lista de resultados da busca

**Regras de Negócio**
- O bottom sheet "Filtrar" apresenta a seção "Fabricante" com os fabricantes disponíveis nos resultados da busca atual, exibidos como chips
- Ao tocar em um chip de fabricante, ele alterna entre selecionado e não selecionado (toggle)
- Diferente da ordenação, a seleção de fabricante só é aplicada à lista de resultados ao tocar em "Aplicar" — tocar em um chip não filtra a lista imediatamente nem fecha o bottom sheet
- O botão "Limpar" remove todas as seleções de fabricante feitas no bottom sheet, sem aplicar a lista ainda
- Ao tocar em "Aplicar", o bottom sheet fecha e a lista de resultados passa a exibir apenas produtos dos fabricantes selecionados
- O filtro de quantidade presente no mockup de referência não deve ser implementado
- O filtro de fabricante selecionado deve ser mantido ao aplicar/trocar a ordenação na mesma busca

**Critérios de Aceite**

```gherkin
Cenário: Abrir o bottom sheet de filtro
  Dado que estou na tela de resultado de busca
  Quando toco no botão "Filtrar"
  Então visualizo o bottom sheet "Filtrar" com a seção "Fabricante" e os fabricantes disponíveis nos resultados
  E não visualizo nenhuma opção de filtro por quantidade

Cenário: Selecionar fabricante(s) e aplicar
  Dado que o bottom sheet "Filtrar" está aberto
  Quando seleciono o chip "Sanofi"
  E toco em "Aplicar"
  Então o bottom sheet fecha
  E a lista de resultados passa a exibir apenas produtos do fabricante Sanofi

Cenário: Limpar seleção antes de aplicar
  Dado que selecionei um ou mais chips de fabricante no bottom sheet
  Quando toco em "Limpar"
  Então todos os chips voltam ao estado não selecionado
  E a lista de resultados permanece sem alteração até que eu toque em "Aplicar"

Cenário: Filtro combinado com ordenação
  Dado que já selecionei um critério de ordenação diferente do padrão
  Quando aplico um filtro de fabricante
  Então a lista filtrada mantém a ordenação previamente selecionada
```

**Impacto na NSM:** reduz o esforço de navegação para localizar produtos de uma marca específica, aumentando a probabilidade de conversão dentro da mesma sessão de busca — contribui para o Volume de Transações por Loja Ativa.

**Subtarefas sugeridas**
- QA | Casos de teste: seleção única, seleção múltipla, limpar sem aplicar, aplicar sem seleção, combinação com ordenação, resultado vazio após filtro
- [BE] Expor endpoint/parâmetro de filtro por fabricante na API de resultado de busca, retornando a lista de fabricantes disponíveis no conjunto de resultados
- [APP] Construir botão "Filtrar" e bottom sheet com chips de fabricante, botões Limpar/Aplicar

**Definição de Pronto (DoD)**
- [ ] Código revisado e aprovado
- [ ] Testes unitários escritos
- [ ] Testado em Android e iOS
- [ ] Sem regressão nas funcionalidades existentes de busca
- [ ] Documentação de API atualizada (se aplicável)

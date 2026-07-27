# Estudo Busca

> Fonte: [Miro — Estudo Busca](https://miro.com/app/board/uXjVGMG4VAQ=/)
> Data do estudo: 02 de Abril, 2024

## 1. Estrutura inicial do mecanismo de busca

| Etapa | Descrição | Detalhe no board |
|---|---|---|
| 1. Servidores Web | Onde os dados estão armazenados | Mongo, Postgres |
| 2. Ingestão de dados | Quais são e de onde vem os dados | Catálogo nacional |
| 3. Índice | Critério de organização dos dados? | Nome, EAN, Fabricante, Princípio ativo, Departamento, Categoria, Subcategoria, Sintoma |
| 4. Resultado | Apresentação das informações | Aplicativo da rede |

## 2. Requisitos da busca

### Por que os usuários estão realizando a busca?

- Para encontrar o produto que deseja realizar uma compra
- Para conferir o preço de algum produto específico
- Para verificar se tem alguma boa promoção disponível

### Quais informações precisamos para decidir se algo é relevante?

**Informações do produto**
- Nome
- EAN
- Fabricante
- Princípio ativo
- Departamento
- Categoria
- Subcategoria
- Sintoma

**Infos de comportamento**
- Número de vezes que o produto foi buscado
- Número de vezes que o produto foi comprado

### Como decidir quais são os melhores resultados?

Critérios de ranking, em ordem de prioridade:

1. Exatidão do termo buscado
2. Termo mais próximo possível da exatidão
3. Produtos similares com base na subcategoria
4. Produtos similares com base na categoria
5. Produtos similares com base no departamento
6. **Produtos similares com base no sintoma** *(destacado no board — depende de campo ainda não existente, ver observação no cenário 5° abaixo)*
7. Produtos similares com base no princípio ativo

### Qual é a melhor apresentação de resultados possível em cada cenário possível?

Cada cenário de busca abaixo tem uma regra de negócio associada no board.

**1° — Produto exato com estoque disponível**
Regra de negócio: apresentar em primeiro o produto buscado e incrementar o resultado com os produtos "exatamente iguais" com apresentações diferentes.
> Exemplo — Busca: *Dorflex max 8 comprimidos*
> Resultado 1: Dorflex max 8 comprimidos
> Resultado 2: Dorflex max 16 comprimidos
> Resultado 3: Dorflex max 24 comprimidos

**2° — Produto exato com estoque indisponível**
Regra de negócio: apresentar em primeiro o produto com estoque indisponível e incrementar o resultado com os X produtos mais buscados (ou comprados), com as seguintes prioridades de rankeamento:
1. Baseado no campo subcategoria
2. Baseado no campo categoria
3. Baseado no campo departamento

**3° — Termo buscado é exato, porém é uma condição de diversos produtos**
Regra de negócio: apresentar os X produtos que se encaixam exatamente no termo buscado, ordenados pelos mais buscados (ou comprados).
> Exemplo — Busca: *Lavanda*
> Resultado 1: Sabonete Dove Lavanda
> Resultado 2: Desodorante Monange Lavanda
> Resultado 3: Óleo corporal de lavanda

**4° — Termo digitado não identificado em nenhum aspecto exato ou aproximado**
Regra de negócio: apresentar a tela com o placeholder de termo não identificado ou produto inexistente.

**5° — Termo digitado é um sintoma que pode ter relação com diversos produtos**
Regra de negócio: apresentar X produtos que atendem o sintoma buscado, rankeados pelos mais buscados (ou comprados).
> Exemplo — Busca: *Febre*
> Resultado 1: Dipirona 1g
> Resultado 2: Neosaldina dip
> Resultado 3: Amoxilina 5ml
>
> **Obs. destacada no board:** ainda não temos esse campo no cadastro do produto (campo classe terapêutica na Anvisa).

**6° — Busca por contexto de vida (Praia, Sol, Piscina, Corrida, Futebol)**
Regra de negócio: apresentar X produtos que atendem o contexto buscado, rankeados pelos mais buscados (ou comprados).
> Exemplo — Busca: *Corrida*
> Resultado 1: Gel de carboidratos
> Resultado 2: Gelol
> Resultado 3: Barrinha de proteína
>
> Exemplo — Busca: *Praia*
> Resultado 1: Filtro solar
> Resultado 2: Filtro solar labial
> Resultado 3: Pós sol
>
> **Obs. destacada no board:** ainda não temos esse campo no cadastro do produto.

**7° — Busca pelo departamento, categoria ou subcategoria**
Regra de negócio: apresentar os X produtos mais buscados (ou comprados) dentro do departamento, categoria ou subcategoria utilizado na busca.
> Exemplo — Busca: *Higiene e beleza*
> Resultado 1: Desodorante aerosol Rexona de lavanda
> Resultado 2: Shampoo Elseve Cabelos Cacheados 200ml
> Resultado 3: Condicionador Hidratante Elseve Cabelos Cacheados
>
> Exemplo — Busca: *Desodorante*
> Resultado 1: Desodorante aerosol Rexona de lavanda
> Resultado 2: Desodorante rolon Monange de flores rosas
> Resultado 3: Desodorante creme Dove Men Care
>
> Exemplo — Busca: *Aerosol*
> Resultado 1: Desodorante Aerosol Rexona de Lavanda
> Resultado 2: Desodorante Aerosol Monange de Flores Rosas
> Resultado 3: Desodorante Aerosol Dove Men Care

**8° — Busca pelo princípio ativo**
Regra de negócio: apresentar os X produtos mais buscados (ou comprados) que se encaixam dentro do princípio ativo buscado.
> Exemplo — Busca: *Ibuprofeno*
> Resultado 1: Novalgina 1g Com 10 Comprimidos
> Resultado 2: Ibuprofeno 600mg Pratti Donaduzzi
> Resultado 3: Advil 1g Com 50 Comprimidos

**9° — Busca com termo errado**
Regra de negócio: dentro das limitações técnicas, identificar a proximidade do termo digitado com um termo correto e apresentar os mesmos resultados.
> Exemplo — Busca: *Xampu*
> Resultado 1: Shampoo Pantene Cabelos Lisos
> Resultado 2: Shampoo Clear Cristiano Ronaldo
> Resultado 3: Shampoo Dove Cabelos Cacheados

**10° — Scan do código de barras do produto**
Regra de negócio: direcionar o usuário para a tela de detalhes do produto escaneado. Caso o produto não exista no catálogo, apresentar a tela com o placeholder de nenhum produto encontrado.

## 3. Dúvidas em aberto

- Como rankear produtos que não possuem histórico de compra e busca?

## 4. Pontos de atenção que precisam ser considerados

> Conteúdo adicional a este documento, **não presente no board original do Miro**. Análise crítica feita à luz de `context/product.md` e `context/glossary.md`, para orientar o escopo do spike [ECA-861](https://farmarcas.atlassian.net/browse/ECA-861).

- **Escopo da busca por loja (modelo B2B2C)**: no Radar, o Consumidor sempre compra de uma farmácia (Lojista) específica — a busca ocorre dentro do catálogo/estoque daquela loja, não de um catálogo único. O board fala de "estoque disponível/indisponível", mas não distingue os dois casos de ausência de produto: produto existe no Catálogo nacional mas essa loja nunca o vendeu/cadastrou, vs. produto não existe no Catálogo nacional (poderia gerar uma **Solicitação de produto**?).
- **Filtros e ordenação pós-busca**: o usuário deve ter a possibilidade de realizar filtros na tela de resultado de busca.
- **Autocomplete**: o app deve sugerir 3 opções de autocomplete da busca de forma macro + 5 cards de produto que seriam os 5 primeiros resultados da busca.
- **Histórico pessoal**: ao clicar no campo de busca, o usuário deve conseguir visualizar os últimos 5 termos buscados por ele mesmo.
- **Buscas compostas / múltiplos atributos** (ex.: "protetor solar fps 50"): os cenários cobrem apenas termo único.
- **Sinônimos e abreviações do domínio farmacêutico** (ex.: "dip" = dipirona, "AAS" = ácido acetilsalicílico): diferente de erro de digitação (cenário 9°), é vocabulário técnico que os usuários usam no dia a dia.

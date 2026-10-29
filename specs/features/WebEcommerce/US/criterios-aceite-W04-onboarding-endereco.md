# Critérios de Aceite — W04 · Onboarding por endereço (Web)

**História de origem:** W04 em [historias-web-ecommerce.md](historias-web-ecommerce.md) (ECA-1332)
**Complementa:** W05 (endereço no header e persistência) e W01 (login)
**Base:** 2 telas do drawer de onboarding (estado inicial e estado com sugestões) + regras de negócio do PO (13/10)
**Persona:** Consumidor (Fidelizado, PBM ou Eventual) — vale para qualquer um, logado ou não

---

## Pontos a confirmar antes de desenvolver

| # | Ponto | Situação |
|---|---|---|
| 1 | A tela 1 mostra o botão **"Usar a localização atual"**, mas a decisão do PO de 05/10 (W04) é onboarding **somente por endereço digitado, sem GPS**. As regras de hoje também não citam o botão. | Os critérios abaixo **não** incluem o botão. Confirmar se sai do design ou se volta ao escopo. |
| 2 | Na tela 2, o 1º endereço já aparece **selecionado** e o "Continuar" azul. A regra diz que o usuário **precisa selecionar** para habilitar. | Critérios seguem a regra (nada pré-selecionado). Ajustar o design ou a regra. |
| 3 | Na tela 1, o "Continuar" aparece azul com o campo vazio. | Critérios pedem o botão **desabilitado** (visual a definir). |
| 4 | **Dúvida do PO:** salvar o endereço incompleto (sem complemento) e completar no carrinho? | Critérios assumem que **sim** (ver cenário "Endereço sem complemento"). Confirmar com o time e com o checkout Web, que ainda não tem design. |
| 5 | **Texto da mensagem de erro** quando nenhuma loja atende. | Texto abaixo é sugestão. Aguarda UX writing. |
| 6 | Regra de hoje: "após o login, usa o endereço e a loja do onboarding". A W04 (PRD FRW-020) diz "usa o endereço e a loja salvos na conta". | Critérios seguem a regra de hoje. Definir o que vale se a conta **já** tinha endereço diferente (ver cenário de conflito). |

---

## 1. Tela inicial

```gherkin
Cenário: Exibir o onboarding quando não há loja definida
  Dado que não há loja na URL nem loja salva em cookie
  Quando acesso a home
  Então vejo o drawer lateral com o logo da bandeira e o botão de fechar
  E vejo o título "Onde você quer receber seu pedido?"
  E vejo o texto "Digite seu endereço com rua e número ou CEP para encontrarmos farmácias com entrega perto de você."
  E vejo o campo "Endereço ou CEP" com o placeholder "Rua e número ou CEP"
  E vejo o botão "Continuar" desabilitado
  E vejo o texto "Já tem uma conta?" com o link "Entrar"

Cenário: Continuar desabilitado sem endereço selecionado
  Dado que o campo "Endereço ou CEP" está vazio
  Quando observo o botão "Continuar"
  Então ele está desabilitado e não executa nenhuma ação ao clique

Cenário: Fechar o drawer sem concluir
  Dado que estou no onboarding sem loja definida
  Quando clico no "X"
  Então o drawer é fechado
  E nenhum endereço ou loja é salvo
```

> Ponto aberto (PD-19): o que aparece **atrás** do drawer quando ainda não há loja, e o que acontece se o usuário fechar sem concluir.

## 2. Busca de endereço (autocomplete)

```gherkin
Cenário: Buscar por endereço digitado
  Dado que estou no onboarding
  Quando digito "Rua Carlos Vasconcelos, 92" no campo "Endereço ou CEP"
  Então o sistema consulta a API de geolocalização do Google
  E exibe o título "Selecione um endereço da lista para continuar"
  E exibe a lista de endereços encontrados

Cenário: Buscar por CEP
  Dado que estou no onboarding
  Quando digito um CEP válido no campo "Endereço ou CEP"
  Então o sistema consulta a API de geolocalização do Google
  E exibe a lista de endereços encontrados para esse CEP

Cenário: Limite de 5 sugestões
  Dado que a consulta ao Google retornou mais de 5 endereços
  Quando a lista é exibida
  Então vejo no máximo 5 endereços

Cenário: Conteúdo de cada sugestão
  Dado que a lista de sugestões está exibida
  Então cada item mostra o logradouro e número em destaque
  E mostra abaixo bairro, cidade, UF e país (ex.: "Cristo Redentor, João Pessoa - PB, Brasil")
  E mostra um seletor de opção (radio) à direita

Cenário: Atualizar a lista ao editar o texto
  Dado que a lista de sugestões está exibida
  Quando altero o texto do campo
  Então a lista é atualizada com o novo resultado
  E qualquer seleção anterior é desfeita
  E o botão "Continuar" volta a ficar desabilitado

Cenário: Nenhum endereço encontrado
  Dado que digitei um texto para o qual o Google não retorna endereços
  Quando a consulta termina
  Então vejo a mensagem "Não encontramos esse endereço. Confira e tente novamente."
  E o botão "Continuar" permanece desabilitado

Cenário: Falha na consulta ao Google
  Dado que a API de geolocalização do Google está indisponível ou retorna erro
  Quando digito um endereço
  Então vejo a mensagem "Não foi possível buscar endereços agora. Tente novamente."
  E o botão "Continuar" permanece desabilitado
  E posso editar o texto e tentar de novo
```

> Detalhes técnicos a combinar com o Front/BE: mínimo de caracteres para disparar a consulta e debounce (evitar uma chamada por tecla); restrição da busca ao Brasil.

## 3. Seleção obrigatória e habilitação do "Continuar"

```gherkin
Cenário: Selecionar um endereço habilita o Continuar
  Dado que a lista de sugestões está exibida e nenhum endereço está selecionado
  Quando seleciono um endereço da lista
  Então o radio do endereço fica marcado
  E o botão "Continuar" é habilitado

Cenário: Trocar o endereço selecionado
  Dado que selecionei um endereço da lista
  Quando seleciono outro endereço
  Então somente o novo endereço fica marcado

Cenário: Não aceitar texto livre sem selecionar
  Dado que digitei um endereço completo e a lista está exibida
  E não selecionei nenhuma sugestão
  Quando tento clicar em "Continuar"
  Então nada acontece
  E o botão permanece desabilitado

Cenário: Sugestão sem número
  Dado que selecionei uma sugestão de rua sem número
  Então vejo o campo "Qual o número?" sob a sugestão selecionada
  E o botão "Continuar" fica desabilitado até eu informar o número

Cenário: Número informado
  Dado que selecionei uma sugestão sem número
  Quando informo o número em "Qual o número?"
  Então o botão "Continuar" é habilitado
  E o endereço usado passa a incluir o número informado

Cenário: Endereço sem complemento (dúvida 4)
  Dado que selecionei um endereço e informei o número
  Quando clico em "Continuar"
  Então o endereço é salvo sem complemento
  E o complemento não é pedido no onboarding
  E o complemento poderá ser informado depois, no carrinho
```

## 4. Roteamento para a melhor loja

Ao clicar em "Continuar" com um endereço selecionado, o sistema escolhe a loja pela primeira regra que tiver loja elegível, nesta ordem:

1. Loja **mais próxima com entrega no endereço**, a no máximo **30 km**.
2. Loja **mais próxima no módulo vendas**.
3. Loja **mais próxima ativa no módulo ofertas**.

```gherkin
Cenário: Loja mais próxima com entrega (prioridade 1)
  Dado que existe ao menos uma loja com entrega no meu endereço a até 30 km
  Quando clico em "Continuar"
  Então sou direcionado para a home da loja com entrega mais próxima
  E o endereço selecionado fica definido como meu endereço

Cenário: A mais próxima não entrega, outra mais distante entrega
  Dado que a loja mais próxima do endereço não tem entrega disponível nele
  E existe outra loja, mais distante e a até 30 km, que entrega
  Quando clico em "Continuar"
  Então sou direcionado para a loja mais distante que entrega

Cenário: Loja com entrega acima de 30 km não é elegível
  Dado que a única loja com entrega no meu endereço está a mais de 30 km
  E existe loja no módulo vendas a qualquer distância
  Quando clico em "Continuar"
  Então a loja com entrega não é escolhida
  E sou direcionado para a loja mais próxima no módulo vendas

Cenário: Sem entrega, usar o módulo vendas (prioridade 2)
  Dado que nenhuma loja tem entrega para o meu endereço a até 30 km
  E existe loja no módulo vendas
  Quando clico em "Continuar"
  Então sou direcionado para a home da loja mais próxima no módulo vendas

Cenário: Sem entrega e sem vendas, usar o módulo ofertas (prioridade 3)
  Dado que nenhuma loja tem entrega nem módulo vendas para o meu endereço
  E existe loja ativa no módulo ofertas
  Quando clico em "Continuar"
  Então sou direcionado para a home da loja ativa mais próxima no módulo ofertas

Cenário: Empate entre lojas que entregam
  Dado que duas ou mais lojas com entrega estão à mesma distância
  Quando clico em "Continuar"
  Então é escolhida a de menor frete
  E, persistindo o empate, a de menor tempo de entrega
  E, persistindo o empate, uma delas é escolhida aleatoriamente

Cenário: Loja sem catálogo não é elegível
  Dado que a loja mais próxima não tem catálogo (sem conteúdo)
  Quando clico em "Continuar"
  Então essa loja é desconsiderada no roteamento

Cenário: Loja definida e salva
  Dado que o roteamento escolheu uma loja
  Quando sou direcionado para a home
  Então a loja fica salva em cookie
  E o drawer de onboarding é fechado
  E o endereço aparece no header (W05)

Cenário: Estado de carregamento
  Dado que cliquei em "Continuar"
  Enquanto o roteamento é processado
  Então o botão fica em estado de carregamento
  E não aceita novo clique
```

## 5. Nenhuma loja atende o endereço

> Hoje não existe tela desenhada para a Web. Decisão do PO: **mensagem de erro direto no onboarding**, sem deixar o usuário prosseguir. A tela com as 5 lojas mais próximas do módulo vendas (igual ao App) fica para quando houver design (PD-03).

```gherkin
Cenário: Nenhuma loja elegível
  Dado que não existe loja com entrega, módulo vendas nem módulo ofertas para o endereço selecionado
  Quando clico em "Continuar"
  Então permaneço no drawer de onboarding
  E vejo a mensagem "Ainda não atendemos sua região. Tente outro endereço."
  E nenhuma loja é definida
  E não consigo acessar a home

Cenário: Tentar outro endereço após o erro
  Dado que vejo a mensagem de região não atendida
  Quando altero o texto do campo e seleciono outro endereço
  Então a mensagem de erro some
  E posso clicar em "Continuar" novamente

Cenário: Erro não grava endereço
  Dado que vejo a mensagem de região não atendida
  Quando fecho a página
  Então o endereço não atendido não fica salvo como meu endereço
```

## 6. Refazer o onboarding

```gherkin
Cenário: Refazer substitui o endereço
  Dado que já tenho um endereço definido
  Quando refaço o onboarding com outro endereço
  Então o endereço anterior é substituído pelo novo

Cenário: Refazer altera a loja quando necessário
  Dado que estou na loja "A"
  E o novo endereço é melhor atendido pela loja "B"
  Quando concluo o onboarding
  Então a loja ativa passa a ser a "B"

Cenário: Refazer mantém a loja quando ela continua a melhor
  Dado que estou na loja "A"
  E a loja "A" continua sendo a melhor para o novo endereço
  Quando concluo o onboarding
  Então a loja ativa continua sendo a "A"
```

> Ponto aberto (PD-19): o que acontece com o carrinho quando a loja muda.

## 7. Endereço e login

```gherkin
Cenário: Endereço salvo como endereço do consumidor ao logar
  Dado que defini meu endereço no onboarding sem estar logado
  Quando faço login
  Então o endereço do onboarding é salvo como endereço do consumidor

Cenário: Manter endereço e loja após o login
  Dado que concluí o onboarding e fui direcionado à loja "A"
  Quando faço login
  Então continuo na loja "A"
  E continuo com o endereço informado no onboarding

Cenário: Login em conta que já tinha endereço (ponto 6)
  Dado que concluí o onboarding com o endereço "X"
  E minha conta já tem o endereço "Y" salvo
  Quando faço login
  Então o endereço "X", do onboarding, substitui o "Y"
  E continuo na loja identificada no onboarding
```

> O último cenário segue a regra de hoje (o onboarding prevalece). Se o PO preferir manter o "Y" da conta, é preciso trocar o cenário.

## 8. "Já tem uma conta? Entrar"

```gherkin
Cenário: Abrir o login a partir do onboarding
  Dado que estou no drawer de onboarding
  Quando clico em "Entrar"
  Então o fluxo de login é aberto (W01)

Cenário: Voltar ao onboarding sem concluir o login
  Dado que abri o login a partir do onboarding
  Quando fecho o login sem autenticar
  Então volto ao drawer de onboarding
  E o que eu já havia digitado ou selecionado é mantido
```

## 9. Responsividade e acessibilidade

```gherkin
Cenário: Layout nos 3 breakpoints
  Dado que abro o onboarding em desktop, tablet ou mobile
  Então o drawer se adapta à largura da tela
  E todos os elementos continuam acessíveis e legíveis

Cenário: Uso por teclado
  Dado que estou no onboarding
  Quando navego com Tab e as setas
  Então consigo digitar, percorrer as sugestões, selecionar uma e acionar "Continuar" sem mouse
```

---

## Impacto na NSM

Levar o consumidor à loja certa, a que realmente entrega no endereço dele, em poucos cliques, é o que viabiliza o primeiro pedido e eleva o Volume de Transações por Loja Ativa.

## Definição de Pronto (DoD)

- [ ] Código revisado e aprovado
- [ ] Testes unitários escritos
- [ ] Testado em desktop, tablet e mobile
- [ ] Sem regressão nas funcionalidades existentes
- [ ] Documentação de API atualizada (autocomplete e roteamento de loja)

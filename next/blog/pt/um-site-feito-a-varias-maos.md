---
title: Um site feito a várias mãos
description: >-
  Conheça o projeto colaborativo para desenvolver uma plataforma que facilita
  ainda mais seu trabalho com dados.
date:
  created: "2021-12-22T15:41:54.427Z"
authors:
  - name: Base dos Dados
    social: /quem-somos
    role: Equipe Base dos Dados
thumbnail: /blog/um-site-feito-a-varias-maos/image_0.png
categories: []
medium_slug: https://medium.com/@basedosdados/um-site-feito-a-v%C3%A1rias-m%C3%A3os-60ddc9eaa4d3
published: true
---

<Image src="/blog/um-site-feito-a-varias-maos/image_0.png" caption="Arte com página da plataforma da BD"/>

## TL;DR

Construir um site totalmente novo foi um dos maiores projetos que realizamos esse ano. Levamos meses pensando e desenvolvendo em conjunto uma plataforma que fosse intuitiva e prática — e muito bonita — para nossos(as) _databasers_.

**Neste artigo queremos mostrar para você como aconteceu esse processo quase mágico**, no qual as ideias foram tomando forma até chegar ao [resultado final](http://basedosdados.org). Além de falar sobre nossa motivação, explicamos também como organizamos os times para construir um site do zero, quais ferramentas utilizamos (e o por quê) e, é claro, como você pode contribuir com esse desenvolvimento ([todo em código aberto](http://github.com/basedosdados/website)).

## Por que resolvemos construir um novo site?

### Limitações do site original

A Base dos Dados começou como um grande catálogo com informações sobre dados públicos. Nossa prioridade era ter uma plataforma simples e possibilitar a inserção de informações de forma fácil. Isso foi suficiente no início — mas logo percebemos que precisávamos inovar.

<Image src="/blog/um-site-feito-a-varias-maos/image_1.png" caption="Versão antiga do nosso site"/>

O site original foi construído somente com o [CKAN](http://ckan.org). Criado pela Open Knowledge, o CKAN é conhecido e utilizado internacionalmente como principal tecnologia para desenvolvimento de portais de dados abertos. Ele proporciona um ótimo sistema de gestão de dados e metadados, e já possui interfaces padrões (_templates_) que podem ser modificados.

> Conforme o site foi evoluindo,**vimos que teríamos dificuldade para desenvolver grandes mudanças mantendo a mesma tecnologia.**

Embora seja largamente utilizado em portais de dados abertos, o CKAN não costuma ser uma tecnologia facilmente encontrada no _toolkit_ de desenvolvedores web. Conforme o site foi evoluindo com novas demandas e funcionalidades, como o botão de download conectado ao _datalake,_ vimos que teríamos dificuldade para desenvolver grandes mudanças caso mantivéssemos a mesma tecnologia. Além disso, precisávamos ter total flexibilidade no _front-end_ para criar um site com um design único.

<Image src="/blog/um-site-feito-a-varias-maos/image_2.png"/>

Escolhemos então manter o CKAN na gestão de metadados do site e repensar todo o _back_ e _front-end_ da plataforma do melhor jeito que conseguimos fazer: com intensas trocas das equipes e muita escuta à nossa comunidade.

## Como o site novo saiu do papel

Esse foi um dos maiores projetos da BD não só pelo número de pessoas envolvidas — **um site construído literalmente por uma dezena de mãos** — , mas também pelas altas horas dedicadas e o tamanho de mudanças que foram realizadas no seu desenvolvimento.

O processo de construção do site por ser resumido **num conjunto de momentos de caos e peças mirabolantes que aos poucos foram se encaixando.** É importante ter em mente que sim, tem muita bagunça e _Frankstein_ antes do site ficar pronto — e esse caos é necessário para deixar fluir a criatividade e surgirem boas ideias.

Embora seja esse grande emaranhado de idas e vindas, tentamos trazer algumas etapas em ordem cronológica que foram fundamentais para nós:

1. **Entender quais são os verdadeiros problemas:** Isso significa ir além do visual e escutar quais as dificuldades de quem usa a plataforma através de **entrevistas de experiência de usuários(as)**.
2. **Preparar o terreno**: Pessoas, responsabilidades e tecnologias bem definidas. No nosso caso, todas as equipes se envolveram no processo, e a comunicação constante foi essencial para convergirmos.
3. **Colocar a mão na massa**: O desenvolvimento embarcou muita coisa — viramos não só a interface mas toda a infraestrutura de cabeça para baixo. Com o terreno já preparado, as equipes foram trabalhando em paralelo (às vezes também em conjunto) durante os meses seguintes.
4. **Revisar os problemas e soluções:** Mais entrevistas para validar nosso produto (e identificar erros que sempre passam despercebido).
5. **Hora de LANÇAR!** _a.k.a. momentos de tensão de um domingo a noite_

## Entendimento do problema: Entrevistas de usuários

Muita gente que já acompanhava a Base dos Dados desde 2019 chegou a comentar em algum momento que nosso site estava muito “anos 2000”. _E estava._ Porém, não era só uma questão de estética — era também funcionalidade, conteúdo e como apresentar de forma didática as diversas faces da Base dos Dados. Começamos então ouvindo mais da nossa comunidade.

Organizamos as primeiras entrevistas com usuários(as) em novembro de 2020. **A ideia era validar uma série de hipóteses que acreditávamos serem essenciais na nossa plataforma** — **se é fácil obter o dado que o(a) usuário(a) necessita, se as etapas e informações disponíveis estão claras**, dentre outras conforme pode ser observado no esquema abaixo.

<Image src="/blog/um-site-feito-a-varias-maos/image_3.png" caption="Esquema de premissas que acreditávamos serem essenciais na nossa plataforma"/>

Chamamos pessoas chave na comunidade para representar diferentes públicos — pesquisadores(as), jornalistas, cientistas de dados e ativistas de dados abertos. Ao todo, nosso time se dividiu em duplas para realizar 6 entrevistas. Durante a entrevista a pessoa tinha a tarefa de buscar por um conjunto de dados no nosso site e responder perguntas de usabilidade, além de avaliar o desenho (_rascunho_) de um nova interface.

Existem diversas maneiras de conduzir uma entrevista de UX (_user experience_) — no nosso caso tentamos **interferir o mínimo possível no fluxo da pessoa na hora da entrevista**, deixando que as dúvidas surjam e ela mesma tente resolver, e inserindo perguntas apenas quando necessário. **E frisamos: não existe certo ou errado! A entrevista é feita para testar o site, e não a pessoa!** É natural surgirem dúvidas e não saber o que fazer na hora, mas deve-se sempre manter em mente que se aquilo aconteceu existe algo a ser repensado na forma como a informação é apresentada ao usuário, e não o contrário (outras dicas para uma boa entrevista estão [neste artigo do UX Collective](https://brasil.uxdesign.cc/16-dicas-para-uma-boa-entrevista-com-o-usu%C3%A1rio-553b477b6e23) e no [NN Group](https://www.nngroup.com/articles/interview-facilitation-mistakes/)).

### O que descobrimos com as entrevistas?

#### Grande destaque para a barra de pesquisa!

Ela por si só já transmitia a nossa principal função de buscar por informações. Porém, a interface confundia os(as) entrevistados(as) por conter **muitas informações sem uma ordem clara de hierarquia visual**. Após a busca pelos dados, foram relatadas dificuldades como “_botões não muito intuitivos_” e “_não está claro o que fazer para ter acesso aos dados de uma tabela_”.

<Image src="/blog/um-site-feito-a-varias-maos/image_4.png" caption="Versão antiga do nosso site"/>

O novo visual, nosso primeiro rascunho mais objetivo e com menos texto desenhado pelo time de Comunicação, era mostrado em seguida para comparação. Porém, depois das primeiras conversas de equipe em 2021 resolvemos que **só isso não bastava — era necessário investirmos num site todo renovado e com a nossa cara.** Um local único onde você encontra tudo sobre a BD, desde tabelas tratadas a tutoriais e análises no [Youtube](https://www.youtube.com/c/basedosdados/videos), [Medium](https://medium.com/basedosdados) e [Github](https://github.com/basedosdados). Era um desafio que demandava tempo, criatividade e o mais importante: **pessoas**.

<Image src="/blog/um-site-feito-a-varias-maos/image_5.png" caption="Primeira proposta de novo visual construído no Figma pelo nosso time de Comunicação"/>

## Preparação: Definição de equipe

A **construção do novo site foi envolveu todas as equipes da BD.** O time de **Infra** ficou responsável por parte do _back-end_ e construção da API para o novo site; **Comunicação** desenvolveu todo o conteúdo escrito e protótipo visual das principais páginas; **Dados** trabalhou junto a Infra na definição de metadados e informações vindas da API (_e é claro todos(as) contribuíram com bons pitacos em todo o processo_).

Mas processo todo de desenvolvimento começou com a nossa contratação de um (diga-se de passagem _excelente_) desenvolvedor front-end, [Breno Gomes](https://www.linkedin.com/in/breno-gomes-0a1457122/), que fez a mágica acontecer. Nossa coordenadora de Comunicação, [Fernanda Scovino](http://github.com/fernandascovino), que também já tinha experiência em desenvolvimento _web_ fez a coordenação das equipes (a famosa e necessária _chata do rolê)._

**Rotina é uma das melhores práticas para garantir que o projeto saia do papel**. Por isso, toda quinta nos reuníamos durante 1 hora a noite no nosso canal aberto #website do [Discord](https://discord.com/invite/huKWpsVYx4). A reunião servia para falarmos sobre do andamento das tarefas daquele _sprint_ semanal, receber contribuições da comunidade (_reunião aberta para quem quisesse participar!_) e dar grandes pitacos na obra de arte que aos poucos tomava formava.

## Prototipação no Figma

A**ntes do desenvolvimento, é necessário muito (e muito) desenho.** Nossas grandes artistas de Comunicação, [Fernanda](http://github.com/fernandascovino) e [Nayara](https://www.linkedin.com/in/nayaramoraesdacosta/), passaram dias e semanas pensando, rascunhando e redesenhando muitas versões possíveis do site. Para isso, utilizamos nosso querido Figma. O Figma é um programa gratuito que possibilita criar protótipos estáticos ou interativos de forma colaborativa, e até mesmo [exportar designs em HTML e CSS](https://www.figma.com/community/plugin/851183094275736358/Figma-to-HTML).

1. **Definir páginas e elementos prioritários**: Começamos pela **Home**, página de **Busca** (com filtros) e de **Conjuntos.** Com base nas entrevistas, decidimos centralizar na página de **Conjuntos** todas as informações de [tabelas tratadas no _datalake_ e outros recursos](https://basedosdados.github.io/mais/) — diminuindo o número de cliques para chegar na informação que você realmente precisa.
2. **Buscar referências de design e conteúdo**: Prints de sites como [Kaggle](https://www.kaggle.com/), [NSW](https://www.nsw.gov.au/) e [World Bank Data](https://data.worldbank.org/) aos poucos foram enchendo nosso mural.

<Image src="/blog/um-site-feito-a-varias-maos/image_6.png" caption="Mural de ideias, desenhos e referências no figma."/>

3. **Idear e rascunhar versões**: Primeiro no papel, de forma mais abstrata, depois no Figma com a criação de elementos, designs e organização de **seções** (grupos de elementos) que faziam a composição de cada página. A cada semana apresentávamos os avanços das versões do design, mantendo os desenhos anteriores numa mesma tela para comparação.

> **A versão final do design nunca é o mesmo que o site** — muitas mudanças ocorrem após iniciar a implementação do site, direto no código HTML/CSS.

<Image src="/blog/um-site-feito-a-varias-maos/image_7.png" caption="Diferentes versões de designs para comparação"/>

## Escolha do Next.js

Conforme avançamos nos designs, o Breno começou a desenvolver o novo site. O primeiro desafio foi escolher um _framework_ _web_ para trabalharmos. No cenário _front-end_, atualmente temos três grandes: **Angular, React e Vue.**

Para fazer essa escolha, foi priorizado o grau de **envolvimento e atividade da comunidade** de cada _framework._ Isso não é novidade no mundo do desenvolvimento — quanto maior e mais ativa a comunidade, melhor a resolução de bugs, manutenção e melhoria do código.

O vencedor foi o **React**. A comunidade é grande e extremamente ativa, os pacotes são bem mantidos e é o framework mais amado pelos(as) desenvolvedores(as) segundo o [_StackOverflow_](https://insights.stackoverflow.com/survey/2021). A partir da mesma pesquisa descartamos o **Angular** por ser o mais temido. O **Vue** passou por mudanças grandes nas novas versões, o que não nos dava muita segurança em encontrar uma comunidade tão ativa quanto a do React.

**Mas fomos além**. Como queríamos trabalhar com blog institucional e foco em SEO, e já com uma máquina virtual preparada, resolvemos escolher um _framework_ específico React: o [Next.JS](https://nextjs.org/).

O [Next.JS](https://nextjs.org/) é uma versão _server-side_ do React que adiciona diversas vantagens ao *framework —* dentre elas uma muito importante de **poder escolher páginas para serem compiladas apenas na subida do projeto, e não carregadas na hora do acesso.** Isso torna a experiência do usuário mais fluida, já que não precisamos carregar informações o tempo todo.

## **Desenvolvimento**

O site novo foi tomando forma numa versão de desenvolvimento (que chamamos de _staging_) onde poderia ser acessado para testes. Idealmente a cada semana tínhamos sempre novas partes do site, mesmo que incompletas, subidas em _staging_ a partir do nosso [Github](http://github.com/basedosdados/website) para validarmos visuais e funcionalidades esperadas.

Fizemos a gestão do código de desenvolvimento via Github de forma simples: todo novo commit na branch _develop_ acionava um trigger para subida das modificações em _staging._

## Entrevistas de usuário

**"Tá bonitão".** Esse comentário resume bastante o que escutamos nas entrevistas de validação do novo site. Para além do acesso aos dados, as pessoas descobriram e destacaram outras funções essenciais que conseguimos trazer a tona na nova interface:

- Tutoriais: “Faltava um acesso aos vídeos de vocês, agora já tem aqui, é ótimo.”

- Doações para a iniciativa: “Isso aqui também foi difícil de encontrar, eu dôo, eu não tinha achado no site. Acho isso essencial.”

- Documentação: "Tinha o código de vocês, mas agora tem a explicação"

- Newsletter: “Apesar de já acompanhar não sabia que tinha uma newsletter”

E descobrimos também alguns ajustes para serem consertados antes do lançamento — *acredita que quase lançamos sem o botão de acesso ao datalake?* **Por isso a importância de sempre testar com novos olhos!**

Ouvimos outros pontos de melhoria, como diferenciar [o que é uma tabela tratada e o que é um link externo](https://basedosdados.github.io/mais/) e informar a data de atualização de dados, que foram priorizados pela equipe nos _sprints_ após o lançamento.

## Lançamento e próximos passos

<Image src="/blog/um-site-feito-a-varias-maos/image_8.png"/>

13 de outubro de 2021, por coincidência a exatos 365 depois de subirmos o código que deu início ao _datalake_ BD+(se a gente tivesse combinado não acontecia!). Nos reunimos no final de domingo a noite (dia 12) para garantir que tudo sairia conforme o esperado. O horário era vital: **evitamos** **migrar durante um momento de alta utilização, pois iria quebrar o site e frustar diversos usuários.**

> **Virar a chave após uma grande mudança nunca é um processo fácil.**

Como mudamos totalmente o _back-end_ do site, ao invés de substituirmos o código original nos decidimos redirecionar a URL oficial para o conteúdo que estava em _staging — chamamos do momento da virada._ Foi crucial a presença de **pelo menos um membro de cada equipe no momento da virada.** Isso ajudou a aliviar a tensão de todos(as) e também permitiu que erros fossem consertados/revertidos rapidamente.

O toque final foi criar uma [**página de manutenção**](https://info.basedosdados.org/home) (landing no _Hubspot_, como a nossa página de [newsletter](https://info.basedosdados.org/assine-a-newsletter-da-base-dos-dados)), assim nossos usuários saberiam que estamos fazendo uma migração.

<Image src="/blog/um-site-feito-a-varias-maos/image_9.png"/>

## Ciclo contínuo de melhorias

**O lançamento do novo site foi um sucesso e agradecemos a todos os envolvidos no projeto.** Cada ideia, contribuição e tarefa foi uma peça muito importante desse incrível mosaico.

Mesmo com o site já no ar, seu processo de desenvolvimento está longe de chegar ao fim. Nossa equipe segue trabalhando em melhorias, explorando novas ideias e aprimorando continuamente a plataforma.

**Que tal ajudar também? 💚**

As reuniões sobre o site acontecem todas **terças-feiras, às 19h, no canal #website do** [**servidor da BD no Discord**](https://discord.com/invite/huKWpsVYx4). Nossos encontros são abertos e as opiniões, ideias e feedbacks de usuários são muito mais que bem-vindos.

**Temos vagas abertas para web develop!**

Queremos que o site seja uma excelente plataforma de consulta e discussão sobre dados. Estamos buscando alguém que compartilhe dessa visão e guie as decisões de Front-end/UI. **Inscreva-se** [**aqui**](https://info.basedosdados.org/vaga-dev-front-end-ui)**.**

_Um agradecimento final às diversas mãos que fizeram esse projeto possível:_

- Breno Gomes
- Caio dos Santos
- Diego Oliveira
- Fernanda Scovino
- Giovane Caruso
- João Carabetta
- Nayara Costa
- Ricardo Dahis
- Vinicius Aguiar

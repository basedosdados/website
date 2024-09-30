---
title: >-
  De Olho na Câmara: Conheça os dados que te ajudam a monitorar a Câmara dos
  Deputados
description: >-
  Aprenda como acessar e analisar dados sobre a atuação da Câmara, do contexto
  histórico à prática
date:
  created: '2024-06-03T17:33:29.243Z'
authors:
  - name: Base dos Dados
thumbnail: /blog/de-olho-na-camara-conheca-os-dados-que-te-ajudam-a-monitorar-a-camara-dos-deputados/image_0.png
categories: [analise]
medium_slug: >-
  https://medium.com/@basedosdados/de-olho-na-c%C3%A2mara-conhe%C3%A7a-os-dados-que-te-ajudam-a-monitorar-a-c%C3%A2mara-dos-deputados-1570cf740c43
---

<Image src="/blog/de-olho-na-camara-conheca-os-dados-que-te-ajudam-a-monitorar-a-camara-dos-deputados/image_0.png"/>

Os Dados Abertos da Câmara dos Deputados promovem o acesso direto às informações sobre a atividade legislativa e facilitam a fiscalização das ações dos deputados e da gestão dos recursos públicos. Porém, ainda existe um grande salto entre a disponibilização dos dados e a possibilidade de que cidadãos acompanhem o trabalho dos seus representantes. Afinal, trabalhar com dados não é algo tão trivial, especialmente quando falamos de grandes volumes de informações que são atualizadas com frequência, como é o caso dos dados da Câmara.

A Base dos Dados já deu um grande passo para tornar esses dados mais acessíveis, como você vai ver em detalhes neste artigo. Porém, um mergulho no contexto dos Dados Abertos pode facilitar ainda mais o trabalho de quem busca por um maior embasamento teórico e técnico na sua pesquisa, reportagem ou projeto.

É por isso que lançamos a campanha De Olho Na Câmara, que consiste em artigos, dicas, tutoriais e análises com os Dados Abertos da Câmara, sempre com o objetivo de trazer mais acessibilidade e praticidade à sua análise. Este é apenas o primeiro artigo da série, então não deixe de nos seguir nas redes sociais para ficar sempre por dentro das novidades da campanha.

## O que você vai ler?

Neste artigo, apresentamos um breve contexto histórico da política de governo aberto da Câmara dos Deputados, explicamos como esses dados estão disponíveis e como você pode usar a BD para acessar e analisar os dados de maneira mais prática e rápida. Organizamos também uma lista de referências e casos de uso que podem servir de inspiração e consulta. Veja os Tópicos:

* Contexto
* Como a Câmara disponibiliza os dados
* Por que acessar os dados da Câmara pela BD?
* Lista de referências e links úteis

## Contexto

A Câmara dos Deputados disponibiliza o serviço de Dados Abertos desde 2011 — e desde 2017 com o formato mais parecido com o atual. Contudo, tudo começou mesmo em 2006, com o Serviço de Integração Tecnológica (SIT Câmara). O portal sofreu alterações para se adequar melhor à Lei de Acesso à Informação e disponibilizar informações sem necessidade de cadastro prévio.

## E quais são as características dos Dados Abertos?

Os Dados Abertos seguem alguns princípios básicos de disponibilização de dados públicos, como completude, atualidade, acesso não discriminatório, acessibilidade, formatos não proprietários, dados estruturados, livre de licenças e disponibilidade no mesmo grau de detalhe da fonte. Muitos desses princípios são compatíveis e complementam a ideia de governo aberto ([Oliveira & Ckagnazaroff, 2022](https://www.researchgate.net/publication/362482737_Principios_de_governo_aberto_Uma_revisao_pela_perspectiva_historica)).

Contudo, quem pesquisa o portal de Dados Abertos já encontra o aviso: *serviços de dados abertos são feitos para máquinas e programas*. Por um lado isso é muito bom, pois facilita o processamento de dados em computadores, a transformação de dados segundo objetivos mais específicos de busca e fornecimento de ampla gama de possibilidades dado o grau de detalhamentos dos dados. Está [página](https://dadosabertos.camara.leg.br/howtouse/sobre-dados-abertos.html) explica bem isso..

Por outro lado, isso também acaba reproduzindo algumas desigualdades do mundo “real” no mundo virtual: nem todo mundo possui as ferramentas ou habilidades para explorar as possibilidades dos Dados Abertos.

*É aqui que entramos.*

A ideia mais moderna de “governo aberto” — que tem o acesso às informações públicas como princípio, surge no século XX (mesmo que na Suécia a primeira lei de acesso à informação seja de 1766 — sempre a Suécia). Entre os anos 1950 e 1970 começam a surgir reivindicações da sociedade pelo acesso à informação. Um exemplo é o Movimento pela Liberdade de Informação nos EUA, que culminou no famoso Freedom of Information Act (FOIA), de 1966.

Mas algumas das iniciativas mais concretas surgiram apenas no século XXI. A partir dos anos 2000 cada vez mais países se envolveram em discussões sobre governo aberto. Muito ainda estava por ser feito nesta época, como a construção de estruturas legais, institucionais e políticas que dessem respaldo ao acesso à informação pública e à participação cidadã na elaboração de políticas públicas. Alguns exemplos são o International Roundtable on Building Open Government da OCDE (2002), o Open Government Initiative dos EUA (2009) e o Government 2.0 da Austrália (2009). Já o Brasil foi um dos signatários da Open Government Partnership (OGP, de 2010), ideia que surgiu na 65ª Assembleia Geral da ONU ([Oliveira & Ckagnazaroff, 2022](https://www.researchgate.net/publication/362482737_Principios_de_governo_aberto_Uma_revisao_pela_perspectiva_historica)).

Essas parcerias e iniciativas foram importantes por dar um rumo mais concreto ao que deveria ser feito para assegurar um “governo aberto”. Entre elas, formas de utilizar as tecnologias de informação e comunicação a favor da transparência e da participação pública.

Internamente, esse também foi um período bastante ativo. Vários órgãos do setor público brasileiro engataram iniciativas de consulta a especialistas, pesquisadores e organizações da sociedade civil em busca de alternativas de transparência e acesso à informação.

Com a Lei de Acesso à Informação (2011) veio, por exemplo, a Parceria para Governo Aberto (PGA), a criação da Infraestrutura Nacional de Dados Abertos (Inda) e a realização de diversos hackathons ([fonte](https://www.blog.inteligov.com.br/tecnologia-dadosabertos)). A Câmara dos Deputados foi bastante ativa em diversos desses momentos.

*Contudo, mesmo com todos esses avanços, é importante destacar uma parte importante do processo de governo aberto: você. A participação cidadã ativa nesses processos acaba exigindo letramento em dados quando a produção e acesso a dados aumenta exponencialmente com o desenvolvimento tecnológico. Então precisamos colocar a mão na massa.*

## Como a Câmara disponibiliza esses dados?

Por meio de link para download direto pelo site, em diversos formatos (como csv, JSON, xlsx e xlm, além de ods em alguns casos) ou por API (*application programming interface* ou interface de programação de aplicação). A maior parte das tabelas disponibilizadas possuem atualização diária ou mensal, além de vários anos de cobertura. O conteúdo cobre dados sobre despesas parlamentares, proposições, frentes e grupos parlamentares, legislaturas, órgãos, informações sobre os deputados e funcionários lotados na Câmara, eventos, votações, licitações e o Tesauro da Câmara dos Deputados.

Vamos tomar como exemplo os dados de proposições. Nela podemos encontrar registro das proposições apresentadas à Câmara por ano, tema, autoria, situação etc. Vale a pena checar a documentação para mais detalhes nessa parte. Cada proposição tem um identificador universal, e este identificador está presente em diversas tabelas, não só aquelas que dizem respeito à seção de proposições especificamente. Dá para encontrar informações sobre as proposições na tabela de requerimentos de realização de eventos, de proposição objeto de cada votação e de proposições afetadas por votação, por exemplo.

Então se você tiver interesse em saber tudo sobre proposições mas não sabe muito bem como baixar dados por meio de API, o montante de trabalho fica imenso. E mesmo para quem já trabalha com esses processos, automatizar o processo de captura para sempre ter os dados mais atualizados também pode ser um desafio. Desafio que pode ser impeditivo no empreendimento de monitoramento parlamentar. É o que o aviso no portal dos Dados Abertos quer dizer. Máquinas conseguem processar muito bem os dados que Câmara disponibiliza de forma estruturada e bem organizada.

O próprio portal de Dados Abertos da Câmara catalogou alguns casos de usos e projetos da comunidade. Você pode conferir por [aqui](https://dadosabertos.camara.leg.br/community/blogger.html).

Um ótimo caso de uso para os dados de despesas dos parlamentares da Câmara, por exemplo, é a reportagem especial de Pedro Nakamura para o portal Núcleo Jornalismo. Em sua apuração, Pedro analisou os dados brutos para identificar como [deputados gastaram R$ 1,9 milhão em divulgações nas redes sociais](https://nucleo.jor.br/especiais/2024-04-23-deputados-camara-gastos-redes-sociais/).

Pedro explica que seu “processo de análise envolveu pegar os .csv ano a ano e usar tabelas dinâmicas para filtrar os dados que eu precisava. Com os dados que achava mais importantes em mão, criava uma grande tabela para usar como referência na reportagem.”

Apesar do acesso aos dados brutos facilitar, e muito, o processo de análise e extração de insights, hoje existe uma maneira ainda mais prática para acessar esse grande volume de dados sem precisar baixar ou até organizar eles.

## Por que acessar os dados da Câmara pela BD?

A Base dos Dados disponibiliza um datalake público com os principais indicadores brasileiros. Isso permite que você acesse, explore e cruze os dados pelo próprio Google Cloud. Uma vez no nosso *datalake*, onde os dados já estão tratados, padronizados e atualizados, tudo o que precisamos fazer é interagir com eles via SQL ou por *download* diretamente no site da BD. Via SQL — e aí dá para usar a linguagem de consulta mesmo dentro do R, Python ou Stata –, muitas portas se abrem, como a conexão com as demais tabelas do conjunto dos Dados Abertos da Câmara e outras do *datalake*, quando a conexão fizer sentido.

Estamos preparando um tutorial completo para demonstrar como é o processo de tratamento dos dados pela BD e como você pode usar nosso datalake para cruzar essas informações com outras indicadores importantes, mas você já pode conferir abaixo um exemplo da praticidade que isso proporciona.

Apenas com uma conta Google e um projeto criado no BigQuery, você pode consultar o histórico de despesas para um(a) deputado(a) desde o início da sua atual legislatura até agora. O campo valor\_liquido representa o valor da despesa efetivamente debitada da Cota Parlamentar e você pode utilizar a consulta SQL abaixo para acessar todo o histórico.

```sql
SELECT
  id_deputado,
  categoria_despesa,
  data_emissao,
  valor_liquido,
  nome_passageiro,
  valor_restituicao
FROM
  `basedosdados.br_camara_dados_abertos.despesa`
WHERE
  nome_parlamentar = "Nome da(o) Deputada(o)"
  AND ano_legislatura = 2023 #soma das despesas desde o início da atual legislatura até agora
ORDER BY
  data_emissao ASC;
```

A consulta irá retornar uma tabela já com os dados do recorte desejado.

<Image src="/blog/de-olho-na-camara-conheca-os-dados-que-te-ajudam-a-monitorar-a-camara-dos-deputados/image_1.png"/>

Você pode exportar os resultados em um arquivo local (.csv, JASON ou para a área de transferência do seu computador) para explorar com com seu editor de planilha ou linguagem de programação preferida, ou ainda salvá-los em uma tabela do BigQuery ou Google Sheets, sem precisar fazer download da tabela.

<Image src="/blog/de-olho-na-camara-conheca-os-dados-que-te-ajudam-a-monitorar-a-camara-dos-deputados/image_2.png"/>

Se você tem algum conhecimento de SQL, pode ainda utilizar o datalake para criar agrupamentos e operações básicas nos dados. Uma consulta que agrupe os dados por categoria de despesa, por exemplo, pode te ajudar a ter uma noção das prioridades do(a) parlamentar em questão. Com a consulta abaixo, basta substituir o nome do(a) parlamentar para acessar esse recorte específico.

```sql
SELECT
  categoria_despesa,
  ROUND(SUM(valor_liquido),0) AS despesas,
FROM
  `basedosdados.br_camara_dados_abertos.despesa`
WHERE
  nome_parlamentar = "Nome da(o) Deputada(o)"
  AND ano_legislatura = 2023 #soma das despesas desde o início da atual legislatura até agora
GROUP BY
  categoria_despesa
ORDER BY
  despesas DESC;
```

Veja o resultado da consulta anterior. Para este exemplo, utilizamos o nome de um deputado escolhido aleatoriamente. Note que a categoria “Divulgação da Atividade Parlamentar” concentra o maior valor das despesas da Cota Parlamentar do deputado em questão.

<Image src="/blog/de-olho-na-camara-conheca-os-dados-que-te-ajudam-a-monitorar-a-camara-dos-deputados/image_3.png"/>

Esse é apenas um simples exemplo de aplicação dos dados em nosso datalake público. Vem aí um tutorial completo sobre como estão organizados os dados na BD, como as diferentes tabelas deste conjunto se relacionam, quais informações são possíveis extrair dos dados e como.

## Lista de referências

Organizamos aqui uma lista com links que podem ser úteis para sua pesquisa e análise. Aproveite para salvar esse artigo para ter sempre a lista em mãos.

Já fez uma análise com os dados da BD? Conte para nós nos comentários eu envie para `giovanecaruso@basedosdados.org`. Para nós é muito importante conhecer e compartilhar o seu traballho.

**Acesso aos dados**

* Dados Abertos da Câmara dos Deputados na Base dos Dados ([link](https://basedosdados.org/dataset/3d388daa-2d20-49eb-8f55-6c561bef26b6))
* Portal dos Dados Abertos da Câmara dos Deputados ([link](https://dadosabertos.camara.leg.br/))
* Link para o as consultas utilizadas no texto ([link](https://t.co/V9MF2togi9))

**Tutoriais e informações sobre os dados**

* Documentação da Base dos Dados ([link](https://basedosdados.github.io/mais/))
* Manual de Estilo da Base dos Dados ([link](https://basedosdados.github.io/mais/style_data/))
* Tutorial de SQL da Base dos Dados ([link](https://www.youtube.com/watch?v=fMo54j1GL6U\&list=PLu5pyM8QY6hh283MYmLUnV2Fgs7NNC7Ww\&index=2))
* Tutoriais do Portal da Câmara dos Deputados ([link](https://dadosabertos.camara.leg.br/howtouse/central-tutoriais.html))
* Perguntas Frequêntes do Portal da Câmara dos Deputados ([link](https://www2.camara.leg.br/transparencia/dados-abertos/perguntas-e-respostas))
* Download e informações sobre as variáveis dos dados ([link](https://dadosabertos.camara.leg.br/swagger/api.html#staticfile))

**Projetos e Casos de Uso**

* Índice Legisla Brasil ([link](https://indice.legislabrasil.org/sobre-o-projeto))
* Análise e Predição nas Votações de Leis Federais na Câmara dos Deputados — UFRPE ([link](https://repository.ufrpe.br/bitstream/123456789/3162/1/tcc_rannierydiasdebrito.pdf))
* Avaliando a política de Dados abertos no Legislativo brasileiro — revista compolítica ([link](https://www.researchgate.net/publication/341744388_Avaliando_a_politica_de_Dados_abertos_no_Legislativo_brasileiro))
* Interface Visual Interativa para Dados Abertos sobre Proposições na Câmara de Deputados — UFRGS ([link](https://lume.ufrgs.br/bitstream/handle/10183/223627/001127313.pdf?sequence=1))
* Congresso em números: a produção legislativa do Brasil de 1988 a 2017 ([link](https://repositorio.fgv.br/items/b2f91e64-42fa-4909-8401-ca41b084fa22))
* Congresso em números 2018: Relatório de Atividades do Congresso Nacional — FGV ([link](https://repositorio.fgv.br/items/e4171b9e-5419-43e6-8a70-fb93d5f11c4e))

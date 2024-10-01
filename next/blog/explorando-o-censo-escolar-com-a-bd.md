---
title: Explorando o Censo Escolar com a BD+
description: >-
  Uma maneira prática de analisar a mais importante pesquisa estatística
  educacional do Brasil
date:
  created: "2021-06-04"
authors:
  - name: Matheus Valentim
    role: Equipe da Base dos Dados 💚
    social: https://github.com/mavalentim
thumbnail: /blog/explorando-o-censo-escolar-com-a-bd/image_0.jpg
categories: [analise]
medium_slug: https://medium.com/@basedosdados/explorando-o-censo-escolar-com-a-bd-6577d7251ea1
---

<Image src="/blog/explorando-o-censo-escolar-com-a-bd/image_0.jpg"/>

## TL;DR

Nesse texto, vamos dissecar o conjunto de dados do **Censo Escolar,** já disponível, tratado e pronto para a análise na BD+. Primeiro, vamos introduzir as **quatro** diferentes tabelas da base, apresentando algumas de suas variáveis. Depois, vamos mostrar alguns pontos de contato interessantes com outras tabelas disponíveis em nosso datalake público e perguntas que podem surgir dessas interações. Acesse essa base por [aqui](/dataset/dae21af4-4b6a-42f4-b94a-4c2061ea9de5?table=cf9586ad-a168-40c1-97f9-86083ba4409f).

## O Censo e suas dificuldades

O Censo Escolar é uma pesquisa **anual**, onde cada escola do país responde a diversas perguntas sobre a própria escola, as turmas, os professores e os alunos que ali frequentam. O Censo tem microdados desde 1995 e, em 2007, assumiu um novo formato digital. Há indícios de que a pesquisa ocorre desde a década de 30. Aqui na Base dos Dados, optamos por disponibilizar, inicialmente, valores **desde 2009 até 2020**. O período é o mais uniforme da pesquisa e foi quando ela manteve o mesmo formato, o que facilita e corrobora com a compatibilização entre diferentes anos.

A disponibilização dos dados do Censo, assim como de outras bases de educação, vêm do [Plano Inep Dados Abertos](http://inep.gov.br/dados). Porém, utilizar as bases originais do Censo tem vários obstáculos:

- Você precisa baixar **cada ano individualmente** em um arquivo compactado, cada um com aproximadamente **10gb**
- Cada base tem seu próprio conjunto de variáveis e você terá que consultar os vários dicionários, já que uma **mesma** variável recebe **vários nomes diferentes** ao longo do período.
- Os dicionários **não** são muito claros sobre a constância das variáveis: em muitos casos **é necessário abrir a base para verificar a existência** de uma dada variável.
- O período de 2009 até 2020 soma mais de 100gb se for aberto inteiro no seu computador.

Ao invés de enfrentar tudo isso, você pode usar nossa versão já limpa e harmonizada, baixando via BigQuery ou abrindo as tabelas [direto no R](/blog/como-acessar-dados-publicos-em-r) ou [no Python](/blog/intro-ao-pacote-basedosdados-em-python).

## Explorando o Censo Escolar com a BD+

Com as suas 4 tabelas, o nosso dataset do Censo Escolar replica a arquitetura da base original, disponibilizando diferentes tabelas para diferentes níveis de agregação. Temos uma base a nível de **escola**, uma a nível de **turma**, e duas no nível individual: uma para **docentes** e outra para os **alunos**.

É importante ressaltar que **todas** as tabelas do dataset, além de terem identificação de suas observações, **identificam sempre a escola** a qual pertencem, sempre tendo a variável `id_escola`. Optamos por deixar essas variáveis para manter o paralelismo da base original e para que possíveis agregações e junções de tabelas fossem mais fáceis.

Além disso, cabe reforçar que não disponibilizamos todas as variáveis que aparecem no Censo. Selecionamos a maioria das variáveis, as que aparecem mais vezes. Pegamos as variáveis que aparecem 8 ou mais vezes ao longo dos 12 anos, além de outras variáveis que julgamos serem cruciais por serem identificadoras importantes. Isso significa que, se a variável só aparece em 2 anos, por exemplo, ela não foi incluída nas nossas tabelas.

## A tabela `escola`

A tabela `escola` tem a granularidade de cada escola por cada ano. A identificação básica de cada unidade é feita pelas variáveis `id_escola` e `ano`.

Na tabela, temos **três** grandes grupos de variáveis: variáveis com **características gerais** da escola, variáveis que qualificam a **infraestrutura** de cada instituição e variáveis que identificam quais **tipos de aulas ocorrem**.

Entre as características gerais, temos a **rede** a qual a escola está vinculada, o **tipo de localização** da escola, a **dependência administrativa** mantida com o poder público, a **instituição mantenedora** da escola e o seu **local de funcionamento**.

Nas variáveis de infraestrutura, temos uma ampla caracterização do **acesso** de cada instituição a serviços básicos, como **água**, **energia** e **coleta**/**tratamento de lixo e esgoto**. A infraestrutura de ensino também é avaliada: temos variáveis que medem a **quantidade de equipamentos**, desde equipamentos de som ou DVD até computadores e conexão com a internet, além das variáveis que informam o **número de salas**, de **banheiros**, de **quadras**, de **laboratórios**, **áreas verdes** e até de **berçários**.

Por fim, nas variáveis que identificam o ensino, temos em sua maioria variáveis binárias que identificam se a escola tem aulas para **ensino regular**, para **EJA**, em formato EaD, entre outras.

Com uma única entrada no R usando a biblioteca basedosdados, podemos descobrir, por exemplo, quais escolas não têm água potável em Minas Gerais no ano de 2020:

```r
basedosdados::read_sql('
SELECT
  ano,
  id_escola,
  agua_potavel
FROM
  `basedosdados-dev.br_inep_censo_escolar.escola`
WHERE
  agua_potavel = 0
  AND ano = 2020
  AND sigla_uf = "MG"
')
```

Ou quais escolas funcionavam em unidades prisionais em 2009:

```python
import basedosdados as bd

bd.read_sql(
    query="""
SELECT
  *
FROM
  `basedosdados.br_inep_censo_escolar.turma`
WHERE
  ano = 2010
  AND sigla_uf = 'BA'
""",
    billing_project_id="bd_projeto",
)
```

## A tabela `turma`

A tabela turma tem a granularidade de **cada turma** por **cada ano**, isto é, cada observação é identificada por seu `id_turma`e pelo seu `ano`.

Na tabela, encontramos principalmente variáveis relacionadas a **quais dias** a turma tem aulas e **de quais disciplinas** são essas aulas. Em cada um dos casos, tem-se variáveis binárias identificando cada dia da semana e cada matéria.

Temos também variáveis que identificam **atividades extracurriculares** e **quando elas são feitas por cada turma**, além das já mencionadas identificações da escola a qual a turma está inserida.

Se quisermos abrir as turmas de 2010 para o estado da Bahia por exemplo, no [Python](https://dev.to/basedosdados/base-dos-dados-python-101-44lc):

```python
bd.read_sql(
  query = "SELECT * FROM `basedosdados.br_inep_censo_escolar.turma` WHERE ano = 2010 and sigla_uf = 'BA'",
  billing_project_id = "bd_projeto"
)
```

## A tabela `docente`

A tabela `docente` tem a granularidade a nível dos profissionais escolares em sala de aula: professores, auxiliares, tradutores/intérpretes entre outros que atuam pedagogicamente na escola. Cada linha da tabela corresponde a **um profissional, por cada ano**. Cada um desses profissionais é identificado com um `id_docente`.

Na tabela temos as mais diversas características de cada docente, representadas por mais de 80 variáveis. Tem-se características **pessoais** de cada docente, como sua **raça/cor**, seu **sexo**, sua **idade**, sua **nacionalidade** e até o **município de nascimento** e o **município onde o docente reside**. Também temos variáveis que identificam a **formação** do docente, desde as **disciplinas** pelo qual ele é responsável, até a sua **formação específica** como professor.

Se quisermos só os docentes pretos da cidade de Rio Branco por exemplo, poderíamos rodar em Python:

```python
bd.read_sql(
    query = "SELECT * FROM `basedosdados.br_inep_censo_escolar.docente` WHERE id_municipio = '1200401' and raca_cor = '2'",
    billing_project_id = "bd_projeto"
)
```

## A tabela `matricula`

Sem dúvida uma das maiores tabelas de todo nosso datalake, a tabela `matricula` identifica cada aluno brasileiro através da `id_aluno`. As observações estão no nível de cada **aluno** e de cada **ano**.

Entre as variáveis, temos as que caracterizam dados pessoais de cada aluno, paralelo ao feito com cada docente: temos `sexo`, `cor_raca`, `id_municipio_nascimento`, `id_municipio_endereco`, que, assim como na tabela de docentes, identificam sexo, cor/raça e o município onde nasceu e onde reside o aluno. Temos também variáveis que caracterizam deficiências dos alunos, físicas e intelectuais.

Para além desses casos, temos também um conjunto de dados que identificam relações do aluno com a escola: variáveis que identificam **como os alunos se deslocam até a escola** e variáveis que identificam **como os alunos ingressaram na instituição**.

A tabela `matricula`, especificamente, é muito grande (chega a mais de 90gb), por isso **não recomendamos** tentar baixá-la ou utilizá-la **inteira**: a tabela é particionada por **ano** e por **uf** de maneira que, ao filtrar por essas variáveis, o resultado é obtido mais rápido e o gasto é bem menor.

Como exemplo, podemos recortá-la para pegar somente os estudantes que vão à escola de transporte público em 2019, no estado de Roraima. No R, ficaria assim:

```r
basedosdados::read_sql("
SELECT
  *
FROM
  `basedosdados.br_inep_censo_escolar.matricula`
WHERE
  sigla_uf = 'RR'
  AND transporte_publico = 1
  AND ano = 2019
")
```

## Pontos de contato com outras bases

O censo escolar por si só já disponibiliza uma grande variedade de variáveis. Caso você queira obter ainda mais, com a [BD+](https://basedosdados.github.io/mais/access_data_bq/) é fácil: como as bases têm os mesmos nomes de variável, podemos rapidamente juntar diferentes informações. A seguir separamos algumas bases já disponíveis na BD+ que podem complementar bem as tabelas do Censo Escolar:

[Os indicadores escolares do INEP](/dataset/63f1218f-c446-4835-b746-f109a338e3a1?table=cd65b1d2-45e8-432b-afe8-c3a706addbe8): O dataset `br_inep_indicadores_educacionais` apresenta uma série de medições sobre a qualidade de ensino, em diferentes níveis de agregação. Usando a tabela `escola` como ponte, podemos juntar **média de alunos por turma da escola** (proveniente dessa tabela) com **número de computadores da escola** (vindo do Censo) e **construir um mais amplo cenário socioeconômico da escola**.

[As notas do IDEB](/dataset/96eab476-5d30-459b-82be-f888d4d0d6b9?table=bc84dea9-1126-4423-86d2-8835e6b19a72): O dataset `br_inep_ideb`nos disponibiliza tabelas de diferentes que identificam as notas dos alunos em avaliações da qualidade do ensino (as provas do SAEB), as taxas de rendimento (aprovação, reprovação, abandono) e o desempenho no IDEB. Junto com as tabelas do Censo, pode-se avaliar, por exemplo, **como escolas com mais professores com mestrado vão nessas provas em relação a escolas com professores que não tem pós graduação**.

[Diferentes tabelas da SEDUC](/dataset/?q=seduc): As tabelas da SEDUC disponibilizam informações sobre o nível educacional e socioeconômico das escolas estaduais de São Paulo. Com elas somadas ao censo, pode se avaliar por exemplo **se escolas com melhor infraestrutura tem maior evasão no ensino médio.**

As tabelas do Censo também tem identificação do município de cada uma das escolas, das turmas, dos docentes e dos alunos, permitindo vinculá-las com quase todas as tabelas a nível de município disponível no nosso datalake.

Chegamos ao fim da nossa breve apresentação! Os dados da mais importante pesquisa estatística educacional brasileira, o Censo Escolar (e todas suas nuances) agora fazem parte da [Base dos Dados](/)!

Texto produzido por [Matheus](https://github.com/mavalentim) da equipe de Dados, com enorme apoio do pesquisador Adriano Senkevics, um dos especialistas em educação da nossa comunidade 💚

---
title: 'Diretórios Brasileiros: Como essa base facilita sua análise'
description: >-
  Conheça essa base que funciona como um perfil completo de unidades como
  município, escola, UF, e mais.
date:
  created: '2021-08-16'
authors:
  - name: Crislane Alves
    role: Equipe Base dos Dados
    social: https://medium.com/@s.alvescrislane
thumbnail: /blog/diretorios-brasileiros-como-essa-base-facilita-sua-analise/image_0.jpg
categories: [tutorial]
medium_slug: >-
  https://medium.com/@basedosdados/diret%C3%B3rios-brasileiros-como-essa-base-facilita-sua-an%C3%A1lise-40dc8ce2ca2
---

Conheça essa base que funciona como um perfil completo de unidades como município, escola, UF, e mais.

<Image src="/blog/diretorios-brasileiros-como-essa-base-facilita-sua-analise/image_0.jpg"/>

## TL;DR

Neste artigo vamos apresentar nossa base de [Diretórios Brasileiros](https://basedosdados.org/dataset/33b49786-fb5f-496f-bb7c-9811c985af8e?table=0a2d8187-f936-437d-89db-b4eb3a7e1735), que está disponível no nosso datalake público (a BD+), onde disponibilizamos diversas bases de dados públicas já tratadas, organizadas e integradas para análise. Também vamos demonstrar como essa base facilita o cruzamento entre tabelas de diferentes conjuntos de dados e como você pode aplicá-la em sua análise, com um exemplo prático de aplicação.

## A Base de Diretórios Brasileiros

Essa base é uma referência de centralização de informações de unidades básicas para análises e funciona como um perfil completo de entidades como município, escola, UF, setores censitários e mais. São tabelas que ligam diversos códigos institucionais e informações de diferentes entidades brasileiras.

Isso é importante porque resolve o problema de não existir um identificador único para municípios entre as instituições brasileiras, resolve a mudança de IDs e nomes com typos entre anos e instituições, além de IDs novos de municípios que são criados ao longo do tempo.

Por exemplo, para municípios, essa base liga conjuntos de organizações como IBGE, Receita Federal, Tribunal Superior Eleitoral (TSE), Banco Central do Brasil, comarcas, região de saúde, etc.

Cada tabela dessa base representa uma entidade do nosso datalake público, como `UF`, `municipio`, `escola`, `distrito`, `setor_censitario`, categorias `CID-10` e `CID-9`, `CBO-2002` e `CBO-1992`, dentre outras.

Os diretórios criam naturalmente relações entre as diferentes entidades. Por exemplo, a tabela município possui uma coluna `sigla_uf`, ou seja, nela identificamos a qual `UF` o município pertence. O mesmo vale para `escola`, podemos identificar em qual município determinada escola está localizada.

Para exemplificar como a base de Diretórios Brasileiros facilita o cruzamento de diferentes conjuntos, preparamos os seguintes exemplos de aplicações que demonstram como você pode lançar mão dessa ferramenta em suas análises, apenas com uma query de SQL no BigQuery.

## Exemplo de aplicação

### Indicadores de Mobilidade e Transportes

No primeiro exemplo, cruzamos a tabela `municipio` da base de Diretórios Brasileiros com a tabela `tempo_deslocamento_casa_trabalho`, da base de [Indicadores de Mobilidade e Transporte](https://basedosdados.org/dataset/e3edf621-c491-4d74-a03a-15a759f6e638?table=01114371-3b1b-4574-a3ea-3d7d2125b4f2) da [Mobilidados](https://mobilidados.org.br/), que contém dados sobre tempo médio de deslocamento casa-trabalho, assim como de percentual de pessoas que gastam mais de uma hora neste deslocamento no ano de 2010.

Para isso, usamos como chave primária a coluna `id_municipio`. O objetivo é adicionar as colunas **regiao** e **municipio** no novo conjunto de dados. Assim, além de saber o nome dos municípios, também é possível fazer o agrupamento por cidade, grande região ou por estado e ver qual destes têm o tempo médio de deslocamento maior ou menor.

Confira abaixo a Query utilizada:

```sql
SELECT
  t1.ano,
  t2.nome_uf AS estado,
  t2.nome AS municipio,
  t1.tempo_medio_deslocamento
FROM
  `basedosdados.br_mobilidados_indicadores.tempo_deslocamento_casa_trabalho` AS t1
JOIN
  `basedosdados.br_bd_diretorios_brasil.municipio` AS t2
ON
  t1.id_municipio = t2.id_municipio
```

### Dados de importações e exportações brasileiras

No segundo exemplo, usamos a tabela `pais` da base de Diretórios, com a tabela `municipio_importacao` da base [Comex Stat](https://basedosdados.org/dataset/74827951-3f2c-4f9f-b3d0-56e3aa7aeb39?table=f4b08023-5530-4dc9-bced-3321e8928fd7), que contém dados detalhados das exportações e importações brasileiras, extraídas do [SISCOMEX](http://www.siscomex.gov.br/). Esta tabela específica aborda dados de importação, detalhados por município e empresa importadora.

Neste exemplo, usamos como chave primária a coluna `id_pais` para extrair da base de Diretórios o **nome** do país.
Ao rodar query, teremos como resultado, além do **ID do País** e **Valor da Importação**, o **nome do país**, ou seja, os destinos das importações do Brasil no ano de 2020.

Você pode utilizar a query abaixo para acessar o destino das importações do Brasil no ano de 2020:

```sql
SELECT
  t1.ano,
  t1.sigla_uf,
  t2.nome AS pais,
  SUM(valor_fob_dolar) AS importacao
FROM
  `basedosdados.br_me_comex_stat.municipio_importacao` AS t1
JOIN
  `basedosdados-dev.br_bd_diretorios_brasil.pais` AS t2
ON
  t1.id_pais = t2.id_pais
WHERE
  ano = 2020
GROUP BY
  1,
  2,
  3
ORDER BY
  3 DESC
```

Acesse a base de Diretórios Brasileiros por [aqui](https://basedosdados.org/dataset/33b49786-fb5f-496f-bb7c-9811c985af8e?table=0a2d8187-f936-437d-89db-b4eb3a7e1735).

Vale lembrar que o cruzamento entre bases não é realizável apenas porque a base de Diretórios funciona como uma espécie de dicionário. Além deste fator, existe o **padrão de qualidade da Base dos Dados**, ou seja, nós compatibilizamos todos os dados para que possam ser cruzados entre tabelas. A limpeza das bases disponíveis em nosso datalake público envolve um rigoroso processo de padronização e compatibilização de dados.

Ficou com alguma dúvida sobre nossa base de Diretórios Brasileiros, ou como aplicá-la? Deixe seu comentário ou procure algum de nossos assistentes de dados no canal *#dados* em nossa [comunidade do Discord](https://discord.com/invite/huKWpsVYx4).

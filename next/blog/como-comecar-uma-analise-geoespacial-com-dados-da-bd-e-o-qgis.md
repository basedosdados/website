---
title: Como começar uma análise geoespacial com dados da BD e o QGIS
description: Aprenda a importar dados da BD no QGIS para criar mapas e visualizações
date:
  created: "2022-10-07"
authors:
  - name: Gustavo Alcântara
    social: https://github.com/gustavoalcantara
    role: Autor
  - name: Giovane Caruso
    social: https://medium.com/@giovanecaruso
    role: Edição
thumbnail: /blog/como-comecar-uma-analise-geoespacial-com-dados-da-bd-e-o-qgis/image_0.png
categories: [tutorial]
medium_slug: https://medium.com/@basedosdados/como-come%C3%A7ar-uma-an%C3%A1lise-geoespacial-com-dados-da-bd-e-o-qgis-4792877950e0
---

<Image src="/blog/como-comecar-uma-analise-geoespacial-com-dados-da-bd-e-o-qgis/image_0.png" caption="Mapa com quantidade de cabeças de gado por UF no Brasil"/>

## TL;DR

Neste artigo, vamos apresentar como você pode usar os dados do pacote geobr, já tratados e disponíveis no _datalake_ público da Base dos Dados, e um Sistema de Informação Geográfica (SIG) para construir análises geoespaciais com mais praticidade. Acompanhe o passo a passo com um exemplo prático analisando quantas cabeças de gado existiam em cada estado brasileiro no ano de 2017.

## O que são os dados do geobr?

O `geobr` é um pacote R que permite o fácil acesso aos shapefiles do Instituto Brasileiro de Geografia e Estatística (IBGE) e outros dados espaciais do Brasil. Já tratado e disponível na BD, esse conjunto possibilita análises com diferentes níveis de observação, como biomas, escolas, microrregião, polígono do setor censitário e muito mais!

Foi com dados do geobr que elaboramos, por exemplo, a análise dos resultados geolocalizados da prova de matemática do SAEB de 2019 no Ceará.

<Image src="/blog/como-comecar-uma-analise-geoespacial-com-dados-da-bd-e-o-qgis/image_1.png" caption="Proficiência média por escolar no Ceará"/>

Além de poder acessar esses dados em Python, R, Stata e pelo BigQuery usando SQL, é possível exportar essas informações em `.csv` e adicioná-las no seu Sistema de Informação Geográfica (SIG) favorito.

SIG é um conjunto de sistemas de softwares e hardwares que permitem visualizar e analisar dados geográficos para compreender relações, padrões e tendências. Existem diversos tipos de SIG diferentes. Nesse artigo utilizamos o [QGIS](https://qgis.org/pt_BR/site/about/index.html) por ser uma plataforma open source, colaborativa e gratuita para análise de dados geoespaciais.

## Como construir sua análise com dados do geobr e o QGIS

Para demonstrar como começar a construir sua própria análise, utilizamos os dados do [Censo Agropecuário](https://basedosdados.org/dataset/55a39c28-58f3-4804-827d-6eee5ed27b6b?table=5366d485-e7db-4367-911a-a6a0198dda13), a principal investigação estatística e territorial sobre a produção agropecuária do país, também tratados e padronizados na BD.

O processo é simples: para entender, por exemplo, quantas cabeças de gado existiam em cada estado brasileiro no ano de 2017, podemos usar a consulta abaixo no BigQuery e baixá-los em um arquivo `.csv`.

```sql
SELECT censo.sigla_uf, sum(quantidade_bovinos_total) as gado, geometria
FROM basedosdados.br_ibge_censo_agropecuario.municipio AS censo
JOIN basedosdados.br_geobr_mapas.uf AS geo
ON censo.sigla_uf = geo.sigla_uf #join da variável sigla_uf
WHERE ano = 2017
GROUP BY censo.sigla_uf, geo.sigla_uf, geometria
```

A partir do resultado da consulta, é possível realizar o download do `.csv` no seu computador.

Agora, vamos inserir o arquivo `.csv` com a geometria espacial no QGIS. Clique em `Adicionar Camada` e depois `Adicionar Camada de Texto Delimitado`.

<Image src="/blog/como-comecar-uma-analise-geoespacial-com-dados-da-bd-e-o-qgis/image_2.png" caption="Adicionar Camada e Adicionar Camada de Texto Delimitado no QGIS"/>

Com a tela `Gerenciador de Dados` aberta, procure seu arquivo `.csv` no local em que o salvou.

<Image src="/blog/como-comecar-uma-analise-geoespacial-com-dados-da-bd-e-o-qgis/image_3.png" caption="Gerenciador de Dados do QGIS"/>

Assim que inserir o arquivo `.csv`, é necessário que a **Definição da Geometria** esteja assinada para **Well Know Text** _(WKT)_. Depois, é só clicar em inserir a variável de geometria no `campo de geometria`.

<Image src="/blog/como-comecar-uma-analise-geoespacial-com-dados-da-bd-e-o-qgis/image_4.png" caption="Definição da Geometria"/>

A saída ou **Amostra de Dados** deverá conter o esquema da imagem acima. É possível visualizar que o campo geometria define o que cada linha representa. Como estamos trabalhando com multipolígonos, a latitude e longitude de cada multipolígono encontram-se nessa variável.

<Image src="/blog/como-comecar-uma-analise-geoespacial-com-dados-da-bd-e-o-qgis/image_5.png" caption="Amostra de Dados"/>

Após clicar em **adicionar**, é possível obter um mapa com a quantidade de cabeças de gado por UF no ano de 2017, como na imagem abaixo.

<Image src="/blog/como-comecar-uma-analise-geoespacial-com-dados-da-bd-e-o-qgis/image_6.png" caption="Mapa com quantidade de cabeças de gado por UF no Brasil. Fonte: IBGE. Censo Agropecuário, 2017."/>

Com o mapa em mãos, fica fácil identificar que o Mato Grosso é o estado com maior quantidade de cabeças de gado no Brasil, por exemplo. Você pode exportar o mapa em um arquivo ._png_ ou ._tif_ e partir para sua análise.

Vale lembrar que também é possível relacionar mais de uma base de dados com os arquivos de geometria espacial do geobr pela BD. Você pode fazer o mesmo processo para qualquer base com dados a nível de município, regiões e estabelecimentos de saúde, microrregiões, mesorregiões, escolas e muito mais.

Teve alguma dúvida sobre como usar os dados do geobr, ou qualquer outro conjunto da BD? Temos uma equipe preparada e pronta para te ajudar em nosso canal do Discord. Venha fazer parte!

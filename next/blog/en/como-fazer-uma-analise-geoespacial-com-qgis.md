---
title: How to start a geospatial analysis with Data Basis data and QGIS
description: Learn how to import Data Basis data into QGIS to build maps and visualisations
slug: geospatial-analysis-with-qgis
date:
  created: "2022-10-07"
authors:
  - name: Gustavo Alcântara
    social: https://github.com/gustavoalcantara
    role: Author
  - name: Giovane Caruso
    social: https://medium.com/@giovanecaruso
    role: Editing
thumbnail: /blog/como-fazer-uma-analise-geoespacial-com-qgis/image_0.png
categories: [tutorial]
medium_slug: https://medium.com/@basedosdados/como-come%C3%A7ar-uma-an%C3%A1lise-geoespacial-com-dados-da-bd-e-o-qgis-4792877950e0
published: true
---

<Image src="/blog/como-fazer-uma-analise-geoespacial-com-qgis/image_0.png" caption="Map of cattle numbers by state in Brazil"/>

## TL;DR

This article shows how to use the geobr package data, already processed and available in the public Data Basis *datalake*, together with a Geographic Information System (GIS) to build geospatial analyses more easily. Follow the steps through a worked example: how many cattle there were in each Brazilian state in 2017.

## What is geobr data?

`geobr` is an R package giving easy access to shapefiles from the Brazilian Institute of Geography and Statistics (IBGE) and other Brazilian spatial data. Already processed and available at Data Basis, it supports analysis at various observation levels: biomes, schools, micro-regions, census tract polygons and much more.

We used geobr data, for example, to build the analysis of geolocated results from the 2019 SAEB mathematics exam in Ceará.

<Image src="/blog/como-fazer-uma-analise-geoespacial-com-qgis/image_1.png" caption="Average proficiency by school in Ceará"/>

Besides reaching this data in Python, R and through BigQuery using SQL, you can export it as `.csv` and load it into your GIS of choice.

A GIS is a combination of software and hardware for visualising and analysing geographic data in order to understand relationships, patterns and trends. There are many of them. This article uses [QGIS](https://qgis.org/pt_BR/site/about/index.html), an open source, collaborative and free platform for geospatial analysis.

## Building your analysis with geobr data and QGIS

To show how to start building your own analysis, we use data from the [Agricultural Census](/dataset/55a39c28-58f3-4804-827d-6eee5ed27b6b?table=5366d485-e7db-4367-911a-a6a0198dda13), the main statistical and territorial survey of the country's agricultural production, also processed and standardised at Data Basis.

The process is simple. To find out how many cattle there were in each Brazilian state in 2017, run the query below in BigQuery and download the result as a `.csv`.

```sql
SELECT censo.sigla_uf, sum(quantidade_bovinos_total) as gado, geometria
FROM basedosdados.br_ibge_censo_agropecuario.municipio AS censo
JOIN basedosdados.br_geobr_mapas.uf AS geo
ON censo.sigla_uf = geo.sigla_uf #join da variável sigla_uf
WHERE ano = 2017
GROUP BY censo.sigla_uf, geo.sigla_uf, geometria
```
From the query result you can download the `.csv` to your computer.

Now load the `.csv` with the spatial geometry into QGIS. Click `Add Layer`, then `Add Delimited Text Layer`.

<Image src="/blog/como-fazer-uma-analise-geoespacial-com-qgis/image_2.png" caption="Add Layer and Add Delimited Text Layer in QGIS"/>

With the `Data Source Manager` open, find the `.csv` file where you saved it.

<Image src="/blog/como-fazer-uma-analise-geoespacial-com-qgis/image_3.png" caption="The QGIS Data Source Manager"/>

Once the `.csv` is loaded, the **Geometry Definition** must be set to **Well Known Text** *(WKT)*. Then set the geometry variable in the `geometry field`.

<Image src="/blog/como-fazer-uma-analise-geoespacial-com-qgis/image_4.png" caption="Geometry Definition"/>

The output, or **Sample Data**, should match the schema in the image above. Note how the geometry field defines what each row represents. Since we are working with multipolygons, the latitude and longitude of each multipolygon sit in that variable.

<Image src="/blog/como-fazer-uma-analise-geoespacial-com-qgis/image_5.png" caption="Sample Data"/>

After clicking **add**, you get a map of cattle numbers by state for 2017, as below.

<Image src="/blog/como-fazer-uma-analise-geoespacial-com-qgis/image_6.png" caption="Map of cattle numbers by state in Brazil. Source: IBGE, Agricultural Census, 2017."/>

With the map in front of you it is easy to see that Mato Grosso is the state with the most cattle in Brazil. You can export the map as a *.png* or *.tif* file and carry on with your analysis.

Worth remembering: you can also join more than one dataset to the geobr spatial geometry files through Data Basis. The same process works for any dataset with data at the level of municipality, health regions and facilities, micro-regions, meso-regions, schools and much more.

Any questions about using geobr data, or any other Data Basis dataset? We have a team ready to help on our Discord channel. Come and join us.

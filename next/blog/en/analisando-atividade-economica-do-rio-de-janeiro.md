---
title: Economic activity in the state of Rio de Janeiro and the pull of its capital
description: Using RAIS data to analyse the state's main economic activities and their relationship with the capital
slug: economic-activity-in-rio-de-janeiro-state
date:
  created: "2024-04-10T15:00:00"
authors:
  - name: Laryssa Bertin Ribeiro
    role: Author
    social: https://medium.com/@lary.bertin
thumbnail: /blog/analisando-atividade-economica-do-rio-de-janeiro/image_4.webp
categories: [analise]
medium_slug: >-
  https://medium.com/basedosdados/an%C3%A1lise-da-atividade-econ%C3%B4mica-do-estado-do-rio-de-janeiro-e-da-influ%C3%AAncia-da-capital-95ed6b5910b5
published: true
---

## TL;DR

This report investigates the main economic activities of the state of Rio de Janeiro, focusing on their relationship with the state capital.

It also examines how active employment was generated over a defined period. Drawing on data from the [Annual Social Information Report](/dataset/3e7c4d58-96ba-448e-b053-d385a829ef00?table=c3a5121e-f00d-41ff-b46f-bd26be8d4af3) (RAIS), it applies statistical analysis to trace how these patterns evolved and what they imply for the other municipalities in the state.

> This article was produced as the final project of Data Basis' course on Public Data Analysis with SQL and Sheets. To find out more about the course, see [here](https://info.basedosdados.org/bd-edu-cursos)

## Introduction

According to IBGE's [Monthly Employment Survey](https://www.data.rio/documents/4e6901873b314e2bacce25f8645046bd/explore) (PME), in 2016 the grouping _Education, Health and Public Administration_ accounted for 23.3% of jobs in the city of Rio de Janeiro (680,000); _Other Services_ for 19.9% (581,000); _Business Services_ for 18.7% (548,000); _Commerce_ for 17.0% (496,000); Industry for 11.2% (328,000); _Construction_ for 5.7% (166,000); and _Domestic Services_ for 3.7% (108,000).

IBGE recorded 5,910,000 people of working age in the municipality of Rio de Janeiro in February 2016, a figure that held roughly steady across the year. Of those, 49.4% were employed, 2.7% unemployed and 47.8% not economically active. Average real income among the employed population in the municipality was estimated at R$ 3,038.40, which stood as the per capita income of a Rio resident.

Within the employed population, formally registered private sector employees made up 47.0% (1,373,000), unregistered private sector employees 7.2% (210,000), self-employed workers 21.8% (636,000), and military or statutory public servants 13.5% (395,000).

The CNAE economic activity codes were formalised by an IBGE/CONCLA resolution (Figure 1) of 4 September 2006. Technically directed by IBGE, the Brazilian Institute of Geography and Statistics, CNAE is coordinated by the Federal Revenue Secretariat. Each code combines seven digits representing sections, groups, divisions, classes and subclasses.

The first detailed version of the CNAE subclasses was defined in 1998 under the name CNAE-Fiscal. It was adjusted in 2001 (CNAE-Fiscal 1.0) and again in 2002 (CNAE-Fiscal 1.1), the latter tracking specific changes to the CNAE structure (CNAE 1.0) that followed adjustments to the international ISIC/CIIU 3.1 classification (Figure 2).

<Image src="/blog/analisando-atividade-economica-do-rio-de-janeiro/image_0.webp"/>

## Methodology

This study analyses data from the [Annual Social Information Report](https://ftp.ibge.gov.br/Trabalho_e_Rendimento/Pesquisa_Mensal_de_Emprego/Municipio_RJ/Comentarios/2016/pme-rj_201602comentarios.pdf) (RAIS), a socioeconomic return that the Labour Secretariat of Brazil's Ministry of the Economy requires annually from companies and other employers. It is published yearly and covers every formal establishment and every contractual and statutory employment relationship in Brazil. The 2021 RAIS statistics drew on two data sources, eSocial and GDRAIS, with the following definitions:

- **Stock of formal jobs**: the number of active employment relationships on 31 December of the previous year — a snapshot of the labour market.
- **Establishments**: RAIS must be filed per establishment, which allows analysis of characteristics such as economic sector, legal status and geographic location. Since 1995, establishments with no employees have been required to file what is known as a negative RAIS.
- **Economic Activity Grouping**: a classification derived from aggregating the Sections of the National Classification of Economic Activities (CNAE 2.0).

We used SQL queries against the public Data Basis datalake, accessible through BigQuery, to collect and visualise the relevant data. The query used to extract the data for the basic analysis — active employment relationships from 2018 to 2022 for each CNAE in the state of Rio de Janeiro — is shown below:

**Query A**

```sql
SELECT
  v.cnae_2_subclasse AS CNAE,
  SUM(CASE
      WHEN v.ano = 2017 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2018,
  SUM(CASE
      WHEN v.ano = 2018 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2019,
  SUM(CASE
      WHEN v.ano = 2019 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2020,
  SUM(CASE
      WHEN v.ano = 2020 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2021,
  SUM(CASE
      WHEN v.ano = 2021 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2022,
  v.sigla_uf AS UF,
FROM
  basedosdados.br_me_rais.microdados_estabelecimentos v
WHERE
  v.cnae_2_subclasse IS NOT NULL
  AND v.sigla_uf = 'RJ'
  AND v.ano BETWEEN 2012
  AND 2022
  AND v.quantidade_vinculos_ativos IS NOT NULL
GROUP BY
  v.cnae_2_subclasse,
  v.sigla_uf
ORDER BY
  CNAE DESC;
```
<Image src="/blog/analisando-atividade-economica-do-rio-de-janeiro/image_1.webp" caption="Table A1: Jobs by CNAE, state of Rio de Janeiro, 2018 to 2022"/>

**Query B**

```sql
SELECT
  v.cnae_2_subclasse AS CNAE,
  SUM(CASE
      WHEN v.ano = 2017 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2018,
  SUM(CASE
      WHEN v.ano = 2018 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2019,
  SUM(CASE
      WHEN v.ano = 2019 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2020,
  SUM(CASE
      WHEN v.ano = 2020 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2021,
  SUM(CASE
      WHEN v.ano = 2021 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2022,
  v.sigla_uf AS UF,
  v.id_municipio
FROM
  basedosdados.br_me_rais.microdados_estabelecimentos v
WHERE
  v.cnae_2_subclasse IS NOT NULL
  AND v.sigla_uf = 'RJ'
  AND v.id_municipio = '3304557'
  AND v.ano BETWEEN 2012
  AND 2022
  AND v.quantidade_vinculos_ativos IS NOT NULL
GROUP BY
  v.cnae_2_subclasse,
  v.sigla_uf,
  v.id_municipio
ORDER BY
  CNAE DESC;
```
## Analysis and results

The economy of a region shapes how many jobs it generates. The city of Rio de Janeiro has a large metropolitan area and considerable pull over other cities in the state.

One aim of **Query A** was to identify the economic activities accounting for more than 50% of jobs generated in the state of Rio de Janeiro. For this purpose the study set a cut-off of 35 CNAEs out of a total of 1,318, together holding 52.82% of the total job stock at the start of 2022, as shown in **Table A1**.

**Chart A** was then produced to identify the main job-generating economic activities in the state, drawing on **Table A2**, which presents the groupings of those activities.

<Image src="/blog/analisando-atividade-economica-do-rio-de-janeiro/image_2.webp" caption="Chart A: Main economic activities accounting for more than 50% of jobs"/>

<Image src="/blog/analisando-atividade-economica-do-rio-de-janeiro/image_3.webp" caption="Table A2: Jobs by grouping, state of Rio de Janeiro"/>

One aim of **Query B** was to identify the economic activities generating the most jobs in the city of Rio de Janeiro, shown in **Table B**. Summing total jobs generated in the state and in the city across 2018 to 2022 allowed **Chart B** to be built, showing how the two move together.

DataMPE Brasil, a service producing and disseminating data relevant to small business development created by SEBRAE Rio de Janeiro, used RAIS data to establish that 3,938,871 employees were registered in the state in 2021, a change of 4.56% on the previous year. Average worker pay in 2021 was R$ 2,333.58, and 560,871 establishments were registered, a change of 2.84% on the previous year.

In the state of Rio de Janeiro, the economic sectors employing the most workers in 2021 were _Public Administration, Defence and Social Security_ (730,013), _Retail Commerce_ (598,989) and _Education_ (231,811).

In the same year, 42.9% of workers were women, with average pay of R$ 3,186.91, and 57.1% were men, with average pay of R$ 3,780.99.

According to Brazil's Federal Revenue Service, of all establishments registered up to 2023, 10.3% fall under _Other_ (214,564 establishments), 62.8% are _Individual Micro-entrepreneurs (MEI)_ (1,312,029), 22.5% are _Micro-enterprises (ME)_ (470,895), and 4.44% are _Small Businesses (EPP)_ (92,755).

About 13.2 million people worked as individual micro-entrepreneurs (MEIs) in Brazil in 2021, equivalent to 69.7% of all companies and other organisations and 19.2% of all formally employed people. Of the 673 classes in CNAE 2.0, MEIs were present in 206 in 2021. More than half of MEIs (55.7%) fall within the first 15 classes and almost 75% within the first 30. About half (50.2%) were in the Services sector in 2021. Commerce and 'repair of motor vehicles and motorcycles' accounted for 29.3%, and that activity had the largest number of MEI employees (48.3%).

Rio de Janeiro was the federal unit with the highest proportion of MEIs relative to total formal employment (26%), followed by Espírito Santo (24.8%).

We consulted the [Federal Revenue](https://www8.receita.fazenda.gov.br/simplesnacional/aplicacoes/atbhe/estatisticassinac.app/EstatisticasOptantesPorCNAE.aspx?tipoConsulta=2&optanteSimei=&anoConsulta=MjAyMg%3D%3D) site, which holds figures on MEIs by CNAE. The search found 35 CNAEs accounting for 67.42% of all individual micro-entrepreneurs as of 18 November 2023.

<Image src="/blog/analisando-atividade-economica-do-rio-de-janeiro/image_4.webp" caption="Chart B: Employment relationship between the city and state of Rio de Janeiro"/>

## Conclusion

The analysis shows how much economic activity tied to Public Administration weighs on the economy of the state of Rio de Janeiro, as **Chart A** makes clear. Many of these activities are plausibly carried out by companies providing technical or administrative services to state entities, public organisations and municipal and state governments.

To understand the picture better, future work could identify the centres of influence for public economic activity, which would allow comparison against salary distribution patterns across the state.

**Chart B** further suggests an economic correlation between the state of Rio de Janeiro and its capital. Extending the time series and making broader comparisons of economic activities in future research would sharpen that finding.

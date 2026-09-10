---
title: What is the relationship between dengue and climate change?
description: >-
  Temperature and rainfall may be linked to rising case numbers in some cities
slug: dengue-and-climate-change
date:
  created: "2025-05-07T21:02:04.375Z"
authors:
  - name: Marina Monteiro
    role: Analysis and text
  - name: Giovane Caruso
    role: Editing and design
categories: [analise]
thumbnail: /blog/qual-e-a-relacao-entre-a-dengue-e-as-mudancas-climaticas/grafico_goiania.png
medum_slug: https://medium.com/@basedosdados/nota-sobre-divulga%C3%A7%C3%A3o-dos-dados-do-inep-9168291dbca0
published: true
order: 1
---

In the previous BDletter we covered the dengue epidemic and its absolute and proportional numbers in the cities where part of our team lives. In this edition we stay with the disease, but look at the relationship between case numbers and two meteorological variables: air temperature and rainfall.

The question is worth asking because the life cycle of *Aedes aegypti* is closely affected by weather. The mosquito acquires the virus when it bites someone infected and becomes infective, able to transmit the disease to others in later bites. High rainfall increases the supply of breeding sites. High temperatures change the development, longevity and fecundity of adult mosquitoes, which prefer between 22ºC and 28ºC. A cycle from egg to adult that usually takes 7 to 10 days can run in 3 to 4 days at higher temperatures.

You would expect, then, that more rain and higher temperatures would mean more mosquitoes, and that more mosquitoes would spread the disease further. Does a rise in temperature and rainfall come with a rise in cases?

To find out, we analysed Brazil's state capitals, using temperature and rainfall measurements from [INMET](/dataset/782c5607-9f69-4e12-b0d5-aa0f1a7a94e2?utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_yEejPUipsc-cW3VKr51TG936EDjUtQ7FsruHM1xnCyYNuLd3b6JK282QA06r9HS1mxt-Q9DeZMt8UNYBdTQa6O4xDAQtBow06gCo-RD2SgZobLk4) automatic stations together with dengue case notifications recorded in [SINAN](/dataset/f51134c2-5ab9-4bbc-882f-f1034603147a?utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_yEejPUipsc-cW3VKr51TG936EDjUtQ7FsruHM1xnCyYNuLd3b6JK282QA06r9HS1mxt-Q9DeZMt8UNYBdTQa6O4xDAQtBow06gCo-RD2SgZobLk4), all of it available in the Data Basis datalake. From the daily meteorological data we calculated average temperature and total rainfall, monthly and weekly by epidemiological week. You can look at the results in detail in an interactive dashboard we built; the link is at the end.

The expected dynamic for case distribution is a rise at the start of the warm period, with cases peaking after some months of heat, a few weeks after the rainiest period. The lowest numbers should fall in the drier, colder months.

In Goiânia that pattern holds quite precisely across the years. See the chart below.

<Image src="/blog/bdletter-40-qual-e-a-relacao-entre-a-dengue-e-as-mudancas-climaticas/grafico_goiania.png"/>

In the capital of Goiás, cases concentrate in the weeks around the peaks of rainfall and temperature. As those two variables fall, case numbers fall with them.

The same dynamic is much less evident in Manaus.

<Image src="/blog/bdletter-40-qual-e-a-relacao-entre-a-dengue-e-as-mudancas-climaticas/grafico_manaus.png"/>

In the Amazonas capital the relationship with rainfall is still visible, though not in the same shape as Goiânia. The relationship with temperature no longer looks so direct. The explanation may be that average temperature there varies between 26ºC and 32ºC — already high, and consistently favourable to the mosquito.

Aracaju offers another example. Unlike the other capitals, which peak between February and April, notification peaks in Aracaju fall in the middle of the year, around June and July, even though that is the city's "coldest" period. But as in Goiânia, that period still has average temperatures above 25ºC. The notification maxima line up instead with the rainfall maxima.

## What does the literature say?

Several studies relate these meteorological variables to notified dengue cases across different regions. Research at Unicamp indicates that a 1ºC rise in average temperature may produce a roughly 20–30% rise in dengue cases in the city of Campinas over the following two months. Other studies point to a rise in local cases when rainfall increases, as in Belém and Ribeirão Preto.

Climate factors matter too. El Niño years, for example, shift rainfall from the north and northeast towards the southeast and south, where cities are more densely populated. Combined with higher temperatures, that can produce years with more cases than La Niña years(\*\*).

Factors of this kind are not the only ones bearing on dengue cases, directly or indirectly. Urbanisation, population density, sanitation and other characteristics of cities, along with public prevention policy, all have to be considered in assessing the total in a given place.

Still, temperature and rainfall play a large part in how the disease spreads and in epidemics. With average temperatures trending upward under climate change, we may see the disease proliferating further, and into places it never previously reached. We discuss that in this month's interview.

We also built a dashboard where you can investigate the data for your own state capital(\*). Look at whether average temperatures are trending up, and whether rainfall patterns have shifted meaningfully. Is there a relationship between those variables and the dengue cases you see?

> [Open the dashboard](https://climadengue.streamlit.app/?utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_yEejPUipsc-cW3VKr51TG936EDjUtQ7FsruHM1xnCyYNuLd3b6JK282QA06r9HS1mxt-Q9DeZMt8UNYBdTQa6O4xDAQtBow06gCo-RD2SgZobLk4)

You can also see the code in our [analysis repository](https://github.com/basedosdados/analises/tree/main/redes_sociais/climadengue?utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_yEejPUipsc-cW3VKr51TG936EDjUtQ7FsruHM1xnCyYNuLd3b6JK282QA06r9HS1mxt-Q9DeZMt8UNYBdTQa6O4xDAQtBow06gCo-RD2SgZobLk4) on GitHub.

(\*) Except Florianópolis. We could not find automatic station meteorological data for that capital.

(\*\*) In La Niña years rainfall in the north and northeast intensifies, which can raise cases in those regions. But since those regions are less densely populated, the rise would be less noticeable in the national case total.

---
title: How much does the price per square metre vary between São Paulo neighbourhoods?
description: >-
  We analysed GeoSampa data to map the disparity in property values across São
  Paulo
slug: square-metre-prices-across-sao-paulo
date:
  created: "2023-09-07T00:03:07.999Z"
authors:
  - name: Gustavo Alcantara
    role: Data
  - name: Giovane Caruso
    role: Editing
    social: https://www.linkedin.com/in/giovanecaruso/
  - name: Luiza Vilas Boas
    role: Art
thumbnail: /blog/analisando-preco-de-imoveis-em-sao-paulo/image_0.png
categories: [analise]
medium_slug: >-
  https://medium.com/@basedosdados/qual-a-diferen%C3%A7a-de-pre%C3%A7o-do-metro-quadrado-entre-os-bairros-de-s%C3%A3o-paulo-14cad7e4a89d
published: true
---

If you have ever looked for a property to buy or rent, you know location moves the price a great deal. Homes in central districts generally cost more than those on the edges of a city, and more so in a metropolis the size of São Paulo. But what does that geography of value actually look like, and where is the most and least expensive square metre in one of the largest cities in the world by population?

To find out, we analysed data from GeoSampa, the official portal of the São Paulo city government, which collects georeferenced data about the city. The dataset is notable for what it can tell you about urban dynamics and the property market: more than 85 million records and 21.5 GB covering property tax values and the price per built square metre, down to the postcode. These data are valuable for examining settlement and planning patterns, tracking how specific areas appreciate, investigating territorial inequality, and grounding public policy in concrete evidence.

This analysis focuses on the price per built square metre — the average cost per square metre of a constructed property — which lets us see geographically where value concentrates. We selected the thousand properties with the highest average construction values and the thousand with the lowest. To do it, we used our Brazilian Directories to place the midpoint of each postcode, and municipal data from geobr to keep only points falling inside the city of São Paulo. The chart below shows the result.

<Image src="/blog/analisando-preco-de-imoveis-em-sao-paulo/image_0.png"/>

The geographic distribution of price per built square metre across São Paulo is strikingly uneven. Jardim Paulistano, in the north of the city, has the lowest figure at R$ 7,960 per square metre, while Itaim Bibi, in the west, has the highest at R$ 39,980. The most expensive square metre in the city is therefore about five times the cheapest, which is the scale of the variation between regions of the São Paulo metropolitan area. The city-wide average is R$ 23,088.

With a DB Pro subscription you can access data updated regularly from the city's tax registry, covering land value, built area, property use and even neighbourhood characteristics. Start your [free trial](https://data-basis.org/dbpro) and explore.

Why not use the code behind this analysis to build your own cuts of the data? All the code for the analyses we publish is available on our [GitHub](https://github.com/basedosdados/analises/blob/main/redes_sociais/br_sp_geosampa_iptu_iptu_20230829.ipynb).

➡️ Access the data [here](/dataset/05f1b96d-883b-4202-a4bd-40379c5d326a?table=bdffc0f4-00da-4437-9ed9-0db7df11d3fa)

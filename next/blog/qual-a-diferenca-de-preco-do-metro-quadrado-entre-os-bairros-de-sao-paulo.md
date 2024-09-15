---
title: Qual a diferença de preço do metro quadrado entre os bairros de São Paulo?
description: >-
  Analisamos os dados do GeoSampa para mapear a disparidade de valores em São
  Paulo
date:
  created: '2023-09-07T00:03:07.999Z'
authors:
  - name: Gustavo Alcantara
    role: Dados
  - name: Giovane Caruso
    role: Edição
    social: https://www.linkedin.com/in/giovanecaruso/
  - name: Luiza Vilas Boas
    role: Arte
thumbnail: /blog/qual-a-diferenca-de-preco-do-metro-quadrado-entre-os-bairros-de-sao-paulo/image_0.png
categories: [analise]
keywords: []
medium_slug: >-
  https://medium.com/@basedosdados/qual-a-diferen%C3%A7a-de-pre%C3%A7o-do-metro-quadrado-entre-os-bairros-de-s%C3%A3o-paulo-14cad7e4a89d
---

Se você já buscou um imóvel para comprar ou alugar, sabe que a localização influencia significativamente no valo. No geral, sabemos que imóveis em regiões centrais costumam custar mais do que os que estão localizados nas regiões periféricas de uma cidade, especialmente em uma grande metrópole como São Paulo. Mas como se dá essa geografia de valores e qual é o metro quadrado mais caro, ou mais barato, em uma das maiores cidades do mundo em termos de população?

Para explorar esse cenário, analisamos os dados do GeoSampa, portal oficial da prefeitura do município de São Paulo, que reúne dados georreferenciados sobre a cidade. Essa base de dados é notavelmente interessante por sua capacidade de fornecer insights sobre a dinâmica urbana e o mercado imobiliário da grande metrópole. São mais de 85 milhões de registros e 21,5 GB de informações como o valor do IPTU e do metro quadrado construído a nível do Código de Endereçamento Postal (CEP). Esses dados são valiosíssimos para explorar padrões de ocupação e planejamento urbano, avaliar a valorização de áreas específicas, investigar desigualdades territoriais e fundamentar políticas públicas com base em dados concretos.

Nesta análise, concentramos nossa atenção no valor do metro quadrado construído. Essa variável representa o custo médio por metro quadrado de um imóvel construído, o que permite verificarmos geograficamente as disparidades na concentração desses valores. Selecionamos os mil imóveis com os maiores valores médios de construção e os mil imóveis com os menores valores. Para isso, utilizamos os dados dos nossos Diretórios Brasileiros para marcar o ponto médio de cada CEP e os dados de município do geobr para delimitar pontos que se sobrepunham à cidade de São Paulo. Confira no gráfico abaixo.

<Image src="/blog/qual-a-diferenca-de-preco-do-metro-quadrado-entre-os-bairros-de-sao-paulo/image_0.png"/>

A distribuição geográfica dos valores do metro quadrado construído na cidade de São Paulo revela uma notável disparidade. O bairro do Jardim Paulistano, localizado na Zona Norte da cidade, apresenta o menor valor de metro quadrado construído, avaliado em R$ 7.960, enquanto o bairro do Itaim Bibi, na Zona Oeste, registra o maior valor, impressionantes R$ 39.980 por metro quadrado. Isso significa que a diferença entre o metro quadrado mais caro e o mais barato na cidade é de aproximadamente cinco vezes, destacando as variações significativas nos preços imobiliários em diferentes regiões da metrópole paulistana. O valor médio por metro quadrado na cidade é R$ 23.088.

Com assinatura BDPro você pode acessar dados atualizados periodicamente pelo cadastro fiscal da Prefeitura, com informações como valor do terreno, área construída, uso do imóvel e até características do bairro. Comece já seu [teste grátis](https://info.basedosdados.org/bd-pro) e explore!

Que tal utilizar o código dessa análise para criar seus próprios recortes? Todos os códigos das análises que publicamos estão disponíveis em nosso [GitHub](https://github.com/basedosdados/analises/blob/main/redes_sociais/br_sp_geosampa_iptu_iptu_20230829.ipynb).

➡️ Acesse os dados por [aqui](https://basedosdados.org/dataset/05f1b96d-883b-4202-a4bd-40379c5d326a?table=bdffc0f4-00da-4437-9ed9-0db7df11d3fa)

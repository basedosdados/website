---
title: A tool that makes election ad-spend data more accessible
description: >-
  An interview with Sérgio Spagnuolo about the Electoral Content Promotion Observatory
slug: making-election-ad-spend-data-accessible
date:
  created: "2024-10-30"
thumbnail: /blog/ferramenta-traz-mais-acessibilidade-aos-dados-de-impulsionamento-eleitoral-nas-redes.md/image_1.png
categories: [institucional]
authors:
  - name: Giovane Caruso
    role: Text and interview
    social: https://www.linkedin.com/in/GiovaneCaruso/
    avatar: 

---

_This interview was published in the October BDletter. Subscribe free to keep up with analyses and interviews about Data Basis and the open data community in Brazil._

This election month is full of news for anyone who likes analysing campaign, finance and electoral results data. At Data Basis alone we launched [Siga o Dinheiro](https://www.sigaodinheiro.org/), an interactive dashboard for following election income and spending, ran an [open class](https://www.youtube.com/watch?v=FGboC_4szhc&t=584s) on investigating candidate data, and of course updated the TSE data, already processed and ready for analysis in the largest public datalake in Brazil.

In this interview we look at another tool built to bring transparency and accessibility to campaign finance data. We spoke with Sérgio Spagnuolo about the [Content Promotion Observatory](https://nucleo.jor.br/observatorio-de-impulsionamento-eleitoral/?utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz--K7d9YHXkRUu4u9_geagEUzW0JY63mOmg3Sreqf91-uz-5xVzSnqOMg4CY24Ngvw7dIqcCy4v9h0_YYiTCrm9fclqimIKN_X2A_kD4EaFPRl-Q9Rs), an application built by Núcleo Jornalismo to monitor what election campaigns spend on promoting content on social media.

Through the application, anyone can see how much candidates spend promoting content on social media, and filter by geography, party, office, and even by the name of the social network.

<Image src="/blog/ferramenta-traz-mais-acessibilidade-aos-dados-de-impulsionamento-eleitoral-nas-redes/image_1.webp.webp" caption="The filter mechanism of the Electoral Promotion Observatory"/>

The result is a set of visualisations and a data table, extracted automatically from the TSE website. You can also download the data as .csv or .xls files.

<Image src="/blog/ferramenta-traz-mais-acessibilidade-aos-dados-de-impulsionamento-eleitoral-nas-redes/image_2.webp.webp" caption="Example visualisation from the Content Promotion Observatory."/>

Sérgio is a journalist and director of Núcleo Jornalismo, an initiative that analyses and reports on how digital technology affects people's lives, with the aim of helping build a better internet. In 2014 he founded the newstech agency Volt Data Lab; he has been a Knight Fellow at ICFJ and a director at Abraji, and has worked with a range of Brazilian and international outlets.

<Image src="/blog/ferramenta-traz-mais-acessibilidade-aos-dados-de-impulsionamento-eleitoral-nas-redes/image_3.webp.webp" caption="Photograph of Sérgio Spagnuolo"/>

## Interview

**In this election, nearly R$ 180 million has so far been declared as spending on promoting candidates' content on social media. The Electoral Promotion Observatory makes those figures easy to follow. How did the idea come about, and what were the main challenges in building it?**

The Observatory started at the 2022 elections, out of a need we identified to map the use of the specific budget line for promoting posts on social media, which was created in 2019. It was the first time that line had been used, and we thought it was worth surveying this new form of political advertising.

**The Observatory uses TSE data to monitor campaign promotion on social media. Could you say something about why that data matters for electoral transparency, and whether there are limitations that still make precise analysis of candidate content promotion difficult?**

The data matters because online campaigning is increasingly central during elections. Social media is very fertile ground for political advertising, and it is worth watching how money is being spent on it. Promotion on social media is also cheap compared with TV advertising, for instance, so you can get a lot of efficiency at a good cost-benefit ratio. One problem with the data is that it is self-declared, and sometimes the social networks used as the vector are not properly declared, which muddies the aggregation somewhat.

**The Observatory's dashboard offers an interactive interface with filters and visualisations that make this information more accessible. How do you assess the impact it has had on monitoring election spending? Is there an interesting example you could mention?**

The Observatory has been used by other publications and organisations to map promotion spending in different places and areas of public life. It has also been used in academic research, such as a final-year dissertation at the Federal University of Pernambuco. Our aim is to supply information that other people and organisations can use.

**One notable feature is being able to filter promotion spending by social network, a particularly hard cut to make with data self-declared by candidates. Could you say something about the solution behind it?**

The solution is fairly rudimentary, because there is not much information to infer anything from. We scan several columns for keywords in order to associate a given expense with a social network, where such a reference exists. We also group by economic group — Meta covering Facebook and Instagram, for example — since social networks can trade under different corporate names.

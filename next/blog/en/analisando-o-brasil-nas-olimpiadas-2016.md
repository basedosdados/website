---
title: Brazil at the Olympics
description: An overview of Brazilian performance at the Olympic Games over the years
slug: brazil-at-the-olympics
date:
  created: "2021-07-23"
authors:
  - name: Lucas Nascimento
    role: Author
    social: https://github.com/lucasnascm
thumbnail: /blog/analisando-o-brasil-nas-olimpiadas-2016/image_0.jpg
categories: [analise]
medium_slug: https://medium.com/@basedosdados/o-brasil-nas-olimp%C3%ADadas-2a3f9960cc69
published: true
---

> **Note**: this article was published in 2021 and drew on a dataset that ran to 2016. We could not find updated data in the same format, so we have published figures through 2021 in a new format in this [new dataset](https://data-basis.org/dataset/62f8cb83-ac37-48be-874b-b94dd92d3e2b?table=567b1ccd-d8c2-4616-bacb-cf5c0e7b8d89).

## TL;DR

Another edition of the Olympics starts today — but did you know the first Games of the modern era were held in 1896? This piece presents historical data on the Olympic Games, already cleaned, processed and available in the public Data Basis datalake. The [Olympics microdata](/dataset/62f8cb83-ac37-48be-874b-b94dd92d3e2b?table=567b1ccd-d8c2-4616-bacb-cf5c0e7b8d89) covers the games, host cities, delegations, athletes and their characteristics, along with the sports, their various events, and medallists.

<Image src="/blog/analisando-o-brasil-nas-olimpiadas-2016/image_0.jpg"/>

The analysis script was run in R using our data package. The aim is to give an overview of Brazilian performance in every edition the delegation took part in. With Data Basis you can also reach this data in Python or directly through BigQuery.

```r
library("basedosdados")
library("tidyverse")
library("gridExtra")
library("dplyr")

olimpiadas <- basedosdados::read_sql(
  "SELECT * FROM `basedosdados.mundo_kaggle_olimpiadas.microdados` WHERE delegacao = 'BRA'",
  billing_project_id = "input-dados"
)
```
## Confirmed attendance

Brazil first took part in the Olympic Games in 1900, in Paris. The delegation's only athlete was Adolphe Klingelhoeffer, who competed in athletics. The next edition with Brazilian representatives was 1920, and we have been present in various events ever since. Below is an overview of Brazilian participation across the editions, showing the number of athletes and events, along with the code that produced the chart.

<Image src="/blog/analisando-o-brasil-nas-olimpiadas-2016/image_1.png"/>

```r
counts <- olimpiadas %>%
  filter(edicao == "Summer") %>%
  group_by(ano) %>%
  summarize(
    atletas = length(unique(id_atleta)),
    eventos = length(unique(evento))
  )

p1 <- ggplot(counts, aes(x = as.numeric(ano), y = as.numeric(atletas))) +
  geom_point() +
  scale_y_continuous(limits = c(0, 470)) +
  labs(title = "Participação brasileira nos Jogos Olímpicos", y = "Total de atletas") +
  theme(plot.title = element_text(hjust = 0.5)) +
  geom_line() +
  xlab("")

p2 <- ggplot(counts, aes(x = as.numeric(ano), y = as.numeric(eventos))) +
  geom_point() +
  scale_y_continuous(limits = c(0, 250)) +
  labs(x = "Anos", y = "Modalidades") +
  geom_line()

grid.arrange(p1, p2, ncol = 1)
```
The record for Brazilian participation was 2016, competing at home, with 462 athletes across 222 different events. Earlier editions looked very different: the five before 2016 averaged 236 athletes. This year Brazil had 302 athletes in Tokyo, according to the Brazilian Olympic Committee.

## The medal table

Every edition, newspapers and sports channels focus on the best moments of the delegation, and the overall medal table leads the coverage. Across the games it has taken part in, Brazil has accumulated 30 gold medals, 36 silver and 63 bronze. The chart below shows the sports, men's and women's events combined, where those medals were won.

<Image src="/blog/analisando-o-brasil-nas-olimpiadas-2016/image_2.png"/>

On our podium, judo, sailing and athletics lead on total medals with 22, 18 and 16 respectively. The data lets you identify the winning athletes and the events where they took their medals. In judo 🥋, women won 3 bronze medals and 2 gold, while men brought home 12 bronze, 3 silver and 2 gold. The script for the chart is:

```r
medalha_counts <- olimpiadas %>%
  filter(!is.na(medalha)) %>%
  group_by(ano, esporte, evento, medalha) %>%
  summarize(Count = length(unique(medalha)))

# ordena a tabela
medalha_counts$medalha <- factor(medalha_counts$medalha, levels = c("Gold", "Silver", "Bronze"))

# total de medalhas por modalidade esportiva ao longo dos anos
lev <- medalha_counts %>%
  group_by(esporte) %>%
  summarize(Total = sum(Count)) %>%
  arrange(Total) %>%
  select(esporte)

medalha_counts$esporte <- factor(medalha_counts$esporte, levels = lev$esporte)

# criação do gráfico
ggplot(medalha_counts, aes(x = esporte, y = Count, fill = medalha)) +
  geom_col() +
  coord_flip() +
  scale_fill_manual(values = c("gold1", "gray70", "gold4")) +
  ggtitle("Total de medalhas brasileiras por esporte nos Jogos Olímpicos") +
  theme(plot.title = element_text(hjust = 0.5))
```
## Women at the Olympics

Brazilian women first took part in the Games only in 1932 — 36 years after the first edition — and the gap between men and women is stark. Before the 2000s, the ratio of women to men in the delegation averaged 20%: for every woman competing there were five men. Only in the new millennium did that inequality nearly close, at the Brazilian level. In 2016 there were 207 women and 255 men competing across 31 different sports.

<Image src="/blog/analisando-o-brasil-nas-olimpiadas-2016/image_3.png"/>

The code for total participation by sex over the years is straightforward.

```r
# filtrando para edição de verão dos Jogos
sexo <- olimpiadas %>% filter(edicao == "Summer")

# série do total de atletas por sexo
counts_sex <- sexo %>%
  group_by(ano, sexo) %>%
  summarize(atletas = length(unique(id_atleta)))

counts_sex$ano <- as.integer(counts_sex$ano)

# criação do gráfico
ggplot(counts_sex, aes(x = ano, y = atletas, group = sexo, color = sexo)) +
  geom_point(size = 2) +
  geom_line() +
  scale_color_manual(values = c("orange", "darkgreen")) +
  labs(title = "Participação masculina e feminina nas Olimpíadas") +
  theme(plot.title = element_text(hjust = 0.5))
```
Enjoyed this analysis? The point was to prompt you to analyse more. Many questions can be answered — and many more asked — by digging into this history. We can keep talking about data in our community on [Discord](https://discord.com/invite/huKWpsVYx4).

May the force be with our athletes. Go Brazil!

[Data Basis](/) is a nonprofit, open source initiative that works to make producing knowledge in Brazil easier. Our team works hard to process and publish quality data that makes your analysis simpler. Your support matters in keeping this going.

Support us at [https://apoia.se/basedosdados](https://apoia.se/basedosdados), or with a PIX transfer: 42494318000116

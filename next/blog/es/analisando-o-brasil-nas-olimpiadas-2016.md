---
title: Brasil en los Juegos Olímpicos
description: Un panorama del desempeño brasileño en los Juegos Olímpicos a lo largo de los años
slug: brasil-en-los-juegos-olimpicos
date:
  created: "2021-07-23"
authors:
  - name: Lucas Nascimento
    role: Autor
    social: https://github.com/lucasnascm
thumbnail: /blog/analisando-o-brasil-nas-olimpiadas-2016/image_0.jpg
categories: [analise]
medium_slug: https://medium.com/@basedosdados/o-brasil-nas-olimp%C3%ADadas-2a3f9960cc69
published: true
---

> **Atención**: este artículo se publicó en 2021 y se basó en un conjunto de datos que llegaba hasta 2016. No encontramos datos actualizados en el mismo formato, por lo que incluimos cifras hasta 2021 en un formato nuevo en este [nuevo conjunto de datos](https://basedelosdatos.org/dataset/62f8cb83-ac37-48be-874b-b94dd92d3e2b?table=567b1ccd-d8c2-4616-bacb-cf5c0e7b8d89).

## TL;DR

Hoy comienza una nueva edición de los Juegos Olímpicos, pero ¿sabía que los juegos de la Era Moderna tuvieron su primera edición en 1896? En este texto presentamos datos históricos de los Juegos Olímpicos, ya limpios, tratados y disponibles en el datalake público de Base de los Datos. Los [microdatos de los Juegos Olímpicos](/dataset/62f8cb83-ac37-48be-874b-b94dd92d3e2b?table=567b1ccd-d8c2-4616-bacb-cf5c0e7b8d89) contienen información sobre los juegos, la ciudad sede, las delegaciones, los atletas y sus características, además de los deportes, sus distintas modalidades y los medallistas.

<Image src="/blog/analisando-o-brasil-nas-olimpiadas-2016/image_0.jpg"/>

El script de análisis se ejecutó en R usando nuestro paquete de datos. La idea es mostrar un panorama del desempeño brasileño en las ediciones en que la delegación estuvo presente. Conviene recordar que, con Base de los Datos, también puede acceder a estos datos en Python o directamente por BigQuery.

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
## Presencia confirmada

Brasil participó por primera vez en unos Juegos Olímpicos en 1900, en París. El único atleta de la delegación era Adolphe Klingelhoeffer, que competía en atletismo. La siguiente edición con representantes brasileños fue en 1920 y, desde entonces, hemos estado presentes en distintas pruebas. A continuación puede ver el panorama de la participación brasileña a lo largo de las ediciones, con el número de atletas y modalidades, junto con el código utilizado para producir esa visualización.

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
El récord de participación brasileña fue en 2016, compitiendo en casa, con 462 atletas en 222 pruebas distintas. Las ediciones anteriores fueron muy diferentes: la media de las cinco previas a 2016 fue de 236 atletas. Ese año Brasil contó con 302 atletas en Tokio, según datos del Comité Olímpico Brasileño.

## El medallero

En todas las ediciones, los periódicos y los canales deportivos se concentran en los mejores momentos de nuestra delegación, y el medallero general destaca en las noticias. Analizando el desempeño de los atletas en los juegos en que participó, Brasil acumula 30 medallas de oro, 36 de plata y 63 de bronce. El gráfico siguiente muestra los deportes, sumadas las modalidades masculina y femenina, en los que Brasil reparte sus conquistas.

<Image src="/blog/analisando-o-brasil-nas-olimpiadas-2016/image_2.png"/>

En nuestro podio, judo, vela y atletismo son los que más medallas acumulan, con 22, 18 y 16 respectivamente. Los datos permiten identificar quiénes son los atletas campeones y las pruebas en que lograron la victoria. En judo 🥋, las mujeres ganaron 3 medallas de bronce y 2 de oro, mientras que los hombres se llevaron 12 bronces, 3 platas y 2 oros. El script para elaborar el gráfico es:

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
## Mujeres en los Juegos Olímpicos

La participación femenina brasileña en los juegos ocurre por primera vez solo en 1932 —36 años después de la primera edición— y la brecha entre hombres y mujeres es notoria. Antes de los años 2000, la razón de mujeres a hombres en los juegos era del 20% en promedio: por cada mujer compitiendo en la delegación había otros cinco hombres. Solo en el nuevo milenio esa desigualdad casi se anula, a nivel de Brasil. En 2016 compitieron 207 mujeres y 255 hombres en 31 deportes diferentes.

<Image src="/blog/analisando-o-brasil-nas-olimpiadas-2016/image_3.png"/>

El código de análisis del total de participación por sexo a lo largo de los años es sencillo.

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
¿Le gustó este análisis? Nuestra intención fue animarle a analizar más. Se pueden responder muchas preguntas —y plantear otras tantas— examinando esta historia. Podemos seguir conversando sobre datos en nuestra comunidad de [Discord](https://discord.com/invite/huKWpsVYx4).

¡Que la fuerza esté con nuestros atletas! ¡Vamos Brasil!

[Base de los Datos](/) es una iniciativa sin fines de lucro y de código abierto que busca facilitar y fomentar la producción de conocimiento en Brasil. Nuestro equipo trabaja duro para tratar y publicar datos de calidad que faciliten su análisis. Su apoyo es importante para mantener esta iniciativa.

Apoye en [https://apoia.se/basedosdados](https://apoia.se/basedosdados), o con un PIX: 42494318000116

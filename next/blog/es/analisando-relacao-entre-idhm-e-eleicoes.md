---
title: ¿Qué relación hay entre el IDHM y la votación presidencial de 2018 en São Paulo?
description: Vea cómo analizar los datos del índice de forma más fácil y práctica
slug: idhm-y-la-votacion-presidencial-de-2018
date:
  created: "2022-04-28T15:00:00"
authors:
  - name: Gustavo Alcântara
    role: Texto
    social: https://medium.com/@gustavo.geo
  - name: Giovane Caruso
    role: Edición
    social: https://medium.com/@giovanecaruso
thumbnail: /blog/analisando-relacao-entre-idhm-e-eleicoes/image_0.webp
categories: [analise]
medium_slug: >-
  https://medium.com/basedosdados/qual-a-rela%C3%A7%C3%A3o-entre-o-idhm-e-a-vota%C3%A7%C3%A3o-presidencial-de-2018-em-sp-aa9f1305586f
published: true
---

## TL;DR

En este breve artículo propongo una visualización sencilla y rápida de cómo la votación presidencial de 2018 se relaciona con el Índice de Desarrollo Humano Municipal (IDHM) de los municipios paulistas. Verá cómo acceder y analizar los datos del índice de forma más fácil y práctica a través del *datalake* público de Base de los Datos, además de los pasos seguidos para construir esa visualización.

<Image src="/blog/analisando-relacao-entre-idhm-e-eleicoes/image_0.webp"/>

## El Índice de Desarrollo Humano Municipal (IDHM)

El IDHM es una medida compuesta de indicadores de tres dimensiones del desarrollo humano: longevidad, educación y renta. El índice varía de 0 a 1: cuanto más cerca de 1, mayor el desarrollo humano. Además de seguir esas mismas tres dimensiones, el IDHM brasileño adecúa la metodología global al contexto brasileño y a la disponibilidad de indicadores nacionales, lo que lo hace más adecuado para evaluar el desarrollo de los municipios de Brasil.

Base de los Datos publica los datos del [Atlas del Desarrollo Humano (ADH)](http://atlasbrasil.org.br/), el sitio que reúne el IDHM y otros 200 indicadores, ya tratados y listos para el análisis. **Son datos a nivel de Brasil, estado y municipio** que pueden analizarse en Python, R o en el propio BigQuery vía SQL. Para este análisis usamos el [paquete de R de BD](https://github.com/basedosdados/sdk/tree/master/r-package). Acceda a esta base [aquí](/dataset/mundo-onu-adh).

## Analizando la relación entre el IDHM y la votación presidencial

> Para toda buena pregunta existirá un buen análisis por hacer.

Siempre que pensemos en trabajar con datos, estadísticas y análisis, lo primero que importa es definir una buena pregunta. Eso le ahorrará un tiempo precioso en la limpieza y manipulación de su base de datos. En este breve ejercicio, con las elecciones presidenciales acercándose, reflexioné sobre cómo el IDHM de los municipios paulistas puede relacionarse con la última elección presidencial. ¿Existe una relación entre el candidato electo o no y el IDH de los municipios?

### ¿Cómo presentar esa relación?

Correlacionar datos no siempre es tarea fácil. Pero con algunas líneas de código y buenas bibliotecas en su software de análisis resulta relativamente simple indicar la tendencia o correlación entre los datos mediante una representación gráfica.

Mi lengua materna en programación es R. Empecé a desarrollar análisis en 2016 usando R base y hoy uso RStudio por su interfaz gráfica y su rápida manipulación. Me gusta mucho R y sobre todo su comunidad, siempre dispuesta a colaborar. BD pone todo su datalake a disposición para acceso y manipulación en R y en otros lenguajes.

### Creando el dataframe

Ahora viene la parte más entretenida: ¡a programar! El primer paso es crear el dataframe que responda a la pregunta anterior. Dejé las anotaciones en el propio código. Si tiene alguna duda, puede encontrarme en el servidor de [Base de los Datos en Discord](https://discord.com/invite/huKWpsVYx4); mi usuario es @gustavoalcantara. Estos son los primeros pasos:

```r
# Inicio da Jornada
# Atribuição do projeto na Base dos dados

con <- bigrquery::dbConnect(
  bigquery(),
  billing = "basedosdados-elections",
  project = "basedosdados"
)

# indo para o meu projeto no Google DataLake
basedosdados::set_billing_id("basedosdados-elections")

# query necessária para responder à minha pergunta
query <- "
SELECT
  ano,
  turno,
  sigla_uf,
  sigla_partido,
  id_municipio,
  votos,
  resultado,
  cargo
FROM
  `basedosdados.br_tse_eleicoes.resultados_candidato_municipio`
WHERE
  ano = 2018
  AND sigla_uf = 'SP'
  AND cargo = 'presidente'
"

# atribuição do Dataframe
df <- DBI::dbGetQuery(con, query)
```
Con el `dataframe` en mano, toca calcular la proporción de votos de los candidatos presidenciales por municipio para verificar la relación con el IDHM. Para ello usamos el código siguiente, que crea una nueva variable:

```r
# Criação de Variável: Porcentagem das votações
df <- df |>
  dplyr::group_by(id_municipio) |>
  dplyr::mutate(porcentagem = votos / sum(votos) * 100)
```
Parte del propósito de este material es que también pueda trabajar con una tabla externa a BD. Por eso importé un `.csv` de mi computadora, el IDHM de los municipios paulistas, y cambié el nombre de la variable de municipio para poder hacer un join. Como la idea es analizar una posible relación entre el IDHM y el porcentaje de votación, es más fácil visualizarla gráficamente con las variables ordenadas. El código que usé fue este:

```r
# Juntando o IDHM de uma base externa com a base de Eleições
# Lendo a base Externa
idhm <- read.csv("idhm_sp.csv")
# Mudando o nome da variável Cod.IBGE para id_municipio
# para o futuro join
idhm <- idhm |>
  dplyr::rename(id_municipio = "Cod.IBGE")
# Join entre as tabelas
df |>
  dplyr::left_join(idhm,
    by = "id_municipio"
  )
```
¡Listo! Nuestro dataframe está preparado. Tiene este aspecto:

<Image src="/blog/analisando-relacao-entre-idhm-e-eleicoes/image_1.webp"/>

### Analizando gráficamente las relaciones entre IDHM y porcentaje de votos

Con el dataframe completo resulta sencillo elaborar una visualización gráfica de nuestra pregunta general. Vea el código y la visualización:

```r
# grafico das relacoes
dplyr::filter(df, turno == 2) |>
  dplyr::group_by(id_municipio) |>
  ggplot2::ggplot(aes(
    x = idhm_2010,
    y = porcentagem,
    color = resultado
  )) +
  geom_point() +
  geom_smooth() +
  scale_color_discrete(labels = c("Bolsonaro", "Fernando Haddad")) +
  labs(
    title = "Relação entre IDHM e Porcentagem de Votos em SP",
    x = "IDHM",
    y = "Porcentagem de Votos",
    colour = "Candidato:"
  ) +
  theme(legend.position = "bottom")
```
<Image src="/blog/analisando-relacao-entre-idhm-e-eleicoes/image_0.webp"/>

Y listo. Con esta visualización tenemos una primera lectura de la relación entre el IDHM en el estado de São Paulo y la votación presidencial de 2018. Cada punto es un municipio y representa en el eje y el porcentaje de votos que recibió cada candidato: en azul para Fernando Haddad y en rojo para Bolsonaro. Observe cómo, en los municipios con IDHM alto (mayor que 0,70), el porcentaje de votos se comporta de forma inversa entre los dos candidatos. Haddad obtuvo allí su menor porcentaje, mientras que Bolsonaro obtuvo el mayor, con una tendencia creciente cuanto mayor es el IDH.

¿Se repite ese escenario en otros estados? Haga también su análisis. Si necesita una mano, Base de los Datos tiene un equipo preparado para ayudarle. Traiga sus dudas a [nuestra comunidad en Discord](https://discord.com/invite/huKWpsVYx4).

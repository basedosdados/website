---
title: Cómo acceder a los datos de BD en Power BI
description: Vea cómo acceder al datalake público de Base de los Datos en Power BI para crear gráficos, visualizaciones y dashboards.
slug: como-usar-datos-de-bd-en-power-bi
date:
  created: "2021-07-30"
authors:
  - name: Victor Viana
    role: Autor
    social: https://medium.com/@ovictorviana
thumbnail: /blog/como-acessar-dados-da-bd-no-power-bi/image_11.gif
categories: [tutorial]
medium_slug: >
  https://medium.com/basedosdados/como-acessar-dados-da-bd-no-power-bi-aeeea9a9bdc0
published: true
---

## TL;DR

Power BI es una de las tecnologías más populares para desarrollar dashboards con datos relacionales, y [Base de los Datos]() es uno de los mayores data lakes públicos de Brasil. Esa combinación es un entorno idóneo para el análisis y la visualización de datos. En este artículo mostramos lo fácil que es acceder a las bases de BD para usarlas en Power BI, con el paso a paso.

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_0.png"/>

## Conectar a Google BigQuery

[Google BigQuery](https://cloud.google.com/bigquery?hl=pt_br) es el servicio de base de datos en la nube de Google, donde los conjuntos de Base de los Datos están almacenados dentro de un datalake público llamado `basedosdados`. Para acceder a los datos hace falta crear un proyecto (gratuito) en BigQuery. Si ya tiene uno, pase al siguiente paso; si no, preparamos dos tutoriales para ayudarle de forma rápida y sencilla:

1. [Artículo](https://dev.to/basedosdados/bigquery-101-45pk)
2. [Video](https://www.youtube.com/watch?v=nGM2OwTUY_M)

## Conectar los datos en Power BI

En este recorrido mostramos cómo conectar los datos de la evolución del PIB de los municipios (tabla de hechos) y la información sobre los municipios (tabla de dimensión) en [Power BI](https://powerbi.microsoft.com/pt-br/downloads/) para elaborar análisis. Esa base se usa como ejemplo, pero el tutorial sirve para cualquier otra base del *datalake*.

### Buscar los datos en el sitio

Para acceder a los datos en la interfaz de BigQuery usamos consultas en SQL, uno de los lenguajes más básicos y útiles para quien trabaja con datos. En el sitio de Base de los Datos puede buscar cualquier base y copiar directamente el código SQL, disponible en la página de la tabla seleccionada bajo "Acceda a los datos vía BigQuery", para usarlo en el editor de SQL de Google BigQuery, como muestra el ejemplo siguiente. Para aprender más sobre el lenguaje recomendamos el curso gratuito de [Udacity](https://www.udacity.com/course/sql-for-data-analysis--ud198), o los propios [tutoriales](https://cloud.google.com/bigquery/docs/tutorials) de BigQuery.

### Seleccionar los datos en BigQuery

Todavía en el sitio, puede hacer clic en "Consultar en BigQuery" para ser redirigido al [*datalake*](https://console.cloud.google.com/bigquery?p=basedosdados&page=project). La interfaz de BigQuery es distinta a la del sitio porque es un servicio del propio Google; explicamos más sobre cada elemento de esa interfaz en este artículo.

Haga clic en "Crear nueva consulta", pegue el código copiado en el editor que aparece y ejecútelo. Note que el código indica `LIMIT 100` para traer solo las 100 primeras filas. Puede cambiar ese parámetro (o quitarlo) para traer más filas; solo le pedimos que tenga cuidado con bases muy grandes (RAIS, Censo Poblacional), porque traer todos los datos de una vez no solo es lento sino que consume bastante procesamiento, lo que puede generar costos.

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_1.png"/>

```sql
SELECT
  pib.id_municipio,
  --selecionar id do municipio
  pop.ano,
  -- população do muunicipio
  pib.PIB / pop.populacao AS pib_per_capita -- calculo do PIB per capita
FROM
  `basedosdados.br_ibge_pib.municipio` AS pib -- selecionar base de pib dos municipios
JOIN
  `basedosdados.br_ibge_populacao.municipio` AS pop -- join com a base de população
ON
  pib.id_municipio = pop.id_municipio
  AND pib.ano = pop.ano
LIMIT
  100
```
<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_2.png"/>

### Guardar los datos en un proyecto privado

Guarde la tabla obtenida haciendo clic en **Guardar**. Puede guardar la consulta o la vista.

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_3.png"/>

BigQuery le pedirá crear un conjunto de datos donde guardar esa tabla (si no tiene uno). Si ya conoce Power BI, funciona de forma muy similar a sus conjuntos de datos. Dele un nombre claro. En Base de los Datos organizamos los nombres de conjuntos por alcance geográfico, institución y tema del dato; puede ver más sobre nuestras reglas de nomenclatura [aquí](https://basedosdados.org/docs/style_data/#nomea%C3%A7%C3%A3o-de-bases-e-tabelas). El conjunto es esencialmente una "carpeta" donde estarán todas las tablas de su proyecto. En este ejemplo elegimos el nombre genérico "tutorial".

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_4.png"/>

Después seleccione el conjunto creado para guardar la base, elija un nombre para su tabla y haga clic en Guardar. Así de simple 😊.

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_5.png"/>

Ahora su proyecto aparecerá en la barra lateral izquierda. Haga clic en la flecha junto al nombre del proyecto y aparecerá su conjunto de datos con la tabla que guardó. Si no aparece, actualice la página.

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_6.png"/>

Para guardar otra tabla con la información de los municipios (nombre, estado, etc.), repita el proceso con la consulta siguiente. Llamaremos a esa tabla `dMunicipio`, que se guardará en el mismo conjunto llamado `tutorial`.

```sql
SELECT
  id_municipio,
  nome,
  id_uf,
  sigla_uf,
  nome_regiao
FROM `basedosdados.br_bd_diretorios_brasil.municipio`
```
### Importar los datos a Power BI

- Abra Power BI
- Vaya a Obtener datos -> Más

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_7.png"/>

- Busque `Google BigQuery` -> Conectar

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_8.png"/>

- Inicie sesión con su cuenta de Google, la misma con la que hizo las consultas en BigQuery. Si entra con otra cuenta no será posible conectar.

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_9.png"/>

- Permita el acceso a Power BI
- Vuelva a Power BI y haga clic en conectar
- Seleccione la carpeta con el nombre de su conjunto de datos
- Seleccione las tablas

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_10.png"/>

- Haga clic en cargar
- Seleccione Importar
  - En la mayoría de los casos no es necesario estar conectado directamente y, además, así no queda dependiente de la conexión con la base.

Listo, ya tiene acceso a sus bases de BD para crear su dashboard. :)

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_11.gif"/>

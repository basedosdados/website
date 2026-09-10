---
title: Introducción al paquete basedosdados en Python
description: Explore los datos de nuestro datalake público
slug: intro-al-paquete-basedosdados-en-python
date:
  created: "2021-04-16"
authors:
  - name: Vinicius Aguiar
    role: Equipo Base de los Datos 💚
    social: https://medium.com/u/2af0c71cb64a
  - name: Fernanda Scovino
    role: Equipo Base de los Datos 💚
    social: https://medium.com/u/444581849446
thumbnail: /blog/intro-ao-pacote-basedosdados-em-python/image_0.jpg
categories: [tutorial]
medium_slug: https://medium.com/@basedosdados/intro-ao-pacote-basedosdados-em-python-4e05439e936d
published: false
---

<Image src="/blog/intro-ao-pacote-basedosdados-em-python/image_0.jpg"/>

## TL;DR

Vamos a mostrar **cómo usar el paquete de Base de los Datos en Python.** El paquete permite acceder y analizar más de 70 conjuntos de datos de nuestro *datalake* público, obtener información sobre las tablas, cargar datos en pandas y más.

Contenido basado en el [taller "Jugando con datos de BD en Python"](https://www.youtube.com/watch?v=wI2xEioDPgM).

## Cómo acceder a BD desde Python

Base dos Dados Mais es nuestro *datalake* de datos públicos **limpios, integrados y actualizados** por nuestro equipo de datos: datos listos para el análisis.

El *datalake* se mantiene en Google BigQuery y tiene un costo prácticamente nulo para todos los usuarios: dispone de 1 TB al mes para consultar los datos. Para facilitar aún más la vida de los pythonistas, creamos un paquete de acceso directo al repositorio: **basedosdados**

```sh
# rode para instalar no Python/Jupyter
!pip install basedosdados
```
```python
import basedosdados as bd
```
> **Atención.** Es necesario crear un proyecto en Google Cloud para consultar los datos del datalake. La primera vez que ejecute cualquier función del paquete aparecerán las instrucciones y bastará con seguir el paso a paso. Utilice el **ID del proyecto** generado para ejecutar las funciones que siguen.

El paquete tiene muchas funciones, tanto de acceso como de publicación de datos en nuestro proyecto de Google Cloud o en el suyo: también puede usarlo para construir su propio repositorio de datos. La lista completa de módulos está en [nuestra documentación](https://basedosdados.org/docs/api_reference_python), y vea también cómo colaborar [subiendo datos al repositorio](https://basedosdados.org/docs/colab_data).

## Explorando las funciones del paquete

Como ilustración, puede consultar todos los conjuntos de datos disponibles en el *datalake* con la función `list_datasets`. Esta función devuelve todos los conjuntos, que pueden filtrarse por un término concreto con el parámetro `filter_by`. Abajo mostramos cómo hacerlo buscando datos del IBGE. El parámetro `with_description` indica si queremos ver también la descripción de cada conjunto.

```python
bd.list_datasets(filter_by="ibge", with_description=True)
```
Del mismo modo, se pueden listar las tablas de un conjunto concreto con la función `list_dataset_tables`. Además, se puede tener una visión completa de las columnas y sus tipos con `get_table_columns`, todo ello sin cargar aún los datos en el entorno.

```python
# Lista as tabelas do conjunto de dados sobre nomes no Brasil
bd.list_dataset_tables(
  dataset_id="br_ibge_nomes_brasil",
  with_description=True
)

# Consultando as colunas de uma das tabelas do conjunto
bd.get_table_columns(
  dataset_id="br_ibge_nomes_brasil",
  table_id="quantidade_municipio_nome_2010"
)
```
Antes de cargar los datos conviene comprobar su tamaño total: hay tablas muy grandes en el repositorio, así que recomendamos encarecidamente este paso.

```python
bd.get_table_size(
  dataset_id="br_ibge_nomes_brasil",
  table_id="quantidade_municipio_nome_2010",
  billing_project_id="seu-id-projeto"
)
```
Por último, la función `read_table` carga los datos en el entorno de Python. Si la base en cuestión es muy grande, puede optar por `read_sql`, que permite ejecutar una consulta SQL y cargar solo los datos solicitados. En ambos casos es necesario indicar su `billing_project_id`, el proyecto habilitado al principio, que se cobrará si supera el límite gratuito.

```python
df = bd.read_table(
  dataset_id="br_ibge_nomes_brasil",
  table_id="quantidade_municipio_nome_2010",
  billing_project_id="seu-id-projeto"
)
```
En este ejemplo trabajamos con los datos de [nombres brasileños del Censo Demográfico 2010 del IBGE](/dataset/703f9f0d-caee-4b47-b900-46b1dea2c33c?table=3bc00c7a-28e5-421b-b310-b32bed3dd4d4). Según el Censo, Brasil tiene unos 200 millones de habitantes con más de 130 mil nombres distintos. ¿Curioso? Nosotros también.

## Construyendo un análisis: ¿cuáles son los nombres más comunes en Brasil?

¿Su apuesta, María o João? Vamos a descubrirlo con los datos.

Para responder, contamos la frecuencia de cada nombre en Brasil y ordenamos poniendo los más frecuentes arriba. Después creamos una nube de palabras para visualizar esa información.

Escribimos la función `generate_list_sorted_by_freq`, que agrega los nombres de la tabla contando cuántas veces aparece cada uno, y ordena la lista por frecuencia. El código va más abajo.

Para crear la imagen usamos la biblioteca `wordcloud` junto con `matplotlib`, ambas instalables vía `pip`. `wordcloud` genera una imagen en la que el tamaño de cada palabra viene dado por su frecuencia, lo que da un buen efecto visual a nuestro ranking.

Y el resultado: **María es la ganadora.**

<Image src="/blog/intro-ao-pacote-basedosdados-em-python/image_1.jpg" caption="Nube de palabras con los nombres más frecuentes en Brasil. El tamaño de cada palabra corresponde a lo común que es ese nombre. El mayor de la imagen es Maria, seguido de José, João, Antônio y Francisco."/>

**¿Qué le pareció este hallazgo?** En el próximo texto traeremos un análisis regional que Fred construyó en el mismo taller. Vea este y otros talleres en nuestro [YouTube](https://www.youtube.com/c/BasedosDados).

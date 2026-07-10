---
title: Guía de uso de los datos de CNPJ
description: >-
  Guía de uso de los datos de CNPJ. Este material contiene información sobre las variables más importantes, preguntas frecuentes y ejemplos de uso del conjunto de la RAIS 
date:
  created: "2024-11-28T18:18:06.419Z"
thumbnail: 
categories: [guia-de-uso]
authors:
  - name: Laura Amaral
    role: Texto
---

# Introducción

> Esta guía contiene información detallada sobre los datos. Para dudas sobre el acceso o el uso de la plataforma, consulta nuestra [página de Preguntas Frecuentes](/faq).

Este conjunto posee cuatro tablas de microdatos:  
- **Empresas:** Cada fila representa una empresa y sus atributos. Las columnas describen sus atributos, como la naturaleza jurídica y el tipo de estructura societaria. 
- **Socios:** Cada fila representa un socio de una empresa. Las columnas describen las características del socio y califican su relación con la empresa.
- **Establecimientos:** Cada fila representa un establecimiento de operación de una empresa. Las columnas detallan información sobre ubicación, actividad económica e información de contacto.
- **Simples:** Cada fila representa una empresa e indica si la empresa está en el Simples Nacional o el MEI.  

La tabla que relaciona a todas ellas es la tabla Empresas. Una empresa puede tener varios socios, varios establecimientos y puede estar clasificada como Simples Nacional o MEI. 

Las tablas Empresas, Socios y Establecimientos se publican en formato de fotografías. Para cada fecha, se tiene un retrato del Registro Nacional de Personas Jurídicas (CNPJ) y sus atributos.

# Consideraciones para los análisis
## Diferencia entre establecimientos y empresas
Una empresa puede tener varios establecimientos. La columna `cnpj_basico` se refiere a la empresa, y la columna `cnpj` se refiere al establecimiento. Por lo tanto, el `cnpj_basico` de la empresa se repite en proporción al número de establecimientos en la tabla Establecimientos. Parte de la información de la tabla Empresas, como la naturaleza jurídica, puede asignarse a los establecimientos. Para ello, es necesario cruzar los datos de la tabla de empresas con los de sus establecimientos.

## Filtrado de CNPJ activos
Para filtrar solo los CNPJ activos, usa la columna `situacao_cadastral`.

# Limitaciones
Los datos están disponibles solo a partir del 23-11-2021. No es posible acceder a los registros anteriores a esa fecha. Sin embargo, la base es acumulativa y no excluye registros. Solo actualiza la situación registral y los atributos de los CNPJ. Así, aunque no se puedan seguir los cambios anteriores al 23-11-2021, es posible consultar todos los CNPJ que alguna vez se abrieron en Brasil.

# Inconsistencias
Hasta el momento no se han reportado inconsistencias en este conjunto de datos.

# Observaciones a lo largo del tiempo
Los datos se publican en formato de fotografías. Para cada fecha, se tiene un retrato de los CNPJ y sus atributos. Con excepción de la tabla Simples, la columna de fecha indica la fecha en que se extrajeron los datos. Los datos anteriores al 23-11-2021 se presentan con el estado correspondiente a esa fecha.

# Filas duplicadas
En la mayoría de los archivos publicados por la Receita Federal, hay solo algunas decenas de filas duplicadas en los datos. Estas duplicaciones provienen de la fuente original y representan menos del 0,1% del total, lo que normalmente no afecta los análisis.

Sin embargo, en dos fechas específicas, los archivos de la Receita Federal contienen un número significativo de filas duplicadas:
  - Tabla Socios en la fecha 2024-09-18: se encontraron 4.625.789 filas duplicadas
  - Tabla Establecimientos en la fecha 2024-10-16: se encontraron 8.100.851 filas duplicadas
Estas filas duplicadas no fueron eliminadas de las tablas. Durante las pruebas de integridad, se observó que el número de CNPJ únicos fue menor que el registrado en fechas anteriores. Esto indica que las duplicaciones podrían haber sustituido CNPJ que deberían estar presentes en las tablas.

# Cruces
Las tablas pueden cruzarse usando las columnas `cnpj_básico` y `data`. Es necesario entender las claves únicas de cada tabla para evitar duplicaciones.

# Descarga de los datos
Los microdatos suman más de 300 GB. Para evitar sobrecargar tu computadora, recomendamos usar queries en BigQuery para procesar los datos en la nube antes de descargarlos. Filtra por las columnas de partición (como año y UF) y selecciona solo las columnas relevantes.

# Instrumento de recolección
El instrumento de recolección actual es el Documento Básico de Entrada (DBE), utilizado por la Receita Federal para registrar, modificar o dar de baja el registro de una persona jurídica.
  
# Cambios en la recolección
No hubo cambios en la metodología de recolección desde 2021 hasta el momento de elaboración de esta guía (08-01-2025).

# Actualizaciones
Los datos se actualizan después del día 15 de cada mes. Nuestra plataforma realiza verificaciones automáticas diarias para detectar actualizaciones.

# Datos identificados
Los datos de CPF de los socios se ponen a disposición de forma anonimizada. No es posible obtener la base identificada. 

# Tratamientos realizados por BD:
En esta guía, los tratamientos se describen en un lenguaje más accesible. De manera complementaria, los [códigos de tratamiento](https://github.com/basedosdados/pipelines/blob/main/pipelines/datasets/br_me_cnpj/tasks.py#L50C1-L50C74) y las [modificaciones realizadas en BigQuery](https://github.com/basedosdados/pipelines/tree/main/models/br_me_cnpj) están disponibles en el repositorio de GitHub para consulta.

## Tabla Empresas
- Sustitución de ',' por '.' en la columna `capital_social`
- Relleno con ceros (0) a la izquierda hasta una longitud máxima de 8 dígitos en la columna `cnpj_basico`
- Relleno con ceros (0) a la izquierda hasta una longitud máxima de 4 dígitos en la columna `natureza_juridica`

## Tabla Socios
- Adecuación de la columna `data_entrada_sociedade` al estándar año-mes-día (%Y-%m-%d)
- Relleno con ceros (0) a la izquierda hasta una longitud máxima de 8 dígitos en la columna `cnpj_basico`
- Sustitución del valor que identifica valores nulos de CPF de "***000000***" por ""

## Tabla Establecimientos
- Relleno con ceros (0) a la izquierda hasta una longitud máxima de 8 dígitos en la columna `cnpj_basico`
- Relleno con ceros (0) a la izquierda hasta una longitud máxima de 4 dígitos en la columna `cnpj_ordem`
- Relleno con ceros (0) a la izquierda hasta una longitud máxima de 2 dígitos en la columna `cnpj_dv`
- Creación de la columna `cnp` mediante la unión de los valores de las columnas `cnpj_basico`, `cnpj_ordem` y `cnpj_dv`
- Creación de la columna `id_municipio` de 7 dígitos del IBGE a partir de la columna `id_municipio_rf` (ID de municipio de la Receita Federal)
- Adecuación de las columnas `data_situacao_cadastral`, `data_situacao_especial` y `data_inicio_atividade` al estándar año-mes-día (%Y-%m-%d)

## Tabla Simples
- Sustitución de los valores N por 0 y S por 1 en la columna `opcao_simples`
- Sustitución de los valores N por 0 y S por 1 en la columna `opcao_mei`
- Relleno con ceros (0) a la izquierda hasta una longitud máxima de 8 dígitos en la columna `cnpj_basico`
- Adecuación de las columnas `data_opcao_simples`, `data_exclusao_simples`, `data_opcao_mei` y `data_exclusao_mei` al estándar año-mes-día (%Y-%m-%d)



# Materiales de apoyo
* [Evaluación de confidencialidad de la información contenida en los Datos Abiertos del Registro Nacional de Personas Jurídicas (CNPJ)](https://www.gov.br/receitafederal/dados/nota-cocad-rfb-86-2024.pdf/)
* [Tutorial de BD sobre cómo acceder y analizar datos de CNPJ usando SQL, Python o R](https://www.youtube.com/watch?v=WQruVEizTlc&t=1782s)

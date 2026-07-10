---
title: Plantilla de Guía de Uso
description: >-
  Esta plantilla sirve como referencia para las guías de uso. En ella deben describirse los estándares definidos con el equipo. Si te parece interesante incluir algún estándar, puedes agregarlo aquí y lo evaluaremos.  
date:
  created: "2024-11-28T18:18:06.419Z"
thumbnail: 
categories: [guia-de-uso]
authors:
  - name: Laura Amaral
    role: Texto
---
<!-- En esta plantilla dejamos los textos de la guía del CNPJ para que sirvan de ejemplo

Estándares generales:
- Utilizar siempre los términos "conjunto" y "tabla". Debe evitarse el uso aislado de las palabras "base" y "datos" para garantizar claridad sobre el elemento al que se hace referencia.  
- Priorizar un lenguaje directo y conciso. Se recomienda utilizar ChatGPT para revisar el texto y hacerlo más objetivo.
 -->


# Introducción
<!-- Toda guía comienza con este breve aviso para que los usuarios nuevos puedan orientarse.-->
> Esta guía contiene información detallada sobre los datos. Para dudas sobre el acceso o el uso de la plataforma, consulta nuestra [página de Preguntas Frecuentes](/faq).

<!-- En la introducción describimos las tablas que componen el conjunto.
Esta descripción debe incluir necesariamente: 
  - Si la tabla contiene microdatos o datos agregados 
  - Una explicación de lo que representa cada fila de la tabla
  - Un resumen de las columnas
Si hay alguna información clave para entender el conjunto, también puede agregarse aquí. Pero cuida no agregar demasiada información: el resto de la guía sirve para describir mejor el conjunto.  
   -->
Este conjunto posee cuatro tablas de microdatos:  
- **Empresas:** Cada fila representa una empresa y sus atributos. Las columnas describen sus atributos, como la naturaleza jurídica y el tipo de estructura societaria.  
- **Socios:** Cada fila representa un socio de una empresa. Las columnas describen algunas características del socio y califican su relación con la empresa.
- **Establecimientos:** Cada fila representa un establecimiento de operación de una empresa. Las columnas detallan información sobre ubicación, actividad económica e información de contacto.
- **Simples:** Cada fila representa una empresa e indica si la empresa está en el Simples Nacional o el MEI.  

La tabla que relaciona a todas ellas es la tabla Empresas. Una empresa puede tener varios socios, varios establecimientos y puede estar clasificada como Simples Nacional o MEI. 

Las tablas Empresas, Socios y Establecimientos se publican en formato de fotografías. Para cada fecha, se tiene un retrato del Registro Nacional de Personas Jurídicas (CNPJ) y sus atributos.

# Consideraciones para los análisis
<!-- Aquí incluimos, en distintos apartados, diversas consideraciones para los análisis; esta es la categoría más abierta de la guía. Intentamos incluir las preguntas frecuentes, consejos de uso y confusiones comunes -->
## Diferencia entre establecimientos y empresas
Una empresa puede tener varios establecimientos. La columna `cnpj_basico` se refiere a la empresa, y la columna `cnpj` se refiere al establecimiento. Por lo tanto, el `cnpj_basico` de la empresa se repite en proporción al número de establecimientos en la tabla Establecimientos. Parte de la información de la tabla Empresas, como la naturaleza jurídica, puede asignarse a los establecimientos. Para ello, es necesario cruzar los datos de la tabla de empresas con los de sus establecimientos.

## Filtrado de CNPJ activos
Para filtrar solo los CNPJ activos, usa la columna `situacao_cadastral`.

# Limitaciones
<!-- A diferencia del apartado de consideraciones, este espacio es específicamente para las limitaciones que impone el conjunto de datos disponible; puede ser una limitación metodológica o una limitación impuesta por la cobertura temporal -->
Los datos están disponibles solo a partir del 23-11-2021. No es posible acceder a los registros anteriores a esa fecha. Sin embargo, la base es acumulativa y no excluye registros. Solo actualiza la situación registral y los atributos de los CNPJ. Así, aunque no se puedan seguir los cambios anteriores al 23-11-2021, es posible consultar todos los CNPJ que alguna vez se abrieron en Brasil.

# Inconsistencias
<!-- Aquí incluimos información sobre las inconsistencias que ya hemos encontrado en la base; es útil incluir la explicación del origen de las inconsistencias-->
Todavía no tenemos inconsistencias reportadas

# Observaciones a lo largo del tiempo
<!-- El objetivo de este apartado es explicar cómo seguir las observaciones a lo largo del tiempo y aportar algún consejo o información adicional sobre el tema -->
Los datos se publican en formato de fotografías. Para cada fecha, se tiene un retrato de los CNPJ y sus atributos. Con excepción de la tabla Simples, la columna de fecha indica la fecha en que se extrajeron los datos. Los datos anteriores al 23-11-2021 se presentan con el estado correspondiente a esa fecha.

# Filas duplicadas
<!-- Apartado desarrollado específicamente para indicar si existen filas duplicadas; es útil incluir información sobre por qué ocurre esto y cómo solucionarlo-->
Hay algunas decenas de filas duplicadas en el conjunto de datos. Estas duplicaciones provienen de la fuente original y representan menos del 0,1% de los datos, lo que generalmente no afecta los análisis.

# Cruces
<!-- Aquí presentamos particularidades del cruce de las tablas del conjunto; puede incluir cruces internos, dentro del propio conjunto, y cruces externos, con bases fuera de este conjunto -->
Las tablas pueden cruzarse usando las columnas `cnpj_básico` y `data`. Es necesario entender las claves únicas de cada tabla para evitar duplicaciones.

# Descarga de los datos
<!-- Aquí destacamos la posibilidad o no de descarga directa de los datos. Comenzamos el apartado señalando el tamaño de las tablas y luego indicando cómo evitar sobrecargas. El objetivo es advertir a quienes no conocen conjuntos muy grandes que a veces no es posible hacer una descarga directa y es necesario aplicar filtros  -->
Los microdatos suman más de 300 GB. Para evitar sobrecargar tu computadora, recomendamos usar queries en BigQuery para procesar los datos en la nube antes de descargarlos. Filtra por las columnas de partición (como año y UF) y selecciona solo las columnas relevantes.

# Instrumento de recolección
<!-- Este apartado describe cómo es el instrumento de recolección de los datos. Esto importa porque aporta más contexto para los datos y permite identificar posibles sesgos y limitaciones que no listamos antes -->
El instrumento de recolección actual es el Documento Básico de Entrada (DBE), utilizado por la Receita Federal para registrar, modificar o dar de baja el registro de una persona jurídica.
  
# Cambios en la recolección
<!-- El objetivo aquí es advertir a los usuarios si hubo algún cambio en los datos a lo largo de la serie temporal; esto es muy importante para que los análisis se realicen con calidad -->
No hubo cambios en la metodología de recolección desde 2021 hasta el momento de elaboración de esta guía (08-01-2025).

# Actualizaciones
<!-- Aquí explicamos cómo se realiza la actualización en la fuente original, si ocurre en alguna época específica del año o del mes y si existe algún calendario. Este apartado es importante para que los usuarios sepan cuándo esperar que se actualicen los datos-->
Los datos se actualizan después del día 15 de cada mes. Nuestra plataforma realiza verificaciones automáticas diarias para detectar actualizaciones.

# Datos identificados
<!-- El objetivo de este apartado es orientar a los usuarios sobre si existen datos identificados o si los datos están anonimizados. Muchos usuarios están interesados en datos desanonimizados, pero pocas bases cuentan con esa información -->
Los datos de CPF de los socios se ponen a disposición de forma anonimizada. No es posible obtener la base identificada. 

# Tratamientos realizados por BD:
<!-- Aquí describimos los tratamientos de manera más directa, para que incluso quien no sabe programar entienda cuáles fueron los tratamientos realizados. Aun así, es necesario dejar los enlaces para quienes quieran verificar el proceso. Si es necesario, los tratamientos pueden separarse en tablas-->
En esta guía, los tratamientos se describen en un lenguaje más accesible. De manera complementaria, los [códigos de tratamiento](https://github.com/basedosdados/pipelines/blob/main/pipelines/datasets/br_me_cnpj/tasks.py#L50C1-L50C74) y las [modificaciones realizadas en BigQuery](https://github.com/basedosdados/queries-basedosdados/tree/main/models/br_me_cnpj) están disponibles en el repositorio de GitHub para consulta.

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
<!-- Por último incluimos materiales de apoyo, para que el usuario pueda consultar información directamente desde las fuentes originales o complementar la comprensión de la base -->
* [Evaluación de confidencialidad de la información contenida en los Datos Abiertos del Registro Nacional de Personas Jurídicas (CNPJ)](https://www.gov.br/receitafederal/dados/nota-cocad-rfb-86-2024.pdf/)
* [Tutorial de BD sobre cómo acceder y analizar datos de CNPJ usando SQL, Python o R](https://www.youtube.com/watch?v=WQruVEizTlc&t=1782s)

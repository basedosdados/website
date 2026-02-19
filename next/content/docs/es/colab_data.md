---
title: Datos
category: Contribuir
order: 0
---

# Datos

## ¿Por qué mi organización debería subir datos a BD?

- **Capacidad de cruzar sus bases con datos de diferentes
  organizaciones** de forma sencilla y fácil. Ya hay cientos de conjuntos
  de datos públicos de las organizaciones más grandes de Brasil y del mundo presentes
  en nuestro *datalake*.

- **Compromiso con la transparencia, la calidad de los datos y el
  desarrollo de mejores investigaciones, análisis y soluciones** para la
  sociedad. No solo democratizamos el acceso a datos abiertos, sino también a datos
  de calidad. Contamos con un equipo especializado que revisa y garantiza la calidad de los
  datos añadidos al *datalake*.

- **Participación de una comunidad cada vez más grande**: miles
  de periodistas, investigadores y desarrolladores ya utilizan y
  siguen la Base de Datos.
  {/* TODO: Poner aquí el enlace a nuestro panel de audiencia cuando esté listo :) */}

## Paso a paso para subir datos

¿Quieres subir datos a la BD y ayudarnos a construir este repositorio?
*¡Genial!* Hemos organizado todo lo que necesitas en el siguiente manual en 8 pasos

Para facilitar la explicación, seguiremos un ejemplo ya preparado con datos de [RAIS](/es/dataset/3e7c4d58-96ba-448e-b053-d385a829ef00?table=86b69f96-0bfe-45da-833b-6edc9a0af213).

<Tip caption="Puede navegar por los pasos en el menú de la izquierda">

 ¡Le recomendamos encarecidamente que se una a nuestro [canal en Discord](https://discord.gg/huKWpsVYx4) para resolver dudas e interactuar con el equipo y otros colaboradores! 😉
</Tip>

### Antes de empezar

Para llevar a cabo este proceso, es necesario tener algunos conocimientos:

- **Python, R y/o SQL**: para crear los códigos de captura y limpieza de datos.
- **Línea de comandos**: para configurar tu entorno local
  y la conexión con Google Cloud.
- **Github**: para subir tu código para que lo revise
  nuestro equipo.

<Tip caption="¿No tienes ninguna de estas habilidades, pero quieres colaborar?">

Tenemos un equipo de datos que puede ayudarte, solo tienes que entrar en [nuestro Discord](https://discord.gg/huKWpsVYx4) y enviar un mensaje a #quiero-contribuir.
</Tip>

### ¿Cómo funciona el proceso?

- [1. Elegir la base y comprender mejor los datos](#1-elegir-la-base-y-comprender-mejor-los-datos) - primero necesitamos saber de qué estamos hablando.
- [2. Descargar nuestra carpeta de plantillas](#2-descargar-nuestra-carpeta-de-plantillas) - es hora de estructurar el trabajo que hay que hacer
- [3. Rellenar las tablas de arquitectura](#3-rellenar-las-tablas-de-arquitectura) - es fundamental definir la estructura de los datos antes de comenzar el tratamiento
- [4. Escribir código de captura y limpieza de datos](#4-escribir-codigo-de-captura-y-limpieza-de-datos) - ¡Es hora de ponerse manos a la obra!
- [5. (Si es necesario) Organizar archivos auxiliares](#5-si-es-necesario-organizar-archivos-auxiliares) -  porque incluso los datos necesitan guías
- [6. (Si es necesario) Crear tabla de diccionario](#6-si-es-necesario-crear-tabla-de-diccionario) - momento de montar los diccionarios
- [7. Subir todo a Google Cloud](#7-subir-todo-a-google-cloud) - al fin y al cabo, ahí es donde se encuentran los datos de la base de datos
- [8. Enviar todo para revisión](#8-enviar-todo-para-revisión) - ¡nuestro equipo lo revisará para garantizar que todo está listo para entrar en producción!

### 1. Elige la base y aprende más sobre los datos


Mantenemos la lista de conjuntos para voluntarios en nuestro [Github](https://github.com/orgs/basedosdados/projects/17/views/9). Para empezar a subir una base que le interese, solo tiene que abrir una [nueva incidencia](https://github.com/basedosdados/pipelines/issues/new?template=new-data.yml) de datos. Si su base (conjunto) ya aparece en la lista, solo tiene que marcar su usuario de Github como «assignee»

Tu primera tarea es completar la información en la incidencia. Esta información te ayudará a comprender mejor los datos y será muy útil para el tratamiento y la cumplimentación de metadatos.

Cuando finalices esta etapa, llama a alguien del equipo de datos para que la información que has mapeado sobre el conjunto se introduzca en nuestro sitio web.

### 2. Descargar nuestra carpeta de plantillas

[Descarga aquí la carpeta
_template_](https://drive.google.com/drive/folders/1xXXon0vdjSKr8RCNcymRdOKgq64iqfS5?usp=sharing)
 y renómbrala como `<dataset_id>` (definido en el paso [1](#-1-Elegir-la-base-y-comprender-mejor-los-datos)). Esta carpeta de plantilla facilita y organiza todos los
pasos a partir de ahora. Su
estructura es la siguiente:

- `<dataset_id>/`
    - `code/`: Códigos necesarios para **capturar** y **limpiar** los datos
    ([veremos más en el paso
    4](#4-escribir-código-de-captura-y-limpieza-de-datos)).
    - `input/`: Contiene todos los archivos con los datos originales, tal y como
    se descargaron de la fuente primaria. ([veremos más en el paso
    4](#4-escribir-código-de-captura-y-limpieza-de-datos)).
    - `output/`: Archivos finales, ya en formato listo para subir a la base de datos ([veremos más en el paso
    4](#4-escribir-código-de-captura-y-limpieza-de-datos)).
- `tmp/`: Cualquier archivo temporal creado por el código en `/code` durante el proceso de limpieza y tratamiento ( [veremos más en el paso
    4](#4-escribir-código-de-captura-y-limpieza-de-datos)).
    - `extra/`
        - `architecture/`: Tablas de arquitectura ([veremos más en el paso 3](#3-rellenar-las-tablas-de-arquitectura)).
        - `auxiliary_files/`: Archivos auxiliares de los datos ([veremos más en el paso 5](#5-si-es-necesario-organizar-archivos-auxiliares)).
        - `dicionario.csv`: Tabla diccionario de todo el conjunto de datos ([veremos más en el paso 6](#6-si-es-necesario-crear-tabla-diccionario)).


<Tip caption="Solo la carpeta `code` se confirmará en su proyecto, los demás archivos solo existirán localmente o en Google Cloud."/>


### 3. Rellenar las tablas de arquitectura

Las tablas de arquitectura determinan **la estructura de
cada tabla de su conjunto de datos**. Definen, por ejemplo, el nombre, el orden y los metadatos de las variables, además de las compatibilidades cuando hay cambios en las versiones (por
ejemplo, si una variable cambia de nombre de un año a otro).

<Tip caption="Cada tabla del conjunto de datos debe tener su propia tabla de arquitectura (hoja de cálculo), que debe completarse en **Google Drive** para que nuestro equipo de datos pueda corregirla."/>


#### Ejemplo: RAIS - Tablas de arquitectura

Las tablas de arquitectura de RAIS [pueden consultarse aquí](https://docs.google.com/spreadsheets/d/1dPLUCeE4MSjs0ykYUDsFd-e7-9Nk6LVV/edit?usp=sharing&ouid=103008455637924805982&rtpof=true&sd=true). Son una excelente referencia para comenzar su trabajo, ya que contienen muchas variables y ejemplos de diversas situaciones con las que se puede encontrar.

#### Para completar cada tabla de su conjunto, siga estos pasos:

<Tip caption="Al inicio y final de cada etapa consulta nuestro [manual de estilo](style_data) para garantizar que estás siguiendo la estandarización de BD"/>

1. Enumere todas las variables de los datos en la columna `original_name`
- Nota: Si la base cambia el nombre de las variables a lo largo de los años (como la RAIS), es necesario hacer la compatibilidad entre años para todas las variables rellenando la columna `original_name_YYYY` para cada año o mes disponible
2. Renombrar las variables según nuestro [manual](style_data) en la columna «name»
3. Comprender el tipo de variable y rellenar la columna «bigquery_type»
4. Rellenar la descripción en «description» según el [manual] (style_data).
5. A partir de la compatibilidad entre años y/o consultas a los datos brutos, rellenar la cobertura temporal en `temporal_coverage` de cada variable.
- Nota: Si las variables tienen la misma cobertura temporal que la tabla, rellenar solo con «(1)».
6. Indique con «yes» o «no» si hay un diccionario para las variables en «covered_by_dictionary».
7. Compruebe si las variables representan alguna entidad presente en los [directorios](es/dataset/33b49786-fb5f-496f-bb7c-9811c985af8e? table=0a2d8187-f936-437d-89db-b4eb3a7e1735) para rellenar `directory_column`
8. Para las variables de tipo `int64` o `float64`, compruebe si es necesario incluir una [unidad de medida](https://github.com/basedosdados/website/blob/master/ckanext-basedosdados/ckanext/basedosdados/validator/available_options/measurement_unit.py)
9. Reordene las variables según el [manual](style_data)

<Tip caption="Cuando termines de completar las tablas de arquitectura, contacta con el equipo de Base de los Datos para validar todo. Es necesario que esté claro el formato final que los datos deben tener _antes_ de empezar a escribir el código. Así evitamos el retrabajo."/>

### 4. Escribir código de captura y limpieza de datos

Una vez validadas las tablas de arquitectura, podemos escribir los códigos de
**captura** y **limpieza** de los datos.

- **Captura**: Código que descarga automáticamente todos los datos originales y los guarda en `/input`. Estos datos pueden estar disponibles en portales o enlaces FTP, pueden extraerse de sitios web, entre otros.

- **Limpieza**: Código que transforma los datos originales guardados en `/input` en datos limpios, los guarda en la carpeta `/output`, para posteriormente subirlos a la base de datos.

Cada tabla limpia para producción puede guardarse como un único archivo o, si es muy grande (por ejemplo, más de 200 MB), dividirse en el formato [Hive](https://cloud.google.com/bigquery/docs/hive-partitioned-loads-gcs) en varios subarchivos. Los formatos aceptados son `.csv` o `.parquet`. Nuestra recomendación es dividir las tablas por `ano`, `mes` y `sigla_uf`. La división se realiza a través de la estructura de carpetas, vea el ejemplo a continuación para ver cómo.

#### Ejemplo: RAIS - División

La tabla `microdados_vinculos` de RAIS Vinculos, por ejemplo, es una tabla muy grande (+400 GB), por lo que la hemos particionado por `año` y `sigla_uf`. La partición se realizó utilizando la estructura de carpetas `/microdados_vinculos/ano=YYYY/sigla_uf=XX` .

#### Requisitos del código

- Debe estar escrito en [Python](https://www.python.org/) o [R](https://www.r-project.org/) -
  para que el equipo pueda revisarlo.
- Pueden estar en script (`.py`, `.R`, ...) o *notebooks* (Google Colab, Jupyter, Rmarkdown, etc).
- Las rutas de los archivos deben ser accesos directos _relativos_ a la carpeta raíz
  (`<dataset_id>`), es decir, no deben depender de las rutas de su
  ordenador.
- La limpieza debe seguir nuestro [manual de estilo](style_data) y las [mejores prácticas de programación](https://en.wikipedia.org/wiki/Best_coding_practices).

#### Ejemplo: PNAD Contínua - Código de limpieza

El código de limpieza se ha creado en R y [se puede consultar
aquí](https://github.com/basedosdados/sdk/tree/master/bases/br_ibge_pnadc/code).

#### Ejemplo: Actividad en la Cámara Legislativa - Código de descarga y limpieza
El código de limpieza se ha creado en Python [y se puede consultar aquí](https://github.com/basedosdados/sdk/tree/bea9a323afcea8aa1609e9ade2502ca91f88054c/bases/br_camara_atividade_legislativa/code)

### 5. (Si es necesario) Organizar archivos auxiliares

Es habitual que las bases de datos se proporcionen con archivos auxiliares. Estos pueden incluir notas técnicas, descripciones de recolección y muestreo, etc. Para ayudar a los usuarios de la base de datos a tener más contexto y comprender mejor los datos, organice todos estos archivos auxiliares en `/extra/auxiliary_files`.

Siéntase libre de estructurar subcarpetas como desee dentro de esta carpeta. Lo importante es que quede claro qué son estos archivos.

### 6. (Si es necesario) Crear una tabla de diccionario

A menudo, especialmente con bases antiguas, hay múltiples diccionarios en formatos Excel u otros. En la Base de Datos unificamos todo en un único archivo en formato `.csv`: un único diccionario para todas las columnas de todas las tablas de su conjunto.


<Tip caption="Los detalles importantes sobre cómo construir su diccionario se encuentran en nuestro [manual de estilo](style_data)."/>

#### Ejemplo: RAIS - Diccionario

El diccionario completo [se puede consultar aquí](https://docs.google.com/spreadsheets/d/12Wwp48ZJVux26rCotx43lzdWmVL54JinsNnLIV3jnyM/edit?usp=sharing). Ya tiene la estructura estándar que utilizamos para los diccionarios.

### 7. Subir todo a Google Cloud

¡Todo listo! Ahora solo falta subirlo a Google Cloud y enviarlo para su revisión. Para ello, utilizaremos el cliente `basedosdados` (disponible en Python), que facilita la configuración y los pasos del proceso.

<Tip caption="Dado que el almacenamiento tiene un coste, para finalizar este paso necesitaremos proporcionarte una api_key específica para voluntarios para subir los datos a nuestro entorno de desarrollo. Para ello, entra en nuestro [canal de Discord](https://discord.gg/huKWpsVYx4), envíanos un mensaje con «quiero-contribuir» y etiqueta a `@equipe_dados`."/>


#### Configure sus credenciales localmente
**7.1** En su terminal, instale nuestro cliente: `pip install basedosdados`.

**7.2** Ejecute `import basedosdados as bd` en Python y siga los pasos para configurar localmente con las credenciales de su proyecto en Google Cloud. Rellene la información como se indica a continuación:

```
    * PASO 1: y
    * PASO 2: basedosdados-dev  (coloque el .json proporcionado por el equipo de bd en la carpeta credentials)
    * PASO 3: y
    * PASO 4: basedosdados-dev
    * PASO 5: https://api.basedosdados.org/api/v1/graphql
```
#### Suba los archivos a la nube
Los datos pasarán por tres lugares en Google Cloud:

  * **Almacenamiento**: también llamado GCS, es el lugar donde se almacenarán los archivos «fríos» (arquitecturas, datos, archivos auxiliares).
  * **BigQuery-DEV-Staging**: tabla que conecta los datos del almacenamiento con el proyecto basedosdados-dev en bigquery.
  * **BigQuery-DEV-Produção**: tabla utilizada para pruebas y tratamiento mediante SQL del conjunto de datos.

**7.3** Cree la tabla en el *bucket de GCS* y *BigQuey-DEV-staging*, utilizando la API de Python, de la siguiente manera:

```python
import basedosdados as bd

DATASET_ID = «dataset_id» 
TABLE_ID = «table_id»

tb = bd.Table(dataset_id=DATASET_ID, table_id=TABLE_ID)
``` 


```python
tb.create(
path=path_to_data,
if_storage_data_exists="raise",
if_table_exists="replace",
source_format="csv",)

```

<Tip caption="Si tus datos están particionados, la ruta debe apuntar a la carpeta donde están las particiones. En caso contrario, debe apuntar a un archivo `.csv` (por ejemplo, microdados.csv).">

 Si el proyecto no existe en BigQuery, se creará automáticamente.

 Consulte también nuestra [API](https://basedosdados.org/docs/api_reference_python) para obtener más detalles sobre cada método.
</Tip>


**7.4** Cree los archivos .sql y schema.yml a partir de la tabla de arquitectura para ejecutar la materialización y las pruebas en dbt (data build-tool):

```python
from databasers_utils import TableArchitecture

arch = TableArchitecture(
    dataset_id="<dataset-id>",
    tables={
        «<table-id>»: «URL de la arquitectura de Google Sheet»,  # Ejemplo https://docs.google.com/spreadsheets/d/1K1svie4Gyqe6NnRjBgJbapU5sTsLqXWTQUmTRVIRwQc/edit?usp=drive_link
    },
)

# Crea el archivo yaml
arch.create_yaml_file()

# Crea los archivos sql
arch.create_sql_files()

# Actualiza el dbt_project.yml
arch.update_dbt_project()

  ```

<Tip caption="Si lo necesita, en este momento puede modificar la consulta en SQL para realizar tratamientos finales a partir de la tabla `staging`, puede incluir columnas, eliminar columnas, realizar operaciones algebraicas, sustituir cadenas, etc. ¡El SQL es el límite!"/>


## 8. Uso de DBT
#### Macro `set_datalake_project`

Los archivos sql de dbt utilizan la macro `set_datalake_project`, que indica de qué proyecto (basedosdados-staging o basedosdados-dev) se consumirán los datos. Al crear los archivos con la función `create_sql_files`, se insertará la macro.

```sql
select
    col_name
from {{ set_datalake_project(«<DATASET_ID>_staging.<TABLE_ID>») }}
```


### Materialización del modelo en BigQuery

Materializa un único modelo por su nombre en basedosdados-dev consumiendo los datos de `basedosdados-dev.{table_id}_staging`

```sh
dbt run --select dataset_id__table_id
```

Materializa todos los modelos en una carpeta en basedosdados-dev consumiendo los datos de `basedosdados-dev.{table_id}_staging`

```sh
dbt run --select model.dateset_id.dateset_id__table_id
```

Materializa todos los modelos en la ruta en basedosdados-dev consumiendo los datos de `basedosdados-dev.{table_id}_staging`

```sh
dbt run --select models/dataset_id
```

Materializa un único modelo por la ruta del archivo sql en basedosdados-dev consumiendo los datos de `basedosdados-dev.{table_id}_staging`

```sh
dbt run --select models/dataset/table_id.sql
```

### Probando el modelo en BigQuery

Prueba un único modelo

```sh
dbt test --select dataset_id__table_id
```

Prueba todos los modelos de una carpeta

```sh
dbt test --select model.dateset_id.dateset_id__table_id
```

Prueba todos los modelos de la ruta

```sh
dbt test --select models/dataset_id
```

**7.6** Suba los metadatos de la tabla al sitio web:

<Tip caption="Por ahora, solo el equipo de datos tiene permisos para subir los metadatos de la tabla al sitio web, por lo que será necesario ponerse en contacto con nosotros. Ya estamos trabajando para que, en un futuro próximo, los voluntarios también puedan actualizar los datos en el sitio web."/>


### 8. Enviar todo para revisión

¡Ya está! Ahora solo queda enviar todo para revisión al
[repositorio](https://github.com/basedosdados/pipelines) de la Base de Datos.

1. Clona nuestro [repositorio](https://github.com/basedosdados/pipelines) localmente.
2. Escribe «cd» en la carpeta local del repositorio y abre una nueva rama con «git checkout -b [dataset_id]». Todas las adiciones y modificaciones se incluirán en esta rama.
3. Para cada tabla nueva, incluya el archivo con el nombre `dataset__table_id.sql` en la carpeta `pipelines/models/dataset_id/` copiando las consultas y el esquema que ha creado en el paso 7.
4. Incluye tu código de captura y limpieza en la carpeta `pipelines/models/dataset_id/code`
5. Ahora solo tienes que publicar la rama, abrir la PR con las etiquetas «table-approve» y marcar al equipo de datos para su corrección

**¿Y ahora qué?** Nuestro equipo revisará los datos y metadatos enviados a través de Github. Es posible que nos pongamos en contacto contigo para aclarar dudas o solicitar cambios en el código. Cuando todo esté bien, fusionaremos tu solicitud de extracción y los datos se publicarán automáticamente en nuestra plataforma.

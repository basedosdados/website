---
title: Guía de uso de datos del Censo Escolar
description: >-
  Guía de uso de datos de Campeonatos de Fútbol. Este material contiene información sobre las variables más importantes, preguntas frecuentes y ejemplos de uso del conjunto.
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

Este conjunto tiene cuatro tablas de microdatos:  
- **Escuelas:** Única tabla puesta a disposición por el INEP a partir de 2021, cada fila representa una escuela. Las columnas incluyen características de la escuela, como la infraestructura física disponible, el equipo pedagógico, la infraestructura pedagógica, rasgos del período lectivo, e información agregada sobre matrículas, docentes y clases.
- **Clases:** Tabla puesta a disposición a partir de solicitudes presentadas mediante pedidos LAI (Ley de Acceso a la Información). Cada fila representa una clase activa en el año escolar, las columnas contienen información sobre las asignaturas cursadas por la clase, el horario de inicio de las clases, el número de alumnos de la clase y el nivel de enseñanza.
- **Matrículas:** Mantenida para consulta histórica, pero no se actualiza desde 2021. Cada fila representa una matrícula, las columnas incluyen variables sociodemográficas, actividades que realiza el alumno y la forma de transporte para llegar a la escuela.
- **Docentes:** Mantenida para consulta histórica, pero no se actualiza desde 2021. Cada fila representa la asignación de un docente a una clase en una escuela durante un año, las columnas contienen características sociodemográficas, información sobre su formación y detalles de la actividad del docente en la escuela.

# Consideraciones para los análisis
## Selección de variables
No ponemos a disposición todas las variables que aparecen en el Censo. Seleccionamos las variables que aparecieron 8 o más veces entre 2009 y 2020, además de otras variables que consideramos cruciales por ser identificadores importantes. Esto significa que, si una variable solo aparece en 2 años en la fuente original, por ejemplo, no fue incluida en nuestras tablas.

## Información de raza y color
La información de raza y color en el Censo Escolar es completada por la escuela, pero muchos registros quedan en blanco. Esto puede causar distorsiones en los análisis sobre este tema realizados con esta base.

Sabemos esto porque la prueba SAEB también recoge la raza de los alumnos, pero de forma diferente: son los propios estudiantes quienes la informan. Los datos del Censo Escolar y del SAEB terminan siendo bastante diferentes debido a estas diferentes metodologías.

# Limitaciones
* Los datos están disponibles a partir de 2009, ya que fue cuando la encuesta pasó a tener un formato más uniforme. Esto facilita la comparación entre los años y garantiza una mayor compatibilidad.

# Inconsistencias
Aún no se han reportado inconsistencias en este conjunto de datos.

# Observaciones a lo largo del tiempo
Los alumnos y docentes tienen información anonimizada, por lo que no es posible dar seguimiento a estas entidades a lo largo de los años en las tablas de matrículas y docentes. Las escuelas, en cambio, son identificables y pueden ser seguidas a lo largo de los años.
También cabe señalar que las tablas de matrículas y docentes dejaron de estar disponibles en 2020.

# Filas duplicadas
Aún no se han encontrado indicios de filas duplicadas en las tablas de este conjunto.

# Cruces
Dentro del propio conjunto es posible cruzar las tablas utilizando las claves id_escola, id_turma y ano. 
Además, estas tablas pueden complementarse con información de otros conjuntos del INEP:  
1. **Indicadores Escolares del INEP**: Los Indicadores Escolares del INEP presentan una serie de mediciones sobre la calidad de la enseñanza en diferentes niveles de agregación, permitiendo análisis más detallados del contexto educativo en escuelas, municipios y estados.  
2. **Sinopsis Estadísticas de la Educación Básica**: Las Sinopsis Estadísticas de la Educación Básica presentan información del Censo Escolar de manera agregada y simplificada, facilitando análisis rápidos y comparaciones entre diferentes niveles de enseñanza y regiones.  
3. **Índice de Desarrollo de la Educación Básica (Ideb)**: El dataset br_inep_ideb pone a disposición tablas que identifican las notas de los alumnos en evaluaciones de la calidad de la enseñanza, como las pruebas del SAEB, además de información sobre tasas de rendimiento, como aprobación, reprobación y abandono, y el desempeño de las escuelas en el IDEB. Junto con las tablas del Censo, se puede evaluar, por ejemplo, cómo se desempeñan en esas pruebas las escuelas con más profesores con maestría en relación con escuelas con profesores que no tienen posgrado.

# Descarga de los datos
Estas tablas son demasiado grandes para la descarga directa; es muy importante seleccionar columnas y aplicar filtros temporales o geográficos antes de descargar los datos.

Los microdatos suman más de 300 GB. Para evitar sobrecargar tu computadora, recomendamos usar queries en BigQuery para procesar los datos en la nube antes de descargarlos. Filtra por las columnas de partición (como ano y UF) y selecciona solo las columnas relevantes.

# Instrumento de recolección
Los datos del Censo Escolar se recolectan en dos etapas. En el primer semestre, las escuelas completan cinco formularios (escuelas, directivos, clases, alumnos y personal en el aula) con información de todas las instituciones de educación básica y profesional. Al final del año lectivo, la segunda etapa registra la situación de los alumnos, indicando si fueron aprobados, reprobados, transferidos, dejaron de asistir o fallecieron.

# Cambios en la recolección
El principal cambio a lo largo de los años fue la sustitución de las tablas de matrículas, docentes y directivos escolares por una única tabla de escuelas con datos agregados. A partir de 2021, esta nueva tabla incluyó 123 nuevas variables, permitiendo el acceso a cierta información sobre matrículas, docentes y directivos escolares de forma resumida.

# Actualizaciones
Los datos se actualizan anualmente, a comienzos del año siguiente a la recolección de datos.

# Tratamientos realizados por BD:


# Materiales de apoyo
[Sitio del INEP sobre el Censo Escolar](https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar): Documentos e instrucciones sobre el Censo Escolar, útil para comprender mejor el contexto y obtener materiales complementarios como los formularios que se completan, fechas de divulgación y recolección, entre otra información. 
[Nota de BD sobre el cambio en la divulgación de los datos del Censo Escolar](https://basedosdados.org/blog/nota-sobre-divulgacao-dos-dados-do-inep): Nota que expone la posición de BD sobre el cambio ocurrido en 2021

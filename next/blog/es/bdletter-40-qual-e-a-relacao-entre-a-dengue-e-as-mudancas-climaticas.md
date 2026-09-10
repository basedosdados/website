---
title: ¿Cuál es la relación entre el dengue y el cambio climático?
description: >-
  La temperatura y las lluvias pueden estar relacionadas con el aumento de casos en algunas ciudades
slug: dengue-y-cambio-climatico
date:
  created: "2025-05-07T21:02:04.375Z"
authors:
  - name: Marina Monteiro
    role: Análisis y texto
  - name: Giovane Caruso
    role: Edición y diseño
categories: [analise]
thumbnail: /blog/qual-e-a-relacao-entre-a-dengue-e-as-mudancas-climaticas/grafico_goiania.png
medum_slug: https://medium.com/@basedosdados/nota-sobre-divulga%C3%A7%C3%A3o-dos-dados-do-inep-9168291dbca0
published: true
order: 1
---

En la edición anterior de la BDletter hablamos de la epidemia de dengue y de sus números absolutos y proporcionales en las ciudades donde vive parte de nuestro equipo. En esta edición seguimos con la enfermedad, pero evaluando la relación entre el número de casos y dos variables meteorológicas: la temperatura del aire y la precipitación.

La pregunta es interesante porque el ciclo de vida del *Aedes aegypti* está estrechamente afectado por variables meteorológicas. El mosquito adquiere el virus cuando pica a alguien infectado y se vuelve infectivo, pudiendo transmitir la enfermedad a otras personas en picaduras posteriores. Con altos niveles de precipitación aumenta la oferta de criaderos. Con temperaturas altas se altera el desarrollo, la longevidad y la fecundidad de los mosquitos adultos, que prefieren temperaturas entre 22ºC y 28ºC. Un ciclo de huevo a fase adulta que suele tardar entre 7 y 10 días puede pasar a ocurrir en 3 o 4 días con temperaturas más altas.

Cabría esperar, entonces, que con mayor precipitación y mayor temperatura tuviéramos más mosquitos y que, con más mosquitos, la enfermedad se extendiera más. ¿El aumento de la temperatura y de la precipitación viene acompañado de un aumento de los casos?

Para entenderlo mejor analizamos las capitales del país observando las mediciones de temperatura y precipitación de las estaciones automáticas del [INMET](/dataset/782c5607-9f69-4e12-b0d5-aa0f1a7a94e2?utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_yEejPUipsc-cW3VKr51TG936EDjUtQ7FsruHM1xnCyYNuLd3b6JK282QA06r9HS1mxt-Q9DeZMt8UNYBdTQa6O4xDAQtBow06gCo-RD2SgZobLk4) junto con los registros de notificaciones de casos de dengue del [SINAN](/dataset/f51134c2-5ab9-4bbc-882f-f1034603147a?utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_yEejPUipsc-cW3VKr51TG936EDjUtQ7FsruHM1xnCyYNuLd3b6JK282QA06r9HS1mxt-Q9DeZMt8UNYBdTQa6O4xDAQtBow06gCo-RD2SgZobLk4), todos ellos disponibles en el datalake de Base de los Datos. Con los datos meteorológicos diarios pudimos calcular la temperatura media y el total de precipitación (mensuales y semanales, por semana epidemiológica). Puede consultar después los resultados en detalle en un dashboard interactivo que creamos; el enlace está al final del análisis.

La dinámica esperada para la distribución de casos es: elevación al inicio del período cálido, con pico de casos tras algunos meses de calor, coincidiendo con algunas semanas después del período más lluvioso. Los números más bajos deberían darse en los meses más secos y fríos.

En Goiânia ese patrón se cumple con bastante precisión a lo largo de los años. Vea la imagen siguiente.

<Image src="/blog/bdletter-40-qual-e-a-relacao-entre-a-dengue-e-as-mudancas-climaticas/grafico_goiania.png"/>

Para la capital de Goiás, los casos se concentran en algunas semanas de los picos de precipitación y temperatura. Cuando esas dos variables empiezan a bajar, el número de casos también cae.

Pero la misma dinámica no es tan evidente en la ciudad de Manaos, por ejemplo.

<Image src="/blog/bdletter-40-qual-e-a-relacao-entre-a-dengue-e-as-mudancas-climaticas/grafico_manaus.png"/>

En la capital amazonense, la relación con la precipitación aún se percibe, aunque no de la misma forma que en el ejemplo de Goiânia. La relación con la temperatura ya no parece tan directa. La explicación puede estar en que la variación de la temperatura media se sitúa entre 26ºC y 32ºC, temperaturas ya consideradas altas y siempre propicias para la proliferación del mosquito.

Otro ejemplo de este fenómeno está en la ciudad de Aracaju. A diferencia de las otras capitales, que presentan picos de casos entre febrero y abril, los picos de notificaciones en Aracaju ocurren a mitad de año, hacia junio y julio, aun siendo ese el período más "frío" de la ciudad. Pero, igual que en Goiânia, ese período todavía tiene temperaturas medias por encima de 25ºC. Los máximos de notificaciones se alinean, entonces, con los máximos de precipitación.

## ¿Qué dice la literatura?

Varias investigaciones relacionan estas variables meteorológicas con el número de casos notificados de dengue en diversas regiones. Una investigación desarrollada en la Unicamp indica que un aumento de 1ºC en la temperatura media puede tener como consecuencia un aumento aproximado del 20% al 30% en los casos de dengue en la ciudad de Campinas en los dos meses siguientes. Otros estudios apuntan a una relación con el aumento de casos locales cuando crece la pluviosidad (como en las ciudades de Belém y Ribeirão Preto).

Los factores climáticos también deben tenerse en cuenta. Los años de El Niño, por ejemplo, desplazan las lluvias del norte y el nordeste hacia el sudeste y el sur del país, donde las ciudades son más densas desde el punto de vista poblacional. Sumado a temperaturas más elevadas, eso puede producir años con más casos que los años de La Niña(\*\*).

Por supuesto, no son solo factores como los citados los que están directa o indirectamente relacionados con los casos de dengue. La urbanización, la densidad demográfica, el saneamiento básico y otras características de las ciudades, así como las políticas públicas de prevención, deben considerarse para evaluar el total de casos en una localidad.

Pero, sin duda, la temperatura y la precipitación tienen un papel importante en la propagación de la enfermedad y en las epidemias. Con la tendencia al aumento de las temperaturas medias provocada por el cambio climático podremos ver esta enfermedad proliferando cada vez más, y por lugares antes ni siquiera alcanzados. Hablamos de ello en la entrevista de este mes.

Además, preparamos un dashboard donde puede investigar los datos de la capital de su estado(\*). Evalúe si hay una tendencia de aumento en las temperaturas medias y si hay algún cambio significativo en el patrón de lluvias. ¿Hay relación entre esas variables y los casos de dengue observados?

> [Acceda al dashboard](https://climadengue.streamlit.app/?utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_yEejPUipsc-cW3VKr51TG936EDjUtQ7FsruHM1xnCyYNuLd3b6JK282QA06r9HS1mxt-Q9DeZMt8UNYBdTQa6O4xDAQtBow06gCo-RD2SgZobLk4)

También puede consultar el código utilizado en nuestro [repositorio de análisis](https://github.com/basedosdados/analises/tree/main/redes_sociais/climadengue?utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_yEejPUipsc-cW3VKr51TG936EDjUtQ7FsruHM1xnCyYNuLd3b6JK282QA06r9HS1mxt-Q9DeZMt8UNYBdTQa6O4xDAQtBow06gCo-RD2SgZobLk4) en GitHub.

(\*) Excepto Florianópolis. No encontramos datos meteorológicos de estaciones automáticas para esa capital.

(\*\*) En los años de La Niña las lluvias en el norte y el nordeste se intensifican, lo que puede llevar a un aumento de casos en esas regiones. Pero al tratarse de regiones con menor densidad poblacional, el aumento no sería tan perceptible al mirar el número total de casos del país.

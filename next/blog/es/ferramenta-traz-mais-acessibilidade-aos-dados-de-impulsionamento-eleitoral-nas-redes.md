---
title: Una herramienta que hace más accesibles los datos de impulsión electoral en redes
description: >-
  Entrevista con Sérgio Spagnuolo sobre el Observatorio de Impulsión Electoral
slug: datos-de-impulsion-electoral-mas-accesibles
date:
  created: "2024-10-30"
thumbnail: /blog/ferramenta-traz-mais-acessibilidade-aos-dados-de-impulsionamento-eleitoral-nas-redes.md/image_1.png
categories: [institucional]
authors:
  - name: Giovane Caruso
    role: Texto y entrevista
    social: https://www.linkedin.com/in/GiovaneCaruso/
    avatar: 

---

_Esta entrevista se publicó en la BDletter de octubre. Suscríbase gratuitamente para estar al día de análisis y entrevistas sobre BD y la comunidad de datos abiertos en Brasil._

Este mes de elecciones viene cargado de novedades para quien disfruta analizando datos de campañas, finanzas y resultados electorales. Solo en BD lanzamos [Siga o Dinheiro](https://www.sigaodinheiro.org/), un panel interactivo para seguir los ingresos y gastos de las elecciones, dimos una [clase abierta](https://www.youtube.com/watch?v=FGboC_4szhc&t=584s) sobre cómo investigar datos de candidatos y, por supuesto, actualizamos los datos del TSE, ya tratados y listos para el análisis en el mayor datalake público de Brasil.

En esta entrevista conocemos otra herramienta creada para aportar transparencia y accesibilidad a los datos de financiación electoral. Conversamos con Sérgio Spagnuolo sobre el [Observatorio de Impulsión de Contenido](https://nucleo.jor.br/observatorio-de-impulsionamento-eleitoral/?utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz--K7d9YHXkRUu4u9_geagEUzW0JY63mOmg3Sreqf91-uz-5xVzSnqOMg4CY24Ngvw7dIqcCy4v9h0_YYiTCrm9fclqimIKN_X2A_kD4EaFPRl-Q9Rs), una aplicación creada por Núcleo Jornalismo para monitorear el gasto de las campañas electorales en impulsión de contenido en redes sociales.

Con la aplicación, cualquier persona puede consultar cuánto gastan los candidatos en impulsar contenido en redes sociales, además de aplicar filtros geográficos, por partido y cargo, e incluso por nombre de la red social.

<Image src="/blog/ferramenta-traz-mais-acessibilidade-aos-dados-de-impulsionamento-eleitoral-nas-redes/image_1.webp.webp" caption="Mecanismo de filtros del Observatorio de Impulsión Electoral"/>

El resultado son visualizaciones y una tabla con los datos, extraídos automáticamente del sitio del TSE. También es posible descargar los datos de la plataforma en archivos .csv o .xls.

<Image src="/blog/ferramenta-traz-mais-acessibilidade-aos-dados-de-impulsionamento-eleitoral-nas-redes/image_2.webp.webp" caption="Ejemplo de visualización del Observatorio de Impulsión de Contenido."/>

Sérgio es periodista y director de Núcleo Jornalismo, una iniciativa que analiza e informa sobre el impacto de la tecnología digital en la vida de las personas, con el fin de ayudar a construir una internet mejor. En 2014 creó la agencia de newstech Volt Data Lab, fue Knight Fellow en el ICFJ y director en Abraji, además de colaborar con varios medios nacionales e internacionales.

<Image src="/blog/ferramenta-traz-mais-acessibilidade-aos-dados-de-impulsionamento-eleitoral-nas-redes/image_3.webp.webp" caption="Foto de Sérgio Spagnuolo"/>

## Entrevista

**En estas elecciones se han declarado hasta ahora casi R$ 180 millones como gastos de impulsión de contenido de candidatos en redes sociales. El Observatorio de Impulsión Electoral ayuda a seguir esas cifras de forma práctica y accesible. ¿Cómo surgió la idea de la aplicación y cuáles fueron los principales desafíos durante su desarrollo?**

El Observatorio surgió en las elecciones de 2022 por una necesidad que identificamos de mapear el uso de la partida específica de impulsión de publicaciones en redes sociales, creada en 2019. Fue la primera vez que se utilizó esa partida, y nos pareció importante hacer ese relevamiento de una nueva forma de publicidad política.

**El Observatorio utiliza los datos del TSE para monitorear la impulsión de campañas en redes sociales. ¿Podría hablar un poco de la importancia de esos datos para garantizar la transparencia en las elecciones y de si existen limitaciones que aún dificultan la precisión de los análisis sobre impulsión de contenido de candidatos?**

Esos datos son importantes porque las campañas en línea son cada vez más relevantes en períodos electorales. Las redes sociales son un campo muy fértil para la propaganda política, y hay que estar atentos a cómo se gastan los recursos en ello. Además, la impulsión en redes sociales es barata en comparación con los anuncios en televisión, por ejemplo, de modo que se puede lograr mucha eficiencia con una buena relación costo-beneficio. Un problema con los datos es que son autodeclarados, y a veces las redes sociales utilizadas como vector no se declaran adecuadamente, lo que enturbia un poco la agregación.

**El panel del Observatorio presenta una interfaz interactiva con filtros y visualizaciones que hacen más accesible esta información. ¿Cómo evalúa el impacto que ha tenido el Observatorio en el seguimiento de los gastos electorales? ¿Hay algún ejemplo interesante que pueda mencionar?**

El Observatorio ha sido utilizado por otras publicaciones y organizaciones para mapear gastos de impulsión en distintos lugares y esferas públicas. También se ha usado en investigaciones académicas, como un trabajo final de grado de la Universidad Federal de Pernambuco. Nuestro objetivo es proporcionar información para que otras personas y organizaciones puedan utilizarla.

**Un aspecto destacable del Observatorio es la posibilidad de filtrar los gastos de impulsión por red social, un corte especialmente difícil con datos autodeclarados por los candidatos. ¿Podría contar algo sobre la solución empleada para hacerlo posible?**

La solución es algo rudimentaria, porque no hay mucha información para inferir nada. Escaneamos varias columnas en busca de palabras clave para relacionar ese gasto con alguna red social, cuando existe esa referencia. También agrupamos por grupo económico, por ejemplo Meta (Facebook o Instagram), considerando que las redes sociales pueden tener razones sociales distintas.

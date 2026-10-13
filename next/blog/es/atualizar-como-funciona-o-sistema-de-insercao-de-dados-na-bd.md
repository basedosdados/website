---
title: ¿Cómo funciona el sistema de inserción de datos en BD?
description: >-
  Conozca nuestra infraestructura de inserción de datos y vea cómo contribuir
  puede mejorar su portafolio
slug: como-funciona-la-insercion-de-datos
date:
  created: "2021-05-28"
authors:
  - name: Vinicius
    social: https://github.com/vncsna
    role: Autor
  - name: Fernanda
    social: https://github.com/fernandascovino
    role: Autor
  - name: Diego
    social: https://github.com/d116626
    role: Autor
  - name: João
    social: https://github.com/JoaoCarabetta
    role: Autor
  - name: Caio
    social: https://github.com/Hellcassius
    role: Autor
  - name: Giovane Caruso
    social: https://medium.com/@giovanecaruso
    role: Adaptación y edición
thumbnail: /blog/como-funciona-o-sistema-de-insercao-de-dados-na-bd/image_0.jpg
categories: []
medium_slug: >-
  https://medium.com/@basedosdados/como-funciona-o-sistema-de-inser%C3%A7%C3%A3o-de-dados-na-bd-61a0fe05c5d5
published: false
---

## TL;DR

Este artículo explica cómo funciona la infraestructura de inserción de datos de Base de los Datos y cómo contribuir a nuestra misión de universalizar el acceso a los datos puede mejorar su portafolio como científico de datos o desarrollador.

<Image src="/blog/como-funciona-o-sistema-de-insercao-de-dados-na-bd/image_0.jpg" caption="Photo by [Riho Kroll](https://unsplash.com/@rihok) on [Unsplash](https://unsplash.com/)"/>

## La infraestructura

El equipo de infraestructura de Base de los Datos se encarga de las herramientas de ingesta de datos —desde la carga hasta la disponibilización en el entorno de producción—, del acceso a los datos mediante los paquetes de Python y R, y de nuestro [sitio web](/). El equipo trabaja actualmente en varios frentes, entre ellos la renovación del sitio y la implementación de controles automatizados.

Buscamos simplificar y automatizar cada paso, empezando por la [carga de datos](https://basedosdados.org/docs/colab_data) y su inserción en el **Entorno de Experimentación**. En ese punto, quien colabora puede añadir datos en su nube de Google, limpiarlos y tratarlos, y luego crear las tablas locales con la interfaz de línea de comandos desarrollada por el equipo de infraestructura. Por último, puede enviar el conjunto de datos a revisión abriendo un pull request en [GitHub](https://github.com/basedosdados/sdk/pulls).

Tras el pull request de revisión entra en acción el sistema de controles, con el equipo de datos verificando la calidad de los datos y de los metadatos. Este paso es central para mantener la calidad que distingue a Base de los Datos. El equipo de infraestructura procura automatizar al máximo esa revisión, validando metadatos como nombres y descripciones de columnas, y tipos de datos como las claves primarias.

Superadas las verificaciones, el pull request de inserción se aprueba y los datos entran en el **Entorno de Producción**. A partir de ahí se puede acceder a ellos con cualquiera de nuestras herramientas, como los paquetes de Python y R, o directamente en BigQuery.

<Image src="/blog/como-funciona-o-sistema-de-insercao-de-dados-na-bd/image_1.png"/>

En paralelo al proceso de inserción, el equipo de infraestructura trabaja con el equipo del sitio en la renovación de nuestra plataforma para ofrecer una interfaz moderna. Escribimos un [artículo](/blog/um-site-feito-a-varias-maos) sobre cómo organizamos un proyecto colaborativo para construir una nueva plataforma que facilita aún más su trabajo con datos.

## Contribuir con datos

En el camino para convertirse en analista de datos o desarrollador, entrar en el mercado laboral resulta difícil. A menudo no hay equilibrio entre el estudio y la aplicación práctica, o solo se hace análisis de datos de juguete. Que levante la mano quien no haya estado atascado en conjuntos como Titanic o Iris. Esos conjuntos sirven para aprender un método o una herramienta nueva, pero el conocimiento no se transfiere al mundo real.

Una buena alternativa para trabajar con datos reales y mejorar su portafolio es ayudar a Base de los Datos con la ingesta de datos. Como mínimo se ocupará de la captura de datos, preferiblemente automatizada, junto con su arquitectura y limpieza. También usará las herramientas del día a día de un científico de datos: interfaces de línea de comandos, YAML y BigQuery. Esa experiencia puede marcar la diferencia al entrar en el mercado laboral.

Describimos el proceso en detalle en [Colaborando con datos en BD](https://basedosdados.org/docs/colab_data). En resumen tiene cuatro partes. Primero nos comunica su interés. Después limpia y trata los datos que pretende subir. A continuación los carga en su BigQuery personal. Y, por último, los envía a revisión.

## Contribuir con la infraestructura

Otra forma de contribuir y mejorar su portafolio, esta vez como desarrollador, es colaborar con la infraestructura de BD.

Empieza por hablar con nosotros, en el chat de infraestructura o en las reuniones de los lunes a las 19h, ambos en los canales de infraestructura de [Discord](https://discord.gg/huKWpsVYx4). A partir de ahí podemos elegir una función o un problema para desarrollar, si no ha encontrado ya algo entre las [issues](https://github.com/basedosdados/sdk/issues) abiertas.

¿Cómo puede colaborar? **Aquí van algunas ideas:**

- Añadiendo nuevos conjuntos de datos
- Revisando envíos de datos
- Mejorando el paquete de Python y creando nuevas funcionalidades
- Mejorando el paquete de R y creando nuevas funcionalidades
- Añadiendo verificaciones automáticas de datos
- Añadiendo verificaciones automáticas de metadatos
- Desarrollando nuevas funcionalidades para el sitio

**¿Le ha servido de algo nuestro proyecto?** Somos una organización sin fines de lucro que depende del apoyo de su comunidad. Así puede contribuir:

- [Apoye el proyecto](https://apoia.se/basedosdados)
- [Sea colaborador(a) de datos en BD](https://basedosdados.org/docs/colab_data)
- [Colabore con nuestros paquetes](https://github.com/basedosdados/mais)
- ¡Compártanos en redes sociales!

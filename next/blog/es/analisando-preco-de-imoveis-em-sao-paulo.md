---
title: ¿Cuánta diferencia de precio hay en el metro cuadrado entre los barrios de São Paulo?
description: >-
  Analizamos los datos de GeoSampa para mapear la disparidad de valores en São
  Paulo
slug: precio-del-metro-cuadrado-en-sao-paulo
date:
  created: "2023-09-07T00:03:07.999Z"
authors:
  - name: Gustavo Alcantara
    role: Datos
  - name: Giovane Caruso
    role: Edición
    social: https://www.linkedin.com/in/giovanecaruso/
  - name: Luiza Vilas Boas
    role: Arte
thumbnail: /blog/analisando-preco-de-imoveis-em-sao-paulo/image_0.png
categories: [analise]
medium_slug: >-
  https://medium.com/@basedosdados/qual-a-diferen%C3%A7a-de-pre%C3%A7o-do-metro-quadrado-entre-os-bairros-de-s%C3%A3o-paulo-14cad7e4a89d
published: true
---

Si alguna vez ha buscado un inmueble para comprar o alquilar, sabe que la ubicación influye mucho en el precio. Por lo general, los inmuebles en zonas centrales cuestan más que los de la periferia, y más aún en una metrópolis del tamaño de São Paulo. Pero ¿cómo es esa geografía de valores y dónde está el metro cuadrado más caro, o más barato, de una de las mayores ciudades del mundo en población?

Para averiguarlo, analizamos los datos de GeoSampa, el portal oficial del ayuntamiento de São Paulo, que reúne datos georreferenciados sobre la ciudad. Esta base es notable por lo que revela sobre la dinámica urbana y el mercado inmobiliario: más de 85 millones de registros y 21,5 GB con información como el valor del impuesto predial y el precio del metro cuadrado construido, a nivel de código postal. Son datos valiosos para examinar patrones de ocupación y planificación urbana, evaluar la valorización de zonas concretas, investigar desigualdades territoriales y fundamentar políticas públicas en evidencia concreta.

Este análisis se centra en el valor del metro cuadrado construido, es decir, el costo medio por metro cuadrado de un inmueble construido, lo que permite ver geográficamente dónde se concentra el valor. Seleccionamos los mil inmuebles con los mayores valores medios de construcción y los mil con los menores. Para ello usamos nuestros Directorios Brasileños para marcar el punto medio de cada código postal y los datos municipales de geobr para quedarnos con los puntos situados dentro de la ciudad de São Paulo. El gráfico siguiente muestra el resultado.

<Image src="/blog/analisando-preco-de-imoveis-em-sao-paulo/image_0.png"/>

La distribución geográfica del valor del metro cuadrado construido en São Paulo es marcadamente desigual. El barrio de Jardim Paulistano, en la zona norte, registra el valor más bajo, R$ 7.960 por metro cuadrado, mientras que Itaim Bibi, en la zona oeste, alcanza el más alto, R$ 39.980. El metro cuadrado más caro de la ciudad es, por tanto, unas cinco veces el más barato, que es la escala de la variación entre regiones de la metrópolis paulista. El valor medio de la ciudad es R$ 23.088.

Con una suscripción a BD Pro puede acceder a datos actualizados periódicamente por el registro fiscal del ayuntamiento, con información como el valor del terreno, el área construida, el uso del inmueble e incluso características del barrio. Comience su [prueba gratuita](https://basedelosdatos.org/bdpro) y explore.

¿Y si usa el código de este análisis para crear sus propios recortes? Todo el código de los análisis que publicamos está disponible en nuestro [GitHub](https://github.com/basedosdados/analises/blob/main/redes_sociais/br_sp_geosampa_iptu_iptu_20230829.ipynb).

➡️ Acceda a los datos [aquí](/dataset/05f1b96d-883b-4202-a4bd-40379c5d326a?table=bdffc0f4-00da-4437-9ed9-0db7df11d3fa)

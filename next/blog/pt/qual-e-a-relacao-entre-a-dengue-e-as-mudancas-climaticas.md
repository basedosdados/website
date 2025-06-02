---
title: Qual é a relação entre a dengue e as mudanças climáticas?
description: >-
  Temperatura e chuvas podem estar relacionadas ao aumento de casos em algumas cidade
date:
  created: "2025-05-07T21:02:04.375Z"
authors:
  - name: Marina Monteiro
    role: Análise e texto
  - name: Giovane Caruso
    role: Edição e Design
categories: [analise]
thumbnail: /blog/qual-e-a-relacao-entre-a-dengue-e-as-mudancas-climaticas/grafico_goiania.png
medum_slug: https://medium.com/@basedosdados/nota-sobre-divulga%C3%A7%C3%A3o-dos-dados-do-inep-9168291dbca0
published: true
order: 1
---

Na edição anterior da BDLetter falamos sobre a epidemia de Dengue e seus números absolutos e proporcionais nas cidades onde parte da nossa equipe vive. Nesta edição, continuamos falando sobre a doença, mas avaliando qual a relação entre o número de casos e das variáveis meteorológicas de temperatura do ar e precipitação.

 

Essa investigação é interessante porque o ciclo de vida do Aedes Aegypti é intimamente impactado por variáveis meteorológicas. O mosquito passa a ter o vírus quando pica alguém infectado e se torna infectivo, podendo transmitir a doença para outras pessoas em outras picadas. Com altos níveis de precipitação aumenta-se a oferta de criadouros. Já com temperaturas altas, pode-se notar uma alteração no desenvolvimento, na longevidade e na fecundidade dos mosquitos adultos, que preferem temperaturas entre 22ºC e 28ºC. Um ciclo entre ovo e fase adulta que, geralmente, demora entre 7 a 10 dias, pode passar a acontecer entre 3 a 4 dias em temperaturas mais altas.


É de se esperar, então, que com maior precipitação e maior temperatura teríamos mais mosquitos e, com mais mosquitos, poderíamos espalhar ainda mais a doença. Será que o aumento na temperatura e na precipitação é acompanhado pelo aumento nos casos?

 

Para entender melhor esse cenário, analisamos as capitais do país observando as medidas de temperatura e precipitação tomadas por estações automáticas do [INMET](/dataset/782c5607-9f69-4e12-b0d5-aa0f1a7a94e2?utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_yEejPUipsc-cW3VKr51TG936EDjUtQ7FsruHM1xnCyYNuLd3b6JK282QA06r9HS1mxt-Q9DeZMt8UNYBdTQa6O4xDAQtBow06gCo-RD2SgZobLk4) e com os registros de notificações de casos de dengue presentes no [SINAN](/dataset/f51134c2-5ab9-4bbc-882f-f1034603147a?utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_yEejPUipsc-cW3VKr51TG936EDjUtQ7FsruHM1xnCyYNuLd3b6JK282QA06r9HS1mxt-Q9DeZMt8UNYBdTQa6O4xDAQtBow06gCo-RD2SgZobLk4), todos estes dados disponíveis no datalake da Base dos Dados. Com os dados meteorológicos diários, foi possível calcularmos a temperatura média e o total de precipitação (mensais e semanais, por semana epidemiológica). Você pode conferir depois em detalhes os resultados em um dashboard interativo que criamos. O link está ao final da análise. 

 

A dinâmica esperada para a distribuição de casos é: elevação no início do período quente com pico de casos depois de alguns meses de calor, coincidindo com algumas semanas após o período mais chuvoso. Os números mais baixos de casos devem estar em meses mais secos e frios.

 

Podemos notar que em Goiânia esse padrão é bastante preciso ao longo dos anos. Veja na imagem abaixo.

<Image src="/blog/qual-e-a-relacao-entre-a-dengue-e-as-mudancas-climaticas/grafico_goiania.png"/>

Para a capital de Goiás, os casos estão concentrados em algumas semanas dos picos de precipitação e temperatura. Quando essas duas variáveis começam a ter valores menores, notamos que o número de casos também cai. 

Mas a mesma dinâmica não é tão evidente na cidade de Manaus, por exemplo.

<Image src="/blog/qual-e-a-relacao-entre-a-dengue-e-as-mudancas-climaticas/grafico_manaus.png"/>

Na capital amazonense, a relação com a precipitação ainda pode ser notada, ainda que não da mesma forma que o exemplo de Goiânia. Mas a relação com a temperatura já não parece ser tão direta. A explicação para este fenômeno pode estar no fato de que a variação de temperatura média está no intervalo de 26ºC a 32ºC, temperaturas já consideradas altas e sempre agradáveis para a proliferação do mosquito. 

 

Outro exemplo desse fenômeno está na cidade de Aracaju. Diferentemente das outras capitais, que apresentam picos de casos entre Fevereiro e Abril, os picos de notificações em Aracaju acontecem bem no meio do ano, por volta de Junho e Julho, mesmo esse sendo o período mais “frio” da cidade. Mas, assim como acontece em Goiânia, esse período ainda tem temperaturas médias acima de 25ºC. Os máximos de notificações se alinham, então, aos máximos de precipitação.

## O que diz a literatura?

Várias pesquisas relacionam estas variáveis meteorológicas com o número de casos notificados de dengue em diversas regiões. Por exemplo, uma pesquisa desenvolvida na Unicamp indica que o aumento de 1ºC na temperatura média pode ter como consequência um aumento de aproximadamente 20% - 30% nos casos de dengue na cidade de Campinas nos dois meses consecutivos. Outros estudos apontam para uma relação no aumento de casos locais quando há aumento na pluviosidade (como nas cidades de Belém e Ribeirão Preto).

 

Fatores climáticos também devem ser levados em consideração. Anos de El Niño, por exemplo, transportam as chuvas do norte e nordeste para a porção sudeste e sul do país, porção com cidades mais densas do ponto de vista populacional. Aliado a temperaturas mais elevadas, podemos ter anos com maior número de casos que em anos com La Niña(**), por exemplo. 

 

Claro, não são apenas fatores como os citados que estão direta ou indiretamente relacionados aos casos de dengue. Urbanização, densidade demográfica, saneamento básico e outras características das cidades, como também políticas públicas de prevenção, devem ser considerados para avaliar o total de casos em uma localidade.

 

Mas, sem dúvidas,  a temperatura e precipitação tem um grande papel no espalhamento da doença e nas epidemias. Com a tendência de aumento das temperaturas médias causada pelas mudanças climáticas poderemos ver essa doença se proliferando cada vez mais, e por lugares que antes sequer eram atingidos. Falamos sobre isso na entrevista deste mês!

Ah, preparamos um dashboard onde você pode investigar os dados da capital do seu estado (*). Avalie se há uma tendência de aumento nas temperaturas médias, se há alguma mudança significativa no padrão de chuvas. E aí, há relação entre essas variáveis e os casos vistos de dengue?

> [Acesse o Dashboard](https://climadengue.streamlit.app/?utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_yEejPUipsc-cW3VKr51TG936EDjUtQ7FsruHM1xnCyYNuLd3b6JK282QA06r9HS1mxt-Q9DeZMt8UNYBdTQa6O4xDAQtBow06gCo-RD2SgZobLk4)

Você também pode conferir o código utilizado para em nosso [repositório de análises](https://github.com/basedosdados/analises/tree/main/redes_sociais/climadengue?utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_yEejPUipsc-cW3VKr51TG936EDjUtQ7FsruHM1xnCyYNuLd3b6JK282QA06r9HS1mxt-Q9DeZMt8UNYBdTQa6O4xDAQtBow06gCo-RD2SgZobLk4) no GitHub. 

(*) Exceto Florianópolis. Não encontramos dados meteorológicos de estações automáticas para esta capital.

(**) em anos de La Niña as chuvas no norte e nordeste são intensificadas, o que pode levar a um aumento de casos nessas regiões. Mas por se tratar de regiões com menor densidade populacional o aumento não seria tão sensível ao olharmos para o número total de casos do país.

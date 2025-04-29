---
title: Como os casos de dengue evoluíram nos últimos 10 anos?
description: >-
  Um olhar sobre os registros anuais de dengue, explorando padrões locais e variações entre municípios
date:
  created: "2025-04-30T18:18:06.419Z"
thumbnail: 
categories: [analise]
authors:
  - name: Marina Monteiro 
    role: Análise e texto
    social: https://www.linkedin.com/in/ma-m-mendonca/
  - name: Thais Filipi
    role: Análise e texto
    social: https://www.linkedin.com/in/thaismdr/
    avatar: https://media.licdn.com/dms/image/v2/C4E03AQFstxqWabAyUA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1584489568236?e=2147483647&v=beta&t=mol7Kc8PgxgJatgvNYRkyffL8opuIgFgRdiY7vXB1HA
  - name: Giovane Caruso
    role: Edição de texto
    social: https://www.linkedin.com/in/giovanecaruso/
  - name: José Félix
    role: Edição gráfica
    social: https://www.linkedin.com/in/jos%C3%A9-f%C3%A9lix-517b05210/
medium_slug: >-
  https://medium.com/basedosdados/como-os-casos-de-dengue-evolu%C3%ADram-nos-%C3%BAltimos-10-anos-54a8145f2de7
published: true
---

Ano passado tivemos a maior epidemia de dengue no Brasil. Somente no primeiro semestre, o total de casos prováveis chegou a um terço do registrado nos últimos 25 anos (Fonte). Um cenário como esse exige, mais do que nunca, acompanhamento de perto da sociedade e do poder público. Ter acesso aos dados de notificação da dengue é fundamental no processo de informação, decisão e ação para mitigar casos futuros.

Os dados sobre a dengue são públicos e relativamente acessíveis. Com um pouco de pesquisa, qualquer pessoa pode investigar a situação da sua cidade e entender melhor a dinâmica da doença. Os dados são organizados pelo Sistema de Informação de Agravos de Notificação (SINAN), criado nos anos 1990, que centraliza o registro e monitoramento de doenças de notificação compulsória no Brasil. Integrado ao Sistema Nacional de Informações em Saúde (SIS), o SINAN padroniza e informatiza os registros, permitindo melhor análise de dados e resposta mais ágil a surtos. Em 2014, houve aprimoramento da classificação de casos graves e óbitos por dengue, tornando o acompanhamento mais preciso e reforçando sua importância no controle epidemiológico. O Ministério da Saúde possui um painel com a Atualização de Casos de Arboviroses para quem quer ter acesso às informações sobre a dengue de forma ainda mais direta. Há ainda outras iniciativas com propostas semelhantes, o que facilita ainda mais o acesso aos dados, como o [info.dengue](https://info.dengue.mat.br/).

Dado o impacto local da dengue nas unidades de saúde, optamos por concentrar nossas análises no nível municipal. Comparar cidades e agregar resultados — como por região — é sempre possível, mas é essencial considerar as particularidades de cada local. Fatores epidemiológicos e demográficos influenciam a interpretação dos números, e entender essas nuances faz toda a diferença. Como a curiosidade nos move aqui na Base dos Dados, decidimos investigar as cidades do nosso próprio time: Americana, Sorocaba e Curitiba. Mas também vamos falar um pouquinho sobre o cenário da dengue no Brasil como um todo.

## Como analisar dados sobre a dengue?

Analisamos conjuntamente as notificações de dengue, dengue grave e dengue com sinais de alarme através das fichas de notificação/investigação individual do SINAN entre 2014 e 2024. Para isso, utilizamos as tabelas tratados com dados do SINAN, disponíveis gratuitamente no datalake público da BD.

_acesse os dados por [aqui](https://basedosdados.org/dataset/f51134c2-5ab9-4bbc-882f-f1034603147a?table=9bdbca38-d97f-47fa-b422-84477a6b68c8)_

As fichas de investigação individual coletam dados gerais sobre a notificação, como data, município e unidade de saúde responsável, além de informações detalhadas do paciente, como nome, idade, sexo, raça/cor, escolaridade e se é gestante. Há outras sobre os dados clínicos e evolução do paciente. Alguns campos são de preenchimento obrigatório, como o agravo, a data da investigação, o registro de sinais clínicos, e a evolução do caso na ocorrência de óbito, por exemplo. Prestar atenção na diferença entre campos essenciais e de preenchimento obrigatório fornece pistas a respeito da completude dos dados. Cenários de epidemia ou surto, tanto da dengue como de outras doenças podem afetar o montante de informações coletadas por conta da pressão sofrida por profissionais da saúde nessas ocasiões. O surto de dengue do ano passado e o período da pandemia da Covid-19 são alguns exemplos.

Podemos avaliar os casos de dengue em números absolutos ou de forma comparativa. A forma padrão de comparar cidades, estados e países em estudos epidemiológicos é a partir da taxa de incidência, que calcula os casos da doença para cada 100 mil habitantes. Outras análises possíveis incluem avaliar a incidência por características socioeconômicas da população, como idade, sexo e raça/cor. E como as fichas incluem informações da evolução da doença em casos de óbito, podemos estimar a mortalidade geral da doença na população e a taxa de letalidade da dengue (número de óbitos em um período de tempo sobre o número de pessoas doentes pelo agravo).

## Brasil

O número de notificações de dengue em 2024 aumentou cerca de 350% em relação a 2023. Considerando as primeiras cinco semanas epidemiológicas do ano, o número de casos aumentou cerca de 465% com relação a 2023, mas diminuiu cerca de 57% com relação a 2025. Em números absolutos, a cidade de São Paulo registrou maior número de notificações de dengue em 2024, com cerca de 652.225 notificações registradas ao longo do ano. Belo Horizonte, Brasília, Campinas e Rio de Janeiro são outros destaques quanto ao elevado número de casos prováveis de dengue, entre 100 e 230 mil casos. Em 2025, a cidade que está liderando o ranking no momento é São José do Rio Preto, com 24.775 notificações. São Paulo e São José do Rio Preto também ocuparam o primeiro lugar no ranking de óbitos para os dois anos, respectivamente.

## Nossas Cidades

<Image src="/blog/como-os-casos-de-dengue-evoluiram-nos-ultimos-10-anos/grafico_1.webp"/>

Considerando as cidades da equipe, podemos perceber como é complexo analisar a distribuição temporal dos casos prováveis de dengue. Além da sazonalidade da doença — ela é mais comum nos primeiros meses do ano, a distribuição ao longo dos anos não parece apresentar padrões evidentes sem informações adicionais — como trajetórias bem delineadas de crescimento ou declínio, por exemplo.

<Image src="/blog/como-os-casos-de-dengue-evoluiram-nos-ultimos-10-anos/grafico_2.webp"/>

Americana (SP) apresentou temporadas de alta para os padrões da cidade nos anos de 2014, 2015, 2019, 2022 e 2024. Já Sorocaba (SP) e Curitiba (PR) registraram picos mais atípicos dentro da série temporal analisada. Em Sorocaba, os anos de 2015 e 2024 tiveram incidências muito superiores à média histórica, enquanto Curitiba atingiu seu maior patamar em 2024. No entanto, a magnitude desses surtos varia significativamente entre as cidades. Por exemplo, o maior pico de incidência em Americana foi de aproximadamente 4.098 notificações de dengue por 100 mil habitantes em 2014. Em Sorocaba, o valor mais extremo foi mais que o dobro, alcançando 8.880 casos por 100 mil habitantes em 2015. Já Curitiba teve sua maior incidência em 2024, com cerca de 1.052 notificações por 100 mil habitantes. A tendência acompanha de certa forma o cenário no Brasil, que apresentou picos da doença em 2015, 2019 e 2024.

Americana apresentou baixa incidência de dengue somente em 2017 e 2018. Os demais anos são de alta incidência. O mesmo aconteceu em Sorocaba, com adição de 2014 e 2016. A classificação de baixa incidência ocorre quando há registro de menos de 100 casos da doença por 100 mil habitantes. Há média incidência entre 100 e 300 casos e alta acima de 300 casos por mil habitantes. Curitiba, por outro lado, teve baixa incidência de dengue para quase toda a série histórica analisada aqui, com exceção de 2024.

Muitos pesquisadores e jornalistas apontam que o que poderia explicar a epidemia de dengue do ano passado é uma combinação de eventos meteorológicos e climáticos (aumento de temperatura combinando com chuvas em abundância) e falhas no controle do vetor de transmissão da doença. Segundo [estimativas da Secretaria de Saúde de Curitiba](https://www.brasildefato.com.br/2024/02/20/em-curitiba-75-dos-focos-do-mosquito-da-dengue-estao-dentro-de-casas/), por exemplo, 75% dos focos do mosquito da dengue estão dentro de casas. Portanto, há muito que poderia ser feito no combate à dengue que não depende somente da variação de temperatura no país.

Agora é a sua vez! Que tal explorar os dados da sua cidade e ver o que encontra? Dê uma olhada no código e personalize a análise com as informações do seu município.

_Acesse o código por [aqui](https://github.com/basedosdados/analises/blob/main/redes_sociais/br_ms_sinan.microdados_dengue_20250319.ipynb)_.

Essa análise foi publicada originalmente na BDletter, a newsletter da Base dos Dados. Assine para receber sempre atualizações sobre nossos dados, análises e entrevistas. Assina já por [aqui](https://info.basedosdados.org/newsletter?_gl=1*fqpar9*_gcl_aw*R0NMLjE3MzY4NTc2MDEuQ2owS0NRaUFzNWk4QmhEbUFSSXNBR0U0eEh5TkJHeWhWLWQzWTFJd1AxenZlS0ZtNUhjM2FsOTFVOGxKLXVfWFhqdGozYUhOaEwtVTloMGFBaUR2RUFMd193Y0I.*_gcl_au*ODc4NTYyMTUxLjE3NDAzOTk0ODk.).
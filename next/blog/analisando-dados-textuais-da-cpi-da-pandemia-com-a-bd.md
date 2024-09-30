---
title: Analisando dados textuais da CPI da Pandemia com a BD
description: Veja como acessar e analisar de maneira prática os discursos da CPI da Pandemia do Covid-19.
date:
  created: '2022-06-07T15:00:00'
authors:
  - name: Adolfo Guimarães
    role: Autor
    social: https://medium.com/@adolfoguimaraes
  - name: Giovane Caruso
    role: Edição
    social: https://medium.com/@giovanecaruso
thumbnail: /blog/analisando-dados-textuais-da-cpi-da-pandemia-com-a-bd/image_0.webp
categories: [analise]
medium_slug: >-
  https://medium.com/basedosdados/analisando-dados-textuais-da-cpi-da-pandemia-com-a-bd-d178b344a6eb
---

Em 2021, o Brasil acompanhou as discussões a respeito da CPI da Pandemia. Os senadores se reuniram para discutir as ações do Governo Federal no combate à pandemia. Na ocasião, depoentes convocados e diversos especialistas foram ouvidos durante três meses. A cada dia, horas de discussões debateram sobre as ações do governo no combate à pandemia, a crise do oxigêncio em Manaus, o atraso nos contratos com a Pfizer, o caso dos contratos com a Davati, entre outros episódios que foram apresentados aos brasileiros.

**Como podemos utilizar essas informações para entender os principais tópicos discutidos?** O que foi discutido em cada dia? Quais foram as pessoas, lugares e organizações mais citadas nos textos? Procurando responder a essas perguntas, resolvi utilizar técnicas de **Processamento de Linguagem Natural** com visualização de dados a partir dos textos transcritos das seções.

Para isso, utilizei as transcrições das seções disponibilizadas pela Base dos Dados, que você por acessar por [aqui](https://basedosdados.org/dataset/br-senado-cpipandemia). Originalmente, essa visualização foi criada como parte do [#SWDChallenge](https://storytellingwithdata.com), desafio mensal de visuzalização de dados.

<Image src="/blog/analisando-dados-textuais-da-cpi-da-pandemia-com-a-bd/image_0.webp" captino="Photo by [Joakim Honkasalo](https://unsplash.com/@jhonkasalo) on [Unsplash](https://unsplash.com/)"/>

## A proposta

O trabalho foi dividido em 3 partes: (1) coleta dos dados, (2) processamento de linguagem natural e (3) visualização dos dados. Na primeira etapa, coletamos os textos direto do _datalake_ da Base dos Dados, a partir de consultas SQL. Na segunda etapa, utilizamos a linguagem `python` para processar os dados e utilizar técnicas como o TF-IDF e o reconhecimento de entidades nomeadas para extrair informações relevantes dos textos analisados. Por fim, utilizamos mapa de palavras e gráficos de barra para apresentar essas informações.

A seguir você confere o passo a passo dos dados até a visualização. Segue que vamos falar sobre **SQL, Python, Processamento de Linguagem Natural e DataViz.** Boa leitura ;)

## Os dados

A [base de textos da CPI](https://basedosdados.org/dataset/7bd4bcc6-815a-49bc-9de3-1828dcd9f30f?table=951298a3-113d-4f10-9605-53d4282b4a69) possui as falas de cada senador, depoente ou convidado que falou durante as sessões da CPI da pandemia. Ela corresponde ao período de 24/04 a 15/07. Ou seja, os 3 primeiros meses. A CPI foi prorrogada por mais 3 meses e terminou em 26 de outubro de 2021. No entanto, esses textos ainda não estão disponíveis no dataset.

Foram utilizadas as seguintes consultas para extrair os dados de interesse para a construção da visualização:

Consulta para selecionar o tempo de fala de cada participante

```sql
SELECT
  data_sessao,
  nome_discursante,
  genero_discursante,
  categoria_discursante,
  SUM(duracao_discurso) AS tempo_fala
FROM
  `basedosdados.br_senado_cpipandemia.discursos`
GROUP BY
  data_sessao,
  nome_discursante,
  genero_discursante,
  categoria_discursante
ORDER BY
  data_sessao;
```

Esses dados foram utilizados para criar a parte da visualização que contabiliza o tempo de fala médio e total de cada categoria e gênero.

Consulta par selecionar todos os discursos agregados por data

```sql
SELECT
  data_sessao,
  SUM(duracao_discurso) duracao_discursos,
  STRING_AGG(texto_discurso, ' ') AS discurso
FROM
  `basedosdados.br_senado_cpipandemia.discursos`
GROUP BY
  data_sessao
ORDER BY
  data_sessao
```

Esses dados foram utilizados para montar a nuvem de tags geral e por dia.

Consulta para selecionar todos os discursos dos depoentes e convidados

```sql
SELECT
  data_sessao,
  nome_discursante,
  SUM(duracao_discurso) duracao_discursos,
  STRING_AGG(texto_discurso, ' ') AS discurso
FROM
  `basedosdados.br_senado_cpipandemia.discursos`
WHERE
  categoria_discursante = 'Depoente/Convidado'
GROUP BY
  data_sessao,
  nome_discursante
ORDER BY
  data_sessao
```

Esses dados foram utilizados para gerar o gráfico das entidades nomeadas. Com o intuito de diminuir a quantidade de dados processados para essa tarefa, foi desconsiderado os textos dos senadores e mantida apenas as falas dos depoentes e convidados. A consulta agrega os dados por data e por nome do discursante. Os dados gerados foram usados como entrada para o algoritmo de extração de entidades.

## Pré-processamento

Os dados extraídos das tabelas foram pré-processados utilizando a linguagem python. Todo o código pode ser encontrado no [repositório](https://github.com/adolfoguimaraes/basedosdados-cpi).

Nessa etapa, foram realizadas as seguintes tarefas:

### Extração de termos mais relevantes

Para a extração dos termos mais relevantes foi utilizada a métrica de **TF-IDF**. Com ela é possível **extrair os termos mais relevantes e não apenas os termos mais frequentes de um dado documento.** Entende-se como relevante para este trabalho um termo que permita classificar de forma mais assertiva cada documento. Em cada dia de depoimento foi considerado 1 documento que agrupa todas as falas ditas naquele dia.

Para entender como o TF-IDF funciona, vamos considerar, por exemplo, a palavra “**Senador**”, que aparece em todos os documentos repetidas vezes. Apesar desta palavra ter uma frequência alta, ela é uma palavra muito comum e não é útil para identificar qual tópico está sendo discutido em cada dia. Já a palavra “**Davati**”, por exemplo, não aparece em todos os documentos, mas aparece em alguns e é bem comentada em determinados dias. Neste caso, ela vai ter uma relevância maior que a palavra Senador. O TF-IDF permite identificar esse tipo de relacionamento entre termos e textos.

[Existem várias definições na literatura de como calcular essa métrica](https://en.wikipedia.org/wiki/Tf%E2%80%93idf). Para o nosso caso, foram usadas as seguintes fórmulas de cálculo do TF-IDF.

<Image src="/blog/analisando-dados-textuais-da-cpi-da-pandemia-com-a-bd/image_1.webp"/>

O TF-IDF foi usado para gerar a WordCloud de termos mais relevantes para cada dia de sessão da CPI. No entanto, a WordCloud geral possui os termos de todos os dias. Para isso, foi usado o IDF de cada termo ponderado pela frequência dele em toda coleção de textos.

### Extração de Entidades Nomeadas

Entidades nomeadas são termos que, a partir do contexto, são classificados em diferentes categorias, como **data**, **local**, **pessoa**. Vale ressaltar que esses modelos são dependentes do domínio para o qual foi treinado. Apesar de estar trabalhando com um domínio específico (política), o modelo escolhido extraiu entidades relevantes para a análise. Utilizei um modelo pré-treinado, que você pode conferir por [aqui](https://github.com/neuralmind-ai/portuguese-bert). Esse modelo permite extrair até 10 classes de entidades: `PESSOA, ORGANIZACAO, LOCAL, TEMPO, VALOR, ABSTRACAO, ACONTECIMENTO, COISA, OBRA e OUTRO`

Para essa visualização, foram utilizadas as classes PESSOA, ORGANIZACAO e LOCAL. As entidades COISA, ABSTRACAO, OUTRO, OBRA e ACONTECIMENTO foram agrupadas em uma classe chamada de OUTROS.

Após a extração, os arquivos gerados foram processados com o objetivo de eliminar algumas entidades que não iam ajudar muito no entendimento dos textos, como: "Presidente", "Ministro", "Sr", "Sra". O objetivo era deixar em evidência apenas entidades que trouxessem mais informações para a análise dos textos processados, como por exemplo: Presidente da República, Senador Randolfe, Ministério da Saúde e assim por diante.

Todo o código produzido para esta etapa pode se encontrado [aqui](https://github.com/adolfoguimaraes/basededados-cpi).

## Visualização e análise

A visualização pode ser dividida em três partes principais. **Na primeira parte, foi mostrado o tempo de fala agregado de senadores, depoentes e convidados por gênero**. A proposta era mostrar a diferença entre a participação de mulheres e homens na comissão, em relação ao tempo médio e total de fala. É fácil ver, a partir do tempo agregado, a maior participação de homens. Isso não se dá somente no número de senadores, por exemplo. O tempo de fala médio dos senadores homens é o dobro do tempo de fala que foi dado às mulheres.

<Image src="/blog/analisando-dados-textuais-da-cpi-da-pandemia-com-a-bd/image_2.webp"/>

A segunda parte foi a nuvem de tags. Esse tipo de visualização é bem tradicional para apresentar dados textuais quando se deseja visualizar os termos mais frequentes. **Quanto maior a palavra, mais relevante ela é para a coleção de textos.**

<Image src="/blog/analisando-dados-textuais-da-cpi-da-pandemia-com-a-bd/image_3.webp"/>

A partir da nuvem geral, é possível ver em destaque alguns termos que ajudam a classificar esses 3 primeiros meses: **invoice, davati, miranda, oxigênio, manaus**. Todos os termos estão bem relacionados com as discussões em torno dos contratos assinados pelo governo federal e a crise em Manaus, pautas bem relevantes para discussões na CPI.

Essa nuvem de tags varia de acordo com o dia selecionado. A proposta era que, além de ter uma visão geral, o usuário pudesse visualizar o termos mais relevantes de cada dia.

Por exemplo, no dia 01/07, a CPI da Covid ouviu Luiz Paulo Dominguetti, representante da empresa Davati Medical Supply sobre o [pedido de propina de um diretor do Ministério da Saúde em troca de contrato para o fornecimento de vacinas](https://noticias.uol.com.br/politica/ultimas-noticias/2021/07/01/frases-cpi-da-covid-senado-luiz-paulo-dominguetti-pereira.htm). Se olhar a nuvem de tags deste dia, os termos mais relevantes giram em torno deste denúncia.

<Image src="/blog/analisando-dados-textuais-da-cpi-da-pandemia-com-a-bd/image_4.webp"/>

Outro exemplo é o o dia 18/05 quando o ex-ministro Ernesto Araújo foi ouvido. Dentre os tópicos discutidos durante o depoimento, estavam os [conflitos relacionados à China e as denúncias de falta de insumo vindo do país](https://g1.globo.com/bemestar/coronavirus/noticia/2021/05/18/cpi-da-covid-compare-o-que-disse-ernesto-araujo-aos-senadores-com-declaracoes-anteriores-do-ex-ministro.ghtml). Olhando para a nuvem de tags é possível ver que os termos mais relevantes giram também em torno destes tópicos.

<Image src="/blog/analisando-dados-textuais-da-cpi-da-pandemia-com-a-bd/image_5.webp"/>

Por fim, para a visualização das entidades nomeadas foi utilizado um gráfico de barras separado por categoria. O gráfico ajuda a ver a diferença da frequência que os termos apresentam em cada categoria.

<Image src="/blog/analisando-dados-textuais-da-cpi-da-pandemia-com-a-bd/image_6.webp"/>

Olhando para o gráfico geral é fácil ver que as entidades relacionadas permite ver de fato pessoas, locais e organizações que foram mais citadas dentro das discussões dos 3 primeiros meses da CPI.

Essa visualização também varia de acordo com o dia. Por exemplo, a imagem a seguir mostra as entidades para o dia 01/07, no depoimento do Luiz Paulo Dominguetti.

<Image src="/blog/analisando-dados-textuais-da-cpi-da-pandemia-com-a-bd/image_7.webp"/>

E para o dia 18/05 no depoimento do ex-ministro Ernesto Araújo.

<Image src="/blog/analisando-dados-textuais-da-cpi-da-pandemia-com-a-bd/image_8.webp"/>

É isso, com algumas técnicas tradicionais de análise e processamento de linguagem natural é possível extrair bastante informação de dados textuais, sem precisar ler todos os textos. A seguir você confere a visualização completa.

<Image src="/blog/analisando-dados-textuais-da-cpi-da-pandemia-com-a-bd/image_9.webp"/>

A versão interativa da visualização pode ser acessada [aqui](https://observablehq.com/@adolfoguimaraes/swd-challenge-mar-22).

---
title: Qual a relação entre o IDHM e a Votação Presidencial de 2018 em SP?
description: Veja como analisar dados do índice de maneira mais fácil e prática
date:
  created: "2022-04-28T15:00:00"
authors:
  - name: Gustavo Alcântara
    role: Texto
    social: https://medium.com/@gustavo.geo
  - name: Giovane Caruso
    role: Edição
    social: https://medium.com/@giovanecaruso
thumbnail: /blog/analisando-relacao-entre-idhm-e-eleicoes/image_0.webp
categories: [analise]
medium_slug: >-
  https://medium.com/basedosdados/qual-a-rela%C3%A7%C3%A3o-entre-o-idhm-e-a-vota%C3%A7%C3%A3o-presidencial-de-2018-em-sp-aa9f1305586f
published: true
---

## TL;DR

Neste breve artigo, proponho uma visualização simples e rápida de como a votação presidencial no ano de 2018 se relaciona com o Índice de Desenvolvimento Humano Municipal (IDHM) dos municípios paulistas. Veja no artigo o como acessar e analisar dados do índice de maneira mais fácil e prática através do _datalake_ público da Base dos Dados, além de quais foram os passos para a construção dessa visualização.

<Image src="/blog/analisando-relacao-entre-idhm-e-eleicoes/image_0.webp"/>

## O Índice de Desenvolvimento Humano (IDHM)

O IDHM é uma medida composta de indicadores de três dimensões do desenvolvimento humano: longevidade, educação e renda. O índice varia de 0 a 1. Quanto mais próximo de 1, maior o desenvolvimento humano. Além de seguir as mesmas três dimensões, o IDHM brasileiro adequa a metodologia global ao contexto brasileiro e à disponibilidade de indicadores nacionais. Isso o deixa mais adequado para avaliar o desenvolvimento de municípios brasileiros.

A Base dos Dados disponibiliza dados do [Atlas do Desenvolvimento Humano (ADH)](http://atlasbrasil.org.br/), site que traz o IDHM e outros 200 indicadores, já tratados e prontos para análise. **São dados a nível de Brasil, UF e município** que podem ser analisados em Python, R, Stata, ou pelo próprio BigQuery via SQL. Para essa análise utilizamos o [pacote em R da BD](https://github.com/basedosdados/sdk/tree/master/r-package). Acesse essa base por [aqui](/dataset/mundo-onu-adh).

## Analisando a relação entre o IDHM e a Votação Presidencial

> Para toda boa pergunta, existirá uma boa análise a ser feita!

Sempre que pensarmos em trabalhar com dados, estatísticas e análises, é importante, antes de tudo, definirmos uma boa pergunta. Isso vai te poupar um tempo precioso na limpeza e manipulação da sua base de dados. Portanto, neste breve exercício, por estarmos nos aproximando das eleições presidenciais, refleti em como o Índice de Desenvolvimento Humano (IDHM) dos municípios paulistas pode se relacionar com a última eleição presidencial. Será que existe uma relação entre o candidato eleito ou não com o IDH dos municípios?

### Como apresentar essa relação?

Correlacionar dados nem sempre é uma tarefa fácil. Mas, com algumas linhas de comando e utilizando boas bibliotecas no seu software de análise para gerar um insight, fica relativamente simples indicar a tendência/correlação entre os dados através de uma representação gráfica.

A minha língua materna na programação é o R. Comecei a desenvolver algumas análises em 2016 utilizando o R:Base e hoje faço uso do RStudio por conta de sua interface gráfica e rápida manipulação. Gosto muito do R e principalmente de sua comunidade que sempre está disposta a colaborar. A BD disponibiliza todo o seu datalake para acesso e manipulação em R e em outras linguagens.

### Criando o Dataframe

Agora, é a hora mais legal: vamos codar! O primeiro passo é criarmos o dataframe para responder a questão que refletimos anteriormente. Deixei as anotações no próprio código. Caso você tenha alguma dúvida com relação ao código, pode me encontrar no servidor da [Base dos Dados no Discord](https://discord.com/invite/huKWpsVYx4). Meu usuário é @gustavoalcantara. Confira os primeiros passos no código abaixo:

```r
# Inicio da Jornada
# Atribuição do projeto na Base dos dados

con <- bigrquery::dbConnect(
  bigquery(),
  billing = "basedosdados-elections",
  project = "basedosdados"
)

# indo para o meu projeto no Google DataLake
basedosdados::set_billing_id("basedosdados-elections")

# query necessária para responder à minha pergunta
query <- "
SELECT
  ano,
  turno,
  sigla_uf,
  sigla_partido,
  id_municipio,
  votos,
  resultado,
  cargo
FROM
  `basedosdados.br_tse_eleicoes.resultados_candidato_municipio`
WHERE
  ano = 2018
  AND sigla_uf = 'SP'
  AND cargo = 'presidente'
"

# atribuição do Dataframe
df <- DBI::dbGetQuery(con, query)
```

Com o `dataframe` em mãos, é hora de atribuir uma proporção das votações dos candidatos presidenciáveis por município para verificarmos a relação entre o IDHM. Para isso, utilizamos o código abaixo para criar uma nova variável:

```r
# Criação de Variável: Porcentagem das votações
df <- df |>
  dplyr::group_by(id_municipio) |>
  dplyr::mutate(porcentagem = votos / sum(votos) * 100)
```

A proposta deste material é que você também consiga trabalhar com uma tabela externa à BD. Por isso, importei um `.csv` do meu computador, o IDHM dos municípios paulistas, e alterei o nome da variável de município para realizarmos um join. Como a proposta é analisarmos uma possível relação entre o IDHM e a porcentagem de votação, fica mais fácil visualizarmos essa relação graficamente com as variáveis organizadas. O código que usei foi esse:

```r
# Juntando o IDHM de uma base externa com a base de Eleições
# Lendo a base Externa
idhm <- read.csv("idhm_sp.csv")
# Mudando o nome da variável Cod.IBGE para id_municipio
# para o futuro join
idhm <- idhm |>
  dplyr::rename(id_municipio = "Cod.IBGE")
# Join entre as tabelas
df |>
  dplyr::left_join(idhm,
    by = "id_municipio"
  )
```

Pronto! Está pronto o nosso dataframe. A carinha dele é essa aqui:

<Image src="/blog/analisando-relacao-entre-idhm-e-eleicoes/image_1.webp"/>

### Analisando o graficamente as relações entre IDHM e Porcentagem de votos

Com o dataframe completo em mãos, fica simples elaborar uma visualização gráfica da nossa pergunta geral. Veja o código e visualização abaixo:

```r
# grafico das relacoes
dplyr::filter(df, turno == 2) |>
  dplyr::group_by(id_municipio) |>
  ggplot2::ggplot(aes(
    x = idhm_2010,
    y = porcentagem,
    color = resultado
  )) +
  geom_point() +
  geom_smooth() +
  scale_color_discrete(labels = c("Bolsonaro", "Fernando Haddad")) +
  labs(
    title = "Relação entre IDHM e Porcentagem de Votos em SP",
    x = "IDHM",
    y = "Porcentagem de Votos",
    colour = "Candidato:"
  ) +
  theme(legend.position = "bottom")
```

<Image src="/blog/analisando-relacao-entre-idhm-e-eleicoes/image_0.webp"/>

E pronto! Com essa visualização temos um primeiro insight sobre a relação entre o IDHM no Estado de São Paulo e a votação presidencial de 2018. Cada pontinho desse é um município e está representando no eixo y a porcentagem de votos que cada um dos candidatos recebeu. Portanto, esse pontinho aparecerá para Fernando Haddad em azul e Bolsonaro em vermelho. Observe como a porcentagem de votos e a relação entre os municípios com alto IDHM (maiores que 0,70) se mostra inversa entre os dois candidatos. Haddad, nesses municípios, teve a menor porcentagem de votos, enquanto Bolsonaro obteve a maior e apresenta uma tendência de aumento quanto maior for o IDH.

Será que esse cenário se repete em outros estados? Faça também sua análise! Se precisar de uma mãozinha, a Base dos Dados tem uma equipe preparada para te ajudar. Traga suas dúvidas para [nossa comunidade no Discord](https://discord.com/invite/huKWpsVYx4).

---
title: O Brasil nas Olimpíadas
description: Um panorama da performance brasileira nos jogos olímpicos ao longo dos anos
date:
  created: '2021-07-23'
authors:
    - name: Lucas Nascimento
      role: Autor
      social: https://github.com/lucasnascm
thumbnail: /blog/o-brasil-nas-olimpiadas/image_0.jpg
categories: [analise]
keywords: []
medium_slug: https://medium.com/@basedosdados/o-brasil-nas-olimp%C3%ADadas-2a3f9960cc69
---

## TL;DR

Hoje começa mais uma edição das Olimpíadas, mas você sabia que os jogos da Era Moderna tiveram sua primeira edição em 1896? Nesse texto vamos apresentar dados históricos dos Jogos Olímpicos, que já estão limpos, tratados e disponíveis no datalake público da Base dos Dados. Os [microdados das Olimpíadas](https://basedosdados.org/dataset/62f8cb83-ac37-48be-874b-b94dd92d3e2b?table=567b1ccd-d8c2-4616-bacb-cf5c0e7b8d89) trazem informações sobre os jogos, cidade sede, as delegações, atletas e suas características, além dos esportes, suas diferentes modalidades e medalhistas também.

<Image src="/blog/o-brasil-nas-olimpiadas/image_0.jpg"/>

O script de análise foi executado em R usando nosso pacote de dados. A ideia aqui é mostrar um panorama da performance brasileira nas edições em que a delegação brasileira esteve presente. Vale lembrar que, com a BD+, você também pode acessar esses dados em Python ou diretamente pelo BigQuery.

```r
library("basedosdados")
library("tidyverse")
library("gridExtra")
library("dplyr")

olimpiadas <- basedosdados::read_sql(
    "SELECT * FROM `basedosdados.mundo_kaggle_olimpiadas.microdados` WHERE delegacao = 'BRA'",
    billing_project_id='input-dados'
)
```

## Presença confirmada

O Brasil teve sua primeira participação em uma edição dos Jogos Olímpicos em 1900, na cidade de Paris. O único atleta da delegação era Adolphe Klingelhoeffer, que competia nas provas de atletismo. A próxima edição com representantes brasileiros foi em 1920 e, desde então, temos marcado presença em diferentes provas. Abaixo você pode conferir o panorama da participação brasileira ao longo das edições dos jogos, com número de atletas e modalidades, e veja também o código utilizado para produzir essa visualização.

<Image src="/blog/o-brasil-nas-olimpiadas/image_1.png"/>

```r
counts <- olimpiadas %>% filter(edicao == "Summer") %>%
  group_by(ano) %>%
  summarize(
    atletas = length(unique(id_atleta)),
    eventos = length(unique(evento))
  )

p1 <- ggplot(counts, aes(x=as.numeric(ano), y=as.numeric(atletas))) +
  geom_point() +
  scale_y_continuous(limits=c(0,470)) +
  labs(title="Participação brasileira nos Jogos Olímpicos", y="Total de atletas") +
  theme(plot.title = element_text(hjust = 0.5)) +
  geom_line() + xlab("")

p2 <- ggplot(counts, aes(x=as.numeric(ano), y=as.numeric(eventos))) +
  geom_point() +
  scale_y_continuous(limits=c(0,250)) +
  labs(x="Anos", y="Modalidades") +
  geom_line()

grid.arrange(p1, p2, ncol=1)
```

O recorde de participação brasileira foi em 2016, competindo em casa, com 462 atletas disputando em 222 provas distintas. As edições passadas foram bem diferentes, a média de participação das 5 edições anteriores a 2016 foi de 236 atletas. Esse ano contamos com 302 atletas em Tokyo, segundo dados do Comitê Olímpico Brasileiro.

## Quadro de Medalhas

Em todas as edições, jornais e canais esportivos se concentram nos melhores momentos da nossa delegação e o quadro geral de medalhas é um destaque nos noticiários. Analisando o desempenho dos atletas nos jogos em que participou, o Brasil acumula 30 medalhas de ouro, 36 de prata e 63 bronzes. O gráfico abaixo mostra os esportes, nas modalidades masculina e feminina somados, em que o Brasil divide suas conquistas.

<Image src="/blog/o-brasil-nas-olimpiadas/image_2.png"/>

No nosso pódio, Judô, Vela e Atletismo são os recordistas no total de medalhas com 22, 18 e 16, respectivamente. Os dados permitem identificar quem são os atletas campeões e os eventos em que eles garantiram a vitória. Nas modalidades do Judô 🥋, as mulheres ganharam 3 medalhas de bronze e 2 de ouro, enquanto os homens trouxeram para casa 12 bronzes, 3 pratas e 2 ouros. O script para desenvolver o gráfico é:

```r
medalha_counts <- olimpiadas %>% filter(!is.na(medalha))%>%
  group_by(ano, esporte, evento, medalha) %>% 
  summarize(Count=length(unique(medalha)))

#ordena a tabela
medalha_counts$medalha <- factor(medalha_counts$medalha, levels=c("Gold", "Silver", "Bronze"))

#total de medalhas por modalidade esportiva ao longo dos anos
lev <- medalha_counts %>%
  group_by(esporte) %>%
  summarize(Total=sum(Count)) %>%
  arrange(Total) %>%
  select(esporte)

medalha_counts$esporte <- factor(medalha_counts$esporte, levels=lev$esporte)

#criação do gráfico
ggplot(medalha_counts, aes(x=esporte, y=Count, fill=medalha)) +
  geom_col() +
  coord_flip() +
  scale_fill_manual(values=c("gold1", "gray70", "gold4")) +
  ggtitle("Total de medalhas brasileiras por esporte nos Jogos Olímpicos") +
  theme(plot.title = element_text(hjust = 0.5))
```

## Mulheres nas Olimpíadas

A participação feminina brasileira nos jogos acontece pela primeira vez somente em 1932–36 anos após a primeira edição — e a lacuna entre homens e mulheres é notória. Antes dos anos 2000, a razão de homens para mulheres nos jogos era de 20% em média: ou seja, para cada mulher competindo na delegação, existiam outros 5 homens. Somente no novo milênio que essa desigualdade quase se anula, a nível Brasil. Em 2016, foram 207 mulheres e 255 homens competindo em 31 esportes diferentes.

<Image src="/blog/o-brasil-nas-olimpiadas/image_3.png"/>

O código de análise do total de participação por sexo ao longo dos anos é fácil.

```r
#filtrando para edição de verão dos Jogos
sexo <- olimpiadas %>% filter(edicao == "Summer")

#série do total de atletas por sexo
counts_sex <- sexo %>% 
  group_by(ano, sexo) %>%
  summarize(atletas = length(unique(id_atleta)))

counts_sex$ano <- as.integer(counts_sex$ano)

#criação do gráfico
ggplot(counts_sex, aes(x=ano, y=atletas, group=sexo, color=sexo)) +
  geom_point(size=2) +
  geom_line()  +
  scale_color_manual(values=c("orange","darkgreen")) +
  labs(title = "Participação masculina e feminina nas Olimpíadas") +
  theme(plot.title = element_text(hjust = 0.5))
```

Curtiu essa análise? Nosso intuito aqui foi instigar a você analisar mais. Muitas perguntas podem ser respondidas (e outras tantas serem feitas) analisando essa história. Podemos continuar conversando sobre dados em nossa comunidade no [Discord](https://discord.com/invite/huKWpsVYx4).

Que a força esteja com nossos atletas! Vai Brasil!

A [Base dos Dados](https://basedosdados.org/) é uma iniciativa sem fins lucrativos, open source e que busca facilitar e fomentar a produção de conhecimento no Brasil. Nossa equipe trabalha duro para tratar e disponibilizar dados de qualidade que facilitem sua análise. Seu apoio é importante para manter essa iniciativa.

Apoie pelo [https://apoia.se/basedosdados](https://apoia.se/basedosdados), ou com um PIX: 42494318000116

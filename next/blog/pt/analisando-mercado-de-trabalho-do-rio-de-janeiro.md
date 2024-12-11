---
title: Perigo no mercado de trabalho
description: Analisando o mercado de trabalho do estado do RJ com dados da BD
date:
  created: "2022-03-16T15:00:00"
authors:
  - name: Gabriel Manhães
    role: Texto
    social: https://twitter.com/Manhaes_2000
  - name: Giovane Caruso
    role: Edição
    social: https://medium.com/@giovanecaruso
  - name: Lucas Nascimento
    role: Edição
    social: https://github.com/lucasnascm
  - name: Nayara Moraes
    role: Edição de arte
    social: https://www.linkedin.com/in/nayaramoraesdacosta
thumbnail: /blog/analisando-mercado-de-trabalho-do-rio-de-janeiro/image_1.webp
categories: [analise]
medium_slug: >-
  https://medium.com/basedosdados/perigo-no-mercado-de-trabalho-6b50c825bee1
published: true
---

## TL;DR

Neste artigo vamos analisar a situação do mercado de trabalho no Rio de Janeiro através dos dados do Cadastro Geral de Empregados e Desempregados (CAGED). Essa base já está disponível no _datalake_ público da [Base dos Dados](/dataset/562b56a3-0b01-4735-a049-eeac5681f056?table=95106d6f-e36e-4fed-b8e9-99c41cd99ecf) com informações tratadas e padronizadas. Confira a construção dessa análise, o processo de criação das visualizações que a ilustram e como acessar e explorar você também esses dados.

## Empregados e Desempregados

O mercado de trabalho brasileiro, desde a recessão do país de 2015, vem tentando se recuperar. A pandemia de Covid-19 deixou o cenário ainda mais fragilizado. Através do CAGED é possível extrair informações detalhadas sobre o mercado de trabalho no país. Ele é o instrumento de acompanhamento e de fiscalização do processo de admissão e de dispensa de trabalhadores sob o regime CLT, com o objetivo de assistir os desempregados e de apoiar medidas contra o desemprego.

Nossa análise irá focar em um comparativo entre o estado do Rio de Janeiro com seus 92 municípios e Campo dos Goytacazes, a maior cidade em extensão territorial do estado.

Utilizaremos nosso [pacote em R](https://cran.r-project.org/web/packages/basedosdados/index.html) para mostrar como é simples manusear gigabytes de dados para que sua análise seja possível. Inicialmente, é preciso carregar os pacotes, além de configurar o ambiente com o seu projeto no Google Cloud.

```r
library(basedosdados)
library(ggplot2)
library(extrafont)
library(dplyr)
library(ggthemes)
library(geobr)
library(RColorBrewer)
library(gridExtra)
library(formattable)

set_billing_id("YOUR-PROJECT-HERE")

query <- "
SELECT
  ano,
  mes,
  sigla_uf,
  id_municipio,
  idade,
  saldo_movimentacao,
  salario_mensal,
  sexo,
  raca_cor,
  grau_instrucao
FROM
  `basedosdados.br_me_caged.microdados_movimentacao`
WHERE
  sigla_uf = 'RJ'
"

caged_novo <- read_sql(query)
```

## O Estado do Rio de Janeiro

Um dos sinais de recuperação econômica do estado é o saldo de empregos no município. Com isto em vista, agrupamos a nível municipal as contratações e demissões, depois analisamos se o resultado é positivo ou negativo. Confira o código abaixo.

```r
# Criando coluna de mes_ano

caged_novo$mes_ano <- as.Date(paste(caged_novo$mes, 1, caged_novo$ano, sep = "/"), format = "%m/%d/%Y")

# Coluna de classificacao de admissao ou desligamento

caged_novo$class_ad_des <- ifelse(caged_novo$saldo_movimentacao == 1, "AdmissÃ£o", "Desligamento")

# Calculando saldo de admissao e desligamento por municipio por ano
caged_novo$ano <- lubridate::year(caged_novo$mes_ano)
caged_saldo <- caged_novo %>%
  group_by(ano, id_municipio, class_ad_des) %>%
  summarise(saldo = sum(saldo_movimentacao))

# calculando saldo total
caged_saldo_total <- caged_saldo %>%
  group_by(ano, id_municipio) %>%
  summarise(saldo_total = sum(saldo))

# mapa rj

rj <- read_municipality()
rj <- rj %>% filter(code_state == 33)

# fazendo join de estado com saldo

caged_saldo_total$id_municipio <- as.numeric(caged_saldo_total$id_municipio)
caged_rj <- left_join(caged_saldo_total, rj, by = c("id_municipio" = "code_muni"))

# coluna de classificacao por saldo

caged_rj$class_saldo <- ifelse(caged_rj$saldo_total > 0, "Saldo positivo", "Saldo negativo")

# mapa de saldos por ano

colnames(caged_rj)

caged_rj$saldo_total <- as.numeric(caged_rj$saldo_total)

map_saldo <- ggplot() +
  geom_sf(
    data = caged_rj,
    aes(fill = class_saldo, geometry = geom),
    color = "#2f3e46", alpha = 0.85
  ) +
  facet_wrap(~ano) +
  scale_fill_manual("Legenda:", values = c("#dc2f02", "#55a630")) +
  labs(title = "Saldo de geração de empregos por municipio do RJ") +
  theme(
    plot.title = element_text(size = 13, face = "bold"),
    plot.subtitle = ggtext::element_markdown(size = 10),
    plot.caption = element_text(
      size = 8, color = "#7a7d7e",
      hjust = 0, face = "italic"
    ),
    legend.position = "none",
    strip.background = element_rect(fill = "#9b9b7a"),
    strip.text = element_text(color = "white", size = 8),
    plot.background = element_rect(fill = "white")
  )
```

No mapa, evidenciamos as cidades com um saldo negativo (municípios em vermelho). Durante 2020, o saldo final foi de 132.628 vagas perdidas.

<Image src="/blog/analisando-mercado-de-trabalho-do-rio-de-janeiro/image_0.webp"/>

## Campos dos Goytacazes

Olhando agora o município de Campos dos Goytacazes, vemos um perfil oposto ao do estado. Apesar de ter tido um saldo negativo em 2020, em 2021 o município observou um saldo total de mais 3.832 empregos em relação ao ano anterior. Entretanto, vale ressaltar o perfil da mão de obra da cidade, que cresceu com uma economia baseada em cana de açúcar e latifúndios, ou seja, carregando uma forte marca de concentração de renda e uma massa trabalhadora pouco qualificada.

```r
str(caged_novo)
caged_novo$grau_instrucao <- as.numeric(caged_novo$grau_instrucao)
caged_novo$class_intrucao <-
  ifelse(caged_novo$grau_instrucao == 1, "Analfabeto", caged_novo$grau_instrucao)
caged_novo$class_intrucao <-
  ifelse(caged_novo$class_intrucao == 2 | caged_novo$class_intrucao == 3 | caged_novo$class_intrucao == 4, "Fundamental incompleto",
    caged_novo$class_intrucao
  )
caged_novo$class_intrucao <-
  ifelse(caged_novo$class_intrucao == 5, "Fundamental Completo", caged_novo$class_intrucao)
caged_novo$class_intrucao <-
  ifelse(caged_novo$class_intrucao == 6, "Ensino Medio Incompleto", caged_novo$class_intrucao)
caged_novo$class_intrucao <-
  ifelse(caged_novo$class_intrucao == 7, "Ensino Medio Completo", caged_novo$class_intrucao)
caged_novo$class_intrucao <-
  ifelse(caged_novo$class_intrucao == 8, "Superior Incompleto", caged_novo$class_intrucao)
caged_novo$class_intrucao <-
  ifelse(caged_novo$grau_instrucao > 8, "Superior Completo", caged_novo$class_intrucao)
unique(caged_novo$class_intrucao)

# grafico de distribuicao de formacao por idade

caged_novo$idade <- as.numeric(caged_novo$idade)

# Campos dos goytacazes

hist_campos <- caged_novo %>%
  filter(id_municipio == 3301009) %>%
  ggplot(aes(x = idade, fill = class_intrucao)) +
  geom_density(size = 1, alpha = 0.6) +
  scale_fill_manual("Níveis de escolaridade",
    values = c("#7ec876", "#ca6fe0", "#ff8484", "#fbea53", "#42b0ff", "#f358c8", "#f69e4c")
  ) +
  labs(
    title = "Campos dos Goytacazes", y = "Densidade",
    x = "Idade"
  ) +
  theme(
    plot.title = element_text(size = 11, face = "bold"),
    axis.title.y = element_text(face = "bold", size = 10),
    panel.grid.major.x = element_blank(),
    panel.grid.minor.x = element_blank(),
    axis.text.x = element_text(color = "#3B3B46", size = 9),
    axis.title.x = element_text(face = "bold", size = 10),
    axis.text.y = element_text(color = "#3B3B46"),
    axis.ticks.y = element_blank(),
    plot.caption = element_text(size = 8, color = "#7a7d7e", hjust = 0, face = "italic"),
    legend.position = "none"
  )

# grafico para extrair somente a legenda

hist_campos2 <- caged_novo %>%
  filter(id_municipio == 3301009) %>%
  ggplot(aes(x = idade, fill = class_intrucao)) +
  geom_density(size = 1, alpha = 0.6) +
  scale_fill_manual("Níveis de escolaridade",
    values = c("#7ec876", "#ca6fe0", "#ff8484", "#fbea53", "#42b0ff", "#f358c8", "#f69e4c")
  ) +
  theme(
    legend.position = "bottom",
    legend.text = element_text(size = 8),
    legend.title = element_text(vjust = 0.5, size = 10),
    legend.background = element_rect(fill = "transparent")
  )
get_legend <- function(myggplot) {
  tmp <- ggplot_gtable(ggplot_build(myggplot))
  leg <- which(sapply(tmp$grobs, function(x) x$name) == "guide-box")
  legend <- tmp$grobs[[leg]]
  return(legend)
}
legenda <- get_legend(hist_campos2)

# Estado do Rio de Janeiro

hist_rj <- ggplot(caged_novo, aes(x = idade, fill = class_intrucao)) +
  geom_density(size = 1, alpha = 0.6) +
  scale_fill_manual("Níveis de escolaridade",
    values = c("#7ec876", "#ca6fe0", "#ff8484", "#fbea53", "#42b0ff", "#f358c8", "#f69e4c")
  ) +
  labs(title = "Estado do Rio de Janeiro", y = "Densidade") +
  theme(
    plot.title = element_text(size = 11, face = "bold"),
    axis.title.y = element_text(face = "bold", size = 10),
    panel.grid.major.x = element_blank(),
    panel.grid.minor.x = element_blank(),
    axis.text.x = element_blank(),
    axis.ticks.x = element_blank(),
    axis.title.x = element_blank(),
    axis.text.y = element_text(color = "#3B3B46"),
    axis.ticks.y = element_blank(),
    legend.position = "none"
  )

# Unindo plots

hist_total <- grid.arrange(hist_rj, hist_campos, legenda,
  nrow = 3, ncol = 1,
  widths = 5, heights = c(3, 3, 1)
)
```

Como é possível observar nos dados, em comparação com o estado, Campos possui uma população com uma taxa desproporcionalmente alta de analfabetismo, sobretudo entre 50 e 60 anos de idade. O gráfico abaixo ilustra esse cenário:

<Image src="/blog/analisando-mercado-de-trabalho-do-rio-de-janeiro/image_1.webp"/>

Essa situação se reflete nos salários, uma vez que a faixa etária onde deveriam ocorrer os maiores registros de remuneração possui as maiores taxas de analfabetismo da sociedade campista. Apesar de ser consideravelmente rica por conta dos royalties advindos da exploração de petróleo da bacia de Campos, a baixa qualificação da população faz o município figurar apenas a décima colocação das medianas salariais do estado do Rio de Janeiro em 2021, não aparecendo nem no top 10 em 2020, mesmo com um baixo saldo negativo de empregos.

```r
# Mediana salarial por municipio

caged_mediana <- caged_novo %>%
  group_by(id_municipio, ano, sexo) %>%
  summarise(mediana_salarial = median(salario_mensal))

# classificacao para raca_cor

str(caged_mediana)
caged_mediana$class_sexo <- ifelse(caged_mediana$sexo == 1, "Homem", caged_mediana$sexo)
caged_mediana$class_sexo <- ifelse(caged_mediana$sexo == 3, "Mulher", caged_mediana$class_sexo)
caged_mediana$class_sexo <- ifelse(caged_mediana$sexo == 9, "Não Identificado", caged_mediana$class_sexo)

# Excluindo coluna de sexo

caged_mediana$sexo <- NULL
caged_mediana$ano <- as.numeric(caged_mediana$ano)

# mediana geral por municipio

caged_mediana_geral <- na.omit(caged_novo) %>%
  group_by(id_municipio, ano) %>%
  summarise(mediana_salarial = median(salario_mensal))

# top 10 medianas salariais em 2021

caged_mediana_geral_2021_rank <- caged_mediana_geral %>%
  filter(ano == 2021) %>%
  group_by(ano) %>%
  mutate(rank = rank(-mediana_salarial)) %>%
  filter(rank <= 10) %>%
  arrange(rank)

# inserindo nome do municipio

caged_mediana_geral_2021_rank$id_municipio <- as.numeric(caged_mediana_geral_2021_rank$id_municipio)
caged_mediana_geral_2021_rank <- left_join(caged_mediana_geral_2021_rank, rj,
  by = c("id_municipio" = "code_muni")
)
colnames(caged_mediana_geral_2021_rank)
caged_mediana_geral_2021_rank <- caged_mediana_geral_2021_rank[, -c(1, 2, 6, 7, 8)]

# top 10 medianas salariais em 2020

caged_mediana_geral_2020_rank <- caged_mediana_geral %>%
  filter(ano == 2020) %>%
  group_by(ano) %>%
  mutate(rank = rank(-mediana_salarial)) %>%
  filter(rank <= 10) %>%
  arrange(rank)

# inserindo nome do municipio

caged_mediana_geral_2020_rank$id_municipio <- as.numeric(caged_mediana_geral_2020_rank$id_municipio)
caged_mediana_geral_2020_rank <- left_join(caged_mediana_geral_2020_rank, rj,
  by = c("id_municipio" = "code_muni")
)
colnames(caged_mediana_geral_2020_rank)
caged_mediana_geral_2020_rank <- caged_mediana_geral_2020_rank[, -c(1, 2, 6, 7, 8)]

# reordeando tabelas

caged_mediana_geral_2020_rank <- caged_mediana_geral_2020_rank[, c("rank", "name_muni", "mediana_salarial")]
caged_mediana_geral_2021_rank <- caged_mediana_geral_2021_rank[, c("rank", "name_muni", "mediana_salarial")]

# modificando nomes

colnames(caged_mediana_geral_2020_rank) <- c("Rank", "Município", "Mediana Salarial")
colnames(caged_mediana_geral_2021_rank) <- c("Rank", "Município", "Mediana Salarial")

# criando tabelas

formattable(caged_mediana_geral_2020_rank,
  align = c("l", "l", "c"),
  list(
    `Rank` = formatter(
      "span",
      style = ~ style(color = "#495057", font.weight = "bold")
    ),
    `Município` = formatter(
      "span",
      style = ~ style(color = "#495057", font.weight = "bold")
    ),
    `Mediana Salarial` = formatter(
      "span",
      style = ~ style(color = "#495057", font.weight = "bold")
    )
  )
)
formattable(caged_mediana_geral_2021_rank,
  align = c("l", "l", "c"),
  list(
    `Rank` = formatter(
      "span",
      style = ~ style(color = "#495057", font.weight = "bold")
    ),
    `Município` = formatter(
      "span",
      style = ~ style(color = "#495057", font.weight = "bold")
    ),
    `Mediana Salarial` = formatter(
      "span",
      style = ~ style(color = "#495057", font.weight = "bold")
    )
  )
)
```

Quando analisadas as médias, a cidade não aparece no top 10 em nenhum dos 2 anos analisados. Importante analisar também a queda salarial entre os anos. A maior mediana salarial de 2021 é 17% inferior à maior mediana de 2020.

Confira abaixo os municípios com as 10 maiores medianas salariais no estado do Rio:

| Rank | Município         | Mediana Salarial |
| ---- | ----------------- | ---------------- |
| 1    | São João Da Barra | 2050.40          |
| 2    | Macaé             | 1695.50          |
| 3    | Itaboraí          | 1486.83          |
| 4    | Porto Real        | 1446.50          |
| 5    | Itaguaí           | 1375.01          |
| 6    | Rio Das Ostras    | 1323.31          |
| 7    | Silva Jardim      | 1317.19          |
| 8    | Rio De Janeiro    | 1316.01          |
| 9    | Cordeiro          | 1310.87          |
| 10   | Petrópolis        | 1310.00          |

Já em 2021, Campos de Goytacazes aparece no décimo lugar da lista:

| Rank | Município             | Mediana Salarial |
| ---- | --------------------- | ---------------- |
| 1    | Macaé                 | 1700.09          |
| 2    | São João Da Barra     | 1612.60          |
| 3    | Itaguaí               | 1423.06          |
| 4    | Porto Real            | 1406.89          |
| 5    | Itaboraí              | 1375.01          |
| 6    | Rio De Janeiro        | 1370.00          |
| 7    | Rio Das Ostras        | 1357.00          |
| 8    | Petrópolis            | 1350.00          |
| 9    | Resende               | 1348.73          |
| 10   | Campos Dos Goytacazes | 1345.00          |

Ainda na questão salarial, mas agora no estado do Rio de Janeiro, houve uma característica interessante no perfil salarial.

```r
# distribuicao das medianas no RJ

dist_sal <- ggplot(caged_mediana, aes(x = mediana_salarial, fill = class_sexo)) +
  geom_density(size = 1, alpha = 0.6) +
  facet_wrap(~ano) +
  scale_fill_manual("Sexo",
    values = c("#f77f00", "#3d405b")
  ) +
  labs(
    title = "Distribuição das medianas salariais no RJ", y = "Densidade",
    x = "Mediana"
  ) +
  theme(
    plot.title = element_text(size = 11, face = "bold"),
    axis.title.y = element_text(face = "bold", size = 10),
    panel.grid.major.x = element_blank(),
    panel.grid.minor.x = element_blank(),
    axis.text.x = element_text(color = "#3B3B46", size = 9),
    axis.title.x = element_text(face = "bold", size = 10),
    axis.text.y = element_text(color = "#3B3B46"),
    axis.ticks.y = element_blank(),
    plot.caption = element_text(size = 8, color = "#7a7d7e", hjust = 0, face = "italic"),
    legend.position = "bottom"
  )
```

Nota: Há um considerável contingente de missing (Não Informado) para a variável sexo.

Enquanto a [literatura atual](https://www.anpec.org.br/encontro/2021/submissao/files_I/i13-75c71528dfa0a7d8f99e1bf79578b404.pdf) demostra que minorias, como negros e mulheres sofreram mais com a atual pandemia no estado, a mediana dos salários dos homens sofreu uma queda considerável entre 2020 e 2021, conforme mostra o gráfico abaixo:

<Image src="/blog/analisando-mercado-de-trabalho-do-rio-de-janeiro/image_4.webp"/>

Vale ressaltar ainda que a pandemia causou uma anomalia importante no mercado de trabalho. A [literatura atual](<https://www.cemla.org/actividades/2021-final/2021-07-conference-frbny-ecb/SIII.1(PAPER)Leyva_Urrutia.pdf>) mostra que o mercado informal, que costumava ter um perfil contra cíclico —aumentando durante crises, em decorrência da profunda desaceleração econômica e da maior dependência de contato físico — vem também se reduzindo durante a pandemia. E não apenas no Brasil, mas também na América Latina.

Dessa forma, conseguimos observar que o estado do Rio de Janeiro vem conseguindo, de maneira geral, recuperar seu mercado de trabalho. Entretanto, como indica a experiência que vimos com relação à cidade de Campos, uma maior quantidade de contratações não basta, uma vez que o mercado ainda se encontra frágil e com alta demanda por emprego, fazendo com que os salários caiam. Como vimos, esse fato é ainda mais intensificado quando a população é pouco qualificada.

Portanto, as notícias são de que o desemprego no estado tende a se recuperar, mas iremos observar uma importante queda no poder de compra, já que de um lado vemos uma queda nos salários e, de outro, uma inflação perigosamente alta. Vivemos, talvez, nesse momento, uma perigosa armadilha no mercado de trabalho: empregos subindo, mas salários caindo.

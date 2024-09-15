---
title: Como explorar e análisar os dados de Crédito Rural no Brasil?
description: >-
  Veja uma maneira prática de analisar os microdados do Sistema de Operações do
  Crédito Rural e do Proagro (SICOR)
date:
  created: '2023-02-01'
authors:
  - name: Gabriel Pisa
    role: Autor
    social: https://www.linkedin.com/in/gabriel-pisa/
  - name: Giovane Caruso
    role: Edição
    social: https://www.linkedin.com/in/giovanecaruso/
thumbnail: /blog/como-explorar-e-analisar-os-dados-de-credito-rural-no-brasil/image_0.png
categories: [analise]
keywords: []
medium_slug: https://medium.com/basedosdados/como-explorar-e-an%C3%A1lisar-os-dados-de-cr%C3%A9dito-rural-no-brasil-53cf6c478781
---

## TL;DR

Nesse artigo, você vai entender como funciona o Crédito Rural no Brasil, quais instituições participam desse processo de financiamento e como você pode acessar e análisar os microdados já tratados com essas informações pelo [datalake público da Base dos Dados](https://basedosdados.org/dataset/br-bcb-sicor?bdm_table=dicionario). Além disso, você confere alguns exemplos práticos de análises com os dados do Sistema de Operações do Crédito Rural e do Proagro.

Os tópicos deste artigo estão separados em:

- O que é o Crédito Rural e como ele é concedido e regulado no Brasil
- De onde vêm os dados de Crédito Rural
- Analisando os microdados de Crédito Rural

## O que é o crédito rural e como ele é concedido e regulado? 

Antes de começarmos a falar sobre os dados, vamos fazer uma breve contextualização sobre como funciona o Crédito Rural (CR), como ele é concedido e regularizado.

Tudo começa com o Sistema Nacional de Crédito Rural (SNCR), **criado em 1965 com objetivo de estimular os financiamentos de custeio e investimento rurais.** O SNCR congrega o conjunto de instituições responsáveis por estruturar, regular e operacionalizar a concessão de CR no Brasil. Entenda melhor o papel de cada uma dessas instituições:

* O **Ministério da Agricultura e do Abastecimento (MAPA)** é um ator chave na elaboração da política de CR, sendo responsável por determinar fatores como volume de recursos públicos, condições de enquadramento dos produtores e taxas juros praticadas para cada **ano safra (AS),** período que se extende de 1º de julho do ano corrente a junho do ano seguinte, para o qual é planejada o exercício da política de crédito rural. Oconjunto das normas regimentais definidas pelo MAPA codificado no Manual de Crédito Rural (MCR) pode ser acessado por [aqui](https://www3.bcb.gov.br/mcr).
* O **Banco Central (BACEN)** desempenha o papel de orgão regulador das normas codificadas no Manual do Crédito Rural (MCR), que devem ser respeitadas pelas **Instituições financeiras públicas e privadas (IFs)** durante a realização de contratações de CR. É justamente na fiscalização do BACEN das operações de CR contratadas pelas IFs que surgem os [**Microdados do Crédito Rural**](https://basedosdados.org/dataset/br-bcb-sicor?bdm_table=dicionario), já tratados e disponibilizados no datalake da Base dos Dados, e disponíveis em seu formato original no [site do BACEN](https://www.bcb.gov.br/estabilidadefinanceira/creditorural).

Para resumir, é o MAPA que **estipula**, o BACEN **regula** e as IFs **concedem** crédito*. A imagem abaixo sintetiza bem a composição e funcionamento do Sistema Nacional de Crédito Rural (SNCR)

<Image src="/blog/como-explorar-e-analisar-os-dados-de-credito-rural-no-brasil/image_0.png" caption="Esquema com instituições envolvidas na concessão de Crédito Rural no Brasil e seus papéis. [Fonte](https://www.radardesustentabilidade.org.br/media/guidelines/files/GGP_Gênero_Cartilha_3_PT_WEB.pdf)"/>

## De onde vêm os microdados do Crédito Rural?

Em 2013 o Banco Central anunciou a implementação de um novo sistema para o registro das contratações de crédito rural no Brasil. O [anúncio](https://www.bcb.gov.br/detalhenoticia/616/noticia) explica que o Sistema de Operações do Crédito Rural e do Proagro (SICOR) substituiu o antigo Registro Comum de Operações Rurais (RECOR), incorporando a exigência de um registro contínuo e sistemático das contratações de crédito rural. Os microdados do SICOR abarcam mais de 10 anos de contratações realizadas em todo território nacional.

De janeiro de 2013 a setembro de 2022, por exemplo, foram registradas 19.65 milhões de contratos e R$ 1.66 trilhões em financiamentos de CR. Atualmente, os mais de 260 campos potencialmente preenchidos no ato da contratação das operações de crédito estão sujeitos a cerca de 1.300 validações.

**Em que pesem possibilidades de inconsistência no preenchimento das contratações realizadas pelas IFs no SICOR, o volume de dados, a exigência de seu registro sistemático e as validações findam em um rico conjunto de microdados que permitem explorar, analisar e avaliar o SNCR sob diferentes perspectivas.**

A imagem abaixo ajuda a compreender o panorama geral dos atores e componentes importantes do Sistema Nacional de Crédito Rural (SNCR), com destaque para as fontes de recurso e os beneficiários.

<Image src="/blog/como-explorar-e-analisar-os-dados-de-credito-rural-no-brasil/image_1.png"/>

Se quiser se aprofundar mais, você pode ver mais informações do Banco Central do Brasil sobre como funciona o Crédito Rural por [aqui](https://www.bcb.gov.br/estabilidadefinanceira/creditorural). Feita essa breve introdução, vamos enfim começar a explorar e analisar os dados com algumas perguntas interessantes. 

## Analisando os microdados de Crédito Rural

### Qual o volume de recursos contratados em operações de crédito rural por ano?

Vamos começar a analisar os dados de Crédito Rural observando o valor de recursos contratados de 2013 a 2022. Observe abaixo o código utilizado.

```r
#settings
options(scipen = 999)

#carregar bibliotecas
library(basedosdados)
library(dplyr)
library(readr)
library(stringr)
library(DT)
library(ggplot2)
library(ggrepel)
library(RColorBrewer)
library(viridis)

#settar billing id do projeto no google 
#cloud para acessar os dados  no datalake da BD

set_billing_id('insira-seu-billing-id')
```

```r
#aqui são definidos algums temas padrões para os gráficos
#construidos durante a análise.

tema_sem_legenda <- theme_classic() +
  theme(axis.title.x = element_text(colour = "black"),
        axis.title.y = element_text(colour = "black"),
        axis.text.y = element_text(face="bold", color="#000000", 
                                   size=12),
        axis.line = element_line(colour = "black", 
                                 size = 1.5, linetype = "solid"),
        axis.text=element_text(size=8, face="bold"),
        axis.text.x = element_text(face="bold", color="#000000", size=11),
        plot.title = element_text(colour = "black", face = 'bold' ,size = 15, hjust=0),
        plot.subtitle = element_text(colour = 'black', size  = 12),
        legend.position = 'none') 

tema_com_legenda <-  theme_classic() +
  theme(axis.title.x = element_text(colour = "black"),
        axis.title.y = element_text(colour = "black"),
        axis.text.y = element_text(face="bold", color="#000000", 
                                   size=12),
        axis.line = element_line(colour = "black", 
                                 size = 1.5, linetype = "solid"),
        axis.text=element_text(size=8, face="bold"),
        axis.text.x = element_text(face="bold", color="#000000", size=11),
        plot.title = element_text(colour = "black", face = 'bold' ,size = 15, hjust=0),
        plot.subtitle = element_text(colour = 'black', size  = 12),
        legend.position = 'top',
        legend.text = element_text(size = 12))
```

A tabela que contém parte considerável das informações sobre as operações de crédito rural —  dentre elas o valor de crédito contrato por operação  —  é a `microdados_operacao`. Para uma visão agregada, veremos o montante de CR concedido por ano, durante 2013 a 2022.

```r
#vamos a primeira query!
#O objetivo é construir uma tabela agregada com a soma do valor das operações de crédito por ano.
#Basta selecionar a tabela de *microdados_operacao* e somar o valor total das operações por ano.

operacoes_ano <- read_sql("SELECT  op.ano, SUM (op.valor_parcela_credito) AS valor_total
FROM `basedosdados.br_bcb_sicor.microdados_operacao` op
GROUP BY op.ano  
ORDER BY op.ano")

#Em seguida, é só elaborar o gráfico

plot1 <-operacoes_ano %>%
  mutate(valor_total = round(valor_total/1000000000, 2),
         ano = as.integer(ano)) %>% 
  ggplot(aes(x = ano, y = valor_total)) +
  geom_line(size = 2) +
  geom_point(aes( color = 'red'), size = 3) +
  geom_text_repel(aes(label = valor_total), fontface = 'bold', 
                   color = 'black', size = 4,
                  vjust = -0.8, hjust = -1.2,  segment.linetype = 6,
                 
                  arrow = arrow(length = unit(0.09, "inches"))) +
  scale_x_continuous(breaks = c(2013:2022)) +
  scale_y_continuous(limits = c(100,300), breaks = seq(50,300, 50)) +
  tema_sem_legenda +
  labs(y = " " ,
       x = " ", 
       caption = "Fonte: elaborado pelo autor com Microdados do SICOR extraidos da @Basedosdados.",
       title = "Valor de Crédito Rural contratado por ano, durante janeiro de 2013 a setembro de 2022",
       subtitle = "Preços constantes em Bilhões (R$)")
```

<Image src="/blog/como-explorar-e-analisar-os-dados-de-credito-rural-no-brasil/image_2.png" caption="Valor de Crédito Rural contratado por ano, durante janeiro de 2013 a setembro de 2022"/>

### Qual foi o montante de crédito cocedido por categoria de produtor?

O enquadramento do produtor rural é feito pela Instituição Financeira (IF) durante o processo de concessão de crédito (CMN nº 4.883 art 1º e Res CMN nº 4.939 art 1º). A classificação pode ser realizada a partir da Renda Bruta Agropecuária (RBA) de um dos últimos 2 anos ou pela participação do beneficiário em programas de crédito para setores específicos.

No ano safra de 2021/2022 as categorias são definidas por:

- 1.1 Pequeno Produtor (PP): RBA até 500.000 reais ou detentores da Declaração de Aptidão ao PRONAF (DAP);
- 1.2 Médio Produtor (MP): RBA maior que 500.000 até 2.400.000 reais ou aqueles enquadrados no programa de apoio ao médio produtor Rural (PRONAMP);
- 1.3 Grande Produtor (GP): RBA acima de 2.400.000 ou produtores que possuam mais de 20% de sua renda obtida de fontes indiretamente correlatas ou externas as atividades rurais.

Com a tabela abaixo mostra o valor contratado por categoria durante o período

```r
#A categoria do produtor esta mapeada no *dicionario*. Optei por fazer um *join*
#da tabela de microdados com o dicionário, mas seria perfeitamente
#possível atribuir os valores usando a expressão *case when*.

operacoes <- read_sql("SELECT dic.valor, SUM (op.valor_parcela_credito) AS valor_total
FROM `basedosdados.br_bcb_sicor.microdados_operacao` op
INNER JOIN `basedosdados.br_bcb_sicor.dicionario` dic
ON op.id_categoria_emitente = dic.chave AND 
dic.nome_coluna = 'id_categoria_emitente'
GROUP BY  dic.valor 
ORDER BY valor_total")

#formatar a tabela para ficar apresentável 
operacoes <- operacoes %>% 
  filter(valor_total > 3000000000) %>% 
  mutate(
    percentual = paste0('%', round(valor_total*100/sum(valor_total),2)),
    valor_total = paste0('R$ ', round(valor_total/1000000000, 2)))  %>% 
  datatable(extensions = 'Buttons',
            options = list(dom = 'Blfrtip',
                           buttons = c('copy', 'csv', 'print'),
                           lengthMenu = list(c(10,25,50,-1),
                                             c(10,25,50,"All"))))

operacoes
```

<Image src="/blog/como-explorar-e-analisar-os-dados-de-credito-rural-no-brasil/image_8.webp" caption="Tabela com o valor contratado por categoria durante o período"/>

A nível nacional uma fatia considerável do valor total (43,88%) é abocanhada por Grandes Produtores Rurais, seguidos pelos Médios (36,22%) e pelos pequenos (19,8%).

A figura abaixo mostra o valor absoluto em crédito contratado para cada categoria durante o período:

```r
#Esta query é bastante similar a anterior, com a diferença de que os valores 
#foram somados por ano. 

operacoes_ano_st <- read_sql("SELECT op.ano, dic.valor, SUM (op.valor_parcela_credito) AS valor_total
FROM `basedosdados.br_bcb_sicor.microdados_operacao` op
INNER JOIN `basedosdados.br_bcb_sicor.dicionario` dic
ON op.id_categoria_emitente = dic.chave AND 
dic.nome_coluna = 'id_categoria_emitente'
GROUP BY  op.ano, dic.valor 
ORDER BY valor_total")

#gráfico 

plot2 <- operacoes_ano_st %>% 
  filter(valor_total > 3000000000) %>% 
  mutate(ano = as.integer(ano),
         valor_total = valor_total) %>% 
  ggplot(aes(x = ano, y = valor_total/1000000000, fill = valor)) +
  geom_col(position = 'stack') +
  geom_text(aes(label = round(valor_total/1000000000, 2)),
            position = position_stack(vjust = .5),
            size = 5) +
  scale_x_continuous(breaks = c(2013:2022)) +
  scale_fill_manual(values = c("#DADAEB", "#9E9AC8", "#6A51A3"), name = ' ') +
  tema_com_legenda +
  labs(y = " " ,x = " ", caption = "Fonte: elaborado pelo autor com Microdados do SICOR extraidos da @Basedosdados.",
       title = "Valor de Crédito Rural contratado por categoria de beneficiário,\n durante janeiro de 2013 a setembro de 2022",
       subtitle = "Preços constantes em Bilhões (R$)") 


plot2
```

<Image src="/blog/como-explorar-e-analisar-os-dados-de-credito-rural-no-brasil/image_3.png" caption="Valor de Crédito Rural contratado por categoria de beneficiário durante janeiro de 2013 a setembro de 2022"/>

De modo geral, a demanda por crédito é influência pela taxa SELIC — a taxa de juros básica da econômia. Juros mais altos tendêm a reduzir a demanda, enquanto juros mais baixos tendêm a aumentá-la. Em 2020 a SELIC permaneceu em patamares historicamente baixos, a um valor médio de 2,0% ao ano (a.a.). Já em 2021, apesar do aumento de 7,25% ao longo do ano, a SELIC esteve abaixo de 7.75% até dezembro, o que pode explicar em parte o crescimento expressivo observado em 2020 e sobretudo em 2021.

### Quais são os produtos mais financiados em termos de valor de crédito por categoria de beneficiário?

Os dados gerais sobre a operação de crédito estão concentrados na tabela de `microdados_operacao`. Nela, consta um código do empreendimento que está sendo financiado. Em outras palavras, o empreendimento é uma concatenação de códigos que qualificam a operação de crédito. Por exemplo, suponhamos que o código `1` identifique atividades agrícolas, o `2222` Pequenos Produtores Rurais e o `323` a Açaí. Nesse exemplo hipotético, o código do empreendimento seria `1222323`.

O conjunto de códigos de empreendimento existentes esta descrito na tabela empreendimento.

```r
produtos_emitentes <- read_sql('SELECT  op.id_categoria_emitente,emp.produto, sum(op.valor_parcela_credito) AS valor_total
FROM `basedosdados.br_bcb_sicor.microdados_operacao` op
INNER JOIN `basedosdados.br_bcb_sicor.empreendimento` emp
ON op.id_empreendimento = emp.id_empreendimento
GROUP BY op.id_categoria_emitente, emp.produto')

#gráfico

plot3 <- produtos_emitentes %>% 
  group_by(id_categoria_emitente) %>% 
  mutate(rank_produtos_emitentes =  rank(-valor_total)) %>% 
  filter(rank_produtos_emitentes <= 3 &
           (id_categoria_emitente %in% c(2222,3333,4444))) %>% 
  mutate(nome_emitente = if_else(id_categoria_emitente == 2222, 
                                 'Pequeno Produtor Rural',
                                 if_else(id_categoria_emitente == 3333,
                                         'Médio Produtor Rural',
                                         'Grande Produtor Rural'))) %>% 
  ggplot(aes(x = nome_emitente, y = valor_total/1000000000, fill = produto)) +
  geom_col(aes(
               group = rank_produtos_emitentes),
           position = 'dodge') +
  geom_text(aes(label = paste0(round(valor_total/1000000000,2),' BI'),
                group = rank_produtos_emitentes),
                  position = position_dodge(.9),
            vjust = -.2,hjust = .5, size = 6)+
  scale_fill_manual(values = c("#482677FF", "#33638DFF", "#20A387FF", '95D840FF'), name = ' ') +
  tema_com_legenda +
  labs(y = " " ,
       x = " ", 
       caption = "Fonte: elaborado pelo autor com Microdados do SICOR extraidos da @Basedosdados.",
       title = "Top 3 produtos financiados por categoria de beneficiário durante janeiro de 2013 \n a setembro de 2022",
       subtitle = "Preços constantes em Bilhões (R$)") 

plot3
```

<Image src="/blog/como-explorar-e-analisar-os-dados-de-credito-rural-no-brasil/image_4.png" caption="Top 3 financiados por categoria de beneficiário durante janeiro de 2013 a setembro de 2022"/>

É bastante perceptível o alto grau de homogeinização dos produtos com maior valor de crédito contratado. A soja aparece como o principal para os GP e MP seguida dos Bovinos. Para os PP a situação se inverte, o financiamento a Bovinos aparece como principal, seguido do milho e da soja.

É interessante ressaltar que existem muitos atributos que qualificam os produtos financiados. É gado para corte ou produção de leite? A modalidade de criação é extensiva ou intensiva? O Gado é financiado junto com a soja? Um pedacito da beleza dos microdados do CR está justamente nas possibilidades de agregações. O BACEN divulga estatísticas agregadas sobre a concessão de crédito rural que invibilizam diversas opções de análise. São exemplos de perguntas que podem ser respondidas manejando os microdados. Em particular as tabelas de `empreendimentos` e `microdados_operacao`, também utilizadas na query acima.

### Quais bancos financiam quais categorias de produtores rurais?

Enfim, chegamos a um ponto interessante: entender a relação entre os bancos e as categorias de produtores rurais com financiamento. A planilha intitulada `bancos` é divulgada pelo BACEN, se refere ao conjunto de IFs, seus postos e [agências em atividade no mês de referência](https://www.bcb.gov.br/fis/info/agencias.asp?frame=1). Essa é uma base bastante útil quando se trabalha com IFs, pois permite identificar os CNPJs, a localização geográfica das agências e demais atributos.

```r
#ler csv com relação de nomes de bancos e cnpjs
bancos <- read_csv2("C:/Users/gabri/Downloads/202105AGENCIAS/202105AGENCIAS.csv") %>% 
  mutate(cnpj_instituicao_financeira = as.character(CNPJ),
    cnpj_instituicao_financeira = gsub('\\.', '', cnpj_instituicao_financeira)) %>% 
  select(cnpj_instituicao_financeira,
         nome_instituicao_financeira  = `NOME INSTITUIÇÃO`) %>% 
  unique()


# Esta query agregada o valor de crédito rural concedido por Instituição Financeira
#para cada categoria de produtor rural 

top3_ifs_prod <- read_sql('SELECT op.id_categoria_emitente, op.cnpj_instituicao_financeira, 
                          SUM (op.valor_parcela_credito) AS valor_total
                          FROM `basedosdados.br_bcb_sicor.microdados_operacao` op
                          GROUP BY op.cnpj_instituicao_financeira, op.id_categoria_emitente')


#elborar gráfico
plot4 <- top3_ifs_prod %>% 
  group_by(id_categoria_emitente) %>% 
  mutate(rank_produtos_emitentes =  rank(-valor_total),
         nome_emitente = if_else(id_categoria_emitente == 2222, 
                                 'Pequeno Produtor Rural',
                                 if_else(id_categoria_emitente == 3333,
                                         'Médio Produtor Rural',
                                         'Grande Produtor Rural'))) %>%
  filter(rank_produtos_emitentes <= 3 &
           (id_categoria_emitente %in% c(2222,3333,4444))) %>% 
  inner_join(bancos,
             by = c('cnpj_instituicao_financeira')) %>% 
  ggplot(aes(x = nome_emitente, y = valor_total/1000000000, fill = nome_instituicao_financeira)) +
  geom_col(aes(
               group = rank_produtos_emitentes),
           position = 'dodge') +
  geom_text(aes(
                 group = rank_produtos_emitentes,
                 label = paste0(round(valor_total/1000000000,2),' BI')),
            position = position_dodge(.9),
            vjust = -.2, size = 6) +
  scale_fill_viridis(discrete = TRUE, name = '') +
  tema_com_legenda +
  labs(y = " " ,
       x = " ",
       caption = "Fonte: elaborado pelo autor com Microdados do SICOR extraidos da @Basedosdados.",
       title = "Top 3 Instituições financeiras por categoria de beneficiário durante janeiro de 2013\n a setembro de 2022",
       subtitle = "Preços constantes em Bilhões (R$)") 

plot4
```

<Image src="/blog/como-explorar-e-analisar-os-dados-de-credito-rural-no-brasil/image_5.png" caption="Top 3 instituições financeiras por categoria de beneficiário durante janeiro de 2013 a setembro de 2022"/>

O papel dos bancos públicos na concessão de crédito rural torna-se nítido, com o Banco do Brasil (BB) como maior credor para todas as categorias. Ademais disso, para os PP as 3 IFs com maior valor contratado são públicas. Para os MP foi identificado o banco do Bradesco em segundo lugar. Por fim, apesar do BB aperecer como maior credor os GP tem como financiadores importantes dois grandes bancos privados: Itaú e Bradesco.

### Quais são os maiores credores do CR?

```r
#Esta query é similar a anterior, com a diferença de que o valor das operações 
#de crédito foi agregado para as intituições financeiras, durante todo o período de
#cobertura da base 
credito_banco <- read_sql('SELECT  op.cnpj_instituicao_financeira,   
SUM (op.valor_parcela_credito) AS valor_total
FROM `basedosdados.br_bcb_sicor.microdados_operacao` op
GROUP BY  op.cnpj_instituicao_financeira')

#alterar o nome BANCO para reduzir o tamanho e facilitar a visualização
bancos <- bancos %>% 
  mutate(nome_instituicao_financeira = str_replace_all(nome_instituicao_financeira, 'BANCO', 'B.'))

#criar veotor com cores
cores <- rep('palegreen2',8)

#construir gráfico
plot5 <- credito_banco %>%
  mutate(rank_produtos_emitentes =  rank(-valor_total)) %>%
  filter(rank_produtos_emitentes <= 8) %>%
  inner_join(bancos,
             by = c('cnpj_instituicao_financeira')) %>%
  ggplot(aes(x = reorder(nome_instituicao_financeira,
                         -valor_total/1000000000),
             y = valor_total/1000000000,
             fill = nome_instituicao_financeira))+
  geom_col() +
  coord_flip() +
  geom_text(aes(label = round(valor_total/1000000000,2)),
            size  = 5,
            hjust = 0.4)+
  scale_fill_manual(values = cores) +
  theme_classic() +
  tema_sem_legenda +
  labs(y = " " ,x = " ", caption = "Fonte: elaborado pelo autor com Microdados do SICOR extraidos da @Basedosdados.",
       title = "Top 8 Instituições financeiras por valor financiado \n durante janeiro de 2013 a setembro de 2022",
       subtitle = "Preços constantes em Bilhões (R$)")

plot5
```

<Image src="/blog/como-explorar-e-analisar-os-dados-de-credito-rural-no-brasil/image_6.png" caption="Top 8 instituições financeiras por valor financiado durante janeiro de 2013 a setembro de 2022"/>

### Quais programas de crédito tem maior valor de recursos contratado?

Os programas de crédito têm relação direta com a política de CR do MAPA. A cada ano safra, é reservado um montante de recursos a taxas de juros subsidiadas para atender setores específicos do meio rural. Um exemplo importante é o Programa de Fortalecimento da Agricultura Familiar (PRONAF).

```r
prog <- read_sql("SELECT  dic.valor,  
SUM (op.valor_parcela_credito) AS valor_total
FROM `basedosdados.br_bcb_sicor.microdados_operacao` op
INNER JOIN `basedosdados.br_bcb_sicor.dicionario` dic
ON op.id_programa = dic.chave AND 
dic.nome_coluna = 'id_programa'
GROUP BY  dic.valor")

#criar veotor com cores
cores <- rep('skyblue1', 8)

#elaborar gráfico
plot6 <-prog %>%
  mutate(rank_programa =  rank(-valor_total)) %>%
  filter(rank_programa <= 8) %>%
  #renomear programas para construir visualização 
  mutate(valor = if_else(valor == "Funcafé (Programa De Defesa Da Economia Cafeeira)",
                         'Funcafé',
                         if_else(valor == "Psi-Rural - Programa De Sustentação Do Investimento",
                                 'Psi-Rural',
                                 if_else(valor == "Abc - Programa Para Redução Da Emissão De Gases De Efeito Estufa Na Agropecuária",
                                         'Abc',
                                         if_else(valor == "Pronaf - Programa Nacional De Fortalecimento Da Agricultura Familiar",
                                                 'Pronaf',
                                                 if_else(valor == "Pca - Programa Para Construção E Ampliação De Armazéns",
                                                         'Pca',
                                                         if_else(valor == "Moderfrota - Programa De Modernização Da Frota De Tratores Agrícolas E Impl Assoc E Colheitadeiras",
                                                                 'Moderfrota',
                                                                 if_else(valor == "Pronamp - Programa Nacional De Apoio Ao Médio Produtor Rural",
                                                                        'Pronamp',
                                                                        "FVPE" )))))))) %>%
  ggplot(aes(x = reorder(valor,
                         -valor_total),
             y = valor_total/1000000000)) +
  geom_col(aes(fill = valor)) +
  geom_text(aes(
                label = round(valor_total/1000000000,2)),
            size  = 5,
            hjust = 0.3) +
  coord_flip() +
  scale_fill_manual(values = cores) +
  theme_classic() +
  tema_sem_legenda + 
  labs(y = " " ,x = " ", caption = "Fonte: elaborado pelo autor com Microdados do SICOR extraidos da @Basedosdados.",
       title = "Top 8 Programas de Crédito por valor financiado durante \n janeiro de 2013 a setembro de 2022",
       subtitle = "Preços constantes em Bilhões (R$)")


plot6
```

<Image src="/blog/como-explorar-e-analisar-os-dados-de-credito-rural-no-brasil/image_7.png" cation="Top 8 programas de Crédito por valor financiado durante janeiro de 2013 a setembro de 2022"/>


Descrição das siglas dos programas:

- Funcafé: Funcafé (Programa De Defesa Da Economia Cafeeira
- Psi-Rural: Programa De Sustentação Do Investimento
- Abc: Programa Para Redução Da Emissão De Gases De Efeito Estufa Na Agropecuária
- Pronaf: Programa Nacional De Fortalecimento Da Agricultura Familiar
- Pca: Programa Para Construção E Ampliação De Armazéns
- Moderfrota: Programa De Modernização Da Frota De Tratores Agrícolas E Impl Assoc E Colheitadeiras
- Pronamp: Programa Nacional De Apoio Ao Médio Produtor Rural
- FVPE: Financiamento Sem Vínculo A Programa Específico

Vale observar que a modalidade predominante em termos de valor absoluto contratado é a dos financiamentos sem vínculo a um programa específico.

Esses são alguns exemplos de possíveis análises com os microdados do Sistema de Operações do Crédito Rural e do Proagro. Vale ressaltar que você pode utilizar o [datalake da Base dos Dados](https://basedosdados.org/dataset/br-bcb-sicor?bdm_table=dicionario) e o conjunto de [Diretórios Brasileiros](https://medium.com/basedosdados/diret%C3%B3rios-brasileiros-como-essa-base-facilita-sua-an%C3%A1lise-40dc8ce2ca2) para cruzar diferentes indicadores como esses para criar suas análises e visualizações. Explore esses dados você também e compartilhe conosco o que descobriu!


A Base dos Dados já te ajudou de alguma forma? Saiba como nos ajudar:

- [Apoie o projeto](https://apoia.se/basedosdados)

- [Seja um(a) colaborador(a) de dados na BD](https://basedosdados.github.io/mais/colab_data/)

- [Colabore com nossos pacotes](https://github.com/basedosdados/mais)

- [Compartilhe nas redes sociais!](https://twitter.com/basedosdados)

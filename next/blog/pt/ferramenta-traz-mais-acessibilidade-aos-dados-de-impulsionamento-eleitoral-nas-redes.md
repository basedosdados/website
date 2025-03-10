---
title: Ferramenta traz mais acessibilidade aos dados de impulsionamento eleitoral nas redes
description: >-
  Entrevista com Sérgio Spagnuolo sobre o Observatório de Impulsionamento Eleitoral
date:
  created: "2024-10-30"
thumbnail: /blog/ferramenta-traz-mais-acessibilidade-aos-dados-de-impulsionamento-eleitoral-nas-redes.md/image_1.png
categories: [institucional]
authors:
  - name: Giovane Caruso
    role: Texto e Entrevista
    social: https://www.linkedin.com/in/GiovaneCaruso/
    avatar: 

---

_Esta entrevista foi publicada na BDletter de Outubro. Assine gratuitamente para ficar pode dentro de análises e entrevistas sobre a BD e a comunidade de Dados Abertos no Brasil._

Esse mês de eleições está recheado de novidades para quem gosta de analisar os dados de campanhas, finanças e resultados eleitorais. Só na BD, tivemos lançamento do [Siga o Dinheiro](https://www.sigaodinheiro.org/), painel interativo para acompanhar as receitas e despesas das eleições, uma [aula aberta](https://www.youtube.com/watch?v=FGboC_4szhc&t=584s) sobre como investigar dados de candidatos(as) e, é claro, a atualização dos dados do TSE já tratados e prontos para análise no maior datalake público do Brasil.

Nesta entrevista, vamos conhecer mais uma ferramenta que veio para trazer transparência e acessibilidade aos dados de financiamento eleitoral. Conversamos com Sérgio Spagnuolo sobre o [Observatório de Impulsionamento de Conteúdo](https://nucleo.jor.br/observatorio-de-impulsionamento-eleitoral/?utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz--K7d9YHXkRUu4u9_geagEUzW0JY63mOmg3Sreqf91-uz-5xVzSnqOMg4CY24Ngvw7dIqcCy4v9h0_YYiTCrm9fclqimIKN_X2A_kD4EaFPRl-Q9Rs), uma aplicação criada pelo Núcleo Jornalismo para monitorar gastos de campanhas eleitorais com impulsionamento de conteúdo em redes sociais.

Pela aplicação, qualquer pessoa pode conferir quanto candidatos(as) gastam com impulsionamento de conteúdo nas redes sociais, além de aplicar filtros geográficos, por partido e cargo, e até por nome da rede social.

<Image src="/blog/ferramenta-traz-mais-acessibilidade-aos-dados-de-impulsionamento-eleitoral-nas-redes/image_1.webp.webp" caption="Mecanismo de filtros do Observatório de Impulsionamento Eleitoral"/>

O resultado são visualizações e uma tabela com os dados, que são extraídos automaticamente do site do TSE. É ainda possível baixar os dados da plataforma em arquivos .csv ou .xls.

<Image src="/blog/ferramenta-traz-mais-acessibilidade-aos-dados-de-impulsionamento-eleitoral-nas-redes/image_2.webp.webp" caption="Exemplo de visualização do Observatório de Impulsionamento de Conteúdo."/>

Sérgio é jornalista e diretor do Núcleo Jornalismo, iniciativa que analisa e noticia sobre o impacto da tecnologia digital na vida das pessoas, a fim de ajudar na construção de uma internet melhor. Em 2014, ele criou a agência de newstech Volt Data Lab, foi Knight Fellow no ICFJ e diretor na Abraji, além de ter colaborado com vários veículos nacionais e internacionais.

<Image src="/blog/ferramenta-traz-mais-acessibilidade-aos-dados-de-impulsionamento-eleitoral-nas-redes/image_3.webp.webp" caption="Foto de Sérgio Spagnuolo"/>

## Entrevista

**Nessas eleições, quase R$ 180 mi foram declarados como despesas para impulsionamento de conteúdo de candidatos(as) nas redes sociais até agora. O Observatório de Impulsionamento Eleitoral ajuda a acompanhar esses valores de maneira prática e acessível. Como surgiu a ideia da aplicação e quais foram os principais desafios durante o desenvolvimento dessa ferramenta?**

O Observatório surgiu nas eleições de 2022 por uma necessidade que identificamos de mapear o uso da rubrica específica de impulsionamento de posts em redes sociais, criada em 2019. Foi a primeira vez que essa rubrica foi utilizada, e achamos que seria importante fazer esse levantamento de uma nova forma de publicidade política.

**O Observatório utiliza os dados do TSE para monitorar o impulsionamento de campanhas nas redes sociais. Poderia falar um pouco da importância desses dados para garantir transparência nas eleições e se existem limitações dos dados que ainda dificultam a precisão nas análises sobre impulsionamento de conteúdo de candidatos(as)?**

Esses dados são importantes porque campanhas online são cada vez mais importantes em períodos eleitorais. As redes sociais são um campo muito fértil para propaganda política, e é preciso ficar de olho em como recursos estão sendo gastos para isso. Além disso, impulsionamento em redes sociais é algo barato quando comparado a anúncios na TV, por exemplo, logo é possível ter muita eficiência a um custo/benefício bom. Um problema com os dados é que eles são autodeclarados, e às vezes as redes sociais utilizadas como vetor não são propriamente declaradas, o que turva um pouco a agregação dos dados.

**O painel do Observatório apresenta uma interface interativa com filtros e visualizações que trazem mais acessibilidade para essas informações. Como você avalia o impacto que o Observatório teve no acompanhamento dos gastos eleitorais? Tem algum exemplo interessante que possa mencionar?**

O Observatório foi utilizado por outras publicações e organizações para mapear gastos com impulsionamento em diferentes lugares e esferas públicas. Também foi usado para pesquisas acadêmicas, como esse TCC da Universidade Federal de Pernambuco. Nosso objetivo é fornecer informações para que outras pessoas e organizações possam utilizar.

**Um destaque interessante do Observatório é a possibilidade de filtrar os gastos com impulsionamento por rede social, um recorte especialmente desafiador com dados autodeclarados por candidatos(as). Poderia contar um pouco sobre a solução utilizada para possibilitar esse recorte?**

A solução para isso é um pouco rudimentar, porque não há muitas informações para tentar inferir nada. A gente escaneia diversas colunas por palavras-chaves a fim de relacionar aquela despesa com alguma rede social, caso haja essa referência. Também agrupamos por grupo econômico, por exemplo Meta (Facebook ou Instagram), considerando que redes sociais podem ter razões sociais diferentes.
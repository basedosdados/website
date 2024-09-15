---
title: Como funciona o sistema de inserção de dados na BD?
description: >-
  Conheça nossa infraestrutura de inserção de dados e veja como você pode
  melhorar seu portfólio contribuindo
date:
  created: '2021-05-28'
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
    role: Adaptação e edição
thumbnail: /blog/como-funciona-o-sistema-de-insercao-de-dados-na-bd/image_0.jpg
categories: []
keywords: []
medium_slug: >-
  https://medium.com/@basedosdados/como-funciona-o-sistema-de-inser%C3%A7%C3%A3o-de-dados-na-bd-61a0fe05c5d5
---


## TL;DR

Neste artigo você vai conhecer um pouco sobre como funciona a infraestrutura de inserção de dados da Base dos Dados e como pode melhorar seu portfólio de cientista de dados e/ou desenvolvedor contribuindo com a nossa missão de universalizar o acesso a dados.

<Image src="/blog/como-funciona-o-sistema-de-insercao-de-dados-na-bd/image_0.jpg" caption="Photo by [Riho Kroll](https://unsplash.com/@rihok) on [Unsplash](https://unsplash.com/)"/>

## A Infraestrutura

O time de infraestrutura da Base dos Dados é responsável pelas ferramentas de ingestão de dados, que englobam desde o upload até a disponibilização de dados no ambiente de produção; pelo acesso de dados através de pacotes em Python e R; e pelo nosso [website](https://basedosdados.org/). Neste cenário, o time é atualmente dividido em várias frentes, tratando da renovação do site e da implementação de pesos e contrapesos automatizados.

Procuramos simplificar e automatizar todos os processos, começando com o [upload de dados](https://basedosdados.github.io/mais/colab_data/) e inserção dos mesmos no **Ambiente de Experimentação**. Neste ponto, o colaborador pode adicionar dados em sua nuvem do Google, limpar e tratar os dados e então criar as tabelas locais com a interface de linha de comando desenvolvida pela infra. Por fim, é possível submeter a base de dados para revisão, criando um pull request no [Github](https://github.com/basedosdados/mais/pulls).

Após o pull request de revisão, entra em ação o sistema de Pesos e Contrapesos, com o time de dados checando a qualidade dos dados e metadados. Esse ponto é crucial para manter a qualidade dos dados, um diferencial da BD. O time de infra atua procurando automatizar o máximo possível o processo de revisão dos dados, realizando a validação de metadados, como descrições e nomes de colunas, e tipos de dados, como dados chaves primárias.

Após a checagem dos dados, o pull request de inserção de dados é aprovado e os dados entram no **Ambiente de Produção**. Logo podem ser acessados por uma de nossas ferramentas, como os pacotes em Python e R, ou diretamente pelo BigQuery.

<Image src="/blog/como-funciona-o-sistema-de-insercao-de-dados-na-bd/image_1.png"/>

Paralelamente ao processo de inserção de dados, o time de Infra também trabalha com a equipe website na renovação da nossa plataforma, visando oferecer uma interface moderna. Preparamos um [artigo](https://medium.com/basedosdados/um-site-feito-a-v%C3%A1rias-m%C3%A3os-60ddc9eaa4d3?source=collection_home---------2-------------------------------) para mostrar como organizamos um projeto colaborativo para desenvolver uma nova plataforma que facilita ainda mais seu trabalho com dados.

## Contribuindo com dados

No caminho para se tornar um analista de dados ou desenvolvedor nos encontramos com certas dificuldades de entrada no mercado de trabalho. Por vezes não existe balanço entre estudo e aplicação prática, ou somente a análise de dados de brincadeirinha. Levante a mão quem não passou uma época paralisado em bases de dados como o Titanic ou Iris. E, apesar dessas bases de dados serem uma boa alternativa para aprender novos métodos ou ferramentas, o conhecimento obtido trabalhando com as mesmas não é transferível para o mundo real.

Uma boa alternativa para lidar com dados reais e melhorar seu portfólio é ajudar a Base dos Dados com a sua ingestão de dados. No mínimo, você irá lidar com a captura de dados, preferencialmente de forma automatizada, com a arquitetura e a limpeza dos mesmos. Também vai interagir com ferramentas do dia a dia de um cientista de dados, como interfaces de linha de comando, YAML e BigQuery. A experiência conquistada pode ser crucial na entrada no mercado de trabalho.

Descrevemos em detalhes esse processo em [Colaborando com dados na BD+](https://basedosdados.github.io/mais/colab_data/). Em resumo o processo é dividido em quatro partes. Inicialmente você informa seu interesse para a BD. Então, faz a limpeza e tratamento dos dados que pretende subir. Em seguida realiza upload dos dados em seu BigQuery pessoal. E, por fim, envia os dados para revisão.

## Contribuindo com a infra

Outra forma de contribuir e melhorar seu portfólio, mas agora de desenvolvedor, é colaborando com a infraestrutura da BD.

A colaboração começa conversando conosco, no bate papo da infra ou nas reuniões às 19h da segunda-feira, ambas nos canais da infra no [Discord](https://discord.gg/huKWpsVYx4). Após este passo, podemos escolher uma *feature* ou problema para desenvolvimento, isto é, caso ainda não tenha escolhido algum problema contido nas [issues](https://github.com/basedosdados/mais/issues).

Como você pode colaborar? **Aqui estão algumas ideias:**

* Adicionando novos conjuntos de dados
* Fazendo a revisão de submissões de dados
* Aprimorando e criando novas funcionalidades do pacote em Python
* Aprimorando e criando novas funcionalidades do pacote em R
* Criando um pacote em Stata
* Adicionando checagens automáticas de dados
* Adicionando checagens automáticas de metadados
* Desenvolvendo novas features para o site

**Nosso projeto já te ajudou de alguma forma?** Somos uma organização sem fins lucrativos que depende do apoio de nossa comunidade. Veja como contribuir:

* [Apoie o projeto](https://apoia.se/basedosdados)
* [Seja um(a) colaborador(a) de dados na BD](https://basedosdados.github.io/mais/colab_data/)
* [Colabore com nossos pacotes](https://github.com/basedosdados/mais)
* Compartilhe nas redes sociais!

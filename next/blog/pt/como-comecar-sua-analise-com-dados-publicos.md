---
title: Como começar sua análise com dados públicos?
description: Aprenda como formular uma boa pergunta e acessar os dados para responder ela
date:
  created: "2024-07-30T15:00:00"
authors:
  - name: Giovane Caruso
    role: Autor
    social: https://medium.com/@giovanecaruso
thumbnail: /blog/como-comecar-sua-analise-com-dados-publicos/image.png
categories: [tutorial]
medium_slug: >-
  https://medium.com/basedosdados/como-come%C3%A7ar-sua-an%C3%A1lise-com-dados-p%C3%BAblicos-6918e9b888af
published: true
order: 1
---

## Introdução

Não é nenhuma novidade que dados públicos são fundamentais para a transparência, responsabilidade governamental e para a participação cidadâ. O acesso a esses dados empodera cidadãos, jornalistas, pesquisadores(as) e organizações da sociedade civil para analisar nossa realidade, monitorar o poder público e identificar problemas e possíveis soluções. Os dados nos ajudam a compreender melhor o mundo e fortalecem a democracia ao garantir que decisões importantes sejam tomadas com base em evidências e de forma transparente.

Porém, ainda existe uma barreira entre a população e o acesso e utilização dessas informações tão cruciais. Infelizmente, essa ferramenta tão poderosa para influenciar positivamente a sociedade ainda é para poucos(as).

**Mas queremos e devemos mudar isso.**

Este artigo foi criado para ajudar a diminuir, ao menos um pouco, essa barreira e ajudar pessoas a navegar melhor em um mundo cada vez mais orientado por dados. Faremos isso introduzindo algumas ferramentas criadas pela ONG Base dos Dados com o mesmo propósito, pensadas exatamente para trazer mais acessibilidade à essas informações que podem ajudar a compreender e melhorar a realidade da nossa sociedade.

<Image src="/blog/como-comecar-sua-analise-com-dados-publicos/image_0.webp" caption="Photo by [Campaign Creators](https://unsplash.com/@campaign_creators) on [Unsplash](https://unsplash.com)"/>

## O que você vai ler?

Neste artigo, vamos falar sobre alguns conceitos básicos para começar uma análise de dados, como formular uma boa pergunta, onde encontrar dados e como acessar eles. É um artigo introdutório, mas que deve funcionar como um primeiro passo para quem quer desenvolver suas habilidades em análise de dados. Você encontra também no artigo vários links úteis para salvar e conferir conforme a sua necessidade. Boa leitura!

## O que é a Base dos Dados e como ela vai facilitar seu trabalho com dados?

A Base dos Dados, ou BD, como chamamos carinhosamente, é uma organização não-governamental sem fins lucrativos e de código aberto que atua para universalizar o acesso a dados de qualidade. Fazemos isso através da criação de ferramentas inovadoras, da produção e difusão do conhecimento e da promoção de uma cultura de transparência e dados abertos.

Mas o que são essas ferramentas? Para resumir, o site da BD possui um mecanismo de busca que funciona como um grande catálogo de dados públicos. Imagine um Google só para bases de dados, com informações sobre os dados, de onde eles vêm, quem os publica e como acessar eles. Além disse, muitas dessas bases são disponibilizadas no que chamamos de datalake público, uma espécie de grande armazém de dados na núvem, por onde é possível consultar, cruzar e extrair esses dados de maneira rápida e prática. Em nosso datalake público, os dados já estão tratados e organizados, processo que costuma consumir horas de trabalho de quem costuma baixar esses dados nas suas fontes originais.

Clique [aqui](https://medium.com/basedosdados/como-funciona-o-sistema-de-inser%C3%A7%C3%A3o-de-dados-na-bd-61a0fe05c5d5) para conhecer mais a fundo esse processo e como contribuir com dados também.

Existem algumas maneiras diferentes de acessar os dados a BD, mas neste artigo vamos focar na mais simples: através de uma consulta SQL no datalake público.

Se quiser aprender como acessar nossos dados com Python ou R, veja nossa documentação por [aqui](https://basedosdados.org/docs/home#acessando-tabelas-tratadas-bd).

## Por onde começar a sua análise?

Toda análise começa com uma boa pergunta. Mas não se engane, ter uma boa pergunta muitas vezes é mais difícil do que fazer a própria análise. Além disso, o processo de investigar e responder uma boa pergunta costuma gerar novas perguntas a serem respondidas e, sem foco num objetivo, é muito fácil se perder em um oceano de dados, informações e pontos de interrogação.

Por isso, tenha essas dicas em mentes na hora de formular a pergunta que vai guiar a sua análise:

- Seja específico(a): Perguntas específicas são mais fáceis de responder com precisão. Em vez de perguntar "Como está a saúde pública?", pergunte "Qual é a taxa de mortalidade infantil nas capitais brasileiras nos últimos cinco anos?" Perguntas muito amplas são muito mais difíceis de serem respondidas e podem confundir mais do que te guiar.
- Avalie a possibilidade da sua pergunta ser respondida: Com uma pergunta em mente, o próximo passo é pesquisar quais dados podem respondê-la. Vamos falar mais sobre onde encontrar dados, mas vale ressaltar que muitas vezes a pergunta depende dos dados que estão disponíveis para você. Não tenha medo de dar uma passo para trás e reformular a sua pergunta.
- Liste as variáveis que vão te ajudar a responder a pergunta: Variáveis são características ou informações que podem ser medidas. Antes de começar a sua análise, faça uma lista das variáveis que estão disponíveis nos dados e que são relevantes para sua análise. Por exemplo, se você está analisando o desempenho escolar, pode considerar variáveis como frequência escolar, notas e participação em atividades extracurriculares.

Formular perguntas claras, específicas e mensuráveis vai te poupar tempo e te ajudar ser mais assertivo(a) no problema que sua análise busca solucionar.

Veja [aqui](https://basedosdados.org/blog?category=analise) algumas análises para se inspirar.

## Onde encontrar os dados que preciso?

Como falamos anteriormente, parte do processe de elaborar e responder uma boa pergunta é saber quais dados estão disponíveis. Mas como e onde encontrar esses dados?

Muitas vezes não há como fugir de uma pesquisa na internet para saber quais sites e plataformas e governo possuem os dados que você precisa, mas a BD criou uma solução mais prática para te ajudar nisso: o nosso **mecanismo de busca**.

Pelo nosso site você consegue buscar conjuntos de dados através de palavras-chave, da mesma maneira que você busca informações no Google, por exemplo. Além disso, ele possui uma seleção de filtros que te ajudama delimitar sua busca. Você pode buscar dados sobre meio ambiente e selecionar apenas conjuntos que sejam disponibilizados pelo Ministério do Meio Ambiente.

Um filtro muito útil é o de **Tabelas tratadas**, isso porque ele seleciona apenas dados que já estejam tratados e organizados em nosso _datalake_ público.

<Image src="/blog/como-comecar-sua-analise-com-dados-publicos/image_1.png"/>

Uma vez que você já tenha encontrado um conjunto de dados no mecanismo de busca, você pode conferir na parte esquerda da página quais são as tabelas que compõem ele. Veja na imagem.

<Image src="/blog/como-comecar-sua-analise-com-dados-publicos/image_2.png"/>

Além disso, você pode conferir quais colunas cada tabela possui e a descrição das informações que elas contém. Veja na imagem abaixo

<Image src="/blog/como-comecar-sua-analise-com-dados-publicos/image_3.png"/>

Quando você tiver identificado o conjunto, a tabela e as colunas que precisa para sua análise, você pode partir para selecionar as colunas do seu interesse e clicar em Gerar Query. Esse botão vai montar uma query SQL para você acessar os dados através do BigQuery, um serviço de banco de dados em nuvem da Google que te permite fazer consultas direto do navegador com **rapidez** (mesmo consultas muito longas demoram apenas minutos para serem processadas), **escala** (o BigQuery escala magicamente para hexabytes se necessário) e **economia** (todo usuário possui 1 TB _gratuito por mês para consulta aos dados_). Para chegar até o BigQuery, utilize o botão "Acessar o BigQuery" da página, conforme a imagem abaixo. Não se esqueça de copiar o código disponibilizado para puxar apenas as colunas selecionadas com os códigos institucionais já traduzidos! 

<Image src="/blog/como-comecar-sua-analise-com-dados-publicos/image_4.png"/>

## Criando um projeto no Google Cloud

Antes de continuar, precisamos criar um projeto no Google Cloud, serviço de núvem da Google, através do próprio BigQuery. O projeto é a maneira que o Google tem de identificar suas atividades dentro das ferramentas que ele oferece. Para criar um projeto no Google Cloud basta ter um email cadastrado no Google. Siga as instruções abaixo:

1. [Acesse o Google Cloud](https://console.cloud.google.com/projectselector2/home/dashboard). Caso for a sua primeira vez, aceite o Termo de Serviços.
2. Clique em Create Project/Criar Projeto. Escolha um nome bacana para o projeto.
3. Clique em Create/Criar

<Image src="/blog/como-comecar-sua-analise-com-dados-publicos/image_5.webp"/>

## Por que eu preciso criar um projeto no Google Cloud?

A Google fornece 1 TB gratuito por mês de uso do BigQuery para cada projeto que você possui. Um projeto é necessário para ativar os serviços do Google Cloud, incluindo a permissão de uso do BigQuery. Pense no projeto como a "conta" na qual a Google vai contabilizar o quanto de processamento você já utilizou. Não é necessário adicionar nenhum cartão ou forma de pagamento — O BigQuery inicia automaticamente no modo Sandbox, que permite você utilizar seus recursos sem adicionar um modo de pagamento. [Leia mais aqui](https://cloud.google.com/bigquery/docs/sandbox/?hl=pt).

## Fixe o datalake da BD no BigQuery

Agora você precisa fixar o projeto da BD no seu BigQuery, é bem simples. Clique no botão **Adicionar** no canto superior esquerdo da tela, ao lado de “Explorer”, selecione a opção “marcar um projeto com estrela por nome” e adicione o nome do projeto da BD, que é "basedosdados", tudo minúsculo, e pronto. Veja:

<Image src="/blog/como-comecar-sua-analise-com-dados-publicos/image_6.bin"/>

Dentro do projeto existem dois níveis de organização dos dados, datasets (conjuntos de dados) e tables (tabelas), nos quais:

- Todas as tabelas estão organizadas dentro de cojuntos de dados, que representam sua organização/tema (ex: o conjunto `br_ibge_populacao` contém uma tabela municipio com a série histórica de população a nível municipal)
- Cada tabela pertence a um único conjunto de dados (ex: a tabela municipio em br_ibge_populacao é diferente de municipio em `br_bd_diretorios`)

## Como funciona o BigQuery?

Abaixo vamos entender melhor como funciona a interface do BigQuery. Após criar o projeto, ele vai aparecer para você no canto superior esquerdo (1). Logo abaixo terá uma lista de Projeto fixos do BigQuery, dentre esses o basedosdados (2) — o ícone de pino azul indica que o projeto está fixado e poderá ser acessado sempre que você abrir o BigQuery. A seta à esquerda do nome basedosdados nos permite expandir a lista de todas as bases disponíveis na BD logo abaixo.

<Image src="/blog/como-comecar-sua-analise-com-dados-publicos/image_7.webp"/>

Sempre que abrirmos uma tabela no BigQuery teremos alguns itens que ficarão à mostra: a aba referente à tabela que selecionamos (3) que contém informações sobre a estrutura e descrição das colunas em Esquema (4) e também metadados da tabela em Detalhes (5).

Por fim, para visualizar os dados da tabela criamos uma nova Consulta (6), que irá abrir um novo Editor com a estrutura em SQL já com as informações da nossa tabela.

## Utilizando SQL para consultar os dados

SQL é uma das linguagens de programação mais simples e poderosas para quem quer mexer com dados. Saber criar consultas eficientes com filtros, agregações e cruzamentos em SQL salva bastante tempo que você gastaria no Python ou R, por exemplo — e acredite, nós também amamos essas linguagens.

Usar o SQL para pré-processamento de dados é uma ótima saída para quem trabalha com grandes volumes de dados, e construir estatísticas descritivas também é bastante simples.

Vamos abordar aqui uma estrutura básica de consulta SQL. Mas você pode conferir nosso tutorial completo [escrito](/blog/bigquery-101) ou em [vídeo](https://www.youtube.com/watch?v=fMo54j1GL6U&t=6s) no YouTube.

Alguns comandos mais básicos de SQL são:

- `SELECT`: Seleciona as colunas que você vai usar

- `FROM`: Seleciona a tabela de origem dos dados

- `WHERE`: Coloca condições para filtrar os dados

Então, por exemplo, para consultas o nome, cargo e raça de candidatos(as) de um município e em um ano específico, podemos utilizar a consulta abaixo.

```sql
SELECT
  ano,
  id_municipio,
  cargo,
  nome,
  raca,
  genero
FROM
  basedosdados.br_tse_eleicoes.candidatos
WHERE
  ano = 2000
  AND id_municipio = "3509502"
```

Veja o resultado dessa consulta na imagem abaixo

<Image src="/blog/como-comecar-sua-analise-com-dados-publicos/image_8.webp"/>

Observação importante: O ID Município do IBGE é um código numérico de sete dígitos utilizado pelo Instituto Brasileiro de Geografia e Estatística (IBGE) para identificar de forma única cada um dos municípios do Brasil. Você pesquisa o ID município da sua cidade no [site do IBGE](https://www.ibge.gov.br/).

O resultado da consulta anterior é retornado no BigQuery em forma de tabela, que você pode exportar em um arquivo local (.csv, JSON ou para a área de transferência do seu computador) para explorar com com seu editor de planilha ou linguagem de programação preferida, ou ainda salvá-los em uma tabela do BigQuery ou Google Sheets, sem precisar fazer download da tabela. Basta clicar em Salvar Resultados ou Extrair Dados. Veja na imagem abaixo.

<Image src="/blog/como-comecar-sua-analise-com-dados-publicos/image_9.webp"/>

Pronto, agora você tem acesso aos dados que precisa para responder a sua pergunta.

Vale ressaltar que este é apenas o primeiro passo para uma análise completa e eficaz com dados públicos. O processo de aprendizado é tão longo quanto a nossa necessidade ou curiosidade. Existem inúmeras habilidades e ferramentas de análise de dados que você pode dominar com o tempo, mas tudo começa em saber como fazer uma boa pergunta e encontrar os dados que você precisa para respondê-la.

Abaixo você encontra uma seção com diversos links úteis para seu trabalho e aprendizado. Salve e ajude a compartilhar esse conhecimento.

## Links úteis

- [Salve nossa documentação para consultar quando tiver dúvidas;](https://basedosdados.org/docs/home)
- [Assine gratuitamente nossa BDleter para receber mensalmente nossas novidades;](https://info.basedosdados.org/newsletter)
- [Conheçã nosso Curso de Análise de Dados com SQL para se aprofundar e dominar uma das linguagens mais utilizadas no mercado;](https://info.basedosdados.org/bd-edu-cursos)
- [Se inscreva em nosso canal no YouTube](https://www.youtube.com/@BasedosDados) e siga a gente no [instagram](https://www.instagram.com/basedosdados/), [linkedin](https://www.linkedin.com/company/base-dos-dados/mycompany/) e [twitter](https://chat.whatsapp.com/CLLFXb1ogPPDomCM6tQT22).
- [Faça parte da nossa comunidade do Discord para tirar dúvidas direto com nossa equipe e conhecer mais pessoas entusismadas com dados;](https://discord.gg/huKWpsVYx4)

## Links sobre BigQuery e SQL

- [Como funciona o armazenamento de dados no BigQuery?](https://cloud.google.com/bigquery/docs/storage_overview?hl=pt-br)
- [Análise de dados com o BigQuery](https://cloud.google.com/bigquery/docs/query-overview?hl=pt-br)
- [O que é o BigQuery?](https://cloud.google.com/bigquery/docs/introduction?hl=pt-br)
- [Tipos de datas SQL](https://www.w3schools.com/sql/sql_dates.asp)
- [Gerenciando datas com diferentes funções do SQL](https://drive.google.com/file/d/11NE9Faqltyl-ZePovy2ThfLo2ALrqGLF/view?usp=sharing)

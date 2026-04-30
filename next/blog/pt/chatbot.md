---
title: "Converse com Dados: Conheça o Chatbot da BD que vai transformar suas perguntas em análises"
description: Conheça como o Chatbot da BD cria análises em segundos com apenas umas pergunta
date:
  created: '2026-04-29'
authors:
thumbnail: /blog/chatbot/capa1.png
categories: [institucional]
medium_slug:
published: true
order: 1
---

A inteligência artificial já faz parte do nosso cotidiano, de uma maneira ou de outra. Modelos como o Gemini, o Chat GPT, Claude, Manus e muitos outros já demonstraram serem capazes de ajudar muito com pequenas e grandes tarefas, seja escrevendo código, e-mails ou até criando aplicações e sites inteiros. Eles possuem, inclusive, uma capacidade incrível de processar e analisar dados, encontrando padrões e discrepâncias no mesmo tempo em que levamos para ir pegar um café na cozinha. Mas, é claro, **a análise de dados com IA também tem suas ressalvas**. Assim como qualquer analista, **essas ferramentas precisam de dados com qualidade, bem estruturados e validados**. O resultado de qualquer análise só pode ser tão bom quanto a qualidade da sua fonte de dados. 

Outra dificuldade da IA é com relação ao volume de dados. É relativamente fácil garantir que uma planilha do excel esteja bem estruturada antes de enviar ela para que o Chat GPT análise os dados e encontre informações de valor ali. Mas e quando estamos trabalhando com um conjunto complexo de dados, com diversas tabelas e Gigabytes, como é o caso da RAIS ou o Censo? 

Até agora, a melhor solução para isso era criar um bom recorte antes de baixar os dados, arregaçar as mangas para fazer o tratamento - ou, para quem conhece, extrair os dados já padronizados pela BD - e alimentar essas informações prontas para uma poderosa ferramenta de IA, provavelmente paga. 

_E é aí que entra o Chatbot da BD._ 

**Nós criamos um assistente inteligente capaz de navegar pelos terabytes do maior datalake de dados públicos do Brasil** e te entregar uma análise pronta em segundos.

## O que é o Chatbot da BD?

Vamos por partes. **O Chatbot da BD é uma interface de consulta que utiliza linguagem natural para que qualquer pessoa consiga explorar o datalake público da BD Brasil sem precisar dominar nenhuma linguagem de programação**. Ele utiliza o Gemini, o modelo de inteligência artificial de última geração do Google, treinado para entender suas perguntas e transformá-las em consultas precisas, extraindo informações diretamente dos nossos conjuntos de dados públicos. 

Para quem não conhece, o datalake público da BD possui mais de 860 tabelas de dados sobre diferentes temas, como educação, economia, saúde, mercado de trabalho, informações demográficas, meio ambiente e mais. Para te dar uma noção, hoje os nossos conjuntos de dados mais acessados são os dados de CNPJ, Caged e Rais, do Ministério da Economia; os dados do Censo 2022, do IBGE; dados de eleições, do TSE, e por aí vai.

## Como funciona? 

Como a descrição anterior já sugere, a própria ideia da ferramenta é que seja simples e fácil de usar. Com uma interface comum de chatbots, você começa com uma pergunta e pode ir criando diversas conversas conforme as suas necessidades - e curiosidade. 

<Image src="/blog/chatbot/print1.png" caption="Interface do Chatbot"/>

O chatbot da BD vai consultar diretamente os dados da BD e retornar uma análise, geralmente com uma tabela de resultado e sempre com uma consulta SQL. A importância disso é que você pode utilizar a consulta para extrair você mesmo os dados utilizados no recorte da análise e validar quaisquer insights do chatbot. 


<Image src="/blog/chatbot/print2.png" caption="Resultado da pergunta no Chatbot"/>

Basicamente **você pergunta, recebe uma análise de resposta e a consulta para baixar os dados e criar suas próprias visualizações, relatórios ou até mapas**. Isso traz flexibilidade e transparência, uma vez que você não fica preso à apenas uma ferramenta e ainda pode validar os dados utilizados. 

<Image src="/blog/chatbot/print3.png" caption="Consulta SQL utilizada para gerar a resposta"/>

## Um Projeto em Evolução 

Atualmente, **o Chatbot da BD está em sua versão Beta**. Isso significa que ele está em constante aprimoramento e o seu feedback é a nossa bússola para guiar as próximas atualizações. 

Em cada resposta do Chatbot, você encontra os botões de feedback (👍 ou 👎) para nos contar se a resposta foi útil ou o que pode ser melhorado. Suas interações são fundamentais para consolidarmos esta ferramenta.

 Você também pode sempre nos enviar suas dúvidas ou sugestões pelo email _suporte.bdpro@basedosdados.org_ ou pela nossa [comunidade no Discord](https://discord.gg/nm6dVcfRP5). 

 
# Perguntas frequentes 

## Quais dados posso consultar com o Chatbot da BD? 

Todos os conjuntos de dados com tabelas tratadas na BD podem ser utilizados pelo Chatbot para criar sua resposta. Você pode conferir por aqui a [lista](https://basedosdados.org/search?contains=tables&page=1) de conjuntos. 

Caso saiba os nomes das colunas das tabelas, tente mencioná-los nas suas perguntas. Por exemplo, se você sabe que uma tabela possui a coluna "município", tente usar essa palavra, ao invés de "cidade". Isso não significa que você não possa usar palavras parecidas, mas usar os nomes das colunas ajuda!

## O Chatbot é gratuito? 

Embora você possa testar gratuitamente por 7 dias, o Chatbot faz parte de um serviço de assinatura que ajuda a manter o trabalho da BD e a nossa missão de universalizar o acesso a dados públicos de qualidade.
 
## O que fazer se o Chatbot não encontrar uma resposta? 

Perguntas mais complexas podem gerar um processamento muito extenso e o Chatbot pode não retornar uma resposta. Nesse caso, recomendamos que você divida o prompt em perguntas menores e mais simples. Outra solução é pedir explicitamente que ele busque a resposta em um conjunto específico de dados.

## Como usar a consulta SQL para baixar os dados da resposta? 

O Chatbot sempre irá retornar uma consulta SQL com a sua resposta. Você pode copiar a consulta e utilizar o BigQuery, ferramenta de consulta e visualização de dados do Google, para extrair uma tabela com os dados utilizados. 

Para isso, siga os passos a seguir:

1. Acesse o [cloud.google.com/bigquery](https://cloud.google.com/bigquery?hl=pt-BR)
2. Caso seja direcionado para a página principal do BigQuery, clique em “Teste no Console” para acessar a interface de consulta
3. A plataforma irá pedir que você faça login com uma Conta Google e crie um projeto.  
4. Depois de criar seu projeto, clique em Consulta SQL para abrir o console. 
5. Cole a consulta e execute. 
6. Depois de executar a consulta, você pode salvar os resultados e escolher um formato preferido ou abrir eles com alguma outra ferramenta do Google de visualização

Se tiver algum problema nesse processo, nossa equipe está sempre à disposição para te ajudar pela nossa [comunidade no Discord](https://discord.gg/nm6dVcfRP5). 

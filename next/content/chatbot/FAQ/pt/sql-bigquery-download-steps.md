---
question: Como usar a consulta SQL para baixar os dados da resposta?
categories: []
keywords: []
order: 8
id: sql-bigquery-download-steps
---

O Chatbot sempre devolve uma consulta SQL junto com a resposta. Você pode copiar essa consulta e usar o [Google BigQuery](https://cloud.google.com/bigquery) — ferramenta de consulta e visualização de dados do Google — para extrair uma tabela com os dados utilizados na análise.

Para isso, siga estes passos:

1. Acesse o site do [Google BigQuery](https://cloud.google.com/bigquery).
2. Se for direcionado à página inicial do produto, clique em algo como **Teste no Console** ou **Console** para abrir a interface de consultas.
3. Faça login com uma conta Google e crie um projeto, se ainda não tiver um.
4. Depois de criar o projeto, abra **Consulta SQL** (ou equivalente no console) para acessar o editor.
5. Cole a consulta fornecida pelo chatbot e execute.
6. Após executar, você pode salvar os resultados no formato preferido ou abrir com outras ferramentas do Google para visualização.

Se tiver problema nesse fluxo, nossa equipe e comunidade podem ajudar no [Discord da Base dos Dados](https://discord.gg/huKWpsVYx4).

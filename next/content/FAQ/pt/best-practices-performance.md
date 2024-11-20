---
question: Quais as melhores práticas para fazer uma consulta no BigQuery?
categories: [BigQuery]
keywords: prática, dica, otimização, desempenho, consulta, BigQuery, selecionar, filtrar
id: best-practices-performance
---

Para verificar uma amostra de todas as variáveis da tabela, use:


```sql
SELECT * FROM dataset.table_name LIMIT 100
```

- A primeira dica valiosa é selecionar as colunas que você vai usar.O BigQuery funciona usando um modelo colunar, portanto, quanto menos colunas você usar, melhor vai ser o desempenho da sua consulta. Isso significa evitar o clássico

  ```sql
  SELECT * FROM table_name
  ```
e escolher as colunas de seu interesse. Parece chato, mas ajuda muito!

- Para tabelas grandes, uma boa prática é filtrar os anos e estados de seu interesse com a cláusula

  ```sql
  WHERE
  ```

Como utilizamos o sistema de particionamento, isso vai reduzir drasticamente o custo e o tempo de processamento.

Essas são as dicas mais simples e rápidas de executar. Para saber mais sobre boas práticas, acesse o [manual completo](https://cloud.google.com/bigquery/docs/best-practices-performance-overview?hl=pt-br)  disponibilizado pelo  Google Cloud.
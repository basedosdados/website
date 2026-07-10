---
question: What are the best practices for running a query in BigQuery?
categories: [BigQuery]
keywords: practice, tip, optimization, performance, query, BigQuery, select, filter
id: best-practices-performance
---

To check a sample of all the variables in the table, use:


```sql
SELECT * FROM dataset.table_name LIMIT 100
```

- The first valuable tip is to select only the columns you are going to use. BigQuery works using a columnar model, so the fewer columns you use, the better your query's performance will be. This means avoiding the classic

  ```sql
  SELECT * FROM table_name
  ```
and choosing the columns you are interested in instead. It sounds tedious, but it helps a lot!

- For large tables, a good practice is to filter the years and states you are interested in with the

  ```sql
  WHERE
  ```

clause. Since we use a partitioning system, this will drastically reduce processing cost and time.

These are the simplest and quickest tips to apply. To learn more about best practices, check out the [complete manual](https://cloud.google.com/bigquery/docs/best-practices-performance-overview?hl=pt-br) provided by Google Cloud.

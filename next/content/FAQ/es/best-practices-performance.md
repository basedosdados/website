---
question: ¿Cuáles son las mejores prácticas para hacer una consulta en BigQuery?
categories: [BigQuery]
keywords: práctica, consejo, optimización, rendimiento, consulta, BigQuery, seleccionar, filtrar
id: best-practices-performance
---

Para verificar una muestra de todas las variables de la tabla, usa:


```sql
SELECT * FROM dataset.table_name LIMIT 100
```

- El primer consejo valioso es seleccionar las columnas que vas a usar. BigQuery funciona con un modelo columnar, por lo que cuantas menos columnas uses, mejor será el rendimiento de tu consulta. Esto significa evitar el clásico

  ```sql
  SELECT * FROM table_name
  ```
y elegir las columnas de tu interés. Parece tedioso, ¡pero ayuda mucho!

- Para tablas grandes, una buena práctica es filtrar los años y estados de tu interés con la cláusula

  ```sql
  WHERE
  ```

Como utilizamos el sistema de particionamiento, esto reducirá drásticamente el costo y el tiempo de procesamiento.

Estos son los consejos más simples y rápidos de aplicar. Para saber más sobre buenas prácticas, consulta el [manual completo](https://cloud.google.com/bigquery/docs/best-practices-performance-overview?hl=pt-br) disponibilizado por Google Cloud.

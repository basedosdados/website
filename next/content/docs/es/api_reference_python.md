---
title: Python
category: APIs
order: 0
---

# Python

Functions for managing downloads.

### GoogleClient Objects

```python
class GoogleClient(ty.TypedDict)
```

#### bigquery

#### storage

### read\_sql

```python
def read_sql(query: str,
             billing_project_id: ty.Optional[str] = None,
             from_file: bool = False,
             reauth: bool = False,
             use_bqstorage_api: bool = False) -> pd.DataFrame
```

Load data from BigQuery using a query. Just a wrapper around pandas.read_gbq.

Args

- `query (sql)`: Valid SQL Standard Query to basedosdados
- `billing_project_id (str)`: Optional.
                              Project that will be billed. Find your Project ID here
                              https://console.cloud.google.com/projectselector2/home/dashboard
- `from_file (boolean)`: Optional.
                         Uses the credentials from file, located in `~/.basedosdados/credentials/
- `reauth (boolean)`: Optional.
                      Re-authorize Google Cloud Project in case you need to change user or
                      reset configurations.
- `use_bqstorage_api (boolean)`: Optional.
                                 Use the BigQuery Storage API to download query results quickly, but
                                 at an increased cost(https://cloud.google.com/bigquery/docs/reference/storage/).
                                 To use this API, first enable it in the Cloud Console(https://console.cloud.google.com/apis/library/bigquerystorage.googleapis.com).
                                 You must also have the bigquery.readsessions.create permission on
                                 the project you are billing queries to.

Returns

- `pd.DataFrame`: Query result


### read\_table

```python
def read_table(dataset_id: str,
               table_id: str,
               billing_project_id: ty.Optional[str] = None,
               query_project_id: str = "basedosdados",
               limit: ty.Optional[int] = None,
               from_file: bool = False,
               reauth: bool = False,
               use_bqstorage_api: bool = False) -> pd.DataFrame
```

Load data from BigQuery using dataset_id and table_id.

Args

- `dataset_id (str)`: Dataset id available in basedosdados. It should always come with
                      table_id.
- `table_id (str)`: Table id available in basedosdados.dataset_id.
                    It should always come with dataset_id.
- `billing_project_id (str)`: Optional.
                              Project that will be billed. Find your Project ID here
                              https://console.cloud.google.com/projectselector2/home/dashboard
- `query_project_id (str)`: Optional.
                            Which project the table lives. You can change this you want to query
                            different projects.
- `limit (int)`: Optional.
                 Number of rows to read from table.
- `from_file (boolean)`: Optional.
                         Uses the credentials from file, located in `~/.basedosdados/credentials/
- `reauth (boolean)`: Optional.
                      Re-authorize Google Cloud Project in case you need to change user or
                      reset configurations.
- `use_bqstorage_api (boolean)`: Optional.
                                 Use the BigQuery Storage API to download query results quickly, but
                                 at an increased cost(https://cloud.google.com/bigquery/docs/reference/storage/).
                                 To use this API, first enable it in the Cloud Console(https://console.cloud.google.com/apis/library/bigquerystorage.googleapis.com).
                                 You must also have the bigquery.readsessions.create permission on
                                 the project you are billing queries to.

Returns

- `pd.DataFrame`: Query result


### download

```python
def download(savepath: ty.Union[str, Path],
             query: ty.Optional[str] = None,
             dataset_id: ty.Optional[str] = None,
             table_id: ty.Optional[str] = None,
             billing_project_id: ty.Optional[str] = None,
             query_project_id: str = "basedosdados",
             limit: ty.Optional[int] = None,
             from_file: bool = False,
             reauth: bool = False,
             compression: str = "GZIP") -> None
```

Download table or query result from basedosdados BigQuery (or other).

* Using a **query**:

    `download('select * from `basedosdados.br_suporte.diretorio_municipios` limit 10')`

* Using **dataset_id & table_id**:

    `download(dataset_id='br_suporte', table_id='diretorio_municipios')`

You can also add arguments to modify save parameters:

`download(dataset_id='br_suporte', table_id='diretorio_municipios', index=False, sep='|')`


Args

- `savepath (str, pathlib.PosixPath)`: savepath must be a file path. Only supports `.csv`.
- `query (str)`: Optional.
                 Valid SQL Standard Query to basedosdados. If query is available,
                 dataset_id and table_id are not required.
- `dataset_id (str)`: Optional.
                      Dataset id available in basedosdados. It should always come with
                      table_id.
- `table_id (str)`: Optional.
                    Table id available in basedosdados.dataset_id.
                    It should always come with dataset_id.
- `billing_project_id (str)`: Optional.
                              Project that will be billed. Find your Project ID here
                              https://console.cloud.google.com/projectselector2/home/dashboard
- `query_project_id (str)`: Optional.
                            Which project the table lives. You can change this you want to query
                            different projects.
- `limit (int)`: Optional
                 Number of rows.
- `from_file (boolean)`: Optional.
                         Uses the credentials from file, located in `~/.basedosdados/credentials/
- `reauth (boolean)`: Optional.
                      Re-authorize Google Cloud Project in case you need to change user
                      or reset configurations.
- `compression (str)`: Optional.
                       Compression type. Only `GZIP` is available for now.

Returns

- None

Raises

- `Exception`: If either table_id, dataset_id or query are empty.


Functions to get metadata from BD's API

### check\_input

```python
def check_input(f)
```

Checks if the number of inputs is valid

### inject\_backend

```python
def inject_backend(f)
```

Inject backend instance if doesn't exists

### get\_datasets

```python
@check_input
@inject_backend
def get_datasets(dataset_id: str = None,
                 dataset_name: str = None,
                 page: int = 1,
                 page_size: int = 10,
                 backend: Backend = None) -> list[dict]
```

Get a list of available datasets,
either by `dataset_id` or `dataset_name`

Args

- `dataset_id(str)`: dataset slug in google big query (gbq).
- `dataset_name(str)`: dataset name in base dos dados metadata.
- 
- `page(int)`: page for pagination.
- `page_size(int)`: page size for pagination.
- `backend(Backend)`: backend instance, injected automatically.

Returns

- `dict`: List of datasets.


### get\_tables

```python
@check_input
@inject_backend
def get_tables(dataset_id: str = None,
               table_id: str = None,
               table_name: str = None,
               page: int = 1,
               page_size: int = 10,
               backend: Backend = None) -> list[dict]
```

Get a list of available tables,
either by `dataset_id`, `table_id` or `table_name`

Args

- `dataset_id(str)`: dataset slug in google big query (gbq).
- `table_id(str)`: table slug in google big query (gbq).
- `table_name(str)`: table name in base dos dados metadata.
- 
- `page(int)`: page for pagination.
- `page_size(int)`: page size for pagination.
- `backend(Backend)`: backend instance, injected automatically.

Returns

- `dict`: List of tables.


### get\_columns

```python
@check_input
@inject_backend
def get_columns(table_id: str = None,
                column_id: str = None,
                columns_name: str = None,
                page: int = 1,
                page_size: int = 10,
                backend: Backend = None) -> list[dict]
```

Get a list of available columns,
either by `table_id`, `column_id` or `column_name`

Args

- `table_id(str)`: table slug in google big query (gbq).
- `column_id(str)`: column slug in google big query (gbq).
- `column_name(str)`: table name in base dos dados metadata.
- 
- `page(int)`: page for pagination.
- `page_size(int)`: page size for pagination.
- `backend(Backend)`: backend instance, injected automatically.

Returns

- `dict`: List of tables.


### search

```python
@check_input
@inject_backend
def search(q: str = None,
           page: int = 1,
           page_size: int = 10,
           backend: Backend = None) -> list[dict]
```

Search for datasets, querying all available metadata for the term `q`

Args

- `q(str)`: search term.
- 
- `page(int)`: page for pagination.
- `page_size(int)`: page size for pagination.
- `backend(Backend)`: backend instance, injected automatically.

Returns

- `dict`: List of datasets and metadata.


Module for manage dataset to the server.

### Dataset Objects

```python
class Dataset(Base)
```

Manage datasets in BigQuery.

#### \_\_init\_\_

```python
def __init__(dataset_id, **kwargs)
```

#### dataset\_config

```python
@property
@lru_cache
def dataset_config()
```

Dataset config file.

#### publicize

```python
def publicize(mode="all", dataset_is_public=True)
```

Changes IAM configuration to turn BigQuery dataset public.

Args

- `mode (bool)`: Which dataset to create [prod|staging|all].
- `dataset_is_public (bool)`: Control if prod dataset is public or not. By default staging datasets like `dataset_id_staging` are not public.


#### exists

```python
def exists(mode="staging")
```

Check if dataset exists.

#### create

```python
def create(mode="all",
           if_exists="raise",
           dataset_is_public=True,
           location=None)
```

Creates BigQuery datasets given `dataset_id`.

It can create two datasets:

* `<dataset_id>` (mode = 'prod')
* `<dataset_id>_staging` (mode = 'staging')

If `mode` is all, it creates both.

Args

- `mode (str)`: Optional. Which dataset to create [prod|staging|all].
- `if_exists (str)`: Optional. What to do if dataset exists
- 
* raise : Raises Conflict exception
* replace : Drop all tables and replace dataset
* update : Update dataset description
* pass : Do nothing
- 
- `dataset_is_public (bool)`: Control if prod dataset is public or not. By default staging datasets like `dataset_id_staging` are not public.
- 
- `location (str)`: Optional. Location of dataset data.
                    List of possible region names locations: https://cloud.google.com/bigquery/docs/locations

Raises

- `Warning`: Dataset already exists and if_exists is set to `raise`


#### delete

```python
def delete(mode="all")
```

Deletes dataset in BigQuery. Toogle mode to choose which dataset to delete.

Args

- `mode (str)`: Optional.  Which dataset to delete [prod|staging|all]


#### update

```python
def update(mode="all", location=None)
```

Update dataset description. Toogle mode to choose which dataset to update.

Args

- `mode (str)`: Optional. Which dataset to update [prod|staging|all]
- `location (str)`: Optional. Location of dataset data.
                    List of possible region names locations: https://cloud.google.com/bigquery/docs/locations


Class for manage tables in Storage and Big Query

### Table Objects

```python
class Table(Base)
```

Manage tables in Google Cloud Storage and BigQuery.

#### \_\_init\_\_

```python
def __init__(dataset_id, table_id, **kwargs)
```

#### table\_config

```python
@property
@lru_cache(256)
def table_config()
```

Load table config

#### table\_exists

```python
def table_exists(mode)
```

Check if table exists in BigQuery.

Args

- `mode (str)`: Which dataset to check [prod|staging].


#### create

```python
def create(path=None,
           source_format="csv",
           csv_delimiter=",",
           csv_skip_leading_rows=1,
           csv_allow_jagged_rows=False,
           if_table_exists="raise",
           if_storage_data_exists="raise",
           if_dataset_exists="pass",
           dataset_is_public=True,
           location=None,
           chunk_size=None,
           biglake_table=False,
           set_biglake_connection_permissions=True)
```

Creates a BigQuery table in the staging dataset.

If a path is provided, data is automatically saved in storage,
and a datasets folder and BigQuery location are created, in addition to creating
the table and its configuration files.

The new table is located at `<dataset_id>_staging.<table_id>` in BigQuery.

Data can be found in Storage at `<bucket_name>/staging/<dataset_id>/<table_id>/*`
and is used to build the table.

The following data types are supported:

- Comma-Delimited CSV
- Apache Avro
- Apache Parquet

Data can also be partitioned following the Hive partitioning scheme
`<key1>=<value1>/<key2>=<value2>`; for example,
`year=2012/country=BR`. The partition is automatically detected by searching for `partitions`
in the `table_config.yaml` file.

Args

- `path (str or pathlib.PosixPath)`: The path to the file to be uploaded to create the table.
- `source_format (str)`: Optional. The format of the data source. Only 'csv', 'avro', and 'parquet'
                         are supported. Defaults to 'csv'.
- `csv_delimiter (str)`: Optional.
                         The separator for fields in a CSV file. The separator can be any ISO-8859-1
                         single-byte character. Defaults to ','.
- `csv_skip_leading_rows(int)`: Optional.
                                The number of rows at the top of a CSV file that BigQuery will skip when loading the data.
                                Defaults to 1.
- `csv_allow_jagged_rows (bool)`: Optional.
                                  Indicates if BigQuery should allow extra values that are not represented in the table schema.
                                  Defaults to False.
- `if_table_exists (str)`: Optional. Determines what to do if the table already exists:
- 
* 'raise' : Raises a Conflict exception
* 'replace' : Replaces the table
* 'pass' : Does nothing
- `if_storage_data_exists (str)`: Optional. Determines what to do if the data already exists on your bucket:
- 
* 'raise' : Raises a Conflict exception
* 'replace' : Replaces the table
* 'pass' : Does nothing
- `if_dataset_exists (str)`: Optional. Determines what to do if the dataset already exists:
- 
* 'raise' : Raises a Conflict exception
* 'replace' : Replaces the dataset
* 'pass' : Does nothing
- `dataset_is_public (bool)`: Optional. Controls if the prod dataset is public or not. By default, staging datasets like `dataset_id_staging` are not public.
- `location (str)`: Optional. The location of the dataset data. List of possible region names locations: https://cloud.google.com/bigquery/docs/locations
- `chunk_size (int)`: Optional. The size of a chunk of data whenever iterating (in bytes). This must be a multiple of 256 KB per the API specification.
                      If not specified, the chunk_size of the blob itself is used. If that is not specified, a default value of 40 MB is used.
- `biglake_table (bool)`: Optional. Sets this as a BigLake table. BigLake tables allow end-users to query from external data (such as GCS) even if
                          they don't have access to the source data. IAM is managed like any other BigQuery native table. See https://cloud.google.com/bigquery/docs/biglake-intro for more on BigLake.
- `set_biglake_connection_permissions (bool)`: Optional. If set to `True`, attempts to grant the BigLake connection service account access to the table's data in GCS.


#### update

```python
def update(mode="prod", custom_schema=None)
```

Updates BigQuery schema and description.
Args

- `mode (str)`: Optional.
                Table of which table to update [prod]
- `not_found_ok (bool)`: Optional.
                         What to do if table is not found


#### publish

```python
def publish(if_exists="raise", custom_publish_sql=None, custom_schema=None)
```

Creates BigQuery table at production dataset.

Table should be located at `<dataset_id>.<table_id>`.

It creates a view that uses the query from
`<metadata_path>/<dataset_id>/<table_id>/publish.sql`.

Make sure that all columns from the query also exists at
`<metadata_path>/<dataset_id>/<table_id>/table_config.sql`, including
the partitions.

Args

- `if_exists (str)`: Optional.
                     What to do if table exists.
- 
* 'raise' : Raises Conflict exception
* 'replace' : Replace table
* 'pass' : Do nothing

Todo


* Check if all required fields are filled


#### delete

```python
def delete(mode="all")
```

Deletes table in BigQuery.

Args

- `mode (str)`: Table of which table to delete [prod|staging]


#### append

```python
def append(filepath,
           partitions=None,
           if_exists="replace",
           chunk_size=None,
           **upload_args)
```

Appends new data to existing BigQuery table.

As long as the data has the same schema. It appends the data in the
filepath to the existing table.

Args

- `filepath (str or pathlib.PosixPath)`: Where to find the file that you want to upload to create a table with
- `partitions (str, pathlib.PosixPath, dict)`: Optional.
                                               Hive structured partition as a string or dict
- 
* str : `<key>=<value>/<key2>=<value2>`
* dict: `dict(key=value, key2=value2)`
- `if_exists (str)`: 0ptional.
                     What to do if data with same name exists in storage
- 
* 'raise' : Raises Conflict exception
* 'replace' : Replace table
* 'pass' : Do nothing
- `chunk_size (int)`: Optional
                      The size of a chunk of data whenever iterating (in bytes).
                      This must be a multiple of 256 KB per the API specification.
                      If not specified, the chunk_size of the blob itself is used. If that is not specified, a default value of 40 MB is used.


Class for managing the files in cloud storage.

### Storage Objects

```python
class Storage(Base)
```

Manage files on Google Cloud Storage.

#### \_\_init\_\_

```python
def __init__(dataset_id, table_id, **kwargs)
```

#### init

```python
def init(replace=False, very_sure=False)
```

Initializes bucket and folders.

Folder should be:

* `raw` : that contains really raw data
* `staging` : preprocessed data ready to upload to BigQuery

Args

- `replace (bool)`: Optional.
                    Whether to replace if bucket already exists
- `very_sure (bool)`: Optional.
                      Are you aware that everything is going to be erased if you
                      replace the bucket?

Raises

- `Warning`: very_sure argument is still False.


#### upload

```python
def upload(path,
           mode="all",
           partitions=None,
           if_exists="raise",
           chunk_size=None,
           **upload_args)
```

Upload to storage at `<bucket_name>/<mode>/<dataset_id>/<table_id>`. You can:

* Add a single **file** setting `path = <file_path>`.

* Add a **folder** with multiple files setting `path =
  <folder_path>`. *The folder should just contain the files and
  no folders.*

* Add **partitioned files** setting `path = <folder_path>`.
  This folder must follow the hive partitioning scheme i.e.
  `<table_id>/<key>=<value>/<key2>=<value2>/<partition>.csv`
  (ex: `mytable/country=brasil/year=2020/mypart.csv`).

*Remember all files must follow a single schema.* Otherwise, things
might fail in the future.

There are 6 modes:

* `raw` : should contain raw files from datasource
* `staging` : should contain pre-treated files ready to upload to BiqQuery
* `header`: should contain the header of the tables
* `auxiliary_files`: should contain auxiliary files from eache table
* `architecture`: should contain the architecture sheet of the tables
* `all`: if no treatment is needed, use `all`.

Args

- `path (str or pathlib.PosixPath)`: Where to find the file or
                                     folder that you want to upload to storage
- 
- `mode (str)`: Folder of which dataset to update [raw|staging|header|auxiliary_files|architecture|all]
- 
- `partitions (str, pathlib.PosixPath, or dict)`: Optional.
                                                  *If adding a single file*, use this to add it to a specific partition.
- 
* str : `<key>=<value>/<key2>=<value2>`
* dict: `dict(key=value, key2=value2)`
- 
- `if_exists (str)`: Optional.
                     What to do if data exists
- 
* 'raise' : Raises Conflict exception
* 'replace' : Replace table
* 'pass' : Do nothing
- `chunk_size (int)`: Optional
                      The size of a chunk of data whenever iterating (in bytes).
                      This must be a multiple of 256 KB per the API specification.
                      If not specified, the chunk_size of the blob itself is used. If that is not specified, a default value of 40 MB is used.
- 
- `upload_args ()`: Extra arguments accepted by [`google.cloud.storage.blob.Blob.upload_from_file`](https://googleapis.dev/python/storage/latest/blobs.html?highlight=upload_from_filename#google.cloud.storage.blob.Blob.upload_from_filename)


#### download

```python
def download(filename="*",
             savepath: Path = Path("."),
             partitions=None,
             mode="staging",
             if_not_exists="raise")
```

Download files from Google Storage from path `mode`/`dataset_id`/`table_id`/`partitions`/`filename` and replicate folder hierarchy
on save,

There are 5 modes:
* `raw` : should contain raw files from datasource
* `staging` : should contain pre-treated files ready to upload to BiqQuery
* `header`: should contain the header of the tables
* `auxiliary_files`: should contain auxiliary files from eache table
* `architecture`: should contain the architecture sheet of the tables

You can also use the `partitions` argument to choose files from a partition

Args

- `filename (str)`: Optional
                    Specify which file to download. If "*" , downloads all files within the bucket folder. Defaults to "*".
- 
- `savepath (str)`: Where you want to save the data on your computer. Must be a path to a directory.
- 
- `partitions (str, dict)`: Optional
                            If downloading a single file, use this to specify the partition path from which to download.
- 
* str : `<key>=<value>/<key2>=<value2>`
* dict: `dict(key=value, key2=value2)`
- 
- 
- `mode (str)`: Optional
                Folder of which dataset to update.[raw|staging|header|auxiliary_files|architecture]
- 
- `if_not_exists (str)`: Optional.
                         What to do if data not found.
- 
* 'raise' : Raises FileNotFoundError.
* 'pass' : Do nothing and exit the function

Raises

- `FileNotFoundError`: If the given path `<mode>/<dataset_id>/<table_id>/<partitions>/<filename>` could not be found or there are no files to download.


#### delete\_file

```python
def delete_file(filename, mode, partitions=None, not_found_ok=False)
```

Deletes file from path `<bucket_name>/<mode>/<dataset_id>/<table_id>/<partitions>/<filename>`.

Args

- `filename (str)`: Name of the file to be deleted
- 
- `mode (str)`: Folder of which dataset to update [raw|staging|header|auxiliary_files|architecture|all]
- 
- `partitions (str, pathlib.PosixPath, or dict)`: Optional.
                                                  Hive structured partition as a string or dict
- 
* str : `<key>=<value>/<key2>=<value2>`
* dict: `dict(key=value, key2=value2)`
- 
- `not_found_ok (bool)`: Optional.
                         What to do if file not found


#### delete\_table

```python
def delete_table(mode="staging", bucket_name=None, not_found_ok=False)
```

Deletes a table from storage, sends request in batches.

Args

- `mode (str)`: Folder of which dataset to update [raw|staging|header|auxiliary_files|architecture]
                Folder of which dataset to update. Defaults to "staging".
- 
- `bucket_name (str)`: The bucket name from which to delete the table. If None, defaults to the bucket initialized when instantiating the Storage object.
                       (You can check it with the Storage().bucket property)
- 
- `not_found_ok (bool)`: Optional.
                         What to do if table not found


#### copy\_table

```python
def copy_table(source_bucket_name="basedosdados",
               destination_bucket_name=None,
               mode="staging",
               new_table_id=None)
```

Copies table from a source bucket to your bucket, sends request in batches.

Args

- `source_bucket_name (str)`: The bucket name from which to copy data. You can change it
                              to copy from other external bucket.
- 
- `destination_bucket_name (str)`: Optional
                                   The bucket name where data will be copied to.
                                   If None, defaults to the bucket initialized when instantiating the Storage object (You can check it with the
                                   Storage().bucket property)
- 
- `mode (str)`: Folder of which dataset to update [raw|staging|header|auxiliary_files|architecture]
                Folder of which dataset to update. Defaults to "staging".
- `new_table_id (str)`: Optional.
                        New table id to be copied to. If None, defaults to the table id initialized when instantiating the Storage object.

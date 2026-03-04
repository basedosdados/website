---
title: Data
category: Contribute
order: 0
---

# Data

## Why should my organization upload data to DB?

- **Ability to cross-reference your databases with data from different
  organizations** in a simple and easy way. There are already hundreds of
  public data sets from the largest organizations in Brazil and around the world present
  in our *datalake*.

- **Commitment to transparency, data quality, and
  the development of better research, analysis, and solutions** for
  society. Not only do we democratize access to open data, but also to
  quality data. We have a specialized team that reviews and ensures the quality of the
  data added to the *datalake*.

- **Participation in an ever-growing community**: thousands of
  journalists, researchers, and developers already use and
  follow the Database.
  {/* TODO: Put the link to our audience panel here when it's ready :) */}

## Step by step guide to uploading data

Want to upload data to the database and help us build this repository?
*Great!* We've organized everything you need in the manual below in 8 steps

To make the explanation easier, we will follow a ready-made example with data from [RAIS](/en/dataset/3e7c4d58-96ba-448e-b053-d385a829ef00?table=86b69f96-0bfe-45da-833b-6edc9a0af213).

<Tip caption="You can navigate through the steps in the menu on the left">

 We strongly suggest that you join our Discord channel to ask questions and interact with the team and other contributors! 😉
</Tip>

### Before you begin

Some knowledge is required to perform this process:

- **Python, R, and/or SQL**: to create the codes for capturing and cleaning the data.
- **Command line**: to configure your local environment
  and connection to Google Cloud.
- **Github**: to upload your code for review by
  our team.

<Tip caption="Don't have any of these skills, but want to collaborate?">

We have a data team that can help you. Just join [our Discord](https://discord.gg/huKWpsVYx4) and send a message to #quero-contribuir.
</Tip>

### How does the process work?

- [1. Choose the database and understand more about the data](#1-choose-the-database-and-understand-more-about-the-data) - first we need to know what we are dealing with.
- [2. Download our template folder](#2-download-our-template-folder) - it's time to structure the work to be done
- [3. Fill in the architecture tables](#3-fill-in-the-architecture-tables) - it is essential to define the data structure before we start processing
- [4. Write data capture and cleaning code](#4-write-data-capture-and-cleaning-code) - time to get down to business!
- [5. (If necessary) Organize auxiliary files](#5-if-necessary-organize-auxiliary-files) - because even data needs guides
- [6. (If necessary) Create a dictionary table](#6-if-necessary-create-dictionary-table) - time to assemble the dictionaries
- [7. Upload everything to Google Cloud](#7-upload-everything-to-google-cloud) - after all, that's where the database data is stored
- [8. Send everything for review](#8-send-everything-for-review) - our team takes a look to make sure everything is ready to go into production!


### 1. Choose the database and learn more about the data


We maintain a list of datasets for volunteers on our [Github](https://github.com/orgs/basedosdados/projects/17/views/9). To start uploading a database that interests you, simply open a new data issue. If your database (set) is already listed, just mark your Github user as assignee.

Your first task is to fill in the information in the issue. This information will help you better understand the data and will be very useful for processing and filling in metadata.

When you have completed this step, call someone from the data team so that the information you have mapped about the set can be entered into our website!

### 2. Download our template folder

[Download the
_template_ folder here](https://drive.google.com/drive/folders/1xXXon0vdjSKr8RCNcymRdOKgq64iqfS5?usp=sharing)
 and rename it to `<dataset_id>` (defined in the issue in [step 1](#-1-Choose-the-base-and-understand-more-about-the-data)). This template folder facilitates and organizes all the
steps from here on out. Its
structure is as follows:

- `<dataset_id>/`
    - `code/`: Codes needed for **capturing** and **cleaning** the data
    ([we'll see more in step
    4](#4-writing-code-for-data-capture-and-cleaning)).
    - `input/`: Contains all files with original data, exactly
    as downloaded from the primary source. ([we will see more in step
    4](#4-writing-code-for-data-capture-and-cleaning)).
    - `output/`: Final files, already in a format ready to be uploaded to the database ([we will see more in step
    4](#4-write-code-for-data-capture-and-cleaning)).
- `tmp/`: Any temporary files created by the code in `/code` during the cleaning and processing process ( [we will see more in step
    4](#4-writing-data-capture-and-cleaning-code)).
- `extra/`
- `architecture/`: Architecture tables ([we will see more in step 3](#3-filling-in-the-architecture-tables)).
        - `auxiliary_files/`: Auxiliary files for the data ([we will see more in step 5](#5-if-necessary-organize-auxiliary-files)).
        - `dictionary.csv`: Dictionary table for the entire dataset ([we will see more in step 6](#6-if-necessary-create-dictionary-table)).

<Tip caption="Only the `code` folder will be committed to your project; the other files will exist only locally or in Google Cloud."/>


### 3. Fill in the architecture tables

The architecture tables determine **the structure of
each table in your dataset**. They define, for example, the name, order, and metadata of the variables, as well as compatibility when there are changes in versions (for
example, if a variable changes its name from one year to the next).


<Tip caption="Each table in the dataset must have its own architecture table (spreadsheet), which must be filled out in **Google Drive** to allow our data team to correct it."/>


#### Example: RAIS - Architecture tables

The RAIS architecture tables [can be found here](https://docs.google.com/spreadsheets/d/1dPLUCeE4MSjs0ykYUDsFd-e7-9Nk6LVV/edit?usp=sharing&ouid=103008455637924805982&rtpof=true&sd=true). They are a great reference to get you started, as they contain many variables and examples of different situations you may encounter.

#### To fill in each table in your set, follow these steps:

<Tip caption="A each beginning and end of step, consult our [style guide](style_data) to ensure you're following the BD standardization"/>

1. List all data variables in the `original_name` column
- Note: If the database changes the names of variables over the years (such as RAIS), it is necessary to make all variables compatible between years by filling in the `original_name_YYYY` column for each available year or month
2. Rename the variables according to our [manual](style_data) in the `name` column
3. Understand the variable type and fill in the `bigquery_type` column
4. Fill in the description in `description` according to the [manual] (style_data)
5. Based on the reconciliation between years and/or queries to the raw data, fill in the temporal coverage in `temporal_coverage` for each variable
- Note: If the variables have the same temporal coverage as the table, fill in only '(1)'
6. Indicate with ‘yes’ or ‘no’ if there is a dictionary for the variables in `covered_by_dictionary`
7. Check if the variables represent any entity present in the [directories](/en/dataset/33b49786-fb5f-496f-bb7c-9811c985af8e? table=0a2d8187-f936-437d-89db-b4eb3a7e1735) to fill in `directory_column`
8. For variables of type `int64` or `float64`, check if it is necessary to include a [unit of measurement](https://github.com/basedosdados/website/blob/master/ckanext-basedosdados/ckanext/basedosdados/validator/available_options/measurement_unit.py)
9. Reorder the variables according to the [manual](style_data)

<Tip caption="When you have finished filling in the architecture tables, contact the Database team to validate everything.">

It is necessary to be clear about the final format that the data should be in _before_ starting to write the code. This way we avoid rework.
</Tip>

### 4. Write data capture and cleaning code

Once the architecture tables have been validated, we can write the codes for
**capturing** and **cleaning** the data.

- **Capture**: Code that automatically downloads all the original data and saves it in `/input`. This data may be available on portals or FTP links, or it may be scraped from websites, among other sources.

- **Cleaning**: Code that transforms the original data saved in `/input` into clean data, saves it in the `/output` folder, and then uploads it to the database.

Each cleaned table for production can be saved as a single file or, if it is too large (e.g., over 200 MB), it can be partitioned in [Hive](https://cloud.google.com/bigquery/docs/hive-partitioned-loads-gcs) format into several subfiles. The accepted formats are `.csv` or `.parquet`. We recommend partitioning tables by `year`, `month`, and `state_code`. Partitioning is done through the folder structure. See the example below to see how.

#### Example: RAIS - Partitioning

The `microdados_vinculos` table from RAIS Vinculos, for example, is a very large table (+400GB), so we partitioned it by `year` and `sigla_uf`. Partitioning was done using the folder structure `/microdados_vinculos/year=YYYY/sigla_uf=XX`.

#### Required standards in the code

- Must be written in [Python](https://www.python.org/) or [R](https://www.r-project.org/) -
  so that the team can review it.
- They can be in script (`.py`, `.R`, ...) or *notebooks* (Google Colab, Jupyter, Rmarkdown, etc).
- File paths must be shortcuts _relative_ to the root folder
  (`<dataset_id>`), i.e., they must not depend on the paths on your
  computer.
- Cleaning must follow our [style guide](style_data) and [best programming practices](https://en.wikipedia.org/wiki/Best_coding_practices).

#### Example: Continuous PNAD - Cleaning code

The cleaning code was built in R and [can be found
here](https://github.com/basedosdados/sdk/tree/master/bases/br_ibge_pnadc/code).

#### Example: Legislative Chamber Activity - Download and cleaning code
The cleaning code was built in Python [and can be found here](https://github.com/basedosdados/sdk/tree/bea9a323afcea8aa1609e9ade2502ca91f88054c/bases/br_camara_atividade_legislativa/code).

### 5. (If necessary) Organize auxiliary files

It is common for databases to be made available with auxiliary files. These may include technical notes, collection and sampling descriptions, etc. To help database users gain more context and better understand the data, organize all these auxiliary files in `/extra/auxiliary_files`.

Feel free to structure subfolders as you wish within this directory. The important thing is that it is clear what these files are.

### 6. (If necessary) Create a dictionary table

Often, especially with older databases, there are multiple dictionaries in Excel or other formats. In the Database, we unify everything into a single file in `.csv` format—a single dictionary for all columns in all tables in your set.

<Tip caption="Important details on how to build your dictionary are in our [style manual](style_data)."/>


#### Example: RAIS - Dictionary

The complete dictionary [can be consulted
here](https://docs.google.com/spreadsheets/d/12Wwp48ZJVux26rCotx43lzdWmVL54JinsNnLIV3jnyM/edit?usp=sharing).
It already has the standard structure we use for dictionaries.

### 7. Upload everything to Google Cloud

All done! Now all that's left is to upload it to Google Cloud and send it for review.
To do this, we will use the `basedosdados` client (available in Python), which facilitates the settings and steps of the process.

<Tip caption="Since there is a cost for storage, to complete this step we will need to provide you with a specific api_key for volunteers to upload the data to our development environment. So, join our [Discord channel](https://discord.gg/huKWpsVYx4), call us at ‘quero-contribuir’ and tag `@equipe_dados`"/>

#### Configure your credentials locally
**7.1** Install our client on your terminal: `pip install basedosdados`.

**7.2** Run `import basedosdados as bd` in Python and follow the step-by-step instructions to configure locally with your Google Cloud project credentials. Fill in the information as follows:
```
    * STEP 1: y
    * STEP 2: basedosdados-dev  (place the .json file provided by the bd team in the credentials folder)
    * STEP 3: y
    * STEP 4: basedosdados-dev
    * STEP 5: https://api.basedosdados.org/api/v1/graphql
```
#### Upload the files to the Cloud
The data will pass through three places in Google Cloud:

  * **Storage**: also called GCS, this is where “cold” files (architectures, data, auxiliary files) will be stored.
  * **BigQuery-DEV-Staging**: table that connects the storage data to the basedosdados-dev project in BigQuery
  * **BigQuery-DEV-Production**: table used for testing and processing the dataset via SQL

**7.3** Create the table in the *GCS bucket* and *BigQuery-DEV-staging*, using the Python API, as follows:

```python
import basedosdados as bd

DATASET_ID = “dataset_id”  # Name of the dataset
TABLE_ID = “table_id”  # Name of the table

tb = bd.Table(dataset_id=DATASET_ID, table_id=TABLE_ID)
``` 

```python
tb.create(
    path=path_to_data,  # Path to the csv or parquet file
    if_storage_data_exists="raise",
    if_table_exists="replace",
    source_format="csv"
)
```

<Tip caption="If your data is partitioned, the path must point to the folder where the partitions are. Otherwise, it must point to a `.csv` file (for example, microdados.csv).">

 If the project does not exist in BigQuery, it will be automatically created.

  See also our [API](https://basedosdados.org/docs/api_reference_python) for more details on each method.
</Tip>

**7.4** Create the .sql and schema.yml files from the architecture table to run materialization and tests in dbt (data build-tool):

```python
from databasers_utils import TableArchitecture

arch = TableArchitecture(
    dataset_id="<dataset-id>",
    tables={
        "<table-id>": "URL of the Google Sheet architecture",  # Example https://docs.google.com/spreadsheets/d/1K1svie4Gyqe6NnRjBgJbapU5sTsLqXWTQUmTRVIRwQc/edit?usp=drive_link
    },
)

# Creates the yaml file
arch.create_yaml_file()

# Creates the sql files
arch.create_sql_files()

# Updates the dbt_project.yml
arch.update_dbt_project()
```

<Tip caption="If necessary, at this point you can change the SQL query to perform final processing from the `staging` table. You can add columns, remove columns, perform algebraic operations, replace strings, etc. SQL is the limit!"/>


**7.5** Using DBT

The dbt sql files use the `set_datalake_project` macro, which indicates which project (databases-staging or databases-dev) the data will be consumed from. When creating the files using the `create_sql_files` function, the macro will be inserted.

```sql
select
    col_name
from {{ set_datalake_project(“<DATASET_ID>_staging.<TABLE_ID>”) }}
```


### Materializing the model in BigQuery

Materializes a single model by name in basedosdados-dev consuming data from `basedosdados-dev.{table_id}_staging`

```sh
dbt run --select dataset_id__table_id
```

Materialize all models in a folder in basedosdados-dev consuming data from `basedosdados-dev.{table_id}_staging`

```sh
dbt run --select model.dateset_id.dateset_id__table_id
```

Materialize all models in the path in basedosdados-dev consuming data from `basedosdados-dev.{table_id}_staging`

```sh
dbt run --select models/dataset_id
```

Materialize a single model by the sql file path in basedosdados-dev consuming data from `basedosdados-dev.{table_id}_staging`

```sh
dbt run --select models/dataset/table_id.sql
```

### Testing the model in BigQuery

Tests a single model

```sh
dbt test --select dataset_id__table_id
```

Tests all models in a folder

```sh
dbt test --select model.dateset_id.dateset_id__table_id
```

Tests all models in the path

```sh
dbt test --select models/dataset_id
```

**7.6** Upload table metadata to the website:
<Tip caption="For now, only the data team has permission to upload table metadata to the website, so you will need to contact us. We are already working to enable volunteers to update data on the website in the near future."/>

### 8. Send everything for review

Phew, that's it! Now all that's left is to send everything for review to the
[repository](https://github.com/basedosdados/pipelines) in the Database.

1. Clone our [repository](https://github.com/basedosdados/pipelines) locally.
2. Use `cd` to navigate to the local repository folder and open a new branch with `git checkout -b [dataset_id]`. All additions and modifications will be included in this _branch_.
3. For each new table, include the file named `dataset__table_id.sql` in the `pipelines/models/dataset_id/` folder by copying the queries and schema you created in step 7.
4. Include your capture and cleaning code in the `pipelines/models/dataset_id/code` folder.
5. Now just publish the branch, open the PR with the labels ‘table-approve’ and tag the data team for correction.

**What now?** Our team will review the data and metadata submitted
via GitHub. We may contact you to ask questions or request
changes to the code. When everything is OK, we will merge your
pull request and the data will be automatically published on our
platform!

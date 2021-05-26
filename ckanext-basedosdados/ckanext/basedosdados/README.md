# Como usar a extensão do BD

## Adicionando um action endpoint na API

Os Actions da API do ckan podem ser chamados via:

<url>/api/3/action/<function>

Eles são responsáveis por intermediar a relacão entre os Models (Banco de Dados)
e o site.

Todos os endpoints do CKAN são construídos em outro repositório,
`ckan/ckan`, e moram em [`ckan/ckan/logic/action`](https://github.com/ckan/ckan/blob/master/ckan/logic/action/get.py). Eles são dividios em create, delete, get, patch e update. A lista
completa e documentacao está [aqui](https://docs.ckan.org/en/2.9/api/index.html#action-api-reference).

Com o nosso plugin, é possível adicionar ou modificar enpoints. Essas alteracoes 
devem ser feitas no arquivo `endpoint_function.py`.

### Adicionando um endpoint GET

Basta escrever a seguinte funcão no arquivo `endpoint_function.py`:

```python
import ckan.plugins.toolkit as toolkit

@toolkit.side_effect_free # Necessário para fazer o GET
def get_test(context, data_dict=None):

    return "Ueba!"
```

Para acessar o resultado, basta ir para 

`http://localhost:5000/api/3/action/get_test`

O retorno será:

```json
{
 "help": "http://localhost:5000/api/3/action/help_show?name=get_test", 
 "success": true,
 "result": "Ueba!"
}
```

> Observe que o nome da funcão e do endpoint são os mesmos.

### Adicionando um endpoint POST

Também no arquivo `endpoint_function.py`:

```python
def post_test(context, data_dict):

    return data_dict['mensagem']
```

Uma chamada cURL seria assim:

```bash
curl -X POST \
  http://localhost:5000/api/3/action/post_test \
  -H 'cache-control: no-cache' \
  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
  -H 'postman-token: f720aa2d-e2e6-3c5e-878b-df805e9e6432' \
  -F 'mensagem=Arou!'
```

E a resposta:

```json
{
    "help": "http://localhost:5000/api/3/action/help_show?name=post_test",
    "success": true,
    "result": "Arou!"
}
```

### Acessando o Banco de Dados para retornar na API

O CKAN faz a interface com o banco de dados via ORM do `sqlachemy`. Essencialmente,
existe uma classe para cada tabela, essas classes são chamadas de `Model`.
Para acessar as tabelas, ou `Models`, dentro da lógica de um endpoint, basta usar
a variável `context`. 

Ela contém informacoes sobre o contexto como o usuário, ..., e os `Models` disponíveis.
Então, basta acessar `context["Model"]` para ter um objeto com as tabelas. Daí,
é só escolhar a tabela, ex: `package_table = context["Model"].package_table` ou
`user_table = context['Model'].user_table`.

A lista completa de tabelas pode ser encontrada no final do documento.

A consulta abaixo retorna todos os nomes de `packages` no banco:

```python
@toolkit.side_effect_free
def get_news(context, data_dict=None):
    # The actual custom API method


    package_table = context["model"].package_table
    query = _select([package_table.c.name])

    return [r for r in query.execute()]
```


##### Models

'activity', 'activity_detail_table', 'activity_table', 'alembic_current', 'alembic_downgrade', 'alembic_upgrade', 'api_token', 'ckan', 'config', 'core', 'dashboard', 'delete_system_info', 'domain_object', 'engine_is_pg', 'engine_is_sqlite', 'extension', 'follower', 'get_system_info', 'group', 'group_extra', 'group_extra_table', 'group_table', 'init_model', 'is_id', 'license', 'log', 'logging', 'member_table', 'meta', 'misc', 'modification', 'os', 'package', 'package_extra', 'package_extra_table', 'package_member_table', 'package_relationship', 'package_relationship_table', 'package_table', 'package_tag_table', 'parse_db_config', 'rating', 're', 'repo', 'resource', 'resource_table', 'resource_view', 'resource_view_table', 'set_system_info', 'sleep', 'splitext', 'sqav', 'system', 'system_info', 'system_info_table', 'tag', 'tag_table', 'task_status', 'task_status_table', 'term_translation', 'term_translation_table', 'tracking', 'tracking_raw_table', 'tracking_summary_table', 'types', 'user', 'user_table', 'vocabulary', 'warnings'
# Extensão da BD

<!--------------------------------------------------------->
<!--------------------------------------------------------->

## Como funciona a API da BD

A API da BD é composta de endpoints padrões do CKAN e endpoints próprios.

Os endpoints da bd podem ser chamados via `basedosdados.org/api/3/action/<function>`, na qual as funções estão contidas na pasta `actions`. Elas são responsáveis por intermediar a relação entre os models (Banco de Dados) e o site.

Todos os endpoints do CKAN são construídos em outro repositório,
`ckan/ckan`, e moram em [`ckan/ckan/logic/action`](https://github.com/ckan/ckan/blob/master/ckan/logic/action/). Eles são divididos em `create`, `get`, `patch`, `update`, `delete`. A lista
completa e documentação está [aqui](https://docs.ckan.org/en/2.9/api/index.html#action-api-reference).

<!--------------------------------------------------------->
<!--------------------------------------------------------->

### Nomeação dos endpoints

Existem 5 tipos de endpoints, como no ckan: `create`, `get`, `patch`, `update`, `delete`. Eles existem em seus respectivos arquivos dentro da pasta `actions`. O site novo do BD só poderá chamar os endpoints criados em `actions`. Todos os endpoints deverão ter o prefixo `bd_`. Por exemplo:

```
nome original: organization_list_for_user
nome bd:       bd_organization_list_for_user
```

Mesmo se o endpoint não tiver o comportamento alterado, deve-se criar um novo endpoint BD chamando o antigo.

<!--------------------------------------------------------->
<!--------------------------------------------------------->

### Adicionando um endpoint GET

Basta escrever a seguinte função no arquivo `actions/get.py`:

```python
import ckan.plugins.toolkit as toolkit

@toolkit.side_effect_free # Necessário para fazer o GET
def get_test(context, data_dict=None):
    return "Ueba!"
```

Para acessar o resultado, basta acessar `http://localhost:5000/api/3/action/get_test`. E o retorno será:

```json
{
 "help": "http://localhost:5000/api/3/action/help_show?name=get_test", 
 "success": true,
 "result": "Ueba!"
}
```

Observe que o nome da função e do endpoint são os mesmos.

<!--------------------------------------------------------->
<!--------------------------------------------------------->

### Adicionando um endpoint POST

Agora no arquivo `actions/create.py`:

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

<!--------------------------------------------------------->
<!--------------------------------------------------------->

### Acessando o Banco de Dados na API

O CKAN faz a interface com o banco de dados via ORM do `sqlachemy`. Essencialmente,
existe uma classe para cada tabela, essas classes são chamadas de `Model`.
Para acessar as tabelas, ou `Models`, dentro da lógica de um endpoint, 
basta usar a variável `context`. 

Ela contém informações sobre o contexto como o usuário, ..., e os `Models` disponíveis.
Então, basta acessar `context["Model"]` para ter um objeto com as tabelas. Daí,
é só escolher a tabela, ex: `package_table = context["Model"].package_table` ou
`user_table = context['Model'].user_table`.

A consulta abaixo retorna todos os nomes de `packages` no banco:

```python
@toolkit.side_effect_free
def get_news(context, data_dict=None):
    # The actual custom API method

    package_table = context["model"].package_table
    query = _select([package_table.c.name])

    return [r for r in query.execute()]
```

##### Lista de `Models`

'activity', 'activity_detail_table', 'activity_table', 'alembic_current', 'alembic_downgrade', 'alembic_upgrade', 'api_token', 'ckan', 'config', 'core', 'dashboard', 'delete_system_info', 'domain_object', 'engine_is_pg', 'engine_is_sqlite', 'extension', 'follower', 'get_system_info', 'group', 'group_extra', 'group_extra_table', 'group_table', 'init_model', 'is_id', 'license', 'log', 'logging', 'member_table', 'meta', 'misc', 'modification', 'os', 'package', 'package_extra', 'package_extra_table', 'package_member_table', 'package_relationship', 'package_relationship_table', 'package_table', 'package_tag_table', 'parse_db_config', 'rating', 're', 'repo', 'resource', 'resource_table', 'resource_view', 'resource_view_table', 'set_system_info', 'sleep', 'splitext', 'sqav', 'system', 'system_info', 'system_info_table', 'tag', 'tag_table', 'task_status', 'task_status_table', 'term_translation', 'term_translation_table', 'tracking', 'tracking_raw_table', 'tracking_summary_table', 'types', 'user', 'user_table', 'vocabulary', 'warnings'

<!--------------------------------------------------------->
<!--------------------------------------------------------->

### Alterando os metadados da BD

Na pasta `validator` estão contidos os validadores de dados escritos em [pydantic](https://pydantic-docs.helpmanual.io/), os de datasets em `package.py` e os de resource, bdm table e external link em `resource.py`. Adicionar um novo campo ao banco de dados é um processo em duas fases:

1. Adicionar o campo a classe que o mesmo pertence, como adicionar `dataset_id` a classe `Package`.
2. Adicionar o campo ao banco de dados, através uma migration, criando um valor padrão para o mesmo.

Existem exemplos de migrations na pasta [migration](https://github.com/basedosdados/website/tree/master/utils/migration). Em geral alterações de metadados são realizadas na variável json `extras`. Por exemplo:

```sql
UPDATE
	resource
SET
	extras = extras::jsonb || jsonb_build_object(
			'is_bdm',                   NULL
			,'table_id',                case when resource_type = 'bdm_table' then resource.name else NULL end
	)
```

Para visualizar as mudanças nos metadados, execute `docker exec -it ckan ckan search-index rebuild`.

Note que os validadores são executados automaticamente, tanto para leitura quanto para escrita. Vide código em `plugin.py`. 

<!--------------------------------------------------------->
<!--------------------------------------------------------->

## Descrição das pastas da extensão

- actions: endpoints da bd.
- assets: arquivos js e css que serão compilados segundo a lógica documentada no ckan. Nao esquecer de editar webassets.yml.
- public: arquivos públicos da bd, como imagens.
- tests: testes unitários.
- validator: inclui as definições de meta-metadados e funções de validação.

# Como adicionar novos metadados

## Exemplo para tabela bd+

Para adicionar um novo metadado no dataset, adicione o campo desejado na classe `BdmDataset` em `bdm/dataset.py`. No caso de um novo metadado para a tabela adicinar na classe `BdmTable`em `bdm/table.py`.

Para definir o tipo do campo a ser validado pelo pydantic consulte a documentação ([Field Types ](https://pydantic-docs.helpmanual.io/usage/types/)). Em caso de um campo nested, deve ser criada uma classe que será passada para a tipagem, no código essa classe deve estar localizada acima de sua chamada.


É indicado utilizar a classe `Optional` na tipagem, podendo ser retirada após a criação do campo no banco de dados do ckan. 


### Exemplo campo `new_metadata`;
```python
from pydantic import StrictStr as Str
from typing import Optional

from ckanext.basedosdados.validator.ckan_default import BaseModel

class NestedNewMetadata(BaseModel):
    name: Str 
    email: Str

class BdmDataset(_CkanDefaults):

    # add new metadata
    new_metadata:  Optional[NestedNewMetadata] = NEW_METADATA_FIELD

```

Caso seja necessario adicionar mais informações ao metadado, basta utilizar 
a função [Field customisation](https://pydantic-docs.helpmanual.io/usage/schema/#field-customisation)
do pydantic, criando uma nova variavel em `bdm/metadata_definitions/dataset_definitions.py`.

```python

LICENSE_FIELD = Field(
    title="license",
    description=to_line(
        [
            "Essa base está sob qual licença?",
            "A licença MIT se aplica a bases públicas.",
            "Caso não seja pública, ver opções aqui: https://help.data.world/hc/en-us/articles/115006114287-Common-license-types-for-datasets",
        ]
    ),
    yaml_order={
        "id_before": "brazilian_IP",
        "id_after": "new_metadata",
    },
)


NEW_METADATA_FIELD = Field(
    title="new_metadata",
    user_input_hint=["<new_metadata_hint>"],
    description=to_line(["AUTO GENERATED"]),
    yaml_order={
        "id_before": 'license',
        "id_after": "None",
    },
)
```

Após adição do campo fazer a reindexação do banco do ckan utilizando o comando `docker exec -it ckan ckan search-index rebuild`

----
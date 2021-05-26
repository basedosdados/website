# website

# Contribuir:

## Pre requisitos:

Instalar:
* Docker
* docker-compose (pip install docker-compose)
* git-lfs ( download here: https://packagecloud.io/github/git-lfs/install#bash-python, instrucoes: https://git-lfs.github.com/)

* Criar configs/ckan.prod.ini e .env.prod # podem ser arquivos vazios se vc nao for fazer deploy pra prod direto da sua maquina

* Rodar `./bootstrap.sh`

Porta 5000
Logar como user: dev senha: 12345678

como mudar um template:
    https://docs.ckan.org/en/2.9/theming/templates.html
    modificar templates dentro de ckanext-basedosdados


Em alguns casos (arquivos novos) o ckan nao detecta as modificacoes automaticamente, entao vc pode dar um `docker-compose down -t0 ckan` e depois `docker-compose up ckan` pra restartar o servico.


#### PLUGIN DO BASEDOSDADOS

O plugin do BD mora em `ckanext-basedosdados/ckanext/basedosdados/`. Onde você
pode encontrar um [README.md](ckanext-basedosdados/ckanext/basedosdados/README.md`) mais completo.

#### POSTGRES

O banco estará disponível em:
```
host:localhost
port:5432
database:ckan
user:ckan
password:ckan
```

# TODO
* Dar uma limpa nas extensoes: copiar pra dentro o q nao tem tag/versao, e fixar versoes das q tem
* dar uma limpa nas configuracoes prod/dev, o ideal era ficar tudo nos dc comoses e no .env as coisas privadas
* Colocar novos filtros (e ver pq ele nao ta pegando o label ao inves do valor privado)
* Traduzir pra ingles as chaves dos metadados
* tornar compativel os campos do BQ com o ckan
* Integracao automatica dos metadados CKAN e BQ
* Colar extensoes e ckan como subtree do nosso repo

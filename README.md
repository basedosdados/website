# website

# Contribuir:

## Pre requisitos:

* Ter Docker instalado
* Ter o docker-compose instalado (pip install docker-compose)

* Criar configs/ckan.prod.ini e .env.prod

* Rodar `./bootstrap.sh`

Porta 5000
Logar como user: dev senha: 12345678

como mudar um template:
    https://docs.ckan.org/en/2.9/theming/templates.html
    modificar templates dentro de ckanext-basedosdados


# TODO
* Dar uma limpa nas extensoes: copiar pra dentro o q nao tem tag/versao, e fixar versoes das q tem
* dar uma limpa nas configuracoes prod/dev, o ideal era ficar tudo nos dc comoses e no .env as coisas privadas
* Colocar novos filtros (e ver pq ele nao ta pegando o label ao inves do valor privado)
* Traduzir pra ingles as chaves dos metadados
* tornar compativel os campos do BQ com o ckan
* Integracao automatica dos metadados CKAN e BQ
* Colar extensoes e ckan como subtree do nosso repo

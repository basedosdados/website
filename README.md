# website [basedosdados.org](http://basedosdados.org)

# Contribuir:

## Pre requisitos:

Instalar:
* Docker
* docker-compose (pip install docker-compose)
* git-lfs ( download here: https://packagecloud.io/github/git-lfs/install#bash-python, instrucoes: https://git-lfs.github.com/)

* Criar configs/ckan.override.prod.ini e .env.prod # podem ser arquivos vazios se vc nao for fazer deploy pra prod direto da sua maquina

* Rodar `./bootstrap.sh`

Porta 5000
Logar como user: dev senha: 12345678

## Editando html

como mudar um template:
    https://docs.ckan.org/en/2.9/theming/templates.html
    modificar templates dentro de ckanext-basedosdados


Em alguns casos (arquivos novos) o ckan nao detecta as modificacoes automaticamente, entao vc pode dar um `docker-compose down -t0 ckan` e depois `docker-compose up ckan` pra restartar o servico.

## bootstrap.sh

Esse script inicializa o ambiente de dev, se vc quiser re-inicializar completamente, deleteando tudo e buildando tudo de novo do 0, rode `./bootstrap.sh full`

## API TOKEN

rode `source .ckan_dev_api_token` para carregar a variavel de ambiente `CKAN_API_TOKEN` com um token valido de dev. Coloque no seu .bashrc se vc for preguicoso.

## Configs

### Variaveis de ambiente e docker-compose

O ambiente de dev funciona basicamente nas costas do docker-compose

Duas features do docker-compose importantes q usamos aqui:

* docker-compose suporta interpolacao de variaveis usando a sintaxe `${VAR_NAME}` lendo automaticamente de um arquivo com nome `.env` no mesmo diretorio do docker-compose.yaml
* docker-compose AUTOMATICAMENTE da merge entre o arquivo docker-compose.yaml e o arquivo docker-compose.override.yaml (caso houver), e considera isso o yaml q "ta valendo"

As configuracoes q variam entre dev e prod ficam em variaveis de ambiente definidas no docker-compose.yaml

Idealmente colocamos no .env somente as variaveis privadas (como senhas e outros segredos) e interpolamos seu valor. Usando o .env para dev e .env.prod para prod.

Outras configuracoes nao secretas q diferem entre os ambientes ficam nos arquivos docker-compose.override.yaml e prod-docker-compose.override.yaml

### outras configuracoes dev/prod

Existem outros lugares com configuracoes dev/prod.

configs/
* crontab (o cron q roda em producao, fazendo backup, monitoramento e manutencao)
* ckan.ini / ckan.override.prod.ini sao arquivos de configuracao do ckan. No caso, o ckan.ini eh usado em dev e o ckan.prod.ini é MERGEADO em cima dele na hora de deployar pra prod.
* nginx.conf eh o arquivo de conf do nginx (q roda em producao)
* who.ini outro arquivo de conf do ckan (q nunca mechemos)

### Utils

A pasta utils contem scripts utilizados em dev e em prod para diversas coisas. Os nomes dos scripts devem ser autoexplicativos e conter comentarios explicando sua razao de ser.

Arquivos com _ na frente sao dependencias de scripts normais e nao devem ser chamados diretamente.

#### Script de atualizacao do banco de dev a partir dos dumps de producao/staging

Voce pode rodar o script em `./utils/create_dev_init_data.sh` para atualizar o arquivo './postgresql/dev_init_data.sql.gz' que contem o snapshot do banco de dev.

Opcoes:
Parametro posicional `File`: caso nao queira baixar um backup automaticamente de prod/staging, vc pode passar um path com um arquivo postgres.dump

Parametro variavel de ambiente STAGING=1:
Se STAGING=1, o script vai baixar do banco de staging ao inves de producao.

Note q vc precisara ter configurado o seu ~/.ssh/config local para acessar as maquinas do basedosdados. Para isso edite (ou crie) `~/.ssh/config` e adicione as seguintes linhas, (modificando o path, logico):

```ssh_config
HOST bd-s staging.basedosdados.org
    HostName staging.basedosdados.org
    User ec2-user
    IdentityFile /path/para/sua/chave/privada
HOST bd basedosdados.org
    HostName basedosdados.org
    User ec2-user
    IdentityFile /path/para/sua/chave/privada
```

### PLUGIN DO BASEDOSDADOS

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

### Deploy

O deploy é feito via github actions, basta pushar na master. Se vc adicionar variaveis de ambiente secretas em prod, vai ter q atualizar o arquivo .env.prod no github actions!

Basicamente rodamos o ./deploy.sh que é um script com varias partes. Vc pode rodar manualmente (desde q tenha permissao, claro) uma das partes passando-a como argumento Ex.: `./deploy.sh restart_services`

#### Staging

Podemos fazer deploy pra staging dando push na branch develop.

A variavel de ambiente BD_ENVIRON esta setada como 'STAGING' em staging.basedosdados.org e 'PROD' na maquina basedosdados.org. Essa variavel de ambiente fica disponivel em todas as aplicacoes nao dockerizadas

### Experimental

Essa pasta contem coisas q ainda estao em fase de experimentacao/poc

# TODO
* Dar uma limpa nas extensoes: copiar pra dentro o q nao tem tag/versao, e fixar versoes das q tem
* dar uma limpa nas configuracoes prod/dev, o ideal era ficar tudo nos dc comoses e no .env as coisas privadas
* Colar extensoes e ckan como subtree do nosso repo

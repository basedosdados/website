# [basedosdados.org](http://basedosdados.org)

## Para desenvolvimento local

- Instale docker, docker-compose, git-lfs (instruções em [git-lfs.github.com](https://git-lfs.github.com/));
- Execute `./bootstrap.sh`;
- Acesse localhost:5000.

É possível também logar com o usuário `dev` e senha `12345678`. Note que o script `bootstrap.sh` inicializa o ambiente dev, caso tenha algum problema é possível inicializar do zero (com novos downloads e builds) com `./bootstrap.sh full`. Caso precise, a chave de API do ckan em desenvolvimento se encontra em `configs/ckan_dev_api_token.sh`, e para adicionar as suas variáveis de ambiente rode `source configs/ckan_dev_api_token.sh` ou adicione ao seu `bashrc`.

É possível visualizar e modificar o banco de dados (com dbeaver) em:

```
host:localhost
port:5432
database:ckan
user:ckan
password:ckan
```

## Para deploy do site

O deploy é feito via github actions, basta pushar na master. Se você adicionar variáveis de ambiente secretas em prod, vai ter que atualizar o arquivo .env.prod no github actions! Basicamente rodamos o `./deploy.sh`, que é um script com várias partes. Você pode rodar manualmente (desde que tenha permissão, claro) uma das partes, passando-a como argumento, como `./deploy.sh restart_services`.

De forma análoga é possível fazer o deploy do site staging, pushando na branch develop. Neste caso a variável de ambiente `BD_ENVIRON` tem valor `STAGING`, ao invés de `PROD`. Essa variável fica disponível para todas as aplicações não dockerizadas.

## Para configurar o SSH

Note que você precisará ter configurado o seu ~/.ssh/config local para acessar as máquinas do base dos dados. Para isso edite (ou crie) `~/.ssh/config` e adicione as seguintes linhas, (modificando o path, lógico):

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

## Pasta `ckanext-basedosdados`

O plugin da Base dos Dados mora em `ckanext-basedosdados/ckanext/basedosdados`. Consulte este [README.md](ckanext-basedosdados/ckanext/basedosdados/README.md).

## Pasta `configs`

### Variáveis de ambiente e docker-compose

O ambiente de dev funciona com docker-compose. Duas features do docker-compose importantes que usamos aqui:

- docker-compose suporta interpolação de variáveis usando a sintaxe `${VAR_NAME}` lendo automaticamente de um arquivo com nome `.env` no mesmo diretório do docker-compose.yaml
- docker-compose AUTOMATICAMENTE da merge entre o arquivo docker-compose.yaml e o arquivo docker-compose.override.yaml (caso houver), e considera isso o yaml q "ta valendo"

As configurações que variam entre dev e prod ficam em variáveis de ambiente definidas no docker-compose.yaml. Idealmente colocamos no .env somente as variáveis privadas (como senhas e outros segredos) e interpolamos seu valor. Usando o .env para dev e .env.prod para prod. Outras configuracoes nao secretas que diferem entre os ambientes ficam nos arquivos docker-compose.override.yaml e prod-docker-compose.override.yaml

### Outras configurações de ambiente

Existem outros lugares com configurações dev/prod. Em `configs/` temos:

- crontab é o cron que roda em produção, fazendo backup, monitoramento e manutenção;
- ckan.ini / ckan.override.prod.ini são arquivos de configuração do ckan. No caso, o ckan.ini e usado em dev e o ckan.prod.ini é MERGEADO em cima dele na hora de deployar pra prod;
- nginx.conf eh o arquivo de configuração do nginx (que roda em produção);
- who.ini outro arquivo de configuração do ckan (que nunca mexemos).

## Pasta `utils`

A pasta utils contem scripts utilizados em dev e em prod para diversas coisas. Os nomes dos scripts devem ser autoexplicativos e conter comentários explicando sua razão de ser. Arquivos com _ na frente são dependências de scripts normais e não devem ser chamados diretamente.

### Script de atualização do banco de dev a partir dos dumps de produção/staging

Você pode rodar o script em `./utils/create_dev_init_data.sh` para atualizar o arquivo './postgresql/dev_init_data.sql.gz' que contem o snapshot do banco de dev. Esse script aceita como parâmetro posicional `File`, caso não queira baixar um backup automaticamente de prod/staging, você pode passar um path com um arquivo postgres.dump. Se STAGING=1, o script vai baixar do banco de staging ao invés de produção.

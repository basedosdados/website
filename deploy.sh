#!/bin/bash -ex

HOST=ec2-user@3.131.160.142
SSH="ssh -i ~/.ssh/BD.pem $HOST"

deploy() {
    rm -rf build
    mkdir -p build/images
    build_config
    build_images
    send
    load_images
    restart_services
    rebuild_index
}

deploy_configs() {
    build_config
    send
    restart_services
}

build_config() {
    cp docker-compose.yaml build/docker-compose.yaml
    cp prod-docker-compose.override.yaml build/docker-compose.override.yaml
    cp utils/backup_database.sh build/
    cp configs/nginx.conf build/
    cp .env.prod build/.env
}
send() {
    $SSH 'mkdir -p ~/basedosdados/'
    rsync -e 'ssh -i ~/.ssh/BD.pem' -azvv --size-only --progress --partial ./build/images/ $HOST:~/basedosdados/images/ &
    rsync -e 'ssh -i ~/.ssh/BD.pem' -azvv --exclude=images --checksum ./build/ $HOST:~/basedosdados/ &
    wait
}
load_images() {
    $SSH '
        docker load < ~/basedosdados/images/ckan
        docker load < ~/basedosdados/images/solr
        docker load < ~/basedosdados/images/db
    '
}
restart_services() {
    $SSH  '
        set -e ; cd ~/basedosdados/
        if [[ ! -f wait-for-200.sh ]]; then curl https://raw.githubusercontent.com/cec/wait-for-endpoint/master/wait-for-endpoint.sh > wait-for-200.sh && chmod +x wait-for-200.sh; fi
        if [[ ! -f wait-for-it.sh ]]; then curl https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh > wait-for-it.sh && chmod +x wait-for-it.sh; fi
        docker-compose rm -sf ckan autoheal
        docker-compose up -d solr redis nginx
        docker run --rm --network basedosdados -v `pwd`:/app bash /app/wait-for-it.sh redis:6379 
        docker run --rm --network basedosdados -v `pwd`:/app bash /app/wait-for-it.sh solr:8983
        docker-compose up -d ckan autoheal
        docker-compose ps
        ./wait-for-200.sh -t 20 https://localhost:443 || ERROR=1
        if [[ ! $ERROR ]]; then
            echo Server is up
        else
            echo Server not up
            docker-compose ps
            sleep 1
            docker-compose logs ckan
        fi
    '
}
rebuild_index() {
    $SSH  '
        cd ~/basedosdados/
        docker-compose exec -T ckan /usr/local/bin/ckan search-index rebuild
    '

}
build_images() {
    ( docker-compose build ckan && docker save bdd/ckan > build/images/ckan ) &
    ( docker-compose build solr && docker save bdd/solr > build/images/solr ) &
    ( docker-compose build db   && docker save bdd/db > build/images/db ) &
    wait
}

for i in "$@"; do $i; done

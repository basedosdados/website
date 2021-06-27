#!/bin/bash -ex
cd $(git rev-parse --show-toplevel)

HOST=ec2-user@basedosdados.org
SSH="ssh -o StrictHostKeyChecking=no -i ~/.ssh/BD.pem $HOST"
VTAG=":`date +%H.%M.%S`" # Simple mechanism to force image update

BUILD_DIR="/tmp/bdd_build"

deploy() {
    clean
    build_config
    build_images
    send
    load_images
    restart_services
    rebuild_index
    install_crontab
    install_apprise
}

deploy_configs() {
    clean
    build_config
    send
    restart_services
}

clean() {
    rm -rf $BUILD_DIR ./build
    mkdir -p $BUILD_DIR/images
    ln -s $BUILD_DIR ./build
}

build_config() {
    cp docker-compose.yaml build/docker-compose.yaml
    cp configs/docker-compose.override.prod.yaml build/docker-compose.override.yaml
    cp utils/backup_database.sh build/
    cp configs/nginx.conf build/
    cp .env.prod build/.env && echo "VTAG=$VTAG" >> build/.env

    cp -r experimental/monitoring build/

    cp -r experimental/wordpress build/
    rm build/wordpress/.env && ln -s ../.env build/wordpress/.env
    mv build/wordpress/docker-compose.override.prod.yaml build/wordpress/docker-compose.override.yaml

    cp configs/basedosdados_crontab build/basedosdados_crontab
}
send() {
    $SSH 'mkdir -p ~/basedosdados/'
    rsync -e 'ssh -i ~/.ssh/BD.pem' -azvv --progress --partial ./build/images/ $HOST:~/basedosdados/images/ & # TODO: debug this, the size-only seems to be failing...
    rsync -e 'ssh -i ~/.ssh/BD.pem' -azvv --exclude=images --checksum ./build/ $HOST:~/basedosdados/ &
    for i in `jobs -p`; do wait $i ; done
}
load_images() {
    $SSH "
        docker load < ~/basedosdados/images/ckan
        docker load < ~/basedosdados/images/solr
        docker load < ~/basedosdados/images/db
        docker load < ~/basedosdados/images/next
    "
}
restart_services() {
    $SSH  '
        set -e ; cd ~/basedosdados/
        if [[ ! -f wait-for-200.sh ]]; then curl https://raw.githubusercontent.com/cec/wait-for-endpoint/master/wait-for-endpoint.sh > wait-for-200.sh && chmod +x wait-for-200.sh; fi
        if [[ ! -f wait-for-it.sh ]]; then curl https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh > wait-for-it.sh && chmod +x wait-for-it.sh; fi
        docker-compose rm -sf ckan next autoheal
        docker-compose up --no-build -d solr redis
        docker run --rm --network basedosdados -v `pwd`:/app bash /app/wait-for-it.sh redis:6379
        docker run --rm --network basedosdados -v `pwd`:/app bash /app/wait-for-it.sh solr:8983
        docker-compose up --no-build -d ckan next
        docker-compose up --no-build -d nginx
        docker-compose up --no-build -d autoheal
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
        docker-compose exec -T ckan ckan search-index rebuild --refresh
    '

}
build_images() {
    export COMPOSE_DOCKER_CLI_BUILD=1
    export DOCKER_BUILDKIT=1
    if [[ ! -d vendor/ckan/.git ]]; then ./_clone_ckan.sh; fi
    ( VTAG=$VTAG docker-compose build ckan && docker save bdd/ckan$VTAG > build/images/ckan ) &
    ( docker-compose build solr && docker save bdd/solr > build/images/solr ) &
    ( docker-compose build db   && docker save bdd/db > build/images/db ) &
    ( VTAG=$VTAG docker-compose build next && docker save bdd/next$VTAG > build/images/next ) &
    for i in `jobs -p`; do wait $i ; done
}
restart_wordpress() {
    $SSH  '
        cd ~/basedosdados/wordpress
        docker-compose down && docker-compose up -d
    '
}
restart_monitoring() {
    $SSH  '
        cd ~/basedosdados/monitoring
        docker-compose down && docker-compose up -d
    '
}
install_crontab() {
    $SSH  '
        (
        echo "####### AUTO GENERATED CRONTAB - DONT EDIT MANUALLY ##########"
        cat ~/basedosdados/basedosdados_crontab
        ) | crontab
    '
}
install_apprise() {
    $SSH  '
        cd ~/basedosdados/
        source .env
        echo $APPRISE_CONFIG > ~/.apprise
        grep DISCORD .env | sed s/DISCORD_//g > ~/.discord_ids
    '
}

for i in "$@"; do $i; done


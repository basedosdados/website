FROM solr:6.6.5

# Enviroment
ENV SOLR_CORE ckan

# Create Directories
RUN mkdir -p /opt/solr/server/solr/$SOLR_CORE/conf
RUN mkdir -p /opt/solr/server/solr/$SOLR_CORE/data

# Adding Files
ADD ./stack/solr/solrconfig.xml \
./stack/solr/schema.xml \
./stack/solr/currency.xml \
./stack/solr/synonyms.txt \
./stack/solr/stopwords.txt \
./stack/solr/protwords.txt \
./stack/solr/elevate.xml \
/opt/solr/server/solr/$SOLR_CORE/conf/

# Create Core.properties
RUN echo name=$SOLR_CORE > /opt/solr/server/solr/$SOLR_CORE/core.properties

# Giving ownership to Solr

USER root
CMD ["solr-foreground", "-force"]

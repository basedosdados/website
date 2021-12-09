FROM apache/superset

# Switching to root to install the required packages
USER root

# Example: installing the Postgres driver to connect to the metadata database
RUN pip install psycopg2-binary pybigquery

# Switching back to using the `superset` user
USER superset
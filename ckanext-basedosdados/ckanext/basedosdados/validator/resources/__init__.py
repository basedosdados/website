# -------------------------------------
# RESOUCES CKAN DEFAULT
# -------------------------------------
from ckanext.basedosdados.validator.resources.ckan_default.resource import _CkanDefaultResource

# -------------------------------------
# RESOUCES BDM
# -------------------------------------
from ckanext.basedosdados.validator.resources.bdm.table.table import BdmTable, Resource
from ckanext.basedosdados.validator.resources.bdm.column.columns import BdmColumns

# -------------------------------------
# RESOUCES EXTERNAL LINK
# -------------------------------------
from ckanext.basedosdados.validator.resources.external_link.source import ExternalLink


# -------------------------------------
# NEW FIELDS
# -------------------------------------
RESOURCE_TYPES = ['bdm_table', 'external_link'] # TODO: add something that test that subclasses obey this constant

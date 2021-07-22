# -------------------------------------
# RESOUCES CKAN DEFAULT
# -------------------------------------
from ckanext.basedosdados.validator.resources.ckan_default.resource import _CkanDefaultResource

# -------------------------------------
# RESOUCES BDM
# -------------------------------------
from ckanext.basedosdados.validator.resources.bdm.column import BdmColumns
from ckanext.basedosdados.validator.resources.bdm.table import BdmTable

# -------------------------------------
# RESOUCES EXTERNAL LINK
# -------------------------------------
from ckanext.basedosdados.validator.resources.external_link import ExternalLink


# -------------------------------------
# NEW FIELDS
# -------------------------------------
RESOURCE_TYPES = ['bdm_table', 'external_link'] # TODO: add something that test that subclasses obey this constant

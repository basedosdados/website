# -------------------------------------
# RESOUCES CKAN DEFAULT
# -------------------------------------
from ckanext.basedosdados.validator.resources.ckan_default.resource import (
    _CkanDefaultResource,  # this has to be the first because of import initializations
)

# -------------------------------------
# RESOUCES BDM
# -------------------------------------
from ckanext.basedosdados.validator.resources.bdm.column import (
    BdmColumns,  # this has to be the second because of import initializations
)
from ckanext.basedosdados.validator.resources.bdm.dictionary import BdmDictionary
from ckanext.basedosdados.validator.resources.bdm.table import BdmTable


# -------------------------------------
# RESOUCES EXTERNAL LINK
# -------------------------------------
from ckanext.basedosdados.validator.resources.external_link import ExternalLink

# -------------------------------------
# RESOUCES EXTERNAL LINK
# -------------------------------------
from ckanext.basedosdados.validator.resources.information_request import (
    InformationRequest,
)

# -------------------------------------
# NEW FIELDS
# -------------------------------------
RESOURCE_TYPES = [
    "bdm_table",
    "external_link",
    "information_request",
    "bdm_dictionary",
]  # TODO: add something that test that subclasses obey this constant

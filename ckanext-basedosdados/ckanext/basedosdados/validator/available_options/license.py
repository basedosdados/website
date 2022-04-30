from .attr_enum import AttrEnum


class LicenseEnum(AttrEnum):

    # fmt: off
    odc_by      = {"label": "Open Data Commons Attribution License (ODC BY)"}
    odbl        = {"label": "Open Data Commons Open Database License (ODbL)"}
    ppdl        = {"label": "Open Data Commons Public Domain Dedication and Licence (PDDL)"}
    cc_40       = {"label": "Creative Commons Attribution (CC BY 4.0)"}
    cc_by       = {"label": "Creative Commons Attribution (CC BY)"}
    cc_by_nc    = {"label": "Creative Commons Attribution Noncommercial (CC BY-NC)"}
    cc_by_nd    = {"label": "Creative Commons Attribution Nonderivatives (CC BY-ND)"}
    cc_by_nc_nd = {"label": "Creative Commons Attribution Noncommercial Nonderivatives (CC BY-NC-ND)"}
    gnu_gpl_v1  = {"label": "GNU General Public License v1"}
    gnu_gpl_v2  = {"label": "GNU General Public License v2"}
    gnu_gpl_v3  = {"label": "GNU General Public License v3"}
    mit         = {"label": "MIT"}
    # fmt: on

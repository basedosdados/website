from typing_extensions import Annotated
from typing import Optional, List, Union, Literal

from pydantic import Field, StrictStr as Str, BaseModel

# -------------------------------------
# MODULE OPTIONS
# -------------------------------------
from .observation_level import ObservationLevelEnum
from .spatial_coverage import SpatialCoverageEnum
from .time_unit import TimeUnitEnum
from .availability import AvailabilityEnum
from .status import StatusEnum
from .language import LanguageEnum
from .yes_no import YesNoEnum
from .country import CountryEnum
from .license import LicenseEnum
from .bigquery_type import BigQueryTypeEnum
from .measurement_unit import MeasurementUnitEnum
from .temporal_coverage import TemporalCoverageEnum

# -------------------------------------
# NEW OPTIONS
# -------------------------------------

IdType = Annotated[Optional[Str], Field()]  # TODO: would be nice to require on show/update but not on create


from pydantic import ValidationError
import pydantic


class BaseModel(pydantic.BaseModel):
    class Config:
        extra = "forbid"


from . import package, resource

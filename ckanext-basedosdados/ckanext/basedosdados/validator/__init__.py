from pydantic import ValidationError
import pydantic

class BaseModel(pydantic.BaseModel):
    class Config:
        extra = 'allow'

from . import package, resource

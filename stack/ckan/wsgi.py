### Filter warnings
import warnings

with warnings.catch_warnings():
    warnings.filterwarnings("ignore", category=UserWarning)
    from cryptography import x509
### End warning filter

from logging.config import fileConfig as loggingFileConfig
from os import environ

from ckan.cli import CKANConfigLoader
from ckan.config.middleware import make_app

config_filepath = environ["CKAN_INI"]
# abspath = os.path.join(os.path.dirname(os.path.abspath(__file__)))
# loggingFileConfig(config_filepath)
config = CKANConfigLoader(config_filepath).get_config()

application = make_app(config)
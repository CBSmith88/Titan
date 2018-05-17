class _Config(object):
    APPINSIGHTS_INSTRUMENTATIONKEY = None
    DATALAKE_ACQUIRE_TIMEOUT_SECONDS = None
    DATALAKE_AZURE_APPLICATION_ID = None
    DATALAKE_AZURE_APPLICATION_KEY = None
    DATALAKE_AZURE_BLOB_KEY = None
    DATALAKE_AZURE_BLOB_LOCATION = None
    DATALAKE_AZURE_CONTAINER_CPU_COUNT = 1
    DATALAKE_AZURE_CONTAINER_IMAGE_NAME = "wavemaker-datalake"
    DATALAKE_AZURE_CONTAINER_LOCATION = "westeurope"
    DATALAKE_AZURE_CONTAINER_NAME = "wavemaker-datalake"
    DATALAKE_AZURE_CONTAINER_OS_TYPE = 'Linux'
    DATALAKE_AZURE_CONTAINER_RAM_GB = 2
    DATALAKE_AZURE_RESOURCE_GROUP_NAME = "WEU-RSGP-WMDATAUK-DEV-01"
    DATALAKE_AZURE_SUBSCRIPTION_ID = None
    DATALAKE_AZURE_TENANT_ID = None
    DATALAKE_EXTRACT_TIMEOUT_SECONDS = None
    DEBUG = None
    SQLALCHEMY_DATABASE_URI = None
    SQLALCHEMY_TRACK_MODIFICATIONS = None


class DevelopmentConfig(_Config):
    DATALAKE_ACQUIRE_TIMEOUT = 600
    DATALAKE_EXTRACT_TIMEOUT = 600
    DEBUG = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True


class TestConfig(_Config):
    DATALAKE_ACQUIRE_TIMEOUT = 600
    DATALAKE_EXTRACT_TIMEOUT = 600
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = True


class ProductionConfig(_Config):
    DATALAKE_ACQUIRE_TIMEOUT = 3600
    DATALAKE_EXTRACT_TIMEOUT = 3600
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False


CONFIGURATIONS = {
    None: _Config,
    "dev": DevelopmentConfig,
    "test": TestConfig,
    "prod": ProductionConfig
}

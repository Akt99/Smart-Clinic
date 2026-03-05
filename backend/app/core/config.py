from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Smart Multi-Speciality Clinic Management"
    env: str = "development"
    api_prefix: str = "/api/v1"
    secret_key: str = "change-me"
    access_token_expire_minutes: int = 120
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/clinic_db"

    openai_api_key: str = "mock-key"

    otp_expiry_minutes: int = 5
    chat_rate_limit_per_minute: int = 20


settings = Settings()

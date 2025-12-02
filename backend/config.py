"""Application configuration for OmniShelf AI backend."""
from __future__ import annotations

import os
from functools import lru_cache
from typing import Any

from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


class Settings(BaseModel):
    database_url: str = os.getenv(
        "DATABASE_URL",
        # Default to local Postgres instance; override via .env or environment
        "postgresql://sukritisehgal@localhost:5434/omnishelf",
    )
    api_prefix: str = "/"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

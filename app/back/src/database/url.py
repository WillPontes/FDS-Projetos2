def normalize_async_database_url(url: str) -> str:
    """Garante dialecto asyncpg (ex.: URLs do Render vêm como postgresql://)."""
    if "+asyncpg" in url:
        return url
    if url.startswith("postgres://"):
        return "postgresql+asyncpg://" + url.removeprefix("postgres://")
    if url.startswith("postgresql://"):
        return "postgresql+asyncpg://" + url.removeprefix("postgresql://")
    return url

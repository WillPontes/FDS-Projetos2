from sqlalchemy.ext.asyncio import AsyncSession

from src.repositories.technical_specs_repository import TechnicalSpecsRepository


async def compute_paper_saved_meters(
    db: AsyncSession,
    *,
    digital_transaction_count: int,
) -> float:
    specs_list = await TechnicalSpecsRepository(db).get_all()
    specs = specs_list[0] if specs_list else None
    meters_per_ticket = specs.paper_co2_per_ticket if specs else 0.005
    return round(digital_transaction_count * meters_per_ticket, 4)

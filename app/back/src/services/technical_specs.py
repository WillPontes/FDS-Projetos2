from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from src.engine.exceptions import CalcEngineError
from src.providers.official_source_provider import OfficialSourceProvider
from src.repositories.fuel_prices_repository import FuelPricesRepository
from src.repositories.technical_specs_repository import TechnicalSpecsRepository


def _build_provider(db: AsyncSession) -> OfficialSourceProvider:
    return OfficialSourceProvider(
        technical_specs_repository=TechnicalSpecsRepository(db),
        fuel_prices_repository=FuelPricesRepository(db),
    )


async def get_technical_specs_bundle(db: AsyncSession) -> dict[str, Any]:
    provider = _build_provider(db)
    specs = await provider.get_technical_specs_bundle()

    if specs is None:
        raise CalcEngineError("Technical specs não encontradas.")

    return specs.model_dump(mode="json")


async def get_all_specs(db: AsyncSession) -> dict[str, Any]:
    provider = _build_provider(db)
    return await provider.get_specs_for_calc_engine()

async def post_technical_specs_update(db: AsyncSession, payload: TechnicalSpecsUpdate  ):
    try:
        repo = TechnicalSpecsRepository(db)
        new_data = payload.model_dump(exclude_unset=True)
        update_specs = await repo.upsert_by_id(id =1, data=new_data)
        
        provider = _build_provider(db)
        
        bundle_atual = await provider.get_technical_specs_bundle()
        fuel_prices = bundle_atual.fuel_prices_by_uf
        
        engine_dict = technical_specs_to_engine_dict(
            row = update_specs,
            fuel_prices_by_uf = fuel_prices
        ) 
        
        validate_engine_specs(engine_dict)
        await db.commit()
        return technical_specs_row_to_dto(update_specs)
    except CalcEngineError as e:
        await db.rollback()
        
        raise HTTPException(status_code=400, detail=f"Validação falhou: {str(e)}")
        
    except Exception as e:
        await db.rollback()
        
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

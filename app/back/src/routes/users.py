from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.models.user import UserPublic
from src.services.users import list_users

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=list[UserPublic])
async def get_users(db: AsyncSession = Depends(get_db)) -> list[UserPublic]:
    rows = await list_users(db)
    return [UserPublic.model_validate(row) for row in rows]
'''
veiculos.get_by_plate


if (pla ja existe)
'''    


'''
    rota = recebe dados e passa pro service
    service = aplica regra de negocio/logica usando python e chamando metodos do banco (repositorio)
    repositorio = interface com o banco, aplica as funcoes de consulta no banco

    '''
from fastapi import APIRouter

from src.routes.health import router as health_router
from src.routes.users import router as users_router
from src.routes.veiculos import router as veiculos_router

router = APIRouter()
router.include_router(health_router)
router.include_router(users_router)
router.include_router(veiculos_router)

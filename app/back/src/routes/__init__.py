from fastapi import APIRouter

from src.routes.health import router as health_router
from src.routes.users import router as users_router
from src.routes.technical_specs import router as technical_specs_router
from src.routes.fuel_prices import router as fuel_prices_router
from src.routes.transactions import router as transactions_router

router = APIRouter()
router.include_router(health_router)
router.include_router(users_router)
router.include_router(technical_specs_router)
router.include_router(fuel_prices_router)
router.include_router(transactions_router)
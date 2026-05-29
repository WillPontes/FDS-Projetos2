from fastapi import APIRouter

from src.routes.health import router as health_router
from src.routes.user import router as user_router
from src.routes.vehicles import router as vehicles_router
from src.routes.technical_specs import router as technical_specs_router
from src.routes.fuel_prices import router as fuel_prices_router
from src.routes.organization import router as organization_router
from src.routes.transactions import router as transactions_router
from src.routes.user_stats import router as user_stats_router
from src.routes.notifications import router as notifications_router

router = APIRouter()
router.include_router(health_router)
router.include_router(user_router)
router.include_router(vehicles_router)
router.include_router(technical_specs_router)
router.include_router(fuel_prices_router)
router.include_router(organization_router)
router.include_router(transactions_router)
router.include_router(user_stats_router)
router.include_router(notifications_router)


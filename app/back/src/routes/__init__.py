from fastapi import APIRouter

from src.routes.fleet import router as fleet_router
from src.routes.dashboard import router as dashboard_router
from src.routes.fuel_prices import router as fuel_prices_router
from src.routes.goals import router as goals_router
from src.routes.health import router as health_router
from src.routes.notifications import router as notifications_router
from src.routes.reports import router as reports_router
from src.routes.sustainability import router as sustainability_router
from src.routes.organization import router as organization_router
from src.routes.technical_specs import router as technical_specs_router
from src.routes.transactions import router as transactions_router
from src.routes.user import router as user_router
from src.routes.user_stats import router as user_stats_router
from src.routes.vehicles import router as vehicles_router

router = APIRouter()

router.include_router(health_router)
router.include_router(dashboard_router)
router.include_router(user_router)
router.include_router(vehicles_router)
router.include_router(technical_specs_router)
router.include_router(fuel_prices_router)
router.include_router(organization_router)
router.include_router(fleet_router)
router.include_router(transactions_router)
router.include_router(user_stats_router)
router.include_router(goals_router)
router.include_router(notifications_router)
router.include_router(sustainability_router)
router.include_router(reports_router)

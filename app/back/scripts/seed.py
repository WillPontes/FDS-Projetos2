"""
Script de seed para popular o banco com dados realistas de desenvolvimento.

Uso:
    cd app/back
    uv run python scripts/seed.py           # insere dados
    uv run python scripts/seed.py --reset   # limpa e reinsere
"""

from __future__ import annotations

import argparse
import asyncio
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

_BACK_ROOT = Path(__file__).resolve().parents[1]
if str(_BACK_ROOT) not in sys.path:
    sys.path.insert(0, str(_BACK_ROOT))

from dotenv import load_dotenv  # noqa: E402

load_dotenv(_BACK_ROOT / ".env")

from sqlalchemy import text  # noqa: E402
from sqlmodel import select  # noqa: E402

from src.database.connection import AsyncSessionLocal  # noqa: E402
from src.models.fuel_prices import FuelPriceByUF  # noqa: E402
from src.models.fleet import Fleet, FleetUser
from src.models.organization import Organization  # noqa: E402
from src.models.technical_specs import default_ludic_metaphor_units  # noqa: E402
from src.models.transaction import Transaction  # noqa: E402
from src.models.user import User, UserRole  # noqa: E402
from src.models.user_stats import UserStats  # noqa: E402
from src.models.vehicle import Vehicle  # noqa: E402
from src.models.weekly_goal import WeeklyGoal  # noqa: E402
from src.dto.fuel_price import (  # noqa: E402
    FUEL_PRICES_META_AGGREGATION,
    FUEL_PRICES_META_SOURCE,
    fuel_price_row_to_dto,
)
from src.engine import CalcEngine, TransactionOrchestrator  # noqa: E402
from src.repositories.fuel_prices_repository import FuelPricesRepository  # noqa: E402
from src.repositories.technical_specs_repository import TechnicalSpecsRepository  # noqa: E402
from src.services.password import hash_password  # noqa: E402
from src.services.technical_specs import get_all_specs  # noqa: E402

SEED_DEFAULT_PASSWORD = "taggy123"


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def get_week_start() -> date:
    today = date.today()
    return today - timedelta(days=today.weekday())


# ---------------------------------------------------------------------------
# Reset
# ---------------------------------------------------------------------------

async def reset_all(db):
    for table in [
        "weekly_goals",
        "user_stats",
        "transactions",
        "fleet_users",
        "vehicles",
        "fleets",
        "users",
        "organizations",
        "fuel_prices_by_uf",
        "technical_specs",
    ]:
        await db.execute(text(f"TRUNCATE TABLE {table} RESTART IDENTITY CASCADE"))
    print("✓ Banco resetado")


# ---------------------------------------------------------------------------
# Seeds individuais
# ---------------------------------------------------------------------------

_TECHNICAL_SPECS_VALUES = {
    "emission_factor_diesel_s10": 2.51,
    "emission_factor_gasolina_c": 2.15,
    "emission_factor_etanol": 0.44,
    "idle_rate_leve": 0.00027,
    "idle_rate_pesado": 0.00069,
    "paper_co2_per_ticket": 0.012,
    "paper_water_per_ticket": 0.5,
    "ludic_tree_year_absorption": 15.0,
    "ludic_phone_charge_factor": 120.0,
    "ludic_coffee_factor": 10.0,
    "ludic_metaphor_units": default_ludic_metaphor_units(),
    "baseline_pedagio_avg_wait_sec": 300,
    "baseline_estacionamento_avg_wait_sec": 180,
    "maint_cost_leve": 0.05,
    "maint_cost_pesado": 0.25,
    "accel_surge_leve": 0.015,
    "accel_surge_pesado": 0.080,
    "benchmark_kg_co2_per_km_car": 0.12,
    "benchmark_kg_co2_per_burger": 2.5,
}


async def seed_technical_specs(db) -> None:
    repo = TechnicalSpecsRepository(db)
    await repo.upsert_by_id(1, _TECHNICAL_SPECS_VALUES)
    await db.flush()
    print("  technical_specs: upsert id=1")


async def seed_fuel_prices(db) -> None:
    rows = [
        FuelPriceByUF(uf="SP", price_diesel_s10=6.49, price_gasolina_c=5.89, price_etanol=3.79),
        FuelPriceByUF(uf="RJ", price_diesel_s10=6.72, price_gasolina_c=6.15, price_etanol=3.95),
        FuelPriceByUF(uf="MG", price_diesel_s10=6.38, price_gasolina_c=5.75, price_etanol=3.65),
        FuelPriceByUF(uf="RS", price_diesel_s10=6.29, price_gasolina_c=5.68, price_etanol=3.55),
        FuelPriceByUF(uf="BA", price_diesel_s10=6.55, price_gasolina_c=5.92, price_etanol=3.82),
        FuelPriceByUF(uf="PR", price_diesel_s10=6.31, price_gasolina_c=5.71, price_etanol=3.61),
    ]
    for row in rows:
        existing = (await db.execute(select(FuelPriceByUF).where(FuelPriceByUF.uf == row.uf))).first()
        if not existing:
            db.add(row)
    await db.flush()
    print(f"  fuel_prices: {len(rows)} UFs")


async def seed_organizations(db) -> list[Organization]:
    orgs_data = [
        Organization(name="Logística ABC Ltda", cnpj="12.345.678/0001-90"),
        Organization(name="Frota Express XYZ", cnpj="98.765.432/0001-10"),
    ]
    orgs = []
    for org in orgs_data:
        existing = (await db.execute(select(Organization).where(Organization.cnpj == org.cnpj))).first()
        if existing:
            orgs.append(existing[0])
        else:
            db.add(org)
            await db.flush()
            orgs.append(org)
    print(f"  organizations: {[o.id for o in orgs]}")
    return orgs


async def seed_users(db, orgs: list[Organization]) -> list[User]:
    password_hash = hash_password(SEED_DEFAULT_PASSWORD)
    users_data = [
        User(name="Admin Sistema", email="admin@taggy.com.br", password_hash=password_hash, role=UserRole.admin, organization_id=None),
        User(name="Carlos Gestor", email="carlos@logisticaabc.com.br", password_hash=password_hash, role=UserRole.gestor_frota, organization_id=orgs[0].id),
        User(name="Fernanda Gestora", email="fernanda@frotaexpress.com.br", password_hash=password_hash, role=UserRole.gestor_frota, organization_id=orgs[1].id),
        User(name="João Motorista", email="joao@logisticaabc.com.br", password_hash=password_hash, role=UserRole.motorista, organization_id=orgs[0].id),
        User(name="Ana Motorista", email="ana@frotaexpress.com.br", password_hash=password_hash, role=UserRole.motorista, organization_id=orgs[1].id),
        User(name="Pedro Motorista", email="pedro.comum@taggy.com.br", password_hash=password_hash, role=UserRole.motorista, organization_id=None),
    ]
    users = []
    for u in users_data:
        existing = (await db.execute(select(User).where(User.email == u.email))).first()
        if existing:
            row = existing[0]
            row.password_hash = password_hash
            users.append(row)
        else:
            db.add(u)
            await db.flush()
            users.append(u)
    print(f"  users: {[u.id for u in users]}")
    return users


async def seed_fleets(db, orgs: list[Organization]) -> list[Fleet]:
    fleets_data = [
        Fleet(name="Frota Principal ABC", organization_id=orgs[0].id),
        Fleet(name="Frota Secundária ABC", organization_id=orgs[0].id),
        Fleet(name="Frota Express Norte", organization_id=orgs[1].id),
    ]
    fleets = []
    for f in fleets_data:
        existing = (
            await db.execute(
                select(Fleet).where(
                    Fleet.name == f.name,
                    Fleet.organization_id == f.organization_id,
                )
            )
        ).first()
        if existing:
            fleets.append(existing[0])
        else:
            db.add(f)
            await db.flush()
            fleets.append(f)
    print(f"  fleets: {[f.id for f in fleets]}")
    return fleets


async def seed_vehicles(
    db, users: list[User], orgs: list[Organization], fleets: list[Fleet]
) -> list[Vehicle]:
    pedro = next(u for u in users if u.email == "pedro.comum@taggy.com.br")
    vehicles_data = [
        Vehicle(
            id_tag="TAG-001-ABC",
            user_id=users[1].id,
            organization_id=orgs[0].id,
            fleet_id=fleets[0].id,
            assigned_driver_id=users[3].id,
            license_plate="ABC-1234",
            model="Volkswagen Delivery 9.170",
            fuel_type="diesel_s10",
            category="pesado",
        ),
        Vehicle(
            id_tag="TAG-002-DEF",
            user_id=users[1].id,
            organization_id=orgs[0].id,
            fleet_id=fleets[0].id,
            assigned_driver_id=None,
            license_plate="DEF-5678",
            model="Mercedes-Benz Atego 1719",
            fuel_type="diesel_s10",
            category="pesado",
        ),
        Vehicle(
            id_tag="TAG-003-GHI",
            user_id=users[2].id,
            organization_id=orgs[1].id,
            fleet_id=fleets[2].id,
            assigned_driver_id=users[4].id,
            license_plate="GHI-9012",
            model="Fiat Cronos 1.3",
            fuel_type="gasolina_c",
            category="leve",
        ),
        Vehicle(
            id_tag="TAG-005-MNO",
            user_id=pedro.id,
            organization_id=None,
            fleet_id=None,
            assigned_driver_id=pedro.id,
            license_plate="MNO-7890",
            model="Honda Civic Flex",
            fuel_type="etanol",
            category="leve",
        ),
        Vehicle(
            id_tag="TAG-006-PQR",
            user_id=pedro.id,
            organization_id=None,
            fleet_id=None,
            assigned_driver_id=pedro.id,
            license_plate="PQR-1122",
            model="Hyundai HB20",
            fuel_type="gasolina_c",
            category="leve",
        ),
    ]
    vehicles = []
    for v in vehicles_data:
        existing = (await db.execute(select(Vehicle).where(Vehicle.id_tag == v.id_tag))).first()
        if existing:
            vehicles.append(existing[0])
        else:
            db.add(v)
            await db.flush()
            vehicles.append(v)
    print(f"  vehicles: {[v.id for v in vehicles]}")
    return vehicles


def _engine_specs_for_calc(specs: dict) -> dict:
    """Garante fuel_prices_meta exigido pela CalcEngine (ausente no dict cru do provider)."""
    out = dict(specs)
    out.setdefault(
        "fuel_prices_meta",
        {
            "source": FUEL_PRICES_META_SOURCE,
            "aggregation": FUEL_PRICES_META_AGGREGATION,
            "as_of": utc_now().isoformat(),
        },
    )
    return out


def _metrics_from_calc_result(result: dict) -> dict:
    env = result.get("environmental") or {}
    meta = result.get("metadata") or {}
    fin = result.get("financial") or {}
    return {
        "co2_avoided_kg": env.get("co2_kg"),
        "fuel_saved_liters": env.get("fuel_liters"),
        "water_saved_liters": env.get("water_liters"),
        "time_saved_sec": meta.get("time_saved_sec"),
        "financial_savings_brl": fin.get("total_savings_brl"),
    }


def _build_parameters_snapshot(
    *,
    plate: str,
    elapsed_time_sec: float,
    context: str,
    uf: str,
    is_digital: bool,
    vehicle: Vehicle,
    specs: dict,
    fuel_prices_all: dict,
) -> dict:
    payload_dict = {
        "plate": plate.strip().upper(),
        "elapsed_time": int(elapsed_time_sec),
        "context": context,
        "uf_passagem": uf.strip().upper(),
        "is_digital": is_digital,
        "vehicle": {
            "category": vehicle.category,
            "fuel_type": vehicle.fuel_type,
            "model": vehicle.model,
        },
    }
    engine_specs = _engine_specs_for_calc(specs)
    result = TransactionOrchestrator(CalcEngine(engine_specs)).handle_tag_event(payload_dict)
    return {
        "payload": payload_dict,
        "emission_factors": specs.get("emission_factors"),
        "pricing_snapshot": {
            "fuel_prices": fuel_prices_all,
            "fuel_prices_by_uf": specs.get("fuel_prices_by_uf"),
            "fuel_prices_meta": engine_specs.get("fuel_prices_meta"),
        },
        "result": result,
    }


async def seed_fleet_users(db, users: list[User], fleets: list[Fleet]) -> None:
    links = [
        (fleets[0].id, users[1].id),
        (fleets[0].id, users[3].id),
        (fleets[2].id, users[2].id),
        (fleets[2].id, users[4].id),
    ]
    for fleet_id, user_id in links:
        existing = (
            await db.execute(
                select(FleetUser).where(
                    FleetUser.fleet_id == fleet_id,
                    FleetUser.user_id == user_id,
                )
            )
        ).first()
        if not existing:
            db.add(FleetUser(fleet_id=fleet_id, user_id=user_id))
    await db.flush()
    print(f"  fleet_users: {len(links)} links")


async def seed_transactions(db, users: list[User], vehicles: list[Vehicle], orgs: list[Organization]) -> None:
    existing_count = (await db.execute(select(Transaction))).all()
    if len(existing_count) >= 20:
        print("  transactions: já existem, pulando")
        return

    specs = await get_all_specs(db)
    fuel_rows = await FuelPricesRepository(db).get_all()
    fuel_prices_all = {
        row.uf: fuel_price_row_to_dto(row).model_dump(mode="json") for row in fuel_rows
    }
    vehicle_by_id = {v.id: v for v in vehicles}

    base_date = utc_now() - timedelta(days=30)

    records = [
        # João motorista — ABC-1234
        dict(user_id=users[3].id, vehicle_id=vehicles[0].id, organization_id=orgs[0].id, plate="ABC-1234",
             context="pedagio", uf="SP", elapsed_time_sec=145.0, is_digital=True,
             created_at=base_date + timedelta(days=0, hours=7, minutes=15)),
        dict(user_id=users[3].id, vehicle_id=vehicles[0].id, organization_id=orgs[0].id, plate="ABC-1234",
             context="pedagio", uf="SP", elapsed_time_sec=162.0, is_digital=True,
             created_at=base_date + timedelta(days=1, hours=8, minutes=30)),
        dict(user_id=users[3].id, vehicle_id=vehicles[0].id, organization_id=orgs[0].id, plate="ABC-1234",
             context="estacionamento", uf="SP", elapsed_time_sec=285.0, is_digital=True,
             created_at=base_date + timedelta(days=2, hours=9, minutes=0)),
        dict(user_id=users[3].id, vehicle_id=vehicles[0].id, organization_id=orgs[0].id, plate="ABC-1234",
             context="pedagio", uf="MG", elapsed_time_sec=130.0, is_digital=True,
             created_at=base_date + timedelta(days=4, hours=6, minutes=45)),
        dict(user_id=users[3].id, vehicle_id=vehicles[0].id, organization_id=orgs[0].id, plate="ABC-1234",
             context="pedagio", uf="MG", elapsed_time_sec=155.0, is_digital=True,
             created_at=base_date + timedelta(days=5, hours=7, minutes=20)),
        # Veículo DEF-5678
        dict(user_id=users[1].id, vehicle_id=vehicles[1].id, organization_id=orgs[0].id, plate="DEF-5678",
             context="pedagio", uf="SP", elapsed_time_sec=170.0, is_digital=True,
             created_at=base_date + timedelta(days=3, hours=10, minutes=0)),
        dict(user_id=users[1].id, vehicle_id=vehicles[1].id, organization_id=orgs[0].id, plate="DEF-5678",
             context="estacionamento", uf="RS", elapsed_time_sec=310.0, is_digital=True,
             created_at=base_date + timedelta(days=6, hours=11, minutes=15)),
        dict(user_id=users[1].id, vehicle_id=vehicles[1].id, organization_id=orgs[0].id, plate="DEF-5678",
             context="pedagio", uf="RS", elapsed_time_sec=140.0, is_digital=True,
             created_at=base_date + timedelta(days=8, hours=7, minutes=0)),
        # Ana motorista — GHI-9012
        dict(user_id=users[4].id, vehicle_id=vehicles[2].id, organization_id=orgs[1].id, plate="GHI-9012",
             context="pedagio", uf="RJ", elapsed_time_sec=125.0, is_digital=True,
             created_at=base_date + timedelta(days=0, hours=8, minutes=0)),
        dict(user_id=users[4].id, vehicle_id=vehicles[2].id, organization_id=orgs[1].id, plate="GHI-9012",
             context="estacionamento", uf="RJ", elapsed_time_sec=260.0, is_digital=True,
             created_at=base_date + timedelta(days=1, hours=12, minutes=30)),
        dict(user_id=users[4].id, vehicle_id=vehicles[2].id, organization_id=orgs[1].id, plate="GHI-9012",
             context="pedagio", uf="RJ", elapsed_time_sec=138.0, is_digital=True,
             created_at=base_date + timedelta(days=3, hours=9, minutes=15)),
        dict(user_id=users[4].id, vehicle_id=vehicles[2].id, organization_id=orgs[1].id, plate="GHI-9012",
             context="pedagio", uf="BA", elapsed_time_sec=148.0, is_digital=True,
             created_at=base_date + timedelta(days=5, hours=8, minutes=45)),
        dict(user_id=users[4].id, vehicle_id=vehicles[2].id, organization_id=orgs[1].id, plate="GHI-9012",
             context="estacionamento", uf="BA", elapsed_time_sec=290.0, is_digital=True,
             created_at=base_date + timedelta(days=7, hours=10, minutes=0)),
        # Admin — veículo pessoal MNO-7890 (etanol)
        dict(user_id=users[0].id, vehicle_id=vehicles[3].id, organization_id=None, plate="MNO-7890",
             context="pedagio", uf="SP", elapsed_time_sec=120.0, is_digital=True,
             created_at=base_date + timedelta(days=2, hours=7, minutes=30)),
        dict(user_id=users[0].id, vehicle_id=vehicles[3].id, organization_id=None, plate="MNO-7890",
             context="pedagio", uf="SP", elapsed_time_sec=135.0, is_digital=True,
             created_at=base_date + timedelta(days=9, hours=8, minutes=0)),
        # Semana atual — João
        dict(user_id=users[3].id, vehicle_id=vehicles[0].id, organization_id=orgs[0].id, plate="ABC-1234",
             context="pedagio", uf="SP", elapsed_time_sec=150.0, is_digital=True,
             created_at=utc_now() - timedelta(days=1, hours=7)),
        dict(user_id=users[3].id, vehicle_id=vehicles[0].id, organization_id=orgs[0].id, plate="ABC-1234",
             context="estacionamento", uf="SP", elapsed_time_sec=275.0, is_digital=True,
             created_at=utc_now() - timedelta(hours=5)),
        # Recentes — Ana
        dict(user_id=users[4].id, vehicle_id=vehicles[2].id, organization_id=orgs[1].id, plate="GHI-9012",
             context="pedagio", uf="RJ", elapsed_time_sec=130.0, is_digital=True,
             created_at=utc_now() - timedelta(days=2, hours=8)),
        dict(user_id=users[4].id, vehicle_id=vehicles[2].id, organization_id=orgs[1].id, plate="GHI-9012",
             context="pedagio", uf="RJ", elapsed_time_sec=142.0, is_digital=True,
             created_at=utc_now() - timedelta(hours=3)),
        # Carlos gestor — DEF-5678
        dict(user_id=users[1].id, vehicle_id=vehicles[1].id, organization_id=orgs[0].id, plate="DEF-5678",
             context="pedagio", uf="PR", elapsed_time_sec=155.0, is_digital=True,
             created_at=utc_now() - timedelta(days=1, hours=6)),
    ]

    for r in records:
        vehicle = vehicle_by_id[r["vehicle_id"]]
        snapshot = _build_parameters_snapshot(
            plate=r["plate"],
            elapsed_time_sec=r["elapsed_time_sec"],
            context=r["context"],
            uf=r["uf"],
            is_digital=r["is_digital"],
            vehicle=vehicle,
            specs=specs,
            fuel_prices_all=fuel_prices_all,
        )
        t = Transaction(
            parameters_snapshot=snapshot,
            **_metrics_from_calc_result(snapshot["result"]),
            **r,
        )
        db.add(t)

    await db.flush()
    print(f"  transactions: {len(records)} registros")


async def seed_user_stats(db, users: list[User]) -> None:
    # Acumular a partir das transações existentes
    for user in users:
        existing = (await db.execute(select(UserStats).where(UserStats.user_id == user.id))).first()
        if existing:
            continue

        txs = (await db.execute(
            select(Transaction).where(Transaction.user_id == user.id)
        )).scalars().all()

        stats = UserStats(
            user_id=user.id,
            total_time_saved_sec=sum((t.time_saved_sec or 0) for t in txs),
            co2_total_kg=sum((t.co2_avoided_kg or 0) for t in txs),
            fuel_total_liters=sum((t.fuel_saved_liters or 0) for t in txs),
            water_total_liters=sum((t.water_saved_liters or 0) for t in txs),
            financial_total_brl=sum((t.financial_savings_brl or 0) for t in txs),
            transactions_count=len(txs),
        )
        db.add(stats)

    await db.flush()
    print(f"  user_stats: {len(users)} usuários")


async def seed_weekly_goals(db, users: list[User]) -> None:
    week_start = get_week_start()

    goals_data = [
        # admin
        dict(user_id=users[0].id, week_start_date=week_start, target_transactions=5, current_transactions=1,
             target_co2_kg=1.0, current_co2_kg=0.19, is_completed=False),
        # Carlos gestor
        dict(user_id=users[1].id, week_start_date=week_start, target_transactions=10, current_transactions=1,
             target_co2_kg=3.0, current_co2_kg=0.57, is_completed=False),
        # Fernanda gestora
        dict(user_id=users[2].id, week_start_date=week_start, target_transactions=8, current_transactions=0,
             target_co2_kg=2.0, current_co2_kg=0.0, is_completed=False),
        # João motorista
        dict(user_id=users[3].id, week_start_date=week_start, target_transactions=15, current_transactions=2,
             target_co2_kg=4.0, current_co2_kg=0.62, is_completed=False),
        # Ana motorista
        dict(user_id=users[4].id, week_start_date=week_start, target_transactions=12, current_transactions=2,
             target_co2_kg=3.0, current_co2_kg=0.30, is_completed=False),
    ]

    for g in goals_data:
        existing = (await db.execute(
            select(WeeklyGoal).where(
                WeeklyGoal.user_id == g["user_id"],
                WeeklyGoal.week_start_date == week_start,
            )
        )).first()
        if not existing:
            db.add(WeeklyGoal(**g))

    await db.flush()
    print(f"  weekly_goals: {len(goals_data)} metas")


# ---------------------------------------------------------------------------
# Orquestrador
# ---------------------------------------------------------------------------

async def seed_all(reset: bool = False):
    async with AsyncSessionLocal() as db:
        async with db.begin():
            if reset:
                await reset_all(db)

            print("Seedando banco...")
            await seed_technical_specs(db)
            await seed_fuel_prices(db)
            orgs = await seed_organizations(db)
            users = await seed_users(db, orgs)
            fleets = await seed_fleets(db, orgs)
            vehicles = await seed_vehicles(db, users, orgs, fleets)
            await seed_fleet_users(db, users, fleets)
            await seed_transactions(db, users, vehicles, orgs)
            await seed_user_stats(db, users)
            await seed_weekly_goals(db, users)
            print("✓ Seed concluído")


async def _main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--reset", action="store_true", help="Limpa dados antes de inserir")
    args = parser.parse_args()
    await seed_all(reset=args.reset)


if __name__ == "__main__":
    asyncio.run(_main())

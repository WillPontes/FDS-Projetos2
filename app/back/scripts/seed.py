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
from src.repositories.technical_specs_repository import TechnicalSpecsRepository  # noqa: E402


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
    users_data = [
        User(name="Admin Sistema", email="admin@taggy.com.br", role=UserRole.admin, organization_id=None),
        User(name="Carlos Gestor", email="carlos@logisticaabc.com.br", role=UserRole.gestor_frota, organization_id=orgs[0].id),
        User(name="Fernanda Gestora", email="fernanda@frotaexpress.com.br", role=UserRole.gestor_frota, organization_id=orgs[1].id),
        User(name="João Motorista", email="joao@logisticaabc.com.br", role=UserRole.motorista, organization_id=orgs[0].id),
        User(name="Ana Motorista", email="ana@frotaexpress.com.br", role=UserRole.motorista, organization_id=orgs[1].id),
        User(name="Pedro Motorista", email="pedro.comum@taggy.com.br", role=UserRole.motorista, organization_id=None),
    ]
    users = []
    for u in users_data:
        existing = (await db.execute(select(User).where(User.email == u.email))).first()
        if existing:
            users.append(existing[0])
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

    base_date = utc_now() - timedelta(days=30)

    records = [
        # João motorista — ABC-1234 — pedagio SP
        dict(user_id=users[3].id, vehicle_id=vehicles[0].id, organization_id=orgs[0].id, plate="ABC-1234",
             context="pedagio", uf="SP", elapsed_time_sec=145.0, is_digital=True,
             co2_avoided_kg=0.212, fuel_saved_liters=0.082, time_saved_sec=35.0, financial_savings_brl=0.53, water_saved_liters=0.82,
             created_at=base_date + timedelta(days=0, hours=7, minutes=15)),
        dict(user_id=users[3].id, vehicle_id=vehicles[0].id, organization_id=orgs[0].id, plate="ABC-1234",
             context="pedagio", uf="SP", elapsed_time_sec=162.0, is_digital=True,
             co2_avoided_kg=0.235, fuel_saved_liters=0.091, time_saved_sec=18.0, financial_savings_brl=0.59, water_saved_liters=0.91,
             created_at=base_date + timedelta(days=1, hours=8, minutes=30)),
        dict(user_id=users[3].id, vehicle_id=vehicles[0].id, organization_id=orgs[0].id, plate="ABC-1234",
             context="estacionamento", uf="SP", elapsed_time_sec=285.0, is_digital=True,
             co2_avoided_kg=0.415, fuel_saved_liters=0.160, time_saved_sec=15.0, financial_savings_brl=1.04, water_saved_liters=1.60,
             created_at=base_date + timedelta(days=2, hours=9, minutes=0)),
        dict(user_id=users[3].id, vehicle_id=vehicles[0].id, organization_id=orgs[0].id, plate="ABC-1234",
             context="pedagio", uf="MG", elapsed_time_sec=130.0, is_digital=True,
             co2_avoided_kg=0.190, fuel_saved_liters=0.073, time_saved_sec=50.0, financial_savings_brl=0.47, water_saved_liters=0.73,
             created_at=base_date + timedelta(days=4, hours=6, minutes=45)),
        dict(user_id=users[3].id, vehicle_id=vehicles[0].id, organization_id=orgs[0].id, plate="ABC-1234",
             context="pedagio", uf="MG", elapsed_time_sec=155.0, is_digital=True,
             co2_avoided_kg=0.226, fuel_saved_liters=0.087, time_saved_sec=25.0, financial_savings_brl=0.56, water_saved_liters=0.87,
             created_at=base_date + timedelta(days=5, hours=7, minutes=20)),
        # Veículo DEF-5678 sem driver
        dict(user_id=users[1].id, vehicle_id=vehicles[1].id, organization_id=orgs[0].id, plate="DEF-5678",
             context="pedagio", uf="SP", elapsed_time_sec=170.0, is_digital=True,
             co2_avoided_kg=0.620, fuel_saved_liters=0.238, time_saved_sec=10.0, financial_savings_brl=1.55, water_saved_liters=2.38,
             created_at=base_date + timedelta(days=3, hours=10, minutes=0)),
        dict(user_id=users[1].id, vehicle_id=vehicles[1].id, organization_id=orgs[0].id, plate="DEF-5678",
             context="estacionamento", uf="RS", elapsed_time_sec=310.0, is_digital=True,
             co2_avoided_kg=1.132, fuel_saved_liters=0.435, time_saved_sec=0.0, financial_savings_brl=2.83, water_saved_liters=4.35,
             created_at=base_date + timedelta(days=6, hours=11, minutes=15)),
        dict(user_id=users[1].id, vehicle_id=vehicles[1].id, organization_id=orgs[0].id, plate="DEF-5678",
             context="pedagio", uf="RS", elapsed_time_sec=140.0, is_digital=True,
             co2_avoided_kg=0.511, fuel_saved_liters=0.197, time_saved_sec=40.0, financial_savings_brl=1.28, water_saved_liters=1.97,
             created_at=base_date + timedelta(days=8, hours=7, minutes=0)),
        # Ana motorista — GHI-9012 — gasolina
        dict(user_id=users[4].id, vehicle_id=vehicles[2].id, organization_id=orgs[1].id, plate="GHI-9012",
             context="pedagio", uf="RJ", elapsed_time_sec=125.0, is_digital=True,
             co2_avoided_kg=0.138, fuel_saved_liters=0.062, time_saved_sec=55.0, financial_savings_brl=0.37, water_saved_liters=0.62,
             created_at=base_date + timedelta(days=0, hours=8, minutes=0)),
        dict(user_id=users[4].id, vehicle_id=vehicles[2].id, organization_id=orgs[1].id, plate="GHI-9012",
             context="estacionamento", uf="RJ", elapsed_time_sec=260.0, is_digital=True,
             co2_avoided_kg=0.288, fuel_saved_liters=0.130, time_saved_sec=40.0, financial_savings_brl=0.77, water_saved_liters=1.30,
             created_at=base_date + timedelta(days=1, hours=12, minutes=30)),
        dict(user_id=users[4].id, vehicle_id=vehicles[2].id, organization_id=orgs[1].id, plate="GHI-9012",
             context="pedagio", uf="RJ", elapsed_time_sec=138.0, is_digital=True,
             co2_avoided_kg=0.153, fuel_saved_liters=0.069, time_saved_sec=42.0, financial_savings_brl=0.41, water_saved_liters=0.69,
             created_at=base_date + timedelta(days=3, hours=9, minutes=15)),
        dict(user_id=users[4].id, vehicle_id=vehicles[2].id, organization_id=orgs[1].id, plate="GHI-9012",
             context="pedagio", uf="BA", elapsed_time_sec=148.0, is_digital=True,
             co2_avoided_kg=0.164, fuel_saved_liters=0.074, time_saved_sec=32.0, financial_savings_brl=0.44, water_saved_liters=0.74,
             created_at=base_date + timedelta(days=5, hours=8, minutes=45)),
        dict(user_id=users[4].id, vehicle_id=vehicles[2].id, organization_id=orgs[1].id, plate="GHI-9012",
             context="estacionamento", uf="BA", elapsed_time_sec=290.0, is_digital=True,
             co2_avoided_kg=0.322, fuel_saved_liters=0.145, time_saved_sec=10.0, financial_savings_brl=0.86, water_saved_liters=1.45,
             created_at=base_date + timedelta(days=7, hours=10, minutes=0)),
        # Admin — JKL-3456 — etanol
        dict(user_id=users[0].id, vehicle_id=vehicles[3].id, organization_id=None, plate="JKL-3456",
             context="pedagio", uf="SP", elapsed_time_sec=120.0, is_digital=True,
             co2_avoided_kg=0.088, fuel_saved_liters=0.060, time_saved_sec=60.0, financial_savings_brl=0.23, water_saved_liters=0.60,
             created_at=base_date + timedelta(days=2, hours=7, minutes=30)),
        dict(user_id=users[0].id, vehicle_id=vehicles[3].id, organization_id=None, plate="JKL-3456",
             context="pedagio", uf="SP", elapsed_time_sec=135.0, is_digital=True,
             co2_avoided_kg=0.099, fuel_saved_liters=0.068, time_saved_sec=45.0, financial_savings_brl=0.26, water_saved_liters=0.68,
             created_at=base_date + timedelta(days=9, hours=8, minutes=0)),
        # Transações recentes (semana atual) — João
        dict(user_id=users[3].id, vehicle_id=vehicles[0].id, organization_id=orgs[0].id, plate="ABC-1234",
             context="pedagio", uf="SP", elapsed_time_sec=150.0, is_digital=True,
             co2_avoided_kg=0.218, fuel_saved_liters=0.084, time_saved_sec=30.0, financial_savings_brl=0.55, water_saved_liters=0.84,
             created_at=utc_now() - timedelta(days=1, hours=7)),
        dict(user_id=users[3].id, vehicle_id=vehicles[0].id, organization_id=orgs[0].id, plate="ABC-1234",
             context="estacionamento", uf="SP", elapsed_time_sec=275.0, is_digital=True,
             co2_avoided_kg=0.400, fuel_saved_liters=0.154, time_saved_sec=25.0, financial_savings_brl=1.00, water_saved_liters=1.54,
             created_at=utc_now() - timedelta(hours=5)),
        # Recentes — Ana
        dict(user_id=users[4].id, vehicle_id=vehicles[2].id, organization_id=orgs[1].id, plate="GHI-9012",
             context="pedagio", uf="RJ", elapsed_time_sec=130.0, is_digital=True,
             co2_avoided_kg=0.144, fuel_saved_liters=0.065, time_saved_sec=50.0, financial_savings_brl=0.39, water_saved_liters=0.65,
             created_at=utc_now() - timedelta(days=2, hours=8)),
        dict(user_id=users[4].id, vehicle_id=vehicles[2].id, organization_id=orgs[1].id, plate="GHI-9012",
             context="pedagio", uf="RJ", elapsed_time_sec=142.0, is_digital=True,
             co2_avoided_kg=0.157, fuel_saved_liters=0.071, time_saved_sec=38.0, financial_savings_brl=0.42, water_saved_liters=0.71,
             created_at=utc_now() - timedelta(hours=3)),
        # Carlos gestor — usa o DEF
        dict(user_id=users[1].id, vehicle_id=vehicles[1].id, organization_id=orgs[0].id, plate="DEF-5678",
             context="pedagio", uf="PR", elapsed_time_sec=155.0, is_digital=True,
             co2_avoided_kg=0.565, fuel_saved_liters=0.217, time_saved_sec=25.0, financial_savings_brl=1.41, water_saved_liters=2.17,
             created_at=utc_now() - timedelta(days=1, hours=6)),
    ]

    for r in records:
        t = Transaction(**r)
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

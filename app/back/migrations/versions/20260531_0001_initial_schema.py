"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-05-31
"""

from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

user_role_enum = postgresql.ENUM(
    "motorista",
    "gestor_frota",
    "admin",
    name="userrole",
    create_type=False,
)


def upgrade() -> None:
    user_role_enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "organizations",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("cnpj", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("cnpj"),
    )

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column(
            "role",
            user_role_enum,
            nullable=False,
            server_default="motorista",
        ),
        sa.Column("organization_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )

    op.create_table(
        "fleets",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("organization_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "fleet_users",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("fleet_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["fleet_id"], ["fleets.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("fleet_id", "user_id", name="uq_fleet_user"),
    )

    op.create_table(
        "vehicles",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("id_tag", sa.String(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("organization_id", sa.Integer(), nullable=True),
        sa.Column("fleet_id", sa.Integer(), nullable=True),
        sa.Column("assigned_driver_id", sa.Integer(), nullable=True),
        sa.Column("license_plate", sa.String(), nullable=False),
        sa.Column("model", sa.String(), nullable=False),
        sa.Column("fuel_type", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(["assigned_driver_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["fleet_id"], ["fleets.id"]),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("id_tag"),
        sa.UniqueConstraint("license_plate"),
    )

    op.create_table(
        "user_stats",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("total_time_saved_sec", sa.Float(), nullable=False),
        sa.Column("co2_total_kg", sa.Float(), nullable=False),
        sa.Column("fuel_total_liters", sa.Float(), nullable=False),
        sa.Column("water_total_liters", sa.Float(), nullable=False),
        sa.Column("financial_total_brl", sa.Float(), nullable=False),
        sa.Column("transactions_count", sa.Integer(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id"),
    )
    op.create_index(op.f("ix_user_stats_user_id"), "user_stats", ["user_id"], unique=True)

    op.create_table(
        "weekly_goals",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("week_start_date", sa.Date(), nullable=False),
        sa.Column("target_transactions", sa.Integer(), nullable=False),
        sa.Column("current_transactions", sa.Integer(), nullable=False),
        sa.Column("target_co2_kg", sa.Float(), nullable=False),
        sa.Column("current_co2_kg", sa.Float(), nullable=False),
        sa.Column("is_completed", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_weekly_goals_user_id"), "weekly_goals", ["user_id"], unique=False)

    op.create_table(
        "transactions",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("vehicle_id", sa.Integer(), nullable=True),
        sa.Column("organization_id", sa.Integer(), nullable=True),
        sa.Column("plate", sa.String(), nullable=True),
        sa.Column("context", sa.String(), nullable=False),
        sa.Column("uf", sa.String(), nullable=True),
        sa.Column("elapsed_time_sec", sa.Float(), nullable=True),
        sa.Column("is_digital", sa.Boolean(), nullable=False),
        sa.Column("co2_avoided_kg", sa.Float(), nullable=True),
        sa.Column("fuel_saved_liters", sa.Float(), nullable=True),
        sa.Column("time_saved_sec", sa.Float(), nullable=True),
        sa.Column("financial_savings_brl", sa.Float(), nullable=True),
        sa.Column("water_saved_liters", sa.Float(), nullable=True),
        sa.Column(
            "parameters_snapshot",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["vehicle_id"], ["vehicles.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "technical_specs",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("emission_factor_diesel_s10", sa.Float(), nullable=False),
        sa.Column("emission_factor_gasolina_c", sa.Float(), nullable=False),
        sa.Column("emission_factor_etanol", sa.Float(), nullable=False),
        sa.Column("idle_rate_leve", sa.Float(), nullable=False),
        sa.Column("idle_rate_pesado", sa.Float(), nullable=False),
        sa.Column("paper_co2_per_ticket", sa.Float(), nullable=False),
        sa.Column("paper_water_per_ticket", sa.Float(), nullable=False),
        sa.Column("ludic_tree_year_absorption", sa.Float(), nullable=False),
        sa.Column("ludic_phone_charge_factor", sa.Float(), nullable=False),
        sa.Column("ludic_coffee_factor", sa.Float(), nullable=False),
        sa.Column(
            "ludic_metaphor_units",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
        ),
        sa.Column("baseline_pedagio_avg_wait_sec", sa.Integer(), nullable=False),
        sa.Column("baseline_estacionamento_avg_wait_sec", sa.Integer(), nullable=False),
        sa.Column("maint_cost_leve", sa.Float(), nullable=False),
        sa.Column("maint_cost_pesado", sa.Float(), nullable=False),
        sa.Column("accel_surge_leve", sa.Float(), nullable=False),
        sa.Column("accel_surge_pesado", sa.Float(), nullable=False),
        sa.Column("benchmark_kg_co2_per_km_car", sa.Float(), nullable=False),
        sa.Column("benchmark_kg_co2_per_burger", sa.Float(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "fuel_prices_by_uf",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("uf", sa.String(length=2), nullable=False),
        sa.Column("price_diesel_s10", sa.Float(), nullable=True),
        sa.Column("price_gasolina_c", sa.Float(), nullable=True),
        sa.Column("price_etanol", sa.Float(), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_fuel_prices_by_uf_uf"), "fuel_prices_by_uf", ["uf"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_fuel_prices_by_uf_uf"), table_name="fuel_prices_by_uf")
    op.drop_table("fuel_prices_by_uf")
    op.drop_table("technical_specs")
    op.drop_table("transactions")
    op.drop_index(op.f("ix_weekly_goals_user_id"), table_name="weekly_goals")
    op.drop_table("weekly_goals")
    op.drop_index(op.f("ix_user_stats_user_id"), table_name="user_stats")
    op.drop_table("user_stats")
    op.drop_table("vehicles")
    op.drop_table("fleet_users")
    op.drop_table("fleets")
    op.drop_table("users")
    op.drop_table("organizations")
    user_role_enum.drop(op.get_bind(), checkfirst=True)

"""technical_specs e fuel_prices_by_uf — colunas explícitas e PK numérica em preços.

Revision ID: 001_specs_fuel
Revises:
Create Date: 2026-02-09

Em ambientes com schema antigo (JSONB genérico / PK uf em fuel_prices), este upgrade
remove as tabelas e recria. Faça backup antes se houver dados importantes.
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "001_specs_fuel"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(sa.text("DROP TABLE IF EXISTS fuel_prices_by_uf CASCADE"))
    op.execute(sa.text("DROP TABLE IF EXISTS technical_specs CASCADE"))

    ludic_default = sa.text(
        '\'{"carbon": {"tree_year": 15.0, "burger": 2.5, "km_car": 0.12}, '
        '"water": {"shower_8min": 60.0, "drinking_day": 2.0, "flush": 6.0}, '
        '"paper": {"ream_a4": 500.0, "notebook": 50.0, "toilet_roll": 150.0}}\'::jsonb'
    )

    op.create_table(
        "technical_specs",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("emission_factor_diesel_s10", sa.Float(), nullable=False, server_default="2.51"),
        sa.Column("emission_factor_gasolina_c", sa.Float(), nullable=False, server_default="2.15"),
        sa.Column("emission_factor_etanol", sa.Float(), nullable=False, server_default="0.44"),
        sa.Column("idle_rate_leve", sa.Float(), nullable=False, server_default="0.00027"),
        sa.Column("idle_rate_pesado", sa.Float(), nullable=False, server_default="0.00069"),
        sa.Column("paper_co2_per_ticket", sa.Float(), nullable=False, server_default="0.012"),
        sa.Column("paper_water_per_ticket", sa.Float(), nullable=False, server_default="0.5"),
        sa.Column("ludic_tree_year_absorption", sa.Float(), nullable=False, server_default="15.0"),
        sa.Column("ludic_phone_charge_factor", sa.Float(), nullable=False, server_default="120.0"),
        sa.Column("ludic_coffee_factor", sa.Float(), nullable=False, server_default="10.0"),
        sa.Column(
            "ludic_metaphor_units",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=ludic_default,
        ),
        sa.Column(
            "baseline_pedagio_avg_wait_sec",
            sa.Integer(),
            nullable=False,
            server_default="300",
        ),
        sa.Column(
            "baseline_estacionamento_avg_wait_sec",
            sa.Integer(),
            nullable=False,
            server_default="180",
        ),
        sa.Column("maint_cost_leve", sa.Float(), nullable=False, server_default="0.05"),
        sa.Column("maint_cost_pesado", sa.Float(), nullable=False, server_default="0.25"),
        sa.Column("accel_surge_leve", sa.Float(), nullable=False, server_default="0.015"),
        sa.Column("accel_surge_pesado", sa.Float(), nullable=False, server_default="0.080"),
        sa.Column(
            "benchmark_kg_co2_per_km_car",
            sa.Float(),
            nullable=False,
            server_default="0.12",
        ),
        sa.Column(
            "benchmark_kg_co2_per_burger",
            sa.Float(),
            nullable=False,
            server_default="2.5",
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "fuel_prices_by_uf",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("uf", sa.String(length=2), nullable=False),
        sa.Column("price_diesel_s10", sa.Float(), nullable=True),
        sa.Column("price_gasolina_c", sa.Float(), nullable=True),
        sa.Column("price_etanol", sa.Float(), nullable=True),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("uf", name="uq_fuel_prices_by_uf_uf"),
    )


def downgrade() -> None:
    op.drop_table("fuel_prices_by_uf")
    op.drop_table("technical_specs")

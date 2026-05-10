"""Remove brake cost columns if present (upgrade from older 001).

Revision ID: 002_drop_brake
Revises: 001_specs_fuel
Create Date: 2026-02-10
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "002_drop_brake"
down_revision = "001_specs_fuel"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        sa.text(
            "ALTER TABLE technical_specs DROP COLUMN IF EXISTS "
            "brake_cost_per_stop_leve_brl"
        )
    )
    op.execute(
        sa.text(
            "ALTER TABLE technical_specs DROP COLUMN IF EXISTS "
            "brake_cost_per_stop_pesado_brl"
        )
    )


def downgrade() -> None:
    op.add_column(
        "technical_specs",
        sa.Column(
            "brake_cost_per_stop_leve_brl",
            sa.Float(),
            nullable=False,
            server_default="0.15",
        ),
    )
    op.add_column(
        "technical_specs",
        sa.Column(
            "brake_cost_per_stop_pesado_brl",
            sa.Float(),
            nullable=False,
            server_default="0.45",
        ),
    )

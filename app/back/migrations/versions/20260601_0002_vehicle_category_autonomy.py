"""Add vehicle category and average_autonomy_km."""

from alembic import op
import sqlalchemy as sa

revision = "0002_vehicle_category"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "vehicles",
        sa.Column("category", sa.String(), nullable=False, server_default="leve"),
    )
    op.add_column(
        "vehicles",
        sa.Column("average_autonomy_km", sa.Float(), nullable=True),
    )
    op.execute(
        """
        UPDATE vehicles
        SET category = 'pesado'
        WHERE model ILIKE '%truck%'
           OR model ILIKE '%caminh%'
           OR model ILIKE '%volvo%'
           OR model ILIKE '%scania%'
           OR model ILIKE '%mercedes%'
        """
    )


def downgrade() -> None:
    op.drop_column("vehicles", "average_autonomy_km")
    op.drop_column("vehicles", "category")

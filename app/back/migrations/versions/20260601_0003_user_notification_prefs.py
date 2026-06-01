"""Add user notification preference columns."""

from alembic import op
import sqlalchemy as sa

revision = "0003_user_notification_prefs"
down_revision = "0002_vehicle_category"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("email_alerts", sa.Boolean(), nullable=False, server_default="true"),
    )
    op.add_column(
        "users",
        sa.Column("push_alerts", sa.Boolean(), nullable=False, server_default="false"),
    )
    op.add_column(
        "users",
        sa.Column("weekly_report", sa.Boolean(), nullable=False, server_default="true"),
    )


def downgrade() -> None:
    op.drop_column("users", "weekly_report")
    op.drop_column("users", "push_alerts")
    op.drop_column("users", "email_alerts")

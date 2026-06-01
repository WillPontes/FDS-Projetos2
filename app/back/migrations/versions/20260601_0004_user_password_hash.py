"""Add password_hash to users."""

from alembic import op
import sqlalchemy as sa

revision = "0004_user_password_hash"
down_revision = "0003_user_notification_prefs"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("password_hash", sa.String(), nullable=True),
    )
    # Senha padrão de desenvolvimento: taggy123
    op.execute(
        """
        UPDATE users
        SET password_hash = '$2b$12$gfCOru8jEIyUi83QK4HOLOZ.K15p1mTJ82nNG5gQV8vgZYapbWjwq'
        WHERE password_hash IS NULL
        """
    )
    op.alter_column("users", "password_hash", nullable=False)


def downgrade() -> None:
    op.drop_column("users", "password_hash")

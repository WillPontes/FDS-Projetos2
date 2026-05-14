from sqlalchemy.ext.asyncio import AsyncSession

from src.dto.transactions import TransactionIn, TransactionUpdate
from src.models.transaction import Transaction
from src.repositories.transaction_repository import TransactionRepository


async def list_transactions(db: AsyncSession) -> list[Transaction]:
    return await TransactionRepository(db).get_all()


async def get_transaction_by_id(
    db: AsyncSession,
    transaction_id: int,
) -> Transaction | None:
    return await TransactionRepository(db).get_by_id(transaction_id)


async def create_transaction(
    db: AsyncSession,
    transaction_in: TransactionIn,
) -> Transaction:
    return await TransactionRepository(db).create(transaction_in)


async def update_transaction(
    db: AsyncSession,
    transaction_id: int,
    transaction_update: TransactionUpdate,
) -> Transaction | None:
    return await TransactionRepository(db).update(
        transaction_id,
        transaction_update,
    )


async def delete_transaction(
    db: AsyncSession,
    transaction_id: int,
) -> bool:
    return await TransactionRepository(db).delete(transaction_id)
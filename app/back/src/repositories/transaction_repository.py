from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.dto.transactions import TransactionIn, TransactionUpdate
from src.models.transaction import Transaction


class TransactionRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, transaction_id: int) -> Transaction | None:
        result = await self.session.execute(
            select(Transaction).where(Transaction.id == transaction_id)
        )

        return result.scalar_one_or_none()

    async def get_all(self) -> list[Transaction]:
        result = await self.session.execute(select(Transaction))

        return list(result.scalars().all())

    async def create(self, transaction_in: TransactionIn) -> Transaction:
        transaction = Transaction(**transaction_in.model_dump())

        self.session.add(transaction)
        await self.session.flush()

        return transaction

    async def update(
        self,
        transaction_id: int,
        transaction_update: TransactionUpdate,
    ) -> Transaction | None:
        transaction = await self.get_by_id(transaction_id)

        if transaction is None:
            return None

        for key, value in transaction_update.model_dump(exclude_unset=True).items():
            setattr(transaction, key, value)

        self.session.add(transaction)
        await self.session.flush()

        return transaction

    async def delete(self, transaction_id: int) -> bool:
        transaction = await self.get_by_id(transaction_id)

        if transaction is None:
            return False

        await self.session.delete(transaction)
        await self.session.flush()

        return True
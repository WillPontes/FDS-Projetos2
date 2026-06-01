from datetime import date

from sqlalchemy import func, select
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

    async def get_by_organization_paginated(
        self,
        organization_id: int,
        page: int = 1,
        page_size: int = 10,
        context: str | None = None,
        uf: str | None = None,
        from_date: date | None = None,
        to_date: date | None = None,
    ) -> tuple[list[Transaction], int]:
        query = select(Transaction).where(Transaction.organization_id == organization_id)
        if context:
            query = query.where(Transaction.context == context)
        if uf:
            query = query.where(Transaction.uf == uf)
        if from_date:
            query = query.where(Transaction.created_at >= from_date)
        if to_date:
            query = query.where(Transaction.created_at <= to_date)
        total_result = await self.session.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = total_result.scalar_one()
        offset = (page - 1) * page_size
        result = await self.session.execute(
            query.order_by(Transaction.created_at.desc()).offset(offset).limit(page_size)
        )
        return list(result.scalars().all()), total

    async def get_by_user_paginated(
        self,
        user_id: int,
        page: int = 1,
        page_size: int = 10,
        plate: str | None = None,
        context: str | None = None,
        uf: str | None = None,
        from_date: date | None = None,
        to_date: date | None = None,
    ) -> tuple[list[Transaction], int]:
        query = select(Transaction).where(Transaction.user_id == user_id)
        if plate:
            query = query.where(Transaction.plate.ilike(f"%{plate}%"))
        if context:
            query = query.where(Transaction.context == context)
        if uf:
            query = query.where(Transaction.uf == uf)
        if from_date:
            query = query.where(Transaction.created_at >= from_date)
        if to_date:
            query = query.where(Transaction.created_at <= to_date)
        total_result = await self.session.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = total_result.scalar_one()
        offset = (page - 1) * page_size
        result = await self.session.execute(
            query.order_by(Transaction.created_at.desc()).offset(offset).limit(page_size)
        )
        return list(result.scalars().all()), total

    async def get_by_vehicle_ids_paginated(
        self,
        vehicle_ids: list[int],
        page: int = 1,
        page_size: int = 10,
    ) -> tuple[list[Transaction], int]:
        query = select(Transaction).where(Transaction.vehicle_id.in_(vehicle_ids))
        total_result = await self.session.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = total_result.scalar_one()
        offset = (page - 1) * page_size
        result = await self.session.execute(
            query.order_by(Transaction.created_at.desc()).offset(offset).limit(page_size)
        )
        return list(result.scalars().all()), total

    async def get_by_vehicle_paginated(
        self,
        vehicle_id: int,
        page: int = 1,
        page_size: int = 10,
        context: str | None = None,
        uf: str | None = None,
        from_date: date | None = None,
        to_date: date | None = None,
    ) -> tuple[list[Transaction], int]:
        query = select(Transaction).where(Transaction.vehicle_id == vehicle_id)
        if context:
            query = query.where(Transaction.context == context)
        if uf:
            query = query.where(Transaction.uf == uf)
        if from_date:
            query = query.where(Transaction.created_at >= from_date)
        if to_date:
            query = query.where(Transaction.created_at <= to_date)
        total_result = await self.session.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = total_result.scalar_one()
        offset = (page - 1) * page_size
        result = await self.session.execute(
            query.order_by(Transaction.created_at.desc()).offset(offset).limit(page_size)
        )
        return list(result.scalars().all()), total

    async def get_paginated(
        self,
        page: int = 1,
        page_size: int = 10,
        organization_id: int | None = None,
        vehicle_id: int | None = None,
        user_id: int | None = None,
        plate: str | None = None,
        context: str | None = None,
        uf: str | None = None,
        from_date: date | None = None,
        to_date: date | None = None,
    ) -> tuple[list[Transaction], int]:
        query = select(Transaction)
        if organization_id is not None:
            query = query.where(Transaction.organization_id == organization_id)
        if vehicle_id is not None:
            query = query.where(Transaction.vehicle_id == vehicle_id)
        if user_id is not None:
            query = query.where(Transaction.user_id == user_id)
        if plate:
            query = query.where(Transaction.plate.ilike(f"%{plate}%"))
        if context:
            query = query.where(Transaction.context == context)
        if uf:
            query = query.where(Transaction.uf == uf)
        if from_date:
            query = query.where(Transaction.created_at >= from_date)
        if to_date:
            query = query.where(Transaction.created_at <= to_date)
        total_result = await self.session.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = total_result.scalar_one()
        offset = (page - 1) * page_size
        result = await self.session.execute(
            query.order_by(Transaction.created_at.desc()).offset(offset).limit(page_size)
        )
        return list(result.scalars().all()), total

    async def get_by_user_in_range(
        self,
        user_id: int,
        from_date: date | None = None,
        to_date: date | None = None,
    ) -> list[Transaction]:
        query = select(Transaction).where(Transaction.user_id == user_id)
        if from_date:
            query = query.where(Transaction.created_at >= from_date)
        if to_date:
            query = query.where(Transaction.created_at <= to_date)
        result = await self.session.execute(
            query.order_by(Transaction.created_at.desc())
        )
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
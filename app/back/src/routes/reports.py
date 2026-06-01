import io
from datetime import date

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.connection import get_db
from src.repositories.transaction_repository import TransactionRepository

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/export")
async def export_transactions(
    user_id: int = Query(...),
    from_date: date | None = Query(default=None),
    to_date: date | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
) -> StreamingResponse:
    try:
        import openpyxl
        from openpyxl.styles import Alignment, Font, PatternFill
    except ImportError as exc:
        raise RuntimeError("openpyxl não está instalado.") from exc

    repo = TransactionRepository(db)
    transactions = await repo.get_by_user_in_range(user_id, from_date, to_date)

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Relatório de Passagens"

    headers = [
        "ID",
        "Placa",
        "Contexto",
        "UF",
        "Data/Hora",
        "CO₂ Evitado (kg)",
        "Combustível Economizado (L)",
        "Tempo Economizado (min)",
        "Economia Financeira (R$)",
        "Água Economizada (L)",
    ]

    header_fill = PatternFill(start_color="1A1A2E", end_color="1A1A2E", fill_type="solid")
    header_font = Font(bold=True, color="FFFFFF")

    for col_idx, header in enumerate(headers, start=1):
        cell = ws.cell(row=1, column=col_idx, value=header)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center")

    context_labels = {"pedagio": "Pedágio", "estacionamento": "Estacionamento"}

    for row_idx, t in enumerate(transactions, start=2):
        ws.cell(row=row_idx, column=1, value=t.id)
        ws.cell(row=row_idx, column=2, value=t.plate or "")
        ws.cell(row=row_idx, column=3, value=context_labels.get(t.context, t.context))
        ws.cell(row=row_idx, column=4, value=t.uf or "")
        ws.cell(row=row_idx, column=5, value=t.created_at.strftime("%d/%m/%Y %H:%M:%S") if t.created_at else "")
        ws.cell(row=row_idx, column=6, value=round(t.co2_avoided_kg or 0, 4))
        ws.cell(row=row_idx, column=7, value=round(t.fuel_saved_liters or 0, 4))
        ws.cell(row=row_idx, column=8, value=round((t.time_saved_sec or 0) / 60, 2))
        ws.cell(row=row_idx, column=9, value=round(t.financial_savings_brl or 0, 2))
        ws.cell(row=row_idx, column=10, value=round(t.water_saved_liters or 0, 4))

    for col in ws.columns:
        max_len = max(len(str(cell.value or "")) for cell in col)
        ws.column_dimensions[col[0].column_letter].width = max(max_len + 4, 14)

    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)

    filename = f"relatorio_passagens_usuario_{user_id}.xlsx"

    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )

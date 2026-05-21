from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from src.database.connection import engine

from src.models.fuel_prices import FuelPriceByUF
from src.models.organization import Organization
from src.models.technical_specs import TechnicalSpecs
from src.models.user import User
from src.models.vehicle import Vehicle
from src.models.transaction import Transaction
from src.models.user_stats import UserStats

from src.routes import router

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield


app = FastAPI(
    title="TaggyEcoScore API",
    version="0.1.0",
    description="TaggyEcoScore API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/")
def health_check():
    return {"status": "Ok"}
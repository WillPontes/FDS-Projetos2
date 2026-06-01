from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.routes import router
from scripts.seed import seed_all

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await seed_all(reset=True)

    yield


app = FastAPI(
    title="TaggyEcoScore API",
    version="0.1.0",
    description="TaggyEcoScore API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "https://taggy-ecoscore-git-feat-modules-igrphillipes-projects.vercel.app",
                   "https://taggy-ecoscore.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/")
def health_check():
    return {"status": "Ok"}

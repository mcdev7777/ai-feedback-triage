from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import logging
import os

from .api.triage import router as triage_router
from .api.dashboard import router as dashboard_router
from .database.connection import init_db

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI-Powered Feedback Triage",
    description="A web application that helps triage incoming user feedback using AI",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    logger.info("Initializing database...")
    await init_db()
    logger.info("Database initialized successfully")

app.include_router(triage_router)
app.include_router(dashboard_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "AI-Powered Feedback Triage API", "version": "2.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
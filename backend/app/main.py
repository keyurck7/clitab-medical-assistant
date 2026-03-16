from fastapi import FastAPI
from app.db.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
import app.models.user_model
import app.models.patient_profile_model
import app.models.medical_record_model
import app.models.appointment_model
from app.routes.auth_routes import router as auth_router
from app.routes.patient_routes import router as patient_router
from app.routes.medical_record_routes import router as medical_record_router
from app.routes.appointment_routes import router as appointment_router

app = FastAPI(title="Clitab API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(patient_router)
app.include_router(medical_record_router)
app.include_router(appointment_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Clitab API"}
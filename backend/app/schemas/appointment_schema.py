from pydantic import BaseModel
from datetime import date, datetime

class AppointmentCreate(BaseModel):
    doctor_name: str
    appointment_date: str
    appointment_time: str
    reason: str

class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_name: str
    appointment_date: str
    appointment_time: str
    reason: str 
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class AppointmentUpdate(BaseModel):
    doctor_name: str
    appointment_date: date
    appointment_time: str
    reason: str
    status: str
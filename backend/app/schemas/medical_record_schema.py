from typing import Optional

from pydantic import BaseModel
from datetime import date, datetime

class MedicalRecordCreate(BaseModel):
    title: str
    category: str
    description: str | None = None
    record_date: str | None = None

class MedicalRecordUpdate(BaseModel):
    title: str
    category: str
    description: str
    record_date: date

class MedicalRecordResponse(BaseModel):
    id: int
    patient_id: int
    title: str
    category: str
    description: str | None = None
    record_date: str | None = None
    created_at: datetime
    file_name: Optional[str] = None
    file_url: Optional[str] = None
    file_key: Optional[str] = None

    class Config:
        from_attributes = True
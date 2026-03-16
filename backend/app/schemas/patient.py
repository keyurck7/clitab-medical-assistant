from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

class PatientBase(BaseModel):
    full_name: str
    date_of_birth: date
    gender: str
    phone: str
    email: EmailStr
    address: str

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


class PatientUpdate(BaseModel):
    full_name: str
    date_of_birth: date
    gender: str
    phone: str
    email: EmailStr
    address: str
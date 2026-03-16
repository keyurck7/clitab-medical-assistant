from pydantic import BaseModel

class PatientProfileCreate(BaseModel):
    date_of_birth: str | None = None
    blood_group: str | None = None
    allergies: str | None = None
    chronic_conditions: str | None = None
    emergency_contact: str | None = None

class PatientProfileResponse(BaseModel):
    id: int
    user_id: int
    date_of_birth: str | None = None
    blood_group: str | None = None
    allergies: str | None = None
    chronic_conditions: str | None = None
    emergency_contact: str | None = None

    class Config:
        from_attributes = True
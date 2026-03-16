from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Patient, User
from schemas.patient import PatientCreate, PatientResponse, PatientUpdate
from utils.auth import get_current_user

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: int,
    updated_data: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(
        Patient.id == patient_id,
        Patient.user_id == current_user.id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found"
        )

    patient.full_name = updated_data.full_name
    patient.date_of_birth = updated_data.date_of_birth
    patient.gender = updated_data.gender
    patient.phone = updated_data.phone
    patient.email = updated_data.email
    patient.address = updated_data.address

    db.commit()
    db.refresh(patient)

    return patient
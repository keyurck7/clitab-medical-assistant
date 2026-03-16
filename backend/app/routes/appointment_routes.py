from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user_model import User
from app.models.appointment_model import Appointment
from app.schemas.appointment_schema import AppointmentCreate, AppointmentResponse, AppointmentUpdate
from app.core.security import decode_access_token
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/appointments", tags=["Appointments"])
security = HTTPBearer()





@router.post("", response_model=AppointmentResponse)
def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_appointment = Appointment(
        patient_id=current_user.id,
        doctor_name=appointment.doctor_name,
        appointment_date=appointment.appointment_date,
        appointment_time=appointment.appointment_time,
        reason=appointment.reason,
        status="scheduled"
    )

    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)

    return new_appointment


@router.get("", response_model=list[AppointmentResponse])
def get_my_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    appointments = db.query(Appointment).filter(
        Appointment.patient_id == current_user.id
    ).all()

    return appointments


@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update_appointment(
    appointment_id: int,
    updated_data: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.patient_id == current_user.id
    ).first()

    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    appointment.doctor_name = updated_data.doctor_name
    appointment.appointment_date = updated_data.appointment_date
    appointment.appointment_time = updated_data.appointment_time
    appointment.reason = updated_data.reason
    appointment.status = updated_data.status

    db.commit()
    db.refresh(appointment)

    return appointment
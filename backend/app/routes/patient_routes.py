from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user_model import User
from app.models.patient_profile_model import PatientProfile
from app.schemas.patient_profile_schema import PatientProfileCreate, PatientProfileResponse
from app.core.security import decode_access_token
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/patients", tags=["Patient Profiles"])
security = HTTPBearer()



@router.post("/profile", response_model=PatientProfileResponse)
def create_patient_profile(
    profile: PatientProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "patient":
        raise HTTPException(status_code=403, detail="Only patients can create profiles")

    existing_profile = db.query(PatientProfile).filter(PatientProfile.user_id == current_user.id).first()
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists")

    new_profile = PatientProfile(
        user_id=current_user.id,
        date_of_birth=profile.date_of_birth,
        blood_group=profile.blood_group,
        allergies=profile.allergies,
        chronic_conditions=profile.chronic_conditions,
        emergency_contact=profile.emergency_contact
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return new_profile

@router.get("/profile", response_model=PatientProfileResponse)
def get_patient_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(PatientProfile).filter(PatientProfile.user_id == current_user.id).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return profile

@router.put("/profile", response_model=PatientProfileResponse)
def update_patient_profile(
    profile_data: PatientProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(PatientProfile).filter(PatientProfile.user_id == current_user.id).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    profile.date_of_birth = profile_data.date_of_birth
    profile.blood_group = profile_data.blood_group
    profile.allergies = profile_data.allergies
    profile.chronic_conditions = profile_data.chronic_conditions
    profile.emergency_contact = profile_data.emergency_contact

    db.commit()
    db.refresh(profile)

    return profile
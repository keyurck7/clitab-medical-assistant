from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import Optional
from app.services.s3_service import upload_file_to_s3

from app.db.session import get_db
from app.models.user_model import User
from app.models.medical_record_model import MedicalRecord
from app.schemas.medical_record_schema import MedicalRecordCreate, MedicalRecordResponse, MedicalRecordUpdate
from app.core.security import decode_access_token
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/records", tags=["Medical Records"])
security = HTTPBearer()



@router.post("/", response_model=MedicalRecordResponse)
def create_medical_record(
    title: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    record_date: str = Form(...),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    uploaded_file_data = {
        "file_name": None,
        "file_url": None,
        "file_key": None,
    }

    if file:
        s3_result = upload_file_to_s3(
            file.file,
            file.filename,
            file.content_type
        )
        uploaded_file_data = {
            "file_name": file.filename,
            "file_url": s3_result["file_url"],
            "file_key": s3_result["file_key"],
        }

    new_record = MedicalRecord(
        patient_id=current_user.id,
        title=title,
        category=category,
        description=description,
        record_date=record_date,
        file_name=uploaded_file_data["file_name"],
        file_url=uploaded_file_data["file_url"],
        file_key=uploaded_file_data["file_key"],
    )

    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return new_record

@router.get("", response_model=list[MedicalRecordResponse])
def get_my_medical_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    records = db.query(MedicalRecord).filter(MedicalRecord.patient_id == current_user.id).all()
    return records

@router.get("/{record_id}", response_model=MedicalRecordResponse)
def get_medical_record_by_id(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(MedicalRecord).filter(
        MedicalRecord.id == record_id,
        MedicalRecord.patient_id == current_user.id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Medical record not found")

    return record

@router.put("/{record_id}", response_model=MedicalRecordResponse)
def update_medical_record(
    record_id: int,
    record_data: MedicalRecordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(MedicalRecord).filter(
        MedicalRecord.id == record_id,
        MedicalRecord.patient_id == current_user.id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Medical record not found")

    record.title = record_data.title
    record.category = record_data.category
    record.description = record_data.description
    record.record_date = record_data.record_date

    db.commit()
    db.refresh(record)

    return record

@router.delete("/{record_id}")
def delete_medical_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(MedicalRecord).filter(
        MedicalRecord.id == record_id,
        MedicalRecord.patient_id == current_user.id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Medical record not found")

    db.delete(record)
    db.commit()

    return {"message": "Medical record deleted"}
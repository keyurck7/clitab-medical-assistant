from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import datetime
from app.db.database import Base

class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    description = Column(String, nullable=True)
    record_date = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    file_name = Column(String, nullable=True)
    file_url = Column(String, nullable=True)
    file_key = Column(String, nullable=True)
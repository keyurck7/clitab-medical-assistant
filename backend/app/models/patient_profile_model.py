from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.database import Base

class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    date_of_birth = Column(String, nullable=True)
    blood_group = Column(String, nullable=True)
    allergies = Column(String, nullable=True)
    chronic_conditions = Column(String, nullable=True)
    emergency_contact = Column(String, nullable=True)
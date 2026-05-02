import sys
import os
import joblib
import pandas as pd

from fastapi import FastAPI
from pydantic import BaseModel

sys.path.append(os.path.abspath("src"))

from preprocess import add_features


app = FastAPI(
    title="Student Performance Prediction API",
    description="Predicts academic risk level for students using machine learning.",
    version="1.0.0"
)

model = joblib.load("models/student_performance_model.joblib")


class StudentInput(BaseModel):
    gender: str
    school_type: str
    parent_education: str
    prior_gpa: float
    attendance_pct: float
    quiz_avg: float
    assignment_avg: float
    midterm_score: float
    study_hours_per_week: float
    on_time_submission_pct: float
    lms_logins_per_week: int
    forum_posts: int
    commute_time: float


def get_interventions(data):
    interventions = []

    if data["attendance_pct"] < 70:
        interventions.append("Attendance improvement plan")

    if data["quiz_avg"] < 55:
        interventions.append("Extra quiz practice and doubt-solving sessions")

    if data["assignment_avg"] < 60:
        interventions.append("Assignment tracking and mentor support")

    if data["study_hours_per_week"] < 5:
        interventions.append("Structured weekly study timetable")

    if data["lms_logins_per_week"] < 3:
        interventions.append("Increase LMS engagement and learning activity")

    if len(interventions) == 0:
        interventions.append("Continue regular monitoring")

    return interventions


@app.get("/")
def home():
    return {
        "message": "Student Performance Prediction API is running successfully."
    }


@app.post("/predict")
def predict(student: StudentInput):
    data = student.model_dump()

    df = pd.DataFrame([data])
    df = add_features(df)

    risk_probability = model.predict_proba(df)[0][1]

    prediction = int(risk_probability >= 0.35)

    if risk_probability >= 0.75:
        risk_level = "High Risk"
    elif risk_probability >= 0.50:
        risk_level = "Medium Risk"
    elif risk_probability >= 0.35:
        risk_level = "Low Risk"
    else:
        risk_level = "On Track"

    return {
        "risk_probability": round(float(risk_probability), 3),
        "risk_percentage": round(float(risk_probability) * 100, 2),
        "at_risk": bool(prediction),
        "risk_level": risk_level,
        "interventions": get_interventions(data)
    }
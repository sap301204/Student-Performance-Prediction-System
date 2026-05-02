import sys
import os
import joblib
import pandas as pd

from fastapi import FastAPI
from pydantic import BaseModel

sys.path.append(os.path.abspath("src"))

app = FastAPI(
    title="Student Performance Prediction API",
    description="Predicts student academic risk using the master student dataset.",
    version="2.0.0"
)

model = joblib.load("models/student_performance_model.joblib")


class StudentInput(BaseModel):
    gender: str
    school_type: str
    grade_name: str
    branch: str
    parent_education: str
    commute_time: float

    prior_gpa: float
    attendance_pct: float
    quiz_avg: float
    assignment_avg: float
    midterm_score: float
    study_hours_per_week: float
    on_time_submission_pct: float
    lms_logins_per_week: int
    forum_posts: int
    engagement_score: float

    arts_score: float
    english_score: float
    math_score: float
    phys_ed_score: float
    science_score: float
    average_marks: float
    final_score: float
    gpa: int
    exam_status: str
    grade_band: str


def get_top_risk_factors(data):
    factors = []

    if data["attendance_pct"] < 70:
        factors.append(f"Low attendance: {data['attendance_pct']}%")

    if data["quiz_avg"] < 55:
        factors.append(f"Low quiz average: {data['quiz_avg']}%")

    if data["assignment_avg"] < 60:
        factors.append(f"Weak assignment score: {data['assignment_avg']}%")

    if data["midterm_score"] < 55:
        factors.append(f"Low midterm score: {data['midterm_score']}%")

    if data["study_hours_per_week"] < 5:
        factors.append(f"Low study hours: {data['study_hours_per_week']}/week")

    if data["lms_logins_per_week"] < 3:
        factors.append(f"Low LMS activity: {data['lms_logins_per_week']} logins/week")

    if data["on_time_submission_pct"] < 60:
        factors.append(f"Low on-time submission: {data['on_time_submission_pct']}%")

    if data["commute_time"] > 60:
        factors.append(f"High commute time: {data['commute_time']} minutes")

    if len(factors) == 0:
        factors.append("No major academic risk factor detected.")

    return factors


def get_interventions(data):
    interventions = []

    if data["attendance_pct"] < 70:
        interventions.append("Create attendance improvement plan with weekly monitoring.")

    if data["quiz_avg"] < 55:
        interventions.append("Assign extra quiz practice and revision sessions.")

    if data["assignment_avg"] < 60:
        interventions.append("Track assignment completion and provide mentor support.")

    if data["midterm_score"] < 55:
        interventions.append("Schedule subject-wise doubt-solving session.")

    if data["study_hours_per_week"] < 5:
        interventions.append("Create a structured weekly study timetable.")

    if data["lms_logins_per_week"] < 3:
        interventions.append("Increase LMS engagement through reminders and study resources.")

    if len(interventions) == 0:
        interventions.append("Student is performing well. Continue regular monitoring.")

    return interventions


@app.get("/")
def home():
    return {
        "message": "Student Performance Prediction API is running successfully.",
        "version": "2.0.0",
        "model": "Master Dataset Model"
    }


@app.post("/predict")
def predict(student: StudentInput):
    data = student.model_dump()

    df = pd.DataFrame([data])

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
        "top_risk_factors": get_top_risk_factors(data),
        "interventions": get_interventions(data)
    }
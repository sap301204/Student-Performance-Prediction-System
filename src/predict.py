import joblib
import pandas as pd

from preprocess import add_features


def get_intervention(student):
    interventions = []

    if student["attendance_pct"] < 70:
        interventions.append("Improve attendance with weekly monitoring.")

    if student["quiz_avg"] < 55:
        interventions.append("Provide quiz practice and revision sessions.")

    if student["assignment_avg"] < 60:
        interventions.append("Track assignment submission and provide support.")

    if student["study_hours_per_week"] < 5:
        interventions.append("Create a structured study timetable.")

    if student["lms_logins_per_week"] < 3:
        interventions.append("Encourage regular LMS usage and learning activity.")

    if not interventions:
        interventions.append("Student is performing well. Continue regular monitoring.")

    return interventions


def predict_student(student_data):
    model = joblib.load("models/student_performance_model.joblib")

    df = pd.DataFrame([student_data])
    df = add_features(df)

    risk_probability = model.predict_proba(df)[0][1]

    # Lower threshold because at-risk students are harder to catch
    prediction = int(risk_probability >= 0.35)

    if risk_probability >= 0.75:
        risk_level = "High Risk"
    elif risk_probability >= 0.50:
        risk_level = "Medium Risk"
    elif risk_probability >= 0.35:
        risk_level = "Low Risk"
    else:
        risk_level = "On Track"

    interventions = get_intervention(student_data)

    return {
        "risk_probability": round(float(risk_probability), 3),
        "risk_percentage": round(float(risk_probability) * 100, 2),
        "at_risk": bool(prediction),
        "risk_level": risk_level,
        "interventions": interventions
    }


if __name__ == "__main__":
    sample_student = {
        "gender": "Female",
        "school_type": "Government",
        "parent_education": "Graduate",
        "prior_gpa": 5.2,
        "attendance_pct": 58,
        "quiz_avg": 42,
        "assignment_avg": 50,
        "midterm_score": 45,
        "study_hours_per_week": 3,
        "on_time_submission_pct": 48,
        "lms_logins_per_week": 2,
        "forum_posts": 0,
        "commute_time": 65
    }

    result = predict_student(sample_student)

    print("\nStudent Risk Prediction Result:")
    print(result)
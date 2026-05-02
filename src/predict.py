import joblib
import pandas as pd


def get_top_risk_factors(student):
    factors = []

    if student["attendance_pct"] < 70:
        factors.append(f"Low attendance: {student['attendance_pct']}%")

    if student["quiz_avg"] < 55:
        factors.append(f"Low quiz average: {student['quiz_avg']}%")

    if student["assignment_avg"] < 60:
        factors.append(f"Weak assignment score: {student['assignment_avg']}%")

    if student["midterm_score"] < 55:
        factors.append(f"Low midterm score: {student['midterm_score']}%")

    if student["study_hours_per_week"] < 5:
        factors.append(f"Low study hours: {student['study_hours_per_week']}/week")

    if student["lms_logins_per_week"] < 3:
        factors.append(
            f"Low LMS activity: {student['lms_logins_per_week']} logins/week"
        )

    if student["on_time_submission_pct"] < 60:
        factors.append(
            f"Low on-time submission: {student['on_time_submission_pct']}%"
        )

    if student["commute_time"] > 60:
        factors.append(f"High commute time: {student['commute_time']} minutes")

    if len(factors) == 0:
        factors.append("No major academic risk factor detected.")

    return factors


def get_interventions(student):
    interventions = []

    if student["attendance_pct"] < 70:
        interventions.append("Create attendance improvement plan with weekly monitoring.")

    if student["quiz_avg"] < 55:
        interventions.append("Assign extra quiz practice and revision sessions.")

    if student["assignment_avg"] < 60:
        interventions.append("Track assignment completion and provide mentor support.")

    if student["midterm_score"] < 55:
        interventions.append("Schedule subject-wise doubt-solving session.")

    if student["study_hours_per_week"] < 5:
        interventions.append("Create a structured weekly study timetable.")

    if student["lms_logins_per_week"] < 3:
        interventions.append(
            "Increase LMS engagement through reminders and study resources."
        )

    if len(interventions) == 0:
        interventions.append("Student is performing well. Continue regular monitoring.")

    return interventions


def predict_student(student_data):
    model = joblib.load("models/student_performance_model.joblib")

    df = pd.DataFrame([student_data])

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
        "top_risk_factors": get_top_risk_factors(student_data),
        "interventions": get_interventions(student_data),
    }


if __name__ == "__main__":
    sample_student = {
        "gender": "Female",
        "school_type": "Government",
        "grade_name": "Grade 3",
        "branch": "Science",
        "parent_education": "Graduate",
        "commute_time": 65,

        "prior_gpa": 5.2,
        "attendance_pct": 58,
        "quiz_avg": 42,
        "assignment_avg": 50,
        "midterm_score": 45,
        "study_hours_per_week": 3,
        "on_time_submission_pct": 48,
        "lms_logins_per_week": 2,
        "forum_posts": 0,
        "engagement_score": 2.1,

        "arts_score": 50,
        "english_score": 48,
        "math_score": 40,
        "phys_ed_score": 55,
        "science_score": 44,
        "average_marks": 47.4,
        "final_score": 49.2,
        "gpa": 2,
        "exam_status": "Fail",
        "grade_band": "D",
    }

    result = predict_student(sample_student)

    print("\nStudent Risk Prediction Result:")
    print(result)
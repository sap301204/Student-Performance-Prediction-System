import os
import numpy as np
import pandas as pd

np.random.seed(42)

def generate_student_data(n_students=1500):
    student_ids = [f"STU{i:04d}" for i in range(1, n_students + 1)]

    gender = np.random.choice(["Male", "Female"], size=n_students)
    school_type = np.random.choice(["Government", "Private", "Semi-Government"], size=n_students)
    parent_education = np.random.choice(["High School", "Graduate", "Post Graduate"], size=n_students)

    prior_gpa = np.round(np.random.normal(7.0, 1.2, n_students), 2)
    prior_gpa = np.clip(prior_gpa, 0, 10)

    attendance_pct = np.round(np.random.normal(75, 15, n_students), 2)
    attendance_pct = np.clip(attendance_pct, 30, 100)

    quiz_avg = np.round(np.random.normal(65, 18, n_students), 2)
    quiz_avg = np.clip(quiz_avg, 0, 100)

    assignment_avg = np.round(np.random.normal(70, 15, n_students), 2)
    assignment_avg = np.clip(assignment_avg, 0, 100)

    midterm_score = np.round(np.random.normal(62, 20, n_students), 2)
    midterm_score = np.clip(midterm_score, 0, 100)

    study_hours_per_week = np.round(np.random.normal(8, 4, n_students), 2)
    study_hours_per_week = np.clip(study_hours_per_week, 0, 30)

    on_time_submission_pct = np.round(np.random.normal(72, 20, n_students), 2)
    on_time_submission_pct = np.clip(on_time_submission_pct, 0, 100)

    lms_logins_per_week = np.random.poisson(5, n_students)
    forum_posts = np.random.poisson(2, n_students)

    commute_time = np.round(np.random.normal(35, 20, n_students), 2)
    commute_time = np.clip(commute_time, 0, 120)

    noise = np.random.normal(0, 8, n_students)

    final_score = (
        prior_gpa * 6
        + attendance_pct * 0.15
        + quiz_avg * 0.20
        + assignment_avg * 0.20
        + midterm_score * 0.25
        + study_hours_per_week * 0.8
        + on_time_submission_pct * 0.10
        + lms_logins_per_week * 0.6
        + forum_posts * 0.5
        - commute_time * 0.05
        + noise
    )

    final_score = np.clip(final_score, 0, 100)
    final_score = np.round(final_score, 2)

    grade_band = pd.cut(
        final_score,
        bins=[0, 40, 55, 70, 85, 100],
        labels=["F", "D", "C", "B", "A"],
        include_lowest=True
    )

    at_risk = (final_score < 50).astype(int)

    df = pd.DataFrame({
        "student_id": student_ids,
        "gender": gender,
        "school_type": school_type,
        "parent_education": parent_education,
        "prior_gpa": prior_gpa,
        "attendance_pct": attendance_pct,
        "quiz_avg": quiz_avg,
        "assignment_avg": assignment_avg,
        "midterm_score": midterm_score,
        "study_hours_per_week": study_hours_per_week,
        "on_time_submission_pct": on_time_submission_pct,
        "lms_logins_per_week": lms_logins_per_week,
        "forum_posts": forum_posts,
        "commute_time": commute_time,
        "final_score": final_score,
        "grade_band": grade_band,
        "at_risk": at_risk
    })

    return df

if __name__ == "__main__":
    os.makedirs("data", exist_ok=True)
    df = generate_student_data()
    df.to_csv("data/students.csv", index=False)

    print("Dataset created successfully.")
    print("Saved at: data/students.csv")
    print(df.head())
import os
import numpy as np
import pandas as pd

np.random.seed(42)


def generate_master_dataset(n_students=2400):
    os.makedirs("data", exist_ok=True)

    first_names = [
        "Jack", "Shawn", "Tyler", "Michal", "Zen", "Robert", "Mack", "Hudson",
        "Cal", "Damon", "Emma", "Olivia", "Sophia", "Ava", "Mia", "Noah",
        "Liam", "Ethan", "Lucas", "Mason", "Isha", "Riya", "Aarav", "Vivaan",
        "Anaya", "Diya", "Kabir", "Aditya", "Sara", "Meera"
    ]

    genders = ["Male", "Female"]
    school_types = ["Government", "Private", "Semi-Government"]
    parent_education_levels = ["High School", "Graduate", "Post Graduate"]
    grades = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"]
    branches = ["Arts", "English", "Math's", "Phys.Ed", "Science"]

    rows = []

    for i in range(1, n_students + 1):
        student_id = f"STU{i:04d}"
        student_name = np.random.choice(first_names)

        gender = np.random.choice(genders)
        school_type = np.random.choice(school_types, p=[0.4, 0.4, 0.2])
        parent_education = np.random.choice(
            parent_education_levels,
            p=[0.45, 0.4, 0.15]
        )
        grade_name = np.random.choice(
            grades,
            p=[0.15, 0.19, 0.16, 0.16, 0.34]
        )
        branch = np.random.choice(branches)

        prior_gpa = np.round(np.random.normal(6.5, 1.5), 2)
        prior_gpa = np.clip(prior_gpa, 2, 10)

        attendance_pct = np.round(np.random.normal(72, 16), 2)
        attendance_pct = np.clip(attendance_pct, 25, 100)

        quiz_avg = np.round(np.random.normal(60, 20), 2)
        quiz_avg = np.clip(quiz_avg, 0, 100)

        assignment_avg = np.round(np.random.normal(64, 18), 2)
        assignment_avg = np.clip(assignment_avg, 0, 100)

        midterm_score = np.round(np.random.normal(58, 22), 2)
        midterm_score = np.clip(midterm_score, 0, 100)

        study_hours_per_week = np.round(np.random.normal(6, 4), 2)
        study_hours_per_week = np.clip(study_hours_per_week, 0, 30)

        on_time_submission_pct = np.round(np.random.normal(66, 24), 2)
        on_time_submission_pct = np.clip(on_time_submission_pct, 0, 100)

        lms_logins_per_week = int(np.random.poisson(4))
        forum_posts = int(np.random.poisson(2))

        commute_time = np.round(np.random.normal(45, 25), 2)
        commute_time = np.clip(commute_time, 0, 130)

        engagement_score = (
            study_hours_per_week * 0.4
            + lms_logins_per_week * 0.35
            + forum_posts * 0.25
        )
        engagement_score = round(float(engagement_score), 2)

        arts_score = np.clip(np.random.normal(62, 15), 0, 100)
        english_score = np.clip(np.random.normal(66, 14), 0, 100)
        math_score = np.clip(np.random.normal(60, 18), 0, 100)
        phys_ed_score = np.clip(np.random.normal(61, 12), 0, 100)
        science_score = np.clip(np.random.normal(63, 16), 0, 100)

        average_marks = np.mean([
            arts_score,
            english_score,
            math_score,
            phys_ed_score,
            science_score,
            quiz_avg,
            assignment_avg,
            midterm_score
        ])

        noise = np.random.normal(0, 8)

        final_score = (
            prior_gpa * 4
            + attendance_pct * 0.12
            + quiz_avg * 0.17
            + assignment_avg * 0.17
            + midterm_score * 0.20
            + study_hours_per_week * 0.60
            + on_time_submission_pct * 0.08
            + lms_logins_per_week * 0.40
            + forum_posts * 0.30
            - commute_time * 0.04
            + noise
        )

        final_score = np.clip(final_score, 0, 100)
        final_score = round(float(final_score), 2)

        average_marks = round(float(average_marks), 2)

        if final_score >= 85:
            grade_band = "A"
        elif final_score >= 70:
            grade_band = "B"
        elif final_score >= 55:
            grade_band = "C"
        elif final_score >= 40:
            grade_band = "D"
        else:
            grade_band = "F"

        if average_marks >= 85:
            gpa = 5
        elif average_marks >= 70:
            gpa = 4
        elif average_marks >= 55:
            gpa = 3
        elif average_marks >= 40:
            gpa = 2
        else:
            gpa = 1

        if final_score >= 40 and attendance_pct >= 60:
            exam_status = np.random.choice(
                ["Pass", "Fail", "Not Attended"],
                p=[0.86, 0.10, 0.04]
            )
        elif attendance_pct < 60:
            exam_status = np.random.choice(
                ["Pass", "Fail", "Not Attended"],
                p=[0.35, 0.35, 0.30]
            )
        else:
            exam_status = np.random.choice(
                ["Pass", "Fail", "Not Attended"],
                p=[0.45, 0.45, 0.10]
            )

        at_risk = int(
            final_score < 55
            or attendance_pct < 60
            or quiz_avg < 45
            or midterm_score < 45
            or study_hours_per_week < 3
        )

        rows.append({
            "student_id": student_id,
            "student_name": student_name,
            "gender": gender,
            "school_type": school_type,
            "grade_name": grade_name,
            "branch": branch,
            "parent_education": parent_education,
            "commute_time": round(float(commute_time), 2),

            "prior_gpa": round(float(prior_gpa), 2),
            "attendance_pct": round(float(attendance_pct), 2),
            "quiz_avg": round(float(quiz_avg), 2),
            "assignment_avg": round(float(assignment_avg), 2),
            "midterm_score": round(float(midterm_score), 2),
            "study_hours_per_week": round(float(study_hours_per_week), 2),
            "on_time_submission_pct": round(float(on_time_submission_pct), 2),
            "lms_logins_per_week": lms_logins_per_week,
            "forum_posts": forum_posts,
            "engagement_score": engagement_score,

            "arts_score": round(float(arts_score), 2),
            "english_score": round(float(english_score), 2),
            "math_score": round(float(math_score), 2),
            "phys_ed_score": round(float(phys_ed_score), 2),
            "science_score": round(float(science_score), 2),

            "average_marks": average_marks,
            "final_score": final_score,
            "gpa": gpa,
            "grade_band": grade_band,
            "exam_status": exam_status,
            "at_risk": at_risk
        })

    df = pd.DataFrame(rows)

    output_path = "data/student_master_dataset.csv"
    df.to_csv(output_path, index=False)

    print("Master dataset created successfully.")
    print(f"Saved at: {output_path}")
    print("Shape:", df.shape)

    print("\nFirst 5 rows:")
    print(df.head())

    print("\nTarget distribution:")
    print(df["at_risk"].value_counts())

    print("\nTarget percentage:")
    print(df["at_risk"].value_counts(normalize=True) * 100)


if __name__ == "__main__":
    generate_master_dataset()
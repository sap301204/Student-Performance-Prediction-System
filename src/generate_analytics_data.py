import os
import numpy as np
import pandas as pd

np.random.seed(42)

def generate_analytics_data(n_students=2400):
    os.makedirs("data", exist_ok=True)

    first_names = [
        "Jack", "Shawn", "Tyler", "Michal", "Zen", "Robert", "Mack", "Hudson",
        "Cal", "Damon", "Emma", "Olivia", "Sophia", "Ava", "Mia", "Noah",
        "Liam", "Ethan", "Lucas", "Mason"
    ]

    genders = ["Male", "Female"]
    grades = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"]
    branches = ["Arts", "English", "Math's", "Phys.Ed", "Science"]

    rows = []

    for i in range(1, n_students + 1):
        student_id = f"STU{i:04d}"
        student_name = np.random.choice(first_names)
        gender = np.random.choice(genders)
        grade_name = np.random.choice(grades, p=[0.15, 0.19, 0.16, 0.16, 0.34])
        branch = np.random.choice(branches)

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
            science_score
        ])

        attendance = np.clip(np.random.normal(84, 8), 50, 100)

        if average_marks >= 40 and attendance >= 60:
            exam_status = np.random.choice(["Pass", "Fail", "Not Attended"], p=[0.88, 0.08, 0.04])
        elif attendance < 60:
            exam_status = np.random.choice(["Pass", "Fail", "Not Attended"], p=[0.35, 0.35, 0.30])
        else:
            exam_status = np.random.choice(["Pass", "Fail", "Not Attended"], p=[0.45, 0.45, 0.10])

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

        rows.append({
            "student_id": student_id,
            "student_name": student_name,
            "gender": gender,
            "grade_name": grade_name,
            "branch": branch,
            "arts_score": round(arts_score, 2),
            "english_score": round(english_score, 2),
            "math_score": round(math_score, 2),
            "phys_ed_score": round(phys_ed_score, 2),
            "science_score": round(science_score, 2),
            "average_marks": round(average_marks, 2),
            "gpa": gpa,
            "attendance": round(attendance, 2),
            "exam_status": exam_status
        })

    df = pd.DataFrame(rows)

    df.to_csv("data/student_analytics.csv", index=False)

    print("Analytics dataset created successfully.")
    print("Saved at: data/student_analytics.csv")
    print(df.head())

    print("\nTotal students:", len(df))
    print("\nAverage Attendance:", round(df["attendance"].mean(), 2))
    print("\nExam Status Count:")
    print(df["exam_status"].value_counts())

if __name__ == "__main__":
    generate_analytics_data()
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer

NUMERIC_FEATURES = [
    "prior_gpa",
    "attendance_pct",
    "quiz_avg",
    "assignment_avg",
    "midterm_score",
    "study_hours_per_week",
    "on_time_submission_pct",
    "lms_logins_per_week",
    "forum_posts",
    "commute_time",
    "engagement_score",
    "arts_score",
    "english_score",
    "math_score",
    "phys_ed_score",
    "science_score",
    "average_marks",
    "final_score",
    "gpa"
]

CATEGORICAL_FEATURES = [
    "gender",
    "school_type",
    "grade_name",
    "branch",
    "parent_education",
    "exam_status",
    "grade_band"
]

def build_preprocessor():
    numeric_pipeline = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])

    categorical_pipeline = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore"))
    ])

    preprocessor = ColumnTransformer(transformers=[
        ("num", numeric_pipeline, NUMERIC_FEATURES),
        ("cat", categorical_pipeline, CATEGORICAL_FEATURES)
    ])

    return preprocessor
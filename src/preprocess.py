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
    "academic_score_avg",
    "engagement_score"
]

CATEGORICAL_FEATURES = [
    "gender",
    "school_type",
    "parent_education"
]

def add_features(df):
    df = df.copy()

    df["academic_score_avg"] = (
        df["quiz_avg"] + df["assignment_avg"] + df["midterm_score"]
    ) / 3

    df["engagement_score"] = (
        df["study_hours_per_week"] * 0.4
        + df["lms_logins_per_week"] * 0.3
        + df["forum_posts"] * 0.3
    )

    return df

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

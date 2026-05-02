import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score
)

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier

from preprocess import build_preprocessor


def train():
    os.makedirs("models", exist_ok=True)

    df = pd.read_csv("data/student_master_dataset.csv")

    print("Master dataset loaded successfully.")
    print("Shape:", df.shape)

    print("\nTarget Distribution:")
    print(df["at_risk"].value_counts())

    drop_columns = [
        "student_id",
        "student_name",
        "at_risk"
    ]

    X = df.drop(columns=drop_columns)
    y = df["at_risk"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    preprocessor = build_preprocessor()

    models = {
        "Logistic Regression": LogisticRegression(
            max_iter=1000,
            class_weight="balanced"
        ),
        "Random Forest": RandomForestClassifier(
            n_estimators=300,
            random_state=42,
            class_weight="balanced"
        ),
        "Gradient Boosting": GradientBoostingClassifier(
            random_state=42
        )
    }

    best_model = None
    best_f1 = 0
    best_name = ""

    for name, clf in models.items():
        pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("model", clf)
        ])

        pipeline.fit(X_train, y_train)

        y_pred = pipeline.predict(X_test)
        y_proba = pipeline.predict_proba(X_test)[:, 1]

        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, zero_division=0)
        recall = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        roc_auc = roc_auc_score(y_test, y_proba)

        print(f"\nModel: {name}")
        print(f"Accuracy : {accuracy:.3f}")
        print(f"Precision: {precision:.3f}")
        print(f"Recall   : {recall:.3f}")
        print(f"F1 Score : {f1:.3f}")
        print(f"ROC-AUC  : {roc_auc:.3f}")

        if f1 > best_f1:
            best_f1 = f1
            best_model = pipeline
            best_name = name

    joblib.dump(best_model, "models/student_performance_model.joblib")

    print("\nBest Model:", best_name)
    print("Model saved at: models/student_performance_model.joblib")


if __name__ == "__main__":
    train()
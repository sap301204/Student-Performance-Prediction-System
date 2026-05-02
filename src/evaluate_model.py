import os
import joblib
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score
)

from preprocess import add_features


def evaluate():
    os.makedirs("outputs", exist_ok=True)

    df = pd.read_csv("data/students.csv")
    df = add_features(df)

    X = df.drop(columns=["student_id", "final_score", "grade_band", "at_risk"])
    y = df["at_risk"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    model = joblib.load("models/student_performance_model.joblib")

    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, zero_division=0))

    print("ROC-AUC Score:", roc_auc_score(y_test, y_proba))

    cm = confusion_matrix(y_test, y_pred)

    plt.figure(figsize=(6, 4))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
    plt.title("Confusion Matrix")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.savefig("outputs/confusion_matrix.png")
    plt.close()

    plt.figure(figsize=(7, 5))
    sns.histplot(y_proba, bins=30, kde=True)
    plt.title("Risk Probability Distribution")
    plt.xlabel("Predicted Risk Probability")
    plt.ylabel("Count")
    plt.savefig("outputs/risk_distribution.png")
    plt.close()

    print("Evaluation plots saved in outputs/ folder.")


if __name__ == "__main__":
    evaluate()
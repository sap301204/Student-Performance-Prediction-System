import pandas as pd

df = pd.read_csv("data/student_master_dataset.csv")

print("Dataset loaded successfully.")
print("Shape:", df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nFirst 5 rows:")
print(df.head())

print("\nMissing values:")
print(df.isnull().sum())

print("\nTarget distribution:")
print(df["at_risk"].value_counts())

print("\nTarget percentage:")
print(df["at_risk"].value_counts(normalize=True) * 100)
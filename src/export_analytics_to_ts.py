import json
import os
import pandas as pd


def export_analytics_to_ts():
    input_path = "data/student_master_dataset.csv"
    output_path = "apps/web/app/masterData.ts"

    if not os.path.exists(input_path):
        raise FileNotFoundError(
            "data/student_master_dataset.csv not found. Run src/generate_master_dataset.py first."
        )

    df = pd.read_csv(input_path)

    records = df.to_dict(orient="records")

    ts_content = "export const studentRows = "
    ts_content += json.dumps(records, indent=2)
    ts_content += ";\n"

    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as file:
        file.write(ts_content)

    print("masterData.ts created successfully.")
    print(f"Saved at: {output_path}")
    print(f"Total rows exported: {len(records)}")


if __name__ == "__main__":
    export_analytics_to_ts()
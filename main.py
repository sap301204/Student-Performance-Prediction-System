import subprocess


def run_command(command):
    print(f"\nRunning: {command}")
    subprocess.run(command, shell=True, check=True)


if __name__ == "__main__":
    run_command("python src/generate_data.py")
    run_command("python src/train_model.py")
    run_command("python src/evaluate_model.py")
    run_command("python src/predict.py")

    print("\nProject executed successfully.")
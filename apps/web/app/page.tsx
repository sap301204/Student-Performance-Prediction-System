"use client";

import { useState } from "react";

type StudentForm = {
  gender: string;
  school_type: string;
  parent_education: string;
  prior_gpa: number;
  attendance_pct: number;
  quiz_avg: number;
  assignment_avg: number;
  midterm_score: number;
  study_hours_per_week: number;
  on_time_submission_pct: number;
  lms_logins_per_week: number;
  forum_posts: number;
  commute_time: number;
};

type PredictionResult = {
  risk_probability: number;
  risk_percentage: number;
  at_risk: boolean;
  risk_level: string;
  interventions: string[];
  top_factors?: string[];
  note?: string;
};

export default function Home() {
  const [form, setForm] = useState<StudentForm>({
    gender: "Female",
    school_type: "Government",
    parent_education: "Graduate",
    prior_gpa: 5.2,
    attendance_pct: 58,
    quiz_avg: 42,
    assignment_avg: 50,
    midterm_score: 45,
    study_hours_per_week: 3,
    on_time_submission_pct: 48,
    lms_logins_per_week: 2,
    forum_posts: 0,
    commute_time: 65,
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  function updateField(name: keyof StudentForm, value: string) {
    const textFields = ["gender", "school_type", "parent_education"];

    setForm((prev) => ({
      ...prev,
      [name]: textFields.includes(name) ? value : Number(value),
    }));
  }

  function getRiskColor(level: string) {
    if (level === "High Risk") return "text-red-400";
    if (level === "Medium Risk") return "text-orange-400";
    if (level === "Low Risk") return "text-yellow-400";
    return "text-green-400";
  }

  function getRiskBarColor(level: string) {
    if (level === "High Risk") return "bg-red-500";
    if (level === "Medium Risk") return "bg-orange-500";
    if (level === "Low Risk") return "bg-yellow-500";
    return "bg-green-500";
  }

  function getTopRiskFactors(student: StudentForm) {
    const factors: string[] = [];

    if (student.attendance_pct < 70) {
      factors.push(`Low attendance: ${student.attendance_pct}%`);
    }

    if (student.quiz_avg < 55) {
      factors.push(`Low quiz average: ${student.quiz_avg}%`);
    }

    if (student.assignment_avg < 60) {
      factors.push(`Weak assignment score: ${student.assignment_avg}%`);
    }

    if (student.study_hours_per_week < 5) {
      factors.push(`Low study hours: ${student.study_hours_per_week}/week`);
    }

    if (student.lms_logins_per_week < 3) {
      factors.push(`Low LMS activity: ${student.lms_logins_per_week} logins/week`);
    }

    if (student.on_time_submission_pct < 60) {
      factors.push(`Low on-time submission: ${student.on_time_submission_pct}%`);
    }

    if (student.commute_time > 60) {
      factors.push(`High commute time: ${student.commute_time} minutes`);
    }

    if (factors.length === 0) {
      factors.push("No major risk factor detected.");
    }

    return factors;
  }

  async function predictRisk() {
    setLoading(true);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      setResult({
        ...data,
        top_factors: getTopRiskFactors(form),
      });
    } catch (error) {
      alert("Prediction failed. Please check API connection.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <section className="mb-8">
          <p className="text-blue-400 font-semibold mb-2">
            AI + Education Analytics
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Student Performance Prediction System
          </h1>

          <p className="text-slate-300 max-w-4xl">
            An industry-oriented machine learning dashboard that predicts
            academic risk using attendance, quiz scores, assignments, study
            hours, LMS activity, and previous academic performance.
          </p>
        </section>

        <section className="grid md:grid-cols-4 gap-5 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-sm">Attendance</p>
            <h2 className="text-3xl font-bold mt-2">{form.attendance_pct}%</h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-sm">Quiz Average</p>
            <h2 className="text-3xl font-bold mt-2">{form.quiz_avg}%</h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-sm">Study Hours / Week</p>
            <h2 className="text-3xl font-bold mt-2">
              {form.study_hours_per_week}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-sm">LMS Logins / Week</p>
            <h2 className="text-3xl font-bold mt-2">
              {form.lms_logins_per_week}
            </h2>
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-5">Student Input Form</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2"
                >
                  <option>Female</option>
                  <option>Male</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-400">School Type</label>
                <select
                  value={form.school_type}
                  onChange={(e) => updateField("school_type", e.target.value)}
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2"
                >
                  <option>Government</option>
                  <option>Private</option>
                  <option>Semi-Government</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-400">Parent Education</label>
                <select
                  value={form.parent_education}
                  onChange={(e) =>
                    updateField("parent_education", e.target.value)
                  }
                  className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2"
                >
                  <option>High School</option>
                  <option>Graduate</option>
                  <option>Post Graduate</option>
                </select>
              </div>

              <InputBox
                label="Prior GPA"
                value={form.prior_gpa}
                min={0}
                max={10}
                step={0.1}
                onChange={(value) => updateField("prior_gpa", value)}
              />

              <InputBox
                label="Attendance %"
                value={form.attendance_pct}
                min={0}
                max={100}
                onChange={(value) => updateField("attendance_pct", value)}
              />

              <InputBox
                label="Quiz Average"
                value={form.quiz_avg}
                min={0}
                max={100}
                onChange={(value) => updateField("quiz_avg", value)}
              />

              <InputBox
                label="Assignment Average"
                value={form.assignment_avg}
                min={0}
                max={100}
                onChange={(value) => updateField("assignment_avg", value)}
              />

              <InputBox
                label="Midterm Score"
                value={form.midterm_score}
                min={0}
                max={100}
                onChange={(value) => updateField("midterm_score", value)}
              />

              <InputBox
                label="Study Hours / Week"
                value={form.study_hours_per_week}
                min={0}
                max={40}
                onChange={(value) =>
                  updateField("study_hours_per_week", value)
                }
              />

              <InputBox
                label="On-Time Submission %"
                value={form.on_time_submission_pct}
                min={0}
                max={100}
                onChange={(value) =>
                  updateField("on_time_submission_pct", value)
                }
              />

              <InputBox
                label="LMS Logins / Week"
                value={form.lms_logins_per_week}
                min={0}
                max={50}
                onChange={(value) =>
                  updateField("lms_logins_per_week", value)
                }
              />

              <InputBox
                label="Forum Posts"
                value={form.forum_posts}
                min={0}
                max={50}
                onChange={(value) => updateField("forum_posts", value)}
              />

              <InputBox
                label="Commute Time"
                value={form.commute_time}
                min={0}
                max={180}
                onChange={(value) => updateField("commute_time", value)}
              />
            </div>

            <button
              onClick={predictRisk}
              className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
            >
              {loading ? "Predicting..." : "Predict Student Risk"}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-5">Prediction Result</h2>

            {!result && (
              <p className="text-slate-400">
                Enter student details and click the prediction button to generate
                risk analysis.
              </p>
            )}

            {result && (
              <div>
                <div className="mb-6">
                  <p className="text-slate-400">Risk Probability</p>
                  <h3
                    className={`text-5xl font-bold ${getRiskColor(
                      result.risk_level
                    )}`}
                  >
                    {result.risk_percentage}%
                  </h3>

                  <div className="w-full bg-slate-800 rounded-full h-4 mt-4">
                    <div
                      className={`${getRiskBarColor(
                        result.risk_level
                      )} h-4 rounded-full`}
                      style={{ width: `${result.risk_percentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-slate-400">Risk Level</p>
                  <h3
                    className={`text-2xl font-bold ${getRiskColor(
                      result.risk_level
                    )}`}
                  >
                    {result.risk_level}
                  </h3>
                </div>

                <div className="mb-6">
                  <p className="text-slate-400">Status</p>
                  <p className="text-xl">
                    {result.at_risk
                      ? "⚠️ Student Needs Support"
                      : "✅ Student On Track"}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">
                    Top Risk Factors
                  </h3>

                  <ul className="space-y-2 text-slate-300">
                    {result.top_factors?.map((item, index) => (
                      <li
                        key={index}
                        className="bg-slate-800 rounded-xl px-4 py-3"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Recommended Interventions
                  </h3>

                  <ul className="space-y-2 text-slate-300">
                    {result.interventions.map((item, index) => (
                      <li
                        key={index}
                        className="bg-slate-800 rounded-xl px-4 py-3"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {result.note && (
                  <p className="text-xs text-slate-500 mt-5">
                    {result.note}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function InputBox({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm text-slate-400">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2"
      />
    </div>
  );
}
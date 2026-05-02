"use client";

import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const sampleStudent = {
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
  };

  async function predictRisk() {
    setLoading(true);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sampleStudent),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("Prediction failed. Make sure FastAPI is running on port 8000.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <section className="mb-10">
          <p className="text-blue-400 font-semibold mb-2">
            AI + Education Analytics
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Student Performance Prediction System
          </h1>

          <p className="text-slate-300 max-w-3xl">
            A machine learning dashboard that predicts whether a student is
            academically at risk using attendance, quiz scores, assignments,
            study hours, LMS activity, and previous academic performance.
          </p>
        </section>

        <section className="grid md:grid-cols-4 gap-5 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-sm">Attendance</p>
            <h2 className="text-3xl font-bold mt-2">
              {sampleStudent.attendance_pct}%
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-sm">Quiz Average</p>
            <h2 className="text-3xl font-bold mt-2">
              {sampleStudent.quiz_avg}%
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-sm">Study Hours / Week</p>
            <h2 className="text-3xl font-bold mt-2">
              {sampleStudent.study_hours_per_week}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-sm">LMS Logins / Week</p>
            <h2 className="text-3xl font-bold mt-2">
              {sampleStudent.lms_logins_per_week}
            </h2>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Sample Student Profile</h2>

            <div className="space-y-3 text-slate-300">
              <p>Gender: {sampleStudent.gender}</p>
              <p>School Type: {sampleStudent.school_type}</p>
              <p>Parent Education: {sampleStudent.parent_education}</p>
              <p>Prior GPA: {sampleStudent.prior_gpa}</p>
              <p>Midterm Score: {sampleStudent.midterm_score}%</p>
              <p>On-Time Submission: {sampleStudent.on_time_submission_pct}%</p>
              <p>Commute Time: {sampleStudent.commute_time} minutes</p>
            </div>

            <button
              onClick={predictRisk}
              className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
            >
              {loading ? "Predicting..." : "Predict Student Risk"}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Prediction Result</h2>

            {!result && (
              <p className="text-slate-400">
                Click the prediction button to generate student risk analysis.
              </p>
            )}

            {result && (
              <div>
                <div className="mb-5">
                  <p className="text-slate-400">Risk Probability</p>
                  <h3 className="text-4xl font-bold text-yellow-400">
                    {result.risk_percentage}%
                  </h3>
                </div>

                <div className="mb-5">
                  <p className="text-slate-400">Risk Level</p>
                  <h3 className="text-2xl font-bold">
                    {result.risk_level}
                  </h3>
                </div>

                <div className="mb-5">
                  <p className="text-slate-400">Status</p>
                  <p className="text-xl">
                    {result.at_risk
                      ? "⚠️ Student Needs Support"
                      : "✅ Student On Track"}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Recommended Interventions
                  </h3>

                  <ul className="space-y-2 text-slate-300">
                    {result.interventions.map((item: string, index: number) => (
                      <li
                        key={index}
                        className="bg-slate-800 rounded-xl px-4 py-3"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
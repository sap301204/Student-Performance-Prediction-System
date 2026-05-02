"use client";

import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  GraduationCap,
  ClipboardCheck,
  AlertTriangle,
  Activity,
} from "lucide-react";

import { studentRows } from "./masterData";

type StudentForm = {
  gender: string;
  school_type: string;
  grade_name: string;
  branch: string;
  parent_education: string;
  commute_time: number;

  prior_gpa: number;
  attendance_pct: number;
  quiz_avg: number;
  assignment_avg: number;
  midterm_score: number;
  study_hours_per_week: number;
  on_time_submission_pct: number;
  lms_logins_per_week: number;
  forum_posts: number;
  engagement_score: number;

  arts_score: number;
  english_score: number;
  math_score: number;
  phys_ed_score: number;
  science_score: number;
  average_marks: number;
  final_score: number;
  gpa: number;
  exam_status: string;
  grade_band: string;
};

type PredictionResult = {
  risk_probability: number;
  risk_percentage: number;
  at_risk: boolean;
  risk_level: string;
  top_risk_factors: string[];
  interventions: string[];
  note?: string;
};

function average(values: number[]) {
  if (values.length === 0) return 0;

  return Number(
    (values.reduce((sum, value) => sum + Number(value), 0) / values.length).toFixed(2)
  );
}

const gradeColors = ["#4b7378", "#d6d39f", "#78aeb1", "#d8dcc3", "#9eb8bf"];

export default function UnifiedDashboard() {
  const [form, setForm] = useState<StudentForm>({
    gender: "Female",
    school_type: "Government",
    grade_name: "Grade 3",
    branch: "Science",
    parent_education: "Graduate",
    commute_time: 65,

    prior_gpa: 5.2,
    attendance_pct: 58,
    quiz_avg: 42,
    assignment_avg: 50,
    midterm_score: 45,
    study_hours_per_week: 3,
    on_time_submission_pct: 48,
    lms_logins_per_week: 2,
    forum_posts: 0,
    engagement_score: 2.1,

    arts_score: 50,
    english_score: 48,
    math_score: 40,
    phys_ed_score: 55,
    science_score: 44,
    average_marks: 47.4,
    final_score: 49.2,
    gpa: 2,
    exam_status: "Fail",
    grade_band: "D",
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const totalStudents = studentRows.length;

  const averageAttendance = Math.round(
    average(studentRows.map((student: any) => student.attendance_pct))
  );

  const averageGpa = average(studentRows.map((student: any) => student.gpa));

  const atRiskCount = studentRows.filter((student: any) => student.at_risk === 1).length;

  const atRiskPercentage = Math.round((atRiskCount / totalStudents) * 100);

  const subjectScores = useMemo(
    () => [
      {
        name: "Arts",
        value: average(studentRows.map((student: any) => student.arts_score)),
      },
      {
        name: "English",
        value: average(studentRows.map((student: any) => student.english_score)),
      },
      {
        name: "Math's",
        value: average(studentRows.map((student: any) => student.math_score)),
      },
      {
        name: "Phys. Ed",
        value: average(studentRows.map((student: any) => student.phys_ed_score)),
      },
      {
        name: "Science",
        value: average(studentRows.map((student: any) => student.science_score)),
      },
    ],
    []
  );

  const gradeData = useMemo(
    () =>
      ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"].map((grade) => ({
        name: grade,
        value: studentRows.filter((student: any) => student.grade_name === grade).length,
      })),
    []
  );

  const examData = useMemo(() => {
    const branches = ["Arts", "English", "Math's", "Phys.Ed", "Science"];

    return branches.map((branch) => ({
      branch,
      pass: studentRows.filter(
        (student: any) =>
          student.branch === branch && student.exam_status === "Pass"
      ).length,
      fail: studentRows.filter(
        (student: any) =>
          student.branch === branch && student.exam_status === "Fail"
      ).length,
      absent: studentRows.filter(
        (student: any) =>
          student.branch === branch && student.exam_status === "Not Attended"
      ).length,
    }));
  }, []);

  const topAtRiskStudents = useMemo(() => {
    return [...studentRows]
      .filter((student: any) => student.at_risk === 1)
      .sort((a: any, b: any) => a.final_score - b.final_score)
      .slice(0, 10);
  }, []);

  function updateField(name: keyof StudentForm, value: string) {
    const textFields = [
      "gender",
      "school_type",
      "grade_name",
      "branch",
      "parent_education",
      "exam_status",
      "grade_band",
    ];

    setForm((prev) => ({
      ...prev,
      [name]: textFields.includes(name) ? value : Number(value),
    }));
  }

  function getRiskColor(level: string) {
    if (level === "High Risk") return "text-red-600";
    if (level === "Medium Risk") return "text-orange-600";
    if (level === "Low Risk") return "text-yellow-600";
    return "text-green-600";
  }

  function getRiskBarColor(level: string) {
    if (level === "High Risk") return "bg-red-500";
    if (level === "Medium Risk") return "bg-orange-500";
    if (level === "Low Risk") return "bg-yellow-500";
    return "bg-green-500";
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
      setResult(data);
    } catch (error) {
      alert("Prediction failed. Please check API connection.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#f4f0e6] text-[#2d2a26] px-4 py-5">
      <div className="max-w-[1380px] mx-auto border-4 border-[#2d2a26] bg-[#f3efe4] shadow-lg p-5 relative">
        <div className="absolute top-4 right-4 grid grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#2d2a26]" />
          ))}
        </div>

        <header className="mb-5 pr-24">
          <p className="text-xs font-semibold tracking-wide text-[#4b7378]">
            AI + Education Analytics
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Student Performance Intelligence Dashboard
          </h1>

          <p className="text-sm text-[#5d584f] max-w-5xl">
            A unified dashboard for student risk prediction and academic
            performance analysis using one master dataset. It tracks attendance,
            grades, subject scores, engagement, exam outcomes, and recommended
            interventions.
          </p>
        </header>

        <section className="grid grid-cols-12 gap-4 mb-4">
          <KpiCard
            icon={<GraduationCap className="w-7 h-7" />}
            title="Students Count"
            value={String(totalStudents)}
          />

          <KpiCard
            icon={<ClipboardCheck className="w-7 h-7" />}
            title="Avg Attendance"
            value={`${averageAttendance}%`}
          />

          <KpiCard
            icon={<Activity className="w-7 h-7" />}
            title="Average GPA"
            value={String(averageGpa)}
          />

          <KpiCard
            icon={<AlertTriangle className="w-7 h-7" />}
            title="At-Risk Students"
            value={`${atRiskPercentage}%`}
          />
        </section>

        <section className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-12 lg:col-span-6 border border-[#8a8478] p-4 bg-[#f9f6ed]">
            <h2 className="text-lg font-bold mb-4">
              Student Risk Prediction Input
            </h2>

            <div className="grid md:grid-cols-3 gap-3">
              <SelectBox
                label="Gender"
                value={form.gender}
                options={["Female", "Male"]}
                onChange={(value) => updateField("gender", value)}
              />

              <SelectBox
                label="School Type"
                value={form.school_type}
                options={["Government", "Private", "Semi-Government"]}
                onChange={(value) => updateField("school_type", value)}
              />

              <SelectBox
                label="Grade"
                value={form.grade_name}
                options={["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"]}
                onChange={(value) => updateField("grade_name", value)}
              />

              <SelectBox
                label="Branch"
                value={form.branch}
                options={["Arts", "English", "Math's", "Phys.Ed", "Science"]}
                onChange={(value) => updateField("branch", value)}
              />

              <SelectBox
                label="Parent Education"
                value={form.parent_education}
                options={["High School", "Graduate", "Post Graduate"]}
                onChange={(value) => updateField("parent_education", value)}
              />

              <SelectBox
                label="Exam Status"
                value={form.exam_status}
                options={["Pass", "Fail", "Not Attended"]}
                onChange={(value) => updateField("exam_status", value)}
              />

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

              <InputBox
                label="Engagement Score"
                value={form.engagement_score}
                min={0}
                max={30}
                step={0.1}
                onChange={(value) => updateField("engagement_score", value)}
              />

              <SelectBox
                label="Grade Band"
                value={form.grade_band}
                options={["A", "B", "C", "D", "F"]}
                onChange={(value) => updateField("grade_band", value)}
              />

              <InputBox
                label="Arts Score"
                value={form.arts_score}
                min={0}
                max={100}
                onChange={(value) => updateField("arts_score", value)}
              />

              <InputBox
                label="English Score"
                value={form.english_score}
                min={0}
                max={100}
                onChange={(value) => updateField("english_score", value)}
              />

              <InputBox
                label="Math Score"
                value={form.math_score}
                min={0}
                max={100}
                onChange={(value) => updateField("math_score", value)}
              />

              <InputBox
                label="Phys. Ed Score"
                value={form.phys_ed_score}
                min={0}
                max={100}
                onChange={(value) => updateField("phys_ed_score", value)}
              />

              <InputBox
                label="Science Score"
                value={form.science_score}
                min={0}
                max={100}
                onChange={(value) => updateField("science_score", value)}
              />

              <InputBox
                label="Average Marks"
                value={form.average_marks}
                min={0}
                max={100}
                step={0.1}
                onChange={(value) => updateField("average_marks", value)}
              />

              <InputBox
                label="Final Score"
                value={form.final_score}
                min={0}
                max={100}
                step={0.1}
                onChange={(value) => updateField("final_score", value)}
              />

              <InputBox
                label="GPA"
                value={form.gpa}
                min={1}
                max={5}
                onChange={(value) => updateField("gpa", value)}
              />
            </div>

            <button
              onClick={predictRisk}
              className="mt-5 bg-[#4b7378] hover:bg-[#365a5e] text-white px-6 py-3 rounded-full font-semibold"
            >
              {loading ? "Predicting..." : "Predict Student Risk"}
            </button>
          </div>

          <div className="col-span-12 lg:col-span-6 border border-[#8a8478] p-4 bg-[#f9f6ed]">
            <h2 className="text-lg font-bold mb-4">Prediction Result</h2>

            {!result && (
              <p className="text-sm text-[#5d584f]">
                Enter student details and click the prediction button to
                generate risk score, risk factors, and intervention
                recommendations.
              </p>
            )}

            {result && (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-[#5d584f]">Risk Probability</p>
                  <h3
                    className={`text-5xl font-bold ${getRiskColor(
                      result.risk_level
                    )}`}
                  >
                    {result.risk_percentage}%
                  </h3>

                  <div className="w-full bg-[#ded8c8] rounded-full h-4 mt-3">
                    <div
                      className={`${getRiskBarColor(
                        result.risk_level
                      )} h-4 rounded-full`}
                      style={{ width: `${result.risk_percentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <div className="border border-[#8a8478] p-3">
                    <p className="text-sm text-[#5d584f]">Risk Level</p>
                    <h3
                      className={`text-2xl font-bold ${getRiskColor(
                        result.risk_level
                      )}`}
                    >
                      {result.risk_level}
                    </h3>
                  </div>

                  <div className="border border-[#8a8478] p-3">
                    <p className="text-sm text-[#5d584f]">Status</p>
                    <p className="text-lg font-semibold">
                      {result.at_risk
                        ? "⚠️ Student Needs Support"
                        : "✅ Student On Track"}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold mb-2">Top Risk Factors</h3>
                    <ul className="space-y-2 text-sm">
                      {result.top_risk_factors?.map((item, index) => (
                        <li
                          key={index}
                          className="bg-[#ece6d7] border border-[#d0c7b5] px-3 py-2"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold mb-2">Recommended Interventions</h3>
                    <ul className="space-y-2 text-sm">
                      {result.interventions.map((item, index) => (
                        <li
                          key={index}
                          className="bg-[#ece6d7] border border-[#d0c7b5] px-3 py-2"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {result.note && (
                  <p className="text-xs text-[#7b7164] mt-4">{result.note}</p>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-2 border border-[#8a8478] p-2 space-y-2">
            <h2 className="text-sm font-semibold border-b border-[#8a8478] pb-1">
              Average Subject Score
            </h2>

            {subjectScores.map((item) => (
              <GaugeCard key={item.name} title={item.name} value={item.value} />
            ))}
          </div>

          <div className="col-span-12 lg:col-span-4 border border-[#8a8478] p-3">
            <h2 className="text-sm font-semibold mb-2">
              Students Count by Grade
            </h2>

            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                    label={({ value }) => `${value}`}
                  >
                    {gradeData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={gradeColors[index % gradeColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mt-2">
              {gradeData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 inline-block"
                    style={{ backgroundColor: gradeColors[index] }}
                  />
                  {item.name}
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 border border-[#8a8478] p-3">
            <h2 className="text-sm font-semibold mb-2">
              Examination Results by Branch
            </h2>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={examData}>
                  <XAxis dataKey="branch" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="pass" fill="#4b7378" />
                  <Bar dataKey="fail" fill="#d6d39f" />
                  <Bar dataKey="absent" fill="#c8c8c8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 border border-[#8a8478] p-3">
            <h2 className="text-sm font-semibold mb-2">Students Details</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#d6d39f] text-left">
                    <th className="border border-[#8a8478] px-2 py-2">
                      Student Name
                    </th>
                    <th className="border border-[#8a8478] px-2 py-2">
                      Gender
                    </th>
                    <th className="border border-[#8a8478] px-2 py-2">
                      Grade
                    </th>
                    <th className="border border-[#8a8478] px-2 py-2">
                      Marks
                    </th>
                    <th className="border border-[#8a8478] px-2 py-2">
                      GPA
                    </th>
                    <th className="border border-[#8a8478] px-2 py-2">
                      Attendance
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {studentRows.slice(0, 10).map((row: any, index: number) => (
                    <tr key={index} className="bg-[#f9f6ed]">
                      <td className="border border-[#8a8478] px-2 py-2">
                        {row.student_name}
                      </td>

                      <td className="border border-[#8a8478] px-2 py-2">
                        {row.gender}
                      </td>

                      <td className="border border-[#8a8478] px-2 py-2">
                        {row.grade_name}
                      </td>

                      <td
                        className={`border border-[#8a8478] px-2 py-2 ${
                          row.average_marks < 40
                            ? "text-red-600 font-bold"
                            : ""
                        }`}
                      >
                        {row.average_marks}
                      </td>

                      <td className="border border-[#8a8478] px-2 py-2">
                        {row.gpa}
                      </td>

                      <td className="border border-[#8a8478] px-2 py-2">
                        {row.attendance_pct}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 border border-[#8a8478] p-3">
            <h2 className="text-sm font-semibold mb-2">
              Top 10 At-Risk Students Watchlist
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#d6d39f] text-left">
                    <th className="border border-[#8a8478] px-2 py-2">Rank</th>
                    <th className="border border-[#8a8478] px-2 py-2">
                      Student
                    </th>
                    <th className="border border-[#8a8478] px-2 py-2">
                      Final Score
                    </th>
                    <th className="border border-[#8a8478] px-2 py-2">
                      Attendance
                    </th>
                    <th className="border border-[#8a8478] px-2 py-2">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {topAtRiskStudents.map((row: any, index: number) => (
                    <tr key={index} className="bg-[#f9f6ed]">
                      <td className="border border-[#8a8478] px-2 py-2">
                        {index + 1}
                      </td>

                      <td className="border border-[#8a8478] px-2 py-2">
                        {row.student_name}
                      </td>

                      <td className="border border-[#8a8478] px-2 py-2 text-red-600 font-bold">
                        {row.final_score}
                      </td>

                      <td className="border border-[#8a8478] px-2 py-2">
                        {row.attendance_pct}%
                      </td>

                      <td className="border border-[#8a8478] px-2 py-2">
                        Mentor Follow-up
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <p className="text-center text-[11px] text-[#6c665c] mt-4">
          This dashboard uses a synthetic master student dataset for portfolio
          demonstration. Predictions are decision-support outputs and should not
          be used as final academic judgments without advisor review.
        </p>
      </div>
    </main>
  );
}

function KpiCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="col-span-12 md:col-span-3 border border-[#8a8478] bg-[#f9f6ed] flex flex-col items-center justify-center p-5 min-h-[130px]">
      <div className="w-14 h-14 rounded-full bg-[#4b7378] text-white flex items-center justify-center mb-3">
        {icon}
      </div>

      <div className="bg-[#4b7378] text-white px-5 py-2 rounded-full text-xs mb-2">
        {title}
      </div>

      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function GaugeCard({ title, value }: { title: string; value: number }) {
  const chartData = [{ name: "score", value }];

  return (
    <div className="border border-[#8a8478] p-2 bg-[#f9f6ed]">
      <p className="text-sm mb-1">{title}</p>

      <div className="h-[90px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={chartData}
            innerRadius="70%"
            outerRadius="100%"
            startAngle={180}
            endAngle={0}
            barSize={10}
          >
            <RadialBar dataKey="value" cornerRadius={10} fill="#4b7378" />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center -mt-8 text-sm font-semibold">
        {value.toFixed(2)}
      </div>

      <div className="flex justify-between text-[10px] text-[#5d584f] mt-2">
        <span>0</span>
        <span>100</span>
      </div>
    </div>
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
      <label className="text-xs text-[#5d584f]">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 bg-[#f3efe4] border border-[#8a8478] px-3 py-2 text-sm"
      />
    </div>
  );
}

function SelectBox({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-xs text-[#5d584f]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 bg-[#f3efe4] border border-[#8a8478] px-3 py-2 text-sm"
      >
        {options.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>
  );
}
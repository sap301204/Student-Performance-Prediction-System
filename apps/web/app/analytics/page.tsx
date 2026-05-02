"use client";

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

import { GraduationCap, ClipboardCheck } from "lucide-react";
import { studentRows } from "./analyticsData";

function average(values: number[]) {
  return Number(
    (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)
  );
}

const totalStudents = studentRows.length;

const averageAttendance = Math.round(
  average(studentRows.map((student) => student.attendance))
);

const subjectScores = [
  {
    name: "Arts",
    value: average(studentRows.map((student) => student.arts_score)),
  },
  {
    name: "English",
    value: average(studentRows.map((student) => student.english_score)),
  },
  {
    name: "Math's",
    value: average(studentRows.map((student) => student.math_score)),
  },
  {
    name: "Phys. Ed",
    value: average(studentRows.map((student) => student.phys_ed_score)),
  },
  {
    name: "Science",
    value: average(studentRows.map((student) => student.science_score)),
  },
];

const gradeData = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"].map(
  (grade) => ({
    name: grade,
    value: studentRows.filter((student) => student.grade_name === grade).length,
  })
);

const branches = ["Arts", "English", "Math's", "Phys.Ed", "Science"];

const examData = branches.map((branch) => ({
  branch,
  pass: studentRows.filter(
    (student) => student.branch === branch && student.exam_status === "Pass"
  ).length,
  fail: studentRows.filter(
    (student) => student.branch === branch && student.exam_status === "Fail"
  ).length,
  absent: studentRows.filter(
    (student) =>
      student.branch === branch && student.exam_status === "Not Attended"
  ).length,
}));

const gradeColors = ["#4b7378", "#d6d39f", "#78aeb1", "#d8dcc3", "#9eb8bf"];

export default function AnalyticsDashboard() {
  return (
    <main className="min-h-screen bg-[#f4f0e6] text-[#2d2a26] px-6 py-6">
      <div className="max-w-[1280px] mx-auto border-4 border-[#2d2a26] bg-[#f3efe4] shadow-lg p-6 relative">
        <div className="absolute top-4 right-4 grid grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#2d2a26]" />
          ))}
        </div>

        <h1 className="text-4xl font-bold mb-2">
          Student performance analysis evaluation score dashboard
        </h1>

        <p className="text-sm text-[#5d584f] mb-6">
          The following dashboard showcases student performance analytics for
          tracking enrollment, attendance, subject scores, grade distribution,
          and examination outcomes.
        </p>

        <div className="grid grid-cols-12 gap-4">
          {/* Left Subject Score Gauges */}
          <div className="col-span-12 lg:col-span-2 border border-[#8a8478] p-2 space-y-2">
            <h2 className="text-sm font-semibold border-b border-[#8a8478] pb-1">
              Average Subject Score
            </h2>

            {subjectScores.map((item) => (
              <GaugeCard key={item.name} title={item.name} value={item.value} />
            ))}
          </div>

          {/* Grade Donut Chart */}
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

          {/* KPI Cards */}
          <div className="col-span-12 lg:col-span-6 border border-[#8a8478] p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              <KpiCard
                icon={<GraduationCap className="w-7 h-7" />}
                title="Students Count"
                value={String(totalStudents)}
              />

              <KpiCard
                icon={<ClipboardCheck className="w-7 h-7" />}
                title="Students Attendance"
                value={`${averageAttendance}%`}
              />
            </div>
          </div>

          {/* Examination Results Chart */}
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

          {/* Students Details Table */}
          <div className="col-span-12 lg:col-span-6 border border-[#8a8478] p-3">
            <h2 className="text-sm font-semibold mb-2">Students Details</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#d6d39f] text-left">
                    <th className="border border-[#8a8478] px-2 py-2">
                      Student's Name
                    </th>
                    <th className="border border-[#8a8478] px-2 py-2">
                      Gender
                    </th>
                    <th className="border border-[#8a8478] px-2 py-2">
                      Grade Name
                    </th>
                    <th className="border border-[#8a8478] px-2 py-2">
                      Average Marks
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
                  {studentRows.slice(0, 10).map((row, index) => (
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
                        {row.attendance}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-[#6c665c] mt-4">
          Dashboard inspired by academic performance reporting layouts. Data is
          simulated for portfolio demonstration.
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
    <div className="border border-[#8a8478] flex flex-col items-center justify-center p-6 bg-[#f9f6ed] min-h-[130px]">
      <div className="w-16 h-16 rounded-full bg-[#4b7378] text-white flex items-center justify-center mb-3">
        {icon}
      </div>

      <div className="bg-[#4b7378] text-white px-6 py-2 rounded-full text-sm mb-3">
        {title}
      </div>

      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}

function GaugeCard({ title, value }: { title: string; value: number }) {
  const chartData = [{ name: "score", value }];

  return (
    <div className="border border-[#8a8478] p-2 bg-[#f9f6ed]">
      <p className="text-sm mb-1">{title}</p>

      <div className="h-[95px]">
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
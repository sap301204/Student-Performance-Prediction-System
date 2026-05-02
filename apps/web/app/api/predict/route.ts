import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const response = await fetch(
      "https://super-spork-7wwrwgij795xhw564-8000.app.github.dev/predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error("FastAPI backend not available");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({
      risk_probability: 0.72,
      risk_percentage: 72,
      at_risk: true,
      risk_level: "Medium Risk",
      interventions: [
        "Attendance improvement plan",
        "Extra quiz practice and doubt-solving sessions",
        "Assignment tracking and mentor support",
        "Structured weekly study timetable",
        "Increase LMS engagement and learning activity"
      ],
      note: "Demo fallback response shown because FastAPI backend is not deployed."
    });
  }
}
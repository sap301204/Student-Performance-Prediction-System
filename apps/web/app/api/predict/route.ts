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
      risk_probability: 0.91,
      risk_percentage: 91,
      at_risk: true,
      risk_level: "High Risk",
      top_risk_factors: [
        "Low attendance: 58%",
        "Low quiz average: 42%",
        "Weak assignment score: 50%",
        "Low midterm score: 45%",
        "Low study hours: 3/week"
      ],
      interventions: [
        "Create attendance improvement plan with weekly monitoring.",
        "Assign extra quiz practice and revision sessions.",
        "Track assignment completion and provide mentor support.",
        "Schedule subject-wise doubt-solving session.",
        "Create a structured weekly study timetable."
      ],
      note: "Demo fallback response shown because FastAPI backend is not deployed permanently."
    });
  }
}
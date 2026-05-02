import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

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

  const data = await response.json();

  return NextResponse.json(data);
}
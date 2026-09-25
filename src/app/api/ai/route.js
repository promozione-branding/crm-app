// app/api/ai/route.js
import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { input } = await req.json();
    if (!input) {
      return NextResponse.json({ error: "input required" }, { status: 400 });
    }

    const result = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6-luna",
      input,
      store: true,
    });

    return NextResponse.json({ text: result.output_text });
  } catch (err) {
    console.error("OpenAI error:", err);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
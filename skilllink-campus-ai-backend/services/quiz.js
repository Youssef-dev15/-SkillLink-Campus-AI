import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export async function generateQuiz(topic) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `Create a quiz about ${topic}.
Return ONLY JSON.
No markdown.`
      }
    ]
  });

  let text = response.choices[0].message.content;

  console.log("AI RAW:", text);

  text = text.replace(/```json/g, "")
             .replace(/```/g, "")
             .trim();

const parsed = JSON.parse(text);

let list = null;

// نحاولو نفهمو structure متاع AI
if (Array.isArray(parsed)) {
  list = parsed;
} else if (Array.isArray(parsed.questions)) {
  list = parsed.questions;
} else if (Array.isArray(parsed.quiz?.questions)) {
  list = parsed.quiz.questions;
} else if (Array.isArray(parsed.data?.questions)) {
  list = parsed.data.questions;
}

// إذا ما لقا array → نطيحو error واضح
if (!list) {
  console.error("AI STRUCTURE PROBLEM:", parsed);
  throw new Error("AI format invalid");
}


  if (!Array.isArray(list)) {
    throw new Error("AI did not return a valid questions array");
  }

  return list.map(q => ({
    question: q.question,
    options: q.options || q.answers,
    correctAnswer:
      typeof q.answer === "number"
        ? q.answer
        : (q.options || q.answers).indexOf(q.correct || q.answer),
    explanation: "AI generated answer"
  }));
}

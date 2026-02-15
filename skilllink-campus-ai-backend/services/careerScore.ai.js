
import OpenAI from "openai";

export const getCareerScore = async (profile) => {
  try {
    const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY, // gsk-...
  baseURL: "https://api.groq.com/openai/v1"
});

    
    const normalizedSkills =
      Array.isArray(profile.skills) && profile.skills.length > 0
        ? profile.skills.map(s =>
            typeof s === "object"
              ? `${s.name} (level ${s.level})`
              : s
          )
        : [];

 
    if (normalizedSkills.length === 0) {
      return {
        careerScore: 0,
        reason: "No skills mentioned"
      };
    }

    const normalizedProfile = {
      ...profile,
      skills: normalizedSkills
    };

    console.log("PROFILE SENT TO AI:", normalizedProfile);

    const prompt = `
You are a professional career advisor.

Your task is to evaluate career readiness based ONLY on how well the student's skills match their target job.

Rules:
- Return ONLY valid JSON.
- Do NOT include any text outside JSON.
- The score must be an integer from 0 to 100.

Critical rules:
- If skills are null, empty, or missing, return exactly:
  {
    "careerScore": 0,
    "reason": "No skills mentioned"
  }

Scoring logic:
- Compare the listed skills with the requirements of the target job.
- A high score means strong alignment between skills and target job.
- A low score means weak or insufficient alignment.
- Do NOT consider education level, availability, or other factors.

Return exactly this format:
{
  "careerScore": number,
  "reason": "short explanation based on skills vs target job"
}

Student profile:
${JSON.stringify(profile, null, 2)}
`;

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);

    console.log("AI RESULT:", result);

    return result;

  } catch (error) {
    console.error("AI ERROR:", error.message);

    return {
      careerScore: 0,
      reason: "Career analysis not completed yet"
    };
  }
};

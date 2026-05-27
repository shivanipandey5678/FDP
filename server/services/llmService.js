import { client } from "../utils/openaiClient.js";
import { SYSTEM_PROMPT } from "../prompts/systemPrompt.js";

const normalizeOpenAIJson = (text) => {
  let normalized = text.trim();

  if (normalized.startsWith("```")) {
    normalized = normalized
      .replace(/^```(?:json)?\s*/, "")
      .replace(/\s*```$/, "");
  }

  if (normalized.startsWith('"') && normalized.endsWith('"')) {
    try {
      normalized = JSON.parse(normalized);
    } catch {
      // keep original string if parsing fails
    }
  }

  return normalized;
};

export const analyzeConversation = async (messages) => {
  if (!messages || !Array.isArray(messages)) {
    throw new Error("Messages must be a non-empty array");
  }

  console.log("  🤖 OpenAI API Call - Analyzing Conversation");

  const formattedMessages = messages.map((msg) => {
    if (!msg || !msg.role || !msg.content) {
      throw new Error("Each message must have 'role' and 'content' properties");
    }
    return {
      role: msg.role,
      content: msg.content,
    };
  });

 const response = await client.chat.completions.create({
  model: "gpt-4o-mini",

  response_format: {
    type: "json_object",
  },

  temperature: 0,

  messages: [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    ...formattedMessages,
  ],
});


  console.log("  📡 OpenAI Response Received");
  console.log("  🔹 Choices count:", response.choices?.length);
  console.log("  🔹 First message:", response.choices?.[0]?.message);

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned empty response");
  }

  console.log("  📝 Raw AI Response:", content);

  const normalized = normalizeOpenAIJson(content);

  if (typeof normalized !== "string") {
    console.log("  ✅ Successfully parsed object directly:", normalized);
    return normalized;
  }

  try {
    const parsed = JSON.parse(normalized);
    console.log("  ✅ Successfully parsed JSON:", parsed);
    return parsed;
  } catch (parseError) {
    console.error("  ❌ JSON parse failed. Raw content:", normalized);
    throw new Error(`Failed to parse OpenAI response: ${parseError.message}`);
  }
};

export const rankCandidatesWithAI = async (parsed, candidates) => {
  console.log("  🤖 OpenAI API Call - Ranking Candidates");
  console.log("  🔹 Candidates to rank:", candidates.length);

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",

    messages: [
      {
        role: "system",
        content:
          "You are an AI recruitment ranking engine. Analyze candidates and return a JSON array with rankings.",
      },
      {
        role: "user",
        content: `
Hiring Requirements:
${JSON.stringify(parsed)}

Candidates:
${JSON.stringify(candidates)}

Rank candidates based on:
- skills
- experience
- qualification
- cgpa
- location

Return ONLY valid JSON array with no markdown or extra text. Example format:

[
  {
    "id": 1,
    "score": 91,
    "reason": "Strong React skills and excellent CGPA"
  }
]
`,
      },
    ],
  });

  console.log("  📡 OpenAI Ranking Response Received");
  const rankingContent = response.choices[0].message.content;
  console.log("  📝 Raw Ranking Response:", rankingContent);

  const rankedResult = JSON.parse(rankingContent);
  console.log("  ✅ Successfully parsed ranking result");

  return rankedResult;
};

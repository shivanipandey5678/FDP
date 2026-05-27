import OpenAI from "openai";

const apiKey =
  process.env.OPENAI_API_KEY ||
  process.env.OPENAI_ADMIN_KEY ||
  process.env.OPENAI_APIKEY ||
  process.env.OPENAI_KEY;

if (!apiKey) {
  throw new Error(
    "Missing OpenAI API key. Set OPENAI_API_KEY or OPENAI_ADMIN_KEY environment variable.",
  );
}

export const client = new OpenAI({
  apiKey,
});

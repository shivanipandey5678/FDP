import candidates from "../data/candidates.js";

// STEP 1: fake LLM parser
function parsePrompt(prompt) {
  return {
    action: "send_email",
    role: "Backend Developer"
  };
}

// STEP 2: planner
function createPlan(parsed) {
  return [
    "fetch_candidates",
    "generate_emails",
    "send_emails",
    "update_status"
  ];
}

// STEP 3: execution
export const runWorkflow = (req, res) => {
  const { prompt } = req.body;

  const parsed = parsePrompt(prompt);
  const plan = createPlan(parsed);

  // filter candidates
  const filtered = candidates.filter(
    c => c.role === parsed.role
  );

  // simulate email send
  const updated = filtered.map(c => ({
    ...c,
    status: "sent"
  }));

  res.json({
    success: true,
    parsed,
    plan,
    candidates: updated,
    logs: [
      "Parsed prompt",
      "Fetched candidates",
      "Generated emails",
      "Sent emails"
    ]
  });
};
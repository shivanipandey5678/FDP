import candidates from "../data/candidates.js";

import { filterCandidates } from "../services/candidateService.js";

import {
  analyzeConversation,
  rankCandidatesWithAI,
} from "../services/llmService.js";

export const runWorkflow = async (req, res) => {
  try {
    console.log("\n========================================");
    console.log("📨 WORKFLOW REQUEST RECEIVED");
    console.log("========================================");
    console.log("🔹 Time:", new Date().toISOString());

    const { messages } = req.body;
    console.log("🔹 Messages received:", JSON.stringify(messages, null, 2));

    if (!messages || !Array.isArray(messages)) {
      console.error("❌ VALIDATION FAILED: Messages must be an array");
      return res.status(400).json({
        success: false,
        error: "Invalid request. 'messages' must be an array.",
      });
    }

    console.log("✅ Validation passed - messages is valid array\n");

    // STEP 1
    console.log("🔄 STEP 1: Analyzing conversation with AI...");
    const aiResult = await analyzeConversation(messages);
    console.log("✅ STEP 1 COMPLETED");
    console.log("📝 AI Analysis Result:", JSON.stringify(aiResult, null, 2));

    // clarification stop
    if (aiResult.needsClarification) {
      console.log("\n⚠️  CLARIFICATION NEEDED");
      console.log("❓ Question:", aiResult.question);
      console.log(
        "💡 Possible Interpretation:",
        aiResult.possibleInterpretation,
      );
      console.log("📤 Sending clarification response to client...\n");
      return res.json({
        success: true,
        type: "clarification",
        data: {
          question: aiResult.question,
          possibleInterpretation: aiResult.possibleInterpretation || null,
        },
      });
    }

    console.log("✅ No clarification needed - proceeding with execution\n");

    // STEP 2
    console.log("🔄 STEP 2: Filtering candidates from database...");
    console.log("   - Required Role:", aiResult.role);
    console.log("   - Required Experience:", aiResult.experience);
    console.log("   - Required Skills:", aiResult.skills);
    const filteredCandidates = filterCandidates(candidates, aiResult);
    console.log("✅ STEP 2 COMPLETED");
    console.log("🧑‍💼 Filtered Candidates Count:", filteredCandidates.length);
    console.log(
      "📋 Filtered Candidates:",
      JSON.stringify(filteredCandidates, null, 2),
    );

    // STEP 3
    console.log("\n🔄 STEP 3: Ranking candidates with AI...");
    const rankedCandidates = await rankCandidatesWithAI(
      aiResult,
      filteredCandidates,
    );
    console.log("✅ STEP 3 COMPLETED");
    console.log(
      "🏆 Ranked Candidates:",
      JSON.stringify(rankedCandidates, null, 2),
    );

    console.log("\n✅ WORKFLOW EXECUTION SUCCESSFUL");
    console.log("📤 Sending final response to client...");
    console.log("========================================\n");

    return res.json({
      success: true,
      type: "execution",
      data: aiResult,
      candidates: rankedCandidates,
    });
  } catch (error) {
    console.log("\n" + "=".repeat(40));
    console.error("❌ WORKFLOW ERROR OCCURRED");
    console.error("Error Message:", error.message);
    console.error("Stack Trace:", error.stack);
    console.log("=".repeat(40) + "\n");

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

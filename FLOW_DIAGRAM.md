# Complete Application Flow & Debug Roadmap

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLIENT (React - ChatPanel.jsx)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  User types message → handleSendMessage()                                   │
│                                                                               │
│  Creates message object:                                                    │
│  {                                                                          │
│    role: "user",          ← MUST BE STRING                                │
│    content: "input text"  ← MUST BE STRING                                │
│  }                                                                          │
│                                                                               │
│  Adds to messages array with existing messages (including assistant msg)  │
│  updatedMessages = [                                                       │
│    { role: "assistant", content: "Hello..." },                            │
│    { role: "user", content: "I need a React dev..." }                    │
│  ]                                                                          │
│                                                                               │
│  POST /api/workflow/run with JSON.stringify({messages: updatedMessages}) │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                                  │ HTTP POST REQUEST BODY:
                                  │ {
                                  │   "messages": [
                                  │     { "role": "assistant", "content": "..." },
                                  │     { "role": "user", "content": "..." }
                                  │   ]
                                  │ }
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│            BACKEND (Express - workflowController.js)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  CHECKPOINT 1: Validate incoming data                                       │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │ const { messages } = req.body;                              │           │
│  │                                                               │           │
│  │ if (!messages || !Array.isArray(messages)) {                │           │
│  │   return 400 error ← FIRST STOP (user sent malformed data)│           │
│  │ }                                                             │           │
│  │                                                               │           │
│  │ ✓ messages is an array with {role, content} objects        │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                                                                               │
│  STEP 1: ANALYZE CONVERSATION (llmService.js)                              │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │ analyzeConversation(messages)                               │           │
│  │                                                               │           │
│  │ 1. Validate messages array & each message has role/content  │           │
│  │    ✓ All messages formatted correctly                       │           │
│  │                                                               │           │
│  │ 2. Call OpenAI API:                                         │           │
│  │    client.chat.completions.create({                         │           │
│  │      model: "gpt-3.5-turbo",                                │           │
│  │      messages: [                                            │           │
│  │        {role: "system", content: SYSTEM_PROMPT},           │           │
│  │        ...formattedMessages                                 │           │
│  │      ]                                                       │           │
│  │    })                                                         │           │
│  │                                                               │           │
│  │ 3. Expected response structure:                             │           │
│  │    response.choices[0].message.content = JSON string       │           │
│  │    Example: "{\"needsClarification\": false, \"role\":...}"│           │
│  │                                                               │           │
│  │ 4. Parse JSON:                                              │           │
│  │    aiResult = {                                             │           │
│  │      needsClarification: false,                             │           │
│  │      role: "Frontend Developer",     ← EXTRACTED           │           │
│  │      experience: "3",                ← EXTRACTED           │           │
│  │      skills: ["React", "Node.js"]    ← EXTRACTED           │           │
│  │    }                                                         │           │
│  │                                                               │           │
│  │ ⚠️  PROBLEMS THAT CAUSE UNDEFINED:                         │           │
│  │    • OpenAI returns invalid JSON                            │           │
│  │    • OpenAI returns markdown with code blocks               │           │
│  │    • response.choices is empty                              │           │
│  │    • Network timeout                                        │           │
│  │    → aiResult becomes undefined or malformed              │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                                                                               │
│  CHECKPOINT 2: Check if clarification needed                               │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │ if (aiResult.needsClarification) {                          │           │
│  │   return { success: true, data: aiResult }                  │           │
│  │   ← STOP HERE (ask user for more info)                    │           │
│  │ }                                                             │           │
│  │                                                               │           │
│  │ ⚠️  PROBLEM:                                                │           │
│  │    If aiResult is undefined, this line crashes            │           │
│  │    → "Cannot read property 'needsClarification' of undef" │           │
│  │                                                               │           │
│  │ If aiResult = {} (empty object):                           │           │
│  │    → needsClarification is undefined, continues to STEP 2 │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                                                                               │
│  STEP 2: FILTER CANDIDATES (candidateService.js)                           │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │ filterCandidates(candidates, aiResult.parsed)              │           │
│  │                                                               │           │
│  │ But wait... aiResult doesn't have .parsed!                 │           │
│  │ aiResult = { needsClarification, role, experience, skills }│           │
│  │ aiResult.parsed = undefined                                │           │
│  │                                                               │           │
│  │ Inside filterCandidates:                                    │           │
│  │   parsed.role ← undefined.role                             │           │
│  │   → "Cannot read properties of undefined (reading 'role')"│           │
│  │                                                               │           │
│  │ ⚠️  ROOT CAUSE IDENTIFIED:                                 │           │
│  │    The structure mismatch! aiResult has direct props,      │           │
│  │    but code expects aiResult.parsed                        │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                                                                               │
│  STEP 3: RANK CANDIDATES (if STEP 2 succeeded)                             │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │ rankCandidatesWithAI(aiResult.parsed, filteredCandidates) │           │
│  │                                                               │           │
│  │ Same issue: aiResult.parsed is undefined                   │           │
│  │ Would try to JSON.stringify(undefined)                      │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                                                                               │
│  Return response                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CLIENT RECEIVES RESPONSE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  If success: Display results                                               │
│  If 500 error: Show error.message in console                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Root Cause Analysis: Why Role is Sometimes Undefined

### **Problem 1: Data Structure Mismatch** ⚠️ CRITICAL

**Current behavior:**
```javascript
// llmService.js returns:
aiResult = {
  needsClarification: false,
  role: "Frontend Developer",          // ← Direct property
  experience: "3",                     // ← Direct property
  skills: ["React", "Node.js"]         // ← Direct property
}

// But controller expects:
aiResult = {
  needsClarification: false,
  parsed: {                            // ← Nested inside "parsed"
    role: "Frontend Developer",
    experience: "3",
    skills: ["React", "Node.js"]
  }
}
```

**Result:**
- `aiResult.parsed` = undefined
- `filterCandidates(candidates, undefined)` crashes
- Error: "Cannot read properties of undefined (reading 'role')"

### **Problem 2: OpenAI Returns Invalid JSON** ⚠️ INTERMITTENT

When OpenAI returns markdown or extra text:
```
"```json\n{\"role\": \"React Dev\"}\n```"
```

`JSON.parse()` fails, throws error, caught by catch block → 500 error

### **Problem 3: Empty or Malformed Response** ⚠️ INTERMITTENT

If OpenAI returns:
- Empty string: `JSON.parse("")` → error
- Incomplete JSON: `JSON.parse("{\"role\"")` → error
- Response structure changed: `response.choices` = undefined

---

## Step-by-Step Debug Checklist

### Step 1: Verify Client is Sending Correct Format
```javascript
// Check browser DevTools → Network tab
// POST body should look like:
{
  "messages": [
    { "role": "assistant", "content": "Hello..." },
    { "role": "user", "content": "I need..." }
  ]
}

// ✅ Both messages MUST have "role" and "content"
// ✅ role MUST be exactly "user" or "assistant"
```

### Step 2: Verify Server Receives Messages
Add logging in workflowController:
```javascript
const { messages } = req.body;
console.log("📩 Received messages:", JSON.stringify(messages, null, 2));

if (!messages || !Array.isArray(messages)) {
  return res.status(400).json({ error: "Invalid messages" });
}
```

### Step 3: Verify LLM Service Validates Messages
Already added in llmService.js:
```javascript
if (!messages || !Array.isArray(messages)) {
  throw new Error("Messages must be array");
}

const formattedMessages = messages.map((msg) => {
  if (!msg || !msg.role || !msg.content) {
    throw new Error("Each message needs role & content");
  }
  return msg;
});
```

### Step 4: Verify OpenAI Response Format
Add logging in llmService:
```javascript
const response = await client.chat.completions.create({...});
console.log("🤖 OpenAI raw response:", response);
console.log("📝 Message content:", response.choices[0]?.message?.content);
```

### Step 5: Verify JSON Parsing
```javascript
try {
  const content = response.choices[0].message.content;
  console.log("Raw JSON string:", content);
  
  const parsed = JSON.parse(content);
  console.log("Parsed object:", parsed);
  
  return parsed;  // Should have needsClarification, role, experience, skills
} catch (error) {
  console.error("JSON parsing failed:", error);
  console.error("Failed content:", response.choices[0].message.content);
}
```

### Step 6: Fix Data Structure Mismatch
Controller expects `aiResult.parsed`, but llmService returns flat structure.

**Options:**
1. **Wrap response in .parsed** (Controller side - easier)
2. **Update controller to use flat structure** (LLM side - cleaner)

I recommend Option 2:

---

## The Fix

### Fix the Data Structure
In workflowController.js, change:
```javascript
// BEFORE (WRONG):
const filteredCandidates = filterCandidates(
  candidates,
  aiResult.parsed  // ← aiResult.parsed is undefined!
);

// AFTER (CORRECT):
const filteredCandidates = filterCandidates(
  candidates,
  aiResult        // ← aiResult has role, skills, experience directly
);
```

Also update rankCandidatesWithAI call:
```javascript
const rankedCandidates = await rankCandidatesWithAI(
  aiResult,      // ← Not aiResult.parsed
  filteredCandidates
);
```

---

## Summary Table: Where Errors Happen

| Step | Component | Possible Error | Root Cause |
|------|-----------|---|---|
| 1 | ChatPanel (Client) | Message missing role/content | User input format |
| 2 | workflowController | 400 error | messages not an array |
| 3 | llmService validation | "Messages must be array" | Malformed request |
| 4 | OpenAI API call | Network timeout | API down or slow |
| 5 | JSON.parse() | "Unexpected token" | OpenAI returned markdown |
| 6 | filterCandidates() | "Cannot read .role" | **aiResult.parsed is undefined** ← MAIN BUG |
| 7 | rankCandidatesWithAI() | Same as step 6 | Same root cause |

---

## Success Criteria

✅ When working correctly:
1. Client sends: `{messages: [{role, content}, ...]}`
2. Controller validates messages exist & are array
3. llmService calls OpenAI API
4. OpenAI returns: `"{\"needsClarification\": false, \"role\": \"...\"}"`
5. JSON.parse succeeds → aiResult = `{needsClarification, role, experience, skills}`
6. filterCandidates receives aiResult with role property
7. Returns ranked candidates
8. Client shows results

❌ When broken:
- Any of steps 1-5 fail → 500 error with message
- Step 6 fails → "Cannot read properties of undefined (reading 'role')" ← This is the bug

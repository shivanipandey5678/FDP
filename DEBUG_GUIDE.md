# Debugging Guide - What Logs Mean

When you send a message and get an error, here's what to look for in your server terminal:

---

## ✅ Success Flow (what you should see)

```
📩 Received messages: [
  { "role": "assistant", "content": "Hello..." },
  { "role": "user", "content": "I need a React developer..." }
]

📧 Formatted messages validated ✓

🤖 OpenAI response structure: {
  choices: 1,
  firstMessage: { role: "assistant", content: "{...}" }
}

📝 Raw response text: {"needsClarification":false,"role":"Frontend Developer","experience":"3","skills":["React","Node.js"]}

✅ Successfully parsed: {
  needsClarification: false,
  role: 'Frontend Developer',
  experience: '3',
  skills: [ 'React', 'Node.js' ]
}

[Then filtered and ranked candidates...]

✅ Success!
```

---

## ❌ Error Flow 1: Invalid Request from Client

### Error: "Invalid request. 'messages' must be an array."

**What you'll see in server logs:**
```
❌ WORKFLOW ERROR: Invalid request. 'messages' must be an array.
```

**What it means:**
- Client sent `messages: null`, `messages: {}`, or `messages: "string"`
- Instead of: `messages: [{role, content}, ...]`

**Fix:**
- Check ChatPanel.jsx is sending array
- Make sure `updatedMessages` is array, not string

---

## ❌ Error Flow 2: Missing Message Properties

### Error: "Each message must have 'role' and 'content' properties"

**What you'll see in server logs:**
```
❌ WORKFLOW ERROR: Each message must have 'role' and 'content' properties
```

**What it means:**
- One of the messages is missing `role` or `content`
- Example bad message: `{role: "user"}` ← missing content
- Example bad message: `{content: "hello"}` ← missing role

**Fix:**
- Check ChatPanel ensures EVERY message has both properties

---

## ❌ Error Flow 3: OpenAI API Failure

### Error: "OpenAI returned empty response"

**What you'll see in server logs:**
```
🤖 OpenAI response structure: {
  choices: undefined,
  firstMessage: undefined
}

❌ WORKFLOW ERROR: OpenAI returned empty response
```

**What it means:**
- OpenAI API didn't return expected structure
- Possible causes:
  - Invalid API key (but this would fail at startup)
  - API rate limit exceeded
  - Network connection issue
  - API service down

**Fix:**
- Check OPENAI_API_KEY is valid
- Wait a moment and retry
- Check OpenAI status: status.openai.com

---

## ❌ Error Flow 4: JSON Parsing Failed

### Error: "Failed to parse OpenAI response: Unexpected token..."

**What you'll see in server logs:**
```
🤖 OpenAI response structure: {
  choices: 1,
  firstMessage: { role: "assistant", content: "```json\n{...}\n```" }
}

📝 Raw response text: ```json
{"needsClarification":false,...}
```

❌ JSON parse failed. Raw content: ```json
{"needsClarification":false,...}
```

❌ WORKFLOW ERROR: Failed to parse OpenAI response: Unexpected token `
```

**What it means:**
- OpenAI wrapped JSON in markdown code blocks
- Raw text has backticks: ` ```json { } ``` `
- `JSON.parse()` fails because of backticks

**Fix:**
- Improve system prompt to explicitly say "Return ONLY valid JSON, no markdown"
- Add JSON stripping logic:
  ```javascript
  let jsonStr = content.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  }
  return JSON.parse(jsonStr);
  ```

---

## ❌ Error Flow 5: Missing Fields in Parsed Response

### Error: "Missing 'role' in parsed data"

**What you'll see in server logs:**
```
✅ Successfully parsed: {
  needsClarification: false
}

❌ WORKFLOW ERROR: Missing 'role' in parsed data
```

**What it means:**
- OpenAI returned valid JSON, but it doesn't have expected fields
- `role` property is missing from response
- LLM didn't extract the hiring requirement properly

**Fix:**
- Improve SYSTEM_PROMPT to force extraction format
- Add retry logic with different prompt wording

---

## ❌ Error Flow 6: Cannot Read Properties of Undefined

### Error: "Cannot read properties of undefined (reading 'role')"

**What you'll see in server logs:**
```
✅ Successfully parsed: {
  needsClarification: false
}

[Calls filterCandidates with incomplete parsed object]

❌ WORKFLOW ERROR: Cannot read properties of undefined (reading 'role')
```

**What it means:**
- JSON parsed successfully
- But it's missing `role`, `experience`, or `skills`
- filterCandidates tries to access these properties on undefined

**Fix:**
- Update SYSTEM_PROMPT to enforce all required fields
- Example prompt to add:
  ```
  Always return JSON with these exact fields:
  {
    "needsClarification": true/false,
    "role": "job title",
    "experience": "number as string",
    "skills": ["skill1", "skill2"]
  }
  ```

---

## How to Enable Debug Mode

Add this at the top of workflowController.js:

```javascript
const DEBUG = true;  // Set to true to see detailed logs

export const runWorkflow = async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (DEBUG) console.log("📩 Received messages:", JSON.stringify(messages, null, 2));
    
    if (!messages || !Array.isArray(messages)) {
      if (DEBUG) console.log("❌ Messages validation failed");
      return res.status(400).json({
        success: false,
        error: "Invalid request. 'messages' must be an array.",
      });
    }

    if (DEBUG) console.log("✅ Validation passed, calling analyzeConversation");
    
    const aiResult = await analyzeConversation(messages);
    
    if (DEBUG) console.log("📊 aiResult:", JSON.stringify(aiResult, null, 2));
    
    // ... rest of code
```

---

## Checklist When Something Goes Wrong

1. **Check server terminal for logs** - Find the ❌ message
2. **Identify which error type** - Use the error message to find section above
3. **Read "What it means"** - Understand the root cause
4. **Apply "Fix"** - Follow the suggested fix
5. **Try again** - Send another message to test

---

## Test Message Templates

### Test 1: Simple Requirement
```json
{
  "messages": [
    {
      "role": "assistant",
      "content": "Hello. Describe your hiring requirement."
    },
    {
      "role": "user",
      "content": "I need a React developer with 3 years experience who knows JavaScript and Tailwind"
    }
  ]
}
```

**Expected response:**
```json
{
  "needsClarification": false,
  "role": "React developer",
  "experience": "3",
  "skills": ["React", "JavaScript", "Tailwind"]
}
```

### Test 2: Incomplete Requirement (needs clarification)
```json
{
  "messages": [
    {
      "role": "assistant",
      "content": "Hello. Describe your hiring requirement."
    },
    {
      "role": "user",
      "content": "I need a developer"
    }
  ]
}
```

**Expected response:**
```json
{
  "needsClarification": true,
  "question": "What type of developer? (e.g., Frontend, Backend, Full-stack) And how many years of experience?"
}
```

---

## Final Checklist Before Running

✅ `OPENAI_API_KEY` environment variable is set (test with: `echo $env:OPENAI_API_KEY` in PowerShell)
✅ All server validations are in place
✅ All error logs are clear and descriptive
✅ System prompt forces all required fields
✅ JSON parsing handles markdown code blocks
✅ Test with simple message first

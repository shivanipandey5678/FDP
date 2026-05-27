import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ChatPanel = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello. Describe your hiring requirement.",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);

    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/workflow/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        const errorMessage = data.error || "Something went wrong";

        throw new Error(errorMessage);
      }
      console.log(data, "😴");

      let assistantContent = "";

      if (data.type === "clarification") {
        assistantContent = data.data.question;
      } else if (data.type === "execution") {
        assistantContent = `I found ${data.candidates?.length ?? 0} candidate(s) for ${data.data.role || "your request"}.`;
        if (data.data.role) {
          assistantContent += `\nRole: ${data.data.role}`;
        }
        if (data.data.experience) {
          assistantContent += `\nExperience: ${data.data.experience}`;
        }
        if (data.data.skills) {
          assistantContent += `\nSkills: ${data.data.skills.join(", ")}`;
        }
      } else {
        assistantContent = data.data?.question || JSON.stringify(data.data);
      }

      const aiMessage = {
        role: "assistant",
        content: assistantContent,
      };

      console.log(aiMessage, "🌻🗣️");

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error,"🚀🚀🚀🚀🚀🚀");
    }
  };

  return (
    <Card className="lg:col-span-2 bg-card border-border shadow-lg overflow-hidden">
      <div className="h-1 bg-primary"></div>

      <CardHeader>
        <CardTitle className="text-2xl">AI Recruitment Assistant</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Messages */}

        <div className="h-100 overflow-y-auto border rounded-lg p-4 space-y-4 bg-background">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}

        <div className="space-y-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe hiring workflow..."
            className="
                min-h-24
                resize-none
                border-2
                border-blue-500
                rounded-lg
                focus-visible:ring-0
                focus-visible:outline-none
                focus-visible:border-blue-500
            "
          />
          <Button onClick={handleSendMessage} className="w-full">
            Send Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatPanel;

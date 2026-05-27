import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ChatPanel = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;

    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <Card className="lg:col-span-2 bg-card border-border shadow-lg overflow-hidden">
      <div className="h-1 bg-primary"></div>

      <CardHeader>
        <CardTitle className="text-2xl">AI Recruitment Assistant</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
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

        <div className="space-y-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe hiring workflow..."
            className={
              "min-h-24 resize-none border-2 border-blue-500 rounded-lg focus-visible:ring-0 focus-visible:outline-none focus-visible:border-blue-500"
            }
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

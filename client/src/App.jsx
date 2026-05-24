import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Zap, Clock, PlayCircle, Sparkles, Moon, Sun } from "lucide-react";

import WorkflowPanel from "./components/WorkflowPanel";
import JsonOutputPanel from "./components/JsonOutputPanel";
import CandidatesTable from "./components/CandidatesTable";
import EmailPreview from "./components/EmailPreview";
import ExecutionLogs from "./components/ExecutionLogs";

const INITIAL_PROMPT =
  "Send onboarding emails to shortlisted frontend developers.";

function App() {
  const [prompt, setPrompt] = useState(INITIAL_PROMPT);

  const [isExecuting, setIsExecuting] = useState(false);

  const [executionComplete, setExecutionComplete] = useState(false);
  const [result, setResult] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [logs, setLogs] = useState([]);

  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setExecutionComplete(false);
    setResult(null);
    setParsedData(null);
    setCandidates([]);
    setLogs([]);

    try {
      const res = await fetch("http://localhost:5000/api/workflow/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      console.log("Backend response:", data);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to execute workflow");
      }

      setResult(data);
      setParsedData(data.parsed || null);
      setCandidates(data.candidates || []);
      setLogs(
        (data.logs || []).map((message, index) => ({
          id: index,
          level: message.toLowerCase().includes("success") ? "success" : "info",
          message,
          timestamp: new Date().toLocaleTimeString(),
        })),
      );
      setIsExecuting(false);
      setExecutionComplete(true);
    } catch (error) {
      console.error(error);
      setIsExecuting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}

        <div className="mb-16 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>

              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20"
              >
                AI-Powered
              </Badge>
            </div>

            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            Recruitment Workflow Assistant
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground">
            Orchestrate intelligent recruitment workflows with AI automation.
          </p>
        </div>

        {/* Main Grid */}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left */}

          <Card className="lg:col-span-2 bg-card border-border shadow-lg overflow-hidden">
            <div className="h-1 bg-primary"></div>

            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-primary" />

                <CardTitle className="text-2xl">Create Workflow</CardTitle>
              </div>

              <CardDescription className="text-base">
                Describe the recruitment workflow
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Textarea
                placeholder="Send onboarding emails..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32 bg-secondary/50"
                disabled={isExecuting}
              />

              <Button
                onClick={handleExecute}
                disabled={isExecuting || !prompt.trim()}
                size="lg"
                className="w-full h-12"
              >
                {isExecuting ? (
                  <>
                    <Clock className="mr-2 h-5 w-5 animate-spin" />
                    Executing Workflow...
                  </>
                ) : (
                  <>
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Execute Workflow
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right */}

          <WorkflowPanel />
        </div>

        {/* Results */}

        {executionComplete && result && (
          <div className="mt-12 space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <JsonOutputPanel data={parsedData} />
              <CandidatesTable candidates={candidates} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <EmailPreview candidate={candidates[0]} parsed={parsedData} />
              <ExecutionLogs logs={logs} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;

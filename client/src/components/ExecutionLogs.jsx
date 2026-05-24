import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Terminal } from "lucide-react"

const LOGS = [
  {
    timestamp: "2024-05-24 14:32:01",
    level: "info",
    message: "Workflow execution started",
  },
  {
    timestamp: "2024-05-24 14:32:02",
    level: "info",
    message: 'Parsing user intent: "Send onboarding emails"',
  },
  {
    timestamp: "2024-05-24 14:32:03",
    level: "success",
    message: "Intent parsed successfully",
  },
  {
    timestamp: "2024-05-24 14:32:04",
    level: "info",
    message: "Fetching candidates from database",
  },
  {
    timestamp: "2024-05-24 14:32:05",
    level: "success",
    message: "Retrieved 8 candidates",
  },
  {
    timestamp: "2024-05-24 14:32:06",
    level: "info",
    message: "Generating onboarding emails",
  },
  {
    timestamp: "2024-05-24 14:32:08",
    level: "success",
    message: "Generated emails successfully",
  },
]

function getLevelBadge(level) {
  switch (level) {
    case "info":
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 border-blue-500/30 text-blue-400 text-xs"
        >
          INFO
        </Badge>
      )

    case "success":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 text-xs"
        >
          OK
        </Badge>
      )

    default:
      return null
  }
}

export default function ExecutionLogs() {
  return (
    <Card className="bg-card border-border shadow-lg overflow-hidden animate-in fade-in duration-500">

      <div className="h-1 bg-primary"></div>

      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
            <Terminal className="h-5 w-5 text-primary" />
          </div>

          <div>
            <CardTitle className="text-lg">
              Execution Logs
            </CardTitle>

            <CardDescription className="text-sm">
              Real-time system messages
            </CardDescription>
          </div>

        </div>
      </CardHeader>

      <CardContent>
        <div className="bg-secondary border border-border rounded-lg p-4 space-y-1 max-h-96 overflow-y-auto font-mono text-xs">

          {LOGS.map((log, index) => (
            <div
              key={index}
              className="flex items-start gap-2 py-2 px-2 rounded hover:bg-primary/5 transition-colors duration-150"
            >
              <span className="text-muted-foreground/50 shrink-0 w-32">
                {log.timestamp}
              </span>

              <div className="shrink-0">
                {getLevelBadge(log.level)}
              </div>

              <span className="text-foreground/80 flex-1">
                {log.message}
              </span>
            </div>
          ))}

        </div>
      </CardContent>
    </Card>
  )
}
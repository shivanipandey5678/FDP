import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2,  Activity } from "lucide-react"

const WORKFLOW_STEPS = [
  {
    id: 1,
    name: "Parsing Intent",
    description: "Analyzing instructions",
    icon: "🔍",
  },
  {
    id: 2,
    name: "Fetching Candidates",
    description: "Loading database",
    icon: "👥",
  },
  {
    id: 3,
    name: "Generating Emails",
    description: "Creating content",
    icon: "✉️",
  },
  {
    id: 4,
    name: "Sending Emails",
    description: "Delivering messages",
    icon: "📨",
  },
  {
    id: 5,
    name: "Updating Status",
    description: "Finalizing workflow",
    icon: "✓",
  },
]

export default function WorkflowPanel() {
  return (
    <Card className="bg-card border-border shadow-lg overflow-hidden group">

      <div className="h-1 bg-primary"></div>

      <CardHeader className="pb-4">

        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-5 w-5 text-primary" />

          <CardTitle className="text-2xl">
            Execution Status
          </CardTitle>
        </div>

        <CardDescription className="text-base">
          Real-time workflow progress
        </CardDescription>

      </CardHeader>

      <CardContent>
        <div className="space-y-5">

          {WORKFLOW_STEPS.map((step) => (
            <div
              key={step.id}
              className="flex items-start gap-4 p-3 rounded-lg bg-secondary/30"
            >

              <div className="mt-0.5 shrink-0">
                <CheckCircle2 className="h-6 w-6 text-accent" />
              </div>

              <div className="flex-1 min-w-0">

                <div className="flex items-center gap-2 mb-0.5">

                  <span className="text-lg">
                    {step.icon}
                  </span>

                  <p className="font-semibold text-accent">
                    {step.name}
                  </p>

                  <Badge className="ml-auto bg-accent/15 border-accent/30 text-accent text-xs">
                    Complete
                  </Badge>

                </div>

                <p className="text-sm text-muted-foreground/60">
                  {step.description}
                </p>

              </div>

            </div>
          ))}

        </div>

        <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/30">
          <p className="text-sm font-medium text-accent">
            ✓ Workflow completed successfully
          </p>
        </div>

      </CardContent>
    </Card>
  )
}
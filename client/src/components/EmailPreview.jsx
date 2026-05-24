import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Copy } from "lucide-react"

export default function EmailPreview() {
  return (
    <Card className="bg-card border-border shadow-lg overflow-hidden animate-in fade-in duration-500">
      <div className="h-1 bg-primary"></div>

      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Mail className="h-5 w-5 text-primary" />
            </div>

            <div>
              <CardTitle className="text-lg">
                Generated Email
              </CardTitle>

              <CardDescription className="text-sm">
                Sample preview to candidates
              </CardDescription>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="bg-secondary border border-border rounded-lg overflow-hidden">

          <div className="bg-primary/10 border-b border-border p-4 space-y-2">
            <div>
              <div className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wide">
                To
              </div>

              <div className="text-sm font-medium text-foreground">
                alex.chen@example.com
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wide">
                Subject
              </div>

              <div className="text-sm font-medium text-foreground">
                Welcome to Our Team - Let's Get Started
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-4 text-sm text-foreground/90 leading-relaxed">

              <p className="font-medium">Hi Alex,</p>

              <p>
                We're thrilled to have you join our frontend development team!
                We believe your experience and expertise will be a great
                addition to our growing organization.
              </p>

              <p>
                Over the next few days, you'll receive instructions on how to
                get started:
              </p>

              <ul className="space-y-2 ml-4">
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Access to our development environment</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Team introduction and calendar invites</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Project overview and onboarding tasks</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Resource guides and documentation</span>
                </li>
              </ul>

              <p>
                If you have any questions, please don't hesitate to reach out to
                our HR team.
              </p>

              <p>Looking forward to working with you!</p>

              <div className="pt-3">
                <p>Best regards,</p>
                <p className="font-medium text-primary">
                  The Team
                </p>
              </div>

            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
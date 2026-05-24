import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Copy } from "lucide-react";

export default function EmailPreview({ candidate, parsed }) {
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
              <CardTitle className="text-lg">Generated Email</CardTitle>

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
          {candidate ? (
            <>
              <div className="bg-primary/10 border-b border-border p-4 space-y-2">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wide">
                    To
                  </div>

                  <div className="text-sm font-medium text-foreground">
                    {candidate.email}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wide">
                    Subject
                  </div>

                  <div className="text-sm font-medium text-foreground">
                    {parsed?.action === "send_email"
                      ? `Onboarding next steps for ${candidate.name}`
                      : "Recruitment update"}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-4 text-sm text-foreground/90 leading-relaxed">
                  <p className="font-medium">Hi {candidate.name},</p>

                  <p>
                    Thank you for your interest in the {candidate.role} role. We
                    have an exciting next step in the process and want to ensure
                    you are ready to move forward.
                  </p>

                  <p>
                    You have been shortlisted for further consideration, and we
                    will follow up shortly with onboarding details and next
                    steps.
                  </p>

                  <ul className="space-y-2 ml-4">
                    <li className="flex gap-3">
                      <span className="text-primary">•</span>
                      <span>Review the candidate onboarding documents</span>
                    </li>

                    <li className="flex gap-3">
                      <span className="text-primary">•</span>
                      <span>
                        Confirm your availability for the next interview
                      </span>
                    </li>

                    <li className="flex gap-3">
                      <span className="text-primary">•</span>
                      <span>Prepare any questions for the hiring team</span>
                    </li>
                  </ul>

                  <p>
                    If you have any questions, please reply to this message and
                    we will help you right away.
                  </p>

                  <p>Looking forward to connecting soon.</p>

                  <div className="pt-3">
                    <p>Best regards,</p>
                    <p className="font-medium text-primary">Recruitment Team</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 text-sm text-muted-foreground">
              No generated email preview available yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

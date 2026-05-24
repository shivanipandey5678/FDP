import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Mail, Clock, Users } from 'lucide-react'

const CANDIDATES = [
  {
    id: 1,
    name: 'Alex Chen',
    role: 'Frontend Developer',
    experience: '5 years',
    emailStatus: 'sent',
  },
  {
    id: 2,
    name: 'Jordan Smith',
    role: 'Frontend Developer',
    experience: '3 years',
    emailStatus: 'sent',
  },
]

function getStatusIcon(status) {
  switch (status) {
    case 'sent':
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />

    case 'pending':
      return <Clock className="h-4 w-4 text-blue-500" />

    case 'failed':
      return <Mail className="h-4 w-4 text-red-500" />

    default:
      return null
  }
}

function getStatusBadge(status) {
  switch (status) {
    case 'sent':
      return (
        <Badge className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          Sent
        </Badge>
      )

    case 'pending':
      return (
        <Badge className="bg-blue-500/10 border border-blue-500/30 text-blue-400">
          Pending
        </Badge>
      )

    case 'failed':
      return (
        <Badge className="bg-red-500/10 border border-red-500/30 text-red-400">
          Failed
        </Badge>
      )

    default:
      return null
  }
}

export default function CandidatesTable() {
  const sentCount = CANDIDATES.filter(
    (c) => c.emailStatus === 'sent'
  ).length

  const totalCount = CANDIDATES.length

  return (
    <Card className="bg-card border-border shadow-lg overflow-hidden">
      <div className="h-1 bg-primary"></div>

      <CardHeader>
        <div className="flex items-center justify-between">

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
              <Users className="h-5 w-5 text-accent" />
            </div>

            <div>
              <CardTitle>Candidates</CardTitle>

              <CardDescription>
                {sentCount} of {totalCount} emails sent successfully
              </CardDescription>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-accent">
              {Math.round((sentCount / totalCount) * 100)}%
            </div>

            <p className="text-xs text-muted-foreground">
              Complete
            </p>
          </div>

        </div>
      </CardHeader>

      <CardContent>

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3">Name</th>
              <th className="text-left py-3">Role</th>
              <th className="text-left py-3">Experience</th>
              <th className="text-left py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {CANDIDATES.map((candidate) => (
              <tr
                key={candidate.id}
                className="border-b border-border hover:bg-secondary/50"
              >
                <td className="py-4">
                  {candidate.name}
                </td>

                <td>
                  {candidate.role}
                </td>

                <td>
                  {candidate.experience}
                </td>

                <td>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(candidate.emailStatus)}
                    {getStatusBadge(candidate.emailStatus)}
                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </CardContent>
    </Card>
  )
}
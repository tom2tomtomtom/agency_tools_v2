import { teams, prompts } from '@/lib/prompts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Users, FileText } from 'lucide-react';

const teamIcons: Record<string, string> = {
  'behavioural-science-team': '🧠',
  'brand-strategy-team': '🎯',
  'campaign-management-team': '📊',
  'client-experience-team': '👥',
  'creative-integrated-team': '🎨',
  'crisis-communications-team': '🛡️',
  'events-experiential-team': '🎪',
  'government-relations-team': '🏛️',
  'influencer-partnership-team': '🤝',
  'insights-measurement-team': '📈',
  'leadership-team': '👔',
  'new-business-team': '💼',
  'operations-culture-team': '⚙️',
  'pr-media-relations-team': '📣',
  'social-content-team': '📱',
};

export default function HomePage() {
  const totalPrompts = prompts.length;
  const totalTeams = teams.length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          AI Implementation Guide
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The definitive PR & communications AI toolkit with {totalPrompts}+ prompts across {totalTeams} specialized teams
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <StatCard icon={<FileText className="h-5 w-5" />} label="Prompts" value={totalPrompts} />
          <StatCard icon={<Users className="h-5 w-5" />} label="Teams" value={totalTeams} />
          <StatCard icon={<Zap className="h-5 w-5" />} label="Tools" value="Claude & GPT" />
        </div>
      </div>

      {/* Quick Start */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Quick Start
          </CardTitle>
          <CardDescription>
            Get started in 4 simple steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StepCard number={1} title="Choose a solution" description="Find a prompt that addresses your challenge" />
            <StepCard number={2} title="Pick your AI tool" description="Claude Projects or Custom GPT" />
            <StepCard number={3} title="Upload knowledge" description="Add relevant documents for context" />
            <StepCard number={4} title="Paste & go" description="Copy the prompt and start working" />
          </ol>
        </CardContent>
      </Card>

      {/* Teams Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Browse by Team</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map(team => (
            <Link key={team.slug} href={`/team/${team.slug}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{teamIcons[team.slug] || '📁'}</span>
                    <span className="group-hover:text-primary transition-colors">
                      {team.name.replace(' Team', '')}
                    </span>
                  </CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span>{team.solutionCount} AI solutions</span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Tool Recommendations */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Use Claude Projects For</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-0.5">Strategic</Badge>
                <span>Comprehensive PR strategies and earned media campaigns</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-0.5">Sensitive</Badge>
                <span>Government communications and policy briefings</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-0.5">Complex</Badge>
                <span>Behavioral change program development</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-0.5">Long-form</Badge>
                <span>Thought leadership and crisis response plans</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Use Custom GPTs For</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">Daily</Badge>
                <span>Media monitoring and sentiment analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">Quick</Badge>
                <span>Press release and pitch optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">Routine</Badge>
                <span>Meeting notes and action items</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">Content</Badge>
                <span>Social media adaptation and channel optimization</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-3 bg-muted rounded-lg px-4 py-2">
      <div className="text-primary">{icon}</div>
      <div>
        <div className="font-semibold">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
        {number}
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}

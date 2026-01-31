import { teams, prompts } from '@/lib/prompts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Users, FileText, Download, Monitor, Globe, Image } from 'lucide-react';

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
          <StatCard icon={<Zap className="h-5 w-5" />} label="Tools" value="4 AI Tools" />
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
            <StepCard number={2} title="Pick your AI tool" description="Claude Projects, Skills, Cowork, or Perplexity" />
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
      <div>
        <h2 className="text-2xl font-bold mb-4">AI Tool Guide</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Claude Projects
              </CardTitle>
              <CardDescription>Persistent context with uploaded knowledge</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Strategic PR campaigns and brand strategy</li>
                <li>Government communications and policy work</li>
                <li>Behavioral science programs</li>
                <li>Crisis response planning</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Claude Skills
              </CardTitle>
              <CardDescription>Reusable workflows you can download</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>QA testing and creative review</li>
                <li>Stakeholder updates and exec comms</li>
                <li>Copywriting and content transformation</li>
                <li>Process documentation</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                Claude Cowork
              </CardTitle>
              <CardDescription>Desktop automation via Claude Desktop</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>File processing and document creation</li>
                <li>Spreadsheet work and data cleanup</li>
                <li>Meeting notes processing</li>
                <li>+ Chrome extension for web capture</li>
                <li>+ Gemini MCP for image generation</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Perplexity
              </CardTitle>
              <CardDescription>Real-time web research with citations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Client health monitoring signals</li>
                <li>Market intelligence and trends</li>
                <li>Brand refresh signal detection</li>
                <li>Competitive research</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Skills Download */}
      <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Download Claude Skills
          </CardTitle>
          <CardDescription>
            Install these reusable workflows in Claude.ai: Settings → Capabilities → Upload Skill
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SkillDownload name="QA Testing" file="qa-testing.zip" />
            <SkillDownload name="Stakeholder Updates" file="stakeholder-update.zip" />
            <SkillDownload name="Creative Review" file="creative-review.zip" />
            <SkillDownload name="Executive Comms" file="executive-comms.zip" />
            <SkillDownload name="Process Docs" file="process-docs.zip" />
            <SkillDownload name="Copywriting" file="copywriting.zip" />
            <SkillDownload name="Content Transformer" file="content-transformer.zip" />
          </div>
        </CardContent>
      </Card>

      {/* Cowork Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5 text-primary" />
            Cowork + Chrome + Gemini Setup
          </CardTitle>
          <CardDescription>
            Unlock desktop automation, web capture, and image generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">1. Claude Desktop</h4>
              <p className="text-sm text-muted-foreground">
                Download Claude Desktop for macOS. Cowork is available on Pro/Max plans.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="https://claude.com/download" target="_blank" rel="noopener noreferrer">
                  Download Claude Desktop
                </a>
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">2. Chrome Extension</h4>
              <p className="text-sm text-muted-foreground">
                Install Claude in Chrome to let Cowork browse websites and capture screenshots.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="https://claude.com/chrome" target="_blank" rel="noopener noreferrer">
                  Get Chrome Extension
                </a>
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">3. Gemini Image MCP</h4>
              <p className="text-sm text-muted-foreground">
                Add Gemini MCP for AI image generation (ads, visuals, graphics).
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="https://github.com/guinacio/claude-image-gen" target="_blank" rel="noopener noreferrer">
                  Setup Gemini MCP
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
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

function SkillDownload({ name, file }: { name: string; file: string }) {
  return (
    <a
      href={`/skills/${file}`}
      download
      className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
    >
      <Download className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium">{name}</span>
    </a>
  );
}

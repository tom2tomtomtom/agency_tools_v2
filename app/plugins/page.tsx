import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Download, ExternalLink, Zap, Shield, Sparkles } from 'lucide-react';

const plugins = [
  {
    slug: 'crisis-comms',
    name: 'Crisis Communications',
    emoji: '🛡️',
    description: 'Turn Claude into your crisis response expert. Get instant help with response plans, stakeholder messaging, and media management during critical situations.',
    commands: ['/crisis-response', '/stakeholder-update', '/media-statement'],
    useCases: ['Breaking news response', 'Stakeholder communication', 'Media statements'],
    color: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50',
  },
  {
    slug: 'media-relations',
    name: 'Media Relations',
    emoji: '📣',
    description: 'Your PR expert in Claude. Get help writing press releases, crafting pitches that journalists actually open, and analyzing your media coverage.',
    commands: ['/press-release', '/media-pitch', '/coverage-analysis'],
    useCases: ['Product announcements', 'Journalist outreach', 'Coverage reporting'],
    color: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50',
  },
  {
    slug: 'brand-strategy',
    name: 'Brand Strategy',
    emoji: '🎯',
    description: 'Your brand strategist in Claude. Get help with positioning, competitive analysis, and messaging frameworks that actually differentiate.',
    commands: ['/positioning', '/competitor-analysis', '/messaging-framework'],
    useCases: ['Brand positioning', 'Competitive analysis', 'Messaging development'],
    color: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/50',
  },
  {
    slug: 'social-content',
    name: 'Social & Content',
    emoji: '📱',
    description: 'Your content strategist in Claude. Get help creating social posts, planning content calendars, and developing content that actually engages.',
    commands: ['/social-posts', '/content-calendar', '/blog-outline'],
    useCases: ['Social media content', 'Editorial planning', 'Blog writing'],
    color: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50',
  },
  {
    slug: 'client-experience',
    name: 'Client Experience',
    emoji: '👥',
    description: 'Your account management partner in Claude. Get help with meeting notes, proposals, and keeping client relationships healthy.',
    commands: ['/meeting-notes', '/proposal-builder', '/client-health'],
    useCases: ['Meeting summaries', 'Proposal development', 'Account health'],
    color: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/50',
  },
  {
    slug: 'campaign-management',
    name: 'Campaign Management',
    emoji: '📊',
    description: 'Your project management partner in Claude. Get help with timelines, status reports, and keeping campaigns running smoothly.',
    commands: ['/project-plan', '/status-report', '/change-impact'],
    useCases: ['Project planning', 'Status reporting', 'Scope management'],
    color: 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900/50',
  },
];

export default function PluginsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Back link */}
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Prompts
      </Link>

      {/* Hero */}
      <div className="text-center space-y-4 py-4">
        <Badge variant="secondary" className="text-sm">
          <Sparkles className="w-3 h-3 mr-1" />
          For Claude Cowork
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Cowork Plugins
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Turn Claude into a specialist for your PR team. Install in 60 seconds, start working immediately.
        </p>
      </div>

      {/* How it works */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            How Plugins Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">1</div>
              <h3 className="font-semibold">Install the Plugin</h3>
              <p className="text-sm text-muted-foreground">Download the folder and add it to Claude Cowork. Takes 60 seconds.</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">2</div>
              <h3 className="font-semibold">Use Slash Commands</h3>
              <p className="text-sm text-muted-foreground">Type <code className="bg-muted px-1 rounded">/command</code> to get specific help instantly.</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">3</div>
              <h3 className="font-semibold">Claude Knows Your Domain</h3>
              <p className="text-sm text-muted-foreground">Skills load automatically, so Claude understands PR best practices.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plugins Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Plugins</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {plugins.map(plugin => (
            <Card key={plugin.slug} className={`border-2 ${plugin.color}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">{plugin.emoji}</span>
                  <span>{plugin.name}</span>
                </CardTitle>
                <CardDescription className="text-base">
                  {plugin.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Commands */}
                <div>
                  <div className="text-sm font-medium mb-2">Commands</div>
                  <div className="flex flex-wrap gap-2">
                    {plugin.commands.map(cmd => (
                      <Badge key={cmd} variant="secondary" className="font-mono">
                        {cmd}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Use Cases */}
                <div>
                  <div className="text-sm font-medium mb-2">Perfect for</div>
                  <div className="flex flex-wrap gap-2">
                    {plugin.useCases.map(use => (
                      <Badge key={use} variant="outline">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Install Buttons */}
                <div className="pt-2 flex gap-2">
                  <Button className="flex-1" variant="default" asChild>
                    <a href={`/plugins/${plugin.slug}.zip`} download>
                      <Download className="mr-2 h-4 w-4" />
                      Download ZIP
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={`https://github.com/tom2tomtomtom/agency_tools_v2/tree/main/plugins/${plugin.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View on GitHub"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Installation Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Installation Guide
          </CardTitle>
          <CardDescription>
            Step-by-step instructions to get plugins working in Claude Cowork
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h3 className="font-semibold">Option 1: From Cowork Marketplace</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Open Claude Cowork</li>
              <li>Go to <strong>Settings → Plugins</strong></li>
              <li>Search for the plugin name</li>
              <li>Click <strong>Install</strong></li>
            </ol>
          </div>

          <div className="border-t pt-4 space-y-3">
            <h3 className="font-semibold">Option 2: Manual Installation</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Download the plugin folder from GitHub</li>
              <li>In Cowork, go to <strong>Settings → Plugins → Install from folder</strong></li>
              <li>Select the downloaded folder</li>
              <li>The plugin is now active</li>
            </ol>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Optional: Connect Your Tools</h3>
            <p className="text-sm text-muted-foreground">
              Each plugin includes optional connectors for Slack, Notion, Google Drive, and more. 
              These let Claude access your tools directly but aren't required - plugins work great without them.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center py-8 space-y-4">
        <h2 className="text-2xl font-bold">Prefer Standalone Prompts?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          We also have 76+ copy-paste prompts you can use without installing anything.
        </p>
        <Button asChild size="lg">
          <Link href="/">
            Browse All Prompts
          </Link>
        </Button>
      </div>
    </div>
  );
}

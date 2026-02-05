import { notFound } from 'next/navigation';
import { teams, getTeamBySlug, getPromptsByTeam } from '@/lib/prompts';
import { FilteredPromptList } from '@/components/filtered-prompt-list';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

const teamDescriptions: Record<string, string> = {
  'behavioural-science-team': 'Apply behavioral science principles and design evidence-based interventions that drive meaningful behavior change.',
  'brand-strategy-team': 'Develop brand positioning, competitive intelligence, and strategic brand architecture.',
  'campaign-management-team': 'Plan, execute, and track campaigns with AI-powered project management tools.',
  'client-experience-team': 'Enhance client relationships with AI-assisted account management and communication.',
  'creative-integrated-team': 'Create compelling campaigns with integrated creative and storytelling solutions.',
  'crisis-communications-team': 'Respond to crises effectively with AI-powered communication strategies.',
  'events-experiential-team': 'Plan memorable events and brand activations with experiential marketing tools.',
  'government-relations-team': 'Navigate government communications, policy, and stakeholder engagement.',
  'influencer-partnership-team': 'Manage influencer relationships and partnership strategies effectively.',
  'insights-measurement-team': 'Analyze data and measure campaign performance with AI-powered insights.',
  'leadership-team': 'Strategic planning, executive communications, and board-level presentations.',
  'new-business-team': 'Win new business with AI-assisted proposals and pitch development.',
  'operations-culture-team': 'Optimize processes and build team culture with operational excellence tools.',
  'pr-media-relations-team': 'Master media monitoring, journalist outreach, and press release optimization.',
  'social-content-team': 'Create engaging social content and develop messaging strategies.',
};

export async function generateStaticParams() {
  return teams.map(team => ({ slug: team.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) return { title: 'Team Not Found' };
  
  return {
    title: `${team.name} | AI Implementation Guide`,
    description: teamDescriptions[slug] || `AI tools for the ${team.name}`,
  };
}

export default async function TeamPage({ params }: Props) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  
  if (!team) {
    notFound();
  }

  const teamPrompts = getPromptsByTeam(slug);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only">Home</span>
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{team.name}</span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{team.name}</h1>
        <p className="text-lg text-muted-foreground">
          {teamDescriptions[slug] || `AI implementation solutions for the ${team.name}`}
        </p>
        <div className="flex items-center gap-2">
          <Badge>{team.solutionCount} solutions</Badge>
          <Badge variant="outline">Projects, Skills, Cowork & Perplexity</Badge>
        </div>
      </div>

      {/* Prompts with Filter */}
      <FilteredPromptList prompts={teamPrompts} />
    </div>
  );
}

#!/usr/bin/env node
/**
 * Extract prompts from legacy HTML files into structured TypeScript data
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = '/root/clawd/projects/agency_tools';

// Team files to process (excluding index.html and learning-plan.html)
const teamFiles = fs.readdirSync(SOURCE_DIR)
  .filter(f => f.endsWith('-team.html'));

console.log(`Found ${teamFiles.length} team files to process`);

function extractTeamName(filename) {
  // Convert filename like "brand-strategy-team.html" to "Brand Strategy Team"
  return filename
    .replace('.html', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function extractSlug(filename) {
  return filename.replace('.html', '');
}

function extractSolutions(html, teamName, slug) {
  const solutions = [];
  
  // Match solution blocks - both div and section with class="solution"
  // Also match <section id="..." class="solution"> pattern
  const solutionRegex = /<(?:div|section)[^>]*class="[^"]*solution[^"]*"[^>]*>([\s\S]*?)(?=<(?:div|section)[^>]*class="[^"]*solution[^"]*"|<\/main>|<footer|$)/gi;
  const matches = html.matchAll(solutionRegex);
  
  for (const match of matches) {
    const block = match[1];
    
    // Extract solution name - handle different h3 formats
    const nameMatch = block.match(/<h3[^>]*>([^<]+(?:<[^>]+>[^<]*<\/[^>]+>)?[^<]*)<\/h3>/);
    let name = 'Unknown Solution';
    if (nameMatch) {
      // Clean up the name (remove emojis, extra whitespace)
      name = nameMatch[1]
        .replace(/<[^>]+>/g, '')
        .replace(/[🎯📋🔧📊💡🧠📈🎪📱⚡🎤📝🛡️🔍🎨💼🤝🏛️📣💬🌟🚀✨👥💰📰🎬🏆]/g, '')
        .trim();
    }
    
    // Extract tool recommendation
    const toolMatch = block.match(/<strong>Tool Recommendation:\s*([^<]+)<\/strong>/i);
    const toolRecommendation = toolMatch ? toolMatch[1].trim() : 'Claude Project';
    
    // Extract what this does
    const whatMatch = block.match(/<strong>What This Does:<\/strong>\s*([^<]+)/i) ||
                     block.match(/<p><strong>What This Does:<\/strong>\s*([^<]+)/i);
    const description = whatMatch ? whatMatch[1].trim() : '';
    
    // Extract knowledge to upload (handle various header formats)
    const knowledgeItems = [];
    const knowledgeSection = block.match(/(?:Knowledge to Upload|Recommended Knowledge to Upload):<\/h4>\s*<ul>([\s\S]*?)<\/ul>/i);
    if (knowledgeSection) {
      const liMatches = knowledgeSection[1].matchAll(/<li>([^<]+(?:<[^>]+>[^<]*<\/[^>]+>)?[^<]*)<\/li>/gi);
      for (const li of liMatches) {
        const text = li[1].replace(/<[^>]+>/g, '').trim();
        if (text) knowledgeItems.push(text);
      }
    }
    
    // Extract prompt text - handle both pre>code and standalone pre patterns
    const promptMatch = block.match(/<pre><code>([\s\S]*?)<\/code><\/pre>/) ||
                       block.match(/<pre[^>]*>([\s\S]*?)<\/pre>/);
    let promptText = '';
    if (promptMatch) {
      promptText = promptMatch[1]
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/^\n+|\n+$/g, '')
        .trim();
    }
    
    if (promptText && promptText.length > 100) {
      solutions.push({
        id: `${slug}-${solutions.length + 1}`,
        teamSlug: slug,
        teamName,
        name: name || `Solution ${solutions.length + 1}`,
        toolRecommendation,
        description,
        knowledgeToUpload: knowledgeItems,
        prompt: promptText,
      });
    }
  }
  
  return solutions;
}

// Process all team files
const allPrompts = [];
const teams = [];

for (const file of teamFiles) {
  const filepath = path.join(SOURCE_DIR, file);
  const html = fs.readFileSync(filepath, 'utf-8');
  const teamName = extractTeamName(file);
  const slug = extractSlug(file);
  
  const solutions = extractSolutions(html, teamName, slug);
  console.log(`  ${teamName}: ${solutions.length} solutions`);
  
  allPrompts.push(...solutions);
  teams.push({
    slug,
    name: teamName,
    solutionCount: solutions.length,
  });
}

console.log(`\nTotal: ${allPrompts.length} prompts extracted from ${teams.length} teams`);

// Generate TypeScript data file
const tsContent = `// Auto-generated from legacy HTML files
// Run: node scripts/extract-prompts.js

export interface Prompt {
  id: string;
  teamSlug: string;
  teamName: string;
  name: string;
  toolRecommendation: string;
  description: string;
  knowledgeToUpload: string[];
  prompt: string;
}

export interface Team {
  slug: string;
  name: string;
  solutionCount: number;
}

export const teams: Team[] = ${JSON.stringify(teams, null, 2)};

export const prompts: Prompt[] = ${JSON.stringify(allPrompts, null, 2)};

// Utility functions
export function getTeamBySlug(slug: string): Team | undefined {
  return teams.find(t => t.slug === slug);
}

export function getPromptsByTeam(teamSlug: string): Prompt[] {
  return prompts.filter(p => p.teamSlug === teamSlug);
}

export function searchPrompts(query: string): Prompt[] {
  const q = query.toLowerCase();
  return prompts.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.prompt.toLowerCase().includes(q) ||
    p.teamName.toLowerCase().includes(q)
  );
}
`;

// Write to data directory
const outDir = '/root/clawd/projects/agency_tools_v2/lib';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'prompts.ts'), tsContent);
console.log(`\nWritten to ${outDir}/prompts.ts`);

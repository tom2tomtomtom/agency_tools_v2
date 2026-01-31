# Agency Tools v2

A modern, searchable AI Implementation Guide for PR & Communications teams.

![Next.js](https://img.shields.io/badge/Next.js-15+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4+-38B2AC)

## Features

- 🔍 **Fuzzy Search** - Find prompts instantly across all teams
- ⌘K **Command Palette** - Quick navigation with keyboard shortcuts
- ⭐ **Favorites** - Save your most-used prompts locally
- 🌙 **Dark Mode** - System-aware theme support
- 📱 **Mobile Responsive** - Works great on all devices
- 💬 **AI Chat Widget** - Get personalized recommendations (Claude or Perplexity)
- 📋 **One-Click Copy** - Copy prompts with a single click
- 🔗 **Open in Claude** - Deep links to start using prompts immediately

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/tom2tomtomtom/agency_tools_v2.git
cd agency_tools_v2

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

Create a `.env.local` file for optional configuration:

```bash
# Optional: Plausible Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com

# The chat widget uses client-side API keys (stored in localStorage)
# Users enter their own Claude or OpenAI API keys
```

## Project Structure

```
agency_tools_v2/
├── app/
│   ├── api/chat/       # AI chat API route
│   ├── favorites/      # Favorites page
│   ├── search/         # Search page
│   └── team/[slug]/    # Dynamic team pages
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── chat-widget.tsx # AI recommendation chat
│   ├── command-menu.tsx # ⌘K search palette
│   ├── prompt-card.tsx # Expandable prompt card
│   └── sidebar.tsx     # Navigation sidebar
├── hooks/
│   ├── use-analytics.ts # Analytics tracking
│   └── use-favorites.ts # localStorage favorites
├── lib/
│   ├── prompts.ts      # All 76 prompts data
│   └── utils.ts        # Utility functions
└── scripts/
    └── extract-prompts.js # HTML → TypeScript extractor
```

## Data

76 AI prompts across 15 specialized teams:

| Team | Prompts |
|------|---------|
| Behavioural Science | 5 |
| Brand Strategy | 5 |
| Campaign Management | 5 |
| Client Experience | 6 |
| Creative Integrated | 5 |
| Crisis Communications | 5 |
| Events Experiential | 5 |
| Government Relations | 5 |
| Influencer Partnership | 5 |
| Insights Measurement | 5 |
| Leadership | 5 |
| New Business | 5 |
| Operations Culture | 5 |
| PR Media Relations | 5 |
| Social Content | 5 |

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftom2tomtomtom%2Fagency_tools_v2)

1. Click the button above or connect your GitHub repo to Vercel
2. No environment variables required for basic deployment
3. The app will be live in minutes!

### Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Updating Prompts

If you need to update the prompts from the original HTML files:

```bash
# Run the extraction script
node scripts/extract-prompts.js

# Rebuild the app
npm run build
```

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **Search**: Fuse.js
- **Animations**: Framer Motion
- **Icons**: Lucide React

## License

MIT

---

Built with ❤️ by Claude

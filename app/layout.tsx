import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/sidebar";
import { CommandMenu } from "@/components/command-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChatWidget } from "@/components/chat-widget";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Implementation Guide | PR & Communications Toolkit",
  description: "76+ AI prompts across 15 specialized teams for PR, communications, and brand strategy",
  keywords: ["AI", "PR", "communications", "prompts", "Claude", "Perplexity"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Accessibility: Skip to main content link */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-0 md:ml-64">
              <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b">
                <div className="flex items-center justify-between px-4 md:px-6 h-16">
                  {/* Spacer for mobile menu button */}
                  <div className="w-10 md:hidden" />
                  <h1 className="text-lg md:text-xl font-semibold">AI Implementation Guide</h1>
                  <div className="flex items-center gap-3">
                    <CommandMenu />
                    <ThemeToggle />
                  </div>
                </div>
              </header>
              <main id="main-content" tabIndex={-1} className="p-4 md:p-6 outline-none">
                {children}
              </main>
            </main>
          </div>
          <ChatWidget />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/sidebar";
import { CommandMenu } from "@/components/command-menu";
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
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64">
              <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b">
                <div className="flex items-center justify-between px-6 h-16">
                  <h1 className="text-xl font-semibold">AI Implementation Guide</h1>
                  <CommandMenu />
                </div>
              </header>
              <div className="p-6">
                {children}
              </div>
            </main>
          </div>
          <ChatWidget />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
\n<!-- deploy trigger 1769832928 -->

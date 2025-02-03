import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            Welcome to pouria.ai
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-slate-600 dark:text-slate-300">
            This website is currently under construction. A new and exciting
            portfolio website is coming soon! Stay tuned for updates showcasing
            research, projects, and more.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

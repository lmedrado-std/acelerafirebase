import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Puzzle } from "lucide-react";

export default function QuizPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Puzzle className="size-8 text-primary" />
        <h1 className="text-3xl font-bold">Quizzes</h1>
      </div>
      <Card className="bg-card border-border">
        <CardHeader>
            <CardTitle>Em Breve</CardTitle>
            <CardDescription>Nosso sistema de quizzes está sendo aprimorado!</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center text-muted-foreground border-2 border-dashed border-border rounded-lg p-12">
              <Puzzle className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 font-semibold">Funcionalidade em desenvolvimento.</p>
              <p className="text-sm">
                Em breve você poderá testar seus conhecimentos e ganhar pontos.
              </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

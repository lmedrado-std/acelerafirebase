import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Quiz from "@/components/quiz";
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
          <CardTitle className="text-xl">Teste seus Conhecimentos</CardTitle>
          <CardDescription>Gere quizzes aleatórios para treinar e acumular pontos.</CardDescription>
        </CardHeader>
        <CardContent>
            <Quiz />
        </CardContent>
      </Card>
    </div>
  );
}

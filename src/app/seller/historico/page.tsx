import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { History } from "lucide-react";

export default function HistoricoPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <History className="size-8 text-primary" />
        <h1 className="text-3xl font-bold">Meu Histórico</h1>
      </div>
      <Card className="bg-card border-border">
        <CardHeader>
            <CardTitle>Em Breve</CardTitle>
            <CardDescription>A funcionalidade de histórico está sendo preparada!</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center text-muted-foreground border-2 border-dashed border-border rounded-lg p-12">
              <History className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 font-semibold">Funcionalidade em desenvolvimento.</p>
              <p className="text-sm">
                Em breve você poderá comparar sua evolução com ciclos de premiação anteriores.
              </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export default function AcademiaPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <GraduationCap className="size-8 text-primary" />
        <h1 className="text-3xl font-bold">Academia de Vendas</h1>
      </div>
      <Card className="bg-card border-border">
        <CardHeader>
            <CardTitle>Em Breve</CardTitle>
            <CardDescription>Nossa academia de vendas está recebendo novos cursos!</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center text-muted-foreground border-2 border-dashed border-border rounded-lg p-12">
              <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 font-semibold">Funcionalidade em desenvolvimento.</p>
              <p className="text-sm">
                Em breve você poderá fazer cursos interativos e ganhar pontos.
              </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

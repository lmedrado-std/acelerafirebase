'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Puzzle, Target, Shield, BookCopy, ShoppingBag } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Shield className="size-8 text-primary" />
        <h1 className="text-3xl font-bold">Painel de Administração</h1>
      </div>

      <Tabs defaultValue="cursos" className="w-full">
        <div className="flex items-center gap-4">
          <TabsList className="bg-card p-1 h-auto">
            <TabsTrigger value="cursos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
              <GraduationCap className="mr-2 size-5" /> Cursos
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
              <Puzzle className="mr-2 size-5" /> Quizzes
            </TabsTrigger>
            <TabsTrigger value="missoes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
              <Target className="mr-2 size-5" /> Missões
            </TabsTrigger>
            <TabsTrigger value="loja" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
              <ShoppingBag className="mr-2 size-5" /> Loja
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="cursos">
          <Card className="bg-card mt-4 border-border">
            <CardHeader>
              <CardTitle className="text-xl">Gerenciar Cursos da Academia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Curso</Label>
                  <Input id="title" placeholder="Título do Curso" className="bg-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição do Curso</Label>
                  <Textarea id="description" placeholder="Descrição do Curso" className="bg-input" rows={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">Pontos de Recompensa</Label>
                  <Input id="points" placeholder="Pontos de Recompensa" type="number" className="bg-input" />
                </div>
                 <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground font-semibold">
                    Criar Novo Curso
                </Button>
              </form>

              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="text-lg font-semibold">Cursos Existentes</h3>
                <div className="text-center text-muted-foreground border-2 border-dashed border-border rounded-lg p-8">
                  <BookCopy className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 font-semibold">Nenhum curso encontrado</p>
                  <p className="text-sm">Crie um novo curso para começar a gerenciar.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quizzes">
           <Card className="bg-card mt-4 border-border"><CardContent className="p-6 text-center text-muted-foreground">Funcionalidade de Quizzes em breve...</CardContent></Card>
        </TabsContent>
        <TabsContent value="missoes">
           <Card className="bg-card mt-4 border-border"><CardContent className="p-6 text-center text-muted-foreground">Funcionalidade de Missões em breve...</CardContent></Card>
        </TabsContent>
        <TabsContent value="loja">
           <Card className="bg-card mt-4 border-border"><CardContent className="p-6 text-center text-muted-foreground">Funcionalidade da Loja em breve...</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

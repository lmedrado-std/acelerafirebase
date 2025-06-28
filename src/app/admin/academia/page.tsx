'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Sparkles, BookCopy, Trash2, GraduationCap, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import { generateCourse } from "@/ai/flows/generate-course-flow";
import type { Course } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function AcademiaPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isGeneratingCourse, setIsGeneratingCourse] = useState(false);
  const { toast } = useToast();

  const courseTopics = [
    'Técnicas de Atendimento ao Cliente para Lojas de Calçados',
    'Conhecimento de Materiais: Couro, Sintéticos e Tecidos',
    'Como Lidar com Objeções de Clientes e Fechar Vendas',
    'Organização de Estoque e Vitrinismo para Calçados',
    'Vendas Adicionais: Como Oferecer Meias e Produtos de Limpeza'
  ];

  const handleGenerateCourse = async () => {
    setIsGeneratingCourse(true);
    try {
      const randomTopic = courseTopics[Math.floor(Math.random() * courseTopics.length)];
      const result = await generateCourse({ topic: randomTopic });
      
      const newCourse: Course = {
        id: new Date().getTime().toString(),
        ...result,
      };
      setCourses(prev => [...prev, newCourse]);
      toast({
        title: "Curso Gerado com Sucesso!",
        description: `O curso "${result.title}" foi criado.`,
      });
    } catch (error) {
      console.error("Failed to generate course:", error);
      toast({
        variant: 'destructive',
        title: 'Falha ao Gerar Curso',
        description: 'A IA não conseguiu gerar o conteúdo. Por favor, tente novamente.',
      });
    } finally {
      setIsGeneratingCourse(false);
    }
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <GraduationCap className="size-8 text-primary" />
        <h1 className="text-3xl font-bold">Academia de Vendas</h1>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl">Gerenciar Cursos da Academia</CardTitle>
          <CardDescription>Gere e gerencie os cursos de treinamento para os vendedores usando IA.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 border rounded-lg border-border">
            <h3 className="text-lg font-semibold">Gerador de Cursos</h3>
            <p className="text-muted-foreground mb-4">Clique no botão para gerar um curso completo com um tópico aleatório sobre vendas de calçados.</p>
            <Button onClick={handleGenerateCourse} disabled={isGeneratingCourse} className="bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground font-semibold">
              {isGeneratingCourse ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Gerar Curso com IA
            </Button>
          </div>

          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-lg font-semibold">Cursos Existentes</h3>
            {courses.length > 0 ? (
              <div className="space-y-4">
                {courses.map((course) => (
                  <Card key={course.id} className="bg-background/50">
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                            <CardTitle>{course.title}</CardTitle>
                            <CardDescription>{course.description}</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCourse(course.id)} aria-label="Remover curso">
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {course.modules && course.modules.length > 0 && (
                            <AccordionItem value="modules">
                            <AccordionTrigger>Módulos do Curso</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4">
                                    {course.modules.map((module, index) => (
                                        <div key={index} className="p-4 rounded-lg bg-input">
                                            <h4 className="font-semibold text-lg">{module.title}</h4>
                                            <div className="prose prose-sm prose-invert mt-2 text-muted-foreground">
                                                <ReactMarkdown>{module.content}</ReactMarkdown>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                            </AccordionItem>
                        )}
                        {course.quiz && course.quiz.questions.length > 0 && (
                            <AccordionItem value="quiz">
                            <AccordionTrigger>Quiz Final ({course.quiz.title})</AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-6">
                                {course.quiz.questions.map((q, i) => (
                                  <div key={i}>
                                    <p><strong>{i + 1}. {q.questionText}</strong></p>
                                    <ul className="mt-2 space-y-1 list-disc pl-5">
                                      {q.options.map((opt, j) => (
                                        <li key={j} className={cn(j === q.correctAnswerIndex && "font-bold text-primary")}>
                                          {opt}
                                        </li>
                                      ))}
                                    </ul>
                                    <p className="text-sm text-muted-foreground mt-2">
                                      <span className="font-semibold">Explicação:</span> {q.explanation}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )}
                      </Accordion>
                    </CardContent>
                     <CardFooter>
                        <div className="text-sm font-semibold flex items-center">
                            <Star className="mr-2 size-4 text-yellow-400" />
                            <span>{course.points} Pontos</span>
                        </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground border-2 border-dashed border-border rounded-lg p-8">
                <BookCopy className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 font-semibold">Nenhum curso encontrado</p>
                <p className="text-sm">Gere um novo curso com IA para começar.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

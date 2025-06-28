'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Puzzle, Target, Shield, BookCopy, ShoppingBag, Users, Trash2, Flag, CalendarRange, CalendarIcon, Star, Loader2, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminContext } from '@/app/admin/layout';
import type { Seller, Goals, GoalLevels, Course, Mission } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Quiz from "@/components/quiz";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { generateCourse } from "@/ai/flows/generate-course-flow";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';


export default function SettingsPage() {
  const { sellers, setSellers, goals, setGoals, missions, setMissions } = useAdminContext();
  const [sellerName, setSellerName] = useState('');
  const { toast } = useToast();

  const [periods, setPeriods] = useState([
    { id: '1', name: 'Mês de Julho', startDate: new Date(2024, 6, 1), endDate: new Date(2024, 6, 31) },
    { id: '2', name: 'Mês de Agosto', startDate: new Date(2024, 7, 1), endDate: new Date(2024, 7, 31) },
  ]);
  const [periodName, setPeriodName] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [isGeneratingCourse, setIsGeneratingCourse] = useState(false);
  
  const [missionName, setMissionName] = useState('');
  const [missionDescription, setMissionDescription] = useState('');
  const [missionPoints, setMissionPoints] = useState('');
  const [missionStartDate, setMissionStartDate] = useState<Date>();
  const [missionEndDate, setMissionEndDate] = useState<Date>();

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
        description: 'Não foi possível gerar o curso. Tente novamente.',
      });
    } finally {
      setIsGeneratingCourse(false);
    }
  };
  
  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  }
  
  const handleAddMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!missionName.trim() || !missionPoints || !missionStartDate || !missionEndDate) return;

    const newMission: Mission = {
      id: new Date().getTime().toString(),
      name: missionName,
      description: missionDescription,
      points: parseInt(missionPoints, 10),
      startDate: missionStartDate,
      endDate: missionEndDate,
    };
    setMissions(prev => [...prev, newMission]);
    setMissionName('');
    setMissionDescription('');
    setMissionPoints('');
    setMissionStartDate(undefined);
    setMissionEndDate(undefined);
  };

  const handleDeleteMission = (id: string) => {
    setMissions(prev => prev.filter(m => m.id !== id));
  };

  const handleGoalChange = (
    criterion: keyof Goals,
    level: keyof GoalLevels,
    value: string
  ) => {
    setGoals(prev => ({
      ...prev,
      [criterion]: {
        ...prev[criterion],
        [level]: parseFloat(value) || 0,
      },
    }));
  };

  const handleAddSeller = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sellerName.trim()) return;

    const newSeller: Seller = {
      id: new Date().getTime().toString(),
      name: sellerName,
      salesValue: 0,
      ticketAverage: 0,
      pa: 0,
      points: 0,
    };
    setSellers(prevSellers => [...prevSellers, newSeller]);
    setSellerName('');
  };

  const handleSellerUpdate = (id: string, field: keyof Omit<Seller, 'id' | 'name'>, value: string) => {
    setSellers(prevSellers =>
      prevSellers.map(seller =>
        seller.id === id ? { ...seller, [field]: parseFloat(value) || 0 } : seller
      )
    );
  };

  const handleDeleteSeller = (id: string) => {
    setSellers(prevSellers => prevSellers.filter(seller => seller.id !== id));
  };
  
  const handleAddPeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodName.trim() || !startDate || !endDate) return;

    const newPeriod = {
      id: new Date().getTime().toString(),
      name: periodName,
      startDate,
      endDate,
    };
    setPeriods(prev => [...prev, newPeriod]);
    setPeriodName('');
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleDeletePeriod = (id: string) => {
    setPeriods(prev => prev.filter(p => p.id !== id));
  };


  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Shield className="size-8 text-primary" />
        <h1 className="text-3xl font-bold">Painel de Administração</h1>
      </div>

      <Tabs defaultValue="vendedores" className="w-full">
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
            <TabsTrigger value="vendedores" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
              <Users className="mr-2 size-5" /> Vendedores
            </TabsTrigger>
             <TabsTrigger value="metas" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
              <Flag className="mr-2 size-5" /> Metas
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="cursos">
          <Card className="bg-card mt-4 border-border">
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
        </TabsContent>
        <TabsContent value="quizzes">
           <Card className="bg-card mt-4 border-border">
              <Quiz />
           </Card>
        </TabsContent>
        <TabsContent value="missoes">
           <Card className="bg-card mt-4 border-border">
             <CardHeader>
              <CardTitle className="text-xl">Gerenciar Missões</CardTitle>
              <CardDescription>Crie e gerencie as missões para os vendedores.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <form onSubmit={handleAddMission} className="space-y-4 p-6 border rounded-lg border-border">
                <h3 className="text-lg font-semibold">Criar Nova Missão</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="missionName">Nome da Missão</Label>
                    <Input id="missionName" placeholder="Ex: Vender 5 Pares do Modelo X" className="bg-input" value={missionName} onChange={(e) => setMissionName(e.target.value)} required />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="missionPoints">Pontos de Recompensa</Label>
                    <Input id="missionPoints" placeholder="Ex: 200" type="number" className="bg-input" value={missionPoints} onChange={(e) => setMissionPoints(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="missionDescription">Descrição da Missão</Label>
                  <Textarea id="missionDescription" placeholder="Descreva o objetivo da missão." className="bg-input" rows={2} value={missionDescription} onChange={(e) => setMissionDescription(e.target.value)} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="missionStartDate">Data de Início</Label>
                     <Popover>
                      <PopoverTrigger asChild>
                        <Button id="missionStartDate" variant={'outline'} className={cn('w-full justify-start text-left font-normal bg-input', !missionStartDate && 'text-muted-foreground')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {missionStartDate ? format(missionStartDate, 'PPP') : <span>Escolha uma data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={missionStartDate} onSelect={setMissionStartDate} initialFocus /></PopoverContent>
                    </Popover>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="missionEndDate">Data de Fim</Label>
                     <Popover>
                      <PopoverTrigger asChild>
                        <Button id="missionEndDate" variant={'outline'} className={cn('w-full justify-start text-left font-normal bg-input', !missionEndDate && 'text-muted-foreground')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {missionEndDate ? format(missionEndDate, 'PPP') : <span>Escolha uma data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={missionEndDate} onSelect={setMissionEndDate} initialFocus disabled={{ before: missionStartDate }} /></PopoverContent>
                    </Popover>
                  </div>
                </div>
                 <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground font-semibold">
                    Criar Nova Missão
                </Button>
              </form>
              
               <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="text-lg font-semibold">Missões Ativas</h3>
                {missions.length > 0 ? (
                   <div className="rounded-md border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Missão</TableHead>
                          <TableHead>Período</TableHead>
                          <TableHead className="text-center">Pontos</TableHead>
                          <TableHead className="text-center">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {missions.map((mission) => (
                          <TableRow key={mission.id}>
                            <TableCell className="font-medium">{mission.name}</TableCell>
                            <TableCell>{format(mission.startDate, 'dd/MM/yy')} - {format(mission.endDate, 'dd/MM/yy')}</TableCell>
                            <TableCell className="text-center font-semibold">{mission.points}</TableCell>
                            <TableCell className="text-center">
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteMission(mission.id)} aria-label="Remover missão">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground border-2 border-dashed border-border rounded-lg p-8">
                    <Target className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 font-semibold">Nenhuma missão encontrada</p>
                    <p className="text-sm">Crie uma nova missão para engajar seus vendedores.</p>
                  </div>
                )}
              </div>
            </CardContent>
           </Card>
        </TabsContent>
        <TabsContent value="loja">
           <Card className="bg-card mt-4 border-border"><CardContent className="p-6 text-center text-muted-foreground">Funcionalidade da Loja em breve...</CardContent></Card>
        </TabsContent>
        <TabsContent value="vendedores" className="space-y-6 mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-xl">Vendedores Cadastrados</CardTitle>
              <CardDescription>Gerencie os dados de vendas diárias e pontos dos vendedores.</CardDescription>
            </CardHeader>
            <CardContent>
                 {sellers.length > 0 ? (
                  <div className="rounded-md border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vendedor</TableHead>
                          <TableHead className="text-right">Valor de Venda (R$)</TableHead>
                          <TableHead className="text-right">Ticket Médio (R$)</TableHead>
                          <TableHead className="text-right">PA</TableHead>
                          <TableHead className="text-right">Pontos</TableHead>
                          <TableHead className="text-center">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sellers.map((seller) => (
                          <TableRow key={seller.id}>
                            <TableCell className="font-medium">{seller.name}</TableCell>
                            <TableCell>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground">R$</span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  className="bg-input pl-10 text-right min-w-[140px]"
                                  value={seller.salesValue}
                                  onChange={(e) => handleSellerUpdate(seller.id, 'salesValue', e.target.value)}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground">R$</span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  className="bg-input pl-10 text-right min-w-[140px]"
                                  value={seller.ticketAverage}
                                  onChange={(e) => handleSellerUpdate(seller.id, 'ticketAverage', e.target.value)}
                                 />
                              </div>
                            </TableCell>
                            <TableCell>
                                <Input
                                  type="number"
                                  step="0.1"
                                  className="bg-input text-right min-w-[100px]"
                                  value={seller.pa}
                                  onChange={(e) => handleSellerUpdate(seller.id, 'pa', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                  type="number"
                                  className="bg-input text-right min-w-[100px]"
                                  value={seller.points}
                                  onChange={(e) => handleSellerUpdate(seller.id, 'points', e.target.value)}
                                />
                            </TableCell>
                            <TableCell className="text-center">
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteSeller(seller.id)} aria-label="Remover vendedor">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground border-2 border-dashed border-border rounded-lg p-8">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 font-semibold">Nenhum vendedor encontrado</p>
                    <p className="text-sm">Adicione um novo vendedor para começar a gerenciar.</p>
                  </div>
                )}
            </CardContent>
          </Card>

           <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-xl">Adicionar Novo Vendedor</CardTitle>
              <CardDescription>Digite o nome do vendedor para adicioná-lo à lista.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSeller} className="flex items-end gap-4">
                <div className="space-y-2 flex-grow">
                  <Label htmlFor="sellerName">Nome do Vendedor</Label>
                  <Input 
                    id="sellerName" 
                    placeholder="Nome do Vendedor" 
                    className="bg-input" 
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground font-semibold">
                    Adicionar Vendedor
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="metas" className="space-y-6 mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Definir Metas de Performance</CardTitle>
              <CardDescription>
                Configure os valores para cada nível de meta. Esses valores serão usados no ranking.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Valor de Venda (R$)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sales-metinha">Metinha</Label>
                    <Input id="sales-metinha" type="number" value={goals.salesValue.metinha} onChange={(e) => handleGoalChange('salesValue', 'metinha', e.target.value)} className="bg-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sales-meta">Meta</Label>
                    <Input id="sales-meta" type="number" value={goals.salesValue.meta} onChange={(e) => handleGoalChange('salesValue', 'meta', e.target.value)} className="bg-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sales-metona">Metona</Label>
                    <Input id="sales-metona" type="number" value={goals.salesValue.metona} onChange={(e) => handleGoalChange('salesValue', 'metona', e.target.value)} className="bg-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sales-lendaria">Lendária</Label>
                    <Input id="sales-lendaria" type="number" value={goals.salesValue.lendaria} onChange={(e) => handleGoalChange('salesValue', 'lendaria', e.target.value)} className="bg-input" />
                  </div>
                </div>
              </div>
               <div className="border-t border-border pt-8">
                <h3 className="text-lg font-medium mb-4">Ticket Médio (R$)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticket-metinha">Metinha</Label>
                    <Input id="ticket-metinha" type="number" value={goals.ticketAverage.metinha} onChange={(e) => handleGoalChange('ticketAverage', 'metinha', e.target.value)} className="bg-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ticket-meta">Meta</Label>
                    <Input id="ticket-meta" type="number" value={goals.ticketAverage.meta} onChange={(e) => handleGoalChange('ticketAverage', 'meta', e.target.value)} className="bg-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ticket-metona">Metona</Label>
                    <Input id="ticket-metona" type="number" value={goals.ticketAverage.metona} onChange={(e) => handleGoalChange('ticketAverage', 'metona', e.target.value)} className="bg-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ticket-lendaria">Lendária</Label>
                    <Input id="ticket-lendaria" type="number" value={goals.ticketAverage.lendaria} onChange={(e) => handleGoalChange('ticketAverage', 'lendaria', e.target.value)} className="bg-input" />
                  </div>
                </div>
              </div>
              <div className="border-t border-border pt-8">
                <h3 className="text-lg font-medium mb-4">PA (Produtos por Atendimento)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pa-metinha">Metinha</Label>
                    <Input id="pa-metinha" type="number" step="0.1" value={goals.pa.metinha} onChange={(e) => handleGoalChange('pa', 'metinha', e.target.value)} className="bg-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pa-meta">Meta</Label>
                    <Input id="pa-meta" type="number" step="0.1" value={goals.pa.meta} onChange={(e) => handleGoalChange('pa', 'meta', e.target.value)} className="bg-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pa-metona">Metona</Label>
                    <Input id="pa-metona" type="number" step="0.1" value={goals.pa.metona} onChange={(e) => handleGoalChange('pa', 'metona', e.target.value)} className="bg-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pa-lendaria">Lendária</Label>
                    <Input id="pa-lendaria" type="number" step="0.1" value={goals.pa.lendaria} onChange={(e) => handleGoalChange('pa', 'lendaria', e.target.value)} className="bg-input" />
                  </div>
                </div>
              </div>
              <div className="border-t border-border pt-8">
                <h3 className="text-lg font-medium mb-4">Pontos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="points-metinha">Metinha</Label>
                    <Input id="points-metinha" type="number" value={goals.points.metinha} onChange={(e) => handleGoalChange('points', 'metinha', e.target.value)} className="bg-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points-meta">Meta</Label>
                    <Input id="points-meta" type="number" value={goals.points.meta} onChange={(e) => handleGoalChange('points', 'meta', e.target.value)} className="bg-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points-metona">Metona</Label>
                    <Input id="points-metona" type="number" value={goals.points.metona} onChange={(e) => handleGoalChange('points', 'metona', e.target.value)} className="bg-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points-lendaria">Lendária</Label>
                    <Input id="points-lendaria" type="number" value={goals.points.lendaria} onChange={(e) => handleGoalChange('points', 'lendaria', e.target.value)} className="bg-input" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-6 border-t border-border">
                 <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground font-semibold">
                  Salvar Metas
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Gerenciar Períodos de Duração</CardTitle>
              <CardDescription>
                Defina os períodos personalizados que serão usados para filtrar os rankings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <form onSubmit={handleAddPeriod} className="grid md:grid-cols-5 gap-4 items-end">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="periodName">Nome do Período</Label>
                  <Input 
                      id="periodName" 
                      placeholder="Ex: Mês de Setembro" 
                      className="bg-input" 
                      value={periodName}
                      onChange={(e) => setPeriodName(e.target.value)}
                      required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="startDate"
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal bg-input',
                          !startDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP') : <span>Escolha uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Fim</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="endDate"
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal bg-input',
                          !endDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP') : <span>Escolha uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={{ before: startDate }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground font-semibold">
                  Adicionar
                </Button>
              </form>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Períodos Cadastrados</h3>
                {periods.length > 0 ? (
                  <div className="rounded-md border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Data de Início</TableHead>
                          <TableHead>Data de Fim</TableHead>
                          <TableHead className="text-center">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {periods.map((period) => (
                          <TableRow key={period.id}>
                            <TableCell className="font-medium">{period.name}</TableCell>
                            <TableCell>{format(period.startDate, 'dd/MM/yyyy')}</TableCell>
                            <TableCell>{format(period.endDate, 'dd/MM/yyyy')}</TableCell>
                            <TableCell className="text-center">
                              <Button variant="ghost" size="icon" onClick={() => handleDeletePeriod(period.id)} aria-label="Remover período">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground border-2 border-dashed border-border rounded-lg p-8">
                    <CalendarRange className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 font-semibold">Nenhum período cadastrado</p>
                    <p className="text-sm">Adicione um novo período para começar a gerenciar.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

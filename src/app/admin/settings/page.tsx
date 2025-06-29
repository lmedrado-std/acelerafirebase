'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Trash2, Flag, Shield, Info, ClipboardList, Trophy } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminContext } from '@/app/admin/layout';
import type { Seller, Goals, GoalLevels } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast";

const goalLevels: Array<{key: keyof GoalLevels, label: string}> = [
    { key: 'metinha', label: 'Metinha'},
    { key: 'meta', label: 'Meta'},
    { key: 'metona', label: 'Metona'},
    { key: 'lendaria', label: 'Lendária'},
];

export default function SettingsPage() {
  const { sellers, setSellers, goals, setGoals, isDirty, setIsDirty } = useAdminContext();
  const { toast } = useToast();
  
  // Local state for editing to avoid applying changes immediately
  const [localSellers, setLocalSellers] = useState<Seller[]>([]);
  const [localGoals, setLocalGoals] = useState<Goals>(goals);
  
  const [newSeller, setNewSeller] = useState({ name: '', nickname: '', password: '' });
  
  // Sync local state when global state changes
  useEffect(() => {
    setLocalSellers(JSON.parse(JSON.stringify(sellers)));
  }, [sellers]);

  useEffect(() => {
    setLocalGoals(JSON.parse(JSON.stringify(goals)));
  }, [goals]);

  // Check for unsaved changes and update the context
  useEffect(() => {
    // Deep compare using JSON stringify. It's simple and effective for this data structure.
    const hasUnsavedChanges = JSON.stringify(localSellers) !== JSON.stringify(sellers) || JSON.stringify(localGoals) !== JSON.stringify(goals);
    
    // Only update if the state is different to avoid unnecessary re-renders
    if (hasUnsavedChanges !== isDirty) {
        setIsDirty(hasUnsavedChanges);
    }
  }, [localSellers, localGoals, sellers, goals, isDirty, setIsDirty]);

  // Handle browser-level navigation (closing tab, refresh)
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        // Most browsers require returnValue to be set.
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);


  const handleGoalChange = (
    criterion: keyof Goals,
    level: keyof GoalLevels,
    field: 'threshold' | 'prize',
    value: string
  ) => {
    setLocalGoals(prev => ({
      ...prev,
      [criterion]: {
        ...prev[criterion],
        [level]: {
          ...prev[criterion][level],
          [field]: parseFloat(value) || 0,
        },
      },
    }));
  };

  const handlePerformanceBonusChange = (
    field: 'per' | 'prize',
    value: string
  ) => {
    setLocalGoals(prev => ({
      ...prev,
      salesValue: {
        ...prev.salesValue,
        performanceBonus: {
          ...(prev.salesValue.performanceBonus ?? { per: 0, prize: 0 }),
          [field]: parseFloat(value) || 0,
        },
      },
    }));
  };

  const handleAddSeller = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newSeller.name.trim() || !newSeller.nickname.trim() || !newSeller.password.trim()) return;

    const newSellerData: Seller = {
      id: new Date().getTime().toString(),
      name: newSeller.name,
      nickname: newSeller.nickname,
      password: newSeller.password,
      email: `${newSeller.nickname.toLowerCase()}@example.com`,
      salesValue: 0,
      ticketAverage: 0,
      pa: 0,
      points: 0,
      extraPoints: 0,
    };
    setLocalSellers(prevSellers => [...prevSellers, newSellerData]);
    setNewSeller({ name: '', nickname: '', password: '' });
  };
  
   const handleSellerCredsUpdate = (id: string, field: 'nickname' | 'password', value: string) => {
    setLocalSellers(prevSellers =>
      prevSellers.map(seller => 
        seller.id === id ? { ...seller, [field]: value } : seller
      )
    );
  };

  const handleSellerPerfUpdate = (id: string, field: keyof Omit<Seller, 'id' | 'name' | 'nickname' | 'password' | 'email'>, value: string) => {
    setLocalSellers(prevSellers =>
      prevSellers.map(seller => {
        if (seller.id !== id) return seller;
        return { ...seller, [field]: parseFloat(value) || 0 };
      })
    );
  };

  const handleDeleteSeller = (id: string) => {
    setLocalSellers(prevSellers => prevSellers.filter(seller => seller.id !== id));
  };
  
  const handleSaveChanges = () => {
    setSellers(() => localSellers);
    setGoals(() => localGoals);
     toast({
        title: "Alterações Salvas!",
        description: "Suas configurações foram atualizadas com sucesso.",
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Shield className="size-8 text-primary" />
            <h1 className="text-3xl font-bold">Configurações Gerais</h1>
        </div>
      </div>

      <Tabs defaultValue="lancamentos" className="w-full">
        <div className="flex items-center gap-4">
          <TabsList className="bg-card p-1 h-auto">
            <TabsTrigger value="lancamentos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
              <ClipboardList className="mr-2 size-5" /> Lançamentos
            </TabsTrigger>
             <TabsTrigger value="vendedores" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
              <Users className="mr-2 size-5" /> Vendedores
            </TabsTrigger>
             <TabsTrigger value="metas" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
              <Flag className="mr-2 size-5" /> Metas
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="lancamentos" className="space-y-6 mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-xl">Lançamento de Vendas</CardTitle>
              <CardDescription>Insira aqui os totais acumulados de vendas e outros indicadores de performance para cada vendedor.</CardDescription>
            </CardHeader>
            <CardContent>
                 {localSellers.length > 0 ? (
                  <div className="rounded-md border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vendedor</TableHead>
                          <TableHead className="text-right">Valor de Venda (R$)</TableHead>
                          <TableHead className="text-right">Ticket Médio (R$)</TableHead>
                          <TableHead className="text-right">PA</TableHead>
                          <TableHead className="text-right">Pontos (Auto)</TableHead>
                          <TableHead className="text-right">Pontos Extras</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {localSellers.map((seller) => (
                          <TableRow key={seller.id}>
                            <TableCell className="font-medium">{seller.name}</TableCell>
                            <TableCell>
                                <Input
                                  type="number"
                                  step="0.01"
                                  className="bg-input text-right min-w-[140px]"
                                  value={seller.salesValue}
                                  onChange={(e) => handleSellerPerfUpdate(seller.id, 'salesValue', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                  type="number"
                                  step="0.01"
                                  className="bg-input text-right min-w-[140px]"
                                  value={seller.ticketAverage}
                                  onChange={(e) => handleSellerPerfUpdate(seller.id, 'ticketAverage', e.target.value)}
                                 />
                            </TableCell>
                            <TableCell>
                                <Input
                                  type="number"
                                  step="0.1"
                                  className="bg-input text-right min-w-[100px]"
                                  value={seller.pa}
                                  onChange={(e) => handleSellerPerfUpdate(seller.id, 'pa', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                <Input
                                  type="number"
                                  className="bg-input text-right min-w-[100px]"
                                  value={seller.points}
                                  disabled
                                />
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="size-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Pontos de missões, cursos e quizzes.</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </TableCell>
                             <TableCell>
                                <Input
                                  type="number"
                                  className="bg-input text-right min-w-[100px]"
                                  value={seller.extraPoints}
                                  onChange={(e) => handleSellerPerfUpdate(seller.id, 'extraPoints', e.target.value)}
                                />
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
                 <div className="flex justify-end pt-6">
                    <Button onClick={handleSaveChanges} className="bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground font-semibold">
                      Salvar Lançamentos
                    </Button>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="vendedores" className="space-y-6 mt-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl">Gerenciar Vendedores</CardTitle>
                <CardDescription>Adicione novos vendedores e gerencie suas credenciais de acesso.</CardDescription>
              </CardHeader>
              <CardContent>
                  {localSellers.length > 0 && (
                    <div className="rounded-md border border-border mb-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Login (Nickname)</TableHead>
                            <TableHead>Senha</TableHead>
                            <TableHead className="text-center">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {localSellers.map((seller) => (
                            <TableRow key={seller.id}>
                              <TableCell className="font-medium">{seller.name}</TableCell>
                              <TableCell>
                                <Input value={seller.nickname} onChange={(e) => handleSellerCredsUpdate(seller.id, 'nickname', e.target.value)} className="bg-input" />
                              </TableCell>
                              <TableCell>
                                <Input type="text" value={seller.password} onChange={(e) => handleSellerCredsUpdate(seller.id, 'password', e.target.value)} className="bg-input" />
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
                  )}

                  <div className="pt-4 border-t">
                    <CardTitle className="text-lg">Adicionar Novo Vendedor</CardTitle>
                    <form onSubmit={handleAddSeller} className="flex items-end gap-4 pt-4">
                      <div className="space-y-2 flex-grow">
                        <Label htmlFor="sellerName">Nome</Label>
                        <Input id="sellerName" placeholder="Nome completo" value={newSeller.name} onChange={(e) => setNewSeller(s => ({...s, name: e.target.value}))} className="bg-input" required />
                      </div>
                      <div className="space-y-2 flex-grow">
                        <Label htmlFor="sellerNickname">Login (Nickname)</Label>
                        <Input id="sellerNickname" placeholder="login.do.vendedor" value={newSeller.nickname} onChange={(e) => setNewSeller(s => ({...s, nickname: e.target.value}))} className="bg-input" required />
                      </div>
                       <div className="space-y-2 flex-grow">
                        <Label htmlFor="sellerPassword">Senha</Label>
                        <Input id="sellerPassword" type="text" placeholder="Senha de acesso" value={newSeller.password} onChange={(e) => setNewSeller(s => ({...s, password: e.target.value}))} className="bg-input" required />
                      </div>
                      <Button type="submit">
                          Adicionar à Lista
                      </Button>
                    </form>
                  </div>
                   <div className="flex justify-end pt-6 mt-6 border-t">
                      <Button onClick={handleSaveChanges} className="bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground font-semibold">
                          Salvar Alterações de Vendedores
                      </Button>
                  </div>
              </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="metas" className="space-y-6 mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Definir Metas de Performance</CardTitle>
              <CardDescription>
                Configure os valores para cada nível de meta e os prêmios associados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Valor de Venda (R$)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {goalLevels.map(level => (
                        <div key={level.key} className="space-y-2 rounded-lg border p-3">
                            <h4 className="font-semibold text-center">{level.label}</h4>
                            <div className="space-y-1.5">
                                <Label htmlFor={`sales-${level.key}-threshold`}>Meta</Label>
                                <Input id={`sales-${level.key}-threshold`} type="number" placeholder="Valor" value={localGoals.salesValue[level.key].threshold} onChange={(e) => handleGoalChange('salesValue', level.key, 'threshold', e.target.value)} className="bg-input" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`sales-${level.key}-prize`}>Prêmio (R$)</Label>
                                <Input id={`sales-${level.key}-prize`} type="number" placeholder="Prêmio" value={localGoals.salesValue[level.key].prize} onChange={(e) => handleGoalChange('salesValue', level.key, 'prize', e.target.value)} className="bg-input" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 border-t pt-6">
                    <h4 className="text-base font-medium mb-2 flex items-center gap-2">
                        <Trophy className="size-5 text-yellow-400" />
                        Bônus de Performance
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                        Prêmio adicional para vendas que excederem a meta Lendária.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
                        <div className="space-y-1.5">
                            <Label htmlFor="performance-bonus-prize">Bônus (R$)</Label>
                            <Input id="performance-bonus-prize" type="number" placeholder="Ex: 50" value={localGoals.salesValue.performanceBonus?.prize ?? ''} onChange={(e) => handlePerformanceBonusChange('prize', e.target.value)} className="bg-input" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="performance-bonus-per">A cada (R$)</Label>
                            <Input id="performance-bonus-per" type="number" placeholder="Ex: 1000" value={localGoals.salesValue.performanceBonus?.per ?? ''} onChange={(e) => handlePerformanceBonusChange('per', e.target.value)} className="bg-input" />
                        </div>
                    </div>
                </div>
              </div>
               <div className="border-t border-border pt-8">
                <h3 className="text-lg font-medium mb-4">Ticket Médio (R$)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {goalLevels.map(level => (
                        <div key={level.key} className="space-y-2 rounded-lg border p-3">
                            <h4 className="font-semibold text-center">{level.label}</h4>
                            <div className="space-y-1.5">
                                <Label htmlFor={`ticket-${level.key}-threshold`}>Meta</Label>
                                <Input id={`ticket-${level.key}-threshold`} type="number" placeholder="Valor" value={localGoals.ticketAverage[level.key].threshold} onChange={(e) => handleGoalChange('ticketAverage', level.key, 'threshold', e.target.value)} className="bg-input" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`ticket-${level.key}-prize`}>Prêmio (R$)</Label>
                                <Input id={`ticket-${level.key}-prize`} type="number" placeholder="Prêmio" value={localGoals.ticketAverage[level.key].prize} onChange={(e) => handleGoalChange('ticketAverage', level.key, 'prize', e.target.value)} className="bg-input" />
                            </div>
                        </div>
                    ))}
                </div>
              </div>
              <div className="border-t border-border pt-8">
                <h3 className="text-lg font-medium mb-4">PA (Produtos por Atendimento)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {goalLevels.map(level => (
                        <div key={level.key} className="space-y-2 rounded-lg border p-3">
                            <h4 className="font-semibold text-center">{level.label}</h4>
                            <div className="space-y-1.5">
                                <Label htmlFor={`pa-${level.key}-threshold`}>Meta</Label>
                                <Input id={`pa-${level.key}-threshold`} type="number" step="0.1" placeholder="Valor" value={localGoals.pa[level.key].threshold} onChange={(e) => handleGoalChange('pa', level.key, 'threshold', e.target.value)} className="bg-input" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`pa-${level.key}-prize`}>Prêmio (R$)</Label>
                                <Input id={`pa-${level.key}-prize`} type="number" placeholder="Prêmio" value={localGoals.pa[level.key].prize} onChange={(e) => handleGoalChange('pa', level.key, 'prize', e.target.value)} className="bg-input" />
                            </div>
                        </div>
                    ))}
                </div>
              </div>
              <div className="border-t border-border pt-8">
                <h3 className="text-lg font-medium mb-4">Pontos</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {goalLevels.map(level => (
                        <div key={level.key} className="space-y-2 rounded-lg border p-3">
                            <h4 className="font-semibold text-center">{level.label}</h4>
                            <div className="space-y-1.5">
                                <Label htmlFor={`points-${level.key}-threshold`}>Meta</Label>
                                <Input id={`points-${level.key}-threshold`} type="number" placeholder="Valor" value={localGoals.points[level.key].threshold} onChange={(e) => handleGoalChange('points', level.key, 'threshold', e.target.value)} className="bg-input" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`points-${level.key}-prize`}>Prêmio (R$)</Label>
                                <Input id={`points-${level.key}-prize`} type="number" placeholder="Prêmio" value={localGoals.points[level.key].prize} onChange={(e) => handleGoalChange('points', level.key, 'prize', e.target.value)} className="bg-input" />
                            </div>
                        </div>
                    ))}
                </div>
              </div>
              <div className="flex justify-end pt-6 border-t border-border">
                 <Button onClick={handleSaveChanges} className="bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground font-semibold">
                  Salvar Metas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

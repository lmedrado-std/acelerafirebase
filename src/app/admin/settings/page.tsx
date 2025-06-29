'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Trash2, Flag, Shield, Info, ClipboardList, Trophy } from "lucide-react";
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminContext } from '@/app/admin/layout';
import type { Seller, Goals, GoalLevels } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const goalLevels: Array<{key: keyof GoalLevels, label: string}> = [
    { key: 'metinha', label: 'Metinha'},
    { key: 'meta', label: 'Meta'},
    { key: 'metona', label: 'Metona'},
    { key: 'lendaria', label: 'Lendária'},
];

export default function SettingsPage() {
  const { sellers, setSellers, goals, setGoals } = useAdminContext();
  const [sellerName, setSellerName] = useState('');

  const handleGoalChange = (
    criterion: keyof Goals,
    level: keyof GoalLevels,
    field: 'threshold' | 'prize',
    value: string
  ) => {
    setGoals(prev => ({
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
    setGoals(prev => ({
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
    if (!sellerName.trim()) return;

    const newSeller: Seller = {
      id: new Date().getTime().toString(),
      name: sellerName,
      salesValue: 0,
      ticketAverage: 0,
      pa: 0,
      points: 0,
      extraPoints: 0,
      nickname: sellerName.toLowerCase().replace(/\s+/g, ''),
      email: '',
      password: '123',
    };
    setSellers(prevSellers => [...prevSellers, newSeller]);
    setSellerName('');
  };

  const handleSellerUpdate = (id: string, field: keyof Omit<Seller, 'id' | 'name'>, value: string) => {
    setSellers(prevSellers =>
      prevSellers.map(seller => {
        if (seller.id !== id) return seller;

        const updatedSeller = { ...seller };
        const numericFields: (keyof Seller)[] = ['salesValue', 'ticketAverage', 'pa', 'points', 'extraPoints'];

        if (numericFields.includes(field as keyof Seller)) {
          (updatedSeller as any)[field] = parseFloat(value) || 0;
        } else {
          (updatedSeller as any)[field] = value;
        }

        return updatedSeller;
      })
    );
  };

  const handleDeleteSeller = (id: string) => {
    setSellers(prevSellers => prevSellers.filter(seller => seller.id !== id));
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Shield className="size-8 text-primary" />
        <h1 className="text-3xl font-bold">Configurações Gerais</h1>
      </div>

      <Tabs defaultValue="lancamentos" className="w-full">
        <div className="flex items-center gap-4">
          <TabsList className="bg-card p-1 h-auto">
            <TabsTrigger value="lancamentos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
              <ClipboardList className="mr-2 size-5" /> Lançamentos
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
              <CardDescription>Insira aqui os totais acumulados de vendas e gerencie senhas para cada vendedor.</CardDescription>
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
                          <TableHead className="text-right">Pontos Extras</TableHead>
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
                                      <p>Pontos automáticos de missões, cursos e quizzes.</p>
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
                                  onChange={(e) => handleSellerUpdate(seller.id, 'extraPoints', e.target.value)}
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
                                <Input id={`sales-${level.key}-threshold`} type="number" placeholder="Valor" value={goals.salesValue[level.key].threshold} onChange={(e) => handleGoalChange('salesValue', level.key, 'threshold', e.target.value)} className="bg-input" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`sales-${level.key}-prize`}>Prêmio (R$)</Label>
                                <Input id={`sales-${level.key}-prize`} type="number" placeholder="Prêmio" value={goals.salesValue[level.key].prize} onChange={(e) => handleGoalChange('salesValue', level.key, 'prize', e.target.value)} className="bg-input" />
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
                            <Input id="performance-bonus-prize" type="number" placeholder="Ex: 50" value={goals.salesValue.performanceBonus?.prize ?? ''} onChange={(e) => handlePerformanceBonusChange('prize', e.target.value)} className="bg-input" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="performance-bonus-per">A cada (R$)</Label>
                            <Input id="performance-bonus-per" type="number" placeholder="Ex: 1000" value={goals.salesValue.performanceBonus?.per ?? ''} onChange={(e) => handlePerformanceBonusChange('per', e.target.value)} className="bg-input" />
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
                                <Input id={`ticket-${level.key}-threshold`} type="number" placeholder="Valor" value={goals.ticketAverage[level.key].threshold} onChange={(e) => handleGoalChange('ticketAverage', level.key, 'threshold', e.target.value)} className="bg-input" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`ticket-${level.key}-prize`}>Prêmio (R$)</Label>
                                <Input id={`ticket-${level.key}-prize`} type="number" placeholder="Prêmio" value={goals.ticketAverage[level.key].prize} onChange={(e) => handleGoalChange('ticketAverage', level.key, 'prize', e.target.value)} className="bg-input" />
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
                                <Input id={`pa-${level.key}-threshold`} type="number" step="0.1" placeholder="Valor" value={goals.pa[level.key].threshold} onChange={(e) => handleGoalChange('pa', level.key, 'threshold', e.target.value)} className="bg-input" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`pa-${level.key}-prize`}>Prêmio (R$)</Label>
                                <Input id={`pa-${level.key}-prize`} type="number" placeholder="Prêmio" value={goals.pa[level.key].prize} onChange={(e) => handleGoalChange('pa', level.key, 'prize', e.target.value)} className="bg-input" />
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
                                <Input id={`points-${level.key}-threshold`} type="number" placeholder="Valor" value={goals.points[level.key].threshold} onChange={(e) => handleGoalChange('points', level.key, 'threshold', e.target.value)} className="bg-input" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`points-${level.key}-prize`}>Prêmio (R$)</Label>
                                <Input id={`points-${level.key}-prize`} type="number" placeholder="Prêmio" value={goals.points[level.key].prize} onChange={(e) => handleGoalChange('points', level.key, 'prize', e.target.value)} className="bg-input" />
                            </div>
                        </div>
                    ))}
                </div>
              </div>
              <div className="flex justify-end pt-6 border-t border-border">
                 <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground font-semibold">
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

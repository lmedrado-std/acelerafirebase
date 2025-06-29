'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Trash2, Flag, Shield, Info, ClipboardList } from "lucide-react";
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

export default function SettingsPage() {
  const { sellers, setSellers, goals, setGoals } = useAdminContext();
  const [sellerName, setSellerName] = useState('');

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
                          <TableHead>Senha</TableHead>
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
                                <Input
                                  type="password"
                                  className="bg-input min-w-[140px]"
                                  placeholder="Definir..."
                                  value={seller.password || ''}
                                  onChange={(e) => handleSellerUpdate(seller.id, 'password', e.target.value)}
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
        </TabsContent>
      </Tabs>
    </div>
  )
}

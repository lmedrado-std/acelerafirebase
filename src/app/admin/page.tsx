'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Puzzle, Target, Shield, BookCopy, ShoppingBag, Users, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Seller = {
  id: string;
  name: string;
  salesValue: number;
  ticketAverage: number;
  ppa: number;
};

export default function AdminPage() {
  const [sellers, setSellers] = useState<Seller[]>([
    { id: '1', name: 'Rian Breston', salesValue: 5240.75, ticketAverage: 150.25, ppa: 2.1 },
    { id: '2', name: 'Carla Dias', salesValue: 4890.50, ticketAverage: 142.80, ppa: 2.5 },
    { id: '3', name: 'Marcos Andrade', salesValue: 6100.00, ticketAverage: 185.00, ppa: 1.9 },
  ]);

  const [sellerName, setSellerName] = useState('');
  const [salesValue, setSalesValue] = useState('');
  const [ticketAverage, setTicketAverage] = useState('');
  const [ppa, setPpa] = useState('');

  const handleAddSeller = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sellerName.trim()) return;

    const newSeller: Seller = {
      id: new Date().getTime().toString(),
      name: sellerName,
      salesValue: parseFloat(salesValue) || 0,
      ticketAverage: parseFloat(ticketAverage) || 0,
      ppa: parseFloat(ppa) || 0,
    };
    setSellers(prevSellers => [...prevSellers, newSeller]);

    setSellerName('');
    setSalesValue('');
    setTicketAverage('');
    setPpa('');
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
            <TabsTrigger value="vendedores" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
              <Users className="mr-2 size-5" /> Vendedores
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
        <TabsContent value="vendedores" className="space-y-6 mt-4">
           <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-xl">Adicionar Novo Vendedor</CardTitle>
              <CardDescription>Preencha os dados para cadastrar um novo vendedor na plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSeller} className="space-y-4">
                <div className="space-y-2">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="salesValue">Valor de Venda (R$)</Label>
                        <Input 
                            id="salesValue" 
                            placeholder="2500,00" 
                            type="number" 
                            step="0.01" 
                            className="bg-input"
                            value={salesValue}
                            onChange={(e) => setSalesValue(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ticketAverage">Ticket Médio (R$)</Label>
                        <Input 
                            id="ticketAverage" 
                            placeholder="150,50" 
                            type="number" 
                            step="0.01" 
                            className="bg-input" 
                            value={ticketAverage}
                            onChange={(e) => setTicketAverage(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ppa">Produtos por Atendimento (PPA)</Label>
                        <Input 
                            id="ppa" 
                            placeholder="2.5" 
                            type="number" 
                            step="0.1" 
                            className="bg-input" 
                            value={ppa}
                            onChange={(e) => setPpa(e.target.value)}
                        />
                    </div>
                </div>
                <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground font-semibold">
                    Adicionar Vendedor
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-xl">Vendedores Cadastrados</CardTitle>
              <CardDescription>Gerencie os dados de vendas diárias dos vendedores.</CardDescription>
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
                          <TableHead className="text-right">PPA</TableHead>
                          <TableHead className="text-center">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sellers.map((seller) => (
                          <TableRow key={seller.id}>
                            <TableCell className="font-medium">{seller.name}</TableCell>
                            <TableCell>
                               <Input
                                 type="number"
                                 step="0.01"
                                 className="bg-input text-right min-w-[120px]"
                                 value={seller.salesValue}
                                 onChange={(e) => handleSellerUpdate(seller.id, 'salesValue', e.target.value)}
                               />
                            </TableCell>
                            <TableCell>
                               <Input
                                 type="number"
                                 step="0.01"
                                 className="bg-input text-right min-w-[120px]"
                                 value={seller.ticketAverage}
                                 onChange={(e) => handleSellerUpdate(seller.id, 'ticketAverage', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                  type="number"
                                  step="0.1"
                                  className="bg-input text-right min-w-[100px]"
                                  value={seller.ppa}
                                  onChange={(e) => handleSellerUpdate(seller.id, 'ppa', e.target.value)}
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
        </TabsContent>
      </Tabs>
    </div>
  )
}

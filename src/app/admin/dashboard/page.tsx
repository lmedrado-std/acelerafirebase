'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Trophy, DollarSign, LayoutGrid } from "lucide-react";
import { sellersData, goalsData } from '@/lib/data';

export default function DashboardPage() {
  const { bestSeller, totalSellers, currentSales, monthlyGoal } = useMemo(() => {
    if (sellersData.length === 0) {
      return {
        bestSeller: { name: "Nenhum", value: 0 },
        totalSellers: 0,
        currentSales: 0,
        monthlyGoal: 0,
      };
    }

    const totalSellers = sellersData.length;
    const currentSales = sellersData.reduce((acc, seller) => acc + seller.salesValue, 0);
    const monthlyGoal = goalsData.salesValue.meta * totalSellers;
    
    const bestSellerData = sellersData.reduce((prev, current) => 
      (prev.salesValue > current.salesValue) ? prev : current
    );

    return { 
      bestSeller: { name: bestSellerData.name, value: bestSellerData.salesValue },
      totalSellers,
      currentSales,
      monthlyGoal,
    };
  }, []);

  const progress = monthlyGoal > 0 ? (currentSales / monthlyGoal) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <LayoutGrid className="size-8 text-primary" />
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vendedores Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSellers}</div>
            <p className="text-xs text-muted-foreground">
              Total de vendedores na equipe
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Melhor Vendedor (Mês)
            </CardTitle>
            <Trophy className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bestSeller.name}</div>
            <p className="text-xs text-muted-foreground">
              {bestSeller.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} em vendas
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Totais (Mês)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de vendas realizadas no período
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Progresso da Meta Mensal</CardTitle>
          <CardDescription>
            Acompanhe o progresso da equipe em relação à meta de vendas do mês.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-semibold">{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{currentSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    <span>{monthlyGoal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy, DollarSign, LayoutGrid, Star, Ticket, Box } from "lucide-react";
import { useAdminContext } from '@/app/admin/layout';
import SalesOverviewChart from '@/components/SalesOverviewChart';

export default function DashboardPage() {
  const { sellers: sellersData } = useAdminContext();

  const { 
    bestSeller,
    totalSellers,
    currentSales,
    totalPoints,
    averageTicket,
    averagePA
  } = useMemo(() => {
    const totalSellers = sellersData.length;
    
    if (totalSellers === 0) {
      return {
        bestSeller: { name: "Nenhum", value: 0 },
        totalSellers: 0,
        currentSales: 0,
        totalPoints: 0,
        averageTicket: 0,
        averagePA: 0,
      };
    }

    const currentSales = sellersData.reduce((acc, seller) => acc + seller.salesValue, 0);
    const totalPoints = sellersData.reduce((acc, seller) => acc + seller.points + seller.extraPoints, 0);
    const totalTicket = sellersData.reduce((acc, seller) => acc + seller.ticketAverage, 0);
    const totalPA = sellersData.reduce((acc, seller) => acc + seller.pa, 0);

    const bestSellerData = sellersData.reduce((prev, current) => 
      (prev.salesValue > current.salesValue) ? prev : current
    );

    return { 
      bestSeller: { name: bestSellerData.name, value: bestSellerData.salesValue },
      totalSellers,
      currentSales,
      totalPoints,
      averageTicket: totalSellers > 0 ? totalTicket / totalSellers : 0,
      averagePA: totalSellers > 0 ? totalPA / totalSellers : 0,
    };
  }, [sellersData]);

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
              Vendas Totais (Mês)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de vendas da equipe
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
             Ticket Médio (Equipe)
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-muted-foreground">
             Média de ticket por venda
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              PA Médio (Equipe)
            </CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averagePA.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Média de produtos por atendimento
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos Totais da Equipe</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPoints.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              Soma de todos os pontos ganhos
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
      </div>
      <div className="grid grid-cols-1 gap-4">
        <SalesOverviewChart sellers={sellersData} />
      </div>
    </div>
  );
}

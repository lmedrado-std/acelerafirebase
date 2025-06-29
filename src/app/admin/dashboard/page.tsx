'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Trophy, DollarSign, LayoutGrid, Star, Ticket, Box, Crown } from "lucide-react";
import { useAdminContext } from '@/app/admin/layout';
import SalesOverviewChart from '@/components/SalesOverviewChart';

export default function DashboardPage() {
  const { sellers: sellersData } = useAdminContext();

  const { 
    bestSellerByValue,
    bestSellerByTicket,
    bestSellerByPA,
    bestSellerByPoints,
    totalSellers,
    currentSales,
    totalPoints,
    averageTicket,
    averagePA,
    pointsLeaders
  } = useMemo(() => {
    const totalSellers = sellersData.length;
    
    if (totalSellers === 0) {
      return {
        bestSellerByValue: { name: "Nenhum", salesValue: 0 },
        bestSellerByTicket: { name: "Nenhum", ticketAverage: 0 },
        bestSellerByPA: { name: "Nenhum", pa: 0 },
        bestSellerByPoints: { name: "Nenhum", points: 0, extraPoints: 0, totalPoints: 0 },
        totalSellers: 0,
        currentSales: 0,
        totalPoints: 0,
        averageTicket: 0,
        averagePA: 0,
        pointsLeaders: []
      };
    }

    const currentSales = sellersData.reduce((acc, seller) => acc + seller.salesValue, 0);
    const totalPoints = sellersData.reduce((acc, seller) => acc + seller.points + seller.extraPoints, 0);
    const totalTicket = sellersData.reduce((acc, seller) => acc + seller.ticketAverage, 0);
    const totalPA = sellersData.reduce((acc, seller) => acc + seller.pa, 0);

    const sellersWithTotalPoints = sellersData.map(s => ({ ...s, totalPoints: s.points + s.extraPoints }));

    return { 
      bestSellerByValue: sellersData.reduce((prev, current) => (prev.salesValue > current.salesValue) ? prev : current),
      bestSellerByTicket: sellersData.reduce((prev, current) => (prev.ticketAverage > current.ticketAverage) ? prev : current),
      bestSellerByPA: sellersData.reduce((prev, current) => (prev.pa > current.pa) ? prev : current),
      bestSellerByPoints: sellersWithTotalPoints.reduce((prev, current) => (prev.totalPoints > current.totalPoints) ? prev : current),
      totalSellers,
      currentSales,
      totalPoints,
      averageTicket: totalSellers > 0 ? totalTicket / totalSellers : 0,
      averagePA: totalSellers > 0 ? totalPA / totalSellers : 0,
      pointsLeaders: [...sellersWithTotalPoints].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 3)
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
        <Card className="bg-card border-border col-span-1 md:col-span-2 lg:col-span-1">
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

       <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Destaques Individuais</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Melhor Vendedor (Vendas)</CardTitle>
                    <Trophy className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{bestSellerByValue.name}</div>
                    <p className="text-xs text-muted-foreground">
                        {bestSellerByValue.salesValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} em vendas
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Melhor Ticket Médio</CardTitle>
                    <Ticket className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{bestSellerByTicket.name}</div>
                    <p className="text-xs text-muted-foreground">
                        {bestSellerByTicket.ticketAverage.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Melhor PA</CardTitle>
                    <Box className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{bestSellerByPA.name}</div>
                    <p className="text-xs text-muted-foreground">
                        {bestSellerByPA.pa.toFixed(2)} produtos por atendimento
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Campeão de Pontos</CardTitle>
                    <Star className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{bestSellerByPoints.name}</div>
                    <p className="text-xs text-muted-foreground">
                        {bestSellerByPoints.totalPoints.toLocaleString('pt-BR')} pontos acumulados
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SalesOverviewChart sellers={sellersData} />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="text-yellow-400" />
              <span>Destaque do Mês</span>
            </CardTitle>
            <CardDescription>
              O vendedor com mais pontos ao final do mês ganha um prêmio de R$ 100,00.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pointsLeaders.length > 0 ? (
              <div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold size-8">1º</div>
                  <div>
                    <div className="font-semibold">{pointsLeaders[0].name}</div>
                    <div className="text-sm text-primary/80">{pointsLeaders[0].totalPoints.toLocaleString('pt-BR')} pontos</div>
                  </div>
                </div>

                {pointsLeaders.length > 1 && (
                  <div className="mt-4">
                    <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Na disputa pelo pódio:</h4>
                    <ul className="space-y-3">
                      {pointsLeaders.slice(1).map((seller, index) => (
                         <li key={seller.id} className="flex items-center gap-3 text-sm">
                           <div className="flex items-center justify-center rounded-full bg-muted text-muted-foreground font-bold size-7">{index + 2}º</div>
                           <div className="font-medium">{seller.name}</div>
                           <div className="ml-auto font-semibold text-muted-foreground">{seller.totalPoints.toLocaleString('pt-BR')} pts</div>
                         </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
               <p className="text-sm text-center text-muted-foreground pt-8">Não há vendedores suficientes para a disputa.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

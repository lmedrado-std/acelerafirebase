'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Award, DollarSign, Ticket, Box, Star, Minus, Users, CheckCircle } from 'lucide-react';
import { useSellerContext } from '@/app/seller/layout';
import type { Goals, Seller, SalesValueGoals } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const formatPrize = (value: number, type: 'currency' | 'points' | 'decimal') => {
    if (type === 'currency') return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    if (type === 'points') return value.toLocaleString('pt-BR');
    return value.toFixed(1);
}

const TeamGoalProgress = ({ sellers, goals }: { sellers: Seller[], goals: Goals }) => {
    if (!sellers || !goals?.salesValue?.metinha) {
        return null;
    }
    
    const teamBonus = 100;

    const sellersWhoReachedGoal = sellers.filter(s => s.salesValue >= goals.salesValue.metinha.threshold);
    const isGoalAchievable = sellers.length > 1;
    const isGoalAchieved = isGoalAchievable && sellersWhoReachedGoal.length === sellers.length;
    const progress = isGoalAchievable ? (sellersWhoReachedGoal.length / sellers.length) * 100 : 0;

    return (
        <Card className="bg-card/80 shadow-xl rounded-2xl ring-1 ring-white/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="size-6 text-supermoda-secondary" />
                    <span>Meta de Equipe: Metinha para Todos!</span>
                </CardTitle>
                <CardDescription>
                    Se todos atingirem a "Metinha" de vendas,
                    cada um ganha um bônus de <span className="font-bold text-green-400">{formatPrize(teamBonus, 'currency')}</span>.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 {!isGoalAchievable ? (
                     <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4 text-muted-foreground">
                        <div>
                            <h4 className="font-bold">Mais Vendedores Necessários</h4>
                            <p className="text-sm">A meta de equipe é ativada com no mínimo 2 vendedores.</p>
                        </div>
                    </div>
                ) : isGoalAchieved ? (
                    <div className="flex items-center gap-3 rounded-lg bg-green-500/10 p-4 text-green-400">
                        <CheckCircle className="size-8" />
                        <div>
                            <h4 className="font-bold">Parabéns, Equipe!</h4>
                            <p className="text-sm">Meta atingida! O bônus foi adicionado ao seu prêmio.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-muted-foreground">Progresso</span>
                            <span className="font-bold">{sellersWhoReachedGoal.length} de {sellers.length} vendedores</span>
                        </div>
                        <Progress value={progress} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-supermoda-primary [&>div]:to-supermoda-secondary" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default function RankingPage() {
  const { sellers: sellersData, goals: goalsData, currentSeller } = useSellerContext();
  const [criterion, setCriterion] = useState<'totalPrize' | 'salesValue' | 'ticketAverage' | 'pa' | 'points' >('totalPrize');

  const isAllPerformanceZero = useMemo(() => 
    sellersData.every(s => s.salesValue === 0 && s.ticketAverage === 0 && s.pa === 0 && s.points === 0 && s.extraPoints === 0), [sellersData]);

  const rankedSellers = useMemo(() => {
    const teamGoalMet = sellersData.length > 1 && sellersData.every(s => s.salesValue >= goalsData.salesValue.metinha.threshold);
    const teamBonus = 100;

    const sellersWithPrizes = sellersData.map(seller => {
        const prizes: Record<keyof Omit<Goals, 'salesValue' | 'gamification'>, number> = {
            salesValue: 0, ticketAverage: 0, pa: 0, points: 0,
        };
        const allCriteria: Array<keyof typeof prizes> = ['salesValue', 'ticketAverage', 'pa', 'points'];
        
        allCriteria.forEach(crit => {
            if (crit in goalsData && (crit === 'salesValue' || crit === 'ticketAverage' || crit === 'pa' || crit === 'points')) {
                const goals = goalsData[crit];
                const sellerValue = crit === 'points' ? seller.points + seller.extraPoints : seller[crit];
                let currentPrize = 0;
                if (sellerValue >= goals.metinha.threshold) currentPrize += goals.metinha.prize;
                if (sellerValue >= goals.meta.threshold) currentPrize += goals.meta.prize;
                if (sellerValue >= goals.metona.threshold) currentPrize += goals.metona.prize;
                if (sellerValue >= goals.lendaria.threshold) currentPrize += goals.lendaria.prize;

                if (crit === 'salesValue') {
                    const salesGoals = goals as SalesValueGoals;
                    if (seller.salesValue > salesGoals.lendaria.threshold && salesGoals.performanceBonus && salesGoals.performanceBonus.per > 0) {
                        const excessSales = seller.salesValue - salesGoals.lendaria.threshold;
                        const bonusUnits = Math.floor(excessSales / salesGoals.performanceBonus.per);
                        currentPrize += bonusUnits * salesGoals.performanceBonus.prize;
                    }
                }
                prizes[crit] = currentPrize;
            }
        });
        let totalPrize = Object.values(prizes).reduce((sum, p) => sum + p, 0);
        if (teamGoalMet) totalPrize += teamBonus;
        return { ...seller, totalPrize, prizes };
    });

    return sellersWithPrizes.sort((a, b) => {
        if (criterion === 'totalPrize') return b.totalPrize - a.totalPrize;
        if (criterion === 'points') return (b.points + b.extraPoints) - (a.points + a.extraPoints);
        return b[criterion as 'salesValue' | 'ticketAverage' | 'pa'] - a[criterion as 'salesValue' | 'ticketAverage' | 'pa'];
    });
  }, [sellersData, goalsData, criterion]);

  const myData = useMemo(() => {
    if (!currentSeller) return null;
    const sellerWithPrize = rankedSellers.find(s => s.id === currentSeller.id);
    if (!sellerWithPrize) return null;
    const rank = rankedSellers.findIndex(s => s.id === currentSeller.id) + 1;
    return { ...sellerWithPrize, rank };
  }, [currentSeller, rankedSellers]);


  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Trophy className="size-8 text-primary" />
        <h1 className="text-3xl font-bold font-sans">Meu Desempenho no Ranking</h1>
      </div>
      <div className="w-full pb-2">
         <Tabs value={criterion} onValueChange={(v) => setCriterion(v as any)} className="w-full">
            <TabsList className="h-auto p-1 flex flex-wrap justify-start">
                <TabsTrigger value="totalPrize"><Trophy className="mr-2"/>Prêmio Total</TabsTrigger>
                <TabsTrigger value="salesValue"><DollarSign className="mr-2"/>Vendas</TabsTrigger>
                <TabsTrigger value="points"><Star className="mr-2"/>Pontos</TabsTrigger>
                <TabsTrigger value="ticketAverage"><Ticket className="mr-2"/>T. Médio</TabsTrigger>
                <TabsTrigger value="pa"><Box className="mr-2"/>PA</TabsTrigger>
            </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-4">
            <Card className="bg-gradient-to-br from-card to-background/80 shadow-xl rounded-2xl ring-1 ring-white/10">
                 <CardHeader>
                    <CardTitle>Sua Posição por <span className="text-primary">{
                        {totalPrize: "Prêmio Total", salesValue: "Vendas", points: "Pontos", ticketAverage: "Ticket Médio", pa: "PA"}[criterion]
                    }</span></CardTitle>
                 </CardHeader>
                 <CardContent>
                    {myData ? (
                         <div className={cn(
                            "rounded-xl p-4 shadow-lg border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
                             myData.rank === 1 && "border-yellow-400/50 bg-primary/10 animate-glow",
                             myData.rank === 2 && "border-slate-400/50 bg-secondary/10",
                             myData.rank === 3 && "border-orange-400/50 bg-chart-3/10",
                             myData.rank > 3 && "border-border/50"
                         )}>
                            <div className="flex items-center gap-4">
                               <div className="text-4xl font-black w-16 text-center">{myData.rank}º</div>
                               <div>
                                  <p className="text-2xl font-bold">{myData.name}</p>
                                  <p className="text-muted-foreground">Sua posição na equipe</p>
                               </div>
                            </div>
                            <div className="w-full sm:w-auto mt-4 sm:mt-0 text-left sm:text-right">
                               <p className="text-3xl font-bold text-green-400">{formatPrize(
                                   criterion === 'totalPrize' ? myData.totalPrize : 
                                   criterion === 'points' ? myData.points + myData.extraPoints :
                                   myData[criterion as keyof Seller],
                                   criterion === 'points' ? 'points' : criterion === 'pa' ? 'decimal' : 'currency'
                               )}</p>
                               <p className="text-sm text-muted-foreground">Valor no critério</p>
                            </div>
                         </div>
                    ) : (
                        <p className="text-muted-foreground">Carregando seus dados...</p>
                    )}
                 </CardContent>
            </Card>
        </div>
        <div className="xl:col-span-1">
             <TeamGoalProgress sellers={sellersData} goals={goalsData} />
        </div>
      </div>
    </div>
  );
}

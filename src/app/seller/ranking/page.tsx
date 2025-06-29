'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    if (!sellers || sellers.length === 0 || !goals?.salesValue?.metinha) {
        return null;
    }
    
    const metinhaThreshold = goals.salesValue.metinha.threshold;
    const teamBonus = 100;

    const sellersWhoReachedGoal = sellers.filter(s => s.salesValue >= metinhaThreshold);
    const isGoalAchieved = sellers.length > 0 && sellersWhoReachedGoal.length === sellers.length;
    const progress = (sellersWhoReachedGoal.length / sellers.length) * 100;

    return (
        <Card className="bg-card/80 shadow-xl rounded-2xl ring-1 ring-white/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="size-6 text-supermoda-secondary" />
                    <span>Meta de Equipe: Metinha para Todos!</span>
                </CardTitle>
                <CardDescription>
                    Se todos atingirem a "Metinha" de vendas ({formatPrize(metinhaThreshold, 'currency')}), 
                    cada um ganha um bônus de <span className="font-bold text-green-400">{formatPrize(teamBonus, 'currency')}</span>.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isGoalAchieved ? (
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

  const isAllPerformanceZero = useMemo(() => 
    sellersData.every(s => s.salesValue === 0 && s.ticketAverage === 0 && s.pa === 0 && s.points === 0 && s.extraPoints === 0), [sellersData]);

  const rankedSellers = useMemo(() => {
    const teamGoalMet = sellersData.length > 0 && sellersData.every(s => s.salesValue >= goalsData.salesValue.metinha.threshold);
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
        return { ...seller, totalPrize };
    });

    if (isAllPerformanceZero) return [...sellersWithPrizes].sort((a,b) => a.name.localeCompare(b.name));
    return sellersWithPrizes.sort((a, b) => b.totalPrize - a.totalPrize || a.name.localeCompare(b.name));
  }, [sellersData, goalsData, isAllPerformanceZero]);

  const myRank = useMemo(() => {
    if (!currentSeller) return null;
    const index = rankedSellers.findIndex(s => s.id === currentSeller.id);
    return index !== -1 ? { rank: index + 1, data: rankedSellers[index] } : null;
  }, [rankedSellers, currentSeller]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Trophy className="size-8 text-primary" />
        <h1 className="text-3xl font-bold font-sans">Meu Desempenho no Ranking</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-4">
            <Card className="bg-gradient-to-br from-card to-background/80 shadow-xl rounded-2xl ring-1 ring-white/10">
                 <CardHeader>
                    <CardTitle>Sua Posição Atual</CardTitle>
                 </CardHeader>
                 <CardContent>
                    {myRank ? (
                         <div className={cn(
                            "rounded-xl p-4 shadow-lg border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
                             myRank.rank === 1 && "border-yellow-400/50 bg-primary/10 animate-glow",
                             myRank.rank === 2 && "border-slate-400/50 bg-secondary/10",
                             myRank.rank === 3 && "border-orange-400/50 bg-chart-3/10",
                             myRank.rank > 3 && "border-border/50"
                         )}>
                            <div className="flex items-center gap-4">
                               <div className="text-4xl font-black w-16 text-center">{myRank.rank}º</div>
                               <div>
                                  <p className="text-2xl font-bold">{myRank.data.name}</p>
                                  <p className="text-muted-foreground">Seu desempenho no ciclo atual</p>
                               </div>
                            </div>
                            <div className="w-full sm:w-auto mt-4 sm:mt-0 text-left sm:text-right">
                               <p className="text-3xl font-bold text-green-400">{formatPrize(myRank.data.totalPrize, 'currency')}</p>
                               <p className="text-sm text-muted-foreground">Prêmio Total Acumulado</p>
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

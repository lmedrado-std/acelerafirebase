'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award, DollarSign, Ticket, Box, Star, Minus, Users, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAdminContext } from '@/app/admin/layout';
import type { Goals, GoalLevel as GoalLevelType, Seller, SalesValueGoals } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type RankingCriterion = 'salesValue' | 'ticketAverage' | 'pa' | 'points' | 'totalPrize';
type GoalLevelName = 'Nenhuma' | 'Metinha' | 'Meta' | 'Metona' | 'Lendária';

const goalLevelConfig: Record<GoalLevelName, { label: string; className: string; progressClass: string }> = {
  'Nenhuma': { label: 'Nenhuma', className: 'bg-muted/50 border-transparent text-muted-foreground', progressClass: 'bg-muted-foreground' },
  'Metinha': { label: 'Metinha', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', progressClass: 'bg-yellow-400' },
  'Meta': { label: 'Meta', className: 'bg-green-500/10 text-green-400 border-green-500/30', progressClass: 'bg-green-400' },
  'Metona': { label: 'Metona', className: 'bg-blue-500/10 text-blue-400 border-blue-500/30', progressClass: 'bg-blue-400' },
  'Lendária': { label: 'Lendária', className: 'bg-purple-500/10 text-purple-400 border-purple-500/30', progressClass: 'bg-purple-400 animate-pulse' },
};

const TeamGoalProgress = ({ sellers, goals }: { sellers: Seller[], goals: Goals }) => {
    if (!sellers || sellers.length === 0 || !goals?.salesValue?.metinha) {
        return null;
    }
    
    const metinhaThreshold = goals.salesValue.metinha.threshold;
    const teamBonus = 100; // Hardcoded bonus as per request

    const sellersWhoReachedGoal = sellers.filter(s => s.salesValue >= metinhaThreshold);
    const isGoalAchieved = sellers.length > 0 && sellersWhoReachedGoal.length === sellers.length;
    const progress = (sellersWhoReachedGoal.length / sellers.length) * 100;

    return (
        <Card className="bg-card/80 shadow-lg ring-1 ring-white/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="size-6 text-primary" />
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
                            <p className="text-sm">Meta atingida! O bônus foi adicionado ao prêmio de todos.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-muted-foreground">Progresso</span>
                            <span className="font-bold">{sellersWhoReachedGoal.length} de {sellers.length} vendedores</span>
                        </div>
                        <Progress value={progress} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-purple-500" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};


const formatPrize = (value: number, type: 'currency' | 'points' | 'decimal') => {
    if (type === 'currency') return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    if (type === 'points') return value.toLocaleString('pt-BR');
    return value.toFixed(1);
}

export default function RankingPage() {
  const { sellers: sellersData, goals: goalsData } = useAdminContext();

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
  
  const getRankIndicator = (index: number) => {
    if (isAllPerformanceZero) return <Minus className="size-6 text-muted-foreground" />;
    if (index === 0) return <Trophy className="size-7 text-yellow-400" />;
    if (index === 1) return <Medal className="size-7 text-gray-300" />;
    if (index === 2) return <Award className="size-7 text-orange-400" />;
    return <span className="font-bold text-xl text-muted-foreground">{index + 1}</span>;
  };

  return (
    <div className="space-y-8">
       <div className="flex items-center gap-4">
        <Trophy className="size-8 text-primary" />
        <h1 className="text-3xl font-bold">Ranking de Vendedores</h1>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
            <Card className="bg-gradient-to-br from-card to-background shadow-xl rounded-2xl ring-1 ring-white/10">
                <CardHeader>
                  <CardTitle>Classificação Geral por Prêmios</CardTitle>
                  <CardDescription>
                      {isAllPerformanceZero ? 'Nenhum dado lançado. A lista está em ordem alfabética.' : 'Classificação baseada no prêmio total acumulado.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border border-border/50">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px] text-center">Pos.</TableHead>
                          <TableHead>Vendedor</TableHead>
                          <TableHead className="text-right"><Star className="inline mr-1 size-4" />Pontos</TableHead>
                          <TableHead className="text-right"><DollarSign className="inline mr-1 size-4" />Vendas</TableHead>
                          <TableHead className="text-right"><Ticket className="inline mr-1 size-4" />T. Médio</TableHead>
                          <TableHead className="text-right"><Box className="inline mr-1 size-4" />PA</TableHead>
                          <TableHead className="text-right font-bold text-primary"><Trophy className="inline mr-1 size-4" />Prêmio Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rankedSellers.map((seller, index) => (
                          <TableRow key={seller.id} className={cn(
                            "transition-all",
                            index === 0 && "bg-primary/10 animate-glow",
                            index === 1 && "bg-gray-500/10",
                            index === 2 && "bg-orange-500/10",
                          )}>
                            <TableCell className="font-bold text-lg flex justify-center items-center h-full py-4">{getRankIndicator(index)}</TableCell>
                            <TableCell className="font-medium text-base">{seller.name}</TableCell>
                            <TableCell className="text-right font-mono">{(seller.points + seller.extraPoints).toLocaleString('pt-BR')}</TableCell>
                            <TableCell className="text-right font-mono">{formatPrize(seller.salesValue, 'currency')}</TableCell>
                            <TableCell className="text-right font-mono">{formatPrize(seller.ticketAverage, 'currency')}</TableCell>
                            <TableCell className="text-right font-mono">{formatPrize(seller.pa, 'decimal')}</TableCell>
                            <TableCell className="text-right font-bold text-lg text-green-400">{formatPrize(seller.totalPrize, 'currency')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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

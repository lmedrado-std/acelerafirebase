'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award, DollarSign, Ticket, Box, Star } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSellerContext } from '@/app/seller/layout';
import type { GoalLevel as GoalLevelType, Seller, Goals } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type RankingCriterion = 'salesValue' | 'ticketAverage' | 'pa' | 'points';
type GoalLevelName = 'Nenhuma' | 'Metinha' | 'Meta' | 'Metona' | 'Lendária';

const goalLevelConfig: Record<GoalLevelName, { label: string; className: string }> = {
  'Nenhuma': { label: 'Nenhuma', className: 'bg-muted border-transparent text-muted-foreground hover:bg-muted' },
  'Metinha': { label: 'Metinha', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  'Meta': { label: 'Meta', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
  'Metona': { label: 'Metona', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  'Lendária': { label: 'Lendária', className: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
};

export default function RankingPage() {
  const [criterion, setCriterion] = useState<RankingCriterion>('salesValue');
  const { sellers: sellersData, goals: goalsData, currentSeller } = useSellerContext();

  const sortedSellers = useMemo(() => {
     const sellersWithPrizes = sellersData.map(seller => {
        let totalPrize = 0;
        const criteria: Array<keyof Goals> = ['salesValue', 'ticketAverage', 'pa', 'points'];
        
        criteria.forEach(crit => {
            const goals = goalsData[crit];
            const sellerValue = crit === 'points' ? seller.points + seller.extraPoints : seller[crit];

            if (sellerValue >= goals.metinha.threshold) totalPrize += goals.metinha.prize;
            if (sellerValue >= goals.meta.threshold) totalPrize += goals.meta.prize;
            if (sellerValue >= goals.metona.threshold) totalPrize += goals.metona.prize;
            if (sellerValue >= goals.lendaria.threshold) totalPrize += goals.lendaria.prize;
        });

        // Performance Bonus Calculation (only for salesValue)
        const salesGoals = goalsData.salesValue;
        if (seller.salesValue > salesGoals.lendaria.threshold && salesGoals.performanceBonus && salesGoals.performanceBonus.per > 0) {
             const excessSales = seller.salesValue - salesGoals.lendaria.threshold;
             const bonusUnits = Math.floor(excessSales / salesGoals.performanceBonus.per);
             totalPrize += bonusUnits * salesGoals.performanceBonus.prize;
        }

        return { ...seller, totalPrize };
    });

    return sellersWithPrizes.sort((a, b) => {
        if (criterion === 'points') {
            return (b.points + b.extraPoints) - (a.points + a.extraPoints);
        }
        return b[criterion] - a[criterion];
    });
  }, [sellersData, goalsData, criterion]);
  
  const getCriterionLabel = (currentCriterion: RankingCriterion) => {
    switch (currentCriterion) {
      case 'salesValue':
        return 'Valor de Venda';
      case 'ticketAverage':
        return 'Ticket Médio';
      case 'pa':
        return 'PA';
      case 'points':
        return 'Pontos';
      default:
        return '';
    }
  };

  const formatValue = (value: number, currentCriterion: RankingCriterion) => {
    if (currentCriterion === 'pa') {
        return value.toFixed(1);
    }
    if (currentCriterion === 'points') {
        return value.toLocaleString('pt-BR');
    }
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  const formatPrize = (value: number) => {
     return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const getGoalProgress = (value: number, criterion: RankingCriterion) => {
    const goals = goalsData[criterion];
    let nextGoal, currentGoalBase, nextGoalLabel, progress;

    if (value >= goals.lendaria.threshold) {
      return { percent: 100, label: `Nível Lendário Atingido!`, details: `${formatValue(value, criterion)}` };
    }
    if (value >= goals.metona.threshold) {
      nextGoal = goals.lendaria.threshold;
      currentGoalBase = goals.metona.threshold;
      nextGoalLabel = 'Lendária';
    } else if (value >= goals.meta.threshold) {
      nextGoal = goals.metona.threshold;
      currentGoalBase = goals.meta.threshold;
      nextGoalLabel = 'Metona';
    } else if (value >= goals.metinha.threshold) {
      nextGoal = goals.meta.threshold;
      currentGoalBase = goals.metinha.threshold;
      nextGoalLabel = 'Meta';
    } else {
      nextGoal = goals.metinha.threshold;
      currentGoalBase = 0;
      nextGoalLabel = 'Metinha';
    }

    if (nextGoal - currentGoalBase <= 0) {
      progress = 100;
    } else {
      progress = Math.min(100, ((value - currentGoalBase) / (nextGoal - currentGoalBase)) * 100);
    }
    
    return { 
      percent: progress, 
      label: `Próximo Nível: ${nextGoalLabel}`,
      details: `${formatValue(value, criterion)} / ${formatValue(nextGoal, criterion)}`
    };
  };
  
  const getRankIndicator = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-400" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Award className="h-6 w-6 text-orange-400" />;
    return <span className="font-bold text-lg text-muted-foreground">{index + 1}</span>;
  };

  return (
    <div className="space-y-8">
       <div className="flex items-center gap-4">
        <Trophy className="size-8 text-primary" />
        <h1 className="text-3xl font-bold">Ranking de Vendedores</h1>
      </div>
      
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Filtros do Ranking</CardTitle>
          <CardDescription>Selecione o critério para visualizar a classificação dos vendedores.</CardDescription>
        </CardHeader>
        <CardContent>
            <div>
                <Label className="text-sm font-medium mb-2 block">Critério de Classificação</Label>
                <Tabs value={criterion} onValueChange={(value) => setCriterion(value as RankingCriterion)}>
                    <TabsList className="grid w-full grid-cols-4 bg-input p-1 h-auto">
                        <TabsTrigger value="salesValue" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
                            <DollarSign className="mr-2 size-4" /> Vendas
                        </TabsTrigger>
                        <TabsTrigger value="ticketAverage" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
                            <Ticket className="mr-2 size-4" /> Ticket Médio
                        </TabsTrigger>
                        <TabsTrigger value="pa" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
                            <Box className="mr-2 size-4" /> PA
                        </TabsTrigger>
                          <TabsTrigger value="points" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
                            <Star className="mr-2 size-4" /> Pontos
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Classificação por {getCriterionLabel(criterion)}</CardTitle>
           <CardDescription>
              Visualizando a classificação dos vendedores com base nos dados mais recentes.
           </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] text-center">Posição</TableHead>
                      <TableHead>Vendedor</TableHead>
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end gap-2">
                            <span>Prêmios (R$)</span>
                            <Award className="size-4 text-green-400" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[320px] text-center">Nível da Meta</TableHead>
                      <TableHead className="w-[300px]">Progresso da Meta</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedSellers.map((seller, index) => {
                      const sellerValue = criterion === 'points' ? seller.points + seller.extraPoints : seller[criterion];
                      const criterionGoals = goalsData[criterion];
                      const allGoals: Array<{ name: GoalLevelName; threshold: number; prize: number }> = [
                        { name: 'Metinha', ...criterionGoals.metinha },
                        { name: 'Meta', ...criterionGoals.meta },
                        { name: 'Metona', ...criterionGoals.metona },
                        { name: 'Lendária', ...criterionGoals.lendaria },
                      ];
                      const { percent, label, details } = getGoalProgress(sellerValue, criterion);
                      
                      return (
                        <TableRow key={seller.id} className={cn(
                          seller.id === currentSeller.id && 'bg-primary/10',
                          index < 3 && 'bg-card-foreground/5'
                        )}>
                          <TableCell className="font-bold text-lg flex justify-center items-center h-full py-4">
                            {getRankIndicator(index)}
                          </TableCell>
                          <TableCell className="font-medium">{seller.name}</TableCell>
                           <TableCell className="text-right font-semibold text-green-400">
                             {formatPrize((seller as any).totalPrize)}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center items-center gap-1.5 flex-wrap">
                              {allGoals.map((goal) => {
                                const isAchieved = sellerValue >= goal.threshold;
                                const config = goalLevelConfig[goal.name];
                                return (
                                  <TooltipProvider key={goal.name}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge
                                          className={cn(
                                            'transition-all duration-300 ease-in-out',
                                            isAchieved
                                              ? `${config.className} scale-110 border-2 border-current shadow-lg`
                                              : 'bg-muted border-transparent text-muted-foreground opacity-60 hover:bg-muted'
                                          )}
                                        >
                                          {goal.name}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <div className="space-y-1 text-xs text-left">
                                          <p className="font-semibold">{goal.name}</p>
                                          <p>Meta: {formatValue(goal.threshold, criterion)}</p>
                                          <p>Prêmio: <span className="font-bold text-green-400">{formatPrize(goal.prize)}</span></p>
                                           {criterion === 'salesValue' && goal.name === 'Lendária' && goalsData.salesValue.performanceBonus && (
                                            <p className="text-xs italic text-primary/80 pt-1 border-t border-border/20 mt-1">
                                                Bônus: +{formatPrize(goalsData.salesValue.performanceBonus.prize)} a cada {formatPrize(goalsData.salesValue.performanceBonus.per)} extra
                                            </p>
                                          )}
                                          <p>Seu valor: {formatValue(sellerValue, criterion)}</p>
                                          <p className={cn("font-bold", isAchieved ? 'text-green-400' : 'text-yellow-400')}>
                                            {isAchieved ? 'Atingida!' : 'Pendente'}
                                          </p>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                );
                              })}
                            </div>
                          </TableCell>
                           <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex flex-col gap-1.5 text-left w-full">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm font-medium">{label}</span>
                                      <span className="text-sm font-bold">{percent.toFixed(0)}%</span>
                                    </div>
                                    <Progress value={percent} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-purple-500" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{details}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

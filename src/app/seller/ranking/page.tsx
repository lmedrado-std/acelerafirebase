'use client';

import React, {useState, useMemo} from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {
  Trophy,
  Award,
  DollarSign,
  Ticket,
  Box,
  Star,
} from 'lucide-react';
import {Label} from '@/components/ui/label';
import {Badge} from '@/components/ui/badge';
import {useSellerContext} from '@/app/seller/layout';
import type {Goals, SalesValueGoals} from '@/lib/types';
import {Progress} from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {cn} from '@/lib/utils';

type RankingCriterion =
  | 'salesValue'
  | 'ticketAverage'
  | 'pa'
  | 'points'
  | 'totalPrize';
type GoalLevelName = 'Nenhuma' | 'Metinha' | 'Meta' | 'Metona' | 'Lendária';

const goalLevelConfig: Record<GoalLevelName, {label: string; className: string}> =
  {
    Nenhuma: {
      label: 'Nenhuma',
      className:
        'bg-muted border-transparent text-muted-foreground hover:bg-muted',
    },
    Metinha: {
      label: 'Metinha',
      className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    },
    Meta: {
      label: 'Meta',
      className: 'bg-green-500/10 text-green-500 border-green-500/20',
    },
    Metona: {
      label: 'Metona',
      className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    Lendária: {
      label: 'Lendária',
      className: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
  };

export default function RankingPage() {
  const [criterion, setCriterion] = useState<RankingCriterion>('salesValue');
  const {
    sellers: sellersData,
    goals: goalsData,
    currentSeller,
  } = useSellerContext();

  const sortedSellers = useMemo(() => {
    const sellersWithPrizes = sellersData.map(seller => {
      const prizes: Record<
        keyof Omit<Goals, 'salesValue'> | 'salesValue',
        number
      > = {
        salesValue: 0,
        ticketAverage: 0,
        pa: 0,
        points: 0,
      };

      const allCriteria: Array<keyof Goals> = [
        'salesValue',
        'ticketAverage',
        'pa',
        'points',
      ];

      allCriteria.forEach(crit => {
        const goals = goalsData[crit];
        const sellerValue =
          crit === 'points' ? seller.points + seller.extraPoints : seller[crit];

        let currentPrize = 0;
        if (sellerValue >= goals.metinha.threshold)
          currentPrize += goals.metinha.prize;
        if (sellerValue >= goals.meta.threshold)
          currentPrize += goals.meta.prize;
        if (sellerValue >= goals.metona.threshold)
          currentPrize += goals.metona.prize;
        if (sellerValue >= goals.lendaria.threshold)
          currentPrize += goals.lendaria.prize;

        // Add performance bonus only if criterion is salesValue
        if (crit === 'salesValue') {
          const salesGoals = goals as SalesValueGoals;
          if (
            seller.salesValue > salesGoals.lendaria.threshold &&
            salesGoals.performanceBonus &&
            salesGoals.performanceBonus.per > 0
          ) {
            const excessSales =
              seller.salesValue - salesGoals.lendaria.threshold;
            const bonusUnits = Math.floor(
              excessSales / salesGoals.performanceBonus.per
            );
            currentPrize += bonusUnits * salesGoals.performanceBonus.prize;
          }
        }
        prizes[crit] = currentPrize;
      });

      const totalPrize = Object.values(prizes).reduce((sum, p) => sum + p, 0);

      return {...seller, prizes, totalPrize};
    });

    return sellersWithPrizes.sort((a, b) => {
      if (criterion === 'totalPrize') {
        return b.totalPrize - a.totalPrize;
      }
      if (criterion === 'points') {
        return b.points + b.extraPoints - (a.points + a.extraPoints);
      }
      return b[criterion] - a[criterion];
    });
  }, [sellersData, goalsData, criterion]);

  const currentUserRank = useMemo(() => {
    if (!currentSeller) return 0;
    const rank = sortedSellers.findIndex(s => s.id === currentSeller.id);
    return rank + 1;
  }, [sortedSellers, currentSeller]);

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
      case 'totalPrize':
        return 'Prêmio Total';
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
    return `R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  };

  const formatPrize = (value: number) => {
    return value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
  };

  const getGoalProgress = (value: number, criterion: RankingCriterion) => {
    if (criterion === 'totalPrize')
      return {percent: 100, label: 'N/A', details: 'N/A'};
    const goals = goalsData[criterion];
    let nextGoal, currentGoalBase, nextGoalLabel, progress;

    if (value >= goals.lendaria.threshold) {
      return {
        percent: 100,
        label: `Nível Lendário Atingido!`,
        details: `${formatValue(value, criterion)}`,
      };
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
      progress = Math.min(
        100,
        ((value - currentGoalBase) / (nextGoal - currentGoalBase)) * 100
      );
    }

    return {
      percent: progress,
      label: `Próximo Nível: ${nextGoalLabel}`,
      details: `${formatValue(value, criterion)} / ${formatValue(nextGoal, criterion)}`,
    };
  };
  
  const sellerData = sortedSellers.find(s => s.id === currentSeller.id);

  if (!sellerData) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <p>Carregando seus dados de performance...</p>
        </div>
    )
  }
  
  const sellerValue =
    criterion === 'totalPrize'
      ? sellerData.totalPrize
      : criterion === 'points'
      ? sellerData.points + sellerData.extraPoints
      : sellerData[criterion];

  const criterionGoals =
    criterion !== 'totalPrize' ? goalsData[criterion] : null;

  const allGoals: Array<{
    name: GoalLevelName;
    threshold: number;
    prize: number;
  }> = criterionGoals
    ? [
        {name: 'Metinha', ...criterionGoals.metinha},
        {name: 'Meta', ...criterionGoals.meta},
        {name: 'Metona', ...criterionGoals.metona},
        {name: 'Lendária', ...criterionGoals.lendaria},
      ]
    : [];

  const {percent, label, details} = getGoalProgress(
    sellerValue,
    criterion
  );

  const prizeToDisplay =
    criterion === 'totalPrize'
      ? sellerData.totalPrize
      : sellerData.prizes[criterion as keyof typeof sellerData.prizes] ||
        0;


  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Trophy className="size-8 text-primary" />
        <h1 className="text-3xl font-bold">Meu Desempenho</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sua Posição no Ranking Geral</CardTitle>
          <CardDescription>
            Sua classificação atual com base no critério:{' '}
            <span className="font-bold text-primary">
              {getCriterionLabel(criterion)}
            </span>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {currentUserRank > 0 ? (
              <>
                <span className="text-muted-foreground">Posição:</span>{' '}
                <span className="text-primary">{currentUserRank}º</span>
              </>
            ) : (
              'Carregando sua posição...'
            )}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Filtros de Desempenho</CardTitle>
          <CardDescription>
            Selecione um critério para visualizar seus resultados em detalhes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Critério de Análise
            </Label>
            <Tabs
              value={criterion}
              onValueChange={value => setCriterion(value as RankingCriterion)}
            >
              <TabsList className="grid w-full grid-cols-5 bg-input p-1 h-auto">
                <TabsTrigger
                  value="salesValue"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                >
                  <DollarSign className="mr-2 size-4" /> Vendas
                </TabsTrigger>
                <TabsTrigger
                  value="ticketAverage"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                >
                  <Ticket className="mr-2 size-4" /> Ticket Médio
                </TabsTrigger>
                <TabsTrigger
                  value="pa"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                >
                  <Box className="mr-2 size-4" /> PA
                </TabsTrigger>
                <TabsTrigger
                  value="points"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                >
                  <Star className="mr-2 size-4" /> Pontos
                </TabsTrigger>
                <TabsTrigger
                  value="totalPrize"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                >
                  <Trophy className="mr-2 size-4" /> Prêmio Total
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Detalhes por {getCriterionLabel(criterion)}</CardTitle>
          <CardDescription>
            Seu resultado detalhado para o critério selecionado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className={cn(
                "grid gap-4",
                criterion === 'salesValue' ? "grid-cols-1" : "grid-cols-2"
            )}>
                {criterion !== 'salesValue' && (
                  <div className="flex flex-col space-y-1 rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Seu Resultado</p>
                      <p className="text-3xl font-bold">
                          {formatValue(sellerValue, criterion)}
                      </p>
                  </div>
                )}
                 <div className="flex flex-col space-y-1 rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Prêmio Recebido</p>
                    <p className="text-3xl font-bold text-green-400">{formatPrize(prizeToDisplay)}</p>
                </div>
            </div>

            {criterion !== 'totalPrize' && criterionGoals && (
            <>
                <div>
                    <h4 className="font-semibold mb-3">Níveis de Meta Atingidos</h4>
                    <div className="flex items-center gap-1.5 flex-wrap">
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
                                    <p className="font-semibold">
                                    {goal.name}
                                    </p>
                                    <p>
                                    Meta:{' '}
                                    {formatValue(
                                        goal.threshold,
                                        criterion
                                    )}
                                    </p>
                                    <p>
                                    Prêmio:{' '}
                                    <span className="font-bold text-green-400">
                                        {formatPrize(goal.prize)}
                                    </span>
                                    </p>
                                    {criterion === 'salesValue' &&
                                    goal.name === 'Lendária' &&
                                    goalsData.salesValue
                                        .performanceBonus && (
                                        <p className="text-xs italic text-primary/80 pt-1 border-t border-border/20 mt-1">
                                        Bônus: +
                                        {formatPrize(
                                            goalsData.salesValue
                                            .performanceBonus.prize
                                        )}{' '}
                                        a cada{' '}
                                        {formatPrize(
                                            goalsData.salesValue
                                            .performanceBonus.per
                                        )}{' '}
                                        extra
                                        </p>
                                    )}
                                    {criterion !== 'salesValue' && (
                                      <p>
                                      Seu valor:{' '}
                                      {formatValue(sellerValue, criterion)}
                                      </p>
                                    )}
                                    <p
                                    className={cn(
                                        'font-bold',
                                        isAchieved
                                        ? 'text-green-400'
                                        : 'text-yellow-400'
                                    )}
                                    >
                                    {isAchieved
                                        ? 'Atingida!'
                                        : 'Pendente'}
                                    </p>
                                </div>
                                </TooltipContent>
                            </Tooltip>
                            </TooltipProvider>
                        );
                        })}
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold mb-3">Progresso para Próxima Meta</h4>
                    <TooltipProvider>
                        <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex flex-col gap-1.5 text-left w-full">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">
                                {label}
                                </span>
                                <span className="text-sm font-bold">
                                {percent.toFixed(0)}%
                                </span>
                            </div>
                            <Progress
                                value={percent}
                                className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-purple-500"
                            />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{details}</p>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

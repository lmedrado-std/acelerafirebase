'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award, DollarSign, Ticket, Box, Star, Minus, Users, CheckCircle, Info } from 'lucide-react';
import { useAdminContext } from '@/app/admin/layout';
import type { Goals, Seller } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { cn, calculateSellerPrizes } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TeamGoalProgress = ({ sellers, goals }: { sellers: Seller[], goals: Goals }) => {
    if (!sellers || !goals?.salesValue?.metinha) {
        return null;
    }
    
    const teamBonus = 100; // Hardcoded bonus as per request

    const sellersWhoReachedGoal = sellers.filter(s => s.salesValue >= goals.salesValue.metinha.threshold && goals.salesValue.metinha.threshold > 0);
    // Goal is only considered if there is more than one seller
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
                            <p className="text-sm">Meta atingida! O bônus foi adicionado ao prêmio de todos.</p>
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
    const teamGoalMet = sellersData.length > 1 && sellersData.every(s => s.salesValue >= goalsData.salesValue.metinha.threshold && goalsData.salesValue.metinha.threshold > 0);
    const teamBonusValue = 100;

    const sellersWithPrizes = sellersData.map(seller => {
        const calculated = calculateSellerPrizes(seller, goalsData);
        let { totalPrize } = calculated;
        const teamBonus = teamGoalMet ? teamBonusValue : 0;
        
        totalPrize += teamBonus;

        return { ...calculated, totalPrize, teamBonus };
    });

    if (isAllPerformanceZero) return [...sellersWithPrizes].sort((a,b) => a.name.localeCompare(b.name));
    return sellersWithPrizes.sort((a, b) => b.totalPrize - a.totalPrize || a.name.localeCompare(b.name));
  }, [sellersData, goalsData, isAllPerformanceZero]);
  
  const getRankIndicator = (index: number) => {
    if (isAllPerformanceZero) return <Minus className="size-6 text-muted-foreground" />;
    if (index === 0) return <Trophy className="size-7 text-yellow-400" />;
    if (index === 1) return <Medal className="size-7" style={{ color: '#C0C0C0' }} />;
    if (index === 2) return <Award className="size-7" style={{ color: '#CD7F32' }} />;
    return <span className="font-bold text-xl text-muted-foreground">{index + 1}</span>;
  };

  return (
    <div className="space-y-8">
       <div className="flex items-center gap-4">
        <Trophy className="size-8 text-primary" />
        <h1 className="text-3xl font-bold font-sans">Ranking de Vendedores</h1>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
            <Card className="bg-gradient-to-br from-card to-background/80 text-white shadow-xl rounded-2xl ring-1 ring-white/10">
                <CardHeader>
                  <CardTitle>Classificação Geral por Prêmios</CardTitle>
                  <CardDescription>
                      {isAllPerformanceZero ? 'Nenhum dado lançado. A lista está em ordem alfabética.' : 'Classificação baseada no prêmio total acumulado.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border border-border/50 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/50">
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
                            "transition-all border-border/30",
                            index === 0 && "bg-primary/10 animate-glow",
                            index === 1 && "bg-secondary/10",
                            index === 2 && "bg-chart-3/10",
                          )}>
                            <TableCell className="font-bold text-lg flex justify-center items-center h-full py-4">{getRankIndicator(index)}</TableCell>
                            <TableCell className="font-medium text-base">{seller.name}</TableCell>
                            <TableCell className="text-right font-mono">{(seller.points + seller.extraPoints).toLocaleString('pt-BR')}</TableCell>
                            <TableCell className="text-right font-mono">{formatPrize(seller.salesValue, 'currency')}</TableCell>
                            <TableCell className="text-right font-mono">{formatPrize(seller.ticketAverage, 'currency')}</TableCell>
                            <TableCell className="text-right font-mono">{formatPrize(seller.pa, 'decimal')}</TableCell>
                            <TableCell className="text-right font-bold text-lg text-green-400">
                                <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <span className="cursor-help border-b border-dotted border-green-400/50 flex items-center justify-end gap-2">
                                        {formatPrize(seller.totalPrize, 'currency')}
                                        <Info className="size-3.5 text-muted-foreground" />
                                    </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                    <div className="p-1 text-sm">
                                        <h4 className="font-bold mb-2 text-base">Composição do Prêmio</h4>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Vendas:</span>
                                                <span className="font-mono ml-4 font-semibold">{formatPrize(seller.prizes.salesValue, 'currency')}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">T. Médio:</span>
                                                <span className="font-mono ml-4 font-semibold">{formatPrize(seller.prizes.ticketAverage, 'currency')}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">PA:</span>
                                                <span className="font-mono ml-4 font-semibold">{formatPrize(seller.prizes.pa, 'currency')}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Pontos:</span>
                                                <span className="font-mono ml-4 font-semibold">{formatPrize(seller.prizes.points, 'currency')}</span>
                                            </div>
                                            {seller.teamBonus > 0 && (
                                                <>
                                                <div className="pt-2 mt-2 border-t border-border/50"></div>
                                                <div className="flex justify-between items-center text-green-400">
                                                    <span className="font-bold">Bônus de Equipe:</span>
                                                    <span className="font-mono ml-4 font-bold">{formatPrize(seller.teamBonus, 'currency')}</span>
                                                </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    </TooltipContent>
                                </Tooltip>
                                </TooltipProvider>
                            </TableCell>
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

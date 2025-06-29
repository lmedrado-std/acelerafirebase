'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { History, Medal, Trophy, Award } from 'lucide-react';
import { useAdminContext } from '@/app/admin/layout';
import type { Seller, Goals, SalesValueGoals } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// This function can be a shared utility, but for now, we'll keep it here.
const calculateSellerPrizes = (seller: Seller, goals: Goals) => {
    const prizes: Record<keyof Omit<Goals, 'salesValue' | 'gamification'>, number> = {
        salesValue: 0,
        ticketAverage: 0,
        pa: 0,
        points: 0,
    };

    const allCriteria: Array<keyof typeof prizes> = ['salesValue', 'ticketAverage', 'pa', 'points'];
    
    allCriteria.forEach(crit => {
        if (crit === 'salesValue' || crit === 'ticketAverage' || crit === 'pa' || crit === 'points') {
            const goalLevels = goals[crit];
            const sellerValue = crit === 'points' ? seller.points + seller.extraPoints : seller[crit];

            let currentPrize = 0;
            if (sellerValue >= goalLevels.metinha.threshold) currentPrize += goalLevels.metinha.prize;
            if (sellerValue >= goalLevels.meta.threshold) currentPrize += goalLevels.meta.prize;
            if (sellerValue >= goalLevels.metona.threshold) currentPrize += goalLevels.metona.prize;
            if (sellerValue >= goalLevels.lendaria.threshold) currentPrize += goalLevels.lendaria.prize;

            if (crit === 'salesValue') {
                const salesGoals = goalLevels as SalesValueGoals;
                if (seller.salesValue > salesGoals.lendaria.threshold && salesGoals.performanceBonus && salesGoals.performanceBonus.per > 0) {
                    const excessSales = seller.salesValue - salesGoals.lendaria.threshold;
                    const bonusUnits = Math.floor(excessSales / salesGoals.performanceBonus.per);
                    currentPrize += bonusUnits * salesGoals.performanceBonus.prize;
                }
            }
            prizes[crit] = currentPrize;
        }
    });

    const totalPrize = Object.values(prizes).reduce((sum, p) => sum + p, 0);

    return { ...seller, totalPrize };
}

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const getRankIndicator = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-400" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Award className="h-6 w-6 text-orange-400" />;
    return <span className="font-bold text-lg text-muted-foreground">{index + 1}</span>;
};


export default function HistoricoPage() {
  const { cycleHistory } = useAdminContext();
  const reversedHistory = [...cycleHistory].reverse();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <History className="size-8 text-primary" />
        <h1 className="text-3xl font-bold">Histórico de Ciclos</h1>
      </div>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Ciclos de Premiação Finalizados</CardTitle>
          <CardDescription>
            Visualize os resultados e rankings de ciclos de premiação anteriores.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reversedHistory.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {reversedHistory.map((snapshot) => {
                const rankedSellers = snapshot.sellers.map(s => calculateSellerPrizes(s, snapshot.goals))
                  .sort((a, b) => b.totalPrize - a.totalPrize);

                return (
                  <AccordionItem value={snapshot.id} key={snapshot.id}>
                    <AccordionTrigger className='text-lg'>
                      Ciclo Finalizado em: {format(new Date(snapshot.endDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className='text-muted-foreground mb-4'>Ranking final do ciclo, com base no prêmio total acumulado por cada vendedor.</p>
                      <div className="rounded-md border border-border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px] text-center">Posição</TableHead>
                              <TableHead>Vendedor</TableHead>
                              <TableHead className="text-right">Vendas</TableHead>
                              <TableHead className="text-right">T. Médio</TableHead>
                              <TableHead className="text-right">PA</TableHead>
                              <TableHead className="text-right">Pontos</TableHead>
                              <TableHead className="text-right font-bold text-primary">Prêmio Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {rankedSellers.map((seller, index) => (
                              <TableRow key={seller.id} className={index < 3 ? 'bg-card-foreground/5' : ''}>
                                <TableCell className="font-bold text-lg flex justify-center items-center h-full py-4">
                                  {getRankIndicator(index)}
                                </TableCell>
                                <TableCell className="font-medium">{seller.name}</TableCell>
                                <TableCell className="text-right">{formatCurrency(seller.salesValue)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(seller.ticketAverage)}</TableCell>
                                <TableCell className="text-right">{seller.pa.toFixed(2)}</TableCell>
                                <TableCell className="text-right">{(seller.points + seller.extraPoints).toLocaleString('pt-BR')}</TableCell>
                                <TableCell className="text-right font-bold text-green-400">{formatCurrency(seller.totalPrize)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          ) : (
            <div className="text-center text-muted-foreground border-2 border-dashed border-border rounded-lg p-12">
              <History className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 font-semibold">Nenhum ciclo finalizado</p>
              <p className="text-sm">
                Quando você finalizar um ciclo na tela de Configurações, ele aparecerá aqui.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

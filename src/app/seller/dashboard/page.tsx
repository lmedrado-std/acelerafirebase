'use client';

import {useSellerContext} from '@/app/seller/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {Progress} from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {format} from 'date-fns';
import {Star, Ticket, Box} from 'lucide-react';
import type {Mission} from '@/lib/types';

export default function SellerDashboardPage() {
  const {currentSeller, missions, goals} = useSellerContext();
  const totalPoints = currentSeller.points + currentSeller.extraPoints;

  const getGoalProgress = (
    value: number,
    criterion: 'salesValue' | 'ticketAverage' | 'pa' | 'points'
  ) => {
    const goalLevels = goals[criterion];
    if (value >= goalLevels.lendaria.threshold) return 100;
    if (value >= goalLevels.metona.threshold)
      return (
        75 +
        ((value - goalLevels.metona.threshold) /
          (goalLevels.lendaria.threshold - goalLevels.metona.threshold)) *
          25
      );
    if (value >= goalLevels.meta.threshold)
      return (
        50 +
        ((value - goalLevels.meta.threshold) /
          (goalLevels.metona.threshold - goalLevels.meta.threshold)) *
          25
      );
    if (value >= goalLevels.metinha.threshold)
      return (
        25 +
        ((value - goalLevels.metinha.threshold) /
          (goalLevels.meta.threshold - goalLevels.metinha.threshold)) *
          25
      );
    return (value / goalLevels.metinha.threshold) * 25;
  };

  const formatReward = (mission: Mission) => {
    if (mission.rewardType === 'cash') {
      return mission.rewardValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    }
    return `${mission.rewardValue} pts`;
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Olá, {currentSeller.name}!</h1>
        <p className="text-muted-foreground">
          Bem-vindo(a) de volta ao seu painel. Aqui está o seu desempenho.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pontos</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPoints.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              Progresso para a próxima meta
            </p>
            <Progress
              value={getGoalProgress(totalPoints, 'points')}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentSeller.ticketAverage.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Progresso para a próxima meta
            </p>
            <Progress
              value={getGoalProgress(
                currentSeller.ticketAverage,
                'ticketAverage'
              )}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos por Atendimento (PA)
            </CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentSeller.pa.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Progresso para a próxima meta
            </p>
            <Progress
              value={getGoalProgress(currentSeller.pa, 'pa')}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Missões Ativas</CardTitle>
          <CardDescription>
            Participe desses desafios para ganhar pontos extras!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Missão</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead className="text-right">Recompensa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {missions.map(mission => (
                  <TableRow key={mission.id}>
                    <TableCell className="font-medium">{mission.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {mission.description}
                    </TableCell>
                    <TableCell>
                      {format(mission.startDate, 'dd/MM/yy')} -{' '}
                      {format(mission.endDate, 'dd/MM/yy')}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {formatReward(mission)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

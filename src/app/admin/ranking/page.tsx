'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award, DollarSign, Ticket, Box } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

type Seller = {
  id: string;
  name: string;
  salesValue: number;
  ticketAverage: number;
  pa: number;
};

const sellersData: Seller[] = [
    { id: '1', name: 'Rian Breston', salesValue: 5240.75, ticketAverage: 150.25, pa: 2.1 },
    { id: '2', name: 'Carla Dias', salesValue: 4890.50, ticketAverage: 142.80, pa: 2.5 },
    { id: '3', name: 'Marcos Andrade', salesValue: 6100.00, ticketAverage: 185.00, pa: 1.9 },
    { id: '4', name: 'Ana Pereira', salesValue: 5800.00, ticketAverage: 190.50, pa: 2.0 },
    { id: '5', name: 'Lucas Martins', salesValue: 4200.20, ticketAverage: 120.70, pa: 2.9 },
];

type RankingCriterion = 'salesValue' | 'ticketAverage' | 'pa';
type TimePeriod = 'dia' | 'semana' | 'mes';
type GoalLevel = 'Nenhuma' | 'Metinha' | 'Meta' | 'Metona' | 'Lendária';

const goalLevelConfig: Record<GoalLevel, { label: string; className: string }> = {
  'Nenhuma': { label: 'Nenhuma', className: 'bg-muted border-transparent text-muted-foreground hover:bg-muted' },
  'Metinha': { label: 'Metinha', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  'Meta': { label: 'Meta', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
  'Metona': { label: 'Metona', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  'Lendária': { label: 'Lendária', className: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
};

const getGoalLevel = (value: number, criterion: RankingCriterion): GoalLevel => {
  const thresholds: Record<RankingCriterion, { threshold: number; level: GoalLevel }[]> = {
    salesValue: [
      { threshold: 7000, level: 'Lendária' },
      { threshold: 6000, level: 'Metona' },
      { threshold: 5000, level: 'Meta' },
      { threshold: 4000, level: 'Metinha' },
    ],
    ticketAverage: [
      { threshold: 200, level: 'Lendária' },
      { threshold: 180, level: 'Metona' },
      { threshold: 150, level: 'Meta' },
      { threshold: 130, level: 'Metinha' },
    ],
    pa: [
      { threshold: 3.0, level: 'Lendária' },
      { threshold: 2.8, level: 'Metona' },
      { threshold: 2.5, level: 'Meta' },
      { threshold: 2.0, level: 'Metinha' },
    ],
  };

  const criterionThresholds = thresholds[criterion];
  for (const item of criterionThresholds) {
    if (value >= item.threshold) {
      return item.level;
    }
  }
  return 'Nenhuma';
};

export default function RankingPage() {
  const [criterion, setCriterion] = useState<RankingCriterion>('salesValue');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('mes');

  const sortedSellers = useMemo(() => {
    // NOTE: The time period filtering is mocked for now. In a real app, this would involve
    // fetching and processing data based on the selected 'timePeriod' before sorting.
    const data = [...sellersData];
    return data.sort((a, b) => b[criterion] - a[criterion]);
  }, [criterion, timePeriod]);
  
  const getCriterionLabel = (currentCriterion: RankingCriterion) => {
    switch (currentCriterion) {
      case 'salesValue':
        return 'Valor de Venda';
      case 'ticketAverage':
        return 'Ticket Médio';
      case 'pa':
        return 'PA';
      default:
        return '';
    }
  };

  const formatValue = (value: number, currentCriterion: RankingCriterion) => {
    if (currentCriterion === 'pa') {
        return value.toFixed(1);
    }
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  const getRankIndicator = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-400" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Award className="h-6 w-6 text-orange-400" />;
    return <span className="font-bold text-lg text-muted-foreground">{index + 1}</span>;
  };

  const getTimePeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case 'dia': return 'Diário';
      case 'semana': return 'Semanal';
      case 'mes': return 'Mensal';
    }
  }

  return (
    <div className="space-y-8">
       <div className="flex items-center gap-4">
        <Trophy className="size-8 text-primary" />
        <h1 className="text-3xl font-bold">Ranking de Vendedores</h1>
      </div>
      
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Filtros do Ranking</CardTitle>
          <CardDescription>Selecione os critérios para visualizar a classificação dos vendedores.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                 <div>
                    <Label className="text-sm font-medium mb-2 block">Critério de Classificação</Label>
                    <Tabs value={criterion} onValueChange={(value) => setCriterion(value as RankingCriterion)}>
                        <TabsList className="grid w-full grid-cols-3 bg-input p-1 h-auto">
                            <TabsTrigger value="salesValue" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
                                <DollarSign className="mr-2 size-4" /> Vendas
                            </TabsTrigger>
                            <TabsTrigger value="ticketAverage" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
                                <Ticket className="mr-2 size-4" /> Ticket Médio
                            </TabsTrigger>
                            <TabsTrigger value="pa" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
                                <Box className="mr-2 size-4" /> PA
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                 <div>
                    <Label className="text-sm font-medium mb-2 block">Período</Label>
                    <Tabs value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
                        <TabsList className="grid w-full grid-cols-3 bg-input p-1 h-auto">
                            <TabsTrigger value="dia" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">Dia</TabsTrigger>
                            <TabsTrigger value="semana" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">Semana</TabsTrigger>
                            <TabsTrigger value="mes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">Mês</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Classificação por {getCriterionLabel(criterion)}</CardTitle>
           <CardDescription>
              Visualizando a classificação dos vendedores para o período: <span className="font-semibold capitalize">{getTimePeriodLabel(timePeriod)}</span>.
           </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] text-center">Posição</TableHead>
                      <TableHead>Vendedor</TableHead>
                      <TableHead className="text-center">Nível da Meta</TableHead>
                      <TableHead className="text-right">{getCriterionLabel(criterion)}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedSellers.map((seller, index) => {
                      const goalLevel = getGoalLevel(seller[criterion], criterion);
                      const config = goalLevelConfig[goalLevel];
                      return (
                        <TableRow key={seller.id} className={index < 3 ? 'bg-card-foreground/5' : ''}>
                          <TableCell className="font-bold text-lg flex justify-center items-center h-full py-4">
                            {getRankIndicator(index)}
                          </TableCell>
                          <TableCell className="font-medium">{seller.name}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={config.className}>{config.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-lg">{formatValue(seller[criterion], criterion)}</TableCell>
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

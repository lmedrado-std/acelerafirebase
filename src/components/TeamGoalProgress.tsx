'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Users } from "lucide-react";
import type { Seller, Goals } from "@/lib/types";

interface TeamGoalProgressProps {
    sellers: Seller[];
    goals: Goals;
}

export default function TeamGoalProgress({ sellers, goals }: TeamGoalProgressProps) {
    if (!sellers || sellers.length === 0 || !goals?.salesValue?.metinha) {
        return null;
    }
    
    const metinhaThreshold = goals.salesValue.metinha.threshold;
    const teamBonus = 100; // Hardcoded bonus as per request

    const sellersWhoReachedGoal = sellers.filter(s => s.salesValue >= metinhaThreshold);
    const isGoalAchieved = sellers.length > 0 && sellersWhoReachedGoal.length === sellers.length;
    const progress = (sellersWhoReachedGoal.length / sellers.length) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="size-6 text-primary" />
                    <span>Meta de Equipe: Metinha para Todos!</span>
                </CardTitle>
                <CardDescription>
                    Se todos os vendedores atingirem a "Metinha" de vendas (R$ {metinhaThreshold.toLocaleString('pt-BR')}), 
                    cada um ganha um bônus de <span className="font-bold text-green-400">R$ {teamBonus.toLocaleString('pt-BR')}</span> no prêmio total.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isGoalAchieved ? (
                    <div className="flex items-center gap-3 rounded-lg bg-green-500/10 p-4 text-green-400">
                        <CheckCircle className="size-8" />
                        <div>
                            <h4 className="font-bold">Parabéns, Equipe!</h4>
                            <p className="text-sm">Meta de equipe atingida! O bônus de R$ {teamBonus.toLocaleString('pt-BR')} foi adicionado ao prêmio de todos.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-muted-foreground">Progresso</span>
                            <span className="font-bold">{sellersWhoReachedGoal.length} de {sellers.length} vendedores</span>
                        </div>
                        <Progress value={progress} className="h-3" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

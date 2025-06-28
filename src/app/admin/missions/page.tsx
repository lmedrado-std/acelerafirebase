'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Target, Star, Calendar } from 'lucide-react';
import { useAdminContext } from '@/app/admin/layout';
import { format } from 'date-fns';

export default function MissionsPage() {
  const { missions } = useAdminContext();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Target className="size-8 text-primary" />
        <h1 className="text-3xl font-bold">Missões Ativas</h1>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Acompanhe as Missões</CardTitle>
          <CardDescription>
            Visualize todas as missões disponíveis para os vendedores.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {missions.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {missions.map((mission) => (
                <Card key={mission.id} className="bg-background/50 flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Target className="size-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{mission.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm">
                      {mission.description || 'Nenhuma descrição fornecida.'}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center text-sm font-medium text-muted-foreground bg-input/50 p-4 mt-4 rounded-b-lg">
                    <div className="flex items-center gap-2">
                       <Star className="size-4 text-yellow-400" />
                       <span>{mission.points} Pontos</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Calendar className="size-4" />
                       <span>
                          {format(mission.startDate, 'dd/MM')} - {format(mission.endDate, 'dd/MM')}
                       </span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground border-2 border-dashed border-border rounded-lg p-12">
              <Target className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 font-semibold">Nenhuma missão encontrada</p>
              <p className="text-sm">
                Vá para as <a href="/admin/settings" className="underline text-primary">Configurações</a> para criar novas missões.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

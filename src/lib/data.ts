import type { Seller, Goals, Mission } from './types';

export const sellersData: Seller[] = [
  { id: '1', name: 'Rian Breston', nickname: 'rianb', email: 'rian.breston@example.com', salesValue: 5240.75, ticketAverage: 150.25, pa: 2.1, points: 1200, extraPoints: 100, hasCompletedQuiz: false },
  { id: '2', name: 'Carla Dias', nickname: 'carlad', email: 'carla.dias@example.com', salesValue: 4890.50, ticketAverage: 142.80, pa: 2.5, points: 950, extraPoints: 50, hasCompletedQuiz: false },
  { id: '3', name: 'Marcos Andrade', nickname: 'marcosa', email: 'marcos.andrade@example.com', salesValue: 6100.00, ticketAverage: 185.00, pa: 1.9, points: 1500, extraPoints: 0, hasCompletedQuiz: false },
  { id: '4', name: 'Ana Pereira', nickname: 'anap', email: 'ana.pereira@example.com', salesValue: 5800.00, ticketAverage: 190.50, pa: 2.0, points: 1350, extraPoints: 200, hasCompletedQuiz: false },
  { id: '5', name: 'Lucas Martins', nickname: 'lucasm', email: 'lucas.martins@example.com', salesValue: 4200.20, ticketAverage: 120.70, pa: 2.9, points: 1800, extraPoints: 0, hasCompletedQuiz: false },
];

export const goalsData: Goals = {
  salesValue: { metinha: 4000, meta: 5000, metona: 6000, lendaria: 7000 },
  ticketAverage: { metinha: 130, meta: 150, metona: 180, lendaria: 200 },
  pa: { metinha: 2.0, meta: 2.5, metona: 2.8, lendaria: 3.0 },
  points: { metinha: 800, meta: 1000, metona: 1500, lendaria: 2000 },
};

export const missionsData: Mission[] = [
  {
    id: '1',
    name: 'Vendedor do Mês',
    description: 'Atingir o topo do ranking de vendas no final do mês.',
    points: 500,
    startDate: new Date(2024, 6, 1),
    endDate: new Date(2024, 6, 31),
  },
  {
    id: '2',
    name: 'Especialista em PA',
    description: 'Manter um PA (Produtos por Atendimento) acima de 2.8 por uma semana.',
    points: 250,
    startDate: new Date(2024, 6, 15),
    endDate: new Date(2024, 6, 22),
  },
   {
    id: '3',
    name: 'Mestre dos Quizzes',
    description: 'Completar 3 quizzes com uma pontuação perfeita.',
    points: 150,
    startDate: new Date(2024, 6, 1),
    endDate: new Date(2024, 7, 31),
  },
];

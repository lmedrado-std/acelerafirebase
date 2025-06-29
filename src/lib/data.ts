import type { Seller, Goals, Mission } from './types';

export const sellersData: Seller[] = [
  { id: '1', name: 'Rian Breston', nickname: 'rianb', email: 'rian.breston@example.com', password: '123', salesValue: 7540.75, ticketAverage: 150.25, pa: 2.1, points: 1200, extraPoints: 100, hasCompletedQuiz: false },
  { id: '2', name: 'Carla Dias', nickname: 'carlad', email: 'carla.dias@example.com', password: '123', salesValue: 4890.50, ticketAverage: 142.80, pa: 2.5, points: 950, extraPoints: 50, hasCompletedQuiz: false },
  { id: '3', name: 'Marcos Andrade', nickname: 'marcosa', email: 'marcos.andrade@example.com', password: '123', salesValue: 6100.00, ticketAverage: 185.00, pa: 1.9, points: 1500, extraPoints: 0, hasCompletedQuiz: false },
  { id: '4', name: 'Ana Pereira', nickname: 'anap', email: 'ana.pereira@example.com', password: '123', salesValue: 5800.00, ticketAverage: 190.50, pa: 2.0, points: 1350, extraPoints: 200, hasCompletedQuiz: false },
  { id: '5', name: 'Lucas Martins', nickname: 'lucasm', email: 'lucas.martins@example.com', password: '123', salesValue: 4200.20, ticketAverage: 120.70, pa: 2.9, points: 1800, extraPoints: 0, hasCompletedQuiz: false },
];

export const goalsData: Goals = {
  salesValue: {
    metinha: { threshold: 4000, prize: 50 },
    meta: { threshold: 5000, prize: 100 },
    metona: { threshold: 6000, prize: 150 },
    lendaria: { threshold: 7000, prize: 250 },
    performanceBonus: { per: 1000, prize: 50 },
  },
  ticketAverage: {
    metinha: { threshold: 130, prize: 20 },
    meta: { threshold: 150, prize: 40 },
    metona: { threshold: 180, prize: 60 },
    lendaria: { threshold: 200, prize: 100 },
  },
  pa: {
    metinha: { threshold: 2.0, prize: 20 },
    meta: { threshold: 2.5, prize: 40 },
    metona: { threshold: 2.8, prize: 60 },
    lendaria: { threshold: 3.0, prize: 100 },
  },
  points: {
    metinha: { threshold: 800, prize: 20 },
    meta: { threshold: 1000, prize: 40 },
    metona: { threshold: 1500, prize: 60 },
    lendaria: { threshold: 2000, prize: 100 },
  },
  gamification: {
    course: { 'Fácil': 100, 'Médio': 150, 'Difícil': 200 },
    quiz: { 'Fácil': 10, 'Médio': 20, 'Difícil': 30 },
  }
};

export const missionsData: Mission[] = [
  {
    id: '1',
    name: 'Vendedor do Mês',
    description: 'Atingir o topo do ranking de vendas no final do mês.',
    rewardValue: 500,
    rewardType: 'points',
    startDate: new Date(2024, 6, 1),
    endDate: new Date(2024, 6, 31),
  },
  {
    id: '2',
    name: 'Especialista em PA',
    description: 'Manter um PA (Produtos por Atendimento) acima de 2.8 por uma semana.',
    rewardValue: 250,
    rewardType: 'points',
    startDate: new Date(2024, 6, 15),
    endDate: new Date(2024, 6, 22),
  },
   {
    id: '3',
    name: 'Mestre dos Quizzes',
    description: 'Completar 3 quizzes com uma pontuação perfeita.',
    rewardValue: 150,
    rewardType: 'points',
    startDate: new Date(2024, 6, 1),
    endDate: new Date(2024, 7, 31),
  },
  {
    id: '4',
    name: 'Bônus de Equipe: Metinha Batida',
    description: 'Se todos os vendedores atingirem a Metinha em Vendas, todos ganham um bônus extra.',
    rewardValue: 100,
    rewardType: 'cash',
    startDate: new Date(2024, 6, 1),
    endDate: new Date(2024, 6, 31),
  },
];

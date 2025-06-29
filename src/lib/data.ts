import type { Seller, Goals, Mission } from './types';

// Production-ready data: All test/demo data has been cleared.
// The application starts with a clean slate.

export const sellersData: Seller[] = [];

export const goalsData: Goals = {
  salesValue: {
    metinha: { threshold: 0, prize: 0 },
    meta: { threshold: 0, prize: 0 },
    metona: { threshold: 0, prize: 0 },
    lendaria: { threshold: 0, prize: 0 },
    performanceBonus: { per: 0, prize: 0 },
  },
  ticketAverage: {
    metinha: { threshold: 0, prize: 0 },
    meta: { threshold: 0, prize: 0 },
    metona: { threshold: 0, prize: 0 },
    lendaria: { threshold: 0, prize: 0 },
  },
  pa: {
    metinha: { threshold: 0, prize: 0 },
    meta: { threshold: 0, prize: 0 },
    metona: { threshold: 0, prize: 0 },
    lendaria: { threshold: 0, prize: 0 },
  },
  points: {
    metinha: { threshold: 0, prize: 0 },
    meta: { threshold: 0, prize: 0 },
    metona: { threshold: 0, prize: 0 },
    lendaria: { threshold: 0, prize: 0 },
  },
  gamification: {
    course: { 'Fácil': 0, 'Médio': 0, 'Difícil': 0 },
    quiz: { 'Fácil': 0, 'Médio': 0, 'Difícil': 0 },
  }
};

export const missionsData: Mission[] = [];

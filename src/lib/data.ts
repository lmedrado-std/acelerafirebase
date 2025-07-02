import type { Seller, Goals, Mission } from './types';

// Production-ready data: All test/demo data has been cleared.
// The application starts with a clean slate.

export const sellersData: Seller[] = [
  { id: '1', name: 'Rose', nickname: 'rose', email: 'rose@example.com', password: '123', salesValue: 0, ticketAverage: 0, pa: 0, points: 0, extraPoints: 0, hasCompletedQuiz: false },
  { id: '2', name: 'Joisse', nickname: 'joisse', email: 'joisse@example.com', password: '123', salesValue: 0, ticketAverage: 0, pa: 0, points: 0, extraPoints: 0, hasCompletedQuiz: false },
  { id: '3', name: 'Mercia', nickname: 'mercia', email: 'mercia@example.com', password: '123', salesValue: 0, ticketAverage: 0, pa: 0, points: 0, extraPoints: 0, hasCompletedQuiz: false },
  { id: '4', name: 'Thays', nickname: 'thays', email: 'thays@example.com', password: '123', salesValue: 0, ticketAverage: 0, pa: 0, points: 0, extraPoints: 0, hasCompletedQuiz: false },
  { id: '5', name: 'Val', nickname: 'val', email: 'val@example.com', password: '123', salesValue: 0, ticketAverage: 0, pa: 0, points: 0, extraPoints: 0, hasCompletedQuiz: false },
  { id: '6', name: 'Dajila', nickname: 'dajila', email: 'dajila@example.com', password: '123', salesValue: 0, ticketAverage: 0, pa: 0, points: 0, extraPoints: 0, hasCompletedQuiz: false },
];

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

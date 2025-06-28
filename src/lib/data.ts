import type { Seller, Goals } from './types';

export const sellersData: Seller[] = [
  { id: '1', name: 'Rian Breston', salesValue: 5240.75, ticketAverage: 150.25, pa: 2.1, points: 1200 },
  { id: '2', name: 'Carla Dias', salesValue: 4890.50, ticketAverage: 142.80, pa: 2.5, points: 950 },
  { id: '3', name: 'Marcos Andrade', salesValue: 6100.00, ticketAverage: 185.00, pa: 1.9, points: 1500 },
  { id: '4', name: 'Ana Pereira', salesValue: 5800.00, ticketAverage: 190.50, pa: 2.0, points: 1350 },
  { id: '5', name: 'Lucas Martins', salesValue: 4200.20, ticketAverage: 120.70, pa: 2.9, points: 1800 },
];

export const goalsData: Goals = {
  salesValue: { metinha: 4000, meta: 5000, metona: 6000, lendaria: 7000 },
  ticketAverage: { metinha: 130, meta: 150, metona: 180, lendaria: 200 },
  pa: { metinha: 2.0, meta: 2.5, metona: 2.8, lendaria: 3.0 },
  points: { metinha: 800, meta: 1000, metona: 1500, lendaria: 2000 },
};

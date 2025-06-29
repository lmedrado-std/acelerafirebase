'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Seller, Goals, Mission, Admin } from './types';
import { sellersData as initialSellers, goalsData as initialGoals, missionsData as initialMissions } from './data';

// This is a simple in-memory store to simulate a database for the prototype.
// It allows state to be shared between the Admin and Seller layouts,
// ensuring data consistency across the application.

type AppState = {
  sellers: Seller[];
  goals: Goals;
  missions: Mission[];
  adminUser: Admin;
};

// The single source of truth for our application's state.
const state: AppState = {
  sellers: initialSellers,
  goals: initialGoals,
  missions: initialMissions,
  adminUser: {
    nickname: 'admin',
    email: 'admin@aceleragt.com',
    password: 'admin',
  },
};

const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const dataStore = {
  getState: () => state,
  
  // Each setter takes an updater function, similar to React's useState,
  // to prevent race conditions and ensure state updates are atomic.
  setSellers: (updater: (prev: Seller[]) => Seller[]) => {
    state.sellers = updater(state.sellers);
    notifyListeners();
  },
  
  setGoals: (updater: (prev: Goals) => Goals) => {
    state.goals = updater(state.goals);
    notifyListeners();
  },

  setMissions: (updater: (prev: Mission[]) => Mission[]) => {
    state.missions = updater(state.missions);
    notifyListeners();
  },

  setAdminUser: (updater: (prev: Admin) => Admin) => {
    state.adminUser = updater(state.adminUser);
    notifyListeners();
  },

  // Subscribes a component to store changes.
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    // Returns an unsubscribe function to be called on component unmount.
    return () => {
      listeners.delete(listener);
    };
  },
};

// Custom hook to use the store in React components.
// It subscribes to the store and re-renders the component when the selected state changes.
export function useStore<T>(selector: (state: AppState) => T): T {
  const [data, setData] = useState(() => selector(dataStore.getState()));

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      const newState = selector(dataStore.getState());
      // A simple shallow comparison to avoid unnecessary re-renders.
      if (newState !== data) {
        setData(newState);
      }
    });
    return unsubscribe;
  }, [selector, data]);

  return data;
}

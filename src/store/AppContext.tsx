import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Role, Language, Booking, Worker, Notification } from '../types';
import { WORKERS, INITIAL_BOOKINGS, NOTIFICATIONS } from '../data/mockData';

interface AppState {
  role: Role;
  language: Language;
  workers: Worker[];
  bookings: Booking[];
  notifications: Notification[];
  sidebarOpen: boolean;
}

type Action =
  | { type: 'SET_ROLE'; payload: Role }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'ADD_BOOKING'; payload: Booking }
  | { type: 'UPDATE_BOOKING'; payload: { id: string; updates: Partial<Booking> } }
  | { type: 'UPDATE_WORKER'; payload: { id: string; updates: Partial<Worker> } }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' };

function loadState(): Partial<AppState> {
  try {
    const saved = localStorage.getItem('skillsetu_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        bookings: parsed.bookings || INITIAL_BOOKINGS,
        workers: parsed.workers || WORKERS,
        role: parsed.role || 'customer',
        language: parsed.language || 'en',
      };
    }
  } catch {
    // ignore
  }
  return {};
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(
      'skillsetu_state',
      JSON.stringify({
        bookings: state.bookings,
        workers: state.workers,
        role: state.role,
        language: state.language,
      })
    );
  } catch {
    // ignore
  }
}

const initialState: AppState = {
  role: 'customer',
  language: 'en',
  workers: WORKERS,
  bookings: INITIAL_BOOKINGS,
  notifications: NOTIFICATIONS,
  sidebarOpen: true,
  ...loadState(),
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'ADD_BOOKING':
      return { ...state, bookings: [action.payload, ...state.bookings] };
    case 'UPDATE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.payload.id ? { ...b, ...action.payload.updates } : b
        ),
      };
    case 'UPDATE_WORKER':
      return {
        ...state,
        workers: state.workers.map((w) =>
          w.id === action.payload.id ? { ...w, ...action.payload.updates } : w
        ),
      };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}

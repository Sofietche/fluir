import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

import { getTopicCards, TopicCard } from '../services/topics';

type TopicStatus = 'idle' | 'loading' | 'loaded' | 'error';

type TopicEntry = {
  cards: TopicCard[];
  status: TopicStatus;
  error: string | null;
};

type TopicsState = Record<string, TopicEntry>;

type Action =
  | { type: 'REQUEST'; topicId: string }
  | { type: 'SUCCESS'; topicId: string; cards: TopicCard[] }
  | { type: 'FAILURE'; topicId: string; error: string };

type TopicsContextValue = {
  state: TopicsState;
  requestCards: (topicId: string) => Promise<TopicCard[]>;
};

const initialEntry: TopicEntry = {
  cards: [],
  status: 'idle',
  error: null
};

const TopicsContext = createContext<TopicsContextValue | undefined>(undefined);

const reducer = (state: TopicsState, action: Action): TopicsState => {
  switch (action.type) {
    case 'REQUEST':
      return {
        ...state,
        [action.topicId]: {
          ...(state[action.topicId] ?? initialEntry),
          status: 'loading',
          error: null
        }
      };
    case 'SUCCESS':
      return {
        ...state,
        [action.topicId]: {
          cards: action.cards,
          status: 'loaded',
          error: null
        }
      };
    case 'FAILURE':
      return {
        ...state,
        [action.topicId]: {
          ...(state[action.topicId] ?? initialEntry),
          status: 'error',
          error: action.error
        }
      };
    default:
      return state;
  }
};

export const TopicsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {});

  const requestCards = useCallback(async (topicId: string) => {
    dispatch({ type: 'REQUEST', topicId });
    try {
      const cards = await getTopicCards(topicId);
      dispatch({ type: 'SUCCESS', topicId, cards });
      return cards;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudieron cargar las cartas.';
      dispatch({ type: 'FAILURE', topicId, error: message });
      throw error;
    }
  }, []);

  const value = useMemo<TopicsContextValue>(
    () => ({
      state,
      requestCards
    }),
    [requestCards, state]
  );

  return <TopicsContext.Provider value={value}>{children}</TopicsContext.Provider>;
};

export const useTopicsContext = (): TopicsContextValue => {
  const context = useContext(TopicsContext);

  if (!context) {
    throw new Error('useTopicsContext must be used within a TopicsProvider');
  }

  return context;
};

export const selectTopicEntry = (state: TopicsState, topicId: string): TopicEntry => {
  return state[topicId] ?? initialEntry;
};

export type { TopicEntry };

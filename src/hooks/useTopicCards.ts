import { useCallback, useEffect, useMemo } from 'react';

import { selectTopicEntry, useTopicsContext } from '../context/TopicsContext';

export const useTopicCards = (topicId: string) => {
  const { state, requestCards } = useTopicsContext();
  const entry = useMemo(() => selectTopicEntry(state, topicId), [state, topicId]);

  const load = useCallback(() => requestCards(topicId), [requestCards, topicId]);

  useEffect(() => {
    if (entry.status === 'idle') {
      load().catch(() => {
        // Los errores se controlan desde el contexto; evitar una promesa rechazada no manejada.
      });
    }
  }, [entry.status, load]);

  return {
    cards: entry.cards,
    status: entry.status,
    error: entry.error,
    refetch: load
  };
};

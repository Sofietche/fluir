import { collection, getDocs } from 'firebase/firestore';

import { db } from '../firebase/firebaseConfig';

export type TopicCard = {
  id: string;
  prompt: string;
  tone?: string;
  tags?: string[];
  requiresParticipant?: boolean;
  order?: number;
};

export const getTopicCards = async (topicId: string): Promise<TopicCard[]> => {
  const cardsCollection = collection(db, 'topics', topicId, 'cards');
  const snapshot = await getDocs(cardsCollection);

  const cards: TopicCard[] = snapshot.docs.map((docSnapshot) => {
    const data = docSnapshot.data() as Partial<TopicCard> & { prompt?: string };

    return {
      id: docSnapshot.id,
      prompt: data.prompt ?? 'Carta sin descripción',
      tone: data.tone,
      tags: Array.isArray(data.tags) ? data.tags.filter((tag): tag is string => typeof tag === 'string') : undefined,
      requiresParticipant: typeof data.requiresParticipant === 'boolean' ? data.requiresParticipant : undefined,
      order: typeof data.order === 'number' ? data.order : undefined
    };
  });

  return cards.sort((a, b) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });
};

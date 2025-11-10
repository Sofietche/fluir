const topics = [
  {
    id: 'familia',
    title: 'Familia',
    color: '#F3B340',
    description: 'Preguntas para conectar con tus seres queridos y fortalecer lazos familiares.',
    emoji: '👪',
    cards: []
  },
  {
    id: 'amigos',
    title: 'Amigos',
    color: '#5AC8FA',
    description: 'Ideas para conversaciones ligeras, divertidas y memorables con amistades.',
    emoji: '🧑‍🤝‍🧑',
    cards: []
  },
  {
    id: 'amor',
    title: 'Amor',
    color: '#FF8FAB',
    description: 'Cartas diseñadas para profundizar en la intimidad y comprensión de la pareja.',
    emoji: '❤️',
    cards: [
      {
        id: 'amor-001',
        prompt: '¿Qué pequeño detalle cotidiano te hace sentir más conectado conmigo?',
        tone: 'relajada',
        tags: ['cotidiano', 'cariño'],
        requiresParticipant: false,
        order: 0
      },
      {
        id: 'amor-002',
        prompt: 'Comparte un recuerdo en el que supiste que nuestra relación iba en serio.',
        tone: 'profunda',
        tags: ['recuerdos', 'compromiso'],
        requiresParticipant: false,
        order: 1
      },
      {
        id: 'amor-003',
        prompt: '¿Qué fantasía o plan picante te gustaría explorar juntos pronto?',
        tone: 'picante',
        tags: ['intimidad', 'novedad'],
        requiresParticipant: false,
        order: 2
      },
      {
        id: 'amor-004',
        prompt: 'Imagina que planeamos una cita sorpresa perfecta. ¿Qué no puede faltar?',
        tone: 'creativa',
        tags: ['planes', 'diversión'],
        requiresParticipant: false,
        order: 3
      },
      {
        id: 'amor-005',
        prompt: '¿Qué hábito personal te gustaría que celebrara más seguido?',
        tone: 'aprecio',
        tags: ['apoyo', 'crecimiento'],
        requiresParticipant: false,
        order: 4
      }
    ]
  },
  {
    id: 'fiesta',
    title: 'Fiesta',
    color: '#9B5DE5',
    description: 'Retos y conversaciones divertidas para animar cualquier celebración.',
    emoji: '🎉',
    cards: []
  }
];

module.exports = { topics };

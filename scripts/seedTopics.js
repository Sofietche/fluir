const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { initializeApp, getApps } = require('firebase/app');
const {
  getFirestore,
  doc,
  writeBatch,
  serverTimestamp
} = require('firebase/firestore');

const { topics } = require('./data/topics');

const ENV_FILES = ['.env.local', '.env'];

function loadEnvFiles() {
  ENV_FILES.forEach((file) => {
    const absolutePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(absolutePath)) {
      dotenv.config({ path: absolutePath });
    }
  });
}

function getFirebaseConfig() {
  const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  };

  const missingKeys = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length) {
    throw new Error(
      `Faltan las variables de entorno requeridas para Firebase: ${missingKeys.join(', ')}`
    );
  }

  return config;
}

async function seed() {
  loadEnvFiles();
  const firebaseConfig = getFirebaseConfig();

  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }

  const db = getFirestore();
  const batch = writeBatch(db);

  let totalCards = 0;

  topics.forEach(({ id, cards = [], ...topicData }) => {
    const topicRef = doc(db, 'topics', id);
    const cardCount = cards.length;

    batch.set(topicRef, {
      ...topicData,
      cardsCount: cardCount,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    cards.forEach((card, index) => {
      const cardRef = doc(db, 'topics', id, 'cards', card.id);
      batch.set(cardRef, {
        prompt: card.prompt,
        tone: card.tone,
        requiresParticipant: Boolean(card.requiresParticipant),
        tags: card.tags || [],
        order: card.order ?? index,
        topicId: id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });

    totalCards += cardCount;
  });

  await batch.commit();

  console.log(`Colección 'topics' creada/actualizada (${topics.length} tópicos, ${totalCards} cartas).`);
  console.log('Estructura lista para agregar nuevos tópicos editando scripts/data/topics.js.');
}

seed().catch((error) => {
  console.error('Error al ejecutar el seed de tópicos:', error);
  process.exit(1);
});

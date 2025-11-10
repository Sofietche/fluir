# Fluir

Proyecto Expo configurado con navegación básica, soporte para Firebase y un mazo de cartas con `react-native-deck-swiper`.

## Scripts

- `npm start` – Inicia Metro Bundler.
- `npm run android` – Inicia la app en un emulador/dispositivo Android.
- `npm run ios` – Inicia la app en un simulador iOS.
- `npm run web` – Inicia la app en la web.
- `npm run prebuild` – Ejecuta `expo prebuild` para generar los proyectos nativos cuando se necesite.

## Instalación

1. Instala las dependencias con `npm install`.
2. Ejecuta `npx expo prebuild` cuando necesites generar los proyectos nativos para configurar librerías como Reanimated.
3. Inicia la app con `npm start` y sigue las instrucciones de Expo CLI para abrirla en Expo Go, iOS o Android.

## Datos iniciales en Firebase

El proyecto incluye un script de _seed_ para preparar la colección `topics` y sus subcolecciones `cards` en Cloud Firestore.

1. Copia el archivo `.env.example` a `.env` (o `.env.local`) y completa los valores de tu proyecto de Firebase.
2. Ejecuta `npm run seed:topics` para crear/actualizar los tópicos y las cartas iniciales del tema **amor**.
3. Para añadir nuevos tópicos o cartas, edita `scripts/data/topics.js` y vuelve a ejecutar el comando anterior.

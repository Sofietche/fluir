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

## Configuración de entorno

1. Copia el archivo `.env.example` y renómbralo a `.env`.
2. Completa las credenciales del proyecto de Firebase (configuración web) y los identificadores de cliente de Google necesarios para Expo, Android, iOS y Web.
3. Asegúrate de reiniciar Metro Bundler después de modificar el archivo `.env` para que Expo recargue la configuración.

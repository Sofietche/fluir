# Fluir

Proyecto Expo configurado con navegación básica, soporte para Firebase y un mazo de cartas con `react-native-deck-swiper`.

## Scripts

- `npm start` – Inicia Metro Bundler.
- `npm run android` – Inicia la app en un emulador/dispositivo Android.
- `npm run ios` – Inicia la app en un simulador iOS.
- `npm run web` – Inicia la app en la web.
- `npm run prebuild` – Ejecuta `expo prebuild` para generar los proyectos nativos cuando se necesite.
- `npm run seed:topics` – Pobla Firestore con datos de ejemplo para los tópicos y cartas.
- `npm run generate:assets` – Regenera los _placeholders_ del icono y la pantalla de carga cuando quieras personalizarlos.

## Ejecución y builds

1. Instala las dependencias con `npm install` (esto creará automáticamente los iconos y splash de ejemplo).
2. Copia `.env.example` a `.env` (o `.env.local`) y completa las claves de Firebase y Google OAuth.
3. Si necesitas regenerar los recursos predeterminados, ejecuta `npm run generate:assets`.
4. Inicia la app con `npm start` y abre el proyecto en Expo Go, iOS o Android según prefieras.
5. Cuando necesites configurar librerías nativas, ejecuta `npm run prebuild` para generar los proyectos Xcode/Android Studio.
6. Para generar binarios desde EAS, instala la CLI (`npm install -g eas-cli`) y utiliza los perfiles definidos en `eas.json`, por ejemplo:
   - `eas build --profile development --platform ios`
   - `eas build --profile preview --platform android`
   - `eas build --profile production --platform ios`

## Datos iniciales en Firebase

El proyecto incluye un script de _seed_ para preparar la colección `topics` y sus subcolecciones `cards` en Cloud Firestore.

1. Copia el archivo `.env.example` a `.env` (o `.env.local`) y completa los valores de tu proyecto de Firebase.
2. Ejecuta `npm run seed:topics` para crear/actualizar los tópicos y las cartas iniciales del tema **amor**.
3. Para añadir nuevos tópicos o cartas, edita `scripts/data/topics.js` y vuelve a ejecutar el comando anterior. Las cartas quedarán disponibles automáticamente en la vista de tópicos gracias al `TopicsProvider` que cachea los resultados de Firestore.
4. Si gestionas las cartas directamente desde la consola de Firebase, asegúrate de incluir los campos `prompt`, `tone`, `tags` y `order` para aprovechar el listado enriquecido de la pantalla.

## Ajustar estilos y componentes

- Los componentes reutilizables (`PrimaryButton`, `TopicPreviewCard`, `PromptCard` y `TexturedBackground`) viven en `src/components` y concentran la identidad visual de la app. Modifica allí los estilos para aplicar cambios globales.
- Los estados de usuario y cartas están centralizados en `src/context`. Desde `AuthProvider` puedes extender la información del usuario (por ejemplo, guardando preferencias) y `TopicsProvider` evita duplicar peticiones a Firestore.
- El fondo y la carga de pantallas usan texturas suaves; si necesitas variantes crea nuevos _presets_ de `TextureShape` y compártelos entre vistas.

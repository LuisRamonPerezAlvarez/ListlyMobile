# Listly Mobile

Frontend móvil de Listly desarrollado con Expo, React Native, TypeScript y Expo Router.

## Funciones incluidas
- Inicio con resumen y listas recientes.
- Crear listas y elegir categoría.
- Abrir listas, agregar, completar, editar y eliminar artículos.
- Eliminar listas.
- Historial de listas terminadas.
- Tema claro, oscuro y automático.
- Datos de demostración en memoria (se reinician al recargar la app).

## Instalación

Requisitos: Node.js LTS y Android Studio si quieres usar un emulador Android.

```bash
npm install
npx expo install --fix
npx expo start
```

Para Android, pulsa `a` en la terminal de Expo o ejecuta `npm run android`.

## Nota sobre la plantilla
Si creaste el proyecto con `npx create-expo-app`, conserva el `package-lock.json` que generó npm. Copia la carpeta `app` y `src` de este proyecto sobre la plantilla existente, y adapta `package.json` si tu versión de Expo es distinta. Es preferible respetar las versiones de Expo ya instaladas en tu entorno en vez de forzar una actualización.

## Todavía no conectado
Esta versión usa estado local en memoria. Supabase, autenticación, persistencia y sincronización con Wear OS se implementarán en fases posteriores.

# Expo SDK 54

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

## NativeWind v4 (Tailwind CSS)

Setup documentado en `docs/setup/NATIVEWIND.md`.

### Reglas críticas

1. `babel-preset-expo` debe coincidir con la SDK — usar `~54.0.0`, NO `^57.0.0`
2. `experiments.reactCompiler` en `app.json` es INCOMPATIBLE con NativeWind — mantenerlo desactivado
3. Siempre correr `npx expo start --clear` tras cambios en config
4. `nativewind/babel` va en `babel.config.js`, NUNCA en `tailwind.config.js`
5. `tailwind.config.js` requiere `presets: [require("nativewind/preset")]`

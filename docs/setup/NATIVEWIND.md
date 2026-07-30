# NativeWind Setup — Expo SDK 54

## Versiones probadas

```json
"expo": "~54.0.34"
"babel-preset-expo": "~54.0.0"
"nativewind": "^4.2.6"
"tailwindcss": "^3.4.19"
"react-native-reanimated": "~4.1.1"
```

## Archivos de configuración

### `babel.config.js`
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: ["react-native-reanimated/plugin"],
  };
};
```

### `tailwind.config.js`
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
};
```

### `metro.config.js`
```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
```

### `global.css` (raíz del proyecto)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Importar en `app/_layout.tsx`:
```ts
import '../global.css';
```

### `nativewind-env.d.ts` (raíz)
```ts
/// <reference types="nativewind/types" />
```

## Errores conocidos y soluciones

### `SyntaxError: private properties are not supported`

**Causa:** `babel-preset-expo` en versión 57+ con Expo SDK 54. La v57 no transforma propiedades privadas porque asume Hermes más reciente que sí las soporta nativamente.

**Solución:** Fijar `babel-preset-expo` a `~54.0.0`:
```bash
npx expo install babel-preset-expo@~54.0.0
```

### React Compiler inactivo

`experiments.reactCompiler` en `app.json` es **incompatible** con NativeWind v4. Si se habilita, los `className` no se aplican. Dejarlo desactivado:
```json
"experiments": {
  "typedRoutes": true
}
```

### Cache de Metro

Después de cualquier cambio en `babel.config.js`, `metro.config.js` o `tailwind.config.js`, limpiar el caché:
```bash
npx expo start --clear
```

# Setup y ejecución

## Entorno

El proyecto usa variables de entorno con prefijo `EXPO_PUBLIC_` (exponibles al cliente).

### Archivo `.env`

```env
EXPO_PUBLIC_API_BASE_URL=https://smart-bugdet-server.onrender.com
```

Si se necesita apuntar a un servidor local:
```env
EXPO_PUBLIC_API_BASE_URL=http://<IP-local>:5172
```

> ⚠️ Los cambios en `.env` requieren reiniciar Metro (`npx expo start --clear`).

## Inicializar proyecto

```bash
npm install
npx expo start --clear
```

## Cambiar entre Expo Go y Development Build

### Expo Go (rápido, sin native modules extra)
```bash
npx expo start --clear
# Escanear QR con Expo Go (iOS/Android)
```

### Development Build (para native modules como ads)
```bash
npx expo run:ios           # iOS
npx expo run:android       # Android
```

> Development build necesita Xcode o Android Studio instalado. El primer build tarda.

## Ambientes

| Ambiente | Comando | URL backend |
|---|---|---|
| Producción | `npx expo start` | `https://smart-bugdet-server.onrender.com` |
| Local | editar `.env` | `http://<IP>:5172` |
| Development Build | `npx expo run:ios/android` | depende de `.env` |

## Comandos útiles

```bash
npx expo start --clear    # Limpiar caché y arrancar
npx expo start --tunnel   # Exponer con tunnel (útil para Expo Go en otra red)
npx expo run:ios          # Build de desarrollo iOS
npx expo run:android      # Build de desarrollo Android
npx expo export           # Build de producción (web/native)
```

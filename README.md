# CareerPilot AI

Application mobile de coaching carrière propulsée par l'IA, construite avec **Expo SDK 53**, **React Native**, **Expo Router** et **TypeScript**.

Compatible **Expo Go** — aucun Development Build requis.

## Démarrage rapide

```bash
npm install
npx expo start
```

Scannez le QR code avec **Expo Go** sur votre appareil.

## Structure du projet

```
app/           # Écrans et navigation (Expo Router)
components/    # Composants UI et layout
constants/     # Design system, thème, mock data
hooks/         # Hooks React personnalisés
services/      # Services mock (auth, AI, navigation)
types/         # Types TypeScript
utils/         # Utilitaires
assets/        # Images et ressources statiques
```

## Écrans

| Écran | Route |
|-------|-------|
| Splash | `/splash` |
| Onboarding | `/onboarding` |
| Login | `/login` |
| Goal Selection | `/goal-selection` |
| Home | `/(tabs)` |
| Jobs | `/(tabs)/jobs` |
| AI Coach | `/(tabs)/ai-chat` |
| Progress | `/(tabs)/progress` |
| Profile | `/(tabs)/profile` |
| CV Analyzer | `/cv-analyzer` |
| Interview | `/interview` |
| Roadmap | `/roadmap` |
| Premium | `/premium` |
| Settings | `/settings` |

## Design System

- Palette de couleurs sombre par défaut
- Typographie, espacements, border radius, ombres
- Composants : Button, Card, Input, Badge, Loading, Avatar, ProgressRing, ScreenLayout

## Stack technique

- Expo SDK 53
- Expo Router (file-based routing)
- React Native Reanimated
- Expo Linear Gradient, Blur, Image
- Expo Vector Icons
- React Native Safe Area Context
- React Native Gesture Handler
- React Native SVG

## Notes

- Données mock uniquement
- Authentification, backend et IA non implémentés
- Prêt pour extension future

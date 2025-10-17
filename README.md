# Dia do Lixo - Garbage Collection App

A React Native Expo app that helps users stay informed about garbage collection schedules in their area.

## Features

- **Multi-language Support**: Portuguese (PT), English (EN), and Spanish (ES)
- **City & Zone Selection**: Choose your city and specific zone for personalized schedules
- **Weekly Calendar View**: See garbage collection schedule for the current week
- **Push Notifications**: Get notified the day before collection (optional)
- **Local Storage**: Your preferences are saved locally on the device
- **Real-time Data**: Connected to Supabase for up-to-date collection schedules

## Garbage Types

The app supports 4 types of garbage collection:

- **Papel/Cartão** (Paper/Cardboard) - Blue
- **Embalagens** (Packaging) - Yellow  
- **Biorresíduos** (Organic Waste) - Brown
- **Indiferenciados** (Mixed Waste) - Green

## Supported Cities

Currently supports:
- **Seixal** (Portugal) - with multiple zones based on Amarsul collection routes

## Tech Stack

- **Expo 54** - React Native framework
- **Supabase** - Backend database and API
- **NativeWind** - Tailwind CSS for styling
- **Zustand** - State management
- **i18next** - Internationalization
- **Expo Router** - File-based routing with NativeTabs
- **React Hook Form** - Form handling
- **Date-fns** - Date manipulation

## Database Schema

The Supabase database includes:

- `cities` - Available cities with multi-language names
- `zones` - Collection zones within each city
- `garbage_types` - Types of garbage with colors and icons
- `collection_schedules` - Weekly schedules for each zone and garbage type

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on your preferred platform:
   ```bash
   npm run ios     # iOS
   npm run android # Android
   npm run web     # Web
   ```

## Configuration

The app is pre-configured with Supabase credentials in `app.json`. The database is already set up with:

- Seixal city and zones
- Garbage types with proper colors
- Sample collection schedules

## Features Overview

### Calendar Screen
- Weekly view of garbage collection
- Color-coded garbage types
- Today highlighting
- Week navigation

### Settings Screen
- City selection (currently only Seixal)
- Zone selection based on chosen city
- Notification preferences
- Language selection

## Data Sources

Collection schedules are based on:
- **Papel/Cartão & Embalagens**: [Amarsul collection routes](https://www.amarsul.pt/pt/area-de-utilizador/recolha-domestica/)
- **Biorresíduos & Indiferenciados**: [Seixal municipality schedules](https://www.cm-seixal.pt/noticia/novos-horarios-de-recolha-de-residuos-porta-porta-0)

## Future Enhancements

- Add more Portuguese cities
- Real-time schedule updates
- Collection reminders
- Collection history
- Community features

## License

This project is for educational and community purposes.


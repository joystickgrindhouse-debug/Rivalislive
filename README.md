# Rivalis Live

A real-time multiplayer fitness arena application featuring live pose detection and avatar rendering.

## Features

- **Live Lobby System**: Create and join multiplayer rooms
- **Real-time Pose Detection**: Uses MediaPipe for pose tracking
- **Avatar Rendering**: Canvas-based avatar display synchronized with user movements
- **Live Chat**: Real-time messaging within rooms
- **Firebase Integration**: Authentication, Realtime Database, and Firestore

## Project Structure

```
live_mode/
├── index.html          - Lobby page for creating/joining rooms
├── arena.html          - Live arena with pose detection and chat
├── css/
│   └── style.css       - Main stylesheet
├── js/
│   ├── firebase.js     - Firebase configuration
│   ├── live_lobby.js   - Lobby functionality
│   ├── arena_main.js   - Arena main logic
│   ├── poseHandler.js  - MediaPipe pose detection
│   ├── realtimeSync.js - Firebase realtime sync
│   └── avatarRenderer.js - Canvas rendering
└── assets/             - Static assets (background images, etc.)
```

## Setup

This application uses Firebase for backend services. The Firebase configuration is pre-configured in `live_mode/js/firebase.js`.

## Running Locally

The application is served via a simple Node.js HTTP server on port 5000.

## Technologies

- **Frontend**: Vanilla JavaScript with ES6 modules
- **Pose Detection**: MediaPipe Pose via CDN
- **Backend**: Firebase (Auth, Realtime Database, Firestore)
- **Rendering**: HTML5 Canvas API

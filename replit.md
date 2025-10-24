# Rivalis Live - Project Information

## Overview
Rivalis Live is a real-time multiplayer fitness arena application featuring live pose detection using MediaPipe and avatar rendering on HTML5 Canvas. Users can create/join rooms, track their movements, and interact via live chat.

## Project Type
Frontend web application (static files served via Node.js HTTP server)

## Tech Stack
- **Frontend**: Vanilla JavaScript (ES6 modules), HTML5, CSS3
- **Pose Detection**: MediaPipe Pose (CDN)
- **Backend Services**: Firebase (Authentication, Realtime Database, Firestore)
- **Rendering**: HTML5 Canvas API
- **Server**: Node.js HTTP server

## Architecture
- Static file server serving HTML/CSS/JS files
- Client-side JavaScript uses ES6 modules
- Firebase handles all backend operations (auth, database, storage)
- MediaPipe provides pose detection via browser APIs
- Canvas-based rendering for multiplayer avatars

## Key Features
1. Live lobby system for creating/joining rooms
2. Real-time pose detection and tracking
3. Avatar rendering synchronized with user movements
4. Live chat within rooms
5. Firebase-based authentication and data sync

## File Structure
- `server.js` - Simple Node.js HTTP server on port 5000
- `live_mode/` - Main application directory
  - `index.html` - Lobby page
  - `arena.html` - Live arena page
  - `css/style.css` - Main stylesheet
  - `js/` - JavaScript modules
  - `assets/` - Static assets

## Notes
- This is a GitHub import that was extracted from a text file
- The application is entirely client-side with Firebase backend
- No build process required (uses CDN imports for libraries)
- Server only serves static files with proper MIME types

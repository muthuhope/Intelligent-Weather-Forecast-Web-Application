import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Import the PWA service worker registration
import { registerSW } from 'virtual:pwa-register';

// Register the service worker (auto-updates when new version is available)
registerSW();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

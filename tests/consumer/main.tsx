import { hydrateRoot } from 'react-dom/client';
import 'consumer-styles';
import { ConsumerApp } from './app.js';

declare global {
  interface Window {
    hydrationErrors: string[];
  }
}
window.hydrationErrors = [];
hydrateRoot(document.getElementById('root')!, <ConsumerApp />, {
  onRecoverableError: (error) => window.hydrationErrors.push(String(error)),
});

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Enhanced global error hooks to surface real stack traces in dev/preview
window.addEventListener('error', (event) => {
  try {
    // Some cross-origin script errors are opaque; still log what we can
    console.error('[window.error]', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    });

    // Special handling for DOM-related errors
    if (event.message.includes('getBoundingClientRect') || event.message.includes('Cannot read properties of null')) {
      console.error('🎯 DOM Error detected - possible causes:');
      console.error('  1. Font loading issues (Google Fonts/Material Symbols)');
      console.error('  2. External script (Tailwind CDN, browser extensions)');
      console.error('  3. Component lifecycle timing issues');
      
      // Attempt recovery
      if (event.filename && (event.filename.includes('fonts.googleapis.com') || event.filename.includes('tailwindcss.com'))) {
        console.warn('⚡ External resource error detected - retrying...');
        setTimeout(() => {
          console.log('🔄 Retrying page load...');
          window.location.reload();
        }, 2000);
      }
    }
  } catch {
    // ignore
  }
});

window.addEventListener('unhandledrejection', (event) => {
  try {
    console.error('[unhandledrejection]', event.reason);
  } catch {
    // ignore
  }
});

// Additional DOM ready check
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM Content Loaded - checking critical elements...');
  
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('❌ Root element not found!');
  } else {
    console.log('✅ Root element found');
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
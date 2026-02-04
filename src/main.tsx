import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App'; // Remova o .tsx do final, o Vite resolve sozinho

// Use a exclamação no final para dizer ao TS que o elemento existe
const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

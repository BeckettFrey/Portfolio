import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import FourLakes from './components/fourlakes';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FourLakes />
  </StrictMode>
);

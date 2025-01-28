import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

const rootInstance = createRoot(root);
rootInstance.render(
  <StrictMode>
    <App />
  </StrictMode>
);
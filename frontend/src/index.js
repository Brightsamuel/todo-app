import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Note: Create index.css if needed, but we'll use App.css globally
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
    <footer className="flex flex-row justify-between bg-secondary-black font-roboto text-slate-100">
      <a href="https://icons8.com/icon/85968/sms">SMS icon by Icons8</a>
      <a href="https://icons8.com/icon/87292/ringer-volume">Ringer Volume icon by Icons8</a>
    </footer>
  </React.StrictMode>
);

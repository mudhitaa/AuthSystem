import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import RouterConfig from './router/Router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{ duration: 4000, style: { fontSize: '14px' } }}
      />
      <RouterConfig />
    </AuthProvider>
  </React.StrictMode>
);
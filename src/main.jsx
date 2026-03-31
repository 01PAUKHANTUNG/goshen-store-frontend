import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import GoshenShopProvider from './context/GoshenContext.jsx'
import { HelmetProvider } from 'react-helmet-async'


createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <BrowserRouter> 
      <GoshenShopProvider>
        <App />   
      </GoshenShopProvider>       
    </BrowserRouter>
  </HelmetProvider>
    
 
)

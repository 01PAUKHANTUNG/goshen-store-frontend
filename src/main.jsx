import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import GoshenShopProvider from './context/GoshenContext.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter> 
  <GoshenShopProvider>
      <App />   
    </GoshenShopProvider>       
  </BrowserRouter>
    
 
)

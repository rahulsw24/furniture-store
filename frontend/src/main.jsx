import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


// 1. Initialize the client outside the component
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Wrap the entire app with the QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
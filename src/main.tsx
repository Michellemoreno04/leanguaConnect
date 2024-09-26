import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { ContextProvider } from './Componentes-web/videoCall/socket_context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
    <ChakraProvider>
    <ContextProvider>
    <App />
    </ContextProvider>
    </ChakraProvider>
   
  </StrictMode>,
)

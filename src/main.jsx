import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { App } from './App.jsx'
import { Provider } from './Context/Context.jsx'
import { DashboardGerente } from './Components/Pages/DashboardGerente/DashboardGerente.jsx'

createRoot(document.getElementById('root')).render(
  <Provider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <Navbar />
    <App />
    <Footer />
  </React.StrictMode>,
)

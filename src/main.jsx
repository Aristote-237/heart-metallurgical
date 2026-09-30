import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'

if ('serviceWorker' in navigator) {
	let controlled = Boolean(navigator.serviceWorker.controller)
	let refreshing = false
	navigator.serviceWorker.addEventListener('controllerchange', () => {
		if (controlled && !refreshing) {
			refreshing = true
			window.location.reload()
		}
		controlled = true
	})
}

createRoot(document.getElementById('root')).render(<BrowserRouter><App /></BrowserRouter>)

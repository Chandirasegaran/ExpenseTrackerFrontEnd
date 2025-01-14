import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'



// Protection against console opening
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
  console.debug = () => {};
  console.info = () => {};
}

// Additional protection
window.addEventListener('load', function() {
  document.onkeydown = function(e) {
    if (e.keyCode === 123) { // F12
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) { // Ctrl+Shift+I
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) { // Ctrl+Shift+J
      return false;
    }
    if (e.ctrlKey && e.keyCode === 85) { // Ctrl+U
      return false;
    }
  };
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

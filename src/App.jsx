import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { useAuth } from './contexts/authContext';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Home from './components/home';
import Navbar from './components/navBar/Navbar';
import { initializeIcons } from '@fluentui/react';
import SplashScreen from './components/splashscreen';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { AuthProvider } from './contexts/authContext';

initializeIcons();

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { currentUser } = useAuth();

  const routesArray = [
    {
      path: '*',
      element: <Navigate to="/splash" replace />,
    },
    {
      path: '/splash',
      element: <SplashScreen />, // Show splash screen
    },
    {
      path: '/login',
      element: currentUser ? <Navigate to="/home" replace /> : <Login />,
    },
    {
      path: '/register',
      element: currentUser ? <Navigate to="/home" replace /> : <Register />,
    },
    {
      path: '/home',
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
  ];

  return useRoutes(routesArray);
};

function App() {
  return (
    <AuthProvider>
      <FluentProvider theme={webLightTheme}>
        <div className="app">
          {/* Don't render Navbar when on splash screen */}
          <AppRoutes />
        </div>
      </FluentProvider>
    </AuthProvider>
  );
}

export default App;

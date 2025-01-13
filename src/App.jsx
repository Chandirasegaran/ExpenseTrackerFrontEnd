import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { useAuth } from './contexts/authContext';
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Home from "./components/home";
import Navbar from "./components/navBar/Navbar";
import { initializeIcons } from '@fluentui/react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { AuthProvider } from "./contexts/authContext";

// Initialize Fluent UI icons
initializeIcons();

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Routes Component - Separate the routes logic
const AppRoutes = () => {
  const { currentUser } = useAuth();

  const routesArray = [
    {
      path: "*",
      element: <Navigate to="/home" replace />,
    },
    {
      path: "/login",
      element: currentUser ? <Navigate to="/home" replace /> : <Login />,
    },
    {
      path: "/register",
      element: currentUser ? <Navigate to="/home" replace /> : <Register />,
    },
    {
      path: "/home",
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
          <Navbar />
          <AppRoutes />
        </div>
      </FluentProvider>
    </AuthProvider>
  );
}

export default App;
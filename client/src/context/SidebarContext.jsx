import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Set default sidebar state based on route and screen size
  useEffect(() => {
    const updateSidebarState = () => {
      const isDesktop = window.innerWidth >= 1024;
      const isDashboardRoute = location.pathname === '/dashboard';
      
      if (isDesktop && isDashboardRoute) {
        setIsSidebarOpen(true); // Dashboard: open by default on desktop
      } else {
        setIsSidebarOpen(false); // All other cases: closed by default
      }
    };

    updateSidebarState();
    window.addEventListener('resize', updateSidebarState);
    
    return () => window.removeEventListener('resize', updateSidebarState);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  return (
    <SidebarContext.Provider 
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        closeSidebar,
        openSidebar
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
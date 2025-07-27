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

  // Debug logging
  console.log('SidebarProvider - isSidebarOpen:', isSidebarOpen, 'location:', location.pathname);

  // Set default sidebar state based on route and screen size
  useEffect(() => {
    const updateSidebarState = () => {
      const isDesktop = window.innerWidth >= 1024;
      const isDashboardRoute = location.pathname === '/dashboard';
      
      console.log('updateSidebarState - isDesktop:', isDesktop, 'isDashboardRoute:', isDashboardRoute);
      
      if (isDesktop && isDashboardRoute) {
        console.log('Setting sidebar open');
        setIsSidebarOpen(true); // Dashboard: open by default on desktop
      } else {
        console.log('Setting sidebar closed');
        setIsSidebarOpen(false); // All other cases: closed by default
      }
    };

    updateSidebarState();
    window.addEventListener('resize', updateSidebarState);
    
    return () => window.removeEventListener('resize', updateSidebarState);
  }, [location.pathname]);

  const toggleSidebar = () => {
    console.log('toggleSidebar called - current state:', isSidebarOpen);
    setIsSidebarOpen(prev => {
      console.log('toggleSidebar - changing from:', prev, 'to:', !prev);
      return !prev;
    });
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
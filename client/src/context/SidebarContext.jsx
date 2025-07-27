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
  // Initialize sidebar as closed, especially on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Define which pages should have sidebar open by default on desktop only
  const defaultOpenPages = ['/dashboard'];
  
  // Define all dashboard/auth pages where sidebar should be available
  const dashboardPages = [
    '/dashboard',
    '/dashboard/dsa',
    '/dashboard/theory/dsa',
    '/dashboard/theory/java',
    '/dashboard/theory/oops',
    '/dashboard/core/os',
    '/dashboard/core/dbms',
    '/dashboard/core/cn',
    '/dashboard/quizhistory',
    '/dashboard/revision-planner',
    '/dashboard/feedback',
    '/profile',
    '/edit-profile',
    '/quiz/history'
  ];

  // Function to check if screen is mobile
  const isMobile = () => {
    return typeof window !== 'undefined' && window.innerWidth < 1024; // lg breakpoint in Tailwind
  };

  // Set default sidebar state based on current page and screen size
  useEffect(() => {
    // Always close sidebar on mobile, regardless of page
    if (isMobile()) {
      setIsSidebarOpen(false);
    } else {
      // On desktop, open sidebar for default pages, close for others
      if (defaultOpenPages.includes(location.pathname)) {
        setIsSidebarOpen(true);
      } else if (dashboardPages.includes(location.pathname)) {
        setIsSidebarOpen(false);
      }
    }
  }, [location.pathname]);

  // Handle window resize to close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (isMobile() && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const value = {
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    isDashboardPage: dashboardPages.includes(location.pathname)
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};
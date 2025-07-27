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

  // Define which pages should have sidebar open by default
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

  // Set default sidebar state based on current page
  useEffect(() => {
    if (defaultOpenPages.includes(location.pathname)) {
      setIsSidebarOpen(true);
    } else if (dashboardPages.includes(location.pathname)) {
      setIsSidebarOpen(false);
    }
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
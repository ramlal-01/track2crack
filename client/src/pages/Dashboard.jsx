import React, { useState } from "react";

const Dashboard = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-white dark:bg-gray-900 p-4 shadow-md">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Sidebar</h2>
        <button
          onClick={toggleTheme}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Toggle Theme
        </button>
      </aside>

      {/* Main Dashboard Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Dashboard
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          This is a basic dashboard layout. You can now re-integrate individual components step by step.
        </p>
      </main>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useRef } from "react";
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from "chart.js";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip);

const SubjectProgressChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const { theme } = useTheme();

  // Safely get data values with fallback
  const chartData = data || {};
  const dataValues = Object.values(chartData);
  const dataKeys = Object.keys(chartData);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    
    // Create gradient for bars with fallback
    const createGradient = (ctx, value = 0) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      if (value < 30) {
        gradient.addColorStop(0, theme === 'dark' ? '#ef4444' : '#f87171');
        gradient.addColorStop(1, theme === 'dark' ? '#b91c1c' : '#dc2626');
      } else if (value < 70) {
        gradient.addColorStop(0, theme === 'dark' ? '#f59e0b' : '#fbbf24');
        gradient.addColorStop(1, theme === 'dark' ? '#b45309' : '#d97706');
      } else {
        gradient.addColorStop(0, theme === 'dark' ? '#10b981' : '#34d399');
        gradient.addColorStop(1, theme === 'dark' ? '#047857' : '#059669');
      }
      return gradient;
    };

    // Get screen width to determine mobile
    const isMobile = window.innerWidth < 768;

    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: dataKeys,
        datasets: [
          {
            label: "Completion %",
            data: dataValues,
            backgroundColor: dataValues.map(value => createGradient(ctx, value)),
            borderRadius: {
              topLeft: isMobile ? 8 : 12,
              topRight: isMobile ? 8 : 12,
              bottomLeft: 0,
              bottomRight: 0,
            },
            borderWidth: 0,
            barThickness: isMobile ? 25 : 40,
            hoverBackgroundColor: dataValues.map(value => {
              if (value < 30) return theme === 'dark' ? '#fca5a5' : '#fecaca';
              if (value < 70) return theme === 'dark' ? '#fcd34d' : '#fde68a';
              return theme === 'dark' ? '#6ee7b7' : '#a7f3d0';
            }),
            hoverBorderWidth: 2,
            hoverBorderColor: theme === 'dark' ? '#93c5fd' : '#3b82f6',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeOutElastic',
          delay: (context) => {
            return context.dataIndex * 100;
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              drawTicks: false,
            },
            border: {
              display: false,
            },
            ticks: {
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
              padding: isMobile ? 5 : 10,
              font: {
                size: isMobile ? 10 : 12,
              },
              callback: function(value) {
                return value + '%';
              }
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: theme === 'dark' ? '#d1d5db' : '#4b5563',
              font: {
                weight: '600',
                size: isMobile ? 10 : 12,
              },
            },
            border: {
              display: false,
            },
          },
        },
        plugins: {
          tooltip: {
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            titleColor: theme === 'dark' ? '#f3f4f6' : '#111827',
            bodyColor: theme === 'dark' ? '#d1d5db' : '#4b5563',
            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
            borderWidth: 1,
            padding: isMobile ? 12 : 16,
            cornerRadius: isMobile ? 8 : 12,
            displayColors: false,
            bodyFont: {
              weight: '600',
              size: isMobile ? 12 : 14,
            },
            callbacks: {
              label: function(context) {
                return `${context.parsed.y}% completed`;
              },
              title: function(context) {
                return context[0].label;
              }
            }
          },
          legend: {
            display: false,
          },
        },
        layout: {
          padding: {
            top: isMobile ? 10 : 20,
            right: isMobile ? 10 : 20,
            bottom: isMobile ? 10 : 20,
            left: isMobile ? 10 : 20,
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data, theme]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-[20rem] sm:h-[28rem] w-full max-w-[40rem] mx-auto rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-3 sm:gap-0">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 sm:gap-3">
            <span className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg sm:rounded-xl shadow-sm">
              <span className="text-base sm:text-xl">📊</span>
            </span>
            <span className="line-clamp-1">Quiz Progress Overview</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">
            Visual overview of your learning progress
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
          <span className={`w-2 h-2 rounded-full ${
            dataValues.some(v => v < 30) ? 'bg-red-500' : 'bg-green-500'
          }`}></span>
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
            {dataKeys.length} {dataKeys.length === 1 ? 'subject' : 'subjects'}
          </span>
        </div>
      </div>
      
      <div className="relative h-48 sm:h-80">
        <canvas ref={chartRef} />
        {dataKeys.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 gap-2">
            <div className="text-3xl sm:text-4xl">📭</div>
            <p className="text-base sm:text-lg font-medium">No progress data available</p>
            <p className="text-xs sm:text-sm">Start learning to see your progress</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4 sm:mt-6">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-red-500"></span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Beginner (0-30%)</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-yellow-500"></span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Intermediate (30-70%)</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-green-500"></span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Advanced (70-100%)</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SubjectProgressChart;
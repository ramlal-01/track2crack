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
              topLeft: 12,
              topRight: 12,
              bottomLeft: 0,
              bottomRight: 0,
            },
            borderWidth: 0,
            barThickness: 40,
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
              padding: 10,
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
                size: 12,
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
            padding: 16,
            cornerRadius: 12,
            displayColors: false,
            bodyFont: {
              weight: '600',
              size: 14,
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
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
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
      className="h-[28rem] w-[40rem] rounded-3xl shadow-xl p-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <span className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl shadow-sm">
              <span className="text-xl">📊</span>
            </span>
            Quiz Progress Overview
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Visual overview of your learning progress
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-full">
          <span className={`w-2 h-2 rounded-full ${
            dataValues.some(v => v < 30) ? 'bg-red-500' : 'bg-green-500'
          }`}></span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {dataKeys.length} {dataKeys.length === 1 ? 'subject' : 'subjects'}
          </span>
        </div>
      </div>
      
      <div className="relative h-80">
        <canvas ref={chartRef} />
        {dataKeys.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 gap-2">
            <div className="text-4xl">📭</div>
            <p className="text-lg font-medium">No progress data available</p>
            <p className="text-sm">Start learning to see your progress</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-center gap-4 mt-6">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Beginner (0-30%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Intermediate (30-70%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Advanced (70-100%)</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SubjectProgressChart;
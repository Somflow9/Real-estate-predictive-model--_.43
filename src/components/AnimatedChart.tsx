import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AnimatedChartProps {
  type: 'line' | 'bar' | 'doughnut';
  data: any;
  options?: any;
  title?: string;
  className?: string;
}

const AnimatedChart: React.FC<AnimatedChartProps> = ({ 
  type, 
  data, 
  options = {}, 
  title,
  className = ""
}) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          color: 'hsl(var(--foreground))',
        }
      },
      title: {
        display: !!title,
        text: title,
        color: 'hsl(var(--foreground))',
        font: {
          size: 16,
          weight: 'bold' as const,
        }
      },
    },
    scales: type !== 'doughnut' ? {
      y: {
        grid: {
          color: 'hsl(var(--border))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        }
      },
      x: {
        grid: {
          color: 'hsl(var(--border))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        }
      }
    } : undefined,
    ...options
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={defaultOptions} />;
      case 'bar':
        return <Bar data={data} options={defaultOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={defaultOptions} />;
      default:
        return <Line data={data} options={defaultOptions} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative h-64 w-full ${className}`}
    >
      {renderChart()}
    </motion.div>
  );
};

export default AnimatedChart;
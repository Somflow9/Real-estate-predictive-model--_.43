import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
  }>;
}

interface AnimatedChartProps {
  type: 'line' | 'bar' | 'doughnut';
  data: ChartData;
  className?: string;
}

const AnimatedChart: React.FC<AnimatedChartProps> = ({ type, data, className = '' }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Simple chart rendering simulation
    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = 400;
    canvas.height = 300;

    // Simple line chart simulation
    if (type === 'line' && data.datasets.length > 0) {
      const dataset = data.datasets[0];
      const maxValue = Math.max(...dataset.data);
      const minValue = Math.min(...dataset.data);
      const range = maxValue - minValue || 1;

      ctx.strokeStyle = dataset.borderColor || '#8F00FF';
      ctx.lineWidth = 2;
      ctx.beginPath();

      dataset.data.forEach((value, index) => {
        const x = (index / (dataset.data.length - 1)) * (canvas.width - 40) + 20;
        const y = canvas.height - 40 - ((value - minValue) / range) * (canvas.height - 80);
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Add data points
      ctx.fillStyle = dataset.borderColor || '#8F00FF';
      dataset.data.forEach((value, index) => {
        const x = (index / (dataset.data.length - 1)) * (canvas.width - 40) + 20;
        const y = canvas.height - 40 - ((value - minValue) / range) * (canvas.height - 80);
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    // Simple bar chart simulation
    if (type === 'bar' && data.datasets.length > 0) {
      const dataset = data.datasets[0];
      const maxValue = Math.max(...dataset.data);
      const barWidth = (canvas.width - 40) / dataset.data.length - 10;

      dataset.data.forEach((value, index) => {
        const x = 20 + index * (barWidth + 10);
        const height = (value / maxValue) * (canvas.height - 80);
        const y = canvas.height - 40 - height;

        ctx.fillStyle = dataset.backgroundColor || '#8F00FF';
        ctx.fillRect(x, y, barWidth, height);
      });
    }

    // Simple doughnut chart simulation
    if (type === 'doughnut' && data.datasets.length > 0) {
      const dataset = data.datasets[0];
      const total = dataset.data.reduce((sum, value) => sum + value, 0);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 20;
      const innerRadius = radius * 0.6;

      let currentAngle = -Math.PI / 2;
      const colors = ['#8F00FF', '#6A0DAD', '#4B0082'];

      dataset.data.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        ctx.fillStyle = colors[index % colors.length];
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
        ctx.closePath();
        ctx.fill();

        currentAngle += sliceAngle;
      });
    }

  }, [type, data]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-center ${className}`}
    >
      <canvas
        ref={chartRef}
        className="max-w-full h-auto"
        style={{ maxHeight: '300px' }}
      />
    </motion.div>
  );
};

export default AnimatedChart;
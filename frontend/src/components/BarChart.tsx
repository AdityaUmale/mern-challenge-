// src/components/BarChart.tsx
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import API from '../api';

const BarChart: React.FC<{ month: string }> = ({ month }) => {
  const [chartData, setChartData] = useState<{ priceRange: string; count: number }[]>([]);

  const fetchBarChart = async () => {
    try {
      const response = await API.get('/bar-chart', { params: { month } });
      setChartData(response.data);
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  useEffect(() => {
    fetchBarChart();
  }, [month]);

  const data = {
    labels: chartData.map((d) => d.priceRange),
    datasets: [
      {
        label: 'Number of Items',
        data: chartData.map((d) => d.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return <Bar data={data} />;
};

export default BarChart;

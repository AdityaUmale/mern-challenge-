// src/components/PieChart.tsx
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import API from '../api';

const PieChart: React.FC<{ month: string }> = ({ month }) => {
  const [chartData, setChartData] = useState<{ category: string; count: number }[]>([]);

  const fetchPieChart = async () => {
    try {
      const response = await API.get('/pie-chart', { params: { month } });
      setChartData(response.data);
    } catch (error) {
      console.error('Error fetching pie chart data:', error);
    }
  };

  useEffect(() => {
    fetchPieChart();
  }, [month]);

  const data = {
    labels: chartData.map((d) => d.category),
    datasets: [
      {
        data: chartData.map((d) => d.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  return <Pie data={data} />;
};

export default PieChart;


import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import API from '../api';

const PieChart: React.FC<{ month: string }> = ({ month }) => {
  const [chartData, setChartData] = useState<{ category: string; count: number }[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(month);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchPieChart = async () => {
    try {
      const response = await API.get('/pie-chart', { params: { month: selectedMonth } });
      setChartData(response.data);
    } catch (error) {
      console.error('Error fetching pie chart data:', error);
    }
  };

  useEffect(() => {
    fetchPieChart();
  }, [selectedMonth]);

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

  return (
    <div className="space-y-4">
      <select
        title="Select month"
        aria-label="Select month"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="px-4 py-2 rounded-lg bg-[#e6b31e] text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-[#c99b19] cursor-pointer"
      >
        {months.map((m) => (
          <option key={m} value={m.toLowerCase()}>
            {m}
          </option>
        ))}
      </select>
      <div className="bg-[#ffeeb2] p-6 rounded-lg shadow-md">
        <Pie data={data} />
      </div>
    </div>
  );
};

export default PieChart;

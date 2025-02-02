
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import API from '../api';

const BarChart: React.FC<{ month: string }> = ({ month }) => {
  const [chartData, setChartData] = useState<{ priceRange: string; count: number }[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(month);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchBarChart = async () => {
    try {
      const response = await API.get('/bar-chart', { params: { month: selectedMonth } });
      setChartData(response.data);
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  useEffect(() => {
    fetchBarChart();
  }, [selectedMonth]);

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
        <Bar data={data} />
      </div>
    </div>
  );
};

export default BarChart;

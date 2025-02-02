
import React, { useState, useEffect } from 'react';
import API from '../api';

interface Statistics {
  totalSaleAmount: number;
  totalSoldItems: number;
  totalNotSoldItems: number;
}

const Statistics: React.FC<{ month: string }> = ({ month }) => {
  const [stats, setStats] = useState<Statistics | null>(null);

  const fetchStatistics = async () => {
    try {
      const response = await API.get('/statistics', { params: { month } });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [month]);

  if (!stats) return <div>Loading statistics...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-gray-800">
        Statistics - <span className="text-[#e6b31e]">{month}</span>
      </h3>
      <div className="bg-[#ffeeb2] p-6 rounded-lg shadow-md">
        <div className="flex justify-between text-lg text-gray-800">
          <span>Total sale</span>
          <span>{stats.totalSaleAmount}</span>
        </div>
        <div className="flex justify-between text-lg text-gray-800 mt-2">
          <span>Total sold item</span>
          <span>{stats.totalSoldItems}</span>
        </div>
        <div className="flex justify-between text-lg text-gray-800 mt-2">
          <span>Total not sold item</span>
          <span>{stats.totalNotSoldItems}</span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

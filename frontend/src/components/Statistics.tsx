// src/components/Statistics.tsx
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
    <div>
      <h3>Statistics for {month}</h3>
      <p>Total Sale Amount: ${stats.totalSaleAmount}</p>
      <p>Total Sold Items: {stats.totalSoldItems}</p>
      <p>Total Unsold Items: {stats.totalNotSoldItems}</p>
    </div>
  );
};

export default Statistics;

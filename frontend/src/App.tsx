// src/App.tsx
import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

const App: React.FC = () => {
  const [month, setMonth] = useState<string>('March');

  return (
    <div>
      <h1>Transactions Dashboard</h1>
      <select 
        value={month} 
        onChange={(e) => setMonth(e.target.value)}
        aria-label="Select month"
        title="Select month"
      >
        {[
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December',
        ].map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <Statistics month={month} />
      <TransactionsTable />
      <BarChart month={month} />
      <PieChart month={month} />
    </div>
  );
};

export default App;

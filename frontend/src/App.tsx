
import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

const App: React.FC = () => {
  const [month, setMonth] = useState<string>('March');

  return (
    <div className="min-h-screen bg-[#fff9e6] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">
            Transactions Dashboard
          </h1>
          <select 
            value={month} 
            onChange={(e) => setMonth(e.target.value)}
            aria-label="Select month"
            title="Select month"
            className="px-4 py-2 rounded-lg bg-[#e6b31e] text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-[#c99b19] cursor-pointer"
          >
            {[
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December',
            ].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Statistics month={month} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <TransactionsTable />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <BarChart month={month} />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <PieChart month={month} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

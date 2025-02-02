// src/components/TransactionsTable.tsx
import React, { useState, useEffect } from 'react';
import API from '../api';

interface Transaction {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;  
  sold: boolean;
  dateOfSale: string;
  image: string;    
}

const TransactionsTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [month, setMonth] = useState<string>('March');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const fetchTransactions = async () => {
    try {
      const response = await API.get('/transactions', {
        params: { month, search, page, perPage: 10 },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [month, search, page]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search transaction"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-full bg-[#ffeeb2] border-none focus:outline-none focus:ring-2 focus:ring-[#e6d28c] w-64"
        />
        
        <select 
          title="Select Month"
          value={month} 
          onChange={(e) => setMonth(e.target.value)}
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

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full">
          <thead className="bg-[#ffeeb2]">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sold</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
            </tr>
          </thead>
          <tbody className="bg-[#fff9e6] divide-y divide-[#ffeeb2]">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-[#ffeeb2] transition-colors">
                <td className="px-6 py-4 text-sm text-gray-700">{tx.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{tx.title}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{tx.description}</td>
                <td className="px-6 py-4 text-sm text-gray-700">${tx.price}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{tx.category}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tx.sold ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {tx.sold ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {tx.image && <img src={tx.image} alt={tx.title} className="w-10 h-10 object-cover rounded" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center px-4">
        <div className="text-sm text-gray-700">Page No: {page}</div>
        <div className="space-x-2">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 text-gray-700 hover:bg-[#ffeeb2] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span>-</span>
          <button 
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 text-gray-700 hover:bg-[#ffeeb2]"
          >
            Next
          </button>
        </div>
        <div className="text-sm text-gray-700">Per Page: 10</div>
      </div>
    </div>
  );
};

export default TransactionsTable;

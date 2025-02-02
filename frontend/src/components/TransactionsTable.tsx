// src/components/TransactionsTable.tsx
import React, { useState, useEffect } from 'react';
import API from '../api';

interface Transaction {
  id: number;
  title: string;
  price: number;
  description: string;
  sold: boolean;
  dateOfSale: string;
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
    <div>
      <h2>Transactions for {month}</h2>
      <select 
        value={month} 
        onChange={(e) => setMonth(e.target.value)}
        aria-label="Select month"
      >
        {[
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December',
        ].map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.title}</td>
              <td>{tx.description}</td>
              <td>{tx.price}</td>
              <td>{new Date(tx.dateOfSale).toLocaleDateString()}</td>
              <td>{tx.sold ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
};

export default TransactionsTable;

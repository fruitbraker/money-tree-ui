import React from 'react';
import './App.css';
import ExpenseSummaryGrid from './grids/expensesummary/ExpenseSummaryGrid';

const App: React.FC = () => {

  return (
    <div className="App">
      <h1>Expense Summary</h1>
      <ExpenseSummaryGrid />
    </div>
  )
}

export default App;

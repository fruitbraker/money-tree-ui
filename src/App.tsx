import logo from './logo.svg';
import './App.css';
import { getExpenseSummary } from './services/ExpenseSummaryService';

const App: React.FC = () => {

  const foo = getExpenseSummary()

  return (
    <div className="App">
      <h1>Expenses</h1>
    </div>
  )
}

export default App;

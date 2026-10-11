import { useState } from "react";
import type { Expense, ExpenseFilter } from "../types/Expense";
import ExpenseItem from "../components/ExpenseItem";
import ExpenseSearch from "../components/ExpenseSearch";
import ExpenseAdd from "../components/ExpenseAdd";
import useExpenses from "../hooks/useExpenses";
import ExpenseReset from "../components/ExpenseReset";
import ExpenseSorter from "../components/ExpenseSorter";

function Home() {
  const [filter, setFilter] = useState<ExpenseFilter>({});
  const { expenses, addExpense, resetExpenses } = useExpenses(filter);
  const [sortingAlgo, setSortingAlgo] = useState<(a: Expense, b: Expense) => number>(() => () => 1);

  const handleAlgoChange = (algo: (a: Expense, b: Expense) => number) => {
    setSortingAlgo(() => algo); // We're wrapping algo in a function because useState setter accept either a value or a function returning a value.
  };

  const sortedExpenses = [...expenses].sort(sortingAlgo);

  return <div>
    <h1>Manage your expenses</h1>
    <ExpenseAdd addExpense={addExpense} />
    <ExpenseReset resetExpenses={resetExpenses}/>
    <h2>Your expenses</h2>
    <ExpenseSearch onSearch={setFilter} />
    {sortedExpenses.length > 0 && <ExpenseSorter setSortingAlgo={handleAlgoChange} />}
    <ul>
      {sortedExpenses.map((expense) => (
        <li key={expense.id}>
          <ExpenseItem expense={expense} />
        </li>
      ))}
    </ul>
  </div>;
}

export default Home;

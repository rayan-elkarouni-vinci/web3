import { useState } from "react";

import type { ExpenseFilter } from "../../types/Expense";
import ExpenseItem from "../../components/ExpenseItem";
import ExpenseSearch from "../../components/ExpenseSearch";
import useExpenses from "../../hooks/useExpenses";

const ExpenseList = () => {
  const [filter, setFilter] = useState<ExpenseFilter>({});
  const { expenses } = useExpenses(filter);

  return (
    <>
      <h2>Your expenses</h2>

      <ExpenseSearch onSearch={setFilter} />

      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            <ExpenseItem expense={expense} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default ExpenseList;

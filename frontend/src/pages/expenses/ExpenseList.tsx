import { useLoaderData } from "react-router";
import ExpenseItem from "../../components/ExpenseItem";
import ExpenseSearch from "../../components/ExpenseSearch";
import type { Expense } from "../../types/Expense";

const ExpenseList = () => {
  const expenses = useLoaderData() as Expense[];

  return (
    <>
      <h2>Your expenses</h2>

      <ExpenseSearch />

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

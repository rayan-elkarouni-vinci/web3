/**
 * A simple component to display an expense item
 */

import { Link } from "react-router";
import type { Expense } from "../types/Expense";

interface ExpenseItemProps {
  expense: Expense;
}

function ExpenseItem({ expense }: ExpenseItemProps) {
  return (
    <div>
      <h3>Expense {expense.id}</h3>
      <p>
        Date:{" "}
        {new Date(expense.date).toLocaleDateString("fr-FR", {
          timeZone: "UTC",
        })}
      </p>
      <Link to={`/expenses/${expense.id}`}>Description: {expense.description}</Link>
      {/* amount must be restricted to 2 decimal places */}
      <p>Amount: {expense.amount.toFixed(2)}</p>
      <p>Payer: {expense.payer.name}</p>
      <p>
        Category:{" "}
        {expense.category ? (
          <span
            style={{
              backgroundColor: expense.category.colour,
              color: "white",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            {expense.category.name}
          </span>
        ) : (
          "No category"
        )}
      </p>
      <p>Participants: {expense.participants.map((p) => p.name).join(", ")}</p>
    </div>
  );
}

export default ExpenseItem;

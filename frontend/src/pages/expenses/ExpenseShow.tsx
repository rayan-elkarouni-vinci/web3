import { useLoaderData } from "react-router";
import type { Expense } from "../../types/Expense";

const ExpenseShow = () => {
  const expense = useLoaderData() as Expense;

  return (
    <>
      <h2>Detail of Expense [{expense.id}]</h2>

      <p>{expense.description}</p>
      <p>Amount: {expense.amount.toFixed(2)}</p>
      <p>
        Date:{" "}
        {new Date(expense.date).toLocaleDateString("fr-FR", {
          timeZone: "UTC",
        })}
      </p>
      <p>
        Payer: {expense.payer.name} ({expense.payer.email}) -{" "}
        {expense.payer.bankAccount ?? "No bank account"} 
      </p>

      <p>Participants:</p>
      <ul>
        {expense.participants.map((participant) => (
          <li key={participant.id}>{participant.name}</li>
        ))}
      </ul>

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
    </>
  );
};

export default ExpenseShow;

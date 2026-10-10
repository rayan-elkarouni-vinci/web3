import { useState } from "react";
import type { NewExpense } from "../types/Expense";

interface ExpenseAddProps {
  addExpense: (expense: NewExpense) => void;
}

function ExpenseAdd({ addExpense }: ExpenseAddProps) {
  const [payer, setPayer] = useState<string>("Alice");
  const [date, setDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: NewExpense = {
      date,
      description,
      payer,
      amount,
    } 
    addExpense(newExpense);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Add a new Expense</h2>

        <label>
          Payer:
          <select value={payer} onChange={(e) => setPayer(e.target.value)}>
            <option value="Alice">Alice</option>
            <option value="Bob">Bob</option>
          </select>
        </label>

        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label>
          Description:
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label>
          Amount:
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </label>

        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default ExpenseAdd;

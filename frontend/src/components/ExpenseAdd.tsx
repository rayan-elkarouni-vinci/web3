import type { NewExpense } from "../types/Expense";
import { useForm } from "react-hook-form";

interface ExpenseAddProps {
  addExpense: (expense: NewExpense) => void;
}

function ExpenseAdd({ addExpense }: ExpenseAddProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewExpense>();

  const onSubmit = (data: NewExpense) => {
    addExpense(data);
    reset(); // Reset the form after submission
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Add a new Expense</h2>

        <label>
          Payer:
          <select {...register("payer")}>
            <option value="Alice">Alice</option>
            <option value="Bob">Bob</option>
          </select>
        </label>

        <label>
          Date:
          <input
            type="date"
            {...register("date", { required: "Date required" })}
            placeholder="Select date"
          />
          {errors.date && <span>{errors.date.message}</span>}
        </label>

        <label>
          Description:
          <input
            type="text"
            {...register("description", { required: "Description required" })}
            placeholder="Enter description"
          />
          {errors.description && <span>{errors.description.message}</span>}
        </label>

        <label>
          Amount:
          <input
            type="number"
            step="0.01"
            {...register("amount", {
              required: "Amount required",
              valueAsNumber: true,
              min: { value: 0.01, message: "Must be positive" },
            })}
            placeholder="Enter amount"
          />
          {errors.amount && <span>{errors.amount.message}</span>}
        </label>

        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default ExpenseAdd;

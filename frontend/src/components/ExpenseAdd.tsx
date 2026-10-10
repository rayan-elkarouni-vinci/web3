import type { NewExpense } from "../types/Expense";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const ExpenseSchema = z.object({
  payer: z.enum(["Alice", "Bob"], {
    message: "Payer must be either Alice or Bob",
  }),
  date: z.string().min(1, { message: "Date required" }),
  description: z
    .string()
    .max(200, { message: "Maximum 200 characters" })
    .optional(),
  amount: z
    .number({ message: "Amount required" })
    .positive({ message: "Amount must be positive" }),
});

// Le type du formulaire est déduit du schéma : pas besoin de le réécrire
type ExpenseForm = z.infer<typeof ExpenseSchema>;

interface ExpenseAddProps {
  addExpense: (expense: NewExpense) => void;
}

function ExpenseAdd({ addExpense }: ExpenseAddProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseForm>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: { payer: "Alice" },
  });

  const onSubmit = (data: ExpenseForm) => {
    addExpense({ ...data, description: data.description ?? "" }); // cas ou pas de description, on en met une vide
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
          {errors.payer && <span>{errors.payer.message}</span>}
        </label>

        <label>
          Date:
          <input type="date" {...register("date")} />
          {errors.date && <span>{errors.date.message}</span>}
        </label>

        <label>
          Description:
          <input
            type="text"
            {...register("description")}
            placeholder="Enter description (optional)"
          />
          {errors.description && <span>{errors.description.message}</span>}
        </label>

        <label>
          Amount:
          <input
            type="number"
            step="0.01"
            {...register("amount", {
              valueAsNumber: true,
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

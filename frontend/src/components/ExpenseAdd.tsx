import type { NewExpense } from "../types/Expense";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useUsers from "../hooks/useUsers";

const ExpenseSchema = z.object({
  payerId: z.number({ message: "Payer required" }),
  date: z.string().min(1, { message: "Date required" }),
  description: z
    .string()
    .max(200, { message: "Maximum 200 characters" })
    .optional(),
  amount: z
    .number({ message: "Amount required" })
    .positive({ message: "Amount must be positive" }),
  // Les cases à cocher renvoient du texte : on convertit à l'envoi
  participants: z.array(z.string()).min(1, "Select at least one participant"),
});

// Le type du formulaire est déduit du schéma : pas besoin de le réécrire
type ExpenseForm = z.infer<typeof ExpenseSchema>;

interface ExpenseAddProps {
  addExpense: (expense: NewExpense) => void;
}

function ExpenseAdd({ addExpense }: ExpenseAddProps) {
  const { users, loading, error } = useUsers();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseForm>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: { participants: [] },
  });

  const onSubmit = (data: ExpenseForm) => {
    addExpense({
      date: data.date,
      description: data.description ?? "",
      amount: data.amount,
      payerId: data.payerId,
      participants: data.participants.map(Number),
    });
    reset();
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Add a new Expense</h2>

        <label>
          Payer:
          <select {...register("payerId", { valueAsNumber: true })}>
            <option value="">Choose a payer</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.payerId && <span>{errors.payerId.message}</span>}
        </label>

        <fieldset>
          <legend>Participants:</legend>
          {users.map((user) => (
            <label key={user.id}>
              <input
                type="checkbox"
                value={user.id}
                {...register("participants")}
              />
              {user.name}
            </label>
          ))}
          {errors.participants && <span>{errors.participants.message}</span>}
        </fieldset>

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

import { useForm } from "react-hook-form";
import type { ExpenseFilter } from "../types/Expense";
import useUsers from "../hooks/useUsers";

interface ExpenseSearchProps {
  onSearch: (filter: ExpenseFilter) => void;
}

interface SearchForm {
  amount: string;
  payerId: string;
}

function ExpenseSearch({ onSearch }: ExpenseSearchProps) {
  const { users } = useUsers();

  const { register, handleSubmit } = useForm<SearchForm>({
    defaultValues: { amount: "", payerId: "" },
  });

  const onSubmit = (data: SearchForm) => {
    onSearch({
      amount: data.amount === "" ? undefined : Number(data.amount),
      payerId: data.payerId === "" ? undefined : Number(data.payerId),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Search expenses</h2>

      <label>
        Amount greater than:
        <input
          type="number"
          step="0.01"
          min="0"
          {...register("amount")}
          placeholder="Enter amount"
        />
      </label>

      <label>
        Payer:
        <select {...register("payerId")}>
          <option value="">All payers</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </label>

      <button type="submit">Search</button>
    </form>
  );
}

export default ExpenseSearch;

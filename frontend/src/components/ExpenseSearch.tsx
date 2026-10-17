import { useForm } from "react-hook-form";
import useUsers from "../hooks/useUsers";
import useCategories from "../hooks/useCategories";
import { useSearchParams } from "react-router";

interface SearchForm {
  amount: string;
  payerId: string;
  categoryId: string;
}

function ExpenseSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { users } = useUsers();
  const { categories } = useCategories();

  const { register, handleSubmit } = useForm<SearchForm>({
    // keep the form in sync with the URL when the page is opened with filters already set
    defaultValues: {
      amount: searchParams.get("amount") ?? "",
      payerId: searchParams.get("payerId") ?? "",
      categoryId: searchParams.get("categoryId") ?? "",
    },
  });

  const onSubmit = (data: SearchForm) => {
    // Only the filters the user actually filled in go into the URL.
    const filter: Record<string, string> = {};
    if (data.amount) filter.amount = data.amount;
    if (data.payerId) filter.payerId = data.payerId;
    if (data.categoryId) filter.categoryId = data.categoryId;

    setSearchParams(filter);
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

      <label>
        Category:
        <select {...register("categoryId")}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <button type="submit">Search</button>
    </form>
  );
}

export default ExpenseSearch;

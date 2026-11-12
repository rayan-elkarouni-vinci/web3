import { redirect, type LoaderFunctionArgs } from "react-router";
import type { ExpenseListItem } from "../../types/Expense";
import { graphqlRequest } from "../../lib/graphql";
import { clearToken } from "../../lib/token";

const MY_EXPENSES_QUERY = /* GraphQL */ `
  query MyExpenses($filter: ExpenseFilter) {
    me {
      expenses(filter: $filter) {
        id
        description
        amount
        date
        payer {
          id
          name
        }
        category {
          id
          name
          colour
        }
      }
    }
  }
`;

export async function expenseListLoader({
  request,
}: LoaderFunctionArgs): Promise<ExpenseListItem[]> {
  const params = new URL(request.url).searchParams;

  const filter = {
    amount: params.get("amount") ? Number(params.get("amount")) : undefined,
    payerId: params.get("payerId") ? Number(params.get("payerId")) : undefined,
    categoryId: params.get("categoryId")
      ? Number(params.get("categoryId"))
      : undefined,
  };

  const data = await graphqlRequest<{
    me: { expenses: ExpenseListItem[] } | null;
  }>(MY_EXPENSES_QUERY, { filter });

  // `me` vaut null pour un appelant anonyme, et un jeton qui ne se vérifie
  // plus rend l'appelant anonyme aux yeux du serveur.
  if (!data.me) {
    clearToken();
    throw redirect("/login");
  }

  return data.me.expenses;
}

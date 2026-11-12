import { useNavigate } from "react-router";
import ExpenseAdd from "../../components/ExpenseAdd";
import type { NewExpenseFormOutput } from "../../types/Expense";
import { graphqlRequest } from "../../lib/graphql";
import { useAuth } from "../../contexts/AuthContext";

const CREATE_EXPENSE = /* GraphQL */ `
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      id
    }
  }
`;

const ExpenseNew = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const createExpense = async (expense: NewExpenseFormOutput) => {
    // On envoie encore un payerId, parce que la mutation en prend un.
    // Mais il ne DÉCIDE plus rien : le resolver le compare à l'id du jeton
    // et refuse s'ils diffèrent.
    await graphqlRequest(CREATE_EXPENSE, {
      input: { ...expense, payerId: user!.id },
    });
    navigate("/expenses");
  };

  return (
    <>
      <h2>New expense</h2>
      <ExpenseAdd addExpense={createExpense} />
    </>
  );
};

export default ExpenseNew;

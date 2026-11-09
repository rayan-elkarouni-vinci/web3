import { useNavigate } from "react-router";
import ExpenseAdd from "../../components/ExpenseAdd";
import type { NewExpense } from "../../types/Expense";
import { graphqlRequest } from "../../lib/graphql";

const CREATE_EXPENSE = /* GraphQL */ `
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      id
    }
  }
`;

const ExpenseNew = () => {
  const navigate = useNavigate();

  const createExpense = async (expense: NewExpense) => {
    await graphqlRequest(CREATE_EXPENSE, { input: expense });
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

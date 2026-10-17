import { useNavigate } from "react-router";
import ExpenseAdd from "../../components/ExpenseAdd";
import type { NewExpense } from "../../types/Expense";

const ExpenseNew = () => {
  const navigate = useNavigate();

  const createExpense = async (expense: NewExpense) => {
    // STUB : on ne parle pas encore au backend. L'Exercice 6 remplacera ce
    // console.log par une mutation GraphQL.
    console.log("Expense to create (not sent to the backend yet):", expense);

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
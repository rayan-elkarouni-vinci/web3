import ExpenseAdd from "../../components/ExpenseAdd";
import useExpenses from "../../hooks/useExpenses";

const ExpenseNew = () => {
  const { addExpense } = useExpenses();

  return (
    <>
      <h2>New expense</h2>

      <ExpenseAdd addExpense={addExpense} />
    </>
  );
};

export default ExpenseNew;


import express from "express";
import { parseExpenseFilter, type NewExpense } from "../types/expense.ts";
import { ExpensesService } from "../services/expenses.service.ts";
import { isValidNewExpense } from "../guards/expenses.guard.ts";

const expensesRouter = express.Router();

expensesRouter.get("/", async (req, res) => {
  try {
    const filter = parseExpenseFilter(req.query);
    if (!filter) {
      return res.status(400).json({ error: "Invalid filter" });
    }
    const expenses = await ExpensesService.getExpenses(filter);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

expensesRouter.post("/",  async (req, res) => {
  try {
    const expenseInput: NewExpense = req.body;
    if (!isValidNewExpense(expenseInput)) {
      return res.status(400).json({ error: "Invalid expense" });
    }
    const expenseDB = await ExpensesService.addExpense(expenseInput);
    res.status(201).json(expenseDB);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/*
expensesRouter.post("/reset", (req, res) => {
  try {
    const expenses = ExpensesService.resetExpenses();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
*/

export default expensesRouter;
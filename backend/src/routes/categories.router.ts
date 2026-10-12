import express from "express";
import { CategoriesService } from "../services/categories.service.ts";

const categoriesRouter = express.Router();

categoriesRouter.get("/", async (req, res) => {
  try {
    res.json(await CategoriesService.getCategories());
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default categoriesRouter;

import express from "express";
import { UsersService } from "../services/users.service.ts";

const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  try {
    res.json(await UsersService.getUsers());
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default usersRouter;

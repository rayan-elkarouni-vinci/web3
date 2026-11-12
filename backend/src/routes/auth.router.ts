import { Router, type Request, type Response } from "express";
import { AuthService } from "../services/auth.service.ts";
import {
  authResponseFromUser,
  parseLoginInput,
  parseRegisterInput,
} from "../types/auth.ts";
import type { AuthResponse } from "../types/auth.ts";
import { AppError } from "../errors/app.error.ts";

const authRouter = Router();

authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const input = parseRegisterInput(req.body);
    if (input === false) {
      return res.status(400).json({ error: "Invalid registration details" });
    }

    const user = await AuthService.register(input);
    const authResponse: AuthResponse = authResponseFromUser(user);
    res.status(201).json(authResponse);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const input = parseLoginInput(req.body);
    if (input === false) {
      // Deliberately not "that email is not valid": a login endpoint should not
      // explain to a stranger which half of their guess was wrong.
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = await AuthService.login(input);
    const authResponse: AuthResponse = authResponseFromUser(user);
    res.status(200).json(authResponse);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

export default authRouter;

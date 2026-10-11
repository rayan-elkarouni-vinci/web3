import { db } from "../prisma/db.ts";

export class UsersService {
  public static async getUsers() {
    try {
      return await db.orm.public.User.all();
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  }
}
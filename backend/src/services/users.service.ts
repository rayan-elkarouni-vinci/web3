import { db } from "../prisma/db.ts";
import { userFromDBO } from "../types/user.ts";

export class UsersService {
  public static async getUsers() {
    try {
      const rows = await db.orm.public.User.all();
      return rows.map(userFromDBO);
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  }

  public static async getById(id: number) {
    try {
      const row = await db.orm.public.User.where({ id }).first();
      return row ? userFromDBO(row) : null;
    } catch (error) {
      console.error("Error getting user by id:", error);
      throw error;
    }
  }
}

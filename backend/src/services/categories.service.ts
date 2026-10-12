import { db } from "../prisma/db.ts";

export class CategoriesService {
  
    public static async getCategories() {
    try {
      return await db.orm.public.Category.all();
    } catch (error) {
      console.error("Error getting categories:", error);
      throw error;
    }
  }
}

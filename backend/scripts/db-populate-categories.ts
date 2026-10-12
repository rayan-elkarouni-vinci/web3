import { db } from "../src/prisma/db.ts";

const categories = [
  { name: "Food", colour: "#E67E22" },
  { name: "Transport", colour: "#3498DB" },
  { name: "Housing", colour: "#9B59B6" },
  { name: "Leisure", colour: "#2ECC71" },
];

async function seedCategories() {
  console.log("Populating categories (existing data is kept)...");

  for (const category of categories) {
    await db.orm.public.Category.upsert({
      create: category,
      update: { colour: category.colour },
      conflictOn: { name: category.name },
    });
  }

  console.log("...Done!");
}

seedCategories()
  .then(() => db.close())
  .catch(async (e) => {
    console.error(e);
    await db.close();
    process.exit(1);
  });

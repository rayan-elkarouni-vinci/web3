import { db } from './src/prisma/db.ts';

async function main() {
  const defaultExpenses = [
    { date: "2025-01-16T00:00:00.000Z", description: "Example expense #1 from Alice", payer: "Alice", amount: 25.5 },
    { date: "2025-01-15T00:00:00.000Z", description: "Example expense #2 from Bob", payer: "Bob", amount: 35 },
    { date: "2025-01-15T00:00:00.000Z", description: "Example expense #3 from Alice", payer: "Alice", amount: 2 }
  ];

  console.log("Injection des données en cours...");

  for (const exp of defaultExpenses) {
    await db.orm.public.Expense.create(exp);
  }

  console.log("Base de données peuplée avec succès !");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

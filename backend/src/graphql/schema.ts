import { createSchema } from "graphql-yoga";
import { ExpensesService } from "../services/expenses.service.ts";
import { UsersService } from "../services/users.service.ts";
import { CategoriesService } from "../services/categories.service.ts";
import { isValidNewExpense } from "../guards/expenses.guard.ts";
import type { GraphQLContext } from "../types/GraphQLContext.ts";
import { requireAuth } from "./authHelpers.ts";
import { AuthorizationError, NotFoundError, ValidationError } from '../errors/app.error.ts';

export const schema = createSchema<GraphQLContext>({
  typeDefs: /* GraphQL */ `
    type User {
      id: Int!
      name: String!
      email: String!
      bankAccount: String

      # Les dépenses que cet utilisateur a payées ou auxquelles il a participé.
      expenses(filter: ExpenseFilter): [Expense!]!
    }

    type Category {
      id: Int!
      name: String!
      colour: String!
    }

    type Expense {
      id: Int!
      description: String!
      amount: Float!
      date: String!
      payer: User!
      participants: [User!]!
      category: Category
    }

    input ExpenseFilter {
      amount: Float
      payerId: Int
      categoryId: Int
    }

    type Query {
      me: User
      expenses(filter: ExpenseFilter): [Expense!]!
      expense(id: Int!): Expense
      users: [User!]!
      categories: [Category!]!
    }

    input CreateExpenseInput {
      description: String!
      amount: Float!
      date: String!
      payerId: Int!
      participants: [Int!]!
      categoryId: Int!
    }

    type Mutation {
      createExpense(input: CreateExpenseInput!): Expense!
    }
  `,
  resolvers: {
    User: {
      expenses: (user, args, ctx) => {
        const current = requireAuth(ctx);
        if (user.id !== current.userId) {
          throw new AuthorizationError('You can only see your own expenses');
        }
        return ExpensesService.getExpensesOfUser(user.id, args.filter ?? {});
      },
    },
    Query: {
      me: (_parent, _args, ctx) =>
        ctx.userJWT ? UsersService.getById(ctx.userJWT.userId) : null,

      expenses: (_parent, args, ctx) => {
        requireAuth(ctx);
        return ExpensesService.getExpenses(args.filter ?? {});
      },

      expense: async (_parent, args, ctx) => {
        const user = requireAuth(ctx);

        const expense = await ExpensesService.getExpenseById(args.id);
        if (!expense) {
          throw new NotFoundError('Expense not found');
        }

        // L'utilisateur est-il concerné (payeur ou participant) ?
        const isInvolved =
          expense.payer?.id === user.userId ||
          expense.participants.some((p) => p.id === user.userId);

        if (!isInvolved) {
          throw new AuthorizationError("You don't have permission to view this expense");
        }

        return expense;
      },

      users: (_parent, _args, ctx) => {
        requireAuth(ctx);
        return UsersService.getUsers();
      },

      categories: (_parent, _args, ctx) => {
        requireAuth(ctx);
        return CategoriesService.getCategories();
      },
    },
    Mutation: {
      createExpense: (_parent, args, ctx) => {
        const user = requireAuth(ctx);

        // On ne peut créer que les dépenses qu'on a payées soi-même
        if (user.userId !== args.input.payerId) {
          throw new AuthorizationError('You can only create expenses that you paid for');
        }

        if (!isValidNewExpense(args.input)) {
          throw new ValidationError('Invalid expense');
        }
        return ExpensesService.addExpense(args.input);
      },
    },
  },
});

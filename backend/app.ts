import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import expensesRouter from './src/routes/expenses.router.ts';
import usersRouter from './src/routes/users.router.ts';
import categoriesRouter from './src/routes/categories.router.ts';
import { createYoga } from 'graphql-yoga';
import { schema } from './src/graphql/schema.ts';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors({ origin: [/localhost/, /\.onrender\.com$/] }));

app.get('/ping', (req, res) => {
  res.sendStatus(204);
});

app.use('/api/expenses', expensesRouter);
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  cors: false,
  maskedErrors: process.env.NODE_ENV === 'production',
});
app.use(yoga.graphqlEndpoint, yoga);

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});

export default app;

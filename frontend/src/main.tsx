import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './pages/Layout.tsx';
import Welcome from './pages/Welcome.tsx';
import ExpenseList from './pages/expenses/ExpenseList.tsx';
import ExpenseNew from './pages/expenses/ExpenseNew.tsx';
import ExpenseShow from './pages/expenses/ExpenseShow.tsx';
import { expenseListLoader } from './pages/expenses/ExpenseList.loader.ts';
import { expenseShowLoader } from './pages/expenses/ExpenseShow.loader.ts';
import Login from './pages/auth/Login.tsx';
import { requireAuth } from './lib/requireAuth.ts';

const router = createBrowserRouter([
  {
    // No path here: a layout route only exists to wrap its children.
    Component: Layout,
    children: [
      { index: true, Component: Welcome },
      // La connexion reste ouverte : un visiteur déconnecté doit pouvoir atteindre une page.
      { path: 'login', Component: Login },
      {
        // Tout ce qui est rangé ici exige un compte. Le middleware s'exécute
        // avant tous ces loaders : un visiteur déconnecté ne les atteint jamais.
        middleware: [requireAuth],
        children: [
          { path: 'expenses', Component: ExpenseList, loader: expenseListLoader },
          { path: 'expenses/new', Component: ExpenseNew },
          { path: 'expenses/:id', Component: ExpenseShow, loader: expenseShowLoader },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);

import { redirect, type MiddlewareFunction } from 'react-router';

import { getToken } from './token';

export const requireAuth: MiddlewareFunction = ({ request }) => {
  if (!getToken()) {
    // Retenir où la personne voulait aller, pour l'y renvoyer après la connexion.
    const from = new URL(request.url).pathname;
    // Lancé, pas renvoyé : on abandonne cette navigation pour en commencer une autre.
    throw redirect(`/login?from=${encodeURIComponent(from)}`);
  }
};

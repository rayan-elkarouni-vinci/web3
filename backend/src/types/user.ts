export interface User {
  id: number;
  name: string;
  email: string;
  bankAccount: string | null;
}

// Transforme une ligne de la base en User : on recopie les champs UN PAR UN,
// donc passwordHash ne sort jamais d'ici.
export function userFromDBO(dbo: {
  id: number;
  name: string;
  email: string;
  bankAccount: string | null;
}): User {
  return {
    id: dbo.id,
    name: dbo.name,
    email: dbo.email,
    bankAccount: dbo.bankAccount,
  };
}

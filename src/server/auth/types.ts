export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

export type AuthContextUser = AuthUser | null;

export type AuthSession = {
  user: AuthUser;
};
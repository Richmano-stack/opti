/** Stable auth context shape consumed by tRPC (Task 3.B contract). */
export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

export type AuthContextUser = AuthUser | null;

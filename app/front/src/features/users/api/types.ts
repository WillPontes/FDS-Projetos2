export type User = {
  id: number;
  name: string;
  email: string;
};

export type ListUsersParams = Record<string, never>;

export type ListUsersResponse = User[];

import { fetchUsers } from "../api/auth.api";
import { User } from "../types/user";

export const loginService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User> => {
  console.log("LOGIN TRY:", email);

  const users = await fetchUsers();
  console.log("USERS FROM API:", users);

  const user = users.find(
    (u: any) => u.email === email && u.password === password,
  );

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return user;
};

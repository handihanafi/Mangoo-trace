import { API_URL } from "../config/env";

export const fetchUsers = async () => {
  console.log("FETCH USERS:", `${API_URL}/users`);

  const controller = new AbortController();
  setTimeout(() => controller.abort(), 5000); // ⬅️ anti hang

  const res = await fetch(`${API_URL}/users`, {
    signal: controller.signal,
  });

  if (!res.ok) {
    throw new Error("FAILED_FETCH");
  }

  return res.json();
};

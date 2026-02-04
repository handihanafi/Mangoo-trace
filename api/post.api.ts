import { API_URL } from "../config/env";

export const fetchPosts = async () => {
  const res = await fetch(`${API_URL}/posts`);
  if (!res.ok) throw new Error("FAILED_FETCH_POSTS");
  return res.json();
};

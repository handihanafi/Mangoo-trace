import { Post } from "@/types/post";
import { API_URL } from "../config/env";

/**
 * GET all posts
 */
export const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch(`${API_URL}/posts`);
  if (!res.ok) throw new Error("FAILED_FETCH_POSTS");
  return res.json();
};

/**
 * PATCH update post by id
 * json-server friendly
 */
export const updatePost = async (
  id: string,
  payload: Partial<Post>,
): Promise<Post> => {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("FAILED_UPDATE_POST");
  return res.json();
};

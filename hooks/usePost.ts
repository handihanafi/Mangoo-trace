import { fetchPosts } from "@/api/post.api";
import { Post } from "@/types/post";
import useSWR from "swr";

export function usePost(id?: string) {
  const { data, error, isLoading } = useSWR<Post[]>(
    id ? "/posts" : null,
    fetchPosts
  );

  return {
    post: data?.find((p) => String(p.id) === id),
    isLoading,
    isError: !!error,
  };
}
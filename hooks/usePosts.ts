import { fetchPosts, updatePost } from "@/api/post.api";
import { Post } from "@/types/post";
import useSWR from "swr";

export function usePosts() {
  const { data, error, isLoading, mutate } = useSWR<Post[]>(
    "/posts",
    fetchPosts,
    { revalidateOnFocus: false }
  );

  const editPost = async (id: string, payload: Partial<Post>) => {
    // optimistic update (optional bisa ditambah)
    await updatePost(id, payload);

    // revalidate list
    mutate();
  };

  return {
    posts: data ?? [],
    loading: isLoading,
    isError: !!error,
    refresh: mutate,
    editPost,
  };
}

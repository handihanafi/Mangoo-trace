import { fetchPosts } from "@/api/post.api";
import { Post } from "@/types/post";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts().then((posts) => {
      setPost(posts.find((p: Post) => p.id === id));
    });
  }, [id]);

  if (!post) return null;

  const { body } = post;

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>{post.title}</Text>

      <Text>👨‍🌾 Petani: {body.petani}</Text>
      <Text>🏢 Koperasi: {body.koperasi}</Text>
      <Text>🚚 Pengepul: {body.pengepul}</Text>
      <Text>🏪 Retail: {body.retail}</Text>
      <Text>📍 Lokasi: {body.lokasi}</Text>
      <Text>📅 Panen: {body.tanggal_panen}</Text>

      <Text style={{ marginTop: 12, fontWeight: "600" }}>
        Pupuk & Pestisida:
      </Text>
      {body.pupuk_pestisida.map((p, i) => (
        <Text key={i}>• {p}</Text>
      ))}
    </View>
  );
}

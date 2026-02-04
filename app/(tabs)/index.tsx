import { fetchPosts } from "@/api/post.api";
import EmptyState from "@/components/empty-state";
import { PostSkeleton } from "@/components/post-skeleton";
import { useAuthStore } from "@/store/auth.store";
import { Post } from "@/types/post";
import { getInitials } from "@/utils/string";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


export default function HomeTab() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const user = useAuthStore((state) => state.user);
  const initials = getInitials(user?.name);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.body.petani.toLowerCase().includes(search.toLowerCase()),
  );

  const loadPosts = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts().then(setPosts).catch(console.log);
    loadPosts();
  }, []);

  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/(posts)/[id]",
          params: { id: String(item.id) },
        })
      }
      style={{
        marginBottom: 14,
      }}
    >
      <View
        style={{
          backgroundColor: "#ffffff",
          // borderRadius: 16,
          padding: 16,
          // borderWidth: 1,
          borderColor: "#e5e7eb",

          // iOS shadow
          shadowColor: "#000",
          shadowOpacity: 0.04,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },

          // Android shadow
          elevation: 2,
        }}
      >
        {/* TITLE */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 6,
            color: "#0f172a",
          }}
        >
          {item.title}
        </Text>

        {/* SUBTITLE */}
        <Text style={{ color: "#475569", fontSize: 14 }}>
          👨‍🌾 {item.body.petani}
        </Text>

        {/* META ROW */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            justifyContent: "space-between",
          }}
        >
          {/* LOCATION CHIP */}
          <View
            style={{
              backgroundColor: "#f1f5f9",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
            }}
          >
            <Text style={{ fontSize: 12, color: "#334155" }}>
              📍 {item.body.lokasi}
            </Text>
          </View>

          {/* DATE */}
          <Text
            style={{
              fontSize: 12,
              color: "#2563eb",
              fontWeight: "600",
            }}
          >
            {item.body.tanggal_panen}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#ffffff", "#f8fafc"]} style={{ flex: 1 }}>
      {/* HEADER */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 56,
          paddingBottom: 32,
          backgroundColor: "#1e293b",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* AVATAR */}
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: "#2563eb",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 16,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              fontWeight: "700",
            }}
          >
            {initials}
          </Text>
        </View>

        {/* HEADER TEXT */}
        <View>
          <Text
            style={{
              color: "#cbd5f5",
              fontSize: 14,
              marginBottom: 2,
            }}
          >
            Welcome 👋
          </Text>

          <Text
            style={{
              color: "#ffffff",
              fontSize: 22,
              fontWeight: "700",
            }}
          >
            {user?.name ?? "User"}
          </Text>

          <Text
            style={{
              marginTop: 4,
              color: "#94a3b8",
              fontSize: 12,
            }}
          >
            Role: {user?.role ?? "-"}
          </Text>
        </View>
      </View>

      {/* CONTENT */}
      <View style={{ flex: 1, padding: 16 }}>
        {/* SEARCH */}
        {/* <TextInput
          placeholder="Search kebun / petani..."
          value={search}
          onChangeText={setSearch}
          style={{
            height: 48,
            backgroundColor: "#fff",
            paddingHorizontal: 16,
            marginBottom: 16,

            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: "#e5e7eb",

            // iOS shadow
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },

            // Android shadow
            elevation: 2,
          }}
        /> */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            marginBottom: 16,

            // iOS shadow
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },

            // Android shadow
            elevation: 2,
          }}
        >
          {/* SEARCH INPUT */}
          <TextInput
            placeholder="Search kebun / petani..."
            value={search}
            onChangeText={setSearch}
            style={{
              flex: 1,
              height: 48,
              paddingHorizontal: 16,
              fontSize: 14,
              color: "#0f172a",
            }}
          />

          {/* FILTER BUTTON */}
          <TouchableOpacity
            onPress={() => {
              console.log("Open filter");
              // nanti bisa buka bottom sheet / modal
            }}
            style={{
              width: 48,
              height: 48,
              justifyContent: "center",
              alignItems: "center",
              borderLeftWidth: 1,
              borderLeftColor: "#e5e7eb",
            }}
          >
            <Search size={18} color="#334155" />
          </TouchableOpacity>
        </View>

        {/* TABLE / LIST */}
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadPosts();
            }}
            ListEmptyComponent={
              <EmptyState
                title="Data tidak ditemukan"
                description="Coba kata kunci lain"
                icon="🌱"
              />
            }
          />
        )}
      </View>

      {/* FAB ADD */}
      <TouchableOpacity
        onPress={() => alert("Add pressed")}
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#2563eb",
          justifyContent: "center",
          alignItems: "center",
          elevation: 6,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 28, lineHeight: 32 }}>+</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

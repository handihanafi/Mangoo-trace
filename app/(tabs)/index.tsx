import { fetchPosts } from "@/api/post.api";
import { PostSkeleton } from "@/components/post-skeleton";
import { useAuthStore } from "@/store/auth.store";
import { Post } from "@/types/post";
import { getInitials } from "@/utils/string";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, Text, TouchableOpacity, View } from "react-native";

export default function HomeTab() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useAuthStore((state) => state.user);
  const initials = getInitials(user?.name);

  // Header animation
  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    // animate header
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // load data
    (async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const latestPosts = [...posts]
    .sort(
      (a, b) =>
        new Date(b.body.tanggal_panen).getTime() -
        new Date(a.body.tanggal_panen).getTime(),
    )
    .slice(0, 5);

  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/(posts)/[id]",
          params: { id: String(item.id) },
        })
      }
      style={{ marginBottom: 14 }}
    >
      <View
        style={{
          backgroundColor: "#ffffff",
          padding: 16,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#e5e7eb",

          shadowColor: "#000",
          shadowOpacity: 0.04,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      >
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

        <Text style={{ color: "#54575e", fontSize: 14 }}>
          👨‍🌾 {item.body.petani}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 12, color: "#54575e" }}>
            📍 {item.body.lokasi}
          </Text>

          <Text style={{ fontSize: 12, color: "#54575e", fontWeight: "600" }}>
            {item.body.tanggal_panen}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["rgba(161, 187, 243, 0.25)", "#ffffff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* HEADER */}
      <Animated.View
        style={{
          opacity: fade,
          transform: [{ translateY }],
          paddingTop: 56,
          paddingHorizontal: 16,
          paddingBottom: 8,
        }}
      >
        <BlurView intensity={30} tint="light" style={{ borderRadius: 20 }}>
          <View
            style={{
              padding: 20,
              flexDirection: "row",
              alignItems: "center",

              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 4,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "#2563eb",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 14,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 18 }}>
                {initials}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, color: "#475569" }}>
                Welcome back
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#0f172a",
                }}
                numberOfLines={1}
              >
                {user?.name ?? "User"}
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.6)",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: "#334155",
                  textTransform: "uppercase",
                }}
              >
                {user?.role}
              </Text>
            </View>
          </View>
        </BlurView>
      </Animated.View>

      {/* CONTENT */}
      <View style={{ flex: 1, padding: 16 }}>
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: "#0f172a" }}
              >
                Kebun Terbaru
              </Text>

              <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
                <Text style={{ color: "#2563eb", fontWeight: "600" }}>
                  Lihat semua →
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={latestPosts}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
              scrollEnabled={false}
            />
          </>
        )}
      </View>

      {/* FAB */}
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

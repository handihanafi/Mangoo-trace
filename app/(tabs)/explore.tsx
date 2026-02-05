import { fetchPosts } from "@/api/post.api";
import EmptyState from "@/components/empty-state";
import { PostSkeleton } from "@/components/post-skeleton";
import { Post } from "@/types/post";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SlidersHorizontal } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ExploreTab() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // filter state
  const [showFilter, setShowFilter] = useState(false);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  // picker state (PENTING)
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

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
    loadPosts();
  }, []);

  // SEARCH + DATE FILTER
  const filtered = posts.filter((p) => {
    const keyword =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.body.petani.toLowerCase().includes(search.toLowerCase());

    const postDate = new Date(p.body.tanggal_panen).getTime();
    const fromOk = fromDate ? postDate >= fromDate.getTime() : true;
    const toOk = toDate ? postDate <= toDate.getTime() : true;

    return keyword && fromOk && toOk;
  });

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
          backgroundColor: "#fff",
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          shadowColor: "#000",
          shadowOpacity: 0.04,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "700" }}>{item.title}</Text>

        <Text style={{ marginTop: 4, color: "#54575e" }}>
          👨‍🌾 {item.body.petani}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 6,
          }}
        >
          <Text style={{ fontSize: 12, color: "#54575e" }}>
            📍 {item.body.lokasi}
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: "#54575e",
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
    <>
      {/* ===== MAIN UI ===== */}
      <LinearGradient colors={["#f8fafc", "#ffffff"]} style={{ flex: 1 }}>
        {/* SEARCH HEADER */}
        <View
          style={{
            paddingTop: 56,
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#e5e7eb",
            }}
          >
            <TextInput
              placeholder="Search kebun / petani..."
              value={search}
              onChangeText={setSearch}
              style={{
                flex: 1,
                height: 48,
                paddingHorizontal: 16,
              }}
            />

            <TouchableOpacity
              onPress={() => setShowFilter(true)}
              style={{
                width: 48,
                height: 48,
                justifyContent: "center",
                alignItems: "center",
                borderLeftWidth: 1,
                borderLeftColor: "#e5e7eb",
              }}
            >
              <SlidersHorizontal size={18} color="#334155" />
            </TouchableOpacity>
          </View>
        </View>

        {/* LIST */}
        <View style={{ flex: 1, padding: 16 }}>
          {loading ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadPosts();
              }}
              ListEmptyComponent={
                <EmptyState
                  title="Data tidak ditemukan"
                  description="Coba ubah filter atau kata kunci"
                  icon="🌱"
                />
              }
            />
          )}
        </View>

        {/* FILTER DATE BOTTOM SHEET */}
        {showFilter && (
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#fff",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
              Filter Tanggal
            </Text>

            <Text style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
              Dari tanggal
            </Text>

            <TouchableOpacity
              onPress={() => setShowFromPicker(true)}
              style={{
                padding: 14,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                marginBottom: 12,
              }}
            >
              <Text>
                {fromDate
                  ? fromDate.toLocaleDateString("id-ID")
                  : "Pilih tanggal"}
              </Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
              Sampai tanggal
            </Text>

            <TouchableOpacity
              onPress={() => setShowToPicker(true)}
              style={{
                padding: 14,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#e5e7eb",
              }}
            >
              <Text>
                {toDate ? toDate.toLocaleDateString("id-ID") : "Pilih tanggal"}
              </Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => {
                  setFromDate(null);
                  setToDate(null);
                }}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  marginRight: 8,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "600" }}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowFilter(false)}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 12,
                  backgroundColor: "#2563eb",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </LinearGradient>

      {/* ===== DATE PICKERS (HARUS DI LUAR) ===== */}
      {showFromPicker && (
        <DateTimePicker
          value={fromDate ?? new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, date) => {
            setShowFromPicker(false);
            if (date) setFromDate(date);
          }}
        />
      )}

      {showToPicker && (
        <DateTimePicker
          value={toDate ?? new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, date) => {
            setShowToPicker(false);
            if (date) setToDate(date);
          }}
        />
      )}
    </>
  );
}

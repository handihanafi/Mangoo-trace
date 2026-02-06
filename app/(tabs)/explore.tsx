import EmptyState from "@/components/empty-state";
import { PostSkeleton } from "@/components/post-skeleton";
import { usePosts } from "@/hooks/usePosts";
import { Post } from "@/types/post";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pencil, SlidersHorizontal } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ExploreTab() {
  const { posts, loading, editPost, refresh } = usePosts();

  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // filter
  const [showFilter, setShowFilter] = useState(false);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // edit
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // FILTERED DATA
  const filtered = posts.filter((p) => {
    const keyword =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.body.petani.toLowerCase().includes(search.toLowerCase());

    const postDate = new Date(p.body.tanggal_panen).getTime();
    const fromOk = fromDate ? postDate >= fromDate.getTime() : true;
    const toOk = toDate ? postDate <= toDate.getTime() : true;

    return keyword && fromOk && toOk;
  });

  // RENDER LIST ITEM
  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push(`/(tabs)/(posts)/${item.id}?source=explore`)}
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
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 16, fontWeight: "700" }}>{item.title}</Text>

          <TouchableOpacity onPress={() => setEditingPost(item)}>
            <Pencil size={16} color="#2563eb" />
          </TouchableOpacity>
        </View>

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

          <Text style={{ fontSize: 12, fontWeight: "600", color: "#54575e" }}>
            {item.body.tanggal_panen}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      {/* ===== MAIN UI ===== */}
      <LinearGradient
        colors={["rgba(161, 187, 243, 0.25)", "#ffffff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* SEARCH */}
        <View style={{ paddingTop: 56, paddingHorizontal: 16 }}>
          <View
            style={{
              flexDirection: "row",
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
              style={{ flex: 1, height: 48, paddingHorizontal: 16 }}
            />

            <TouchableOpacity
              onPress={() => setShowFilter(true)}
              style={{
                width: 48,
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
              keyExtractor={(i) => String(i.id)}
              renderItem={renderItem}
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await refresh();
                setRefreshing(false);
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
      </LinearGradient>

      {/* ===== FILTER DATE SHEET ===== */}
      {showFilter && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
            Filter Tanggal
          </Text>

          <TouchableOpacity onPress={() => setShowFromPicker(true)}>
            <Text>📅 Dari: {fromDate?.toLocaleDateString() ?? "-"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowToPicker(true)}
            style={{ marginTop: 12 }}
          >
            <Text>📅 Sampai: {toDate?.toLocaleDateString() ?? "-"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowFilter(false)}
            style={{
              marginTop: 20,
              backgroundColor: "#2563eb",
              padding: 14,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Apply</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ===== EDIT FULL POST ===== */}
      {editingPost && (
        <View
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <View
            style={{
              marginTop: 80,
              backgroundColor: "#fff",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
              flex: 1,
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}
              >
                Edit Data Kebun
              </Text>

              {(
                [
                  ["Judul", "title"],
                  ["Petani", "petani"],
                  ["Pengepul", "pengepul"],
                  ["Koperasi", "koperasi"],
                  ["Retail", "retail"],
                  ["Lokasi", "lokasi"],
                  ["Nama Kebun", "nama_kebun"],
                  ["Tanggal Panen", "tanggal_panen"],
                ] as const
              ).map(([label, key]) => (
                <View key={key} style={{ marginBottom: 10 }}>
                  <Text style={{ fontSize: 12, color: "#64748b" }}>
                    {label}
                  </Text>
                  <TextInput
                    value={
                      key === "title"
                        ? editingPost.title
                        : (editingPost.body as any)[key]
                    }
                    onChangeText={(v) =>
                      setEditingPost({
                        ...editingPost,
                        ...(key === "title"
                          ? { title: v }
                          : { body: { ...editingPost.body, [key]: v } }),
                      })
                    }
                    style={{
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      borderRadius: 10,
                      padding: 12,
                    }}
                  />
                </View>
              ))}

              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <TouchableOpacity
                  onPress={() => setEditingPost(null)}
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
                  <Text style={{ fontWeight: "600" }}>Batal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={async () => {
                    await editPost(editingPost.id, {
                      title: editingPost.title,
                      body: editingPost.body,
                    });
                    setEditingPost(null);
                  }}
                  style={{
                    flex: 1,
                    padding: 14,
                    borderRadius: 12,
                    backgroundColor: "#2563eb",
                    alignItems: "center",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>
                    {loading ? "Menyimpan..." : "Simpan"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {/* DATE PICKERS */}
      {Platform.OS !== "web" && showFromPicker && (
        <DateTimePicker
          value={fromDate ?? new Date()}
          mode="date"
          onChange={(_, d) => {
            setShowFromPicker(false);
            if (d) setFromDate(d);
          }}
        />
      )}

      {Platform.OS !== "web" && showToPicker && (
        <DateTimePicker
          value={toDate ?? new Date()}
          mode="date"
          onChange={(_, d) => {
            setShowToPicker(false);
            if (d) setToDate(d);
          }}
        />
      )}
    </>
  );
}

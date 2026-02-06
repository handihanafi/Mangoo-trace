import { fetchPosts } from "@/api/post.api";
import { Post } from "@/types/post";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, MapPin, Share2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Linking,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function PostDetail() {
  const [post, setPost] = useState<Post | null>(null);

  const { id, source } = useLocalSearchParams<{
    id: string;
    source?: "home" | "explore";
  }>();

  useEffect(() => {
    fetchPosts().then((posts) => {
      setPost(posts.find((p) => String(p.id) === String(id)) ?? null);
    });
  }, [id]);

  if (!post) return null;

  const { body } = post;

  const openMap = () => {
    const query = encodeURIComponent(body.lokasi);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
  };

  const sharePost = async () => {
    await Share.share({
      message: `🌱 ${post.title}

      Petani: ${body.petani}
      Lokasi: ${body.lokasi}
      Tanggal Panen: ${body.tanggal_panen}

      ID Traceability: ${post.id}
      `,
    });
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 40,
        backgroundColor: "#f8fafc",
      }}
    >
      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => {
          if (source === "explore") {
            router.replace("/(tabs)/explore");
          } else {
            router.replace("/(tabs)/");
          }
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <ArrowLeft size={18} color="#2563eb" />
        <Text style={{ marginLeft: 6, color: "#2563eb", fontWeight: "600" }}>
          Kembali
        </Text>
      </TouchableOpacity>

      {/* HEADER CARD */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 20,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "800",
            color: "#0f172a",
            marginBottom: 6,
          }}
        >
          {post.title}
        </Text>

        <Text style={{ color: "#64748b", fontSize: 14 }}>
          ID Traceability: #{post.id}
        </Text>
      </View>

      {/* INFO KEBUN */}
      <Section title="Informasi Kebun">
        <Item label="Nama Kebun" value={body.nama_kebun} />
        <Item label="Petani" value={body.petani} />
        <Item label="Tanggal Panen" value={body.tanggal_panen} />

        {/* MAP LOCATION */}
        <TouchableOpacity
          onPress={openMap}
          style={{
            marginTop: 10,
            padding: 12,
            borderRadius: 12,
            backgroundColor: "#eff6ff",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MapPin size={16} color="#2563eb" />
          <Text
            style={{
              marginLeft: 8,
              color: "#2563eb",
              fontWeight: "600",
            }}
          >
            {body.lokasi}
          </Text>
        </TouchableOpacity>
      </Section>

      {/* DISTRIBUSI */}
      <Section title="Distribusi">
        <Item label="Pengepul" value={body.pengepul} />
        <Item label="Koperasi" value={body.koperasi} />
        <Item label="Retail" value={body.retail} />
      </Section>

      {/* PUPUK */}
      <Section title="Pupuk & Pestisida">
        {body.pupuk_pestisida.map((p, i) => (
          <Text key={i} style={{ marginBottom: 4 }}>
            • {p}
          </Text>
        ))}
      </Section>

      {/* QR CODE */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 20,
          marginTop: 16,
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "700", marginBottom: 12 }}>
          QR Code Traceability
        </Text>

        <QRCode
          value={`TRACEABILITY_POST_${post.id}`}
          size={160}
          backgroundColor="white"
        />

        <Text
          style={{
            marginTop: 10,
            fontSize: 12,
            color: "#64748b",
          }}
        >
          Scan untuk verifikasi data kebun
        </Text>
      </View>

      {/* ACTION BUTTON */}
      <TouchableOpacity
        onPress={sharePost}
        style={{
          marginTop: 20,
          backgroundColor: "#2563eb",
          padding: 14,
          borderRadius: 14,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Share2 size={16} color="#fff" />
        <Text
          style={{
            color: "#fff",
            fontWeight: "700",
            marginLeft: 8,
          }}
        >
          Share Data
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================== */
/* REUSABLE COMPONENT */
/* ================== */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          marginBottom: 12,
          color: "#0f172a",
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
      }}
    >
      <Text style={{ color: "#64748b" }}>{label}</Text>
      <Text style={{ fontWeight: "600", color: "#0f172a" }}>{value}</Text>
    </View>
  );
}

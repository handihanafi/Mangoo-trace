import { API_URL } from "@/config/env";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AddPostModal() {
  const [loading, setLoading] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const [form, setForm] = useState({
    title: "",
    nama_kebun: "",
    petani: "",
    pengepul: "",
    koperasi: "",
    retail: "",
    lokasi: "",
    latitude: null as number | null,
    longitude: null as number | null,
    tanggal_panen: "",
    pupuk_pestisida: "",
  });

  const onChange = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          body: {
            petani: form.petani,
            pengepul: form.pengepul,
            koperasi: form.koperasi,
            retail: form.retail,
            lokasi: form.lokasi,
            latitude: form.latitude,
            longitude: form.longitude,
            nama_kebun: form.nama_kebun,
            tanggal_panen: form.tanggal_panen,
            pupuk_pestisida: form.pupuk_pestisida
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          },
        }),
      });

      router.back();
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, justifyContent: "flex-end" }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 20,
          maxHeight: "90%",
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: "#e5e7eb",
              alignSelf: "center",
              borderRadius: 2,
              marginBottom: 12,
            }}
          />

          <Text style={{ fontSize: 20, fontWeight: "800", marginBottom: 16 }}>
            Tambah Kebun
          </Text>

          {[
            ["Judul", "title"],
            ["Nama Kebun", "nama_kebun"],
            ["Petani", "petani"],
            ["Pengepul", "pengepul"],
            ["Koperasi", "koperasi"],
            ["Retail", "retail"],
          ].map(([label, key]) => (
            <Input
              key={key}
              label={label}
              value={(form as any)[key]}
              onChange={(v) => onChange(key, v)}
            />
          ))}

          {/* DATE PICKER */}
          <TouchableOpacity
            onPress={() => setShowDate(true)}
            style={{
              padding: 14,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#e5e7eb",
              marginBottom: 12,
            }}
          >
            <Text>{form.tanggal_panen || "📅 Pilih tanggal panen"}</Text>
          </TouchableOpacity>

          {/* MAP PICKER */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/modal/pick-location",
                params: {
                  onSelect: JSON.stringify(form),
                },
              })
            }
            style={{
              padding: 14,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#e5e7eb",
              marginBottom: 12,
            }}
          >
            <Text>📍 {form.lokasi || "Pilih lokasi dari peta"}</Text>
          </TouchableOpacity>

          <Input
            label="Pupuk & Pestisida (pisah koma)"
            value={form.pupuk_pestisida}
            onChange={(v) => onChange("pupuk_pestisida", v)}
          />

          {/* ACTION */}
          <TouchableOpacity
            onPress={submit}
            disabled={loading}
            style={{
              backgroundColor: "#2563eb",
              padding: 14,
              borderRadius: 14,
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {showDate && Platform.OS !== "web" && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          onChange={(_, d) => {
            setShowDate(false);
            if (d) onChange("tanggal_panen", d.toISOString().split("T")[0]);
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 12, color: "#64748b" }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={{
          borderWidth: 1,
          borderColor: "#e5e7eb",
          borderRadius: 12,
          padding: 12,
          marginTop: 4,
        }}
      />
    </View>
  );
}

import { View } from "react-native";

export function PostSkeleton() {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 14,
      }}
    >
      <View
        style={{
          height: 16,
          width: "60%",
          backgroundColor: "#e5e7eb",
          borderRadius: 6,
          marginBottom: 10,
        }}
      />
      <View
        style={{
          height: 12,
          width: "40%",
          backgroundColor: "#e5e7eb",
          borderRadius: 6,
        }}
      />
    </View>
  );
}

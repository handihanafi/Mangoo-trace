import React, { useEffect, useRef } from "react";
import { Animated, Text } from "react-native";

type Props = {
  title?: string;
  description?: string;
  icon?: string;
};

export default function EmptyState({
  title = "Data tidak ditemukan",
  description = "Coba kata kunci lain",
  icon = "🔍",
}: Props) {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        alignItems: "center",
        marginTop: 64,
        opacity,
        transform: [{ scale }],
      }}
    >
      <Text style={{ fontSize: 32 }}>{icon}</Text>
      <Text
        style={{
          marginTop: 12,
          fontSize: 16,
          fontWeight: "600",
          color: "#334155",
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          marginTop: 4,
          fontSize: 13,
          color: "#94a3b8",
        }}
      >
        {description}
      </Text>
    </Animated.View>
  );
}

import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { colors } from "../../theme/colors";

type Props = {
  title: string;
  loading?: boolean;
  onPress?: () => void;
};

export const Button = ({ title, loading, onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={loading}
      style={{
        height: 48,
        borderRadius: 12,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={{ color: "#fff", fontWeight: "600" }}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

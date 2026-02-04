import React from "react";
import { View } from "react-native";
import { colors } from "../../theme/colors";

export const Card = ({ children }: any) => {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 24,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
      }}
    >
      {children}
    </View>
  );
};

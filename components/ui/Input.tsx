import React from "react";
import { TextInput } from "react-native";
import { colors } from "../../theme/colors";

export const Input = (props: any) => {
  return (
    <TextInput
      {...props} // ⬅️ WAJIB
      placeholderTextColor="#94a3b8"
      style={{
        height: 48, // ⬅️ WAJIB
        borderRadius: 12,
        backgroundColor: colors.input,
        paddingHorizontal: 16,
        fontSize: 14,
        color: colors.text,
        marginBottom: 16,
      }}
    />
  );
};

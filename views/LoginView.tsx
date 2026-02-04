import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  onLogin: (email: string, password: string) => Promise<void> | void;
  error?: string;
};

export default function LoginView({ onLogin, error }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    await onLogin(email, password);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "#0f172a",
        justifyContent: "center",
        padding: 24,
      }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: "700", marginBottom: 8 }}>
          Welcome Back
        </Text>

        <Text style={{ color: "#64748b", marginBottom: 24 }}>
          Sign in to continue
        </Text>

        {/* EMAIL */}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={{
            height: 48,
            borderRadius: 12,
            backgroundColor: "#f1f5f9",
            paddingHorizontal: 16,
            marginBottom: 16,
          }}
        />

        {/* PASSWORD */}
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{
            height: 48,
            borderRadius: 12,
            backgroundColor: "#f1f5f9",
            paddingHorizontal: 16,
            marginBottom: 12,
          }}
        />

        {!!error && (
          <Text style={{ color: "#dc2626", marginBottom: 12 }}>{error}</Text>
        )}

        <TouchableOpacity
          onPress={submit}
          disabled={loading}
          style={{
            height: 48,
            borderRadius: 12,
            backgroundColor: "#2563eb",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "600" }}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

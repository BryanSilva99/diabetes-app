import { MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

type Props = {
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  onPress: () => void;
  colors: {
    primary: string;
    primaryDark: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
  };
};

export default function ActionButton({
  label,
  icon,
  loading = false,
  disabled = false,
  variant = "primary",
  onPress,
  colors,
}: Props) {
  const isPrimary = variant === "primary";
  const isGhost = variant === "ghost";
  const backgroundColor = isPrimary ? colors.primary : isGhost ? "transparent" : colors.surface;
  const foregroundColor = isPrimary ? "#ffffff" : isGhost ? colors.muted : colors.text;

  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor: isPrimary ? colors.primaryDark : colors.border,
          opacity: disabled || loading ? 0.72 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={foregroundColor} />
      ) : (
        <>
          {icon && <MaterialIcons name={icon} size={20} color={foregroundColor} />}
          <Text style={[styles.label, { color: foregroundColor }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    fontSize: 15,
    fontWeight: "800",
  },
});

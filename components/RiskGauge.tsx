import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import type { HealthTheme } from "../constants/health-theme";

type Props = {
  percent: number;
  label: string;
  color: string;
  theme: HealthTheme;
};

export default function RiskGauge({ percent, label, color, theme }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.circle, { borderColor: color, backgroundColor: theme.elevated }]}>
        <Text style={[styles.percent, { color: theme.text }]}>{percent}%</Text>
        <Text style={[styles.caption, { color }]}>riesgo</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: color }]}>
        <MaterialIcons name="health-and-safety" size={18} color="#ffffff" />
        <Text style={styles.badgeText}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: 14,
  },
  circle: {
    alignItems: "center",
    borderRadius: 86,
    borderWidth: 12,
    height: 172,
    justifyContent: "center",
    width: 172,
  },
  percent: {
    fontSize: 42,
    fontWeight: "900",
  },
  caption: {
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  badge: {
    alignItems: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
});

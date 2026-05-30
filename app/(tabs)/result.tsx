import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import ActionButton from "../../components/ActionButton";
import HealthCard from "../../components/HealthCard";
import RiskGauge from "../../components/RiskGauge";
import SwipeTabs from "../../components/SwipeTabs";
import { healthThemes } from "../../constants/health-theme";
import { usePrediction } from "../../contexts/PredictionContext";
import { estimateRiskPercent, getRiskPresentation } from "../../utils/risk";

export default function ResultScreen() {
  const scheme = useColorScheme();
  const theme = healthThemes[scheme === "dark" ? "dark" : "light"];
  const { latestPrediction } = usePrediction();

  if (!latestPrediction) {
    return (
      <SwipeTabs current="result">
        <ScrollView
          style={[styles.screen, { backgroundColor: theme.background }]}
          contentContainerStyle={styles.emptyContent}
        >
        <HealthCard theme={theme} style={styles.emptyCard}>
          <View style={[styles.emptyIcon, { backgroundColor: theme.primarySoft }]}>
            <MaterialIcons name="analytics" size={32} color={theme.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Aun no hay resultado</Text>
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            Completa la evaluacion para ver aqui el nivel de riesgo, porcentaje estimado y recomendaciones.
          </Text>
          <ActionButton
            label="Iniciar evaluacion"
            icon="monitor-heart"
            colors={theme}
            onPress={() => router.push("/")}
          />
        </HealthCard>
        </ScrollView>
      </SwipeTabs>
    );
  }

  const { payload, result, createdAt } = latestPrediction;
  const riskPercent = estimateRiskPercent(payload, result);
  const risk = getRiskPresentation(riskPercent, theme);
  const date = new Date(createdAt);

  return (
    <SwipeTabs current="result">
      <ScrollView
        style={[styles.screen, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      <View style={[styles.hero, { backgroundColor: theme.primaryDark }]}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.eyebrow}>Resultado</Text>
            <Text style={styles.heroTitle}>Tu evaluacion esta lista</Text>
          </View>
          <View style={[styles.heroIcon, { backgroundColor: theme.primary }]}>
            <MaterialIcons name="task-alt" size={28} color="#ffffff" />
          </View>
        </View>
        <Text style={styles.heroText}>
          Registro #{result.id} · {Number.isNaN(date.getTime()) ? "reciente" : date.toLocaleString()}
        </Text>
      </View>

      <HealthCard theme={theme} style={{ backgroundColor: risk.soft }}>
        <RiskGauge percent={riskPercent} label={risk.label} color={risk.color} theme={theme} />
        <Text style={[styles.resultTitle, { color: theme.text }]}>{risk.title}</Text>
        <Text style={[styles.resultText, { color: theme.muted }]}>{result.recommendation}</Text>
      </HealthCard>

      <View style={styles.metricsGrid}>
        <Metric label="Glucosa" value={payload.Glucose} unit="mg/dL" theme={theme} />
        <Metric label="BMI" value={payload.BMI} theme={theme} />
        <Metric label="Edad" value={payload.Age} unit="anos" theme={theme} />
        <Metric label="Presion" value={payload.BloodPressure} unit="mmHg" theme={theme} />
      </View>

      <HealthCard theme={theme}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recomendaciones</Text>
        <View style={styles.recommendationGrid}>
          <InfoTile
            icon="restaurant"
            title="Alimentacion"
            text="Prioriza fibra, agua, frutas enteras y porciones moderadas."
            color={risk.color}
            theme={theme}
          />
          <InfoTile
            icon="directions-walk"
            title="Actividad"
            text="Mantener movimiento regular ayuda al control metabolico."
            color={risk.color}
            theme={theme}
          />
          <InfoTile
            icon="medical-services"
            title="Seguimiento"
            text="Usa este resultado como orientacion, no como diagnostico medico."
            color={risk.color}
            theme={theme}
          />
        </View>
      </HealthCard>

      <View style={styles.actions}>
        <ActionButton
          label="Nueva evaluacion"
          icon="add-chart"
          colors={theme}
          onPress={() => router.push("/")}
        />
        <ActionButton
          label="Ver historial"
          icon="history"
          variant="secondary"
          colors={theme}
          onPress={() => router.push("/explore")}
        />
      </View>
      </ScrollView>
    </SwipeTabs>
  );
}

function Metric({
  label,
  value,
  unit,
  theme,
}: {
  label: string;
  value: number;
  unit?: string;
  theme: (typeof healthThemes)["light"];
}) {
  return (
    <HealthCard theme={theme} style={styles.metricCard}>
      <Text style={[styles.metricLabel, { color: theme.muted }]}>{label}</Text>
      <View style={styles.metricValueRow}>
        <Text style={[styles.metricValue, { color: theme.text }]}>{value}</Text>
        {unit && <Text style={[styles.metricUnit, { color: theme.subtle }]}>{unit}</Text>}
      </View>
    </HealthCard>
  );
}

function InfoTile({
  icon,
  title,
  text,
  color,
  theme,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  text: string;
  color: string;
  theme: (typeof healthThemes)["light"];
}) {
  return (
    <View style={[styles.infoTile, { backgroundColor: theme.elevated, borderColor: theme.border }]}>
      <View style={[styles.infoIcon, { backgroundColor: color }]}>
        <MaterialIcons name={icon} size={18} color="#ffffff" />
      </View>
      <View style={styles.infoCopy}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.infoText, { color: theme.muted }]}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: 16,
    padding: 18,
    paddingBottom: 34,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 18,
  },
  emptyCard: {
    alignItems: "center",
    gap: 14,
  },
  emptyIcon: {
    alignItems: "center",
    borderRadius: 22,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  hero: {
    borderRadius: 30,
    padding: 22,
  },
  heroTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    justifyContent: "space-between",
  },
  eyebrow: {
    color: "#bdf8ef",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#ffffff",
    flexShrink: 1,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36,
    marginTop: 3,
  },
  heroIcon: {
    alignItems: "center",
    borderRadius: 18,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  heroText: {
    color: "#d8fff7",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 14,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 30,
    marginTop: 16,
    textAlign: "center",
  },
  resultText: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: "center",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricCard: {
    flexGrow: 1,
    minWidth: "47%",
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "800",
  },
  metricValueRow: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: 5,
    marginTop: 5,
  },
  metricValue: {
    fontSize: 23,
    fontWeight: "900",
  },
  metricUnit: {
    fontSize: 11,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
  },
  recommendationGrid: {
    gap: 10,
    marginTop: 14,
  },
  infoTile: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 13,
  },
  infoIcon: {
    alignItems: "center",
    borderRadius: 14,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  infoCopy: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "900",
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  actions: {
    gap: 10,
  },
});

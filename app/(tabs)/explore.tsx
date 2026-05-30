import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import ActionButton from "../../components/ActionButton";
import HealthCard from "../../components/HealthCard";
import SwipeTabs from "../../components/SwipeTabs";
import { healthThemes } from "../../constants/health-theme";
import { api, getApiErrorInfo } from "../../services/api";

type PredictionHistoryItem = {
  id: number;
  pregnancies: number;
  glucose: number;
  blood_pressure: number;
  skin_thickness: number;
  insulin: number;
  bmi: number;
  diabetes_pedigree_function: number;
  age: number;
  prediction: number;
  risk: "alto" | "bajo";
  message: string;
  recommendation: string;
  created_at: string;
};

type PredictionHistoryResponse = {
  predictions: PredictionHistoryItem[];
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

export default function HistoryScreen() {
  const scheme = useColorScheme();
  const theme = healthThemes[scheme === "dark" ? "dark" : "light"];
  const [predictions, setPredictions] = useState<PredictionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const highRiskCount = useMemo(
    () => predictions.filter((item) => item.risk === "alto").length,
    [predictions],
  );

  const loadPredictions = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await api.get<PredictionHistoryResponse>("/predictions?limit=20");
      setPredictions(response.data.predictions);
    } catch (error) {
      console.log(error);
      const apiError = getApiErrorInfo(error);
      setErrorMessage(`${apiError.title}. ${apiError.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPredictions();
  }, [loadPredictions]);

  return (
    <SwipeTabs current="explore">
      <ScrollView
        style={[styles.screen, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      <View style={[styles.headerPanel, { backgroundColor: theme.primaryDark }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerEyebrow}>Seguimiento</Text>
            <Text style={styles.title}>Historial clinico</Text>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: theme.primary }]}>
            <MaterialIcons name="history" size={28} color="#ffffff" />
          </View>
        </View>
        <Text style={styles.subtitle}>
          Revisa las ultimas predicciones guardadas y los indicadores mas relevantes de cada consulta.
        </Text>

        <View style={styles.summaryRow}>
          <SummaryMetric label="Registros" value={predictions.length} />
          <SummaryMetric label="Riesgo alto" value={highRiskCount} />
          <SummaryMetric label="Limite" value={20} />
        </View>
      </View>

      <ActionButton
        label="Actualizar historial"
        icon="sync"
        loading={loading}
        colors={theme}
        onPress={loadPredictions}
      />

      {loading && predictions.length === 0 && (
        <HealthCard theme={theme} style={styles.centerCard}>
          <ActivityIndicator color={theme.primary} size="large" />
          <Text style={[styles.loadingText, { color: theme.text }]}>Cargando registros...</Text>
        </HealthCard>
      )}

      {!loading && errorMessage && (
        <HealthCard theme={theme} style={{ backgroundColor: theme.dangerSoft }}>
          <View style={styles.messageHeader}>
            <MaterialIcons name="wifi-off" size={24} color={theme.danger} />
            <Text style={[styles.messageTitle, { color: theme.text }]}>No se pudo cargar</Text>
          </View>
          <Text style={[styles.messageText, { color: theme.muted }]}>{errorMessage}</Text>
        </HealthCard>
      )}

      {!loading && !errorMessage && predictions.length === 0 && (
        <HealthCard theme={theme} style={styles.centerCard}>
          <View style={[styles.emptyIcon, { backgroundColor: theme.primarySoft }]}>
            <MaterialIcons name="assignment" size={30} color={theme.primary} />
          </View>
          <Text style={[styles.messageTitle, { color: theme.text }]}>Sin registros aun</Text>
          <Text style={[styles.messageText, { color: theme.muted }]}>
            Realiza una prediccion para construir el historial de seguimiento.
          </Text>
        </HealthCard>
      )}

      {predictions.map((item) => {
        const isHighRisk = item.risk === "alto";
        const accent = isHighRisk ? theme.danger : theme.success;
        const soft = isHighRisk ? theme.dangerSoft : theme.successSoft;

        return (
          <HealthCard key={item.id} theme={theme} style={styles.recordCard}>
            <View style={styles.recordHeader}>
              <View style={styles.recordTitleWrap}>
                <Text style={[styles.recordId, { color: theme.text }]}>Registro #{item.id}</Text>
                <Text style={[styles.date, { color: theme.subtle }]}>{formatDate(item.created_at)}</Text>
              </View>
              <View style={[styles.riskBadge, { backgroundColor: soft }]}>
                <View style={[styles.riskDot, { backgroundColor: accent }]} />
                <Text style={[styles.riskBadgeText, { color: accent }]}>
                  {isHighRisk ? "Riesgo alto" : "Riesgo bajo"}
                </Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <Metric label="Glucosa" value={item.glucose} unit="mg/dL" theme={theme} />
              <Metric label="BMI" value={item.bmi} theme={theme} />
              <Metric label="Edad" value={item.age} unit="anos" theme={theme} />
              <Metric label="Presion" value={item.blood_pressure} unit="mmHg" theme={theme} />
            </View>

            <View style={[styles.recommendation, { backgroundColor: theme.elevated }]}>
              <MaterialIcons name="tips-and-updates" size={19} color={accent} />
              <Text style={[styles.recommendationText, { color: theme.muted }]}>
                {item.recommendation}
              </Text>
            </View>
          </HealthCard>
        );
      })}
      </ScrollView>
    </SwipeTabs>
  );
}

function SummaryMetric({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.summaryMetric}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
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
    <View style={[styles.metric, { backgroundColor: theme.elevated, borderColor: theme.border }]}>
      <Text style={[styles.metricLabel, { color: theme.muted }]}>{label}</Text>
      <View style={styles.metricValueRow}>
        <Text style={[styles.metricValue, { color: theme.text }]}>{value}</Text>
        {unit && <Text style={[styles.metricUnit, { color: theme.subtle }]}>{unit}</Text>}
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
  headerPanel: {
    borderRadius: 30,
    padding: 22,
  },
  headerTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerEyebrow: {
    color: "#bdf8ef",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 3,
  },
  headerIcon: {
    alignItems: "center",
    borderRadius: 18,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  subtitle: {
    color: "#d8fff7",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  summaryMetric: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 18,
    flex: 1,
    padding: 12,
  },
  summaryValue: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
  },
  summaryLabel: {
    color: "#cffaf3",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
  centerCard: {
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 12,
  },
  messageHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: "900",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: "center",
  },
  emptyIcon: {
    alignItems: "center",
    borderRadius: 20,
    height: 58,
    justifyContent: "center",
    marginBottom: 12,
    width: 58,
  },
  recordCard: {
    gap: 14,
  },
  recordHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  recordTitleWrap: {
    flex: 1,
  },
  recordId: {
    fontSize: 18,
    fontWeight: "900",
  },
  date: {
    fontSize: 12,
    marginTop: 4,
  },
  riskBadge: {
    alignItems: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  riskDot: {
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  riskBadgeText: {
    fontSize: 12,
    fontWeight: "900",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metric: {
    borderRadius: 16,
    borderWidth: 1,
    minWidth: "47%",
    padding: 12,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "800",
  },
  metricValueRow: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: 5,
    marginTop: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "900",
  },
  metricUnit: {
    fontSize: 11,
    fontWeight: "700",
  },
  recommendation: {
    alignItems: "flex-start",
    borderRadius: 16,
    flexDirection: "row",
    gap: 10,
    padding: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
});

import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { api } from "../../services/api";

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
  const [predictions, setPredictions] = useState<PredictionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPredictions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<PredictionHistoryResponse>("/predictions?limit=20");
      setPredictions(response.data.predictions);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo cargar el historial.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPredictions();
  }, [loadPredictions]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Historial</Text>
          <Text style={styles.subtitle}>Ultimas predicciones registradas.</Text>
        </View>

        <Pressable style={styles.refreshButton} onPress={loadPredictions} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.refreshText}>Actualizar</Text>
          )}
        </Pressable>
      </View>

      {!loading && predictions.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Sin registros</Text>
          <Text style={styles.emptyText}>
            Realiza una prediccion para que aparezca en esta pantalla.
          </Text>
        </View>
      )}

      {predictions.map((item) => {
        const isHighRisk = item.risk === "alto";

        return (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.recordId}>Registro #{item.id}</Text>
                <Text style={styles.date}>{formatDate(item.created_at)}</Text>
              </View>

              <View style={[styles.badge, isHighRisk ? styles.highBadge : styles.lowBadge]}>
                <Text style={styles.badgeText}>{item.message}</Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <Metric label="Glucosa" value={item.glucose} />
              <Metric label="BMI" value={item.bmi} />
              <Metric label="Edad" value={item.age} />
              <Metric label="Presion" value={item.blood_pressure} />
            </View>

            <Text style={styles.recommendation}>{item.recommendation}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4f8fb",
    flexGrow: 1,
    padding: 20,
    paddingBottom: 32,
  },

  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginBottom: 18,
    marginTop: 24,
  },

  title: {
    color: "#12324a",
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#526476",
    fontSize: 15,
    lineHeight: 21,
    marginTop: 4,
  },

  refreshButton: {
    alignItems: "center",
    backgroundColor: "#0f766e",
    borderRadius: 8,
    minWidth: 104,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  refreshText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
  },

  emptyTitle: {
    color: "#12324a",
    fontSize: 18,
    fontWeight: "700",
  },

  emptyText: {
    color: "#526476",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 14,
    padding: 16,
  },

  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },

  recordId: {
    color: "#12324a",
    fontSize: 17,
    fontWeight: "700",
  },

  date: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 4,
  },

  badge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  highBadge: {
    backgroundColor: "#fee2e2",
  },

  lowBadge: {
    backgroundColor: "#dcfce7",
  },

  badgeText: {
    color: "#102a43",
    fontSize: 13,
    fontWeight: "700",
  },

  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },

  metric: {
    backgroundColor: "#eef5fa",
    borderRadius: 8,
    minWidth: "47%",
    padding: 10,
  },

  metricLabel: {
    color: "#526476",
    fontSize: 12,
    fontWeight: "600",
  },

  metricValue: {
    color: "#12324a",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },

  recommendation: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 14,
  },
});

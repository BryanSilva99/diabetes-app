import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import InputField from "../components/InputField";
import { api } from "../services/api";

type FormValues = {
  Pregnancies: string;
  Glucose: string;
  BloodPressure: string;
  SkinThickness: string;
  Insulin: string;
  BMI: string;
  DiabetesPedigreeFunction: string;
  Age: string;
};

type PredictionResult = {
  id: number;
  prediction: number;
  risk: "alto" | "bajo";
  message: string;
  recommendation: string;
};

const initialForm: FormValues = {
  Pregnancies: "",
  Glucose: "",
  BloodPressure: "",
  SkinThickness: "",
  Insulin: "",
  BMI: "",
  DiabetesPedigreeFunction: "",
  Age: "",
};

const fields: Array<{
  key: keyof FormValues;
  label: string;
  placeholder: string;
}> = [
  { key: "Pregnancies", label: "Embarazos", placeholder: "Ej: 2" },
  { key: "Glucose", label: "Glucosa (mg/dL)", placeholder: "Ej: 120" },
  { key: "BloodPressure", label: "Presion arterial", placeholder: "Ej: 70" },
  { key: "SkinThickness", label: "Grosor de piel", placeholder: "Ej: 20" },
  { key: "Insulin", label: "Insulina", placeholder: "Ej: 79" },
  { key: "BMI", label: "IMC / BMI", placeholder: "Ej: 28.5" },
  {
    key: "DiabetesPedigreeFunction",
    label: "Funcion pedigree diabetes",
    placeholder: "Ej: 0.5",
  },
  { key: "Age", label: "Edad", placeholder: "Ej: 35" },
];

export default function HomeScreen() {
  const [form, setForm] = useState<FormValues>(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const updateField = (key: keyof FormValues, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const buildPayload = () => {
    const entries = Object.entries(form) as Array<[keyof FormValues, string]>;
    const emptyField = entries.find(([, value]) => value.trim() === "");

    if (emptyField) {
      Alert.alert("Datos incompletos", "Completa todos los campos antes de predecir.");
      return null;
    }

    const payload = entries.reduce(
      (accumulator, [key, value]) => ({
        ...accumulator,
        [key]: Number(value),
      }),
      {} as Record<keyof FormValues, number>,
    );

    const invalidField = Object.entries(payload).find(([, value]) => Number.isNaN(value));

    if (invalidField) {
      Alert.alert("Datos invalidos", "Ingresa solo valores numericos.");
      return null;
    }

    return payload;
  };

  const predictDiabetes = async () => {
    const payload = buildPayload();

    if (!payload) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post<PredictionResult>("/predict", payload);
      setResult(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo conectar con la API.");
    } finally {
      setLoading(false);
    }
  };

  const isHighRisk = result?.risk === "alto";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Prediccion de Diabetes</Text>
      <Text style={styles.subtitle}>
        Ingresa los datos del paciente para estimar el riesgo con el modelo entrenado.
      </Text>

      <View style={styles.formCard}>
        {fields.map((field) => (
          <InputField
            key={field.key}
            label={field.label}
            placeholder={field.placeholder}
            value={form[field.key]}
            onChangeText={(value) => updateField(field.key, value)}
          />
        ))}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={predictDiabetes}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Predecir riesgo</Text>
          )}
        </Pressable>
      </View>

      {result && (
        <View style={[styles.resultCard, isHighRisk ? styles.highRisk : styles.lowRisk]}>
          <Text style={styles.resultLabel}>Resultado</Text>
          <Text style={styles.resultTitle}>{result.message}</Text>
          <Text style={styles.recordText}>Registro #{result.id}</Text>
          <Text style={styles.resultText}>{result.recommendation}</Text>
          <Text style={styles.disclaimer}>
            Esta prediccion es referencial y no reemplaza una evaluacion medica.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4f8fb",
    flexGrow: 1,
    padding: 20,
    paddingBottom: 32,
  },

  title: {
    color: "#12324a",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 24,
    textAlign: "center",
  },

  subtitle: {
    color: "#526476",
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 20,
    marginTop: 8,
    textAlign: "center",
  },

  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
  },

  button: {
    alignItems: "center",
    backgroundColor: "#0f766e",
    borderRadius: 8,
    marginTop: 4,
    paddingVertical: 14,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  resultCard: {
    borderRadius: 8,
    marginTop: 18,
    padding: 16,
  },

  highRisk: {
    backgroundColor: "#fee2e2",
  },

  lowRisk: {
    backgroundColor: "#dcfce7",
  },

  resultLabel: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  resultTitle: {
    color: "#102a43",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 6,
  },

  resultText: {
    color: "#334155",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },

  recordText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },

  disclaimer: {
    color: "#64748b",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
  },
});

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import ActionButton from "../components/ActionButton";
import HealthCard from "../components/HealthCard";
import InputField from "../components/InputField";
import SwipeTabs from "../components/SwipeTabs";
import { healthThemes } from "../constants/health-theme";
import {
  type FormValues,
  type PredictionPayload,
  type PredictionResult,
  usePrediction,
} from "../contexts/PredictionContext";
import { api, getApiErrorInfo } from "../services/api";

type FieldConfig = {
  key: keyof FormValues;
  label: string;
  placeholder: string;
  min: number;
  max: number;
  helperText: string;
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

const fields: FieldConfig[] = [
  {
    key: "Pregnancies",
    label: "Embarazos",
    placeholder: "Ej: 2",
    min: 0,
    max: 20,
    helperText: "0 a 20",
  },
  {
    key: "Age",
    label: "Edad",
    placeholder: "Ej: 35",
    min: 1,
    max: 120,
    helperText: "1 a 120 anos",
  },
  {
    key: "Glucose",
    label: "Glucosa",
    placeholder: "Ej: 120",
    min: 1,
    max: 250,
    helperText: "mg/dL, mayor a 0 hasta 250",
  },
  {
    key: "BloodPressure",
    label: "Presion arterial",
    placeholder: "Ej: 70",
    min: 1,
    max: 150,
    helperText: "mmHg, mayor a 0 hasta 150",
  },
  {
    key: "BMI",
    label: "IMC / BMI",
    placeholder: "Ej: 28.5",
    min: 1,
    max: 80,
    helperText: "mayor a 0 hasta 80",
  },
  {
    key: "SkinThickness",
    label: "Grosor de piel",
    placeholder: "Ej: 20",
    min: 0,
    max: 100,
    helperText: "mm, 0 a 100",
  },
  {
    key: "Insulin",
    label: "Insulina",
    placeholder: "Ej: 79",
    min: 0,
    max: 900,
    helperText: "0 a 900",
  },
  {
    key: "DiabetesPedigreeFunction",
    label: "Funcion pedigree",
    placeholder: "Ej: 0.5",
    min: 0,
    max: 3,
    helperText: "0 a 3",
  },
];

const stepGroups: Array<{
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  fields: Array<keyof FormValues>;
}> = [
  {
    title: "Datos basicos",
    subtitle: "Empecemos por informacion general.",
    icon: "person-outline",
    fields: ["Pregnancies", "Age"],
  },
  {
    title: "Indicadores principales",
    subtitle: "Estos valores tienen mayor peso clinico.",
    icon: "monitor-heart",
    fields: ["Glucose", "BloodPressure", "BMI"],
  },
  {
    title: "Datos complementarios",
    subtitle: "Ayudan al modelo a completar la estimacion.",
    icon: "science",
    fields: ["SkinThickness", "Insulin", "DiabetesPedigreeFunction"],
  },
];

export default function HomeScreen() {
  const scheme = useColorScheme();
  const theme = healthThemes[scheme === "dark" ? "dark" : "light"];
  const { clearPrediction, savePrediction } = usePrediction();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<FormValues>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [loading, setLoading] = useState(false);

  const visibleFields = stepGroups[currentStep].fields
    .map((key) => fields.find((field) => field.key === key))
    .filter(Boolean) as FieldConfig[];

  const completedFields = useMemo(
    () => Object.values(form).filter((value) => value.trim() !== "").length,
    [form],
  );
  const completionPercent = Math.round((completedFields / fields.length) * 100);

  const updateField = (key: keyof FormValues, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validateFields = (targetFields: FieldConfig[]) => {
    const errors: Partial<Record<keyof FormValues, string>> = {};

    for (const field of targetFields) {
      const rawValue = form[field.key].trim();
      const numericValue = Number(rawValue);

      if (!rawValue) {
        errors[field.key] = "Completa este dato.";
      } else if (Number.isNaN(numericValue)) {
        errors[field.key] = "Ingresa solo numeros.";
      } else if (numericValue < field.min || numericValue > field.max) {
        errors[field.key] = `Debe estar entre ${field.min} y ${field.max}.`;
      }
    }

    setFieldErrors((current) => ({ ...current, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const buildPayload = () => {
    if (!validateFields(fields)) {
      Alert.alert("Revisa los datos", "Hay campos incompletos o fuera de rango.");
      return null;
    }

    return Object.entries(form).reduce(
      (accumulator, [key, value]) => ({
        ...accumulator,
        [key]: Number(value),
      }),
      {} as PredictionPayload,
    );
  };

  const goNext = () => {
    if (!validateFields(visibleFields)) {
      return;
    }

    setCurrentStep((step) => Math.min(step + 1, stepGroups.length - 1));
  };

  const goBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const resetForm = () => {
    setForm(initialForm);
    clearPrediction();
    setFieldErrors({});
    setCurrentStep(0);
  };

  const predictDiabetes = async () => {
    const payload = buildPayload();

    if (!payload) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post<PredictionResult>("/predict", payload);
      savePrediction({
        payload,
        result: response.data,
        createdAt: new Date().toISOString(),
      });
      router.push("/(tabs)/result");
    } catch (error) {
      console.log(error);
      const apiError = getApiErrorInfo(error);
      Alert.alert(apiError.title, apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const isLastStep = currentStep === stepGroups.length - 1;

  return (
    <SwipeTabs current="index">
      <ScrollView
        style={[styles.screen, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      <View style={[styles.hero, { backgroundColor: theme.primaryDark }]}>
        <View style={styles.heroTop}>
          <View style={[styles.logoMark, { backgroundColor: theme.primary }]}>
            <MaterialIcons name="health-and-safety" size={28} color="#ffffff" />
          </View>
          <View style={[styles.statusPill, { backgroundColor: theme.primarySoft }]}>
            <MaterialIcons name="verified" size={15} color={theme.primaryDark} />
            <Text style={[styles.statusPillText, { color: theme.primaryDark }]}>ML activo</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Evalua tu riesgo metabolico en minutos</Text>
        <Text style={styles.heroText}>
          Ingresa indicadores basicos y recibe una orientacion clara, preventiva y facil de entender.
        </Text>

        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>8</Text>
            <Text style={styles.heroStatLabel}>indicadores</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{completionPercent}%</Text>
            <Text style={styles.heroStatLabel}>completado</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>IA</Text>
            <Text style={styles.heroStatLabel}>modelo ML</Text>
          </View>
        </View>
      </View>

      <HealthCard theme={theme}>
        <View style={styles.stepHeader}>
          <View style={[styles.stepIcon, { backgroundColor: theme.primarySoft }]}>
            <MaterialIcons name={stepGroups[currentStep].icon} size={24} color={theme.primary} />
          </View>
          <View style={styles.stepCopy}>
            <Text style={[styles.eyebrow, { color: theme.primary }]}>
              Paso {currentStep + 1} de {stepGroups.length}
            </Text>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{stepGroups[currentStep].title}</Text>
            <Text style={[styles.sectionText, { color: theme.muted }]}>{stepGroups[currentStep].subtitle}</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: theme.primary,
                width: `${((currentStep + 1) / stepGroups.length) * 100}%`,
              },
            ]}
          />
        </View>

        <View style={styles.fields}>
          {visibleFields.map((field) => (
            <InputField
              key={field.key}
              label={field.label}
              placeholder={field.placeholder}
              helperText={field.helperText}
              errorText={fieldErrors[field.key]}
              value={form[field.key]}
              onChangeText={(value) => updateField(field.key, value)}
            />
          ))}
        </View>

        <View style={styles.actions}>
          {currentStep > 0 && (
            <ActionButton
              label="Atras"
              icon="arrow-back"
              variant="secondary"
              colors={theme}
              onPress={goBack}
            />
          )}
          {isLastStep ? (
            <ActionButton
              label="Analizar riesgo"
              icon="analytics"
              loading={loading}
              colors={theme}
              onPress={predictDiabetes}
            />
          ) : (
            <ActionButton label="Continuar" icon="arrow-forward" colors={theme} onPress={goNext} />
          )}
          <ActionButton label="Limpiar" icon="restart-alt" variant="ghost" colors={theme} onPress={resetForm} />
        </View>
      </HealthCard>

      {loading && (
        <HealthCard theme={theme} style={styles.processingCard}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.processingTitle, { color: theme.text }]}>Analizando indicadores</Text>
          <Text style={[styles.sectionText, { color: theme.muted }]}>
            Estamos consultando el modelo y preparando una lectura clara del resultado.
          </Text>
        </HealthCard>
      )}

      </ScrollView>
    </SwipeTabs>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: 18,
    padding: 18,
    paddingBottom: 34,
  },
  hero: {
    borderRadius: 30,
    overflow: "hidden",
    padding: 22,
  },
  heroTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  logoMark: {
    alignItems: "center",
    borderRadius: 18,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  statusPill: {
    alignItems: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: "900",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 31,
    fontWeight: "900",
    lineHeight: 36,
  },
  heroText: {
    color: "#d8fff7",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  heroStats: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  heroStat: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 18,
    flex: 1,
    padding: 12,
  },
  heroStatValue: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
  },
  heroStatLabel: {
    color: "#cffaf3",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
  stepHeader: {
    flexDirection: "row",
    gap: 14,
  },
  stepIcon: {
    alignItems: "center",
    borderRadius: 18,
    height: 50,
    justifyContent: "center",
    width: 50,
  },
  stepCopy: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: "900",
    marginTop: 3,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 5,
  },
  progressTrack: {
    backgroundColor: "rgba(148,163,184,0.25)",
    borderRadius: 999,
    height: 8,
    marginTop: 18,
    overflow: "hidden",
  },
  progressFill: {
    borderRadius: 999,
    height: 8,
  },
  fields: {
    marginTop: 18,
  },
  actions: {
    gap: 10,
    marginTop: 4,
  },
  processingCard: {
    alignItems: "center",
  },
  processingTitle: {
    fontSize: 20,
    fontWeight: "900",
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
  recommendationGrid: {
    gap: 10,
    marginTop: 18,
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
});

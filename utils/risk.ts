import type { HealthTheme } from "../constants/health-theme";
import type { PredictionPayload, PredictionResult } from "../contexts/PredictionContext";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function estimateRiskPercent(payload: PredictionPayload, result: PredictionResult) {
  const glucoseFactor = payload.Glucose >= 140 ? 9 : payload.Glucose >= 110 ? 5 : 0;
  const bmiFactor = payload.BMI >= 35 ? 8 : payload.BMI >= 30 ? 5 : payload.BMI >= 25 ? 2 : 0;
  const ageFactor = payload.Age >= 55 ? 5 : payload.Age >= 40 ? 3 : 0;
  const pedigreeFactor = payload.DiabetesPedigreeFunction >= 1 ? 4 : 0;
  const score = (result.risk === "alto" ? 68 : 18) + glucoseFactor + bmiFactor + ageFactor + pedigreeFactor;

  return result.risk === "alto" ? clamp(score, 65, 92) : clamp(score, 10, 44);
}

export function getRiskPresentation(percent: number, theme: HealthTheme) {
  if (percent >= 65) {
    return {
      label: "Riesgo Alto",
      color: theme.danger,
      soft: theme.dangerSoft,
      title: "Conviene buscar orientacion profesional",
    };
  }

  if (percent >= 40) {
    return {
      label: "Riesgo Medio",
      color: theme.warning,
      soft: theme.warningSoft,
      title: "Hay senales que conviene vigilar",
    };
  }

  return {
    label: "Riesgo Bajo",
    color: theme.success,
    soft: theme.successSoft,
    title: "El resultado actual luce favorable",
  };
}

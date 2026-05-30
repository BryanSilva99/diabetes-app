import { createContext, type PropsWithChildren, useContext, useMemo, useState } from "react";

export type FormValues = {
  Pregnancies: string;
  Glucose: string;
  BloodPressure: string;
  SkinThickness: string;
  Insulin: string;
  BMI: string;
  DiabetesPedigreeFunction: string;
  Age: string;
};

export type PredictionPayload = Record<keyof FormValues, number>;

export type PredictionResult = {
  id: number;
  prediction: number;
  risk: "alto" | "bajo";
  message: string;
  recommendation: string;
};

export type SavedPrediction = {
  payload: PredictionPayload;
  result: PredictionResult;
  createdAt: string;
};

type PredictionContextValue = {
  latestPrediction: SavedPrediction | null;
  savePrediction: (prediction: SavedPrediction) => void;
  clearPrediction: () => void;
};

const PredictionContext = createContext<PredictionContextValue | null>(null);

export function PredictionProvider({ children }: PropsWithChildren) {
  const [latestPrediction, setLatestPrediction] = useState<SavedPrediction | null>(null);

  const value = useMemo(
    () => ({
      latestPrediction,
      savePrediction: setLatestPrediction,
      clearPrediction: () => setLatestPrediction(null),
    }),
    [latestPrediction],
  );

  return <PredictionContext.Provider value={value}>{children}</PredictionContext.Provider>;
}

export function usePrediction() {
  const context = useContext(PredictionContext);

  if (!context) {
    throw new Error("usePrediction debe usarse dentro de PredictionProvider");
  }

  return context;
}

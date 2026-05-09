import { useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

import InputField from "../components/InputField";
import { api } from "../services/api";

export default function HomeScreen() {
  const [glucose, setGlucose] = useState("");
  const [bmi, setBmi] = useState("");
  const [age, setAge] = useState("");

  const predictDiabetes = async () => {
    try {
      const response = await api.post("/predict", {
        Pregnancies: 2,
        Glucose: Number(glucose),
        BloodPressure: 70,
        SkinThickness: 20,
        Insulin: 79,
        BMI: Number(bmi),
        DiabetesPedigreeFunction: 0.5,
        Age: Number(age),
      });

      Alert.alert("Resultado", JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo conectar");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Predicción de Diabetes</Text>

      <InputField
        placeholder="Glucosa"
        value={glucose}
        onChangeText={setGlucose}
      />

      <InputField placeholder="BMI" value={bmi} onChangeText={setBmi} />

      <InputField placeholder="Edad" value={age} onChangeText={setAge} />

      <Button title="Predecir" onPress={predictDiabetes} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});

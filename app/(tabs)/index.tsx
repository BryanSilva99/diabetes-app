import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

import axios from "axios";

export default function HomeScreen() {
  const [glucose, setGlucose] = useState("");
  const [bmi, setBmi] = useState("");
  const [age, setAge] = useState("");

  const predictDiabetes = async () => {
    try {
      const response = await axios.post("http://192.168.18.2:8000/predict", {
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
      Alert.alert("Error", "No se pudo conectar con la API");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Predicción de Diabetes</Text>

      <TextInput
        style={styles.input}
        placeholder="Glucosa"
        keyboardType="numeric"
        value={glucose}
        onChangeText={setGlucose}
      />

      <TextInput
        style={styles.input}
        placeholder="BMI"
        keyboardType="numeric"
        value={bmi}
        onChangeText={setBmi}
      />

      <TextInput
        style={styles.input}
        placeholder="Edad"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

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

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
  },
});

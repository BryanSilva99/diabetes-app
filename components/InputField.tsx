import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
};

export default function InputField({
  label,
  placeholder,
  value,
  onChangeText,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        keyboardType="numeric"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },

  label: {
    color: "#274060",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
  },
});

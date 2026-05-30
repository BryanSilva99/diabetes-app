import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  label: string;
  placeholder: string;
  helperText?: string;
  errorText?: string;
  value: string;
  onChangeText: (text: string) => void;
};

export default function InputField({
  label,
  placeholder,
  helperText,
  errorText,
  value,
  onChangeText,
}: Props) {
  const hasError = Boolean(errorText);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, hasError && styles.inputError]}
        placeholder={placeholder}
        keyboardType="numeric"
        value={value}
        onChangeText={onChangeText}
      />
      {errorText ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : (
        helperText && <Text style={styles.helperText}>{helperText}</Text>
      )}
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

  inputError: {
    borderColor: "#dc2626",
    backgroundColor: "#fff7f7",
  },

  helperText: {
    color: "#64748b",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },

  errorText: {
    color: "#b91c1c",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 17,
    marginTop: 4,
  },
});

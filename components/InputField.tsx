import { StyleSheet, TextInput } from "react-native";

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
};

export default function InputField({
  placeholder,
  value,
  onChangeText,
}: Props) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      keyboardType="numeric"
      value={value}
      onChangeText={onChangeText}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
  },
});

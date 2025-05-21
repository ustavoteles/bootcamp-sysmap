import { StyleSheet, Text, View } from "react-native";
import CustomButton from "../../Buttons/CustomButtom";
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";

interface ConfirmationCodeCardProps {
  activity: {
    confirmationCode?: string;
  };
  admin: boolean;
  onCheckIn?: (code: string) => void;
}

export default function ConfirmationCodeCard({
  activity,
  admin,
  onCheckIn,
}: ConfirmationCodeCardProps) {
  const [codeInput, setCodeInput] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Código de Confirmação</Text>
        {admin && <Text style={styles.text}>{activity.confirmationCode}</Text>}
      </View>

      {!admin && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Digite o código"
            value={codeInput}
            onChangeText={setCodeInput}
          />
          <CustomButton
            text="Confirmar Presença"
            onPress={() => onCheckIn?.(codeInput)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#6969691A",
    borderRadius: 10,
    padding: 17,
    marginTop: 10,
  },
  header: {
    marginBottom: 10,
  },
  form: {
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 16,
    marginBottom: 10,
    height: 56,
  },
  title: {
    fontSize: 16,
    fontFamily: "DMSans-SemiBold",
    textAlign: "left",
    width: "100%",
  },
  text: {
    fontSize: 17,
    fontFamily: "DMSans-Regular",
    textAlign: "center",
    width: "100%",
    marginTop: 15,
  },
});

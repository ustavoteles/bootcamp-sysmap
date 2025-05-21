import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import CustomButton from "../Buttons/CustomButtom";
import { useTypedNavigation } from "../../hooks/useTypedNavigation";
import useAppContext from "../../hooks/useAppContext";
import { useState } from "react";
import Toast from "react-native-toast-message";

export const loginFormSchema = z.object({
  email: z
    .string({ required_error: "Informe um e-mail válido" })
    .email({ message: "Email inválido" }),
  password: z
    .string({ required_error: "Informe a senha" })
    .min(6, { message: "Mínimo 6 caracteres" }),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const navigation = useTypedNavigation();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  const {
    auth: { login },
  } = useAppContext();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
    } catch (error: any) {
      if (error.response?.status === 401) {
        Toast.show({
          type: "error",
          text1: "SENHA INCORRETA",
          text2: "Tente novamente.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Erro ao fazer login",
          text2: error.message || "Tente novamente",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>
          E-mail <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          placeholder="Ex.: nome@email.com"
          onChangeText={(text: string) => setValue("email", text)}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}

        <Text style={styles.text}>
          Senha <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          placeholder="Digite sua senha"
          onChangeText={(text: string) => setValue("password", text)}
          style={styles.input}
          secureTextEntry
        />
        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}
        <View style={styles.register}>
          <CustomButton
            text={loading ? "Carregando..." : "Entrar"}
            color="#00BC7D"
            fullWidth
            onPress={handleSubmit(onSubmit)}
          />

          <View style={styles.registerTextContainer}>
            <Text style={styles.normalText}>Ainda não tem uma conta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.link}> Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: "95%",
  },
  text: {
    fontSize: 16,
    marginTop: 4,
    fontFamily: "DMSans-Medium",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 16,
    marginTop: -8,
    height: 56,
  },
  error: {
    color: "red",
    fontSize: 12,
  },
  register: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    paddingTop: 30,
    width: "90%",
  },
  registerTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
  },
  normalText: {
    fontSize: 14,
    fontFamily: "DMSans-Regular",
  },
  link: {
    fontSize: 14,
    fontFamily: "DMSans-Bold",
  },
});

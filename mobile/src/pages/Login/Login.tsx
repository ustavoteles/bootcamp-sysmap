import { Text, View } from "react-native";
import Logo from "../../../assets/logo.svg";
import { loginStyles } from "./loginStyles";
import LoginForm from "../../components/Form/LoginForm";
import { useState } from "react";
import useAppContext from "../../hooks/useAppContext";
import Toast from "react-native-toast-message";
import KeyboardAvoidingContent from "../../components/KeyboardAvoidingContent/KeyboardAvoidingContent";

export default function Login() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(false);

  const [passwordError, setPasswordError] = useState(false);

  const {
    auth: { login },
  } = useAppContext();

  function verifyEmail() {
    return email.length > 0 && email.includes("@");
  }

  function showErrorToast(title: string, message: string) {
    Toast.show({
      type: "error",

      text1: title,

      text2: message,
    });
  }

  async function handleLogin() {
    try {
      let isError = false;

      if (!verifyEmail()) {
        setEmailError(true);

        isError = true;
      }

      if (password.length < 6) {
        setPasswordError(true);

        isError = true;
      }

      if (isError) return;

      login && (await login(email, password));
    } catch (error: any) {
      showErrorToast("Houve um Erro", error.message);
    }
  }
  return (
    <>
      <KeyboardAvoidingContent>
        <View style={loginStyles.container}>
          <Logo />
          <View style={loginStyles.view}>
            <Text style={loginStyles.title} numberOfLines={1}>
              FAÇA LOGIN E COMECE A TREINAR
            </Text>
            <Text style={loginStyles.subtitle}>
              Encontre parceiros para treinar ao ar livre. Conecte-se e comece
              agora! 💪
            </Text>
          </View>
          <LoginForm />
        </View>
      </KeyboardAvoidingContent>
    </>
  );
}

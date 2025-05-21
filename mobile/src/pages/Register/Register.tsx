import { Text, TouchableOpacity, View, Alert } from "react-native";
import { registerStyles } from "./registerStyles";
import RegisterForm from "../../components/Form/RegisterForm";
import type { RegisterFormData } from "../../components/Form/RegisterForm";
import { CaretLeft } from "phosphor-react-native";
import { useTypedNavigation } from "../../hooks/useTypedNavigation";
import api, { getHeaders } from "../../api/api";
import { useState } from "react";
import KeyboardAvoidingContent from "../../components/KeyboardAvoidingContent/KeyboardAvoidingContent";

export default function Register() {
  const navigation = useTypedNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    const cleanedData = {
      name: data.name,
      email: data.email,
      cpf: data.cpf.replace(/\D/g, ""),
      password: data.password,
    };

    try {
      const headers = await getHeaders();
      const response = await api.post("/auth/register", cleanedData, {
        headers,
      });

      if (response.status === 201 || response.status === 200) {
        console.log("[Register] Cadastro realizado com sucesso!");
        Alert.alert(
          "Cadastro Realizado",
          "Seu cadastro foi realizado com sucesso!",
          [{ text: "OK", onPress: () => navigation.navigate("Login") }]
        );
      } else {
        console.warn("[Register] Erro ao cadastrar:", response.data);
        Alert.alert(
          "Erro no Cadastro",
          "Ocorreu um erro ao processar seu cadastro. Por favor tente novamente."
        );
      }
    } catch (error: any) {
      let errorMessage = "Ocorreu um erro ao processar seu cadastro.";

      if (error.response) {
        console.error("Erro do servidor:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        if (error.response.status === 409) {
          errorMessage = "Este e-mail ou CPF já está cadastrado.";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        console.error("Sem resposta do servidor:", error.request);
        errorMessage =
          "Não foi possível conectar ao servidor. Verifique sua conexão.";
      } else {
        console.error("Erro ao configurar requisição:", error.message);
      }

      Alert.alert("Erro no Cadastro", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingContent>
      <View style={registerStyles.container}>
        <View style={registerStyles.view}>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <CaretLeft
              size={30}
              weight="bold"
              style={{ alignSelf: "flex-start", marginTop: 10 }}
            />
          </TouchableOpacity>
          <Text style={registerStyles.title}>CRIE SUA CONTA</Text>
          <Text style={registerStyles.subtitle}>
            Por favor preencha os dados para prosseguir!
          </Text>
        </View>

        <RegisterForm
          isCpfEditable={true}
          onSubmitOverride={onSubmit}
          showButtons={true}
          isLoading={isLoading}
        />
      </View>
    </KeyboardAvoidingContent>
  );
}

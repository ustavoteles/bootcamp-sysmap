import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { z } from "zod";
import CustomButton from "../Buttons/CustomButtom";
import { useTypedNavigation } from "../../hooks/useTypedNavigation";
import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";

const formatCPF = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

type RegisterFormProps = {
  showButtons?: boolean;
  onSubmitOverride?: (data: RegisterFormData) => Promise<void>;
  defaultValues?: Partial<RegisterFormData>;
  isCpfEditable?: boolean;
  isLoading?: boolean;
};

export const registerSchema = z
  .object({
    type: z.string().optional(),
    name: z
      .string()
      .nonempty("Nome é obrigatório")
      .refine((value) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value), {
        message: "O nome deve conter apenas letras e espaços",
      })
      .refine((value) => value.trim().split(" ").length >= 2, {
        message: "Digite o nome completo (nome e sobrenome)",
      }),
    cpf: z
      .string()
      .nonempty("CPF é obrigatório")
      .refine((cpf: string) => {
        cpf = cpf.replace(/[^\d]+/g, "");
        if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
        const cpfDigits = cpf.split("").map((el) => +el);
        const rest = (count: number): number =>
          ((cpfDigits
            .slice(0, count - 12)
            .reduce((sum, el, index) => sum + el * (count - index), 0) *
            10) %
            11) %
          10;
        return rest(10) === cpfDigits[9] && rest(11) === cpfDigits[10];
      }, "Digite um CPF válido."),
    email: z.string().nonempty("E-mail é obrigatório").email("E-mail inválido"),
    password: z
      .string()
      .nonempty("Senha é obrigatória")
      .min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string().nonempty("Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm({
  showButtons = true,
  onSubmitOverride,
  defaultValues,
  isCpfEditable = true,
  isLoading = false,
}: RegisterFormProps) {
  const navigation = useTypedNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      cpf: defaultValues?.cpf || "",
      email: defaultValues?.email || "",
      password: defaultValues?.password || "",
      confirmPassword: defaultValues?.confirmPassword || "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitting(true);
    setError(null);

    try {
      if (onSubmitOverride) {
        await onSubmitOverride(data);
      } else {
      }
    } catch (err: any) {
      console.error("Erro no formulário:", err);
      setError(err.message || "Ocorreu um erro ao processar o formulário");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Nome Completo<Text style={{ color: "red" }}>*</Text>
      </Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Ex.: João Pessoa"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.input}
            autoCapitalize="words"
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <Text style={styles.text}>
        CPF<Text style={{ color: "red" }}>*</Text>
      </Text>
      <Controller
        control={control}
        name="cpf"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Ex.: 111.111.111-12"
            onBlur={onBlur}
            onChangeText={(text) => onChange(formatCPF(text))}
            value={value}
            autoCapitalize="none"
            keyboardType="numeric"
            style={[
              styles.input,
              !isCpfEditable && { backgroundColor: "#f2f2f2" },
            ]}
            editable={isCpfEditable}
            selectTextOnFocus={isCpfEditable}
          />
        )}
      />
      {errors.cpf && <Text style={styles.error}>{errors.cpf.message}</Text>}

      <Text style={styles.text}>
        E-mail <Text style={{ color: "red" }}>*</Text>
      </Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Ex.: nome@email.com"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Text style={styles.text}>
        Senha <Text style={{ color: "red" }}>*</Text>
      </Text>
      <View style={styles.passwordContainer}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Ex.: nome123"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.passwordInput}
              secureTextEntry={!showPassword}
            />
          )}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Feather
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      {error && <Text style={styles.generalError}>{error}</Text>}

      {showButtons && (
        <View style={styles.register}>
          <CustomButton
            text={submitting || isLoading ? "Cadastrando..." : "Cadastrar"}
            color="#00BC7D"
            fullWidth
            onPress={handleSubmit(onSubmit)}
            disabled={submitting || isLoading}
          />
          {(submitting || isLoading) && (
            <ActivityIndicator
              style={styles.loader}
              color="#00BC7D"
              size="small"
            />
          )}
          <View style={styles.registerTextContainer}>
            <Text style={styles.normalText}>Já possui uma conta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: "100%",
    padding: 16,
  },
  text: {
    fontSize: 15,
    marginTop: 4,
    fontWeight: "600",
    fontFamily: "DMSans-Medium",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: -8,
    height: 50,
  },
  passwordContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    marginTop: -8,
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    height: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    height: 50,
    justifyContent: "center",
  },
  error: {
    color: "red",
    fontSize: 12,
  },
  generalError: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
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
    marginTop: 26,
  },
  normalText: {
    fontSize: 14,
    fontFamily: "DMSans-Regular",
  },
  link: {
    fontSize: 14,
    fontFamily: "DMSans-Bold",
  },
  loader: {
    marginTop: 10,
  },
});

import { Button } from "@/components/ui/button";
import ImageBackground from "@/assets/images/image-background.svg";
import Logo from "@/assets/images/logo.svg";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeSlash } from "phosphor-react";
import axios from "axios";

const registerSchema = z
  .object({
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

type RegisterFormData = z.infer<typeof registerSchema>;

function Cadastro() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...formData } = data;

    if (data.password !== data.confirmPassword) {
      console.error("As senhas não coincidem.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        formData
      );

      if (response.status === 201) {
        console.log("Cadastro realizado com sucesso:", response.data);
        navigate("/login");
      } else {
        setError("Ocorreu um erro ao tentar cadastrar. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setError("Erro no cadastro. Por favor, tente novamente.");
    }
  };

  return (
    <div className="grid grid-cols-2 h-screen w-screen overflow-hidden rounded-2xl">
      <img
        src={ImageBackground}
        alt=""
        className="w-full h-full object-cover p-8"
      />
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <div className="flex flex-col justify-center items-start px-45 py-19 w-3/4">
          <div className="flex w-full h-full">
            <img src={Logo} alt="" className="flex justify-start mb-12" />
          </div>
          <h1 className="text-xl font-bold font-heading">CRIE SUA CONTA</h1>
          <span className="mt-3 text-left">
            Cadastre-se para encontrar parceiros de treino e começar a se
            exercitar ao ar livre. Vamos juntos! 💪
          </span>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-start h-full w-full mt-10 gap-4"
          >
            {/* Nome */}
            <div className="flex flex-col">
              <label htmlFor="name" className="font-medium">
                Nome completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                placeholder="Ex.: João Silva"
                className="border-2 border-slate-200 rounded-md p-2"
                {...register("name")}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* CPF */}
            <div className="flex flex-col">
              <label htmlFor="cpf" className="font-medium">
                CPF <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="cpf"
                placeholder="Ex.: 123.456.789-01"
                className="border-2 border-slate-200 rounded-md p-2"
                {...register("cpf")}
              />
              {errors.cpf && (
                <span className="text-red-500 text-sm">
                  {errors.cpf.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="font-medium">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Ex.: joao@email.com"
                className="border-2 border-slate-200 rounded-md p-2"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Senha */}
            <div className="flex flex-col relative">
              <label htmlFor="password" className="font-medium">
                Senha <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Ex.: joao123"
                className="border-2 border-slate-200 rounded-md p-2"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute top-10 right-3 text-slate-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirmar senha */}
            <div className="flex flex-col relative">
              <label htmlFor="confirmPassword" className="font-medium">
                Confirmar senha <span className="text-red-500">*</span>
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirme sua senha"
                className="border-2 border-slate-200 rounded-md p-2"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </span>
              )}
              <button
                type="button"
                className="absolute top-10 right-3 text-slate-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeSlash size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-700 font-white text-md h-14 w-full mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar"}
            </Button>
            {error && (
              <span className="text-red-500 text-sm mt-2">{error}</span>
            )}
            <div className="flex justify-center items-center w-full mt-4">
              <span className="text-gray-500">
                Já tem uma conta?{" "}
                <Link to="/login" className="font-semibold text-black">
                  Faça login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;

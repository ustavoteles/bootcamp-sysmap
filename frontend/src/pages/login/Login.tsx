import { Button } from "@/components/ui/button";
import ImageBackground from "@/assets/images/image-background.svg";
import Logo from "@/assets/images/logo.svg";
import { Link, useNavigate } from "react-router";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import UserLogin from "@/models/UserLogin";
import { AuthContext } from "@/contexts/AuthContext";
import { Eye, EyeSlash } from "phosphor-react";
import { z } from "zod";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [userLogin, setUserLogin] = useState<UserLogin>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const { user, handleLogin, isLoading } = useContext(AuthContext);

  useEffect(() => {
    if (user?.token) {
      navigate("/");
    }
  }, [user, navigate]);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setUserLogin({
      ...userLogin,

      [e.target.name]: e.target.value,
    });
  }

  const loginSchema = z.object({
    email: z.string().email("E-mail inválido").nonempty("E-mail é obrigatório"),
    password: z
      .string()
      .nonempty("Senha é obrigatória")
      .min(6, "Senha deve ter no mínimo 6 caracteres"),
  });

  const [loginError, setLoginError] = useState("");

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = loginSchema.safeParse(userLogin);

    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoginError("");

    try {
      await handleLogin(userLogin);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 400) {
          setLoginError("E-mail ou senha incorretos.");
        } else {
          setLoginError("Ocorreu um erro inesperado. Tente novamente.");
        }
      } else {
        setLoginError("Ocorreu um erro inesperado. Tente novamente.");
      }
    }
  }

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid grid-cols-2 h-screen w-screen overflow-hidden rounded-2xl">
      <img
        src={ImageBackground}
        alt=""
        className="w-full h-full object-cover p-8"
      />
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <div className="flex flex-col justify-center items-start px-45 py-19 w-3/4">
          <div className="flex w-full h-full  ">
            <img src={Logo} alt="" className="flex justify-start mb-12 " />
          </div>
          <h1 className="text-xl font-bold font-heading">
            BEM-VINDO DE VOLTA!
          </h1>
          <span className="mt-3 text-left">
            Encontre parceiros para treinar ao ar livre.
          </span>
          <span>Conecte-se e comece agora! 💪</span>

          <div className="flex flex-col justify-start h-full w-full mt-10 ">
            <form
              className="flex justify-start items-start flex-col gap-1 "
              onSubmit={login}
            >
              <label htmlFor="email" className="font-medium">
                {" "}
                E-mail
                <span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Ex.: joao@email.com"
                className={`border-2 rounded-md p-2 h-14 w-full ${
                  errors.email ? "border-red-500" : "border-slate-200"
                }`}
                value={userLogin.email}
                onChange={handleInputChange}
                required
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}

              <div className="relative flex flex-col w-full mt-4">
                <label htmlFor="password" className="font-medium">
                  {" "}
                  Senha
                  <span className="text-red-500"> *</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Ex.: joao123"
                  className={`border-2 rounded-md p-2 h-14 w-full ${
                    errors.password ? "border-red-500" : "border-slate-200"
                  }`}
                  value={userLogin.password}
                  onChange={handleInputChange}
                  required
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password}
                  </span>
                )}

                <button
                  type="button"
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  className="top-11 right-3 absolute text-slate-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {loginError && (
                <div className="w-full mt-2 text-red-600 font-medium text-sm text-center">
                  {loginError}
                </div>
              )}
              <Button
                type="submit"
                className=" bg-emerald-500 hover:bg-emerald-700 font-white font-bold text-md h-14 w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              <div className="flex justify-center items-center w-full mt-4">
                <span className="text-gray-500">
                  Ainda não tem uma conta?{" "}
                  <Link to="/cadastro">
                    <span className="font-semibold text-black">
                      Cadastre-se
                    </span>
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

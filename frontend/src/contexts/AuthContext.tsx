import User from "@/models/User";
import UserLogin from "@/models/UserLogin";
import { login } from "@/services/Service";
import { createContext, ReactNode, useState } from "react";

interface AuthContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  handleLogout(): void;
  handleLogin(user: UserLogin): Promise<void>;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleLogin(user: UserLogin) {
    setIsLoading(true);

    try {
      await login("/auth/sign-in", user, setUser);
      console.log("O Usuário foi autenticado com sucesso!", "sucesso");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, handleLogin, handleLogout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

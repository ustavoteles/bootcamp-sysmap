import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";

import * as SecureStore from "expo-secure-store";
import api, { getHeaders } from "../api/api";
import { AppState, initialState } from "./state/state";
import { ActionTypes, reducer } from "./reducer/reducer";

export const AppContext = createContext<AppState>(initialState);

interface AppStateProviderProps {
  children: ReactNode;
}

const TOKEN_STORAGE_KEY = "com.reactexample.token";

const USER_STORAGE_KEY = "com.reactexample.user";

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_STORAGE_KEY);
        const userString = await SecureStore.getItemAsync(USER_STORAGE_KEY);

        if (token && userString) {
          dispatch({
            type: ActionTypes.LOGIN,
            payload: { token, user: JSON.parse(userString) },
          });
        } else {
          dispatch({ type: ActionTypes.LOGOUT });
        }
      } catch (error) {
        console.log("Erro ao carregar dados:", error);
        dispatch({ type: ActionTypes.LOGOUT });
      }
    };

    load();
  }, []);

  async function storageAuthData(token: string, user: any) {
    await SecureStore.setItemAsync(TOKEN_STORAGE_KEY, token);
    await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(user));
  }

  async function removeAuthData() {
    await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEY);
    await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
  }

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = {
        email,
        password,
      };

      const response = await api.post("/auth/sign-in", JSON.stringify(data), {
        headers: await getHeaders(),
      });

      const responseData: any = response.data;

      const user = {
        id: responseData.id,
        name: responseData.name,
        email: responseData.email,
        cpf: responseData.cpf,
        avatar: responseData.avatar,
        xp: responseData.xp,
        level: responseData.level,
        achievements: responseData.achievements,
      };

      await storageAuthData(responseData.token, user);

      dispatch({
        type: ActionTypes.LOGIN,
        payload: { token: responseData.token, user },
      });
    } catch (error: any) {
      console.log("ERRO AO FAZER LOGIN:");
      console.log("Mensagem:", error.message);

      if (error.response) {
        console.log("Resposta do servidor:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      } else if (error.request) {
        console.log("Requisição feita, mas sem resposta:", error.request);
      } else {
        console.log("Erro ao configurar a requisição:", error.message);
      }

      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await removeAuthData();
      dispatch({ type: ActionTypes.LOGOUT });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        auth: {
          ...state.auth,
          login,
          logout,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

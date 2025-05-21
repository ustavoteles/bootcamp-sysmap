import "./App.css";
import Cadastro from "./pages/cadastro/Cadastro";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Activities from "./pages/activties/Activities";
import Layout from "./layouts/DefaultLayout";
import Perfil from "./pages/perfil/Perfil";
import EditarPerfil from "./pages/editarperfil/EditarPerfil";
import { AuthContext, AuthProvider } from "./contexts/AuthContext";
import { Navigate, Route, Routes } from "react-router";
import { JSX, useContext } from "react";

function App() {
  function PrivateRoute({ children }: { children: JSX.Element }) {
    const { user } = useContext(AuthContext);
    return user?.token ? children : <Navigate to="/login" />;
  }
  return (
    <>
      {" "}
      {/* Envolva Routes com BrowserRouter */}
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="perfil/editar" element={<EditarPerfil />} />
            <Route path="activities" element={<Activities />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Camera } from "phosphor-react";
import DeleteUserModal from "@/components/user/delete-user-modal/DeleteUserModal";
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { atualizar } from "@/services/Service";

function EditarPerfil() {
  const { user, setUser } = useContext(AuthContext);
  const token = user?.token;
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setShowError(true);
      return;
    }

    if (!token) {
      console.error("Token não encontrado.");
      return;
    }

    try {
      await atualizar("/user/update", formData, setUser, {
        headers: {
          Authorization: token,
        },
      });
      console.log("Perfil atualizado com sucesso.");
      setShowError(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    });
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className=" w-1/4 flex flex-col items-center justify-center rounded-md ">
        <Link to="/perfil">
          <div className="flex flex-row items-center justify-center w-full font-semibold">
            <ChevronLeft /> <span> Voltar para o perfil</span>
          </div>
        </Link>
        <div className="my-10 relative inline-block">
          <img
            src={user?.avatar}
            alt={`Avatar de ${user?.name} `}
            className="rounded-full"
          />
          <div className="bg-white rounded-full p-3.5 absolute bottom-3 right-0 shadow-md">
            <Camera size={30} />
          </div>
        </div>

        <div>
          <form
            className="flex justify-start items-start flex-col gap-1 "
            onSubmit={handleSubmit}
          >
            <label htmlFor="name" className="font-medium ">
              {" "}
              Nome completo
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Ex.: João Silva"
              className="border-2 border-slate-200 rounded-md p-2 w-full "
              required
              value={formData.name}
              onChange={handleChange}
            />

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
              className="border-2 border-slate-200 rounded-md p-2 h-14 w-full"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <label htmlFor="password" className="font-medium">
              {" "}
              Senha
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Ex.: joao123"
              className="border-2 border-slate-200 rounded-md p-2 h-14 w-full"
              required
              value={formData.password}
              onChange={handleChange}
            />

            <label htmlFor="confirmPassword" className="font-medium">
              {" "}
              Confirmar senha
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Ex.: joao123"
              className="border-2 border-slate-200 rounded-sm p-2 h-14 w-full"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {showError && (
              <p className="text-red-500 mt-1">
                As senhas não coincidem. Tente novamente.
              </p>
            )}

            <div className="flex flex-row gap-1 w-full mt-6">
              <Button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-700 font-white text-md h-12 flex-1"
              >
                Editar
              </Button>
              <Button
                onClick={() => {
                  handleCancel();
                  navigate("/perfil");
                }}
                className="bg-white border-2 border-gray-500  hover:text-white hover:border-white  text-gray-500 text-md h-12 flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-6">
          <DeleteUserModal />
        </div>
      </div>
    </div>
  );
}

export default EditarPerfil;

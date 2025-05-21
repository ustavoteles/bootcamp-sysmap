import Logo from "@/assets/images/logo.svg";
import { Link } from "react-router";
import CreateActivityModal from "../activities/create-modal-activities/modal-activitiy/CreateActivityModal";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

function Navbar() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <div className="mx-auto flex justify-between items-center w-full p-10 -mb-10">
        <div className="flex items-center">
          <Link to="/">
            <img src={Logo} alt="Logo" className="h-14 w-auto" />
          </Link>
        </div>

        <div className="flex items-center text-white space-x-5">
          <CreateActivityModal />

          <div className="relative inline-block">
            <Link to="/perfil">
              <img
                src={user?.avatar}
                alt={`Avatar de ${user?.name} `}
                className="border-3 w-15 h-15 rounded-full"
              />
              <span className="absolute top-11 right-2.5 bg-emerald-500 text-white text-center font-bold text-xs w-10 h-5 rounded-full p-0">
                {user?.level}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
export default Navbar;

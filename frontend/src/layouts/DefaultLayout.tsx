import Navbar from "@/components/navbar/Navbar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow  min-h-screen m-10 ">
        <Outlet />
      </main>
    </div>
  );
}

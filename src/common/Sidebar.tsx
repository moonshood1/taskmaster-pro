import type { FC, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { appRoutes } from "@/Routes";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/store";

export default function Sidebar() {
  const logout = () => {
    useAuthStore.getState().logout();
  };
  return (
    <aside className="h-full shadow-lg px-2 flex flex-col justify-between bg-gray-50 max-w-sm">
      <section className="flex flex-col items-center justify-center text-center mb-8">
        <img
          src="/logo_full.png"
          alt="taskmaster-pro logo"
          className="max-w-[150px] mb-6"
        />
      </section>

      <section className="flex-1 py-4">
        <ul className="space-y-2">
          {appRoutes.map((data) => (
            <SidebarNavLink
              key={data.id}
              icon={data.icon}
              label={data.label}
              url={data.path}
            />
          ))}
        </ul>
      </section>

      <section className="mt-auto">
        <SidebarNavLink
          icon={<LogOut />}
          label="Déconnexion"
          onClick={logout}
        />
      </section>
    </aside>
  );
}

interface NavLinkProps {
  icon: ReactNode;
  label: string;
  url?: string;
  onClick?: () => void;
}

const SidebarNavLink: FC<NavLinkProps> = ({ icon, label, url, onClick }) => {
  const location = useLocation();
  const isActive =
    url === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(url + "/") || location.pathname === url;

  return (
    <motion.li
      className={`flex items-center gap-2 cursor-pointer p-2 ${
        isActive ? "border-l-4 border-nuncare-green" : "opacity-70"
      }`}
      whileHover={{ x: 8 }}
      onClick={onClick}
    >
      <Link to={{ pathname: url }} className="flex items-center gap-2">
        {icon} <span>{label}</span>{" "}
      </Link>
    </motion.li>
  );
};

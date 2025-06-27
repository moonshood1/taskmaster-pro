import { BriefcaseBusiness, ListChecks, Users } from "lucide-react";
import HomePage from "./pages/home/HomePage";
import { v4 as uuidV4 } from "uuid";
import UserPage from "./pages/user/UserPage";
import RolePage from "./pages/role/RolePage";

export const appRoutes = [
  {
    path: "/",
    element: <HomePage />,
    id: uuidV4(),
    icon: <ListChecks />,
    label: "Gestion des tâches",
  },
  {
    path: "/users",
    element: <UserPage />,
    id: uuidV4(),
    icon: <Users />,
    label: "Gestion des utilisateurs",
  },
  {
    path: "/roles",
    element: <RolePage />,
    id: uuidV4(),
    icon: <BriefcaseBusiness />,
    label: "Gestion des rôles",
  },
  // {
  //   path: "/my-profile",
  //   element: <ProfilePage />,
  //   id: uuidV4(),
  //   icon: <User />,
  //   label: "Mon profil",
  // },
];

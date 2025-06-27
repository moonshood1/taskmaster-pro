import { userController } from "@/api/userController";
import type { User } from "@/interfaces/User";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = async () => {
    try {
      const response = await userController.getUsers();

      setUsers(response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur s'est produite";

      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <section className="h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
          <p className="font-light text-sm">
            Accédez aux informations des utilisateurs créés dans la base de
            données
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border-b">Date d'inscription</th>
              <th className="p-2 border-b">Nom</th>
              <th className="p-2 border-b">Prénom</th>
              <th className="p-2 border-b">Email</th>
              <th className="p-2 border-b">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="p-2 border-b">
                  {new Date(user.createdAt ?? "").toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="p-2 border-b">{user.lastName}</td>
                <td className="p-2 border-b">{user.firstName}</td>
                <td className="p-2 border-b">{user.email}</td>
                <td className="p-2 border-b">{user.job?.name}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-gray-400 p-4">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

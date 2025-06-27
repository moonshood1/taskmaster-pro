import { userController } from "@/api/userController";
import MyLoader from "@/components/myui/MyLoader";
import type { Job } from "@/interfaces/User";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function RolePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [newJob, setNewJob] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [changes, setChanges] = useState<boolean>(false);

  const getJobs = async () => {
    try {
      const response = await userController.getJobs();

      setJobs(response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur s'est produite";

      toast.error(errorMessage);
    }
  };

  const handleCreateRole = async () => {
    try {
      setLoading(true);

      const response = await userController.createJob(newJob);

      setShowCreateModal(false);
      setChanges(!changes);
      toast.success(response.message);
    } catch (error) {
      console.log(error);
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur s'est produite";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
  }, [changes]);

  return (
    <section className="h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold">Gestion des taches</h1>
          <p className="font-light text-sm">
            Organisez toutes les taches dans cet onglet grâce à un système de
            filtre et d'attribution
          </p>
        </div>

        <button
          className="bg-green-600 text-white shadow text-xs py-2 px-4 rounded cursor-pointer"
          onClick={() => setShowCreateModal(true)}
        >
          + Créer un rôle
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border-b">Date de création</th>
              <th className="p-2 border-b">Nom du rôle</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} className="hover:bg-gray-50">
                <td className="p-2 border-b">
                  {new Date(job.createdAt ?? "").toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="p-2 border-b">{job.name}</td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-gray-400 p-4">
                  Aucun rôle trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-md w-full max-w-md text-sm space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-base">Nouveau rôle</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-black text-sm"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              placeholder="Nom du rôle"
              className="w-full px-2 py-1 rounded-md border shadow-sm text-xs focus:outline-none"
              value={newJob}
              onChange={(e) => setNewJob(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-xs bg-gray-200 px-3 py-1 rounded cursor-pointer"
              >
                Annuler
              </button>
              {loading ? (
                <MyLoader />
              ) : (
                <button
                  onClick={handleCreateRole}
                  className="text-xs bg-green-600 text-white px-3 py-1 rounded cursor-pointer"
                >
                  Créer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

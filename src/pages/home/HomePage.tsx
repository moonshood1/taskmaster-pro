import { taskController } from "@/api/taskController";
import { userController } from "@/api/userController";
import { type Priority, type Status, type Task } from "@/interfaces/Task";
import type { User } from "@/interfaces/User";
import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { TaskCard } from "./components/TaskCard";
import MyLoader from "@/components/myui/MyLoader";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [searchData, setSearchData] = useState<
    Record<string, string | number | boolean>
  >({});
  const [researchReset, setResearchReset] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "",
    priority: "",
    assignedTo: "",
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const onPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  const editModalRef = useRef<HTMLDialogElement>(null);

  const onOpenEditModal = (task: Task) => {
    setSelectedTask(task);
  };

  const onCloseModal = () => {
    editModalRef.current?.close();
    setSelectedTask(null);
  };

  const getFilteredTasks = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      setLoading(true);

      const chain = Object.entries(searchData)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");

      const response = await taskController.getTasks({
        params: chain,
      });

      setTasks(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getTasks = async () => {
    try {
      setLoading(true);
      const response = await taskController.getTasks({
        params: `page=${page}`,
      });

      setTasks(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur s'est produite";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPriotities = async () => {
    try {
      const response = await taskController.getPriorities();

      console.log(response);
      setPriorities(response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur s'est produite";

      toast.error(errorMessage);
    }
  };
  const getStatuses = async () => {
    try {
      const response = await taskController.getStatuses();

      setStatuses(response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur s'est produite";

      toast.error(errorMessage);
    }
  };
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

  const handleCreateTask = async () => {
    try {
      setLoading(true);
      const reponse = await taskController.createTask({ data: newTask });

      toast.success(reponse.message);
      setShowCreateModal(false);
      changeResearchReset();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur s'est produite";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async () => {
    try {
      if (!selectedTask) return;
      setLoading(true);

      const reponse = await taskController.updateTask({
        id: selectedTask?._id,
        data: selectedTask,
      });

      toast.success(reponse.message);
      onCloseModal();
      changeResearchReset();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur s'est produite";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const changeResearchReset = () => {
    setResearchReset((prev) => !prev);
    setSearchData({});
  };

  useEffect(() => {
    getTasks();
    getPriotities();
    getUsers();
    getStatuses();
  }, [researchReset, page]);

  useEffect(() => {
    if (selectedTask && editModalRef.current) {
      editModalRef.current.showModal();
    }
  }, [selectedTask]);

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
          + Créer une tâche
        </button>
      </div>

      <section className="card bg-base-100 shadow p-4 my-4">
        <form
          key={researchReset.toString()}
          onSubmit={getFilteredTasks}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 items-end">
            <label className="flex items-center gap-2 border rounded-md shadow-sm px-2 py-1">
              <SearchIcon className="w-3 h-3 text-gray-500" />
              <input
                type="search"
                placeholder="Rechercher"
                className="grow text-xs focus:outline-none bg-transparent"
                onChange={(e) =>
                  setSearchData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </label>

            <select
              defaultValue=""
              className="w-full px-2 py-1 rounded-md border shadow-sm text-xs focus:outline-none"
              onChange={(e) =>
                setSearchData((prev) => ({
                  ...prev,
                  assignedTo: e.target.value,
                }))
              }
            >
              <option value="">-- Assignée à --</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
              <option value="null">Non assignée</option>
            </select>

            <select
              defaultValue=""
              className="w-full px-2 py-1 rounded-md border shadow-sm text-xs focus:outline-none"
              onChange={(e) =>
                setSearchData((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="">-- Statut --</option>
              {statuses.map((status) => (
                <option key={status._id} value={status._id}>
                  {status.label}
                </option>
              ))}
            </select>

            <select
              defaultValue=""
              className="w-full px-2 py-1 rounded-md border shadow-sm text-xs focus:outline-none"
              onChange={(e) =>
                setSearchData((prev) => ({
                  ...prev,
                  createdBy: e.target.value,
                }))
              }
            >
              <option value="">-- Créée par --</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>

            <select
              defaultValue=""
              className="w-full px-2 py-1 rounded-md border shadow-sm text-xs focus:outline-none"
              onChange={(e) =>
                setSearchData((prev) => ({
                  ...prev,
                  priority: e.target.value,
                }))
              }
            >
              <option value="">-- Priorité --</option>
              {priorities.map((priority) => (
                <option key={priority._id} value={priority._id}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="btn btn-xs bg-black text-white shadow-sm py-2 px-4 rounded cursor-pointer"
            >
              Filtrer
            </button>
            <button
              type="button"
              onClick={changeResearchReset}
              className="btn btn-xs bg-gray-300 text-black shadow-sm py-2 px-4 rounded cursor-pointer"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </section>

      <section className="pb-10">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <MyLoader />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-sm font-extralight">Aucun résultat</div>
        ) : (
          <>
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={() => onOpenEditModal(task)}
              />
            ))}

            <div className="flex justify-center mt-6 space-x-2 text-sm">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className={`px-3 py-1 rounded border ${
                  page === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                Précédent
              </button>

              <span className="px-3 py-1 border rounded bg-gray-100">
                Page {page} / {totalPages}
              </span>

              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded border ${
                  page === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                Suivant
              </button>
            </div>
          </>
        )}
      </section>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-md w-full max-w-md text-sm space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-base">Nouvelle tâche</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-black text-sm"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              placeholder="Titre"
              className="w-full px-2 py-1 rounded-md border shadow-sm text-xs focus:outline-none"
              value={newTask.title}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, title: e.target.value }))
              }
            />

            <textarea
              placeholder="Description"
              className="w-full px-2 py-1 rounded-md border shadow-sm text-xs focus:outline-none"
              value={newTask.description}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, description: e.target.value }))
              }
            />

            <input
              type="date"
              className="w-full px-2 py-1 rounded-md border shadow-sm text-xs focus:outline-none"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, dueDate: e.target.value }))
              }
            />

            <select
              className="w-full px-2 py-1 rounded-md border shadow-sm text-xs focus:outline-none"
              value={newTask.status}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="">-- Statut --</option>
              {statuses.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.label}
                </option>
              ))}
            </select>

            <select
              className="w-full px-2 py-1 rounded-md border shadow-sm text-xs focus:outline-none"
              value={newTask.priority}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, priority: e.target.value }))
              }
            >
              <option value="">-- Priorité --</option>
              {priorities.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              className="w-full px-2 py-1 rounded-md border shadow-sm text-xs focus:outline-none"
              value={newTask.assignedTo}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, assignedTo: e.target.value }))
              }
            >
              <option value="">-- Assignée à --</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
              <option value="null">Non assignée</option>
            </select>

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-xs bg-gray-200 px-3 py-1 rounded cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateTask}
                className="text-xs bg-green-600 text-white px-3 py-1 rounded cursor-pointer"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedTask && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-md w-full max-w-md text-sm space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-base">Modifier la tâche</h2>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-500 hover:text-black text-sm"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateTask();
              }}
              className="space-y-2"
            >
              <input
                type="text"
                defaultValue={selectedTask.title}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, title: e.target.value })
                }
                placeholder="Titre"
                className="w-full border rounded-md px-2 py-1 shadow-sm text-xs"
                required
              />

              <textarea
                defaultValue={selectedTask.description}
                onChange={(e) =>
                  setSelectedTask({
                    ...selectedTask,
                    description: e.target.value,
                  })
                }
                placeholder="Description"
                className="w-full border rounded-md px-2 py-1 shadow-sm text-xs"
                required
              />

              <input
                type="date"
                defaultValue={selectedTask.dueDate?.split("T")[0]}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, dueDate: e.target.value })
                }
                className="w-full border rounded-md px-2 py-1 shadow-sm text-xs"
                required
              />

              <select
                className="w-full border rounded-md px-2 py-1 shadow-sm text-xs"
                value={selectedTask.status._id}
                onChange={(e) =>
                  setSelectedTask({
                    ...selectedTask,
                    status: { ...selectedTask.status, _id: e.target.value },
                  })
                }
              >
                {statuses.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.label}
                  </option>
                ))}
              </select>

              <select
                className="w-full border rounded-md px-2 py-1 shadow-sm text-xs"
                value={selectedTask.priority._id}
                onChange={(e) =>
                  setSelectedTask({
                    ...selectedTask,
                    priority: { ...selectedTask.priority, _id: e.target.value },
                  })
                }
              >
                {priorities.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                className="w-full border rounded-md px-2 py-1 shadow-sm text-xs"
                value={selectedTask.assignedTo?._id ?? "null"}
                onChange={(e) =>
                  setSelectedTask({
                    ...selectedTask,
                    assignedTo:
                      e.target.value === "null"
                        ? null
                        : { ...selectedTask.assignedTo!, _id: e.target.value },
                  })
                }
              >
                <option value="null">Non assignée</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.firstName} {u.lastName}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  className="bg-gray-300 text-white shadow text-xs py-2 px-4 rounded cursor-pointer"
                  onClick={onCloseModal}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white shadow text-xs py-2 px-4 rounded cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

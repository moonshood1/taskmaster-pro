import { Badge } from "@/components/ui/badge";
import type { Task } from "@/interfaces/Task";
import { motion } from "framer-motion";

export function TaskCard({
  task,
  onClick,
}: {
  task: Task;
  onClick?: () => void;
}) {
  return (
    <motion.div
      className="border rounded-xl p-4 shadow-sm bg-white text-sm space-y-2 my-5 cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-medium truncate">{task.title}</h3>
        <Badge
          style={{ backgroundColor: task.status.color }}
          className="text-white"
        >
          {task.status.label}
        </Badge>
      </div>

      <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>

      <div className="flex justify-between flex-wrap gap-2 text-xs text-gray-500">
        <div>
          <span className="font-medium text-gray-700">Date butoire :</span>{" "}
          {new Date(task.dueDate).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <div>
          <span className="font-medium text-gray-700">Assigné à :</span>{" "}
          {task.assignedTo
            ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}`
            : "Non assignée"}
        </div>
      </div>

      <div className="flex justify-between items-center mt-1">
        <Badge
          style={{ backgroundColor: task.priority.color }}
          className="text-white"
        >
          {task.priority.name}
        </Badge>
        <span className="text-xs text-gray-400">
          par {task.creator.firstName} {task.creator.lastName}
        </span>
      </div>
    </motion.div>
  );
}

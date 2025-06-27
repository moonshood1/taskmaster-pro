import { useUIStore } from "@/store";

function UISwitch() {
  const useMUI = useUIStore((s) => s.useMUI);
  const setUseMUI = useUIStore((s) => s.setUseMUI);

  const toggleUI = () => {
    setUseMUI(!useMUI);
  };

  return (
    <div className="absolute top-4 right-6 flex items-center gap-2 select-none bg-gray-300 px-3 py-2 rounded">
      <span className="text-sm text-white">ShadCN</span>
      <button
        type="button"
        onClick={toggleUI}
        aria-pressed={useMUI}
        className={`w-10 h-5 rounded-full relative transition-colors duration-300 cursor-pointer ${
          useMUI ? "bg-black" : "bg-red-900"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
            useMUI ? "translate-x-5" : ""
          }`}
        />
      </button>
      <span className="text-sm text-white">MUI</span>
    </div>
  );
}

export default UISwitch;

import { useUIStore } from "@/store";
import { TextField as MUITextField } from "@mui/material";

type MyInputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  error?: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function MyInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  error,
  onChange,
}: MyInputProps) {
  const useMUI = useUIStore((state) => state.useMUI);

  if (useMUI) {
    return (
      <div>
        <MUITextField
          fullWidth
          label={label}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          error={Boolean(error)}
          helperText={error}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              borderColor: error ? "#f87171" : "#1E3A8A",
            },
            "& label.Mui-focused": {
              color: "#1E3A8A",
            },
            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
              borderColor: "#1E3A8A",
            },
          }}
        />
      </div>
    );
  } else {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-700">
          {label}
        </label>
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          className={`mt-1 w-full px-3 py-2 text-xs border rounded-md shadow-sm focus:outline-none ${
            error ? "border-2 border-red-500" : "border-gray-300"
          }`}
          value={value}
          onChange={onChange}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
}

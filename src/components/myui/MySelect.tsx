import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";
import {
  Select as MUISelect,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

type MySelectProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string | null;
};

export function MySelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  error,
}: MySelectProps) {
  const useMUI = useUIStore((s) => s.useMUI);

  if (useMUI) {
    return (
      <FormControl fullWidth sx={{ my: 2 }} error={!!error}>
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <MUISelect
          labelId={`${name}-label`}
          name={name}
          value={value}
          label={label}
          onChange={(e) =>
            onChange({
              target: {
                name: e.target.name,
                value: e.target.value,
              },
            } as React.ChangeEvent<HTMLSelectElement>)
          }
          sx={{
            borderRadius: 2,
            backgroundColor: "#f5f5f5",
          }}
        >
          {placeholder && (
            <MenuItem value="" disabled>
              {placeholder}
            </MenuItem>
          )}
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </MUISelect>
      </FormControl>
    );
  }

  return (
    <div className="w-full mt-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        defaultValue=""
        className={cn(
          "mt-1 w-full text-xs px-3 py-2 border rounded-md shadow-sm focus:outline-none",
          error ? "border-2 border-red-500" : "border-gray-300"
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

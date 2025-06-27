import { useUIStore } from "@/store";
import { Button as ShadButton } from "@/components/ui/button";
import { Button as MUIButton } from "@mui/material";

export function MyButton(props: any) {
  const useMUI = useUIStore((state) => state.useMUI);
  const { disabled, children, ...rest } = props;

  const shadcnClass = `w-full py-2 px-4 text-white rounded-md transition ${
    disabled
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-black hover:bg-neutral-800 cursor-pointer"
  }`;

  const muiSx = {
    width: "100%",
    padding: "8px 16px",
    color: "white",
    borderRadius: 2,
    transition: "background-color 0.3s",
    backgroundColor: disabled ? "gray" : "#1E3A8A",
    cursor: disabled ? "not-allowed" : "pointer",
    "&:hover": {
      backgroundColor: disabled ? "gray" : "#162C5A",
    },
  };

  if (useMUI) {
    return (
      <MUIButton variant="contained" disabled={disabled} sx={muiSx} {...rest}>
        {children}
      </MUIButton>
    );
  } else {
    return (
      <ShadButton className={shadcnClass} disabled={disabled} {...rest}>
        {children}
      </ShadButton>
    );
  }
}

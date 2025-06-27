import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authController } from "@/api/authController";
import UISwitch from "../global/SwitchUI";
import type { LoginDto } from "@/interfaces/Auth";
import { toast } from "react-toastify";
import { MyInput } from "@/components/myui/MyInput";
import { MyButton } from "@/components/myui/MyButton";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginDto>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoginDto, string>>>(
    {}
  );

  const validateForm = () => {
    const newErrors: Partial<Record<keyof LoginDto, string>> = {};
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "L'adresse email est obligatoire";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse email valide";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est obligatoire";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setErrors((prev) => ({ ...prev }));
    setIsLoading(true);

    try {
      const response = await authController.login(formData);
      toast.success(response.message);

      navigate("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur s'est produite lors de la connexion";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center h-screen py-10 bg-gray-100">
      <UISwitch />

      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-md">
        <div className="flex justify-center">
          <img
            src="/logo_full.png"
            alt="logo taskmaster"
            className="max-w-[150px]"
          />
        </div>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <MyInput
            label="Email"
            name="email"
            type="email"
            placeholder="vous@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <MyInput
            label="Mot de passe"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <MyButton type="submit" disabled={isLoading}>
            {isLoading ? "Connexion..." : "Se connecter"}
          </MyButton>
        </form>
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-600">
            Pas encore de compte ?
            <span className="text-black font-bold hover:underline">
              <Link to={"/register"}> Créer un compte</Link>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

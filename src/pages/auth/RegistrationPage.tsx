import { Link, useNavigate } from "react-router-dom";
import UISwitch from "../global/SwitchUI";
import { useEffect, useState } from "react";
import type { RegistrationDto } from "@/interfaces/Auth";
import { authController } from "@/api/authController";
import { toast } from "react-toastify";
import type { Job } from "@/interfaces/User";
import { userController } from "@/api/userController";
import { MyButton } from "@/components/myui/MyButton";
import { MyInput } from "@/components/myui/MyInput";
import { MySelect } from "@/components/myui/MySelect";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [formData, setFormData] = useState<RegistrationDto>({
    email: "",
    lastName: "",
    firstName: "",
    password: "",
    confirmPassword: "",
    job: "",
  });

  const getJobs = async () => {
    const response = await userController.getJobs();
    setJobs(response.data);
  };

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegistrationDto, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegistrationDto, string>> = {};
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "L'adresse email est obligatoire";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse email valide";
      isValid = false;
    }

    if (!formData.firstName) {
      newErrors.firstName = "Le prénom est obligatoire";
      isValid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = "Le nom est obligatoire";
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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      isValid = false;
    }

    if (!formData.job) {
      newErrors.job = "Le métier est obligatoire";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authController.register(formData);
      toast.success(response.message);
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur s'est produite lors de l'inscription";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  return (
    <section className="flex items-center justify-center h-full py-10 bg-gray-100">
      <UISwitch />
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-md">
        <div className="flex justify-center">
          <img
            src="/logo_full.png"
            alt="logo taskmaster"
            className="max-w-[150px]"
          />
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <MyInput
            label="Prénoms"
            name="text"
            type="text"
            placeholder="Votre prénom"
            value={formData.firstName}
            onChange={handleInputChange}
            error={errors.firstName}
          />
          <MyInput
            label="Nom"
            name="text"
            type="text"
            placeholder="Votre nom"
            value={formData.lastName}
            onChange={handleInputChange}
            error={errors.lastName}
          />

          <MyInput
            label="Email"
            name="email"
            type="email"
            placeholder="vous@example.com"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
          />

          <MySelect
            label="Rôle"
            name="job"
            value={formData.job}
            onChange={handleSelectChange}
            error={errors.job}
            placeholder="Sélectionnez un rôle"
            options={jobs.map((job) => ({
              value: job._id,
              label: job.name,
            }))}
          />

          <MyInput
            label="Mot de passe"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
          />

          <MyInput
            label="Confirmation du mot de passe"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
          />

          <MyButton type="submit" disabled={isLoading}>
            {isLoading ? "Enregistrement..." : "S'enregistrer"}
          </MyButton>
        </form>
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-600">
            Vous possédez déjà un compte ?{" "}
            <span className="text-black font-bold hover:underline">
              <Link to={"/login"}>Se connecter</Link>
            </span>{" "}
          </p>
        </div>
      </div>
    </section>
  );
}

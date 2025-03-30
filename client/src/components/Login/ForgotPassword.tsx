import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import toast from "react-hot-toast";

interface ForgotPasswordInputs {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

function ForgotPassword({
  setForgetPassword,
}: {
  setForgetPassword: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, _] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordInputs>();

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = async (data) => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/forgotpassword`,
        { email: data.email, new_password: data.newPassword }
      );
      toast.success("Password updated successfully!");
      setForgetPassword(false);
    } catch (error) {
      toast.error("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setForgetPassword((prev) => !prev)}
        className="mb-4 text-blue-600 hover:underline bg-blue-100 p-2 rounded-md"
      >
        Go Back
      </button>
      <p className="text-red-500 text-center mb-3">{error}</p>
      <form
        className="space-y-5 animate__animated animate__fadeIn"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            <EmailIcon
              className="absolute right-4 top-3.5 text-gray-400"
              fontSize="small"
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        {/* New Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              {...register("newPassword", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/,
                  message:
                    "Must include uppercase, lowercase, number, and special character",
                },
              })}
            />
            {showPassword ? (
              <VisibilityOff
                className="absolute right-4 top-3.5 text-gray-400 cursor-pointer"
                fontSize="small"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <Visibility
                className="absolute right-4 top-3.5 text-gray-400 cursor-pointer"
                fontSize="small"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>
          {errors.newPassword && (
            <span className="text-red-500 text-sm">
              {errors.newPassword.message}
            </span>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
              })}
            />
            {showConfirmPassword ? (
              <VisibilityOff
                className="absolute right-4 top-3.5 text-gray-400 cursor-pointer"
                fontSize="small"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            ) : (
              <Visibility
                className="absolute right-4 top-3.5 text-gray-400 cursor-pointer"
                fontSize="small"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            )}
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl ${
            loading ? `cursor-not-allowed` : ``
          }`}
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;

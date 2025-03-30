import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Importing MUI icons

// Define the form data type
type FormData = {
  current_password: string;
  new_password: string;
  confirmPassword: string;
};

function RestPassword() {
  const [isPasswordKnown, setIsPasswordKnown] = useState(true); // State to toggle between known or unknown password
  const [loading, setLoading] = useState(false); // State for loading
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // Toggle current password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle confirm password visibility

  // Initialize react-hook-form with type for form data
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { confirmPassword, ...dataToSend } = data;
    
    try {
      setLoading(true);
      // Send data to backend using Axios (only currentPassword and newPassword)
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/profile/update/password`, dataToSend, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem("token")}`,
        },
      });
      alert('done');
    } catch (error) {
      console.error("Error updating password:", error);
      alert("An error occurred while updating the password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Change Password */}
      <div className="bg-[#000a26] border border-neutral-200/20 rounded-lg p-6 mt-6">
        <h2 className="text-lg font-semibold mb-6 text-white">Change Password</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Conditionally render current password field */}
          {isPasswordKnown && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Current Password
              </label>
              <input
                type={showCurrentPassword ? "text" : "password"}
                className="w-full px-4 py-2 border border-neutral-200/60 rounded-lg pr-10 outline-none" // Add padding to the right for icon space
                disabled={!isPasswordKnown}
                {...register("current_password", { required: isPasswordKnown })}
              />
              <div
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500 pt-5"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
              </div>
              {errors.current_password && (
                <p className="text-red-500 text-xs mt-1">This field is required</p>
              )}
            </div>
          )}

          {/* New Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              className="w-full px-4 py-2 border border-neutral-200/60 rounded-lg pr-10 outline-none" 
              {...register("new_password", {
                required: "Enter a new password!",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/,
                  message:
                    "Password must contain at least one uppercase, one lowercase, one number, and one special character",
                },
              })}
            />
            <div
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500 pt-5"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <VisibilityOff /> : <Visibility />}
            </div>
            {errors.new_password && (
              <p className="text-red-500 text-xs mt-1">{errors.new_password.message}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full px-4 py-2 border border-neutral-200/60 rounded-lg pr-10 outline-none"
              {...register("confirmPassword", {
                required: true,
                validate: (value) =>
                  value === watch("new_password") || "Passwords don't match",
              })}
            />
            <div
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500 pt-5"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message || "This field is required"}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            {/* Reset Password Button */}
            {!isPasswordKnown ? (
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                disabled={loading}
              >
                {loading ? "Processing..." : "Reset Password"}
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            )}
          </div>
        </form>

        {/* Toggle Password Known State */}
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm text-blue-500 hover:text-blue-600"
            onClick={() => setIsPasswordKnown(!isPasswordKnown)}
          >
            {isPasswordKnown
              ? "Forgot your password? Reset it"
              : "Back to change password"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestPassword;

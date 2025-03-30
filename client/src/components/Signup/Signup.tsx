import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authState } from "../../recoil";
import { useSetRecoilState } from "recoil";
import GoogleIcon from "@mui/icons-material/Google";
import { useGoogleLogin } from "@react-oauth/google";

type Inputs = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function Signup() {
  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(authState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [signupBtnLoader, setSignupBtnLoader] = useState(false);
  const [googleSignupBtnLoader, setGoogleSignupBtnLoader] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setSignupBtnLoader(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/signup`,
        data
      );

      if (response.data.token) {
        setAuthState({
          id: response.data.id,
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          email: response.data.email,
          avatar: response.data.avatar,
          isAuthenticated: true,
        });
        localStorage.setItem("token", `Bearer ${response.data.token}`);
        setTimeout(() => {
          navigate("/");
        }, 500);
      }
    } catch (error: unknown) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "An error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setSignupBtnLoader(false);
    }
  };

  const password = watch("password");

  const responseGoogle = async (authResult: any) => {
    setGoogleSignupBtnLoader(true);
    try {
      if (authResult.code) {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/google_auth/signup?code=${
            authResult.code
          }`
        );
        if (response.data.token) {
          setAuthState({
            id: response.data.id,
            firstname: response.data.firstname,
            lastname: response.data.lastname,
            email: response.data.email,
            avatar: response.data.avatar,
            isAuthenticated: true,
          });
          localStorage.setItem("token", `Bearer ${response.data.token}`);
          setTimeout(() => {
            navigate("/");
          }, 500);
        }
      }
    } catch (error: unknown) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "An error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setGoogleSignupBtnLoader(false);
    }
  };

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div>
      <p className="text-red-500 text-center mb-3">{error}</p>
      <form
        id="signupForm"
        className="space-y-5 animate__animated animate__fadeIn"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Firstname and Lastname Fields */}
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="John"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                {...register("firstname", {
                  required: "First Name is required",
                  minLength: {
                    value: 2,
                    message: "First Name must be at least 2 characters",
                  },
                })}
              />
              <PersonIcon
                className="absolute right-4 top-3.5 text-gray-400"
                fontSize="small"
              />
            </div>
            {errors.firstname && (
              <span className="text-red-500">{errors.firstname.message}</span>
            )}
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Doe"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                {...register("lastname")}
              />
              <PersonIcon
                className="absolute right-4 top-3.5 text-gray-400"
                fontSize="small"
              />
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="EventHub@gmail.com"
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
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="EventHub@123"
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              {...register("password", {
                required: "Password is required",
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
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="EventHub@123"
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
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
            <span className="text-red-500">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl ${
            signupBtnLoader ? `cursor-not-allowed` : ``
          }`}
        >
          <span>{signupBtnLoader ? "Please wait" : "Sign Up"}</span>
        </button>

        {/* Google Sign-Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className={`w-full py-3 px-4 mt-1 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl ${
            googleSignupBtnLoader ? `cursor-not-allowed` : ``
          }`}
        >
          <GoogleIcon className="mr-2" />
          {googleSignupBtnLoader ? "Please wait" : "Sign Up with Google"}
        </button>
      </form>
    </div>
  );
}

export default Signup;

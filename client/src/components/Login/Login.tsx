import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authState } from "../../recoil";
import { useSetRecoilState } from "recoil";
import GoogleIcon from "@mui/icons-material/Google";
import { useGoogleLogin } from "@react-oauth/google";
import PersonIcon from "@mui/icons-material/Person";
import ForgotPassword from "./ForgotPassword";

type LoginInputs = {
  email: string;
  password: string;
};

function Login() {
  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(authState);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loginBtnLoader, setLoginBtnLoader] = useState(false);
  const [googleLoginBtnLoader, setGoogleLoginBtnLoader] = useState(false);
  const [guestLoginBtnLoader, setGuestloginBtnLoader] = useState(false);
  const [forgetPassword,setForgetPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (data: LoginInputs, isGuest: boolean = false) => {
    if (!isGuest) {
      setLoginBtnLoader(true);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
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
      if (!isGuest) {
        setLoginBtnLoader(false);
      }
    }
  };

  // Regular Login Submission
  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    await handleLogin(data, false);
  };

  // Guest Login
  const handleGuestLogin = async () => {
    const guestCredentials = {
      email: "jane@gmail.com",
      password: "Jane@123",
    };
    setGuestloginBtnLoader(true);
    try {
      await handleLogin(guestCredentials, true);
    } catch (error) {
      console.error(error);
    } finally {
      setGuestloginBtnLoader(false);
    }
  };

  const responseGoogle = async (authResult: any) => {
    setGoogleLoginBtnLoader(true);
    try {
      if (authResult.code) {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/google_auth/login?code=${
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
      setGoogleLoginBtnLoader(false);
    }
  };

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  if(forgetPassword){
    return <ForgotPassword setForgetPassword={setForgetPassword}/>
  }

  return (
    <div>
      <p className="text-red-500 text-center mb-3">{error}</p>
      <form
        id="loginForm"
        className="space-y-5 animate__animated animate__fadeIn"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Email Address Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Remember Me and Forgot Password */}
        <div className="flex items-center justify-end">
          <p className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer" onClick={()=>setForgetPassword(true)}>
            Forgot password?
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl ${
            loginBtnLoader ? `cursor-not-allowed` : ``
          }`}
        >
          <span>{loginBtnLoader ? "Please wait" : "Log In"}</span>
        </button>

        {/* Google Sign-Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className={`w-full py-3 px-4 mt-1 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl ${
            googleLoginBtnLoader ? `cursor-not-allowed` : ``
          }`}
        >
          <GoogleIcon className="mr-2" />
          <span>
            {googleLoginBtnLoader ? "Please wait" : "Login In with Google"}
          </span>
        </button>
      </form>
      <div className="divider my-4">OR</div>
      <button
        type="button"
        onClick={handleGuestLogin}
        className={`w-full py-3 px-4 bg-neutral-700 hover:bg-neutral-900 text-white rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl ${
          guestLoginBtnLoader ? `cursor-not-allowed` : ``
        }`}
      >
        <PersonIcon className="mr-2" />
        <span>{guestLoginBtnLoader ? "Please wait" : "Login as Guest"}</span>
      </button>
      <p className="text-center py-2">Some features won’t work in guest mode.<span className="text-red-500">*</span></p>
    </div>
  );
}

export default Login;

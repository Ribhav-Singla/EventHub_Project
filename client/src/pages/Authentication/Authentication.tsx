import { useEffect, useState } from "react";
import Login from "../../components/Login/Login";
import Signup from "../../components/Signup/Signup";

function Authentication() {
  const [isLogin, setIsLogin] = useState(true);

  const handleTabSwitch = (tab: string) => {
    setIsLogin(tab === "login");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <section
        id="authentication"
        className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 pt-28"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              {/* Left Column - Image/Banner */}
              <div className="md:w-1/2 bg-neutral-800 relative hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-neutral-900/90"></div>
                <div className="absolute inset-0 flex flex-col justify-center px-12">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Welcome to EventHub
                  </h2>
                  <p className="text-gray-300">
                    Join our community to discover and create extraordinary
                    events.
                  </p>
                </div>
              </div>

              {/* Right Column - Auth Forms */}
              <div className="md:w-1/2 p-8 md:p-12">
                <div className="mb-8 text-center">
                  <div className="flex justify-center gap-4 mb-8">
                    <button
                      onClick={() => handleTabSwitch("login")}
                      className={`px-6 py-2 font-semibold ${
                        isLogin
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 border-b-2 border-transparent"
                      }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => handleTabSwitch("signup")}
                      className={`px-6 py-2 font-semibold ${
                        !isLogin
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 border-b-2 border-transparent"
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>

                {/* Login Form */}
                {isLogin && <Login />}

                {/* Signup Form */}
                {!isLogin && <Signup />}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Authentication;

import { useRecoilState } from "recoil";
import { authState } from "../../recoil";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import toast from "react-hot-toast";
import { stringAvatar } from "../../utils";

function Navbar() {
  const navigate = useNavigate();
  const [auth, setAuth] = useRecoilState(authState);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleAuthAction = () => {
    if (auth.isAuthenticated) {
      setAuth({
        id: "",
        firstname: "",
        lastname: "",
        email: "",
        avatar: "",
        isAuthenticated: false,
      });
      localStorage.removeItem("token");
    } else {
      navigate("/auth");
    }
    closeMobileMenu();
  };

  return (
    <div>
      <nav id="navbar" className="fixed w-full z-50 bg-[#000a26] text-white border-b border-neutral-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a onClick={() => navigate("/")} className="text-xl font-bold font-montserrat">
                EventHub
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                onClick={() => navigate("/")}
                className="hover:text-blue-500 transition-colors duration-300 cursor-pointer"
              >
                Home
              </a>
              <a
                onClick={() => navigate("/event/all")}
                className="hover:text-blue-500 transition-colors duration-300 cursor-pointer"
              >
                Events
              </a>
              {auth.isAuthenticated ? (
                <a
                  onClick={() => {
                    setTimeout(() => {
                      navigate("/dashboard");
                    }, 1000);
                    toast("Redirecting to dashboard...", { duration: 1000 });
                  }}
                  className="hover:text-blue-500 transition-colors duration-300 cursor-pointer"
                >
                  Dashboard
                </a>
              ) : (
                ""
              )}

              {auth.isAuthenticated && (
                <>
                  <Avatar
                    {...stringAvatar(`${auth.firstname} ${auth.lastname}`)}
                  />
                  <span>
                    {auth.firstname} {auth?.lastname}
                  </span>
                </>
              )}
              <button
                onClick={handleAuthAction}
                className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                {auth.isAuthenticated ? "Logout" : "Sign In"}
              </button>
            </div>
            <div className="md:hidden flex items-center">
              <button
                id="mobile-menu-button"
                className="text-white hover:text-blue-500"
                onClick={toggleMobileMenu}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div
            id="mobile-menu"
            className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                onClick={() => {
                  navigate("/");
                  closeMobileMenu();
                }}
                className="block px-3 py-2 rounded-md hover:bg-neutral-700 cursor-pointer"
              >
                Home
              </a>
              <a
                onClick={() => {
                  navigate("/event/all");
                  closeMobileMenu();
                }}
                className="block px-3 py-2 rounded-md hover:bg-neutral-700 cursor-pointer"
              >
                Events
              </a>
              {auth.isAuthenticated && (
                <a
                  onClick={() => {
                    toast("Redirecting to dashboard...", { duration: 1000 });
                    setTimeout(() => {
                      navigate("/dashboard");
                    }, 1000);
                    closeMobileMenu();
                  }}
                  className="block px-3 py-2 rounded-md hover:bg-neutral-700 cursor-pointer"
                >
                  Dashboard
                </a>
              )}
              {auth.isAuthenticated && (
                <div className="flex items-center gap-4 py-2 px-3">
                  <Avatar
                    {...stringAvatar(`${auth.firstname} ${auth.lastname}`)}
                  />
                  <span>
                    {auth.firstname} {auth?.lastname}
                  </span>
                </div>
              )}
              <button
                onClick={handleAuthAction}
                className="block w-full text-left px-3 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {auth.isAuthenticated ? "Logout" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;

import { useState, useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom"; // Import Link from react-router-dom
import { useRecoilValue } from "recoil";
import { authState } from "../../recoil";
import { Avatar } from "@mui/material";
import { stringAvatar } from "../../utils";

function Dashboard() {
  const auth = useRecoilValue(authState);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [activeLink, setActiveLink] = useState("/dashboard/overview");
  const navigate = useNavigate();

  useEffect(() => {
    setActiveLink("/dashboard/overview");
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const handleNavClick = (to: string) => {
    setActiveLink(to);
  };

  const handleGoBack = () => {
    navigate(`/`);
  };

  return (
    <div className="bg-[#E5E7EB]">
      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="fixed h-screen w-64 bg-[#000a26] border-r border-neutral-200/20 hidden lg:block">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-[22px] border-b border-neutral-200/20">
              <span className="text-xl font-bold text-white">EventHub</span>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 py-6 bg-[#000a26]">
              {[
                {
                  to: "/dashboard/overview",
                  label: "Overview",
                  icon: (
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      ></path>
                    </svg>
                  ),
                },
                {
                  to: "/dashboard/events",
                  label: "Events",
                  icon: (
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  ),
                },
                {
                  to: "/dashboard/analytics",
                  label: "Analytics",
                  icon: (
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      ></path>
                    </svg>
                  ),
                },
                {
                  to: "/dashboard/purchases",
                  label: "Purchases",
                  icon: (
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      ></path>
                    </svg>
                  ),
                },
                {
                  to: "/dashboard/profile",
                  label: "Profile",
                  icon: (
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                  ),
                },
                {
                  to: "/dashboard/publish",
                  label: "Publish",
                  icon: (
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 13l4-4m0 0l-4-4m4 4H3"
                      ></path>
                    </svg>
                  ),
                },
                {
                  to: "/dashboard/wishlist",
                  label: "Wishlist",
                  icon: (
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 21c-4.41 0-8-3.59-8-8V9a2 2 0 0 1 2-2h4V5a2 2 0 0 1 4 0v2h4a2 2 0 0 1 2 2v4c0 4.41-3.59 8-8 8z"
                      ></path>
                    </svg>
                  ),
                },
                {
                  to: "/dashboard/chat",
                  label: "Chat",
                  icon: (
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                  ),
                },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => handleNavClick(link.to)}
                  className={`flex items-center px-6 py-3 ${
                    activeLink === link.to
                      ? "text-white bg-[#0f52ba]"
                      : "text-white hover:bg-[#0f52ba]"
                  } transition-colors`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-200/20">
              <div className="flex items-center">
                <Avatar
                  {...stringAvatar(`${auth.firstname} ${auth.lastname}`)}
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {auth.firstname} {auth.lastname}
                  </p>
                  <p className="text-xs text-neutral-400">{auth.email}</p>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#000a26] border-b border-neutral-200/20 z-50">
          <div className="flex items-center justify-between p-4">
            <span className="text-xl font-bold text-white">Dashboard</span>
            <button
              onClick={toggleMobileMenu}
              className="rounded-lg p-2 hover:bg-neutral-100 bg-gray-300 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuVisible ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuVisible && (
            <div className="bg-[#000a26] border-t border-neutral-200/20">
              {[
                { to: "/dashboard/overview", label: "Overview" },
                { to: "/dashboard/events", label: "Events" },
                { to: "/dashboard/analytics", label: "Analytics" },
                { to: "/dashboard/purchases", label: "Purchases" },
                { to: "/dashboard/profile", label: "Profile" },
                { to: "/dashboard/wishlist", label: "Wishlist" },
                { to: "/dashboard/chat", label: "Chat" },
                { to: "/", label: "← Back to Home" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => {
                    handleNavClick(link.to);
                    toggleMobileMenu();
                  }}
                  className={`block px-4 py-3 ${
                    activeLink === link.to
                      ? "text-white bg-[#0f52ba]"
                      : "text-white hover:bg-[#0f52ba]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 ml-0 lg:ml-64 min-h-screen bg-[#E5E7EB]">
          {/* Header */}
          <header className="sticky top-0 bg-[#000a26] border-b border-neutral-200/20 z-40">
            <div className="flex items-center justify-between px-6 py-4">
              <h1 className="text-xl font-semibold lg:text-white text-[#000a26]">
                Dashboard
              </h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleGoBack}
                  className="p-2 lg:text-white lg:hover:bg-[#d6e6f2] lg:hover:text-neutral-800 text-[#000a26] rounded-lg"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 12H5m7-7l-7 7 7 7"
                    ></path>
                  </svg>
                </button>
                <button
                  className="flex items-center p-2 lg:hover:bg-[#d6e6f2] bg-[#000a26] lg:bg-gray-200 rounded-lg cursor-pointer-none lg:cursor-pointer"
                  onClick={handleGoBack}
                >
                  <span className="text-sm font-semibold lg:text-neutral-800 text-[#000a26]">
                    Back to Website
                  </span>
                </button>
              </div>
            </div>
          </header>
          {/* Add your main content here */}
          <div className="min-h-[calc(100vh-72px)]  overflow-y-auto bg-[#000a26]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

function Newsletter() {
  const [email, setEmail] = useState<string>("");
  const [btnLoader, setBtnLoader] = useState(false);

  const handleSubscription = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValidEmail = (email: string) => emailRegex.test(email);
    if (!isValidEmail(email)) {
      alert("Invalid email address");
      return;
    }
    setBtnLoader(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/newsletter`, {
        email,
      });

      toast.success("You have been subscribed to our newsletter");
    } catch (error) {
      console.error(error);
      toast.error("No user found!");
    } finally{
      setBtnLoader(false);
    }
  };

  return (
    <div>
      <section id="Newsletter" className="py-20 bg-[#000a26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute inset-0 bg-[#0f52ba] transform -skew-y-6 opacity-10"></div>
            <div className="relative max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-white mb-6 animate__animated animate__fadeIn">
                Stay Updated with Latest Events
              </h2>
              <p className="text-lg text-gray-300 mb-8 animate__animated animate__fadeIn animate__delay-1s">
                Subscribe to our newsletter and never miss your favorite events.
                Get exclusive offers and early bird tickets!
              </p>

              <form className="max-w-lg mx-auto animate__animated animate__fadeInUp animate__delay-2s">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 border-2 border-transparent bg-white/10 text-white placeholder-gray-400"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="button"
                    className={`px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center ${
                      btnLoader ? `cursor-not-allowed` : ``
                    }`}
                    onClick={handleSubscription}
                  >
                    <span>{btnLoader ? "Subscribing" : "Subscribe"}</span>
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              </form>

              <div className="mt-8 text-gray-400 text-sm flex flex-col sm:flex-row items-center justify-center gap-4 animate__animated animate__fadeIn animate__delay-3s">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Weekly Updates</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span>Secure Subscription</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>Instant Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Newsletter;

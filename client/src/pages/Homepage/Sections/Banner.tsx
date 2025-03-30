import { useNavigate } from "react-router-dom";

function Banner() {
  const navigate = useNavigate();
  return (
    <div>
      <section id="hero" className="relative h-screen bg-[#000a26]">
        <div className="absolute inset-0  opacity-90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjMDAwYTI2IiBkPSJNMCAwaDE0NDB2NzYwSDB6Ii8+PC9nPjwvc3ZnPg==')] bg-cover bg-center opacity-50"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white font-montserrat mb-6 animate__animated animate__fadeInDown">
            Discover Extraordinary Events
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl animate__animated animate__fadeInUp animate__delay-1s">
            Experience premium events with real-time organizer chat and an
            interactive dashboard for sales insights
          </p>
          <p
            className="inline-flex items-center cursor-pointer px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 animate__animated animate__fadeInUp animate__delay-2s"
            onClick={() => navigate("/event/all")}
          >
            Explore Events
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="waves"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shapeRendering="auto"
          >
            <defs>
              <path
                id="gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className="parallax">
              <use xlinkHref="#gentle-wave" x="48" y="0" fill="#0f52ba" />
              <use xlinkHref="#gentle-wave" x="48" y="3" fill="#a6c6d8" />
              <use xlinkHref="#gentle-wave" x="48" y="5" fill="#d6e6f2" />
              <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
            </g>
          </svg>

          <div className="absolute bottom-12 flex flex-col items-center animate-bounce mx-auto w-full">
            <span className="text-white text-sm mb-2">Scroll Down</span>
            <div className="w-6 h-10 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Banner;

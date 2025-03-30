import { useState, useRef, useEffect } from "react";

function ImageGallery({ images }: { images: string[] | File[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  
  // Update scroll position when activeIndex changes
  useEffect(() => {
    if (galleryRef.current) {
      const scrollPosition = galleryRef.current.clientWidth * activeIndex;
      galleryRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  const handleScroll = (direction: number) => {
    setActiveIndex((prevIndex) => {
      const newIndex = prevIndex + direction;
      if (newIndex < 0) return images.length - 1;
      if (newIndex >= images.length) return 0;
      return newIndex;
    });
  };

  // Touch handling for mobile swipe
  const touchStartX = useRef<number | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    // Swipe threshold (50px)
    if (Math.abs(diff) > 50) {
      handleScroll(diff > 0 ? 1 : -1);
    }
    
    touchStartX.current = null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg py-2 px-2 animate__fadeIn w-full min-w-[320px]">
      <h2 className="text-2xl font-bold text-neutral-800 bg-white p-4">
        Event Gallery
      </h2>
      <section
        id="ImageGalleryComponent"
        className="flex items-center justify-center bg-white px-4 mb-10 lg:mb-10 w-full"
      >
        <div className="w-full max-w-3xl mx-auto min-w-[300px]">
          <div className="relative">
            {/* Gallery Container */}
            <div className="overflow-hidden rounded-lg">
              <div
                ref={galleryRef}
                className="flex items-center gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory touch-pan-x"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                  // Force horizontal scroll on mobile
                  overflowX: 'auto',
                  // Prevent vertical scroll
                  overflowY: 'hidden'
                }}
              >
                {/* Gallery Images */}
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    className="flex-shrink-0 w-full snap-center min-w-full"
                  >
                    <img
                      src={`${
                        import.meta.env.VITE_STATIC_BACKEND_URL
                      }/${image}`}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full min-w-[500px] h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover rounded-lg"
                      style={{
                        // Ensure images don't shrink below min-width
                        minWidth: '500px'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <button
              onClick={() => handleScroll(-1)}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white p-2 sm:p-3 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 z-10"
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4 sm:w-6 sm:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              onClick={() => handleScroll(1)}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white p-2 sm:p-3 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 z-10"
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4 sm:w-6 sm:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-2">
              <div className="flex space-x-2 pb-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors flex-shrink-0 ${
                      activeIndex === index ? "bg-blue-500" : "bg-gray-300"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ImageGallery;
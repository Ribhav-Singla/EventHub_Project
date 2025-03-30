import React, { ChangeEvent } from "react";
import { eventState } from "../../../../recoil";
import { useRecoilState } from "recoil";

function EventImages() {
  const [eventData, setEventData] = useRecoilState(eventState);

  // Backend static URL
  const backendBaseURL = import.meta.env.VITE_STATIC_BACKEND_URL;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const newFiles = Array.from(files).filter((file) => {
        if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
          alert("Only JPEG, JPG, and PNG files are allowed.");
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert("File size exceeds 5MB. Please upload a smaller image.");
          return false;
        }
        return true;
      });

      if (newFiles.length + eventData.images.length > 4) {
        alert("You can only upload up to 4 images.");
        return;
      }

      setEventData((prev: any) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
      }));
    }
  };

  const handleImageRemove = (index: number, e: React.MouseEvent) => {
    e.preventDefault();

    setEventData((prev: any) => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index),
    }));

    // Optionally handle server-side removal
    const removedImage = eventData.images[index];
    if (typeof removedImage === "string") {
      console.log("Remove image from server:", removedImage);
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-300">Event Images</h2>
        <div className="border-2 border-dashed border-neutral-200/20 rounded-lg p-6 text-center">
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white p-1 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>Upload files</span>
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  accept="image/jpeg, image/jpg, image/png, image/webp"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <p className="text-xs text-gray-400">PNG, JPG, JPEG up to 5MB</p>
          </div>
        </div>
      </div>
      <p className="text-gray-400 text-right"><span className="text-red-500">*</span>Upload atleast 1 image</p>

      {/* Display uploaded and existing images */}
      {eventData.images.length > 0 && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {eventData.images.map((image: any, index) => {
            const isURL = typeof image === "string"; // Check if it's a backend image
            const fileURL = isURL
              ? `${backendBaseURL}/${image}` // Append backend URL
              : URL.createObjectURL(image); // Create object URL for File objects

            return (
              <div key={index} className="relative">
                <img
                  src={fileURL}
                  alt={isURL ? `Image ${index + 1}` : image.name}
                  className="w-full h-auto rounded-md object-cover"
                  onLoad={() => !isURL && URL.revokeObjectURL(fileURL)}
                />
                <button
                  onClick={(e) => handleImageRemove(index, e)}
                  className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default EventImages;

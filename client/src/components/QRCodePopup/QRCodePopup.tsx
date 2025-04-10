import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";

export default function QRCodePopup({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const [showPopup, setShowPopup] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const generateQRCode = () => {
    setShowPopup(true);
  };

  useEffect(() => {
    if (showPopup && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = 300;
      const height = 360;

      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#000000";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(title, width / 2, 30);

      QRCode.toDataURL(url).then((qrDataUrl) => {
        const img = new Image();
        img.src = qrDataUrl;
        img.onload = () => {
          ctx.drawImage(img, 50, 50, 200, 200);
        };
      });
    }
  }, [showPopup]);

  const downloadQRCode = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.href = canvasRef.current.toDataURL("image/png");
    link.download = `${title}-qr.png`;
    link.click();
  };

  // Close popup if clicked outside the modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  return (
    <div className="flex flex-col items-center justify-center mt-6 z-50 rounded-xl bg-white shadow-lg py-4">
      <div className="px-6 w-full">
        <button
          onClick={generateQRCode}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md w-full sm:w-full"
        >
          Generate QR Code
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-xl shadow-2xl text-center w-full max-w-sm sm:max-w-md relative"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              Scan to Visit
            </h2>
            <canvas
              ref={canvasRef}
              className="mx-auto mb-4 border rounded-md shadow"
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={downloadQRCode}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full sm:w-auto"
              >
                Download as PNG
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { addToWishlist } from "../../utils";
import { useState } from "react";

function Wishlist({ eventId,heart }: { eventId: string | undefined,heart:boolean }) {
  const [isWishlisted, setIsWishlisted] = useState(heart);
  const [loading, setLoading] = useState(false);

  const toggleWishlist = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (!isWishlisted) {
        await addToWishlist(eventId, true);
        setIsWishlisted(true);
      } else {
        await addToWishlist(eventId, false);
        setIsWishlisted(false);
      }
    } catch (error) {
      console.error("Error updating wishlist status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        disabled={loading}
        className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-full shadow-md font-medium transition duration-300 ${
          isWishlisted
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? (
          <>
            <span className="animate-spin">🔄</span>
            Loading...
          </>
        ) : isWishlisted ? (
          <>
            <FavoriteIcon style={{ color: "white" }} fontSize="small" />
            Wishlisted
          </>
        ) : (
          <>
            <FavoriteBorderIcon style={{ color: "black" }} fontSize="small" />
            Wishlist
          </>
        )}
      </button>
    </div>
  );
}

export default Wishlist;

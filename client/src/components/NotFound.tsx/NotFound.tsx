import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-8xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-6">Oops! The page you're looking for doesn't exist.</p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;

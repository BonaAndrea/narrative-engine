import { useNavigate } from 'react-router-dom';

export default function MainMenuPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center px-6 py-12 max-w-2xl">
        <h1 className="text-6xl md:text-7xl font-serif font-bold tracking-tight mb-4">Narrative Engine</h1>
        <p className="text-lg text-gray-300 mb-10">An Interactive Story Experience</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/stories')}
            className="px-8 py-3 border border-gray-600 rounded-md text-white hover:bg-gray-800 hover:border-gray-400 transition"
          >
            Browse Stories
          </button>

          <button
            onClick={() => navigate('/stories')}
            className="px-8 py-3 border border-gray-600 rounded-md text-white hover:bg-gray-800 hover:border-gray-400 transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { storyService } from '../services/api';
import type { Story } from '../types/narrative';

export default function StoryLibraryPage() {
  const navigate = useNavigate();

  const { data: stories, isLoading, isError, error } = useQuery<Story[], Error>({
    queryKey: ['stories'],
    queryFn: () => storyService.getStories(),
  });
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin border-t-2 border-white rounded-full w-8 h-8 mb-4" />
          <div className="text-gray-300">Loading stories...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <header className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-semibold">Stories</h2>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-600 rounded-md text-white hover:bg-gray-800 transition"
            >
              Back
            </button>
          </header>

          <main className="bg-gray-900 rounded-lg p-8 shadow-lg">
            <p className="text-red-400">Error loading stories: {error?.message}</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold">Stories</h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-600 rounded-md text-white hover:bg-gray-800 transition"
          >
            Back
          </button>
        </header>

        <main>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {stories?.map((story) => (
              <div
                key={story.id}
                onClick={() => navigate(`/play/${story.id}`)}
                className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition cursor-pointer"
              >
                <h3 className="text-xl font-semibold">{story.title}</h3>
                <p className="text-gray-400 text-sm mt-2">{story.description}</p>

                <div className="mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/play/${story.id}`);
                    }}
                    className="px-4 py-2 border border-gray-600 rounded-md text-white hover:bg-gray-800 transition"
                  >
                    Play
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

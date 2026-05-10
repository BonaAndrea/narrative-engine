import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainMenuPage from './pages/MainMenuPage';
import StoryLibraryPage from './pages/StoryLibraryPage';
import StoryPlayerPage from './pages/StoryPlayerPage';
import EndingPage from './pages/EndingPage';

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainMenuPage />} />
          <Route path="/stories" element={<StoryLibraryPage />} />
          <Route path="/play/:storyId" element={<StoryPlayerPage />} />
            <Route path="/ending" element={<EndingPage />} />
        </Routes>
      </BrowserRouter>
  );
}
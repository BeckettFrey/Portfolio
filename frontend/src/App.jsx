  import { Routes, Route } from 'react-router-dom'
  import LandingPage from './pages/core/LandingPage'
  import AboutPage from './pages/core/AboutPage'
  import ContactPage from './pages/core/ContactPage'
  import ProjectsPage from './pages/core/ProjectsPage'
  import PhotosPage from './pages/core/PhotosPage'
  import GithubActivityPage from './pages/core/GithubActivityPage'
  import PacMan from './pages/games/PacMan'
  import Tetris from './pages/games/Tetris'
  import FlappyBird from './pages/games/FlappyBird'
  import NotFound from './pages/core/NotFound'
  import './styles/App.css'

  function App() {
    return (
      <Routes>
        {/* Core */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/photos" element={<PhotosPage />} />
        <Route path="/github-activity" element={<GithubActivityPage />} />

        {/* Games */}
        <Route path="/games/pacman" element={<PacMan />} />
        <Route path="/games/tetris" element={<Tetris />} />
        <Route path="/games/flappy-bird" element={<FlappyBird />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  }

  export default App

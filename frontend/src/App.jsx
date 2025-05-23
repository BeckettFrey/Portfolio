import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/core/LandingPage'
import AboutPage from './pages/core/AboutPage'
import ContactPage from './pages/core/ContactPage'
import ProjectsPage from './pages/core/ProjectsPage'
import Pacman from './pages/games/Pacman'
import Tetris from './pages/games/Tetris'
import FlappyBird from './pages/games/FlappyBird'
import NotFound from './pages/NotFound'
import './styles/App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        {/* Games */}
        <Route path="/games/pacman" element={<Pacman />} />
        <Route path="/games/tetris" element={<Tetris />} />
        <Route path="/games/flappy-bird" element={<FlappyBird />} />
        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App

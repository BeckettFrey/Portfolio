import { useState, useEffect, useCallback, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';

const FlappyBird = () => {
  // Responsive dimensions
  const [dimensions, setDimensions] = useState({
    GAME_WIDTH: 320,
    GAME_HEIGHT: 480,
    BIRD_SIZE: 24,
    PIPE_WIDTH: 50,
    PIPE_GAP: 120
  });

  const GRAVITY = 0.6;
  const JUMP_FORCE = -10;
  const PIPE_SPEED = 3;

  const [bird, setBird] = useState({ x: 80, y: 240, velocity: 0 });
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState('ready');
  const [gameSpeed, setGameSpeed] = useState(1);

  const birdRef = useRef(bird);
  const pipesRef = useRef(pipes);

  useEffect(() => {
    birdRef.current = bird;
  }, [bird]);

  useEffect(() => {
    pipesRef.current = pipes;
  }, [pipes]);

  // Update dimensions based on screen size
  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const isMobile = screenWidth < 768;
      
      if (isMobile) {
        const maxWidth = Math.min(screenWidth - 16, 360); // Reduced padding
        const aspectRatio = 2 / 3; // Maintain 2:3 aspect ratio (width:height)
        let gameHeight = maxWidth / aspectRatio;
        // Cap height to fit within 80% of screen height, leaving room for UI
        gameHeight = Math.min(gameHeight, screenHeight * 0.8 - 120); // Account for header and stats
        const gameWidth = gameHeight * aspectRatio;
        
        setDimensions({
          GAME_WIDTH: Math.floor(gameWidth),
          GAME_HEIGHT: Math.floor(gameHeight),
          BIRD_SIZE: gameWidth < 300 ? 18 : 22,
          PIPE_WIDTH: gameWidth < 300 ? 35 : 45,
          PIPE_GAP: gameWidth < 300 ? 90 : 110
        });
      } else {
        setDimensions({
          GAME_WIDTH: 600,
          GAME_HEIGHT: 400,
          BIRD_SIZE: 30,
          PIPE_WIDTH: 60,
          PIPE_GAP: 150
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Reset bird position when dimensions change
  useEffect(() => {
    setBird(prev => ({
      ...prev,
      x: dimensions.GAME_WIDTH * 0.25,
      y: dimensions.GAME_HEIGHT / 2
    }));
  }, [dimensions]);

  // Generate random pipe height
  const generatePipe = (x) => ({
    x,
    topHeight: Math.random() * (dimensions.GAME_HEIGHT - dimensions.PIPE_GAP - 80) + 40,
    passed: false,
    id: Date.now() + Math.random()
  });

  // Initialize pipes
  useEffect(() => {
    if (gameState === 'playing') {
      const initialPipes = [
        generatePipe(dimensions.GAME_WIDTH),
        generatePipe(dimensions.GAME_WIDTH + dimensions.GAME_WIDTH * 0.6),
        generatePipe(dimensions.GAME_WIDTH + dimensions.GAME_WIDTH * 1.2)
      ];
      setPipes(initialPipes);
    }
  }, [gameState, dimensions]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    let animationFrameId;

    const loop = () => {
      // Bird physics
      setBird(prev => {
        const newVelocity = prev.velocity + GRAVITY * gameSpeed;
        const newY = prev.y + newVelocity;

        if (newY < 0 || newY > dimensions.GAME_HEIGHT - dimensions.BIRD_SIZE) {
          setGameState('gameOver');
          return prev;
        }

        const updatedBird = { ...prev, y: newY, velocity: newVelocity };
        birdRef.current = updatedBird;
        return updatedBird;
      });

      // Pipe movement
      setPipes(prev => {
        const newPipes = prev.map(pipe => ({
          ...pipe,
          x: pipe.x - PIPE_SPEED * gameSpeed
        })).filter(pipe => pipe.x > -dimensions.PIPE_WIDTH);

        const lastPipe = newPipes[newPipes.length - 1];
        if (lastPipe && lastPipe.x < dimensions.GAME_WIDTH - dimensions.GAME_WIDTH * 0.4) {
          newPipes.push(generatePipe(dimensions.GAME_WIDTH + 50));
        }

        newPipes.forEach(pipe => {
          if (!pipe.passed && pipe.x + dimensions.PIPE_WIDTH < birdRef.current.x) {
            pipe.passed = true;
            setScore(prev => prev + 1);
          }
        });

        pipesRef.current = newPipes;
        return newPipes;
      });

      // Collision check
      const birdNow = birdRef.current;
      for (let pipe of pipesRef.current) {
        if (
          birdNow.x + dimensions.BIRD_SIZE > pipe.x &&
          birdNow.x < pipe.x + dimensions.PIPE_WIDTH
        ) {
          if (
            birdNow.y < pipe.topHeight ||
            birdNow.y + dimensions.BIRD_SIZE > pipe.topHeight + dimensions.PIPE_GAP
          ) {
            setGameState('gameOver');
            return;
          }
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, gameSpeed, dimensions]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const checkCollision = () => {
      for (let pipe of pipes) {
        if (bird.x + dimensions.BIRD_SIZE > pipe.x &&
            bird.x < pipe.x + dimensions.PIPE_WIDTH) {
          if (bird.y < pipe.topHeight ||
              bird.y + dimensions.BIRD_SIZE > pipe.topHeight + dimensions.PIPE_GAP) {
            setGameState('gameOver');
            return;
          }
        }
      }
    };

    const interval = setInterval(checkCollision, 100);
    return () => clearInterval(interval);
  }, [bird, pipes, gameState, dimensions]);

  // Update high score and speed
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
    
    const newSpeed = 1 + Math.floor(score / 10) * 0.2;
    setGameSpeed(newSpeed);
  }, [score, highScore]);

  const jump = useCallback(() => {
    if (gameState === 'ready') {
      setGameState('playing');
    } else if (gameState === 'playing') {
      setBird(prev => ({ ...prev, velocity: JUMP_FORCE }));
    }
  }, [gameState]);

  const resetGame = () => {
    setBird({ x: dimensions.GAME_WIDTH * 0.25, y: dimensions.GAME_HEIGHT / 2, velocity: 0 });
    setPipes([]);
    setScore(0);
    setGameSpeed(1);
    setGameState('playing'); // ← immediately starts new game
  };

  // Controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    const handleTouchStart = (e) => {
      e.preventDefault();
      jump();
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [jump]);

  // Prevent zoom on mobile
  useEffect(() => {
    const preventZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const preventDoubleTapZoom = (e) => {
      e.preventDefault();
    };

    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchmove', preventZoom, { passive: false });
    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchmove', preventZoom);
      document.removeEventListener('touchend', preventDoubleTapZoom);
    };
  }, []);

  return (
    <div className="relative min-h-screen text-white font-sans overflow-hidden">
      {/* Prevent scrolling and zooming */}
      <style jsx>{`
        body {
          touch-action: none;
          overscroll-behavior: none;
        }
        @media (max-width: 767px) {
          .container {
            padding-left: 8px;
            padding-right: 8px;
            padding-top: 8px;
            padding-bottom: 8px;
          }
        }
      `}</style>

      {/* Close Button */}
      <div className="absolute top-2 left-2 z-50">
        <a
          href="/"
          className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          onTouchStart={(e) => {
            e.stopPropagation();
            e.preventDefault();
            window.location.href = '/';
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            window.location.href = '/';
          }}
        >
          <FaTimes className="text-lg" />
        </a>
      </div>

      <div className="container mx-auto px-4 py-4 max-w-lg relative z-10 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            FLAPPY BIRD
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
        </div>

        {/* Game Stats */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-white/10 mb-4 w-full max-w-sm">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-3 text-center border border-white/10">
              <div className="text-lg sm:text-xl font-bold text-blue-400 mb-1">{score}</div>
              <div className="text-gray-300 text-xs">Score</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-3 text-center border border-white/10">
              <div className="text-lg sm:text-xl font-bold text-green-400 mb-1">{highScore}</div>
              <div className="text-gray-300 text-xs">Best</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-3 text-center border border-white/10">
              <div className="text-lg sm:text-xl font-bold text-orange-400 mb-1">{gameSpeed.toFixed(1)}x</div>
              <div className="text-gray-300 text-xs">Speed</div>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-white/10 mb-4">
          <div 
            className="relative mx-auto border-2 border-blue-400 rounded-lg overflow-hidden select-none touch-none"
            style={{
              width: dimensions.GAME_WIDTH,
              height: dimensions.GAME_HEIGHT
            }}
          >
            {/* Bird */}
            {gameState === 'playing' && (
              <div
                className="absolute rounded-full transition-transform duration-100 shadow-lg"
                style={{
                  left: bird.x,
                  top: bird.y,
                  width: dimensions.BIRD_SIZE,
                  height: dimensions.BIRD_SIZE,
                  background: 'radial-gradient(circle at 30% 30%, #60a5fa, #3b82f6)',
                  border: '2px solid #1d4ed8',
                  transform: `rotate(${Math.min(Math.max(bird.velocity * 3, -45), 45)}deg)`,
                  zIndex: 10
                }}
              >
                <div 
                  className="absolute bg-white rounded-full"
                  style={{
                    width: Math.max(4, dimensions.BIRD_SIZE * 0.2),
                    height: Math.max(4, dimensions.BIRD_SIZE * 0.2),
                    top: dimensions.BIRD_SIZE * 0.25,
                    right: dimensions.BIRD_SIZE * 0.2
                  }}
                >
                  <div 
                    className="absolute bg-black rounded-full"
                    style={{
                      width: Math.max(2, dimensions.BIRD_SIZE * 0.1),
                      height: Math.max(2, dimensions.BIRD_SIZE * 0.1),
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  ></div>
                </div>
                <div 
                  className="absolute bg-orange-400 rounded-sm"
                  style={{
                    width: Math.max(6, dimensions.BIRD_SIZE * 0.25),
                    height: Math.max(3, dimensions.BIRD_SIZE * 0.15),
                    top: dimensions.BIRD_SIZE * 0.4,
                    right: -Math.max(3, dimensions.BIRD_SIZE * 0.15)
                  }}
                ></div>
              </div>
            )}

            {/* Pipes */}
            {pipes.map(pipe => (
              <div key={pipe.id}>
                <div
                  className="absolute rounded-b-lg shadow-lg"
                  style={{
                    left: pipe.x,
                    top: 0,
                    width: dimensions.PIPE_WIDTH,
                    height: pipe.topHeight,
                    background: 'linear-gradient(to right, #4ade80, #22c55e)',
                    border: '2px solid #15803d'
                  }}
                >
                  <div 
                    className="absolute bottom-0 rounded-lg"
                    style={{
                      left: -Math.max(3, dimensions.PIPE_WIDTH * 0.08),
                      width: dimensions.PIPE_WIDTH + Math.max(6, dimensions.PIPE_WIDTH * 0.16),
                      height: Math.max(20, dimensions.PIPE_WIDTH * 0.4),
                      background: 'linear-gradient(to right, #86efac, #4ade80)',
                      border: '2px solid #15803d'
                    }}
                  ></div>
                </div>
                <div
                  className="absolute rounded-t-lg shadow-lg"
                  style={{
                    left: pipe.x,
                    top: pipe.topHeight + dimensions.PIPE_GAP,
                    width: dimensions.PIPE_WIDTH,
                    height: dimensions.GAME_HEIGHT - pipe.topHeight - dimensions.PIPE_GAP,
                    background: 'linear-gradient(to right, #4ade80, #22c55e)',
                    border: '2px solid #15803d'
                  }}
                >
                  <div 
                    className="absolute top-0 rounded-lg"
                    style={{
                      left: -Math.max(3, dimensions.PIPE_WIDTH * 0.08),
                      width: dimensions.PIPE_WIDTH + Math.max(6, dimensions.PIPE_WIDTH * 0.16),
                      height: Math.max(20, dimensions.PIPE_WIDTH * 0.4),
                      background: 'linear-gradient(to right, #86efac, #4ade80)',
                      border: '2px solid #15803d'
                    }}
                  ></div>
                </div>
              </div>
            ))}

            {/* Game State Overlay */}
            {gameState !== 'playing' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center shadow-xl max-w-xs mx-2 border border-white/10">
                  {gameState === 'ready' && (
                    <>
                      <div className="text-3xl mb-3">🎮</div>
                      <h2 className="text-xl font-bold text-white mb-3">Ready to Soar?</h2>
                      <p className="text-gray-300 mb-4 text-xs leading-relaxed">
                        <span className="sm:hidden">Tap to flap through the cosmic void!</span>
                        <span className="hidden sm:inline">Press spacebar to flap through the cosmic void!</span>
                      </p>
                      <button 
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setGameState('playing');
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setGameState('playing');
                        }}
                        className="bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm"
                      >
                        Start Journey
                      </button>
                    </>
                  )}
                  {gameState === 'gameOver' && (
                    <>
                      <div className="text-3xl mb-3">💫</div>
                      <h2 className="text-xl font-bold text-white mb-3">Cosmic Collision!</h2>
                      <div className="mb-4 space-y-2">
                        <p className="text-sm text-gray-300">Score: <span className="font-bold text-blue-400">{score}</span></p>
                        {score === highScore && score > 0 && (
                          <p className="text-xs text-green-400 font-bold">✨ New High Score!</p>
                        )}
                      </div>
                      <button 
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          resetGame();
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          resetGame();
                        }}
                        className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm"
                      >
                        Try Again
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls Info */}
        <div className="text-center text-xs text-gray-300 mb-4 px-2">
          <p className="hidden sm:block">Press spacebar to soar • Navigate through the cosmic barriers • Speed increases with each level!</p>
        </div>
      </div>
    </div>
  );
};

export default FlappyBird;
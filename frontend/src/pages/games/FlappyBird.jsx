import { useState, useEffect, useCallback } from 'react';
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
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('flappybird-highscore');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [gameState, setGameState] = useState('ready'); // ready, playing, gameOver
  const [gameSpeed, setGameSpeed] = useState(1);

  // Update dimensions based on screen size
  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const isMobile = screenWidth < 768;
      
      if (isMobile) {
        const gameWidth = Math.min(screenWidth - 32, 360);
        const gameHeight = Math.min(screenHeight * 0.6, 480);
        setDimensions({
          GAME_WIDTH: gameWidth,
          GAME_HEIGHT: gameHeight,
          BIRD_SIZE: gameWidth < 320 ? 20 : 24,
          PIPE_WIDTH: gameWidth < 320 ? 40 : 50,
          PIPE_GAP: gameWidth < 320 ? 100 : 120
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
    topHeight: Math.random() * (dimensions.GAME_HEIGHT - dimensions.PIPE_GAP - 100) + 50,
    passed: false,
    id: Date.now() + Math.random()
  });

  // Initialize pipes
  useEffect(() => {
    if (gameState === 'playing') {
      const initialPipes = [
        generatePipe(dimensions.GAME_WIDTH),
        generatePipe(dimensions.GAME_WIDTH + 200),
        generatePipe(dimensions.GAME_WIDTH + 400)
      ];
      setPipes(initialPipes);
    }
  }, [gameState, dimensions]);

  // Bird physics
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      setBird(prev => {
        const newVelocity = prev.velocity + GRAVITY * gameSpeed;
        const newY = prev.y + newVelocity;
        
        // Check bounds
        if (newY < 0 || newY > dimensions.GAME_HEIGHT - dimensions.BIRD_SIZE) {
          setGameState('gameOver');
          return prev;
        }
        
        return { ...prev, y: newY, velocity: newVelocity };
      });

      // Move pipes
      setPipes(prev => {
        const newPipes = prev.map(pipe => ({
          ...pipe,
          x: pipe.x - PIPE_SPEED * gameSpeed
        })).filter(pipe => pipe.x > -dimensions.PIPE_WIDTH);

        // Add new pipes
        const lastPipe = newPipes[newPipes.length - 1];
        if (lastPipe && lastPipe.x < dimensions.GAME_WIDTH - 150) {
          newPipes.push(generatePipe(dimensions.GAME_WIDTH + 100));
        }

        // Check scoring
        newPipes.forEach(pipe => {
          if (!pipe.passed && pipe.x + dimensions.PIPE_WIDTH < bird.x) {
            pipe.passed = true;
            setScore(prev => prev + 1);
          }
        });

        return newPipes;
      });
    }, 20);

    return () => clearInterval(gameLoop);
  }, [gameState, bird.x, gameSpeed, dimensions]);

  // Collision detection
  useEffect(() => {
    if (gameState !== 'playing') return;

    const checkCollision = () => {
      for (let pipe of pipes) {
        // Check if bird is in pipe x range
        if (bird.x + dimensions.BIRD_SIZE > pipe.x && bird.x < pipe.x + dimensions.PIPE_WIDTH) {
          // Check if bird hits top or bottom pipe
          if (bird.y < pipe.topHeight || bird.y + dimensions.BIRD_SIZE > pipe.topHeight + dimensions.PIPE_GAP) {
            setGameState('gameOver');
            return;
          }
        }
      }
    };

    checkCollision();
  }, [bird, pipes, gameState, dimensions]);

  // Update high score and speed
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      if (typeof window !== 'undefined') {
        localStorage.setItem('flappybird-highscore', score.toString());
      }
    }
    
    // Increase speed every 10 points
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
    setGameState('ready');
  };

  // Controls - Enhanced for mobile
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

    const handleClick = (e) => {
      e.preventDefault();
      jump();
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('click', handleClick);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans flex flex-col items-center justify-start p-2 sm:p-4 overflow-hidden">
      {/* Close Button */}
      <div className="z-40 text-center mb-3 sm:mb-6 w-full">
        <button onTouchStart={e => { e.stopPropagation(); window.location.href = "/"; }} onClick={() => window.location.href = "/"} className="flex items-center justify-center w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110">
          <FaTimes className="text-xl " />
        </button>
      </div>
      {/* Header - Compact for mobile */}
      <div className="text-center mb-3 sm:mb-6 w-full">
        <h1 className="text-3xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4">
          FLAPPY BIRD
        </h1>
        <div className="w-16 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
      </div>

      {/* Game Stats - Responsive grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-6 w-full max-w-md sm:max-w-4xl">
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-2 sm:p-4 text-center border border-gray-100">
          <div className="text-lg sm:text-2xl font-bold text-blue-600 mb-1">{score}</div>
          <div className="text-gray-600 text-xs sm:text-sm">Score</div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-2 sm:p-4 text-center border border-gray-100">
          <div className="text-lg sm:text-2xl font-bold text-green-600 mb-1">{highScore}</div>
          <div className="text-gray-600 text-xs sm:text-sm">Best</div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-2 sm:p-4 text-center border border-gray-100">
          <div className="text-lg sm:text-2xl font-bold text-purple-600 mb-1">{gameSpeed.toFixed(1)}x</div>
          <div className="text-gray-600 text-xs sm:text-sm">Speed</div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-2 sm:p-4 text-center border border-gray-100">
          <div className="text-lg sm:text-2xl font-bold text-orange-600 mb-1">{Math.floor(score / 10) + 1}</div>
          <div className="text-gray-600 text-xs sm:text-sm">Level</div>
        </div>
      </div>

      {/* Game Board */}
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl p-3 sm:p-6 border border-gray-100 mb-3 sm:mb-6 w-full max-w-sm sm:max-w-4xl">
        <div 
          className="relative mx-auto border-2 border-blue-600 rounded-lg overflow-hidden select-none touch-none"
          style={{
            width: dimensions.GAME_WIDTH,
            height: dimensions.GAME_HEIGHT,
            background: 'linear-gradient(to bottom, #87CEEB 0%, #98FB98 70%, #228B22 100%)'
          }}
          onTouchStart={(e) => { e.preventDefault(); jump(); }}
          onClick={jump}
        >
          {/* Clouds - Responsive sizing */}
          <div 
            className="absolute bg-white rounded-full opacity-80"
            style={{
              top: dimensions.GAME_HEIGHT * 0.05,
              left: dimensions.GAME_WIDTH * 0.1,
              width: dimensions.GAME_WIDTH * 0.08,
              height: dimensions.GAME_WIDTH * 0.04
            }}
          ></div>
          <div 
            className="absolute bg-white rounded-full opacity-80"
            style={{
              top: dimensions.GAME_HEIGHT * 0.08,
              right: dimensions.GAME_WIDTH * 0.15,
              width: dimensions.GAME_WIDTH * 0.1,
              height: dimensions.GAME_WIDTH * 0.05
            }}
          ></div>
          
          {/* Bird */}
          {gameState === 'playing' && (
          <div
            className="absolute rounded-full transition-transform duration-100"
            style={{
              left: bird.x,
              top: bird.y,
              width: dimensions.BIRD_SIZE,
              height: dimensions.BIRD_SIZE,
              background: 'radial-gradient(circle at 30% 30%, #FFD700, #FFA500)',
              border: '2px solid #FF8C00',
              transform: `rotate(${Math.min(Math.max(bird.velocity * 3, -45), 45)}deg)`,
              zIndex: 10
            }}
          >
            {/* Bird eye */}
            <div 
              className="absolute bg-black rounded-full"
              style={{
                width: Math.max(4, dimensions.BIRD_SIZE * 0.2),
                height: Math.max(4, dimensions.BIRD_SIZE * 0.2),
                top: dimensions.BIRD_SIZE * 0.25,
                right: dimensions.BIRD_SIZE * 0.2
              }}
            ></div>
            {/* Bird beak */}
            <div 
              className="absolute bg-orange-600 rounded-sm"
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
              {/* Top pipe */}
              <div
                className="absolute bg-gradient-to-b from-green-600 to-green-700 border-2 border-green-800 rounded-b-lg"
                style={{
                  left: pipe.x,
                  top: 0,
                  width: dimensions.PIPE_WIDTH,
                  height: pipe.topHeight
                }}
              >
                <div 
                  className="absolute bottom-0 bg-gradient-to-b from-green-500 to-green-600 border border-green-800 rounded-lg"
                  style={{
                    left: -Math.max(3, dimensions.PIPE_WIDTH * 0.08),
                    width: dimensions.PIPE_WIDTH + Math.max(6, dimensions.PIPE_WIDTH * 0.16),
                    height: Math.max(20, dimensions.PIPE_WIDTH * 0.4)
                  }}
                ></div>
              </div>
              
              {/* Bottom pipe */}
              <div
                className="absolute bg-gradient-to-t from-green-600 to-green-700 border-2 border-green-800 rounded-t-lg"
                style={{
                  left: pipe.x,
                  top: pipe.topHeight + dimensions.PIPE_GAP,
                  width: dimensions.PIPE_WIDTH,
                  height: dimensions.GAME_HEIGHT - pipe.topHeight - dimensions.PIPE_GAP
                }}
              >
                <div 
                  className="absolute top-0 bg-gradient-to-t from-green-500 to-green-600 border border-green-800 rounded-lg"
                  style={{
                    left: -Math.max(3, dimensions.PIPE_WIDTH * 0.08),
                    width: dimensions.PIPE_WIDTH + Math.max(6, dimensions.PIPE_WIDTH * 0.16),
                    height: Math.max(20, dimensions.PIPE_WIDTH * 0.4)
                  }}
                ></div>
              </div>
            </div>
          ))}

          {/* Game State Overlay */}
          {gameState !== 'playing' && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-2xl p-4 sm:p-8 text-center shadow-2xl max-w-xs sm:max-w-sm mx-2">
                {gameState === 'ready' && (
                  <>
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎮</div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Ready to Play?</h2>
                    <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm">Tap anywhere or press spacebar to flap!</p>
                    <button 
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        setGameState('playing');
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setGameState('playing');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-colors font-medium text-sm sm:text-base"
                    >
                      Start Game
                    </button>
                  </>
                )}
                
                {gameState === 'gameOver' && (
                  <>
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💥</div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Crash Landing!</h2>
                    <div className="mb-4 sm:mb-6 space-y-2">
                      <p className="text-base sm:text-lg text-gray-700">Score: <span className="font-bold text-blue-600">{score}</span></p>
                      {score === highScore && score > 0 && (
                        <p className="text-xs sm:text-sm text-green-600 font-bold">🎉 New High Score!</p>
                      )}
                    </div>
                    <button 
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        resetGame();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        resetGame();
                      }}
                      className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-colors font-medium text-sm sm:text-base"
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

      {/* Controls Info - Compact for mobile */}
      <div className="text-center text-xs sm:text-sm text-gray-500 mb-3 sm:mb-6 px-2">
        <p className="sm:hidden">Tap anywhere to flap • Avoid the pipes!</p>
        <p className="hidden sm:block">Tap anywhere or press spacebar to flap • Avoid the pipes • Speed increases every 10 points!</p>
      </div>
    </div>
  );
};

export default FlappyBird;
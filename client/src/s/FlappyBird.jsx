'use client';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

const FlappyBird = () => {
  // Responsive dimensions
  const [dimensions, setDimensions] = useState({
    GAME_WIDTH: 320,
    GAME_HEIGHT: 480,
    BIRD_SIZE: 24,
    PIPE_WIDTH: 50,
    PIPE_GAP: 120
  });

  const GRAVITY = 0.8;
  const JUMP_FORCE = -12;
  const PIPE_SPEED = 4;

  const [bird, setBird] = useState({ x: 80, y: 240, velocity: 0 });
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState('ready');
  const [gameSpeed, setGameSpeed] = useState(1);

  // Use refs for real-time values to avoid stale closures
  const gameStateRef = useRef(gameState);
  const birdRef = useRef(bird);
  const pipesRef = useRef(pipes);
  const scoreRef = useRef(score);
  const dimensionsRef = useRef(dimensions);
  const gameSpeedRef = useRef(gameSpeed);
  const animationFrameRef = useRef();
  const lastTimeRef = useRef(0);

  // Update refs when state changes
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { birdRef.current = bird; }, [bird]);
  useEffect(() => { pipesRef.current = pipes; }, [pipes]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { dimensionsRef.current = dimensions; }, [dimensions]);
  useEffect(() => { gameSpeedRef.current = gameSpeed; }, [gameSpeed]);

  // Improved mobile-responsive dimension calculation
  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const isMobile = screenWidth < 768;
      
      if (isMobile) {
        // More aggressive mobile optimization
        const padding = 16;
        const uiSpace = 200; // Space for title and stats (reduced)
        
        // Use more of the available screen space
        const availableWidth = screenWidth - padding;
        const availableHeight = screenHeight - uiSpace;
        
        // More flexible aspect ratio for mobile
        const minAspectRatio = 0.6; // Width/Height minimum
        const maxAspectRatio = 0.8; // Width/Height maximum
        
        let gameWidth = availableWidth;
        let gameHeight = availableHeight;
        
        // Adjust to fit within aspect ratio constraints
        const currentRatio = gameWidth / gameHeight;
        if (currentRatio < minAspectRatio) {
          gameWidth = gameHeight * minAspectRatio;
        } else if (currentRatio > maxAspectRatio) {
          gameHeight = gameWidth / maxAspectRatio;
        }
        
        // Ensure it fits on screen
        gameWidth = Math.min(gameWidth, availableWidth);
        gameHeight = Math.min(gameHeight, availableHeight);
        
        // Scale game elements proportionally
        const scale = Math.min(gameWidth / 320, gameHeight / 480);
        
        setDimensions({
          GAME_WIDTH: Math.floor(gameWidth),
          GAME_HEIGHT: Math.floor(gameHeight),
          BIRD_SIZE: Math.max(16, Math.floor(24 * scale)),
          PIPE_WIDTH: Math.max(30, Math.floor(50 * scale)),
          PIPE_GAP: Math.max(80, Math.floor(120 * scale))
        });
      } else {
        // Desktop dimensions
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
  const generatePipe = useCallback((x) => ({
    x,
    topHeight: Math.random() * (dimensionsRef.current.GAME_HEIGHT - dimensionsRef.current.PIPE_GAP - 80) + 40,
    passed: false,
    id: Date.now() + Math.random()
  }), []);

  // Initialize pipes when game starts
  useEffect(() => {
    if (gameState === 'playing') {
      const initialPipes = [
        generatePipe(dimensions.GAME_WIDTH),
        generatePipe(dimensions.GAME_WIDTH + dimensions.GAME_WIDTH * 0.6),
        generatePipe(dimensions.GAME_WIDTH + dimensions.GAME_WIDTH * 1.2)
      ];
      setPipes(initialPipes);
    }
  }, [gameState, dimensions, generatePipe]);

  // Optimized game loop with consistent timing
  const gameLoop = useCallback((currentTime) => {
    if (gameStateRef.current !== 'playing') {
      animationFrameRef.current = null;
      return;
    }

    // Calculate delta time for consistent physics
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;
    
    // Cap delta time to prevent large jumps (60fps = 16.67ms)
    const clampedDelta = Math.min(deltaTime, 20);
    const timeScale = clampedDelta / 16.67;

    const dims = dimensionsRef.current;
    const speed = gameSpeedRef.current;
    
    // Update bird physics
    const currentBird = birdRef.current;
    const newVelocity = currentBird.velocity + (GRAVITY * timeScale * speed);
    const newY = currentBird.y + (newVelocity * timeScale);

    // Check boundaries
    if (newY < 0 || newY > dims.GAME_HEIGHT - dims.BIRD_SIZE) {
      setGameState('gameOver');
      return;
    }

    const updatedBird = { ...currentBird, y: newY, velocity: newVelocity };
    birdRef.current = updatedBird;
    setBird(updatedBird);

    // Update pipes
    const currentPipes = pipesRef.current;
    const newPipes = [];
    let scoreIncrement = 0;

    currentPipes.forEach(pipe => {
      const newX = pipe.x - (PIPE_SPEED * timeScale * speed);
      
      // Keep pipes that are still visible
      if (newX > -dims.PIPE_WIDTH) {
        const updatedPipe = { ...pipe, x: newX };
        
        // Check for scoring
        if (!pipe.passed && newX + dims.PIPE_WIDTH < updatedBird.x) {
          updatedPipe.passed = true;
          scoreIncrement++;
        }
        
        newPipes.push(updatedPipe);
      }
    });

    // Add new pipes
    const lastPipe = newPipes[newPipes.length - 1];
    if (!lastPipe || lastPipe.x < dims.GAME_WIDTH - dims.GAME_WIDTH * 0.4) {
      newPipes.push(generatePipe(dims.GAME_WIDTH + 50));
    }

    pipesRef.current = newPipes;
    setPipes(newPipes);

    // Update score
    if (scoreIncrement > 0) {
      const newScore = scoreRef.current + scoreIncrement;
      scoreRef.current = newScore;
      setScore(newScore);
    }

    // Collision detection
    let collision = false;
    for (let pipe of newPipes) {
      if (
        updatedBird.x + dims.BIRD_SIZE > pipe.x &&
        updatedBird.x < pipe.x + dims.PIPE_WIDTH
      ) {
        if (
          updatedBird.y < pipe.topHeight ||
          updatedBird.y + dims.BIRD_SIZE > pipe.topHeight + dims.PIPE_GAP
        ) {
          collision = true;
          break;
        }
      }
    }

    if (collision) {
      setGameState('gameOver');
      return;
    }

    // Continue the loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [generatePipe]);

  // Start/stop game loop
  useEffect(() => {
    if (gameState === 'playing') {
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [gameState, gameLoop]);

  // Update high score and speed
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
    
    const newSpeed = 1.0 + Math.floor(score / 8) * 0.3;
    setGameSpeed(newSpeed);
  }, [score, highScore]);

  const jump = useCallback(() => {
    if (gameStateRef.current === 'ready') {
      setGameState('playing');
    } else if (gameStateRef.current === 'playing') {
      setBird(prev => ({ ...prev, velocity: JUMP_FORCE }));
    }
  }, []);

  const resetGame = useCallback(() => {
    setBird({ x: dimensions.GAME_WIDTH * 0.25, y: dimensions.GAME_HEIGHT / 2, velocity: 0 });
    setPipes([]);
    setScore(0);
    setGameSpeed(1);
    setGameState('playing');
  }, [dimensions]);

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

  // Memoize bird style to prevent unnecessary recalculations
  const birdStyle = useMemo(() => ({
    left: bird.x,
    top: bird.y,
    width: dimensions.BIRD_SIZE,
    height: dimensions.BIRD_SIZE,
    background: 'radial-gradient(circle at 30% 30%, #60a5fa, #3b82f6)',
    border: '2px solid #1d4ed8',
    transform: `rotate(${Math.min(Math.max(bird.velocity * 3, -45), 45)}deg)`,
    zIndex: 10
  }), [bird.x, bird.y, bird.velocity, dimensions.BIRD_SIZE]);

  // Memoize bird eye and beak styles
  const birdEyeStyle = useMemo(() => ({
    width: Math.max(4, dimensions.BIRD_SIZE * 0.2),
    height: Math.max(4, dimensions.BIRD_SIZE * 0.2),
    top: dimensions.BIRD_SIZE * 0.25,
    right: dimensions.BIRD_SIZE * 0.2
  }), [dimensions.BIRD_SIZE]);

  const birdPupilStyle = useMemo(() => ({
    width: Math.max(2, dimensions.BIRD_SIZE * 0.1),
    height: Math.max(2, dimensions.BIRD_SIZE * 0.1),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }), [dimensions.BIRD_SIZE]);

  const birdBeakStyle = useMemo(() => ({
    width: Math.max(6, dimensions.BIRD_SIZE * 0.25),
    height: Math.max(3, dimensions.BIRD_SIZE * 0.15),
    top: dimensions.BIRD_SIZE * 0.4,
    right: -Math.max(3, dimensions.BIRD_SIZE * 0.15)
  }), [dimensions.BIRD_SIZE]);

  // Check if we're on a very small screen to adjust UI
  const isVerySmall = dimensions.GAME_WIDTH < 300;

  return (
    <div
  className="w-full flex flex-col items-center justify-center"
  style={{
    height: '100dvh',
    paddingTop: 'calc(1rem + env(safe-area-inset-top))',
    paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
    boxSizing: 'border-box',
  }}
>

      {/* Compact title for mobile */}
      <div className={`text-center ${isVerySmall ? 'mb-2' : 'mb-4'}`}>
        <h1 className={`font-black tracking-wider relative ${isVerySmall ? 'text-2xl' : 'text-3xl sm:text-4xl'}`}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500
                           drop-shadow-[0_0_15px_rgba(173,216,230,0.5)]
                           animate-pulse font-mono">
            FLAPPY BIRD
          </span>
        </h1>
        {!isVerySmall && (
          <div className="text-xs font-bold text-pink-300 tracking-[0.2em] font-mono">
            ★ SKYLINE DASH ★
          </div>
        )}
      </div>

      {/* Compact stats */}
      <div className={`bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/10 w-full max-w-sm ${isVerySmall ? 'p-2 mb-2' : 'p-3 mb-3'}`}>
        <div className="grid grid-cols-3 gap-2">
          <div className={`bg-white/10 backdrop-blur-md rounded-xl shadow-xl text-center border border-white/10 ${isVerySmall ? 'p-2' : 'p-3'}`}>
            <div className={`font-bold text-blue-400 ${isVerySmall ? 'text-base' : 'text-lg'}`}>{score}</div>
            <div className="text-gray-300 text-xs">Score</div>
          </div>
          <div className={`bg-white/10 backdrop-blur-md rounded-xl shadow-xl text-center border border-white/10 ${isVerySmall ? 'p-2' : 'p-3'}`}>
            <div className={`font-bold text-green-400 ${isVerySmall ? 'text-base' : 'text-lg'}`}>{highScore}</div>
            <div className="text-gray-300 text-xs">Best</div>
          </div>
          <div className={`bg-white/10 backdrop-blur-md rounded-xl shadow-xl text-center border border-white/10 ${isVerySmall ? 'p-2' : 'p-3'}`}>
            <div className={`font-bold text-orange-400 ${isVerySmall ? 'text-base' : 'text-lg'}`}>{gameSpeed.toFixed(1)}x</div>
            <div className="text-gray-300 text-xs">Speed</div>
          </div>
        </div>
      </div>

      {/* Game Board - now takes up remaining space */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/10 p-4 lg:p-0">
        <div 
          className="relative mx-auto border-2 border-blue-400 rounded-lg overflow-hidden select-none touch-none bg-gradient-to-b from-sky-400 to-sky-600"
          style={{
            width: dimensions.GAME_WIDTH,
            height: dimensions.GAME_HEIGHT
          }}
        >
          {/* Bird */}
          {gameState === 'playing' && (
            <div
              className="absolute rounded-full transition-none shadow-lg will-change-transform"
              style={birdStyle}
            >
              <div className="absolute bg-white rounded-full" style={birdEyeStyle}>
                <div className="absolute bg-black rounded-full" style={birdPupilStyle}></div>
              </div>
              <div className="absolute bg-orange-400 rounded-sm" style={birdBeakStyle}></div>
            </div>
          )}

          {/* Pipes */}
          {pipes.map(pipe => (
            <div key={pipe.id} className="will-change-transform">
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
              <div className={`bg-white/10 backdrop-blur-md rounded-xl text-center shadow-xl mx-2 border border-white/10 ${isVerySmall ? 'p-4 max-w-xs' : 'p-6 max-w-sm'}`}>
                {gameState === 'ready' && (
                  <>
                    <div className={isVerySmall ? 'text-2xl mb-2' : 'text-3xl mb-3'}>🎮</div>
                    <h2 className={`font-bold text-white ${isVerySmall ? 'text-lg mb-2' : 'text-xl mb-3'}`}>Ready to Soar?</h2>
                    <p className={`text-gray-300 leading-relaxed ${isVerySmall ? 'text-xs mb-3' : 'text-sm mb-4'}`}>
                      <span className="sm:hidden">Tap to flap!</span>
                      <span className="hidden sm:inline">Press spacebar to flap!</span>
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
                      className={`bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white rounded-lg transition-all duration-300 font-medium ${isVerySmall ? 'px-3 py-2 text-xs' : 'px-4 py-2 text-sm'}`}
                    >
                      Start
                    </button>
                  </>
                )}
                {gameState === 'gameOver' && (
                  <>
                    <div className={isVerySmall ? 'text-2xl mb-2' : 'text-3xl mb-3'}>💫</div>
                    <h2 className={`font-bold text-white ${isVerySmall ? 'text-lg mb-2' : 'text-xl mb-3'}`}>Game Over!</h2>
                    <div className={`space-y-1 ${isVerySmall ? 'mb-3' : 'mb-4'}`}>
                      <p className={`text-gray-300 ${isVerySmall ? 'text-xs' : 'text-sm'}`}>Score: <span className="font-bold text-blue-400">{score}</span></p>
                      {score === highScore && score > 0 && (
                        <p className={`text-green-400 font-bold ${isVerySmall ? 'text-xs' : 'text-sm'}`}>✨ New High Score!</p>
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
                      className={`bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-lg transition-all duration-300 font-medium ${isVerySmall ? 'px-3 py-2 text-xs' : 'px-4 py-2 text-sm'}`}
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
    </div>
  );
};

export default FlappyBird;
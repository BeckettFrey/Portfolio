'use client';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

const FlappyBird = () => {
  // Responsive dimensions
  const [dimensions, setDimensions] = useState({
    GAME_WIDTH: 320,
    GAME_HEIGHT: 900,
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

  // Update dimensions based on screen size
  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const isMobile = screenWidth < 768;
      
      if (isMobile) {
        const maxWidth = Math.min(screenWidth - 16, 360);
        const aspectRatio = 2 / 3;
        let gameHeight = maxWidth / aspectRatio;
        gameHeight = Math.min(gameHeight, screenHeight * 0.8 - 120);
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

  return (
    <div className="w-full flex flex-col text-white items-center justify-center">
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

      <div className="container mx-auto px-4 py-4 max-w-lg relative z-10 flex flex-col items-center">


        {/* Game Stats */}
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-white/10 mb-4 w-full max-w-sm">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-3 text-center border border-white/10">
              <div className="text-lg sm:text-xl font-bold text-blue-400 mb-1">{score}</div>
              <div className="text-gray-300 text-xs">Score</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-3 text-center border border-white/10" style={{ minHeight: '80px' }}>
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
      </div>
    </div>
  );
};

export default FlappyBird;
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';

const FlappyBird = () => {
  const [dimensions, setDimensions] = useState({
    GAME_WIDTH: 600,
    GAME_HEIGHT: 400,
    BIRD_SIZE: 30,
    PIPE_WIDTH: 60,
    PIPE_GAP: 150,
  });

  const GRAVITY = 0.4;
  const JUMP_FORCE = -8;
  const PIPE_SPEED = 2;

  const [gameState, setGameState] = useState({
    bird: { x: 150, y: 200, velocity: 0 },
    pipes: [],
    score: 0,
    highScore: 0,
    gameSpeed: 1,
    status: 'ready',
  });

  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const lastFrameTime = useRef(0);

  // Handle resize with debounce
  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      const isMobile = screenWidth < 768;

      if (isMobile) {
        const maxWidth = Math.min(screenWidth - 16, 360);
        const gameHeight = Math.min(maxWidth * 1.5, window.innerHeight * 0.8 - 120);
        const gameWidth = gameHeight / 1.5;

        setDimensions({
          GAME_WIDTH: Math.floor(gameWidth),
          GAME_HEIGHT: Math.floor(gameHeight),
          BIRD_SIZE: gameWidth < 300 ? 20 : 24,
          PIPE_WIDTH: gameWidth < 300 ? 40 : 50,
          PIPE_GAP: gameWidth < 300 ? 100 : 120,
        });
      } else {
        setDimensions({
          GAME_WIDTH: 600,
          GAME_HEIGHT: 400,
          BIRD_SIZE: 30,
          PIPE_WIDTH: 60,
          PIPE_GAP: 150,
        });
      }
    };

    const debounceResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateDimensions, 100);
    };
    let resizeTimeout;

    updateDimensions();
    window.addEventListener('resize', debounceResize);
    return () => {
      window.removeEventListener('resize', debounceResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Update bird position on dimension change
  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      bird: { ...prev.bird, x: dimensions.GAME_WIDTH * 0.25, y: dimensions.GAME_HEIGHT / 2 },
    }));
  }, [dimensions]);

  const generatePipe = useCallback(
    (x) => ({
      x,
      topHeight: Math.random() * (dimensions.GAME_HEIGHT - dimensions.PIPE_GAP - 80) + 40,
      passed: false,
      id: Date.now() + Math.random(),
    }),
    [dimensions],
  );

  // Initialize pipes
  useEffect(() => {
    if (gameState.status === 'playing' && gameState.pipes.length === 0) {
      setGameState((prev) => ({
        ...prev,
        pipes: [
          generatePipe(dimensions.GAME_WIDTH),
          generatePipe(dimensions.GAME_WIDTH + dimensions.GAME_WIDTH * 0.6),
          generatePipe(dimensions.GAME_WIDTH + dimensions.GAME_WIDTH * 1.2),
        ],
      }));
    }
  }, [gameState.status, dimensions, generatePipe]);

  // Game loop
  useEffect(() => {
    if (gameState.status !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }

    const gameLoop = (time) => {
      if (!lastFrameTime.current) lastFrameTime.current = time;
      const deltaTime = Math.min((time - lastFrameTime.current) / 1000, 0.1); // Cap deltaTime
      lastFrameTime.current = time;

      setGameState((prev) => {
        const { bird, pipes, score, highScore, gameSpeed } = prev;

        // Bird physics
        const newVelocity = bird.velocity + GRAVITY * gameSpeed * deltaTime * 60;
        const newY = bird.y + newVelocity * deltaTime * 60;

        if (newY < 0 || newY > dimensions.GAME_HEIGHT - dimensions.BIRD_SIZE) {
          return { ...prev, status: 'gameOver' };
        }

        // Pipe movement
        let newPipes = pipes
          .map((pipe) => ({
            ...pipe,
            x: pipe.x - PIPE_SPEED * gameSpeed * deltaTime * 60,
          }))
          .filter((pipe) => pipe.x > -dimensions.PIPE_WIDTH);

        const lastPipe = newPipes[newPipes.length - 1];
        if (lastPipe && lastPipe.x < dimensions.GAME_WIDTH - dimensions.GAME_WIDTH * 0.4) {
          newPipes.push(generatePipe(dimensions.GAME_WIDTH));
        }

        // Score and collision
        let newScore = score;
        for (let pipe of newPipes) {
          if (!pipe.passed && pipe.x + dimensions.PIPE_WIDTH < bird.x) {
            pipe.passed = true;
            newScore += 1;
          }
          if (
            bird.x + dimensions.BIRD_SIZE > pipe.x &&
            bird.x < pipe.x + dimensions.PIPE_WIDTH &&
            (newY < pipe.topHeight || newY + dimensions.BIRD_SIZE > pipe.topHeight + dimensions.PIPE_GAP)
          ) {
            return { ...prev, status: 'gameOver' };
          }
        }

        const newGameSpeed = 1 + Math.floor(newScore / 10) * 0.2;
        const newHighScore = Math.max(highScore, newScore);

        return {
          ...prev,
          bird: { ...bird, y: newY, velocity: newVelocity },
          pipes: newPipes,
          score: newScore,
          highScore: newHighScore,
          gameSpeed: newGameSpeed,
        };
      });

      // Render
      ctx.clearRect(0, 0, dimensions.GAME_WIDTH, dimensions.GAME_HEIGHT);
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(
        gameState.bird.x + dimensions.BIRD_SIZE / 2,
        gameState.bird.y + dimensions.BIRD_SIZE / 2,
        dimensions.BIRD_SIZE / 2,
        0,
        2 * Math.PI,
      );
      ctx.fill();

      ctx.fillStyle = '#22c55e';
      for (const pipe of gameState.pipes) {
        ctx.fillRect(pipe.x, 0, dimensions.PIPE_WIDTH, pipe.topHeight);
        ctx.fillRect(
          pipe.x,
          pipe.topHeight + dimensions.PIPE_GAP,
          dimensions.PIPE_WIDTH,
          dimensions.GAME_HEIGHT - pipe.topHeight - dimensions.PIPE_GAP,
        );
      }

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    animationFrameId.current = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [gameState.status, dimensions, generatePipe]);

  const jump = useCallback(() => {
    if (gameState.status === 'ready') {
      setGameState((prev) => ({ ...prev, status: 'playing' }));
    } else if (gameState.status === 'playing') {
      setGameState((prev) => ({
        ...prev,
        bird: { ...prev.bird, velocity: JUMP_FORCE },
      }));
    }
  }, [gameState.status]);

  const resetGame = useCallback(() => {
    setGameState({
      bird: { x: dimensions.GAME_WIDTH * 0.25, y: dimensions.GAME_HEIGHT / 2, velocity: 0 },
      pipes: [],
      score: 0,
      highScore: gameState.highScore,
      gameSpeed: 1,
      status: 'playing',
    });
  }, [dimensions, gameState.highScore]);

  // Controls
  useEffect(() => {
    const handleInput = (e) => {
      e.preventDefault();
      jump();
    };

    const keyHandler = (e) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') handleInput(e);
    };

    window.addEventListener('keydown', keyHandler);
    window.addEventListener('touchstart', handleInput, { passive: false });

    return () => {
      window.removeEventListener('keydown', keyHandler);
      window.removeEventListener('touchstart', handleInput);
    };
  }, [jump]);

  // Prevent zoom
  useEffect(() => {
    const preventZoom = (e) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchmove', preventZoom, { passive: false });
    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchmove', preventZoom);
    };
  }, []);

  return (
    <div className="relative min-h-screen text-white font-sans overflow-hidden">
      <style jsx>{`
        body {
          touch-action: none;
          overscroll-behavior: none;
        }
        @media (max-width: 767px) {
          .container {
            padding: 8px;
          }
        }
      `}</style>

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
        <div className="text-center mb-4">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            FLAPPY BIRD
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-white/10 mb-4 w-full max-w-sm">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/10">
              <div className="text-lg font-bold text-blue-400 mb-1">{gameState.score}</div>
              <div className="text-gray-300 text-xs">Score</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/10">
              <div className="text-lg font-bold text-green-400 mb-1">{gameState.highScore}</div>
              <div className="text-gray-300 text-xs">Best</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/10">
              <div className="text-lg font-bold text-orange-400 mb-1">{gameState.gameSpeed.toFixed(1)}x</div>
              <div className="text-gray-300 text-xs">Speed</div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-white/10 mb-4">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={dimensions.GAME_WIDTH}
              height={dimensions.GAME_HEIGHT}
              className="rounded-lg border-2 border-blue-400"
            />
            {gameState.status !== 'playing' && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center shadow-xl max-w-xs mx-2 border border-white/10">
                  {gameState.status === 'ready' && (
                    <>
                      <div className="text-3xl mb-3">🎮</div>
                      <h2 className="text-xl font-bold text-white mb-3">Ready to Soar?</h2>
                      <p className="text-gray-300 mb-4 text-xs leading-relaxed">
                        <span className="sm:hidden">Tap to flap!</span>
                        <span className="hidden sm:inline">Press spacebar to flap!</span>
                      </p>
                      <button
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setGameState((prev) => ({ ...prev, status: 'playing' }));
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setGameState((prev) => ({ ...prev, status: 'playing' }));
                        }}
                        className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium text-sm"
                      >
                        Start Journey
                      </button>
                    </>
                  )}
                  {gameState.status === 'gameOver' && (
                    <>
                      <div className="text-3xl mb-3">💫</div>
                      <h2 className="text-xl font-bold text-white mb-3">Cosmic Collision!</h2>
                      <div className="mb-4 space-y-2">
                        <p className="text-sm text-gray-300">
                          Score: <span className="font-bold text-blue-400">{gameState.score}</span>
                        </p>
                        {gameState.score === gameState.highScore && gameState.score > 0 && (
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
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm"
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

        <div className="text-center text-xs text-gray-300 mb-4 px-2">
          <p className="hidden sm:block">Press spacebar to soar • Navigate through barriers • Speed increases with each level!</p>
        </div>
      </div>
    </div>
  );
};

export default FlappyBird;
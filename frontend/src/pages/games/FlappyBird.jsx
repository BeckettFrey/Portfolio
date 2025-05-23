import { useState, useEffect, useCallback } from 'react';

const FlappyBird = () => {
  const GAME_WIDTH = 600;
  const GAME_HEIGHT = 400;
  const BIRD_SIZE = 30;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 150;
  const GRAVITY = 0.6;
  const JUMP_FORCE = -10;
  const PIPE_SPEED = 3;

  const [bird, setBird] = useState({ x: 100, y: 200, velocity: 0 });
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('flappybird-highscore');
    return saved ? parseInt(saved) : 0;
  });
  const [gameState, setGameState] = useState('ready'); // ready, playing, gameOver
  const [gameSpeed, setGameSpeed] = useState(1);

  // Generate random pipe height
  const generatePipe = (x) => ({
    x,
    topHeight: Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50,
    passed: false,
    id: Date.now() + Math.random()
  });

  // Initialize pipes
  useEffect(() => {
    if (gameState === 'playing') {
      const initialPipes = [
        generatePipe(GAME_WIDTH),
        generatePipe(GAME_WIDTH + 300),
        generatePipe(GAME_WIDTH + 600)
      ];
      setPipes(initialPipes);
    }
  }, [gameState]);

  // Bird physics
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      setBird(prev => {
        const newVelocity = prev.velocity + GRAVITY * gameSpeed;
        const newY = prev.y + newVelocity;
        
        // Check bounds
        if (newY < 0 || newY > GAME_HEIGHT - BIRD_SIZE) {
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
        })).filter(pipe => pipe.x > -PIPE_WIDTH);

        // Add new pipes
        const lastPipe = newPipes[newPipes.length - 1];
        if (lastPipe && lastPipe.x < GAME_WIDTH - 200) {
          newPipes.push(generatePipe(GAME_WIDTH + 100));
        }

        // Check scoring
        newPipes.forEach(pipe => {
          if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
            pipe.passed = true;
            setScore(prev => prev + 1);
          }
        });

        return newPipes;
      });
    }, 20);

    return () => clearInterval(gameLoop);
  }, [gameState, bird.x, gameSpeed]);

  // Collision detection
  useEffect(() => {
    if (gameState !== 'playing') return;

    const checkCollision = () => {
      for (let pipe of pipes) {
        // Check if bird is in pipe x range
        if (bird.x + BIRD_SIZE > pipe.x && bird.x < pipe.x + PIPE_WIDTH) {
          // Check if bird hits top or bottom pipe
          if (bird.y < pipe.topHeight || bird.y + BIRD_SIZE > pipe.topHeight + PIPE_GAP) {
            setGameState('gameOver');
            return;
          }
        }
      }
    };

    checkCollision();
  }, [bird, pipes, gameState]);

  // Update high score and speed
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('flappybird-highscore', score.toString());
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
    setBird({ x: 100, y: 200, velocity: 0 });
    setPipes([]);
    setScore(0);
    setGameSpeed(1);
    setGameState('ready');
  };

  // Controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    const handleClick = () => {
      jump();
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [jump]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans flex items-center justify-center p-4">
      {/* Close Button */}
      <div className="fixed top-6 left-6 z-50">
        <a 
          href="/" 
          className="flex items-center justify-center w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <span className="text-xl">×</span>
        </a>
      </div>

      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            FLAPPY BIRD
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-6"></div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-4 text-center border border-gray-100">
            <div className="text-2xl font-bold text-blue-600 mb-1">{score}</div>
            <div className="text-gray-600 text-sm">Score</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4 text-center border border-gray-100">
            <div className="text-2xl font-bold text-green-600 mb-1">{highScore}</div>
            <div className="text-gray-600 text-sm">Best</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4 text-center border border-gray-100">
            <div className="text-2xl font-bold text-purple-600 mb-1">{gameSpeed.toFixed(1)}x</div>
            <div className="text-gray-600 text-sm">Speed</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4 text-center border border-gray-100">
            <div className="text-2xl font-bold text-orange-600 mb-1">{Math.floor(score / 10) + 1}</div>
            <div className="text-gray-600 text-sm">Level</div>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-6">
          <div 
            className="relative mx-auto border-2 border-blue-600 rounded-lg overflow-hidden cursor-pointer select-none"
            style={{
              width: GAME_WIDTH,
              height: GAME_HEIGHT,
              background: 'linear-gradient(to bottom, #87CEEB 0%, #98FB98 70%, #228B22 100%)'
            }}
            onClick={jump}
          >
            {/* Clouds */}
            <div className="absolute top-8 left-20 w-16 h-8 bg-white rounded-full opacity-80"></div>
            <div className="absolute top-12 left-16 w-12 h-6 bg-white rounded-full opacity-80"></div>
            <div className="absolute top-6 right-32 w-20 h-10 bg-white rounded-full opacity-80"></div>
            <div className="absolute top-10 right-28 w-16 h-8 bg-white rounded-full opacity-80"></div>

            {/* Bird */}
            <div
              className="absolute rounded-full transition-transform duration-100"
              style={{
                left: bird.x,
                top: bird.y,
                width: BIRD_SIZE,
                height: BIRD_SIZE,
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
                  width: 6,
                  height: 6,
                  top: 8,
                  right: 6
                }}
              ></div>
              {/* Bird beak */}
              <div 
                className="absolute bg-orange-600 rounded-sm"
                style={{
                  width: 8,
                  height: 4,
                  top: 13,
                  right: -4
                }}
              ></div>
            </div>

            {/* Pipes */}
            {pipes.map(pipe => (
              <div key={pipe.id}>
                {/* Top pipe */}
                <div
                  className="absolute bg-gradient-to-b from-green-600 to-green-700 border-2 border-green-800 rounded-b-lg"
                  style={{
                    left: pipe.x,
                    top: 0,
                    width: PIPE_WIDTH,
                    height: pipe.topHeight
                  }}
                >
                  <div 
                    className="absolute bottom-0 bg-gradient-to-b from-green-500 to-green-600 border border-green-800 rounded-lg"
                    style={{
                      left: -5,
                      width: PIPE_WIDTH + 10,
                      height: 30
                    }}
                  ></div>
                </div>
                
                {/* Bottom pipe */}
                <div
                  className="absolute bg-gradient-to-t from-green-600 to-green-700 border-2 border-green-800 rounded-t-lg"
                  style={{
                    left: pipe.x,
                    top: pipe.topHeight + PIPE_GAP,
                    width: PIPE_WIDTH,
                    height: GAME_HEIGHT - pipe.topHeight - PIPE_GAP
                  }}
                >
                  <div 
                    className="absolute top-0 bg-gradient-to-t from-green-500 to-green-600 border border-green-800 rounded-lg"
                    style={{
                      left: -5,
                      width: PIPE_WIDTH + 10,
                      height: 30
                    }}
                  ></div>
                </div>
              </div>
            ))}

            {/* Game State Overlay */}
            {gameState !== 'playing' && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-sm">
                  {gameState === 'ready' && (
                    <>
                      <div className="text-4xl mb-4">🐦</div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Fly?</h2>
                      <p className="text-gray-600 mb-6 text-sm">Click or press spacebar to flap your wings!</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setGameState('playing');
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors font-medium"
                      >
                        Start Flying
                      </button>
                    </>
                  )}
                  
                  {gameState === 'gameOver' && (
                    <>
                      <div className="text-4xl mb-4">💥</div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">Crash Landing!</h2>
                      <div className="mb-6 space-y-2">
                        <p className="text-lg text-gray-700">Score: <span className="font-bold text-blue-600">{score}</span></p>
                        {score === highScore && score > 0 && (
                          <p className="text-sm text-green-600 font-bold">🎉 New High Score!</p>
                        )}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          resetGame();
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full transition-colors font-medium"
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
        <div className="text-center text-sm text-gray-500 mb-6">
          <p>Click anywhere or press spacebar to flap • Avoid the pipes • Speed increases every 10 points!</p>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Flying Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-bold text-gray-800 mb-2">Controls:</h4>
              <ul className="space-y-1">
                <li>• Click anywhere to flap</li>
                <li>• Press spacebar to flap</li>
                <li>• Timing is everything!</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-2">Strategy:</h4>
              <ul className="space-y-1">
                <li>• Stay calm and focused</li>
                <li>• Small, controlled flaps work best</li>
                <li>• Watch the gap between pipes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlappyBird;
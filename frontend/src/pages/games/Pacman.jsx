import { useState, useEffect, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';

const PacmanGame = () => {
  // Responsive dimensions
  const [dimensions, setDimensions] = useState({
    BOARD_WIDTH: 19,
    BOARD_HEIGHT: 21,
    CELL_SIZE: 16
  });
  
  const [pacman, setPacman] = useState({ x: 9, y: 15, direction: 'right' });
  const [ghosts, setGhosts] = useState([
    { x: 9, y: 9, color: 'red', direction: 'up', frightened: false },
    { x: 8, y: 9, color: 'pink', direction: 'down', frightened: false },
    { x: 10, y: 9, color: 'cyan', direction: 'left', frightened: false },
    { x: 9, y: 8, color: 'orange', direction: 'right', frightened: false }
  ]);
  const [dots, setDots] = useState(new Set());
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('ready');
  const [lives, setLives] = useState(3);
  const [frightenedTimer, setFrightenedTimer] = useState(null);

  const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
    [1,3,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,3,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,2,1,1,1,2,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,1,2,2,1,2,2,1,2,2,2,2,2,1],
    [1,1,1,1,1,2,1,1,0,1,0,1,1,2,1,1,1,1,1],
    [0,0,0,0,1,2,1,0,0,0,0,0,1,2,1,0,0,0,0],
    [1,1,1,1,1,2,1,0,1,0,1,0,1,2,1,1,1,1,1],
    [0,0,0,0,0,2,0,0,1,0,1,0,0,2,0,0,0,0,0],
    [1,1,1,1,1,2,1,0,1,1,1,0,1,2,1,1,1,1,1],
    [0,0,0,0,1,2,1,0,0,0,0,0,1,2,1,0,0,0,0],
    [1,1,1,1,1,2,1,1,0,1,0,1,1,2,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,2,1],
    [1,3,2,1,2,2,2,2,2,1,2,2,2,2,2,1,2,3,1],
    [1,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1],
    [1,2,2,2,2,1,2,1,2,2,2,1,2,1,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  // Update dimensions based on screen size
  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      const isMobile = screenWidth < 768;
      
      if (isMobile) {
        const maxWidth = screenWidth - 32; // Account for padding
        const maxCellSize = Math.floor(maxWidth / 19);
        const cellSize = Math.min(Math.max(maxCellSize, 12), 18);
        
        setDimensions({
          BOARD_WIDTH: 19,
          BOARD_HEIGHT: 21,
          CELL_SIZE: cellSize
        });
      } else {
        setDimensions({
          BOARD_WIDTH: 19,
          BOARD_HEIGHT: 21,
          CELL_SIZE: 20
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const initialDots = new Set();
    for (let y = 0; y < dimensions.BOARD_HEIGHT; y++) {
      for (let x = 0; x < dimensions.BOARD_WIDTH; x++) {
        if (maze[y][x] === 2 || maze[y][x] === 3) {
          initialDots.add(`${x},${y}`);
        }
      }
    }
    setDots(initialDots);
  }, [dimensions]);

  const isValidMove = (x, y) => {
    if (x < 0 || x >= dimensions.BOARD_WIDTH || y < 0 || y >= dimensions.BOARD_HEIGHT) return false;
    return maze[y][x] !== 1;
  };

  const movePacman = useCallback((direction) => {
    if (gameState !== 'playing') return;
    
    setPacman(prev => {
      let newX = prev.x;
      let newY = prev.y;
      
      switch (direction) {
        case 'up': newY--; break;
        case 'down': newY++; break;
        case 'left': newX--; break;
        case 'right': newX++; break;
        default: break;
      }
      
      if (newX < 0) newX = dimensions.BOARD_WIDTH - 1;
      if (newX >= dimensions.BOARD_WIDTH) newX = 0;
      
      if (isValidMove(newX, newY)) {
        return { x: newX, y: newY, direction };
      }
      return prev;
    });
  }, [gameState, dimensions]);

  const moveGhosts = useCallback(() => {
    if (gameState !== 'playing') return;
    
    setGhosts(prev => prev.map(ghost => {
      const directions = ['up', 'down', 'left', 'right'];
      const validMoves = directions.filter(dir => {
        let newX = ghost.x;
        let newY = ghost.y;
        
        switch (dir) {
          case 'up': newY--; break;
          case 'down': newY++; break;
          case 'left': newX--; break;
          case 'right': newX++; break;
          default: break;
        }
        
        return isValidMove(newX, newY);
      });
      
      // If frightened, move away from Pacman
      let newDirection;
      if (ghost.frightened) {
        // Find direction that moves away from Pacman
        const distances = directions.map(dir => {
          let newX = ghost.x;
          let newY = ghost.y;
          switch (dir) {
            case 'up': newY--; break;
            case 'down': newY++; break;
            case 'left': newX--; break;
            case 'right': newX++; break;
            default: break;
          }
          if (!isValidMove(newX, newY)) return null;
          const distance = Math.abs(newX - pacman.x) + Math.abs(newY - pacman.y);
          return { dir, distance };
        }).filter(d => d !== null);
        
        newDirection = distances.sort((a, b) => b.distance - a.distance)[0]?.dir || ghost.direction;
      } else {
        newDirection = validMoves[Math.floor(Math.random() * validMoves.length)] || ghost.direction;
      }
      
      let newX = ghost.x;
      let newY = ghost.y;
      
      switch (newDirection) {
        case 'up': newY--; break;
        case 'down': newY++; break;
        case 'left': newX--; break;
        case 'right': newX++; break;
        default: break;
      }
      
      if (isValidMove(newX, newY)) {
        return { ...ghost, x: newX, y: newY, direction: newDirection };
      }
      return ghost;
    }));
  }, [gameState, pacman]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const pacmanPos = `${pacman.x},${pacman.y}`;
    if (dots.has(pacmanPos)) {
      const isPowerPellet = maze[pacman.y][pacman.x] === 3;
      
      setDots(prev => {
        const newDots = new Set(prev);
        newDots.delete(pacmanPos);
        return newDots;
      });
      
      setScore(prev => prev + (isPowerPellet ? 50 : 10));

      if (isPowerPellet) {
        // Start frightened mode
        setGhosts(prev => prev.map(ghost => ({ ...ghost, frightened: true })));
        if (frightenedTimer) clearTimeout(frightenedTimer);
        const timer = setTimeout(() => {
          setGhosts(prev => prev.map(ghost => ({ ...ghost, frightened: false })));
          setFrightenedTimer(null);
        }, 7000); // 7 seconds frightened mode
        setFrightenedTimer(timer);
      }
    }

    // Check ghost collision
    const ghostCollision = ghosts.find(ghost => ghost.x === pacman.x && ghost.y === pacman.y);
    if (ghostCollision) {
      if (ghostCollision.frightened) {
        // Eat ghost
        setScore(prev => prev + 200);
        setGhosts(prev => prev.map(ghost => 
          ghost.x === pacman.x && ghost.y === pacman.y 
            ? { ...ghost, x: 9, y: 9, frightened: false }
            : ghost
        ));
      } else {
        // Lose life
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameState('gameOver');
          } else {
            setPacman({ x: 9, y: 15, direction: 'right' });
            setGhosts(prev => prev.map(ghost => ({
              ...ghost,
              x: 9,
              y: 9,
              direction: ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)],
              frightened: false
            })));
            if (frightenedTimer) {
              clearTimeout(frightenedTimer);
              setFrightenedTimer(null);
            }
          }
          return newLives;
        });
      }
    }

    if (dots.size === 0) {
      setGameState('won');
    }
  }, [pacman, ghosts, dots, gameState, frightenedTimer]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const gameLoop = setInterval(() => {
      moveGhosts();
    }, 200);
    
    return () => clearInterval(gameLoop);
  }, [gameState, moveGhosts]);

  // Enhanced controls for mobile
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp': 
          e.preventDefault();
          movePacman('up'); 
          break;
        case 'ArrowDown': 
          e.preventDefault(); 
          movePacman('down'); 
          break;
        case 'ArrowLeft': 
          e.preventDefault();
          movePacman('left');
           break;
        case 'ArrowRight': 
          e.preventDefault();
          movePacman('right');
           break;
        case ' ': 
          e.preventDefault();
          if (gameState === 'ready') setGameState('playing');
          else if (gameState === 'playing') setGameState('paused');
          else if (gameState === 'paused') setGameState('playing');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePacman, gameState]);

  // Touch/swipe controls
  useEffect(() => {
    let startX = null;
    let startY = null;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      const minSwipeDistance = 30;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          movePacman(deltaX > 0 ? 'right' : 'left');
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          movePacman(deltaY > 0 ? 'down' : 'up');
        }
      }
      
      startX = null;
      startY = null;
    };

    const gameBoard = document.getElementById('game-board');
    if (gameBoard) {
      gameBoard.addEventListener('touchstart', handleTouchStart, { passive: true });
      gameBoard.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      return () => {
        gameBoard.removeEventListener('touchstart', handleTouchStart);
        gameBoard.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [movePacman]);

  const resetGame = () => {
    setPacman({ x: 9, y: 15, direction: 'right' });
    setGhosts([
      { x: 9, y: 9, color: 'red', direction: 'up', frightened: false },
      { x: 8, y: 9, color: 'pink', direction: 'down', frightened: false },
      { x: 10, y: 9, color: 'cyan', direction: 'left', frightened: false },
      { x: 9, y: 8, color: 'orange', direction: 'right', frightened: false }
    ]);
    setScore(0);
    setLives(3);
    setGameState('ready');
    if (frightenedTimer) {
      clearTimeout(frightenedTimer);
      setFrightenedTimer(null);
    }
    
    const initialDots = new Set();
    for (let y = 0; y < dimensions.BOARD_HEIGHT; y++) {
      for (let x = 0; x < dimensions.BOARD_WIDTH; x++) {
        if (maze[y][x] === 2 || maze[y][x] === 3) {
          initialDots.add(`${x},${y}`);
        }
      }
    }
    setDots(initialDots);
  };

  const renderCell = (x, y) => {
    const cellKey = `${x},${y}`;
    const cell = maze[y][x];
    const isPacman = pacman.x === x && pacman.y === y;
    const ghost = ghosts.find(g => g.x === x && g.y === y);
    const hasDot = dots.has(cellKey);
    
    const dotSize = dimensions.CELL_SIZE < 16 ? 'w-0.5 h-0.5' : 'w-1 h-1';
    const powerPelletSize = dimensions.CELL_SIZE < 16 ? 'w-2 h-2' : 'w-3 h-3';
    const characterSize = Math.max(dimensions.CELL_SIZE - 4, 8);
    
    return (
      <div
        key={cellKey}
        className="relative"
        style={{
          width: dimensions.CELL_SIZE,
          height: dimensions.CELL_SIZE,
          backgroundColor: cell === 1 ? '#1e3a8a' : '#000'
        }}
      >
        {hasDot && (
          <div 
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300 ${
              cell === 3 ? powerPelletSize : dotSize
            }`}
          />
        )}
        
        {isPacman && (
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 rounded-full animate-pulse"
            style={{
              width: characterSize,
              height: characterSize,
              clipPath: pacman.direction === 'right' ? 'polygon(20% 0%, 100% 50%, 20% 100%)' :
                       pacman.direction === 'left' ? 'polygon(80% 0%, 0% 50%, 80% 100%)' :
                       pacman.direction === 'up' ? 'polygon(0% 80%, 50% 0%, 100% 80%)' :
                       'polygon(0% 20%, 50% 100%, 100% 20%)'
            }}
          />
        )}
        
        {ghost && (
          <div 
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-t-full ${ghost.frightened ? 'bg-blue-500 animate-pulse' : ''}`}
            style={{ 
              width: characterSize,
              height: characterSize,
              backgroundColor: ghost.frightened ? 'blue' : ghost.color 
            }}
          />
        )}
      </div>
    );
  };

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
          PACMAN
        </h1>
        <div className="w-16 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
      </div>

      {/* Game Stats - Responsive grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-6 w-full max-w-md sm:max-w-4xl">
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-2 sm:p-4 text-center border border-gray-100">
          <div className="text-lg sm:text-2xl font-bold text-blue-600 mb-1">{score}</div>
          <div className="text-gray-600 text-xs sm:text-sm">Score</div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-2 sm:p-4 text-center border border-gray-100">
          <div className="text-lg sm:text-2xl font-bold text-green-600 mb-1">{lives}</div>
          <div className="text-gray-600 text-xs sm:text-sm">Lives</div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-2 sm:p-4 text-center border border-gray-100">
          <div className="text-lg sm:text-2xl font-bold text-purple-600 mb-1">{dots.size}</div>
          <div className="text-gray-600 text-xs sm:text-sm">Dots Left</div>
        </div>
      </div>

      {/* Game Board */}
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl p-3 sm:p-6 border border-gray-100 mb-3 sm:mb-6 w-full max-w-sm sm:max-w-4xl">
        <div 
          id="game-board"
          className="relative grid mx-auto border-2 border-blue-600 rounded-lg overflow-hidden touch-none select-none"
          style={{
            gridTemplateColumns: `repeat(${dimensions.BOARD_WIDTH}, ${dimensions.CELL_SIZE}px)`,
            width: dimensions.BOARD_WIDTH * dimensions.CELL_SIZE,
            height: dimensions.BOARD_HEIGHT * dimensions.CELL_SIZE
          }}
        >
          {maze.map((row, y) =>
            row.map((_, x) => renderCell(x, y))
          )}
          {/* Game State Overlay */}
          {gameState !== 'playing' && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
              <div className="bg-white rounded-2xl p-4 sm:p-8 text-center shadow-2xl max-w-xs sm:max-w-sm mx-2">
                {gameState === 'ready' && (
                  <>
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎮</div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Ready to Play?</h2>
                    <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm">
                      <span className="sm:hidden">Swipe to move or use buttons below</span>
                      <span className="hidden sm:inline">Use arrow keys to move, spacebar to start/pause</span>
                    </p>
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
                
                {gameState === 'paused' && (
                  <>
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⏸️</div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Game Paused</h2>
                    <button 
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        setGameState('playing');
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setGameState('playing');
                      }}
                      className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-colors font-medium text-sm sm:text-base"
                    >
                      Resume
                    </button>
                  </>
                )}
                
                {gameState === 'gameOver' && (
                  <>
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💀</div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Game Over!</h2>
                    <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Final Score: {score}</p>
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
                      Play Again
                    </button>
                  </>
                )}
                
                {gameState === 'won' && (
                  <>
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎉</div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">You Won!</h2>
                    <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Congratulations! Score: {score}</p>
                    <button 
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        resetGame();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        resetGame();
                      }}
                      className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-colors font-medium text-sm sm:text-base"
                    >
                      Play Again
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Control Buttons */}
      <div className="block sm:hidden mb-4">
        <div className="grid grid-cols-3 gap-2 w-32 mx-auto">
          <div></div>
          <button 
            onTouchStart={(e) => { e.preventDefault(); movePacman('up'); }}
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg p-3 shadow-lg transition-colors"
          >
            ↑
          </button>
          <div></div>
          <button 
            onTouchStart={(e) => { e.preventDefault(); movePacman('left'); }}
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg p-3 shadow-lg transition-colors"
          >
            ←
          </button>
          <button 
            onTouchStart={(e) => { 
              e.preventDefault(); 
              if (gameState === 'ready') setGameState('playing');
              else if (gameState === 'playing') setGameState('paused');
              else if (gameState === 'paused') setGameState('playing');
            }}
            className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-lg p-2 shadow-lg transition-colors text-xs"
          >
            {gameState === 'playing' ? '⏳' : '▶️'}
          </button>
          <button 
            onTouchStart={(e) => { e.preventDefault(); movePacman('right'); }}
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg p-3 shadow-lg transition-colors"
          >
            →
          </button>
          <div></div>
          <button 
            onTouchStart={(e) => { e.preventDefault(); movePacman('down'); }}
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg p-3 shadow-lg transition-colors"
          >
            ↓
          </button>
          <div></div>
        </div>
      </div>

      {/* Controls Info - Responsive */}
      <div className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-6 px-2">
        <p className="sm:hidden">Swipe to move or use buttons below • Avoid ghosts • Collect all dots!</p>
        <p className="hidden sm:block">Arrow keys to move • Spacebar to pause/resume • Avoid the ghosts • Collect all dots to win!</p>
        <p className="text-xs mt-1">Power pellets make ghosts vulnerable for 7 seconds!</p>
      </div>
    </div>
  );
};

export default PacmanGame;
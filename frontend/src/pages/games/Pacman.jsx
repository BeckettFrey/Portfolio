    import { useState, useEffect, useCallback } from 'react';

    const PacmanGame = () => {
      const BOARD_WIDTH = 19;
      const BOARD_HEIGHT = 21;
      const CELL_SIZE = 20;
      
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

      useEffect(() => {
        const initialDots = new Set();
        for (let y = 0; y < BOARD_HEIGHT; y++) {
          for (let x = 0; x < BOARD_WIDTH; x++) {
            if (maze[y][x] === 2 || maze[y][x] === 3) {
              initialDots.add(`${x},${y}`);
            }
          }
        }
        setDots(initialDots);
      }, []);

      const isValidMove = (x, y) => {
        if (x < 0 || x >= BOARD_WIDTH || y < 0 || y >= BOARD_HEIGHT) return false;
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
          }
          
          if (newX < 0) newX = BOARD_WIDTH - 1;
          if (newX >= BOARD_WIDTH) newX = 0;
          
          if (isValidMove(newX, newY)) {
            return { x: newX, y: newY, direction };
          }
          return prev;
        });
      }, [gameState]);

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

      useEffect(() => {
        const handleKeyPress = (e) => {
          switch (e.key) {
            case 'ArrowUp': movePacman('up'); break;
            case 'ArrowDown': movePacman('down'); break;
            case 'ArrowLeft': movePacman('left'); break;
            case 'ArrowRight': movePacman('right'); break;
            case ' ': 
              if (gameState === 'ready') setGameState('playing');
              else if (gameState === 'playing') setGameState('paused');
              else if (gameState === 'paused') setGameState('playing');
              break;
          }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
      }, [movePacman, gameState]);

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
        for (let y = 0; y < BOARD_HEIGHT; y++) {
          for (let x = 0; x < BOARD_WIDTH; x++) {
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
        
        return (
          <div
            key={cellKey}
            className="relative"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: cell === 1 ? '#1e3a8a' : '#000'
            }}
          >
            {hasDot && (
              <div 
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full ${
                  cell === 3 ? 'w-3 h-3 bg-yellow-300' : 'w-1 h-1 bg-yellow-300'
                }`}
              />
            )}
            
            {isPacman && (
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"
                style={{
                  clipPath: pacman.direction === 'right' ? 'polygon(20% 0%, 100% 50%, 20% 100%)' :
                           pacman.direction === 'left' ? 'polygon(80% 0%, 0% 50%, 80% 100%)' :
                           pacman.direction === 'up' ? 'polygon(0% 80%, 50% 0%, 100% 80%)' :
                           'polygon(0% 20%, 50% 100%, 100% 20%)'
                }}
              />
            )}
            
            {ghost && (
              <div 
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-t-full ${ghost.frightened ? 'bg-blue-500 animate-pulse' : ''}`}
                style={{ backgroundColor: ghost.frightened ? 'blue' : ghost.color }}
              />
            )}
          </div>
        );
      };

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans flex items-center justify-center p-4">
          <div className="fixed top-6 left-6 z-50">
            <a 
              href="/" 
              className="flex items-center justify-center w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            >
              <span className="text-xl">×</span>
            </a>
          </div>

          <div className="max-w-4xl w-full">
            <div className="text-center mb-8">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                PACMAN
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-6"></div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-2xl shadow-lg p-4 text-center border border-gray-100">
                <div className="text-2xl font-bold text-blue-600 mb-1">{score}</div>
                <div className="text-gray-600 text-sm">Score</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 text-center border border-gray-100">
                <div className="text-2xl font-bold text-green-600 mb-1">{lives}</div>
                <div className="text-gray-600 text-sm">Lives</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 text-center border border-gray-100">
                <div className="text-2xl font-bold text-purple-600 mb-1">{dots.size}</div>
                <div className="text-gray-600 text-sm">Dots Left</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-6">
              <div 
                className="grid mx-auto border-2 border-blue-600 rounded-lg overflow-hidden"
                style={{
                  gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
                  width: BOARD_WIDTH * CELL_SIZE,
                  height: BOARD_HEIGHT * CELL_SIZE
                }}
              >
                {maze.map((row, y) =>
                  row.map((cell, x) => renderCell(x, y))
                )}
              </div>
            </div>

            {gameState !== 'playing' && (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                {gameState === 'ready' && (
                  <>
                    <div className="text-4xl mb-4">🎮</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Play?</h2>
                    <p className="text-gray-600 mb-6">Use arrow keys to move, spacebar to start/pause</p>
                    <button 
                      onClick={() => setGameState('playing')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full transition-colors font-medium"
                    >
                      Start Game
                    </button>
                  </>
                )}
                
                {gameState === 'paused' && (
                  <>
                    <div className="text-4xl mb-4">⏸️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Paused</h2>
                    <button 
                      onClick={() => setGameState('playing')}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full transition-colors font-medium"
                    >
                      Resume
                    </button>
                  </>
                )}
                
                {gameState === 'gameOver' && (
                  <>
                    <div className="text-4xl mb-4">💀</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Over!</h2>
                    <p className="text-gray-600 mb-6">Final Score: {score}</p>
                    <button 
                      onClick={resetGame}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full transition-colors font-medium"
                    >
                      Play Again
                    </button>
                  </>
                )}
                
                {gameState === 'won' && (
                  <>
                    <div className="text-4xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">You Won!</h2>
                    <p className="text-gray-600 mb-6">Congratulations! Score: {score}</p>
                    <button 
                      onClick={resetGame}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full transition-colors font-medium"
                    >
                      Play Again
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="text-center text-sm text-gray-500 mt-6">
              <p>Arrow keys to move • Spacebar to pause • Avoid the ghosts • Collect all dots to win!</p>
              <p>Power pellets make ghosts vulnerable for 7 seconds!</p>
            </div>
          </div>
        </div>
      );
    };

    export default PacmanGame;
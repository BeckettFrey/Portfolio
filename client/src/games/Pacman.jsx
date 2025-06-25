
'use client';
    import { useState, useEffect, useCallback } from 'react';

    const PacManGame = () => {
      // Responsive dimensions with better mobile scaling
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
      const [lastTouchTime, setLastTouchTime] = useState(0);

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

      // Optimized dimension calculations for mobile
      useEffect(() => {
        const updateDimensions = () => {
          const screenWidth = window.innerWidth;
          const screenHeight = window.innerHeight;
          const isMobile = screenWidth < 768;
          
          if (isMobile) {
            const maxWidth = Math.min(screenWidth - 16, 360);
            const maxHeight = Math.min(screenHeight * 0.8 - 120, 420);
            const cellSize = Math.min(
              Math.floor(maxWidth / 19),
              Math.floor(maxHeight / 21),
              18
            );

            
            setDimensions({
              BOARD_WIDTH: 19,
              BOARD_HEIGHT: 21,
              CELL_SIZE: Math.max(cellSize, 10) 

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
          
          let newDirection;
          if (ghost.frightened) {
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
            setGhosts(prev => prev.map(ghost => ({ ...ghost, frightened: true })));
            if (frightenedTimer) clearTimeout(frightenedTimer);
            const timer = setTimeout(() => {
              setGhosts(prev => prev.map(ghost => ({ ...ghost, frightened: false })));
              setFrightenedTimer(null);
            }, 7000);
            setFrightenedTimer(timer);
          }
        }

        const ghostCollision = ghosts.find(ghost => ghost.x === pacman.x && ghost.y === pacman.y);
        if (ghostCollision) {
          if (ghostCollision.frightened) {
            setScore(prev => prev + 200);
            setGhosts(prev => prev.map(ghost => 
              ghost.x === pacman.x && ghost.y === pacman.y 
                ? { ...ghost, x: 9, y: 9, frightened: false }
                : ghost
            ));
          } else {
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
          e.preventDefault();
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

      // Improved touch controls with debouncing
      useEffect(() => {
        let startX = null;
        let startY = null;
        const touchCooldown = 200;

        const handleTouchStart = (e) => {
          e.preventDefault();
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e) => {
          if (!startX || !startY) return;
          
          const currentTime = Date.now();
          if (currentTime - lastTouchTime < touchCooldown) return;
          
          setLastTouchTime(currentTime);

          const endX = e.changedTouches[0].clientX;
          const endY = e.changedTouches[0].clientY;
          
          const deltaX = endX - startX;
          const deltaY = endY - startY;
          
          const minSwipeDistance = 20;
          
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > minSwipeDistance) {
              movePacman(deltaX > 0 ? 'right' : 'left');
            }
          } else {
            if (Math.abs(deltaY) > minSwipeDistance) {
              movePacman(deltaY > 0 ? 'down' : 'up');
            }
          }
          
          startX = null;
          startY = null;
        };

        const gameBoard = document.getElementById('game-board');
        if (gameBoard) {
          gameBoard.addEventListener('touchstart', handleTouchStart, { passive: false });
          gameBoard.addEventListener('touchend', handleTouchEnd, { passive: false });
          
          return () => {
            gameBoard.removeEventListener('touchstart', handleTouchStart);
            gameBoard.removeEventListener('touchend', handleTouchEnd);
          };
        }
      }, [movePacman, lastTouchTime]);

      // Prevent zoom on mobile
      useEffect(() => {
        const preventZoom = (e) => {
          if (e.touches.length > 1) {
            e.preventDefault();
          }
        };

        document.addEventListener('touchstart', preventZoom, { passive: false });
        document.addEventListener('touchmove', preventZoom, { passive: false });

        return () => {
          document.removeEventListener('touchstart', preventZoom);
          document.removeEventListener('touchmove', preventZoom);
        };
      }, []);

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
        
        const dotSize = dimensions.CELL_SIZE < 16 ? 'w-1 h-1' : 'w-1.5 h-1.5';
        const powerPelletSize = dimensions.CELL_SIZE < 16 ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5';
        const characterSize = Math.max(dimensions.CELL_SIZE - 2, 10);
        
        return (
          <div
            key={cellKey}
            className="relative"
            style={{
              width: dimensions.CELL_SIZE,
              height: dimensions.CELL_SIZE,
              backgroundColor: cell === 1 ? '#1e3a8a' : 'grey'
            }}
          >
            {hasDot && (
              <div 
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300 ${
                  cell === 3 ? powerPelletSize : dotSize
                } ${cell === 3 ? 'animate-pulse' : ''}`}
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
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-t-full ${ghost.frightened ? 'bg-blue-600 animate-pulse' : ''}`}
                style={{ 
                  width: characterSize,
                  height: characterSize,
                  backgroundColor: ghost.frightened ? '#2563eb' : ghost.color 
                }}
              >
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-transparent border-b-4 border-white rounded-b-full" />
                <div className="absolute top-1/3 left-1/4 w-1/4 h-1/4 bg-white rounded-full" />
                <div className="absolute top-1/3 right-1/4 w-1/4 h-1/4 bg-white rounded-full" />
              </div>
            )}
          </div>
        );
      };

      return (
        <div className="relative min-h-screen text-white font-sans overflow-hidden">

          <div className="container mx-auto max-w-full sm:max-w-lg relative z-10 flex flex-col items-center">
           
            {/* Game Stats */}
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-white/10 mb-4 w-full max-w-sm">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-3 text-center border border-white/10">
                  <div className="text-lg sm:text-xl font-bold text-blue-400 mb-1">{score}</div>
                  <div className="text-gray-300 text-xs">Score</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-3 text-center border border-white/10">
                  <div className="text-lg sm:text-xl font-bold text-green-400 mb-1">{lives}</div>
                  <div className="text-gray-300 text-xs">Lives</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-3 text-center border border-white/10">
                  <div className="text-lg sm:text-xl font-bold text-purple-400 mb-1">{dots.size}</div>
                  <div className="text-gray-300 text-xs">Dots Left</div>
                </div>
              </div>
            </div>


            {/* Game Board */}
            <div className="w-full flex justify-center">
              <div 
                id="game-board"
                className="relative grid border-2 border-blue-400 rounded-lg overflow-hidden touch-none select-none"
                style={{
                  gridTemplateColumns: `repeat(${dimensions.BOARD_WIDTH}, ${dimensions.CELL_SIZE}px)`,
                  width: dimensions.BOARD_WIDTH * dimensions.CELL_SIZE,
                  height: dimensions.BOARD_HEIGHT * dimensions.CELL_SIZE,
                  backgroundColor: 'black'
                }}
              >
                {maze.map((row, y) =>
                  row.map((_, x) => renderCell(x, y))
                )}
                {/* Game State Overlay */}
                {gameState !== 'playing' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 text-center border border-white/10 max-w-xs mx-2">
                      {gameState === 'ready' && (
                        <>
                          <div className="text-3xl mb-3">🎮</div>
                          <h2 className="text-xl font-bold text-white mb-3">Ready to Chomp?</h2>
                          <p className="text-gray-300 mb-4 text-xs leading-relaxed">
                            <span className="sm:hidden">Swipe or tap buttons to move</span>
                            <span className="hidden sm:inline">Use arrow keys to move, spacebar to start/pause</span>
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
                            Start Game
                          </button>
                        </>
                      )}
                      {gameState === 'paused' && (
                        <>
                          <div className="text-3xl mb-3">⏸️</div>
                          <h2 className="text-xl font-bold text-white mb-3">Game Paused</h2>
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
                            className="bg-green-400 hover:bg-green-500 active:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm"
                          >
                            Resume
                          </button>
                        </>
                      )}
                      {gameState === 'gameOver' && (
                        <>
                          <div className="text-3xl mb-3">💀</div>
                          <h2 className="text-xl font-bold text-white mb-3">Game Over!</h2>
                          <p className="text-gray-300 mb-4 text-xs">Final Score: {score}</p>
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
                            Play Again
                          </button>
                        </>
                      )}
                      {gameState === 'won' && (
                        <>
                          <div className="text-3xl mb-3">🎉</div>
                          <h2 className="text-xl font-bold text-white mb-3">You Won!</h2>
                          <p className="text-gray-300 mb-4 text-xs">Congratulations! Score: {score}</p>
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
                            className="bg-purple-400 hover:bg-purple-500 active:bg-purple-600 text-white py-2 rounded-lg transition-all duration-300 font-medium text-sm"
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
          </div>
        </div>
      );
    };

export default PacManGame;
'use client';

import useIsMobile from '@/utils/hooks/useIsMobile';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useLayoutEffect } from 'react';

export function Tetris({isMobile = false}) {
  // Responsive dimensions
  const [dimensions, setDimensions] = useState({
    BOARD_WIDTH: 10,
    BOARD_HEIGHT: 20,
    CELL_SIZE: 20
  });

  const TETROMINOES = {
    I: { shape: [[1,1,1,1]], color: 'grey' },   // blue-400
    O: { shape: [[1,1],[1,1]], color: '#facc15' }, // yellow-400
    T: { shape: [[0,1,0],[1,1,1]], color: '#c084fc' }, // purple-400
    S: { shape: [[0,1,1],[1,1,0]], color: '#4ade80' }, // green-400
    Z: { shape: [[1,1,0],[0,1,1]], color: '#f87171' }, // red-400
    J: { shape: [[1,0,0],[1,1,1]], color: 'darkblue' }, // blue-400
    L: { shape: [[0,0,1],[1,1,1]], color: '#fb923c' }  // orange-400
  };

  const [board, setBoard] = useState(() => 
    Array(20).fill().map(() => Array(10).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState('ready');
  const [dropTime, setDropTime] = useState(1000);

  const lastDropRef = useRef(Date.now());

  
useLayoutEffect(() => {
  const updateDimensions = () => {
    const width = window.innerWidth - 16;
    const height = window.innerHeight * 0.7 - 120;

    const cell = Math.max(16, Math.min(Math.floor(width / 10), Math.floor(height / 20), 24));

    setDimensions((prev) => {
      if (prev.CELL_SIZE !== cell) {
        return { BOARD_WIDTH: 10, BOARD_HEIGHT: 20, CELL_SIZE: cell };
      }
      return prev;
    });
  };

  updateDimensions();
  window.addEventListener('resize', updateDimensions);
  return () => window.removeEventListener('resize', updateDimensions);
}, []);


  // Reset board when dimensions change
  useEffect(() => {
    setBoard(Array(dimensions.BOARD_HEIGHT).fill().map(() => Array(dimensions.BOARD_WIDTH).fill(0)));
  }, [dimensions]);

  const getRandomPiece = () => {
    const pieces = Object.keys(TETROMINOES);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    return {
      type: randomPiece,
      shape: TETROMINOES[randomPiece].shape,
      color: TETROMINOES[randomPiece].color,
      x: Math.floor(dimensions.BOARD_WIDTH / 2) - Math.floor(TETROMINOES[randomPiece].shape[0].length / 2),
      y: 0
    };
  };

  // Initialize pieces
  useEffect(() => {
    if (dimensions.BOARD_WIDTH > 0) {
      setCurrentPiece(getRandomPiece());
      setNextPiece(getRandomPiece());
    }
  }, [dimensions]);

  const isValidMove = (piece, dx = 0, dy = 0, newShape = null) => {
    if (!piece) return false;
    const shape = newShape || piece.shape;
    const newX = piece.x + dx;
    const newY = piece.y + dy;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardX = newX + x;
          const boardY = newY + y;
          
          if (boardX < 0 || boardX >= dimensions.BOARD_WIDTH || boardY >= dimensions.BOARD_HEIGHT) {
            return false;
          }
          
          if (boardY >= 0 && board[boardY][boardX]) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const rotatePiece = (shape) => {
    const rotated = [];
    for (let x = 0; x < shape[0].length; x++) {
      const row = [];
      for (let y = shape.length - 1; y >= 0; y--) {
        row.push(shape[y][x]);
      }
      rotated.push(row);
    }
    return rotated;
  };

  const placePiece = useCallback((pieceToPlace = currentPiece) => {
    if (!pieceToPlace) return;

    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < pieceToPlace.shape.length; y++) {
      for (let x = 0; x < pieceToPlace.shape[y].length; x++) {
        if (pieceToPlace.shape[y][x]) {
          const boardY = pieceToPlace.y + y;
          const boardX = pieceToPlace.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = pieceToPlace.color;
          }
        }
      }
    }

    setBoard(newBoard);
    
    // Check for completed lines
    const completedLines = [];
    for (let y = dimensions.BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        completedLines.push(y);
      }
    }

    if (completedLines.length > 0) {
      const clearedBoard = newBoard.filter((_, index) => !completedLines.includes(index));
      const emptyRows = Array(completedLines.length).fill().map(() => Array(dimensions.BOARD_WIDTH).fill(0));
      const finalBoard = [...emptyRows, ...clearedBoard];
      
      setBoard(finalBoard);
      setLines(prev => prev + completedLines.length);
      setScore(prev => prev + completedLines.length * 100 * level);
    }

    setCurrentPiece(nextPiece);
    setNextPiece(getRandomPiece());
    
    if (nextPiece && !isValidMove(nextPiece, 0, 0)) {
      setGameState('gameOver');
    }
  }, [currentPiece, board, nextPiece, level, dimensions]);

  const movePiece = useCallback((dx, dy) => {
    if (gameState !== 'playing' || !currentPiece) return;

    if (isValidMove(currentPiece, dx, dy)) {
      setCurrentPiece(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    } else if (dy > 0) {
      placePiece();
    }
  }, [gameState, currentPiece, isValidMove, placePiece]);

  const rotatePieceAction = useCallback(() => {
    if (gameState !== 'playing' || !currentPiece) return;

    const rotated = rotatePiece(currentPiece.shape);
    if (isValidMove(currentPiece, 0, 0, rotated)) {
      setCurrentPiece(prev => ({ ...prev, shape: rotated }));
    }
  }, [gameState, currentPiece, isValidMove]);

  const hardDrop = useCallback(() => {
    if (gameState !== 'playing' || !currentPiece) return;

    let dropDistance = 0;
    while (isValidMove(currentPiece, 0, dropDistance + 1)) {
      dropDistance++;
    }
    
    const newPiece = { ...currentPiece, y: currentPiece.y + dropDistance };
    placePiece(newPiece);
  }, [gameState, currentPiece, isValidMove, placePiece]);

  // Auto-drop loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const dropLoop = () => {
      const now = Date.now();
      if (now - lastDropRef.current >= dropTime) {
        movePiece(0, 1);
        lastDropRef.current = now;
      }
      animationIdRef.current = requestAnimationFrame(dropLoop);
    };

    const animationIdRef = { current: null };
    animationIdRef.current = requestAnimationFrame(dropLoop);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [gameState, dropTime, movePiece]);

  // Level progression
  useEffect(() => {
    const newLevel = Math.floor(lines / 5) + 1;
    setLevel(newLevel);
    const baseSpeed = Math.max(100, 1000 - Math.min(newLevel - 1, 9) * 100);
    setDropTime(baseSpeed);
  }, [lines]);

  // Controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          hardDrop();
          break;
        case 'ArrowUp':
          rotatePieceAction();
          break;
        case ' ':
          if (gameState === 'ready') {
            setGameState('playing');
          } else if (gameState === 'playing') {
            setGameState('paused');
          } else if (gameState === 'paused') {
            setGameState('playing');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePiece, rotatePieceAction, gameState, hardDrop, dimensions]);

  // Touch controls
  useEffect(() => {
    let startX = null;
    let startY = null;
    let startTime = null;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const handleTouchEnd = (e) => {
  if (startX === null || startY === null) return;

  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;
  const endTime = Date.now();

  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const deltaTime = endTime - startTime;

  const minSwipeDistance = 30;
  const maxTapTime = 200;

  if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < maxTapTime) {
    // Tap detected → rotate
    rotatePieceAction();
  } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > minSwipeDistance) {
    // Downward swipe → hard drop
    hardDrop();
  } else if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
    // Horizontal swipe → move left/right
    movePiece(deltaX > 0 ? 1 : -1, 0);
  }

  startX = null;
  startY = null;
  startTime = null;
};


    const gameBoard = document.getElementById('tetris-board');
    if (gameBoard) {
      gameBoard.addEventListener('touchstart', handleTouchStart, { passive: true });
      gameBoard.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      return () => {
        gameBoard.removeEventListener('touchstart', handleTouchStart);
        gameBoard.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [movePiece, rotatePieceAction, hardDrop]);

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
    setBoard(Array(dimensions.BOARD_HEIGHT).fill().map(() => Array(dimensions.BOARD_WIDTH).fill(0)));
    setCurrentPiece(getRandomPiece());
    setNextPiece(getRandomPiece());
    setScore(0);
    setLines(0);
    setLevel(1);
    setDropTime(1000);
    setGameState('playing'); // <- immediate start
  };

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (boardY >= 0 && boardY < dimensions.BOARD_HEIGHT && boardX >= 0 && boardX < dimensions.BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }

    return displayBoard;
  };

  const renderPreview = (piece) => {
    if (!piece) return null;
    
    const previewSize = dimensions.CELL_SIZE < 24 ? 8 : 12;
    
    return (
      <div className="flex flex-col items-center">
        <div className="grid gap-0.5">
          {piece.shape.map((row, y) => (
            <div key={y} className="flex gap-0.5">
              {row.map((cell, x) => (
                <div
                  key={x}
                  className="rounded border"
                  style={{
                    width: previewSize,
                    height: previewSize,
                    backgroundColor: cell ? piece.color : 'transparent',
                    borderColor: cell ? piece.color : 'rgba(255,255,255,0.1)',
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative max-h-screen text-white font-sans overflow-hidden mt-4">
      {/* RETRO GAME TITLE */}
<div className="mb-6 text-center">
  <div className="relative">
    {/* Main title with retro styling */}
    <h1 className="text-4xl sm:text-6xl font-black tracking-wider mb-2 relative">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500
                       drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]
                       animate-pulse font-mono">
        TETRIS
      </span>
    </h1>

    {/* Subtitle with arcade feel */}
    <div className="text-xs sm:text-sm font-bold text-green-300 tracking-[0.2em] mb-1 
                    drop-shadow-[0_0_8px_rgba(0,255,128,0.6)]
                    font-mono">
      ★ BLOCK STACKER ★
    </div>

    {/* Decorative elements */}
    <div className="flex justify-center items-center gap-2 text-yellow-300">
      <span className="animate-bounce">🟦</span>
      <span className="text-xs font-mono tracking-wider">DROP • ROTATE • CLEAR</span>
      <span className="animate-bounce [animation-delay:300ms]">🟥</span>
    </div>
  </div>
</div>


      <div className="container mx-auto max-w-lg relative flex flex-col items-center">
       
        {/* Game Stats */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-white/10 mb-4 w-full max-w-sm">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-3 text-center border border-white/10">
              <div className="text-lg sm:text-xl font-bold text-blue-400 mb-1">{score}</div>
              <div className="text-gray-300 text-xs">Score</div>
            </div>
           <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-3 text-center border border-white/10 flex flex-col items-center justify-between" style={{ minHeight: '80px' }}>
            <div className="flex items-center justify-center flex-1">
              {renderPreview(nextPiece)}
            </div>
            <div className="text-gray-300 text-xs mt-2">Next</div>
          </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-3 text-center border border-white/10">
              <div className="text-lg sm:text-xl font-bold text-purple-400 mb-1">{(1000 / dropTime).toFixed(1)}x</div>
              <div className="text-gray-300 text-xs">Speed</div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} justify-center`}>
          {/* Game Board */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 relative">
            <div 
              id="tetris-board"
              className="relative grid mx-auto border-2 border-blue-400 rounded-lg overflow-hidden touch-none select-none"
              style={{
                gridTemplateColumns: `repeat(${dimensions.BOARD_WIDTH}, ${dimensions.CELL_SIZE}px)`,
                width: dimensions.BOARD_WIDTH * dimensions.CELL_SIZE,
                height: dimensions.BOARD_HEIGHT * dimensions.CELL_SIZE,
                background: 'linear-gradient(to bottom, #87ceeb, #1e90ff)' // Sky-like gradient
              }}
            >
              {renderBoard().map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${x}-${y}`}
                    className="border border-white/10"
                    style={{
                      width: dimensions.CELL_SIZE,
                      height: dimensions.CELL_SIZE,
                      backgroundColor: cell || 'transparent'
                    }}
                  />
                ))
              )}
              {/* Game State Overlay */}
              {gameState !== 'playing' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 text-center border border-white/10 max-w-xs mx-2">
                    {gameState === 'ready' && (
                      <>
                        <div className="text-3xl mb-3">🎮</div>
                        <h2 className="text-xl font-bold text-white mb-3">Ready to Play?</h2>
                        <p className="text-gray-300 mb-4 text-xs leading-relaxed">
                          <span className="sm:hidden">Swipe to move, tap to rotate, swipe down to drop</span>
                          <span className="hidden sm:inline">Use arrows to move/rotate/drop, spacebar to pause</span>
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
                          className="bg-green-400 hover:bg-green-500 active:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm"
                        >
                          Resume
                        </button>
                      </>
                    )}
                    {gameState === 'gameOver' && (
                      <>
                        <div className="text-3xl mb-3">💀</div>
                        <h2 className="text-xl font-bold text-white mb-3">Game Over!</h2>
                        <p className="text-gray-300 mb-2 text-sm">Score: {score}</p>
                        <p className="text-gray-300 mb-4 text-sm">Lines: {lines}</p>
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function TetrisPageClient() {
    const isMobile = useIsMobile();
    
    return (
      
        
            <Tetris isMobile={isMobile} />
    );
}
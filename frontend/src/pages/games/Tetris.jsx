import { useState, useEffect, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';

const TetrisGame = () => {
  // Responsive dimensions
  const [dimensions, setDimensions] = useState({
    BOARD_WIDTH: 10,
    BOARD_HEIGHT: 20,
    CELL_SIZE: 20
  });
  
  const TETROMINOES = {
    I: { shape: [[1,1,1,1]], color: '#00f5ff' },
    O: { shape: [[1,1],[1,1]], color: '#ffff00' },
    T: { shape: [[0,1,0],[1,1,1]], color: '#a000f0' },
    S: { shape: [[0,1,1],[1,1,0]], color: '#00ff00' },
    Z: { shape: [[1,1,0],[0,1,1]], color: '#ff0000' },
    J: { shape: [[1,0,0],[1,1,1]], color: '#0000ff' },
    L: { shape: [[0,0,1],[1,1,1]], color: '#ffa500' }
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

  // Update dimensions based on screen size
  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const isMobile = screenWidth < 768;
      
      if (isMobile) {
        const maxWidth = screenWidth - 40;
        const maxHeight = screenHeight * 0.6;
        const cellSize = Math.min(Math.max(Math.min(Math.floor(maxWidth / 10), Math.floor(maxHeight / 20)), 16), 24);
        
        setDimensions({
          BOARD_WIDTH: 10,
          BOARD_HEIGHT: 20,
          CELL_SIZE: cellSize
        });
      } else {
        setDimensions({
          BOARD_WIDTH: 10,
          BOARD_HEIGHT: 20,
          CELL_SIZE: 40
        });
      }
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

  // Auto drop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      movePiece(0, 1);
    }, dropTime);

    return () => clearInterval(interval);
  }, [gameState, movePiece, dropTime]);

  // Level progression
  useEffect(() => {
    const newLevel = Math.floor(lines / 10) + 1;
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
          if (dimensions.CELL_SIZE < 24) {
            movePiece(0, 1); // Mobile: Down arrow moves piece down one cell
          } else {
            hardDrop(); // Non-mobile: Down arrow triggers hard drop
          }
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
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = endTime - startTime;
      
      const minSwipeDistance = 30;
      const maxTapTime = 200;
      
      if (Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20 && deltaTime < maxTapTime) {
        rotatePieceAction();
      } else if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
          movePiece(deltaX > 0 ? 1 : -1, 0);
        }
      } else {
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            movePiece(0, 1);
          } else {
            hardDrop();
          }
        }
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
    setGameState('ready');
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
    
    const previewSize = dimensions.CELL_SIZE < 24 ? 3 : 8;
    
    return (
      <div className="grid gap-0.5 p-2 bg-black rounded-lg">
        {piece.shape.map((row, y) => (
          <div key={y} className="flex gap-0.5">
            {row.map((cell, x) => (
              <div
                key={x}
                className="rounded border"
                style={{
                  width: previewSize,
                  height: previewSize,
                  backgroundColor: cell ? piece.color : 'black',
                  borderColor: cell ? piece.color : 'black',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const isMobile = dimensions.CELL_SIZE < 24;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans flex flex-col items-center justify-start p-2 sm:p-4 overflow-hidden">
      {/* Close Button */}
      <div className="z-40 text-center mb-3 sm:mb-6 w-full">
        <button onTouchStart={e => { e.stopPropagation(); window.location.href = "/"; }} onClick={() => window.location.href = "/"} className="flex items-center justify-center w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110">
          <FaTimes className="text-xl " />
        </button>
      </div>
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-3xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4">
          TETRIS
        </h1>
        <div className="w-16 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6 w-full max-w-md sm:max-w-5xl">
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-2 sm:p-6 text-center border border-gray-100">
          <div className="text-lg sm:text-3xl font-bold text-blue-600 mb-1">{score}</div>
          <div className="text-gray-600 text-xs sm:text-base">Score</div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-2 sm:p-6 text-center border border-gray-100">
          <div className="text-lg sm:text-3xl font-bold text-green-600 mb-1">{lines}</div>
          <div className="text-gray-600 text-xs sm:text-base">Lines</div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-2 sm:p-6 text-center border border-gray-100">
          <div className="text-lg sm:text-3xl font-bold text-purple-600 mb-1">{level}</div>
          <div className="text-gray-600 text-xs sm:text-base">Level</div>
        </div>
      </div>

      {/* Game Area */}
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4 sm:gap-6 mb-4 w-full max-w-7xl justify-center`}>
        {/* Game Board */}
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl p-3 sm:p-6 border border-gray-100 relative">
          <div 
            id="tetris-board"
            className="relative grid mx-auto border-2 border-blue-600 rounded-lg overflow-hidden bg-black touch-none select-none"
            style={{
              gridTemplateColumns: `repeat(${dimensions.BOARD_WIDTH}, ${dimensions.CELL_SIZE}px)`,
              width: dimensions.BOARD_WIDTH * dimensions.CELL_SIZE,
              height: dimensions.BOARD_HEIGHT * dimensions.CELL_SIZE
            }}
          >
            {renderBoard().map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className="border border-gray-800"
                  style={{
                    width: dimensions.CELL_SIZE,
                    height: dimensions.CELL_SIZE,
                    backgroundColor: cell || '#000000'
                  }}
                />
              ))
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
                        <span className="sm:hidden">Swipe to move, tap to rotate, swipe up to drop</span>
                        <span className="hidden sm:inline">Use arrows to move/rotate/drop, spacebar to pause</span>
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
                      <p className="text-gray-600 mb-2 text-sm sm:text-base">Score: {score}</p>
                      <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Lines: {lines}</p>
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
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        {!isMobile && (
          <div className="w-80 sm:w-96 flex flex-col gap-6">
            {/* Next Piece */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Next Piece</h3>
              <div className="flex justify-center rounded-lg p-2">
                {renderPreview(nextPiece)}
              </div>
            </div>

            {/* Level Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Level Progress</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{level}</div>
                <div className="text-gray-600 text-sm mb-3">Current Level</div>
                <div className="text-sm text-gray-500">
                  <p>Next level: {10 - (lines % 10)} lines to go</p>
                  <p>Speed increases every 10 lines</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">How to Play</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Left/Right arrows to move</p>
                <p>• Up arrow to rotate</p>
                <p>• Down arrow to hard drop</p>
                <p>• Spacebar to pause/resume</p>
                <p>• Complete lines to score</p>
                <p>• Speed increases every 10 lines</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Next Piece and Controls */}
      {isMobile && (
        <>
          {/* Next Piece */}
          <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-100 mb-4 w-full max-w-xs">
            <div className="text-sm font-bold text-gray-800 mb-2 text-center">Next Piece</div>
            <div className="flex justify-center">
              {renderPreview(nextPiece)}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="grid grid-cols-4 gap-2 mb-4 w-full max-w-xs">
            <button
              onTouchStart={(e) => { e.preventDefault(); rotatePieceAction(); }}
              className="bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white rounded-lg p-3 shadow-lg transition-colors text-sm font-bold"
            >
              ↻
            </button>
            <button
              onTouchStart={(e) => { e.preventDefault(); movePiece(-1, 0); }}
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg p-3 shadow-lg transition-colors"
            >
              ←
            </button>
            <button
              onTouchStart={(e) => { e.preventDefault(); movePiece(1, 0); }}
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg p-3 shadow-lg transition-colors"
            >
              →
            </button>
            <button
              onTouchStart={(e) => { e.preventDefault(); hardDrop(); }}
              className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-lg p-3 shadow-lg transition-colors text-xs font-bold"
            >
              ↓↓
            </button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">Level {level}</div>
              <div className="text-xs text-gray-600">{10 - (lines % 10)} lines to next</div>
            </div>
          </div>
        </>
      )}

      {/* Instructions */}
      <div className="text-center text-xs sm:text-sm text-gray-500 px-2">
        <p className="sm:hidden">Swipe ← → to move • Tap to rotate • Swipe ↑ to drop</p>
        <p className="hidden sm:block">Left/Right arrows to move • Up arrow to rotate • Down arrow to drop • Spacebar to pause/resume • Complete lines to score!</p>
      </div>
    </div>
  );
};

export default TetrisGame;
import { useState, useEffect, useCallback } from 'react';

const TetrisGame = () => {
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;
  const CELL_SIZE = 30;
  
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
    Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState('ready'); // ready, playing, paused, gameOver
  const [dropTime, setDropTime] = useState(1000);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  const getRandomPiece = () => {
    const pieces = Object.keys(TETROMINOES);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    return {
      type: randomPiece,
      shape: TETROMINOES[randomPiece].shape,
      color: TETROMINOES[randomPiece].color,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINOES[randomPiece].shape[0].length / 2),
      y: 0
    };
  };

  // Initialize pieces
  useEffect(() => {
    setCurrentPiece(getRandomPiece());
    setNextPiece(getRandomPiece());
  }, []);

  const isValidMove = (piece, dx = 0, dy = 0, newShape = null) => {
    const shape = newShape || piece.shape;
    const newX = piece.x + dx;
    const newY = piece.y + dy;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardX = newX + x;
          const boardY = newY + y;
          
          if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
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

  const placePiece = useCallback(() => {
    if (!currentPiece) return;

    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = currentPiece.y + y;
          const boardX = currentPiece.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = currentPiece.color;
          }
        }
      }
    }

    setBoard(newBoard);
    
    // Check for completed lines
    const completedLines = [];
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        completedLines.push(y);
      }
    }

    if (completedLines.length > 0) {
      // Remove completed lines
      const clearedBoard = newBoard.filter((_, index) => !completedLines.includes(index));
      const emptyRows = Array(completedLines.length).fill().map(() => Array(BOARD_WIDTH).fill(0));
      const finalBoard = [...emptyRows, ...clearedBoard];
      
      setBoard(finalBoard);
      setLines(prev => prev + completedLines.length);
      setScore(prev => prev + completedLines.length * 100 * level);
    }

    // Spawn next piece
    setCurrentPiece(nextPiece);
    setNextPiece(getRandomPiece());
    
    // Check game over
    if (!isValidMove(nextPiece, 0, 0)) {
      setGameState('gameOver');
    }
  }, [currentPiece, board, nextPiece, level]);

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
    
    setCurrentPiece(prev => ({ ...prev, y: prev.y + dropDistance }));
    setTimeout(placePiece, 50);
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
    const baseSpeed = Math.max(100, 1000 - (newLevel - 1) * 100);
    setDropTime(baseSpeed / speedMultiplier);
  }, [lines, speedMultiplier]);

  // Controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowLeft': movePiece(-1, 0); break;
        case 'ArrowRight': movePiece(1, 0); break;
        case 'ArrowDown': movePiece(0, 1); break;
        case 'ArrowUp': rotatePieceAction(); break;
        case '+':
        case '=':
          setSpeedMultiplier(prev => Math.min(prev + 0.5, 5));
          break;
        case '-':
        case '_':
          setSpeedMultiplier(prev => Math.max(prev - 0.5, 0.5));
          break;
        case ' ': 
          e.preventDefault();
          if (gameState === 'ready') setGameState('playing');
          else if (gameState === 'playing') setGameState('paused');
          else if (gameState === 'paused') setGameState('playing');
          else hardDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePiece, rotatePieceAction, gameState, hardDrop]);

  const resetGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0)));
    setCurrentPiece(getRandomPiece());
    setNextPiece(getRandomPiece());
    setScore(0);
    setLines(0);
    setLevel(1);
    setDropTime(1000);
    setSpeedMultiplier(1);
    setGameState('ready');
  };

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display board
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
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
    
    return (
      <div className="grid gap-1 p-4 bg-gray-50 rounded-lg">
        {piece.shape.map((row, y) => (
          <div key={y} className="flex gap-1">
            {row.map((cell, x) => (
              <div
                key={x}
                className="w-6 h-6 rounded border"
                style={{
                  backgroundColor: cell ? piece.color : 'transparent',
                  borderColor: cell ? piece.color : '#e5e7eb'
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

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

      <div className="max-w-6xl w-full flex gap-8">
        {/* Game Board */}
        <div className="flex-1">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              TETRIS
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
              <div className="text-2xl font-bold text-green-600 mb-1">{lines}</div>
              <div className="text-gray-600 text-sm">Lines</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-purple-600 mb-1">{level}</div>
              <div className="text-gray-600 text-sm">Level</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-orange-600 mb-1">{speedMultiplier}x</div>
              <div className="text-gray-600 text-sm">Speed</div>
            </div>
          </div>

          {/* Game Board */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-6">
            <div 
              className="grid mx-auto border-2 border-blue-600 rounded-lg overflow-hidden bg-black"
              style={{
                gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
                width: BOARD_WIDTH * CELL_SIZE,
                height: BOARD_HEIGHT * CELL_SIZE
              }}
            >
              {renderBoard().map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${x}-${y}`}
                    className="border border-gray-800"
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      backgroundColor: cell || '#000000'
                    }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Controls Info */}
          <div className="text-center text-sm text-gray-500">
            <p>Arrow keys to move • Up arrow to rotate • Spacebar to pause/hard drop • +/- to change speed • Complete lines to score!</p>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80">
          {/* Speed Control */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Speed Control</h3>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setSpeedMultiplier(prev => Math.max(prev - 0.5, 0.5))}
                className="bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full transition-colors font-bold text-lg"
                disabled={speedMultiplier <= 0.5}
              >
                -
              </button>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{speedMultiplier}x</div>
                <div className="text-gray-600 text-sm">Current Speed</div>
              </div>
              <button
                onClick={() => setSpeedMultiplier(prev => Math.min(prev + 0.5, 5))}
                className="bg-green-500 hover:bg-green-600 text-white w-10 h-10 rounded-full transition-colors font-bold text-lg"
                disabled={speedMultiplier >= 5}
              >
                +
              </button>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Press + or - keys to adjust speed</p>
              <p>Range: 0.5x to 5x</p>
            </div>
          </div>

          {/* Next Piece */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Next Piece</h3>
            <div className="flex justify-center">
              {renderPreview(nextPiece)}
            </div>
          </div>

          {/* Game State Overlay */}
          {gameState !== 'playing' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
              {gameState === 'ready' && (
                <>
                  <div className="text-4xl mb-4">🎮</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Play?</h2>
                  <p className="text-gray-600 mb-6">Use arrow keys to move and rotate pieces</p>
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
                  <p className="text-gray-600 mb-2">Final Score: {score}</p>
                  <p className="text-gray-600 mb-6">Lines Cleared: {lines}</p>
                  <button 
                    onClick={resetGame}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full transition-colors font-medium"
                  >
                    Play Again
                  </button>
                </>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">How to Play</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Move pieces with arrow keys</p>
              <p>• Rotate with up arrow</p>
              <p>• Hard drop with spacebar</p>
              <p>• Adjust speed with +/- keys</p>
              <p>• Complete horizontal lines to clear them</p>
              <p>• Speed increases every 10 lines</p>
              <p>• Game ends when pieces reach the top</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;
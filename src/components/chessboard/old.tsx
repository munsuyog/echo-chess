import { Chess, type Square } from "chess.js";
import { useState, useEffect } from "react";
import {
  Chessboard as ReactChessboard,
  type ChessboardOptions,
} from "react-chessboard";

type Props = {
  movesCount: number;
  setMovesCount: React.Dispatch<React.SetStateAction<number>>;
  initialFen: string;
  finished: boolean;
  setFinished: React.Dispatch<React.SetStateAction<boolean>>;
};

const Chessboard = ({ movesCount, setMovesCount, initialFen, finished, setFinished }: Props) => {
  const [chessGame, setChessGame] = useState(
    () => new Chess(initialFen, { skipValidation: true })
  );
  const [position, setPosition] = useState(chessGame.fen());
  const [moveFrom, setMoveFrom] = useState("");
  const [optionSquares, setOptionSquares] = useState<
    Record<string, React.CSSProperties>
  >({});

  // Use initialFen prop to reset game when needed
  useEffect(() => {
    const newGame = new Chess(initialFen, { skipValidation: true });
    setChessGame(newGame);
    setPosition(newGame.fen());
    setMoveFrom("");
    setOptionSquares({});
  }, [initialFen]);

  // Check win condition whenever the position changes
  useEffect(() => {
    if (finished) return; // Don't check if already finished
    
    const board = chessGame.board();
    let whitePieceCount = 0;
    let blackPieceCount = 0;
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === 'w') {
          whitePieceCount++;
        } else if (piece && piece.color === 'b') {
          blackPieceCount++;
        }
      }
    }
    
    if (whitePieceCount === 1 && blackPieceCount === 0) {
      setFinished(true);
    }
  }, [position, finished, setFinished, chessGame]);

  const obstacles = ["e5", "c4", "e3", "f3"];
  const disabledSquares = [
    "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8",
    "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8",
    "c1", "c2", "c7", "c8",
    "d1", "d2", "d7", "d8",
    "e1", "e2", "e7", "e8",
    "f1", "f2", "f7", "f8",
    "g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8",
    "h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8",
  ];

  // Helper function to get all possible moves for a piece regardless of check
  const getPossibleMovesForPiece = (square: Square) => {
    const piece = chessGame.get(square);
    if (!piece) return [];

    const moves = [];
    const [file, rank] = [square.charCodeAt(0) - 97, parseInt(square[1]) - 1]; // Convert to 0-based indices

    // Define move patterns for each piece type
    const movePatterns: Record<string, number[][]> = {
      k: [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
      ], // King
      q: [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
      ], // Queen (unlimited)
      r: [
        [-1, 0], [1, 0], [0, -1], [0, 1],
      ], // Rook (unlimited)
      b: [
        [-1, -1], [-1, 1], [1, -1], [1, 1],
      ], // Bishop (unlimited)
      n: [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2],  [1, 2],  [2, -1],  [2, 1],
      ], // Knight
      p: piece.color === "w"
        ? [[0, 1], [-1, 1], [1, 1]]
        : [[0, -1], [-1, -1], [1, -1]], // Pawn
    };

    const patterns = movePatterns[piece.type];
    if (!patterns) return [];

    for (const [dx, dy] of patterns) {
      if (piece.type === "n" || piece.type === "k" || piece.type === "p") {
        // Single step pieces
        const newFile = file + dx;
        const newRank = rank + dy;

        if (newFile >= 0 && newFile <= 7 && newRank >= 0 && newRank <= 7) {
          const targetSquare:Square = String.fromCharCode(97 + newFile) + (newRank + 1);
          const targetPiece = chessGame.get(targetSquare);

          // Handle pawn movement rules
          if (piece.type === "p") {
            if (dx === 0) {
              // Forward movement - no piece should be there
              if (!targetPiece) {
                moves.push({ from: square, to: targetSquare, piece: piece.type });
              }
            } else {
              // Diagonal capture - only if there's an enemy piece
              if (targetPiece && targetPiece.color !== piece.color) {
                moves.push({ from: square, to: targetSquare, piece: piece.type });
              }
            }
          } else {
            // For king and knight, can move if square is empty or has enemy piece
            if (!targetPiece || targetPiece.color !== piece.color) {
              moves.push({ from: square, to: targetSquare, piece: piece.type });
            }
          }
        }
      } else {
        // Sliding pieces (queen, rook, bishop)
        for (let step = 1; step <= 7; step++) {
          const newFile = file + dx * step;
          const newRank = rank + dy * step;

          if (newFile < 0 || newFile > 7 || newRank < 0 || newRank > 7) break;

          const targetSquare = String.fromCharCode(97 + newFile) + (newRank + 1);

          // Check if target square is an obstacle or disabled - blocks movement
          if (obstacles.includes(targetSquare) || disabledSquares.includes(targetSquare)) {
            break;
          }

          const targetPiece = chessGame.get(targetSquare);

          if (!targetPiece) {
            // Empty square - can move here
            moves.push({ from: square, to: targetSquare, piece: piece.type });
          } else if (targetPiece.color !== piece.color) {
            // Enemy piece - can capture
            moves.push({ from: square, to: targetSquare, piece: piece.type });
            break; // Can't continue past this piece
          } else {
            // Own piece - can't move here
            break;
          }
        }
      }
    }

    return moves;
  };

  // Get move options for a square to show valid moves
  const getMoveOptions = (square: string) => {
    try {
      const moves = getPossibleMovesForPiece(square);
      
      // Filter out moves to obstacles and disabled squares
      const validMoves = moves.filter(
        (move) => !disabledSquares.includes(move.to) && !obstacles.includes(move.to)
      );

      // If no valid moves, clear the option squares
      if (validMoves.length === 0) {
        setOptionSquares({});
        return false;
      }

      // Create a new object to store the option squares
      const newSquares: Record<string, React.CSSProperties> = {};

      // Loop through the moves and set the option squares
      for (const move of validMoves) {
        const targetPiece = chessGame.get(move.to);
        newSquares[move.to] = {
          background:
            targetPiece && targetPiece.color !== chessGame.get(square)?.color
              ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)" // larger circle for capturing
              : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)", // smaller circle for moving
          borderRadius: "50%",
        };
      }

      // Set the square clicked to move from to yellow
      newSquares[square] = {
        background: "rgba(255, 255, 0, 0.4)",
      };

      setOptionSquares(newSquares);
      return true;
    } catch (error) {
      console.log("Error getting moves for square:", square, error);
      setOptionSquares({});
      return false;
    }
  };

  const handleSquareClickLogic = (square: string, piece: any) => {
    // Don't allow moves if game is finished
    if (finished) return;

    // Piece clicked to move
    if (!moveFrom && piece) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) {
        setMoveFrom(square);
      }
      return;
    }

    // Square clicked to move to, check if valid move
    let moves;
    try {
      moves = getPossibleMovesForPiece(moveFrom);
    } catch (error) {
      console.log("Error getting moves:", error);
      moves = [];
    }

    // Filter moves by obstacles and disabled squares
    const validMoves = moves.filter(
      (move) => !disabledSquares.includes(move.to) && !obstacles.includes(move.to)
    );

    const foundMove = validMoves.find(
      (m) => m.from === moveFrom && m.to === square
    );

    // Not a valid move
    if (!foundMove) {
      // Check if clicked on new piece
      const hasMoveOptions = getMoveOptions(square);
      setMoveFrom(hasMoveOptions ? square : "");
      return;
    }

    // Make the move with transformation logic
    const moveSuccess = makeMove(moveFrom, square);
    if (moveSuccess) {
      setMovesCount(prev => prev + 1);
    }

    // Clear moveFrom and optionSquares
    setMoveFrom("");
    setOptionSquares({});
  };

  // Handle square clicks
  const onSquareClick = (square: string, piece?: any) => {
    // If called with object parameter, extract square
    if (typeof square === "object" && square.square) {
      const actualSquare = square.square;
      const actualPiece = chessGame.get(actualSquare);
      return handleSquareClickLogic(actualSquare, actualPiece);
    }

    // Otherwise use parameters directly
    const actualPiece = chessGame.get(square);
    return handleSquareClickLogic(square, actualPiece);
  };

  // Handle piece drag begin - show valid moves
  const onPieceDragBegin = ({ piece, sourceSquare }: { piece: string; sourceSquare: string }) => {
    // Don't show moves if game is finished
    if (finished) return;

    // Show valid moves for the piece being dragged
    getMoveOptions(sourceSquare);
  };

  // Handle piece drag end - clear move highlights
  const onPieceDragEnd = () => {
    // Clear option squares when drag ends
    setOptionSquares({});
    setMoveFrom("");
  };

  // Extract move logic into separate function
  const makeMove = (sourceSquare: string, targetSquare: string) => {
    const gameCopy = new Chess(chessGame.fen(), { skipValidation: true });

    // Get the piece at the source square
    const pieceAtSource = gameCopy.get(sourceSquare);
    if (!pieceAtSource) return false;

    // Check if target square has a piece (capture)
    const pieceAtTarget = gameCopy.get(targetSquare);

    // First, make a temporary legal move to trigger animation
    // We'll use a simple move format that chess.js can understand
    try {
      // Try to make the move using chess.js move system for animation
      const tempMove = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // Always promote to queen if needed
      });
      
      if (tempMove) {
        // Move was successful, now apply our custom transformation logic
        if (pieceAtTarget) {
          // "You become what you eat" - transform the piece at target
          const transformedPiece = {
            type: pieceAtTarget.type,
            color: pieceAtSource.color,
          };
          
          // Remove the piece that just moved and replace with transformed version
          gameCopy.remove(targetSquare);
          gameCopy.put(transformedPiece, targetSquare);
        }
        
        // Update state
        setChessGame(gameCopy);
        setPosition(gameCopy.fen());
        return true;
      }
    } catch (error) {
      // If chess.js move fails, fall back to manual manipulation
      console.log("Chess.js move failed, using manual move:", error);
    }

    // Fallback: manual move without animation
    gameCopy.remove(sourceSquare);

    if (pieceAtTarget) {
      const transformedPiece = {
        type: pieceAtTarget.type,
        color: pieceAtSource.color,
      };
      gameCopy.remove(targetSquare);
      gameCopy.put(transformedPiece, targetSquare);
    } else {
      gameCopy.put(pieceAtSource, targetSquare);
    }

    setChessGame(gameCopy);
    setPosition(gameCopy.fen());
    return true;
  };

  // Handle dropping a piece
  const onPieceDrop = ({
    sourceSquare,
    targetSquare,
    piece,
  }: {
    sourceSquare: string;
    targetSquare: string;
    piece: string;
  }) => {
    // Don't allow moves if game is finished
    if (finished || !targetSquare) {
      return false;
    }

    // Prevent moves to disabled squares or obstacles
    if (disabledSquares.includes(targetSquare) || obstacles.includes(targetSquare)) {
      return false;
    }

    // Check if this is a valid move according to our custom rules
    const moves = getPossibleMovesForPiece(sourceSquare);
    const validMove = moves.find((move) => move.to === targetSquare);
    if (!validMove) {
      return false;
    }

    // Make the move with transformation
    const success = makeMove(sourceSquare, targetSquare);
    if (success) {
      setMovesCount(prev => prev + 1);
    }

    // Clear moveFrom and optionSquares
    setMoveFrom("");
    setOptionSquares({});

    return success;
  };

  // Square styles
  const obstacleStyles = obstacles.reduce<Record<string, React.CSSProperties>>(
    (acc, square) => {
      acc[square] = { backgroundColor: "rgba(255,0,0,1)" };
      return acc;
    },
    {}
  );

  const disabledStyles = disabledSquares.reduce<Record<string, React.CSSProperties>>(
    (acc, square) => {
      acc[square] = { backgroundColor: "#3A3A3A" };
      return acc;
    }, 
    {}
  );

  const chessboardOptions: ChessboardOptions = {
    position: position,
    squareStyles: {
      ...obstacleStyles,
      ...disabledStyles,
      ...optionSquares,
    },
    showNotation: false,
    arePiecesDraggable: !finished,
    showAnimations: true,
    onPieceDrop: onPieceDrop,
    onSquareClick: onSquareClick,
    onPieceDragBegin: onPieceDragBegin,
    onPieceDragEnd: onPieceDragEnd,
  };

  return <ReactChessboard options={chessboardOptions} />;
};

export default Chessboard; 
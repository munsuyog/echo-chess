import { Chess } from "chess.js";
import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import {
  Chessboard as ReactChessboard,
  type ChessboardOptions,
  type PieceDropHandlerArgs,
  type PieceHandlerArgs,
  type SquareHandlerArgs,
} from "react-chessboard";
import {
  compoundToFen,
  getDisabledSquares,
  getObstacleSquares,
} from "../../utils/chess";
import { getPossibleMoves } from "../../utils/moves";

type Props = {
  movesCount: number;
  setMovesCount: React.Dispatch<React.SetStateAction<number>>;
  initialFen: string;
  finished: boolean;
  setFinished: React.Dispatch<React.SetStateAction<boolean>>;
  setPoints: React.Dispatch<React.SetStateAction<number>>
};

export type ChessboardRef = {
  undoMove: () => void;
  resetGame: () => void;
};

const ChessboardExpert = forwardRef<ChessboardRef, Props>(({
  movesCount,
  setMovesCount,
  initialFen,
  finished,
  setFinished,
  setPoints,
}, ref) => {
  const compoundFen =
    initialFen;

  const [chessGame, setChessGame] = useState(
    () => new Chess(compoundToFen(compoundFen), { skipValidation: true })
  );
  const [position, setPosition] = useState(chessGame.fen());
  const [selectedSquare, setSelectedSquare] = useState<string>("");
  const [hoveredSquare, setHoveredSquare] = useState<string>("");
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([chessGame.fen()]);

  // Check win condition whenever the position changes
  useEffect(() => {
    if (finished) return; // Don't check if already finished

    const board = chessGame.board();
    let whitePieceCount = 0;
    let blackPieceCount = 0;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === "w") {
          whitePieceCount++;
        } else if (piece && piece.color === "b") {
          blackPieceCount++;
        }
      }
    }

    if (whitePieceCount === 1 && blackPieceCount === 0) {
      setFinished(true);
    }
  }, [position, finished, setFinished, chessGame]);

  const obstacles = getObstacleSquares(compoundFen);
  const disabledSquares = getDisabledSquares(compoundFen);

  // Undo last move
  const undoMove = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // remove last state
      const previousFen = newHistory[newHistory.length - 1];
      setHistory(newHistory);

      const newGame = new Chess(previousFen, { skipValidation: true });
      setChessGame(newGame);
      setPosition(previousFen);
      
      // Decrease moves count when undoing
      setMovesCount((prev) => Math.max(0, prev - 1));
      
      // Clear selection and possible moves
      setSelectedSquare("");
      setPossibleMoves([]);
      
      // If game was finished, unfinish it
      if (finished) {
        setFinished(false);
      }
    }
  };

  // Reset to initial state
  const resetGame = () => {
    const newGame = new Chess(compoundToFen(initialFen), { skipValidation: true });
    setChessGame(newGame);
    setPosition(compoundToFen(initialFen));
    setHistory([compoundToFen(initialFen)]);
    setMovesCount(0);
    setSelectedSquare("");
    setPossibleMoves([]);
    setFinished(false);
  };

  // Expose functions to parent component
  useImperativeHandle(ref, () => ({
    undoMove,
    resetGame,
  }));

  // Square styles
  const obstacleStyles = obstacles.reduce<Record<string, React.CSSProperties>>(
    (acc, square) => {
      acc[square] = {
        background:
          "url('data:image/svg+xml,%3Csvg%20width%3D%2283%22%20height%3D%2283%22%20viewBox%3D%220%200%2083%2083%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20clip-path%3D%22url(%23clip0_1689_761)%22%3E%3Crect%20width%3D%2282.5%22%20height%3D%2282.5%22%20transform%3D%22translate(0.5)%22%20fill%3D%22%23420101%22%2F%3E%3Cline%20x1%3D%221.40773%22%20y1%3D%22-1.94631%22%20x2%3D%2283.4077%22%20y2%3D%2280.0537%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%2213.4077%22%20y1%3D%22-0.946308%22%20x2%3D%2283.4077%22%20y2%3D%2269.0537%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%2225.4077%22%20y1%3D%22-1.94631%22%20x2%3D%2283.4077%22%20y2%3D%2256.0537%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%2238.4077%22%20y1%3D%22-1.94631%22%20x2%3D%2284.4077%22%20y2%3D%2244.0537%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20y1%3D%22-0.25%22%20x2%3D%2245.2756%22%20y2%3D%22-0.25%22%20transform%3D%22matrix(0.706782%200.707431%20-0.706782%200.707431%2051.231%20-0.798828)%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20y1%3D%22-0.25%22%20x2%3D%2227.4398%22%20y2%3D%22-0.25%22%20transform%3D%22matrix(0.706782%200.707431%20-0.706782%200.707431%2063.837%20-1.76953)%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%2273.4077%22%20y1%3D%22-1.94631%22%20x2%3D%2283.4077%22%20y2%3D%228.05369%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%220.407734%22%20y1%3D%228.05369%22%20x2%3D%2273.4077%22%20y2%3D%2281.0537%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%220.407734%22%20y1%3D%2218.0537%22%20x2%3D%2263.4077%22%20y2%3D%2281.0537%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%221.40773%22%20y1%3D%2231.0537%22%20x2%3D%2252.4077%22%20y2%3D%2282.0537%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%221.40314%22%20y1%3D%2244.0492%22%20x2%3D%2241.4031%22%20y2%3D%2282.0492%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%221.40437%22%20y1%3D%2256.0504%22%20x2%3D%2228.4044%22%20y2%3D%2282.0504%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%221.40773%22%20y1%3D%2266.0537%22%20x2%3D%2216.4077%22%20y2%3D%2281.0537%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%220.407734%22%20y1%3D%2275.0537%22%20x2%3D%227.40773%22%20y2%3D%2282.0537%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%2284.4312%22%20y1%3D%221.45435%22%20x2%3D%221.41789%22%20y2%3D%2282.4284%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%2283.282%22%20y1%3D%2213.4407%22%20x2%3D%2212.417%22%20y2%3D%2282.5649%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%2284.1327%22%20y1%3D%2225.4524%22%20x2%3D%2225.416%22%20y2%3D%2282.7267%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%2283.9711%22%20y1%3D%2238.4514%22%20x2%3D%2237.4027%22%20y2%3D%2283.8759%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20y1%3D%22-0.25%22%20x2%3D%2245.2756%22%20y2%3D%22-0.25%22%20transform%3D%22matrix(-0.716165%200.697931%20-0.698588%20-0.715524%2082.6642%2051.2598)%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20y1%3D%22-0.25%22%20x2%3D%2227.4398%22%20y2%3D%22-0.25%22%20transform%3D%22matrix(-0.716165%200.697931%20-0.698588%20-0.715524%2083.4781%2063.877)%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%2283.5359%22%20y1%3D%2273.4485%22%20x2%3D%2273.4123%22%20y2%3D%2283.3234%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%2274.4443%22%20y1%3D%220.330328%22%20x2%3D%220.542286%22%20y2%3D%2272.417%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%2264.4451%22%20y1%3D%220.205328%22%20x2%3D%220.666588%22%20y2%3D%2262.4171%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%2251.4337%22%20y1%3D%221.0442%22%20x2%3D%22-0.196484%22%20y2%3D%2251.4061%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%2238.4392%22%20y1%3D%220.877553%22%20x2%3D%22-0.0552041%22%20y2%3D%2240.402%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%2226.4389%22%20y1%3D%220.730324%22%20x2%3D%220.105182%22%20y2%3D%2227.4049%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%2216.4364%22%20y1%3D%220.608649%22%20x2%3D%221.25105%22%20y2%3D%2215.421%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3Cline%20x1%3D%227.44947%22%20y1%3D%22-0.50268%22%20x2%3D%220.362969%22%20y2%3D%226.40974%22%20stroke%3D%22%2373000D%22%20stroke-width%3D%220.5%22%2F%3E%3C%2Fg%3E%3Cdefs%3E%3CclipPath%20id%3D%22clip0_1689_761%22%3E%3Crect%20width%3D%2282.5%22%20height%3D%2282.5%22%20fill%3D%22white%22%20transform%3D%22translate(0.5)%22%2F%3E%3C%2FclipPath%3E%3C%2Fdefs%3E%3C%2Fsvg%3E')",
          backgroundSize: "cover"
      };
      return acc;
    },
    {}
  );

  const disabledStyles = disabledSquares.reduce<
    Record<string, React.CSSProperties>
  >((acc, square) => {
    acc[square] = { backgroundColor: "#2F2B29" };
    return acc;
  }, {});

  const selectedStyles: Record<string, React.CSSProperties> = {
    [selectedSquare]: {
      background: "#9AFF9A",
    },
    [hoveredSquare]: {
      background: "#9AFF9A",
    },
  };

  const possibleMovesStyles = possibleMoves.reduce<
    Record<string, React.CSSProperties>
  >((acc, square) => {
    acc[square] = { background: "#9AFF9A" };
    return acc;
  }, {});

const handleSquareClick = ({ piece, square }: SquareHandlerArgs) => {
  const color = piece?.pieceType.split("")[0];

  if (selectedSquare && selectedSquare !== square) {
    const possibleMoves = getPossibleMoves(
      chessGame.board(),
      selectedSquare,
      obstacles,
      disabledSquares
    );

    const move = possibleMoves.find((m) => m.to === square);
    if (move) {
      const sourcePiece = chessGame.get(selectedSquare as any);
      const targetPiece = chessGame.get(square as any);

      if (sourcePiece) {
        // Step 1: Move as original piece
        chessGame.remove(selectedSquare as any);
        chessGame.put(sourcePiece, square as any);
        setPosition(chessGame.fen());

        // Step 2: After animation, morph to new type
        setTimeout(() => {
          let newType: string;
          if (targetPiece) {
            newType = targetPiece.type;
          } else {
            newType = sourcePiece.type;
          }

          chessGame.remove(square as any);
          chessGame.put({ type: newType as any, color: "w" }, square as any);
          setPosition(chessGame.fen());
          setHistory((prev) => [...prev, chessGame.fen()]);

          // Add points if a piece was captured (killed)
          if (targetPiece) {
            setPoints((prev) => prev + 1);
          }
        }, 300); // match chessboard animation
      }

      setSelectedSquare("");
      setPossibleMoves([]);
      setMovesCount((prev) => prev + 1);
      return;
    }
  }

  if (color === "w") {
    setSelectedSquare(square);
    const possibleMoves = getPossibleMoves(
      chessGame.board(),
      square,
      obstacles,
      disabledSquares
    );

    const moves = possibleMoves
      .map((m) => m.to)
      .filter((m) => !obstacles.includes(m) && !disabledSquares.includes(m));

    setPossibleMoves(moves);
  } else {
    setSelectedSquare("");
    setPossibleMoves([]);
  }
};

  const onPieceDrag = ({ piece, square }: PieceHandlerArgs) => {
    if (!square) return;
    const color = piece?.pieceType.split("")[0];
    if (color == "w") {
      setSelectedSquare(square);
    }
    const possibleMoves = getPossibleMoves(
      chessGame.board(),
      square,
      obstacles,
      disabledSquares
    );
    let moves: string[] = [];
    possibleMoves.map((move) => {
      if (!obstacles.includes(move.to) && !disabledSquares.includes(move.to)) {
        moves.push(move.to);
      }
    });
    setPossibleMoves(moves);
  };

const onPieceDrop = ({
    piece,
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs) => {
    const possibleMoves = getPossibleMoves(
      chessGame.board(),
      sourceSquare,
      obstacles,
      disabledSquares
    );
    let isValid: boolean = false;
    const targetPiece = chessGame.get(targetSquare as any);
    const sourcePiece = chessGame.get(sourceSquare as any);

    possibleMoves.map((move) => {
      if (targetSquare == move.to) {
        isValid = true;
      }
    });
    if (!isValid) return false;
    
    if (targetPiece && sourcePiece) {
      console.log(targetSquare);
      
      chessGame.remove(targetSquare as any);
      chessGame.remove(sourceSquare as any);
      chessGame.put(
        { type: targetPiece.type, color: "w" },
        targetSquare as any
      );
      
      // Add points for capturing (killing) a piece
      setPoints((prev) => prev + 1);
    } else if (sourcePiece) {
      chessGame.remove(sourceSquare as any);
      chessGame.put(sourcePiece, targetSquare as any);
    }
    setPosition(chessGame.fen());
    
    // Update move count for drag and drop
    setMovesCount((prev) => prev + 1);
    
    // Update history for undo functionality
    setHistory((prev) => [...prev, chessGame.fen()]);
    
    // Clear selection after move
    setSelectedSquare("");
    setPossibleMoves([]);

    return isValid;
  };

  const handleSquareHover = ({ piece, square }: SquareHandlerArgs) => {
    const color = piece?.pieceType.split("")[0];
    if (color == "w") {
      setHoveredSquare(square);
    }
  };

  const chessboardOptions: ChessboardOptions = {
    position: position,
    squareStyles: {
      ...obstacleStyles,
      ...disabledStyles,
      ...selectedStyles,
      ...possibleMovesStyles,
    },
    lightSquareStyle: {
      background: "#ECECEC",
    },
    darkSquareStyle: {
      background: "#DAA585",
    },
    onMouseOverSquare: handleSquareHover,
    showNotation: false,
    showAnimations: true,
    onSquareClick: handleSquareClick,
    onPieceDrag: onPieceDrag,
    onPieceDrop: onPieceDrop,
    animationDurationInMs: 300,
    onMouseOutSquare: () => {
      setHoveredSquare("");
    },
  };

  return <ReactChessboard options={chessboardOptions} />;
});

ChessboardExpert.displayName = "Chessboard";

export default ChessboardExpert;
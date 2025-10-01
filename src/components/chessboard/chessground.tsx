import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  compoundToFen,
  getDisabledSquares,
  getObstacleSquares,
} from "../../utils/chess";
import { Chessground } from "@lichess-org/chessground";
import type { Api } from "@lichess-org/chessground/api";
import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import "@lichess-org/chessground/assets/chessground.cburnett.css";
import type { Key, Piece, SquareClasses } from "@lichess-org/chessground/types";
import { getPossibleMovesMap } from "../../utils/movesMap";

type Props = {
  compoundFen: string;
  setMovesCount: React.Dispatch<React.SetStateAction<number>>;
  finished: boolean;
  setFinished: React.Dispatch<React.SetStateAction<boolean>>;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
};

export type ChessboardRef = {
  undoMove: () => void;
  resetGame: () => void;
};

const ChessgroundBoard = forwardRef<ChessboardRef, Props>(
  ({ compoundFen, setMovesCount, finished, setFinished, setPoints }, ref) => {
    const boardRef = useRef<HTMLDivElement | null>(null);
    const groundRef = useRef<Api | null>(null);
    const [availableMoves, setAvailableMoves] = useState<string[]>([]);
    const obstacleSquares = getObstacleSquares(compoundFen);
    const disabledSquares = getDisabledSquares(compoundFen);
    const [firstMoveSquare, setFirstMoveSquare] = useState<Key | null>(null);
    const [selectedSquare, setSelectedSquare] = useState<Key | null>(null);
    const [animateSquare, setAnimateSquare] = useState<Key | null>(null);
    const moveHistoryRef = useRef<
      { orig: Key; dest: Key; capturedPiece?: Piece; movedPiece: Piece }[]
    >([]);

    const [pieces, setPieces] = useState<Map<Key, Piece>>(new Map());
    
    // Store the piece that's about to move
    const pendingMoveRef = useRef<{ square: Key; piece: Piece } | null>(null);

    const resetGame = () => {
      groundRef.current?.set({
        fen: compoundToFen(compoundFen),
        movable: { free: false, color: "white" },
        highlight: { custom: computeSquareClasses() },
      });
      setMovesCount(0);
      setPoints(0);
      setAvailableMoves([]);
      setFirstMoveSquare(null);
      setAnimateSquare(null);
      moveHistoryRef.current = [];
      pendingMoveRef.current = null;
    };

    const undoMove = () => {
      if (!groundRef.current || moveHistoryRef.current.length === 0) return;

      const lastMove = moveHistoryRef.current.pop();
      if (!lastMove) return;

      const pieces = new Map(groundRef.current.state.pieces);

      // Restore the moved piece to its original position
      pieces.set(lastMove.orig, lastMove.movedPiece);

      // If there was a captured piece, restore it (with original black color)
      // Otherwise, just remove the piece from destination
      if (lastMove.capturedPiece) {
        pieces.set(lastMove.dest, lastMove.capturedPiece);
        setPoints((prev) => prev - 1);
      } else {
        pieces.delete(lastMove.dest);
      }

      // Update the board
      groundRef.current.setPieces(pieces);

      setMovesCount((prev) => Math.max(prev - 1, 0));
      setAvailableMoves([]);
      setAnimateSquare(null);

      checkFinished(pieces);

      // Update first white piece for highlights
      const firstWhite = Array.from(pieces.entries()).find(
        ([_, p]) => p.color === "white"
      );
      setFirstMoveSquare(firstWhite ? firstWhite[0] : null);

      // Update board state with new dests and highlights
      groundRef.current.set({
        highlight: { custom: computeSquareClasses() },
        movable: { free: false, color: "white", dests: computeDests(pieces) },
      });
    };

    useImperativeHandle(ref, () => ({
      undoMove,
      resetGame,
    }));

    // compute square classes for highlights
    const computeSquareClasses = (): SquareClasses => {
      const map: SquareClasses = new Map();
      obstacleSquares.forEach((sq: any) => map.set(sq, "obstacle"));
      disabledSquares.forEach((sq: any) => map.set(sq, "disabled"));
      availableMoves.forEach((sq: any) => map.set(sq, "available-move"));
      if (firstMoveSquare) {
        map.set(firstMoveSquare, "first-move");
      }
      if (animateSquare) {
        map.set(animateSquare, "animate");
      }
      return map;
    };

    // compute dests for movable.dests
    const computeDests = (pieces: Map<Key, Piece>): Map<Key, Key[]> => {
      const dests: Map<Key, Key[]> = new Map();

      pieces.forEach((piece, square) => {
        if (!piece) return;

        const possibleMoves = getPossibleMovesMap(
          pieces,
          square,
          obstacleSquares,
          disabledSquares
        ).map((m) => m.to as Key);

        if (possibleMoves.length > 0) {
          dests.set(square, possibleMoves);
        }
      });

      return dests;
    };

    // initialize Chessground
    useEffect(() => {
      if (boardRef.current && !groundRef.current) {
        groundRef.current = Chessground(boardRef.current, {
          orientation: "white",
          draggable: { enabled: true },
          highlight: {
            lastMove: false,
          },
          movable: {
            free: false,
            color: "white",
          },
          fen: compoundToFen(compoundFen),
          coordinates: false,
          events: {
            select: handleSelectPiece,
            move: handleMove,
          },
          drawable: {
            enabled: true,
            visible: false,
          },
          animation: {
            duration: 100,
          },
        });
        const pieces = groundRef.current.state.pieces;
        setPieces(new Map(pieces));
        groundRef.current.set({
          highlight: { custom: computeSquareClasses() },
        });
        groundRef.current.state.pieces.forEach((value, key) => {
          if (value.color == "white") {
            setFirstMoveSquare(key);
          }
        });
      }
    }, []);

    // update fen and highlights when prop changes
    useEffect(() => {
      if (groundRef.current) {
        const pieces = groundRef.current.state.pieces;
        groundRef.current.set({
          movable: {
            free: false,
            color: "white",
            dests: computeDests(pieces),
          },
          highlight: { custom: computeSquareClasses() },
        });
      }
    }, [compoundFen, availableMoves, firstMoveSquare, animateSquare]);

    const checkFinished = (piecesMap?: Map<Key, Piece>) => {
      const pieces = piecesMap ?? groundRef.current?.state.pieces;
      if (!pieces) return;

      const vals = Array.from(pieces.values());
      const whitePiecesCount = vals.filter((p) => p.color === "white").length;
      const blackPiecesCount = vals.filter((p) => p.color === "black").length;

      const isFinished = whitePiecesCount === 1 && blackPiecesCount === 0;
      if (isFinished && !finished) setFinished(true);
      if (!isFinished && finished) setFinished(false);
    };

    const handleSelectPiece = (key: Key) => {
      if (!groundRef.current) return;
      
      // Store the selected piece before any move happens
      const piece = groundRef.current.state.pieces.get(key);
      if (piece) {
        pendingMoveRef.current = { square: key, piece };
      }
      
      setSelectedSquare(key);
      const possibleMoves = getPossibleMovesMap(
        groundRef.current.state.pieces,
        key,
        obstacleSquares,
        disabledSquares
      );
      const moves = possibleMoves.map((m) => m.to);
      setAvailableMoves(moves);

      if (groundRef.current) {
        groundRef.current.set({
          highlight: { custom: computeSquareClasses() },
        });
      }
    };

    const handleMove = (orig: Key, dest: Key, capturedPiece?: Piece) => {
      if (!groundRef.current) return false;

      // Use the piece we stored during selection
      const movedPiece = pendingMoveRef.current?.piece;
      
      if (movedPiece) {
        moveHistoryRef.current.push({
          orig,
          dest,
          capturedPiece,
          movedPiece,
        });
      }

      // Clear the pending move
      pendingMoveRef.current = null;

      setPieces(new Map(groundRef.current.state.pieces));

      setAvailableMoves([]);

      setMovesCount((prev) => prev + 1);

      if (capturedPiece) {
        const map = new Map();
        const newPiece: Piece = {
          role: capturedPiece.role,
          promoted: capturedPiece.promoted,
          color: "white",
        };
        map.set(dest, newPiece);
        setTimeout(() => {
          setAnimateSquare(null);
        }, 600);

        setTimeout(() => {
          setAnimateSquare(dest);
        }, 100);

        setPoints((prev) => prev + 1);
        setTimeout(() => {
          groundRef.current?.setPieces(map);
        }, 50);
      }

      const pieces = groundRef.current?.state.pieces;
      groundRef.current?.set({
        movable: { free: true, color: "white", dests: computeDests(pieces) },
        turnColor: "white",
      });
      checkFinished();
      return true;
    };

    return (
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
        }}
        ref={boardRef}
      ></div>
    );
  }
);

ChessgroundBoard.displayName = "ChessgroundBoard";

export default ChessgroundBoard;
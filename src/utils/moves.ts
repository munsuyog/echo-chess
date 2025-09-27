import type { Piece as ChessPiece } from "chess.js";

type Move = { from: string; to: string };
const files = "abcdefgh";

function coordsToSquare(f: number, r: number) {
  return `${files[f]}${8 - r}`;
}

function squareToCoords(sq: string): [number, number] {
  return [files.indexOf(sq[0]), 8 - parseInt(sq[1], 10)];
}

/**
 * Get all possible moves for a piece on a chess.js board (ignores check)
 */
export function getPossibleMoves(
  board: (ChessPiece | null)[][],
  square: string,
  obstacles: string[] = [],
  disabledSquares: string[] = []
): Move[] {
  const [f, r] = squareToCoords(square);
  const piece = board[r][f];
  if (!piece) return [];

  const moves: Move[] = [];
  const inBounds = (x: number, y: number) => x >= 0 && x < 8 && y >= 0 && y < 8;

  // Check if a square is blocked
  const isBlocked = (x: number, y: number) => {
    const targetSquare = coordsToSquare(x, y);
    return obstacles.includes(targetSquare) || disabledSquares.includes(targetSquare);
  };

  const pushMove = (x: number, y: number) => {
    if (!inBounds(x, y)) return false;

    if (isBlocked(x, y)) return true; // stop sliding if obstacle or disabled

    const target = board[y][x];
    if (!target || target.color !== piece.color) moves.push({ from: square, to: coordsToSquare(x, y) });

    return !!target; // stop sliding if blocked by piece
  };

  const deltasKnight = [
    [1, 2], [2, 1], [-1, 2], [-2, 1],
    [1, -2], [2, -1], [-1, -2], [-2, -1]
  ];

  const deltasKing = [
    [1, 0], [0, 1], [-1, 0], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ];

  const deltasRook = [[1,0],[0,1],[-1,0],[0,-1]];
  const deltasBishop = [[1,1],[1,-1],[-1,1],[-1,-1]];

  switch(piece.type) {
    case "n":
      for (const [dx, dy] of deltasKnight) {
        const x = f + dx, y = r + dy;
        if (!isBlocked(x, y)) pushMove(x, y);
      }
      break;

    case "k":
      for (const [dx, dy] of deltasKing) {
        const x = f + dx, y = r + dy;
        if (!isBlocked(x, y)) pushMove(x, y);
      }
      break;

    case "r":
      for (const [dx, dy] of deltasRook) {
        let x = f + dx, y = r + dy;
        while (inBounds(x, y)) {
          if (pushMove(x, y)) break; // stops if blocked or obstacle
          x += dx; y += dy;
        }
      }
      break;

    case "b":
      for (const [dx, dy] of deltasBishop) {
        let x = f + dx, y = r + dy;
        while (inBounds(x, y)) {
          if (pushMove(x, y)) break;
          x += dx; y += dy;
        }
      }
      break;

    case "q":
      for (const [dx, dy] of deltasRook.concat(deltasBishop)) {
        let x = f + dx, y = r + dy;
        while (inBounds(x, y)) {
          if (pushMove(x, y)) break;
          x += dx; y += dy;
        }
      }
      break;

    case "p":
      const dir = piece.color === "w" ? -1 : 1;
      // single step forward
      if (inBounds(f, r + dir) && !board[r + dir][f]) {
        const targetSquare = coordsToSquare(f, r + dir);
        if (!obstacles.includes(targetSquare) && !disabledSquares.includes(targetSquare))
          moves.push({ from: square, to: targetSquare });
      }
      // double step from start
      const startRow = piece.color === "w" ? 6 : 1;
      if (
        r === startRow &&
        !board[r + dir][f] &&
        !board[r + 2*dir][f]
      ) {
        const targetSquare = coordsToSquare(f, r + 2*dir);
        if (!obstacles.includes(targetSquare) && !disabledSquares.includes(targetSquare))
          moves.push({ from: square, to: targetSquare });
      }
      // captures
      for (const dx of [-1, 1]) {
        const x = f + dx, y = r + dir;
        if (inBounds(x, y)) {
          const targetSquare = coordsToSquare(x, y);
          const target = board[y][x];
          if (target && target.color !== piece.color &&
              !obstacles.includes(targetSquare) && !disabledSquares.includes(targetSquare)) {
            moves.push({ from: square, to: targetSquare });
          }
        }
      }
      break;
  }

  return moves;
}

type ChessPiece = {
  role: string; // "pawn", "bishop", "rook", etc.
  color: "white" | "black";
  promoted?: boolean;
};

type Move = { from: string; to: string };

// helpers to convert squares
const squareToCoords = (square: string): [number, number] => {
  const file = square.charCodeAt(0) - "a".charCodeAt(0);
  const rank = 8 - parseInt(square[1]);
  return [file, rank];
};

const coordsToSquare = (file: number, rank: number) =>
  `${"abcdefgh"[file]}${8 - rank}`;

export function getPossibleMovesMap(
  board: Map<string, ChessPiece>,
  square: string,
  obstacles: string[] = [],
  disabledSquares: string[] = []
): Move[] {
  const piece = board.get(square);
  if (!piece) return [];

  const moves: Move[] = [];
  const [f, r] = squareToCoords(square);

  const inBounds = (x: number, y: number) => x >= 0 && x < 8 && y >= 0 && y < 8;
  const isBlocked = (x: number, y: number) => {
    const sq = coordsToSquare(x, y);
    return obstacles.includes(sq) || disabledSquares.includes(sq);
  };
  const getPieceAt = (x: number, y: number) =>
    board.get(coordsToSquare(x, y));

  const pushMove = (x: number, y: number) => {
    if (!inBounds(x, y)) return false;
    const sq = coordsToSquare(x, y);
    if (isBlocked(x, y)) return true;

    const target = getPieceAt(x, y);
    if (!target || target.color !== piece.color) moves.push({ from: square, to: sq });
    return !!target; // stop sliding if blocked
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

  switch(piece.role) {
    case "knight":
      for (const [dx, dy] of deltasKnight) {
        pushMove(f + dx, r + dy);
      }
      break;
    case "king":
      for (const [dx, dy] of deltasKing) {
        pushMove(f + dx, r + dy);
      }
      break;
    case "rook":
      for (const [dx, dy] of deltasRook) {
        let x = f + dx, y = r + dy;
        while (inBounds(x, y)) {
          if (pushMove(x, y)) break;
          x += dx; y += dy;
        }
      }
      break;
    case "bishop":
      for (const [dx, dy] of deltasBishop) {
        let x = f + dx, y = r + dy;
        while (inBounds(x, y)) {
          if (pushMove(x, y)) break;
          x += dx; y += dy;
        }
      }
      break;
    case "queen":
      for (const [dx, dy] of deltasRook.concat(deltasBishop)) {
        let x = f + dx, y = r + dy;
        while (inBounds(x, y)) {
          if (pushMove(x, y)) break;
          x += dx; y += dy;
        }
      }
      break;
    case "pawn":
      const dir = piece.color === "white" ? -1 : 1;
      const forwardSquare = coordsToSquare(f, r + dir);
      if (inBounds(f, r + dir) && !board.has(forwardSquare) && !obstacles.includes(forwardSquare) && !disabledSquares.includes(forwardSquare))
        moves.push({ from: square, to: forwardSquare });
      for (const dx of [-1, 1]) {
        const x = f + dx, y = r + dir;
        const targetSquare = coordsToSquare(x, y);
        const target = board.get(targetSquare);
        if (inBounds(x, y) && target && target.color !== piece.color && !obstacles.includes(targetSquare) && !disabledSquares.includes(targetSquare)) {
          moves.push({ from: square, to: targetSquare });
        }
      }
      break;
  }

  return moves;
}

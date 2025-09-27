const rowLabel = [8, 7, 6, 5, 4, 3, 2, 1];
const columnLabel = ["a", "b", "c", "d", "e", "f", "g", "h"];

export function extractSquares(moves: string[]) {
  return moves.map((move) => {
    // Remove "R", "x", "+" to get only the square
    return move.replace(/[Rx\+]/g, "");
  });
}

export const getCompoundFenBoard = (compoundFen: string) => {
  let board: string[][] = [];
  const array = compoundFen.split("/");
  array.map((row) => {
    const column = row.split("");
    board.push(column);
  });
  return board;
};

export const getDisabledSquares = (compoundFEN: string) => {
  // X -> disabled
  // x -> obstacle
  let disabledSquares: string[] = [];
  const board = getCompoundFenBoard(compoundFEN);
  board.map((row, rowIndex) => {
    row.map((col, colIndex) => {
      if (col == "X") {
        disabledSquares.push(columnLabel[colIndex] + rowLabel[rowIndex]);
      }
    });
  });
  return disabledSquares;
};

export const getObstacleSquares = (compoundFen: string) => {
  let obstacleSquares: string[] = [];
  const board = getCompoundFenBoard(compoundFen);
  board.map((row, rowIndex) => {
    row.map((col, colIndex) => {
      if (col == "x") {
        obstacleSquares.push(columnLabel[colIndex] + rowLabel[rowIndex]);
      }
    });
  });
  return obstacleSquares;
};

export const compoundToFen = (compoundFen: string): string => {
  const boardPart = compoundFen
    .split("/") // split into ranks
    .map((rank) => {
      let fenRank = "";
      let emptyCount = 0;

      for (const char of rank) {
        if (char === "X" || char === "x") {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            fenRank += emptyCount;
            emptyCount = 0;
          }
          fenRank += char;
        }
      }

      if (emptyCount > 0) {
        fenRank += emptyCount;
      }

      return fenRank;
    })
    .join("/");

  return `${boardPart} w - - 0 1`;
};


import React, { useEffect, useRef, useState } from "react";
import { getDisabledSquares, getObstacleSquares } from "../../utils/chess";
import type { SquareClasses } from "@lichess-org/chessground/types";
import { Chessground } from "@lichess-org/chessground";
import type { Api } from "@lichess-org/chessground/api";

type Props = {};

const SolutionBoard = (props: Props) => {
  const groundRef = useRef<Api | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const solutions = [
    "XXXXXXXX/XXXXXXXX/XX1bbxXX/XXNx1pXX/XXnxprXX/XXrbrxXX/XXXXXXXX/XXXXXXXX",
    "XXXXXXXX/XXXXXXXX/XX1bbxXX/XX1x1pXX/XXnxprXX/XXrBrxXX/XXXXXXXX/XXXXXXXX",
    "XXXXXXXX/XXXXXXXX/XX1bbxXX/XX1x1pXX/XXNxprXX/XXr1rxXX/XXXXXXXX/XXXXXXXX",
    "XXXXXXXX/XXXXXXXX/XX1bbxXX/XX1x1pXX/XX1xprXX/XXr1RxXX/XXXXXXXX/XXXXXXXX",
    "XXXXXXXX/XXXXXXXX/XX1bbxXX/XX1x1pXX/XX1xprXX/XXR2xXX/XXXXXXXX/XXXXXXXX",
    "XXXXXXXX/XXXXXXXX/XXRbbxXX/XX1x1pXX/XX1xprXX/XX3xXX/XXXXXXXX/XXXXXXXX",
    "XXXXXXXX/XXXXXXXX/XX1BbxXX/XX1x1pXX/XX1xprXX/XX3xXX/XXXXXXXX/XXXXXXXX",
    "XXXXXXXX/XXXXXXXX/XX2bxXX/XX1x1pXX/XX1xpRXX/XX3xXX/XXXXXXXX/XXXXXXXX",
    "XXXXXXXX/XXXXXXXX/XX2bxXX/XX1x1pXX/XX1xP1XX/XX3xXX/XXXXXXXX/XXXXXXXX",
    "XXXXXXXX/XXXXXXXX/XX2bxXX/XX1x1PXX/XX1x2XX/XX3xXX/XXXXXXXX/XXXXXXXX",
    "XXXXXXXX/XXXXXXXX/XX2BxXX/XX1x2XX/XX1x2XX/XX3xXX/XXXXXXXX/XXXXXXXX"
];
  const [currentFen, setCurrentFen] = useState<string>(solutions[0]);

    const obstacleSquares = getObstacleSquares(solutions[0]);
    const disabledSquares = getDisabledSquares(solutions[0]);
useEffect(() => {
  let count = 0;
  const interval = setInterval(() => {
    setCurrentFen(solutions[count]);
    count++;
    console.log(count)
    if (count >= solutions.length) {
      clearInterval(interval); // stop when done
    }
  }, 500);

  return () => clearInterval(interval); // cleanup on unmount
}, []);

    // compute square classes for highlights
    const computeSquareClasses = (): SquareClasses => {
      const map: SquareClasses = new Map();
      obstacleSquares.forEach((sq: any) => map.set(sq, "obstacle"));
      disabledSquares.forEach((sq: any) => map.set(sq, "disabled"));
      return map;
    };
  
  useEffect(() => {
    if(boardRef.current && !groundRef.current) {
        groundRef.current = Chessground(boardRef.current, {
            fen: currentFen,
            viewOnly: true,
            highlight: {
                custom: computeSquareClasses()
            },
            coordinates: false
        })
    }
  }, []);

  useEffect(() => {
    if(groundRef.current) {
        groundRef.current.set({
            fen: currentFen
        })
    }
  }, [currentFen])
  return <div style={{width: 400, height: 400}} ref={boardRef}></div>;
};

export default SolutionBoard;

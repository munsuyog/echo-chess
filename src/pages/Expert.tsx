import { useState, useRef, useEffect } from "react";
// import Chessboard, { type ChessboardRef } from "../components/chessboard";
import HeartIcon from "../icons/heart";
import Stats from "../components/play/stats";
import SwordIcon from "../icons/sword";
import MovesIcon from "../icons/moves";
import Button from "../components/play/button";
import UndoIcon from "../icons/undo";
import HintIcon from "../icons/hint";

import ChessgroundBoard, {
  type ChessboardRef,
} from "../components/chessboard/chessground";
import StatusModal from "../components/play/status-modal";
import SpoilerModal from "../components/play/spoiler-modal";
import SolutionModal from "../components/play/solution-modal";

const Expert = () => {
  const [movesCount, setMovesCount] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);
  const maxTries = 8;
  const [remainingTries, setRemainingTries] = useState<number>(8);

  const [showSpoiler, setShowSpoiler] = useState<boolean>(false);
  const [isCopied, setCopied] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const [points, setPoints] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Create ref to access chessboard functions
  const chessboardRef = useRef<ChessboardRef>(null);

  const compoundFen =
    "XXXXXXXX/XXXXXXXX/XXrnqqXX/XXqKpkXX/XXrpbrXX/XXrnnbXX/XXXXXXXX/XXXXXXXX";

  // Handle undo button click
  const handleUndo = () => {
    chessboardRef.current?.undoMove();
    // Reduce remaining tries when undoing
    setRemainingTries((prev) => Math.max(0, prev - 1));
  };

  // Handle try again button click
  const handleTryAgain = () => {
    chessboardRef.current?.resetGame();
    // Reset remaining tries if needed
    setRemainingTries(8);
    setFinished(false);
  };

  // Handle hint button click (placeholder for now)
  const handleHint = () => {
    setShowSpoiler(true)
  };

  // Calculate star rating based on moves
  const getStarRating = (moves: number) => {
    if (moves <= 10) return 3;
    if (moves <= 12) return 2;
    if (moves <= 15) return 1;
    return 0;
  };

  const starRating = getStarRating(movesCount);

  useEffect(() => {
    if (remainingTries == 0 || finished) {
      setIsOpen(true);
    }
  }, [remainingTries, finished]);

    useEffect(() => {
      if(isCopied) {
        setShowSolution(true);
      }
  }, [isCopied]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div id="play-page">
      <div className="chessboard-main">
        <div className="game-title">
          <h3>GOBBLE CHESS</h3>
          <h4>SEP 26 2025</h4>
        </div>
        <div className="stats-mobile">
          <div className="stats-container">
            <Stats title="POINTS" value={`${points}`} Icon={SwordIcon} />
            <Stats
              title="MOVES"
              value={movesCount.toString()}
              Icon={MovesIcon}
            />
          </div>
        </div>
        <div className="chessboard-wrapper">
          <ChessgroundBoard
            ref={chessboardRef}
            setFinished={setFinished}
            setMovesCount={setMovesCount}
            setPoints={setPoints}
            finished={finished}
            compoundFen={compoundFen}
          />
        </div>
        <div className="moves-wrapper-mobile">
          {Array.from({ length: maxTries }).map((_, index) => (
            <HeartIcon key={index} active={index + 1 <= remainingTries} />
          ))}
        </div>
        <div className="actions-wrapper">
          <Button
            size="sm"
            Icon={UndoIcon}
            onClick={handleUndo}
            disabled={movesCount === 0 || remainingTries === 0}
          />
          <Button size="lg" title="TRY AGAIN" onClick={handleTryAgain} />
          {/* <Button size="sm" Icon={HintIcon} onClick={handleHint} /> */}
        </div>
      </div>
      <div className="user-info-wrapper">
        <div className="user-avatar">
          <div className="avatar">
            <img className="img" src="/image.png" />
          </div>
          <div className="name">Guest</div>
        </div>
        <div className="moves-wrapper">
          {Array.from({ length: maxTries }).map((_, index) => (
            <HeartIcon key={index} active={index + 1 <= remainingTries} />
          ))}
        </div>
        <div className="stats-container">
          <Stats title="POINTS" value={`${points}`} Icon={SwordIcon} />
          <Stats title="MOVES" value={movesCount.toString()} Icon={MovesIcon} />
        </div>
      </div>

      <StatusModal
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        starRating={starRating}
        puzzled={remainingTries == 0}
        optimalMoves={15}
        playedMoves={movesCount}
        hideSolution={true}
      />
      <SpoilerModal
        isOpen={showSpoiler}
        onClose={() => setShowSpoiler(false)}
        setCopied={setCopied}
      />
      <SolutionModal
        isOpen={showSolution}
        onClose={() => {
          setShowSolution(false);
        }}
      />
    </div>
  );
};

export default Expert;

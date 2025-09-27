import { useState, useRef } from "react";
import Chessboard, { type ChessboardRef } from "../components/chessboard";
import HeartIcon from "../icons/heart";
import Stats from "../components/play/stats";
import SwordIcon from "../icons/sword";
import MovesIcon from "../icons/moves";
import Button from "../components/play/button";
import UndoIcon from "../icons/undo";
import HintIcon from "../icons/hint";
import { useSearchParams } from "react-router";
import Modal from "../components/common/modal";
import StarIcon from "../icons/star";

type Props = {};

const ExpertPage = (props: Props) => {
  const [movesCount, setMovesCount] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);
  console.log(finished);
  const maxTries = 8;
  const [remainingTries, setRemainingTries] = useState<number>(8);

  const [searchParams, setSearchParams] = useSearchParams();
  const [points, setPoints] = useState<number>(0);

  const game = searchParams.get<"blitz">("game");

  // Create ref to access chessboard functions
  const chessboardRef = useRef<ChessboardRef>(null);

  const compoundFen = "XXXXXXXX/XXXXXXXX/XXrnqqXX/XXqKpkXX/XXrpbrXX/XXrnnbXX/XXXXXXXX/XXXXXXXX";

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
    // TODO: Implement hint functionality
    console.log("Hint clicked");
  };

  // Calculate star rating based on moves
  const getStarRating = (moves: number) => {
    if (moves <= 17) return 3;
    if (moves <= 20) return 2;
    if (moves <= 25) return 1;
    return 0;
  };

  const starRating = getStarRating(movesCount);

  return (
    <div id="play-page">
      <div className="chessboard-main">
        <div className="game-title">
          <h3>GOBBLE CHESS</h3>
          <h4>SEP 26 2025</h4>
        </div>
        <div className="chessboard-wrapper">
          <Chessboard
            ref={chessboardRef}
            movesCount={movesCount}
            setMovesCount={setMovesCount}
            initialFen={compoundFen}
            finished={finished}
            setFinished={setFinished}
            setPoints={setPoints}
          />
        </div>
        <div className="actions-wrapper">
          <Button
            size="sm"
            Icon={UndoIcon}
            onClick={handleUndo}
            disabled={movesCount === 0 || remainingTries === 0}
          />
          <Button size="lg" title="TRY AGAIN" onClick={handleTryAgain} />
          <Button size="sm" Icon={HintIcon} onClick={handleHint} />
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
      
      <Modal isOpen={finished} onClose={() => setFinished(false)}>
        <div className="modal-title">🎉 SOLVED!</div>
        <div className="modal-status">
          Completed in {movesCount} moves!
          <br />
          <span style={{ fontSize: '14px', opacity: 0.7 }}>Best possible: 8 moves</span>
        </div>
        <div className="modal-stars">
          {Array.from({ length: 3 }).map((_, index) => (
            <StarIcon key={index} active={index < starRating} />
          ))}
        </div>
        <div style={{ 
          fontSize: '16px', 
          color: '#DAA585', 
          fontWeight: 'bold',
          marginTop: '10px'
        }}>
          Points Earned: {points}
        </div>
        <Button title="PLAY AGAIN" size="lg" onClick={handleTryAgain} />
      </Modal>
    </div>
  );
};

export default ExpertPage;
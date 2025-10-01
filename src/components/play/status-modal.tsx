import Button from "./button";
import StarIcon from "../../icons/star";
import HomeIcon from "../../icons/Home";
import ShareIcon from "../../icons/share";
import Modal from "../common/modal";
import SpoilerModal from "./spoiler-modal";
import { useState } from "react";

type Props = {
  onClose(): void;
  isOpen: boolean;
  starRating: number;
  handleTryAgain?(): void;
  puzzled?: boolean;
  optimalMoves?: number;
  playedMoves?: number;
  hideSolution?: boolean;
};

const StatusModal = ({
  onClose,
  isOpen,
  handleTryAgain,
  starRating,
  puzzled = false,
  optimalMoves,
  playedMoves,
  hideSolution = false,
}: Props) => {
  const [isSpoilerOpen, setIsSpoilerOpen] = useState<boolean>(false);
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose()}
      type={puzzled ? "puzzled" : "default"}
    >
      <div className="finished-modal">
        <div className="home-btn">
          <Button Icon={HomeIcon} type="secondary" onClick={onClose} />
        </div>
        <div
          className={`modal-title ${puzzled ? "puzzled" : ""}`}
          data-title={puzzled ? "PUZZLED" : "SOLVED"}
        >
          {puzzled ? "PUZZLED" : "SOLVED"}
        </div>
        <div className="modal-status">
          {puzzled
            ? "ONE MORE TRY ?"
            : `${playedMoves} moves ! Best is ${optimalMoves}`}
        </div>
        <div className="modal-stars">
          {Array.from({ length: 3 }).map((_, index) => (
            <StarIcon
              key={index}
              active={puzzled ? false : index < starRating}
            />
          ))}
        </div>
        {!hideSolution && (
          <div className="share-btn-wrapper">
            <Button
              Icon={ShareIcon}
              title={puzzled ? "SEE THE SOLUTION" : "UNLOCK 10 MORE"}
              size="lg"
              onClick={() => {
                setIsSpoilerOpen(true);
              }}
            />
            <span className="share-text">SHARE YOUR RESULT</span>
          </div>
        )}
        <div className="game-actions-wrapper">
          <Button
            title="TRY AGAIN"
            size="md"
            onClick={handleTryAgain}
            type="secondary"
          />
          <Button
            title="PLAY NEXT"
            size="md"
            type="secondary"
            onClick={handleTryAgain}
          />
        </div>
      </div>
      <SpoilerModal
        isOpen={isSpoilerOpen}
        onClose={() => {
          setIsSpoilerOpen(false);
        }}
      />
    </Modal>
  );
};

export default StatusModal;

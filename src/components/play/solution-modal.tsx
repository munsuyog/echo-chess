import { useState } from "react";
import Modal from "../common/modal";
import SolutionBoard from "../solution";
import Button from "./button";

type Props = {
  isOpen: boolean;
  onClose(): void;
};

const SolutionModal = ({ isOpen, onClose }: Props) => {
    const [showSolution, setShowSolution] = useState<boolean>(false);
  return (
    <Modal type="solution" isOpen={isOpen} onClose={() => onClose()}>
      <div className="solution-modal">
        <div className="modal-title" data-title="SOLUTION">SOLUTION</div>
        {showSolution ? (
        <SolutionBoard />

        ) : (
        <Button onClick={() => setShowSolution(true)} title="Show Solution" size="lg" />

        )}

      </div>
    </Modal>
  );
};

export default SolutionModal;

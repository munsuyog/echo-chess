import Modal from "../common/modal";
import Button from "./button";
import BackIcon from "../../icons/back";
import CopyIcon from "../../icons/copy";

type Props = {
  isOpen: boolean;
  onClose(): void;
  setCopied?(value: boolean): void;
};

const SpoilerModal = ({ isOpen, onClose, setCopied }: Props) => {
  return (
    <Modal type="spoiler" isOpen={isOpen} onClose={() => onClose()}>
      <div className="spoiler-modal">
        <div className="back-btn-wrapper">
          <Button
            onClick={onClose}
            type="secondary"
            Icon={BackIcon}
            className="back-btn"
          />
        </div>
        <div className="title-wrapper">
          <div className="modal-title" data-title="SPOILER">
            SPOILER
          </div>
          <div className="modal-subtitle">READY TO GIVE UP ?</div>
        </div>
        <div className="share-text">
          SHARE STRIKE CHESS WITH YOUR FRIENDS
          <br />
          TO SEE THE SOLUTION
        </div>
        <div className="link-wrapper">
          https://bffkdfbfdu.comnknbbdfkfhkdfghdbjgdgjdfbgdfgbjdgbdjfbgbdfj
        </div>
        <Button
          title="COPY"
          type="secondary"
          size="md"
          Icon={CopyIcon}
          onClick={() => setCopied?.(true)}
        />
      </div>
    </Modal>
  );
};

export default SpoilerModal;

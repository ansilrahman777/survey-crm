import { useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { FieldLabel, Textarea } from "../../components/ui/Field";

export function CloseEnquiryModal({ open, onClose, enquiry, onSubmit }) {
  const [remarks, setRemarks] = useState("");

  const handleSubmit = () => {
    onSubmit(remarks);
    setRemarks("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Close enquiry"
      subtitle={enquiry?.enquiryNumber}
      width="max-w-md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleSubmit} disabled={!remarks.trim()}>
            Close enquiry
          </Button>
        </div>
      }
    >
      <FieldLabel required>Reason for closing</FieldLabel>
      <Textarea rows={4} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Why is this enquiry being closed?" autoFocus />
    </Modal>
  );
}

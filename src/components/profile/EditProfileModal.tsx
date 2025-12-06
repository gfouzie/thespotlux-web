"use client";

import Modal from "@/components/common/Modal";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
}: EditProfileModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" size="lg">
      <div className="text-center text-text-col opacity-70 py-8">
        Edit functionality coming soon...
      </div>
    </Modal>
  );
}

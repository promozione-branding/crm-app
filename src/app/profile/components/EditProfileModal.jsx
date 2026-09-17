// src/app/profile/components/EditProfileModal.jsx

"use client";

import React from "react";
import Modal from "@/components/user/ui/Modal";
import Input from "@/components/user/ui/Input";

export default function EditProfileModal({
  isOpen,
  onClose,
  formData,
  onChange,
  onSubmit,
  saving,
}) {
  // --------------------------------------------------
  // Phone Input Handler
  // --------------------------------------------------

  const handlePhoneChange = (e) => {
    // Remove anything that is not a number
    const numericValue =
      e.target.value.replace(/\D/g, "");

    // Allow maximum 10 digits
    const phone = numericValue.slice(0, 10);

    // Keep original field name: phone
    onChange({
      target: {
        name: "phone",
        value: phone,
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      <Modal.Header>
        Edit Profile
      </Modal.Header>

      <form onSubmit={onSubmit}>
        <Modal.Body>
          <div className="space-y-4">
            {/* --------------------------------------------------
                Name
            -------------------------------------------------- */}

            <Input
              label="Name"
              name="name"
              value={formData?.name || ""}
              onChange={onChange}
              placeholder="Enter your name"
              autoComplete="name"
            />

            {/* --------------------------------------------------
                Email
            -------------------------------------------------- */}

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData?.email || ""}
              onChange={onChange}
              placeholder="Enter your email"
              autoComplete="email"
            />

            {/* --------------------------------------------------
                Phone
            -------------------------------------------------- */}

            <Input
              label="Phone"
              type="tel"
              name="phone"
              value={formData?.phone || ""}
              onChange={handlePhoneChange}
              placeholder="Enter 10 digit phone number"
              maxLength={10}
              inputMode="numeric"
              autoComplete="tel"
            />

            <p className="text-[11px] opacity-60">
              Phone number must contain exactly 10
              digits.
            </p>
          </div>
        </Modal.Body>

        <Modal.Footer>
          {/* Cancel */}
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="rounded-lg border border-app px-4 py-2 text-xs text-app hover-app disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          {/* Save */}
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg btn-primary px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
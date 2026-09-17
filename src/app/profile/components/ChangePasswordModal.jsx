// src/app/profile/components/ChangePasswordModal.jsx

"use client";

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
} from "lucide-react";

import Modal from "@/components/user/ui/Modal";
import Input from "@/components/user/ui/Input";

export default function ChangePasswordModal({
  isOpen,
  onClose,
  passwordData,
  onChange,
  onSubmit,
  changingPassword,
}) {
  // --------------------------------------------------
  // Password Visibility States
  // --------------------------------------------------

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      <Modal.Header>
        Change Password
      </Modal.Header>

      <form onSubmit={onSubmit}>
        <Modal.Body>
          <div className="space-y-4">
            {/* --------------------------------------------------
                Current Password
            -------------------------------------------------- */}

            <div className="relative">
              <Input
                label="Current Password"
                type={
                  showCurrentPassword
                    ? "text"
                    : "password"
                }
                name="currentPassword"
                value={
                  passwordData?.currentPassword ||
                  ""
                }
                onChange={onChange}
                placeholder="Enter current password"
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(
                    !showCurrentPassword
                  )
                }
                className="absolute right-3 top-9 opacity-60 transition hover:opacity-100"
                aria-label={
                  showCurrentPassword
                    ? "Hide current password"
                    : "Show current password"
                }
              >
                {showCurrentPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {/* --------------------------------------------------
                New Password
            -------------------------------------------------- */}

            <div className="relative">
              <Input
                label="New Password"
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                name="newPassword"
                value={
                  passwordData?.newPassword ||
                  ""
                }
                onChange={onChange}
                placeholder="Enter new password"
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowNewPassword(
                    !showNewPassword
                  )
                }
                className="absolute right-3 top-9 opacity-60 transition hover:opacity-100"
                aria-label={
                  showNewPassword
                    ? "Hide new password"
                    : "Show new password"
                }
              >
                {showNewPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {/* --------------------------------------------------
                Confirm Password
            -------------------------------------------------- */}

            <div className="relative">
              <Input
                label="Confirm New Password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={
                  passwordData?.confirmPassword ||
                  ""
                }
                onChange={onChange}
                placeholder="Confirm new password"
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-9 opacity-60 transition hover:opacity-100"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          {/* Cancel */}
          <button
            type="button"
            onClick={onClose}
            disabled={changingPassword}
            className="rounded-lg border border-app px-4 py-2 text-xs text-app hover-app disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          {/* Change Password */}
          <button
            type="submit"
            disabled={changingPassword}
            className="rounded-lg btn-primary px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
          >
            {changingPassword
              ? "Changing..."
              : "Change Password"}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
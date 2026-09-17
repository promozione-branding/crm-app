// src/app/profile/Profile.jsx

"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  Shield,
  UserCheck,
  Pencil,
  Lock,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "@/redux/user/userAuthSlice";
import toast from "react-hot-toast";
import axios from "axios";

import EditProfileModal from "./components/EditProfileModal";
import ChangePasswordModal from "./components/ChangePasswordModal";

export default function Profile() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.userAuth.user);

  // --------------------------------------------------
  // Modal States
  // --------------------------------------------------

  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --------------------------------------------------
  // Loading States
  // --------------------------------------------------

  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] =
    useState(false);

  // --------------------------------------------------
  // Profile Form
  // --------------------------------------------------

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // --------------------------------------------------
  // Password Form
  // --------------------------------------------------

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // --------------------------------------------------
  // Open Edit Profile
  // --------------------------------------------------

  const handleOpenEdit = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });

    setShowEdit(true);
  };

  // --------------------------------------------------
  // Close Edit Profile
  // --------------------------------------------------

  const handleCloseEdit = () => {
    if (saving) return;

    setShowEdit(false);

    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  };

  // --------------------------------------------------
  // Profile Input Change
  // --------------------------------------------------

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Profile Submit
  // --------------------------------------------------

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const name = formData?.name?.trim() || "";
    const email = formData?.email?.trim() || "";
    const phone = formData?.phone?.trim() || "";

    // --------------------------------------------------
    // Name Validation
    // --------------------------------------------------

    if (!name) {
      toast.error("Name is required.");
      return;
    }

    // --------------------------------------------------
    // Email Validation
    // --------------------------------------------------

    if (!email) {
      toast.error("Email is required.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // --------------------------------------------------
    // Phone Validation
    // --------------------------------------------------

    if (!phone) {
      toast.error("Phone number is required.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error(
        "Phone number must be exactly 10 digits."
      );
      return;
    }

    try {
      setSaving(true);

      // Keep existing API payload structure
      const payload = {
        name,
        email,
        phone,
      };

      const res = await axios.patch(
        "/api/user/auth/update",
        payload,
        {
          withCredentials: true,
        }
      );

      const data = res.data;

      if (!data?.success) {
        toast.error(
          data?.message ||
            "Failed to update profile."
        );
        return;
      }

      // Refresh user data
      dispatch(getMe());

      toast.success(
        "Profile updated successfully."
      );

      setShowEdit(false);

      setFormData({
        name,
        email,
        phone,
      });
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Open Change Password
  // --------------------------------------------------

  const handleOpenPassword = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowPassword(true);
  };

  // --------------------------------------------------
  // Close Change Password
  // --------------------------------------------------

  const handleClosePassword = () => {
    if (changingPassword) return;

    setShowPassword(false);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // --------------------------------------------------
  // Password Input Change
  // --------------------------------------------------

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Change Password Submit
  // --------------------------------------------------

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Current Password
    if (!passwordData?.currentPassword) {
      toast.error(
        "Current password is required."
      );
      return;
    }

    // New Password
    if (!passwordData?.newPassword) {
      toast.error(
        "New password is required."
      );
      return;
    }

    // New Password Length
    if (
      passwordData.newPassword.length < 8
    ) {
      toast.error(
        "New password must be at least 8 characters."
      );
      return;
    }

    // Confirm Password
    if (!passwordData?.confirmPassword) {
      toast.error(
        "Confirm password is required."
      );
      return;
    }

    // Password Match
    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      toast.error(
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const res = await axios.patch(
        "/api/user/auth/change-password",
        {
          currentPassword:
            passwordData.currentPassword,

          newPassword:
            passwordData.newPassword,

          confirmPassword:
            passwordData.confirmPassword,
        },
        {
          withCredentials: true,
        }
      );

      const data = res.data;

      if (!data?.success) {
        toast.error(
          data?.message ||
            "Failed to change password."
        );
        return;
      }

      toast.success(
        data?.message ||
          "Password changed successfully."
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPassword(false);
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface p-4 text-app sm:p-6">
      {/* --------------------------------------------------
          Header
      -------------------------------------------------- */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold">
            My Profile
          </h1>

          <p className="text-xs opacity-70">
            View and manage your account information.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Edit Profile */}
          <button
            type="button"
            onClick={handleOpenEdit}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
          >
            <Pencil size={16} />
            Edit Profile
          </button>

          {/* Change Password */}
          <button
            type="button"
            onClick={handleOpenPassword}
            className="flex items-center justify-center gap-2 rounded-lg border border-app px-4 py-2 text-sm transition hover:bg-surface"
          >
            <Lock size={16} />
            Change Password
          </button>
        </div>
      </div>

      {/* --------------------------------------------------
          Profile Card
      -------------------------------------------------- */}

      <div className="rounded-2xl border border-app bg-app p-5 sm:p-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          {/* --------------------------------------------------
              Profile Image
          -------------------------------------------------- */}

          <div className="flex flex-col items-center">
            <img
              src={
                user?.image
                  ? user.image
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || "U"
                    )}&background=2563eb&color=fff&size=200`
              }
              alt={
                user?.name || "Profile"
              }
              className="h-30 w-30 rounded-full border-4 border-app object-cover"
            />

            <h2 className="mt-2 text-xl font-semibold">
              {user?.name || "-"}
            </h2>

            <span className="mt-1 rounded-full bg-blue-500/10 px-4 py-1 text-xs text-blue-500">
              Company xyz
            </span>
          </div>

          {/* --------------------------------------------------
              User Details
          -------------------------------------------------- */}

          <div className="w-full flex-1">
            <div className="grid grid-cols-1 gap-6 text-xs md:grid-cols-2">
              {/* Email */}
              <div className="rounded-xl border border-app bg-surface p-5">
                <div className="mb-2 flex items-center gap-3">
                  <Mail
                    size={20}
                    className="text-blue-500"
                  />

                  <span className="font-medium">
                    Email
                  </span>
                </div>

                <p className="break-all opacity-70">
                  {user?.email || "-"}
                </p>
              </div>

              {/* Phone */}
              <div className="rounded-xl border border-app bg-surface p-5">
                <div className="mb-2 flex items-center gap-3">
                  <Phone
                    size={20}
                    className="text-green-500"
                  />

                  <span className="font-medium">
                    Phone
                  </span>
                </div>

                <p className="opacity-70">
                  {user?.phone || "-"}
                </p>
              </div>

              {/* Role */}
              <div className="rounded-xl border border-app bg-surface p-5">
                <div className="mb-2 flex items-center gap-3">
                  <Shield
                    size={20}
                    className="text-purple-500"
                  />

                  <span className="font-medium">
                    Role
                  </span>
                </div>

                <p className="capitalize opacity-70">
                  {user?.roleId?.name || "-"}
                </p>
              </div>

              {/* Reporting To */}
              <div className="rounded-xl border border-app bg-surface p-5">
                <div className="mb-2 flex items-center gap-3">
                  <UserCheck
                    size={20}
                    className="text-orange-500"
                  />

                  <span className="font-medium">
                    Reporting To
                  </span>
                </div>

                <p className="opacity-70">
                  -
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------
          Edit Profile Modal
      -------------------------------------------------- */}

      <EditProfileModal
        isOpen={showEdit}
        onClose={handleCloseEdit}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleProfileSubmit}
        saving={saving}
      />

      {/* --------------------------------------------------
          Change Password Modal
      -------------------------------------------------- */}

      <ChangePasswordModal
        isOpen={showPassword}
        onClose={handleClosePassword}
        passwordData={passwordData}
        onChange={handlePasswordChange}
        onSubmit={handlePasswordSubmit}
        changingPassword={
          changingPassword
        }
      />
    </div>
  );
}
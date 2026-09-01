"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  Shield,
  UserCheck,
  Pencil,
  Lock,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@/components/user/ui/Modal";
import Input from "@/components/user/ui/Input";
import { getMe } from "@/redux/user/userAuthSlice";
import toast from "react-hot-toast";
import axios from "axios";

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userAuth.user);
  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    try {
      setSaving(true);
      const res = await axios.patch(`/api/user/auth/update`, formData, { withCredentials: true, });
      const data = res.data;
      if (!data?.success) {
        toast.error(data?.message || "Failed to update profile.");
        return;
      }

      dispatch(getMe());
      toast.success("Profile updated successfully.");
      setTimeout(() => {
        setShowEdit(false);
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
        });
      }, 800);

    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword) {
      toast.error("Current password is required.");
      return;
    }

    if (!passwordData.newPassword) {
      toast.error("New password is required.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      setChangingPassword(true);
      const res = await axios.patch("/api/user/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      }, { withCredentials: true, });

      const data = res.data;
      if (!data?.success) {
        toast.error(data?.message || "Failed to change password.");
        return;
      }

      toast.success(data?.message || "Password changed successfully.");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setShowPassword(false);
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong.");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="bg-surface text-app min-h-screen p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">My Profile</h1>
          <p className="text-xs opacity-70">
            View and manage your account information.
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setShowEdit(true); setFormData({ name: user.name, phone: user.phone, email: user.email }) }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            <Pencil size={16} />
            Edit Profile
          </button>

          <button onClick={() => setShowPassword(true)}
            className="flex items-center gap-2 rounded-lg border border-app px-4 py-2 text-sm hover:bg-surface"
          >
            <Lock size={16} />
            Change Password
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-app border border-app rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex flex-col items-center">
            <img
              src={user?.image ? user.image
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=2563eb&color=fff&size=200`}
              alt={user?.name || "Profile"}
              className="w-30 h-30 rounded-full border-4 border-app object-cover"
            />

            <h2 className="mt-2 text-xl font-semibold">
              {user?.name || "-"}
            </h2>

            <span className="mt-1 px-4 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs">
              Company xyz
            </span>
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-surface border border-app rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Mail size={20} className="text-blue-500" />
                  <span className="font-medium">Email</span>
                </div>

                <p className="opacity-70">
                  {user?.email || "-"}
                </p>
              </div>

              <div className="bg-surface border border-app rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Phone size={20} className="text-green-500" />
                  <span className="font-medium">Phone</span>
                </div>

                <p className="opacity-70">
                  {user?.phone || "-"}
                </p>
              </div>

              <div className="bg-surface border border-app rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Shield size={20} className="text-purple-500" />
                  <span className="font-medium">Role</span>
                </div>

                <p className="opacity-70 capitalize">
                  {user?.roleId?.name || "-"}
                </p>
              </div>

              <div className="bg-surface border border-app rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <UserCheck size={20} className="text-orange-500" />
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

      <Modal isOpen={showEdit} onClose={() => { setShowEdit(false); setFormData() }} size="md">
        <Modal.Header>
          Edit Profile
        </Modal.Header>

        <Modal.Body>
          <div className="space-y-4">
            <Input
              label="Name"
              name="name"
              value={formData?.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData?.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />

            <Input
              label="Phone"
              type="tel"
              name="phone"
              value={formData?.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button disabled={saving} onClick={() => { setShowEdit(false); setFormData() }}
            className="px-4 py-2 text-xs rounded-lg border border-app hover-app text-app"
          >
            Cancel
          </button>

          <button onClick={handleProfileSubmit} disabled={saving} className="px-4 py-2 text-xs rounded-lg btn-primary">
            {saving ? "Saving..." : "Save"}
          </button>
        </Modal.Footer>
      </Modal>

      <Modal isOpen={showPassword} onClose={() => { setShowPassword(false); setPasswordData() }} size="md">
        <Modal.Header>
          Change Password
        </Modal.Header>

        <Modal.Body>
          <div className="space-y-4">
            <div className="relative">
              <Input
                label="Current Password"
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordData?.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
              />

              <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-9 opacity-60"
              >
                {showCurrentPassword ? (<EyeOff size={18} />) : (<Eye size={18} />)}
              </button>
            </div>

            <div className="relative">
              <Input
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData?.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
              />

              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-9 opacity-60"
              >
                {showNewPassword ? (<EyeOff size={18} />) : (<Eye size={18} />)}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordData?.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
              />

              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 opacity-60"
              >
                {showConfirmPassword ? (<EyeOff size={18} />) : (<Eye size={18} />)}
              </button>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button type="button" onClick={() => { setShowPassword(false); setPasswordData() }}
            disabled={changingPassword}
            className="px-4 py-2 text-xs rounded-lg border border-app hover-app text-app disabled:opacity-50"
          >
            Cancel
          </button>

          <button type="button" onClick={handlePasswordSubmit} disabled={changingPassword}
            className="px-4 py-2 text-xs rounded-lg btn-primary disabled:opacity-50"
          >
            {changingPassword ? "Changing..." : "Change Password"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
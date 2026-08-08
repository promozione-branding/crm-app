"use client";

import React from "react";
import { Mail, Phone, Shield, UserCheck } from "lucide-react";
import { useSelector } from "react-redux";

export default function Profile() {
  const user = useSelector((state) => state.userAuth.user);

  return (
    <div className="bg-surface text-app min-h-screen p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-bold">My Profile</h1>
        <p className="text-xs opacity-70">
          View your account information.
        </p>
      </div>

      <div className="bg-app border border-app rounded-2xl p-8">

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

          {/* Profile Image */}
          <div className="flex flex-col items-center">

            <img
              src={
                user?.image
                  ? user.image
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "U"
                  )}&background=2563eb&color=fff&size=200`
              }
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
                  {user?.role || "-"}
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

    </div>
  );
}
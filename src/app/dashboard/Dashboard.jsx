"use client";

import { useEffect, useState } from "react";

import { Users, UserPlus, Phone, ClipboardList } from "lucide-react";

import axios from "axios";
import toast from "react-hot-toast";

const statsConfig = [
  {
    key: "users",
    title: "Users",
    icon: Users,
    color: "text-blue-500",
  },
  {
    key: "leads",
    title: "Leads",
    icon: UserPlus,
    color: "text-green-500",
  },
  {
    key: "calls",
    title: "Calls", 
    icon: Phone,
    color: "text-purple-500",
  },
  {
    key: "tasks",
    title: "Tasks",
    icon: ClipboardList,
    color: "text-orange-500",
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    leads: 0,
    calls: 0,
    tasks: 0,
  });

  const [loading, setLoading] = useState(true);

  // ============================================================
  // GET DASHBOARD STATS
  // ============================================================

  const getDashboardStats = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/user/dashboard", {
        withCredentials: true,
      });

      if (res.data?.success) {
        setStats(
          res.data.data || {
            users: 0,
            leads: 0,
            calls: 0,
            tasks: 0,
          },
        );
      }
    } catch (error) {
      console.error("Failed to load dashboard:", error);

      toast.error(
        error?.response?.data?.message || "Failed to load dashboard.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    getDashboardStats();
  }, []);

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="bg-surface text-app min-h-screen p-6">
      {/* ==================================================
                HEADER
            ================================================== */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="text-sm opacity-70 mt-1">
          Welcome to your CRM dashboard.
        </p>
      </div>

      {/* ==================================================
                STATS
            ================================================== */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statsConfig.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              className="
                                bg-app
                                border
                                border-app
                                rounded-2xl
                                p-6
                                shadow-sm
                                hover:-translate-y-1
                                transition-all
                            "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-70">{item.title}</p>

                  <h2 className="text-4xl font-bold mt-3">
                    {loading ? (
                      <span
                        className="
                                                    inline-block
                                                    h-10
                                                    w-16
                                                    rounded-md
                                                    bg-surface
                                                    animate-pulse
                                                "
                      />
                    ) : (
                      stats[item.key]
                    )}
                  </h2>
                </div>

                <div
                  className="
                                        w-14
                                        h-14
                                        rounded-xl
                                        bg-surface
                                        flex
                                        items-center
                                        justify-center
                                        border
                                        border-app
                                    "
                >
                  <Icon size={28} className={item.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==================================================
                ANALYTICS
            ================================================== */}

      <div
        className="
                    mt-8
                    bg-app
                    border
                    border-app
                    rounded-2xl
                    h-[420px]
                    flex
                    items-center
                    justify-center
                "
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold">Analytics</h2>

          <p className="opacity-60 mt-2">
            Charts and reports will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}

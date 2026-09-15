"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronUp,
  Calendar,
  UserRound,
  UserCheck,
  CircleDot,
} from "lucide-react";

import DynamicTable from "@/components/user/ui/DynamicTable";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

// ============================================================
// DESKTOP TABLE COLUMNS
// ============================================================

const columns = [
  {
    key: "title",
    label: "Task Title",
    sortable: true,
  },

  {
    key: "leadId.name",
    label: "Related Lead",
    sortable: true,
  },

  {
    key: "priority",
    label: "Priority",
    sortable: true,
  },

  {
    key: "status",
    label: "Status",
    sortable: true,

    render: (task) => (
      <span className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500 capitalize">
        {task.status}
      </span>
    ),
  },

  {
    key: "createdBy.name",
    label: "Created By",
    sortable: true,
  },

  {
    key: "assignedTo.name",
    label: "Assigned To",
    sortable: true,
  },

  {
    key: "dueDate",
    type: "date",
    label: "Due Date",
    sortable: true,
  },
];

// ============================================================
// PRIORITY BADGE
// ============================================================

function PriorityBadge({ priority }) {
  const priorityConfig = {
    low: {
      label: "Low",
      className: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    },

    medium: {
      label: "Medium",
      className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },

    high: {
      label: "High",
      className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    },

    urgent: {
      label: "Urgent",
      className: "bg-red-500/10 text-red-500 border-red-500/20",
    },
  };

  const currentPriority = priorityConfig?.[priority?.toLowerCase()] || {
    label: priority || "-",
    className: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-2.5
        py-1
        text-[11px]
        font-medium
        capitalize
        ${currentPriority.className}
      `}
    >
      {currentPriority.label}
    </span>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({ status }) {
  const statusConfig = {
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",

    completed: "bg-green-500/10 text-green-600 border-green-500/20",

    cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  const statusClass =
    statusConfig?.[status?.toLowerCase()] ||
    "bg-blue-500/10 text-blue-500 border-blue-500/20";

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-2.5
        py-1
        text-[11px]
        font-medium
        capitalize
        ${statusClass}
      `}
    >
      {status || "-"}
    </span>
  );
}

// ============================================================
// FORMAT DUE DATE
// ============================================================

function formatDueDate(date) {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ============================================================
// MOBILE TASK CARD
// ============================================================

function MobileTaskCard({ task, onAction }) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  const handleEdit = (e) => {
    // Don't trigger card expand
    e.stopPropagation();

    onAction(task);
  };

  return (
    <div
      className={`
        overflow-hidden
        rounded-xl
        border
        border-app
        bg-app
        transition-all
        duration-200
        ${expanded ? "shadow-sm" : ""}
      `}
    >
      {/* ======================================================
          COLLAPSED / MAIN SECTION
      ====================================================== */}

      <button
        type="button"
        onClick={handleToggle}
        className="
          block
          w-full
          p-4
          text-left
          transition
          hover:bg-surface
          active:bg-surface
        "
      >
        {/* ==================================================
            TASK TITLE + CHEVRON
        ================================================== */}

        <div className="flex items-start justify-between gap-3">
          {/* TASK INFORMATION */}

          <div className="min-w-0 flex-1">
            <h3
              className="
                truncate
                text-sm
                font-semibold
                text-app
              "
            >
              {task?.title || "Untitled Task"}
            </h3>

            {/* RELATED LEAD */}

            <div
              className="
                mt-1.5
                flex
                min-w-0
                items-center
                gap-1.5
              "
            >
              <UserRound
                size={13}
                className="
                  shrink-0
                  opacity-50
                "
              />

              <span
                className="
                  truncate
                  text-xs
                  opacity-60
                "
              >
                {task?.leadId?.name || "No related lead"}
              </span>
            </div>
          </div>

          {/* CHEVRON */}

          <div
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-surface
              transition
            "
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        {/* ==================================================
            PRIORITY + DUE DATE
        ================================================== */}

        <div
          className="
            mt-4
            grid
            grid-cols-2
            gap-3
          "
        >
          {/* PRIORITY */}

          <div
            className="
              min-w-0
              rounded-lg
              border
              border-app
              bg-surface
              px-3
              py-2.5
            "
          >
            <p
              className="
                mb-1.5
                text-[10px]
                font-medium
                uppercase
                tracking-wide
                opacity-50
              "
            >
              Priority
            </p>

            <PriorityBadge priority={task?.priority} />
          </div>

          {/* DUE DATE */}

          <div
            className="
              min-w-0
              rounded-lg
              border
              border-app
              bg-surface
              px-3
              py-2.5
            "
          >
            <p
              className="
                mb-1.5
                text-[10px]
                font-medium
                uppercase
                tracking-wide
                opacity-50
              "
            >
              Due Date
            </p>

            <div
              className="
                flex
                min-w-0
                items-center
                gap-1.5
              "
            >
              <Calendar
                size={13}
                className="
                  shrink-0
                  opacity-60
                "
              />

              <span
                className="
                  truncate
                  text-[11px]
                  font-medium
                "
              >
                {formatDueDate(task?.dueDate)}
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================
            EXPAND HINT
        ================================================== */}

        {!expanded && (
          <div
            className="
              mt-3
              flex
              items-center
              justify-center
              gap-1
              text-[10px]
              opacity-40
            "
          >
            <span>Tap to view more</span>

            <ChevronDown size={12} />
          </div>
        )}
      </button>

      {/* ======================================================
          EXPANDED SECTION
      ====================================================== */}

      {expanded && (
        <div
          className="
            border-t
            border-app
            bg-surface
            px-4
            pb-4
            pt-3
          "
        >
          {/* ==================================================
              DETAILS
          ================================================== */}

          <div className="space-y-2.5">
            {/* STATUS */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                rounded-lg
                border
                border-app
                bg-app
                px-3
                py-2.5
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <CircleDot size={14} className="opacity-50" />

                <span
                  className="
                    text-xs
                    opacity-60
                  "
                >
                  Status
                </span>
              </div>

              <StatusBadge status={task?.status} />
            </div>

            {/* CREATED BY */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                rounded-lg
                border
                border-app
                bg-app
                px-3
                py-2.5
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <UserRound size={14} className="opacity-50" />

                <span
                  className="
                    text-xs
                    opacity-60
                  "
                >
                  Created By
                </span>
              </div>

              <span
                className="
                  max-w-[55%]
                  truncate
                  text-right
                  text-xs
                  font-medium
                "
              >
                {task?.createdBy?.name || "-"}
              </span>
            </div>

            {/* ASSIGNED TO */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                rounded-lg
                border
                border-app
                bg-app
                px-3
                py-2.5
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <UserCheck size={14} className="opacity-50" />

                <span
                  className="
                    text-xs
                    opacity-60
                  "
                >
                  Assigned To
                </span>
              </div>

              <span
                className="
                  max-w-[55%]
                  truncate
                  text-right
                  text-xs
                  font-medium
                "
              >
                {task?.assignedTo?.name || "-"}
              </span>
            </div>
          </div>

          {/* ==================================================
              VIEW / EDIT BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={handleEdit}
            className="
              mt-3
              w-full
              rounded-lg
              bg-blue-600
              px-4
              py-2.5
              text-xs
              font-medium
              text-white
              transition
              hover:bg-blue-700
              active:scale-[0.99]
            "
          >
            View / Edit Task
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MOBILE TASK LIST
// ============================================================

function MobileTaskList({ tasks, loading, onAction }) {
  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="
                h-36
                animate-pulse
                rounded-xl
                border
                border-app
                bg-app
              "
          />
        ))}
      </div>
    );
  }

  // ==========================================================
  // EMPTY
  // ==========================================================

  if (!tasks?.length) {
    return (
      <div
        className="
          rounded-xl
          border
          border-app
          bg-app
          px-5
          py-12
          text-center
        "
      >
        <div
          className="
            mx-auto
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-surface
          "
        >
          <Search size={18} className="opacity-50" />
        </div>

        <p
          className="
            mt-3
            text-sm
            font-medium
          "
        >
          No tasks found
        </p>

        <p
          className="
            mt-1
            text-xs
            opacity-50
          "
        >
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  // ==========================================================
  // TASKS
  // ==========================================================

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <MobileTaskCard key={task._id} task={task} onAction={onAction} />
      ))}
    </div>
  );
}

// ============================================================
// MAIN TASK PAGE
// ============================================================

export default function Task() {
  // ================= ROUTER =================

  const router = useRouter();

  // ================= STATE =================

  const [page, setPage] = useState(1);

  const [tasks, setTasks] = useState([]);

  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(25);

  // ==========================================================
  // GET TASKS
  // ==========================================================

  const getTasks = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/user/task", {
        params: {
          page,
          limit: rowsPerPage,
          search: search.trim() || undefined,
        },

        withCredentials: true,
      });

      setTasks(res.data.data?.tasks || []);

      setTotal(res.data.data?.pagination?.total || 0);
    } catch (error) {
      console.error("Failed to load tasks:", error);

      toast.error(error?.response?.data?.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // PAGINATION
  // ==========================================================

  useEffect(() => {
    getTasks();
  }, [page, rowsPerPage]);

  // ==========================================================
  // SEARCH
  // ==========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);

      getTasks();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // ==========================================================
  // TASK ACTION
  // ==========================================================

  const handleTaskAction = (task) => {
    router.push(`/tasks/edit/${task._id}`);
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div
      className="
        min-h-[calc(100vh-64px)]
        bg-surface
        p-4
        text-app
        sm:p-6
      "
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          mb-5
          flex
          flex-col
          gap-4
          md:mb-6
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        {/* TITLE */}

        <div>
          <h1
            className="
              text-base
              font-bold
            "
          >
            CRM
          </h1>

          <p
            className="
              text-xs
              opacity-70
            "
          >
            Manage your tasks
          </p>
        </div>

        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
            sm:gap-3
          "
        >
          {/* ADD TASK */}

          <button
            type="button"
            className="
              flex
              h-9
              items-center
              justify-center
              gap-2
              rounded-lg
              px-3
              text-sm
              btn-primary
              transition
            "
          >
            <Plus size={16} />

            <span>Add Task</span>
          </button>

          {/* FILTER */}

          <button
            type="button"
            className="
              flex
              h-9
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-app
              px-3
              text-sm
              hover-app
              transition
            "
          >
            <Filter size={16} />

            <span>Filter</span>
          </button>

          {/* SEARCH */}

          <div
            className="
              relative
              w-full
              sm:w-60
            "
          >
            <Search
              size={16}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                opacity-60
              "
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search task..."
              className="
                h-9
                w-full
                rounded-lg
                border
                border-app
                bg-app
                pl-10
                pr-3
                text-sm
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>
        </div>
      </div>

      {/* ======================================================
          MOBILE TASK CARDS
      ====================================================== */}

      <div className="block md:hidden">
        <MobileTaskList
          tasks={tasks}
          loading={loading}
          onAction={handleTaskAction}
        />
      </div>

      {/* ======================================================
          DESKTOP TABLE
      ====================================================== */}

      <div className="hidden md:block">
        <DynamicTable
          loading={loading}
          columns={columns}
          data={tasks}
          page={page}
          setPage={setPage}
          total={total}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          onAction={handleTaskAction}
        />
      </div>
    </div>
  );
}

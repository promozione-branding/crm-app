"use client";

import React, { useEffect, useState } from "react";

export default function TaskForm({ form, task, onChange }) {
  const [minDateTime, setMinDateTime] = useState("");

  // =================================================
  // GET CURRENT DATE & TIME FROM BROWSER
  // =================================================

  useEffect(() => {
    const updateMinDateTime = () => {
      const now = new Date();

      // Get local browser date/time
      const year = now.getFullYear();

      const month = String(now.getMonth() + 1).padStart(2, "0");

      const day = String(now.getDate()).padStart(2, "0");

      const hours = String(now.getHours()).padStart(2, "0");

      const minutes = String(now.getMinutes()).padStart(2, "0");

      const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

      setMinDateTime(currentDateTime);
    };

    // Set immediately
    updateMinDateTime();

    /*
     * Update every minute so that the minimum
     * time does not become outdated while
     * the user keeps the form open.
     */
    const interval = setInterval(updateMinDateTime, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =================================================
  // HANDLE DUE DATE CHANGE
  // =================================================

  const handleDueDateChange = (e) => {
    const selectedDateTime = e.target.value;

    /*
     * Get the current browser time again.
     *
     * This makes sure the validation uses the
     * latest browser time instead of relying only
     * on the previously calculated minDateTime.
     */
    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    const hours = String(now.getHours()).padStart(2, "0");

    const minutes = String(now.getMinutes()).padStart(2, "0");

    const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    // Prevent selecting past date/time
    if (selectedDateTime && selectedDateTime < currentDateTime) {
      alert("Due date and time cannot be in the past.");

      return;
    }

    // Keep existing onChange flow
    onChange(e);
  };

  return (
    <div className="space-y-5">
      {/* =================================================
                TASK TITLE
            ================================================= */}

      <div>
        <label
          htmlFor="title"
          className="
                        block
                        text-sm
                        font-medium
                        mb-2
                    "
        >
          Task Title
        </label>

        <input
          id="title"
          type="text"
          name="title"
          value={form.title}
          onChange={onChange}
          placeholder="Enter task title"
          className="
                        w-full
                        min-w-0
                        px-3
                        sm:px-4
                        py-2.5
                        rounded-lg
                        border
                        border-app
                        bg-surface
                        text-app
                        text-sm
                        outline-none
                        transition
                        focus:ring-2
                        focus:ring-blue-500/30
                    "
        />
      </div>

      {/* =================================================
                DESCRIPTION
            ================================================= */}

      <div>
        <label
          htmlFor="description"
          className="
                        block
                        text-sm
                        font-medium
                        mb-2
                    "
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={onChange}
          rows={5}
          placeholder="Enter task description"
          className="
                        w-full
                        min-w-0
                        px-3
                        sm:px-4
                        py-2.5
                        rounded-lg
                        border
                        border-app
                        bg-surface
                        text-app
                        text-sm
                        outline-none
                        resize-y
                        transition
                        focus:ring-2
                        focus:ring-blue-500/30
                    "
        />
      </div>

      {/* =================================================
                GRID
            ================================================= */}

      <div
        className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-4
                    sm:gap-5
                "
      >
        {/* =================================================
                    PRIORITY
                ================================================= */}

        <div>
          <label
            htmlFor="priority"
            className="
                            block
                            text-sm
                            font-medium
                            mb-2
                        "
          >
            Priority
          </label>

          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={onChange}
            className="
                            w-full
                            px-3
                            sm:px-4
                            py-2.5
                            rounded-lg
                            border
                            border-app
                            bg-surface
                            text-app
                            text-sm
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500/30
                        "
          >
            <option value="low">Low</option>

            <option value="medium">Medium</option>

            <option value="high">High</option>

            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* =================================================
                    STATUS
                ================================================= */}

        <div>
          <label
            htmlFor="status"
            className="
                            block
                            text-sm
                            font-medium
                            mb-2
                        "
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            value={form.status}
            onChange={onChange}
            className="
                            w-full
                            px-3
                            sm:px-4
                            py-2.5
                            rounded-lg
                            border
                            border-app
                            bg-surface
                            text-app
                            text-sm
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500/30
                        "
          >
            <option value="pending">Pending</option>

            <option value="completed">Completed</option>

            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* =================================================
                    ASSIGNED TO
                ================================================= */}

        <div>
          <label
            htmlFor="assignedTo"
            className="
                            block
                            text-sm
                            font-medium
                            mb-2
                        "
          >
            Assigned To
          </label>

          <input
            id="assignedTo"
            type="text"
            value={task?.assignedTo?.name || "Not assigned"}
            disabled
            className="
                            w-full
                            min-w-0
                            px-3
                            sm:px-4
                            py-2.5
                            rounded-lg
                            border
                            border-app
                            bg-surface
                            text-app
                            text-sm
                            opacity-70
                            cursor-not-allowed
                        "
          />

          <p
            className="
                            text-[11px]
                            sm:text-xs
                            opacity-50
                            mt-1.5
                        "
          >
            Assigned user cannot be changed from this form.
          </p>
        </div>

        {/* =================================================
                    DUE DATE
                ================================================= */}

        <div>
          <label
            htmlFor="dueDate"
            className="
                            block
                            text-sm
                            font-medium
                            mb-2
                        "
          >
            Due Date
          </label>

          <input
            id="dueDate"
            type="datetime-local"
            name="dueDate"
            value={form.dueDate || ""}
            onChange={handleDueDateChange}
            /*
             * Browser will prevent selecting
             * anything before the current
             * browser date/time.
             */
            min={minDateTime}
            className="
                            w-full
                            min-w-0
                            px-3
                            sm:px-4
                            py-2.5
                            rounded-lg
                            border
                            border-app
                            bg-surface
                            text-app
                            text-sm
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500/30
                        "
          />

          <p
            className="
                            text-[11px]
                            sm:text-xs
                            opacity-50
                            mt-1.5
                        "
          >
            Past date and time cannot be selected.
          </p>
        </div>

        {/* =================================================
                    REMINDER
                ================================================= */}

        <div className="sm:col-span-2">
          <label
            htmlFor="reminderMinutes"
            className="
                            block
                            text-sm
                            font-medium
                            mb-2
                        "
          >
            Reminder
          </label>

          <select
            id="reminderMinutes"
            name="reminderMinutes"
            value={form.reminderMinutes}
            onChange={onChange}
            className="
                            w-full
                            px-3
                            sm:px-4
                            py-2.5
                            rounded-lg
                            border
                            border-app
                            bg-surface
                            text-app
                            text-sm
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500/30
                        "
          >
            <option value={0}>No Reminder</option>

            <option value={5}>5 Minutes Before</option>

            <option value={10}>10 Minutes Before</option>

            <option value={15}>15 Minutes Before</option>
          </select>
        </div>
      </div>
    </div>
  );
}

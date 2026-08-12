"use client";

import Modal from "@/components/user/ui/Modal";
import { Calendar, ClipboardCheck, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import TextArea from '../../ui/TextArea';
import Input from "../../ui/Input";
import SelectInput from "../../ui/SelectInput";
import toast from "react-hot-toast";
import axios from "axios";

export default function Task({ lead, getLead }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);

    const [form, setForm] = useState({
        title: "",
        priority: "medium",
        dueDate: "",
        leadId: lead?._id || "",
        assignedTo: "",
        description: "",
        reminderMinutes: 0,
    });

    const handleChange = ({ target: { name, value } }) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const getUsers = async () => {
        try {
            const res = await axios.get("/api/user?limit=100", { withCredentials: true, });
            setUsers(res.data.data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load users.");
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const getTasks = async () => {
        if (!lead?._id) return;
        try {
            const res = await axios.get(`/api/user/task?leadId=${lead._id}`, { withCredentials: true, });

            setTasks(res.data.data.tasks || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load tasks.");
        }
    };

    useEffect(() => {
        if (lead?._id) {
            setForm((prev) => ({
                ...prev,
                leadId: lead._id,
            }));
            getTasks();
        }
    }, [lead?._id]);

    // RESET FORM
    const resetForm = () => {
        setForm({
            title: "",
            priority: "medium",
            dueDate: "",
            leadId: lead?._id || "",
            assignedTo: "",
            description: "",
            reminderMinutes: 0,
        });
    };

    // CREATE TASK
    const handleSave = async () => {
        if (!form.title.trim()) {
            return toast.error("Enter task title.");
        }

        if (!form.dueDate) {
            return toast.error("Select due date and time.");
        }

        if (!form.assignedTo) {
            return toast.error("Select assigned user.");
        }

        const toastId = toast.loading("Creating task...");
        try {
            setLoading(true);
            const res = await axios.post("/api/user/task", { ...form, reminderMinutes: Number(form.reminderMinutes), },
                { withCredentials: true, });

            toast.success(res.data.message || "Task created successfully.", { id: toastId, });
            resetForm();
            setOpen(false);
            await getTasks();
            getLead()
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create task.", { id: toastId, });
        } finally {
            setLoading(false);
        }
    };

    // STATUS UPDATE
    const updateTaskStatus = async (taskId, status) => {
        const confirmed = window.confirm(
            `Are you sure you want to mark this task as "${status}"?`
        );

        if (!confirmed) return;
        const toastId = toast.loading("Updating task...");
        try {
            await axios.put(`/api/user/task/${taskId}`, { status, }, { withCredentials: true, });
            toast.success("Task updated.", { id: toastId, });
            getTasks();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update task.", { id: toastId, });
        }
    };

    return (<>
        <div className="bg-card border border-app rounded-2xl p-5 text-app">
            <div className='flex justify-between items-center'>
                <h3 className="uppercase tracking-widest text-xs font-semibold text-muted">
                    Tasks
                </h3>
                <button
                    onClick={() => setOpen(true)}
                    className="p-2 rounded-lg border bg-app border-app hover-app text-app"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="border-b border-app my-4" />

            {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-14 h-14 rounded-full bg-app border border-app flex items-center justify-center text-app">
                        <ClipboardCheck size={24} className="opacity-80" />
                    </div>

                    <h4 className="mt-4 text-sm font-medium text-app">
                        No Task Found
                    </h4>

                    <p className="mt-1 text-xs text-muted">
                        Tasks history will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div key={task._id} className="border border-app rounded-xl p-4 bg-app">
                            <div className="flex justify-between gap-3">
                                <div>
                                    <h4 className="text-sm font-semibold">
                                        {task.title}
                                    </h4>

                                    <p className="text-xs text-muted mt-1">
                                        {task.description || "No description"}
                                    </p>
                                </div>

                                <span className="text-xs capitalize">
                                    {task.priority}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted">
                                <span>
                                    Due:{" "}
                                    {new Date(task.dueDate).toLocaleString()}
                                </span>
                                <span>
                                    Assigned:{" "}
                                    {task.assignedTo?.name || "-"}
                                </span>
                            </div>

                            <div className="flex gap-2 mt-3">
                                {task.status === "pending" && (
                                    <>
                                        <button onClick={() => updateTaskStatus(task._id, "completed")} className="px-3 py-1.5 text-xs rounded-lg btn-primary">
                                            Complete
                                        </button>

                                        <button onClick={() => updateTaskStatus(task._id, "cancelled")} className="px-3 py-1.5 text-xs rounded-lg border border-app hover-app">
                                            Cancel
                                        </button>
                                    </>
                                )}

                                {task.status !== "pending" && (
                                    <span className="text-xs capitalize opacity-70">
                                        {task.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <Modal isOpen={open} onClose={() => setOpen(false)} size="md">
            <Modal.Header>
                Add Task
            </Modal.Header>

            <Modal.Body>
                <div className="space-y-2">
                    <div className="grid md:grid-cols-2 gap-2">
                        <Input
                            label="Task Title"
                            required
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter task title"
                        />

                        <SelectInput
                            label="Priority"
                            name="priority"
                            value={form.priority}
                            onChange={handleChange}
                            options={[
                                { label: "Low", value: "low", },
                                { label: "Medium", value: "medium", },
                                { label: "High", value: "high", },
                                { label: "Urgent", value: "urgent", },
                            ]}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-2">
                        <SelectInput
                            label="Related Lead"
                            required
                            name="leadId"
                            value={form.leadId || lead?._id}
                            onChange={handleChange}
                            disabled
                            options={[
                                { label: lead?.name, value: lead?._id }
                            ]}
                        />

                        <SelectInput
                            label="Assigned To"
                            required
                            name="assignedTo"
                            value={form.assignedTo}
                            onChange={handleChange}
                            options={[
                                ...users.map((user) => ({
                                    label: `${user.name} (${user.roleId?.name})`,
                                    value: user._id,
                                })),
                            ]}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-2">
                        <Input
                            label="Due Date & Time"
                            required
                            type="datetime-local"
                            // leftElement={<Calendar size={18} />}
                            name="dueDate"
                            value={form.dueDate}
                            onChange={handleChange}
                            placeholder="Enter task title"
                        />

                        <SelectInput
                            label="Add Reminder"
                            name="reminderMinutes"
                            value={String(form.reminderMinutes)}
                            onChange={handleChange}
                            options={[
                                {
                                    label: "None",
                                    value: "0",
                                },
                                {
                                    label: "5 minutes before",
                                    value: "5",
                                },
                                {
                                    label: "10 minutes before",
                                    value: "10",
                                },
                                {
                                    label: "15 minutes before",
                                    value: "15",
                                },
                            ]}
                        />
                    </div>

                    <TextArea
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Add task details..."
                    />
                </div>
            </Modal.Body>

            <Modal.Footer>
                <button onClick={() => setOpen(false)}
                    className="px-4 py-2 text-xs rounded-lg border border-app hover-app text-app"
                >
                    Cancel
                </button>

                <button onClick={handleSave} disabled={loading} className="px-4 py-2 text-xs rounded-lg btn-primary">
                    {loading ? "Saving..." : "Save"}
                </button>
            </Modal.Footer>
        </Modal>
    </>)
}
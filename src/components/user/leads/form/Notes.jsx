"use client";

import { useEffect, useState } from "react";
import { FileText, Plus } from "lucide-react";
import Modal from "@/components/user/ui/Modal";
import TextArea from "../../ui/TextArea";
import toast from "react-hot-toast";
import axios from "axios";

export default function Notes({ notes: initialNotes, leadId, getLead }) {
    const [open, setOpen] = useState(false);
    const [notes, setNotes] = useState(initialNotes);
    const [form, setForm] = useState({
        message: "",
    });

    useEffect(() => {
        setNotes(initialNotes);
    }, [initialNotes]);

    const handleChange = ({ target: { name, value } }) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        if (!form.message.trim()) {
            return toast.error("Enter Message First");
        }

        const toastId = toast.loading("Adding note...");
        try {
            const res = await axios.post(`/api/user/lead/${leadId}/notes`, { message: form.message, }, { withCredentials: true, });
            setNotes(res.data.data.notes);
            setForm({ message: "", });
            setOpen(false);
            getLead()
            toast.success(res.data.message, { id: toastId });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add note.", { id: toastId });
        }
    };

    return (
        <>
            <div className="bg-card border border-app rounded-2xl p-5">
                <div className="flex justify-between items-center">
                    <h3 className="uppercase tracking-widest text-xs font-semibold text-muted">
                        Notes
                    </h3>

                    <button
                        onClick={() => setOpen(true)}
                        className="p-2 rounded-lg border bg-app border-app hover-app text-app"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <div className="border-b border-app my-4" />

                {notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-14 h-14 rounded-full bg-app border border-app flex items-center justify-center text-app">
                            <FileText size={24} className="opacity-80" />
                        </div>

                        <h4 className="mt-4 text-sm font-medium text-app">
                            No Notes Found
                        </h4>

                        <p className="mt-1 text-xs opacity-70 text-muted">
                            Click the + button to add your first note.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notes.map((note) => (
                            <div key={note._id} className="rounded-xl border border-app bg-app p-4">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-app">
                                        {note.message}
                                    </h4>
                                </div>

                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                                    <span>
                                        By <strong>{note.createdBy?.name}</strong>
                                    </span>

                                    <span>•</span>

                                    <span>{note.createdBy?.email}</span>

                                    <span>•</span>

                                    <span>
                                        {new Date(note.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={open} onClose={() => setOpen(false)} size="md">
                <Modal.Header>
                    Add Note
                </Modal.Header>

                <Modal.Body>
                    <div className="space-y-4">
                        <TextArea
                            label="Message"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Write your note..."
                        />
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 text-xs rounded-lg border border-app hover-app text-app"
                    >
                        Cancel
                    </button>

                    <button onClick={handleSave} className="px-4 py-2 text-xs rounded-lg btn-primary">
                        Save
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
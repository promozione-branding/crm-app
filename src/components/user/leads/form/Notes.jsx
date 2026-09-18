// src/components/user/leads/form/Notes.jsx

'use client';

import { useEffect, useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import Modal from '@/components/user/ui/Modal';
import TextArea from '../../ui/TextArea';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Notes({ notes: initialNotes, leadId, getLead }) {
    const [open, setOpen] = useState(false);
    const [notes, setNotes] = useState(initialNotes);
    const [form, setForm] = useState({
        message: '',
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
            return toast.error('Enter Message First');
        }

        const toastId = toast.loading('Adding note...');
        try {
            const res = await axios.post(`/api/user/lead/${leadId}/notes`, { message: form.message }, { withCredentials: true });
            setNotes(res.data.data.notes);
            setForm({ message: '' });
            setOpen(false);
            getLead();
            toast.success(res.data.message, { id: toastId });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add note.', { id: toastId });
        }
    };

    return (
        <>
            <div className="bg-card border-app rounded-2xl border p-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-muted text-xs font-semibold tracking-widest uppercase">Notes</h3>

                    <button onClick={() => setOpen(true)} className="bg-app border-app hover-app text-app rounded-lg border p-2">
                        <Plus size={16} />
                    </button>
                </div>

                <div className="border-app my-4 border-b" />

                {notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="bg-app border-app text-app flex h-14 w-14 items-center justify-center rounded-full border">
                            <FileText size={24} className="opacity-80" />
                        </div>

                        <h4 className="text-app mt-4 text-sm font-medium">No Notes Found</h4>

                        <p className="text-muted mt-1 text-xs opacity-70">Click the + button to add your first note.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notes.map((note) => (
                            <div key={note._id} className="border-app bg-app rounded-xl border p-4">
                                <div className="flex items-start justify-between">
                                    <h4 className="text-app font-medium">{note.message}</h4>
                                </div>

                                <div className="text-muted mt-2 flex flex-wrap items-center gap-2 text-xs">
                                    <span>
                                        By <strong>{note.createdBy?.name}</strong>
                                    </span>

                                    <span>•</span>

                                    <span>{note.createdBy?.email}</span>

                                    <span>•</span>

                                    <span>{new Date(note.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={open} onClose={() => setOpen(false)} size="md">
                <Modal.Header>Add Note</Modal.Header>

                <Modal.Body>
                    <div className="space-y-4">
                        <TextArea label="Message" name="message" value={form.message} onChange={handleChange} placeholder="Write your note..." />
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button onClick={() => setOpen(false)} className="border-app hover-app text-app rounded-lg border px-4 py-2 text-xs">
                        Cancel
                    </button>

                    <button onClick={handleSave} className="btn-primary rounded-lg px-4 py-2 text-xs">
                        Save
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

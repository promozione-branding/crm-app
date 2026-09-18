// src/components/user/leads/form/Meetings.jsx

'use client';

import { useEffect, useState } from 'react';

import { Plus, CalendarDays, MapPin, User, Clock, MoreVertical, Pencil, Trash2, Video, Phone } from 'lucide-react';

import axios from 'axios';
import toast from 'react-hot-toast';

import Modal from '@/components/user/ui/Modal';
import Input from '../../ui/Input';
import TextArea from '../../ui/TextArea';
import SelectInput from '../../ui/SelectInput';

export default function Meetings({ leadId, users = [], usersLoading = false }) {
    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const [saving, setSaving] = useState(false);

    const [meetings, setMeetings] = useState([]);

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        metPersonName: '',

        title: '',

        description: '',

        assignedTo: '',

        startAt: '',

        endAt: '',

        meetingType: 'in_person',

        locationType: 'client',

        address: '',

        latitude: '',

        longitude: '',

        meetingLink: '',

        reminderMinutes: '0',

        notes: '',

        status: 'scheduled',
    });

    // ============================================================
    // HANDLE CHANGE
    // ============================================================

    const handleChange = ({ target: { name, value } }) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ============================================================
    // GET MEETINGS
    // ============================================================

    const getMeetings = async () => {
        if (!leadId) return;

        try {
            setLoading(true);

            const res = await axios.get(`/api/user/meeting?leadId=${leadId}`, {
                withCredentials: true,
            });

            setMeetings(res.data?.data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load meetings.');
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // LOAD MEETINGS
    // ============================================================

    useEffect(() => {
        if (!leadId) return;

        getMeetings();
    }, [leadId]);

    // ============================================================
    // RESET FORM
    // ============================================================

    const resetForm = () => {
        setForm({
            metPersonName: '',

            title: '',

            description: '',

            assignedTo: '',

            startAt: '',

            endAt: '',

            meetingType: 'in_person',

            locationType: 'client',

            address: '',

            latitude: '',

            longitude: '',

            meetingLink: '',

            reminderMinutes: '0',

            notes: '',

            status: 'scheduled',
        });

        setEditingId(null);
    };

    // ============================================================
    // OPEN ADD
    // ============================================================

    const openAdd = () => {
        resetForm();

        setOpen(true);
    };

    // ============================================================
    // SAVE MEETING
    // ============================================================

    const handleSave = async () => {
        if (!form.metPersonName.trim()) {
            return toast.error('Enter meeting person name.');
        }

        if (!form.title.trim()) {
            return toast.error('Enter meeting title.');
        }

        if (!form.assignedTo) {
            return toast.error('Select assigned user.');
        }

        if (!form.startAt) {
            return toast.error('Select meeting date and time.');
        }

        const toastId = toast.loading(editingId ? 'Updating meeting...' : 'Creating meeting...');

        try {
            setSaving(true);

            const payload = {
                leadId,

                metPersonName: form.metPersonName,

                title: form.title,

                description: form.description,

                assignedTo: form.assignedTo,

                startAt: form.startAt,

                endAt: form.endAt || null,

                meetingType: form.meetingType,

                location: {
                    type: form.locationType,

                    address: form.address,

                    latitude: form.latitude,

                    longitude: form.longitude,
                },

                meetingLink: form.meetingLink,

                reminderMinutes: Number(form.reminderMinutes),

                notes: form.notes,

                status: form.status,
            };

            if (editingId) {
                await axios.put(`/api/user/meeting/${editingId}`, payload, {
                    withCredentials: true,
                });

                toast.success('Meeting updated successfully.', {
                    id: toastId,
                });
            } else {
                await axios.post('/api/user/meeting', payload, {
                    withCredentials: true,
                });

                toast.success('Meeting created successfully.', {
                    id: toastId,
                });
            }

            setOpen(false);

            resetForm();

            await getMeetings();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save meeting.', {
                id: toastId,
            });
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // EDIT MEETING
    // ============================================================

    const handleEdit = (meeting) => {
        setEditingId(meeting._id);

        setForm({
            metPersonName: meeting.metPersonName || '',

            title: meeting.title || '',

            description: meeting.description || '',

            assignedTo: meeting.assignedTo?._id || meeting.assignedTo || '',

            startAt: meeting.startAt ? new Date(meeting.startAt).toISOString().slice(0, 16) : '',

            endAt: meeting.endAt ? new Date(meeting.endAt).toISOString().slice(0, 16) : '',

            meetingType: meeting.meetingType || 'in_person',

            locationType: meeting.location?.type || 'client',

            address: meeting.location?.address || '',

            latitude: meeting.location?.latitude || '',

            longitude: meeting.location?.longitude || '',

            meetingLink: meeting.meetingLink || '',

            reminderMinutes: String(meeting.reminderMinutes ?? 0),

            notes: meeting.notes || '',

            status: meeting.status || 'scheduled',
        });

        setOpen(true);
    };

    // ============================================================
    // DELETE MEETING
    // ============================================================

    const handleDelete = async (meetingId) => {
        const confirmed = window.confirm('Are you sure you want to delete this meeting?');

        if (!confirmed) return;

        const toastId = toast.loading('Deleting meeting...');

        try {
            await axios.delete(`/api/user/meeting/${meetingId}`, {
                withCredentials: true,
            });

            toast.success('Meeting deleted successfully.', {
                id: toastId,
            });

            await getMeetings();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete meeting.', {
                id: toastId,
            });
        }
    };

    // ============================================================
    // UI
    // ============================================================

    return (
        <>
            <div
                className="
                    max-w-4xl
                    mx-auto
                    md:py-10
                    py-5
                    px-2
                "
            >
                <div
                    className="
                        bg-card
                        border
                        border-app
                        rounded-2xl
                        p-5
                        text-app
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >
                        <h3
                            className="
                                uppercase
                                tracking-widest
                                text-xs
                                font-semibold
                                text-muted
                            "
                        >
                            Meetings
                        </h3>

                        <button
                            type="button"
                            onClick={openAdd}
                            className="
                                p-2
                                rounded-lg
                                border
                                bg-app
                                border-app
                                hover-app
                                text-app
                            "
                            title="Add Meeting"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <div
                        className="
                            border-b
                            border-app
                            my-4
                        "
                    />

                    {loading ? (
                        <div
                            className="
                                py-12
                                text-center
                                text-sm
                                opacity-60
                            "
                        >
                            Loading meetings...
                        </div>
                    ) : meetings.length === 0 ? (
                        <div
                            className="
                                py-12
                                text-center
                                text-sm
                                opacity-60
                            "
                        >
                            No meetings found.
                        </div>
                    ) : (
                        <div
                            className="
                                space-y-3
                            "
                        >
                            {meetings.map((meeting) => (
                                <div
                                    key={meeting._id}
                                    className="
                                            border
                                            border-app
                                            rounded-xl
                                            p-4
                                            bg-app
                                        "
                                >
                                    <div
                                        className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-3
                                            "
                                    >
                                        <div
                                            className="
                                                    min-w-0
                                                "
                                        >
                                            <h4
                                                className="
                                                        text-sm
                                                        font-semibold
                                                        break-words
                                                    "
                                            >
                                                {meeting.title}
                                            </h4>

                                            <p
                                                className="
                                                        text-xs
                                                        text-muted
                                                        mt-1
                                                    "
                                            >
                                                {meeting.metPersonName}
                                            </p>
                                        </div>

                                        <span
                                            className="
                                                    text-xs
                                                    capitalize
                                                    shrink-0
                                                "
                                        >
                                            {meeting.status}
                                        </span>
                                    </div>

                                    <div
                                        className="
                                                grid
                                                md:grid-cols-2
                                                gap-2
                                                mt-3
                                                text-xs
                                                text-muted
                                            "
                                    >
                                        <div
                                            className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                "
                                        >
                                            <CalendarDays size={13} />

                                            {meeting.startAt ? new Date(meeting.startAt).toLocaleString() : '-'}
                                        </div>

                                        <div
                                            className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                "
                                        >
                                            <User size={13} />

                                            {meeting.assignedTo?.name || '-'}
                                        </div>

                                        {meeting.location?.address && (
                                            <div
                                                className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                    "
                                            >
                                                <MapPin size={13} />

                                                {meeting.location.address}
                                            </div>
                                        )}

                                        {meeting.meetingLink && (
                                            <div
                                                className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                    "
                                            >
                                                <Video size={13} />

                                                <a
                                                    href={meeting.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="
                                                            text-blue-500
                                                            hover:underline
                                                        "
                                                >
                                                    Meeting Link
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className="
                                                flex
                                                gap-2
                                                mt-3
                                            "
                                    >
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(meeting)}
                                            className="
                                                    px-3
                                                    py-1.5
                                                    text-xs
                                                    rounded-lg
                                                    border
                                                    border-app
                                                    hover-app
                                                    flex
                                                    items-center
                                                    gap-1.5
                                                "
                                        >
                                            <Pencil size={13} />
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(meeting._id)}
                                            className="
                                                    px-3
                                                    py-1.5
                                                    text-xs
                                                    rounded-lg
                                                    border
                                                    border-app
                                                    hover-app
                                                "
                                        >
                                            <Trash2 size={13} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* =====================================================
                MEETING MODAL
            ===================================================== */}

            <Modal isOpen={open} onClose={() => setOpen(false)} size="lg">
                <Modal.Header>{editingId ? 'Edit Meeting' : 'Add Meeting'}</Modal.Header>

                <Modal.Body>
                    <div
                        className="
                            space-y-2
                        "
                    >
                        <div
                            className="
                                grid
                                md:grid-cols-2
                                gap-2
                            "
                        >
                            <Input
                                label="Meeting Person Name"
                                required
                                name="metPersonName"
                                value={form.metPersonName}
                                onChange={handleChange}
                                placeholder="Enter person name"
                            />

                            <Input label="Meeting Title" required name="title" value={form.title} onChange={handleChange} placeholder="Enter meeting title" />
                        </div>

                        <SelectInput
                            label="Assigned To"
                            required
                            name="assignedTo"
                            value={form.assignedTo}
                            onChange={handleChange}
                            disabled={usersLoading}
                            options={[
                                ...users.map((user) => ({
                                    label: `${user.name} (${user.roleId?.name})`,
                                    value: user._id,
                                })),
                            ]}
                        />

                        <TextArea
                            label="Description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Add meeting details..."
                        />

                        <div
                            className="
                                grid
                                md:grid-cols-2
                                gap-2
                            "
                        >
                            <Input label="Start" required type="datetime-local" name="startAt" value={form.startAt} onChange={handleChange} />

                            <Input label="End" type="datetime-local" name="endAt" value={form.endAt} onChange={handleChange} />
                        </div>

                        <div
                            className="
                                grid
                                md:grid-cols-2
                                gap-2
                            "
                        >
                            <SelectInput
                                label="Meeting Type"
                                name="meetingType"
                                value={form.meetingType}
                                onChange={handleChange}
                                options={[
                                    {
                                        label: 'In Person',
                                        value: 'in_person',
                                    },
                                    {
                                        label: 'Online',
                                        value: 'online',
                                    },
                                    {
                                        label: 'Phone',
                                        value: 'phone',
                                    },
                                ]}
                            />

                            <SelectInput
                                label="Location Type"
                                name="locationType"
                                value={form.locationType}
                                onChange={handleChange}
                                options={[
                                    {
                                        label: 'Client',
                                        value: 'client',
                                    },
                                    {
                                        label: 'Office',
                                        value: 'office',
                                    },
                                    {
                                        label: 'Other',
                                        value: 'other',
                                    },
                                ]}
                            />
                        </div>

                        <Input label="Address" name="address" value={form.address} onChange={handleChange} placeholder="Enter address" />

                        <div
                            className="
                                grid
                                md:grid-cols-2
                                gap-2
                            "
                        >
                            <Input label="Latitude" name="latitude" value={form.latitude} onChange={handleChange} />

                            <Input label="Longitude" name="longitude" value={form.longitude} onChange={handleChange} />
                        </div>

                        <Input label="Meeting Link" name="meetingLink" value={form.meetingLink} onChange={handleChange} placeholder="https://..." />

                        <SelectInput
                            label="Reminder"
                            name="reminderMinutes"
                            value={String(form.reminderMinutes)}
                            onChange={handleChange}
                            options={[
                                {
                                    label: 'None',
                                    value: '0',
                                },
                                {
                                    label: '5 minutes before',
                                    value: '5',
                                },
                                {
                                    label: '10 minutes before',
                                    value: '10',
                                },
                                {
                                    label: '15 minutes before',
                                    value: '15',
                                },
                            ]}
                        />

                        <TextArea label="Notes" name="notes" value={form.notes} onChange={handleChange} placeholder="Add notes..." />
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="
                            px-4
                            py-2
                            text-xs
                            rounded-lg
                            border
                            border-app
                            hover-app
                            text-app
                        "
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="
                            px-4
                            py-2
                            text-xs
                            rounded-lg
                            btn-primary
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >
                        {saving ? 'Saving...' : editingId ? 'Update' : 'Save'}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

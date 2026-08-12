"use client";
import { useEffect, useState } from "react";
import {
    Plus,
    CalendarDays,
    MapPin,
    User,
    Clock,
    MoreVertical,
    Pencil,
    Trash2,
    Video,
    Phone,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "@/components/user/ui/Modal";
import Input from "../../ui/Input";
import TextArea from "../../ui/TextArea";
import SelectInput from "../../ui/SelectInput";

export default function Meetings({ leadId }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [meetings, setMeetings] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        metPersonName: "",
        title: "",
        description: "",
        assignedTo: "",
        startAt: "",
        endAt: "",
        meetingType: "in_person",
        locationType: "client",
        address: "",
        latitude: "",
        longitude: "",
        meetingLink: "",
        reminderMinutes: "0",
        notes: "",
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

    const getMeetings = async () => {
        if (!leadId) return;

        try {
            setLoading(true);
            const res = await axios.get(`/api/user/meeting?leadId=${leadId}`, { withCredentials: true, });
            setMeetings(res.data.data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load meetings.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (leadId) {
            getMeetings();
            getUsers();
        }
    }, [leadId]);

    const resetForm = () => {
        setForm({
            metPersonName: "",
            title: "",
            description: "",
            assignedTo: "",
            startAt: "",
            endAt: "",
            meetingType: "in_person",
            locationType: "client",
            address: "",
            latitude: "",
            longitude: "",
            meetingLink: "",
            reminderMinutes: "0",
            notes: "",
        });

        setEditingId(null);
    };

    const openAdd = () => {
        resetForm();
        setOpen(true);
    };

    const handleSave = async () => {
        if (!form.metPersonName.trim()) {
            return toast.error("Enter meeting person name.");
        }

        if (!form.title.trim()) {
            return toast.error("Enter meeting title.");
        }

        if (!form.assignedTo) {
            return toast.error("Select assigned user.");
        }

        if (!form.startAt) {
            return toast.error("Select meeting date and time.");
        }

        const toastId = toast.loading(editingId ? "Updating meeting..." : "Creating meeting...");
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
            };

            if (editingId) {
                await axios.put(`/api/user/meeting/${editingId}`, payload, { withCredentials: true, });
                toast.success("Meeting updated successfully.", { id: toastId, });
            } else {
                await axios.post("/api/user/meeting", payload, { withCredentials: true, });
                toast.success("Meeting created successfully.", { id: toastId, });
            }

            setOpen(false);
            resetForm();
            await getMeetings();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save meeting.", { id: toastId, });
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (meeting) => {
        setEditingId(meeting._id);
        setForm({
            metPersonName: meeting.metPersonName || "",
            title: meeting.title || "",
            description: meeting.description || "",
            assignedTo: meeting.assignedTo?._id || meeting.assignedTo || "",
            startAt: meeting.startAt ? new Date(meeting.startAt).toISOString().slice(0, 16) : "",
            endAt: meeting.endAt ? new Date(meeting.endAt).toISOString().slice(0, 16) : "",
            meetingType: meeting.meetingType || "in_person",
            locationType: meeting.location?.type || "custom",
            address: meeting.location?.address || "",
            latitude: meeting.location?.latitude ?? "",
            longitude: meeting.location?.longitude ?? "",
            meetingLink: meeting.meetingLink || "",
            reminderMinutes: String(meeting.reminderMinutes || 0),
            notes: meeting.notes || "",
        });
        setOpen(true);
    };

    const handleDelete = async (meetingId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this meeting?"
        );

        if (!confirmed) return;
        const toastId = toast.loading("Deleting meeting...");

        try {
            await axios.delete(`/api/user/meeting/${meetingId}`, { withCredentials: true, });
            toast.success("Meeting deleted successfully.", { id: toastId, });
            getMeetings();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete meeting.", { id: toastId, });
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>
            <div className="max-w-4xl mx-auto md:py-10 py-5 px-2 space-y-4">
                <div className="bg-card border border-app rounded-2xl p-5">
                    <div className="flex justify-between items-center">
                        <h3 className="uppercase tracking-widest text-xs font-semibold text-muted">
                            Meetings
                        </h3>

                        <button onClick={openAdd}
                            className="p-2 rounded-lg border bg-app border-app hover-app text-app"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <div className="border-b border-app my-4" />

                    {/* LOADING */}
                    {loading && (
                        <div className="py-10 text-center text-sm text-muted">
                            Loading meetings...
                        </div>
                    )}

                    {/* EMPTY */}
                    {!loading && meetings.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-14 h-14 rounded-full bg-app border border-app flex items-center justify-center">
                                <CalendarDays size={24} />
                            </div>

                            <h4 className="mt-4 text-sm font-medium">
                                No Meetings Found
                            </h4>

                            <p className="mt-1 text-xs text-muted">
                                Schedule your first meeting.
                            </p>
                        </div>
                    )}

                    {/* MEETINGS */}
                    {!loading && meetings.length > 0 && (
                        <div className="space-y-3">
                            {meetings.map((meeting) => (
                                <div key={meeting._id} className="border border-app rounded-xl p-4 bg-app">
                                    <div className="flex justify-between gap-3">
                                        <div>
                                            <h4 className="text-sm font-semibold">
                                                {meeting.title}
                                            </h4>

                                            <p className="text-xs text-muted mt-1">
                                                Meeting with{" "}
                                                {meeting.metPersonName}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button onClick={() => handleEdit(meeting)} className="w-8 h-8 rounded-lg hover-app flex items-center justify-center">
                                                <Pencil size={15} />
                                            </button>

                                            <button onClick={() => handleDelete(meeting._id)}
                                                className="w-8 h-8 rounded-lg hover:bg-red-500/10 text-red-500 flex items-center justify-center"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-3 mt-4 text-xs">
                                        <div className="flex items-center gap-2">
                                            <Clock size={15} className="text-muted" />
                                            {formatDate(meeting.startAt)}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <User size={15} className="text-muted" />
                                            {meeting.assignedTo?.name || "-"}
                                        </div>

                                        {meeting.location?.address && (
                                            <div className="flex items-start gap-2">
                                                <MapPin size={15} className="text-muted mt-0.5" />
                                                <span>
                                                    {meeting.location.address}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                            {meeting.meetingType === "video" ? (
                                                <Video size={15} />
                                            ) : (
                                                <Phone size={15} />
                                            )}

                                            <span className="capitalize">
                                                {meeting.meetingType}
                                            </span>
                                        </div>
                                    </div>

                                    {meeting.description && (
                                        <p className="text-xs text-muted mt-4">
                                            {meeting.description}
                                        </p>
                                    )}

                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs capitalize">
                                            {meeting.status}
                                        </span>

                                        {meeting.reminderMinutes > 0 && (
                                            <span className="px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs">
                                                Reminder{" "}
                                                {meeting.reminderMinutes} min
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>


            {/* CREATE / EDIT MODAL */}
            <Modal isOpen={open} onClose={() => { setOpen(false); resetForm(); }} size="lg">
                <Modal.Header>
                    {editingId ? "Edit Meeting" : "Add Meeting"}
                </Modal.Header>


                <Modal.Body>
                    <div className="space-y-3">
                        <div className="grid md:grid-cols-2 gap-3">
                            <Input
                                label="Person Name"
                                required
                                name="metPersonName"
                                value={form.metPersonName}
                                onChange={handleChange}
                                placeholder="Enter person name"
                            />

                            <Input
                                label="Meeting Title"
                                required
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Product demo"
                            />
                        </div>

                        <SelectInput
                            label="Assigned To"
                            required
                            name="assignedTo"
                            value={form.assignedTo}
                            onChange={handleChange}
                            options={[...users.map(
                                (user) => ({ label: `${user.name} (${user.roleId?.name})`, value: user._id, })
                            ),]}
                        />

                        <div className="grid md:grid-cols-2 gap-3">
                            <Input
                                label="Start Date & Time"
                                required
                                type="datetime-local"
                                name="startAt"
                                value={form.startAt}
                                onChange={handleChange}
                            />

                            <Input
                                label="End Date & Time"
                                type="datetime-local"
                                name="endAt"
                                value={form.endAt}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                            <SelectInput
                                label="Meeting Type"
                                name="meetingType"
                                value={form.meetingType}
                                onChange={handleChange}
                                options={[
                                    { label: "In Person", value: "in_person", },
                                    { label: "Phone", value: "phone", },
                                    { label: "Video", value: "video", },
                                    { label: "Other", value: "other", },
                                ]}
                            />

                            <SelectInput
                                label="Reminder"
                                name="reminderMinutes"
                                value={form.reminderMinutes}
                                onChange={handleChange}
                                options={[
                                    { label: "None", value: "0", },
                                    { label: "5 minutes before", value: "5", },
                                    { label: "10 minutes before", value: "10", },
                                    { label: "15 minutes before", value: "15", },
                                    { label: "30 minutes before", value: "30", },
                                    { label: "1 hour before", value: "60", },
                                ]}
                            />
                        </div>

                        <SelectInput
                            label="Location Type"
                            name="locationType"
                            value={form.locationType}
                            onChange={handleChange}
                            options={[
                                { label: "Client Location", value: "client", },
                                { label: "Office", value: "office", },
                                { label: "Custom", value: "custom", },
                                { label: "Online", value: "online", },
                            ]}
                        />

                        {form.locationType !== "online" && (
                            <>
                                <Input
                                    label="Address"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="Enter meeting address"
                                />

                                <div className="grid md:grid-cols-2 gap-3">
                                    <Input
                                        label="Latitude"
                                        name="latitude"
                                        value={form.latitude}
                                        onChange={handleChange}
                                        placeholder="28.6139"
                                    />

                                    <Input
                                        label="Longitude"
                                        name="longitude"
                                        value={form.longitude}
                                        onChange={handleChange}
                                        placeholder="77.2090"
                                    />
                                </div>
                            </>
                        )}


                        {form.meetingType === "video" && (
                            <Input
                                label="Meeting Link"
                                name="meetingLink"
                                value={form.meetingLink}
                                onChange={handleChange}
                                placeholder="https://meet.google.com/..."
                            />
                        )}

                        <TextArea
                            label="Description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Meeting agenda..."
                        />

                        <TextArea
                            label="Notes"
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            placeholder="Additional notes..."
                        />
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button onClick={() => { setOpen(false); resetForm(); }}
                        className="px-4 py-2 text-xs rounded-lg border border-app hover-app"
                    >
                        Cancel
                    </button>

                    <button disabled={saving} onClick={handleSave}
                        className="px-4 py-2 text-xs rounded-lg btn-primary"
                    >
                        {saving ? "Saving..." : editingId ? "Update Meeting" : "Save Meeting"}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
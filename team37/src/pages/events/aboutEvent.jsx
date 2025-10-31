import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, Typography, Input, Button, Dialog, DialogHeader, DialogBody, DialogFooter, Spinner } from "@material-tailwind/react";
// Import toast for notifications
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DashboardNavbar } from "@/widgets/layout";
import bg from "../../assets/img/dashboard-bg-shape-1.jpg";

const API_URL = "/api/admin";

export default function AboutEvent() {
    // Get event ID from URL params
    const { eventid } = useParams();
    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");
    const navigate = useNavigate();
    // State for event data
    const [event, setEvent] = useState(null);
    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // State for editable form data
    const [editData, setEditData] = useState({});
    // State for save operation
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    // State for validation errors
    const [errors, setErrors] = useState({});
    // State for delete operation
    const [deleting, setDeleting] = useState(false);
    // State for confirmation dialog
    const [openDialog, setOpenDialog] = useState(false);
    // Track initial data for dirty check
    const [initialEditData, setInitialEditData] = useState({});

    // Today's date in yyyy-mm-dd format
    const today = new Date();
    const minEventDate = new Date(today);
    minEventDate.setDate(today.getDate() + 14); // 14 days from today
    const minEventDateStr = minEventDate.toISOString().split('T')[0];
    // Calculate registration opening and closing dates dynamically
    let registrationOpeningDate = '';
    let registrationClosingDate = '';
    let judgeRegError = '';
    if (editData.eventStartDate) {
        const startDate = new Date(editData.eventStartDate);
        const opening = new Date(startDate);
        opening.setDate(opening.getDate() - 14);
        registrationOpeningDate = opening.toISOString().split('T')[0];
        registrationClosingDate = editData.eventStartDate;
        if (registrationOpeningDate < today) {
            judgeRegError = `Judge registration would open before today. Please pick a later event start date.`;
        }
    }

    // Fetch event details on mount
    useEffect(() => {
        async function fetchEvent() {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/${eventid}`);
                if (!response.ok) throw new Error("Failed to fetch event details.");
                const data = await response.json();
                // Map server response to local editData fields
                const mapped = {
                    expoForum: data.type || '',
                    hostPlace: data.region || '',
                    venue: data.venue || '',
                    eventStartDate: data.start_date ? data.start_date.slice(0, 10) : '',
                    eventCloseDate: data.end_date ? data.end_date.slice(0, 10) : '',
                    eventStartTime: data.start_time || '',
                    eventEndTime: data.end_time || '',
                };
                setEvent(data);
                setEditData(mapped);
                setInitialEditData(mapped);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchEvent();
    }, [eventid]);

    // Check if form is dirty (any field changed)
    const isDirty = React.useMemo(() => {
        return Object.keys(initialEditData).some(
            key => editData[key] !== initialEditData[key]
        );
    }, [editData, initialEditData]);

    // Validation function for form fields
    const validate = () => {
        const newErrors = {};
        if (!editData.expoForum) newErrors.expoForum = 'Event Type is required.';
        if (!editData.hostPlace) newErrors.hostPlace = 'Region is required.';
        if (!editData.venue) newErrors.venue = 'Venue is required.';
        if (!editData.eventStartDate) newErrors.eventStartDate = 'Start date is required.';
        if (!editData.eventCloseDate) newErrors.eventCloseDate = 'End date is required.';
        if (!editData.eventStartTime) newErrors.eventStartTime = 'Start time is required.';
        if (!editData.eventEndTime) newErrors.eventEndTime = 'End time is required.';
        if (editData.eventStartDate && editData.eventCloseDate && editData.eventCloseDate < editData.eventStartDate) {
            newErrors.eventCloseDate = 'End date cannot be before start date.';
        }
        if (judgeRegError) newErrors.eventStartDate = judgeRegError;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input changes
    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    // Handle save/update event
    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        setSaveError(null);
        try {
            // Calculate openingDate and closingDate based on eventStartDate
            let openingDate = "";
            let closingDate = "";
            if (editData.eventStartDate) {
                const startDate = new Date(editData.eventStartDate);
                const opening = new Date(startDate);
                opening.setDate(opening.getDate() - 14); // 14 days before start
                openingDate = opening.toISOString().split('T')[0];
                closingDate = editData.eventStartDate;
            }
            const body = {
                expoForum: editData.expoForum,
                hostPlace: editData.hostPlace,
                venue: editData.venue,
                openingDate,
                closingDate,
                eventStartDate: editData.eventStartDate,
                eventCloseDate: editData.eventCloseDate,
                eventStartTime: editData.eventStartTime,
                eventEndTime: editData.eventEndTime,
            };
            const response = await fetch(`${API_URL}/${eventid}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!response.ok) throw new Error("Failed to update event.");
            // Don't clear the form, just show success
            toast.success("Event updated successfully!");
            // Optionally update initialEditData to allow further edits
            setInitialEditData(editData);
        } catch (err) {
            setSaveError(err.message);
            toast.error("Failed to update event.");
        } finally {
            setSaving(false);
        }
    };

    // Handle event deletion with confirmation dialog
    const handleDelete = async () => {
        setDeleting(true);
        try {
            const response = await fetch(`${API_URL}/${eventid}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to cancel event.");
            toast.success("Event cancelled successfully!");
            navigate("/events");
        } catch (err) {
            toast.error("Failed to cancel event.");
        } finally {
            setDeleting(false);
            setOpenDialog(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-500 mb-6"></div>
            <h2 className="text-indigo-600 text-2xl font-bold">Loading event details...</h2>
        </div>
    );
    if (error) return <Typography color="red" className="p-8 text-center">{error}</Typography>;
    if (!event) return null;

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-6">    
            <DashboardNavbar name={userName} role={userRole}/>
            <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm border border-indigo-200/40 rounded-2xl shadow-xl shadow-indigo-100/30">
                {/* Header and back link */}
                <div className="flex justify-between items-center mb-0 p-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl shadow-md">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Event Details
                    </h1>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </button>
                </div>
                {/* Editable event details form */}
                <div className="bg-white p-8 rounded-b-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Event Type (not editable) */}
                        <div>
                            <label className="block mb-2 text-indigo-700 font-semibold">Event Type</label>
                            <input
                                className="bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-800 p-3 rounded-xl border border-indigo-200 w-full cursor-not-allowed font-medium"
                                type="text"
                                name="expoForum"
                                value={editData.expoForum || ''}
                                disabled
                            />
                            {errors.expoForum && <span className="text-red-600 text-sm mt-1 block">{errors.expoForum}</span>}
                        </div>
                        {/* Region */}
                        <div>
                            <label className="block mb-2 text-indigo-700 font-semibold">Region</label>
                            <input
                                className="bg-white text-gray-700 p-3 rounded-xl border border-indigo-200 w-full focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                                type="text"
                                name="hostPlace"
                                value={editData.hostPlace || ''}
                                onChange={handleChange}
                            />
                            {errors.hostPlace && <span className="text-red-600 text-sm mt-1 block">{errors.hostPlace}</span>}
                        </div>
                        {/* Venue */}
                        <div className="md:col-span-2">
                            <label className="block mb-2 text-indigo-700 font-semibold">Venue Name</label>
                            <input
                                className="bg-white text-gray-700 p-3 rounded-xl border border-indigo-200 w-full focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                                type="text"
                                name="venue"
                                value={editData.venue || ''}
                                onChange={handleChange}
                            />
                            {errors.venue && <span className="text-red-600 text-sm mt-1 block">{errors.venue}</span>}
                        </div>
                        {/* Start Date */}
                        <div>
                            <label className="block mb-2 text-indigo-700 font-semibold">Event Start Date</label>
                            <input
                                className="bg-white text-gray-700 p-3 rounded-xl border border-indigo-200 w-full focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                                type="date"
                                name="eventStartDate"
                                value={editData.eventStartDate ? editData.eventStartDate.slice(0,10) : ''}
                                min={minEventDateStr}
                                onChange={handleChange}
                            />
                            {errors.eventStartDate && <span className="text-red-600 text-sm mt-1 block">{errors.eventStartDate}</span>}
                        </div>
                        {/* End Date */}
                        <div>
                            <label className="block mb-2 text-indigo-700 font-semibold">Event End Date</label>
                            <input
                                className="bg-white text-gray-700 p-3 rounded-xl border border-indigo-200 w-full focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                                type="date"
                                name="eventCloseDate"
                                value={editData.eventCloseDate ? editData.eventCloseDate.slice(0,10) : ''}
                                min={editData.eventStartDate ? editData.eventStartDate.slice(0,10) : minEventDateStr}
                                onChange={handleChange}
                            />
                            {errors.eventCloseDate && <span className="text-red-600 text-sm mt-1 block">{errors.eventCloseDate}</span>}
                        </div>
                        {/* Start Time */}
                        <div>
                            <label className="block mb-2 text-indigo-700 font-semibold">Event Start Time</label>
                            <input
                                className="bg-white text-gray-700 p-3 rounded-xl border border-indigo-200 w-full focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                                type="time"
                                name="eventStartTime"
                                value={editData.eventStartTime || ''}
                                onChange={handleChange}
                            />
                            {errors.eventStartTime && <span className="text-red-600 text-sm mt-1 block">{errors.eventStartTime}</span>}
                        </div>
                        {/* End Time */}
                        <div>
                            <label className="block mb-2 text-indigo-700 font-semibold">Event End Time</label>
                            <input
                                className="bg-white text-gray-700 p-3 rounded-xl border border-indigo-200 w-full focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                                type="time"
                                name="eventEndTime"
                                value={editData.eventEndTime || ''}
                                onChange={handleChange}
                            />
                            {errors.eventEndTime && <span className="text-red-600 text-sm mt-1 block">{errors.eventEndTime}</span>}
                        </div>
                    </div>
                    {saveError && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <Typography className="text-red-600 font-medium">{saveError}</Typography>
                    </div>}
                    {/* Action buttons */}
                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={handleSave}
                            disabled={saving || !isDirty}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-md"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            onClick={() => setOpenDialog(true)}
                            disabled={deleting}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-red-200 transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-md"
                        >
                            {deleting ? "Cancelling..." : "Cancel Event"}
                        </button>
                    </div>
                </div>
            </div>
            {/* Confirmation Dialog */}
            <Dialog open={openDialog} handler={setOpenDialog} size="xs" className="bg-white rounded-2xl border border-red-200">
                <DialogHeader className="text-red-700 bg-gradient-to-r from-red-50 to-red-100 rounded-t-2xl border-b border-red-200">
                    <div className="flex items-center gap-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.598 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Cancel Event
                    </div>
                </DialogHeader>
                <DialogBody className="p-6">
                    <Typography className="text-red-600 font-semibold text-lg">
                        Are you sure you want to cancel this event? This action cannot be undone.
                    </Typography>
                </DialogBody>
                <DialogFooter className="flex gap-4 p-6 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={() => setOpenDialog(false)}
                        disabled={deleting}
                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-semibold px-6 py-2 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                    >
                        No, Keep Event
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-6 py-2 rounded-xl shadow-lg shadow-red-200 transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-md"
                    >
                        {deleting ? "Cancelling..." : "Yes, Cancel Event"}
                    </button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

// To use toast notifications, ensure <ToastContainer /> is rendered in your App.jsx or root component.
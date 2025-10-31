import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Spinner } from "@material-tailwind/react";
import { DashboardNavbar } from "@/widgets/layout";
import bg from "../../assets/img/dashboard-bg-shape-1.jpg";

const API_URL = "/api/admin";
// Global variable for registration period (in days)
export const REGISTRATION_PERIOD_DAYS = 14;

export default function AddEvent() {
  // State to hold form data
  const [formData, setFormData] = useState({
    expoForum: '',
    hostPlace: '',
    venue: '',
    eventStartDate: '',
    eventCloseDate: '',
    eventStartTime: '',
    eventEndTime: ''
  });
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState({});
  // Handling the creation of the event.
  const [showTopOptions, setShowTopOptions] = useState(false);
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");
  // Navigation hook
  const navigate = useNavigate();

  // Today's date in yyyy-mm-dd format
  const today = new Date();
  // Minimum event start date is 14 days from today
  const minEventStartDate = new Date(today);
  minEventStartDate.setDate(today.getDate() + REGISTRATION_PERIOD_DAYS);
  const minEventStartDateStr = minEventStartDate.toISOString().split('T')[0];
  const todayStr = today.toISOString().split('T')[0];

  // Calculate registration opening and closing dates dynamically
  let registrationOpeningDate = '';
  let registrationClosingDate = '';
  let judgeRegError = '';
  if (formData.eventStartDate) {
    const startDate = new Date(formData.eventStartDate);
    const opening = new Date(startDate);
    opening.setDate(opening.getDate() - REGISTRATION_PERIOD_DAYS);
    registrationOpeningDate = opening.toISOString().split('T')[0];
    registrationClosingDate = formData.eventStartDate;
    // Judge registration cannot open before today
    if (registrationOpeningDate < todayStr) {
      judgeRegError = `Judge registration would open before today. Please pick a later event start date.`;
    }
  }

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!formData.expoForum) newErrors.expoForum = 'Event Type is required.';
    if (!formData.hostPlace) newErrors.hostPlace = 'Region is required.';
    if (!formData.venue) newErrors.venue = 'Venue is required.';
    if (!formData.eventStartDate) newErrors.eventDate = 'Event date is required.'; // Changed from eventStartDate
    if (!formData.eventStartTime) newErrors.eventStartTime = 'Start time is required.';
    if (!formData.eventEndTime) newErrors.eventEndTime = 'End time is required.';
    if (judgeRegError) newErrors.eventDate = judgeRegError; // Changed from eventStartDate
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // State for event Id 
  const [createdEventId, setCreatedEventId] = useState(null);

  const updateEventStatus = async (status) => {
    if (!createdEventId) return;

    try {
      const res = await fetch(`${API_URL}/status/${createdEventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update event status.");

      toast.success(`Event marked as "${status}" successfully.`);
      navigate("/events"); // optional: redirect after update
    } catch (err) {
      toast.error("Failed to update event status.");
      console.error(err);
    }
  };

  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setCreating(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          event_status: "unpublished",
          openingDate: registrationOpeningDate,
          closingDate: registrationClosingDate
        })
      });
      if (!response.ok) {
        throw new Error('Failed to create event.');
      }

      // **CHANGE IS HERE**
      // Instead of showing options, we show a success message and redirect.
      toast.success('Event created successfully!');
      navigate(-1); // This line takes you to the previous page.

    } catch (error) {
      toast.error('Error creating event.');
      console.error('Error creating event:', error);
      setCreating(false);
    }
  };

  // Handle input changes for all form fields
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // **NEW**: Handle the single date input change
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFormData({
      ...formData,
      eventStartDate: selectedDate,
      eventCloseDate: selectedDate,
    });
  };

  if (creating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
        <Spinner color="blue" className="h-16 w-16 mb-6" />
        <h2 className="text-blue-700 text-2xl font-bold">Creating event, please wait...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: "100% 100%", // stretches both width & height
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    }}>
      <div className="m-4">
        <DashboardNavbar name={userName} role={userRole} />
      </div>

      <div className="flex flex-col md:flex-row gap-2 px-4 w-full">
        {/* Event Form (Left) */}
        <div className="flex-1 min-h-screen overflow-hidden py-6 px-2 sm:px-4 flex flex-col">
          <div className="w-full max-w-3xl bg-white border border-blue-200 rounded-2xl shadow-xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 p-6 bg-gradient-to-r from-blue-700 to-blue-500 rounded-t-2xl shadow-md">
              {/* **NEW**: Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="text-white hover:bg-blue-600 rounded-full p-2 transition-colors duration-300"
                aria-label="Go back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-3xl font-bold text-white text-center flex-grow">Add New Event</h1>
              <div className="w-10"></div> {/* Spacer to balance the header */}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-b-2xl shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Type */}
                <div>
                  <label htmlFor="expoForum" className="block mb-1 text-blue-900 font-semibold">Event Type</label>
                  <select
                    id="expoForum"
                    name="expoForum"
                    className="bg-blue-50 text-blue-900 p-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    value={formData.expoForum}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Select Event Type</option>
                    <option value="District">District</option>
                    <option value="Regional">Regional</option>
                    <option value="International">International</option>
                  </select>
                  {errors.expoForum && <span className="text-red-600 text-sm">{errors.expoForum}</span>}
                </div>

                {/* Region */}
                <div>
                  <label htmlFor="hostPlace" className="block mb-1 text-blue-900 font-semibold">Region</label>
                  <input
                    id="hostPlace"
                    type="text"
                    name="hostPlace"
                    placeholder="Region"
                    value={formData.hostPlace}
                    onChange={handleInputChange}
                    required
                    className="bg-blue-50 text-blue-900 p-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  />
                  {errors.hostPlace && <span className="text-red-600 text-sm">{errors.hostPlace}</span>}
                </div>

                {/* Venue */}
                <div className="md:col-span-2">
                  <label htmlFor="venue" className="block mb-1 text-blue-900 font-semibold">Venue Name</label>
                  <input
                    id="venue"
                    type="text"
                    name="venue"
                    placeholder="Venue Name"
                    value={formData.venue}
                    onChange={handleInputChange}
                    required
                    className="bg-blue-50 text-blue-900 p-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  />
                  {errors.venue && <span className="text-red-600 text-sm">{errors.venue}</span>}
                </div>
                
                {/* **MODIFIED**: Single Event Date Input */}
                <div className="md:col-span-2">
                  <label htmlFor="eventDate" className="block mb-1 text-blue-900 font-semibold">Event Date</label>
                  <input
                    id="eventDate"
                    type="date"
                    name="eventDate"
                    value={formData.eventStartDate} // Use eventStartDate to control value
                    onChange={handleDateChange}       // Use custom handler
                    min={minEventStartDateStr}
                    required
                    className="bg-blue-50 text-blue-900 p-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  />
                  {errors.eventDate && <span className="text-red-600 text-sm">{errors.eventDate}</span>}
                </div>
                
                {/* Start Time */}
                <div>
                  <label htmlFor="eventStartTime" className="block mb-1 text-blue-900 font-semibold">Event Start Time</label>
                  <input
                    id="eventStartTime"
                    type="time"
                    name="eventStartTime"
                    value={formData.eventStartTime}
                    onChange={handleInputChange}
                    required
                    className="bg-blue-50 text-blue-900 p-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  />
                  {errors.eventStartTime && <span className="text-red-600 text-sm">{errors.eventStartTime}</span>}
                </div>

                {/* End Time */}
                <div>
                  <label htmlFor="eventEndTime" className="block mb-1 text-blue-900 font-semibold">Event End Time</label>
                  <input
                    id="eventEndTime"
                    type="time"
                    name="eventEndTime"
                    value={formData.eventEndTime}
                    onChange={handleInputChange}
                    required
                    className="bg-blue-50 text-blue-900 p-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  />
                  {errors.eventEndTime && <span className="text-red-600 text-sm">{errors.eventEndTime}</span>}
                </div>
              </div>

              {/* Judge Registration Hint */}
              {registrationOpeningDate && registrationClosingDate && (
                <div className="mt-8 mb-4 text-blue-900 font-semibold text-lg">
                  Judge Registrations Open: {registrationOpeningDate}
                </div>
              )}

              <button type="submit" className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300">
                Create Event
              </button>
            </form>
          </div>
        </div>

        {/* Sticky Hints (Right) */}
        <div className="w-full md:w-[350px] py-6 self-start sticky top-24">
          <div className="bg-white border border-blue-200 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4 p-6 bg-gradient-to-r from-blue-700 to-blue-500 rounded-t-2xl shadow-md">
              <h1 className="text-xl font-bold text-white">Hints: Events</h1>
            </div>
            <div className="p-6 text-blue-900 text-sm leading-relaxed">
              <ul className="list-disc pl-5 space-y-2">
                <li>After creation the event is on unpublished by default.</li>
                <li>Unpublished events can only be seen by the admin.</li>
                <li>Publish events so that they can be seen by everyone, and only then users can join events.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
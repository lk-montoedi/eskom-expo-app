import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function AddEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    expoForum: '',
    hostPlace: '',
    venue: '',
    openingDate: '',
    closingDate: '',
    eventStartDate: '',
    eventCloseDate: '',
    eventStartTime: '',
    eventEndTime: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(formData).some(field => !field)) {
      alert("Please complete all required fields.");
      return;
    }

    try {
      const res = await fetch("/api/admin/create/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Event created successfully!");
        navigate("/events");
      } else {
        alert("Failed to create event.");
      }
    } catch(err) {
      console.error(err);
      alert("Error submitting form.");
    }
  }

  return (
  <div className="min-h-screen bg-gray-100 text-blue-gray-800 p-8">
    <div className="container mx-auto max-w-3xl">
      {/* Back button at top */}
      <div className="mb-4 flex justify-end">
        <Button
          variant="outlined"
          color="blue"
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-blue-500 text-blue-700 hover:bg-blue-50 rounded-md"
        >
          &larr; Back
        </Button>
      </div>

      <Card className="w-full shadow-md border border-blue-200 bg-white rounded-lg">
        <CardHeader
          floated={false}
          shadow={false}
          className="bg-blue-100 text-blue-900 p-6 rounded-t-lg"
        >
          <Typography variant="h4" className="font-bold">Create New Event</Typography>
          <Typography className="text-blue-700 mt-1">
            Fill in the details for your new event
          </Typography>
        </CardHeader>

        <CardBody className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography variant="h6" className="mb-2 font-medium text-blue-800">
                  Expo Forum *
                </Typography>
                <Select
                  name="expoForum"
                  value={formData.expoForum}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, expoForum: value }))
                  }
                  label="Select forum"
                  className="bg-white text-blue-900 border border-blue-300 focus:border-blue-500"
                >
                  <Option value="District">District</Option>
                  <Option value="Regional">Regional</Option>
                  <Option value="International">International</Option>
                </Select>
              </div>

              <div>
                <Typography variant="h6" className="mb-2 font-medium text-blue-800">
                  Host Place *
                </Typography>
                <Input
                  name="hostPlace"
                  size="lg"
                  placeholder="e.g. Johannesburg"
                  value={formData.hostPlace}
                  onChange={handleChange}
                  className="bg-white text-blue-900 border border-blue-300 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <Typography variant="h6" className="mb-2 font-medium text-blue-800">
                  Event Venue *
                </Typography>
                <Input
                  name="venue"
                  size="lg"
                  placeholder="e.g. University of Johannesburg, Auditorium"
                  value={formData.venue}
                  onChange={handleChange}
                  className="bg-white text-blue-900 border border-blue-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography variant="h6" className="mb-2 font-medium text-blue-800">
                  Registration Opens *
                </Typography>
                <Input
                  type="date"
                  name="openingDate"
                  size="lg"
                  value={formData.openingDate}
                  onChange={handleChange}
                  className="bg-white text-blue-900 border border-blue-300 focus:border-blue-500"
                />
              </div>
              <div>
                <Typography variant="h6" className="mb-2 font-medium text-blue-800">
                  Registration Closes *
                </Typography>
                <Input
                  type="date"
                  name="closingDate"
                  size="lg"
                  value={formData.closingDate}
                  onChange={handleChange}
                  className="bg-white text-blue-900 border border-blue-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography variant="h6" className="mb-2 font-medium text-blue-800">
                  Event Start Date *
                </Typography>
                <Input
                  type="date"
                  name="eventStartDate"
                  size="lg"
                  value={formData.eventStartDate}
                  onChange={handleChange}
                  className="bg-white text-blue-900 border border-blue-300 focus:border-blue-500"
                />
              </div>
              <div>
                <Typography variant="h6" className="mb-2 font-medium text-blue-800">
                  Event End Date *
                </Typography>
                <Input
                  type="date"
                  name="eventCloseDate"
                  size="lg"
                  value={formData.eventCloseDate}
                  onChange={handleChange}
                  className="bg-white text-blue-900 border border-blue-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outlined"
                color="blue"
                onClick={() => navigate(-1)}
                className="border-blue-500 text-blue-700 hover:bg-blue-50 rounded-md"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="blue"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Create Event
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  </div>
);

}

export default AddEvent;

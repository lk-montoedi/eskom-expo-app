import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Input,
  Button,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import logoEskom from "/src/assets/img/logo01.png";
import learnerIcon from "/src/assets/img/Onboard-icns_learner.svg";
import { uploadAndSetImage } from "@/utils/photoUpload";

export default function TeacherLearnerRegister() {
  // form state contains only learner-specific inputs (no school-related inputs)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    altContact: "",
    dob: "",
    gender: "",
    race: "",
    isDisabled: "",
    disabilityType: "",
    disabilityDescription: "",
    grade: "",
    photo: null,
  });

  // school info will be stored separately, fetched from teacher info
  const [schoolInfo, setSchoolInfo] = useState({
    schoolName: "",
    province: "",
    region: "",
    schoolLevel: "",
    ownership: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch teacher's school info on mount
  useEffect(() => {
    const teacherId = localStorage.getItem("userId");
    if (!teacherId) return;

    const fetchTeacherSchool = async () => {
      try {
        const res = await fetch(`/api/teacher/get/school/info/${teacherId}`);
        if (res.ok) {
          const teacher = await res.json();
          console.log("Here is or School Info:", teacher.schoolname);
          setSchoolInfo({
            schoolName: teacher.schoolname,
            province: teacher.province,
            region: teacher.region,
            schoolLevel: teacher.schoollevel,
            ownership: teacher.ownership,
          });
        } else {
          console.error("Failed to fetch teacher info");
        }
      } catch (err) {
        console.error("Error fetching teacher info", err);
      }
    };

    fetchTeacherSchool();
  }, []);

  const uploadWithLoader = async (file) => {
    setLoading(true);
    await uploadAndSetImage(file, (img) =>
      setForm((prev) => ({ ...prev, photo: img }))
    );
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required learner fields
    const requiredFields = ["firstName", "lastName", "grade"];
    if (requiredFields.some((field) => !form[field])) {
      alert("Please fill in all required fields.");
      return;
    }

    // Combine learner form + school info
    const dataToSubmit = { ...form, ...schoolInfo };

    try {
      const res = await fetch("/api/teacher/register/learner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      if (res.ok) {
        alert("Learner registered successfully!");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          contact: "",
          altContact: "",
          dob: "",
          gender: "",
          race: "",
          isDisabled: "",
          disabilityType: "",
          disabilityDescription: "",
          grade: "",
          photo: null,
        });
      } else {
        const data = await res.json();
        alert(`Registration failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <img src={logoEskom} alt="Logo" className="h-12" />
        <Typography variant="h6" className="text-blue-900 font-semibold">
          Teacher Portal – Register Learner
        </Typography>
      </header>

      {/* Form Section */}
      <section className="m-8 flex flex-col lg:flex-row gap-8">
        <Card className="w-full flex flex-row border border-blue-200 shadow-lg bg-white">
          {/* Sidebar */}
          <div className="lg:w-1/2 flex flex-col items-center p-6">
            <img
              src={learnerIcon}
              className="w-full max-w-md object-cover rounded-3xl"
              alt="Learner"
            />
            <Typography variant="h4" className="mt-4 text-blue-800 font-bold">
              Learner Information
            </Typography>
          </div>

          {/* Form */}
          <div className="p-6 w-full">
            <Typography variant="h3" className="text-blue-800 font-bold mb-6">
              Learner Registration Form
            </Typography>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <Card className="border border-blue-100 shadow-none">
                <CardHeader className="bg-blue-800 p-4 rounded-t-lg">
                  <Typography variant="h6" className="text-white">
                    Personal Information
                  </Typography>
                </CardHeader>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Email (optional)"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                    <Input
                      label="Contact Number"
                      name="contact"
                      value={form.contact}
                      onChange={handleChange}
                    />
                  </div>
                  <Input
                    label="Alternative Contact"
                    name="altContact"
                    value={form.altContact}
                    onChange={handleChange}
                  />
                  <Input
                    type="date"
                    label="Date of Birth"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="p-3 border rounded-md text-blue-900"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <select
                      name="race"
                      value={form.race}
                      onChange={handleChange}
                      className="p-3 border rounded-md text-blue-900"
                    >
                      <option value="">Select Race</option>
                      <option value="black">Black</option>
                      <option value="white">White</option>
                      <option value="coloured">Coloured</option>
                      <option value="indian">Indian</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Typography variant="small">Profile Photo</Typography>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => uploadWithLoader(e.target.files[0])}
                      className="w-full p-2 border rounded-lg mt-2"
                    />
                    {loading && <p className="text-blue-500">Uploading...</p>}
                    {form.photo && !loading && (
                      <img
                        src={form.photo}
                        alt="Preview"
                        className="w-32 mt-4 rounded"
                      />
                    )}
                  </div>
                </div>
              </Card>

              {/* Grade Selection */}
              <Card className="border border-blue-100 shadow-none">
                <CardHeader className="bg-blue-800 p-4">
                  <Typography variant="h6" className="text-white">
                    Grade
                  </Typography>
                </CardHeader>
                <div className="p-6">
                  <select
                    name="grade"
                    value={form.grade}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md"
                  >
                    <option value="">Select Grade</option>
                    {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                      <option key={g} value={g}>
                        Grade {g}
                      </option>
                    ))}
                  </select>
                </div>
              </Card>

              {/* Disability Info */}
              <Card className="border border-blue-100 shadow-none">
                <CardHeader className="bg-blue-800 p-4">
                  <Typography variant="h6" className="text-white">
                    Disability Information
                  </Typography>
                </CardHeader>
                <div className="p-6 space-y-4">
                  <select
                    name="isDisabled"
                    value={form.isDisabled}
                    onChange={handleChange}
                    className="p-3 border rounded-md w-full"
                  >
                    <option value="">Do they have a disability?</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  {form.isDisabled === "yes" && (
                    <>
                      <select
                        name="disabilityType"
                        value={form.disabilityType}
                        onChange={handleChange}
                        className="p-3 border rounded-md w-full"
                      >
                        <option value="">Select Disability Type</option>
                        <option value="hearing">Hearing Impaired</option>
                        <option value="cognitive">Cognitive</option>
                        <option value="mobility">Mobility</option>
                        <option value="psychological">Psychological</option>
                      </select>
                      <Textarea
                        name="disabilityDescription"
                        value={form.disabilityDescription}
                        onChange={handleChange}
                        label="Disability Description"
                      />
                    </>
                  )}
                </div>
              </Card>

              {/* Submit */}
              <div className="flex justify-center">
                <Button type="submit" className="bg-blue-800 px-10">
                  Register Learner
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </section>
    </div>
  );
}

import {
  Card,
  Input,
  Button,
  Typography,
  CardHeader,
  Textarea,
} from "@material-tailwind/react";
import { useState, useContext } from "react";
import learnerIcon from "/src/assets/img/Onboard-icns_learner.svg";
import logoEskom from "/src/assets/img/logo01.png";
import { RegistrationContext } from "@/context/registrationContext";
import { useNavigate } from "react-router-dom";
import SchoolSelect from "@/utils/schoolSelect";

export function SignUpStep2() {
  const { registrationData } = useContext(RegistrationContext);
  const navigate = useNavigate();

  const [province, setProvince] = useState("");
  const [region, setRegion] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("");
  const [ownership, setOwnership] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [grade, setGrade] = useState("");
  const [disabilityDescription, setDisabilityDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!province || !region || !grade || !schoolName || !schoolLevel || !ownership) {
      alert("Please complete all required fields.");
      return;
    }

    const fullData = {
      ...registrationData,
      province,
      region,
      schoolLevel,
      ownership,
      schoolName,
      grade,
      disabilityDescription,
    };

    try {
      const res = await fetch("/api/user/register/learner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullData),
      });

      if (res.ok) {
          await fetch("/api/email/send-registration-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fullData.email,
        userData: fullData,
      }),
    });
        alert("Registration successful!");
        navigate("/auth/sign-in");
      } else {
        const data = await res.json();
        alert(`Failed to register: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while registering.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Navigation Bar */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <img src={logoEskom} alt="Logo" className="h-12" />
        <div className="flex items-center">
          <Button
            color="blue"
            variant="text"
            ripple={true}
            onClick={() => navigate(-1)}
            className="flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </Button>
        </div>
      </header>

      {/* Registration Form */}
      <section className="m-8 flex flex-col lg:flex-row gap-8">
        <Card className="w-full flex flex-row border border-blue-200 shadow-lg bg-white">
          <div className="lg:w-1/2 flex flex-col items-center">
            <img
              src={learnerIcon}
              className="w-full max-w-md object-cover rounded-3xl"
              alt="Learner icon"
            />
            <Typography variant="h4" className="mt-4 text-blue-800 font-bold">Learner</Typography>
          </div>

          <div className="p-6 w-full lg:w-1/2">
            <Typography variant="h2" className="text-center text-blue-800 font-bold mb-8">
              Step 2: Complete Your Registration
            </Typography>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="border border-blue-100 shadow-none">
                {/* Location Info */}
                <CardHeader className="bg-blue-800 p-4 rounded-t-lg">
                  <Typography variant="h5" className="text-white font-medium">
                    Location Information
                  </Typography>
                </CardHeader>
                <div className="p-6 space-y-6">
                  <div>
                    <Typography variant="small" className="text-blue-900 font-medium mb-2">
                      Province*
                    </Typography>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full p-3 border border-blue-200 rounded-lg"
                    >
                      <option value="">Select Province</option>
                      <option value="freeState">Free State</option>
                      <option value="gauteng">Gauteng</option>
                      <option value="limpopo">Limpopo</option>
                      <option value="northWest">North West</option>
                      <option value="northernCape">Northern Cape</option>
                      <option value="mpumalanga">Mpumalanga</option>
                      <option value="kzn">KwaZulu-Natal</option>
                      <option value="easternCape">Eastern Cape</option>
                      <option value="westernCape">Western Cape</option>
                    </select>
                  </div>

                  <div>
                    <Typography variant="small" className="text-blue-900 font-medium mb-2">
                      Region*
                    </Typography>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full p-3 border border-blue-200 rounded-lg"
                    >
                      <option value="">Select Region</option>
                      <option value="welkom">Welkom</option>
                      <option value="bethlehem">Bethlehem</option>
                      <option value="bloemfontein">Bloemfontein</option>
                      <option value="johannesburg">Johannesburg</option>
                      <option value="centurion">Centurion</option>
                      <option value="soweto">Soweto</option>
                      <option value="kwamashu">Kwamashu</option>
                      <option value="rustenburg">Rustenburg</option>
                      <option value="ventersburg">Ventersburg</option>
                    </select>
                  </div>
                </div>

                {/* School Info */}
                <CardHeader className="bg-blue-800 p-4">
                  <Typography variant="h5" className="text-white font-medium">
                    School Information
                  </Typography>
                </CardHeader>
                <div className="p-6 space-y-6">
                  <div>
                    <Typography variant="small" className="text-blue-900 font-medium mb-2">
                      School Level*
                    </Typography>
                    <select
                      value={schoolLevel}
                      onChange={(e) => setSchoolLevel(e.target.value)}
                      className="w-full p-3 border border-blue-200 rounded-lg"
                    >
                      <option value="">Select Level</option>
                      <option value="primary">Primary</option>
                      <option value="combined">Combined</option>
                      <option value="secondary">Secondary</option>
                    </select>
                  </div>

                  <div>
                    <Typography variant="small" className="text-blue-900 font-medium mb-2">
                      Ownership*
                    </Typography>
                    <select
                      value={ownership}
                      onChange={(e) => setOwnership(e.target.value)}
                      className="w-full p-3 border border-blue-200 rounded-lg"
                    >
                      <option value="">Select Ownership</option>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <SchoolSelect
                    level={schoolLevel}
                    ownership={ownership}
                    value={schoolName}
                    onChange={setSchoolName}
                  />

                  <div>
                    <Typography variant="small" className="text-blue-900 font-medium mb-2">
                      Grade*
                    </Typography>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full p-3 border border-blue-200 rounded-lg"
                    >
                      <option value="">Select a grade</option>
                      {[...Array(9)].map((_, i) => {
                        const g = i + 4;
                        return <option key={g} value={g}>Grade {g}</option>;
                      })}
                    </select>
                  </div>
                </div>

                {/* Additional Info */}
                <CardHeader className="bg-blue-800 p-4">
                  <Typography variant="h5" className="text-white font-medium">
                    Additional Information
                  </Typography>
                </CardHeader>
                <div className="p-6 space-y-6">
                  <Typography variant="small" className="text-blue-900 font-medium">
                    Do you have any disabilities or special needs?
                  </Typography>
                  <Textarea
                    value={disabilityDescription}
                    onChange={(e) => setDisabilityDescription(e.target.value)}
                    rows={3}
                    placeholder="Please describe..."
                    className="w-full p-3 border border-blue-200 rounded-lg"
                  />
                </div>

                {/* Submit */}
                <div className="p-6 pt-0 flex justify-center">
                  <Button type="submit" className="bg-blue-800 hover:bg-blue-900 w-full md:w-auto px-8">
                    Submit Registration
                  </Button>
                </div>
              </Card>
            </form>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default SignUpStep2;

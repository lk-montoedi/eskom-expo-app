import { RegistrationContext } from "@/context/registrationContext";
import { Card, Input, Checkbox, Button, Typography, CardHeader } from "@material-tailwind/react";
import { useContext, useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import logoEskom from '/src/assets/img/logo01.png';
import teacherIcon from '/src/assets/img/Onboard-icns_teacher.svg';
import SchoolSelect from "@/utils/schoolSelect";

export function TeacherRegistrationStep2() {
   // const { registrationData } = useContext(RegistrationContext);
    const { registrationData, updateData } = useContext(RegistrationContext);

    useEffect(() => {
  if (!registrationData || Object.keys(registrationData).length === 0) {
    const saved = localStorage.getItem("registrationData");
    if (saved) {
      updateData(JSON.parse(saved)); // Restore context from storage
    } else {
      navigate("/auth/teacherRegistration"); // Go back if no data at all
    }
  }
}, []);

const navigate = useNavigate();

const [province, setProvince] = useState("");
const [region, setRegion] = useState("");
const [selectedSchool, setSelectedSchool] = useState(null); // Changed from schoolName
const [schoolLevel, setSchoolLevel] = useState("");
const [ownership, setOwnership] = useState("");

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!province || !region || !selectedSchool || !schoolLevel || !ownership) {
        alert("Please complete all required fields.");
        return;
    }

    const fullData = {
        ...registrationData,
        province,
        region,
        school: selectedSchool, // Store full school object
        schoolLevel,
        ownership,
    };

    try {
        const res = await fetch("/api/user/register/teacher", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fullData),
        });

        if (res.ok) {
          await fetch("/api/email/send-teacher-registration-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: fullData.email,
            teacherData: fullData,
        }),
        });

            alert("Registration successful!");
            navigate("/auth/sign-in");
        } else {
            alert("Failed to register.");
        }
    } catch (err) {
        console.error(err);
        alert("Error submitting form.");
    }
};

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
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

            <section className="m-8 flex flex-col lg:flex-row gap-8">
                <Card className="w-full flex flex-row border border-blue-200 shadow-lg bg-white">
                    <div className="lg:w-1/2 flex flex-col items-center">
                        <img
                            src={teacherIcon}
                            className="w-full max-w-md object-cover rounded-3xl"
                            alt="Teacher icon"
                        />
                        <Typography variant="h4" className="mt-4 text-blue-800 font-bold">Teacher</Typography>
                    </div>

                    <div className="p-6">
                        <Typography variant="h2" className="text-center text-blue-800 font-bold mb-8">
                            Step 2: Complete Your Registration
                        </Typography>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Card className="border border-blue-100 shadow-none">
                                <CardHeader className="bg-blue-800 p-4 rounded-t-lg">
                                    <Typography variant="h5" className="text-white font-medium">
                                        Location Information
                                    </Typography>
                                </CardHeader>

                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Typography variant="small" className="text-blue-900 font-medium mb-2">
                                                Which Province are you from?*
                                            </Typography>
                                            <select
                                                value={province}
                                                onChange={(e) => setProvince(e.target.value)}
                                                className="w-full p-3 border border-blue-200 rounded-lg focus:border-blue-800 focus:outline-none"
                                            >
                                                <option value="">Select Province</option>
                                                <option value="Free State">Free State</option>
                                                <option value="Gauteng">Gauteng</option>
                                                <option value="Limpopo">Limpopo</option>
                                                <option value="North West">North West</option>
                                                <option value="Northern Cape">Northern Cape</option>
                                                <option value="Mpumalanga">Mpumalanga</option>
                                                <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                                                <option value="Eastern Cape">Eastern Cape</option>
                                                <option value="Western Cape">Western Cape</option>
                                            </select>
                                        </div>

                                        <div>
                                            <Typography variant="small" className="text-blue-900 font-medium mb-2">
                                                Which Region are you from?*
                                            </Typography>
                                            <select
                                                value={region}
                                                onChange={(e) => setRegion(e.target.value)}
                                                className="w-full p-3 border border-blue-200 rounded-lg focus:border-blue-800 focus:outline-none"
                                            >
                                                <option value="">Select Region</option>
                                                <option value="Welkom">Welkom</option>
                                                <option value="Betlehem">Betlehem</option>
                                                <option value="Bloemfontein">Bloemfontein</option>
                                                <option value="Johannesburg">Johannesburg</option>
                                                <option value="Centurion">Centurion</option>
                                                <option value="Soweto">Soweto</option>
                                                <option value="Kwamashu">Kwamashu</option>
                                                <option value="Rusternburg">Rusternburg</option>
                                                <option value="Ventersburg">Ventersburg</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>


                                {/**School Info */}
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
                                    value={selectedSchool}
                                    onChange={setSelectedSchool}
                                    />
                                </div>
                                

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

export default TeacherRegistrationStep2;

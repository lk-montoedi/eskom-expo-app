import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  CardHeader,
  Textarea,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import judgeIcon from "/src/assets/img/Onboard-icns_judge.svg";
import { RegistrationContext } from "@/context/registrationContext";
import { useContext, useState } from "react";
import logoEskom from '/src/assets/img/logo01.png';

export function JudgeRegistrationStep2() {
  const judgingCategories = [
    "agricultural sciences",
    "animal sciences",
    "biomedical and medical sciences",
    "chemistry and biochemistry",
    "computer sciences and software development",
    "earth sciences",
    "energy",
    "engineering",
    "environmental studies",
    "mathematics",
    "plant sciences",
    "physics, astronomy & space sciences",
    "social sciences",
  ];
    
  const { registrationData } = useContext(RegistrationContext);
  const navigate = useNavigate();

  const [institution, setInstitution] = useState("");
  const [qualification, setQualification] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [idDoc, setIdDoc] = useState(null);
  const [province, setProvince] = useState("");
  const [region, setRegion] = useState("");
  const [years, setYears] = useState("");
  const [expoForums, setExpoForums] = useState({ 
    district: false, 
    regional: false, 
    international: false 
  });
  const [judgeExperience, setJudgeExperience] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const uploadToSupabase = async (base64, fileNamePrefix) => {
    try {
      const response = await fetch("/api/upload-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64, fileNamePrefix }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.publicUrl;
    } catch (err) {
      console.error("Supabase upload failed:", err);
      alert("Failed to upload document.");
      return null;
    }
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Keep the "data:..." prefix
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };


  const handleIdDocUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await toBase64(file);
        const publicUrl = await uploadToSupabase(base64, "id-docs");
        if (publicUrl) setIdDoc(publicUrl);
      } catch (err) {
        console.error("Error handling ID doc:", err);
      }
    }
  };

  const handleCertificateUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await toBase64(file);
        const publicUrl = await uploadToSupabase(base64, "certificates");
        if (publicUrl) setCertificate(publicUrl);
      } catch (err) {
        console.error("Error handling certificate:", err);
      }
    }
  };


  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter((item) => item !== category);
      } else {
        return [...prevSelected, category];
      }
    });
  };

  const handleExpoChange = (e) => {
    const { name, checked } = e.target;
    setExpoForums((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedCategories.length < 2) {
      alert("Please select at least 2 judging categories.");
      return;
    }

    if (!province || !region || !institution || !qualification || !years) {
      alert("Please complete all required fields.");
      return;
    }

    const fullData = {
      ...registrationData,
      institution,
      qualification,
      certificate,
      idDoc,
      province,
      region,
      years,
      expoForums,
      judgeExperience,
      categories: selectedCategories,
    };

    try {
      const res = await fetch("/api/user/register/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullData),
      });

      if (res.ok) {
               await fetch("/api/email/send-judge-registration-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fullData.email,
        judgeData: fullData,
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
              src={judgeIcon}
              className="w-full max-w-md object-cover rounded-3xl"
              alt="Judge icon"
            />
            <Typography variant="h4" className="mt-4 text-blue-800 font-bold">Judge</Typography>
          </div>
          
          <div className="p-6">
            <Typography variant="h2" className="text-center text-blue-800 font-bold mb-8">
              Step 2: Complete Your Registration
            </Typography>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="border border-blue-100 shadow-none">
                <CardHeader className="bg-blue-800 p-4 rounded-t-lg">
                  <Typography variant="h5" className="text-white font-medium">
                    Professional Information
                  </Typography>
                </CardHeader>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Typography variant="small" className="text-blue-900 font-medium mb-2">
                        Institution/Organization*
                      </Typography>
                      <Input
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        size="lg"
                        placeholder="Where you work or study"
                        className="!border-blue-200 focus:!border-blue-800"
                        labelProps={{ className: "hidden" }}
                      />
                    </div>
                    
                    <div>
                      <Typography variant="small" className="text-blue-900 font-medium mb-2">
                        Highest Qualification*
                      </Typography>
                      <Input
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        size="lg"
                        placeholder="Qualification(Institution) Year"
                        className="!border-blue-200 focus:!border-blue-800"
                        labelProps={{ className: "hidden" }}
                      />
                    </div>
                  </div>

                  <CardHeader className="bg-blue-800 p-4 mt-4">
                    <Typography variant="h5" className="text-white font-medium">
                      Required Documents
                    </Typography>
                  </CardHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    <div>
                      <Typography variant="small" className="text-blue-900 font-medium mb-2">
                        Proof of Certificate (PDF)
                      </Typography>
                      <input
                        onChange={handleCertificateUpload}
                        type="file"
                        accept="application/pdf"
                        className="w-full p-2 border border-blue-200 rounded-lg file:mr-4 file:py-1 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-800 hover:file:bg-blue-100"
                      />
                    </div>

                    <div>
                      <Typography variant="small" className="text-blue-900 font-medium mb-2">
                        ID/Passport (PDF)
                      </Typography>
                      <input
                        onChange={handleIdDocUpload}
                        type="file"
                        accept="application/pdf"
                        className="w-full p-2 border border-blue-200 rounded-lg file:mr-4 file:py-1 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-800 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>

                  <CardHeader className="bg-blue-800 p-4">
                    <Typography variant="h5" className="text-white font-medium">
                      Location Information
                    </Typography>
                  </CardHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    <div>
                      <Typography variant="small" className="text-blue-900 font-medium mb-2">
                        Province*
                      </Typography>
                      <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full p-3 border border-blue-200 rounded-lg focus:border-blue-800 focus:outline-none"
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
                        className="w-full p-3 border border-blue-200 rounded-lg focus:border-blue-800 focus:outline-none"
                      >
                        <option value="">Select Region</option>
                        <option value="welkom">Welkom</option>
                        <option value="betlehem">Betlehem</option>
                        <option value="bloemfontein">Bloemfontein</option>
                        <option value="johannesburg">Johannesburg</option>
                        <option value="centurion">Centurion</option>
                        <option value="soweto">Soweto</option>
                        <option value="kwamashu">Kwamashu</option>
                        <option value="rusternburg">Rusternburg</option>
                        <option value="ventersburg">Ventersburg</option>
                      </select>
                    </div>
                  </div>

                  <CardHeader className="bg-blue-800 p-4">
                    <Typography variant="h5" className="text-white font-medium">
                      Judging Experience
                    </Typography>
                  </CardHeader>

                  <div className="p-6 space-y-6">
                    <div>
                      <Typography variant="small" className="text-blue-900 font-medium mb-2">
                        Years of Judging Experience*
                      </Typography>
                      <Input
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                        type="number"
                        placeholder="Number of years"
                        className="!border-blue-200 focus:!border-blue-800"
                        labelProps={{ className: "hidden" }}
                      />
                    </div>

                    <div>
                      <Typography variant="small" className="text-blue-900 font-medium mb-2">
                        Expo Forums*
                      </Typography>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            name="district"
                            checked={expoForums.district}
                            onChange={handleExpoChange}
                            color="blue"
                            ripple={false}
                            className="h-5 w-5"
                          />
                          <Typography variant="small" className="text-blue-900 font-medium">
                            District
                          </Typography>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            name="regional"
                            checked={expoForums.regional}
                            onChange={handleExpoChange}
                            color="blue"
                            ripple={false}
                            className="h-5 w-5"
                          />
                          <Typography variant="small" className="text-blue-900 font-medium">
                            Regional
                          </Typography>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            name="international"
                            checked={expoForums.international}
                            onChange={handleExpoChange}
                            color="blue"
                            ripple={false}
                            className="h-5 w-5"
                          />
                          <Typography variant="small" className="text-blue-900 font-medium">
                            International
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Typography variant="small" className="text-blue-900 font-medium mb-2">
                        Judging Experience Details
                      </Typography>
                      <Textarea
                        value={judgeExperience}
                        onChange={(e) => setJudgeExperience(e.target.value)}
                        rows={3}
                        placeholder="e.g. Gauteng Regional Expo 2019, Cape Town Regional 2018"
                        className="w-full p-3 border border-blue-200 rounded-lg focus:border-blue-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <CardHeader className="bg-blue-800 p-4">
                    <Typography variant="h5" className="text-white font-medium">
                      Judging Categories (Select at least 2)*
                    </Typography>
                  </CardHeader>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {judgingCategories.map((category, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          color="blue"
                          ripple={false}
                          className="h-5 w-5"
                        />
                        <Typography variant="small" className="text-blue-900 font-medium">
                          {category}
                        </Typography>
                      </div>
                    ))}
                  </div>
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

export default JudgeRegistrationStep2;
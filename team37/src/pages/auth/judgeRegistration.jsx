import {
  Card,
  CardHeader,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { RegistrationContext } from "@/context/registrationContext";
import logoEskom from '/src/assets/img/logo01.png';
import judgeIcon from '/src/assets/img/Onboard-icns_judge.svg';
import {uploadAndSetImage} from '../../utils/photoUpload.jsx';

export function JudgeRegistration() {
  const { updateData } = useContext(RegistrationContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState("");
  const [contact, setContact] = useState('');
  const [altContact, setAltContact] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [race, setRace] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadWithLoader = async (file) =>{
    setLoading(true);
    await uploadAndSetImage(file, setPhoto);
    setLoading(false);
  }

  const handleNext = (e) => {
    e.preventDefault();

    if(emailError){
      alert("Please correct email address before preceeding.");
      return;
    }

    updateData({
      title,
      firstName,
      lastName,
      email,
      contact,
      altContact,
      dob,
      gender,
      race,
      password,
      photo,
    });

    navigate("/auth/judgeRegistrationStep2");
  };

  // To check if the user already exists
  const checkUserExists = async (emailUser) =>{
    if(!emailUser){
      setEmailError("");
      return;
    }

    try{
      const response = await fetch("/api/user/check/user", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailUser }),
      });


      const data = await response.json();

      if(response.ok){
        if(data === true){
          setEmailError('This email address is already registered. Please use a different one or log in.');
        }
        else{
          setEmailError('');
        }
      }else{
        setEmailError('An error occurred while checking email. Please try again.');
      }
    }catch (error){
      console.error("Error checking email existance:", error);
    }
  }

  const handleEmailVerification = () => {
    checkUserExists(email);
  }

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  }


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
              Register Judge
            </Typography>
            
            <form onSubmit={handleNext} className="space-y-6">
              <Card className="border border-blue-100 shadow-none">
                <CardHeader className="bg-blue-800 p-4 rounded-t-lg">
                  <Typography variant="h5" className="text-white font-medium">
                    Personal Information
                  </Typography>
                </CardHeader>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Typography variant="small" className="text-blue-900 font-medium mb-2">
                        Title
                      </Typography>
                      <select
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border border-blue-200 rounded-lg focus:border-blue-800 focus:outline-none"
                      >
                        <option value="">Select title</option>
                        <option value="prof">Prof</option>
                        <option value="dr">Dr</option>
                        <option value="mr">Mr</option>
                        <option value="mrs">Mrs</option>
                        <option value="miss">Miss</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <Typography variant="small" className="text-blue-900 font-medium mb-2">
                        First Name
                      </Typography>
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        size="lg"
                        className="!border-blue-200 focus:!border-blue-800"
                        labelProps={{ className: "hidden" }}
                      />
                    </div>
                    
                    <div>
                      <Typography variant="small" className="text-blue-900 font-medium mb-2">
                        Last Name
                      </Typography>
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        size="lg"
                        className="!border-blue-200 focus:!border-blue-800"
                        labelProps={{ className: "hidden" }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Typography variant="small" className="text-blue-900 font-medium mb-2">
                        Email Address
                      </Typography>
                      <Input
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={handleEmailVerification}
                        size="lg"
                        className="!border-blue-200 focus:!border-blue-800"
                        labelProps={{ className: "hidden" }}
                      />
                    </div>
                    
                    <div>
                      <Typography variant="small" className="text-blue-900 font-medium mb-2">
                        Password
                      </Typography>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        size="lg"
                        className="!border-blue-200 focus:!border-blue-800"
                        labelProps={{ className: "hidden" }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Typography variant="small" className="text-blue-900 font-medium mb-2">
                        Contact
                      </Typography>
                      <Input
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        size="lg"
                        className="!border-blue-200 focus:!border-blue-800"
                        labelProps={{ className: "hidden" }}
                      />
                    </div>
                    
                    <div>
                      <Typography variant="small" className="text-blue-900 font-medium mb-2">
                        Alternative Contact
                      </Typography>
                      <Input
                        value={altContact}
                        onChange={(e) => setAltContact(e.target.value)}
                        size="lg"
                        className="!border-blue-200 focus:!border-blue-800"
                        labelProps={{ className: "hidden" }}
                      />
                    </div>
                    
                    <div>
                      <Typography variant="small" className="text-blue-900 font-medium mb-2">
                        Date of Birth
                      </Typography>
                      <Input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        size="lg"
                        className="!border-blue-200 focus:!border-blue-800"
                        labelProps={{ className: "hidden" }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Typography variant="small" className="text-blue-900 font-medium mb-2">
                        Gender
                      </Typography>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full p-3 border border-blue-200 rounded-lg focus:border-blue-800 focus:outline-none"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <Typography variant="small" className="text-blue-900 font-medium mb-2">
                        Race
                      </Typography>
                      <select
                        value={race}
                        onChange={(e) => setRace(e.target.value)}
                        className="w-full p-3 border border-blue-200 rounded-lg focus:border-blue-800 focus:outline-none"
                      >
                        <option value="">Select race</option>
                        <option value="black">Black</option>
                        <option value="coloured">Coloured</option>
                        <option value="indian">Indian</option>
                        <option value="white">White</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <Typography variant="small" className="text-blue-900 font-medium mb-2">
                        Profile Photo
                      </Typography>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            uploadWithLoader(file);
                          }
                        }}
                        className="w-full p-2 border border-blue-200 rounded-lg file:mr-4 file:py-1 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-800 hover:file:bg-blue-100"
                      />

                      {/* loader while uploading*/}

                      {loading && (
                        <div className="mt-2 text-sm text-blue-500 animate-pulse">
                          Uploading image...
                        </div>
                      )

                      }


                      {/** This part previews the image before being updated */}

                      {photo && !loading && (
                        <div className="mt-4">
                          <Typography variant="small" className="text-blue-900 mb-2 font-medium">
                            Image Preview
                          </Typography>
                          <img
                            src={photo}
                            alt="Preview"
                            className="rounded-lg shadow-md border border-blue-200 w-40 h-auto"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 pt-0 flex justify-center">
                  <Button type="submit" className="bg-blue-800 hover:bg-blue-900 w-full md:w-auto px-8">
                    Next Step
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

export default JudgeRegistration;
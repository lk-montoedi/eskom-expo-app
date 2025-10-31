import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";
const categories = [
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

const firstNames = [
  "Amahle", "Amelia", "Ava", "Chloe", "Ella", "Emily", "Grace", "Isabella",
  "Jessica", "Mia", "Olivia", "Sophia", "Zoe", "Aiden", "Caleb", "Daniel",
  "David", "Ethan", "Jacob", "James", "Jayden", "John", "Joseph", "Joshua",
  "Liam", "Logan", "Lucas", "Mason", "Matthew", "Michael", "Noah", "Oliver",
  "Ryan", "Samuel", "William", "Benjamin", "Elijah", "Gabriel", "Henry",
  "Isaac", "Jack", "Levi", "Luke", "Owen", "Thomas", "Wyatt", "Xavier",
  "Zachary", "Aaron", "Andries", "Hendrik", "Jacobus", "Johannes", "Petrus",
  "Anna", "Catharina", "Elizabeth", "Johanna", "Maria", "Susan", "Amo",
  "Andile", "Bongani", "Junior", "Siya", "Amina", "Iminathi", "Jabulile",
  "Kaya", "Lerato", "Bokamoso", "Mpho", "Neo", "Abigail", "Addison", "Alexandra",
  "Alice", "Allison", "Alyssa", "Andrea", "Angela", "Ariana", "Aubrey", "Audrey",
  "Austin", "Autumn", "Avery", "Bailey", "Brenda", "Brianna", "Brooke", "Brooklyn",
  "Cameron", "Camila", "Caroline", "Carson", "Charlotte", "Christian", "Claire",
  "Clara", "Cole", "Colin", "Connor", "Cooper", "Daisy", "Delilah", "Dominic",
  "Eleanor", "Eli", "Eliana", "Ellie", "Emilia", "Emma", "Eva", "Evelyn",
  "Faith", "Fatima", "Gabriella", "Gavin", "Genesis", "Gianna", "Giselle",
  "Hadley", "Hailey", "Hannah", "Harper", "Hazel", "Hudson", "Hunter", "Ian"
];

const lastNames = [
  "Smith", "Jones", "Williams", "Brown", "Wilson", "Taylor", "Johnson", "White",
  "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark",
  "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "King",
  "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez",
  "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips",
  "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez",
  "Morris", "Rogers", "Reed", "Cook", "Dlamini", "Nkosi", "Ndlovu", "Khumalo",
  "Sithole", "Buthelezi", "Gumede", "Mahlangu", "Mbatha", "Mkhize", "Mokoena",
  "Mthembu", "Ngcobo", "Zulu", "Botha", "Coetzee", "Fourie", "Jacobs", "Kruger",
  "Nel", "Venter", "Naidoo", "Govender", "Pillay", "Anderson", "Bailey", "Bell",
  "Bennett", "Brooks", "Bryant", "Butler", "Barnes", "Boyd", "Bradley", "Brewer",
  "Brock", "Burke", "Burns", "Burton", "Bush", "Byrd", "Cain", "Calderon",
  "Caldwell", "Cameron", "Cannon", "Carey", "Carlson", "Carpenter", "Carroll"
];

const projectNames = [
  "Smart Water Management System", "AI-Powered Traffic Control", "Automated Farming Solution",
  "Blockchain-Based Voting System", "Decentralized Social Media Platform", "E-commerce Recommendation Engine",
  "Fitness Tracking App", "Health Monitoring Wearable", "Language Learning Game", "Mental Wellness Chatbot",
  "Personalized News Aggregator", "Portfolio Optimization Tool", "Real-time Translation Device",
  "Secure File Sharing Network", "Smart Home Automation Hub", "Supply Chain Tracking System",
  "Task Management Dashboard", "Virtual Reality Classroom", "Weather Prediction Model",
  "Wildlife Conservation Drone", "Augmented Reality Navigation", "Carbon Footprint Calculator",
  "Crowdfunding Platform for Startups", "Disaster Recovery Drone Network", "DNA-based Data Storage",
  "Energy-Efficient Smart Grid", "Facial Recognition Security", "Food Waste Reduction App",
  "Gamified Coding Tutor", "Gesture-Controlled Interface", "IoT-based Inventory Management",
  "Machine Learning Art Generator", "Microplastic Filtration System", "Noise-Cancelling Window",
  "Peer-to-Peer Energy Trading", "Personalized Medicine Platform", "Plant-based Meat Synthesizer",
  "Predictive Maintenance for Machinery", "Quantum-Resistant Encryption", "Recycling Sorting Robot",
  "Remote Surgery Assistant", "Self-Healing Concrete", "Sign Language to Speech Converter",
  "Smart Parking System", "Soil Health Sensor", "Solar-Powered Desalination",
  "Speech-to-Text for Lectures", "Sustainable Packaging Material", "Traffic Congestion Predictor",
  "Voice-Activated Home Assistant", "AI-driven Personal Finance Advisor", "Automated Code Review Tool",
  "Biometric Authentication for Mobile Banking", "Chatbot for Customer Support", "Cloud-based Medical Records",
  "Collaborative Whiteboard for Remote Teams", "Cryptocurrency Price Predictor", "Cyberbullying Detection System",
  "Digital Twin for Manufacturing", "Drowsiness Detection for Drivers", "Dynamic Pricing for Ride-Sharing",
  "E-learning Platform with Adaptive Quizzes", "Fake News Detection using NLP", "Fire Detection using Drones",
  "Flood Prediction using Satellite Imagery", "Fraud Detection in Financial Transactions",
  "Garbage Segregation using Computer Vision", "Gene Editing using CRISPR", "Hate Speech Detection on Social Media",
  "Humanoid Robot for Elderly Care", "Intelligent Crop Recommendation System", "Inventory Management using RFID",
  "Landslide Prediction using IoT", "License Plate Recognition for Toll Booths", "Lithium-Ion Battery Recycling",
  "Malaria Detection using Machine Learning", "Medical Image Analysis for Disease Diagnosis",
  "Mood Detection using Facial Expressions", "Music Recommendation based on Emotion",
  "Natural Disaster Evacuation Planning", "Ocean Cleanup using Autonomous Robots",
  "Pest Control using Drones", "Phishing Website Detection", "Plant Disease Detection using Deep Learning",
  "Precision Agriculture using IoT", "Predictive Analytics for Retail Sales", "Real-time Air Quality Monitoring",
  "Real-time Stock Market Prediction", "Recommender System for Online Courses", "Renewable Energy Forecasting",
  "Sentiment Analysis of Customer Reviews", "Smart Agriculture using Drones", "Smart Grid for Efficient Power Distribution",
  "Smart Irrigation System using Soil Moisture Sensors", "Smart Waste Management using IoT",
  "Social Distancing Monitoring using Computer Vision", "Spam Email Detection", "Stock Price Prediction using LSTM",
  "Suicide Prevention Chatbot", "Suspicious Activity Detection in CCTV Footage", "Text Summarization using NLP",
  "Traffic Sign Recognition for Autonomous Vehicles", "Virtual Try-on for Fashion E-commerce",
  "Water Quality Monitoring using IoT", "Wildfire Prediction using Machine Learning"
];

const projectDescriptions = [
  "A system to monitor and control water usage in real-time.", "An AI that optimizes traffic flow in urban areas.",
  "A solution for automating crop monitoring and irrigation.", "A secure and transparent voting system using blockchain.",
  "A social media platform that gives users control over their data.", "An engine that suggests products to users based on their browsing history.",
  "An app for tracking workouts and setting fitness goals.", "A wearable device that monitors vital health signs.",
  "A game that makes learning a new language fun and interactive.", "A chatbot that provides mental health support and resources.",
  "An aggregator that curates news articles based on user preferences.", "A tool that helps users optimize their investment portfolios.",
  "A device that provides real-time translation of spoken languages.", "A network for sharing files securely and privately.",
  "A hub for controlling all smart home devices from a single interface.", "A system for tracking goods as they move through the supply chain.",
  "A dashboard for managing tasks and projects effectively.", "A virtual classroom that allows for immersive learning experiences.",
  "A model that predicts weather patterns with high accuracy.", "A drone that helps in monitoring and protecting wildlife.",
  "An app that overlays navigation directions onto the real world.", "A tool for calculating and tracking an individual's carbon footprint.",
  "A platform for startups to raise capital from a large number of people.", "A network of drones that can be deployed for disaster recovery.",
  "A method for storing large amounts of data in synthetic DNA.", "An intelligent system for managing power distribution in a city.",
  "A high-tech security system using facial recognition.", "An application to help reduce food wastage at home and in restaurants.",
  "An interactive and fun way to learn programming.", "Control your devices with simple hand gestures.",
  "Automate and track your inventory with IoT sensors.", "An AI that creates unique pieces of art.",
  "A system to filter out harmful microplastics from water.", "A window that actively cancels out external noise.",
  "A platform for individuals to trade self-generated energy.", "A medical platform that offers personalized treatment plans.",
  "A machine that synthesizes meat from plant-based ingredients.", "A system that predicts when machinery will require maintenance.",
  "An encryption method that is resistant to quantum computer attacks.", "A robot that automatically sorts recyclable materials.",
  "A robotic assistant for performing surgeries remotely.", "A type of concrete that can repair its own cracks.",
  "A device that converts sign language into spoken words.", "A system that helps drivers find available parking spots.",
  "A sensor that provides real-time data on soil health.", "A system that uses solar power to desalinate seawater.",
  "A tool that transcribes spoken lectures into text.", "A new material for packaging that is fully sustainable.",
  "A model that predicts traffic congestion in real-time.", "A home assistant that is controlled by voice commands.",
  "An AI-powered advisor for managing personal finances.", "A tool that automatically reviews code for errors and style.",
  "A secure mobile banking app using biometric authentication.", "A chatbot to handle customer service inquiries 24/7.",
  "A cloud-based system for storing and accessing medical records.", "A virtual whiteboard for remote team collaboration.",
  "A model that predicts the price of various cryptocurrencies.", "A system to detect and prevent cyberbullying on social media.",
  "A virtual replica of a manufacturing process for simulation.", "A system to detect driver drowsiness and prevent accidents.",
  "A dynamic pricing model for ride-sharing services.", "An e-learning platform with quizzes that adapt to the user's level.",
  "A system that uses NLP to detect and flag fake news.", "Using drones to detect fires in their early stages.",
  "A model that predicts floods using satellite imagery.", "A system to detect fraudulent financial transactions in real-time.",
  "Using computer vision to automatically segregate garbage.", "Using CRISPR technology for gene editing and research.",
  "A system to detect hate speech on social media platforms.", "A humanoid robot designed to assist the elderly with daily tasks.",
  "A system that recommends the best crops to plant based on data.", "Using RFID for efficient inventory management.",
  "An IoT-based system for predicting landslides.", "A system for automatically recognizing license plates at toll booths.",
  "A process for recycling lithium-ion batteries efficiently.", "Using machine learning to detect malaria in blood samples.",
  "Using AI to analyze medical images for disease diagnosis.", "A system that detects a person's mood from their facial expressions.",
  "A music recommendation system based on the user's emotion.", "A system for planning evacuation routes during natural disasters.",
  "Using autonomous robots to clean up the world's oceans.", "Using drones for targeted pest control in agriculture.",
  "A system to detect and block phishing websites.", "Using deep learning to detect diseases in plants.",
  "Using IoT for precision agriculture and crop management.", "Using predictive analytics to forecast retail sales.",
  "A real-time system for monitoring air quality in urban areas.", "A real-time model for predicting stock market trends.",
  "A recommender system for online courses and e-learning.", "A model for forecasting renewable energy generation.",
  "Using sentiment analysis to understand customer reviews.", "Using drones for smart agriculture and crop monitoring.",
  "A smart grid for efficient and reliable power distribution.", "A smart irrigation system using soil moisture sensors.",
  "An IoT-based system for smart waste management.", "Using computer vision to monitor social distancing in public places.",
  "A system for detecting and filtering spam emails.", "Using LSTM networks to predict stock prices.",
  "A chatbot designed to provide support for suicide prevention.", "A system to detect suspicious activity in CCTV footage.",
  "Using NLP to automatically summarize long texts.", "A system for recognizing traffic signs for autonomous vehicles.",
  "A virtual try-on feature for fashion e-commerce websites.", "An IoT-based system for monitoring water quality in real-time.",
  "A machine learning model for predicting wildfires."
];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function createEvent() {
  console.log("Creating a new event...");
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const eventRes = await axios.post(`${API_BASE_URL}/events`, {
      expoForum: "District",
      hostPlace: "Greenpoint",
      openingDate: today,
      closingDate: today,
      eventStartDate: today,
      eventCloseDate: today,
      eventStartTime: "08:00:00",
      eventEndTime: "20:00:00",
      region: "Greenpoint",
      venue: "Greenpoint Campus",
    });
    const eventId = eventRes.data.eventId;
    console.log(`Created event with ID: ${eventId}`);
    return eventId;
  } catch (e) {
    console.error(
      "Error creating event:",
      e.response ? e.response.data : e.message
    );
    throw new Error("Stopping script due to error.");
  }
}

async function createJudges(eventId) {
  const qualis = ["High School", "Diploma", "BSc", "BSc Hons", "MSc", "PhD"];
  const titles = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."];
  const races = ["Black", "Coloured", "Indian", "White"];

  console.log(`Creating 3 judges for each of the ${categories.length} categories...`);
  let judgeCount = 0;
  for (let i = 0; i < 1; i++) {
    const category = categories[i];
    let max = 3;
    if (category === "agricultural sciences") {
      max = 4;
    }
    for (let j = 0; j < max; j++) {
      const firstName = getRandomItem(firstNames);
      const lastName = getRandomItem(lastNames);
      const qualiIndex = Math.floor(Math.random() * qualis.length);
      const judgeData = {
        title: getRandomItem(titles),
        firstName: firstName,
        lastName: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        password: "password",
        contact: `1234567${judgeCount}`,
        altContact: `0987654${judgeCount}`,
        dob: "1980-01-01",
        gender: i % 2 === 0 ? "Female" : "Male",
        race: getRandomItem(races),
        institution: `University Of Colesburg ${judgeCount}`,
        qualification: qualis[qualiIndex],
        province: "Northern Cape",
        region: "Colesburg",
        years: `${Math.floor(Math.random() * 11)}`,
        expoForums: "District",
        judgeExperience: `${(i % 5) + 1}`,
        timesJudged: `${Math.floor(Math.random() * 5)}`,
        categories: [category, category],
        Role: "judge",
        photo: "",
        document: "",
      };
      try {
        const res = await axios.post(
          `${API_BASE_URL}/user/register/judge`,
          judgeData
        );
        const userId =
          res.data.result && res.data.result.userId
            ? res.data.result.userId
            : res.data.userId || res.data.id;

        await axios.post(`${API_BASE_URL}/student/join/event/${eventId}`, {
          userId,
        });
        await axios.post(`${API_BASE_URL}/attendance/check-in`, {
          judgeid: userId,
          eventid: eventId,
        });
        judgeCount++;
        process.stdout.write(`
Judge ${judgeCount}/${categories.length * 3} created for category "${category}" and checked in.`);
      } catch (error) {
        console.error(
          `
Error creating judge for category ${category}:`,
          error.response ? error.response.data : error.message
        );
        throw new Error("Stopping script due to error.");
      }
    }
  }
  console.log("\nFinished creating judges.");
}

async function createLearnersAndProjects(eventId) {
  const projectCounts = [7, 6, 5, 4];
  const races = ["Black", "Coloured", "Indian", "White"];

  console.log(`Creating a random number of learners and projects (4-7) for each of the ${categories.length} categories...`);
  let schoolId;
  try {
    console.log("\nCreating a new school...");
    const newSchool = await axios.post(`${API_BASE_URL}/schools`, {
      schoolname: "Colesburg High School",
      region: "Colesburg",
      district: "D1",
      province: "Northern Cape",
    });
    schoolId = newSchool.data.school.schoolid;
    console.log(`
Created new school with ID: ${schoolId}`);
  } catch (e) {
    console.error(
      "\nError getting/creating school:",
      e.response ? e.response.data : e.message
    );
    throw new Error("Stopping script due to error.");
  }

  let projectCount = 0;
  for (let i = 0; i < 1; i++) {
    const category = categories[i];
    const numProjects = 10;
    for (let j = 0; j < numProjects; j++) {
      try {
        const firstName = getRandomItem(firstNames);
        const lastName = getRandomItem(lastNames);
        const learnerUserData = {
          firstName: firstName,
          lastName: lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${category.replace(/\s/g, "")}${i}@example.com`,
          password: "password",
          contact: `2345678${projectCount}`,
          altContact: `9876543${projectCount}`,
          dob: "2008-01-01",
          gender: i % 2 === 0 ? "Female" : "Male",
          race: getRandomItem(races),
          disabilityType: "None",
          province: "Northern Cape",
          region: "Colesburg",
          schoolName: "Colesburg High School",
          grade: `${(i % 5) + 8}`,
          disabilityDescription: "",
          Role: "learner",
          photo: "",
        };
        const userRes = await axios.post(
          `${API_BASE_URL}/user/register/learner`,
          learnerUserData
        );
        const userId =
          userRes.data.result && userRes.data.result.userId
            ? userRes.data.result.userId
            : userRes.data.userId || userRes.data.id;
        await axios.post(`${API_BASE_URL}/student/join/event/${eventId}`, {
          userId,
        });

        const projectData = {
          schoolid: schoolId,
          learnerid: userId,
          projectname: getRandomItem(projectNames),
          description: getRandomItem(projectDescriptions),
          category: category,
          status: "Not Judged",
          badge: "None",
          ethicalstatus: "Pending",
          eventid: eventId,
          supportingdocument: "",
          timeregistered: new Date().toTimeString().slice(0, 8), // "HH:MM:SS"
        };
        await axios.post(`${API_BASE_URL}/projects/create/project`, projectData);
        projectCount++;
        process.stdout.write(`
Learner and Project ${projectCount} created for category "${category}".`);
      } catch (error) {
        console.error(
          `
Error creating learner/project for category ${category}:`,
          error.response ? error.response.data : error.message
        );
        throw new Error("Stopping script due to error.");
      }
    }
  }
  console.log("\nFinished creating learners and projects.");
}

async function createLearnerWithNoProject() {
  console.log("\nCreating a learner with no project...");
  try {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    const learnerUserData = {
      firstName: firstName,
      lastName: lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.lonely@example.com`,
      password: "password",
      contact: "111111111",
      altContact: "222222222",
      dob: "2009-01-01",
      gender: "Male",
      race: "Asian",
      disabilityType: "None",
      province: "Gauteng",
      region: "Pretoria",
      schoolName: "Pretoria High School",
      grade: "9",
      disabilityDescription: "",
      Role: "learner",
      photo: "",
    };
    await axios.post(
      `${API_BASE_URL}/user/register/learner`,
      learnerUserData
    );
    console.log("Successfully created a learner with no project.");
  } catch (error) {
    console.error(
      `\nError creating learner with no project:`,
      error.response ? error.response.data : error.message
    );
  }
}

async function createJudgeWithNoEvent() {
  console.log("\nCreating a judge with no event...");
  try {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    const judgeData = {
      title: "Prof.",
      firstName: firstName,
      lastName: lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.noevent@example.com`,
      password: "password",
      contact: "333333333",
      altContact: "444444444",
      dob: "1970-01-01",
      gender: "Female",
      race: "White",
      institution: "University of South Africa",
      qualification: "Diploma",
      province: "Gauteng",
      region: "Pretoria",
      years: "15",
      expoForums: "International",
      judgeExperience: "5",
      categories: [getRandomItem(categories)],
      Role: "judge",
      photo: "",
      document: "",
    };
    await axios.post(`${API_BASE_URL}/user/register/judge`, judgeData);
    console.log("Successfully created a judge with no event.");
  } catch (error) {
    console.error(
      `\nError creating judge with no event:`,
      error.response ? error.response.data : error.message
    );
  }
}

async function main() {
  try {
    const eventId = await createEvent();
    await createLearnersAndProjects(eventId);
    await createJudges(eventId);
    //await createLearnerWithNoProject();
    //await createJudgeWithNoEvent();
    console.log("\nData population script finished successfully!");
  } catch (e) {
    console.error("\nScript stopped due to an error.");
  }
}

main();

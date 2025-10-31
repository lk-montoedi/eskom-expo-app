import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Input,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import AddSchool from "./addSchool";
import UpdateSchool from "./updateSchool";
import DeleteSchool from "./deleteSchool";
import SchoolAdmin from "./schoolAdmin";
import SchoolTeacher from "./schoolTeacher";

export function Schools({ Role,Id }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const stateUserData = location.state?.userData;
    console.log("role123:",Role)

    if (stateUserData) {
      setUserData(stateUserData);
      console.log(userData)
      sessionStorage.setItem('userData', JSON.stringify(stateUserData));
    } else {
      const storedUserData = sessionStorage.getItem('userData');
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          navigate('/auth/sign-in');
        }
      } else {
        navigate('/auth/sign-in');
      }
    }
  }, [location.state, navigate]);

  

  return /*Role === 'admin' ?*/ (
    <SchoolAdmin Role={Role} />
  ) /*: (
    <SchoolTeacher Role={Role} teacherId={userData.userid || 44} />
  );*/
}


export default Schools;
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Spinner,
} from "@material-tailwind/react";

import bg from "../../assets/img/dashboard-bg-shape-1.jpg";
import { useConveners } from "@/context/convenerContext";

export const Appointments = () => {

   const {
    conveners,
    fetchConveners, 
    handleAddConvener, 
    loadingConveners,
    rejectAppointmentAndReallocate
  } = useConveners();

  const [events, setEvents] = useState([]);
  const [userData, setUserData] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);


  useEffect(() => {
    try {
      const storedUserData = sessionStorage.getItem("userData");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        fetch(`/api/conveners/user/${parsedUserData.userid}/events`)
          .then((res) => {
            if (!res.ok) {
              throw new Error('Network response was not ok');
            }
            return res.json();
          })
          .then((data) => setEvents(data.events || []))
          .catch((error) => console.error("Error fetching appointments:", error));
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  const handleReject = async (eventid) => {
        if (!userData) return;

        const confirm = window.confirm("Are you sure you want to reject this appointment?");
        if (!confirm) return;

        try{
          setRejectingId(eventid);

           await rejectAppointmentAndReallocate(userData.userid, eventid);

          // Update the local state to reflect the rejection
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.eventid === eventid ? { ...event, accepted: false } : event
            )
          );
          alert("Appointment rejected");

        } catch(error){
          console.error("Error rejecting appointment:", error);
          alert("An unexpected error occurred while rejecting the appointment.");
          return;

        } finally{
          setRejectingId(null);
        } 
       
    };

  return (
    <div className="p-4 min-h-screen bg-gray-200" style={{ backgroundImage: `url(${bg})` }}>
      
      <Card className="mb-6 mt-4">
        <CardHeader shadow={false} floated={false} className="mb-2">
          <Typography variant="h4" className="text-blue-800">
            Your Appointments
          </Typography>
        </CardHeader>
        <CardBody>
          <div className="max-h-[70vh] overflow-y-auto space-y-4 pr-2">
            {events.length > 0 ? (
              events.map((event) => (
                <Card key={event.eventid} className="border p-4 bg-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <Typography variant="h6" className="text-blue-700">
                        {event.name}
                      </Typography>
                      <Typography color="gray">
                        {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                      </Typography>
                       <Typography color="gray">
                        {event.accepted === true && <span className="text-green-500 font-bold"> Appointed</span>}
                        {event.accepted === false && <span className="text-red-500 font-bold"> Rejected</span>}
                        {event.accepted === null && <span className="text-green-500 font-bold"> Appointed</span>}
                      </Typography>
                    </div>
                    <div>
                      {event.accepted === null && (
                         <Button
                          color="red"
                          onClick={() => handleReject(event.eventid)}
                          disabled={rejectingId === event.eventid}
                          className="relative"
                        >
                          <span className={rejectingId === event.eventid ? 'invisible' : 'visible'}>
                            Reject Appointment
                          </span>
                          {rejectingId === event.eventid && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <Spinner className="h-4 w-4" />
                            </div>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Typography color="gray">
                You have not been appointed to any events.
              </Typography>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};



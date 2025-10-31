import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import { BellIcon } from "@heroicons/react/24/solid";
import { NotificationContext } from "@/context/notificationContext";
import axios from "axios";
import bg from "@/assets/img/dashboard-bg-shape-1.jpg";

export function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setHasNewNotifications } = useContext(NotificationContext);

  useEffect(() => {
    // Clear the notification dot when the page is visited
    setHasNewNotifications(false);

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `/api/notifications/${userId}`
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 min-h-screen bg-gray-200" style={{ backgroundImage: `url(${bg})` }}>
      <Card className="mb-6 mt-4">
        <CardHeader shadow={false} floated={false} className="mb-2 p-6">
          <Typography variant="h4" className="text-blue-800">
            Notifications
          </Typography>
        </CardHeader>
        <CardBody>
          <div className="max-h-[70vh] overflow-y-auto space-y-4 pr-2">
            {loading ? (
              <Typography color="gray">Loading notifications...</Typography>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <Card key={notification.id} className="border p-4 bg-white">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <BellIcon className="h-8 w-8 text-blue-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Typography variant="h6" className="text-blue-700">
                        {notification.message}
                      </Typography>
                      <Typography color="gray">
                        {formatDate(notification.date)}
                      </Typography>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Typography color="gray">
                You have no new notifications.
              </Typography>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Notifications;
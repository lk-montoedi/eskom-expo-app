import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { GiftIcon, LockClosedIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

// Import images
import flaskImg from "@/assets/img/flask.png";
import mugImg from "@/assets/img/mug.png";
import notebookImg from "@/assets/img/notebook.png";
import tieImg from "@/assets/img/tie.png";
import umbrellaImg from "@/assets/img/umbrella.png";
import watchImg from "@/assets/img/watch.png";

const rewardItems = [
  {
    "name": "Branded Coffee Mug",
    "apiName": "mug",
    "image": mugImg,
    "pointsRequired": 30,
    "description": "Perfect for your morning coffee or tea, featuring the company logo."
  },
  {
    "name": "Insulated Travel Flask",
    "apiName": "flask",
    "image": flaskImg,
    "pointsRequired": 50,
    "description": "Keep your favorite beverages hot or cold for hours while on the go."
  },
  {
    "name": "Executive Notebook Set",
    "apiName": "notebook",
    "image": notebookImg,
    "pointsRequired": 80,
    "description": "A stylish A5 notebook and matching pen for all your important notes."
  },
  {
    "name": "Silk Company Tie",
    "apiName": "tie",
    "image": tieImg,
    "pointsRequired": 120,
    "description": "Add a touch of professional elegance to your business attire."
  },
  {
    "name": "Compact Travel Umbrella",
    "apiName": "umbrella",
    "image": umbrellaImg,
    "pointsRequired": 200,
    "description": "Stay dry on rainy days with this durable, easy-to-carry umbrella."
  },
  {
    "name": "Classic Wristwatch",
    "apiName": "watch",
    "image": watchImg,
    "pointsRequired": 500,
    "description": "A timeless and elegant timepiece suitable for any occasion."
  }
];

export function Rewards() {
  const [judgeProfile, setJudgeProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimedItems, setClaimedItems] = useState([]);
  const [isRedeeming, setIsRedeeming] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const fetchInitialData = async () => {
      try {
        const [profileRes, claimsRes] = await Promise.all([
          fetch(`/api/user/profile/${userId}`),
          fetch(`/api/claims/judge/${userId}`)
        ]);

        if (!profileRes.ok) throw new Error("Failed to fetch judge profile.");
        const profileData = await profileRes.json();
        setJudgeProfile(profileData.profile);

        if (!claimsRes.ok) throw new Error("Failed to fetch claims.");
        const claimsData = await claimsRes.json();
        const claimedItemNames = claimsData.claims.map(claim => claim.item);
        setClaimedItems(claimedItemNames);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleRedeem = async (item) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in to claim a reward.");
      return;
    }

    if (userPoints < item.pointsRequired) {
      alert("You do not have enough points to redeem this item.");
      return;
    }

    setIsRedeeming(item.apiName);

    try {
      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId, item: item.apiName }),
      });

      if (!response.ok) {
        throw new Error('Failed to create claim.');
      }

      const newClaim = await response.json();

      setClaimedItems(prev => [...prev, newClaim.claim.item]);
      setJudgeProfile(prev => ({
          ...prev,
          points: prev.points - item.pointsRequired
      }));

    } catch (error) {
      console.error("Error redeeming item:", error);
      alert("An error occurred while trying to claim the item.");
    } finally {
      setIsRedeeming(null);
    }
  };

  const userPoints = judgeProfile?.points ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-200/40 shadow-xl shadow-indigo-100/30">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <GiftIcon className="w-6 h-6" />
              Claim Your Gift
            </h2>
            <p className="text-blue-100 mt-2 text-sm">Gain points at an expo to unlock gifts that you can claim at your next event.</p>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center">
                <Spinner className="h-12 w-12" />
              </div>
            ) : error ? (
              <Typography color="red">{error}</Typography>
            ) : (
              <div>
                <Typography variant="h5" color="blue-gray">
                  You Earned: {userPoints} expos
                </Typography>
              </div>
            )}
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-2xl shadow-indigo-100/40 rounded-2xl overflow-hidden">
          <CardBody className="overflow-x-auto px-0 pt-0 pb-8">
            <div className="w-full min-w-[640px]">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-indigo-100">
                    <th className="py-6 px-6 text-left text-indigo-700 text-sm font-bold uppercase tracking-wide">Item</th>
                    <th className="py-6 px-6 text-left text-indigo-700 text-sm font-bold uppercase tracking-wide">Description</th>
                    <th className="py-6 px-6 text-left text-indigo-700 text-sm font-bold uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rewardItems.map((item, index) => {
                    const isClaimed = claimedItems.includes(item.apiName);
                    return (
                      <tr key={item.name} className={`hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 border-b border-indigo-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td className="py-6 px-6">
                          <div className="flex items-center gap-4">
                            <img src={item.image} alt={item.name} className="h-16 w-16 object-contain rounded-lg" />
                            <Typography variant="h6" color="blue-gray" className="font-semibold">
                              {item.name}
                            </Typography>
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <Typography className="text-sm font-normal text-gray-700">
                            {item.description}
                          </Typography>
                        </td>
                        <td className="py-6 px-6">
                          {isClaimed ? (
                            <div className="flex items-center gap-2">
                              <CheckCircleIcon className="h-8 w-8 text-green-500" />
                              <Typography color="green" className="font-bold text-xl">Claimed</Typography>
                            </div>
                          ) : userPoints >= item.pointsRequired ? (
                            <Button
                              color="green"
                              className="flex items-center gap-2"
                              onClick={() => handleRedeem(item)}
                              disabled={isRedeeming === item.apiName}
                              size="lg"
                            >
                              {isRedeeming === item.apiName ? (
                                <Spinner className="h-6 w-6" />
                              ) : (
                                <>
                                  <GiftIcon className="h-6 w-6" />
                                  Redeem
                                </> 
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="gradient"
                              color="blue-gray"
                              disabled
                              className="flex items-center gap-2"
                              size="lg"
                            >
                              <LockClosedIcon className="h-6 w-6" />
                              Unlock at {item.pointsRequired}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Rewards;